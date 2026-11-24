import { POLZA_AI_API_KEY } from "astro:env/server";
import { Buffer } from "node:buffer";

const ENDPOINT = "https://polza.ai/api/v1/audio/transcriptions";
const MODEL = "openai/whisper-1";
const TIMEOUT_MS = 25_000;
const MAX_TEXT_CHARS = 8000;

type TranscriptionResult =
    | { ok: true; text: string }
    | { ok: false; reason: "unavailable" | "timeout" | "empty" };

export async function transcribeVoice(
    audio: Buffer,
    signal: AbortSignal,
): Promise<TranscriptionResult> {
    if (!POLZA_AI_API_KEY || signal.aborted) return { ok: false, reason: "unavailable" };

    const timeout = AbortSignal.timeout(TIMEOUT_MS);
    try {
        const response = await fetch(ENDPOINT, {
            method: "POST",
            redirect: "error",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${POLZA_AI_API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                file: `data:audio/wav;base64,${audio.toString("base64")}`,
                response_format: "json",
            }),
            signal: AbortSignal.any([signal, timeout]),
        });

        if (!response.ok) {
            await response.body?.cancel();
            console.error(`[voice] Polza AI request rejected: status=${response.status}`);
            return { ok: false, reason: "unavailable" };
        }

        const result = await response.json() as { text?: unknown } | null;
        const text = typeof result?.text === "string" ? result.text.trim() : "";
        if (!text) return { ok: false, reason: "empty" };
        if (text.length > MAX_TEXT_CHARS) return { ok: false, reason: "unavailable" };

        return { ok: true, text };
    } catch {
        return { ok: false, reason: timeout.aborted ? "timeout" : "unavailable" };
    }
}
