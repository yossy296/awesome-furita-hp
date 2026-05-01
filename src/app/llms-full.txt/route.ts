import { getPayload } from "payload";
import config from "@payload-config";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 300;

// Best-effort plain-text extraction from BlockNote-style JSON document.
function extractText(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("\n");
  if (typeof node === "object") {
    const n = node as Record<string, unknown>;
    if (typeof n.text === "string") return n.text;
    const pieces: string[] = [];
    for (const v of Object.values(n)) pieces.push(extractText(v));
    return pieces.join("");
  }
  return "";
}

export async function GET() {
  const payload = await getPayload({ config });
  const { docs } = await payload
    .find({
      collection: "posts",
      limit: 100,
      sort: "-publishedAt",
      locale: "ja",
      where: { status: { equals: "published" } },
    })
    .catch(() => ({ docs: [] as any[] }));

  const sections = (docs as any[]).map((p) => {
    const url = `${SITE.url}/blog/${p.slug}`;
    const date = p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : "";
    const body = extractText(p.bodyJson).replace(/\n{3,}/g, "\n\n").trim();
    return [
      `## ${p.title}`,
      `URL: ${url}`,
      date ? `Published: ${date}` : "",
      "",
      body ? `\n${body}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  });

  const out = `# ${SITE.brand}

> ${SITE.description}

This is the long-form bundle of ${SITE.brand}'s site content for LLM ingestion.
Source of truth: ${SITE.url}

${sections.join("\n\n---\n\n") || "(no published content yet)"}
`;

  return new Response(out, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
