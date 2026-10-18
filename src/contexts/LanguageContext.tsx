import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { safeLocalStorage } from '../utils/storage';

export interface LanguageOption {
  code: string;
  name: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'as', name: 'অসমীয়া' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'brx', name: 'बड़ो' },
  { code: 'doi', name: 'डोगरी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ks', name: 'كٲشُر' },
  { code: 'kok', name: 'कोंकणी' },
  { code: 'mai', name: 'मैथिली' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'mni', name: 'ꯃꯤꯇꯩꯂꯣꯟ' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ne', name: 'नेपाली' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'sa', name: 'संस्कृतम्' },
  { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'sd', name: 'سنڌي' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ur', name: 'اردو' },
];

export const RTL_LANGUAGES = new Set(['ks', 'sd', 'ur']);

interface LanguageContextType {
  currentLanguage: string;
  isRTL: boolean;
  setLanguage: (lang: string) => void;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  isRTL: false,
  setLanguage: () => {},
  languages: SUPPORTED_LANGUAGES,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
    try {
      return safeLocalStorage.getItem('lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const isRTL = RTL_LANGUAGES.has(currentLanguage);

  const setLanguage = useCallback((lang: string) => {
    try {
      safeLocalStorage.setItem('lang', lang);
    } catch {}
    setCurrentLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr';
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
    }
  }, []);

  useEffect(() => {
    // Initial sync
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }

    const handleCustomLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && customEvent.detail !== currentLanguage) {
        setCurrentLanguageState(customEvent.detail);
      }
    };

    window.addEventListener('langchange', handleCustomLangChange);
    return () => {
      window.removeEventListener('langchange', handleCustomLangChange);
    };
  }, [currentLanguage, isRTL]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        isRTL,
        setLanguage,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
