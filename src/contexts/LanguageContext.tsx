
"use client";
import type { Language, LanguageContextType } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLanguage = localStorage.getItem('appLanguage') as Language | null;
    if (storedLanguage) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isMounted) {
      localStorage.setItem('appLanguage', lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'np' : 'en');
  };

  const t = (enText: string, npText: string): string => {
    if (!isMounted) return enText; // Avoid hydration mismatch during SSR or initial client render
    return language === 'en' ? enText : npText;
  };
  
  if (!isMounted) {
    // Render a fallback or null during server render and first client render to avoid hydration mismatch
    // Or, ensure the initial state matches what the server would render (e.g., default to 'en')
    // For simplicity, we'll provide a default context value that doesn't rely on localStorage yet
    const defaultContextValue: LanguageContextType = {
      language: 'en',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (enText, _) => enText,
    };
    return <LanguageContext.Provider value={defaultContextValue}>{children}</LanguageContext.Provider>;
  }


  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
