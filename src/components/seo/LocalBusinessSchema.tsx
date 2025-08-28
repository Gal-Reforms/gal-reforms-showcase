import React from 'react';
import { StructuredData } from './StructuredData';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const LocalBusinessSchema = () => {
  const { data: settings } = useSiteSettings();
  
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.galreformas.com.es/#organization",
    "name": "Gal Reforms S.L",
    "alternateName": "Gal Reforms",
    "description": settings?.company_description || "Empresa especializada en construcción y reformas con más de 15 años de experiencia. Calidad premium, diseño sofisticado y acabados impecables en Madrid y región.",
    "url": "https://www.galreformas.com.es",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.galreformas.com.es/lovable-uploads/716cbf54-69ef-47e4-95a7-ec95811b8e9c.png",
      "width": 400,
      "height": 400
    },
    "image": [
      "https://www.galreformas.com.es/lovable-uploads/716cbf54-69ef-47e4-95a7-ec95811b8e9c.png",
      "https://www.galreformas.com.es/lovable-uploads/358be0af-7f4a-4c47-bd7a-8127ae316584.png"
    ],
    "telephone": settings?.phone_number || "+34612345678",
    "email": settings?.email || "contacto@galreformas.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.address || "Madrid",
      "addressLocality": "Madrid",
      "addressRegion": "Comunidad de Madrid",
      "postalCode": "28001",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.4168,
      "longitude": -3.7038
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Madrid"
      },
      {
        "@type": "State",
        "name": "Comunidad de Madrid"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 40.4168,
        "longitude": -3.7038
      },
      "geoRadius": "50000"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "priceRange": "€€€",
    "currenciesAccepted": "EUR",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "foundingDate": "2009",
    "founder": {
      "@type": "Person",
      "name": "Gal Reforms"
    },
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 10,
      "maxValue": 50
    },
    "sameAs": [
      settings?.facebook_url,
      settings?.instagram_url,
      settings?.linkedin_url,
    ].filter(Boolean),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Construcción y Reformas",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reformas Integrales",
            "description": "Reformas completas de viviendas y locales comerciales"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Construcción Nueva",
            "description": "Construcción de viviendas unifamiliares y edificios"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reformas de Cocinas",
            "description": "Diseño y reforma completa de cocinas modernas"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reformas de Baños",
            "description": "Renovación completa de baños con acabados de calidad"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reformas Comerciales",
            "description": "Reformas de locales comerciales, oficinas y restaurantes"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "María González"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Excelente trabajo en la reforma de mi cocina. Profesionales, puntuales y con acabados de primera calidad."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Carlos Martín"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Muy satisfecho con la reforma integral de mi piso. Cumplieron todos los plazos y el resultado superó mis expectativas."
      }
    ]
  };

  return <StructuredData data={localBusinessData} id="local-business-schema" />;
};