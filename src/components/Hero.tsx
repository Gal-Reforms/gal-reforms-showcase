import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Award, Users, Clock } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { t } from "@/lib/translations";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: hero1,
      title: "Construção de Excelência",
      subtitle: "Transformamos seus sonhos em realidade com qualidade superior"
    },
    {
      image: hero2,
      title: "Reformas Elegantes",
      subtitle: "Renovamos ambientes com design sofisticado e funcionalidade"
    },
    {
      image: hero3,
      title: "Acabamentos Premium",
      subtitle: "Detalhes que fazem a diferença em cada projeto"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Image Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl text-white">
            <div className="animate-fade-in">
              <h1 className="text-hero font-serif mb-6">
                {slides[currentSlide].title}
              </h1>
              <p className="text-subtitle mb-8 max-w-2xl opacity-90">
                {slides[currentSlide].subtitle}
              </p>
              
                <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold text-lg px-8 py-6 hover-glow transition-all duration-300 transform hover:scale-105"
                    onClick={() => scrollToSection("contact")}
                  >
                    {t('requestQuote')}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-foreground text-lg px-8 py-6 backdrop-blur-sm bg-white/10 transition-all duration-300 transform hover:scale-105"
                    onClick={() => scrollToSection("projects")}
                  >
                    {t('viewProjects')}
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection animation="fade-in-up" delay={600}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="flex items-center space-x-3 stagger-item backdrop-blur-sm bg-white/10 rounded-lg p-4 hover-scale">
                  <Award className="w-8 h-8 text-primary animate-float" />
                  <div>
                    <div className="text-2xl font-bold">15+</div>
                    <div className="text-sm opacity-80">{t('yearsExperience')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 stagger-item backdrop-blur-sm bg-white/10 rounded-lg p-4 hover-scale">
                  <Users className="w-8 h-8 text-primary animate-float" style={{ animationDelay: '1s' }} />
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm opacity-80">{t('projectsCompleted')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 stagger-item backdrop-blur-sm bg-white/10 rounded-lg p-4 hover-scale">
                  <Clock className="w-8 h-8 text-primary animate-float" style={{ animationDelay: '2s' }} />
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm opacity-80">{t('satisfactionGuaranteed')}</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-primary scale-125" : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;