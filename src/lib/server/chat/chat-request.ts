import {
    CHAT_ID_PATTERN, CHAT_MAX_BODY_CHARS, CHAT_MAX_USER_CHARS, type ChatSource,
} from "../../chat";

export const INVALID_REQUEST = "Некорректный запрос.";
export const TOO_LONG = `Сообщение слишком длинное: до ${CHAT_MAX_USER_CHARS} символов.`;

// UTF-8 uses at most 4 bytes per character, so this cap never rejects a body that fits CHAT_MAX_BODY_CHARS.
const MAX_BODY_BYTES = CHAT_MAX_BODY_CHARS * 4;

const CHAT_SOURCES: readonly ChatSource[] = ["chat-page", "chat-widget", "chat-popup"];

const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "page", "referrer"];

export interface LeadRequestContext {
    source: ChatSource;
    attribution: Record<string, string>;
    honeypot: string;
}

// Returns null when the body is larger than MAX_BODY_BYTES. The stream is read chunk by chunk
// and cancelled as soon as the running total passes the cap, so an oversized body is never buffered.
export async function readBoundedText(request: Request): Promise<string | null> {
    const declared = request.headers.get("content-length");
    if (declared !== null && Number(declared) > MAX_BODY_BYTES) return null;
    if (!request.body) return "";

    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let total = 0;
    let text = "";

    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > MAX_BODY_BYTES) {
            await reader.cancel();
            return null;
        }
        text += decoder.decode(value, { stream: true });
    }

    return text + decoder.decode();
}

export function readChatId(body: any): string | null {
    if (typeof body?.chatId !== "string") return null;
    const lower = body.chatId.toLowerCase();
    return CHAT_ID_PATTERN.test(lower) ? lower : null;
}

export function readUserMessage(body: any): { ok: true; content: string } | { ok: false; message: string } {
    if (typeof body?.message !== "string") return { ok: false, message: INVALID_REQUEST };
    const content = body.message.trim();
    if (!content) return { ok: false, message: INVALID_REQUEST };
    if (content.length > CHAT_MAX_USER_CHARS) return { ok: false, message: TOO_LONG };
    return { ok: true, content };
}

export function readLeadRequestContext(body: any): LeadRequestContext {
    const attribution: Record<string, string> = {};
    for (const key of ATTRIBUTION_KEYS) {
        const value = body?.attribution?.[key];
        if (typeof value !== "string") continue;
        const trimmed = value.trim();
        if (trimmed.length >= 1 && trimmed.length <= 500) attribution[key] = trimmed;
    }

    return {
        source: CHAT_SOURCES.includes(body?.source) ? body.source : "chat-page",
        attribution,
        honeypot: typeof body?.max === "string" ? body.max.trim() : "",
    };
}
