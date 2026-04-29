"use client";

import dynamic from "next/dynamic";

const BlogReaderInner = dynamic(() => import("./BlogReaderInner"), {
  ssr: false,
  loading: () => (
    <div style={{ paddingTop: 8 }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="skeleton skel-line"
          style={{
            width: i % 3 === 2 ? "70%" : "100%",
            marginBottom: 14,
            height: 14,
            display: "block",
          }}
        />
      ))}
    </div>
  ),
});

export default function BlogReader({ blocks }) {
  return <BlogReaderInner blocks={blocks} />;
}
