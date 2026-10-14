import type { ChatLeadDraft, ChatMessage } from "../../chat";

const LEAD_TAG = /<lead>([\s\S]*?)<\/lead>/gi;
const CONSENT_TAG = /<consent-request\s*\/?>/gi;
const CONSENT_TAG_TEST = /<consent-request\s*\/?>/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUMMARY_MIN = 20; // = CHAT_LEAD_SUMMARY_MIN (дублируется, чтобы модуль работал под node --test)
const SUMMARY_MAX = 1500; // = CHAT_LEAD_SUMMARY_MAX
const CONSENT_AUTO_TEXT = "Я согласен на обработку персональных данных."; // = CHAT_CONSENT_ACCEPTED_TEXT
const NAME_BOUNDARY = "[^\\p{L}\\p{N}]";
const EMAIL_LEFT = "[\\s<>,;:()\"'«»]";
const EMAIL_RIGHT = "[\\s<>,;:()\"'«»!?.]";

// Matches token as a whole word/value: the left and right characters must be outside the token.
function containsToken(haystack: string, token: string, left: string, right: string): boolean {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|${left})${escaped}(?=$|${right})`, "iu").test(haystack);
}

export function stripDirectives(text: string): string {
    return text
        .replace(LEAD_TAG, "")
        .replace(CONSENT_TAG, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export function normalizeSummary(text: string): string {
    return text
        .replace(/<[^>]*>/g, "")
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export function phoneDigits(phone: string): string {
    return phone.replace(/\D/g, "");
}

export function validateLeadDraft(value: unknown): ChatLeadDraft | null {
    if (!value || typeof value !== "object") return null;
    const draft = value as Record<string, unknown>;

    if (typeof draft.name !== "string") return null;
    const name = draft.name.trim();
    if (name.length < 2 || name.length > 100 || /[<>]/.test(name)) return null;

    if (typeof draft.phone !== "string") return null;
    const phone = draft.phone.trim();
    if (phone.length > 30) return null;
    const digits = phoneDigits(phone).length;
    if (digits < 10 || digits > 15) return null;

    let email = "";
    if (draft.email !== undefined && draft.email !== null && draft.email !== "") {
        if (typeof draft.email !== "string") return null;
        email = draft.email.trim();
        if (email.length > 254 || !EMAIL_PATTERN.test(email)) return null;
    }

    if (typeof draft.summary !== "string") return null;
    const summary = normalizeSummary(draft.summary);
    if (summary.length < SUMMARY_MIN || summary.length > SUMMARY_MAX) return null;

    return { name, phone, email, summary };
}

export function extractDirectives(reply: string): {
    text: string;
    lead: ChatLeadDraft | null;
    leadMalformed: boolean;
    consentRequested: boolean;
} {
    const matches = [...reply.matchAll(LEAD_TAG)];
    const last = matches[matches.length - 1];

    let lead: ChatLeadDraft | null = null;
    if (last) {
        try {
            lead = validateLeadDraft(JSON.parse(last[1]));
        } catch {
            lead = null;
        }
    }

    return {
        text: stripDirectives(reply),
        lead,
        leadMalformed: matches.length > 0 && !lead,
        consentRequested: CONSENT_TAG_TEST.test(reply),
    };
}

export function isGroundedInVisitorMessages(draft: ChatLeadDraft, messages: ChatMessage[]): boolean {
    // The automatic consent message is not the visitor's own text, so it never counts as a source of contacts.
    const visitorTexts = messages
        .filter((message) => message.role === "user" && message.content.trim() !== CONSENT_AUTO_TEXT)
        .map((message) => message.content);
    const last10 = phoneDigits(draft.phone).slice(-10);

    const phoneFound = visitorTexts.some((text) => phoneDigits(text).includes(last10));
    const nameFound = visitorTexts.some((text) => containsToken(text, draft.name, NAME_BOUNDARY, NAME_BOUNDARY));
    const emailFound = !draft.email
        || visitorTexts.some((text) => containsToken(text, draft.email, EMAIL_LEFT, EMAIL_RIGHT));

    return phoneFound && nameFound && emailFound;
}
