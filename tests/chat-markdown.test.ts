import test from "node:test";
import assert from "node:assert/strict";
import { parseInline, parseMarkdown } from "../src/components/chat/chat-markdown.ts";

test("bold becomes a strong node", () => {
    assert.deepEqual(parseInline("Тариф **Про** — 50 000 ₽"), [
        { type: "text", text: "Тариф " },
        { type: "strong", children: [{ type: "text", text: "Про" }] },
        { type: "text", text: " — 50 000 ₽" },
    ]);
});

test("italic with * and _ becomes an em node", () => {
    assert.deepEqual(parseInline("*важно* и _срочно_"), [
        { type: "em", children: [{ type: "text", text: "важно" }] },
        { type: "text", text: " и " },
        { type: "em", children: [{ type: "text", text: "срочно" }] },
    ]);
});

test("identifiers with underscores are not italic", () => {
    assert.deepEqual(parseInline("ключ ai_monthly_limit и snake_case_name"), [
        { type: "text", text: "ключ ai_monthly_limit и snake_case_name" },
    ]);
});

test("unclosed markers stay as text", () => {
    assert.deepEqual(parseInline("2 * 3 = 6, **без пары"), [{ type: "text", text: "2 * 3 = 6, **без пары" }]);
});

test("blank lines split paragraphs, single newlines become br", () => {
    assert.deepEqual(parseMarkdown("Первая строка\nвторая\n\nНовый абзац"), [
        { type: "paragraph", children: [{ type: "text", text: "Первая строка" }, { type: "br" }, { type: "text", text: "вторая" }] },
        { type: "paragraph", children: [{ type: "text", text: "Новый абзац" }] },
    ]);
});

test("bullet and numbered lines become lists", () => {
    const blocks = parseMarkdown("Услуги:\n- **ИИ-агенты**\n* чат-боты\n• сайты\n\n1. Заявка\n2. Созвон");

    assert.equal(blocks.length, 3);
    assert.deepEqual(blocks[0], { type: "paragraph", children: [{ type: "text", text: "Услуги:" }] });
    assert.deepEqual(blocks[1], {
        type: "list",
        ordered: false,
        start: 1,
        items: [
            [{ type: "strong", children: [{ type: "text", text: "ИИ-агенты" }] }],
            [{ type: "text", text: "чат-боты" }],
            [{ type: "text", text: "сайты" }],
        ],
    });
    assert.deepEqual(blocks[2], {
        type: "list",
        ordered: true,
        start: 1,
        items: [[{ type: "text", text: "Заявка" }], [{ type: "text", text: "Созвон" }]],
    });
});

test("links are kept inside bold and list items", () => {
    assert.deepEqual(parseInline("**https://w1do.ru/contact**."), [
        { type: "strong", children: [{ type: "link", url: "https://w1do.ru/contact" }] },
        { type: "text", text: "." },
    ]);

    assert.deepEqual(parseMarkdown("- Форма: https://w1do.ru/contact."), [
        {
            type: "list",
            ordered: false,
            start: 1,
            items: [[{ type: "text", text: "Форма: " }, { type: "link", url: "https://w1do.ru/contact" }, { type: "text", text: "." }]],
        },
    ]);
});

test("underscores inside a URL do not break the link", () => {
    assert.deepEqual(parseInline("см. https://w1do.ru/blog/_draft_/ai_agent"), [
        { type: "text", text: "см. " },
        { type: "link", url: "https://w1do.ru/blog/_draft_/ai_agent" },
    ]);
});

test("foreign links are not linkified", () => {
    assert.deepEqual(parseInline("https://evil.example/w1do.ru"), [{ type: "text", text: "https://evil.example/w1do.ru" }]);
});

test("HTML stays plain text", () => {
    assert.deepEqual(parseMarkdown("<script>alert(1)</script> **<b>x</b>**"), [
        {
            type: "paragraph",
            children: [
                { type: "text", text: "<script>alert(1)</script> " },
                { type: "strong", children: [{ type: "text", text: "<b>x</b>" }] },
            ],
        },
    ]);
});
