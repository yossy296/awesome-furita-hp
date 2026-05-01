"use client";

import Link from "next/link";
import { motion } from "motion/react";
import BlobImage from "../BlobImage.jsx";
import { getExcerpt } from "@/lib/extractFirstImage";

function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function BlogPostItem({ post, isNew = false }) {
  const thumb = post.heroImage?.url || "/assets/photo/photo_mask_06.png";
  const tags = (post.tags || []).map((t) => t.label).filter(Boolean);
  const excerpt = getExcerpt(post.bodyJson);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
    >
      <Link href={`/blog/${post.slug}`} className="post" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="post__thumb post__thumb--blob" style={{ position: "relative" }}>
          <BlobImage src={thumb} seed={400 + (post.id?.toString().length || 0) * 5} count={5} duration={6} />
          {isNew && <span className="post__badge" style={{ zIndex: 2 }}>NEW</span>}
        </div>
        <div className="post__body">
          <span className="post__date">{fmtDate(post.publishedAt)}</span>
          <h2 className="post__title">{post.title}</h2>
          {excerpt && <p className="post__excerpt">{excerpt}</p>}
          {tags.length > 0 && (
            <div className="post__tags">
              {tags.map((t, i) => (
                <span key={i}>#{t}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
