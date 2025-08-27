import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Square, 
  Euro,
  Share2,
  MessageCircle,
  Clock,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useProject } from "@/hooks/useProject";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LazyImage } from "@/components/ui/LazyImage";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { BeforeAfterSlider } from "@/components/projects/BeforeAfterSlider";
import { t } from "@/lib/translations";
import { formatDate, formatCurrency } from "@/lib/dateUtils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { ProjectSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { OptimizedImage } from "@/components/seo/ImageOptimizer";

const ProjectDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProject(slug || '');
  const navigate = useNavigate();
  const { toast } = useToast();

  // SEO optimization
  useSEO({
    title: project ? `${project.title} - Gal Reforms S.L` : 'Proyecto - Gal Reforms S.L',
    description: project 
      ? (project.description?.substring(0, 160) || `Proyecto de ${project.category} en ${project.location} realizado por Gal Reforms S.L`)
      : 'Descubre nuestros proyectos de construcción y reformas de alta calidad',
    keywords: project 
      ? `${project.category}, reforma, construcción, ${project.location}, Gal Reforms`.trim()
      : 'construcción, reformas, Madrid, España',
    image: project?.cover_image || `${window.location.origin}/placeholder-project.jpg`,
    url: window.location.href,
    type: 'article',
    author: 'Gal Reforms S.L',
    publishedTime: project?.created_at,
    modifiedTime: project?.updated_at
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-4">Proyecto no encontrado</h1>
            <p className="text-muted-foreground mb-6">El proyecto que buscas no existe o no está disponible.</p>
            <Button onClick={() => navigate('/#projects')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToProjects')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const scrollToContact = () => {
    navigate('/#contact');
  };

  const shareProject = async () => {
    const url = window.location.href;
    const title = project.title;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        navigator.clipboard.writeText(url);
        toast({
          title: "Enlace copiado",
          description: "El enlace del proyecto se ha copiado al portapapeles.",
        });
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Enlace copiado",
        description: "El enlace del proyecto se ha copiado al portapapeles.",
      });
    }
  };

  const openWhatsApp = () => {
    const message = `Hola! Estoy interesado en conocer más sobre el proyecto "${project.title}". ¿Podrían brindarme más información?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/34612345678?text=${encodedMessage}`, '_blank');
  };

  // Breadcrumb data for structured data
  const breadcrumbItems = [
    { name: 'Inicio', url: window.location.origin },
    { name: 'Proyectos', url: `${window.location.origin}/#projects` },
    { name: project?.title || 'Proyecto', url: window.location.href }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Structured Data */}
      {project && <ProjectSchema project={project} />}
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <OptimizedImage
          src={project.cover_image || '/placeholder-project.jpg'}
          alt={`${project.title} - Proyecto de ${project.category} por Gal Reforms S.L`}
          className="w-full h-full object-cover"
          quality="high"
          priority={true}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <AnimatedSection animation="fade-in-up">
              <div className="max-w-4xl text-white">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/20 mb-6"
                  onClick={() => navigate('/#projects')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('backToProjects')}
                </Button>
                
                <Badge className="mb-4 bg-primary/90 text-primary-foreground">
                  {project.category}
                </Badge>
                
                <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-lg">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {project.location}
                  </div>
                  {project.completion_date && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      {formatDate(project.completion_date)}
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="gallery" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="gallery">{t('gallery')}</TabsTrigger>
                <TabsTrigger value="beforeafter">{t('beforeAfter')}</TabsTrigger>
                <TabsTrigger value="videos">Vídeos</TabsTrigger>
                <TabsTrigger value="details">{t('projectDetails')}</TabsTrigger>
              </TabsList>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="space-y-6">
                <AnimatedSection>
                  <h2 className="text-3xl font-bold mb-6">Galería del Proyecto</h2>
                  {project.galleryImages && project.galleryImages.length > 0 ? (
                    <ProjectGallery images={project.galleryImages} />
                  ) : (
                    <p className="text-muted-foreground text-center py-12">No hay imágenes disponibles</p>
                  )}
                </AnimatedSection>
              </TabsContent>

              {/* Before & After Tab */}
              <TabsContent value="beforeafter" className="space-y-6">
                <AnimatedSection>
                  <h2 className="text-3xl font-bold mb-6">{t('beforeAfter')}</h2>
                  {project.beforeImages && project.beforeImages.length > 0 && 
                   project.afterImages && project.afterImages.length > 0 ? (
                    <BeforeAfterSlider 
                      beforeImages={project.beforeImages}
                      afterImages={project.afterImages}
                    />
                  ) : (
                    <p className="text-muted-foreground text-center py-12">No hay imágenes de antes y después disponibles</p>
                  )}
                </AnimatedSection>
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos" className="space-y-6">
                <AnimatedSection>
                  <h2 className="text-3xl font-bold mb-6">Vídeos do Projeto</h2>
                  {project.videos && project.videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.videos.map((video) => (
                        <div key={video.id} className="space-y-4">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            {video.video_type === 'upload' ? (
                              <video
                                src={video.video_url}
                                className="w-full h-full object-cover"
                                controls
                                poster={video.thumbnail_url}
                              />
                            ) : (
                              <iframe
                                src={video.video_url}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            )}
                          </div>
                          {video.title && (
                            <h3 className="text-lg font-semibold">{video.title}</h3>
                          )}
                          {video.description && (
                            <p className="text-muted-foreground">{video.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-12">Nenhum vídeo disponível</p>
                  )}
                </AnimatedSection>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Project Info Cards */}
                  <div className="lg:col-span-2 space-y-6">
                    <AnimatedSection>
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-4">Información del Proyecto</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {project.completion_date && (
                              <div className="flex items-center">
                                <Calendar className="w-5 h-5 text-primary mr-3" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Fecha de finalización</p>
                                  <p className="font-medium">{formatDate(project.completion_date)}</p>
                                </div>
                              </div>
                            )}
                            
                            {project.client && (
                              <div className="flex items-center">
                                <User className="w-5 h-5 text-primary mr-3" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Cliente</p>
                                  <p className="font-medium">{project.client}</p>
                                </div>
                              </div>
                            )}
                            
                            {project.area_sqm && (
                              <div className="flex items-center">
                                <Square className="w-5 h-5 text-primary mr-3" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Área</p>
                                  <p className="font-medium">{project.area_sqm} m²</p>
                                </div>
                              </div>
                            )}
                            
                            {project.budget_range && (
                              <div className="flex items-center">
                                <Euro className="w-5 h-5 text-primary mr-3" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Presupuesto</p>
                                  <p className="font-medium">{project.budget_range}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>

                    {/* Project Description */}
                    <AnimatedSection delay={200}>
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-4">Descripción del Proyecto</h3>
                          <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-muted-foreground leading-relaxed">
                              {project.description || 'No hay descripción disponible para este proyecto.'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>

                    {/* Features */}
                    {project.features && project.features.length > 0 && (
                      <AnimatedSection delay={400}>
                        <Card>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-4">Características</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {project.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </AnimatedSection>
                    )}

                    {/* Materials */}
                    {project.materials && (
                      <AnimatedSection delay={600}>
                        <Card>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-4">Materiales Utilizados</h3>
                            <div className="space-y-3">
                              {Object.entries(project.materials).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center border-b border-border pb-2">
                                  <span className="font-medium capitalize">{key}</span>
                                  <span className="text-muted-foreground">{value as string}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </AnimatedSection>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    
                    {/* Share Project */}
                    <AnimatedSection delay={300}>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <h3 className="text-lg font-semibold mb-4">Compartir Proyecto</h3>
                          <Button 
                            variant="outline" 
                            className="w-full mb-3"
                            onClick={shareProject}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Compartir
                          </Button>
                          <Button 
                            className="w-full"
                            onClick={openWhatsApp}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Preguntar sobre este proyecto
                          </Button>
                        </CardContent>
                      </Card>
                    </AnimatedSection>

                    {/* Project Timeline */}
                    <AnimatedSection delay={500}>
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">{t('projectTimeline')}</h3>
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
                              <div>
                                <p className="font-medium text-sm">{t('planningPhase')}</p>
                                <p className="text-xs text-muted-foreground">{t('planningDescription')}</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
                              <div>
                                <p className="font-medium text-sm">{t('executionPhase')}</p>
                                <p className="text-xs text-muted-foreground">{t('executionDescription')}</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
                              <div>
                                <p className="font-medium text-sm">{t('finishingPhase')}</p>
                                <p className="text-xs text-muted-foreground">{t('finishingDescription')}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">¿Te gustó este proyecto?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Contáctanos para discutir cómo podemos hacer realidad tu proyecto de construcción o reforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={scrollToContact}>
                  {t('requestQuote')}
                </Button>
                <Button size="lg" variant="outline" onClick={openWhatsApp}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chatea con nosotros
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default ProjectDetails;