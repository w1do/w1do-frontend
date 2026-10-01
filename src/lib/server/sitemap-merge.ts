import type { SitemapPage } from "./regional-sitemap";

/** CMS metadata wins over generated defaults; publication updates keep the newest date. */
export function mergeSitemapPages(pages: SitemapPage[], excludedPaths: string[] = []): SitemapPage[] {
  const excluded = new Set(excludedPaths);
  const unique = new Map<string, SitemapPage>();
  for (const page of pages) {
    let path = page.path.replace(/\/$/, "") || "/";
    if (path === "/categories" || path.startsWith("/categories/")) path = `/blog${path}`;
    if (["/blog/ai-agent-engineering", "/blog/ai-agents/ai-agent-engineering"].includes(path)) path = "/blog/ai-agents/engineering";
    if (excluded.has(path) || path === "/404" || path.startsWith("/api/") || path.startsWith("/cities/")) continue;
    const previous = unique.get(path);
    const merged = { ...previous, ...page, path };
    if (previous?.lastmod && (!page.lastmod || Date.parse(previous.lastmod) > Date.parse(page.lastmod))) {
      merged.lastmod = previous.lastmod;
    }
    unique.set(path, merged);
  }
  return [...unique.values()].sort((a, b) => a.path.localeCompare(b.path));
}
