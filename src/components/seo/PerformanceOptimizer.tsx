import { useEffect } from 'react';

// Critical resource preloader
export const preloadCriticalResources = () => {
  const criticalImages = [
    '/lovable-uploads/716cbf54-69ef-47e4-95a7-ec95811b8e9c.png',
    '/lovable-uploads/358be0af-7f4a-4c47-bd7a-8127ae316584.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Lazy load non-critical resources
export const lazyLoadResources = () => {
  // Defer non-critical CSS
  const deferCSS = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  };

  // Lazy load Google Analytics (if needed)
  const loadGoogleAnalytics = (trackingId: string) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(inlineScript);
  };

  // Load analytics after user interaction
  const loadAnalyticsOnInteraction = () => {
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll'];
    const loadAnalytics = () => {
      // loadGoogleAnalytics('GA_TRACKING_ID'); // Uncomment and add actual ID
      events.forEach(event => {
        document.removeEventListener(event, loadAnalytics);
      });
    };
    
    events.forEach(event => {
      document.addEventListener(event, loadAnalytics, { once: true, passive: true });
    });
  };

  loadAnalyticsOnInteraction();
};

// Performance monitoring
export const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const reportWebVitals = (metric: any) => {
      console.log('Web Vital:', metric);
      // In production, send to analytics service
      // gtag('event', metric.name, {
      //   event_category: 'Web Vitals',
      //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      //   event_label: metric.id,
      //   non_interaction: true,
      // });
    };

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        reportWebVitals({
          name: 'LCP',
          value: lastEntry.startTime,
          id: 'lcp'
        });
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          reportWebVitals({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            id: 'fid'
          });
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    }

    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        reportWebVitals({
          name: 'CLS',
          value: clsValue,
          id: 'cls'
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }

    // Navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      reportWebVitals({
        name: 'TTFB',
        value: navigation.responseStart - navigation.requestStart,
        id: 'ttfb'
      });

      reportWebVitals({
        name: 'DOM_LOAD',
        value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        id: 'dom-load'
      });

      reportWebVitals({
        name: 'FULL_LOAD',
        value: navigation.loadEventEnd - navigation.fetchStart,
        id: 'full-load'
      });
    });

    // Preload critical resources
    preloadCriticalResources();
    
    // Lazy load non-critical resources
    lazyLoadResources();
  }, []);

  return null;
};

// Image lazy loading with Intersection Observer
export const useLazyLoading = () => {
  useEffect(() => {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.removeAttribute('data-src');
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach((img: any) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }, []);
};

// Critical CSS injection for above-the-fold content
export const injectCriticalCSS = () => {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, hsl(0 0% 100% / 0.95), hsl(45 100% 35% / 0.1));
    }
    
    .hero-title {
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
      font-family: 'Cormorant Garamond', serif;
    }
    
    .hero-subtitle {
      font-size: clamp(1.125rem, 2.5vw, 1.75rem);
      line-height: 1.4;
      opacity: 0.9;
      margin-top: 1.5rem;
    }
    
    /* Navigation critical styles */
    .header-nav {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }
    
    /* Button critical styles */
    .btn-primary {
      background: linear-gradient(135deg, hsl(45 100% 35%), hsl(40 95% 50%));
      color: white;
      padding: 1rem 2rem;
      border-radius: 0.75rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px -5px hsl(45 100% 35% / 0.25);
    }
    
    /* Layout shift prevention */
    .aspect-ratio-16-9 {
      aspect-ratio: 16 / 9;
    }
    
    .aspect-ratio-1-1 {
      aspect-ratio: 1 / 1;
    }
    
    /* Loading states */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;

  // Only inject if not already present
  if (!document.querySelector('#critical-css')) {
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }
};

// Service Worker registration for caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered: ', registration);
      } catch (registrationError) {
        console.log('SW registration failed: ', registrationError);
      }
    });
  }
};