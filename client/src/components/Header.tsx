import { Link } from 'wouter';
import { useTranslation } from '../hooks/useTranslation';
import { Languages } from 'lucide-react';

export const Header = () => {
  const { language, changeLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    changeLanguage(language === 'fr' ? 'en' : 'fr');
  };

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
            <p className="text-[#f89422] text-2xl font-semibold whitespace-nowrap">
              {t.brand.groupe}
            </p>
          </div>
        </Link>

        {/* Language Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Languages className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === 'fr' ? 'FR' : 'EN'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};