/**
 * Site-wide constants for SEO / metadata / JSON-LD.
 * Edit here in one place; pages and JSON-LD will pick up the changes.
 */
export const SITE = {
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
  brand: "Furi",
  brandFull: "ADHDバックパッカー Furi",
  legalName: "降田 義之",
  description:
    "3度のうつ病・ADHD診断を経て32カ国を踏破。立ち止まる人の次の一歩を創るFuriのポートフォリオ。",
  defaultOgImage: "/og.jpg",
  logo: "/logo_circle.png",
  locale: "ja_JP",
  alternateLocale: "en_US",
  twitter: "@furi_98_y", // adjust if a real handle exists
} as const;

export const absoluteUrl = (pathOrUrl: string): string => {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};
