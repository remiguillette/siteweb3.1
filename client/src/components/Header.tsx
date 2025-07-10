import { Link } from 'wouter';
import { useTranslation } from '../contexts/TranslationContext';
import { Languages } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import beaverLogo from '../assets/beaver.png';

export const Header = () => {
  const { language, changeLanguage, t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    console.log('🔄 Header language toggle clicked:', {
      currentLanguage: language,
      targetLanguage: newLang,
      component: 'Header'
    });
    changeLanguage(newLang);
  };

  useEffect(() => {
    if (!buttonRef.current) return;

    let angle = 0;
    let animationFrameId: number;

    const rotateGradient = () => {
      angle = (angle + 1) % 360;
      if (buttonRef.current) {
        buttonRef.current.style.setProperty("--gradient-angle", `${angle}deg`);
      }
      animationFrameId = requestAnimationFrame(rotateGradient);
    };

    rotateGradient();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    // Trigger logo animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="bg-black w-full py-4 shadow-md">
      <div className="container-responsive flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4">
          <img 
            src={beaverLogo} 
            alt="Logo Beaver" 
            className={`h-16 w-16 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 scale-75'}`}
            style={{ objectFit: "contain" }}
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className={`text-[#0d6efd] text-4xl font-bold transition-all duration-700 ${isLoaded ? 'header-logo-remi' : 'opacity-0 translate-x-[-20px]'}`}>Rémi</span>
              <span className={`text-[#f89422] text-4xl font-bold transition-all duration-700 delay-200 ${isLoaded ? 'header-logo-guillette' : 'opacity-0 translate-x-[20px]'}`}>Guillette</span>
            </div>
            <p className={`text-[#f89422] text-2xl font-bold whitespace-nowrap transition-all duration-700 delay-400 ${isLoaded ? 'header-logo-groupe' : 'opacity-0 translate-y-[10px]'}`}>Groupe</p>
            <p className={`text-[#f89422] text-2xl font-bold whitespace-nowrap transition-all duration-700 delay-600 ${isLoaded ? 'header-logo-group' : 'opacity-0 translate-y-[10px]'}`}>Group</p>
          </div>
        </Link>

        {/* Language Toggle */}
        <div className="flex items-center">
          <button
            ref={buttonRef}
            onClick={toggleLanguage}
            className="border-gradient-button flex items-center justify-center text-white px-6 py-3 font-medium text-sm"
          >
            <Languages className="w-4 h-4 mr-2" />
{language === 'fr' ? 'EN' : 'FR'}
          </button>
        </div>
      </div>
    </header>
  );
};