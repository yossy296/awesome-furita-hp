"use client";

import Link from "next/link";
import BlogReader from "./BlogReader";
import BlogSidebar from "./BlogSidebar";
import ReadProgressBar from "./ReadProgressBar";
import ShareList from "./ShareList";
import BlobImage from "../BlobImage";
import { useT } from "@/i18n/I18nProvider";

function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function BlogDetailContent({ data }) {
  const { locale } = useT();
  const view = data[locale] || data.ja;
  const post = view.post;
  const prev = view.prev;
  const next = view.next;
  const popular = view.popular;
  const popularTotal = view.popularTotal;
  const categories = view.categories || [];

  if (!post) return null;

  const heroUrl = post.heroImage?.url || "/assets/photo/photo_mask_06.png";
  const tags = (post.tags || []).map((t) => t.label).filter(Boolean);

  return (
    <>
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

            <BlogReader key={locale} blocks={post.bodyJson} />

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

          <BlogSidebar popular={popular} totalPosts={popularTotal || popular.length} categories={categories} />
        </div>
      </main>
    </>
  );
}
