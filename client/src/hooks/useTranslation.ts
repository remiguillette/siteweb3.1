import { useState, useEffect } from 'react';
import { Language, TranslationData, getTranslation } from '../lib/i18n';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('fr');
  const [translations, setTranslations] = useState<TranslationData>(getTranslation('fr'));

  useEffect(() => {
    const savedLanguage = localStorage.getItem('rg-language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
      setTranslations(getTranslation(savedLanguage));
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setTranslations(getTranslation(newLanguage));
    localStorage.setItem('rg-language', newLanguage);
    
    // Update document language
    document.documentElement.lang = newLanguage;
  };

  return {
    language,
    translations,
    changeLanguage,
    t: translations,
  };
};
