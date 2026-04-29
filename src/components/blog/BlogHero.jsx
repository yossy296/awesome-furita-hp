"use client";

import { motion } from "motion/react";
import SplitText from "../SplitText.jsx";

export default function BlogHero() {
  return (
    <header className="blog-hero">
      <motion.div
        className="blog-hero__inner"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="eyebrow thin">My Blog</span>
        <SplitText as="h1" variant="rise" charDelay={48}>
          BLOG
        </SplitText>
        <p>旅・1on1・考えたことを綴っています。</p>
      </motion.div>
      <div className="blog-hero__deco" aria-hidden="true">
        <motion.div
          className="grad grad-a"
          animate={{ scale: [1, 1.05, 1], x: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="grad grad-b"
          animate={{ scale: [1, 1.06, 1], x: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          className="plane"
          src="/contact_plane.png"
          alt=""
          animate={{ x: [0, 14, 0], y: [0, -8, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </header>
  );
}
