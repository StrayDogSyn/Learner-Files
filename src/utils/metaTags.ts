// Enhanced Meta Tags for Social Sharing

// Meta Tag Types
interface MetaTagConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  robots?: string;
  keywords?: string[];
}

// Page-specific Meta Configurations
interface PageMetaConfig {
  [key: string]: MetaTagConfig;
}

class MetaTagManager {
  private defaultConfig: MetaTagConfig;
  private pageConfigs: PageMetaConfig = {};

  constructor() {
    this.defaultConfig = {
      title: 'SOLO - Full-Stack Developer & UI/UX Designer',
      description: 'Experienced full-stack developer and UI/UX designer creating innovative digital solutions. Specializing in React, Node.js, and modern web technologies.',
      siteName: 'SOLO Portfolio',
      type: 'website',
      locale: 'en_US',
      author: 'SOLO',
      image: '/images/og-default.jpg',
      imageAlt: 'SOLO - Full-Stack Developer Portfolio',
      twitterCard: 'summary_large_image',
      twitterSite: '@solo_dev',
      twitterCreator: '@solo_dev',
      robots: 'index, follow',
      keywords: ['full-stack developer', 'UI/UX designer', 'React', 'Node.js', 'web development', 'portfolio']
    };

    this.initializePageConfigs();
  }

  private initializePageConfigs(): void {
    this.pageConfigs = {
      '/': {
        title: 'SOLO - Full-Stack Developer & UI/UX Designer',
        description: 'Welcome to my portfolio. I\'m a passionate full-stack developer and UI/UX designer with 5+ years of experience creating exceptional digital experiences.',
        type: 'website',
        image: '/images/og-home.jpg',
        imageAlt: 'SOLO Portfolio - Home Page',
        keywords: ['portfolio', 'full-stack developer', 'UI/UX designer', 'web development', 'React developer']
      },
      '/about': {
        title: 'About SOLO - My Journey as a Developer',
        description: 'Learn about my background, skills, and passion for creating innovative web solutions. Discover my journey from design to development.',
        type: 'profile',
        image: '/images/og-about.jpg',
        imageAlt: 'About SOLO - Developer Profile',
        keywords: ['about', 'developer story', 'skills', 'experience', 'background']
      },
      '/projects': {
        title: 'Projects - SOLO Portfolio',
        description: 'Explore my latest projects showcasing full-stack development, UI/UX design, and innovative solutions across various industries.',
        type: 'website',
        image: '/images/og-projects.jpg',
        imageAlt: 'SOLO Projects Portfolio',
        keywords: ['projects', 'portfolio', 'web applications', 'case studies', 'development work']
      },
      '/services': {
        title: 'Services - Full-Stack Development & UI/UX Design',
        description: 'Professional web development and design services. From concept to deployment, I deliver high-quality digital solutions.',
        type: 'website',
        image: '/images/og-services.jpg',
        imageAlt: 'SOLO Services - Web Development & Design',
        keywords: ['services', 'web development', 'UI/UX design', 'consulting', 'freelance']
      },
      '/contact': {
        title: 'Contact SOLO - Let\'s Work Together',
        description: 'Ready to start your next project? Get in touch to discuss how I can help bring your ideas to life.',
        type: 'website',
        image: '/images/og-contact.jpg',
        imageAlt: 'Contact SOLO - Get In Touch',
        keywords: ['contact', 'hire developer', 'project inquiry', 'collaboration', 'freelance']
      },
      '/blog': {
        title: 'Blog - SOLO\'s Development Insights',
        description: 'Read my latest thoughts on web development, design trends, and technology insights from the field.',
        type: 'website',
        image: '/images/og-blog.jpg',
        imageAlt: 'SOLO Blog - Development Insights',
        keywords: ['blog', 'web development', 'tutorials', 'insights', 'technology']
      },
      '/interactive': {
        title: 'Interactive Portfolio - SOLO\'s Advanced Features',
        description: 'Experience the interactive version of my portfolio with advanced animations, micro-interactions, and modern web technologies.',
        type: 'website',
        image: '/images/og-interactive.jpg',
        imageAlt: 'SOLO Interactive Portfolio',
        keywords: ['interactive', 'animations', 'micro-interactions', 'advanced features', 'modern web']
      }
    };
  }

  // Get meta configuration for a specific page
  getPageConfig(path: string): MetaTagConfig {
    const pageConfig = this.pageConfigs[path] || {};
    return { ...this.defaultConfig, ...pageConfig };
  }

  // Update meta tags in the document head
  updateMetaTags(config: MetaTagConfig): void {
    if (typeof document === 'undefined') return;

    // Update title
    document.title = config.title;

    // Update or create meta tags
    this.setMetaTag('description', config.description);
    this.setMetaTag('author', config.author || this.defaultConfig.author!);
    this.setMetaTag('keywords', config.keywords?.join(', ') || this.defaultConfig.keywords!.join(', '));
    this.setMetaTag('robots', config.robots || this.defaultConfig.robots!);

    // Canonical URL
    if (config.canonicalUrl || config.url) {
      this.setLinkTag('canonical', config.canonicalUrl || config.url!);
    }

    // Open Graph tags
    this.setMetaProperty('og:title', config.title);
    this.setMetaProperty('og:description', config.description);
    this.setMetaProperty('og:type', config.type || this.defaultConfig.type!);
    this.setMetaProperty('og:site_name', config.siteName || this.defaultConfig.siteName!);
    this.setMetaProperty('og:locale', config.locale || this.defaultConfig.locale!);
    
    if (config.url) {
      this.setMetaProperty('og:url', config.url);
    }
    
    if (config.image) {
      this.setMetaProperty('og:image', this.getAbsoluteUrl(config.image));
      this.setMetaProperty('og:image:alt', config.imageAlt || config.title);
      this.setMetaProperty('og:image:width', '1200');
      this.setMetaProperty('og:image:height', '630');
    }

    if (config.publishedTime) {
      this.setMetaProperty('article:published_time', config.publishedTime);
    }
    
    if (config.modifiedTime) {
      this.setMetaProperty('article:modified_time', config.modifiedTime);
    }

    if (config.tags && config.tags.length > 0) {
      // Remove existing article:tag meta tags
      this.removeMetaProperties('article:tag');
      // Add new tags
      config.tags.forEach(tag => {
        this.setMetaProperty('article:tag', tag);
      });
    }

    // Twitter Card tags
    this.setMetaName('twitter:card', config.twitterCard || this.defaultConfig.twitterCard!);
    this.setMetaName('twitter:title', config.title);
    this.setMetaName('twitter:description', config.description);
    
    if (config.twitterSite || this.defaultConfig.twitterSite) {
      this.setMetaName('twitter:site', config.twitterSite || this.defaultConfig.twitterSite!);
    }
    
    if (config.twitterCreator || this.defaultConfig.twitterCreator) {
      this.setMetaName('twitter:creator', config.twitterCreator || this.defaultConfig.twitterCreator!);
    }
    
    if (config.image) {
      this.setMetaName('twitter:image', this.getAbsoluteUrl(config.image));
      this.setMetaName('twitter:image:alt', config.imageAlt || config.title);
    }

    // Additional SEO meta tags
    this.setMetaName('theme-color', '#1a1a2e');
    this.setMetaName('msapplication-TileColor', '#1a1a2e');
    this.setMetaName('apple-mobile-web-app-capable', 'yes');
    this.setMetaName('apple-mobile-web-app-status-bar-style', 'black-translucent');
  }

  // Helper method to set meta tag by name
  private setMetaTag(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  // Helper method to set meta property (for Open Graph)
  private setMetaProperty(property: string, content: string): void {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  // Helper method to set meta name (for Twitter Cards)
  private setMetaName(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  // Helper method to set link tag
  private setLinkTag(rel: string, href: string): void {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
  }

  // Remove meta properties (useful for article tags)
  private removeMetaProperties(property: string): void {
    const metas = document.querySelectorAll(`meta[property="${property}"]`);
    metas.forEach(meta => meta.remove());
  }

  // Convert relative URL to absolute
  private getAbsoluteUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${window.location.origin}${url.startsWith('/') ? url : '/' + url}`;
  }

  // Generate structured data (JSON-LD)
  generateStructuredData(config: MetaTagConfig): string {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': config.type === 'profile' ? 'Person' : 'WebSite',
      name: config.siteName || this.defaultConfig.siteName,
      description: config.description,
      url: config.url || window.location.href,
      author: {
        '@type': 'Person',
        name: config.author || this.defaultConfig.author
      },
      image: config.image ? this.getAbsoluteUrl(config.image) : undefined,
      sameAs: [
        'https://github.com/solo-dev',
        'https://linkedin.com/in/solo-dev',
        'https://twitter.com/solo_dev'
      ]
    };

    return JSON.stringify(structuredData, null, 2);
  }

  // Update structured data in document
  updateStructuredData(config: MetaTagConfig): void {
    if (typeof document === 'undefined') return;

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = this.generateStructuredData(config);
    document.head.appendChild(script);
  }

  // Update all meta tags and structured data for a page
  updatePageMeta(path: string, customConfig?: Partial<MetaTagConfig>): void {
    const config = { ...this.getPageConfig(path), ...customConfig };
    
    // Add current URL if not provided
    if (!config.url) {
      config.url = window.location.href;
    }
    
    this.updateMetaTags(config);
    this.updateStructuredData(config);
  }

  // Get meta tags as HTML string (for SSR)
  getMetaTagsHTML(config: MetaTagConfig): string {
    const tags: string[] = [];
    
    // Basic meta tags
    tags.push(`<title>${config.title}</title>`);
    tags.push(`<meta name="description" content="${config.description}">`);
    tags.push(`<meta name="author" content="${config.author || this.defaultConfig.author}">`);
    tags.push(`<meta name="keywords" content="${(config.keywords || this.defaultConfig.keywords!).join(', ')}">`);
    tags.push(`<meta name="robots" content="${config.robots || this.defaultConfig.robots}">`);
    
    // Canonical URL
    if (config.canonicalUrl || config.url) {
      tags.push(`<link rel="canonical" href="${config.canonicalUrl || config.url}">`);
    }
    
    // Open Graph tags
    tags.push(`<meta property="og:title" content="${config.title}">`);
    tags.push(`<meta property="og:description" content="${config.description}">`);
    tags.push(`<meta property="og:type" content="${config.type || this.defaultConfig.type}">`);
    tags.push(`<meta property="og:site_name" content="${config.siteName || this.defaultConfig.siteName}">`);
    tags.push(`<meta property="og:locale" content="${config.locale || this.defaultConfig.locale}">`);
    
    if (config.url) {
      tags.push(`<meta property="og:url" content="${config.url}">`);
    }
    
    if (config.image) {
      const imageUrl = config.image.startsWith('http') ? config.image : `${config.url || ''}${config.image}`;
      tags.push(`<meta property="og:image" content="${imageUrl}">`);
      tags.push(`<meta property="og:image:alt" content="${config.imageAlt || config.title}">`);
      tags.push(`<meta property="og:image:width" content="1200">`);
      tags.push(`<meta property="og:image:height" content="630">`);
    }
    
    // Twitter Card tags
    tags.push(`<meta name="twitter:card" content="${config.twitterCard || this.defaultConfig.twitterCard}">`);
    tags.push(`<meta name="twitter:title" content="${config.title}">`);
    tags.push(`<meta name="twitter:description" content="${config.description}">`);
    
    if (config.twitterSite || this.defaultConfig.twitterSite) {
      tags.push(`<meta name="twitter:site" content="${config.twitterSite || this.defaultConfig.twitterSite}">`);
    }
    
    if (config.twitterCreator || this.defaultConfig.twitterCreator) {
      tags.push(`<meta name="twitter:creator" content="${config.twitterCreator || this.defaultConfig.twitterCreator}">`);
    }
    
    if (config.image) {
      const imageUrl = config.image.startsWith('http') ? config.image : `${config.url || ''}${config.image}`;
      tags.push(`<meta name="twitter:image" content="${imageUrl}">`);
      tags.push(`<meta name="twitter:image:alt" content="${config.imageAlt || config.title}">`);
    }
    
    // Additional meta tags
    tags.push(`<meta name="theme-color" content="#1a1a2e">`);
    tags.push(`<meta name="msapplication-TileColor" content="#1a1a2e">`);
    tags.push(`<meta name="apple-mobile-web-app-capable" content="yes">`);
    tags.push(`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`);
    
    return tags.join('\n');
  }
}

// React hook for meta tags
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const metaManager = new MetaTagManager();

export const useMetaTags = (customConfig?: Partial<MetaTagConfig>) => {
  const location = useLocation();

  useEffect(() => {
    metaManager.updatePageMeta(location.pathname, customConfig);
  }, [location.pathname, customConfig]);

  return {
    updateMeta: (config: Partial<MetaTagConfig>) => {
      metaManager.updatePageMeta(location.pathname, config);
    },
    getConfig: () => metaManager.getPageConfig(location.pathname)
  };
};

// Component for meta tags
export const MetaTags: React.FC<{ config?: Partial<MetaTagConfig> }> = ({ config }) => {
  useMetaTags(config);
  return null;
};

export default metaManager;
export type { MetaTagConfig, PageMetaConfig };