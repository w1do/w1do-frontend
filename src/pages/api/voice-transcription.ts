import type { APIRoute } from "astro";
import { TRUSTED_PROXY_HOPS } from "astro:env/server";
import { Buffer } from "node:buffer";
import { checkVoiceLimit, clientKeyFrom } from "../../lib/server/chat/rate-limit";
import { readBoundedBody } from "../../lib/server/leads/read-request-body";
import { isSameOriginRequest } from "../../lib/server/leads/request-origin";
import { formatLeadDescription } from "../../lib/server/polza/lead";
import { transcribeVoice } from "../../lib/server/polza/transcription";

export const prerender = false;

const MAX_AUDIO_BYTES = 3 * 1024 * 1024;
const WAV_SAMPLE_RATE = 16_000;
const WAV_BYTES_PER_SAMPLE = 2;
const MAX_PCM_BYTES = WAV_SAMPLE_RATE * WAV_BYTES_PER_SAMPLE * 90;
const MAX_IN_FLIGHT = 8;

let inFlight = 0;

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

const fail = (status: number, message: string, headers?: Record<string, string>) =>
    json({ ok: false, message }, status, headers);

function isPcmFormat(audio: Buffer, offset: number, size: number): boolean {
    return size === 16
        && audio.readUInt16LE(offset) === 1
        && audio.readUInt16LE(offset + 2) === 1
        && audio.readUInt32LE(offset + 4) === WAV_SAMPLE_RATE
        && audio.readUInt32LE(offset + 8) === WAV_SAMPLE_RATE * WAV_BYTES_PER_SAMPLE
        && audio.readUInt16LE(offset + 12) === WAV_BYTES_PER_SAMPLE
        && audio.readUInt16LE(offset + 14) === 16;
}

function normalizeWav(audio: Buffer): Buffer | "invalid" | "too-long" {
    if (audio.length < 44 || audio.toString("latin1", 0, 4) !== "RIFF"
        || audio.readUInt32LE(4) !== audio.length - 8 || audio.toString("latin1", 8, 12) !== "WAVE") return "invalid";

    let format: Buffer | undefined;
    let data: Buffer | undefined;
    for (let offset = 12; offset < audio.length;) {
        const start = offset + 8;
        if (start > audio.length) return "invalid";
        const size = audio.readUInt32LE(offset + 4);
        const end = start + size;
        const next = end + (size % 2);
        if (next > audio.length || (end !== next && audio[end] !== 0)) return "invalid";

        const type = audio.toString("latin1", offset, offset + 4);
        if (type === "fmt ") {
            if (format || !isPcmFormat(audio, start, size)) return "invalid";
            format = audio.subarray(offset, end);
        } else if (type === "data") {
            if (!format || data || !size || size % WAV_BYTES_PER_SAMPLE !== 0) return "invalid";
            data = audio.subarray(offset, end);
        } else if (type !== "LIST" || size < 4 || audio.toString("latin1", start, start + 4) !== "INFO") {
            return "invalid";
        }
        offset = next;
    }

    if (!format || !data) return "invalid";
    if (data.length - 8 > MAX_PCM_BYTES) return "too-long";
    if (audio.length === 12 + format.length + data.length) return audio;

    // Strip LIST metadata so Polza receives only the validated PCM format and samples.
    const normalized = Buffer.concat([audio.subarray(0, 12), format, data]);
    normalized.writeUInt32LE(normalized.length - 8, 4);
    return normalized;
}

export const POST: APIRoute = async (context) => {
    const { request, url, site } = context;
    if (!isSameOriginRequest(request, url, site)) {
        return fail(403, "Голосовой ввод доступен с этой страницы сайта.");
    }
    if (request.headers.get("x-voice-consent") !== "1") {
        return fail(400, "Подтвердите обработку аудиозаписи для расшифровки.");
    }

    const mimeType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
    if (mimeType !== "audio/wav") return fail(415, "Этот формат записи не поддерживается. Введите текст вручную.");

    if (inFlight >= MAX_IN_FLIGHT) {
        return fail(503, "Расшифровка сейчас занята. Попробуйте ещё раз через несколько секунд.", { "Retry-After": "5" });
    }

    inFlight += 1;
    try {
        const audio = await readBoundedBody(request, MAX_AUDIO_BYTES);
        if (audio === "too-large") return fail(413, "Запись слишком большая. Попробуйте записать короче.");
        if (audio === "unreadable" || !audio.length) return fail(400, "Не удалось прочитать запись. Попробуйте записать ещё раз.");
        const wav = normalizeWav(audio);
        if (wav === "too-long") return fail(413, "Запись превышает 90 секунд. Попробуйте записать короче.");
        if (wav === "invalid") return fail(415, "Формат записи не распознан. Попробуйте записать ещё раз.");

        let address: string | undefined;
        try { address = context.clientAddress; } catch { address = undefined; }
        const limit = checkVoiceLimit(clientKeyFrom(request, address, TRUSTED_PROXY_HOPS));
        if (!limit.allowed) {
            const seconds = limit.retryAfterSeconds;
            const wait = seconds < 60 ? `${seconds} сек.` : `${Math.ceil(seconds / 60)} мин.`;
            return fail(429, `Слишком много записей подряд. Повторите через ${wait} или введите текст вручную.`, {
                "Retry-After": String(seconds),
            });
        }

        const result = await transcribeVoice(wav, request.signal);
        if (result.ok) {
            const draft = await formatLeadDescription(result.text, "", undefined, request.signal);
            return json({ ok: true, text: draft ?? result.text, formatted: draft !== null }, 200);
        }
        if (result.reason === "empty") return fail(422, "Не удалось различить речь. Попробуйте записать ещё раз.");
        if (result.reason === "timeout") return fail(504, "Расшифровка заняла слишком много времени. Попробуйте ещё раз.");
        return fail(503, "Расшифровка временно недоступна. Можно ввести текст вручную.");
    } finally {
        inFlight -= 1;
    }
};
