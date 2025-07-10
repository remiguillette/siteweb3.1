import { Link } from 'wouter';
import { useTranslation } from '../hooks/useTranslation';
import { Languages } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const Header = () => {
  const { language, changeLanguage, t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleLanguage = () => {
    changeLanguage(language === 'fr' ? 'en' : 'fr');
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
    <header className="bg-black w-full py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className={`text-[#0d6efd] text-4xl font-bold transition-all duration-700 ${isLoaded ? 'header-logo-remi' : 'opacity-0 translate-x-[-20px]'}`}>Rémi</span>
              <span className={`text-[#f89422] text-4xl font-bold transition-all duration-700 delay-200 ${isLoaded ? 'header-logo-guillette' : 'opacity-0 translate-x-[20px]'}`}>Guillette</span>
            </div>
            <p className={`text-[#f89422] text-2xl font-semibold whitespace-nowrap transition-all duration-700 delay-400 ${isLoaded ? 'header-logo-groupe' : 'opacity-0 translate-y-[10px]'}`}>Groupe</p>
            <p className={`text-[#f89422] text-xl font-semibold whitespace-nowrap transition-all duration-700 delay-600 ${isLoaded ? 'header-logo-group' : 'opacity-0 translate-y-[10px]'}`}>Group</p>
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
            {language === 'fr' ? 'FR' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};