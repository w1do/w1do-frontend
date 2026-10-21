import { RAG_API_KEY, RAG_API_URL, RAG_PROJECT_ID } from "astro:env/server";
import { requestRagContext, type RagResult } from "./rag-client";

export type { RagFailure, RagResult, RagSource } from "./rag-client";

export function fetchRagContext(query: string): Promise<RagResult> {
    return requestRagContext(query, { apiUrl: RAG_API_URL, apiKey: RAG_API_KEY, projectId: RAG_PROJECT_ID });
}
