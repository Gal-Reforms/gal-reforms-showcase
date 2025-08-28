import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cn } from "@/lib/utils";

export const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: siteSettings } = useSiteSettings();
  
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg",
      "animate-in slide-in-from-bottom duration-300"
    )}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            <p className="mb-2">
              Este site utiliza cookies para melhorar sua experiência de navegação e fornecer funcionalidades personalizadas.
            </p>
            <p>
              Ao continuar navegando, você concorda com o uso de cookies conforme nossa{" "}
              <a 
                href={siteSettings?.privacy_policy_url || "/politica-de-privacidade"} 
                className="text-primary hover:text-primary/80 underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidade
              </a>
              {" "}e{" "}
              <a 
                href={siteSettings?.terms_of_service_url || "/termos-de-servico"} 
                className="text-primary hover:text-primary/80 underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Termos de Serviço
              </a>
              .
            </p>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDecline}
              className="text-xs"
            >
              Recusar
            </Button>
            <Button 
              size="sm" 
              onClick={handleAccept}
              className="text-xs"
            >
              Aceitar Cookies
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleDecline}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};