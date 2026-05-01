/**
 * Helpers for pulling derived metadata (image / excerpt) out of a BlockNote-style
 * JSON document. Used so we can drop explicit `excerpt` / `ogImage` fields and
 * derive them from body content automatically.
 */

/** Walks the doc and returns the URL of the first image block, or null. */
export function extractFirstImageUrl(node: unknown): string | null {
  if (!node) return null;

  if (Array.isArray(node)) {
    for (const item of node) {
      const r = extractFirstImageUrl(item);
      if (r) return r;
    }
    return null;
  }

  if (typeof node === "object") {
    const n = node as Record<string, any>;
    const t = typeof n.type === "string" ? n.type.toLowerCase() : "";
    if (t.includes("image")) {
      const url = n.props?.url || n.url || n.src || n.props?.src;
      if (typeof url === "string" && url.length > 0) return url;
    }
    for (const v of Object.values(n)) {
      const r = extractFirstImageUrl(v);
      if (r) return r;
    }
  }

  return null;
}

/** Concatenates all text content found in a BlockNote-style document. */
export function extractPlainText(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractPlainText).join(" ");
  if (typeof node === "object") {
    const n = node as Record<string, any>;
    if (typeof n.text === "string") return n.text;
    const pieces: string[] = [];
    for (const v of Object.values(n)) pieces.push(extractPlainText(v));
    return pieces.join(" ");
  }
  return "";
}

/**
 * Returns a concise excerpt derived from a post's bodyJson — collapsed
 * whitespace, truncated to `maxLength` chars (default 140) with an ellipsis if
 * trimmed. Returns "" if there's no extractable text.
 */
export function getExcerpt(bodyJson: unknown, maxLength = 140): string {
  const raw = extractPlainText(bodyJson).replace(/\s+/g, " ").trim();
  if (!raw) return "";
  if (raw.length <= maxLength) return raw;
  return raw.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}
