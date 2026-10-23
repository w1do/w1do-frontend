import { SITE_ORIGIN } from "../lib/regions";
import type { APIRoute } from "astro";
import { xmlEscape, xmlResponse } from "../lib/server/regional-sitemap";

export const GET: APIRoute = () => {
  const baseUrl = SITE_ORIGIN;
  const sitemaps = ["sitemap.xml"];
  return xmlResponse(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps.map(path =>
    `<sitemap><loc>${xmlEscape(`${baseUrl}/${path}`)}</loc></sitemap>`).join("")}</sitemapindex>`);
};
