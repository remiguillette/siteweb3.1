import { HardHat, CheckCircle, Shield, BookOpen, Users, FileCheck, AlertTriangle, Stethoscope } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export default function HealthSafety() {
  const { t, language } = useTranslation();

  const services = [
    {
      icon: Shield,
      titleFr: 'Évaluation des Risques',
      titleEn: 'Risk Assessment',
      descriptionFr: 'Identification et évaluation complète des risques en milieu de travail selon les normes CNESST et canadiennes.',
      descriptionEn: 'Complete identification and assessment of workplace risks according to CNESST and Canadian standards.',
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
      titleFr: 'Conformité Réglementaire',
      titleEn: 'Regulatory Compliance',
      descriptionFr: 'Audit et mise en conformité avec la Loi sur la santé et la sécurité du travail (LSST) et les règlements provinciaux.',
      descriptionEn: 'Audit and compliance with the Occupational Health and Safety Act (OHSA) and provincial regulations.',
      features: language === 'fr' ? [
        'Audit de conformité LSST',
        'Plans de santé-sécurité',
        'Mise en conformité réglementaire',
        'Documentation requise'
      ] : [
        'OHSA compliance audit',
        'Health & safety plans',
        'Regulatory compliance',
        'Required documentation'
      ]
    },
    {
      icon: Users,
      titleFr: 'Comités de Santé-Sécurité',
      titleEn: 'Health & Safety Committees',
      descriptionFr: 'Mise en place et accompagnement des comités de santé et sécurité au travail selon les exigences légales.',
      descriptionEn: 'Establishment and support of workplace health and safety committees according to legal requirements.',
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
    },
    {
      icon: AlertTriangle,
      titleFr: 'Gestion des Incidents',
      titleEn: 'Incident Management',
      descriptionFr: 'Systèmes complets de gestion des incidents, accidents et événements de travail.',
      descriptionEn: 'Comprehensive systems for managing workplace incidents, accidents and events.',
      features: language === 'fr' ? [
        'Enquêtes d\'accidents',
        'Rapports d\'incidents',
        'Mesures correctives',
        'Prévention des récidives'
      ] : [
        'Accident investigations',
        'Incident reporting',
        'Corrective measures',
        'Recurrence prevention'
      ]
    },
    {
      icon: Stethoscope,
      titleFr: 'Santé au Travail',
      titleEn: 'Occupational Health',
      descriptionFr: 'Programmes de surveillance et de protection de la santé des travailleurs.',
      descriptionEn: 'Worker health surveillance and protection programs.',
      features: language === 'fr' ? [
        'Évaluation de l\'exposition',
        'Programmes de surveillance',
        'Ergonomie du travail',
        'Prévention des maladies'
      ] : [
        'Exposure assessment',
        'Surveillance programs',
        'Workplace ergonomics',
        'Disease prevention'
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
              'Expertise en santé et sécurité au travail pour assurer la conformité réglementaire et créer des environnements de travail sécuritaires. Nos services couvrent l\'évaluation des risques, la formation SST et la mise en conformité avec les lois provinciales.'
            ) : (
              'Occupational health and safety expertise to ensure regulatory compliance and create safe work environments. Our services cover risk assessment, OHS training and compliance with provincial legislation.'
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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