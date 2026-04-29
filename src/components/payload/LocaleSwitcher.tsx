"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@payloadcms/ui";

const locales = [
  { code: "ja", label: "JA" },
  { code: "en", label: "EN" },
];

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("locale") || "ja";

  // useForm exists when inside a document edit context.
  let formCtx: any = null;
  try {
    formCtx = useForm();
  } catch {}

  const [busy, setBusy] = useState(false);
  const [panel, setPanel] = useState<HTMLElement | null>(null);

  // Find the form panel on mount and re-attach if it remounts
  useEffect(() => {
    const findPanel = () =>
      document.querySelector<HTMLElement>(
        ".collection-edit__main, .document-fields, .render-fields"
      );
    let attempts = 0;
    const tryAttach = () => {
      const el = findPanel();
      if (el) {
        setPanel(el);
        return;
      }
      if (attempts++ < 30) {
        setTimeout(tryAttach, 80);
      }
    };
    tryAttach();
  }, [pathname]);

  const switchTo = async (code: string) => {
    if (code === current || busy) return;
    setBusy(true);
    try {
      if (formCtx?.submit) {
        try {
          await formCtx.submit({ skipValidation: true });
        } catch {}
      }
      const next = new URLSearchParams(params.toString());
      next.set("locale", code);
      router.push(`${pathname}?${next.toString()}`);
    } finally {
      setBusy(false);
    }
  };

  const node = (
    <div className="furi-loc-switch">
      <span className="furi-loc-switch__label">言語</span>
      <div className="furi-loc-switch__btns">
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            disabled={busy}
            onClick={() => switchTo(l.code)}
            className={`furi-loc-switch__btn ${current === l.code ? "active" : ""}`}
          >
            {busy && current !== l.code ? "..." : l.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (!panel) return null;
  return createPortal(node, panel);
}
