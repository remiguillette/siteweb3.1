import { Shield, User, HardHat, PawPrint } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { Link } from 'wouter';

export default function Home() {
  const { t, language } = useTranslation();

  const divisions = [
    {
      icon: Shield,
      titleFr: { first: 'Cabinet-conseil', rest: ' en sécurité publique' },
      titleEn: { first: 'Public', rest: ' Safety Consulting' },
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-400',
      tagColor: 'bg-orange-500/20 text-orange-400',
      href: '/public-safety'
    },
    {
      icon: User,
      titleFr: { first: 'Services', rest: ' Communautaires Francophones' },
      titleEn: { first: 'Francophone', rest: ' Community Services' },
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-400',
      tagColor: 'bg-blue-500/20 text-blue-400',
      href: '/francophone-services'
    },
    {
      icon: HardHat,
      titleFr: { first: 'Services', rest: ' en santé et Sécurité au Travail (SST)' },
      titleEn: { first: 'Occupational', rest: ' Health & Safety' },
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-blue-500',
      tagColor: 'bg-orange-500/20 text-orange-400',
      href: '/health-safety'
    },
    {
      icon: PawPrint,
      titleFr: { first: 'Services', rest: ' de Premiers Soins Animaliers' },
      titleEn: { first: 'Animal', rest: ' First Aid Services' },
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-orange-500',
      tagColor: 'bg-blue-500/20 text-blue-400',
      href: '/animal-first-aid'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section id="accueil" className="bg-black pb-16 min-h-screen flex items-center w-full" role="banner">
        <div className="container-responsive">
          <div className="text-center">
            {/* Hero Content */}
            <div className="w-full">
              <h1 className="text-4xl lg:text-6xl font-bold text-[#f89422] mb-6">
                {language === 'fr' ? (
                  <>
                    <span className="text-[#0d6efd]">Solutions</span> innovantes pour votre entreprise
                  </>
                ) : (
                  <>
                    <span className="text-[#0d6efd]">Innovative</span> solutions for your business
                  </>
                )}
              </h1>
              <p className="text-xl text-[#f89422] mb-8 leading-relaxed text-center">
                {language === 'fr' ? (
                  'Spécialiste en services d\'entreprise, le Groupe Rémi Guillette offre une gamme complète de solutions adaptées à vos besoins spécifiques.'
                ) : (
                  'Business services specialist, Rémi Guillette Group offers a complete range of solutions tailored to your specific needs.'
                )}
              </p>
              {/* Divisions Title and Cards */}
              <section className="mt-12" aria-labelledby="divisions-heading">
                <h2 id="divisions-heading" className="text-3xl font-bold text-center mb-8" style={{ color: '#f89422' }}>
                  {language === 'fr' ? 'Secteurs d\'activité' : 'Activity Sectors'}
                </h2>
                <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full" aria-label={language === 'fr' ? 'Secteurs d\'activité de services' : 'Service activity sectors'}>
                  {divisions.map((division, index) => {
                    const Icon = division.icon;
                    const divisionTitle = language === 'fr' 
                      ? `${division.titleFr.first}${division.titleFr.rest}`
                      : `${division.titleEn.first}${division.titleEn.rest}`;
                    
                    return (
                      <Link 
                        key={index} 
                        href={division.href}
                        className="bg-black rounded-xl p-6 hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 border-2 text-center cursor-pointer h-40 flex flex-col justify-center"
                        style={{ borderColor: '#f89422' }}
                        aria-label={`${language === 'fr' ? 'Voir' : 'View'} ${divisionTitle}`}
                      >
                        <div className="flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-12 h-12" style={{ color: '#f89422' }} aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-bold leading-tight">
                          <span style={{ color: '#0d6efd' }}>
                            {language === 'fr' ? division.titleFr.first : division.titleEn.first}
                          </span>
                          <span style={{ color: '#f89422' }}>
                            {language === 'fr' ? division.titleFr.rest : division.titleEn.rest}
                          </span>
                        </h3>
                      </Link>
                    );
                  })}
                </nav>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}