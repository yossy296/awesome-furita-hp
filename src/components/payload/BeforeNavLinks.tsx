"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BeforeNavLinks() {
  const pathname = usePathname() || "";
  const isDashboard = pathname === "/admin" || pathname === "/admin/";

  return (
    <div className="furi-side">
      <Link href="/" className="furi-side__visit">
        <span>↗</span> サイトを見る
      </Link>
      <Link
        href="/admin"
        className={`furi-side__dash${isDashboard ? " furi-side__dash--active" : ""}`}
      >
        <span className="furi-side__dash-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </span>
        <span className="furi-side__dash-label">ダッシュボード</span>
      </Link>
    </div>
  );
}
