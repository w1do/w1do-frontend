import type { APIRoute } from "astro";
import { getBlogCategories } from "../lib/server/w1do/blog-categories";
import { getOpenSourceProjects } from "../lib/server/w1do/opensource";
import { regionalSitemap } from "../lib/server/regional-sitemap";

export const prerender = false;
export const GET: APIRoute = async ({ site }) => {
  const [categories, projects] = await Promise.all([getBlogCategories(), getOpenSourceProjects()]);
  const paths = ["/categories", "/opensource",
    ...categories.filter(category => category.isIndex).map(category => `/categories/${category.slug}`),
    ...projects.map(project => `/opensource/${encodeURIComponent(project.id)}`),
  ];
  return regionalSitemap(paths.map(path => ({ path, changefreq: "monthly", priority: 0.6 })),
    site?.href.replace(/\/$/, "") || "https://w1do.ru");
};
