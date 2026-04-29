"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "motion/react";
import blobs from "blobs/v2";

function gen(seed, extraPoints = 8, randomness = 4) {
  return blobs.svgPath({
    seed,
    extraPoints,
    randomness,
    size: 500,
  });
}

/**
 * Renders an <svg> with a morphing organic blob clipPath whose ID is exposed
 * via getClipId(). Wrap content (e.g. img) and apply clipPath: url(#id) to clip.
 */
export default function MorphingBlob({
  children,
  className,
  style,
  seed = 1,
  count = 5,
  duration = 6,
  extraPoints = 8,
  randomness = 4,
}) {
  const baseId = useId().replace(/[^\w-]/g, "");
  const clipId = `blob-clip-${baseId}`;

  const paths = useMemo(() => {
    return Array.from({ length: count }, (_, i) =>
      gen(seed + i * 1000, extraPoints, randomness)
    );
  }, [seed, count, extraPoints, randomness]);

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => setStep((s) => (s + 1) % paths.length), duration * 1000);
    return () => clearInterval(id);
  }, [mounted, paths.length, duration]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        clipPath: mounted ? `url(#${clipId})` : undefined,
        WebkitClipPath: mounted ? `url(#${clipId})` : undefined,
        ...style,
      }}
      suppressHydrationWarning
    >
      {mounted && (
        <svg
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0 }}
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <motion.path
                animate={{ d: paths[step] }}
                transition={{ duration, ease: [0.42, 0, 0.58, 1] }}
                initial={{ d: paths[0] }}
                transform="scale(0.002)"
              />
            </clipPath>
          </defs>
        </svg>
      )}
      {children}
    </div>
  );
}
