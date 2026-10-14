import { useRef, useState } from "react";
import {
    CHAT_CONSENT_ACCEPTED_TEXT, CHAT_ENDPOINT, CHAT_LEAD_ENDPOINT, CHAT_LEAD_MESSAGES, CHAT_MAX_USER_CHARS,
    type ChatLeadDraft, type ChatLeadNotice, type ChatMessage, type ChatResponse, type ChatSource,
} from "../lib/chat";
import { collectPayload } from "./useContactForm";

export type ChatStatus = "idle" | "loading" | "error";

const NETWORK_ERROR = "Не удалось получить ответ. Проверьте соединение и попробуйте ещё раз.";

// Only the browser-side chat id and visible messages live here. History, consent and the draft live in Redis.
export function useAiChat(source: ChatSource): {
    messages: ChatMessage[];
    status: ChatStatus;
    error: string;
    consentAccepted: boolean;
    consentRequired: boolean;
    leadDraft: ChatLeadDraft | null;
    leadNotice: ChatLeadNotice | null;
    send: (text: string, acceptConsent?: boolean) => Promise<void>;
    acceptConsent: () => void;
    confirmLead: (summary: string, honeypot?: string) => Promise<void>;
    dismissLeadDraft: () => void;
} {
    const [chatId] = useState(() => crypto.randomUUID());
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<ChatStatus>("idle");
    const [error, setError] = useState<string>("");
    const [consentAccepted, setConsentAccepted] = useState(false);
    const [consentRequired, setConsentRequired] = useState(false);
    const [leadDraft, setLeadDraft] = useState<ChatLeadDraft | null>(null);
    const [leadNotice, setLeadNotice] = useState<ChatLeadNotice | null>(null);
    const leadInFlight = useRef(false);

    const send = async (text: string, acceptConsent = false) => {
        const content = text.trim();
        if (!content || status === "loading") return;

        if (content.length > CHAT_MAX_USER_CHARS) {
            setStatus("error");
            setError(`Сообщение слишком длинное: до ${CHAT_MAX_USER_CHARS} символов.`);
            return;
        }

        setMessages((previous) => [...previous, { role: "user", content }]);
        setStatus("loading");
        setError("");

        try {
            const response = await fetch(CHAT_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatId,
                    message: content,
                    ...(acceptConsent ? { acceptConsent: true } : {}),
                }),
            });

            const result: ChatResponse | null = await response.json().catch(() => null);

            if (result?.ok && typeof result.reply === "string") {
                const reply = result.reply;
                setMessages((previous) => [...previous, { role: "assistant", content: reply }]);
                setStatus("idle");
                setConsentRequired(Boolean(result.consentRequired));
                if (result.leadDraft) {
                    setLeadDraft(result.leadDraft);
                    setLeadNotice(null);
                }
                if (result.lead) {
                    setLeadNotice(result.lead);
                }
                return;
            }

            setStatus("error");
            setError(result?.message || NETWORK_ERROR);
        } catch {
            setStatus("error");
            setError(NETWORK_ERROR);
        }
    };

    const acceptConsent = () => {
        setConsentAccepted(true);
        setConsentRequired(false);
        void send(CHAT_CONSENT_ACCEPTED_TEXT, true);
    };

    const confirmLead = async (summary: string, honeypot = "") => {
        if (!leadDraft || status === "loading" || leadInFlight.current) return;
        leadInFlight.current = true;

        const attribution: Record<string, string> = {};
        for (const [key, value] of Object.entries(collectPayload())) {
            if (typeof value === "string") attribution[key] = value;
        }

        try {
            const response = await fetch(CHAT_LEAD_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatId, summary, source, attribution, max: honeypot }),
            });

            const result: ChatResponse | null = await response.json().catch(() => null);

            if (result?.ok && result.lead) {
                setLeadNotice(result.lead);
                if (result.lead.status === "sent" || result.lead.status === "duplicate") {
                    setLeadDraft(null);
                }
                return;
            }

            setLeadNotice({ status: "failed", message: result?.message || CHAT_LEAD_MESSAGES.failed });
        } catch {
            setLeadNotice({ status: "failed", message: CHAT_LEAD_MESSAGES.failed });
        } finally {
            leadInFlight.current = false;
        }
    };

    const dismissLeadDraft = () => setLeadDraft(null);

    return {
        messages,
        status,
        error,
        consentAccepted,
        consentRequired,
        leadDraft,
        leadNotice,
        send,
        acceptConsent,
        confirmLead,
        dismissLeadDraft,
    };
}
