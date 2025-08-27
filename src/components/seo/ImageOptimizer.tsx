import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: 'low' | 'medium' | 'high';
  loading?: 'lazy' | 'eager';
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  quality = 'medium',
  loading = 'lazy',
  className = '',
  sizes,
  priority = false,
  ...props
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate srcset for responsive images
  const generateSrcSet = (originalSrc: string) => {
    if (!originalSrc || originalSrc.startsWith('data:')) return '';
    
    const isExternalImage = originalSrc.startsWith('http');
    if (isExternalImage) {
      return originalSrc; // For external images, use as-is
    }

    // For internal images, generate different sizes
    const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const extension = originalSrc.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
    
    return [
      `${baseSrc}${extension} 1x`,
      `${baseSrc}@2x${extension} 2x`,
    ].join(', ');
  };

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [src, priority]);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    
    // Create image element to test loading
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      // Set fallback placeholder
      setImageSrc('/placeholder.svg');
    };
    
    img.src = src;
  }, [src]);

  if (hasError && !imageSrc) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width, height }}
        aria-label={alt}
      >
        <svg 
          className="w-8 h-8 text-muted-foreground" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-muted animate-pulse ${className}`}
          style={{ width, height }}
        />
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        srcSet={generateSrcSet(imageSrc)}
        sizes={sizes || (width ? `${width}px` : '100vw')}
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
};

// Critical CSS for above-the-fold content
export const injectCriticalCSS = () => {
  const criticalCSS = `
    /* Critical styles for above-the-fold content */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .hero-title {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: bold;
      line-height: 1.2;
    }
    
    .hero-description {
      font-size: clamp(1rem, 2vw, 1.25rem);
      opacity: 0.8;
      margin-top: 1rem;
    }
    
    /* Prevent layout shift */
    .aspect-ratio-container {
      position: relative;
      width: 100%;
      height: 0;
    }
    
    .aspect-ratio-16-9 {
      padding-bottom: 56.25%;
    }
    
    .aspect-ratio-4-3 {
      padding-bottom: 75%;
    }
    
    .aspect-ratio-1-1 {
      padding-bottom: 100%;
    }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};