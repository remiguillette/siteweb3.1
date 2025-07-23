import { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { useToast } from '../hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Shield } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  useScrollToTop(); // Automatically scroll to top when navigating to this page
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    service: '',
    message: ''
  });

  // Anti-spam protection
  const [formStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Add anti-spam fields to submission
      const submissionData = {
        ...data,
        formStartTime: formStartTime.toString(),
        // Honeypot fields (should remain empty)
        website: '',
        url: '',
        phone_hidden: ''
      };
      
      const response = await apiRequest('POST', '/api/contact', submissionData);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitting(false);
      toast({
        title: "Message envoyé",
        description: t.contact.form.successMessage || "Votre message a été envoyé avec succès!"
      });
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        service: '',
        message: ''
      });
    },
    onError: (error: any) => {
      setIsSubmitting(false);
      console.error('Contact form error:', error);
      const errorMessage = error?.message || "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting || contactMutation.isPending) {
      return;
    }

    // Check minimum time requirement (3 seconds)
    const timeSinceLoad = Date.now() - formStartTime;
    if (timeSinceLoad < 3000) {
      toast({
        title: "Erreur",
        description: "Veuillez prendre le temps de bien remplir le formulaire.",
        variant: "destructive"
      });
      return;
    }
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive"
      });
      return;
    }

    // Simple frontend validation
    if (formData.message.length < 10) {
      toast({
        title: "Erreur",
        description: "Le message doit contenir au moins 10 caractères.",
        variant: "destructive"
      });
      return;
    }

    if (formData.message.length > 2000) {
      toast({
        title: "Erreur",
        description: "Le message ne peut pas dépasser 2000 caractères.",
        variant: "destructive"
      });
      return;
    }

    // Set submitting state and submit form
    setIsSubmitting(true);
    contactMutation.mutate(formData);
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
                  <svg 
                    className="w-6 h-6" 
                    style={{ color: '#f89422' }} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Icône de localisation"
                  >
                    <title>Localisation</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#f89422' }}>Adresse</h3>
                  <p style={{ color: '#f89422' }}>{t.contact.address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg 
                    className="w-6 h-6" 
                    style={{ color: '#0d6efd' }} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Icône de téléphone"
                  >
                    <title>Téléphone</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#0d6efd' }}>Téléphone</h3>
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
                  <svg 
                    className="w-6 h-6" 
                    style={{ color: '#f89422' }} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Icône de courriel"
                  >
                    <title>Courriel</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#f89422' }}>Courriel</h3>
                  <p style={{ color: '#f89422' }}>{t.contact.email}</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-black rounded-2xl p-8 border-2" style={{ borderColor: '#f89422' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#f89422' }}>{t.contact.hours}</h2>
              <div className="space-y-3" style={{ color: '#f89422' }}>
                <div className="text-center">
                  <span className="font-semibold text-lg">24/7 - Toute l'année</span>
                </div>
                <div className="text-center text-sm">
                  <span>Services disponibles en tout temps</span>
                </div>
                <div className="text-center text-sm">
                  <span>Jours fériés canadiens : Sur appel</span>
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
                    placeholder="Votre prénom"
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
                    placeholder="Votre nom"
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
                  placeholder="votre@email.com"
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
                  <option value="public-safety">Consultation en Sécurité Publique</option>
                  <option value="francophone">Services Communautaires Francophones</option>
                  <option value="health-safety">Santé et Sécurité au Travail</option>
                  <option value="animal-aid">Premiers Soins Animaliers</option>
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

              {/* Honeypot fields - Hidden from users but visible to bots */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  placeholder="Leave this empty"
                />
                <input
                  type="url"
                  name="url"
                  tabIndex={-1}
                  autoComplete="off"
                  placeholder="Leave this empty"
                />
                <input
                  type="tel"
                  name="phone_hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  placeholder="Leave this empty"
                />
              </div>

              {/* Enhanced anti-spam protection notice */}
              <div className="mb-6 flex justify-center">
                <div className="text-[#f89422] text-center text-sm flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield size={16} aria-hidden="true" />
                    <span>Protection renforcée contre les abus</span>
                  </div>
                  <span className="text-xs opacity-75">
                    Limite: 2 messages/heure • Protection contre les bots
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || contactMutation.isPending}
                className="w-full text-white font-semibold py-4 px-8 bg-gradient-to-r from-[#f89422] to-[#0d6efd] hover:from-[#fb923c] hover:to-[#3b82f6] transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed disabled:bg-gray-500"
              >
                {isSubmitting || contactMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  t.contact.form.submit
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}