import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationData, getTranslation } from '../lib/i18n';

interface TranslationContextType {
  language: Language;
  translations: TranslationData;
  changeLanguage: (newLanguage: Language) => void;
  t: TranslationData;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [translations, setTranslations] = useState<TranslationData>(getTranslation('fr'));

  useEffect(() => {
    const savedLanguage = localStorage.getItem('rg-language') as Language;
    console.log('🔄 TranslationProvider initialization:', {
      savedLanguage,
      defaultLanguage: 'fr',
      isValidLanguage: savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')
    });
    
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      console.log('✅ Loading saved language:', savedLanguage);
      setLanguage(savedLanguage);
      setTranslations(getTranslation(savedLanguage));
    } else {
      console.log('🔄 Using default language: fr');
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    console.log('🌍 Language toggle initiated:', {
      from: language,
      to: newLanguage,
      timestamp: new Date().toISOString()
    });
    
    setLanguage(newLanguage);
    
    const translationData = getTranslation(newLanguage);
    console.log('📝 Translation data loaded:', {
      language: newLanguage,
      hasTranslations: !!translationData,
      sampleKeys: Object.keys(translationData),
      brandData: translationData.brand
    });
    
    setTranslations(translationData);
    localStorage.setItem('rg-language', newLanguage);
    
    // Update document language
    document.documentElement.lang = newLanguage;
    
    console.log('✅ Language change complete:', {
      newLanguage,
      localStorage: localStorage.getItem('rg-language'),
      documentLang: document.documentElement.lang
    });
  };

  const value = {
    language,
    translations,
    changeLanguage,
    t: translations,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};