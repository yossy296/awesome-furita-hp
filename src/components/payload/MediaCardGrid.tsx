import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";

type MediaDoc = {
  id: string | number;
  alt?: string | null;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
};

function formatSize(bytes?: number | null): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fetchMedia(): Promise<MediaDoc[]> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "media",
      limit: 200,
      sort: "-createdAt",
      depth: 0,
    });
    return res.docs as unknown as MediaDoc[];
  } catch {
    return [];
  }
}

export default async function MediaCardGrid() {
  const docs = await fetchMedia();

  return (
    <div className="adm-cards-wrap">
      <div className="adm-cards-head">
        <span className="adm-cards-head__count">{docs.length}件</span>
      </div>
      {docs.length === 0 ? (
        <div className="adm-cards-empty">まだメディアが登録されていません。</div>
      ) : (
        <div className="adm-cards adm-cards--media">
          {docs.map((d) => {
            const src = d.thumbnailURL || d.url;
            const isImage = !d.mimeType || d.mimeType.startsWith("image/");
            return (
              <Link
                key={d.id}
                href={`/admin/collections/media/${d.id}`}
                className="adm-card adm-card--media"
              >
                <span className="adm-card__photo adm-card__photo--media">
                  {src && isImage ? (
                    <img src={src} alt={d.alt || d.filename || ""} loading="lazy" />
                  ) : (
                    <span className="adm-card__photo-empty" aria-label="プレビューなし" />
                  )}
                </span>
                <span className="adm-card__body adm-card__body--media">
                  <span className="adm-card__title adm-card__title--media">
                    {d.alt || d.filename || "（無題）"}
                  </span>
                  <span className="adm-card__meta">
                    {d.width && d.height ? (
                      <span>
                        {d.width}×{d.height}
                      </span>
                    ) : null}
                    <span>{formatSize(d.filesize)}</span>
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
