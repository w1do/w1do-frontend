import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { regionalSitemap } from "../lib/server/regional-sitemap";
import { getCmsSitemapPages } from "../lib/server/w1do/sitemap";
import { getBlogPosts } from "../lib/server/w1do/blog";

export const GET: APIRoute = async ({ site }) => {
  const [cmsPages, posts, hubs, spokes] = await Promise.all([
    getCmsSitemapPages(), getBlogPosts(), getCollection("landingCluster", ({ data }) => data.hub === true), getCollection("landingSpoke"),
  ]);
  const cmsPaths = new Set(cmsPages.map(page => page.path));
  const paths = ["/", "/about", "/contact", "/services", "/pricing", "/testimonials", "/knowledge", "/blog", "/case", "/categories", "/opensource",
    ...Array.from({ length: Math.max(0, Math.ceil(posts.length / 10) - 1) }, (_, index) => `/blog/page/${index + 2}`),
    ...hubs.map(hub => `/${hub.id}`),
    ...spokes.map(entry => `/${entry.data.cluster}/${entry.id.split("/").pop()}`),
  ];
  return regionalSitemap(paths.filter(path => !cmsPaths.has(path)).map(path => ({ path, changefreq: "weekly", priority: path === "/" ? 1 : 0.7 })),
    site?.href.replace(/\/$/, "") || "https://w1do.ru", true);
};
