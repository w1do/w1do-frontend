import type { APIRoute } from "astro";
import { TRUSTED_PROXY_HOPS } from "astro:env/server";
import {
    CHAT_BUSY_MESSAGE, CHAT_CONSENT_VERSION, CHAT_LEAD_MESSAGES, CHAT_MAX_ASSISTANT_CHARS, CHAT_MAX_BODY_CHARS,
    CHAT_MAX_HISTORY, type ChatLeadNotice, type ChatMessage,
} from "../../lib/chat";
import { createPolzaCompletion, type PolzaFailure } from "../../lib/server/polza/chat";
import { buildSystemPrompt } from "../../lib/server/chat/system-prompt";
import { checkRateLimit, clientKeyFrom } from "../../lib/server/chat/rate-limit";
import { INVALID_REQUEST, readBoundedText, readChatId, readUserMessage } from "../../lib/server/chat/chat-request";
import {
    acceptConsent, acquireLock, isConsentValid, loadState, markConsentRequested, releaseLock, saveState, type ChatKv,
} from "../../lib/server/chat/chat-state";
import { extractDirectives, isGroundedInVisitorMessages } from "../../lib/server/chat/lead-directives";
import { getChatKv, RedisUnavailableError } from "../../lib/server/redis";

export const prerender = false;

const GENERIC_ERROR = "Консультант временно недоступен. Попробуйте позже или оставьте заявку на странице /contact.";
const BUSY_ERROR = "Сейчас слишком много вопросов. Попробуйте через минуту.";
const RATE_LIMIT_ERROR = "Слишком много сообщений. Попробуйте через несколько минут.";
const DRAFT_FALLBACK = "Проверьте заявку ниже и нажмите «Отправить заявку».";
const CONSENT_FALLBACK = "Чтобы оформить заявку, подтвердите согласие ниже.";
const EMPTY_FALLBACK = "Уточните, пожалуйста, ваш вопрос.";

const STATUS_BY_FAILURE: Record<PolzaFailure, number> = {
    config: 500, auth: 502, balance: 503, rate_limited: 503, timeout: 504, network: 502, upstream: 502, empty: 502,
};

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

const unavailable = () => json({ ok: false, message: GENERIC_ERROR }, 503);

// One conversation turn. Runs only while the chat lock is held.
async function runTurn(kv: ChatKv, chatId: string, text: string, wantsConsent: boolean): Promise<Response> {
    const now = Date.now();
    const state = await loadState(kv, chatId, now);

    if (wantsConsent) {
        // Rejected silently if there was no recent consent request: the consent is not taken on the client's word.
        acceptConsent(state, now, CHAT_CONSENT_VERSION);
    }

    const consentAccepted = isConsentValid(state, now, CHAT_CONSENT_VERSION);
    const history: ChatMessage[] = [...state.messages, { role: "user", content: text }];

    const systemPrompt = await buildSystemPrompt({ consentAccepted, leadSent: state.leadSent });
    const result = await createPolzaCompletion([
        { role: "system", content: systemPrompt },
        ...history.slice(-CHAT_MAX_HISTORY),
    ]);

    if (!result.ok) {
        return json(
            { ok: false, message: result.reason === "rate_limited" ? BUSY_ERROR : GENERIC_ERROR },
            STATUS_BY_FAILURE[result.reason],
        );
    }

    const directives = extractDirectives(result.content);
    const hasLeadTag = directives.lead !== null || directives.leadMalformed;
    const consentRequired = !consentAccepted && (directives.consentRequested || hasLeadTag);
    if (consentRequired) {
        markConsentRequested(state, now, CHAT_CONSENT_VERSION);
    }

    let lead: ChatLeadNotice | undefined;
    let draftAccepted = false;
    if (consentAccepted && hasLeadTag) {
        if (directives.lead && isGroundedInVisitorMessages(directives.lead, history)) {
            state.leadDraft = directives.lead;
            draftAccepted = true;
        } else {
            // A rejected tag never erases a draft the visitor is already looking at.
            console.error("[chat] lead draft rejected: malformed or contacts not found in visitor messages");
            if (state.leadDraft === null) {
                lead = { status: "invalid", message: CHAT_LEAD_MESSAGES.invalid };
            }
        }
    }

    const newDraft = draftAccepted ? state.leadDraft : null;
    const fallback = newDraft ? DRAFT_FALLBACK : consentRequired ? CONSENT_FALLBACK : EMPTY_FALLBACK;
    const reply = (directives.text || fallback).slice(0, CHAT_MAX_ASSISTANT_CHARS);
    state.messages = [...history, { role: "assistant", content: reply }];

    await saveState(kv, chatId, state, now);

    return json(
        {
            ok: true,
            reply,
            consentRequired,
            ...(newDraft ? { leadDraft: newDraft } : {}),
            ...(lead ? { lead } : {}),
        },
        200,
    );
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
    let address: string | undefined;
    try {
        address = clientAddress;
    } catch {
        address = undefined;
    }

    const limit = checkRateLimit(clientKeyFrom(request, address, TRUSTED_PROXY_HOPS));
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

    const message = readUserMessage(body);
    if (!message.ok) {
        return json({ ok: false, message: message.message }, 400);
    }

    // The lock is taken before the state is read and released in finally, so concurrent turns cannot overwrite each other.
    const token = crypto.randomUUID();
    try {
        const kv = await getChatKv();
        if (!(await acquireLock(kv, chatId, token))) {
            return json({ ok: false, message: CHAT_BUSY_MESSAGE }, 409);
        }
        try {
            return await runTurn(kv, chatId, message.content, body.acceptConsent === true);
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
