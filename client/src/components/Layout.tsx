import { Building2 } from 'lucide-react';
import { Header } from './Header';
import { useTranslation } from '../hooks/useTranslation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-rg-dark-bg border-t border-rg-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            {/* Company Info */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 rg-gradient rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Rémi Guillette Groupe</h3>
                  <p className="text-sm text-gray-400">{t.footer.tagline}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-2xl">
                {t.footer.description}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-rg-gray mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
