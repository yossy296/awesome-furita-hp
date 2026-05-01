import type { Metadata } from "next";
import type { Blog, WithContext } from "schema-dts";
import { getPayload } from "payload";
import config from "@payload-config";
import { getLocale } from "@/i18n/getLocale";
import { getCategoriesWithCounts } from "@/lib/getCategories";
import { SITE, absoluteUrl } from "@/lib/site";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CursorTrail from "@/components/CursorTrail";
import CustomCursor from "@/components/CustomCursor";
import BlogHero from "@/components/blog/BlogHero";
import BlogPostItem from "@/components/blog/BlogPostItem";
import BlogSidebar from "@/components/blog/BlogSidebar";
import JsonLd from "@/components/JsonLd";

export const revalidate = 60;

const BLOG_TITLE = "Blog";
const BLOG_DESCRIPTION =
  "ADHD・うつ病・32カ国の旅で得た学びを言葉にした Furi の記録。";

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: `${BLOG_TITLE} — ${SITE.brand}`,
    description: BLOG_DESCRIPTION,
    url: `${SITE.url}/blog`,
    siteName: SITE.brand,
    locale: SITE.locale,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BLOG_TITLE} — ${SITE.brand}`,
    description: BLOG_DESCRIPTION,
    images: [SITE.defaultOgImage],
  },
};

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

  const blogLd: WithContext<Blog> = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${BLOG_TITLE} — ${SITE.brand}`,
    url: `${SITE.url}/blog`,
    description: BLOG_DESCRIPTION,
    inLanguage: locale === "en" ? "en" : "ja",
    author: { "@type": "Person", name: SITE.brand, url: SITE.url },
    blogPost: docs.slice(0, 10).map((p: any) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE.url}/blog/${p.slug}`,
      datePublished: p.publishedAt || p.createdAt,
      author: { "@type": "Person", name: SITE.brand },
      ...(p.heroImage?.url && { image: absoluteUrl(p.heroImage.url) }),
    })),
  };

  return (
    <>
      <JsonLd data={blogLd} />
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
