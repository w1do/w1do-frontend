import { LEADS_API_BASE_URL, LEADS_API_KEY, W1DO_DEFAULT_CITY } from "astro:env/server";
import type { City } from "../../regions";
import { cached } from "../cache";

const CACHE_KEY = "w1do:cities";
const CACHE_OPTIONS = { ttlMs: 300_000, staleMs: 86_400_000 };

export async function getCities(): Promise<City[]> {
  return cached(CACHE_KEY, CACHE_OPTIONS, fetchCities);
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
