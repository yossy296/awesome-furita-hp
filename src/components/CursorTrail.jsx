"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function CursorTrail({
  color = "#080808",
  lineWidth = 3,
  spring = 0.15,
  friction = 0.5,
  trailDuration = 300,
  // Offset applied to mouse position so the trail emanates from the paper
  // plane's tail (which sits below-and-slightly-left of the cursor tip).
  offsetX = 12,
  offsetY = 40,
}) {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const ballRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animRef = useRef();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!ballRef.current.x && !ballRef.current.y) {
        ballRef.current = { x: w / 2, y: h / 2 };
        targetRef.current = { x: w / 2, y: h / 2 };
      }
    };
    resize();

    const onMove = (e) => {
      targetRef.current = { x: e.clientX + offsetX, y: e.clientY + offsetY };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);

    const hexToRgba = (col, alpha) => {
      if (col.startsWith("#") && col.length === 7) {
        const r = parseInt(col.slice(1, 3), 16);
        const g = parseInt(col.slice(3, 5), 16);
        const b = parseInt(col.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
      }
      return `rgba(0,0,0,${alpha})`;
    };

    const animate = () => {
      const now = performance.now();
      const dt = Math.min(now - lastTimeRef.current, 33);
      lastTimeRef.current = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 物理 (spring + friction)
      const dx = targetRef.current.x - ballRef.current.x;
      const dy = targetRef.current.y - ballRef.current.y;
      velocityRef.current.x += dx * spring;
      velocityRef.current.y += dy * spring;
      velocityRef.current.x *= friction;
      velocityRef.current.y *= friction;
      ballRef.current.x += velocityRef.current.x;
      ballRef.current.y += velocityRef.current.y;

      // トレイル更新
      pointsRef.current.push({ x: ballRef.current.x, y: ballRef.current.y, age: 0 });
      pointsRef.current.forEach((p) => (p.age += dt));
      pointsRef.current = pointsRef.current.filter((p) => p.age < trailDuration);

      // 線のみ描画
      if (pointsRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);
        for (let i = 1; i < pointsRef.current.length; i++) {
          ctx.lineTo(pointsRef.current[i].x, pointsRef.current[i].y);
        }
        const oldest = pointsRef.current[0];
        const newest = pointsRef.current[pointsRef.current.length - 1];
        const oldestOpacity = 1 - oldest.age / trailDuration;
        const grad = ctx.createLinearGradient(oldest.x, oldest.y, newest.x, newest.y);
        grad.addColorStop(0, hexToRgba(color, Math.max(0, oldestOpacity * 0.3)));
        grad.addColorStop(1, hexToRgba(color, 1));
        ctx.strokeStyle = grad;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [mounted, color, lineWidth, spring, friction, trailDuration, offsetX, offsetY]);

  if (!mounted) return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />,
    document.body
  );
}
