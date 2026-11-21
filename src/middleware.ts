import { defineMiddleware } from "astro:middleware";
import { canonicalSitePath, cityPath, isSharedPath, regionalHref } from "./lib/regions";
import { defaultCity, getCities } from "./lib/server/w1do/cities";
import { regionalHtml } from "./lib/server/regional-html";
import { legacyContentPath } from "./lib/server/w1do/sitemap";

// Старые адреса шаблона и файлов .html: постоянные редиректы на актуальные страницы.
const LEGACY_REDIRECTS: Record<string, string> = {
  "/index.html": "/",
  "/projects": "/case",
  "/projects.html": "/case",
  "/team": "/about",
  "/team.html": "/about",
  "/faqs": "/knowledge",
  "/faqs.html": "/knowledge",
  "/services.html": "/services",
  "/about.html": "/about",
  "/pricing.html": "/pricing",
  "/blog.html": "/blog",
  "/testimonials.html": "/testimonials",
};

function legacyPagePath(path: string): string {
  return LEGACY_REDIRECTS[path] || canonicalSitePath(path);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const currentPath = context.url.pathname.replace(/\/$/, "") || "/";
  const legacyTarget = legacyPagePath(currentPath);
  if (legacyTarget !== currentPath) return context.redirect(legacyTarget + context.url.search, 301);
  const hasTrailingSlash = context.url.pathname !== currentPath;
  const isReadRequest = context.request.method === "GET" || context.request.method === "HEAD";
  // Rewrites run middleware again. Only the outer request regionalises the response.
  if (context.locals.region) return next();
  if (isSharedPath(currentPath)) {
    if (hasTrailingSlash && currentPath.startsWith("/api/")) {
      return context.redirect(currentPath + context.url.search, isReadRequest ? 301 : 308);
    }
    return next();
  }
  let cities;
  try { cities = await getCities(); }
  catch {
    return new Response("Список регионов временно недоступен. Попробуйте позже.", {
      status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "60", "X-Robots-Tag": "noindex" },
    });
  }
  const segments = context.url.pathname.split("/").filter(Boolean);
  const defaultCitySlug = defaultCity(cities).slug;
  const city = cities.find(city => city.slug === (segments[0] || defaultCitySlug));
  if (!city) {
    const cmsCity = segments[0] === "cities" && segments.length === 2
      ? cities.find(city => city.slug === segments[1]) : undefined;
    if (cmsCity) return context.redirect(`${cityPath(cmsCity.slug, defaultCitySlug)}${context.url.search}`, 301);
    const legacyPath = await legacyContentPath(currentPath);
    if (legacyPath !== currentPath) return context.redirect(`${legacyPath}${context.url.search}`, 301);
    const response = await next();
    if (hasTrailingSlash && isReadRequest && response.ok && response.headers.get("Content-Type")?.includes("text/html")) {
      return context.redirect(currentPath + context.url.search, 301);
    }
    return response;
  }
  const requestedPath = `/${segments.slice(1).join("/")}`;
  if (isSharedPath(requestedPath)) return new Response("Страница не найдена", { status: 404 });
  if (requestedPath !== "/") {
    // Previously generated regional inner pages now redirect to the shared page.
    const path = await legacyContentPath(legacyPagePath(requestedPath));
    return context.redirect(`${path}${context.url.search}`, 301);
  }
  if (context.url.pathname !== cityPath(city.slug, defaultCitySlug)) return context.redirect(`${cityPath(city.slug, defaultCitySlug)}${context.url.search}`, 301);
  context.locals.region = { city, cities, path: "/", defaultCitySlug };
  const target = new URL(context.url);
  target.pathname = "/";
  const response = context.url.pathname === "/" ? await next() : await context.rewrite(target);
  const headers = new Headers(response.headers);
  const location = headers.get("Location");
  if (location) headers.set("Location", regionalHref(location, context.locals.region));
  if (!headers.get("Content-Type")?.includes("text/html")) {
    return new Response(response.body, { status: response.status, headers });
  }
  headers.delete("Content-Length");
  headers.delete("ETag");
  return new Response(regionalHtml(await response.text(), context.locals.region), {
    status: response.status, headers,
  });
});
