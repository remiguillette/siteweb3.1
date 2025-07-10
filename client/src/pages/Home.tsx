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
      tagColor: 'bg-orange-500/20 text-orange-400'
    },
    {
      icon: User,
      titleFr: { first: 'Services', rest: ' Communautaires Francophones' },
      titleEn: { first: 'Francophone', rest: ' Community Services' },
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-400',
      tagColor: 'bg-blue-500/20 text-blue-400'
    },
    {
      icon: HardHat,
      titleFr: { first: 'Services', rest: ' en santé et Sécurité au Travail (SST)' },
      titleEn: { first: 'Occupational', rest: ' Health & Safety' },
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-blue-500',
      tagColor: 'bg-orange-500/20 text-orange-400'
    },
    {
      icon: PawPrint,
      titleFr: { first: 'Services', rest: ' de Premiers Soins Animaliers' },
      titleEn: { first: 'Animal', rest: ' First Aid Services' },
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-orange-500',
      tagColor: 'bg-blue-500/20 text-blue-400'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section id="accueil" className="bg-black pb-16 min-h-screen flex items-center w-full">
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
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#f89422' }}>
                  {language === 'fr' ? 'Divisions' : 'Divisions'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                  {divisions.map((division, index) => {
                    const Icon = division.icon;
                    const cardContent = (
                      <div
                        className="bg-black rounded-xl p-6 hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 border-2 text-center cursor-pointer"
                        style={{ borderColor: '#f89422' }}
                      >
                        <div className="flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-12 h-12" style={{ color: '#f89422' }} />
                        </div>
                        <h3 className="text-lg font-bold">
                          <span style={{ color: '#0d6efd' }}>
                            {language === 'fr' ? division.titleFr.first : division.titleEn.first}
                          </span>
                          <span style={{ color: '#f89422' }}>
                            {language === 'fr' ? division.titleFr.rest : division.titleEn.rest}
                          </span>
                        </h3>
                      </div>
                    );

                    // Make the first card (Public Safety) clickable
                    if (index === 0) {
                      return (
                        <Link key={index} href="/public-safety">
                          {cardContent}
                        </Link>
                      );
                    }

                    return (
                      <div key={index}>
                        {cardContent}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}