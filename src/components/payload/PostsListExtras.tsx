import { getPayload } from "payload";
import config from "@payload-config";

async function counts() {
  try {
    const payload = await getPayload({ config });
    const [all, pub, draft] = await Promise.all([
      payload.count({ collection: "posts" }),
      payload.count({ collection: "posts", where: { status: { equals: "published" } } }),
      payload.count({ collection: "posts", where: { status: { equals: "draft" } } }),
    ]);
    return {
      total: all.totalDocs,
      published: pub.totalDocs,
      draft: draft.totalDocs,
    };
  } catch {
    return { total: 0, published: 0, draft: 0 };
  }
}

export default async function PostsListExtras() {
  const c = await counts();

  const items = [
    {
      label: "総件数",
      value: c.total,
      sub: "ブログ記事",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h12l4 4v12H4z" />
          <path d="M16 4v4h4M8 12h8M8 16h6" />
        </svg>
      ),
      mod: "blue",
    },
    {
      label: "公開中",
      value: c.published,
      sub: "サイトに表示中",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
        </svg>
      ),
      mod: "cyan",
    },
    {
      label: "下書き",
      value: c.draft,
      sub: "非公開の下書き",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
      mod: "purple",
    },
    {
      label: "ゴミ箱",
      value: 0,
      sub: "ゴミ箱のアイテム",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      ),
      mod: "red",
    },
  ];

  return (
    <div className="adm-list-extras">
      <div className="adm-kpis">
        {items.map((it) => (
          <div key={it.label} className={`adm-kpi adm-kpi--${it.mod}`}>
            <div className="adm-kpi__icon">{it.icon}</div>
            <div className="adm-kpi__body">
              <span className="adm-kpi__label">{it.label}</span>
              <span className="adm-kpi__value">
                {it.value}
                <small>件</small>
              </span>
              <span className="adm-kpi__sub">{it.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
