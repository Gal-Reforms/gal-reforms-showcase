import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, ExternalLink } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Reforma Completa de Apartamento",
      category: "Reforma Residencial",
      location: "Madrid, Espanha",
      date: "2024",
      client: "Família Silva",
      description: "Transformação completa de apartamento de 120m² com design moderno e funcional. Incluiu reforma de cozinha, banheiros, sala e quartos com acabamentos premium.",
      image: project1,
      details: [
        "Área: 120m²",
        "Duração: 3 meses",
        "Ambientes: Cozinha, 2 banheiros, sala, 3 quartos",
        "Características: Piso em porcelanato, iluminação LED, móveis planejados"
      ],
      gallery: [project1, project2] // In a real app, you'd have multiple images per project
    },
    {
      id: 2,
      title: "Construção de Casa Unifamiliar",
      category: "Construção Nova",
      location: "Barcelona, Espanha",
      date: "2024",
      client: "Sr. Martínez",
      description: "Construção de casa unifamiliar moderna com 200m² em terreno de 500m². Projeto arquitetônico personalizado com sustentabilidade e eficiência energética.",
      image: project2,
      details: [
        "Área construída: 200m²",
        "Terreno: 500m²",
        "Duração: 8 meses",
        "Características: Casa ecológica, painéis solares, jardim paisagístico"
      ],
      gallery: [project2, project1]
    }
  ];

  const categories = ["Todos", "Reforma Residencial", "Construção Nova", "Comercial"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = selectedCategory === "Todos" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Nossos <span className="text-gold-gradient">Projetos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Conheça alguns dos nossos trabalhos mais recentes. Cada projeto é único e reflete 
            nosso compromisso com a excelência e atenção aos detalhes.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold" 
                : "hover:border-primary hover:text-primary"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover-lift animate-scale-in">
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  {project.category}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-3 text-foreground">
                  {project.title}
                </h3>
                
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} />
                    <span>{project.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User size={14} />
                    <span>{project.client}</span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full hover:border-primary hover:text-primary"
                      onClick={() => setSelectedProject(project)}
                    >
                      Ver Detalhes
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-serif text-foreground">
                        {project.title}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                          {project.gallery.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`${project.title} ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Informações do Projeto</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <MapPin size={14} />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Calendar size={14} />
                              <span>{project.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <User size={14} />
                              <span>{project.client}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Descrição</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Detalhes Técnicos</h4>
                          <ul className="space-y-1">
                            {project.details.map((detail, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                                <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Gostou dos nossos trabalhos? Entre em contato para discutir seu projeto.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold"
            onClick={() => {
              const element = document.getElementById("contact");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Solicitar Orçamento
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;