import { canonicalServicePath } from "./ai-agents-canonical.ts";

export interface CitySeo {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  robots?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_card?: string | null;
  json_ld?: Record<string, unknown> | null;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  seo?: CitySeo | null;
}

export interface RegionContext {
  city: City;
  cities: City[];
  defaultCitySlug: string;
  path: string;
}

export const SITE_ORIGIN = new URL(import.meta.env.SITE).origin;
const sharedPaths = /^\/(?:api|_astro|images|videos|fonts|js|assets|chunks|entry)(?:\/|$)/;

export function isSiteUrl(url: URL): boolean {
  return !url.username && !url.password && (url.origin === SITE_ORIGIN ||
    (/^https?:$/.test(url.protocol) && !url.port && ["w1do.ru", "www.w1do.ru"].includes(url.hostname)));
}

export function canonicalSitePath(path: string): string {
  const normalized = path.replace(/\/$/, "") || "/";
  if (normalized.endsWith("/contact.html")) return "/contact";
  if (normalized === "/categories" || normalized.startsWith("/categories/")) return `/blog${normalized}`;
  if (normalized === "/blog/ai-news-october-2026-business" || normalized === "/blog/business-automation/ai-news-october-2026-business") {
    return "/blog/business-automation/ai-agents-business-news-october-2026";
  }
  return canonicalServicePath(normalized);
}

export function isSharedPath(path: string): boolean {
  return sharedPaths.test(path) || /\.[a-z0-9]+$/i.test(path);
}

export function cityPath(slug: string, defaultCitySlug: string): string {
  return slug === defaultCitySlug ? "/" : `/${slug}`;
}

/** The frontend serves the same main content for every city. */
export function isIndexableCityHome(city: City, defaultCitySlug: string): boolean {
  return city.slug === defaultCitySlug && !/\bnoindex\b/i.test(city.seo?.robots || "");
}

/** Old relative asset paths must not resolve below the new city prefix. */
export function assetHref(href: string, region: RegionContext): string {
  if (!href || href.startsWith("/") || href.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(href)) return href;
  const rootRelative = href.replace(/^(?:\.\.?\/)+/, "");
  if (sharedPaths.test(`/${rootRelative}`)) return `/${rootRelative}`;
  try {
    const url = new URL(href, new URL(region.path, SITE_ORIGIN));
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return href; }
}

/** Only the homepage is regional. Links to inner pages remain shared. */
export function regionalHref(href: string, region: RegionContext): string {
  if (!href || href.startsWith("#") || /^(?:mailto|tel|javascript|data):/i.test(href)) return href;
  let url: URL;
  try { url = new URL(href, new URL(region.path, SITE_ORIGIN)); }
  catch { return href; }
  if (!isSiteUrl(url)) return href;
  const pathname = canonicalSitePath(url.pathname);
  if (isSharedPath(pathname)) return url.origin === SITE_ORIGIN ? assetHref(href, region) : `${pathname}${url.search}${url.hash}`;
  const first = url.pathname.split("/")[1];
  if (region.cities.some(city => city.slug === first)) {
    const path = `/${url.pathname.split("/").slice(2).filter(Boolean).join("/")}`;
    return `${path === "/" ? cityPath(first, region.defaultCitySlug) : canonicalSitePath(path)}${url.search}${url.hash}`;
  }
  // CMS city landing URLs use /cities/{slug}; the frontend uses /{slug}.
  const cmsCity = region.cities.find(city => url.pathname === `/cities/${city.slug}`);
  const path = cmsCity ? cityPath(cmsCity.slug, region.defaultCitySlug) : pathname === "/" ? cityPath(region.city.slug, region.defaultCitySlug) : pathname;
  return `${path}${url.search}${url.hash}`;
}

export function regionalSchema(value: unknown, region: RegionContext): unknown {
  if (Array.isArray(value)) return value.map(item => regionalSchema(item, region));
  if (value && typeof value === "object") {
    const result = Object.fromEntries(Object.entries(value).map(([key, item]) => [key,
      ["url", "@id", "item", "mainEntityOfPage"].includes(key) && typeof item === "string"
        ? /#(?:organization|website)$/.test(item) ? item : new URL(regionalHref(item, region), SITE_ORIGIN).href
        : regionalSchema(item, region),
    ]));
    if (result["@type"] === "Service") result.areaServed = { "@type": "City", name: region.city.name };
    return result;
  }
  return value;
}
