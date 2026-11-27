import type { APIRoute } from "astro";
import { SITE_ORIGIN } from "../lib/site";

// robots.txt собирается из SITE_URL: после смены домена старый sitemap не остаётся в файле.
export const prerender = false;

const ROBOTS = `# AiCRAFT — ${SITE_ORIGIN}
# LLM-контекст: ${SITE_ORIGIN}/llms.txt

# --- OpenAI ---
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

# --- Anthropic ---
User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: anthropic-ai
Allow: /

# --- Perplexity ---
User-agent: PerplexityBot
Allow: /

# --- Google ---
User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Allow: /

# --- Microsoft / Bing / Copilot ---
User-agent: Bingbot
Allow: /

# --- Apple ---
User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

# --- Meta ---
User-agent: FacebookBot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /

# --- Amazon ---
User-agent: Amazonbot
Allow: /

# --- Cohere ---
User-agent: cohere-ai
Allow: /

# --- Common Crawl ---
User-agent: CCBot
Allow: /

# --- ByteDance ---
User-agent: Bytespider
Allow: /

# --- You.com ---
User-agent: YouBot
Allow: /

# --- Diffbot ---
User-agent: Diffbot
Allow: /

# --- AI2 ---
User-agent: AI2Bot
Allow: /

# --- DuckDuckGo ---
User-agent: DuckAssistBot
Allow: /

# --- Timpi ---
User-agent: Timpibot
Allow: /

# --- Omgili ---
User-agent: Omgilibot
Allow: /

# --- Imagesift ---
User-agent: ImagesiftBot
Allow: /

# --- Huawei Petal ---
User-agent: PetalBot
Allow: /

# --- Все остальные боты ---
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /node_modules/
Disallow: /Dockerfile
Disallow: /package.json
Disallow: /package-lock.json

# Яндекс: не индексировать дубли с UTM-метками
Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid /

Sitemap: ${SITE_ORIGIN}/sitemap-index.xml
`;

export const GET: APIRoute = () => new Response(ROBOTS, {
  headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  },
});
