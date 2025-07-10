import { Shield, User, HardHat, PawPrint } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Home() {
  const { t } = useTranslation();

  const divisions = [
    {
      icon: Shield,
      data: t.divisions.publicSafety,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-400',
      tagColor: 'bg-orange-500/20 text-orange-400'
    },
    {
      icon: User,
      data: t.divisions.francophone,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-400',
      tagColor: 'bg-blue-500/20 text-blue-400'
    },
    {
      icon: HardHat,
      data: t.divisions.healthSafety,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-blue-500',
      tagColor: 'bg-orange-500/20 text-orange-400'
    },
    {
      icon: PawPrint,
      data: t.divisions.animalAid,
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
                <span className="text-[#0d6efd]">{t.hero.title}</span> {t.hero.titleHighlight}
              </h1>
              <p className="text-xl text-[#f89422] mb-8 leading-relaxed text-center">
                {t.hero.description}
              </p>
              {/* Divisions Title and Cards */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#f89422' }}>{t.divisions.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
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
                          <span style={{ color: '#0d6efd' }}>{division.data.title.split(' ')[0]}</span>
                          <span style={{ color: '#f89422' }}> {division.data.title.split(' ').slice(1).join(' ')}</span>
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