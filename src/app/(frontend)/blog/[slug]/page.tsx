import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CursorTrail from "@/components/CursorTrail";
import CustomCursor from "@/components/CustomCursor";
import BlogDetailContent from "@/components/blog/BlogDetailContent";
import { getCategoriesWithCounts } from "@/lib/getCategories";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const { docs } = await payload
    .find({ collection: "posts", limit: 1, where: { slug: { equals: slug } } })
    .catch(() => ({ docs: [] }));
  const post: any = docs[0];
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Furi Blog`,
    description: post.excerpt,
  };
}

async function fetchView(slug: string, locale: "ja" | "en") {
  const payload = await getPayload({ config });
  const { docs } = await payload
    .find({ collection: "posts", limit: 1, locale, where: { slug: { equals: slug } } })
    .catch(() => ({ docs: [] }));
  const post: any = docs[0];
  if (!post) return null;

  const [prevRes, nextRes, popularRes] = await Promise.all([
    post.publishedAt
      ? payload.find({
          collection: "posts",
          limit: 1,
          sort: "-publishedAt",
          locale,
          where: {
            and: [
              { status: { equals: "published" } },
              { publishedAt: { less_than: post.publishedAt } },
            ],
          },
        })
      : Promise.resolve({ docs: [] }),
    post.publishedAt
      ? payload.find({
          collection: "posts",
          limit: 1,
          sort: "publishedAt",
          locale,
          where: {
            and: [
              { status: { equals: "published" } },
              { publishedAt: { greater_than: post.publishedAt } },
            ],
          },
        })
      : Promise.resolve({ docs: [] }),
    payload.find({
      collection: "posts",
      limit: 3,
      sort: "-publishedAt",
      locale,
      where: { status: { equals: "published" } },
    }),
  ]);

  const categories = await getCategoriesWithCounts(locale);

  return {
    post,
    prev: (prevRes.docs[0] as any) || null,
    next: (nextRes.docs[0] as any) || null,
    popular: popularRes.docs as any[],
    popularTotal: (popularRes as any).totalDocs ?? popularRes.docs.length,
    categories,
  };
}

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch both locales upfront so the JA/EN toggle can swap content instantly
  const [ja, en] = await Promise.all([fetchView(slug, "ja"), fetchView(slug, "en")]);
  if (!ja && !en) notFound();

  const data = { ja: ja || en, en: en || ja };

  return (
    <>
      <CursorTrail />
      <CustomCursor />
      <SmoothScroll />
      <Nav />
      <BlogDetailContent data={data} />
      <Footer />
    </>
  );
}
