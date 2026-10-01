import { defineMiddleware } from "astro:middleware";
import { cityPath, isSharedPath, regionalHref } from "./lib/regions";
import { defaultCity, getCities } from "./lib/server/w1do/cities";
import { regionalHtml } from "./lib/server/regional-html";
import { legacyContentPath } from "./lib/server/w1do/sitemap";

export const onRequest = defineMiddleware(async (context, next) => {
  // Rewrites run middleware again. Only the outer request regionalises the response.
  if (context.locals.region || isSharedPath(context.url.pathname)) return next();
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
    const path = context.url.pathname.replace(/\/$/, "");
    const legacyPath = await legacyContentPath(path);
    if (legacyPath !== path) return context.redirect(`${legacyPath}${context.url.search}`, 301);
    return next();
  }
  const requestedPath = `/${segments.slice(1).join("/")}`;
  if (isSharedPath(requestedPath)) return new Response("Страница не найдена", { status: 404 });
  if (requestedPath !== "/") {
    // Previously generated regional inner pages now redirect to the shared page.
    const path = await legacyContentPath(requestedPath);
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
