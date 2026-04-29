"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

let _id = 0;

export default function CursorJetStream() {
  const [streaks, setStreaks] = useState([]);
  const lastEmit = useRef(0);
  const lastPos = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    const LIFE = 850;
    const MIN_INTERVAL = 18;
    const MIN_DIST = 4;

    const onMove = (e) => {
      const now = performance.now();
      if (now - lastEmit.current < MIN_INTERVAL) return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.hypot(dx, dy);
      if (dist < MIN_DIST) return;

      const dt = Math.max(1, now - lastPos.current.t);
      const speed = Math.min(2.4, dist / dt);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      lastEmit.current = now;
      lastPos.current = { x: e.clientX, y: e.clientY, t: now };

      const id = ++_id;
      const item = {
        id,
        x: e.clientX,
        y: e.clientY,
        angle,
        length: 28 + speed * 36,
        thickness: 2 + speed * 1.4,
      };
      setStreaks((s) => [...s, item]);
      setTimeout(() => {
        setStreaks((s) => s.filter((it) => it.id !== id));
      }, LIFE);
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
        zIndex: 9997,
      }}
      aria-hidden="true"
    >
      <AnimatePresence>
        {streaks.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0.7, scaleX: 0.4 }}
            animate={{ opacity: 0, scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: s.length,
              height: s.thickness,
              marginTop: -s.thickness / 2,
              transform: `rotate(${s.angle}deg)`,
              transformOrigin: "100% 50%",
              borderRadius: 999,
              background:
                "linear-gradient(to left, rgba(220,255,30,0.85) 0%, rgba(255,255,255,0.4) 35%, rgba(255,255,255,0) 100%)",
              filter: "blur(2.5px)",
              willChange: "opacity, transform",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
