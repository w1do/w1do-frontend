import type { APIRoute } from "astro";
import { xmlEscape, xmlResponse } from "../lib/server/regional-sitemap";

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site?.href.replace(/\/$/, "") || "https://w1do.ru";
  const sitemaps = ["sitemap-0.xml", "cms-sitemap.xml"];
  return xmlResponse(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps.map(path =>
    `<sitemap><loc>${xmlEscape(`${baseUrl}/${path}`)}</loc></sitemap>`).join("")}</sitemapindex>`);
};
