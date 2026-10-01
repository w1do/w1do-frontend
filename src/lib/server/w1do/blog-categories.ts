import { LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  isIndex: boolean;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  image?: string;
}

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  full_path?: string;
  is_index: boolean;
  seo?: { title?: string; description?: string; keywords?: string; og_image?: string };
  children?: ApiCategory[];
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  if (!LEADS_API_KEY) throw new Error("W1DO API key is not configured.");
  const url = new URL("/api/v1/content/categories", LEADS_API_BASE_URL || "https://backend.w1do.ru");
  const response = await fetch(url, {
    headers: { Accept: "application/json", "X-Api-Key": LEADS_API_KEY },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`W1DO categories API returned HTTP ${response.status}.`);
  const result = await response.json() as { data: ApiCategory[] };
  if (!Array.isArray(result.data)) throw new Error("W1DO categories API returned invalid data.");
  const flatten = (categories: ApiCategory[]): ApiCategory[] =>
    categories.flatMap(category => [category, ...flatten(category.children || [])]);
  return flatten(result.data).map(category => ({
    id: category.id,
    name: category.name,
    slug: category.full_path || category.slug,
    isIndex: category.is_index,
    seoTitle: category.seo?.title || category.name,
    seoDescription: category.seo?.description || `Статьи по теме «${category.name}» в блоге W1DO.`,
    keywords: category.seo?.keywords || category.name,
    image: category.seo?.og_image,
  }));
}
