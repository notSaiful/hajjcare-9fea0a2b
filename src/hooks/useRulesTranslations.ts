import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Language } from "@/contexts/LanguageContext";

export type RulesTranslationItem = {
  key: string;
  text: string;
  /** A reviewed translation already shipped with the app, when available. */
  nativeText?: string;
};

type TranslationState = "native" | "translating" | "translated" | "fallback";
type TranslationResponse = { key: string; text: string; confidence: number };

const hashSource = (value: string) => {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 33) ^ value.charCodeAt(index);
  return (hash >>> 0).toString(16);
};

const getCacheKey = (language: Language, source: string) =>
  `hajcare:rules-translations-v3:${language}:${hashSource(source)}`;

const hasExpectedScript = (text: string, language: Language) => {
  const patterns: Partial<Record<Language, RegExp>> = {
    ar: /[\u0600-\u06FF]/, ur: /[\u0600-\u06FF]/, sd: /[\u0600-\u06FF]/,
    hi: /[\u0900-\u097F]/, mr: /[\u0900-\u097F]/, sa: /[\u0900-\u097F]/, gom: /[\u0900-\u097F]/,
    ks: /[\u0900-\u097F\u0600-\u06FF]/, doi: /[\u0900-\u097F]/, mai: /[\u0900-\u097F]/,
    brx: /[\u0900-\u097F]/, ne: /[\u0900-\u097F]/, bn: /[\u0980-\u09FF]/, as: /[\u0980-\u09FF]/,
    gu: /[\u0A80-\u0AFF]/, pa: /[\u0A00-\u0A7F]/, or: /[\u0B00-\u0B7F]/, ta: /[\u0B80-\u0BFF]/,
    te: /[\u0C00-\u0C7F]/, kn: /[\u0C80-\u0CFF]/, ml: /[\u0D00-\u0D7F]/, sat: /[\u1C50-\u1C7F]/,
    mni: /[\uABC0-\uABFF]/, ru: /[\u0400-\u04FF]/,
  };
  // Meitei can be safely represented in Latin transliteration too.
  if (language === "mni" && /[A-Za-z]/.test(text)) return true;
  const pattern = patterns[language];
  return !pattern || pattern.test(text);
};

const isUsableCachedText = (source: string, text: string, language: Language) =>
  text.trim().toLowerCase() !== source.trim().toLowerCase() && hasExpectedScript(text, language);

/**
 * Provides instant, language-aware Rules content with a source-hash cache.
 * The source hash intentionally forms part of the key, so an admin/content
 * update automatically bypasses old translations without a manual cache purge.
 */
export function useRulesTranslations(items: RulesTranslationItem[], language: Language) {
  const source = useMemo(() => JSON.stringify(items.map(({ key, text }) => ({ key, text }))), [items]);
  const nativeTranslations = useMemo(
    () => Object.fromEntries(items.filter((item) => item.nativeText?.trim()).map((item) => [item.key, item.nativeText!.trim()])),
    [items],
  );
  const translatableItems = useMemo(
    () => items.filter((item) => !nativeTranslations[item.key]),
    [items, nativeTranslations],
  );
  const canUseNative = language === "en" || translatableItems.length === 0;
  const [translations, setTranslations] = useState<Record<string, string>>(nativeTranslations);
  const [fallbackKeys, setFallbackKeys] = useState<string[]>([]);
  const [state, setState] = useState<TranslationState>(canUseNative ? "native" : "translating");

  useEffect(() => {
    let cancelled = false;
    setTranslations(language === "en" ? {} : nativeTranslations);
    setFallbackKeys([]);
    if (canUseNative) {
      setState("native");
      return () => { cancelled = true; };
    }

    const key = getCacheKey(language, source);
    let cachedTranslations: Record<string, string> = {};
    try {
      const cached = JSON.parse(localStorage.getItem(key) || "null") as { translations?: TranslationResponse[] } | null;
      if (cached?.translations?.length) {
        cachedTranslations = Object.fromEntries(cached.translations
          .filter((item) => {
            const sourceItem = translatableItems.find((candidate) => candidate.key === item?.key);
            return item?.key && sourceItem && typeof item.text === "string" && item.confidence >= 0.9 && isUsableCachedText(sourceItem.text, item.text, language);
          })
          .map((item) => [item.key, item.text]));
        if (!cancelled) {
          setTranslations({ ...nativeTranslations, ...cachedTranslations });
          setState("translated");
        }
      }
    } catch {
      // Cache is optional; source-language fallback must always remain available.
    }

    const load = async () => {
      // Smaller batches make long Rules pages reliable for every language and
      // ensure one low-confidence item cannot invalidate an entire page.
      const requestItems = translatableItems
        .filter((item) => !cachedTranslations[item.key])
        .map(({ key: itemKey, text }) => ({ key: itemKey, text }));
      const batches: Array<typeof requestItems> = [];
      for (let index = 0; index < requestItems.length; index += 8) batches.push(requestItems.slice(index, index + 8));
      const allTranslations: TranslationResponse[] = [];
      const failedKeys: string[] = [];
      let mergedTranslations = { ...nativeTranslations, ...cachedTranslations };
      if (!cancelled) setTranslations(mergedTranslations);
      // Keep model calls sequential. Parallel calls can trip provider rate
      // limits and leave the first few cards in English even when later cards
      // translate successfully.
      const invokeBatch = async (initialBatch: typeof requestItems) => {
        let pending = initialBatch;
        const translated: TranslationResponse[] = [];
        let lastError: unknown = null;
        for (let attempt = 0; attempt < 3 && pending.length; attempt += 1) {
          if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
          const result = await supabase.functions.invoke("translate-start-here", {
            body: { sourceLanguage: "en", targetLanguage: language, items: pending },
          });
          lastError = result.error;
          const safe = (result.data?.translations || []).filter((item: TranslationResponse) =>
            item?.key && typeof item.text === "string" && item.confidence >= 0.9,
          ) as TranslationResponse[];
          translated.push(...safe);
          const unresolved = result.error || result.data?.fallback
            ? pending.map((item) => item.key)
            : (result.data?.fallbackKeys || []) as string[];
          if (!unresolved.length) return { data: { translations: translated, fallbackKeys: [] }, error: null };
          pending = pending.filter((item) => unresolved.includes(item.key));
        }
        // If a provider rejects a mixed batch, retry its remaining items one
        // at a time. This prevents a single problematic card from keeping an
        // otherwise translatable group in English.
        if (pending.length > 1) {
          const individualItems = [...pending];
          pending = [];
          for (const item of individualItems) {
            const result = await supabase.functions.invoke("translate-start-here", {
              body: { sourceLanguage: "en", targetLanguage: language, items: [item] },
            });
            const safe = (result.data?.translations || []).filter((candidate: TranslationResponse) =>
              candidate?.key === item.key && typeof candidate.text === "string" && candidate.confidence >= 0.9,
            ) as TranslationResponse[];
            translated.push(...safe);
            if (!safe.length) pending.push(item);
          }
        }
        return { data: { translations: translated, fallbackKeys: pending.map((item) => item.key) }, error: lastError };
      };
      for (const batch of batches) {
        const result = await invokeBatch(batch);
        const safe = (result.data?.translations || []).filter((item: TranslationResponse) =>
          item?.key && typeof item.text === "string" && item.confidence >= 0.9,
        ) as TranslationResponse[];
        allTranslations.push(...safe);
        failedKeys.push(...((result.data?.fallbackKeys || []) as string[]));
        if (!cancelled && safe.length) {
          mergedTranslations = { ...mergedTranslations, ...Object.fromEntries(safe.map((item) => [item.key, item.text])) };
          setTranslations(mergedTranslations);
        }
      }
      if (cancelled) return;

      const safeMap = Object.fromEntries(allTranslations.map((item) => [item.key, item.text]));
      const merged = { ...mergedTranslations, ...safeMap };
      const unresolved = translatableItems.map((item) => item.key).filter((itemKey) => !merged[itemKey]);
      setTranslations(merged);
      setFallbackKeys(Array.from(new Set([...failedKeys, ...unresolved])));
      setState(unresolved.length ? "fallback" : "translated");
      if (allTranslations.length) {
        try {
          localStorage.setItem(key, JSON.stringify({ translations: [...Object.entries(cachedTranslations).map(([itemKey, text]) => ({ key: itemKey, text, confidence: 1 })), ...allTranslations], cachedAt: Date.now() }));
        } catch {
          // Cache failures must not affect rendering.
        }
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [canUseNative, language, nativeTranslations, source, translatableItems]);

  const sourceByKey = useMemo(() => Object.fromEntries(items.map((item) => [item.key, item.text])), [items]);
  const text = (key: string) => translations[key] || sourceByKey[key] || "";
  return {
    text,
    translations,
    state,
    usedFallback: state === "fallback",
    fallbackKeys,
  };
}
