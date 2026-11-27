import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handler as ssrHandler } from "./dist/server/entry.mjs";

const clientRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist", "client");
const port = Number(process.env.PORT || 4321);
const host = process.env.HOST || "0.0.0.0";

const MIME = {
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".pdf": "application/pdf",
};

// Хешированные файлы сборки живут вечно, остальные — час в браузере и сутки на CDN.
function cacheControl(pathname) {
    if (pathname.startsWith("/_astro/") || pathname.startsWith("/assets/")) return "public, max-age=31536000, immutable";
    return "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";
}

function resolveFile(pathname) {
    let decoded;
    try {
        decoded = decodeURIComponent(pathname);
    } catch {
        return undefined;
    }
    const normalized = path.posix.normalize(decoded);
    if (normalized.includes("\0")) return undefined;
    const filePath = path.join(clientRoot, normalized);
    if (filePath !== clientRoot && !filePath.startsWith(clientRoot + path.sep)) return undefined;
    if (!path.extname(filePath)) return undefined;
    try {
        const stats = fs.statSync(filePath);
        return stats.isFile() ? { filePath, stats } : undefined;
    } catch {
        return undefined;
    }
}

function notModified(req, etag, mtime) {
    const ifNoneMatch = req.headers["if-none-match"];
    if (ifNoneMatch && ifNoneMatch.split(",").map(value => value.trim()).includes(etag)) return true;
    const ifModifiedSince = req.headers["if-modified-since"];
    if (ifModifiedSince) {
        const since = Date.parse(ifModifiedSince);
        if (!Number.isNaN(since) && Math.floor(mtime / 1000) * 1000 <= since) return true;
    }
    return false;
}

function parseRange(header, size) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(header || "");
    if (!match) return undefined;
    const [, rawStart, rawEnd] = match;
    if (!rawStart && !rawEnd) return undefined;
    let start = rawStart ? Number(rawStart) : size - Number(rawEnd);
    let end = rawStart ? (rawEnd ? Number(rawEnd) : size - 1) : size - 1;
    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start < 0 || end >= size) return undefined;
    return { start, end };
}

/** Отдаёт статику с долгим кешем, ETag и поддержкой Range. Возвращает true, если запрос обработан. */
function serveStatic(req, res, pathname) {
    if (req.method !== "GET" && req.method !== "HEAD") return false;
    const file = resolveFile(pathname);
    if (!file) return false;

    const { filePath, stats } = file;
    const etag = `W/"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
    const headers = {
        "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        "Cache-Control": cacheControl(pathname),
        "ETag": etag,
        "Last-Modified": stats.mtime.toUTCString(),
        "Accept-Ranges": "bytes",
    };

    if (notModified(req, etag, stats.mtimeMs)) {
        res.writeHead(304, headers);
        res.end();
        return true;
    }

    const range = parseRange(req.headers.range, stats.size);
    if (range) {
        const length = range.end - range.start + 1;
        res.writeHead(206, {
            ...headers,
            "Content-Range": `bytes ${range.start}-${range.end}/${stats.size}`,
            "Content-Length": length,
        });
        if (req.method === "HEAD") {
            res.end();
            return true;
        }
        fs.createReadStream(filePath, { start: range.start, end: range.end }).pipe(res);
        return true;
    }

    res.writeHead(200, { ...headers, "Content-Length": stats.size });
    if (req.method === "HEAD") {
        res.end();
        return true;
    }
    fs.createReadStream(filePath).pipe(res);
    return true;
}

const server = http.createServer((req, res) => {
    const url = req.url || "/";
    const pathname = url.split("?")[0].split("#")[0];
    if (serveStatic(req, res, pathname)) return;
    try {
        ssrHandler(req, res, () => {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not found");
        });
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Internal server error");
        }
    }
});

server.listen(port, host, () => {
    console.log(`[server] listening on http://${host}:${port}`);
    // Прогреваем кеш городов, услуг и статей сразу после старта: первый посетитель не платит за холодный CMS.
    setTimeout(() => {
        fetch(`http://127.0.0.1:${port}/`, { headers: { "user-agent": "aicraft-warmup" } })
            .then((response) => response.arrayBuffer())
            .catch(() => undefined);
    }, 1_000).unref?.();
});
