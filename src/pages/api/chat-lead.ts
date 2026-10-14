import type { APIRoute } from "astro";
import { TRUSTED_PROXY_HOPS } from "astro:env/server";
import {
    CHAT_BUSY_MESSAGE, CHAT_CONSENT_VERSION, CHAT_LEAD_MESSAGES, CHAT_LEAD_SUMMARY_MAX, CHAT_LEAD_SUMMARY_MIN,
    CHAT_MAX_BODY_CHARS, type ChatLeadNotice,
} from "../../lib/chat";
import { checkRateLimit, clientKeyFrom } from "../../lib/server/chat/rate-limit";
import { readBoundedText, readChatId, readLeadRequestContext, INVALID_REQUEST } from "../../lib/server/chat/chat-request";
import {
    acquireLock, isConsentValid, loadState, redactAfterLead, releaseLock, saveState, stateKey, type ChatKv,
} from "../../lib/server/chat/chat-state";
import { submitChatLead } from "../../lib/server/chat/chat-lead";
import { normalizeSummary } from "../../lib/server/chat/lead-directives";
import { getChatKv, RedisUnavailableError } from "../../lib/server/redis";

export const prerender = false;

const RATE_LIMIT_ERROR = "Слишком много сообщений. Попробуйте через несколько минут.";
const CONSENT_REQUIRED = "Подтвердите согласие на обработку персональных данных.";

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

const notice = (status: ChatLeadNotice["status"]): ChatLeadNotice => ({ status, message: CHAT_LEAD_MESSAGES[status] });

const unavailable = () => json({ ok: false, message: CHAT_LEAD_MESSAGES.failed }, 503);

interface LeadTurn {
    chatId: string;
    summary: string;
    clientKey: string;
    body: any;
}

// Runs only while the chat lock is held. Contacts come from the draft in Redis, never from the request.
async function runLead(kv: ChatKv, turn: LeadTurn): Promise<Response> {
    const context = readLeadRequestContext(turn.body);
    const now = Date.now();
    const state = await loadState(kv, turn.chatId, now);

    if (!isConsentValid(state, now, CHAT_CONSENT_VERSION)) {
        return json({ ok: false, message: CONSENT_REQUIRED }, 400);
    }

    if (state.leadDraft === null) {
        return json({ ok: true, lead: notice("invalid") }, 200);
    }

    const outcome = await submitChatLead({
        draft: { ...state.leadDraft, summary: turn.summary },
        messages: state.messages,
        clientKey: turn.clientKey,
        source: context.source,
        attribution: context.attribution,
        consentAcceptedAt: state.consentAcceptedAt ?? "",
        consentVersion: state.consentVersion ?? "",
        honeypot: context.honeypot,
    });

    if (outcome.submitted || outcome.notice.status === "duplicate") {
        redactAfterLead(state);
        try {
            await saveState(kv, turn.chatId, state, now);
        } catch {
            // The lead is already on its way; a failed save must not change the answer.
            // Best effort: delete the stored state so the name, phone and summary do not outlive the notice.
            try {
                await kv.del(stateKey(turn.chatId));
            } catch {
                // nothing more can be done here; the record expires within 24 hours
            }
        }
    }

    return json({ ok: true, lead: outcome.notice }, 200);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
    let address: string | undefined;
    try {
        address = clientAddress;
    } catch {
        address = undefined;
    }

    const clientKey = clientKeyFrom(request, address, TRUSTED_PROXY_HOPS);
    const limit = checkRateLimit(clientKey);
    if (!limit.allowed) {
        return json({ ok: false, message: RATE_LIMIT_ERROR }, 429, { "Retry-After": String(limit.retryAfterSeconds) });
    }

    const raw = await readBoundedText(request);
    if (raw === null || raw.length > CHAT_MAX_BODY_CHARS) {
        return json({ ok: false, message: INVALID_REQUEST }, 413);
    }

    let body: any;
    try {
        body = JSON.parse(raw);
    } catch {
        return json({ ok: false, message: INVALID_REQUEST }, 400);
    }

    const chatId = readChatId(body);
    if (!chatId) {
        return json({ ok: false, message: INVALID_REQUEST }, 400);
    }

    // Only the edited summary comes from the request.
    const summary = typeof body.summary === "string" ? normalizeSummary(body.summary) : "";
    if (summary.length < CHAT_LEAD_SUMMARY_MIN || summary.length > CHAT_LEAD_SUMMARY_MAX) {
        return json({ ok: true, lead: notice("invalid") }, 200);
    }

    const token = crypto.randomUUID();
    try {
        const kv = await getChatKv();
        if (!(await acquireLock(kv, chatId, token))) {
            return json({ ok: false, message: CHAT_BUSY_MESSAGE }, 409);
        }
        try {
            return await runLead(kv, { chatId, summary, clientKey, body });
        } finally {
            try {
                await releaseLock(kv, chatId, token);
            } catch {
                // the lock expires by itself after 60 seconds
            }
        }
    } catch (error) {
        if (error instanceof RedisUnavailableError) return unavailable();
        throw error;
    }
};
