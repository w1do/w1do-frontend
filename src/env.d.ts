import type { RegionContext } from "./lib/regions";

declare global {
  namespace App {
    interface Locals {
      region?: RegionContext;
    }
  }
}
