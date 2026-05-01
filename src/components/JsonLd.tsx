import type { Thing, WithContext } from "schema-dts";

interface Props<T extends Thing> {
  data: WithContext<T> | WithContext<T>[];
}

/**
 * Renders a JSON-LD <script> tag with type-safe schema.org data.
 *
 * Usage:
 *   const article: WithContext<Article> = { "@context": "https://schema.org", "@type": "Article", ... };
 *   <JsonLd data={article} />
 *
 * Multiple graphs can be passed as an array; each is rendered as its own script.
 */
export default function JsonLd<T extends Thing>({ data }: Props<T>) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
