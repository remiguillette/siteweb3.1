import { Shield, User, HardHat, PawPrint, Target, ClipboardList, CheckCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useState } from 'react';
import { useToast } from '../hooks/use-toast';

export default function Home() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    service: '',
    message: ''
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Message envoyé",
      description: t.contact.form.successMessage
    });

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      service: '',
      message: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const divisions = [
    {
      icon: Shield,
      title: 'Public Safety Consulting Firm',
      data: t.divisions.publicSafety,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-400',
      tagColor: 'bg-orange-500/20 text-orange-400'
    },
    {
      icon: User,
      title: 'Francophone Community Service',
      data: t.divisions.francophone,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-400',
      tagColor: 'bg-blue-500/20 text-blue-400'
    },
    {
      icon: HardHat,
      title: 'Occupational Health and Safety (OHS)',
      data: t.divisions.healthSafety,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-blue-500',
      tagColor: 'bg-orange-500/20 text-orange-400'
    },
    {
      icon: PawPrint,
      title: 'Animal First Aid Service',
      data: t.divisions.animalAid,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-orange-500',
      tagColor: 'bg-blue-500/20 text-blue-400'
    }
  ];

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
                <h2 className="text-3xl font-bold text-white text-center mb-8">Divisions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                  {divisions.map((division, index) => {
                    const Icon = division.icon;
                    return (
                      <div
                        key={index}
                        className="bg-rg-card-bg rounded-xl p-6 hover:bg-rg-gray transition-all duration-300 transform hover:scale-105 border border-rg-gray text-center"
                      >
                        <div className={`w-16 h-16 bg-gradient-to-br ${division.gradientFrom} ${division.gradientTo} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{division.title}</h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divisions Section */}
      <section id="divisions" className="py-16 bg-rg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t.divisions.title}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
                    <div className={`w-16 h-16 bg-gradient-to-br ${division.gradientFrom} ${division.gradientTo} rounded-xl flex items-center justify-center mr-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{division.data.title}</h3>
                      <p className="text-orange-400">{division.data.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {division.data.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {division.data.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1 ${division.tagColor} rounded-full text-sm`}
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
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-rg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t.services.title}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-rg-card-bg rounded-2xl p-8 text-center hover:bg-rg-gray transition-all duration-300 border border-rg-gray"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.gradientFrom} ${service.gradientTo} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.data.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {service.data.description}
                  </p>
                  <ul className="text-left space-y-2 text-gray-300">
                    {service.data.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className={`w-5 h-5 ${service.checkColor} mr-3`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">{t.services.ctaTitle}</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              {t.services.ctaDescription}
            </p>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-400 hover:to-blue-400 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {t.services.ctaButton}
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-rg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t.contact.title}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-rg-card-bg rounded-2xl p-8 border border-rg-gray">
                <h3 className="text-2xl font-bold text-white mb-6">{t.contact.info}</h3>
                
                {/* Address */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Adresse</h4>
                    <p className="text-gray-300">{t.contact.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Téléphone</h4>
                    <p className="text-gray-300">{t.contact.phone}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Courriel</h4>
                    <p className="text-gray-300">{t.contact.email}</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-rg-card-bg rounded-2xl p-8 border border-rg-gray">
                <h3 className="text-xl font-bold text-white mb-4">{t.contact.hours}</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>{t.contact.weekdays}</span>
                    <span>8h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.contact.saturday}</span>
                    <span>9h00 - 15h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.contact.sunday}</span>
                    <span>{t.contact.closed}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-rg-card-bg rounded-2xl p-8 border border-rg-gray">
              <h3 className="text-2xl font-bold text-white mb-6">{t.contact.form.title}</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      {t.contact.form.firstName}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-rg-dark-bg border border-rg-gray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                      {t.contact.form.lastName}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-rg-dark-bg border border-rg-gray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {t.contact.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-rg-dark-bg border border-rg-gray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                    {t.contact.form.service}
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-rg-dark-bg border border-rg-gray rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">{t.contact.form.selectService}</option>
                    <option value="public-safety">Sécurité Publique</option>
                    <option value="francophone-services">Services Francophones</option>
                    <option value="health-safety">Santé et Sécurité</option>
                    <option value="animal-aid">Premiers Soins Animaliers</option>
                    <option value="strategic">Consultation Stratégique</option>
                    <option value="project-management">Gestion de Projets</option>
                    <option value="security-compliance">Sécurité et Conformité</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-rg-dark-bg border border-rg-gray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={t.contact.form.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-400 hover:to-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {t.contact.form.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
