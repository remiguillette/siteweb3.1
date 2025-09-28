import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { getStudentSession, setStudentSession } from "@/lib/studentSession";

const StudentLogin = () => {
  useScrollToTop();
  const { t, language } = useTranslation();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const session = getStudentSession();
    if (session) {
      const destination = session.student.requiresPasswordChange
        ? language === "fr" ? "/etudiant/mot-de-passe" : "/student/change-password"
        : language === "fr" ? "/etudiant/portail" : "/student/portal";
      navigate(destination);
    }
  }, [language, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errors = t.studentPortal.login.errors;
        const errorMap: Record<string, string> = {
          missing_fields: errors.missingFields,
          not_found: errors.notFound,
          inactive: errors.inactive,
          invalid_credentials: errors.invalidCredentials,
          server_error: errors.server,
        };
        const mapped = errorMap[data.errorCode as string] || errors.server;
        setErrorMessage(mapped);
        return;
      }

      setStudentSession({ token: data.sessionToken, student: data.student });
      toast({ title: t.studentPortal.login.title, description: t.studentPortal.login.success });

      const destination = data.student.requiresPasswordChange
        ? language === "fr" ? "/etudiant/mot-de-passe" : "/student/change-password"
        : language === "fr" ? "/etudiant/portail" : "/student/portal";
      navigate(destination);
    } catch (error) {
      console.error("Student login failed", error);
      setErrorMessage(t.studentPortal.login.errors.server);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 py-16 px-4">
      <div className="max-w-lg mx-auto bg-[#0d1117] border border-[#1f2937] rounded-2xl shadow-xl p-8 md:p-10 space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-widest text-[#f89422]">
            {t.studentPortal.navLabel}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {t.studentPortal.login.title}
          </h1>
          <p className="text-gray-300 leading-relaxed">
            {t.studentPortal.login.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200" htmlFor="card-number">
              {t.studentPortal.login.cardNumber}
            </label>
            <input
              id="card-number"
              type="text"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
              required
              className="w-full rounded-lg border border-[#1f2937] bg-black px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f89422]"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200" htmlFor="password">
              {t.studentPortal.login.password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-[#1f2937] bg-black px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f89422]"
              autoComplete="current-password"
            />
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gradient-to-r from-[#0d6efd] to-[#f89422] px-4 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (language === "fr" ? "Connexion..." : "Signing in...") : t.studentPortal.login.submit}
          </button>
        </form>

        <p className="text-xs text-gray-400 leading-relaxed">
          {t.studentPortal.login.hints}
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
