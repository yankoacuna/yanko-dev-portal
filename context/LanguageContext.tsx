'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import { T } from '@/lib/i18n';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('es');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key: string) => {
    const translations = T[lang] as Record<string, string>;
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
}
