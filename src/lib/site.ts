// Публичный origin сайта — единственное место, откуда берётся домен.
// Значение приходит из SITE_URL в .env: при запуске сервера читается переменная
// окружения, иначе используется origin, собранный Astro из того же SITE_URL.
// Поэтому смена домена — это одна строка в .env и перезапуск, без правок кода.
const buildEnv = (import.meta.env ?? {}) as { SITE?: string };
const runtimeOrigin = typeof process !== "undefined" ? process.env?.SITE_URL?.trim() : undefined;

function resolveOrigin(value: string): string {
    let url: URL;
    try {
        url = new URL(value);
    } catch {
        throw new Error(`SITE_URL must be an absolute http(s) origin, got "${value}".`);
    }
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password
        || url.pathname !== "/" || url.search || url.hash) {
        throw new Error(`SITE_URL must be an http(s) origin without credentials, path, query or fragment, got "${value}".`);
    }
    return url.origin;
}

export const SITE_ORIGIN = resolveOrigin(runtimeOrigin || buildEnv.SITE || "http://localhost:4321");
export const SITE_HOST = new URL(SITE_ORIGIN).host;

/** Абсолютный адрес страницы или файла на текущем домене. */
export function siteUrl(path: string): string {
    return new URL(path, SITE_ORIGIN).href;
}
