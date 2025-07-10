import { useState, useEffect } from 'react';
import { Language, TranslationData, getTranslation } from '../lib/i18n';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('fr');
  const [translations, setTranslations] = useState<TranslationData>(getTranslation('fr'));

  useEffect(() => {
    const savedLanguage = localStorage.getItem('rg-language') as Language;
    console.log('🔄 useTranslation initialization:', {
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

  return {
    language,
    translations,
    changeLanguage,
    t: translations,
  };
};
