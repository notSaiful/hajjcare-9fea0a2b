// Helper type for translations that allows partial records with English fallback
// This enables gradual migration of translations without TypeScript errors

import { Language } from "@/contexts/LanguageContext";

// Type for translation records that require at least English
export type LocalizedText = { en: string } & Partial<Record<Language, string>>;

// Helper function to get localized text with English fallback
export function getText(translations: LocalizedText, language: Language): string {
  return translations[language] || translations.en;
}

// Helper function to ensure we have a full record (fills missing with English)
export function ensureAllLanguages<T>(partial: { en: T } & Partial<Record<Language, T>>): Record<Language, T> {
  const allLanguages: Language[] = ["en", "ar", "ur", "hi", "ta", "te", "mr", "bn", "or", "ml", "pa", "tr", "ru"];
  const result = {} as Record<Language, T>;
  
  for (const lang of allLanguages) {
    result[lang] = partial[lang] || partial.en;
  }
  
  return result;
}
