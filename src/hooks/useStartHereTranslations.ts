import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/components/dashboard/menuData";
import { Language } from "@/contexts/LanguageContext";

type TranslationState = "native" | "translating" | "translated" | "fallback";
type TranslationResponse = { key: string; text: string; confidence: number };

const hashSource = (value: string) => {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 33) ^ value.charCodeAt(index);
  return (hash >>> 0).toString(16);
};

const cacheKey = (language: Language, source: string) => `hajcare:start-here:${language}:${hashSource(source)}`;

export function useStartHereTranslations(items: MenuItem[], language: Language, fallbackTitle: string) {
  const sourceItems = useMemo(
    () => items.map((item) => ({ key: item.id, text: item.label.en })),
    [items],
  );
  const source = useMemo(() => JSON.stringify({ title: "Start here", items: sourceItems }), [sourceItems]);
  const native = language === "en" || sourceItems.every((item) => items.find((menuItem) => menuItem.id === item.key)?.label[language]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [state, setState] = useState<TranslationState>(native ? "native" : "translating");

  useEffect(() => {
    let cancelled = false;
    if (native) {
      setTranslations({});
      setState("native");
      return () => { cancelled = true; };
    }
    const key = cacheKey(language, source);
    try {
      const cached = JSON.parse(localStorage.getItem(key) || "null") as { translations?: TranslationResponse[] } | null;
      if (cached?.translations?.length) {
        setTranslations(Object.fromEntries(cached.translations.map((item) => [item.key, item.text])));
        setState("translated");
      }
    } catch {
      // A cache failure must never block the source-language fallback.
    }
    const load = async () => {
      const { data, error } = await supabase.functions.invoke("translate-start-here", {
        body: { sourceLanguage: "en", targetLanguage: language, items: [{ key: "section-title", text: "Start here" }, ...sourceItems] },
      });
      if (cancelled || error) {
        if (!cancelled) setState((current) => current === "translated" ? current : "fallback");
        return;
      }
      const safe = (data?.translations || []).filter((item: TranslationResponse) => item?.key && typeof item.text === "string" && item.confidence >= 0.9);
      if (!safe.length) {
        if (!cancelled) setState("fallback");
        return;
      }
      if (!cancelled) {
        setTranslations(Object.fromEntries(safe.map((item: TranslationResponse) => [item.key, item.text])));
        setState(data?.fallbackKeys?.length ? "fallback" : "translated");
        try { localStorage.setItem(key, JSON.stringify({ translations: safe, cachedAt: Date.now() })); } catch { /* cache is optional */ }
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [language, native, source, sourceItems]);

  const translatedItems = useMemo(() => items.map((item) => ({
    ...item,
    label: { ...item.label, [language]: translations[item.id] || item.label[language] || item.label.en },
  })), [items, language, translations]);
  const translatedTitle = translations["section-title"] || fallbackTitle;
  return { translatedItems, translatedTitle, state, usedFallback: state === "fallback" };
}
