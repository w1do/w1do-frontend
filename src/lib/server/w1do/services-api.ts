import { LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";

const DEFAULT_API_URL = "https://backend.w1do.ru";
const COLLECTION_SLUG = "services";
const PAGE_SIZE = 48;

export interface ServiceApiEntry {
  title?: string;
  slug?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  values?: Record<string, unknown>;
}

interface ApiResponse {
  data?: ServiceApiEntry[];
  meta?: { last_page?: number };
}

export async function fetchServiceEntries(): Promise<ServiceApiEntry[]> {
  if (!LEADS_API_KEY) throw new Error("W1DO API key is not configured.");
  const baseUrl = LEADS_API_BASE_URL || DEFAULT_API_URL;
  const entries: ServiceApiEntry[] = [];
  let lastPage = 1;

  for (let page = 1; page <= lastPage; page += 1) {
    const url = new URL(`/api/v1/content/collections/${COLLECTION_SLUG}/entries`, baseUrl);
    url.searchParams.set("locale", "ru");
    url.searchParams.set("per_page", String(PAGE_SIZE));
    url.searchParams.set("page", String(page));
    const response = await fetch(url, {
      headers: { Accept: "application/json", "X-Api-Key": LEADS_API_KEY },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`W1DO services API returned HTTP ${response.status}.`);
    const result = await response.json() as ApiResponse;
    if (!Array.isArray(result.data)) throw new Error("W1DO services API returned invalid data.");
    entries.push(...result.data);
    lastPage = Math.max(1, result.meta?.last_page || 1);
  }

  return entries;
}
