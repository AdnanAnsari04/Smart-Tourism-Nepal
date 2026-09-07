import { useState, useCallback, type ReactNode } from "react";
import { LanguageContext } from "./languageContext";
import { TRANSLATIONS, type Language, type TranslationKey } from "./translations";

// The Provider component lives here on its own. React-refresh/only-export-components
// requires a component-only file, so the context instance and the raw
// translation data each live in their own file (./languageContext.ts and
// ./translations.ts respectively).

function readSavedLanguage(): Language {
  const saved = localStorage.getItem("yatra-language");
  return saved === "ne" ? "ne" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readSavedLanguage);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === "en" ? "ne" : "en";
      localStorage.setItem("yatra-language", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey) => TRANSLATIONS[language][key],
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
