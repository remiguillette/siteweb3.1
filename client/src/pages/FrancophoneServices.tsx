import { User, CheckCircle, Users, BookOpen, Heart, Globe } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export default function FrancophoneServices() {
  const { t, language } = useTranslation();

  const services = [
    {
      icon: Users,
      titleFr: 'Services Communautaires',
      titleEn: 'Community Services',
      descriptionFr: 'Programmes et services adaptés aux besoins spécifiques des communautés francophones du Canada.',
      descriptionEn: 'Programs and services tailored to the specific needs of francophone communities in Canada.',
      features: language === 'fr' ? [
        'Développement communautaire',
        'Programmes culturels',
        'Services de liaison',
        'Activités intergénérationnelles'
      ] : [
        'Community development',
        'Cultural programs',
        'Liaison services',
        'Intergenerational activities'
      ]
    },
    {
      icon: BookOpen,
      titleFr: 'Éducation et Formation',
      titleEn: 'Education and Training',
      descriptionFr: 'Programmes éducatifs et de formation pour maintenir et promouvoir la langue française.',
      descriptionEn: 'Educational and training programs to maintain and promote the French language.',
      features: language === 'fr' ? [
        'Cours de français',
        'Formations professionnelles',
        'Ateliers culturels',
        'Programmes jeunesse'
      ] : [
        'French language courses',
        'Professional training',
        'Cultural workshops',
        'Youth programs'
      ]
    },
    {
      icon: Heart,
      titleFr: 'Accompagnement Social',
      titleEn: 'Social Support',
      descriptionFr: 'Services d\'accompagnement et de soutien pour les familles et individus francophones.',
      descriptionEn: 'Support and assistance services for francophone families and individuals.',
      features: language === 'fr' ? [
        'Soutien familial',
        'Aide à l\'intégration',
        'Services d\'orientation',
        'Accompagnement personnalisé'
      ] : [
        'Family support',
        'Integration assistance',
        'Guidance services',
        'Personalized support'
      ]
    },
    {
      icon: Globe,
      titleFr: 'Promotion Culturelle',
      titleEn: 'Cultural Promotion',
      descriptionFr: 'Initiatives pour promouvoir et célébrer la culture francophone au sein de la communauté.',
      descriptionEn: 'Initiatives to promote and celebrate francophone culture within the community.',
      features: language === 'fr' ? [
        'Événements culturels',
        'Partenariats institutionnels',
        'Promotion de la francophonie',
        'Réseautage communautaire'
      ] : [
        'Cultural events',
        'Institutional partnerships',
        'Francophone promotion',
        'Community networking'
      ]
    }
  ];

  return (
    <div className="py-16 bg-black min-h-screen w-full">
      <div className="container-responsive">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <User className="w-16 h-16 text-[#f89422] mr-4" />
            <h1 className="text-4xl lg:text-5xl font-bold">
              <span className="text-[#0d6efd]">
                {language === 'fr' ? 'Services' : 'Francophone'}
              </span>
              <span className="text-[#f89422]">
                {language === 'fr' ? ' Communautaires Francophones' : ' Community Services'}
              </span>
            </h1>
          </div>
          <p className="text-xl text-[#f89422] max-w-4xl mx-auto">
            {language === 'fr' ? (
              'Services dédiés au développement et au soutien des communautés francophones. Nous offrons des programmes culturels, éducatifs et sociaux pour préserver et promouvoir la richesse de la francophonie canadienne.'
            ) : (
              'Services dedicated to the development and support of francophone communities. We offer cultural, educational and social programs to preserve and promote the richness of Canadian francophonie.'
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
                    <Icon className="w-12 h-12 text-[#f89422]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#f89422]">
                    {language === 'fr' ? service.titleFr : service.titleEn}
                  </h3>
                </div>
                <p className="text-[#f89422] mb-6 text-lg leading-relaxed">
                  {language === 'fr' ? service.descriptionFr : service.descriptionEn}
                </p>
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-[#0d6efd] mr-3 flex-shrink-0" />
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