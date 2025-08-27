import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Wrench } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";
import { t } from "@/lib/translations";

const About = () => {
  const features = [
    {
      icon: Star,
      title: "Calidad Premium",
      description: "Utilizamos solo materiales de primera línea y técnicas avanzadas de construcción."
    },
    {
      icon: Shield,
      title: "Garantía Total",
      description: "Todos nuestros trabajos cuentan con garantía completa y soporte post-obra."
    },
    {
      icon: Wrench,
      title: "Equipo Especializado",
      description: "Profesionales cualificados con años de experiencia en construcción y reforma."
    }
  ];

  const achievements = [
    "Más de 15 años en el mercado español",
    "Equipo técnico certificado y experimentado",
    "Proyectos personalizados y únicos",
    "Uso de tecnología moderna en la construcción",
    "Atención personalizada de principio a fin",
    "Plazos cumplidos rigurosamente"
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
              {t('about')} <span className="text-gold-gradient">{t('aboutGalReforms')}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t('aboutDescription')}
            </p>
            
            <div className="space-y-4 mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground">{achievement}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold"
              onClick={() => scrollToSection("contact")}
            >
              {t('contactUs')}
            </Button>
          </div>

          {/* Image */}
          <div className="animate-scale-in">
            <div className="relative">
              <img
                src={aboutTeam}
                alt="Equipe Gal Reforms"
                className="rounded-2xl shadow-elegant w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <Card key={index} className="hover-lift bg-background border-border animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;