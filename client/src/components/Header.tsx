import { Link } from 'wouter';
import { useTranslation } from '../hooks/useTranslation';
import { Languages } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const Header = () => {
  const { language, changeLanguage, t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  return (
    <header className="bg-black w-full py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="text-[#0d6efd] text-4xl font-bold">Rémi</span>
              <span className="text-[#f89422] text-4xl font-bold">Guillette</span>
            </div>
            <p className="text-[#f89422] text-2xl font-semibold whitespace-nowrap">Groupe</p>
            <p className="text-[#f89422] text-xl font-semibold whitespace-nowrap">Group</p>
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