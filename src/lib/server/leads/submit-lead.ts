import { LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";

const DEFAULT_BASE_URL = "https://backend.w1do.ru";
const REQUEST_TIMEOUT_MS = 10_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LEAD_GENERIC_ERROR = "Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.";

export interface LeadInput {
    name?: unknown;
    phone?: unknown;
    email?: unknown;
    subject?: unknown;
    message?: unknown;
    source?: unknown;
    payload?: unknown;
    legalConsent?: unknown;
}

// "network": no answer from the platform (outcome unknown). "rejected": the platform answered with an error.
export type LeadFailureReason = "validation" | "config" | "network" | "rejected";

export type LeadOutcome =
    | { ok: true; id: string | null }
    | { ok: false; status: 400 | 500 | 502; message: string; reason: LeadFailureReason };

const asText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const fail = (status: 400 | 500 | 502, message: string, reason: LeadFailureReason): LeadOutcome =>
    ({ ok: false, status, message, reason });

export async function submitLead(input: LeadInput, logTag: string = "[lead]"): Promise<LeadOutcome> {
    const name = asText(input.name);
    const phone = asText(input.phone);
    const email = asText(input.email);

    if (!name || !phone) {
        return fail(400, "Укажите имя и телефон.", "validation");
    }

    if (email && !EMAIL_PATTERN.test(email)) {
        return fail(400, "Укажите корректный email.", "validation");
    }

    if (input.legalConsent !== true) {
        return fail(400, "Подтвердите согласие с юридическими документами.", "validation");
    }

    const apiKey = LEADS_API_KEY;
    const baseUrl = LEADS_API_BASE_URL || DEFAULT_BASE_URL;

    if (!apiKey) {
        console.error(`${logTag} LEADS_API_KEY is not set — the lead was not forwarded to the platform.`);
        return fail(500, LEAD_GENERIC_ERROR, "config");
    }

    const requestPayload = input.payload && typeof input.payload === "object" && !Array.isArray(input.payload)
        ? { ...(input.payload as Record<string, unknown>) }
        : {};
    const payload = Object.fromEntries(
        Object.entries(requestPayload).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
    );
    const leadPayload: Record<string, unknown> = {
        phone,
        subject: asText(input.subject) || `Заявка с сайта: ${name}`,
        message: asText(input.message) || `Имя: ${name}`,
        source: asText(input.source) || "site",
        payload,
    };

    if (email) {
        leadPayload.email = email;
    }

    let response: Response;

    try {
        response = await fetch(`${baseUrl}/api/v1/leads`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Api-Key": apiKey,
            },
            body: JSON.stringify(leadPayload),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (error) {
        console.error(`${logTag} platform request failed:`, error);
        return fail(502, LEAD_GENERIC_ERROR, "network");
    }

    let envelope: any = null;

    try {
        envelope = await response.json();
    } catch {
        envelope = null;
    }

    if (!response.ok) {
        // Only status, code and trace_id are logged: the details can contain personal data.
        console.error(
            `${logTag} platform rejected the lead: status=${response.status}`,
            `code=${envelope?.error?.code ?? "unknown"}`,
            `trace_id=${envelope?.error?.trace_id ?? "none"}`,
        );
        return fail(502, asText(envelope?.error?.message) || LEAD_GENERIC_ERROR, "rejected");
    }

    return { ok: true, id: envelope?.data?.id ?? null };
}
