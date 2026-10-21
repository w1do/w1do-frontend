import type { ChatMessage } from "../../chat";

export const RAG_QUERY_MAX_CHARS = 2000;
export const RAG_SHORT_QUERY_CHARS = 40;

export function buildRagQuery(history: ChatMessage[]): string {
    const visitor = history
        .filter((message) => message.role === "user")
        .map((message) => message.content.trim())
        .filter(Boolean);

    const last = visitor.at(-1) ?? "";
    const previous = visitor.at(-2);
    const query = last.length < RAG_SHORT_QUERY_CHARS && previous ? `${previous} ${last}` : last;

    return query.slice(0, RAG_QUERY_MAX_CHARS);
}
