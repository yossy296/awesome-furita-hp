"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const HOVER_SELECTOR =
  'a, button, [role="button"], input[type="submit"], .work, .j-card, .post, .blog__card, .what__card, .pn, .lang-toggle__btn, .more, .work__more, .jcard__nav, .jcard__close, .jcard__cta, .jcard__thumb, .row-nav__btn, .pager .page, .cats a, .pop li a, .cta-card__link, .send-btn';

export default function CustomCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 700, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 40, mass: 0.4 });

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onOver = (e) => {
      const t = e.target;
      if (t && typeof t.closest === "function" && t.closest(HOVER_SELECTOR)) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y, visible]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        zIndex: 10000,
        willChange: "transform",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s",
      }}
      animate={{
        scale: hovering ? 1.8 : 1,
        rotate: hovering ? -6 : 0,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      aria-hidden="true"
    >
      <svg width="48" height="48" viewBox="0 0 48 48">
        <g transform="translate(48 0) scale(-1 1) rotate(-30 24 24)">
          <motion.path
            d="M42 6 L6 21 L20 27 L24 42 L30 28 L42 6 Z"
            animate={{
              fill: hovering ? "#DCFF1E" : "#0E1116",
              stroke: hovering ? "#0E1116" : "#FCFBF7",
            }}
            transition={{ duration: 0.25 }}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <motion.path
            d="M42 6 L20 27 L24 42"
            fill="none"
            animate={{ stroke: hovering ? "#0E1116" : "#FCFBF7" }}
            transition={{ duration: 0.25 }}
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </motion.div>
  );
}
