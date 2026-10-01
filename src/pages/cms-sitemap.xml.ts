import type { APIRoute } from "astro";
import { getCmsSitemapPages } from "../lib/server/w1do/sitemap";
import { regionalSitemap } from "../lib/server/regional-sitemap";

export const GET: APIRoute = async ({ site }) => regionalSitemap(await getCmsSitemapPages(),
  site?.href.replace(/\/$/, "") || "https://w1do.ru");
