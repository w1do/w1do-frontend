import { parse, parseFragment, serialize, type DefaultTreeAdapterMap } from "parse5";
import { assetHref, canonicalSitePath, isSiteUrl, regionalHref, SITE_ORIGIN, type RegionContext } from "../regions.ts";

/** Update internal links after CMS HTML or Markdown has been rendered. */
export function canonicalCmsHtml(html: string, pagePath: string, aliases?: ReadonlyMap<string, string>): string {
  if (!/\bhref\s*=/i.test(html)) return html;
  const fragment = parseFragment(html);
  const base = new URL(pagePath, SITE_ORIGIN);
  let changed = false;

  function visit(node: DefaultTreeAdapterMap["node"]) {
    if ("tagName" in node && (node.tagName === "a" || node.tagName === "area")) {
      const href = node.attrs.find(attribute => attribute.name === "href");
      const url = href && URL.parse(href.value, base);
      if (href && url && !href.value.startsWith("#") && isSiteUrl(url)) {
        const canonical = canonicalSitePath(url.pathname);
        const path = aliases?.get(canonical) || canonical;
        if (path !== url.pathname || url.origin !== SITE_ORIGIN) {
          href.value = `${path}${url.search}${url.hash}`;
          changed = true;
        }
      }
    }
    if ("childNodes" in node) node.childNodes.forEach(visit);
  }

  visit(fragment);
  return changed ? serialize(fragment) : html;
}

/** Parse HTML so code examples, scripts and image URLs cannot be rewritten. */
export function regionalHtml(html: string, region: RegionContext): string {
  const document = parse(html);
  function visit(node: DefaultTreeAdapterMap["node"]) {
    if ("tagName" in node) {
      for (const attribute of node.attrs) {
        if (attribute.name === "href") attribute.value = ["a", "area"].includes(node.tagName) && !node.attrs.some(attr => attr.name === "data-city-link")
          ? regionalHref(attribute.value, region) : assetHref(attribute.value, region);
        if (["src", "poster"].includes(attribute.name)) attribute.value = assetHref(attribute.value, region);
        if (attribute.name === "srcset" && !attribute.value.includes("data:")) attribute.value = attribute.value.split(",").map(candidate => {
          const [url, ...descriptor] = candidate.trim().split(/\s+/);
          return [assetHref(url, region), ...descriptor].join(" ");
        }).join(", ");
        if (attribute.name === "style") attribute.value = attribute.value.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi,
          (_, quote, href) => `url(${quote}${assetHref(href, region)}${quote})`);
      }
    }
    if ("childNodes" in node) node.childNodes.forEach(visit);
  }
  visit(document);
  return serialize(document);
}
