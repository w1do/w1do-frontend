import type { APIRoute } from "astro";
import { getCases } from "../lib/server/w1do/cases";
import { regionalSitemap } from "../lib/server/regional-sitemap";

export const prerender = false;
export const GET: APIRoute = async ({ site }) => {
  const cases = await getCases();
  const paths = ["/case", ...cases.map(({ id }) => `/case/${encodeURIComponent(id)}`)];
  return regionalSitemap(paths.map(path => ({ path, changefreq: "monthly", priority: 0.7 })),
    site?.href.replace(/\/$/, "") || "https://w1do.ru");
};
