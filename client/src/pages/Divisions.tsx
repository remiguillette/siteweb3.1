import { Shield, User, HardHat, PawPrint } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Divisions() {
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
    <div className="py-16 bg-rg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">{t.divisions.title}</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            {t.divisions.subtitle}
          </p>
        </div>

        {/* Divisions Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {divisions.map((division, index) => {
            const Icon = division.icon;
            return (
              <div
                key={index}
                className="bg-rg-card-bg rounded-2xl p-8 hover:bg-rg-gray transition-all duration-300 transform hover:scale-105 border border-rg-gray"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${division.gradientFrom} ${division.gradientTo} rounded-xl flex items-center justify-center mr-6`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{division.data.title}</h2>
                    <p className="text-orange-400 font-medium">{division.data.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                  {division.data.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {division.data.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-4 py-2 ${division.tagColor} rounded-full text-sm font-medium`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}