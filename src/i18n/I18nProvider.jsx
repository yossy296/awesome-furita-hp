"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import ja from "./locales/ja.json";
import en from "./locales/en.json";

const dictionaries = { ja, en };
const STORAGE_KEY = "furi-locale";

const I18nCtx = createContext({
  locale: "ja",
  setLocale: () => {},
  t: (key) => key,
});

function getByPath(obj, key) {
  return key.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function I18nProvider({ children, initialLocale = "ja" }) {
  const [locale, setLocaleState] = useState(initialLocale);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && dictionaries[saved]) setLocaleState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.body?.setAttribute("data-locale", locale);
      document.cookie = `furi-locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [locale]);

  const setLocale = (l) => {
    if (!dictionaries[l]) return;
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  const value = useMemo(() => {
    const dict = dictionaries[locale] || dictionaries.ja;
    const t = (key) => {
      const v = getByPath(dict, key);
      return v == null ? key : v;
    };
    return { locale, setLocale, t };
  }, [locale]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useT() {
  return useContext(I18nCtx);
}
