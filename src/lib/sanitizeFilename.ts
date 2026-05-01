/**
 * Convert any filename into an ASCII-safe S3 object key.
 * Supabase Storage's S3 API rejects keys with non-ASCII characters or spaces
 * (`InvalidKey`), so all uploads must be sanitized before they reach the
 * storage adapter.
 */
export function sanitizeFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const base = dot > 0 ? name.slice(0, dot) : name;

  const cleaned = base
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9\-_.]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "")
    .toLowerCase()
    .slice(0, 80);

  const safeBase = cleaned || `file-${Date.now().toString(36)}`;
  const safeExt = ext.replace(/[^A-Za-z0-9.]/g, "");
  return `${safeBase}${safeExt}`;
}
