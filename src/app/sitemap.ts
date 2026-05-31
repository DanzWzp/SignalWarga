import type { MetadataRoute } from "next";

import { absoluteUrl, publicCategoryPages } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/peta-laporan", priority: 0.9 },
    { path: "/privacy", priority: 0.4 },
    { path: "/terms", priority: 0.4 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route.priority,
    })),
    ...publicCategoryPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];
}
