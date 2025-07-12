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
    contact: string;
    address: {
      street: string;
      apt: string;
      city: string;
      postal: string;
    };
    phone: string;
    email: string;
    registration: {
      ontario: string;
      canada: string;
      ontarioNumber: string;
      ontarioNumber2: string;
      canadaNumber: string;
    };
  };
  privacy: {
    title: string;
    lastUpdated: string;
    introduction: string;
    companyInfo: {
      title: string;
      legalName: string;
      operatingName: string;
      website: string;
      email: string;
    };
    dataCollection: {
      title: string;
      description: string;
      personalInfo: {
        title: string;
        items: string[];
      };
      automaticData: {
        title: string;
        items: string[];
      };
    };
    purpose: {
      title: string;
      description: string;
      reasons: string[];
    };
    consent: {
      title: string;
      description: string;
      methods: string[];
    };
    sharing: {
      title: string;
      description: string;
      parties: string[];
    };
    internationalTransfers: {
      title: string;
      description: string;
      replitInfo: string;
    };
    dataProtection: {
      title: string;
      description: string;
      measures: string[];
    };
    cookies: {
      title: string;
      description: string;
      replitCookies: string;
    };
    contact: {
      title: string;
      description: string;
      email: string;
    };
    changes: {
      title: string;
      description: string;
      notification: string;
    };
    rights: {
      title: string;
      description: string;
      userRights: string[];
    };
  };
  errors: {
    404: {
      title: string;
      subtitle: string;
      description: string;
      backHome: string;
      contact: string;
    };
    500: {
      title: string;
      subtitle: string;
      description: string;
      retry: string;
      backHome: string;
      contact: string;
    };
  };
  chat: {
    title: string;
    subtitle: string;
    welcome: string;
    placeholder: string;
    send: string;
    typing: string;
    error: string;
    connecting: string;
    poweredBy: string;
    openChat: string;
    closeChat: string;
  };
}

export const translations: Record<Language, TranslationData> = {
  fr: fr as TranslationData,
  en: en as TranslationData,
};

export const getTranslation = (language: Language): TranslationData => {
  const translationData = translations[language];
  console.log('📚 Translation data requested:', {
    language,
    hasData: !!translationData,
    availableLanguages: Object.keys(translations),
    sampleTranslation: translationData?.brand?.company || 'undefined'
  });
  return translationData;
};
