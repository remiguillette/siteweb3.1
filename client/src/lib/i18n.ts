import fr from '../locales/fr.json';
import en from '../locales/en.json';

export type Language = 'fr' | 'en';

export interface TranslationData {
  brand: {
    groupe: string;
    company: string;
  };
  nav: {
    home: string;
    divisions: string;
    services: string;
    contact: string;
  };
  footer: {
    tagline: string;
    description: string;
    copyright: string;
  };
}

export const translations: Record<Language, TranslationData> = {
  fr: fr as TranslationData,
  en: en as TranslationData,
};

export const getTranslation = (language: Language): TranslationData => {
  return translations[language];
};
