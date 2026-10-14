import { POLZA_AI_API_KEY, POLZA_AI_MODEL } from "astro:env/server";

const BASE_URL = "https://polza.ai/api/v1";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_TOKENS = 700;
const TEMPERATURE = 0.3;

export interface PolzaMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export type PolzaFailure = "config" | "auth" | "balance" | "rate_limited" | "timeout" | "network" | "upstream" | "empty";

export type PolzaResult = { ok: true; content: string } | { ok: false; reason: PolzaFailure };

const statusToFailure = (status: number): PolzaFailure => {
    if (status === 401 || status === 403) return "auth";
    if (status === 402) return "balance";
    if (status === 429) return "rate_limited";
    return "upstream";
};

export async function createPolzaCompletion(messages: PolzaMessage[]): Promise<PolzaResult> {
    if (!POLZA_AI_API_KEY) {
        console.error("[chat] POLZA_AI_API_KEY is not set — the chat is disabled.");
        return { ok: false, reason: "config" };
    }

    let response: Response;

    try {
        response = await fetch(`${BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${POLZA_AI_API_KEY}`,
            },
            body: JSON.stringify({
                model: POLZA_AI_MODEL.trim(),
                messages,
                temperature: TEMPERATURE,
                max_tokens: MAX_TOKENS,
                stream: false,
            }),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (error) {
        if (error instanceof Error && error.name === "TimeoutError") {
            console.error("[chat] PolzaAI request timed out");
            return { ok: false, reason: "timeout" };
        }
        console.error("[chat] PolzaAI request failed:", error instanceof Error ? error.name : "unknown");
        return { ok: false, reason: "network" };
    }

    const data: any = await response.json().catch(() => null);

    if (!response.ok) {
        console.error(
            `[chat] PolzaAI rejected the request: status=${response.status}`,
            `code=${data?.error?.code ?? "unknown"}`,
        );
        return { ok: false, reason: statusToFailure(response.status) };
    }

    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
        console.error("[chat] PolzaAI returned an empty answer");
        return { ok: false, reason: "empty" };
    }

    return { ok: true, content: content.trim() };
}
