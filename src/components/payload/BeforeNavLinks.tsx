import Link from "next/link";

export default function BeforeNavLinks() {
  return (
    <div className="furi-side">
      <Link href="/admin" className="furi-side__brand">
        <span className="furi-side__brand-mark">F</span>
        <div>
          <div className="furi-side__brand-name">Furi Admin</div>
          <div className="furi-side__brand-sub">Manage your site</div>
        </div>
      </Link>
      <Link href="/" className="furi-side__visit">
        <span>↗</span> サイトを見る
      </Link>
    </div>
  );
}
