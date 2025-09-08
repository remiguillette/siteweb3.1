import { PawPrint, CheckCircle, Heart, BookOpen, Stethoscope, Users } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export default function AnimalFirstAid() {
  const { t, language } = useTranslation();

  const services = [
    {
      icon: Heart,
      titleFr: 'Premiers Soins d\'Urgence',
      titleEn: 'Emergency First Aid',
      descriptionFr: 'Services d\'intervention d\'urgence pour les soins immédiats aux animaux en détresse.',
      descriptionEn: 'Emergency intervention services for immediate care of animals in distress.',
      features: language === 'fr' ? [
        'Intervention d\'urgence 24/7',
        'Premiers soins sur site',
        'Stabilisation d\'urgence',
        'Coordination vétérinaire'
      ] : [
        '24/7 emergency response',
        'On-site first aid',
        'Emergency stabilization',
        'Veterinary coordination'
      ]
    },
    {
      icon: BookOpen,
      titleFr: 'Formation Spécialisée',
      titleEn: 'Specialized Training',
      descriptionFr: 'Programmes de formation en premiers soins animaliers pour professionnels et propriétaires d\'animaux.',
      descriptionEn: 'Animal first aid training programs for professionals and pet owners.',
      features: language === 'fr' ? [
        'Certification premiers soins',
        'Formation pratique',
        'Techniques d\'urgence',
        'Cours de mise à jour'
      ] : [
        'First aid certification',
        'Practical training',
        'Emergency techniques',
        'Refresher courses'
      ]
    },
    {
      icon: Stethoscope,
      titleFr: 'Soins Préventifs',
      titleEn: 'Preventive Care',
      descriptionFr: 'Services de soins préventifs et de surveillance de la santé animale.',
      descriptionEn: 'Preventive care services and animal health monitoring.',
      features: language === 'fr' ? [
        'Examens de santé réguliers',
        'Programmes de vaccination',
        'Dépistage préventif',
        'Conseils en nutrition'
      ] : [
        'Regular health checkups',
        'Vaccination programs',
        'Preventive screening',
        'Nutrition advice'
      ]
    },
    {
      icon: Users,
      titleFr: 'Services Communautaires',
      titleEn: 'Community Services',
      descriptionFr: 'Programmes communautaires de sensibilisation et d\'éducation sur les soins animaliers.',
      descriptionEn: 'Community awareness and education programs on animal care.',
      features: language === 'fr' ? [
        'Ateliers communautaires',
        'Sensibilisation publique',
        'Programmes éducatifs',
        'Support aux refuges'
      ] : [
        'Community workshops',
        'Public awareness',
        'Educational programs',
        'Shelter support'
      ]
    }
  ];

  return (
    <div className="py-16 bg-black min-h-screen w-full">
      <div className="container-responsive">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <PawPrint className="w-16 h-16 text-[#f89422] mr-4" aria-hidden="true" />
            <h1 className="text-4xl lg:text-5xl font-bold">
              <span className="text-[#0d6efd]">
                {language === 'fr' ? 'Services' : 'Animal'}
              </span>
              <span className="text-[#f89422]">
                {language === 'fr' ? ' de Premiers Soins Animaliers' : ' First Aid Services'}
              </span>
            </h1>
          </div>
          <p className="text-xl text-[#f89422] max-w-4xl mx-auto">
            {language === 'fr' ? (
              'Services spécialisés en premiers soins animaliers pour professionnels et propriétaires d\'animaux. Nous offrons des formations certifiées, des soins d\'urgence et des programmes de prévention pour assurer le bien-être animal.'
            ) : (
              'Specialized animal first aid services for professionals and pet owners. We offer certified training, emergency care and prevention programs to ensure animal welfare.'
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-black rounded-xl p-8 border-2 hover:bg-gray-900 transition-all duration-300"
                style={{ borderColor: '#f89422' }}
              >
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <Icon className="w-12 h-12 text-[#f89422]" style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', maxWidth: '48px', maxHeight: '48px' }} aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {(() => {
                      const title = language === 'fr' ? service.titleFr : service.titleEn;
                      const words = title.split(' ');
                      const firstWord = words[0];
                      const restWords = words.slice(1).join(' ');
                      
                      return (
                        <>
                          <span className="text-[#3b82f6]">{firstWord}</span>
                          {restWords && <span className="text-[#f89422]"> {restWords}</span>}
                        </>
                      );
                    })()}
                  </h3>
                </div>
                <p className="text-[#f89422] mb-6 text-lg leading-relaxed">
                  {language === 'fr' ? service.descriptionFr : service.descriptionEn}
                </p>
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-[#0d6efd] mr-3 flex-shrink-0" aria-hidden="true" />
                      <span className="text-[#f89422]">{feature}</span>
                    </div>
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