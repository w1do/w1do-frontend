import { createClient } from "redis";
import { REDIS_URL } from "astro:env/server";
import type { ChatKv } from "./chat/chat-state";

type ChatRedis = ReturnType<typeof createClient>;

export class RedisUnavailableError extends Error {
    constructor() {
        super("redis unavailable");
        this.name = "RedisUnavailableError";
    }
}

const LOG_INTERVAL_MS = 60_000;
const CONNECT_TIMEOUT_MS = 2000;
const COMMAND_TIMEOUT_MS = 2000;

let client: ChatRedis | undefined;
let connecting: Promise<ChatRedis> | undefined;
let lastLoggedAt = 0;

// The message is fixed: the URL and the password must never reach the log.
export function logRedisUnavailable(): void {
    const now = Date.now();
    if (now - lastLoggedAt < LOG_INTERVAL_MS) return;
    lastLoggedAt = now;
    console.error("[chat] redis unavailable");
}

let lastNoPasswordLoggedAt = 0;

function urlHasPassword(url: string): boolean {
    try {
        return new URL(url).password !== "";
    } catch {
        return false;
    }
}

export async function getRedis(): Promise<ChatRedis> {
    if (!REDIS_URL) {
        logRedisUnavailable();
        throw new RedisUnavailableError();
    }

    // Without a password the server would accept anyone who can reach the port, so no connection is made.
    if (!urlHasPassword(REDIS_URL)) {
        const now = Date.now();
        if (now - lastNoPasswordLoggedAt >= LOG_INTERVAL_MS) {
            lastNoPasswordLoggedAt = now;
            console.error("[chat] REDIS_URL has no password");
        }
        throw new RedisUnavailableError();
    }

    if (client?.isReady) return client;

    if (connecting) return connecting;

    // A client that exists but is not ready is reconnecting: requests do not wait for it.
    if (client) {
        logRedisUnavailable();
        throw new RedisUnavailableError();
    }

    const next = createClient({
        url: REDIS_URL,
        disableOfflineQueue: true,
        commandOptions: { timeout: COMMAND_TIMEOUT_MS },
        socket: {
            connectTimeout: CONNECT_TIMEOUT_MS,
            reconnectStrategy: (retries) => Math.min(500 * (retries + 1), 5000),
        },
    });
    // The error object may contain the address, so it is not logged.
    next.on("error", () => logRedisUnavailable());

    const pending = (async (): Promise<ChatRedis> => {
        // With a numeric reconnectStrategy node-redis keeps connect() pending instead of rejecting,
        // so the 2 s limit is enforced here as well.
        let timer: ReturnType<typeof setTimeout> | undefined;
        const connected = next.connect();
        connected.catch(() => undefined); // a late failure after the timeout must not be unhandled
        try {
            await Promise.race([
                connected,
                new Promise<never>((_, reject) => {
                    timer = setTimeout(() => reject(new Error("connect timeout")), CONNECT_TIMEOUT_MS);
                }),
            ]);
            client = next;
            return next;
        } catch {
            try {
                next.destroy();
            } catch {
                // nothing else to release
            }
            client = undefined;
            logRedisUnavailable();
            throw new RedisUnavailableError();
        } finally {
            clearTimeout(timer);
            connecting = undefined;
        }
    })();

    connecting = pending;
    return pending;
}

// Compare-and-delete: a lock is released only by the token that acquired it.
const DEL_IF_EQUALS_SCRIPT = 'if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) else return 0 end';

// Storage port for chat-state.ts. Every call maps failures to RedisUnavailableError.
export async function getChatKv(): Promise<ChatKv> {
    const redis = await getRedis();
    const guard = async <T>(operation: () => Promise<T>): Promise<T> => {
        try {
            return await operation();
        } catch {
            logRedisUnavailable();
            throw new RedisUnavailableError();
        }
    };

    return {
        get: (key) => guard(() => redis.get(key)),
        setExpireAt: (key, value, expireAtSeconds) =>
            guard(async () => {
                await redis.set(key, value, { EXAT: expireAtSeconds });
            }),
        setIfAbsent: (key, value, ttlMs) =>
            guard(async () => (await redis.set(key, value, { PX: ttlMs, NX: true })) === "OK"),
        del: (key) =>
            guard(async () => {
                await redis.del(key);
            }),
        delIfEquals: (key, value) =>
            guard(async () => {
                await redis.sendCommand(["EVAL", DEL_IF_EQUALS_SCRIPT, "1", key, value]);
            }),
    };
}
