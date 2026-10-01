import type { APIRoute } from "astro";
import { getFullSitemapPages } from "../lib/server/full-sitemap";
import { regionalSitemap } from "../lib/server/regional-sitemap";

export const prerender = false;
export const GET: APIRoute = async ({ site }) => {
  try {
    return await regionalSitemap(await getFullSitemapPages(),
      site?.href.replace(/\/$/, "") || "https://w1do.ru", true);
  } catch {
    // Do not present a partial sitemap as complete when a required API is unavailable.
    return new Response("Карта сайта временно недоступна. Попробуйте позже.", {
      status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "60", "Cache-Control": "no-store" },
    });
  }
};
