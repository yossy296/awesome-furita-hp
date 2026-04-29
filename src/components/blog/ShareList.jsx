"use client";

import { useEffect, useState } from "react";

export default function ShareList({ title }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const t = encodeURIComponent(title || "");
  const u = encodeURIComponent(url);

  const onCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <ul className="share-list">
      <li>
        <a
          href={`https://twitter.com/intent/tweet?text=${t}&url=${u}`}
          target="_blank"
          rel="noopener"
          aria-label="X (Twitter)"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M18.244 2H21l-6.52 7.45L22 22h-6.83l-4.76-6.22L4.8 22H2l7-7.99L1.5 2h6.96l4.3 5.69L18.244 2zm-2.4 18h1.84L7.26 4H5.32L15.844 20z" />
          </svg>
        </a>
      </li>
      <li>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
          target="_blank"
          rel="noopener"
          aria-label="Facebook"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M13 22v-8h3l1-4h-4V7.5C13 6.6 13.4 6 14.6 6H17V2.3C16.6 2.2 15.3 2 13.9 2 11 2 9 3.7 9 7v3H6v4h3v8h4z" />
          </svg>
        </a>
      </li>
      <li>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
          target="_blank"
          rel="noopener"
          aria-label="LinkedIn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.4 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V22h-4.55v-6.27c0-1.5-.03-3.43-2.09-3.43-2.09 0-2.41 1.63-2.41 3.32V22H7.62V8z" />
          </svg>
        </a>
      </li>
      <li>
        <a
          href="#"
          onClick={onCopy}
          aria-label="Copy link"
          data-tip={copied ? "Copied!" : undefined}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
            <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
          </svg>
        </a>
      </li>
    </ul>
  );
}
