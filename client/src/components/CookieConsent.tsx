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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-black border-[#f89422] max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 pr-10">
            <Cookie className="w-8 h-8 text-[#f89422]" />
            <span className="text-[#3b82f6]">{language === 'fr' ? 'Gestion' : 'Cookie'}</span>{' '}
            <span className="text-[#f89422]">{language === 'fr' ? 'des Cookies' : 'Management'}</span>
          </CardTitle>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-[#f89422] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main message */}
          <div className="text-gray-300">
            <p className="leading-relaxed mb-4">
              {language === 'fr' 
                ? "Nous utilisons des cookies pour améliorer votre expérience sur notre site web, analyser le trafic et personnaliser le contenu. En continuant à utiliser notre site, vous acceptez notre utilisation des cookies."
                : "We use cookies to improve your experience on our website, analyze traffic, and personalize content. By continuing to use our site, you consent to our use of cookies."
              }
            </p>
            
            <div className="flex items-center gap-2 text-[#f89422]">
              <Shield className="w-5 h-5" />
              <Link 
                to={language === 'fr' ? '/politique-confidentialite' : '/privacy-policy'}
                className="hover:text-white transition-colors underline flex items-center gap-1"
              >
                {language === 'fr' ? 'Consulter notre politique de confidentialité' : 'View our privacy policy'}
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Cookie details toggle */}
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[#f89422] hover:text-white transition-colors underline"
            >
              {showDetails 
                ? (language === 'fr' ? 'Masquer les détails' : 'Hide details')
                : (language === 'fr' ? 'Voir les détails' : 'Show details')
              }
            </button>
          </div>

          {/* Detailed cookie information */}
          {showDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">
                  <span className="text-[#3b82f6]">{language === 'fr' ? 'Cookies' : 'Essential'}</span>{' '}
                  <span className="text-[#f89422]">{language === 'fr' ? 'Essentiels' : 'Cookies'}</span>
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {language === 'fr'
                    ? "Ces cookies sont nécessaires au fonctionnement du site web et ne peuvent pas être désactivés. Ils incluent les cookies de session, d'authentification et de préférences linguistiques."
                    : "These cookies are necessary for the website to function and cannot be disabled. They include session cookies, authentication cookies, and language preference cookies."
                  }
                </p>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li>• {language === 'fr' ? 'Cookies de session' : 'Session cookies'}</li>
                  <li>• {language === 'fr' ? 'Préférences linguistiques' : 'Language preferences'}</li>
                  <li>• {language === 'fr' ? 'Sécurité du site' : 'Site security'}</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold">
                  <span className="text-[#3b82f6]">{language === 'fr' ? 'Cookies' : 'Analytics'}</span>{' '}
                  <span className="text-[#f89422]">{language === 'fr' ? 'Analytiques' : 'Cookies'}</span>
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {language === 'fr'
                    ? "Ces cookies nous aident à comprendre comment vous utilisez notre site web en collectant des informations anonymes sur votre navigation."
                    : "These cookies help us understand how you use our website by collecting anonymous information about your browsing behavior."
                  }
                </p>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li>• {language === 'fr' ? 'Statistiques de visite' : 'Visit statistics'}</li>
                  <li>• {language === 'fr' ? 'Données de performance' : 'Performance data'}</li>
                  <li>• {language === 'fr' ? 'Amélioration du site' : 'Site improvement'}</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold">
                  <span className="text-[#3b82f6]">Replit</span>{' '}
                  <span className="text-[#f89422]">Platform</span>
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {language === 'fr'
                    ? "Notre site est hébergé sur Replit. Replit peut utiliser ses propres cookies pour le fonctionnement de la plateforme et l'analytics."
                    : "Our site is hosted on Replit. Replit may use its own cookies for platform functionality and analytics."
                  }
                </p>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li>• {language === 'fr' ? 'Hébergement de plateforme' : 'Platform hosting'}</li>
                  <li>• {language === 'fr' ? 'Services techniques' : 'Technical services'}</li>
                  <li>• {language === 'fr' ? 'Analytics Replit' : 'Replit analytics'}</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold">
                  <span className="text-[#3b82f6]">{language === 'fr' ? 'Vos' : 'Your'}</span>{' '}
                  <span className="text-[#f89422]">{language === 'fr' ? 'Droits' : 'Rights'}</span>
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {language === 'fr'
                    ? "Vous pouvez modifier vos préférences de cookies à tout moment en supprimant les cookies de votre navigateur ou en nous contactant."
                    : "You can change your cookie preferences at any time by clearing your browser cookies or by contacting us."
                  }
                </p>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li>• {language === 'fr' ? 'Gestion des préférences' : 'Preference management'}</li>
                  <li>• {language === 'fr' ? 'Suppression des cookies' : 'Cookie deletion'}</li>
                  <li>• {language === 'fr' ? 'Contact direct' : 'Direct contact'}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#f89422]/30">
            <Button
              onClick={handleAcceptAll}
              className="bg-[#f89422] hover:bg-[#f89422]/80 text-black font-semibold flex-1"
            >
              {language === 'fr' ? 'Accepter tous les cookies' : 'Accept all cookies'}
            </Button>
            
            <Button
              onClick={handleAcceptNecessary}
              variant="outline"
              className="border-[#f89422] text-[#f89422] hover:bg-[#f89422]/10 flex-1"
            >
              {language === 'fr' ? 'Cookies essentiels seulement' : 'Essential cookies only'}
            </Button>
            
            <Button
              onClick={handleReject}
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {language === 'fr' ? 'Refuser' : 'Reject'}
            </Button>
          </div>

          {/* Legal notice */}
          <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-700">
            {language === 'fr'
              ? "En continuant à utiliser ce site, vous acceptez notre utilisation des cookies conformément à notre politique de confidentialité."
              : "By continuing to use this site, you agree to our use of cookies in accordance with our privacy policy."
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};