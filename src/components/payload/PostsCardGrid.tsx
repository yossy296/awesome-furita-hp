import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import { getExcerpt } from "@/lib/extractFirstImage";

type Media = { url?: string | null; thumbnailURL?: string | null; alt?: string | null };
type Category = { id: string | number; name?: string | null };
type Post = {
  id: string | number;
  title?: string | null;
  status?: "draft" | "published" | null;
  publishedAt?: string | null;
  heroImage?: Media | string | null;
  category?: Category | string | number | null;
  bodyJson?: unknown;
};

function imageURL(image: Post["heroImage"]): string | null {
  if (!image || typeof image !== "object") return null;
  return image.thumbnailURL || image.url || null;
}

function categoryName(c: Post["category"]): string | null {
  if (!c || typeof c !== "object") return null;
  return c.name || null;
}

async function fetchPosts(): Promise<Post[]> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "posts",
      limit: 100,
      sort: "-publishedAt",
      depth: 1,
    });
    return res.docs as unknown as Post[];
  } catch {
    return [];
  }
}

export default async function PostsCardGrid() {
  const docs = await fetchPosts();

  return (
    <div className="adm-cards-wrap">
      <div className="adm-cards-head">
        <span className="adm-cards-head__count">{docs.length}件</span>
      </div>
      {docs.length === 0 ? (
        <div className="adm-cards-empty">まだブログ記事が登録されていません。</div>
      ) : (
        <div className="adm-cards">
          {docs.map((d) => {
            const src = imageURL(d.heroImage);
            const cat = categoryName(d.category);
            const isPublished = d.status === "published";
            return (
              <Link
                key={d.id}
                href={`/admin/collections/posts/${d.id}`}
                className="adm-card"
              >
                <span className="adm-card__photo">
                  {src ? (
                    <img src={src} alt={d.title || ""} loading="lazy" />
                  ) : (
                    <span className="adm-card__photo-empty" aria-label="画像なし" />
                  )}
                  <span
                    className={`adm-card__status adm-card__status--${
                      isPublished ? "pub" : "draft"
                    }`}
                  >
                    {isPublished ? "公開" : "下書き"}
                  </span>
                </span>
                <span className="adm-card__body">
                  <span className="adm-card__title">{d.title || "（無題）"}</span>
                  {(() => {
                    const ex = getExcerpt(d.bodyJson, 100);
                    return ex ? <span className="adm-card__desc">{ex}</span> : null;
                  })()}
                  <span className="adm-card__meta">
                    {cat ? <span>{cat}</span> : null}
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
