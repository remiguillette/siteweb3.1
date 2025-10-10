import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TranslationProvider } from "./contexts/TranslationContext";
import { Layout } from "./components/Layout";
import { LoadingPage } from "./components/LoadingPage";
import { CookieConsent } from "./components/CookieConsent";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Home from "./pages/Home";
import ActivitySectors from "./pages/ActivitySectors";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import PublicSafety from "./pages/PublicSafety";
import FrancophoneServices from "./pages/FrancophoneServices";
import HealthSafety from "./pages/HealthSafety";
import AnimalFirstAid from "./pages/AnimalFirstAid";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "@/pages/not-found";
import ServerError from "./pages/ServerError";
import ErrorTest from "./pages/ErrorTest";
import { useState } from "react";
import Learn from "./pages/Learn";
import StudentLogin from "./pages/StudentLogin";
import StudentPasswordReset from "./pages/StudentPasswordReset";
import StudentPortal from "./pages/StudentPortal";
import SecureCard from "./pages/Card";


function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/secteurs-activite" component={ActivitySectors} />
        <Route path="/services" component={Services} />
        <Route path="/learn" component={Learn} />
        <Route path="/apprendre" component={Learn} />
        <Route path="/student/login" component={StudentLogin} />
        <Route path="/etudiant/connexion" component={StudentLogin} />
        <Route path="/student/change-password" component={StudentPasswordReset} />
        <Route path="/etudiant/mot-de-passe" component={StudentPasswordReset} />
        <Route path="/student/portal" component={StudentPortal} />
        <Route path="/etudiant/portail" component={StudentPortal} />
        <Route path="/card" component={SecureCard} />

        <Route path="/contact" component={Contact} />
        <Route path="/public-safety" component={PublicSafety} />
        <Route path="/francophone-services" component={FrancophoneServices} />
        <Route path="/health-safety" component={HealthSafety} />
        <Route path="/animal-first-aid" component={AnimalFirstAid} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/politique-confidentialite" component={PrivacyPolicy} />
        {/* Error pages for testing */}
        <Route path="/test-404" component={NotFound} />
        <Route path="/test-500" component={ServerError} />
        <Route path="/error-test" component={ErrorTest} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <TranslationProvider>
            <Toaster />
            <CookieConsent />
            {isLoading ? (
              <LoadingPage onLoadingComplete={handleLoadingComplete} />
            ) : (
              <Router />
            )}
          </TranslationProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
