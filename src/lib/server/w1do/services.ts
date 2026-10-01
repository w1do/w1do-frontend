import { fetchServiceEntries } from "./services-api";
const CACHE_TTL = 60_000;
const GENERIC_SERVICE_IMAGE = "uhkgnmd2Bfd0VOWFyKCtbmD93bIEl0AaMOKnNvPW.jpg";
const MEDIA_BASE_URL = "https://backend.w1do.ru/media/projects/01m15zc30ghk21dmk2a4ph5wkg/media";

const CLUSTER_IMAGE_URLS: Record<string, string> = {
  "ai-agent-development": `${MEDIA_BASE_URL}/7gFON95ipzhrqcDUD9lI9BRUQwo3aVEEEH0O5Loi.svg`,
  "ai-assistants-chatbots": `${MEDIA_BASE_URL}/RAnGfmqbZWabqzLdW3pDJoNy4CVS9IDZwn9Fnl8H.svg`,
  "ai-bot-avito": `${MEDIA_BASE_URL}/s5cKZ19VYnPlBNMtzedAIgj1NfNaA6Y5xpn3aXxo.svg`,
  "ai-data-scraping": `${MEDIA_BASE_URL}/3i1ga2GKeTxMwuuJAYgv1y6wQbwJoBgZ9fTK5moI.svg`,
  "ai-integration-1c-crm": `${MEDIA_BASE_URL}/wT5VfGI2no9YMhHwlje70M2AU4J66xpS1kXOfCNd.svg`,
  "ai-integration": `${MEDIA_BASE_URL}/rmZgoBNGXakU5hJbUoIzw0tJygYCX4ib3OiX96Yv.svg`,
  "ai-marketing-content": `${MEDIA_BASE_URL}/zOxzzR196v3RW0ZSXFy4IW6SHxTiBCnh0PZe8lVU.svg`,
  "ai-roadmap-consulting": `${MEDIA_BASE_URL}/gWfgoOKYOtMIHCjEa2t21IntYiPH4GspQnyMCwNK.svg`,
  "ai-solution-architecture": `${MEDIA_BASE_URL}/rmZgoBNGXakU5hJbUoIzw0tJygYCX4ib3OiX96Yv.svg`,
  "ai-training": `${MEDIA_BASE_URL}/gWfgoOKYOtMIHCjEa2t21IntYiPH4GspQnyMCwNK.svg`,
  "ai-video-surveillance": `${MEDIA_BASE_URL}/mSljy2mx6rZPZx0Ojt5jRJbkvJ8Ve5wJA84ySfpR.svg`,
  "ai-workshops-education": `${MEDIA_BASE_URL}/gWfgoOKYOtMIHCjEa2t21IntYiPH4GspQnyMCwNK.svg`,
  "code-refactoring": `${MEDIA_BASE_URL}/PizjVgxQ8OOz52tcv85C9bUWCXs1B2Zx3NDLWH07.svg`,
  "consultation": `${MEDIA_BASE_URL}/gWfgoOKYOtMIHCjEa2t21IntYiPH4GspQnyMCwNK.svg`,
  "directus-setup": `${MEDIA_BASE_URL}/MlyHE2j66GYqUoV8ml2m0vwNjhDev6HFWUKAdo4B.svg`,
  "html-layout": `${MEDIA_BASE_URL}/CQWROMjmV9Pem4WZMtzgC24TJCSSFs0UHE63SGbq.svg`,
  "infrastructure-dokploy": `${MEDIA_BASE_URL}/zBWh26d1AFyAAXVO2PCFwRx7awz01lZYatEAKgTN.svg`,
  "low-code-claude": `${MEDIA_BASE_URL}/CQWROMjmV9Pem4WZMtzgC24TJCSSFs0UHE63SGbq.svg`,
  "mobile-apps": `${MEDIA_BASE_URL}/IKNoMcbN57plUM9MDxVzQc1bnVzLVrgsyVv8t4mx.svg`,
  "mvp-prototyping": `${MEDIA_BASE_URL}/oUPmREnfEP2nElZVNJqPJQzHGUf5ZLnmrLPas9OA.svg`,
  "n8n-automation": `${MEDIA_BASE_URL}/MlyHE2j66GYqUoV8ml2m0vwNjhDev6HFWUKAdo4B.svg`,
  "payment-integration": `${MEDIA_BASE_URL}/nR3eSfBznwuhzj6F1LxjsepPVYsEFjwgiFeR2Do4.svg`,
  "speech-recognition-analysis": `${MEDIA_BASE_URL}/mwzUxkfZqkDS0EySVOh0kHEnCfBddqqgB1ukj5w1.svg`,
  "vibe-coding": `${MEDIA_BASE_URL}/PizjVgxQ8OOz52tcv85C9bUWCXs1B2Zx3NDLWH07.svg`,
  "web-development": `${MEDIA_BASE_URL}/CQWROMjmV9Pem4WZMtzgC24TJCSSFs0UHE63SGbq.svg`,
  "web-support": `${MEDIA_BASE_URL}/MlyHE2j66GYqUoV8ml2m0vwNjhDev6HFWUKAdo4B.svg`,
};

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceEntry {
  title: string;
  description: string;
  seo: { title: string; description: string };
  hub: boolean;
  cluster: string;
  postSlug: string;
  url: string;
  cmsPath: string;
  bodyHtml: string;
  image?: string;
  imageAlt?: string;
  icon: string;
  no: string;
  order: number;
  tags: string[];
  excerpt?: string;
  dateLabel?: string;
  offersTitle?: string;
  offersDescription?: string;
  offers?: Array<{ title: string; description: string; icon?: string }>;
  featuresTitle?: string;
  featuresDescription?: string;
  features?: string[];
  stats?: Array<{ value: string; suffix?: string; label: string }>;
  faqs: ServiceFaq[];
  process?: Record<string, string>;
  pricing?: { title: string; description?: string; items?: unknown[] };
  spokesTitle?: string;
  spokesDescription?: string;
}

let cache: { expiresAt: number; entries: ServiceEntry[] } | undefined;
let pending: Promise<ServiceEntry[]> | undefined;

const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

function resolveImage(values: Record<string, unknown>, cluster: string): string | undefined {
  if (CLUSTER_IMAGE_URLS[cluster]) return CLUSTER_IMAGE_URLS[cluster];
  const image = text(values.image_media, text(values.image));
  if (!image || image.includes(GENERIC_SERVICE_IMAGE)) return undefined;
  return image;
}

function json<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapEntry(entry: Awaited<ReturnType<typeof fetchServiceEntries>>[number]): ServiceEntry | undefined {
  const values = entry.values || {};
  const cluster = text(values.cluster_slug);
  const type = text(values.entry_type);
  if (!entry.title || !cluster || !["hub", "spoke"].includes(type)) return undefined;

  const hub = type === "hub";
  return {
    title: entry.title,
    description: text(values.description),
    seo: {
      title: text(entry.seo_title, entry.title),
      description: text(entry.seo_description, text(values.description)),
    },
    hub,
    cluster,
    postSlug: text(values.post_slug),
    url: text(values.public_path, hub ? `/services/${cluster}` : `/services/${cluster}/${text(values.post_slug)}`),
    cmsPath: `/services/${entry.slug}`,
    bodyHtml: text(values.body_html),
    image: resolveImage(values, cluster),
    imageAlt: text(values.image_alt) || undefined,
    icon: text(values.icon, "/images/icon-service-3.svg"),
    no: text(values.display_no, "99"),
    order: Number(values.display_order) || 0,
    tags: json(values.tags_json, []),
    excerpt: text(values.excerpt) || undefined,
    dateLabel: text(values.date_label) || undefined,
    offersTitle: text(values.offers_title) || undefined,
    offersDescription: text(values.offers_description) || undefined,
    offers: json(values.offers_json, []),
    featuresTitle: text(values.features_title) || undefined,
    featuresDescription: text(values.features_description) || undefined,
    features: json(values.features_json, []),
    stats: json(values.stats_json, []),
    faqs: json(values.faqs_json, []),
    process: json(values.process_json, undefined),
    pricing: json(values.pricing_json, undefined),
    spokesTitle: text(values.spokes_title) || undefined,
    spokesDescription: text(values.spokes_description) || undefined,
  };
}

export async function getServices(): Promise<ServiceEntry[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.entries;
  if (!pending) {
    pending = fetchServiceEntries().then((rawEntries) => {
      const entries = rawEntries.map(mapEntry).filter((entry): entry is ServiceEntry => Boolean(entry));
      cache = { entries, expiresAt: Date.now() + CACHE_TTL };
      return entries;
    }).finally(() => { pending = undefined; });
  }
  return pending;
}

export async function getServiceHubs(): Promise<ServiceEntry[]> {
  return (await getServices()).filter((entry) => entry.hub)
    .sort((a, b) => a.no.localeCompare(b.no, "ru", { numeric: true }));
}

export async function getServiceSpokes(cluster: string): Promise<ServiceEntry[]> {
  return (await getServices()).filter((entry) => !entry.hub && entry.cluster === cluster)
    .sort((a, b) => a.order - b.order);
}

export async function getServiceByPath(parts: string[]): Promise<ServiceEntry | undefined> {
  const path = `/services/${parts.join("/")}`;
  return (await getServices()).find((entry) => entry.url === path);
}
