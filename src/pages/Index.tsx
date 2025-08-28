import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useSEO } from "@/hooks/useSEO";
import { OrganizationSchema, ServiceSchema } from "@/components/seo/StructuredData";
<<<<<<< HEAD
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { WebsiteSchema } from "@/components/seo/WebsiteSchema";
=======
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
import { injectCriticalCSS } from "@/components/seo/PerformanceOptimizer";

const Index = () => {
  const location = useLocation();

<<<<<<< HEAD
    // SEO optimization for homepage
    useSEO({
      title: 'Gal Reformas S.L - Construcción y Reformas de Excelencia',
      description: 'Empresa especializada en construcción y reformas con más de 15 años de experiencia. Calidad premium, diseño sofisticado y acabados impecables en Madrid y región.',
      keywords: 'construcción, reformas, Madrid, España, arquitectura, diseño, obras, renovación, reformas integrales, cocinas, baños',
      image: `${window.location.origin}/lovable-uploads/716cbf54-69ef-47e4-95a7-ec95811b8e9c.png`,
      url: window.location.href,
      type: 'website',
      author: 'Gal Reformas S.L'
    });
=======
  // SEO optimization for homepage
  useSEO({
    title: 'Gal Reforms S.L - Construcción y Reformas de Excelencia en Madrid',
    description: 'Empresa especializada en construcción y reformas con más de 15 años de experiencia. Calidad premium, diseño sofisticado y acabados impecables en Madrid y región.',
    keywords: 'construcción, reformas, Madrid, España, arquitectura, diseño, obras, renovación, reformas integrales, cocinas, baños',
    image: `${window.location.origin}/lovable-uploads/716cbf54-69ef-47e4-95a7-ec95811b8e9c.png`,
    url: window.location.href,
    type: 'website',
    author: 'Gal Reforms S.L'
  });
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196

  // Inject critical CSS for performance
  useEffect(() => {
    injectCriticalCSS();
  }, []);

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1); // Remove the # 
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Structured Data */}
<<<<<<< HEAD
      <WebsiteSchema />
      <LocalBusinessSchema />
=======
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
      <OrganizationSchema />
      <ServiceSchema />
      
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
