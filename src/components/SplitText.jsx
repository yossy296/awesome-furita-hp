"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";

export default function SplitText({
  as: Tag = "span",
  by = "chars",
  className = "",
  variant = "rise",
  delay = 0,
  charDelay = 30,
  children,
  ...props
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { default: Splitting } = await import("splitting");
      if (cancelled || !ref.current) return;
      Splitting({ target: ref.current, by });
    })();
    return () => {
      cancelled = true;
    };
  }, [by, children]);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty("--split-delay", `${delay}ms`);
      ref.current.style.setProperty("--split-stagger", `${charDelay}ms`);
    }
  }, [delay, charDelay]);

  return (
    <Tag
      ref={ref}
      className={`split-text split-text--${variant} ${inView ? "in" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
