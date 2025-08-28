import React, { useEffect, useRef } from 'react';
import { LazyImage } from './LazyImage';
import { cn } from '@/lib/utils';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // 0.1 to 1, where 0.5 is half speed
  overlay?: boolean;
  overlayClass?: string;
  priority?: boolean;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className,
  speed = 0.5,
  overlay = false,
  overlayClass = 'bg-black/40',
  priority = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !imageRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isInView = rect.bottom >= 0 && rect.top <= window.innerHeight;

      if (isInView) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        imageRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    const throttledScroll = throttle(handleScroll, 10);
    window.addEventListener('scroll', throttledScroll);
    handleScroll(); // Initialize position

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [speed]);

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
        style={{ height: '120%', top: '-10%' }}
      >
        <LazyImage
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          priority={priority}
          quality="high"
        />
      </div>
      
      {overlay && (
        <div className={cn('absolute inset-0', overlayClass)} />
      )}
    </div>
  );
};

// Simple throttle utility
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}