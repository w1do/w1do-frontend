/**
 * Кеш готового HTML: экономит SSR и пересборку региона на повторных запросах.
 * Живёт только в памяти процесса: HTML большой, и его не стоит вытеснять состоянием чата в Redis.
 */
const TTL_MS = 60_000;
const MAX_ENTRIES = 120;

const store = new Map<string, { html: string; expiresAt: number }>();

export const HTML_CACHE_CONTROL = "public, max-age=30, s-maxage=300, stale-while-revalidate=86400";

export function htmlCacheKey(pathname: string, search: string): string {
    return `${pathname}${search}`;
}

export async function readHtml(key: string): Promise<string | undefined> {
    const entry = store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
        store.delete(key);
        return undefined;
    }
    // Освежаем позицию, чтобы вытеснялись давно не запрошенные страницы.
    store.delete(key);
    store.set(key, entry);
    return entry.html;
}

export async function writeHtml(key: string, html: string): Promise<void> {
    store.delete(key);
    store.set(key, { html, expiresAt: Date.now() + TTL_MS });
    while (store.size > MAX_ENTRIES) {
        const oldest = store.keys().next().value;
        if (oldest === undefined) break;
        store.delete(oldest);
    }
}
