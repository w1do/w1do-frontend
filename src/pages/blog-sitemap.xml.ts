import type { APIRoute } from "astro";
import { getBlogPosts } from "../lib/server/w1do/blog";
import { regionalSitemap, type SitemapPage } from "../lib/server/regional-sitemap";

export const prerender = false;
export const GET: APIRoute = async ({ site }) => {
  const posts = await getBlogPosts();
  const pages: SitemapPage[] = [{ path: "/blog" }];
  for (let page = 2; page <= Math.ceil(posts.length / 10); page += 1) pages.push({ path: `/blog/page/${page}` });
  pages.push(...posts.filter(post => post.data.isIndex).map(post => ({
    path: `/blog/${encodeURIComponent(post.id)}`,
    lastmod: post.data.modifiedDate || post.data.pubDate.toISOString(),
    changefreq: "monthly", priority: 0.7,
  })));
  return regionalSitemap(pages, site?.href.replace(/\/$/, "") || "https://w1do.ru");
};
