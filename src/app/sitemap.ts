import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { SITE } from "@/lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });
  const { docs } = await payload
    .find({
      collection: "posts",
      limit: 500,
      sort: "-publishedAt",
      where: { status: { equals: "published" } },
    })
    .catch(() => ({ docs: [] as any[] }));

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  const postEntries: MetadataRoute.Sitemap = (docs as any[]).map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.publishedAt || p.createdAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
