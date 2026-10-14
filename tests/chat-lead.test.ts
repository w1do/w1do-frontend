import test from "node:test";
import assert from "node:assert/strict";
import { extractDirectives, isGroundedInVisitorMessages, validateLeadDraft } from "../src/lib/server/chat/lead-directives.ts";
import { checkLeadLimit, clientKeyFrom, LEAD_LIMIT_WINDOW_MS } from "../src/lib/server/chat/rate-limit.ts";

const SUMMARY = "Нужен ИИ-агент для ответов клиентам в WhatsApp и передачи заявок в CRM.";
const LEAD_JSON = JSON.stringify({ name: "Анна", phone: "+79123456789", email: "", summary: SUMMARY });

test("valid lead tag is parsed and removed from the text", () => {
    const result = extractDirectives(`Проверьте заявку.\n<lead>${LEAD_JSON}</lead>`);
    assert.deepEqual(result.lead, { name: "Анна", phone: "+79123456789", email: "", summary: SUMMARY });
    assert.equal(result.leadMalformed, false);
    assert.equal(result.text, "Проверьте заявку.");
});

test("consent tag sets consentRequested and is removed from the text", () => {
    const result = extractDirectives("Нужно согласие. <consent-request/>");
    assert.equal(result.consentRequested, true);
    assert.equal(result.text.includes("consent-request"), false);
});

test("malformed lead tag is flagged", () => {
    const result = extractDirectives("Ок. <lead>не json</lead>");
    assert.equal(result.lead, null);
    assert.equal(result.leadMalformed, true);
});

test("when two lead tags are present the last one is used", () => {
    const first = JSON.stringify({ name: "Иван", phone: "+79000000001", email: "", summary: SUMMARY });
    const result = extractDirectives(`<lead>${first}</lead> и <lead>${LEAD_JSON}</lead>`);
    assert.equal(result.lead?.name, "Анна");
});

test("validateLeadDraft rejects a phone with 9 digits", () => {
    assert.equal(validateLeadDraft({ name: "Анна", phone: "912345678", email: "", summary: SUMMARY }), null);
});

test("validateLeadDraft rejects an invalid email", () => {
    assert.equal(validateLeadDraft({ name: "Анна", phone: "+79123456789", email: "abc", summary: SUMMARY }), null);
});

test("validateLeadDraft accepts an empty email as empty string", () => {
    const draft = validateLeadDraft({ name: "Анна", phone: "+79123456789", email: "", summary: SUMMARY });
    assert.equal(draft?.email, "");
});

test("validateLeadDraft rejects a summary shorter than 20 characters after HTML is removed", () => {
    assert.equal(validateLeadDraft({ name: "Анна", phone: "+79123456789", email: "", summary: "<b>короткое</b>" }), null);
});

test("validateLeadDraft strips HTML from the summary", () => {
    const draft = validateLeadDraft({ name: "Анна", phone: "+79123456789", email: "", summary: `<b>${SUMMARY}</b>` });
    assert.equal(draft?.summary, SUMMARY);
});

test("grounding accepts a phone written in another format", () => {
    const draft = { name: "Анна", phone: "+79123456789", email: "", summary: SUMMARY };
    const messages = [{ role: "user" as const, content: "Звоните 8 (912) 345-67-89, я Анна" }];
    assert.equal(isGroundedInVisitorMessages(draft, messages), true);
});

test("grounding rejects a phone that only the assistant wrote", () => {
    const draft = { name: "Анна", phone: "+79123456789", email: "", summary: SUMMARY };
    const messages = [
        { role: "user" as const, content: "Меня зовут Анна" },
        { role: "assistant" as const, content: "Ваш телефон +79123456789" },
    ];
    assert.equal(isGroundedInVisitorMessages(draft, messages), false);
});

test("grounding matches the name case-insensitively", () => {
    const draft = { name: "Анна", phone: "+79123456789", email: "", summary: SUMMARY };
    const messages = [{ role: "user" as const, content: "меня зовут АННА, мой номер 89123456789" }];
    assert.equal(isGroundedInVisitorMessages(draft, messages), true);
});

test("grounding rejects an email the visitor never wrote", () => {
    const draft = { name: "Анна", phone: "+79123456789", email: "anna@example.com", summary: SUMMARY };
    const messages = [{ role: "user" as const, content: "Анна, 89123456789" }];
    assert.equal(isGroundedInVisitorMessages(draft, messages), false);
});

test("lead limit allows two requests per client per hour and blocks the third", () => {
    assert.equal(checkLeadLimit("t1", 0).allowed, true);
    assert.equal(checkLeadLimit("t1", 1).allowed, true);
    assert.equal(checkLeadLimit("t1", 2).allowed, false);
    assert.equal(checkLeadLimit("t1", LEAD_LIMIT_WINDOW_MS).allowed, true);
});

const requestWith = (forwarded?: string) =>
    new Request("http://localhost/api/chat", { method: "POST", headers: forwarded ? { "x-forwarded-for": forwarded } : {} });

test("clientKeyFrom with 0 hops and X-Forwarded-For returns one shared key", () => {
    assert.equal(clientKeyFrom(requestWith("1.1.1.1"), "10.0.0.5", 0), "untrusted-forwarded");
    assert.equal(clientKeyFrom(requestWith("9.9.9.9"), "10.0.0.7", 0), "untrusted-forwarded");
});

test("clientKeyFrom with 0 hops and no X-Forwarded-For returns clientAddress", () => {
    assert.equal(clientKeyFrom(requestWith(), "10.0.0.5", 0), "10.0.0.5");
    assert.equal(clientKeyFrom(requestWith(), undefined, 0), "unknown");
});

test("clientKeyFrom with 1 hop and 'a, b' returns the last entry b", () => {
    assert.equal(clientKeyFrom(requestWith("a, b"), "10.0.0.5", 1), "b");
});

test("clientKeyFrom with 1 hop takes the last entry", () => {
    assert.equal(clientKeyFrom(requestWith("1.1.1.1, 2.2.2.2"), "10.0.0.5", 1), "2.2.2.2");
});

test("clientKeyFrom with 2 hops takes the second entry from the right", () => {
    assert.equal(clientKeyFrom(requestWith("1.1.1.1, 2.2.2.2, 3.3.3.3"), "10.0.0.5", 2), "2.2.2.2");
});

test("clientKeyFrom falls back to clientAddress when there are fewer entries than hops", () => {
    assert.equal(clientKeyFrom(requestWith("1.1.1.1"), "10.0.0.5", 2), "10.0.0.5");
});

const LEAD_PHONE = "+79123456789";
const LEAD_SUMMARY = "Нужен ИИ-агент для ответов клиентам в мессенджере и передачи заявок.";
const CONSENT_TEXT = "Я согласен на обработку персональных данных.";
const leadDraft = (name: string, email = "") => ({ name, phone: LEAD_PHONE, email, summary: LEAD_SUMMARY });
const visitor = (content: string) => ({ role: "user" as const, content });

test("L1: a one-letter-shorter name inside a longer word is not grounded", () => {
    assert.equal(isGroundedInVisitorMessages(leadDraft("Ан"), [visitor("Меня зовут Анна, 89123456789")]), false);
});

test("L1: a one-character name is rejected by validateLeadDraft", () => {
    assert.equal(validateLeadDraft({ name: "А", phone: LEAD_PHONE, email: "", summary: LEAD_SUMMARY }), null);
});

test("L1: the automatic consent message does not count as a source of contacts", () => {
    const messages = [visitor(CONSENT_TEXT), visitor("89123456789")];
    assert.equal(isGroundedInVisitorMessages(leadDraft("Анна"), messages), false);
});

test("L1: an email inside a longer token is not grounded", () => {
    const messages = [visitor("Анна, 89123456789, почта manna@x.ru")];
    assert.equal(isGroundedInVisitorMessages(leadDraft("Анна", "anna@x.ru"), messages), false);
});

test("L1: an email at the end of a sentence is grounded", () => {
    const messages = [visitor("Анна, 89123456789, пишите на anna@x.ru.")];
    assert.equal(isGroundedInVisitorMessages(leadDraft("Анна", "anna@x.ru"), messages), true);
});
