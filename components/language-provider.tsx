"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/lib/i18n-dictionary";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Check if user has a saved preference
    const savedLang = localStorage.getItem("app-language") as Language;
    
    if (savedLang && (savedLang === "es" || savedLang === "en")) {
      setLanguageState(savedLang);
    } else {
      // 2. Auto-detect from device browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en") {
        setLanguageState("en");
      } else {
        setLanguageState("es"); // Default to Spanish for this project
      }
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
    // Optional: Refresh or update meta tags for SEO
    document.documentElement.lang = lang;
  };

  const t = (path: string) => {
    const keys = path.split(".");
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key]) {
        current = current[key];
      } else {
        return path; // Fallback to key name
      }
    }
    return current as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {mounted ? children : <div className="opacity-0">{children}</div>}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
