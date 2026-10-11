import { LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";

const DEFAULT_API_URL = "https://backend.w1do.ru";
const COLLECTION_SLUG = "guides";
const PAGE_SIZE = 48;

interface ApiEntry {
  status?: string | null;
  title?: string;
  slug?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  values?: Record<string, unknown>;
}

interface ApiResponse {
  data?: ApiEntry[];
  meta?: { last_page?: number };
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  rubric: string;
  rubricSlug: string;
  image: string;
  bodyHtml: string;
  seoTitle: string;
  seoDescription: string;
}

export interface GuideRubric {
  label: string;
  slug: string;
}

const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

function mapEntry(entry: ApiEntry): Guide | null {
  if (!entry.slug || !entry.title) return null;
  const values = entry.values || {};
  const rubric = text(values.rubric);
  const rubricSlug = text(values.rubric_slug);
  if (!rubric || !rubricSlug) return null;

  return {
    id: entry.slug,
    title: entry.title,
    description: text(values.description),
    rubric,
    rubricSlug,
    image: text(values.cover),
    bodyHtml: text(values.body),
    seoTitle: text(entry.seo_title, entry.title),
    seoDescription: text(entry.seo_description, text(values.description)),
  };
}

async function fetchPage(page: number): Promise<ApiResponse> {
  if (!LEADS_API_KEY) return { data: [], meta: { last_page: 1 } };

  const baseUrl = LEADS_API_BASE_URL || DEFAULT_API_URL;
  const url = new URL(`/api/v1/content/collections/${COLLECTION_SLUG}/entries`, baseUrl);
  url.searchParams.set("locale", "ru");
  url.searchParams.set("per_page", String(PAGE_SIZE));
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    headers: { Accept: "application/json", "X-Api-Key": LEADS_API_KEY },
    signal: AbortSignal.timeout(10000),
  });

  if (response.status === 404) return { data: [], meta: { last_page: 1 } };
  if (!response.ok) throw new Error(`W1DO guides API returned HTTP ${response.status}.`);
  return response.json() as Promise<ApiResponse>;
}

async function fetchGuides(): Promise<Guide[]> {
  const firstPage = await fetchPage(1);
  const entries = Array.isArray(firstPage.data) ? firstPage.data : [];
  const lastPage = Math.max(1, firstPage.meta?.last_page || 1);
  for (let page = 2; page <= lastPage; page += 1) {
    const response = await fetchPage(page);
    if (Array.isArray(response.data)) entries.push(...response.data);
  }
  return entries
    .filter(entry => entry.status === "published")
    .map(mapEntry)
    .filter((guide): guide is Guide => guide !== null);
}

let cache: { guides: Guide[]; expiresAt: number } | undefined;
let pending: Promise<Guide[]> | undefined;

export async function getGuides(): Promise<Guide[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.guides;
  if (pending) return pending;
  pending = fetchGuides().then(guides => {
    cache = { guides, expiresAt: Date.now() + 60_000 };
    return guides;
  }).finally(() => { pending = undefined; });
  return pending;
}

export async function getGuideRubrics(): Promise<GuideRubric[]> {
  const guides = await getGuides();
  const rubrics = new Map<string, GuideRubric>();
  for (const guide of guides) {
    if (!rubrics.has(guide.rubricSlug)) {
      rubrics.set(guide.rubricSlug, { label: guide.rubric, slug: guide.rubricSlug });
    }
  }
  return [...rubrics.values()];
}

export async function getGuideBySlug(slug: string): Promise<Guide | undefined> {
  const guides = await getGuides();
  return guides.find(guide => guide.id === slug);
}
