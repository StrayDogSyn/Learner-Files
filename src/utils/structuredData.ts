// Structured Data (JSON-LD) Schemas for SEO
// Implements Schema.org markup for better search engine understanding

interface PersonSchema {
  '@context': string;
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  description?: string;
  url?: string;
  image?: string;
  email?: string;
  telephone?: string;
  address?: {
    '@type': 'PostalAddress';
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  sameAs?: string[];
  knowsAbout?: string[];
  alumniOf?: {
    '@type': 'Organization';
    name: string;
    url?: string;
  }[];
  worksFor?: {
    '@type': 'Organization';
    name: string;
    url?: string;
  };
}

interface OrganizationSchema {
  '@context': string;
  '@type': 'Organization';
  name: string;
  description?: string;
  url?: string;
  logo?: {
    '@type': 'ImageObject';
    url: string;
    width?: number;
    height?: number;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    email?: string;
    contactType: string;
    availableLanguage?: string[];
  }[];
  address?: {
    '@type': 'PostalAddress';
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  sameAs?: string[];
  foundingDate?: string;
  founder?: {
    '@type': 'Person';
    name: string;
  }[];
}

interface SoftwareApplicationSchema {
  '@context': string;
  '@type': 'SoftwareApplication';
  name: string;
  description?: string;
  url?: string;
  applicationCategory: string;
  operatingSystem?: string[];
  programmingLanguage?: string[];
  author?: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  dateCreated?: string;
  dateModified?: string;
  version?: string;
  screenshot?: {
    '@type': 'ImageObject';
    url: string;
    caption?: string;
  }[];
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
  };
}

interface WebSiteSchema {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  description?: string;
  url: string;
  author?: {
    '@type': 'Person';
    name: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
  mainEntity?: any;
}

interface CreativeWorkSchema {
  '@context': string;
  '@type': 'CreativeWork';
  name: string;
  description?: string;
  url?: string;
  author?: {
    '@type': 'Person';
    name: string;
  };
  dateCreated?: string;
  dateModified?: string;
  keywords?: string[];
  genre?: string[];
  image?: string[];
  programmingLanguage?: string[];
  codeRepository?: string;
}

// Portfolio-specific structured data generator
export class StructuredDataGenerator {
  private baseUrl: string;
  private siteName: string;
  private authorName: string;
  private authorEmail?: string;
  private authorImage?: string;

  constructor(config: {
    baseUrl: string;
    siteName: string;
    authorName: string;
    authorEmail?: string;
    authorImage?: string;
  }) {
    this.baseUrl = config.baseUrl;
    this.siteName = config.siteName;
    this.authorName = config.authorName;
    this.authorEmail = config.authorEmail;
    this.authorImage = config.authorImage;
  }

  // Generate Person schema for portfolio owner
  generatePersonSchema(additionalData?: Partial<PersonSchema>): PersonSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: this.authorName,
      jobTitle: 'Full Stack Developer',
      description: 'Experienced software developer specializing in modern web technologies, React, Node.js, and cloud solutions.',
      url: this.baseUrl,
      image: this.authorImage,
      email: this.authorEmail,
      sameAs: [
        'https://github.com/yourusername',
        'https://linkedin.com/in/yourprofile',
        'https://twitter.com/yourusername'
      ],
      knowsAbout: [
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'Python',
        'Cloud Computing',
        'Web Development',
        'Software Architecture',
        'Database Design',
        'API Development'
      ],
      ...additionalData
    };
  }

  // Generate Organization schema for freelance/company
  generateOrganizationSchema(additionalData?: Partial<OrganizationSchema>): OrganizationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.siteName,
      description: 'Professional software development services specializing in modern web applications and digital solutions.',
      url: this.baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${this.baseUrl}/logo.png`,
        width: 512,
        height: 512
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          email: this.authorEmail,
          contactType: 'customer service',
          availableLanguage: ['English']
        }
      ],
      founder: [
        {
          '@type': 'Person',
          name: this.authorName
        }
      ],
      sameAs: [
        'https://github.com/yourusername',
        'https://linkedin.com/in/yourprofile'
      ],
      ...additionalData
    };
  }

  // Generate WebSite schema
  generateWebSiteSchema(additionalData?: Partial<WebSiteSchema>): WebSiteSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      description: 'Professional portfolio showcasing modern web development projects and technical expertise.',
      url: this.baseUrl,
      author: {
        '@type': 'Person',
        name: this.authorName
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      ...additionalData
    };
  }

  // Generate SoftwareApplication schema for projects
  generateProjectSchema(
    project: {
      name: string;
      description: string;
      url?: string;
      technologies: string[];
      dateCreated?: string;
      dateModified?: string;
      screenshots?: string[];
      repository?: string;
    },
    additionalData?: Partial<SoftwareApplicationSchema>
  ): SoftwareApplicationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.name,
      description: project.description,
      url: project.url,
      applicationCategory: 'WebApplication',
      operatingSystem: ['Web Browser', 'Cross-platform'],
      programmingLanguage: project.technologies,
      author: {
        '@type': 'Person',
        name: this.authorName,
        url: this.baseUrl
      },
      dateCreated: project.dateCreated,
      dateModified: project.dateModified,
      screenshot: project.screenshots?.map(url => ({
        '@type': 'ImageObject',
        url,
        caption: `${project.name} screenshot`
      })),
      ...additionalData
    };
  }

  // Generate CreativeWork schema for blog posts/articles
  generateArticleSchema(
    article: {
      title: string;
      description: string;
      url?: string;
      dateCreated?: string;
      dateModified?: string;
      keywords?: string[];
      image?: string;
    },
    additionalData?: Partial<CreativeWorkSchema>
  ): CreativeWorkSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: article.title,
      description: article.description,
      url: article.url,
      author: {
        '@type': 'Person',
        name: this.authorName
      },
      dateCreated: article.dateCreated,
      dateModified: article.dateModified,
      keywords: article.keywords,
      image: article.image ? [article.image] : undefined,
      ...additionalData
    };
  }

  // Generate breadcrumb schema
  generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    };
  }

  // Generate FAQ schema
  generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }
}

// React hook for managing structured data
import { useEffect } from 'react';

export function useStructuredData(schema: any, id?: string) {
  useEffect(() => {
    const scriptId = id || 'structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(schema, null, 2);
    
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [schema, id]);
}

// Utility function to inject structured data
export function injectStructuredData(schema: any, id = 'structured-data'): void {
  let script = document.getElementById(id) as HTMLScriptElement;
  
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(schema, null, 2);
}

// Remove structured data
export function removeStructuredData(id = 'structured-data'): void {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
}

// Validate structured data (basic validation)
export function validateStructuredData(schema: any): boolean {
  try {
    if (!schema['@context'] || !schema['@type']) {
      console.warn('Structured data missing required @context or @type');
      return false;
    }
    
    JSON.stringify(schema);
    return true;
  } catch (error) {
    console.error('Invalid structured data:', error);
    return false;
  }
}

// Default portfolio configuration
export const DEFAULT_PORTFOLIO_CONFIG = {
  baseUrl: 'https://yourportfolio.com',
  siteName: 'SOLO Portfolio',
  authorName: 'Your Name',
  authorEmail: 'your.email@example.com',
  authorImage: 'https://yourportfolio.com/profile.jpg'
};

// Create default structured data generator
export function createPortfolioStructuredData(config = DEFAULT_PORTFOLIO_CONFIG) {
  return new StructuredDataGenerator(config);
}

// Common schemas for portfolio sites
export const PORTFOLIO_SCHEMAS = {
  PERSON: 'Person',
  ORGANIZATION: 'Organization',
  WEBSITE: 'WebSite',
  SOFTWARE_APPLICATION: 'SoftwareApplication',
  CREATIVE_WORK: 'CreativeWork',
  BREADCRUMB_LIST: 'BreadcrumbList',
  FAQ_PAGE: 'FAQPage'
};

export default {
  StructuredDataGenerator,
  useStructuredData,
  injectStructuredData,
  removeStructuredData,
  validateStructuredData,
  createPortfolioStructuredData,
  DEFAULT_PORTFOLIO_CONFIG,
  PORTFOLIO_SCHEMAS
};