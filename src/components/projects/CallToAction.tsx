import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { t } from "@/lib/translations";

interface CallToActionProps {
  onContactClick: () => void;
}

export const CallToAction = ({ onContactClick }: CallToActionProps) => {
  return (
    <AnimatedSection animation="scale-in" delay={400}>
      <div className="mt-20 text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-12 hover-lift">
        <h3 className="text-2xl font-bold mb-4 text-gradient-gold">
          ¿Tienes un proyecto en mente?
        </h3>
        <p className="text-body-large text-foreground/80 mb-6 max-w-2xl mx-auto">
          Contáctanos y descubre cómo podemos transformar tus ideas en realidad.
        </p>
        <Button 
          variant="default" 
          size="lg"
          onClick={onContactClick}
          className="bg-primary text-primary-foreground hover:bg-primary-dark hover-glow shadow-gold transition-all duration-300 transform hover:scale-105"
        >
          <Wrench className="w-5 h-5 mr-2 animate-float" />
          {t('requestQuote')}
        </Button>
      </div>
    </AnimatedSection>
  );
};