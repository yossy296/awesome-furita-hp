"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@payloadcms/ui";

const locales = [
  { code: "ja", label: "JA — 日本語" },
  { code: "en", label: "EN — English" },
];

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("locale") || "ja";

  // useForm exists when inside a document edit context. Wrap in try/catch via
  // optional access, since this component might also render outside a form.
  let formCtx: any = null;
  try {
    formCtx = useForm();
  } catch {}

  const [busy, setBusy] = useState(false);

  const switchTo = async (code: string) => {
    if (code === current || busy) return;
    setBusy(true);
    try {
      // Save current locale's data first to preserve unsaved input.
      if (formCtx?.submit) {
        try {
          await formCtx.submit({ skipValidation: true });
        } catch {
          // ignore save errors and continue switching
        }
      }
      const next = new URLSearchParams(params.toString());
      next.set("locale", code);
      router.push(`${pathname}?${next.toString()}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="furi-loc-switch">
      <span className="furi-loc-switch__label">記事の言語</span>
      <div className="furi-loc-switch__btns">
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            disabled={busy}
            onClick={() => switchTo(l.code)}
            className={`furi-loc-switch__btn ${current === l.code ? "active" : ""}`}
          >
            {busy && current !== l.code ? "保存中..." : l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
