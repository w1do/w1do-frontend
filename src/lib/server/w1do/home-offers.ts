import { getSecret, LEADS_API_BASE_URL, LEADS_API_KEY } from "astro:env/server";

export interface HomeOffer {
  title: string;
  description: string;
  priceLabel: string;
  imagePath: string;
  buttonLabel: string;
  position: number;
}

interface OfferEntry {
  title?: unknown;
  position?: number;
  status?: string;
  values?: Record<string, unknown>;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function imagePath(value: unknown): string {
  const path = text(value);
  if (path.startsWith("/images/") && !path.includes("\\")) {
    const local = new URL(path, "https://local.invalid");
    return local.pathname.startsWith("/images/") ? local.pathname + local.search : "";
  }
  if (!URL.canParse(path)) return "";
  const url = new URL(path);
  return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
}

function mapOffer(entry: OfferEntry): HomeOffer | null {
  if (!entry || (entry.status && entry.status !== "published")) return null;
  const values = entry.values ?? {};
  const title = text(entry.title);
  const buttonLabel = text(values.button_label);
  if (!title || !buttonLabel) return null;
  return {
    title,
    description: text(values.description),
    priceLabel: text(values.price_label),
    imagePath: imagePath(values.image_path),
    buttonLabel,
    position: entry.position ?? Number.MAX_SAFE_INTEGER,
  };
}

export async function getHomeOffers(): Promise<HomeOffer[]> {
  const backendKey = getSecret("BACKEND_KEY");
  const backendApi = getSecret("BACKEND_API");
  const useBackendSettings = backendKey !== undefined || backendApi !== undefined;
  const key = useBackendSettings ? backendKey : LEADS_API_KEY;
  if (!key) return [];
  try {
    const base = (useBackendSettings ? backendApi : LEADS_API_BASE_URL) || "https://backend.w1do.ru/api";
    const url = new URL("/api/v1/content/collections/home-offers/entries", base);
    url.searchParams.set("locale", "ru");
    url.searchParams.set("per_page", "48");
    const offers: HomeOffer[] = [];
    const signal = AbortSignal.timeout(3500);
    let lastPage = 1;
    for (let page = 1; page <= lastPage; page++) {
      url.searchParams.set("page", String(page));
      const response = await fetch(url, {
        headers: { Accept: "application/json", "X-Api-Key": key },
        redirect: "error",
        signal,
      });
      if (!response.ok) return [];
      const payload = await response.json();
      if (!Array.isArray(payload.data)) return [];
      for (const entry of payload.data) {
        const offer = mapOffer(entry);
        if (offer) offers.push(offer);
      }
      if (page === 1 && Number.isInteger(payload.meta?.last_page)) lastPage = payload.meta.last_page;
    }
    return offers.sort((a, b) => a.position - b.position);
  } catch {
    return [];
  }
}
