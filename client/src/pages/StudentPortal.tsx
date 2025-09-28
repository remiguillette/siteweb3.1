import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "@/contexts/TranslationContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useToast } from "@/hooks/use-toast";
import {
  clearStudentSession,
  getStudentSession,
  StudentSession,
} from "@/lib/studentSession";
import type {
  StudentCourseSummary,
  StudentDashboardData,
  StudentCourseRequestSummary,
} from "@/types/studentPortal";

const StudentPortal = () => {
  useScrollToTop();
  const { t, language } = useTranslation();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [session, setSession] = useState<StudentSession | null>(() => getStudentSession());
  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginPath = useMemo(
    () => (language === "fr" ? "/etudiant/connexion" : "/student/login"),
    [language],
  );

  const changePasswordPath = useMemo(
    () => (language === "fr" ? "/etudiant/mot-de-passe" : "/student/change-password"),
    [language],
  );

  const handleUnauthorized = useCallback(() => {
    clearStudentSession();
    setSession(null);
    setDashboard(null);
    toast({
      title: t.studentPortal.navLabel,
      description: t.studentPortal.dashboard.messages.unauthorized,
      variant: "destructive",
    });
    navigate(loginPath);
  }, [loginPath, navigate, t.studentPortal.dashboard.messages.unauthorized, t.studentPortal.navLabel, toast]);

  const formatCurrency = useCallback(
    (priceCents: number) =>
      new Intl.NumberFormat(language === "fr" ? "fr-CA" : "en-CA", {
        style: "currency",
        currency: "CAD",
      }).format(priceCents / 100),
    [language],
  );

  const getStatusLabel = useCallback(
    (status: string) => {
      const labels = t.studentPortal.dashboard.statusLabels;
      switch (status) {
        case "in-progress":
          return labels.inProgress;
        case "completed":
          return labels.completed;
        case "pending":
          return labels.pending;
        default:
          return labels.active;
      }
    },
    [t.studentPortal.dashboard.statusLabels],
  );

  const fetchDashboard = useCallback(async () => {
    if (!session) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/student/dashboard", {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? t.studentPortal.login.errors.server);
        return;
      }

      setDashboard(data.data);
    } catch (error) {
      console.error("Failed to load student dashboard", error);
      setErrorMessage(t.studentPortal.login.errors.server);
    } finally {
      setIsLoading(false);
    }
  }, [handleUnauthorized, session, t.studentPortal.login.errors.server]);

  useEffect(() => {
    if (!session) {
      navigate(loginPath);
      return;
    }
    fetchDashboard();
  }, [fetchDashboard, loginPath, navigate, session]);

  const handleRequestCourse = useCallback(
    async (courseId: number) => {
      if (!session) {
        return;
      }

      try {
        const response = await fetch("/api/student/store/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ courseId }),
        });

        const data = await response.json();

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          if (data.errorCode === "course_already_enrolled") {
            toast({
              title: t.studentPortal.dashboard.sections.pendingRequests,
              description: t.studentPortal.dashboard.messages.alreadyRequested,
            });
            return;
          }

          setErrorMessage(data.error ?? t.studentPortal.login.errors.server);
          return;
        }

        if (data.dashboard) {
          setDashboard(data.dashboard);
        }

        toast({
          title: t.studentPortal.dashboard.sections.pendingRequests,
          description: t.studentPortal.dashboard.messages.requestSuccess,
        });
      } catch (error) {
        console.error("Failed to request student course", error);
        setErrorMessage(t.studentPortal.login.errors.server);
      }
    },
    [handleUnauthorized, session, t.studentPortal.dashboard.messages.alreadyRequested, t.studentPortal.dashboard.messages.requestSuccess, t.studentPortal.dashboard.sections.pendingRequests, t.studentPortal.login.errors.server, toast],
  );

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col gap-4 rounded-2xl border border-[#1f2937] bg-[#0d1117] p-6 md:p-8 shadow-xl">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-widest text-[#f89422]">
              {t.studentPortal.dashboard.title}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {dashboard
                ? t.studentPortal.dashboard.welcome.replace(
                    "{{name}}",
                    `${dashboard.student.firstName} ${dashboard.student.lastName}`,
                  )
                : t.studentPortal.dashboard.title}
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl">
              {t.studentPortal.login.hints}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(changePasswordPath)}
              className="rounded-lg border border-[#f89422]/60 px-4 py-2 text-sm font-semibold text-[#f89422] transition-colors hover:bg-[#f89422]/10"
            >
              {t.studentPortal.dashboard.actions.changePassword}
            </button>
            <button
              onClick={fetchDashboard}
              className="rounded-lg bg-gradient-to-r from-[#0d6efd] to-[#f89422] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              {t.studentPortal.dashboard.actions.refresh}
            </button>
          </div>
        </header>

        {errorMessage && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-4 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-xl border border-[#1f2937] bg-[#0d1117] p-10 text-center text-gray-300">
            {language === "fr" ? "Chargement du portail étudiant..." : "Loading student portal..."}
          </div>
        ) : (
          <div className="space-y-10">
            {dashboard && (
              <>
                <section className="rounded-2xl border border-[#1f2937] bg-[#0d1117] p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    {t.studentPortal.dashboard.sections.studentInfo}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-200">
                    <div>
                      <p className="uppercase text-xs tracking-widest text-[#f89422]">
                        {t.studentPortal.dashboard.infoLabels.cardNumber}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {dashboard.student.cardNumber}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase text-xs tracking-widest text-[#f89422]">
                        {t.studentPortal.dashboard.infoLabels.email}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {dashboard.student.email}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase text-xs tracking-widest text-[#f89422]">
                        {t.studentPortal.dashboard.infoLabels.phone}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {dashboard.student.phoneNumber || (language === "fr" ? "Non fourni" : "Not provided")}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase text-xs tracking-widest text-[#f89422]">
                        {t.studentPortal.dashboard.infoLabels.address}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {dashboard.student.address || (language === "fr" ? "Non fournie" : "Not provided")}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CourseSection
                    title={t.studentPortal.dashboard.sections.activeCourses}
                    emptyMessage={t.studentPortal.dashboard.empty.active}
                    courses={dashboard.activeCourses}
                    getStatusLabel={getStatusLabel}
                    formatCurrency={formatCurrency}
                  />
                  <CourseSection
                    title={t.studentPortal.dashboard.sections.inProgress}
                    emptyMessage={t.studentPortal.dashboard.empty.inProgress}
                    courses={dashboard.inProgressCourses}
                    getStatusLabel={getStatusLabel}
                    formatCurrency={formatCurrency}
                  />
                  <CourseSection
                    title={t.studentPortal.dashboard.sections.completedCourses}
                    emptyMessage={t.studentPortal.dashboard.empty.completed}
                    courses={dashboard.completedCourses}
                    getStatusLabel={getStatusLabel}
                    formatCurrency={formatCurrency}
                  />
                  <RequestSection
                    title={t.studentPortal.dashboard.sections.pendingRequests}
                    emptyMessage={t.studentPortal.dashboard.empty.pending}
                    requests={dashboard.pendingRequests}
                    formatCurrency={formatCurrency}
                    language={language}
                    getStatusLabel={getStatusLabel}
                  />
                </section>

                <section className="rounded-2xl border border-[#1f2937] bg-[#0d1117] p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    {t.studentPortal.dashboard.sections.store}
                  </h2>
                  {dashboard.store.length === 0 ? (
                    <p className="text-sm text-gray-300">
                      {t.studentPortal.dashboard.empty.store}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {dashboard.store.map((course) => (
                        <div
                          key={course.id}
                          className="flex h-full flex-col justify-between rounded-xl border border-[#1f2937] bg-black/60 p-6"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-semibold text-white">
                                {course.title}
                              </h3>
                              <span className="rounded-full bg-[#f89422]/20 px-3 py-1 text-sm font-semibold text-[#f89422]">
                                {formatCurrency(course.priceCents)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {course.description}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRequestCourse(course.id)}
                            className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#0d6efd] to-[#f89422] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                          >
                            {t.studentPortal.dashboard.actions.requestCourse}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface CourseSectionProps {
  title: string;
  emptyMessage: string;
  courses: StudentCourseSummary[];
  getStatusLabel: (status: string) => string;
  formatCurrency: (value: number) => string;
}

const CourseSection = ({ title, emptyMessage, courses, getStatusLabel, formatCurrency }: CourseSectionProps) => (
  <div className="rounded-2xl border border-[#1f2937] bg-[#0d1117] p-6 md:p-8 space-y-4">
    <h2 className="text-2xl font-semibold text-white">{title}</h2>
    {courses.length === 0 ? (
      <p className="text-sm text-gray-300">{emptyMessage}</p>
    ) : (
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="rounded-xl border border-[#1f2937] bg-black/60 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{course.description}</p>
              </div>
              <div className="text-right">
                <span className="inline-block rounded-full bg-[#f89422]/20 px-3 py-1 text-xs font-semibold text-[#f89422]">
                  {getStatusLabel(course.status)}
                </span>
                <p className="mt-2 text-sm text-gray-400">{formatCurrency(course.priceCents)}</p>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-[#1f2937]">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#0d6efd] to-[#f89422]"
                style={{ width: `${Math.min(course.progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400">
              {new Date(course.updatedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

interface RequestSectionProps {
  title: string;
  emptyMessage: string;
  requests: StudentCourseRequestSummary[];
  formatCurrency: (value: number) => string;
  language: string;
  getStatusLabel: (status: string) => string;
}

const RequestSection = ({
  title,
  emptyMessage,
  requests,
  formatCurrency,
  language,
  getStatusLabel,
}: RequestSectionProps) => (
  <div className="rounded-2xl border border-[#1f2937] bg-[#0d1117] p-6 md:p-8 space-y-4">
    <h2 className="text-2xl font-semibold text-white">{title}</h2>
    {requests.length === 0 ? (
      <p className="text-sm text-gray-300">{emptyMessage}</p>
    ) : (
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-xl border border-[#1f2937] bg-black/60 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{request.courseTitle}</h3>
                <p className="text-sm text-gray-300 mt-1">{formatCurrency(request.priceCents)}</p>
              </div>
              <span className="inline-block rounded-full bg-[#f89422]/20 px-3 py-1 text-xs font-semibold text-[#f89422]">
                {getStatusLabel(request.status)}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {new Date(request.createdAt).toLocaleString(language === "fr" ? "fr-CA" : "en-CA", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default StudentPortal;
