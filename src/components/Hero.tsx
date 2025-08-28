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
      title: t('heroTitle1'),
      subtitle: t('heroSubtitle1')
    },
    {
      image: hero2,
      title: t('heroTitle2'),
      subtitle: t('heroSubtitle2')
    },
    {
      image: hero3,
      title: t('heroTitle3'),
      subtitle: t('heroSubtitle3')
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
              <AnimatedSection animation="fade-in-up" delay={0}>
<<<<<<< HEAD
                <h1 className="text-hero font-serif mb-4 md:mb-6 leading-tight">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-subtitle mb-6 md:mb-8 max-w-2xl opacity-90 leading-relaxed">
                  {slides[currentSlide].subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 md:mb-12 animate-fade-in-up">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover-glow transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
=======
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
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                    onClick={() => scrollToSection("contact")}
                  >
                    {t('requestQuote')}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
<<<<<<< HEAD
                    className="border-2 border-white text-white hover:bg-white hover:text-foreground text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 backdrop-blur-sm bg-white/10 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
=======
                    className="border-2 border-white text-white hover:bg-white hover:text-foreground text-lg px-8 py-6 backdrop-blur-sm bg-white/10 transition-all duration-300 transform hover:scale-105"
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                    onClick={() => scrollToSection("projects")}
                  >
                    {t('viewProjects')}
                  </Button>
                </div>
              </AnimatedSection>

            {/* Stats */}
            <AnimatedSection animation="fade-in-up" delay={600}>
<<<<<<< HEAD
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto">
                <div className="flex items-center space-x-3 stagger-item backdrop-blur-sm bg-white/10 rounded-lg p-3 sm:p-4 hover-scale">
                  <Award className="w-6 sm:w-8 h-6 sm:h-8 text-primary animate-float flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold">15+</div>
                    <div className="text-xs sm:text-sm opacity-80 leading-tight">{t('yearsExperience')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 stagger-item backdrop-blur-sm bg-white/10 rounded-lg p-3 sm:p-4 hover-scale">
                  <Users className="w-6 sm:w-8 h-6 sm:h-8 text-primary animate-float flex-shrink-0" style={{ animationDelay: '1s' }} />
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold">500+</div>
                    <div className="text-xs sm:text-sm opacity-80 leading-tight">{t('projectsCompleted')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 stagger-item backdrop-blur-sm bg-white/10 rounded-lg p-3 sm:p-4 hover-scale">
                  <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-primary animate-float flex-shrink-0" style={{ animationDelay: '2s' }} />
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold">100%</div>
                    <div className="text-xs sm:text-sm opacity-80 leading-tight">{t('satisfactionGuaranteed')}</div>
=======
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
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
<<<<<<< HEAD
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all shadow-lg"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="w-4 md:w-6 h-4 md:h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all shadow-lg"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="w-4 md:w-6 h-4 md:h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2 md:space-x-3">
=======
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
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
<<<<<<< HEAD
            className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-primary scale-125" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
=======
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-primary scale-125" : "bg-white/50 hover:bg-white/70"
            }`}
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;