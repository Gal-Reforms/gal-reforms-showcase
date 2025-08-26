import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, User, Ruler, Euro, Share2, MessageCircle } from "lucide-react";
import { ProjectGallery } from "./ProjectGallery";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { Project } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const { toast } = useToast();

  if (!project) return null;

  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const shareProject = async () => {
    const url = `${window.location.origin}?project=${project.slug}`;
    
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-hidden p-0">
        {/* Header with cover image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={project.cover_image || project.galleryImages[0]?.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <DialogHeader className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Badge className="bg-primary text-primary-foreground mb-2">
                  {project.category}
                </Badge>
                <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight">
                  {project.title}
                </DialogTitle>
                {project.location && (
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 shrink-0">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={shareProject}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Project meta information */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-muted/50 rounded-xl">
              {project.completion_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Conclusão</div>
                    <div className="text-muted-foreground">
                      {new Date(project.completion_date).toLocaleDateString('pt-PT')}
                    </div>
                  </div>
                </div>
              )}
              
              {project.client && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Cliente</div>
                    <div className="text-muted-foreground">{project.client}</div>
                  </div>
                </div>
              )}
              
              {project.area_sqm && (
                <div className="flex items-center gap-2 text-sm">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Área</div>
                    <div className="text-muted-foreground">{project.area_sqm}m²</div>
                  </div>
                </div>
              )}
              
              {project.budget_range && (
                <div className="flex items-center gap-2 text-sm">
                  <Euro className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Orçamento</div>
                    <div className="text-muted-foreground">{project.budget_range}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs content */}
            <Tabs defaultValue="gallery" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="gallery">Galeria</TabsTrigger>
                <TabsTrigger value="before-after" disabled={project.beforeImages.length === 0 || project.afterImages.length === 0}>
                  Antes & Depois
                </TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gallery" className="space-y-6">
                <ProjectGallery images={project.galleryImages} />
              </TabsContent>
              
              <TabsContent value="before-after" className="space-y-6">
                {project.beforeImages.length > 0 && project.afterImages.length > 0 ? (
                  <BeforeAfterSlider 
                    beforeImages={project.beforeImages} 
                    afterImages={project.afterImages}
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Imagens de antes e depois não disponíveis para este projeto.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                <div className="prose max-w-none">
                  {project.description && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Descrição do Projeto</h3>
                      <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                    </div>
                  )}
                  
                  {project.features && project.features.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Características Principais</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.materials && Object.keys(project.materials).length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Materiais Utilizados</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(project.materials).map(([key, value]) => (
                          <div key={key} className="p-4 bg-muted/50 rounded-lg">
                            <div className="font-medium capitalize mb-1">{key}</div>
                            <div className="text-muted-foreground text-sm">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Call to Action */}
            <div className="mt-8 p-6 bg-gradient-primary rounded-xl text-white">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">Interessado em um projeto similar?</h3>
                <p className="text-white/90">
                  Entre em contacto connosco para solicitar um orçamento personalizado para o seu projeto.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="secondary" 
                    onClick={scrollToContact}
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Solicitar Orçamento
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={openWhatsApp}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};