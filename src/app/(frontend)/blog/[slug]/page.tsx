import type { Metadata } from "next";
import type { BlogPosting, BreadcrumbList, WithContext } from "schema-dts";
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
import { SITE, absoluteUrl } from "@/lib/site";
import { extractFirstImageUrl, getExcerpt } from "@/lib/extractFirstImage";
import JsonLd from "@/components/JsonLd";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const { docs } = await payload
    .find({ collection: "posts", limit: 1, where: { slug: { equals: slug } } })
    .catch(() => ({ docs: [] }));
  const post: any = docs[0];
  if (!post) return { title: "Post not found" };

  const url = `${SITE.url}/blog/${post.slug}`;
  // OG image priority: first image found in body > heroImage > site default
  const firstBodyImage = extractFirstImageUrl(post.bodyJson);
  const ogImage = firstBodyImage
    ? absoluteUrl(firstBodyImage)
    : post.heroImage?.url
    ? absoluteUrl(post.heroImage.url)
    : SITE.defaultOgImage;
  const description = getExcerpt(post.bodyJson) || SITE.description;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url,
      siteName: SITE.brand,
      locale: SITE.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      authors: [SITE.brand],
      tags: post.tags?.map((t: any) => t.label).filter(Boolean),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
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
  const post: any = (ja || en)!.post;
  const url = `${SITE.url}/blog/${post.slug}`;
  // Same priority as metadata: first body image > heroImage > site default
  const firstBodyImage = extractFirstImageUrl(post.bodyJson);
  const image = firstBodyImage
    ? absoluteUrl(firstBodyImage)
    : post.heroImage?.url
    ? absoluteUrl(post.heroImage.url)
    : absoluteUrl(SITE.defaultOgImage);

  const articleLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: getExcerpt(post.bodyJson) || undefined,
    image,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      "@type": "Person",
      name: SITE.brand,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.brand,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(SITE.logo),
      },
    },
    inLanguage: ja ? "ja" : "en",
    keywords: post.tags?.map((t: any) => t.label).filter(Boolean).join(", ") || undefined,
  };

  const breadcrumbLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <CursorTrail />
      <CustomCursor />
      <SmoothScroll />
      <Nav />
      <BlogDetailContent data={data} />
      <Footer />
    </>
  );
}
