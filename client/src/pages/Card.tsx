import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card as UiCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useTranslation } from "@/contexts/TranslationContext";

interface CardProfileHighlight {
  label: string;
  value: string;
}

interface CardProfileContact {
  phone: string;
  email: string;
  website: string;
  location: string;
}

interface CardProfile {
  name: string;
  headline: string;
  mission: string;
  highlights: CardProfileHighlight[];
  specialties: string[];
  engagements: string[];
  contact: CardProfileContact;
  languages: string[];
  availability: string;
  signature: string;
}

interface CardAccessSuccess {
  success: true;
  profile: CardProfile;
}

export default function SecureCard() {
  useScrollToTop();
  const { toast } = useToast();
  const { language } = useTranslation();
  const isFrench = language === "fr";

  const [pin, setPin] = useState("");
  const [profile, setProfile] = useState<CardProfile | null>(null);

  const unlockCard = useMutation<CardAccessSuccess, Error, string>({
    mutationFn: async (submittedPin: string) => {
      const response = await fetch("/api/card/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: submittedPin }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = typeof payload?.error === "string" ? payload.error : "Unable to unlock the professional card.";
        throw new Error(message);
      }

      return payload as CardAccessSuccess;
    },
    onSuccess: (data) => {
      setProfile(data.profile);
      setPin("");
      toast({
        title: isFrench ? "Carte déverrouillée" : "Card unlocked",
        description: isFrench
          ? "Vous avez maintenant accès à la carte professionnelle de Rémi Guillette."
          : "You now have access to Rémi Guillette's professional profile card.",
      });
    },
    onError: (error) => {
      toast({
        title: isFrench ? "Accès refusé" : "Access denied",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      toast({
        title: isFrench ? "Format invalide" : "Invalid format",
        description: isFrench
          ? "Veuillez entrer un NIP à 4 chiffres pour accéder à la carte."
          : "Please enter a 4-digit PIN to unlock the card.",
        variant: "destructive",
      });
      return;
    }

    unlockCard.mutate(pin);
  };

  return (
    <main className="min-h-screen bg-black py-16">
      <div className="container-responsive max-w-5xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#f89422]">
            {isFrench ? "Carte professionnelle sécurisée" : "Secure professional card"}
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            {isFrench
              ? "Cette page est protégée par un NIP à 4 chiffres. Fournissez-le pour découvrir la carte professionnelle numérique de Rémi Guillette, mettant en valeur sa mission, ses expertises et ses coordonnées."
              : "This page is protected with a 4-digit PIN. Provide the code to unlock Rémi Guillette's digital business card featuring mission, expertise, and key contact details."}
          </p>
        </header>

        {!profile && (
          <section className="max-w-md mx-auto">
            <UiCard className="bg-black border-[#f89422]/60 shadow-lg shadow-[#f89422]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-[#f89422]">
                  {isFrench ? "Entrer le NIP" : "Enter PIN"}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {isFrench
                    ? "Le NIP autorise l'accès à une carte de présentation confidentielle."
                    : "Use the PIN to unlock a private professional overview."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="secure-pin" className="block text-sm font-medium text-white/80 mb-2">
                      {isFrench ? "NIP à 4 chiffres" : "4-digit PIN"}
                    </label>
                    <Input
                      id="secure-pin"
                      type="password"
                      inputMode="numeric"
                      pattern="\\d{4}"
                      maxLength={4}
                      value={pin}
                      onChange={(event) => setPin(event.target.value.replace(/[^0-9]/g, ""))}
                      className="bg-black text-white border-[#f89422]/60 focus-visible:ring-[#0d6efd]"
                      aria-describedby="secure-pin-help"
                    />
                    <p id="secure-pin-help" className="mt-2 text-xs text-white/60">
                      {isFrench
                        ? "Le NIP doit contenir exactement quatre chiffres."
                        : "The PIN must be exactly four digits."}
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#f89422] hover:bg-[#f89422]/80 text-black"
                    disabled={unlockCard.isPending}
                  >
                    {unlockCard.isPending
                      ? isFrench ? "Vérification en cours..." : "Verifying..."
                      : isFrench ? "Déverrouiller la carte" : "Unlock card"}
                  </Button>
                </form>
              </CardContent>
            </UiCard>
          </section>
        )}

        {profile && (
          <section className="space-y-8">
            <UiCard className="bg-black border-[#0d6efd]/60 shadow-2xl shadow-[#0d6efd]/10">
              <CardHeader className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <Badge className="bg-[#0d6efd] text-white mb-3 w-fit">{profile.languages.join(" · ")}</Badge>
                    <CardTitle className="text-3xl lg:text-4xl text-[#f89422]">
                      {profile.name}
                    </CardTitle>
                    <CardDescription className="text-lg text-white/80">
                      {profile.headline}
                    </CardDescription>
                  </div>
                  <div className="text-sm text-white/70 space-y-1">
                    <p>{profile.contact.location}</p>
                    <p>{profile.contact.website}</p>
                    <p>{profile.availability}</p>
                  </div>
                </div>
                <p className="text-base lg:text-lg text-white/90 leading-relaxed">
                  {profile.mission}
                </p>
              </CardHeader>
              <CardContent className="grid gap-8">
                <div className="grid md:grid-cols-3 gap-4">
                  {profile.highlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-[#f89422]/40 bg-black/60 p-4"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#0d6efd]">
                        {item.label}
                      </h3>
                      <p className="mt-2 text-sm text-white/80 leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#0d6efd] mb-4">
                    {isFrench ? "Domaines d'expertise" : "Areas of expertise"}
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {profile.specialties.map((specialty) => (
                      <li
                        key={specialty}
                        className="flex items-start gap-2 text-white/85"
                      >
                        <span className="text-[#f89422] mt-1">◆</span>
                        <span>{specialty}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#0d6efd] mb-4">
                    {isFrench ? "Engagements et offres" : "Engagements & offerings"}
                  </h3>
                  <ul className="space-y-3">
                    {profile.engagements.map((engagement) => (
                      <li
                        key={engagement}
                        className="flex items-start gap-2 text-white/85"
                      >
                        <span className="text-[#f89422] mt-1">➤</span>
                        <span>{engagement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <UiCard className="bg-black border-[#f89422]/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-[#f89422]">
                        {isFrench ? "Coordonnées directes" : "Direct contact"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-white/85">
                      <p>
                        <span className="block text-sm text-[#0d6efd]">
                          {isFrench ? "Téléphone" : "Phone"}
                        </span>
                        <a href={`tel:${profile.contact.phone.replace(/[^0-9+]/g, "")}`}>{profile.contact.phone}</a>
                      </p>
                      <p>
                        <span className="block text-sm text-[#0d6efd]">Email</span>
                        <a href={`mailto:${profile.contact.email}`} className="break-all">
                          {profile.contact.email}
                        </a>
                      </p>
                      <p>
                        <span className="block text-sm text-[#0d6efd]">Website</span>
                        <a href={profile.contact.website} target="_blank" rel="noreferrer">
                          {profile.contact.website}
                        </a>
                      </p>
                    </CardContent>
                  </UiCard>

                  <UiCard className="bg-black border-[#f89422]/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-[#f89422]">
                        {isFrench ? "Signature" : "Signature"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/85 leading-relaxed">{profile.signature}</p>
                    </CardContent>
                  </UiCard>
                </div>
              </CardContent>
            </UiCard>
          </section>
        )}
      </div>
    </main>
  );
}
