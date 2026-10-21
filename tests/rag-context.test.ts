import test from "node:test";
import assert from "node:assert/strict";
import { RAG_MAX_CHARS, requestRagContext, type FetchLike } from "../src/lib/server/rag/rag-client.ts";
import { buildRagQuery, RAG_QUERY_MAX_CHARS } from "../src/lib/server/rag/query.ts";

const CONFIG = { apiUrl: "https://rag.example.test/api/v1/", apiKey: "test-key", projectId: "project-uuid" };

const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function captureErrors(t: { mock: { method: Function } }): string[] {
    const logged: string[] = [];
    t.mock.method(console, "error", (...args: unknown[]) => {
        logged.push(args.map(String).join(" "));
    });
    return logged;
}

test("successful response returns context and sources", async (t) => {
    captureErrors(t);
    const calls: { url: string; init: RequestInit }[] = [];
    const fetchImpl: FetchLike = async (url, init) => {
        calls.push({ url, init });
        return jsonResponse({
            context: "  [1] Тарифы (v1, score 0.03)\nТариф Про — 50 000 ₽  ",
            sources: [{ source_id: "s1", title: "Тарифы", version: 1 }],
            warning: null,
        });
    };

    const result = await requestRagContext("Сколько стоит тариф Про?", CONFIG, fetchImpl);

    assert.deepEqual(result, {
        ok: true,
        context: "[1] Тарифы (v1, score 0.03)\nТариф Про — 50 000 ₽",
        sources: [{ source_id: "s1", title: "Тарифы", version: 1 }],
    });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://rag.example.test/api/v1/context");
    assert.equal(calls[0].init.method, "POST");
    assert.equal((calls[0].init.headers as Record<string, string>)["X-Api-Key"], "test-key");
    assert.ok(calls[0].init.signal instanceof AbortSignal);
    assert.deepEqual(JSON.parse(String(calls[0].init.body)), {
        project_id: "project-uuid",
        query: "Сколько стоит тариф Про?",
        max_chars: RAG_MAX_CHARS,
    });
    assert.equal(RAG_MAX_CHARS, 4000);
});

test("403 maps to auth and the key and url are not logged", async (t) => {
    const logged = captureErrors(t);
    const fetchImpl: FetchLike = async () => jsonResponse({ detail: { code: "forbidden" } }, 403);

    const result = await requestRagContext("вопрос", CONFIG, fetchImpl);

    assert.deepEqual(result, { ok: false, reason: "auth" });
    assert.equal(logged.length, 1);
    assert.match(logged[0], /status=403/);
    assert.equal(logged.some((line) => line.includes("test-key") || line.includes("rag.example.test")), false);
});

test("5xx maps to upstream", async (t) => {
    captureErrors(t);
    const fetchImpl: FetchLike = async () => new Response("oops", { status: 502 });

    assert.deepEqual(await requestRagContext("вопрос", CONFIG, fetchImpl), { ok: false, reason: "upstream" });
});

test("timeout maps to timeout and is logged", async (t) => {
    const logged = captureErrors(t);
    const fetchImpl: FetchLike = (_url, init) =>
        new Promise((_resolve, reject) => {
            init.signal?.addEventListener("abort", () => reject(init.signal?.reason));
        });

    const result = await requestRagContext("вопрос", CONFIG, fetchImpl, 20);

    assert.deepEqual(result, { ok: false, reason: "timeout" });
    assert.deepEqual(logged, ["[chat] RAG request timed out"]);
});

test("network error maps to network", async (t) => {
    captureErrors(t);
    const fetchImpl: FetchLike = async () => {
        throw new TypeError("fetch failed");
    };

    assert.deepEqual(await requestRagContext("вопрос", CONFIG, fetchImpl), { ok: false, reason: "network" });
});

test("missing config returns config without calling fetch", async (t) => {
    captureErrors(t);
    let called = false;
    const fetchImpl: FetchLike = async () => {
        called = true;
        return jsonResponse({ context: "" });
    };

    for (const config of [{}, { ...CONFIG, apiKey: "" }, { ...CONFIG, projectId: " " }, { ...CONFIG, apiUrl: undefined }]) {
        assert.deepEqual(await requestRagContext("вопрос", config, fetchImpl), { ok: false, reason: "config" });
    }
    assert.equal(called, false);
});

test("buildRagQuery uses the last visitor message when it is long enough", () => {
    const query = buildRagQuery([
        { role: "user", content: "Привет" },
        { role: "assistant", content: "Здравствуйте! Чем помочь?" },
        { role: "user", content: "Расскажите подробно про разработку RAG-агентов для бизнеса" },
    ]);
    assert.equal(query, "Расскажите подробно про разработку RAG-агентов для бизнеса");
});

test("buildRagQuery prepends the previous visitor message to a short follow-up", () => {
    const query = buildRagQuery([
        { role: "user", content: "Расскажите про RAG-агентов" },
        { role: "assistant", content: "RAG-агент отвечает по вашей базе знаний." },
        { role: "user", content: "а сколько стоит?" },
    ]);
    assert.equal(query, "Расскажите про RAG-агентов а сколько стоит?");
    assert.equal(query.includes("базе знаний"), false);
});

test("buildRagQuery keeps a short first message as is and truncates to the limit", () => {
    assert.equal(buildRagQuery([{ role: "user", content: "привет" }]), "привет");
    assert.equal(buildRagQuery([{ role: "user", content: "а".repeat(3000) }]).length, RAG_QUERY_MAX_CHARS);
});
