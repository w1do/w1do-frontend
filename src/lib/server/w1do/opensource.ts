import { LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";

const DEFAULT_API_URL = "https://backend.w1do.ru";
const COLLECTION_SLUG = "opensource";
const PAGE_SIZE = 48;

interface ApiEntry {
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

export interface OpenSourceFaq {
  question: string;
  answer: string;
}

export interface OpenSourceEntry {
  id: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  categorySlug: string;
  image: string;
  repositoryUrl: string;
  purposeHtml: string;
  solvesHtml: string;
  installationHtml: string;
  bodyHtml: string;
  projectFaqs: OpenSourceFaq[];
  sectionTitle: string;
  sectionHref: string;
  infoTitle: string;
  infoItems: [string, string][];
}

const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseFaqs(html: string): OpenSourceFaq[] {
  const pattern = /<h[23][^>]*>([\s\S]*?)<\/h[23]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  return [...html.matchAll(pattern)].map((match) => ({
    question: plainText(match[1]),
    answer: plainText(match[2]),
  })).filter((faq) => faq.question && faq.answer);
}

function mapEntry(entry: ApiEntry): OpenSourceEntry | null {
  if (!entry.slug || !entry.title) return null;
  const values = entry.values || {};
  const repositoryUrl = text(values.repository_url);
  const category = text(values.category, "Open Source");

  return {
    id: entry.slug,
    title: entry.title,
    description: text(values.description),
    seoTitle: text(entry.seo_title, entry.title),
    seoDescription: text(entry.seo_description, text(values.description)),
    category,
    categorySlug: text(values.category_slug, "opensource"),
    image: text(values.cover),
    repositoryUrl,
    purposeHtml: text(values.purpose),
    solvesHtml: text(values.solves),
    installationHtml: text(values.installation),
    bodyHtml: text(values.body),
    projectFaqs: parseFaqs(text(values.faq)),
    sectionTitle: "OpenSource",
    sectionHref: "/opensource",
    infoTitle: "Информация о проекте",
    infoItems: [
      ["Название", entry.title],
      ["Категория", category],
      ["Репозиторий", repositoryUrl ? `<a href="${repositoryUrl}" rel="noopener" target="_blank">Открыть</a>` : ""],
    ],
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
  if (!response.ok) throw new Error(`W1DO opensource API returned HTTP ${response.status}.`);

  return response.json() as Promise<ApiResponse>;
}

export async function getOpenSourceProjects(): Promise<OpenSourceEntry[]> {
  const firstPage = await fetchPage(1);
  const entries = firstPage.data;
  if (!Array.isArray(entries)) throw new Error("W1DO opensource API returned invalid data.");

  const lastPage = Math.max(1, firstPage.meta?.last_page || 1);
  for (let page = 2; page <= lastPage; page += 1) {
    const response = await fetchPage(page);
    if (!Array.isArray(response.data)) throw new Error("W1DO opensource API returned invalid data.");
    entries.push(...response.data);
  }

  return entries.map(mapEntry).filter((entry): entry is OpenSourceEntry => entry !== null);
}

export async function getOpenSourceProjectBySlug(slug: string): Promise<OpenSourceEntry | undefined> {
  const entries = await getOpenSourceProjects();
  return entries.find((entry) => entry.id === slug);
}
