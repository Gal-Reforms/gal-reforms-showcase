import { useEffect } from 'react';

interface StructuredDataProps {
  data: any;
  id?: string;
}

export const StructuredData = ({ data, id = 'structured-data' }: StructuredDataProps) => {
  useEffect(() => {
    // Remove existing structured data script if it exists
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, id]);

  return null;
};

// Organization Schema
export const OrganizationSchema = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gal Reforms S.L",
    "description": "Empresa especializada en construcción y reformas con más de 15 años de experiencia. Calidad premium, diseño sofisticado y acabados impecables en Madrid y región.",
    "url": window.location.origin,
    "logo": `${window.location.origin}/lovable-uploads/716cbf54-69ef-47e4-95a7-ec95811b8e9c.png`,
    "image": `${window.location.origin}/lovable-uploads/716cbf54-69ef-47e4-95a7-ec95811b8e9c.png`,
    "telephone": "+34612345678",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ES",
      "addressRegion": "Madrid",
      "addressLocality": "Madrid"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Madrid, España"
    },
    "founder": {
      "@type": "Person",
      "name": "Gal Reforms"
    },
    "foundingDate": "2009",
    "numberOfEmployees": "10-50",
    "sameAs": [
      "https://www.instagram.com/galreforms",
      "https://www.facebook.com/galreforms"
    ],
    "serviceType": [
      "Construcción",
      "Reformas",
      "Renovación",
      "Diseño de interiores",
      "Construcción residencial",
      "Reformas comerciales"
    ]
  };

  return <StructuredData data={organizationData} id="organization-schema" />;
};

// Project Schema
interface ProjectSchemaProps {
  project: {
    id: string;
    title: string;
    description?: string;
    category: string;
    location?: string;
    cover_image?: string;
    completion_date?: string;
    area_sqm?: number;
    slug: string;
  };
}

export const ProjectSchema = ({ project }: ProjectSchemaProps) => {
  const projectData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description || `Proyecto de ${project.category} realizado por Gal Reforms S.L`,
    "url": `${window.location.origin}/proyecto/${project.slug}`,
    "image": project.cover_image || `${window.location.origin}/placeholder-project.jpg`,
    "creator": {
      "@type": "Organization",
      "name": "Gal Reforms S.L"
    },
    "about": project.category,
    "locationCreated": project.location ? {
      "@type": "Place",
      "name": project.location
    } : undefined,
    "dateCompleted": project.completion_date,
    "additionalProperty": project.area_sqm ? [{
      "@type": "PropertyValue",
      "name": "Área",
      "value": project.area_sqm,
      "unitCode": "MTK"
    }] : undefined
  };

  return <StructuredData data={projectData} id="project-schema" />;
};

// Breadcrumb Schema
interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return <StructuredData data={breadcrumbData} id="breadcrumb-schema" />;
};

// FAQ Schema
interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return <StructuredData data={faqData} id="faq-schema" />;
};

// Service Schema
export const ServiceSchema = () => {
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Servicios de Construcción y Reformas",
    "description": "Servicios integrales de construcción, reformas y renovación en Madrid y región",
    "provider": {
      "@type": "Organization",
      "name": "Gal Reforms S.L"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Madrid, España"
    },
    "serviceType": [
      "Reformas integrales",
      "Construcción nueva",
      "Renovación de cocinas",
      "Renovación de baños",
      "Reformas comerciales",
      "Diseño de interiores"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Construcción",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reformas Integrales"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Construcción Nueva"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Reformas de Cocinas"
          }
        }
      ]
    }
  };

  return <StructuredData data={serviceData} id="service-schema" />;
};