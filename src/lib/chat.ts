export type ChatRole = "user" | "assistant";

export interface ChatMessage {
    role: ChatRole;
    content: string;
}

export type ChatSource = "chat-page" | "chat-widget";
export type ChatLeadStatus = "sent" | "duplicate" | "invalid" | "limited" | "failed";

export interface ChatLeadDraft {
    name: string;
    phone: string;
    email: string;
    summary: string;
}

export interface ChatLeadNotice {
    status: ChatLeadStatus;
    message: string;
}

export interface ChatResponse {
    ok: boolean;
    reply?: string;
    message?: string;
    consentRequired?: boolean;
    leadDraft?: ChatLeadDraft;
    lead?: ChatLeadNotice;
}

// Any change to the ChatConsent text or CHAT_CONSENT_NOTICE requires a new CHAT_CONSENT_VERSION.
export const CHAT_CONSENT_VERSION = "chat-consent-2026-10-14";
export const CHAT_CONSENT_NOTICE = "Для заявки нужны имя, телефон и описание задачи. Их получит W1DO. Сообщения чата обрабатывает ИИ-сервис PolzaAI. Переписка хранится на сервере не дольше 24 часов с начала диалога и удаляется сразу после отправки заявки.";
export const CHAT_BUSY_MESSAGE = "Предыдущее сообщение ещё обрабатывается. Дождитесь ответа.";

export const CHAT_ENDPOINT = "/api/chat";
export const CHAT_LEAD_ENDPOINT = "/api/chat-lead";
export const CHAT_CONTACT_PATH = "/contact";
export const CHAT_MAX_USER_CHARS = 1000;
export const CHAT_MAX_ASSISTANT_CHARS = 4000;
export const CHAT_MAX_HISTORY = 12;
export const CHAT_MAX_STORED_MESSAGES = 40;
export const CHAT_MAX_BODY_CHARS = 8_000;
export const CHAT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const CHAT_LEAD_SUMMARY_MIN = 20;
export const CHAT_LEAD_SUMMARY_MAX = 1500;
export const CHAT_CONSENT_MAX_AGE_MS = 24 * 60 * 60_000;
export const CHAT_CONSENT_ACCEPTED_TEXT = "Я согласен на обработку персональных данных.";
export const CHAT_LEAD_MESSAGES: Record<ChatLeadStatus, string> = {
    sent: "Заявка отправлена. Мы свяжемся с вами по указанному телефону.",
    duplicate: "Эта заявка уже отправлена. Мы свяжемся с вами.",
    invalid: "Не получилось оформить заявку: проверьте имя, телефон и описание задачи.",
    limited: "Слишком много заявок за короткое время. Попробуйте позже.",
    failed: "Не удалось отправить заявку. Попробуйте позже.",
};
