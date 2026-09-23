import type { MetadataRoute } from "next";
import { navItems } from "@/lib/site";

export const dynamic = "force-static";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...navItems.map((item) => `${item.href}/`)].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
