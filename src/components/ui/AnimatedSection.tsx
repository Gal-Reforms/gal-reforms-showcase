import React, { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' | 'scale-in' | 'bounce-in';
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true
}) => {
  const [ref, isVisible] = useScrollReveal({
    threshold,
    delay: 0, // Handle delay through CSS animation-delay instead
    triggerOnce
  });

  const animationClasses = {
    'fade-in': 'animate-fade-in',
    'fade-in-up': 'animate-fade-in-up',
    'fade-in-down': 'animate-fade-in-down',
    'fade-in-left': 'animate-fade-in-left',
    'fade-in-right': 'animate-fade-in-right',
    'scale-in': 'animate-scale-in',
    'bounce-in': 'animate-bounce-in'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity duration-300',
        isVisible ? `opacity-100 ${animationClasses[animation]}` : 'opacity-0',
        className
      )}
      style={{
        animationDelay: isVisible ? `${delay}ms` : '0ms'
      }}
    >
      {children}
    </div>
  );
};