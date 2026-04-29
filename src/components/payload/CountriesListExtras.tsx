import { getPayload } from "payload";
import config from "@payload-config";

async function counts() {
  try {
    const payload = await getPayload({ config });
    const [all, pub, unpub, gallery] = await Promise.all([
      payload.count({ collection: "countries" }),
      payload.count({
        collection: "countries",
        where: { publishedAt: { exists: true } },
      }),
      payload.count({
        collection: "countries",
        where: { publishedAt: { exists: false } },
      }),
      payload.find({ collection: "countries", limit: 200, depth: 0 }),
    ]);
    const galleryTotal = (gallery.docs as Array<{ gallery?: unknown[] }>).reduce(
      (sum, d) => sum + (Array.isArray(d.gallery) ? d.gallery.length : 0),
      0,
    );
    return {
      total: all.totalDocs,
      published: pub.totalDocs,
      unpublished: unpub.totalDocs,
      gallery: galleryTotal,
    };
  } catch {
    return { total: 0, published: 0, unpublished: 0, gallery: 0 };
  }
}

export default async function CountriesListExtras() {
  const c = await counts();

  const items = [
    {
      label: "総件数",
      value: c.total,
      sub: "登録済みの旅路",
      unit: "件",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      ),
      mod: "blue",
    },
    {
      label: "公開中",
      value: c.published,
      sub: "サイトに表示中",
      unit: "件",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
        </svg>
      ),
      mod: "cyan",
    },
    {
      label: "未公開",
      value: c.unpublished,
      sub: "公開日未設定",
      unit: "件",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
      mod: "purple",
    },
    {
      label: "ギャラリー",
      value: c.gallery,
      sub: "登録写真の合計",
      unit: "枚",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
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
                <small>{it.unit}</small>
              </span>
              <span className="adm-kpi__sub">{it.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
