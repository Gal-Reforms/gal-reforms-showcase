import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Calendar, ArrowRight, AlertCircle, Eye, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjects, type Project } from "@/hooks/useProjects";
import { LazyImage } from "@/components/ui/LazyImage";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useStaggeredReveal } from "@/hooks/useScrollReveal";
import { t } from "@/lib/translations";

// Fallback project data for when Supabase is empty
const fallbackProjects = [
  {
    id: "fallback-1",
    title: "Reforma Completa - Apartamento Moderno",
    slug: "reforma-apartamento-moderno-fallback",
    category: "Reforma Residencial",
    location: "Barcelona, Espanha",
    description: "Transformação completa de apartamento de 120m² com design contemporâneo, utilizando materiais premium e acabamentos de luxo.",
    cover_image: "/src/assets/project-1.jpg",
    completion_date: "2024-01-15",
    client: "Família Rodriguez",
    budget_range: "€80.000 - €100.000",
    features: ["Cozinha integrada", "Banheiro com banheira", "Closet personalizado", "Iluminação LED"],
    materials: { pisos: "Parquet de carvalho", cozinha: "Mármore Carrara", banheiros: "Porcelanato importado" },
    images: [],
    beforeImages: [],
    afterImages: [],
    galleryImages: [
      { id: "g1", image_url: "/src/assets/project-1.jpg", image_type: "gallery" as const, order_index: 1, caption: "Vista geral do projeto" }
    ]
  },
  {
    id: "fallback-2", 
    title: "Construção Nova - Casa Mediterrânea",
    slug: "construcao-casa-mediterranea-fallback",
    category: "Construção Nova",
    location: "Costa Brava, Espanha",
    description: "Casa de luxo com 300m² inspirada na arquitetura mediterrânea, com piscina infinita e vista para o mar.",
    cover_image: "/src/assets/project-2.jpg",
    completion_date: "2023-11-20",
    client: "Sr. Martinez", 
    budget_range: "€300.000 - €400.000",
    features: ["Piscina infinita", "Terraço panorâmico", "Garagem dupla", "Sistema domótica"],
    materials: { exterior: "Pedra natural", interior: "Mármore travertino", cobertura: "Telha cerâmica" },
    images: [],
    beforeImages: [],
    afterImages: [],
    galleryImages: [
      { id: "g2", image_url: "/src/assets/project-2.jpg", image_type: "gallery" as const, order_index: 1, caption: "Fachada principal" }
    ]
  }
] as Project[];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const navigate = useNavigate();
  const { data: supabaseProjects, isLoading, error } = useProjects();

  // Use Supabase projects if available, otherwise fallback
  const projects = supabaseProjects && supabaseProjects.length > 0 ? supabaseProjects : fallbackProjects;

  const categories = ["Todos", "Reforma Residencial", "Construção Nova", "Reforma Comercial"];
  
  const filteredProjects = selectedCategory === "Todos" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const viewProjectDetails = (project: Project) => {
    navigate(`/projeto/${project.slug}`);
  };

  const [staggerRef, visibleItems] = useStaggeredReveal(filteredProjects.length, 200);

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-in-up">
          <div className="text-center mb-16">
            <h2 className="text-display text-foreground mb-4">
              {t('ourProjects')}
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Descubre algunos de nuestros trabajos más representativos. Cada proyecto es único y refleja nuestro compromiso con la excelencia y calidad.
            </p>
          </div>
        </AnimatedSection>

        {/* Category Filter */}
        <AnimatedSection animation="fade-in-up" delay={200}>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="hover-scale stagger-item transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {category}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{t('loadingProjects')}</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{t('errorLoadingProjects')}</p>
          </div>
        )}

        {/* Projects Grid */}
        <div ref={staggerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className={`group hover-lift overflow-hidden border-0 shadow-soft hover:shadow-gold transition-all duration-500 ${
                visibleItems[index] 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <LazyImage
                  src={project.cover_image || '/placeholder-project.jpg'}
                  alt={project.title}
                  className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                  quality="medium"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground animate-fade-in-right">
                  {project.category}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                  <Calendar className="w-4 h-4 ml-4" />
                  <span>{project.year}</span>
                </div>
                
                <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </CardTitle>
                
                <CardDescription className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                  {project.description}
                </CardDescription>

                <Button 
                  onClick={() => viewProjectDetails(project)}
                  className="w-full group bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-glow"
                >
                  <div className="flex items-center justify-center">
                    <Eye className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                    {t('viewDetails')}
                  </div>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('noProjectsFound')}</p>
          </div>
        )}

        {/* Call to Action */}
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
              onClick={scrollToContact}
              className="bg-primary text-primary-foreground hover:bg-primary-dark hover-glow shadow-gold transition-all duration-300 transform hover:scale-105"
            >
              <Wrench className="w-5 h-5 mr-2 animate-float" />
              {t('requestQuote')}
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
);
};

export default Projects;