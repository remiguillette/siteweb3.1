import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TranslationProvider } from "./contexts/TranslationContext";
import { Layout } from "./components/Layout";
import { LoadingPage } from "./components/LoadingPage";
import Home from "./pages/Home";
import Divisions from "./pages/Divisions";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import PublicSafety from "./pages/PublicSafety";
import FrancophoneServices from "./pages/FrancophoneServices";
import HealthSafety from "./pages/HealthSafety";
import AnimalFirstAid from "./pages/AnimalFirstAid";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/divisions" component={Divisions} />
        <Route path="/services" component={Services} />
        <Route path="/contact" component={Contact} />
        <Route path="/public-safety" component={PublicSafety} />
        <Route path="/francophone-services" component={FrancophoneServices} />
        <Route path="/health-safety" component={HealthSafety} />
        <Route path="/animal-first-aid" component={AnimalFirstAid} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/politique-confidentialite" component={PrivacyPolicy} />
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TranslationProvider>
          <Toaster />
          {isLoading ? (
            <LoadingPage onLoadingComplete={handleLoadingComplete} />
          ) : (
            <Router />
          )}
        </TranslationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
