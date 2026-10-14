export const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
export const RATE_LIMIT_PER_CLIENT = 20;
export const RATE_LIMIT_GLOBAL_WINDOW_MS = 60 * 60_000;
export const RATE_LIMIT_GLOBAL = 300;
const MAX_TRACKED_CLIENTS = 5000;

interface Bucket {
    windowStart: number;
    count: number;
}

interface LimiterConfig {
    windowMs: number;
    perClient: number;
    globalWindowMs: number;
    global: number;
}

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

// With no trusted proxy the key is the TCP address. Astro sets clientAddress from the FIRST X-Forwarded-For
// value, which the client controls, so a request that carries the header gets one shared key instead
// (behind a proxy this means one shared limit, the documented cost of TRUSTED_PROXY_HOPS = 0).
// With trustedProxyHops >= 1 each trusted proxy appends one entry, so the N-th entry from the right is the
// address it saw.
export function clientKeyFrom(request: Request, clientAddress: string | undefined, trustedProxyHops: number): string {
    const hops = Number.isInteger(trustedProxyHops) && trustedProxyHops > 0 ? trustedProxyHops : 0;
    const forwardedHeader = request.headers.get("x-forwarded-for");
    if (hops === 0) {
        return forwardedHeader === null ? clientAddress || "unknown" : "untrusted-forwarded";
    }

    const forwarded = forwardedHeader ?? "";
    const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= hops) return parts[parts.length - hops];
    return clientAddress || "unknown";
}

const retryAfter = (bucket: Bucket, windowMs: number, now: number): number =>
    Math.max(1, Math.ceil((bucket.windowStart + windowMs - now) / 1000));

// Counters live in the closure of one limiter, in process memory only.
function createLimiter(config: LimiterConfig): (clientKey: string, now?: number) => RateLimitResult {
    const clients = new Map<string, Bucket>();
    let globalBucket: Bucket = { windowStart: 0, count: 0 };

    return (clientKey: string, now: number = Date.now()): RateLimitResult => {
        if (now - globalBucket.windowStart >= config.globalWindowMs) {
            globalBucket = { windowStart: now, count: 0 };
        }

        let bucket = clients.get(clientKey);
        if (!bucket || now - bucket.windowStart >= config.windowMs) {
            bucket = { windowStart: now, count: 0 };
        }

        if (bucket.count >= config.perClient) {
            return { allowed: false, retryAfterSeconds: retryAfter(bucket, config.windowMs, now) };
        }

        if (globalBucket.count >= config.global) {
            return { allowed: false, retryAfterSeconds: retryAfter(globalBucket, config.globalWindowMs, now) };
        }

        if (!clients.has(clientKey) && clients.size >= MAX_TRACKED_CLIENTS) {
            for (const [key, value] of clients) {
                if (now - value.windowStart >= config.windowMs) {
                    clients.delete(key);
                }
            }
            if (clients.size >= MAX_TRACKED_CLIENTS) {
                clients.clear();
            }
        }

        bucket.count += 1;
        globalBucket.count += 1;
        clients.set(clientKey, bucket);
        return { allowed: true };
    };
}

export const checkRateLimit = createLimiter({
    windowMs: RATE_LIMIT_WINDOW_MS,
    perClient: RATE_LIMIT_PER_CLIENT,
    globalWindowMs: RATE_LIMIT_GLOBAL_WINDOW_MS,
    global: RATE_LIMIT_GLOBAL,
});

export const LEAD_LIMIT_WINDOW_MS = 60 * 60_000;
export const LEAD_LIMIT_PER_CLIENT = 2;
export const LEAD_LIMIT_GLOBAL = 30;

export const checkLeadLimit = createLimiter({
    windowMs: LEAD_LIMIT_WINDOW_MS,
    perClient: LEAD_LIMIT_PER_CLIENT,
    globalWindowMs: LEAD_LIMIT_WINDOW_MS,
    global: LEAD_LIMIT_GLOBAL,
});
