import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie, X, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

export const CookieConsent = () => {
  const { t, language } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary-only');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 border-t border-[#f89422]" role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Cookie className="w-6 h-6 text-[#f89422] flex-shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h3 id="cookie-consent-title" className="text-lg font-semibold mb-2">
                <span className="text-[#3b82f6]">{language === 'fr' ? 'Gestion' : 'Cookie'}</span>{' '}
                <span className="text-[#f89422]">{language === 'fr' ? 'des Cookies' : 'Management'}</span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {language === 'fr' 
                  ? "Nous utilisons des cookies pour améliorer votre expérience sur notre site web. "
                  : "We use cookies to improve your experience on our website. "
                }
                <Link 
                  to={language === 'fr' ? '/politique-confidentialite' : '/privacy-policy'}
                  className="text-[#f89422] hover:text-white transition-colors underline"
                >
                  {language === 'fr' ? 'Voir notre politique de confidentialité' : 'View our privacy policy'}
                </Link>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[#f89422] hover:text-white transition-colors px-3 py-1 text-sm border border-[#f89422] rounded"
              aria-label={showDetails ? (language === 'fr' ? 'Masquer les détails' : 'Hide details') : (language === 'fr' ? 'Voir les détails' : 'Show details')}
              aria-expanded={showDetails}
            >
              {showDetails 
                ? (language === 'fr' ? 'Masquer' : 'Hide')
                : (language === 'fr' ? 'Détails' : 'Details')
              }
            </button>
            
            <Button
              onClick={handleAcceptNecessary}
              variant="outline"
              size="sm"
              className="border-[#f89422] text-[#f89422] hover:bg-[#f89422]/10"
              aria-label={language === 'fr' ? 'Accepter les cookies essentiels seulement' : 'Accept essential cookies only'}
            >
              {language === 'fr' ? 'Essentiels' : 'Essential'}
            </Button>
            
            <Button
              onClick={handleAcceptAll}
              size="sm"
              className="bg-[#f89422] hover:bg-[#f89422]/80 text-black font-semibold"
              aria-label={language === 'fr' ? 'Accepter tous les cookies' : 'Accept all cookies'}
            >
              {language === 'fr' ? 'Accepter' : 'Accept'}
            </Button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-[#f89422] hover:text-white transition-colors p-1"
              aria-label={language === 'fr' ? 'Fermer la bannière de cookies' : 'Close cookie banner'}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        {/* Detailed cookie information */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-[#f89422]/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  <span className="text-[#3b82f6]">{language === 'fr' ? 'Cookies' : 'Essential'}</span>{' '}
                  <span className="text-[#f89422]">{language === 'fr' ? 'Essentiels' : 'Cookies'}</span>
                </h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {language === 'fr'
                    ? "Nécessaires au fonctionnement du site web."
                    : "Necessary for the website to function."
                  }
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  <span className="text-[#3b82f6]">{language === 'fr' ? 'Cookies' : 'Analytics'}</span>{' '}
                  <span className="text-[#f89422]">{language === 'fr' ? 'Analytiques' : 'Cookies'}</span>
                </h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {language === 'fr'
                    ? "Comprendre comment vous utilisez notre site."
                    : "Help us understand how you use our website."
                  }
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  <span className="text-[#3b82f6]">Replit</span>{' '}
                  <span className="text-[#f89422]">Platform</span>
                </h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {language === 'fr'
                    ? "Cookies de la plateforme d'hébergement."
                    : "Hosting platform cookies."
                  }
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  <span className="text-[#3b82f6]">{language === 'fr' ? 'Vos' : 'Your'}</span>{' '}
                  <span className="text-[#f89422]">{language === 'fr' ? 'Droits' : 'Rights'}</span>
                </h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {language === 'fr'
                    ? "Modifiez vos préférences à tout moment."
                    : "Change your preferences at any time."
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};