export const RAG_TIMEOUT_MS = 10_000;
export const RAG_MAX_CHARS = 4000;

export interface RagConfig {
    apiUrl?: string;
    apiKey?: string;
    projectId?: string;
}

export interface RagSource {
    source_id: string;
    title: string;
    version: number | string;
}

export type RagFailure = "config" | "auth" | "timeout" | "network" | "upstream";

export type RagResult = { ok: true; context: string; sources: RagSource[] } | { ok: false; reason: RagFailure };

export type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

export async function requestRagContext(
    query: string,
    config: RagConfig,
    fetchImpl: FetchLike = fetch,
    timeoutMs: number = RAG_TIMEOUT_MS,
): Promise<RagResult> {
    const apiUrl = config.apiUrl?.trim().replace(/\/+$/, "");
    const apiKey = config.apiKey?.trim();
    const projectId = config.projectId?.trim();

    if (!apiUrl || !apiKey || !projectId) {
        console.error("[chat] RAG is not configured — answering without the knowledge base.");
        return { ok: false, reason: "config" };
    }

    let response: Response;

    try {
        response = await fetchImpl(`${apiUrl}/context`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Api-Key": apiKey,
            },
            body: JSON.stringify({ project_id: projectId, query, max_chars: RAG_MAX_CHARS }),
            signal: AbortSignal.timeout(timeoutMs),
        });
    } catch (error) {
        if (error instanceof Error && error.name === "TimeoutError") {
            console.error("[chat] RAG request timed out");
            return { ok: false, reason: "timeout" };
        }
        console.error("[chat] RAG request failed:", error instanceof Error ? error.name : "unknown");
        return { ok: false, reason: "network" };
    }

    const data: any = await response.json().catch(() => null);

    if (!response.ok) {
        console.error(
            `[chat] RAG rejected the request: status=${response.status}`,
            `code=${data?.detail?.code ?? "unknown"}`,
        );
        return { ok: false, reason: response.status === 401 || response.status === 403 ? "auth" : "upstream" };
    }

    if (typeof data?.context !== "string") {
        console.error("[chat] RAG returned an unexpected response");
        return { ok: false, reason: "upstream" };
    }

    const sources: RagSource[] = Array.isArray(data.sources) ? data.sources : [];
    return { ok: true, context: data.context.trim(), sources };
}
