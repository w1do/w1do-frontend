import type { APIRoute } from "astro";
import { LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";

export const prerender = false;

const DEFAULT_BASE_URL = "https://backend.w1do.ru";
const REQUEST_TIMEOUT_MS = 10_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENERIC_ERROR = "Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.";

interface LeadRequestBody {
    name?: unknown;
    phone?: unknown;
    email?: unknown;
    subject?: unknown;
    message?: unknown;
    source?: unknown;
    payload?: unknown;
    max?: unknown;
    legalConsent?: unknown;
}

const asText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

export const POST: APIRoute = async ({ request }) => {
    let body: LeadRequestBody;

    try {
        body = (await request.json()) as LeadRequestBody;
    } catch {
        return json({ ok: false, message: "Некорректный формат заявки." }, 400);
    }

    // Honeypot: pretend the lead went through so bots cannot detect the trap.
    if (asText(body.max)) {
        return json({ ok: true }, 200);
    }

    const name = asText(body.name);
    const phone = asText(body.phone);
    const email = asText(body.email);

    if (!name || !phone) {
        return json({ ok: false, message: "Укажите имя и телефон." }, 400);
    }

    if (email && !EMAIL_PATTERN.test(email)) {
        return json({ ok: false, message: "Укажите корректный email." }, 400);
    }

    if (body.legalConsent !== true) {
        return json({ ok: false, message: "Подтвердите согласие с юридическими документами." }, 400);
    }

    const apiKey = LEADS_API_KEY;
    const baseUrl = LEADS_API_BASE_URL || DEFAULT_BASE_URL;

    if (!apiKey) {
        console.error("[lead] LEADS_API_KEY is not set — the lead was not forwarded to the platform.");
        return json({ ok: false, message: GENERIC_ERROR }, 500);
    }

    const requestPayload = body.payload && typeof body.payload === "object" && !Array.isArray(body.payload)
        ? { ...(body.payload as Record<string, unknown>) }
        : {};
    const payload = Object.fromEntries(
        Object.entries(requestPayload).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
    );
    const leadPayload: Record<string, unknown> = {
        phone,
        subject: asText(body.subject) || `Заявка с сайта: ${name}`,
        message: asText(body.message) || `Имя: ${name}`,
        source: asText(body.source) || "site",
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
        console.error("[lead] platform request failed:", error);
        return json({ ok: false, message: GENERIC_ERROR }, 502);
    }

    let envelope: any = null;

    try {
        envelope = await response.json();
    } catch {
        envelope = null;
    }

    if (!response.ok) {
        // details and trace_id stay in the server log; the browser only sees a readable message.
        console.error(
            `[lead] platform rejected the lead: status=${response.status}`,
            `code=${envelope?.error?.code ?? "unknown"}`,
            `trace_id=${envelope?.error?.trace_id ?? "none"}`,
            `details=${JSON.stringify(envelope?.error?.details ?? null)}`,
        );
        return json({ ok: false, message: asText(envelope?.error?.message) || GENERIC_ERROR }, 502);
    }

    return json({ ok: true, id: envelope?.data?.id ?? null }, 200);
};
