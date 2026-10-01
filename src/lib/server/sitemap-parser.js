import sax from "sax";

/** Strict XML parsing: retain lastmod and reject HTML error pages. */
export function parseSitemap(xml) {
  const parser = sax.parser(true, { trim: true });
  const pages = [];
  let root;
  let current;
  let tag;
  let value = "";
  parser.onopentag = node => {
    root ||= node.name;
    tag = node.name;
    value = "";
    if (tag === "url") current = {};
  };
  parser.ontext = text => { value += text; };
  parser.oncdata = text => { value += text; };
  parser.onclosetag = name => {
    if (current && ["loc", "lastmod", "changefreq", "priority"].includes(name)) {
      current[name] = name === "priority" ? Number(value) : value;
    }
    if (name === "url") {
      if (!current?.loc) throw new Error("W1DO sitemap contains a URL without loc.");
      pages.push(current);
      current = undefined;
    }
    tag = undefined;
    value = "";
  };
  parser.write(xml).close();
  if (root !== "urlset") throw new Error("W1DO sitemap must contain an XML urlset.");
  return pages;
}
