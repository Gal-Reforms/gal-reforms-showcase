import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export const MetaTags = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  noindex = false
}: MetaTagsProps) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Set document title
    if (title) {
      document.title = title;
    }

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic SEO meta tags
    if (description) {
      updateMetaTag('description', description);
    }
    
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    if (author) {
      updateMetaTag('author', author);
    }

    // Robots meta tag
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';
    updateMetaTag('robots', robotsContent);

    // Open Graph tags
    if (title) {
      updateMetaTag('og:title', title, true);
    }
    
    if (description) {
      updateMetaTag('og:description', description, true);
    }
    
    if (image) {
      updateMetaTag('og:image', image, true);
      updateMetaTag('og:image:alt', title || 'Gal Reforms S.L', true);
      updateMetaTag('og:image:width', '1200', true);
      updateMetaTag('og:image:height', '630', true);
    }
    
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Gal Reforms S.L', true);
    updateMetaTag('og:locale', 'es_ES', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    
    if (title) {
      updateMetaTag('twitter:title', title);
    }
    
    if (description) {
      updateMetaTag('twitter:description', description);
    }
    
    if (image) {
      updateMetaTag('twitter:image', image);
    }

    // Article specific meta tags
    if (type === 'article') {
      if (author) {
        updateMetaTag('article:author', author, true);
      }
      
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }

      updateMetaTag('article:section', 'Construcción y Reformas', true);
      updateMetaTag('article:tag', keywords || 'construcción, reformas, Madrid', true);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Language and geo tags
    updateMetaTag('language', 'es');
    updateMetaTag('geo.region', 'ES-M');
    updateMetaTag('geo.placename', 'Madrid');
    updateMetaTag('geo.position', '40.4168;-3.7038');
    updateMetaTag('ICBM', '40.4168, -3.7038');

    // Additional SEO tags
    updateMetaTag('distribution', 'global');
    updateMetaTag('rating', 'general');
    updateMetaTag('revisit-after', '7 days');

  }, [title, description, keywords, image, type, author, publishedTime, modifiedTime, noindex, currentUrl]);

  return null;
};