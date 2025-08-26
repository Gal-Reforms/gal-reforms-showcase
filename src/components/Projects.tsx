import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, Wrench, Eye, Loader2 } from "lucide-react";
import { useProjects, Project } from "@/hooks/useProjects";
import { ProjectModal } from "./projects/ProjectModal";

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { data: supabaseProjects, isLoading, error } = useProjects();

  // Use Supabase projects if available, otherwise fallback
  const projects = supabaseProjects && supabaseProjects.length > 0 ? supabaseProjects : fallbackProjects;

  const categories = ["Todos", "Reforma Residencial", "Construção Nova", "Reforma Comercial"];
  
  const filteredProjects = selectedCategory === "Todos" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  // Check for project in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectSlug = urlParams.get('project');
    if (projectSlug && projects.length > 0) {
      const project = projects.find(p => p.slug === projectSlug);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [projects]);

  const scrollToContact = () => {
    setSelectedProject(null);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Os Nossos Projetos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra alguns dos nossos trabalhos mais representativos. Cada projeto é único e reflete o nosso compromisso com a excelência e qualidade.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="hover-scale"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Carregando projetos...</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Erro ao carregar projetos da base de dados. Mostrando projetos de exemplo.</p>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.cover_image || project.galleryImages[0]?.image_url || "/src/assets/project-1.jpg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge className="bg-primary/90 text-primary-foreground shadow-lg">
                    {project.category}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                  {project.title}
                </CardTitle>
                {project.location && (
                  <CardDescription className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">{project.location}</span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {project.completion_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(project.completion_date).getFullYear()}</span>
                      </div>
                    )}
                    {project.area_sqm && (
                      <div className="flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        <span>{project.area_sqm}m²</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => setSelectedProject(project)}
                    className="hover-scale shadow-md"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum projeto encontrado para esta categoria.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-gradient-primary p-8 rounded-2xl text-white shadow-elegant hover:shadow-glow transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-4">
              Tem um projeto em mente?
            </h3>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Entre em contacto connosco e descubra como podemos transformar as suas ideias em realidade.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={scrollToContact}
              className="bg-white text-primary hover:bg-white/90 hover-scale shadow-lg"
            >
              <Wrench className="w-5 h-5 mr-2" />
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Projects;