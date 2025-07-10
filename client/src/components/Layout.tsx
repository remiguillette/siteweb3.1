import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Building2 } from 'lucide-react';
import { Header } from './Header';
import { useTranslation } from '../hooks/useTranslation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { key: 'home', href: '/', label: t.nav.home, sectionId: 'accueil' },
    { key: 'divisions', href: '/divisions', label: t.nav.divisions, sectionId: 'divisions' },
    { key: 'services', href: '/services', label: t.nav.services, sectionId: 'services' },
    { key: 'contact', href: '/contact', label: t.nav.contact, sectionId: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-rg-dark-bg text-gray-100">
      {/* Header */}
      <Header />
      
      {/* Navigation */}
      <nav className="fixed top-20 w-full z-50 glass-effect border-b border-rg-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    if (location === '/') {
                      scrollToSection(item.sectionId);
                    } else {
                      window.location.href = `/#${item.sectionId}`;
                    }
                  }}
                  className="text-gray-300 hover:text-rg-orange transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center ml-auto md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-rg-gray transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-rg-gray pt-4 pb-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (location === '/') {
                        scrollToSection(item.sectionId);
                      } else {
                        window.location.href = `/#${item.sectionId}`;
                      }
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-rg-orange transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-rg-dark-bg border-t border-rg-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rg-gradient rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Rémi Guillette Groupe</h3>
                  <p className="text-sm text-gray-400">{t.footer.tagline}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t.footer.description}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">{t.footer.quickLinks}</h4>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        if (location === '/') {
                          scrollToSection(item.sectionId);
                        } else {
                          window.location.href = `/#${item.sectionId}`;
                        }
                      }}
                      className="text-gray-300 hover:text-rg-orange transition-colors duration-200"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">{t.footer.services}</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-rg-blue transition-colors duration-200"
                  >
                    {t.services.strategic.title}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-rg-blue transition-colors duration-200"
                  >
                    {t.services.projectManagement.title}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-rg-blue transition-colors duration-200"
                  >
                    {t.services.security.title}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-rg-gray mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t.footer.copyright}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="text-gray-400 hover:text-rg-orange text-sm transition-colors duration-200">
                {t.footer.privacy}
              </button>
              <button className="text-gray-400 hover:text-rg-orange text-sm transition-colors duration-200">
                {t.footer.terms}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
