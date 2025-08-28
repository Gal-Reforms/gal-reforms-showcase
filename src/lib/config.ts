/**
 * Application configuration
 * Centralized configuration management for the entire application
 */

import { AppConfig } from './types';

/**
 * Environment variables (with fallbacks)
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

/**
 * Main application configuration
 */
export const APP_CONFIG: AppConfig = {
  name: 'Gal Reforms S.L',
  description: 'Empresa especializada en construcción y reformas con más de 15 años de experiencia. Calidad premium, diseño sofisticado y acabados impecables en Madrid y región.',
  url: ENV.IS_PRODUCTION ? 'https://galreforms.lovable.app' : window.location.origin,
  
  contact: {
    email: 'contacto@galreforms.com',
    phone: '+34 XXX XXX XXX',
    address: 'Madrid, España',
  },
  
  social: {
    instagram: 'https://www.instagram.com/galreforms',
    facebook: 'https://www.facebook.com/galreforms',
  },
  
  features: {
    analytics: ENV.IS_PRODUCTION,
    seo: true,
    errorTracking: ENV.IS_PRODUCTION,
  },
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  // Supabase configuration
  supabase: {
    url: 'https://yonzvqxnambgrhxkxsnv.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvbnp2cXhuYW1iZ3JoeGt4c252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDUxODMsImV4cCI6MjA3MTgyMTE4M30.E2s3za86JHFmidzAUl1aw_3i2gerrL3bsGDiHQfY6zg',
  },
  
  // API settings
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  // Animation settings
  animations: {
    defaultDuration: 300,
    defaultEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    staggerDelay: 100,
  },
  
  // Breakpoints (matching Tailwind CSS)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Image settings
  images: {
    quality: {
      low: 60,
      medium: 80,
      high: 95,
    },
    formats: ['webp', 'jpeg', 'png'],
    lazyLoadOffset: 200, // pixels
  },
  
  // Form settings
  forms: {
    validationDelay: 300, // ms
    autoSaveDelay: 2000, // ms
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [6, 12, 24, 48],
  },
} as const;

/**
 * SEO Configuration
 */
export const SEO_CONFIG = {
  defaultTitle: 'Gal Reforms S.L - Construcción y Reformas de Excelencia',
  titleTemplate: '%s | Gal Reforms S.L',
  defaultDescription: APP_CONFIG.description,
  defaultKeywords: [
    'construcción',
    'reformas',
    'Madrid',
    'España',
    'arquitectura',
    'diseño',
    'obras',
    'renovación',
    'reformas integrales',
    'cocinas',
    'baños',
  ],
  defaultImage: `${APP_CONFIG.url}/lovable-uploads/716cbf54-69ef-47e4-95a7-ec95811b8e9c.png`,
  locale: 'es_ES',
  twitterHandle: '@galreforms',
} as const;

/**
 * Error tracking configuration
 */
export const ERROR_CONFIG = {
  enableErrorBoundary: true,
  enableConsoleLogging: ENV.IS_DEVELOPMENT,
  enableRemoteLogging: ENV.IS_PRODUCTION,
  maxErrorsStored: 50,
  
  // Error categories to ignore
  ignoredErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
} as const;

/**
 * Performance configuration
 */
export const PERFORMANCE_CONFIG = {
  enablePerformanceTracking: true,
  enableWebVitals: ENV.IS_PRODUCTION,
  cacheDuration: {
    projects: 5 * 60 * 1000, // 5 minutes
    categories: 30 * 60 * 1000, // 30 minutes
    images: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Service Worker
  serviceWorker: {
    enabled: ENV.IS_PRODUCTION,
    cacheName: 'gal-reforms-v1',
    cacheFirst: [
      '/static/',
      '/assets/',
      '/lovable-uploads/',
    ],
    networkFirst: [
      '/api/',
      '/supabase/',
    ],
  },
} as const;

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  enableProjectComments: false,
  enableProjectRatings: false,
  enableBlogSection: false,
  enableMultiLanguage: false,
  enableDarkMode: true,
  enableAnalytics: ENV.IS_PRODUCTION,
  enableA11yFeatures: true,
  enableOfflineMode: false,
} as const;

/**
 * Development configuration
 */
export const DEV_CONFIG = {
  enableDevTools: ENV.IS_DEVELOPMENT,
  enableMockData: ENV.IS_DEVELOPMENT,
  enableDetailedLogging: ENV.IS_DEVELOPMENT,
  enablePerformanceWarnings: ENV.IS_DEVELOPMENT,
  showBundleAnalyzer: false,
} as const;

/**
 * Validation configuration
 */
export const VALIDATION_CONFIG = {
  // Contact form
  contactForm: {
    nameMinLength: 2,
    nameMaxLength: 50,
    subjectMinLength: 5,
    subjectMaxLength: 100,
    messageMinLength: 10,
    messageMaxLength: 1000,
  },
  
  // Project form
  projectForm: {
    titleMinLength: 3,
    titleMaxLength: 100,
    descriptionMaxLength: 2000,
    locationMaxLength: 100,
    maxImages: 20,
    maxImageSize: 10 * 1024 * 1024, // 10MB
  },
  
  // File upload
  upload: {
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 20,
  },
} as const;

/**
 * Theme configuration
 */
export const THEME_CONFIG = {
  defaultMode: 'light' as const,
  enableSystemPreference: true,
  colors: {
    primary: 'hsl(45 100% 35%)',
    secondary: 'hsl(0 0% 96%)',
    accent: 'hsl(40 95% 50%)',
  },
  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    serif: 'Playfair Display, Georgia, serif',
    mono: 'JetBrains Mono, monospace',
  },
} as const;

/**
 * Utility function to get configuration values safely
 */
export function getConfig<T>(path: string, defaultValue?: T): T {
  const keys = path.split('.');
  let current: any = {
    APP_CONFIG,
    API_CONFIG,
    UI_CONFIG,
    SEO_CONFIG,
    ERROR_CONFIG,
    PERFORMANCE_CONFIG,
    FEATURE_FLAGS,
    DEV_CONFIG,
    VALIDATION_CONFIG,
    THEME_CONFIG,
  };

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue as T;
    }
  }

  return current as T;
}

/**
 * Environment-specific configurations
 */
export const getEnvironmentConfig = () => {
  if (ENV.IS_PRODUCTION) {
    return {
      logLevel: 'error',
      enableDebugMode: false,
      enableDevTools: false,
      apiTimeout: 30000,
    };
  }

  return {
    logLevel: 'debug',
    enableDebugMode: true,
    enableDevTools: true,
    apiTimeout: 10000,
  };
};