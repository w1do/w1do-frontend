import test from "node:test";
import assert from "node:assert/strict";
import { assetHref, cityPath, isIndexableCityHome, regionalHref, regionalSchema, SITE_ORIGIN, type RegionContext } from "../src/lib/regions.ts";
import { canonicalCmsHtml, regionalHtml } from "../src/lib/server/regional-html.ts";
import { parseSitemap } from "../src/lib/server/sitemap-parser.js";

const region: RegionContext = {
  city: { id: 407, name: "Иркутск", slug: "irkutsk" },
  cities: [{ id: 407, name: "Иркутск", slug: "irkutsk" }, { id: 590, name: "Москва", slug: "moscow" }],
  path: "/",
  defaultCitySlug: "moscow",
};

test("only home links keep a city; inner pages remain shared", () => {
  assert.equal(cityPath("moscow", "moscow"), "/");
  assert.equal(regionalHref("/", region), "/irkutsk");
  assert.equal(regionalHref("/moscow", region), "/");
  assert.equal(regionalHref("/contact?from=services#form", region), "/contact?from=services#form");
  assert.equal(regionalHref("https://w1do.ru/blog/article", region), "/blog/article");
  assert.equal(regionalHref(`${SITE_ORIGIN}/services/ai-agent-development/ai-development?utm_source=x#demo`, region), "/ai-agents/ai-agent-implementation?utm_source=x#demo");
  assert.equal(regionalHref("https://www.w1do.ru/categories/ai-agents", region), "/blog/categories/ai-agents");
  assert.equal(regionalHref("/moscow/contact", region), "/contact");
  assert.equal(regionalHref("/cities/moscow", region), "/");
});

test("assets, API, fragments and external URLs stay untouched", () => {
  for (const href of ["/images/logo.svg", "/api/lead", "/_astro/form.js", "/sitemap-index.xml", "#faq", "mailto:test@example.com", "https://t.me/W1DO_DIGITAL", "//example.com/path"]) {
    assert.equal(regionalHref(href, region), href);
  }
});

test("relative image, font and script paths remain shared across regional pages", () => {
  assert.equal(assetHref("images/llm/openai.svg", region), "/images/llm/openai.svg");
  assert.equal(assetHref("../images/logo.svg", region), "/images/logo.svg");
  assert.equal(assetHref("./js/function.js", region), "/js/function.js");
  assert.equal(regionalHref("images/download.svg", region), "/images/download.svg");
  const html = regionalHtml('<img src="images/a.svg" srcset="images/a.svg 1x, images/b.svg 2x"><video poster="images/poster.jpg"></video><div style="background-image: url(\'images/bg.svg\')"></div>', region);
  assert.match(html, /src="\/images\/a.svg"/);
  assert.match(html, /srcset="\/images\/a.svg 1x, \/images\/b.svg 2x"/);
  assert.match(html, /poster="\/images\/poster.jpg"/);
  assert.match(html, /url\('\/images\/bg.svg'\)/);
});

test("HTML parsing changes links while preserving code examples, scripts and form actions", () => {
  const html = regionalHtml('<html><body><a href="/contact">Contact</a><img src="/images/a.png"><form action="/api/lead"></form><pre>&lt;a href="/contact"&gt;</pre><script>const text = \'<a href="/contact">\';</script></body></html>', region);
  assert.match(html, /<a href="\/contact">/);
  assert.match(html, /<img src="\/images\/a.png">/);
  assert.match(html, /action="\/api\/lead"/);
  assert.match(html, /&lt;a href="\/contact"&gt;/);
  assert.match(html, /const text = '<a href="\/contact">'/);
});

test("CMS HTML uses canonical internal article, category and service links", () => {
  const html = [
    '<a href="https://w1do.ru/blog/old-article?x=1&amp;y=2#section">Article</a>',
    '<a href="https://w1do.ru/categories/ai-agents">Category</a>',
    '<a href="/blog/business-automation/ai-news-october-2026-business">October</a>',
    '<a href="/services/ai-integration/ai-process-audit">Service</a>',
    '<a href="contact.html">Contact</a><a href="#faq">FAQ</a>',
    '<a href="https://example.com/blog/old-article">External</a>',
    '<script>const text = \'<a href="https://w1do.ru/categories/ai-agents">\';</script>',
  ].join("");
  const rendered = canonicalCmsHtml(html, "/services/cluster/service", new Map([["/blog/old-article", "/blog/ai-agents/old-article"]]));
  assert.match(rendered, /href="\/blog\/ai-agents\/old-article\?x=1&amp;y=2#section"/);
  assert.match(rendered, /href="\/blog\/categories\/ai-agents"/);
  assert.match(rendered, /href="\/blog\/business-automation\/ai-agents-business-news-october-2026"/);
  assert.match(rendered, /href="\/services\/ai-roadmap-consulting\/ai-process-audit"/);
  assert.match(rendered, /href="\/contact"/);
  assert.match(rendered, /href="#faq"/);
  assert.match(rendered, /href="https:\/\/example.com\/blog\/old-article"/);
  assert.match(rendered, /const text = '<a href="https:\/\/w1do.ru\/categories\/ai-agents">'/);
});

test("JSON-LD keeps organization identity and external images; regionalises page URLs and service area", () => {
  const organizationId = `${SITE_ORIGIN}/#organization`;
  const schema = regionalSchema({ "@type": "Service", url: "https://w1do.ru/services/ai-integration", provider: { "@id": organizationId }, image: "https://example.com/images/a.svg", areaServed: "Россия" }, region) as Record<string, unknown>;
  assert.equal(schema.url, `${SITE_ORIGIN}/services/ai-integration`);
  assert.deepEqual(schema.provider, { "@id": organizationId });
  assert.equal(schema.image, "https://example.com/images/a.svg");
  assert.deepEqual(schema.areaServed, { "@type": "City", name: "Иркутск" });
});

test("CMS XML is parsed with escaped URLs and publication metadata", () => {
  assert.deepEqual(parseSitemap('<?xml version="1.0"?><urlset><url><loc>https://w1do.ru/blog/a?x=1&amp;y=2</loc><lastmod>2026-10-01</lastmod><priority>0.7</priority></url></urlset>'), [{ loc: "https://w1do.ru/blog/a?x=1&y=2", lastmod: "2026-10-01", priority: 0.7 }]);
  assert.throws(() => parseSitemap("<html><body>Not found</body></html>"), /urlset/);
  assert.throws(() => parseSitemap("<urlset><url></url></urlset>"), /without loc/);
  assert.throws(() => parseSitemap("<urlset><url></urlset>"));
});

 test("default city homepage stays at the root", () => {
  const moscow = { ...region, city: region.cities[1] };
  assert.equal(regionalHref("/", moscow), "/");
  assert.equal(regionalHref("/irkutsk", moscow), "/irkutsk");
  assert.equal(regionalHref("/moscow?x=1#faq", moscow), "/?x=1#faq");
  assert.deepEqual(regionalSchema({ url: "https://w1do.ru/" }, moscow), { url: `${SITE_ORIGIN}/` });
});

test("city selector keeps default city root when rendered from another region", () => {
  assert.match(regionalHtml('<a data-city-link href="/">Москва</a><a href="/">Главная</a>', region), /data-city-link="" href="\/">Москва/);
});

test("only the original homepage is indexed while the city pages share its content", () => {
  const [irkutsk, moscow] = region.cities;
  assert.equal(isIndexableCityHome(irkutsk, region.defaultCitySlug), false);
  assert.equal(isIndexableCityHome(moscow, region.defaultCitySlug), true);
  assert.equal(isIndexableCityHome({ ...moscow, seo: { robots: "NOINDEX, follow" } }, region.defaultCitySlug), false);
});
