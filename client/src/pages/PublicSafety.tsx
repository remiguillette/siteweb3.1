import { Shield, CheckCircle, Users, FileText, AlertTriangle, Search } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export default function PublicSafety() {
  const { t, language } = useTranslation();

  const services = [
    {
      icon: Search,
      titleFr: 'Évaluation et Audit',
      titleEn: 'Assessment and Audit',
      descriptionFr: 'Évaluation complète des systèmes de sécurité publique existants et identification des améliorations nécessaires.',
      descriptionEn: 'Comprehensive evaluation of existing public safety systems and identification of necessary improvements.',
      features: language === 'fr' ? [
        'Audit des politiques de sécurité',
        'Évaluation des risques',
        'Analyse des procédures',
        'Recommandations d\'amélioration'
      ] : [
        'Security policy audits',
        'Risk assessment',
        'Procedure analysis',
        'Improvement recommendations'
      ]
    },
    {
      icon: Users,
      titleFr: 'Formation et Développement',
      titleEn: 'Training and Development',
      descriptionFr: 'Programmes de formation spécialisés pour le personnel de sécurité publique et les gestionnaires.',
      descriptionEn: 'Specialized training programs for public safety personnel and managers.',
      features: language === 'fr' ? [
        'Formation en gestion de crise',
        'Développement du leadership',
        'Protocoles d\'urgence',
        'Formation continue'
      ] : [
        'Crisis management training',
        'Leadership development',
        'Emergency protocols',
        'Continuing education'
      ]
    },
    {
      icon: FileText,
      titleFr: 'Élaboration de Politiques',
      titleEn: 'Policy Development',
      descriptionFr: 'Développement et révision de politiques de sécurité publique conformes aux normes canadiennes.',
      descriptionEn: 'Development and review of public safety policies compliant with Canadian standards.',
      features: language === 'fr' ? [
        'Rédaction de politiques',
        'Conformité réglementaire',
        'Mise à jour des procédures',
        'Documentation complète'
      ] : [
        'Policy writing',
        'Regulatory compliance',
        'Procedure updates',
        'Complete documentation'
      ]
    },
    {
      icon: AlertTriangle,
      titleFr: 'Gestion des Urgences',
      titleEn: 'Emergency Management',
      descriptionFr: 'Planification et coordination des interventions d\'urgence pour assurer une réponse efficace.',
      descriptionEn: 'Planning and coordination of emergency interventions to ensure effective response.',
      features: language === 'fr' ? [
        'Plans d\'intervention d\'urgence',
        'Coordination multi-agences',
        'Simulation d\'urgence',
        'Amélioration continue'
      ] : [
        'Emergency response plans',
        'Multi-agency coordination',
        'Emergency simulation',
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
            <Shield className="w-16 h-16 text-[#f89422] mr-4" />
            <h1 className="text-4xl lg:text-5xl font-bold">
              <span className="text-[#0d6efd]">
                {language === 'fr' ? 'Cabinet-conseil' : 'Public'}
              </span>
              <span className="text-[#f89422]">
                {language === 'fr' ? ' en sécurité publique' : ' Safety Consulting'}
              </span>
            </h1>
          </div>
          <p className="text-xl text-[#f89422] max-w-4xl mx-auto">
            {language === 'fr' ? (
              'Expertise spécialisée en sécurité publique pour les organismes gouvernementaux et les entreprises privées. Notre équipe offre des solutions complètes pour optimiser la sécurité et la conformité.'
            ) : (
              'Specialized expertise in public safety for government agencies and private companies. Our team provides comprehensive solutions to optimize security and compliance.'
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
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