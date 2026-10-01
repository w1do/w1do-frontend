import localCovers from "./blog-covers.json";
import { LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";

interface ApiPost {
  slug: string;
  title: string;
  body: string | null;
  status: string;
  published_at: string;
  is_index: boolean;
  tags: string[];
  cover: { url: string; alt: string } | null;
  seo: { title?: string; description?: string; json_ld?: Record<string, unknown> } | null;
}

export interface BlogPost {
  id: string;
  body: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    modifiedDate: string | undefined;
    image: string | undefined;
    tags: string[];
    isIndex: boolean;
    seo: { title: string; description: string };
  };
}

function mapPost(post: ApiPost): BlogPost {
  const description = post.seo?.description || (post.body || "").replace(/[#*_`]/g, "").slice(0,160);
  const originalDate = post.seo?.json_ld?.datePublished;
  const modifiedDate = post.seo?.json_ld?.dateModified;
  return {
    id: post.slug,
    body: post.body || "",
    data: {
      title: post.title,
      description,
      pubDate: new Date(typeof originalDate === "string" ? originalDate : post.published_at),
      modifiedDate: typeof modifiedDate === "string" ? modifiedDate : undefined,
      image: post.cover?.url ? (localCovers as Record<string, string>)[post.cover.url] || post.cover.url : undefined,
      tags: post.tags || [],
      isIndex: post.is_index,
      seo: { title: post.seo?.title || post.title, description },
    },
  };
}

async function request(path: string, cursor?: string, category?: number): Promise<Response> {
  if (!LEADS_API_KEY) throw new Error("W1DO API key is not configured.");
  const url = new URL(path, LEADS_API_BASE_URL || "https://backend.w1do.ru");
  url.searchParams.set("locale", "ru");
  if (cursor) url.searchParams.set("cursor", cursor);
  if (category) url.searchParams.set("category", String(category));
  return fetch(url, {
    headers: { Accept: "application/json", "X-Api-Key": LEADS_API_KEY },
    signal: AbortSignal.timeout(10000),
  });
}

export async function getBlogPosts(category?: number): Promise<BlogPost[]> {
  const posts: ApiPost[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;
  do {
    const response = await request("/api/v1/content/posts", cursor, category);
    if (!response.ok) throw new Error(`W1DO posts API returned HTTP ${response.status}.`);
    const result = await response.json() as { data: ApiPost[]; meta?: { next_cursor?: string | null } };
    if (!Array.isArray(result.data)) throw new Error("W1DO posts API returned invalid data.");
    posts.push(...result.data);
    cursor = result.meta?.next_cursor || undefined;
    if (cursor && seen.has(cursor)) throw new Error("W1DO posts API repeated a cursor.");
    if (cursor) seen.add(cursor);
  } while (cursor);
  return posts.filter(post => post.status === "published").map(mapPost)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  const response = await request(`/api/v1/content/posts/${encodeURIComponent(slug)}`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`W1DO posts API returned HTTP ${response.status}.`);
  const result = await response.json() as { data: ApiPost };
  return result.data?.status === "published" ? mapPost(result.data) : undefined;
}
