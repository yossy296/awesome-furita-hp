import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";

const items = [
  {
    slug: "posts",
    label: "ブログ記事",
    icon: "✍️",
    color: "#5DE7E0",
    desc: "記事の作成・公開・タグ管理",
  },
  {
    slug: "categories",
    label: "カテゴリ",
    icon: "🏷",
    color: "#B8DA00",
    desc: "ブログ記事のカテゴリ分け",
  },
  {
    slug: "countries",
    label: "旅路 (Journey)",
    icon: "🗺",
    color: "#DCFF1E",
    desc: "訪れた国・都市・写真",
  },
  {
    slug: "partners",
    label: "パートナー",
    icon: "🤝",
    color: "#FFB37A",
    desc: "Worksのコラボ先",
  },
  {
    slug: "media",
    label: "メディア",
    icon: "🖼",
    color: "#E9F1FF",
    desc: "画像のアップロード",
  },
  {
    slug: "contacts",
    label: "お問い合わせ",
    icon: "📨",
    color: "#F1E6FF",
    desc: "受信したメッセージ",
  },
  {
    slug: "users",
    label: "ユーザー",
    icon: "👤",
    color: "#FFE3F0",
    desc: "管理者アカウント",
  },
];

async function getCounts() {
  try {
    const payload = await getPayload({ config });
    const results = await Promise.all(
      items.map((it) =>
        payload
          .count({ collection: it.slug as any })
          .then((r: any) => r.totalDocs)
          .catch(() => 0)
      )
    );
    return Object.fromEntries(items.map((it, i) => [it.slug, results[i]]));
  } catch {
    return Object.fromEntries(items.map((it) => [it.slug, 0]));
  }
}

async function getLatestPosts() {
  try {
    const payload = await getPayload({ config });
    const r = await payload.find({
      collection: "posts",
      limit: 5,
      sort: "-updatedAt",
    });
    return r.docs as any[];
  } catch {
    return [];
  }
}

export default async function Dashboard() {
  const [counts, latest] = await Promise.all([getCounts(), getLatestPosts()]);

  return (
    <div className="furi-admin">
      <header className="furi-admin__hero">
        <div>
          <p className="furi-admin__eyebrow">Welcome back</p>
          <h1 className="furi-admin__title">Furi Admin</h1>
          <p className="furi-admin__sub">
            ブログ・旅路・パートナーをここから管理。サイトに反映するには下書き → 公開ステータスを変更してください。
          </p>
        </div>
        <div className="furi-admin__brand">Furi</div>
      </header>

      <section className="furi-admin__grid">
        {items.map((it) => (
          <Link
            key={it.slug}
            href={`/admin/collections/${it.slug}`}
            className="furi-card"
            style={{ ["--accent" as any]: it.color }}
          >
            <div className="furi-card__icon">{it.icon}</div>
            <div className="furi-card__body">
              <h3>{it.label}</h3>
              <p>{it.desc}</p>
            </div>
            <div className="furi-card__count">
              <span>{counts[it.slug] ?? 0}</span>
              <em>件</em>
            </div>
          </Link>
        ))}
      </section>

      <section className="furi-admin__panels">
        <div className="furi-panel">
          <div className="furi-panel__head">
            <h3>最近の記事</h3>
            <Link href="/admin/collections/posts">すべて表示 →</Link>
          </div>
          {latest.length === 0 ? (
            <p className="furi-panel__empty">
              まだ記事がありません。{" "}
              <Link href="/admin/collections/posts/create">最初の記事を作成 →</Link>
            </p>
          ) : (
            <ul className="furi-list">
              {latest.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/collections/posts/${p.id}`}>
                    <span className={`furi-status furi-status--${p.status || "draft"}`}>
                      {p.status === "published" ? "公開" : "下書き"}
                    </span>
                    <span className="furi-list__title">{p.title || "(無題)"}</span>
                    <span className="furi-list__date">
                      {p.updatedAt && new Date(p.updatedAt).toLocaleString("ja-JP")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="furi-panel">
          <div className="furi-panel__head">
            <h3>クイックアクション</h3>
          </div>
          <div className="furi-quick">
            <Link href="/admin/collections/posts/create" className="furi-quick__btn furi-quick__btn--primary">
              <span>＋</span> 新しい記事
            </Link>
            <Link href="/admin/collections/countries/create" className="furi-quick__btn">
              <span>＋</span> 旅路を追加
            </Link>
            <Link href="/admin/collections/partners/create" className="furi-quick__btn">
              <span>＋</span> パートナーを追加
            </Link>
            <Link href="/admin/collections/media/create" className="furi-quick__btn">
              <span>↑</span> メディアをアップロード
            </Link>
            <Link href="/" className="furi-quick__btn furi-quick__btn--ghost">
              <span>↗</span> サイトを開く
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
