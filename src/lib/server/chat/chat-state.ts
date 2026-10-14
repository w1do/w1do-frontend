import type { ChatLeadDraft, ChatMessage } from "../../chat";

// Storage port. The Redis adapter lives in redis.ts; tests use an in-memory one.
export interface ChatKv {
    get(key: string): Promise<string | null>;
    setExpireAt(key: string, value: string, expireAtSeconds: number): Promise<void>;
    setIfAbsent(key: string, value: string, ttlMs: number): Promise<boolean>;
    del(key: string): Promise<void>;
    delIfEquals(key: string, value: string): Promise<void>;
}

export interface ChatState {
    createdAt: number;
    messages: ChatMessage[];
    consentRequestedAt: number | null;
    consentAcceptedAt: string | null;
    consentVersion: string | null;
    leadDraft: ChatLeadDraft | null;
    leadSent: boolean;
}

export const CHAT_STATE_MAX_AGE_MS = 24 * 60 * 60_000;
export const CONSENT_REQUEST_MAX_AGE_MS = 30 * 60_000;
export const CHAT_LOCK_TTL_MS = 60_000;
const MAX_STORED_MESSAGES = 40; // = CHAT_MAX_STORED_MESSAGES

export const stateKey = (chatId: string) => `chat:ctx:${chatId}`;
export const lockKey = (chatId: string) => `chat:lock:${chatId}`;

export function emptyChatState(now: number): ChatState {
    return {
        createdAt: now,
        messages: [],
        consentRequestedAt: null,
        consentAcceptedAt: null,
        consentVersion: null,
        leadDraft: null,
        leadSent: false,
    };
}

function isDraftShape(value: unknown): value is ChatLeadDraft {
    if (!value || typeof value !== "object") return false;
    const draft = value as Record<string, unknown>;
    return typeof draft.name === "string" && typeof draft.phone === "string"
        && typeof draft.email === "string" && typeof draft.summary === "string";
}

function isMessage(value: unknown): value is ChatMessage {
    if (!value || typeof value !== "object") return false;
    const message = value as Record<string, unknown>;
    return (message.role === "user" || message.role === "assistant") && typeof message.content === "string";
}

function isExpired(createdAt: number, now: number): boolean {
    return now >= createdAt + CHAT_STATE_MAX_AGE_MS;
}

export function parseChatState(raw: string | null, now: number): ChatState {
    if (raw === null) return emptyChatState(now);

    let stored: Record<string, unknown>;
    try {
        stored = JSON.parse(raw) as Record<string, unknown>;
    } catch {
        return emptyChatState(now);
    }

    const createdAt = stored?.createdAt;
    if (typeof createdAt !== "number" || !Number.isFinite(createdAt) || isExpired(createdAt, now)) {
        return emptyChatState(now);
    }

    return {
        createdAt,
        messages: Array.isArray(stored.messages) ? stored.messages.filter(isMessage).map((message) => ({
            role: message.role,
            content: message.content,
        })) : [],
        consentRequestedAt: typeof stored.consentRequestedAt === "number" ? stored.consentRequestedAt : null,
        consentAcceptedAt: typeof stored.consentAcceptedAt === "string" ? stored.consentAcceptedAt : null,
        consentVersion: typeof stored.consentVersion === "string" ? stored.consentVersion : null,
        leadDraft: isDraftShape(stored.leadDraft) ? stored.leadDraft : null,
        leadSent: stored.leadSent === true,
    };
}

// An expired record is deleted on read, so it never comes back as a live state.
function isStoredExpired(raw: string, now: number): boolean {
    try {
        const createdAt = (JSON.parse(raw) as { createdAt?: unknown }).createdAt;
        return typeof createdAt === "number" && Number.isFinite(createdAt) && isExpired(createdAt, now);
    } catch {
        return false;
    }
}

export async function loadState(kv: ChatKv, chatId: string, now: number): Promise<ChatState> {
    const raw = await kv.get(stateKey(chatId));
    if (raw !== null && isStoredExpired(raw, now)) {
        await kv.del(stateKey(chatId));
    }
    return parseChatState(raw, now);
}

// The expiry is absolute (createdAt + 24 h), so writes never extend the storage period.
export async function saveState(kv: ChatKv, chatId: string, state: ChatState, now: number): Promise<void> {
    const expireAtMs = state.createdAt + CHAT_STATE_MAX_AGE_MS;
    if (expireAtMs <= now) {
        await kv.del(stateKey(chatId));
        return;
    }
    const stored: ChatState = { ...state, messages: state.messages.slice(-MAX_STORED_MESSAGES) };
    await kv.setExpireAt(stateKey(chatId), JSON.stringify(stored), Math.floor(expireAtMs / 1000));
}

export async function acquireLock(kv: ChatKv, chatId: string, token: string): Promise<boolean> {
    return kv.setIfAbsent(lockKey(chatId), token, CHAT_LOCK_TTL_MS);
}

export async function releaseLock(kv: ChatKv, chatId: string, token: string): Promise<void> {
    await kv.delIfEquals(lockKey(chatId), token);
}

export function isConsentValid(state: ChatState, now: number, version: string): boolean {
    if (state.consentAcceptedAt === null || state.consentVersion !== version) return false;
    const accepted = Date.parse(state.consentAcceptedAt);
    return Number.isFinite(accepted) && now - accepted <= CHAT_STATE_MAX_AGE_MS;
}

// The server marks the moment it asked for consent; a client "accept" is only honoured within the window.
export function markConsentRequested(state: ChatState, now: number, version: string): void {
    if (!isConsentValid(state, now, version)) {
        state.consentRequestedAt = now;
    }
}

export function acceptConsent(state: ChatState, now: number, version: string): boolean {
    if (isConsentValid(state, now, version)) return true;
    if (state.consentRequestedAt !== null && now - state.consentRequestedAt <= CONSENT_REQUEST_MAX_AGE_MS) {
        state.consentAcceptedAt = new Date(now).toISOString();
        state.consentVersion = version;
        state.consentRequestedAt = null;
        return true;
    }
    return false;
}

// After a lead is sent, the conversation and the draft are erased; only the flags and consent remain.
export function redactAfterLead(state: ChatState): void {
    state.messages = [];
    state.leadDraft = null;
    state.leadSent = true;
}
