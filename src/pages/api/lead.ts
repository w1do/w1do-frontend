import type { APIRoute } from "astro";
import { submitLead, type LeadInput } from "../../lib/server/leads/submit-lead";

export const prerender = false;

const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

const asText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export const POST: APIRoute = async ({ request }) => {
    let body: (LeadInput & { max?: unknown }) | null;

    try {
        body = (await request.json()) as (LeadInput & { max?: unknown }) | null;
    } catch {
        return json({ ok: false, message: "Некорректный формат заявки." }, 400);
    }

    if (!body || typeof body !== "object") {
        return json({ ok: false, message: "Некорректный формат заявки." }, 400);
    }

    // Honeypot: pretend the lead went through so bots cannot detect the trap.
    if (asText(body.max)) {
        return json({ ok: true }, 200);
    }

    const outcome = await submitLead(body);

    return outcome.ok
        ? json({ ok: true, id: outcome.id }, 200)
        : json({ ok: false, message: outcome.message }, outcome.status);
};
