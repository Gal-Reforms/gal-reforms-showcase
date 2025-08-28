import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Wrench } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";
import { LazyImage } from "@/components/ui/LazyImage";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useStaggeredReveal } from "@/hooks/useScrollReveal";
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

  const [staggerRef, visibleItems] = useStaggeredReveal(achievements.length, 150);

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
<<<<<<< HEAD
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <AnimatedSection animation="fade-in-right">
            <h2 className="text-display text-foreground mb-4 md:mb-6 leading-tight">
              {t('about')} <span className="text-gradient-gold">{t('aboutGalReforms')}</span>
            </h2>
            <p className="text-body-large text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              {t('aboutDescription')}
            </p>
            
            <div ref={staggerRef} className="space-y-3 md:space-y-4 mb-6 md:mb-8">
=======
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <AnimatedSection animation="fade-in-right">
            <h2 className="text-display text-foreground mb-6">
              {t('about')} <span className="text-gradient-gold">{t('aboutGalReforms')}</span>
            </h2>
            <p className="text-body-large text-muted-foreground mb-8 leading-relaxed">
              {t('aboutDescription')}
            </p>
            
            <div ref={staggerRef} className="space-y-4 mb-8">
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-3 transition-all duration-500 ${
                    visibleItems[index] 
                      ? 'opacity-100 transform translate-x-0' 
                      : 'opacity-0 transform translate-x-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
<<<<<<< HEAD
                  <CheckCircle className="w-4 md:w-5 h-4 md:h-5 text-primary mt-1 flex-shrink-0 animate-bounce-in" 
                               style={{ animationDelay: `${(index * 150) + 300}ms` }} />
                  <span className="text-foreground text-sm md:text-base leading-relaxed">{achievement}</span>
=======
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0 animate-bounce-in" 
                               style={{ animationDelay: `${(index * 150) + 300}ms` }} />
                  <span className="text-foreground">{achievement}</span>
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold hover-glow transform transition-all duration-300 hover:scale-105"
              onClick={() => scrollToSection("contact")}
            >
              {t('contactUs')}
            </Button>
          </AnimatedSection>

          {/* Image */}
          <AnimatedSection animation="fade-in-left" delay={200}>
<<<<<<< HEAD
            <div className="relative group order-first lg:order-last">
              <LazyImage
                src={aboutTeam}
                alt="Equipo Gal Reforms"
                className="rounded-2xl shadow-elegant w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
=======
            <div className="relative group">
              <LazyImage
                src={aboutTeam}
                alt="Equipo Gal Reforms"
                className="rounded-2xl shadow-elegant w-full h-[500px] transition-transform duration-500 group-hover:scale-105"
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                quality="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl" />
            </div>
          </AnimatedSection>
        </div>

        {/* Features Grid */}
<<<<<<< HEAD
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-20">
          {features.map((feature, index) => (
            <Card key={index} className="hover-lift bg-background border-border animate-fade-in">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <feature.icon className="w-6 md:w-8 h-6 md:h-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-semibold mb-3 md:mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
=======
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
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
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