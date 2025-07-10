import { Shield, User, HardHat, PawPrint } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Home() {
  const { t } = useTranslation();

  const divisions = [
    {
      icon: Shield,
      titleFirst: 'Cabinet-conseil',
      titleRest: ' en sécurité publique',
      data: t.divisions.publicSafety,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-400',
      tagColor: 'bg-orange-500/20 text-orange-400'
    },
    {
      icon: User,
      titleFirst: 'Services',
      titleRest: ' Communautaires Francophones',
      data: t.divisions.francophone,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-400',
      tagColor: 'bg-blue-500/20 text-blue-400'
    },
    {
      icon: HardHat,
      titleFirst: 'Services',
      titleRest: ' en santé et Sécurité au Travail (SST)',
      data: t.divisions.healthSafety,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-blue-500',
      tagColor: 'bg-orange-500/20 text-orange-400'
    },
    {
      icon: PawPrint,
      titleFirst: 'Services',
      titleRest: ' de Premiers Soins Animaliers',
      data: t.divisions.animalAid,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-orange-500',
      tagColor: 'bg-blue-500/20 text-blue-400'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section id="accueil" className="bg-black pb-16 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Hero Content */}
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-[#f89422] mb-6">
                <span className="text-[#0d6efd]">Solutions</span> innovantes pour votre entreprise
              </h1>
              <p className="text-xl text-[#f89422] mb-8 leading-relaxed text-center max-w-3xl mx-auto">
                Spécialiste en services d'entreprise, le Groupe Rémi Guillette offre une gamme complète de solutions adaptées à vos besoins spécifiques.
              </p>
              {/* Divisions Title and Cards */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#f89422' }}>Divisions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                  {divisions.map((division, index) => {
                    const Icon = division.icon;
                    return (
                      <div
                        key={index}
                        className="bg-black rounded-xl p-6 hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 border-2 text-center"
                        style={{ borderColor: '#f89422' }}
                      >
                        <div className="flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-12 h-12" style={{ color: '#f89422' }} />
                        </div>
                        <h3 className="text-lg font-bold">
                          <span style={{ color: '#0d6efd' }}>{division.titleFirst}</span>
                          <span style={{ color: '#f89422' }}>{division.titleRest}</span>
                        </h3>
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