import { useEffect } from 'react';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const useSEO = (data: SEOData) => {
  useEffect(() => {
    // Update title
    if (data.title) {
      document.title = data.title;
    }

    // Update or create meta tags
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

    // Basic meta tags
    if (data.description) {
      updateMetaTag('description', data.description);
    }
    
    if (data.keywords) {
      updateMetaTag('keywords', data.keywords);
    }

    if (data.author) {
      updateMetaTag('author', data.author);
    }

    // Open Graph tags
    if (data.title) {
      updateMetaTag('og:title', data.title, true);
    }
    
    if (data.description) {
      updateMetaTag('og:description', data.description, true);
    }
    
    if (data.image) {
      updateMetaTag('og:image', data.image, true);
    }
    
    if (data.url) {
      updateMetaTag('og:url', data.url, true);
    }
    
    if (data.type) {
      updateMetaTag('og:type', data.type, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    
    if (data.title) {
      updateMetaTag('twitter:title', data.title);
    }
    
    if (data.description) {
      updateMetaTag('twitter:description', data.description);
    }
    
    if (data.image) {
      updateMetaTag('twitter:image', data.image);
    }

    // Article specific meta tags
    if (data.type === 'article') {
      if (data.author) {
        updateMetaTag('article:author', data.author, true);
      }
      
      if (data.publishedTime) {
        updateMetaTag('article:published_time', data.publishedTime, true);
      }
      
      if (data.modifiedTime) {
        updateMetaTag('article:modified_time', data.modifiedTime, true);
      }
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (data.url) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', data.url);
    }

  }, [data]);
};