import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { useToast } from '../hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { BadgeCheck, CheckCircle, GraduationCap, Rocket } from 'lucide-react';

type FormState = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  email: string;
  employmentStatus: string;
  employmentStatusOther: string;
  motivations: string;
  careerGoals: string;
  declarationAccepted: boolean;
};

const initialFormState: FormState = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  address: '',
  phoneNumber: '',
  email: '',
  employmentStatus: '',
  employmentStatusOther: '',
  motivations: '',
  careerGoals: '',
  declarationAccepted: false,
};

export default function Learn() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  useScrollToTop();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [formStartTime] = useState(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!submitButtonRef.current) return;

    let angle = 0;
    let animationFrameId: number;

    const rotateGradient = () => {
      angle = (angle + 1) % 360;
      if (submitButtonRef.current) {
        submitButtonRef.current.style.setProperty('--gradient-angle', `${angle}deg`);
      }
      animationFrameId = requestAnimationFrame(rotateGradient);
    };

    rotateGradient();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const employmentOptions = useMemo(
    () => [
      { value: 'employee', label: t.learn.form.employment.options.employee },
      { value: 'jobSeeker', label: t.learn.form.employment.options.jobSeeker },
      { value: 'student', label: t.learn.form.employment.options.student },
      { value: 'selfEmployed', label: t.learn.form.employment.options.selfEmployed },
      { value: 'other', label: t.learn.form.employment.options.other },
    ],
    [t.learn.form.employment.options]
  );

  const highlightIcons = useMemo(() => [GraduationCap, BadgeCheck, Rocket], []);

  const errorTitle = language === 'fr' ? 'Erreur' : 'Error';

  const applicationMutation = useMutation({
    mutationFn: async (data: FormState) => {
      const submissionData = {
        ...data,
        formStartTime: formStartTime.toString(),
        website: '',
        url: '',
        phone_hidden: '',
      };

      const response = await apiRequest('POST', '/api/training-applications', submissionData);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitting(false);
      toast({
        title: t.learn.form.successTitle,
        description: t.learn.form.successMessage,
      });
      setFormData({ ...initialFormState });
    },
    onError: (error: any) => {
      setIsSubmitting(false);
      console.error('Training application error:', error);
      const fallbackMessage = language === 'fr'
        ? "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer."
        : 'An error occurred while submitting your application. Please try again.';
      const errorMessage = error?.message || fallbackMessage;
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmploymentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      employmentStatus: value,
      employmentStatusOther: value === 'other' ? prev.employmentStatusOther : '',
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || applicationMutation.isPending) {
      return;
    }

    const timeSinceLoad = Date.now() - formStartTime;
    if (timeSinceLoad < 3000) {
      toast({
        title: errorTitle,
        description: t.learn.form.errors.tooFast,
        variant: 'destructive',
      });
      return;
    }

    const requiredFields: (keyof FormState)[] = [
      'firstName',
      'lastName',
      'dateOfBirth',
      'address',
      'phoneNumber',
      'email',
      'employmentStatus',
      'motivations',
      'careerGoals',
    ];

    const hasEmptyRequired = requiredFields.some((field) => !String(formData[field]).trim());
    if (hasEmptyRequired) {
      toast({
        title: errorTitle,
        description: t.learn.form.errors.required,
        variant: 'destructive',
      });
      return;
    }

    if (
      formData.employmentStatus === 'other' &&
      !formData.employmentStatusOther.trim()
    ) {
      toast({
        title: errorTitle,
        description: t.learn.form.errors.otherRequired,
        variant: 'destructive',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: errorTitle,
        description: t.learn.form.errors.email,
        variant: 'destructive',
      });
      return;
    }

    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      toast({
        title: errorTitle,
        description: t.learn.form.errors.phone,
        variant: 'destructive',
      });
      return;
    }

    if (formData.motivations.trim().length < 20) {
      toast({
        title: errorTitle,
        description: t.learn.form.errors.motivationsLength,
        variant: 'destructive',
      });
      return;
    }

    if (formData.careerGoals.trim().length < 20) {
      toast({
        title: errorTitle,
        description: t.learn.form.errors.careerLength,
        variant: 'destructive',
      });
      return;
    }

    if (!formData.declarationAccepted) {
      toast({
        title: errorTitle,
        description: t.learn.form.errors.declaration,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const submission: FormState = {
      ...formData,
      address: formData.address.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      motivations: formData.motivations.trim(),
      careerGoals: formData.careerGoals.trim(),
      employmentStatusOther:
        formData.employmentStatus === 'other'
          ? formData.employmentStatusOther.trim()
          : '',
    };

    applicationMutation.mutate(submission);
  };

  const fullNameForDeclaration = [formData.firstName.trim(), formData.lastName.trim()]
    .filter(Boolean)
    .join(' ') || t.learn.form.declaration.fullNamePlaceholder;
  const declarationText = t.learn.form.declaration.text.replace('{{fullName}}', fullNameForDeclaration);

  return (
    <main className="bg-rg-dark-bg min-h-screen w-full py-16 text-white">
      <div className="container-responsive space-y-16">
        <header className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#f89422' }}>
            {t.learn.title}
          </h1>
          <p className="text-xl text-gray-300">{t.learn.subtitle}</p>
          <p className="text-lg text-gray-300 leading-relaxed">{t.learn.intro}</p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {t.learn.highlights.map((highlight, index) => {
            const Icon = highlightIcons[index % highlightIcons.length];
            return (
              <div
                key={highlight.title}
                className="bg-rg-card-bg border border-rg-gray rounded-2xl p-6 h-full flex flex-col"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#f89422' }}>
                  {highlight.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="bg-rg-card-bg border border-rg-gray rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#f89422' }}>
            {t.learn.benefits.title}
          </h2>
          <ul className="space-y-4">
            {t.learn.benefits.items.map((item, index) => (
              <li key={index} className="flex items-start text-gray-300">
                <CheckCircle className="w-5 h-5 text-[#f89422] mt-1 mr-3" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-rg-card-bg border border-rg-gray rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#f89422' }}>
            {t.learn.form.title}
          </h2>
          <p className="text-gray-300 mb-8">{t.learn.form.description}</p>

          <form onSubmit={handleSubmit} className="space-y-10">
            <fieldset className="space-y-6">
              <legend className="text-2xl font-semibold" style={{ color: '#f89422' }}>
                {t.learn.form.personal.title}
              </legend>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-gray-300">
                    {t.learn.form.personal.firstName}
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border-2 border-[#f89422] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f89422] focus:border-transparent"
                    placeholder={t.learn.form.personal.placeholders.firstName}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-gray-300">
                    {t.learn.form.personal.lastName}
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border-2 border-[#f89422] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f89422] focus:border-transparent"
                    placeholder={t.learn.form.personal.placeholders.lastName}
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-2 text-gray-300">
                    {t.learn.form.personal.dateOfBirth}
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border-2 border-[#f89422] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f89422] focus:border-transparent"
                    placeholder={t.learn.form.personal.placeholders.dateOfBirth}
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2 text-gray-300">
                    {t.learn.form.personal.phoneNumber}
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border-2 border-[#f89422] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f89422] focus:border-transparent"
                    placeholder={t.learn.form.personal.placeholders.phoneNumber}
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium mb-2 text-gray-300">
                    {t.learn.form.personal.address}
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border-2 border-[#f89422] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f89422] focus:border-transparent"
                    placeholder={t.learn.form.personal.placeholders.address}
                    autoComplete="street-address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                    {t.learn.form.personal.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border-2 border-[#f89422] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f89422] focus:border-transparent"
                    placeholder={t.learn.form.personal.placeholders.email}
                    autoComplete="email"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="text-2xl font-semibold" style={{ color: '#f89422' }}>
                {t.learn.form.employment.title}
              </legend>
              <p className="text-sm text-gray-400">{t.learn.form.employment.description}</p>
              <div className="space-y-3">
                {employmentOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors border-2 ${
                      formData.employmentStatus === option.value
                        ? 'border-[#f89422] bg-black'
                        : 'border-[#1f2937] bg-black/40 hover:border-[#f89422]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="employmentStatus"
                        value={option.value}
                        checked={formData.employmentStatus === option.value}
                        onChange={() => handleEmploymentChange(option.value)}
                        className="h-4 w-4 text-[#f89422] focus:ring-[#f89422]"
                      />
                      <span className="text-white">{option.label}</span>
                    </div>
                    {formData.employmentStatus === option.value && (
                      <CheckCircle className="w-5 h-5 text-[#f89422]" aria-hidden="true" />
                    )}
                  </label>
                ))}
              </div>

              {formData.employmentStatus === 'other' && (
                <div>
                  <label htmlFor="employmentStatusOther" className="block text-sm font-medium mb-2 text-gray-300">
                    {t.learn.form.employment.options.other}
                  </label>
                  <input
                    id="employmentStatusOther"
                    name="employmentStatusOther"
                    type="text"
                    value={formData.employmentStatusOther}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border-2 border-[#f89422] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f89422] focus:border-transparent"
                    placeholder={t.learn.form.employment.otherPlaceholder}
                  />
                </div>
              )}
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="text-2xl font-semibold" style={{ color: '#f89422' }}>
                {t.learn.form.motivations.title}
              </legend>
              <div>
                <label htmlFor="motivations" className="block text-sm font-medium mb-2 text-gray-300">
                  {t.learn.form.motivations.motivationsLabel}
                </label>
                <textarea
                  id="motivations"
                  name="motivations"
                  rows={4}
                  value={formData.motivations}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-black border-2 border-[#f89422] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f89422] focus:border-transparent resize-none"
                  placeholder={t.learn.form.motivations.motivationsPlaceholder}
                />
              </div>
              <div>
                <label htmlFor="careerGoals" className="block text-sm font-medium mb-2 text-gray-300">
                  {t.learn.form.motivations.careerGoalsLabel}
                </label>
                <textarea
                  id="careerGoals"
                  name="careerGoals"
                  rows={4}
                  value={formData.careerGoals}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-black border-2 border-[#f89422] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f89422] focus:border-transparent resize-none"
                  placeholder={t.learn.form.motivations.careerGoalsPlaceholder}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-2xl font-semibold" style={{ color: '#f89422' }}>
                {t.learn.form.declaration.title}
              </legend>
              <p className="text-gray-300 leading-relaxed">{declarationText}</p>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="declarationAccepted"
                  checked={formData.declarationAccepted}
                  onChange={handleInputChange}
                  className="mt-1 h-5 w-5 text-[#f89422] focus:ring-[#f89422]"
                />
                <span className="text-gray-300">{t.learn.form.declaration.checkbox}</span>
              </label>
            </fieldset>

            <button
              ref={submitButtonRef}
              type="submit"
              disabled={isSubmitting || applicationMutation.isPending}
              className="border-gradient-button w-full md:w-auto px-8 py-4 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || applicationMutation.isPending
                ? language === 'fr'
                  ? 'Envoi en cours...'
                  : 'Submitting...'
                : t.learn.form.submit}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
