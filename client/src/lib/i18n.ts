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
  hero: {
    title: string;
    titleHighlight: string;
    description: string;
    discoverDivisions: string;
    contactUs: string;
  };
  divisions: {
    title: string;
    subtitle: string;
    publicSafety: {
      title: string;
      subtitle: string;
      description: string;
      tags: string[];
    };
    francophone: {
      title: string;
      subtitle: string;
      description: string;
      tags: string[];
    };
    healthSafety: {
      title: string;
      subtitle: string;
      description: string;
      tags: string[];
    };
    animalAid: {
      title: string;
      subtitle: string;
      description: string;
      tags: string[];
    };
  };
  services: {
    title: string;
    subtitle: string;
    strategic: {
      title: string;
      description: string;
      features: string[];
    };
    projectManagement: {
      title: string;
      description: string;
      features: string[];
    };
    security: {
      title: string;
      description: string;
      features: string[];
    };
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  contact: {
    title: string;
    subtitle: string;
    info: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    weekdays: string;
    saturday: string;
    sunday: string;
    closed: string;
    form: {
      title: string;
      firstName: string;
      lastName: string;
      email: string;
      service: string;
      selectService: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      successMessage: string;
    };
  };
  footer: {
    tagline: string;
    description: string;
    quickLinks: string;
    services: string;
    copyright: string;
    privacy: string;
    terms: string;
  };
}

export const translations: Record<Language, TranslationData> = {
  fr: fr as TranslationData,
  en: en as TranslationData,
};

export const getTranslation = (language: Language): TranslationData => {
  return translations[language];
};
