import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business";

const baseUrl = businessConfig.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}
