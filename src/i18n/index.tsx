import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/data/cafe";
import { lenisRef, ScrollTrigger } from "@/lib/motion";
import { en, type Dict } from "./en";
import { ar } from "./ar";

export type { Dict };
const dictionaries: Record<Lang, Dict> = { en, ar };

type Ctx = { lang: Lang; dir: "ltr" | "rtl"; t: Dict; setLang: (l: Lang) => void };

const I18nCtx = createContext<Ctx | null>(null);
const LANG_KEY = "layali-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback(
    (l: Lang) => {
      if (l === lang) return;
      const html = document.documentElement;
      const y = window.scrollY;
      html.classList.add("lang-out");
      window.setTimeout(() => {
        localStorage.setItem(LANG_KEY, l);
        setLangState(l);
        // Scenes rebuild after the language swap; restore the exact scroll position once they have.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true, force: true });
            else window.scrollTo(0, y);
            html.classList.remove("lang-out");
            html.classList.add("lang-in");
            window.setTimeout(() => html.classList.remove("lang-in"), 600);
          }),
        );
      }, 220);
    },
    [lang],
  );

  return (
    <I18nCtx.Provider
      value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", t: dictionaries[lang], setLang }}
    >
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}
