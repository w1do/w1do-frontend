import { SITE_ORIGIN } from "../lib/regions";
import type { APIRoute } from "astro";
import { getCmsSitemapPages } from "../lib/server/w1do/sitemap";
import { regionalSitemap } from "../lib/server/regional-sitemap";

export const GET: APIRoute = async () => regionalSitemap(await getCmsSitemapPages(),
  SITE_ORIGIN);
