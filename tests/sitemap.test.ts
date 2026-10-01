import assert from "node:assert/strict";
import test from "node:test";
import { mergeSitemapPages } from "../src/lib/server/sitemap-merge.ts";

test("merges CMS metadata and frontend pages without losing the newest lastmod", () => {
  assert.deepEqual(mergeSitemapPages([
    { path: "/blog/categories/ai-agents", priority: 0.7 },
    { path: "/categories/ai-agents/", lastmod: "2026-10-01", priority: 0.8 },
    { path: "/blog/categories/ai-agents", lastmod: "2026-09-01" },
    { path: "/contact" },
  ]), [
    { path: "/blog/categories/ai-agents", lastmod: "2026-10-01", priority: 0.8 },
    { path: "/contact" },
  ]);
});

test("replaces legacy article URLs and excludes noindex and non-page routes", () => {
  assert.deepEqual(mergeSitemapPages([
    { path: "/blog/ai-agent-engineering" },
    { path: "/blog/ai-agents/ai-agent-engineering" },
    { path: "/blog/ai-agents/engineering" },
    { path: "/categories" },
    { path: "/categories/private" },
    { path: "/404" }, { path: "/api/lead" }, { path: "/cities/moscow" },
  ], ["/blog/categories/private"]), [
    { path: "/blog/ai-agents/engineering" }, { path: "/blog/categories" },
  ]);
});
