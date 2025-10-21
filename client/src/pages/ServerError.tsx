import { ServerCrash, RefreshCw, Home, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../contexts/TranslationContext";
import { Link } from "wouter";

export default function ServerError() {
  const { t } = useTranslation();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <ServerCrash className="h-24 w-24 text-[#f89422] mx-auto" />
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-[#3b82f6] mb-2">500</h1>
          <h2 className="text-2xl font-semibold text-[#f89422] mb-2">
            {t.errors[500].title}
          </h2>
          <p className="text-lg text-[#f89422]/80">
            {t.errors[500].subtitle}
          </p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-white/80 leading-relaxed">
            {t.errors[500].description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleRetry}
            className="w-full bg-[#f89422] hover:bg-[#f89422]/90 text-black font-semibold py-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t.errors[500].retry}
          </Button>
          
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white"
              aria-label={t.errors[500].backHome}
            >
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          
          <Link href="/contact">
            <Button 
              variant="outline" 
              className="w-full border-[#f89422]/50 text-[#f89422] hover:bg-[#f89422] hover:text-black"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t.errors[500].contact}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}