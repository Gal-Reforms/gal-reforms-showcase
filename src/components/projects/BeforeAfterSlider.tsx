import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProjectImage } from "@/hooks/useProjects";

interface BeforeAfterSliderProps {
  beforeImages: ProjectImage[];
  afterImages: ProjectImage[];
  className?: string;
}

export const BeforeAfterSlider = ({ beforeImages, afterImages, className }: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const beforeImage = beforeImages[currentIndex];
  const afterImage = afterImages[currentIndex];

  if (!beforeImage || !afterImage) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground">Imagens de antes e depois não disponíveis</p>
      </div>
    );
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.touches[0] as any);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0] as any);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updateSliderPosition = (event: React.MouseEvent | Touch) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e as any);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const maxImages = Math.min(beforeImages.length, afterImages.length);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Navigation dots */}
      {maxImages > 1 && (
        <div className="flex justify-center space-x-2 mb-4">
          {Array.from({ length: maxImages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                currentIndex === index 
                  ? "bg-primary shadow-glow" 
                  : "bg-muted hover:bg-muted/70"
              )}
              aria-label={`Ver imagem ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slider container */}
      <div 
        ref={containerRef}
        className="relative aspect-video bg-muted rounded-xl overflow-hidden cursor-ew-resize select-none group shadow-elegant"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* After image (background) */}
        <div className="absolute inset-0">
          <img
            src={afterImage.image_url}
            alt={afterImage.caption || "Depois"}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-md">
            DEPOIS
          </div>
        </div>

        {/* Before image (clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage.image_url}
            alt={beforeImage.caption || "Antes"}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute top-4 left-4 bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium shadow-md">
            ANTES
          </div>
        </div>

        {/* Slider handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-primary shadow-glow cursor-ew-resize z-10 group-hover:w-2 transition-all duration-200"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full shadow-elegant flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <div className="w-1 h-4 bg-primary-foreground rounded-full mx-0.5"></div>
            <div className="w-1 h-4 bg-primary-foreground rounded-full mx-0.5"></div>
          </div>
        </div>

        {/* Touch indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
          ← Arraste para comparar →
        </div>
      </div>

      {/* Captions */}
      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
        <div className="text-center">
          <span className="font-medium text-foreground">Antes: </span>
          {beforeImage.caption}
        </div>
        <div className="text-center">
          <span className="font-medium text-foreground">Depois: </span>
          {afterImage.caption}
        </div>
      </div>
    </div>
  );
};