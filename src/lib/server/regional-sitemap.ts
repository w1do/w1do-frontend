import { cityPath } from "../regions";
import { defaultCity, getCities } from "./w1do/cities";

export interface SitemapPage {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

export const xmlEscape = (value: string): string => value.replace(/[<>&"']/g, char => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
})[char]!);

export function xmlResponse(xml: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>${xml}`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=60" },
  });
}

export async function regionalSitemap(pages: SitemapPage[], baseUrl: string, includeCityHomes = false): Promise<Response> {
  const allCities = includeCityHomes ? await getCities() : [];
  const defaultCitySlug = includeCityHomes ? defaultCity(allCities).slug : "";
  const cities = allCities.filter(city => !city.seo?.robots?.includes("noindex"));
  const unique = [...new Map(pages.map(page => [page.path, page])).values()];
  const entries: SitemapPage[] = [...unique.filter(page => page.path !== "/"), ...cities.map(city => ({ path: cityPath(city.slug, defaultCitySlug), priority: 1, changefreq: "weekly" }))];
  const urls = entries.map(page => `<url><loc>${xmlEscape(baseUrl + page.path)}</loc>`
    + (page.lastmod ? `<lastmod>${xmlEscape(page.lastmod)}</lastmod>` : "")
    + (page.changefreq ? `<changefreq>${xmlEscape(page.changefreq)}</changefreq>` : "")
    + (page.priority === undefined ? "" : `<priority>${page.priority}</priority>`) + "</url>");
  if (urls.length > 50_000) throw new Error("Regional sitemap exceeds 50,000 URLs; split it into multiple sitemaps.");
  return xmlResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`);
}
