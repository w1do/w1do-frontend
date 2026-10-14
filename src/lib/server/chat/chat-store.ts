import { createHash, createHmac } from "node:crypto";
import { CHAT_LEAD_HASH_SECRET } from "astro:env/server";
import { getChatKv } from "../redis";

export const LEAD_DUPLICATE_TTL_MS = 30 * 60_000;

let warnedPlainHash = false;

// HMAC keeps the phone marker from being brute-forced by someone who can read Redis.
function phoneHash(digits: string): string {
    if (CHAT_LEAD_HASH_SECRET) {
        return createHmac("sha256", CHAT_LEAD_HASH_SECRET).update(digits).digest("hex");
    }
    if (!warnedPlainHash) {
        warnedPlainHash = true;
        console.error("[chat] CHAT_LEAD_HASH_SECRET is not set, using plain hash");
    }
    return createHash("sha256").update(digits).digest("hex");
}

const phoneKey = (digits: string) => `chat:lead-phone:${phoneHash(digits)}`;

// Throws RedisUnavailableError when Redis cannot answer.
export async function claimLeadPhone(digits: string): Promise<boolean> {
    const kv = await getChatKv();
    return kv.setIfAbsent(phoneKey(digits), "1", LEAD_DUPLICATE_TTL_MS);
}

export async function releaseLeadPhone(digits: string): Promise<void> {
    const kv = await getChatKv();
    await kv.del(phoneKey(digits));
}
