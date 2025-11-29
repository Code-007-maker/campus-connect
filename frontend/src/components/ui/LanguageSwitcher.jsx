// src/components/ui/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "../../i18n/index.jsx";

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition dark:text-black ${lang === "en" ? "bg-slate-100 ring-1 ring-indigo-200" : "hover:bg-slate-50"}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>

      <button
        onClick={() => setLang("hi")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition ${lang === "hi" ? "bg-slate-100 ring-1 ring-indigo-200" : "hover:bg-slate-50"}`}
        aria-pressed={lang === "hi"}
      >
        HI
      </button>
    </div>
  );
}