import { getPayload } from "payload";
import config from "@payload-config";
import { getLocale } from "@/i18n/getLocale";
import { getCategoriesWithCounts } from "@/lib/getCategories";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CursorTrail from "@/components/CursorTrail";
import CustomCursor from "@/components/CustomCursor";
import BlogHero from "@/components/blog/BlogHero";
import BlogPostItem from "@/components/blog/BlogPostItem";
import BlogSidebar from "@/components/blog/BlogSidebar";

export const revalidate = 60;
export const metadata = { title: "Blog — Furi" };

export default async function BlogIndex() {
  const payload = await getPayload({ config });
  const locale = await getLocale();
  const { docs } = await payload
    .find({
      collection: "posts",
      limit: 30,
      sort: "-publishedAt",
      locale,
      where: { status: { equals: "published" } },
    })
    .catch(() => ({ docs: [] }));

  const popular = docs.slice(0, 3);
  const categories = await getCategoriesWithCounts(locale);

  return (
    <>
      <CursorTrail />
      <CustomCursor />
      <SmoothScroll />
      <Nav />

      <main className="blog-page">
        <BlogHero />

        <section className="blog-grid">
          <div className="posts">
            {docs.length === 0 ? (
              <p style={{ color: "var(--ink-2)" }}>記事はありません</p>
            ) : (
              docs.map((p: any, i: number) => (
                <BlogPostItem key={p.id} post={p} isNew={i === 0} />
              ))
            )}
          </div>

          <BlogSidebar popular={popular} totalPosts={docs.length} categories={categories} />
        </section>
      </main>

      <Footer />
    </>
  );
}
