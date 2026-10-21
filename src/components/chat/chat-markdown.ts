// Minimal, dependency-free Markdown subset for assistant replies.
// Produces a plain AST: the renderer turns it into React elements, so no HTML is ever injected.

export type MarkdownInline =
    | { type: "text"; text: string }
    | { type: "strong"; children: MarkdownInline[] }
    | { type: "em"; children: MarkdownInline[] }
    | { type: "link"; url: string }
    | { type: "br" };

export type MarkdownBlock =
    | { type: "paragraph"; children: MarkdownInline[] }
    | { type: "list"; ordered: boolean; start: number; items: MarkdownInline[][] };

export const LINK_PATTERN = /(https:\/\/w1do\.ru(?:\/[^\s<>"'«»()]*)?)/g;

const LINK_PLACEHOLDER = "\uE000";
const LINK_TRAILING = /[.,;:!?*_]+$/;
const UNORDERED_ITEM = /^\s*[-*•]\s+(.*)$/;
const ORDERED_ITEM = /^\s*(\d{1,3})[.)]\s+(.*)$/;
const WORD_CHAR = /[\p{L}\p{N}]/u;

function isWordChar(char: string | undefined): boolean {
    return char !== undefined && WORD_CHAR.test(char);
}

function isSpace(char: string | undefined): boolean {
    return char === undefined || /\s/.test(char);
}

function findStrongClose(text: string, from: number): number {
    for (let index = text.indexOf("**", from); index !== -1; index = text.indexOf("**", index + 1)) {
        if (index > from && !isSpace(text[index - 1])) return index;
    }
    return -1;
}

function canOpenEm(text: string, index: number, marker: string): boolean {
    const prev = text[index - 1];
    const next = text[index + 1];
    return !isWordChar(prev) && prev !== marker && !isSpace(next) && next !== marker;
}

function findEmClose(text: string, from: number, marker: string): number {
    for (let index = text.indexOf(marker, from); index !== -1; index = text.indexOf(marker, index + 1)) {
        const next = text[index + 1];
        if (index > from && !isSpace(text[index - 1]) && !isWordChar(next) && next !== marker) return index;
    }
    return -1;
}

function pushText(nodes: MarkdownInline[], text: string, links: { urls: string[]; next: number }): void {
    const parts = text.split(LINK_PLACEHOLDER);
    parts.forEach((part, index) => {
        if (index > 0) nodes.push({ type: "link", url: links.urls[links.next++] ?? "" });
        if (part) nodes.push({ type: "text", text: part });
    });
}

function scanInline(text: string, links: { urls: string[]; next: number }): MarkdownInline[] {
    const nodes: MarkdownInline[] = [];
    let buffer = "";
    let index = 0;

    const flush = () => {
        if (buffer) pushText(nodes, buffer, links);
        buffer = "";
    };

    while (index < text.length) {
        if (text.startsWith("**", index) && !isSpace(text[index + 2])) {
            const close = findStrongClose(text, index + 2);
            if (close !== -1) {
                flush();
                nodes.push({ type: "strong", children: scanInline(text.slice(index + 2, close), links) });
                index = close + 2;
                continue;
            }
        }

        const char = text[index];
        if ((char === "*" || char === "_") && canOpenEm(text, index, char)) {
            const close = findEmClose(text, index + 1, char);
            if (close !== -1) {
                flush();
                nodes.push({ type: "em", children: scanInline(text.slice(index + 1, close), links) });
                index = close + 1;
                continue;
            }
        }

        buffer += char;
        index += 1;
    }

    flush();
    return nodes;
}

// Links are replaced by an opaque placeholder first, so emphasis markers never break a URL.
export function parseInline(line: string): MarkdownInline[] {
    const urls: string[] = [];
    const prepared = line.replaceAll(LINK_PLACEHOLDER, "").replace(LINK_PATTERN, (match: string) => {
        const url = match.replace(LINK_TRAILING, "");
        urls.push(url);
        return LINK_PLACEHOLDER + match.slice(url.length);
    });
    return scanInline(prepared, { urls, next: 0 });
}

function parseLines(lines: string[]): MarkdownInline[] {
    const nodes: MarkdownInline[] = [];
    lines.forEach((line, index) => {
        if (index > 0) nodes.push({ type: "br" });
        nodes.push(...parseInline(line));
    });
    return nodes;
}

export function parseMarkdown(text: string): MarkdownBlock[] {
    const blocks: MarkdownBlock[] = [];
    let paragraph: string[] = [];
    let list = null as { ordered: boolean; start: number; items: string[][] } | null;

    const closeParagraph = () => {
        if (paragraph.length) blocks.push({ type: "paragraph", children: parseLines(paragraph) });
        paragraph = [];
    };
    const closeList = () => {
        if (list) blocks.push({ type: "list", ordered: list.ordered, start: list.start, items: list.items.map(parseLines) });
        list = null;
    };

    for (const rawLine of text.replace(/\r\n?/g, "\n").split("\n")) {
        const line = rawLine.trimEnd();
        if (!line.trim()) {
            closeParagraph();
            closeList();
            continue;
        }

        const ordered = ORDERED_ITEM.exec(line);
        const unordered = ordered ? null : UNORDERED_ITEM.exec(line);
        if (ordered || unordered) {
            const isOrdered = ordered !== null;
            closeParagraph();
            if (list && list.ordered !== isOrdered) closeList();
            if (!list) list = { ordered: isOrdered, start: ordered ? Number(ordered[1]) : 1, items: [] };
            list.items.push([ordered ? ordered[2] : unordered![1]]);
            continue;
        }

        if (list && /^\s/.test(line)) {
            list.items[list.items.length - 1].push(line.trim());
            continue;
        }

        closeList();
        paragraph.push(line.trim());
    }

    closeParagraph();
    closeList();
    return blocks;
}
