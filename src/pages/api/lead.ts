import type { APIRoute } from "astro";
import { TRUSTED_PROXY_HOPS } from "astro:env/server";
import { checkLeadFormattingLimit, clientKeyFrom } from "../../lib/server/chat/rate-limit";
import { readBoundedBody } from "../../lib/server/leads/read-request-body";
import { isSameOriginRequest } from "../../lib/server/leads/request-origin";
import { prepareLead, submitLead, type LeadInput } from "../../lib/server/leads/submit-lead";

export const prerender = false;

const MAX_LEAD_BODY_BYTES = 64 * 1024;

const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });

const asText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export const POST: APIRoute = async (context) => {
    const { request } = context;
    let body: (LeadInput & { max?: unknown; mode?: unknown }) | null;

    const raw = await readBoundedBody(request, MAX_LEAD_BODY_BYTES);
    if (raw === "too-large") return json({ ok: false, message: "Заявка слишком длинная. Сократите описание задачи." }, 413);
    if (raw === "unreadable") return json({ ok: false, message: "Некорректный формат заявки." }, 400);

    try {
        body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(raw)) as typeof body;
    } catch {
        return json({ ok: false, message: "Некорректный формат заявки." }, 400);
    }

    if (!body || typeof body !== "object") {
        return json({ ok: false, message: "Некорректный формат заявки." }, 400);
    }

    const preparing = body.mode === "prepare";
    if (preparing && !isSameOriginRequest(request, context.url, context.site)) {
        return json({ ok: false, message: "Подготовка заявки доступна с этой страницы сайта." }, 403);
    }

    // Honeypot: pretend the lead went through so bots cannot detect the trap.
    if (asText(body.max)) {
        return json(preparing ? { ok: true, message: "" } : { ok: true }, 200);
    }

    let address: string | undefined;
    try { address = context.clientAddress; } catch { address = undefined; }
    const clientKey = clientKeyFrom(request, address, TRUSTED_PROXY_HOPS);
    const allowFormatting = () => checkLeadFormattingLimit(clientKey).allowed;

    if (preparing) {
        const draft = await prepareLead(body, allowFormatting);
        return draft.ok ? json(draft, 200) : json({ ok: false, message: draft.message }, draft.status);
    }

    const outcome = await submitLead(body, "[lead]", allowFormatting);

    return outcome.ok
        ? json({ ok: true, id: outcome.id }, 200)
        : json({ ok: false, message: outcome.message }, outcome.status);
};
