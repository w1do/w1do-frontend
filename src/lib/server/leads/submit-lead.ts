import { LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";
import { formatLeadDescription } from "../polza/lead";

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
    description?: unknown;
    descriptionPrepared?: unknown;
    service?: unknown;
    source?: unknown;
    payload?: unknown;
    legalConsent?: unknown;
}

// "network": no answer from the platform (outcome unknown). "rejected": the platform answered with an error.
export type LeadFailureReason = "validation" | "config" | "network" | "rejected";

export type LeadOutcome =
    | { ok: true; id: string | null }
    | { ok: false; status: 400 | 500 | 502; message: string; reason: LeadFailureReason };

type LeadFailure = Extract<LeadOutcome, { ok: false }>;

const asText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const fail = (status: 400 | 500 | 502, message: string, reason: LeadFailureReason): LeadFailure =>
    ({ ok: false, status, message, reason });

function isolateDescription(input: LeadInput, message: string, calculation: string): {
    description: string;
    service: string;
    start: number;
} | null {
    // Preserve the existing calculator suffix verbatim, including custom line endings and spacing.
    const calculationDivider = /\r?\n[ \t]*(?:\r?\n[ \t]*)?Предварительный расчёт:[ \t]*\r?\n/gu;
    let main = message;
    if (calculation) {
        const sameSpacing = (value: string) => value.trim().replace(/\s+/gu, " ");
        const boundary = [...message.matchAll(calculationDivider)].find((match) =>
            sameSpacing(message.slice(match.index + match[0].length)) === sameSpacing(calculation));
        if (!boundary) return null;
        main = message.slice(0, boundary.index);
    }

    const serviceHeader = main.match(/^Услуга[ \t]*:[ \t]*([^\r\n]*)(?:\r?\n|$)/u);
    const explicitDescription = typeof input.description === "string" ? input.description.trim() : null;
    const selectedService = asText(input.service);
    const headerService = serviceHeader?.[1].trim() ?? "";
    // The description may itself begin with «Услуга:». Match the selected category and the whole editable field.
    if (selectedService && selectedService !== headerService) return null;
    const useHeader = Boolean(selectedService || (headerService && main.trim() !== explicitDescription));
    const start = useHeader ? serviceHeader?.[0].length ?? 0 : 0;
    const remainder = main.slice(start);
    const description = explicitDescription ?? remainder.trim();
    if (!description || remainder.trim() !== description) return null;

    return { description, service: useHeader ? headerService : "", start: start + remainder.length - remainder.trimStart().length };
}

async function prepareLeadMessage(
    input: LeadInput,
    contact: { name: string; phone: string },
    calculation: string,
    allowFormatting: () => boolean,
): Promise<string> {
    const original = asText(input.message) || `Имя: ${contact.name}`;
    if (original === `Имя: ${contact.name}`) return original;

    const part = isolateDescription(input, original, calculation);
    if (!part || (input.descriptionPrepared === true && typeof input.description === "string") || !allowFormatting()) return original;

    const formatted = await formatLeadDescription(part.description, part.service, contact);
    if (!formatted) return original;

    return original.slice(0, part.start) + formatted + original.slice(part.start + part.description.length);
}

function validateLeadContact(input: LeadInput): { ok: true; name: string; phone: string; email: string } | LeadFailure {
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

    return { ok: true, name, phone, email };
}

function readPayload(value: unknown): Record<string, string> {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
        Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
    );
}

export async function prepareLead(
    input: LeadInput,
    allowFormatting: () => boolean,
): Promise<{ ok: true; message: string } | LeadFailure> {
    const contact = validateLeadContact(input);
    if (!contact.ok) return contact;

    const message = await prepareLeadMessage(input, contact, asText(readPayload(input.payload).calculation), allowFormatting);
    return { ok: true, message };
}

export async function submitLead(
    input: LeadInput,
    logTag: string = "[lead]",
    allowFormatting?: () => boolean,
): Promise<LeadOutcome> {
    const contact = validateLeadContact(input);
    if (!contact.ok) return contact;
    const { name, phone, email } = contact;

    const apiKey = LEADS_API_KEY;
    const baseUrl = LEADS_API_BASE_URL || DEFAULT_BASE_URL;

    if (!apiKey) {
        console.error(`${logTag} LEADS_API_KEY is not set — the lead was not forwarded to the platform.`);
        return fail(500, LEAD_GENERIC_ERROR, "config");
    }

    const payload = readPayload(input.payload);
    const leadPayload: Record<string, unknown> = {
        phone,
        subject: asText(input.subject) || `Заявка с сайта: ${name}`,
        message: allowFormatting
            ? await prepareLeadMessage(input, contact, asText(payload.calculation), allowFormatting)
            : asText(input.message) || `Имя: ${name}`,
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
