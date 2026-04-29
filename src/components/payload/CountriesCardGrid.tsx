import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";

type Media = { url?: string | null; thumbnailURL?: string | null; alt?: string | null };
type Country = {
  id: string | number;
  number?: string | null;
  name?: string | null;
  country?: string | null;
  description?: string | null;
  order?: number | null;
  publishedAt?: string | null;
  image?: Media | string | null;
};

function imageURL(image: Country["image"]): string | null {
  if (!image || typeof image !== "object") return null;
  return image.thumbnailURL || image.url || null;
}

async function fetchCountries(): Promise<Country[]> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "countries",
      limit: 100,
      sort: "order",
      depth: 1,
    });
    return res.docs as unknown as Country[];
  } catch {
    return [];
  }
}

export default async function CountriesCardGrid() {
  const docs = await fetchCountries();

  return (
    <div className="adm-cards-wrap">
      <div className="adm-cards-head">
        <span className="adm-cards-head__count">{docs.length}件</span>
      </div>
      {docs.length === 0 ? (
        <div className="adm-cards-empty">まだ旅路が登録されていません。</div>
      ) : (
        <div className="adm-cards">
          {docs.map((d) => {
            const src = imageURL(d.image);
            const title = [d.name, d.country].filter(Boolean).join(", ");
            return (
              <Link
                key={d.id}
                href={`/admin/collections/countries/${d.id}`}
                className="adm-card"
              >
                <span className="adm-card__photo">
                  {src ? (
                    <img src={src} alt={title} loading="lazy" />
                  ) : (
                    <span className="adm-card__photo-empty" aria-label="画像なし" />
                  )}
                  {d.number ? <span className="adm-card__num">{d.number}</span> : null}
                </span>
                <span className="adm-card__body">
                  <span className="adm-card__title">{title || "（無題）"}</span>
                  {d.description ? (
                    <span className="adm-card__desc">{d.description}</span>
                  ) : null}
                  <span className="adm-card__meta">
                    <span>並び順 {d.order ?? "-"}</span>
                    {d.publishedAt ? (
                      <span>{new Date(d.publishedAt).toLocaleDateString("ja-JP")}</span>
                    ) : null}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
