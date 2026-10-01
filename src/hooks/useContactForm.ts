import { useState, type FormEvent } from "react";
import { LEGAL_CONSENT_VALUE, LEGAL_DOCS } from "../lib/legal";

export interface UseContactFormOptions {
    /** Which form the lead came from, e.g. "contact-page" or "cta-block". */
    source: string;
}

export type FormStatus = "idle" | "loading" | "success" | "error";

const DEFAULT_ENDPOINT = "/api/lead";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function collectPayload(): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (typeof window === "undefined") {
        return payload;
    }

    const params = new URLSearchParams(window.location.search);

    for (const key of UTM_KEYS) {
        const value = params.get(key)?.trim();
        if (value) {
            payload[key] = value;
        }
    }

    payload.page = window.location.pathname;

    if (document.referrer) {
        payload.referrer = document.referrer;
    }

    return payload;
}

export function useContactForm({ source }: UseContactFormOptions) {
    const [status, setStatus] = useState<FormStatus>("idle");
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formEl = event.currentTarget;
        const data = new FormData(formEl);
        const read = (field: string) => (data.get(field) as string | null)?.trim() || "";

        const fname = read("fname");
        const lname = read("lname");
        const phone = read("phone");
        const email = read("email");
        const messageText = read("message");
        const honeypot = read("max");
        const legalConsent = data.get("legalConsent") === LEGAL_CONSENT_VALUE;
        const name = `${fname} ${lname}`.trim();

        // Honeypot filled in means a bot: report success without touching the network.
        if (honeypot) {
            setStatus("success");
            setMessage("Заявка отправлена!");
            formEl.reset();
            return;
        }

        if (!fname || !phone) {
            setStatus("error");
            setMessage("Укажите имя и телефон.");
            return;
        }

        if (email && !EMAIL_PATTERN.test(email)) {
            setStatus("error");
            setMessage("Укажите корректный email.");
            return;
        }

        if (!legalConsent) {
            setStatus("error");
            setMessage("Подтвердите согласие с юридическими документами.");
            return;
        }

        const payload = collectPayload();
        payload.legalConsent = LEGAL_CONSENT_VALUE;
        payload.legalDocuments = Object.fromEntries(
            Object.entries(LEGAL_DOCS).map(([key, doc]) => [key, doc.href]),
        );

        const body: Record<string, unknown> = {
            name,
            phone,
            subject: `Заявка с сайта${name ? `: ${name}` : ""}`,
            message: messageText || `Имя: ${name}`,
            source,
            payload,
            max: honeypot,
            legalConsent,
        };

        if (email) {
            body.email = email;
        }

        setStatus("loading");
        setMessage("");

        try {
            const response = await fetch(import.meta.env.PUBLIC_LEADS_ENDPOINT || DEFAULT_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const result = await response.json().catch(() => null);

            if (!result?.ok) {
                setStatus("error");
                setMessage(result?.message || "Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.");
                return;
            }

            setStatus("success");
            setMessage("Заявка отправлена!");
            formEl.reset();
        } catch {
            setStatus("error");
            setMessage("Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.");
        }
    };

    return { status, message, handleSubmit };
}
