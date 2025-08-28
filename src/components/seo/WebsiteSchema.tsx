import React from 'react';
import { StructuredData } from './StructuredData';

export const WebsiteSchema = () => {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.galreformas.com.es/#website",
    "url": "https://www.galreformas.com.es",
    "name": "Gal Reforms S.L - Construcción y Reformas de Excelencia en Madrid",
    "description": "Empresa especializada en construcción y reformas con más de 15 años de experiencia. Calidad premium, diseño sofisticado y acabados impecables en Madrid y región.",
    "publisher": {
      "@id": "https://www.galreformas.com.es/#organization"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.galreformas.com.es/buscar?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "inLanguage": "es-ES",
    "copyrightYear": "2025",
    "copyrightHolder": {
      "@id": "https://www.galreformas.com.es/#organization"
    }
  };

  return <StructuredData data={websiteData} id="website-schema" />;
};