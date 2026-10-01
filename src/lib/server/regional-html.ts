import { parse, serialize, type DefaultTreeAdapterMap } from "parse5";
import { assetHref, regionalHref, type RegionContext } from "../regions.ts";

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
