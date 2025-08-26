import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, User, Ruler, Euro, Share2, MessageCircle, ArrowLeft, Loader2 } from "lucide-react";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { BeforeAfterSlider } from "@/components/projects/BeforeAfterSlider";
import { useProject } from "@/hooks/useProject";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const ProjectDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: project, isLoading, error } = useProject(slug || '');

  // Update page title and meta description dynamically
  useEffect(() => {
    if (project) {
      document.title = `${project.title} | Gal Reforms S.L`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${project.description?.substring(0, 160)}... | Projeto realizado pela Gal Reforms S.L em ${project.location || 'Espanha'}.`
        );
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.title = 'Gal Reforms S.L - Construção e Reformas de Excelência';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          'Empresa especializada em construção e reformas com mais de 15 anos de experiência. Qualidade premium, design sofisticado e acabamentos impecáveis em Madrid e região.'
        );
      }
    };
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando projeto...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Projeto não encontrado</h1>
            <p className="text-muted-foreground">O projeto que procura não existe ou não está disponível.</p>
            <Button onClick={() => navigate('/')} className="hover-scale">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Projetos
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const scrollToContact = () => {
    navigate('/#contact');
  };

  const shareProject = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: url,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copiado!", description: "O link do projeto foi copiado para área de transferência." });
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copiado!", description: "O link do projeto foi copiado para área de transferência." });
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento para um projeto similar ao "${project.title}". Podemos conversar?`);
    window.open(`https://wa.me/34123456789?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Back Navigation */}
      <div className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Projetos
          </Button>
        </div>
      </div>

      {/* Hero Section with cover image */}
      <div className="relative h-64 md:h-96 lg:h-[500px] overflow-hidden bg-muted">
        <img
          src={project.cover_image || project.galleryImages[0]?.image_url}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-4">
                <Badge className="bg-primary text-primary-foreground mb-2">
                  {project.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {project.title}
                </h1>
                {project.location && (
                  <div className="flex items-center gap-2 text-white/90 text-lg">
                    <MapPin className="w-5 h-5" />
                    <span>{project.location}</span>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-3 shrink-0">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={shareProject}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover-scale"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={openWhatsApp}
                  className="bg-primary hover:bg-primary/90 hover-scale shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project meta information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-muted/50 rounded-xl">
          {project.completion_date && (
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Conclusão</div>
                <div className="text-muted-foreground">
                  {new Date(project.completion_date).toLocaleDateString('pt-PT')}
                </div>
              </div>
            </div>
          )}
          
          {project.client && (
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Cliente</div>
                <div className="text-muted-foreground">{project.client}</div>
              </div>
            </div>
          )}
          
          {project.area_sqm && (
            <div className="flex items-center gap-3">
              <Ruler className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Área</div>
                <div className="text-muted-foreground">{project.area_sqm}m²</div>
              </div>
            </div>
          )}
          
          {project.budget_range && (
            <div className="flex items-center gap-3">
              <Euro className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Orçamento</div>
                <div className="text-muted-foreground">{project.budget_range}</div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs content */}
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="before-after" disabled={project.beforeImages.length === 0 || project.afterImages.length === 0}>
              Antes & Depois
            </TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="space-y-8">
            <ProjectGallery images={project.galleryImages} />
          </TabsContent>
          
          <TabsContent value="before-after" className="space-y-8">
            {project.beforeImages.length > 0 && project.afterImages.length > 0 ? (
              <BeforeAfterSlider 
                beforeImages={project.beforeImages} 
                afterImages={project.afterImages}
              />
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>Imagens de antes e depois não disponíveis para este projeto.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-8">
            <div className="prose max-w-none">
              {project.description && (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Descrição do Projeto</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{project.description}</p>
                </div>
              )}
              
              {project.features && project.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Características Principais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {project.materials && typeof project.materials === 'object' && Object.keys(project.materials).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Materiais Utilizados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(project.materials).map(([key, value]) => (
                      <div key={key} className="p-4 bg-muted/50 rounded-lg">
                        <div className="font-medium capitalize mb-1">{key}</div>
                        <div className="text-muted-foreground text-sm">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-16 p-8 bg-gradient-primary rounded-2xl text-white shadow-elegant hover:shadow-glow transition-shadow duration-300">
          <div className="text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">Interessado em um projeto similar?</h3>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Entre em contacto connosco para solicitar um orçamento personalizado para o seu projeto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={scrollToContact}
                className="bg-white text-primary hover:bg-white/90 hover-scale shadow-lg"
              >
                Solicitar Orçamento
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={openWhatsApp}
                className="border-white/20 text-white hover:bg-white/10 hover-scale"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProjectDetails;