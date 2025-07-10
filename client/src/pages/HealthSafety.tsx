import { HardHat, CheckCircle, Shield, BookOpen, Users, FileCheck } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export default function HealthSafety() {
  const { t, language } = useTranslation();

  const services = [
    {
      icon: Shield,
      titleFr: 'Évaluation des Risques',
      titleEn: 'Risk Assessment',
      descriptionFr: 'Identification et évaluation complète des risques en milieu de travail selon les normes AODA et canadiennes.',
      descriptionEn: 'Complete identification and assessment of workplace risks according to AODA and Canadian standards.',
      features: language === 'fr' ? [
        'Inspection des lieux de travail',
        'Analyse des dangers',
        'Évaluation des risques',
        'Recommandations de sécurité'
      ] : [
        'Workplace inspections',
        'Hazard analysis',
        'Risk evaluation',
        'Safety recommendations'
      ]
    },
    {
      icon: BookOpen,
      titleFr: 'Formation SST',
      titleEn: 'OHS Training',
      descriptionFr: 'Programmes de formation en santé et sécurité au travail adaptés aux besoins spécifiques de votre organisation.',
      descriptionEn: 'Occupational health and safety training programs tailored to your organization\'s specific needs.',
      features: language === 'fr' ? [
        'Formation des superviseurs',
        'Sensibilisation des employés',
        'Programmes de certification',
        'Formations spécialisées'
      ] : [
        'Supervisor training',
        'Employee awareness',
        'Certification programs',
        'Specialized training'
      ]
    },
    {
      icon: FileCheck,
      titleFr: 'Conformité AODA',
      titleEn: 'AODA Compliance',
      descriptionFr: 'Audit et mise en conformité avec la Loi sur l\'accessibilité pour les personnes handicapées de l\'Ontario.',
      descriptionEn: 'Audit and compliance with the Accessibility for Ontarians with Disabilities Act.',
      features: language === 'fr' ? [
        'Audit de conformité AODA',
        'Plans d\'accessibilité',
        'Formation sur l\'accessibilité',
        'Mise en conformité'
      ] : [
        'AODA compliance audit',
        'Accessibility plans',
        'Accessibility training',
        'Compliance implementation'
      ]
    },
    {
      icon: Users,
      titleFr: 'Comités de Santé-Sécurité',
      titleEn: 'Health & Safety Committees',
      descriptionFr: 'Mise en place et accompagnement des comités de santé et sécurité au travail.',
      descriptionEn: 'Establishment and support of workplace health and safety committees.',
      features: language === 'fr' ? [
        'Formation des membres',
        'Procédures de comité',
        'Gestion des incidents',
        'Amélioration continue'
      ] : [
        'Member training',
        'Committee procedures',
        'Incident management',
        'Continuous improvement'
      ]
    }
  ];

  return (
    <div className="py-16 bg-black min-h-screen w-full">
      <div className="container-responsive">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <HardHat className="w-16 h-16 text-[#f89422] mr-4" />
            <h1 className="text-4xl lg:text-5xl font-bold">
              <span className="text-[#0d6efd]">
                {language === 'fr' ? 'Services' : 'Occupational'}
              </span>
              <span className="text-[#f89422]">
                {language === 'fr' ? ' en santé et Sécurité au Travail (SST)' : ' Health & Safety'}
              </span>
            </h1>
          </div>
          <p className="text-xl text-[#f89422] max-w-4xl mx-auto">
            {language === 'fr' ? (
              'Expertise en santé et sécurité au travail pour assurer la conformité AODA et créer des environnements de travail sécuritaires. Nos services couvrent l\'évaluation des risques, la formation et la mise en conformité réglementaire.'
            ) : (
              'Occupational health and safety expertise to ensure AODA compliance and create safe work environments. Our services cover risk assessment, training and regulatory compliance.'
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