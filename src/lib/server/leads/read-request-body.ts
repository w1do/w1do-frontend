import { Buffer } from "node:buffer";

const READ_TIMEOUT_MS = 10_000;

export async function readBoundedBody(request: Request, maxBytes: number): Promise<Buffer | "too-large" | "unreadable"> {
    if (Number(request.headers.get("content-length")) > maxBytes) return "too-large";
    if (!request.body) return "unreadable";

    const reader = request.body.getReader();
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(READ_TIMEOUT_MS)]);
    const cancel = () => { void reader.cancel().catch(() => undefined); };
    const chunks: Uint8Array[] = [];
    let length = 0;

    signal.addEventListener("abort", cancel, { once: true });
    try {
        if (signal.aborted) {
            cancel();
            return "unreadable";
        }

        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            length += value.byteLength;
            if (length > maxBytes) {
                cancel();
                return "too-large";
            }
            chunks.push(value);
        }

        return signal.aborted ? "unreadable" : Buffer.concat(chunks, length);
    } catch {
        return "unreadable";
    } finally {
        signal.removeEventListener("abort", cancel);
        reader.releaseLock();
    }
}
