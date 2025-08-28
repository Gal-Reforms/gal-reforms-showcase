import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Search, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSitemap, downloadSitemap, generateRobotsTxt } from '@/utils/sitemap';

export const SEOManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownloadSitemap = async () => {
    setIsGenerating(true);
    try {
      await downloadSitemap();
      toast({
        title: 'Sitemap Generado',
        description: 'El sitemap.xml ha sido generado y descargado exitosamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al generar el sitemap. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadRobots = () => {
    try {
      const robotsContent = generateRobotsTxt();
      const blob = new Blob([robotsContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'robots.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Robots.txt Generado',
        description: 'El archivo robots.txt ha sido generado y descargado exitosamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al generar robots.txt. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const handleCheckSEO = () => {
    // Open Google PageSpeed Insights for the current site
    const currentDomain = window.location.origin;
    window.open(`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(currentDomain)}`, '_blank');
  };

  const handleCheckIndexing = () => {
    // Open Google Search Console
    window.open('https://search.google.com/search-console', '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gestión de SEO</h2>
        <p className="text-muted-foreground">
          Herramientas para optimizar el SEO y rendimiento del sitio web.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sitemap Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Sitemap XML
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Genera un sitemap.xml actualizado con todas las páginas del sitio para mejorar la indexación.
            </p>
            <Button 
              onClick={handleDownloadSitemap} 
              disabled={isGenerating}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generando...' : 'Descargar Sitemap'}
            </Button>
          </CardContent>
        </Card>

        {/* Robots.txt Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Robots.txt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Genera un archivo robots.txt optimizado para guiar a los motores de búsqueda.
            </p>
            <Button 
              onClick={handleDownloadRobots}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar Robots.txt
            </Button>
          </CardContent>
        </Card>

        {/* SEO Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Análisis de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Analiza el rendimiento y SEO del sitio web con Google PageSpeed Insights.
            </p>
            <Button 
              onClick={handleCheckSEO}
              variant="outline"
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Analizar Rendimiento
            </Button>
          </CardContent>
        </Card>

        {/* Search Console */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Indexación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Verifica el estado de indexación del sitio en Google Search Console.
            </p>
            <Button 
              onClick={handleCheckIndexing}
              variant="outline"
              className="w-full"
            >
              <Globe className="w-4 h-4 mr-2" />
              Abrir Search Console
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SEO Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Guía de SEO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Optimizaciones Implementadas:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Meta tags dinámicas para cada página y proyecto</li>
                <li>URLs amigables para SEO (/proyecto/nombre-proyecto)</li>
                <li>Datos estructurados (Schema.org) para proyectos y organización</li>
                <li>Imágenes optimizadas con atributos alt descriptivos</li>
                <li>Sitemap XML automático con todos los proyectos publicados</li>
                <li>Robots.txt optimizado para guiar a los crawlers</li>
                <li>Open Graph y Twitter Cards para redes sociales</li>
                <li>Tags canónicos para evitar contenido duplicado</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Recomendaciones Adicionales:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Actualiza regularmente el contenido de los proyectos</li>
                <li>Asegúrate de que todas las imágenes tengan alt text descriptivo</li>
                <li>Mantén las meta descripciones entre 150-160 caracteres</li>
                <li>Usa palabras clave relevantes en títulos y descripciones</li>
                <li>Envía el sitemap a Google Search Console regularmente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};