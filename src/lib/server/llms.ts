import { getCollection } from "astro:content";
import { parseFragment, type DefaultTreeAdapterMap } from "parse5";
import { pageSeo } from "../seo";
import { cityPath, SITE_ORIGIN } from "../regions";
import { defaultCity, getCities } from "./w1do/cities";
import { getCmsSitemapPages } from "./w1do/sitemap";
import { getServices } from "./w1do/services";
import { getBlogPosts } from "./w1do/blog";
import { getCases } from "./w1do/cases";
import { getOpenSourceProjects } from "./w1do/opensource";

function textContent(html: string): string {
  function visit(node: DefaultTreeAdapterMap["node"]): string {
    if ("value" in node) return node.value;
    if ("tagName" in node && ["script", "style"].includes(node.tagName)) return "";
    return "childNodes" in node ? node.childNodes.map(visit).join(" ") : "";
  }
  return visit(parseFragment(html)).replace(/\s+/g, " ").trim();
}

/** Runtime replacement for the build-only LLM generator after regional SSR routing. */
export async function llmsResponse(full: boolean): Promise<Response> {
  const [cities, indexed, services, posts, cases, projects, hubs, spokes] = await Promise.all([
    getCities(), getCmsSitemapPages(), getServices(), getBlogPosts(), getCases(), getOpenSourceProjects(),
    getCollection("landingCluster", ({ data }) => data.hub === true), getCollection("landingSpoke"),
  ]);
  const city = defaultCity(cities);
  const defaultCitySlug = city.slug;
  const cmsPaths = new Set(indexed.map(page => page.path));
  const entries = [
    ...Object.entries(pageSeo).map(([path, seo]) => ({ path, title: seo.title, description: seo.description, body: "" })),
    ...services.filter(entry => cmsPaths.has(entry.url)).map(entry => ({ path: entry.url, title: entry.title, description: entry.description, body: textContent(entry.bodyHtml) })),
    ...posts.filter(entry => entry.data.isIndex).map(entry => ({ path: entry.url, title: entry.data.title, description: entry.data.description, body: entry.body })),
    ...cases.map(entry => ({ path: `/case/${entry.id}`, title: entry.title, description: entry.description, body: textContent(entry.bodyHtml) })),
    ...projects.map(entry => ({ path: `/opensource/${entry.id}`, title: entry.title, description: entry.description, body: textContent(entry.bodyHtml) })),
    ...hubs.map(entry => ({ path: `/${entry.id}`, title: entry.data.title, description: entry.data.description, body: entry.body || "" })),
    ...spokes.map(entry => ({ path: `/${entry.data.cluster}/${entry.id.split("/").pop()}`, title: entry.data.title, description: entry.data.description, body: entry.body || "" })),
  ];
  const unique = [...new Map(entries.filter(entry => !["/cookies", "/privacy-policy", "/user-agreement"].includes(entry.path))
    .map(entry => [entry.path, entry])).values()];
  const lines = ["# W1DO — разработка ИИ и автоматизация", "", `> ${city.seo?.description || pageSeo["/"].description}`, "",
    `Карта сайта: ${SITE_ORIGIN}/sitemap-index.xml`, "", "## Города", "",
    ...cities.filter(city => !city.seo?.robots?.includes("noindex")).map(city => `- [${city.name}](${SITE_ORIGIN}${cityPath(city.slug, defaultCitySlug)})`),
    "", "## Страницы", "",
    ...unique.map(entry => full
      ? `## ${entry.title}\n\n${SITE_ORIGIN}${(entry.path === "/" ? cityPath(city.slug, defaultCitySlug) : entry.path)}\n\n${entry.body || entry.description}\n`
      : `- [${entry.title}](${SITE_ORIGIN}${(entry.path === "/" ? cityPath(city.slug, defaultCitySlug) : entry.path)}): ${entry.description}`),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=60" } });
}
