import { LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";

const DEFAULT_API_URL = "https://backend.w1do.ru";

interface PageSeo {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
}

interface PageApiEntry {
    title?: string;
    slug?: string;
    body?: string | null;
    status?: string;
    is_index?: boolean;
    path?: string;
    url?: string | null;
    seo?: PageSeo | null;
}

interface PageApiResponse {
    data?: PageApiEntry | null;
}

export interface W1doPage {
    title: string;
    slug: string;
    body: string;
    path: string;
    canonical: string | null;
    isIndex: boolean;
    seoTitle: string;
    seoDescription: string;
}

const validSlug = (slug: string) => /^[a-z0-9-]+$/.test(slug);

function plainText(markdown: string): string {
    return markdown
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#>*_`~-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function description(page: PageApiEntry): string {
    const seoDescription = page.seo?.description?.trim();
    if (seoDescription) return seoDescription;

    const text = plainText(page.body || "");
    return text.length > 180 ? `${text.slice(0, 180).trimEnd()}…` : text;
}

function mapPage(page: PageApiEntry | null | undefined): W1doPage | undefined {
    if (!page?.slug || !page.title || page.status !== "published") return undefined;

    return {
        title: page.title,
        slug: page.slug,
        body: page.body || "",
        path: page.path || `/docs/${page.slug}`,
        canonical: page.seo?.canonical || page.url || null,
        isIndex: page.is_index === true,
        seoTitle: page.seo?.title?.trim() || page.title,
        seoDescription: description(page),
    };
}

export async function getPublishedPageBySlug(slug: string): Promise<W1doPage | undefined> {
    if (!validSlug(slug)) return undefined;
    if (!LEADS_API_KEY) throw new Error("W1DO API key is not configured.");

    const baseUrl = LEADS_API_BASE_URL || DEFAULT_API_URL;
    const url = new URL(`/api/v1/content/pages/${encodeURIComponent(slug)}`, baseUrl);
    const response = await fetch(url, {
        headers: { Accept: "application/json", "X-Api-Key": LEADS_API_KEY },
        signal: AbortSignal.timeout(10000),
    });

    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error(`W1DO pages API returned HTTP ${response.status}.`);

    const envelope = await response.json() as PageApiResponse;
    return mapPage(envelope.data);
}
