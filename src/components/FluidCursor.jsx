"use client";

import { useEffect, useRef, useState } from "react";

export default function FluidCursor() {
  const canvasRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // webgl-fluid has a multi-touch bug that throws on mobile, and the effect
    // is purely a mouse-cursor decoration anyway — skip on touch / no-hover
    // devices.
    const isTouchOnly =
      window.matchMedia?.("(hover: none), (pointer: coarse)").matches;
    if (isTouchOnly) {
      setHidden(true);
      return;
    }

    const setSize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(window.innerWidth * dpr);
      c.height = Math.floor(window.innerHeight * dpr);
    };

    setSize();
    window.addEventListener("resize", setSize);

    (async () => {
      try {
        const mod = await import("webgl-fluid");
        if (cancelled || !canvasRef.current) return;
        const fluid = mod.default || mod;
        fluid(canvasRef.current, {
          IMMEDIATE: true,
          TRIGGER: "click",
          SIM_RESOLUTION: 128,
          DYE_RESOLUTION: 1024,
          DENSITY_DISSIPATION: 1.6,
          VELOCITY_DISSIPATION: 1.4,
          PRESSURE: 0.8,
          PRESSURE_ITERATIONS: 20,
          CURL: 30,
          SPLAT_RADIUS: 0.25,
          SPLAT_FORCE: 6000,
          SHADING: true,
          COLOR_UPDATE_SPEED: 10,
          PAUSED: false,
          BACK_COLOR: { r: 0, g: 0, b: 0 },
          TRANSPARENT: true,
          BLOOM: true,
          BLOOM_ITERATIONS: 8,
          BLOOM_RESOLUTION: 256,
          BLOOM_INTENSITY: 0.8,
          BLOOM_THRESHOLD: 0.6,
          BLOOM_SOFT_KNEE: 0.7,
          SUNRAYS: true,
          SUNRAYS_RESOLUTION: 196,
          SUNRAYS_WEIGHT: 1.0,
        });
      } catch (e) {
        console.warn("FluidCursor init failed", e);
      }
    })();

    // Fade the canvas out after the intro splat has played out
    const fade = setTimeout(() => setHidden(true), 4500);

    return () => {
      cancelled = true;
      clearTimeout(fade);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9998,
        mixBlendMode: "screen",
        opacity: hidden ? 0 : 1,
        transition: "opacity 1.6s ease",
      }}
      aria-hidden="true"
    />
  );
}
