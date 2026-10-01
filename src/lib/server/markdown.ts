const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const escapeAttribute = (value: string) => escapeHtml(value).replace(/`/g, "&#96;");

function safeHref(value: string): string {
    const href = value.trim();
    if (href.startsWith("/") || href.startsWith("mailto:")) return href;

    try {
        const url = new URL(href);
        return ["http:", "https:"].includes(url.protocol) ? href : "#";
    } catch {
        return "#";
    }
}

function inline(markdown: string): string {
    return escapeHtml(markdown)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) =>
            `<a href="${escapeAttribute(safeHref(href))}">${label}</a>`,
        )
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function paragraph(lines: string[]): string {
    const content = lines
        .map((line) => line.trimEnd().endsWith("  ")
            ? `${inline(line.trimEnd().slice(0, -2))}<br>`
            : inline(line.trim()))
        .join(" ")
        .trim();

    return content ? `<p>${content}</p>` : "";
}

export function markdownToHtml(markdown: string): string {
    const html: string[] = [];
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    let index = 0;

    while (index < lines.length) {
        const line = lines[index].trim();
        if (!line) {
            index += 1;
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            const level = heading[1].length;
            html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
            index += 1;
            continue;
        }

        if (/^-\s+/.test(line)) {
            const items: string[] = [];
            while (index < lines.length && /^-\s+/.test(lines[index].trim())) {
                items.push(`<li>${inline(lines[index].trim().replace(/^-\s+/, ""))}</li>`);
                index += 1;
            }
            html.push(`<ul>${items.join("")}</ul>`);
            continue;
        }

        const block: string[] = [];
        while (
            index < lines.length
            && lines[index].trim()
            && !/^(#{1,6})\s+/.test(lines[index].trim())
            && !/^-\s+/.test(lines[index].trim())
        ) {
            block.push(lines[index]);
            index += 1;
        }
        html.push(paragraph(block));
    }

    return html.filter(Boolean).join("\n");
}
