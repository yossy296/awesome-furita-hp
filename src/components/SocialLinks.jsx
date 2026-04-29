"use client";

import SquircleButton from "./SquircleButton.jsx";

const items = [
  {
    label: "YouTube",
    href: "https://youtube.com/@adhdbackpacker_furi315",
    svg: (
      <path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@adhdbackpacker_furi315",
    svg: (
      <path fill="currentColor" d="M19.6 6.6c-1.6-.4-2.9-1.5-3.6-3a4.6 4.6 0 0 1-.4-1.6h-3.5v13.4a2.8 2.8 0 1 1-2-2.7v-3.5a6.3 6.3 0 1 0 5.5 6.2V8.7a8.1 8.1 0 0 0 4.7 1.5V6.7c-.2 0-.5-.05-.7-.1z" />
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/adhdbackpacker_furi315",
    svg: (
      <g fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    label: "note",
    href: "https://note.com/furi_mind315",
    svg: <path fill="currentColor" d="M6 6h2.6l6.4 8.4V6H18v12h-2.6L9 9.6V18H6V6z" />,
  },
];

export default function SocialLinks({ className = "" }) {
  return (
    <div className={className}>
      {items.map((it) => (
        <SquircleButton
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noopener"
          ariaLabel={it.label}
          color="slate"
          sq
          height={44}
          icon={it.svg}
          iconColor="#dcff1e"
          className="sns-sq"
        />
      ))}
    </div>
  );
}
