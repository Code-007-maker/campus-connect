// src/i18n/index.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "./en.json";
import hi from "./hi.json";

const LANG_KEY = "campus_lang_v1";
const FALLBACK = "en";
const LOCALES = { en, hi };

const I18nContext = createContext({
  lang: FALLBACK,
  setLang: () => {},
  t: (k) => k
});

export function I18nProvider({ children, initial = undefined }) {
  const [lang, setLangState] = useState(() => {
    try {
      return initial || localStorage.getItem(LANG_KEY) || FALLBACK;
    } catch {
      return FALLBACK;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {}
  }, [lang]);

  const setLang = (l) => {
    if (!LOCALES[l]) return;
    setLangState(l);
  };

  // nested-key getter: supports keys like "nav.announcements"
  const getByPath = (obj, path) => {
    if (!path) return undefined;
    const parts = path.split(".");
    let cur = obj;
    for (let p of parts) {
      if (!cur || typeof cur !== "object" || !(p in cur)) return undefined;
      cur = cur[p];
    }
    return cur;
  };

  const t = (key, fallback) => {
    if (!key) return fallback ?? key;
    const dict = LOCALES[lang] || LOCALES[FALLBACK];
    const val = getByPath(dict, key);
    if (typeof val !== "undefined") return val;
    // fallback to english
    const enVal = getByPath(LOCALES[FALLBACK], key);
    return enVal ?? fallback ?? key;
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  return useContext(I18nContext);
}