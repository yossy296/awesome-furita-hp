import type { DefaultServerCellComponentProps } from "payload";

type Media = {
  url?: string | null;
  thumbnailURL?: string | null;
  alt?: string | null;
  filename?: string | null;
};

export default function HeroImageCell({ cellData }: DefaultServerCellComponentProps) {
  const media = cellData as Media | string | number | null | undefined;

  if (!media || typeof media !== "object") {
    return <span className="adm-thumb adm-thumb--empty" aria-label="画像なし" />;
  }

  const src = media.thumbnailURL || media.url;
  if (!src) {
    return <span className="adm-thumb adm-thumb--empty" aria-label="画像なし" />;
  }

  return (
    <span className="adm-thumb">
      <img src={src} alt={media.alt || media.filename || ""} loading="lazy" />
    </span>
  );
}
