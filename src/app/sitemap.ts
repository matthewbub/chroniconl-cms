import type { MetadataRoute } from "next";
const url = process.env.NEXT_PUBLIC_SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${url}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${url}/contact`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
