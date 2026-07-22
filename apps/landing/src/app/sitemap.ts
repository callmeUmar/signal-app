import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://signal.audio", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
