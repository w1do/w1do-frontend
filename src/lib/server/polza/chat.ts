import { POLZA_AI_API_KEY, POLZA_AI_MODEL } from "astro:env/server";

const BASE_URL = "https://polza.ai/api/v1";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_TOKENS = 700;
const TEMPERATURE = 0.3;

export interface PolzaMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface PolzaOptions {
    model?: string;
    timeoutMs?: number;
    maxTokens?: number;
    signal?: AbortSignal;
    jsonSchema?: {
        name: string;
        strict: true;
        schema: Record<string, unknown>;
    };
}

export type PolzaFailure = "config" | "auth" | "balance" | "rate_limited" | "timeout" | "network" | "upstream" | "empty";

export type PolzaResult = { ok: true; content: string } | { ok: false; reason: PolzaFailure };

const statusToFailure = (status: number): PolzaFailure => {
    if (status === 401 || status === 403) return "auth";
    if (status === 402) return "balance";
    if (status === 429) return "rate_limited";
    return "upstream";
};

export async function createPolzaCompletion(messages: PolzaMessage[], options: PolzaOptions = {}): Promise<PolzaResult> {
    const logTag = options.jsonSchema ? "[lead-format]" : "[chat]";
    if (options.signal?.aborted) return { ok: false, reason: "network" };
    if (!POLZA_AI_API_KEY) {
        console.error(`${logTag} POLZA_AI_API_KEY is not set`);
        return { ok: false, reason: "config" };
    }

    let response: Response;
    const timeout = AbortSignal.timeout(options.timeoutMs ?? REQUEST_TIMEOUT_MS);
    const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;

    try {
        response = await fetch(`${BASE_URL}/chat/completions`, {
            method: "POST",
            redirect: "error",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${POLZA_AI_API_KEY}`,
            },
            body: JSON.stringify({
                model: options.model ?? POLZA_AI_MODEL.trim(),
                messages,
                ...(!options.jsonSchema && { temperature: TEMPERATURE }),
                max_tokens: options.maxTokens ?? MAX_TOKENS,
                stream: false,
                ...(options.jsonSchema && {
                    response_format: { type: "json_schema", json_schema: options.jsonSchema },
                    provider: { require_parameters: true },
                }),
            }),
            signal,
        });
    } catch (error) {
        if (options.signal?.aborted) return { ok: false, reason: "network" };
        if (error instanceof Error && error.name === "TimeoutError") {
            console.error(`${logTag} PolzaAI request timed out`);
            return { ok: false, reason: "timeout" };
        }
        console.error(`${logTag} PolzaAI request failed:`, error instanceof Error ? error.name : "unknown");
        return { ok: false, reason: "network" };
    }

    const data: any = await response.json().catch(() => null);
    if (options.signal?.aborted) return { ok: false, reason: "network" };

    if (!response.ok) {
        console.error(
            `${logTag} PolzaAI rejected the request: status=${response.status}`,
            `code=${data?.error?.code ?? "unknown"}`,
        );
        return { ok: false, reason: statusToFailure(response.status) };
    }

    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
        console.error(`${logTag} PolzaAI returned an empty answer`);
        return { ok: false, reason: "empty" };
    }

    return { ok: true, content: content.trim() };
}
