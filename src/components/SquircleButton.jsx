"use client";

import { useEffect, useId, useRef, useState } from "react";

const HEXES = [
  "3b82f6", "1d4ed8", // blue
  "22c55e", "15803d", // green
  "ef4444", "b91c1c", // red
  "ff6a00", "cc5500", // orange
  "ffc800", "cca000", // yellow
  "14b8a6", "0f766e", // teal
  "db3b7c", "b02e64", // pink
  "9356d4", "6b3fa1", // purple
  "334155", "1e293b", // slate
  "ffbf00", "cc9900", // amber
  "ffffff", "d3e2ef", // white
  "dcff1e", "8aaa00", // lime
];

const COLORS = {
  blue: 0, green: 1, red: 2, orange: 3, yellow: 4, teal: 5,
  pink: 6, purple: 7, slate: 8, amber: 9, white: 10, lime: 11,
};

const round2 = (n) => Math.round(n * 100) / 100;

function squirclePath(w, h, r, x, y) {
  let p = "";
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 31; i++) {
      const q = ((j + i / 30) * Math.PI) / 2;
      const c = Math.cos(q);
      const s = Math.sin(q);
      const px =
        x + (c > 0 ? w - r : r) + Math.sign(c) * Math.pow(Math.abs(c), 0.6) * r;
      const py =
        y + (s > 0 ? h - r : r) + Math.sign(s) * Math.pow(Math.abs(s), 0.6) * r;
      p += (j || i ? "L" : "M") + round2(px) + " " + round2(py);
    }
  }
  return p + "Z";
}

const mix = (hex, pct, k) => `color-mix(in srgb, #${hex} ${pct}%, ${k})`;

export default function SquircleButton({
  children,
  color = "lime",
  height = 56,
  fullWidth = false,
  arrow = true,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  href,
  target,
  rel,
  sq = false,
  icon,
  iconColor,
  ariaLabel,
  width,
  pressed: pressedProp,
}) {
  const Tag = href ? "a" : "button";
  const reactId = useId();
  const uid = reactId.replace(/[^a-zA-Z0-9]/g, "");
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const [pressedState, setPressed] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const pressed =
    mounted && pressedProp != null
      ? pressedProp
        ? 1
        : 0
      : pressedState;
  const [innerW, setInnerW] = useState(
    sq ? 40 : width != null ? width : 360,
  );

  // Measure container width for full-width mode, else measure text content
  useEffect(() => {
    if (sq) return;
    if (width != null) {
      setInnerW(width);
      return;
    }
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const update = () => {
      if (fullWidth) {
        const w = el.offsetWidth / (height / 40) - 10;
        if (w > 0) setInnerW(Math.round(w));
      } else if (textRef.current) {
        const tw = textRef.current.offsetWidth;
        setInnerW(Math.ceil((tw + 100) * 1.1));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fullWidth, height, children, sq, width]);

  const idx = COLORS[color] ?? COLORS.lime;
  const hb = HEXES[idx * 2];
  const hd = HEXES[idx * 2 + 1];
  const isWhite = color === "white";
  const hi = mix(hb, 70, "white");
  const sh = mix(hd, 35, "black");
  const scale = height / 40;
  const w = innerW;
  const baseY = 12;
  const faceY = 4 + pressed * 5;
  const z = Math.min(0.5, 20 / w);
  const dy = 4 - pressed * 2;
  const std = 3 - pressed * 1.5;

  const totalW = w + 10;
  const totalH = 60;
  const stripCount = Math.max(0, baseY - faceY);
  const r = sq ? 20 : 18;
  const resolvedIconColor =
    iconColor || (isWhite ? `#${hb}` : color === "slate" ? `#${HEXES[COLORS.lime * 2]}` : "#0E1116");

  const handleDown = () => !disabled && setPressed(1);
  const handleUp = () => setPressed(0);

  const tagProps = href
    ? { href, target, rel }
    : { type, disabled, onClick };
  if (ariaLabel) tagProps["aria-label"] = ariaLabel;

  return (
    <Tag
      ref={wrapRef}
      {...tagProps}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      onPointerCancel={handleUp}
      className={`squircle-btn ${className}`}
      style={{
        width: fullWidth ? "100%" : `${totalW * scale}px`,
        height: `${totalH * scale}px`,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {/* hidden measurer for label */}
      <span
        ref={textRef}
        className="squircle-btn__measure"
        aria-hidden="true"
      >
        {children}
      </span>
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <filter id={`b${uid}`} x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dy={dy} stdDeviation={std} floodColor={sh} floodOpacity="0.3" />
          </filter>
          <linearGradient id={`g${uid}`}>
            <stop offset="0" stopColor={mix(hd, 65, "white")} />
            <stop offset={z} stopColor={mix(hd, 90, "white")} />
            <stop offset={1 - z} stopColor={mix(hd, 90, "white")} />
            <stop offset="1" stopColor={mix(hd, 65, "white")} />
          </linearGradient>
        </defs>
        {/* Drop-shadow base */}
        <path
          d={squirclePath(w, 40, r, 5, baseY)}
          fill={mix(hd, 60, "black")}
          filter={`url(#b${uid})`}
        />
        {/* Dark base */}
        <path
          d={squirclePath(w, 40, r, 5, baseY)}
          fill={mix(hd, 80, "black")}
          stroke={mix(hd, 50, "black")}
          strokeWidth="1"
        />
        {/* Side depth strips */}
        {Array.from({ length: stripCount }).map((_, k) => (
          <path
            key={k}
            d={squirclePath(w, 40, r, 5, faceY + 1 + k)}
            fill={`url(#g${uid})`}
          />
        ))}
        {/* Face */}
        <path
          d={squirclePath(w, 40, r, 5, faceY)}
          fill={isWhite ? "#fff" : `#${hb}`}
          stroke={isWhite ? "#e2e8f0" : hi}
          strokeWidth="1.5"
        />
        {sq ? (
          <g
            transform={`translate(${5 + w / 2 - 12} ${faceY + 8}) scale(1)`}
            style={{ color: resolvedIconColor, pointerEvents: "none" }}
          >
            {icon}
          </g>
        ) : (
          <text
            x={5 + w / 2}
            y={20 + faceY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#0E1116"
            style={{ pointerEvents: "none", fontWeight: 900 }}
          >
            <tspan fontSize="15" letterSpacing="2" fontFamily="system-ui, 'Inter', sans-serif">
              {String(children).toUpperCase()}
            </tspan>
            {arrow && (
              <tspan dx="10" fontSize="16" fontFamily="system-ui">
                →
              </tspan>
            )}
          </text>
        )}
      </svg>
    </Tag>
  );
}
