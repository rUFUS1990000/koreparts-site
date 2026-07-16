import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

export const dynamic = "force-static";

const base =
  process.env.NEXT_PUBLIC_SITE_URL || "https://koreparts.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/catalog",
    "/cart",
    "/checkout",
    "/delivery",
    "/contacts",
    "/vin",
    "/request",
    "/account",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const products = PRODUCTS.map((p) => ({
    url: `${base}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...products];
}
