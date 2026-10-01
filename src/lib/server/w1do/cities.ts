import { LEADS_API_BASE_URL, LEADS_API_KEY, W1DO_DEFAULT_CITY } from "astro:env/server";
import type { City } from "../../regions";

let cache: { cities: City[]; expiresAt: number } | undefined;
let pending: Promise<City[]> | undefined;

export async function getCities(): Promise<City[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.cities;
  if (pending) return pending;
  pending = fetchCities().then(cities => {
    cache = { cities, expiresAt: Date.now() + 60_000 };
    return cities;
  }).finally(() => { pending = undefined; });
  return pending;
}

async function fetchCities(): Promise<City[]> {
  if (!LEADS_API_KEY) throw new Error("W1DO API key is not configured.");
  const response = await fetch(new URL("/api/v1/content/cities", LEADS_API_BASE_URL || "https://backend.w1do.ru"), {
    headers: { Accept: "application/json", "X-Api-Key": LEADS_API_KEY },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`W1DO cities API returned HTTP ${response.status}.`);
  const result = await response.json() as { data?: City[] };
  if (!Array.isArray(result.data) || result.data.some(city =>
    !Number.isInteger(city.id) || !city.name || !/^[a-z0-9_-]+$/.test(city.slug))) {
    throw new Error("W1DO cities API returned invalid data.");
  }
  return result.data;
}

export function defaultCity(cities: City[]): City {
  const city = cities.find(city => city.slug === W1DO_DEFAULT_CITY);
  if (!city) throw new Error("The default W1DO city is not enabled.");
  return city;
}
