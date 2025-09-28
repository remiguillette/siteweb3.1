import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "@/contexts/TranslationContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useToast } from "@/hooks/use-toast";
import {
  getStudentSession,
  setStudentSession,
  clearStudentSession,
  updateStudentSessionStudent,
} from "@/lib/studentSession";

const StudentPasswordReset = () => {
  useScrollToTop();
  const { t, language } = useTranslation();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const session = useMemo(() => getStudentSession(), []);

  useEffect(() => {
    if (!session) {
      navigate(language === "fr" ? "/etudiant/connexion" : "/student/login");
      return;
    }
  }, [language, navigate, session]);

  const validatePasswordStrength = (password: string) => {
    const hasUppercase = /[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= 8 && hasUppercase && hasNumber;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    if (!validatePasswordStrength(newPassword)) {
      setErrorMessage(t.studentPortal.changePassword.errors.weakPassword);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/student/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errors = t.studentPortal.changePassword.errors;
        const errorMap: Record<string, string> = {
          missing_fields: errors.missingFields,
          mismatch: errors.mismatch,
          weak_password: errors.weakPassword,
          invalid_current_password: errors.invalidCurrentPassword,
          password_reused: errors.reused,
          update_failed: errors.server,
          unauthorized: t.studentPortal.dashboard.messages.unauthorized,
        };
        const message = errorMap[data.errorCode as string] || errors.server;

        if (data.errorCode === "unauthorized") {
          clearStudentSession();
          navigate(language === "fr" ? "/etudiant/connexion" : "/student/login");
        }

        setErrorMessage(message);
        return;
      }

      const updatedSession = {
        token: data.sessionToken,
        student: data.student,
      };
      setStudentSession(updatedSession);
      updateStudentSessionStudent({ requiresPasswordChange: false });

      toast({
        title: t.studentPortal.changePassword.title,
        description: t.studentPortal.changePassword.success,
      });

      navigate(language === "fr" ? "/etudiant/portail" : "/student/portal");
    } catch (error) {
      console.error("Failed to update student password", error);
      setErrorMessage(t.studentPortal.changePassword.errors.server);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 py-16 px-4">
      <div className="max-w-2xl mx-auto bg-[#0d1117] border border-[#1f2937] rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-widest text-[#f89422]">
            {t.studentPortal.navLabel}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {t.studentPortal.changePassword.title}
          </h1>
          <p className="text-gray-300 leading-relaxed">
            {t.studentPortal.changePassword.subtitle}
          </p>
        </div>

        <div className="rounded-xl border border-[#1f2937] bg-black/60 p-6">
          <h2 className="text-sm font-semibold text-[#f89422] uppercase tracking-wider mb-3">
            {language === "fr" ? "Exigences" : "Requirements"}
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            {t.studentPortal.changePassword.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200" htmlFor="current-password">
              {t.studentPortal.changePassword.currentPassword}
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-[#1f2937] bg-black px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f89422]"
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200" htmlFor="new-password">
              {t.studentPortal.changePassword.newPassword}
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-[#1f2937] bg-black px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f89422]"
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200" htmlFor="confirm-password">
              {t.studentPortal.changePassword.confirmPassword}
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-[#1f2937] bg-black px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f89422]"
              autoComplete="new-password"
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
            {isLoading ? (language === "fr" ? "Mise à jour..." : "Updating...") : t.studentPortal.changePassword.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentPasswordReset;
