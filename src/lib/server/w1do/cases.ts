import { LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";

const DEFAULT_API_URL = "https://backend.w1do.ru";
const COLLECTION_SLUG = "cases";
const PAGE_SIZE = 48;

interface CaseApiEntry {
  title?: string;
  slug?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  values?: Record<string, unknown>;
}

interface CaseApiResponse {
  data?: CaseApiEntry[];
  meta?: { last_page?: number };
  error?: { message?: string };
}

export interface CaseFaq {
  question: string;
  answer: string;
}

export interface CaseChallenge {
  title: string;
  description: string;
  image: string;
  points: string[];
}

export interface CaseApproachStep {
  title: string;
  description: string;
}

export interface CaseEntry {
  id: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  categorySlug: string;
  image: string;
  clientName: string;
  location: string;
  timeline: string;
  challenges: CaseChallenge[];
  approach: CaseApproachStep[];
  approachConclusion: string;
  bodyHtml: string;
  projectFaqs: CaseFaq[];
}

const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

function plainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFaqs(html: string): CaseFaq[] {
  const faqs: CaseFaq[] = [];
  const pattern = /<h[23][^>]*>([\s\S]*?)<\/h[23]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;

  for (const match of html.matchAll(pattern)) {
    const question = plainText(match[1]);
    const answer = plainText(match[2]);
    if (question && answer) faqs.push({ question, answer });
  }

  return faqs;
}

function parseChallenges(html: string): CaseChallenge[] {
  return html.split(/(?=<h3\b)/i).flatMap((section) => {
    const titleMatch = section.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    if (!titleMatch) return [];

    const rest = section.slice(titleMatch.index! + titleMatch[0].length);
    const paragraphs = [...rest.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    const description = paragraphs.find((match) => !/<img\b/i.test(match[1]));
    const imageTag = rest.match(/<img\b[^>]*>/i)?.[0] || "";
    const image = imageTag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || "";
    const points = [...rest.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((match) => plainText(match[1]))
      .filter(Boolean);

    return [{
      title: plainText(titleMatch[1]),
      description: description ? plainText(description[1]) : "",
      image,
      points,
    }];
  });
}

function parseApproach(html: string): CaseApproachStep[] {
  return html.split(/(?=<h3\b)/i).flatMap((section) => {
    const titleMatch = section.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    if (!titleMatch) return [];

    const rest = section.slice(titleMatch.index! + titleMatch[0].length);
    const description = rest.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "";
    return [{ title: plainText(titleMatch[1]), description: plainText(description) }];
  });
}

function mapEntry(entry: CaseApiEntry): CaseEntry | null {
  if (!entry.slug || !entry.title) return null;
  const values = entry.values || {};
  const faqsHtml = text(values.project_faqs);

  return {
    id: entry.slug,
    title: entry.title,
    description: text(values.description),
    seoTitle: text(entry.seo_title, entry.title),
    seoDescription: text(entry.seo_description, text(values.description)),
    category: text(values.category, "Проект"),
    categorySlug: text(values.category_slug),
    image: text(values.cover),
    clientName: text(values.client_name),
    location: text(values.location),
    timeline: text(values.timeline),
    challenges: parseChallenges(text(values.challenges)),
    approach: parseApproach(text(values.approach)),
    approachConclusion: text(values.approach_conclusion),
    bodyHtml: text(values.body),
    projectFaqs: parseFaqs(faqsHtml),
  };
}

async function fetchPage(page: number): Promise<CaseApiResponse> {
  if (!LEADS_API_KEY) throw new Error("W1DO API key is not configured.");

  const baseUrl = LEADS_API_BASE_URL || DEFAULT_API_URL;
  const url = new URL(`/api/v1/content/collections/${COLLECTION_SLUG}/entries`, baseUrl);
  url.searchParams.set("locale", "ru");
  url.searchParams.set("per_page", String(PAGE_SIZE));
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    headers: { Accept: "application/json", "X-Api-Key": LEADS_API_KEY },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`W1DO cases API returned HTTP ${response.status}.`);
  }

  return response.json() as Promise<CaseApiResponse>;
}

export async function getCases(): Promise<CaseEntry[]> {
  const firstPage = await fetchPage(1);
  const entries = firstPage.data;
  if (!Array.isArray(entries)) throw new Error("W1DO cases API returned invalid data.");

  const lastPage = Math.max(1, firstPage.meta?.last_page || 1);
  for (let page = 2; page <= lastPage; page += 1) {
    const response = await fetchPage(page);
    if (!Array.isArray(response.data)) throw new Error("W1DO cases API returned invalid data.");
    entries.push(...response.data);
  }

  return entries.map(mapEntry).filter((entry): entry is CaseEntry => entry !== null);
}

export async function getCaseBySlug(slug: string): Promise<CaseEntry | undefined> {
  const entries = await getCases();
  return entries.find((entry) => entry.id === slug);
}
