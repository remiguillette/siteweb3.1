import { Phone, Mail } from 'lucide-react';
import { Link } from 'wouter';
import { useTranslation } from '../contexts/TranslationContext';
import beaverLogo from '../assets/beaver.png';
import { SiX, SiInstagram, SiDiscord } from 'react-icons/si';

export const Footer = () => {
  const { t, language } = useTranslation();

  return (
    <footer className="bg-black py-12 w-full" role="contentinfo">
      <div className="container-responsive">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - empty for spacing */}
          <div></div>

          {/* Middle column - main content */}
          <div className="flex flex-col items-center max-w-[300px] mx-auto">
            <a 
              href="https://rgbeavernet.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label={language === 'fr' ? 'Visiter le site externe Rémi Guillette Groupe' : 'Visit external Rémi Guillette Group site'}
            >
              <img 
                src={beaverLogo} 
                alt={language === 'fr' ? 'Logo Rémi Guillette Groupe' : 'Rémi Guillette Group Logo'} 
                className="h-32 w-32 mb-6"
                style={{ objectFit: "contain" }}
              />
            </a>
            <h3 className="font-bold text-2xl mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="text-[#0d6efd]">Rémi</span>{" "}
              <span className="text-[#f89422]">Guillette</span>
            </h3>
            <h3 className="font-bold text-2xl mb-2 text-[#f89422]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Groupe
            </h3>
            <h3 className="font-bold text-2xl mb-2 text-[#f89422]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Group
            </h3>
            <nav className="flex flex-col items-center gap-2 mt-6" aria-label={language === 'fr' ? 'Menu pied de page' : 'Footer menu'}>
              <Link 
                to="/contact"
                className="text-[#f89422] text-sm hover:text-white transition-colors"
              >
                {t.footer.contact}
              </Link>
              <Link 
                to={language === 'fr' ? '/politique-confidentialite' : '/privacy-policy'}
                className="text-[#f89422] text-sm hover:text-white transition-colors"
              >
                {t.footer.privacy}
              </Link>
            </nav>
          </div>

          {/* Right column - contact information */}
          <section className="flex flex-col" aria-labelledby="contact-heading">
            <h3 id="contact-heading" className="font-bold text-xl mb-4 text-[#f89422]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t.footer.contact}
            </h3>
            <address className="not-italic text-[#f89422]">
              <p className="mb-2">{t.footer.address.street}</p>
              <p className="mb-2">{t.footer.address.apt}</p>
              <p className="mb-2">{t.footer.address.city}</p>
              <p className="mb-2">{t.footer.address.postal}</p>
              <p className="mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                <span className="sr-only">{language === 'fr' ? 'Téléphone: ' : 'Phone: '}</span>
                <a 
                  href={`tel:${t.footer.phone}`} 
                  className="hover:text-white transition-colors"
                >
                  {t.footer.phone}
                </a>
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                <span className="sr-only">{language === 'fr' ? 'Courriel: ' : 'Email: '}</span>
                {t.footer.email}
              </p>
            </address>
            
            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="font-bold text-lg mb-3 text-[#f89422]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {language === 'fr' ? 'Suivez-nous' : 'Follow Us'}
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://x.com/RGRA_ON"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f89422] hover:text-white transition-colors"
                  aria-label={language === 'fr' ? 'Suivez-nous sur X (Twitter)' : 'Follow us on X (Twitter)'}
                >
                  <SiX className="w-6 h-6" />
                </a>
                <a
                  href="https://www.instagram.com/rgra_on?igsh=MXQ2dnIwNTg5MXhreg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f89422] hover:text-white transition-colors"
                  aria-label={language === 'fr' ? 'Suivez-nous sur Instagram' : 'Follow us on Instagram'}
                >
                  <SiInstagram className="w-6 h-6" />
                </a>
                <a
                  href="https://discord.gg/qFbVDPCFz9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f89422] hover:text-white transition-colors"
                  aria-label={language === 'fr' ? 'Rejoignez notre Discord' : 'Join our Discord'}
                >
                  <SiDiscord className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            <div className="mt-6 border-t border-[#f89422] pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left text-[#f89422]">
                  <p className="mb-2">Enregistrement Ontario</p>
                  <p className="mb-2">Ontario Registration</p>
                  <p className="mb-2">Enregistrement Canada</p>
                  <p>Canada Registration</p>
                </div>
                <div className="text-right text-[#f89422] flex flex-col">
                  <p className="mb-2">{t.footer.registration.ontarioNumber}</p>
                  <p className="mb-2">{t.footer.registration.ontarioNumber2}</p>
                  <div className="flex-1 flex items-center justify-end">
                    <p>{t.footer.registration.canadaNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
};