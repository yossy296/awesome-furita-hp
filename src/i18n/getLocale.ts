import { cookies } from "next/headers";

export async function getLocale(): Promise<"ja" | "en"> {
  try {
    const c = await cookies();
    const v = c.get("furi-locale")?.value;
    if (v === "en" || v === "ja") return v;
  } catch {}
  return "ja";
}
