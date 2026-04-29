"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import SplitText from "./SplitText.jsx";
import BlobImage from "./BlobImage.jsx";
import SquircleButton from "./SquircleButton.jsx";

const ChevronLeft = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
const ChevronRight = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);
import { useT } from "@/i18n/I18nProvider";

function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function Blog({ posts = [] }) {
  const { t } = useT();
  const trackRef = useRef(null);
  const hasPosts = posts && posts.length > 0;

  const stepX = () => {
    const track = trackRef.current;
    if (!track) return 220;
    const card = track.querySelector(".work");
    if (!card) return 220;
    const cs = getComputedStyle(track);
    const gap = parseFloat(cs.columnGap || cs.gap || "18");
    return card.getBoundingClientRect().width + gap;
  };
  const scroll = (dir) => {
    if (trackRef.current) trackRef.current.scrollBy({ left: dir * stepX(), behavior: "smooth" });
  };

  return (
    <section className="works" id="blog">
      <div className="works__inner">
        <motion.div
          className="works__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow">{t("blog.eyebrow")}</span>
          <SplitText as="h2" variant="rise" charDelay={36}>
            {t("blog.title")}
          </SplitText>
          <p>
            {t("blog.intro").split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
          <Link href="/blog" className="more">
            {t("blog.viewAll")}
          </Link>
          {hasPosts && (
          <div className="row-nav" role="group" aria-label="Blog navigation">
            <SquircleButton
              sq
              color="white"
              height={48}
              icon={ChevronLeft}
              iconColor="#0E1116"
              ariaLabel="前へ"
              onClick={() => scroll(-1)}
            />
            <SquircleButton
              sq
              color="lime"
              height={48}
              icon={ChevronRight}
              iconColor="#0E1116"
              ariaLabel="次へ"
              onClick={() => scroll(1)}
            />
          </div>
          )}
        </motion.div>

        {!hasPosts ? (
          <div
            style={{
              gridColumn: 1,
              gridRow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 160,
              color: "var(--ink-2)",
              fontSize: 14,
              letterSpacing: "0.04em",
            }}
          >
            記事はありません
          </div>
        ) : (
        <motion.div
          className="works__grid"
          ref={trackRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {posts.map((p, i) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ y: -6 }}
              className="work"
              style={{ display: "block" }}
            >
              <Link href={`/blog/${p.slug}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 12 }}>
                <motion.div
                  className="work__thumb work__thumb--blob"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <BlobImage src={p.heroImage?.url || "/assets/photo/photo_mask_06.png"} seed={300 + i * 13} count={5} duration={6} />
                </motion.div>
                <p className="work__name">{p.title}</p>
                <p className="work__tag">{fmtDate(p.publishedAt)}</p>
                <span className="work__more">{t("works.viewMore")}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        )}
      </div>
    </section>
  );
}
