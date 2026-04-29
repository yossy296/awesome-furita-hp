"use client";

import { useT } from "@/i18n/I18nProvider";
import SquircleButton from "./SquircleButton.jsx";

export default function LanguageToggle() {
  const { locale, setLocale } = useT();
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {["ja", "en"].map((l) => {
        const active = locale === l;
        return (
          <SquircleButton
            key={l}
            color={active ? "lime" : "white"}
            height={36}
            width={56}
            arrow={false}
            pressed={active}
            onClick={() => setLocale(l)}
            ariaLabel={`Switch to ${l.toUpperCase()}`}
            className="lang-toggle__sq"
          >
            {l.toUpperCase()}
          </SquircleButton>
        );
      })}
    </div>
  );
}
