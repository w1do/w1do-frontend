import { getRedis } from "./redis";

/**
 * Серверный кеш с устареванием и фоновым обновлением (stale-while-revalidate).
 * Первый слой — память процесса, второй — Redis (общий для всех инстансов и перезапусков).
 * Загрузчик выполняется один раз на ключ: параллельные запросы ждут один и тот же промис.
 */

export interface CacheOptions {
    /** Сколько значение считается свежим, мс. */
    ttlMs?: number;
    /** Сколько значение можно отдавать устаревшим, пока в фоне идёт обновление, мс. */
    staleMs?: number;
    /** Хранить в Redis. По умолчанию включено, если Redis настроен. */
    redis?: boolean;
}

interface MemoryEntry {
    value: unknown;
    freshUntil: number;
    staleUntil: number;
}

const DEFAULT_TTL_MS = 300_000;
const DEFAULT_STALE_MS = 86_400_000;
const MAX_MEMORY_ENTRIES = 500;
const REDIS_TIMEOUT_MS = 250;
const REDIS_PREFIX = "aicraft:cache:v1:";

const memory = new Map<string, MemoryEntry>();
const inflight = new Map<string, Promise<unknown>>();
// После первой неудачи Redis не дёргаем 30 секунд: кеш не должен тормозить запросы.
let redisBackoffUntil = 0;

function remember(key: string, entry: MemoryEntry): void {
    memory.delete(key);
    memory.set(key, entry);
    while (memory.size > MAX_MEMORY_ENTRIES) {
        const oldest = memory.keys().next().value;
        if (oldest === undefined) break;
        memory.delete(oldest);
    }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | undefined> {
    return Promise.race([
        promise.catch(() => undefined),
        new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), timeoutMs)),
    ]);
}

function redisAllowed(): boolean {
    return Date.now() >= redisBackoffUntil;
}

function redisFailed(): void {
    redisBackoffUntil = Date.now() + 30_000;
}

async function redisRead(key: string): Promise<MemoryEntry | undefined> {
    if (!redisAllowed()) return undefined;
    const client = await withTimeout(getRedis(), REDIS_TIMEOUT_MS);
    if (!client) {
        redisFailed();
        return undefined;
    }
    const raw = await withTimeout(client.get(REDIS_PREFIX + key), REDIS_TIMEOUT_MS);
    if (!raw) return undefined;
    try {
        const parsed = JSON.parse(raw) as { value?: unknown; freshUntil?: number };
        if (typeof parsed.freshUntil !== "number") return undefined;
        return { value: parsed.value, freshUntil: parsed.freshUntil, staleUntil: Number.POSITIVE_INFINITY };
    } catch {
        return undefined;
    }
}

function redisWrite(key: string, entry: MemoryEntry): void {
    if (!redisAllowed()) return;
    void (async () => {
        const client = await withTimeout(getRedis(), REDIS_TIMEOUT_MS);
        if (!client) {
            redisFailed();
            return;
        }
        const ttlMs = Math.max(1_000, Math.min(entry.staleUntil - Date.now(), 86_400_000));
        const payload = JSON.stringify({ value: entry.value, freshUntil: entry.freshUntil });
        await withTimeout(client.set(REDIS_PREFIX + key, payload, { PX: ttlMs }), REDIS_TIMEOUT_MS);
    })();
}

async function load<T>(
    key: string,
    loader: () => Promise<T>,
    ttlMs: number,
    staleMs: number,
    useRedis: boolean,
): Promise<T> {
    const running = inflight.get(key);
    if (running) return running as Promise<T>;

    const task = (async () => {
        try {
            const value = await loader();
            const now = Date.now();
            const entry: MemoryEntry = { value, freshUntil: now + ttlMs, staleUntil: now + staleMs };
            remember(key, entry);
            if (useRedis) redisWrite(key, entry);
            return value;
        } finally {
            inflight.delete(key);
        }
    })();

    inflight.set(key, task);
    return task;
}

export async function cached<T>(key: string, options: CacheOptions, loader: () => Promise<T>): Promise<T> {
    const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
    const staleMs = Math.max(ttlMs, options.staleMs ?? DEFAULT_STALE_MS);
    const useRedis = options.redis !== false;
    const now = Date.now();

    const local = memory.get(key);
    if (local && now < local.freshUntil) return local.value as T;
    if (local && now < local.staleUntil) {
        // Отдаём устаревшее значение сразу, обновляем в фоне.
        void load(key, loader, ttlMs, staleMs, useRedis).catch(() => undefined);
        return local.value as T;
    }

    if (useRedis) {
        const remote = await redisRead(key);
        if (remote) {
            remember(key, { value: remote.value, freshUntil: remote.freshUntil, staleUntil: now + staleMs });
            if (now < remote.freshUntil) return remote.value as T;
            void load(key, loader, ttlMs, staleMs, useRedis).catch(() => undefined);
            return remote.value as T;
        }
    }

    return load(key, loader, ttlMs, staleMs, useRedis);
}
