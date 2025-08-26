import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ProjectImage } from "@/hooks/useProjects";

interface ProjectGalleryProps {
  images: ProjectImage[];
  className?: string;
}

export const ProjectGallery = ({ images, className }: ProjectGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground">Nenhuma imagem disponível</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Carousel */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={image.id}>
                <div className="relative aspect-video bg-muted rounded-xl overflow-hidden group cursor-pointer shadow-elegant">
                  <img
                    src={image.image_url}
                    alt={image.caption || `Imagem ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => openLightbox(index)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300 bg-primary rounded-full p-3 shadow-elegant">
                      <ZoomIn className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  {image.caption && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm text-white p-3 rounded-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-medium">{image.caption}</p>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant" />
              <CarouselNext className="right-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant" />
            </>
          )}
        </Carousel>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(index)}
              className="aspect-square bg-muted rounded-lg overflow-hidden hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md hover-scale"
            >
              <img
                src={image.image_url}
                alt={image.caption || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-0">
          <DialogHeader className="absolute top-4 left-4 right-4 z-10 flex-row items-center justify-between text-white">
            <DialogTitle className="text-lg font-semibold">
              {selectedImage !== null && images[selectedImage]?.caption || `Imagem ${(selectedImage || 0) + 1} de ${images.length}`}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          {selectedImage !== null && (
            <div className="relative flex items-center justify-center h-full p-8">
              <img
                src={images[selectedImage].image_url}
                alt={images[selectedImage].caption || `Imagem ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              
              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};