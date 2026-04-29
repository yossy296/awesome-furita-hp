import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { getLocale } from "@/i18n/getLocale";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import FluidCursor from "@/components/FluidCursor";
import CursorJetStream from "@/components/CursorJetStream";
import CustomCursor from "@/components/CustomCursor";
import BlogReader from "@/components/blog/BlogReader";
import BlogSidebar from "@/components/blog/BlogSidebar";
import ReadProgressBar from "@/components/blog/ReadProgressBar";
import ShareList from "@/components/blog/ShareList";
import BlobImage from "@/components/BlobImage";

export const revalidate = 60;

function fmtDate(d?: string | null) {
  if (!d) return "";
  const date = new Date(d);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

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

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const locale = await getLocale();

  const { docs } = await payload
    .find({ collection: "posts", limit: 1, locale, where: { slug: { equals: slug } } })
    .catch(() => ({ docs: [] }));
  const post: any = docs[0];
  if (!post) notFound();

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
  const prev: any = prevRes.docs[0] || null;
  const next: any = nextRes.docs[0] || null;
  const popular = popularRes.docs;

  const heroUrl = post.heroImage?.url || "/assets/photo/photo_mask_06.png";
  const tags = (post.tags || []).map((t: any) => t.label).filter(Boolean);

  return (
    <>
      <FluidCursor />
      <CursorJetStream />
      <CustomCursor />
      <SmoothScroll />
      <Nav />
      <ReadProgressBar />

      <main className="post-page">
        <div className="post-grid">
          <article className="article">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">HOME</Link>
              <span className="sep">/</span>
              <Link href="/blog">BLOG</Link>
              <span className="sep">/</span>
              <span className="current">{post.title}</span>
            </nav>

            <header className="article__head">
              {tags[0] && <span className="cat-pill">{tags[0]}</span>}
              <h1 className="article__title">{post.title}</h1>
              <div className="article__meta">
                <span className="date">{fmtDate(post.publishedAt)}</span>
                <span className="dot"></span>
                <span className="author">
                  <span className="avatar"></span>
                  <span>Furi</span>
                </span>
              </div>
            </header>

            <figure className="article__hero article__hero--blob">
              <BlobImage src={heroUrl} seed={800 + (post.id?.toString().length || 0)} count={5} duration={7} />
            </figure>

            <BlogReader blocks={post.bodyJson} />

            <div className="article__share">
              <span className="share-label">SHARE</span>
              <ShareList title={post.title} />
            </div>

            <nav className="prevnext" aria-label="Post navigation">
              {prev ? (
                <Link href={`/blog/${prev.slug}`} className="pn pn--prev">
                  <span className="label">← PREV POST</span>
                  <div className="row">
                    <span
                      className="thumb"
                      style={{
                        backgroundImage: `url('${prev.heroImage?.url || "/assets/photo/photo_mask_03.png"}')`,
                      }}
                    />
                    <span className="title">{prev.title}</span>
                  </div>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/blog/${next.slug}`} className="pn pn--next">
                  <span className="label">NEXT POST →</span>
                  <div className="row">
                    <span className="title">{next.title}</span>
                    <span
                      className="thumb"
                      style={{
                        backgroundImage: `url('${next.heroImage?.url || "/assets/photo/photo_mask_02.png"}')`,
                      }}
                    />
                  </div>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </article>

          <BlogSidebar popular={popular} totalPosts={popularRes.totalDocs || popular.length} />
        </div>
      </main>

      <Footer />
    </>
  );
}
