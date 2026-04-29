import { getPayload } from "payload";
import config from "@payload-config";

export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

/**
 * Returns categories that have at least one published post, with counts.
 * Empty categories are filtered out.
 */
export async function getCategoriesWithCounts(
  locale: "ja" | "en"
): Promise<CategoryWithCount[]> {
  try {
    const payload = await getPayload({ config });
    const [catsRes, postsRes] = await Promise.all([
      payload.find({ collection: "categories", limit: 100, locale }),
      payload.find({
        collection: "posts",
        limit: 500,
        depth: 0,
        where: { status: { equals: "published" } },
      }),
    ]);

    const counts = new Map<string, number>();
    for (const post of postsRes.docs as any[]) {
      const cat = post.category;
      if (cat == null) continue;
      const id = typeof cat === "object" ? cat.id : cat;
      counts.set(String(id), (counts.get(String(id)) || 0) + 1);
    }

    return (catsRes.docs as any[])
      .map((c) => ({
        id: String(c.id),
        name: c.name,
        slug: c.slug,
        count: counts.get(String(c.id)) || 0,
      }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}
