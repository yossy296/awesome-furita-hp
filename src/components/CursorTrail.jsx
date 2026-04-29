"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

let _id = 0;

export default function CursorTrail() {
  const [trails, setTrails] = useState([]);
  const lastEmitted = useRef(0);
  const lastPos = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    const TRAIL_LIFE = 700;
    const MIN_INTERVAL = 28;
    const MIN_DIST = 6;

    const onMove = (e) => {
      const now = performance.now();
      if (now - lastEmitted.current < MIN_INTERVAL) return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.hypot(dx, dy);
      if (dist < MIN_DIST) return;

      const dt = Math.max(1, now - lastPos.current.t);
      const speed = dist / dt;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      lastEmitted.current = now;
      lastPos.current = { x: e.clientX, y: e.clientY, t: now };

      const id = ++_id;
      const item = {
        id,
        x: e.clientX,
        y: e.clientY,
        angle,
        scale: Math.min(1.6, 0.4 + speed * 0.6),
      };
      setTrails((s) => [...s, item]);
      setTimeout(() => {
        setTrails((s) => s.filter((it) => it.id !== id));
      }, TRAIL_LIFE);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      aria-hidden="true"
    >
      <AnimatePresence>
        {trails.map((tr) => (
          <motion.div
            key={tr.id}
            initial={{ opacity: 0.55, scale: tr.scale * 0.5 }}
            animate={{ opacity: 0, scale: tr.scale, x: 0, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: tr.x,
              top: tr.y,
              width: 24,
              height: 4,
              marginLeft: -12,
              marginTop: -2,
              transform: `rotate(${tr.angle}deg)`,
              borderRadius: 999,
              background:
                "linear-gradient(to right, rgba(220,255,30,0.7), rgba(93,231,224,0.4) 60%, transparent)",
              filter: "blur(1.5px)",
              willChange: "opacity, transform",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
