/**
 * Centralized type definitions for the application
 * Provides consistent type safety across all components
 */

/**
 * Common utility types
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type ValueOf<T> = T[keyof T];

/**
 * API Response types
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * User and Authentication types
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

/**
 * Project-related types
 */
export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface ProjectImage {
  id: string;
  image_url: string;
  image_type: 'gallery' | 'before' | 'after' | 'cover';
  caption?: string;
  order_index: number;
  alt_text?: string;
}

export interface ProjectMaterial {
  [key: string]: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  category_id?: string;
  location?: string;
  description?: string;
  short_description?: string;
  long_description?: string;
  cover_image?: string;
  client?: string;
  start_date?: string;
  completion_date?: string;
  area_sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  budget_range?: string;
  materials?: ProjectMaterial;
  features?: string[];
  keywords?: string[];
  status: ProjectStatus;
  published: boolean;
  created_at: string;
  updated_at: string;
  
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  
  // Computed fields
  images: ProjectImage[];
  beforeImages: ProjectImage[];
  afterImages: ProjectImage[];
  galleryImages: ProjectImage[];
}

export interface ProjectFormData extends Omit<Project, 'id' | 'created_at' | 'updated_at' | 'images' | 'beforeImages' | 'afterImages' | 'galleryImages'> {
  // Form-specific fields
}

/**
 * Category types
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Contact form types
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactInfo {
  icon: React.ComponentType<any>;
  title: string;
  content: string;
  description: string;
}

/**
 * SEO and Meta types
 */
export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export interface StructuredDataOrganization {
  '@context': string;
  '@type': 'Organization';
  name: string;
  description: string;
  url: string;
  logo: string;
  image: string;
  telephone: string;
  address: {
    '@type': 'PostalAddress';
    addressCountry: string;
    addressRegion: string;
    addressLocality: string;
  };
  areaServed: {
    '@type': 'Place';
    name: string;
  };
  founder: {
    '@type': 'Person';
    name: string;
  };
  foundingDate: string;
  numberOfEmployees: string;
  sameAs: string[];
  serviceType: string[];
}

/**
 * UI Component types
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error;
  message?: string;
}

export interface AsyncComponentState<T> extends LoadingState, ErrorState {
  data: T | null;
}

/**
 * Navigation and routing types
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavItem[];
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Form and validation types
 */
export interface FormField<T = any> {
  name: string;
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
  disabled?: boolean;
}

export interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

/**
 * Media and image types
 */
export interface ImageUploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: 'low' | 'medium' | 'high';
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Analytics and tracking types
 */
export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

export interface WebVital {
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB';
  value: number;
  id: string;
  delta?: number;
}

/**
 * Configuration types
 */
export interface AppConfig {
  name: string;
  description: string;
  url: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  features: {
    analytics: boolean;
    seo: boolean;
    errorTracking: boolean;
  };
}

/**
 * Theme and styling types
 */
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    sans: string;
    serif: string;
    mono: string;
  };
}