import { getCollection } from "astro:content";
import type { SitemapPage } from "./regional-sitemap";
import { getCmsSitemapPages } from "./w1do/sitemap";
import { getBlogPosts } from "./w1do/blog";
import { getBlogCategories } from "./w1do/blog-categories";
import { getCases } from "./w1do/cases";
import { getOpenSourceProjects } from "./w1do/opensource";
import { getServices } from "./w1do/services";
import { mergeSitemapPages } from "./sitemap-merge.ts";

let cache: { pages: SitemapPage[]; expiresAt: number } | undefined;
let pending: Promise<SitemapPage[]> | undefined;

export async function getFullSitemapPages(): Promise<SitemapPage[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.pages;
  if (pending) return pending;
  pending = collectPages().then(pages => {
    cache = { pages, expiresAt: Date.now() + 60_000 };
    return pages;
  }).finally(() => { pending = undefined; });
  return pending;
}

async function collectPages(): Promise<SitemapPage[]> {
  const [cms, posts, categories, cases, projects, services, hubs, spokes] = await Promise.all([
    getCmsSitemapPages(), getBlogPosts(), getBlogCategories(), getCases(), getOpenSourceProjects(), getServices(),
    getCollection("landingCluster", ({ data }) => data.hub === true), getCollection("landingSpoke"),
  ]);
  const paths = ["/", "/about", "/contact", "/services", "/pricing", "/testimonials", "/knowledge",
    "/blog", "/case", "/blog/categories", "/opensource",
    ...Array.from({ length: Math.max(0, Math.ceil(posts.length / 10) - 1) }, (_, i) => `/blog/page/${i + 2}`),
    ...categories.filter(category => category.isIndex).map(category => `/blog/categories/${category.slug}`),
    ...cases.map(entry => `/case/${encodeURIComponent(entry.id)}`),
    ...projects.map(entry => `/opensource/${encodeURIComponent(entry.id)}`),
    ...services.map(service => service.url),
    ...hubs.map(hub => `/${hub.id}`),
    ...spokes.map(entry => `/${entry.data.cluster}/${entry.id.split("/").pop()}`),
  ];
  const excludedPaths = [
    ...categories.filter(category => !category.isIndex).map(category => `/blog/categories/${category.slug}`),
    ...posts.filter(post => !post.data.isIndex).map(post => post.url),
  ];
  const postPaths = new Map(posts.map(post => [`/blog/${post.id}`, post.url]));
  return mergeSitemapPages([
    ...paths.map(path => ({ path, changefreq: "weekly", priority: path === "/" ? 1 : 0.7 })),
    ...cms.map(page => ({ ...page, path: postPaths.get(page.path) || page.path })),
    ...posts.filter(post => post.data.isIndex).map(post => ({ path: post.url,
      lastmod: post.data.modifiedDate || post.data.pubDate.toISOString(), changefreq: "monthly", priority: 0.7 })),
  ], excludedPaths);
}
