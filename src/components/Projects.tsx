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

// Using only real projects from database

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const navigate = useNavigate();
  const { data: supabaseProjects, isLoading, error } = useProjects();

  // Use only real projects from database
  const projects = supabaseProjects || [];

  const categories = ["Todos", "Reforma Residencial", "Construção Nova", "Reforma Comercial"];
  
  const filteredProjects = selectedCategory === "Todos" 
    ? projects 
    : projects.filter(project => {
        // Handle both Spanish and Portuguese categories for compatibility
        const categoryMatch = project.category === selectedCategory || 
          (selectedCategory === "Reforma Residencial" && project.category === "Reforma Residencial") ||
          (selectedCategory === "Construção Nova" && project.category === "Construção Nova") ||
          (selectedCategory === "Reforma Comercial" && project.category === "Reforma Comercial");
        return categoryMatch;
      });

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const viewProjectDetails = (project: Project) => {
    navigate(`/proyecto/${project.slug}`);
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

        {/* Error State with better error handling */}
        {error && !isLoading && (
          <AnimatedSection animation="fade-in-up">
            <div className="text-center py-12">
              <div className="mb-4">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Error al cargar proyectos de la base de datos
                </h3>
                <p className="text-muted-foreground mb-4">
                  Mostrando proyectos de ejemplo mientras solucionamos el problema.
                </p>
              </div>
            </div>
          </AnimatedSection>
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
                  <span>{new Date(project.completion_date || project.created_at).getFullYear()}</span>
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
          <AnimatedSection animation="fade-in-up">
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedCategory === "Todos" 
                    ? "Ainda não há projetos criados. Entre na área administrativa para criar seu primeiro projeto." 
                    : `Não há projetos na categoria "${selectedCategory}". Tente selecionar outra categoria.`}
                </p>
                {selectedCategory === "Todos" && (
                  <Button 
                    variant="outline" 
                    onClick={scrollToContact}
                    className="hover-glow"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Entrar em Contato
                  </Button>
                )}
              </div>
            </div>
          </AnimatedSection>
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