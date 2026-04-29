"use client";

import { motion } from "motion/react";
import { useT } from "@/i18n/I18nProvider";

export default function LanguageToggle() {
  const { locale, setLocale } = useT();
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {["ja", "en"].map((l) => (
        <motion.button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={`lang-toggle__btn ${locale === l ? "active" : ""}`}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.95 }}
        >
          {l.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
}
