import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";
import { ProjectImage } from "@/hooks/useProjects";

interface BeforeAfterSliderProps {
  beforeImages: ProjectImage[];
  afterImages: ProjectImage[];
  className?: string;
}

export const BeforeAfterSlider = ({ 
  beforeImages, 
  afterImages, 
  className = "" 
}: BeforeAfterSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [showLabels, setShowLabels] = useState(true);

  const maxIndex = Math.min(beforeImages.length, afterImages.length) - 1;

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!beforeImages.length || !afterImages.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay imágenes de antes y después disponibles.</p>
      </div>
    );
  }

  const beforeImage = beforeImages[currentIndex];
  const afterImage = afterImages[currentIndex];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Before/After Slider */}
      <div className="relative h-[500px] overflow-hidden rounded-lg border bg-muted">
        {/* Before Image */}
        <div className="absolute inset-0">
          <LazyImage
            src={beforeImage.image_url}
            alt="Imagen antes"
            className="w-full h-full object-cover"
            quality="high"
          />
          {showLabels && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Antes
            </div>
          )}
        </div>

        {/* After Image with Clip Path */}
        <div 
          className="absolute inset-0 transition-all duration-100"
          style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
          }}
        >
          <LazyImage
            src={afterImage.image_url}
            alt="Imagen después"
            className="w-full h-full object-cover"
            quality="high"
          />
          {showLabels && (
            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Después
            </div>
          )}
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-1 h-4 bg-gray-400"></div>
            <div className="w-1 h-4 bg-gray-400 ml-1"></div>
          </div>
        </div>

        {/* Interactive Overlay */}
        <div 
          className="absolute inset-0 cursor-ew-resize"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            setSliderPosition(Math.max(0, Math.min(100, percentage)));
          }}
          onTouchMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            setSliderPosition(Math.max(0, Math.min(100, percentage)));
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            {currentIndex + 1} de {maxIndex + 1}
          </span>
          <Button 
            variant="outline" 
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
          >
            Siguiente
          </Button>
        </div>

        {/* Options */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
          >
            {showLabels ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showLabels ? 'Ocultar etiquetas' : 'Mostrar etiquetas'}
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Posición:</span>
            <div className="w-24">
              <Slider
                value={[sliderPosition]}
                onValueChange={(value) => setSliderPosition(value[0])}
                max={100}
                min={0}
                step={1}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Captions */}
      {(beforeImage.caption || afterImage.caption) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beforeImage.caption && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-red-600 mb-2">Antes</h4>
              <p className="text-sm text-muted-foreground">{beforeImage.caption}</p>
            </div>
          )}
          {afterImage.caption && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-green-600 mb-2">Después</h4>
              <p className="text-sm text-muted-foreground">{afterImage.caption}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};