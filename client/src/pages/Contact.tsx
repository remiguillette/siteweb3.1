import { useState, useRef } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { useToast } from '../hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    service: '',
    message: ''
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData & { recaptchaToken: string }) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message envoyé",
        description: t.contact.form.successMessage || "Votre message a été envoyé avec succès!"
      });
      // Reset form and reCAPTCHA
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        service: '',
        message: ''
      });
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    },
    onError: (error: any) => {
      console.error('Contact form error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

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

    // reCAPTCHA validation
    if (!recaptchaToken) {
      toast({
        title: "Erreur", 
        description: "Veuillez compléter la vérification reCAPTCHA.",
        variant: "destructive"
      });
      return;
    }

    // Submit form to backend
    contactMutation.mutate({ 
      ...formData, 
      recaptchaToken: recaptchaToken || '' 
    });
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="py-16 bg-black min-h-screen w-full">
      <div className="container-responsive">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#f89422' }}>{t.contact.title}</h1>
          <p className="text-xl max-w-4xl mx-auto" style={{ color: '#f89422' }}>
            {t.contact.subtitle}
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-black rounded-2xl p-8 border-2" style={{ borderColor: '#f89422' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#f89422' }}>{t.contact.info}</h2>
              
              {/* Address */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" style={{ color: '#f89422' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#f89422' }}>{t.contact.labels.address}</h3>
                  <p style={{ color: '#f89422' }}>{t.contact.address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" style={{ color: '#0d6efd' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#0d6efd' }}>{t.contact.labels.phone}</h3>
                  <a 
                    href={`tel:${t.contact.phone}`} 
                    className="hover:underline transition-all duration-200"
                    style={{ color: '#f89422' }}
                  >
                    {t.contact.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" style={{ color: '#f89422' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#f89422' }}>{t.contact.labels.email}</h3>
                  <p style={{ color: '#f89422' }}>{t.contact.email}</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-black rounded-2xl p-8 border-2" style={{ borderColor: '#f89422' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#f89422' }}>{t.contact.hours}</h2>
              <div className="space-y-3" style={{ color: '#f89422' }}>
                <div className="text-center">
                  <span className="font-semibold text-lg">{t.contact.availability}</span>
                </div>
                <div className="text-center text-sm">
                  <span>{t.contact.serviceAvailable}</span>
                </div>
                <div className="text-center text-sm">
                  <span>{t.contact.holidays}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-black rounded-2xl p-8 border-2" style={{ borderColor: '#f89422' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#f89422' }}>{t.contact.form.title}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: '#f89422' }}>
                    {t.contact.form.firstName}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#f89422', '--tw-ring-color': '#f89422' } as React.CSSProperties}
                    placeholder={t.contact.form.placeholders.firstName}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: '#f89422' }}>
                    {t.contact.form.lastName}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#f89422', '--tw-ring-color': '#f89422' } as React.CSSProperties}
                    placeholder={t.contact.form.placeholders.lastName}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#f89422' }}>
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#f89422', '--tw-ring-color': '#f89422' } as React.CSSProperties}
                  placeholder={t.contact.form.placeholders.email}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="service" className="block text-sm font-medium mb-2" style={{ color: '#f89422' }}>
                  {t.contact.form.service}
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#f89422', '--tw-ring-color': '#f89422' } as React.CSSProperties}
                >
                  <option value="">{t.contact.form.selectService}</option>
                  <option value="public-safety">{t.contact.services.publicSafety}</option>
                  <option value="francophone">{t.contact.services.francophone}</option>
                  <option value="health-safety">{t.contact.services.healthSafety}</option>
                  <option value="animal-aid">{t.contact.services.animalAid}</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#f89422' }}>
                  {t.contact.form.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                  style={{ borderColor: '#f89422', '--tw-ring-color': '#f89422' } as React.CSSProperties}
                  placeholder={t.contact.form.messagePlaceholder}
                ></textarea>
              </div>

              {/* reCAPTCHA */}
              <div className="mb-6 flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LcG7oYrAAAAADWQVo2UdPWVuPVWpIeSc0BmNduE"
                  onChange={handleRecaptchaChange}
                  theme="dark"
                />
              </div>

              <button
                type="submit"
                disabled={contactMutation.isPending}
                className={`w-full text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed ${
                  contactMutation.isPending 
                    ? 'bg-gray-500' 
                    : 'bg-gradient-to-r from-[#f89422] to-[#0d6efd] hover:from-[#fb923c] hover:to-[#3b82f6]'
                }`}
              >
                {contactMutation.isPending ? 'Envoi en cours...' : t.contact.form.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}