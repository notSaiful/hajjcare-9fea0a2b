import { createContext, useContext, useState, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  isArabic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ar");

  const t = (ar: string, en: string) => (language === "ar" ? ar : en);
  const isArabic = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isArabic }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
