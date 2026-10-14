import test from "node:test";
import assert from "node:assert/strict";
import {
    acceptConsent, acquireLock, CHAT_STATE_MAX_AGE_MS, CONSENT_REQUEST_MAX_AGE_MS, emptyChatState, isConsentValid,
    loadState, markConsentRequested, parseChatState, redactAfterLead, releaseLock, saveState, stateKey, type ChatKv,
} from "../src/lib/server/chat/chat-state.ts";

const VERSION = "chat-consent-test";
const MINUTE = 60_000;

interface Entry { value: string; expireAtMs: number | null }

// In-memory ChatKv with an explicit clock, so expiry and TTL can be tested without waiting.
function memoryKv(clock: { now: number }) {
    const entries = new Map<string, Entry>();
    const alive = (key: string): Entry | undefined => {
        const entry = entries.get(key);
        if (!entry) return undefined;
        if (entry.expireAtMs !== null && clock.now >= entry.expireAtMs) {
            entries.delete(key);
            return undefined;
        }
        return entry;
    };
    const kv: ChatKv = {
        async get(key) {
            return alive(key)?.value ?? null;
        },
        async setExpireAt(key, value, expireAtSeconds) {
            entries.set(key, { value, expireAtMs: expireAtSeconds * 1000 });
        },
        async setIfAbsent(key, value, ttlMs) {
            if (alive(key)) return false;
            entries.set(key, { value, expireAtMs: clock.now + ttlMs });
            return true;
        },
        async del(key) {
            entries.delete(key);
        },
        async delIfEquals(key, value) {
            if (alive(key)?.value === value) entries.delete(key);
        },
    };
    return { kv, entries };
}

test("lock: second holder is refused, only the owner token releases it", async () => {
    const clock = { now: 0 };
    const { kv } = memoryKv(clock);
    assert.equal(await acquireLock(kv, "id", "a"), true);
    assert.equal(await acquireLock(kv, "id", "b"), false);
    await releaseLock(kv, "id", "b");
    assert.equal(await acquireLock(kv, "id", "c"), false);
    await releaseLock(kv, "id", "a");
    assert.equal(await acquireLock(kv, "id", "c"), true);
});

test("expiry is absolute: a later save does not extend the 24 h limit", async () => {
    const clock = { now: 1_000_000_000_000 };
    const { kv, entries } = memoryKv(clock);
    const state = emptyChatState(clock.now);
    clock.now += 3_600_000;
    await saveState(kv, "id", state, clock.now);
    const entry = entries.get(stateKey("id"));
    assert.equal(entry?.expireAtMs, Math.floor((state.createdAt + CHAT_STATE_MAX_AGE_MS) / 1000) * 1000);
});

test("a state older than 24 hours is read as empty", () => {
    const now = 2_000_000_000_000;
    const old = { ...emptyChatState(now - CHAT_STATE_MAX_AGE_MS - 1), messages: [{ role: "user", content: "hi" }] };
    const parsed = parseChatState(JSON.stringify(old), now);
    assert.equal(parsed.createdAt, now);
    assert.equal(parsed.messages.length, 0);
});

test("loadState deletes an expired record on read", async () => {
    const clock = { now: 2_000_000_000_000 };
    const { kv, entries } = memoryKv(clock);
    const old = emptyChatState(clock.now - CHAT_STATE_MAX_AGE_MS - 1);
    entries.set(stateKey("id"), { value: JSON.stringify(old), expireAtMs: null });
    const state = await loadState(kv, "id", clock.now);
    assert.equal(state.createdAt, clock.now);
    assert.equal(entries.has(stateKey("id")), false);
});

test("redactAfterLead erases history and draft and keeps the sent flag", () => {
    const state = emptyChatState(0);
    state.messages = [{ role: "user", content: "Анна, 89123456789" }];
    state.leadDraft = { name: "Анна", phone: "89123456789", email: "", summary: "Нужен ИИ-агент для клиентов." };
    redactAfterLead(state);
    assert.deepEqual(state.messages, []);
    assert.equal(state.leadDraft, null);
    assert.equal(state.leadSent, true);
});

test("acceptConsent without a recent consent request is refused", () => {
    const state = emptyChatState(0);
    assert.equal(acceptConsent(state, 10 * MINUTE, VERSION), false);
    assert.equal(state.consentAcceptedAt, null);
});

test("acceptConsent 10 minutes after the request is accepted and stores the version", () => {
    const state = emptyChatState(0);
    markConsentRequested(state, 0, VERSION);
    assert.equal(acceptConsent(state, 10 * MINUTE, VERSION), true);
    assert.equal(state.consentVersion, VERSION);
    assert.notEqual(state.consentAcceptedAt, null);
});

test("acceptConsent 31 minutes after the request is refused", () => {
    const state = emptyChatState(0);
    markConsentRequested(state, 0, VERSION);
    assert.equal(acceptConsent(state, CONSENT_REQUEST_MAX_AGE_MS + MINUTE, VERSION), false);
    assert.equal(state.consentAcceptedAt, null);
});

test("a repeated acceptConsent does not overwrite the stored consent time", () => {
    const state = emptyChatState(0);
    markConsentRequested(state, 0, VERSION);
    acceptConsent(state, 1 * MINUTE, VERSION);
    const first = state.consentAcceptedAt;
    assert.equal(acceptConsent(state, 5 * MINUTE, VERSION), true);
    assert.equal(state.consentAcceptedAt, first);
});

test("consent with another text version is not valid", () => {
    const state = emptyChatState(0);
    markConsentRequested(state, 0, VERSION);
    acceptConsent(state, 1 * MINUTE, VERSION);
    assert.equal(isConsentValid(state, 2 * MINUTE, VERSION), true);
    assert.equal(isConsentValid(state, 2 * MINUTE, "chat-consent-other"), false);
});
