"use client";

import Link from "next/link";
import BlobImage from "../BlobImage.jsx";

function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function BlogSidebar({ popular = [], totalPosts = 0 }) {
  return (
    <aside className="side">
      <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
        <input type="search" placeholder="Search..." />
        <button type="submit" aria-label="Search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>
      </form>

      <section className="side__block">
        <h3 className="side__title">Categories</h3>
        <ul className="cats">
          {[
            { l: "旅行", n: totalPosts },
            { l: "デザイン", n: 0 },
            { l: "ライフスタイル", n: 0 },
            { l: "インスピレーション", n: 0 },
            { l: "お知らせ", n: 0 },
          ].map((c) => (
            <li key={c.l}>
              <a href="#">
                <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7l9-4 9 4-9 4-9-4z" />
                  <path d="M3 12l9 4 9-4M3 17l9 4 9-4" />
                </svg>
                <span>{c.l}</span>
                <em>({c.n})</em>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="side__block">
        <h3 className="side__title">Popular Posts</h3>
        <ul className="pop">
          {popular.map((p, i) => (
            <li key={p.id}>
              <Link href={`/blog/${p.slug}`} className="pop__thumb pop__thumb--blob">
                <BlobImage
                  src={p.heroImage?.url || "/assets/photo/photo_mask_06.png"}
                  seed={600 + i * 19}
                  count={4}
                  duration={7}
                />
              </Link>
              <div>
                <p className="pop__title">{p.title}</p>
                <span className="pop__date">{fmtDate(p.publishedAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="cta-card">
        <div className="cta-card__bg" aria-hidden="true" />
        <div className="cta-card__badge">
          <img src="/logo_circle.png" alt="" />
        </div>
        <h4>Let&apos;s Explore the World.</h4>
        <p>旅とインスピレーションを、あなたに。</p>
        <Link href="/#about" className="cta-card__link">
          ABOUT ME →
        </Link>
      </section>
    </aside>
  );
}
