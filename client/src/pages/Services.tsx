import { Target, ClipboardList, Shield, CheckCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Target,
      data: t.services.strategic,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-400',
      checkColor: 'text-orange-400'
    },
    {
      icon: ClipboardList,
      data: t.services.projectManagement,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-400',
      checkColor: 'text-blue-400'
    },
    {
      icon: Shield,
      data: t.services.security,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-blue-500',
      checkColor: 'text-orange-400'
    }
  ];

  const scrollToContact = () => {
    window.location.href = '/#contact';
  };

  return (
    <div className="py-16 bg-rg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">{t.services.title}</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-rg-card-bg rounded-2xl p-8 text-center hover:bg-rg-gray transition-all duration-300 border border-rg-gray"
              >
                <div className={`w-24 h-24 bg-gradient-to-br ${service.gradientFrom} ${service.gradientTo} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">{service.data.title}</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.data.description}
                </p>
                <ul className="text-left space-y-3 text-gray-300">
                  {service.data.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className={`w-5 h-5 ${service.checkColor} mr-3 flex-shrink-0`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-rg-card-bg rounded-2xl p-12 border border-rg-gray">
          <h2 className="text-3xl font-bold text-white mb-4">{t.services.ctaTitle}</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            {t.services.ctaDescription}
          </p>
          <button
            onClick={scrollToContact}
            className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-400 hover:to-blue-400 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {t.services.ctaButton}
          </button>
        </div>
      </div>
    </div>
  );
}