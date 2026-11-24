import { useState, type FormEvent } from "react";
import { LEGAL_CONSENT_VALUE } from "../lib/legal";

export interface UseContactFormOptions {
    /** Which form the lead came from, e.g. "contact-page" or "cta-block". */
    source: string;
    descriptionPrepared?: boolean;
}

export type FormStatus = "idle" | "loading" | "success" | "error";

const DEFAULT_ENDPOINT = "/api/lead";
const PREPARE_TIMEOUT_MS = 8_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function collectPayload(): Record<string, unknown> {
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

async function prepareMessage(body: Record<string, unknown>, details: { description: string; service?: string }) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), PREPARE_TIMEOUT_MS);

    try {
        const response = await fetch(DEFAULT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, ...details, mode: "prepare" }),
            signal: controller.signal,
        });
        const result = await response.json();
        if (response.ok && result?.ok === true && typeof result.message === "string" && result.message.trim()) {
            return result.message;
        }
    } catch {
        // A custom endpoint still receives the original message if formatting is unavailable.
    } finally {
        window.clearTimeout(timeout);
    }

    return body.message;
}

export function useContactForm({ source, descriptionPrepared = false }: UseContactFormOptions) {
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
        const calculation = source === "calculator" ? read("calculation") : "";
        const service = read("service");
        const userMessage = [service && `Услуга: ${service}`, messageText].filter(Boolean).join("\n") || `Имя: ${name}`;

        if (calculation) {
            payload.calculation = calculation;
        }

        const body: Record<string, unknown> = {
            name,
            phone,
            subject: `Заявка с сайта${name ? `: ${name}` : ""}`,
            message: calculation ? `${userMessage}\n\nПредварительный расчёт:\n${calculation}` : userMessage,
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
            const endpoint = import.meta.env.PUBLIC_LEADS_ENDPOINT || DEFAULT_ENDPOINT;
            const url = new URL(endpoint, window.location.href);
            const details = { description: messageText, ...(service ? { service } : {}) };
            const preserveDescription = descriptionPrepared && !!messageText;
            if (url.origin === window.location.origin && url.pathname.replace(/\/$/, "") === DEFAULT_ENDPOINT) {
                Object.assign(body, details);
                if (preserveDescription) body.descriptionPrepared = true;
            } else if (!preserveDescription) {
                body.message = await prepareMessage(body, details);
            }
            const response = await fetch(endpoint, {
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
