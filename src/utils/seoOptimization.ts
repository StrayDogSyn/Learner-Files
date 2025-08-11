/**
 * SEO Optimization Utilities
 * Handles meta tags, structured data, and SEO best practices
 */

import React from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  canonical?: string;
  robots?: string;
  viewport?: string;
  themeColor?: string;
  msapplicationTileColor?: string;
  appleMobileWebAppCapable?: boolean;
  appleMobileWebAppStatusBarStyle?: 'default' | 'black' | 'black-translucent';
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

class SEOManager {
  private static instance: SEOManager;
  private defaultConfig: Partial<SEOConfig>;
  
  private constructor() {
    this.defaultConfig = {
      siteName: 'SOLO Developer Portfolio',
      author: 'SOLO Developer',
      locale: 'en_US',
      type: 'website',
      twitterCard: 'summary_large_image',
      twitterSite: '@solo_developer',
      twitterCreator: '@solo_developer',
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1.0',
      themeColor: '#3b82f6',
      msapplicationTileColor: '#3b82f6',
      appleMobileWebAppCapable: true,
      appleMobileWebAppStatusBarStyle: 'black-translucent'
    };
  }
  
  public static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager();
    }
    return SEOManager.instance;
  }
  
  /**
   * Update page SEO configuration
   */
  public updateSEO(config: SEOConfig): void {
    const fullConfig = { ...this.defaultConfig, ...config };
    
    // Update document title
    document.title = fullConfig.title;
    
    // Update meta tags
    this.updateMetaTags(fullConfig);
    
    // Update Open Graph tags
    this.updateOpenGraphTags(fullConfig);
    
    // Update Twitter Card tags
    this.updateTwitterCardTags(fullConfig);
    
    // Update canonical URL
    this.updateCanonicalURL(fullConfig.canonical || fullConfig.url);
    
    // Update structured data
    this.updateStructuredData(fullConfig);
  }
  
  /**
   * Update basic meta tags
   */
  private updateMetaTags(config: SEOConfig): void {
    const metaTags = [
      { name: 'description', content: config.description },
      { name: 'keywords', content: config.keywords?.join(', ') },
      { name: 'author', content: config.author },
      { name: 'robots', content: config.robots },
      { name: 'viewport', content: config.viewport },
      { name: 'theme-color', content: config.themeColor },
      { name: 'msapplication-TileColor', content: config.msapplicationTileColor },
      { name: 'apple-mobile-web-app-capable', content: config.appleMobileWebAppCapable ? 'yes' : 'no' },
      { name: 'apple-mobile-web-app-status-bar-style', content: config.appleMobileWebAppStatusBarStyle },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'application-name', content: config.siteName },
      { name: 'apple-mobile-web-app-title', content: config.siteName },
      { name: 'msapplication-tooltip', content: config.description },
      { name: 'msapplication-starturl', content: '/' }
    ];
    
    metaTags.forEach(({ name, content }) => {
      if (content) {
        this.setMetaTag('name', name, content);
      }
    });
  }
  
  /**
   * Update Open Graph meta tags
   */
  private updateOpenGraphTags(config: SEOConfig): void {
    const ogTags = [
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:type', content: config.type },
      { property: 'og:url', content: config.url },
      { property: 'og:image', content: config.image },
      { property: 'og:site_name', content: config.siteName },
      { property: 'og:locale', content: config.locale },
      { property: 'article:published_time', content: config.publishedTime },
      { property: 'article:modified_time', content: config.modifiedTime },
      { property: 'article:section', content: config.section },
      { property: 'article:author', content: config.author }
    ];
    
    // Add article tags if available
    if (config.tags) {
      config.tags.forEach(tag => {
        this.setMetaTag('property', 'article:tag', tag);
      });
    }
    
    ogTags.forEach(({ property, content }) => {
      if (content) {
        this.setMetaTag('property', property, content);
      }
    });
  }
  
  /**
   * Update Twitter Card meta tags
   */
  private updateTwitterCardTags(config: SEOConfig): void {
    const twitterTags = [
      { name: 'twitter:card', content: config.twitterCard },
      { name: 'twitter:site', content: config.twitterSite },
      { name: 'twitter:creator', content: config.twitterCreator },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description },
      { name: 'twitter:image', content: config.image },
      { name: 'twitter:url', content: config.url }
    ];
    
    twitterTags.forEach(({ name, content }) => {
      if (content) {
        this.setMetaTag('name', name, content);
      }
    });
  }
  
  /**
   * Update canonical URL
   */
  private updateCanonicalURL(url?: string): void {
    if (!url) return;
    
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.href = url;
  }
  
  /**
   * Set or update a meta tag
   */
  private setMetaTag(attribute: 'name' | 'property', value: string, content: string): void {
    let metaTag = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, value);
      document.head.appendChild(metaTag);
    }
    
    metaTag.content = content;
  }
  
  /**
   * Update structured data (JSON-LD)
   */
  private updateStructuredData(config: SEOConfig): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Create new structured data
    const structuredData = this.generateStructuredData(config);
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }
  
  /**
   * Generate structured data based on page type
   */
  private generateStructuredData(config: SEOConfig): StructuredData {
    const baseData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: config.siteName || 'SOLO Developer Portfolio',
      description: config.description,
      url: config.url || window.location.origin,
      author: {
        '@type': 'Person',
        name: config.author || 'SOLO Developer',
        url: config.url || window.location.origin
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
    
    // Add specific structured data based on page type
    switch (config.type) {
      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: config.title,
          description: config.description,
          image: config.image,
          author: {
            '@type': 'Person',
            name: config.author || 'SOLO Developer'
          },
          publisher: {
            '@type': 'Organization',
            name: config.siteName || 'SOLO Developer Portfolio',
            logo: {
              '@type': 'ImageObject',
              url: `${window.location.origin}/icons/icon-192x192.png`
            }
          },
          datePublished: config.publishedTime,
          dateModified: config.modifiedTime || config.publishedTime,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': config.url || window.location.href
          }
        };
      
      case 'profile':
        return {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: config.author || 'SOLO Developer',
          description: config.description,
          image: config.image,
          url: config.url || window.location.href,
          sameAs: [
            'https://github.com/solo-developer',
            'https://linkedin.com/in/solo-developer',
            'https://twitter.com/solo_developer'
          ],
          jobTitle: 'Full Stack Developer',
          worksFor: {
            '@type': 'Organization',
            name: 'Freelance'
          },
          knowsAbout: [
            'Web Development',
            'React',
            'TypeScript',
            'Node.js',
            'AI Integration',
            'UI/UX Design'
          ]
        };
      
      default:
        return baseData;
    }
  }
  
  /**
   * Generate sitemap data
   */
  public generateSitemap(): string {
    const urls = [
      { loc: '/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/portfolio', priority: '0.9', changefreq: 'weekly' },
      { loc: '/blog', priority: '0.8', changefreq: 'daily' },
      { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
      { loc: '/games', priority: '0.6', changefreq: 'monthly' },
      { loc: '/showcase', priority: '0.8', changefreq: 'weekly' }
    ];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${window.location.origin}${url.loc}</loc>
    <priority>${url.priority}</priority>
    <changefreq>${url.changefreq}</changefreq>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;
    
    return sitemap;
  }
  
  /**
   * Generate robots.txt content
   */
  public generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: ${window.location.origin}/sitemap.xml`;
  }
  
  /**
   * Track page view for analytics
   */
  public trackPageView(path: string, title: string): void {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: title
      });
    }
    
    // Custom analytics tracking
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.page(title, {
        path,
        title,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * Preload critical resources
   */
  public preloadResources(resources: Array<{ href: string; as: string; type?: string }>): void {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) {
        link.type = resource.type;
      }
      document.head.appendChild(link);
    });
  }
  
  /**
   * Add DNS prefetch for external domains
   */
  public addDNSPrefetch(domains: string[]): void {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }
}

// Export singleton instance
export const seoManager = SEOManager.getInstance();

// Predefined SEO configurations for different pages
export const SEO_CONFIGS = {
  HOME: {
    title: 'SOLO Developer - Full Stack Developer Portfolio',
    description: 'Experienced full-stack developer specializing in React, TypeScript, Node.js, and AI integration. View my portfolio of modern web applications with glassmorphic design.',
    keywords: ['full stack developer', 'react developer', 'typescript', 'web development', 'portfolio', 'glassmorphic design', 'AI integration'],
    type: 'website' as const,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20developer%20portfolio%20glassmorphic%20design%20professional&image_size=landscape_16_9'
  },
  
  PORTFOLIO: {
    title: 'Portfolio - SOLO Developer Projects',
    description: 'Explore my collection of web development projects featuring modern technologies, innovative solutions, and beautiful user interfaces.',
    keywords: ['portfolio', 'web projects', 'react applications', 'full stack projects', 'modern web development'],
    type: 'website' as const,
    section: 'Portfolio'
  },
  
  BLOG: {
    title: 'Blog - SOLO Developer Insights',
    description: 'Read my latest thoughts on web development, technology trends, best practices, and tutorials for modern web applications.',
    keywords: ['web development blog', 'programming tutorials', 'technology insights', 'react tutorials', 'typescript guides'],
    type: 'website' as const,
    section: 'Blog'
  },
  
  CONTACT: {
    title: 'Contact - Get in Touch with SOLO Developer',
    description: 'Ready to start your next project? Get in touch to discuss web development opportunities, collaborations, or technical consulting.',
    keywords: ['contact developer', 'hire developer', 'web development services', 'freelance developer'],
    type: 'website' as const
  },
  
  GAMES: {
    title: 'Interactive Games - SOLO Developer Showcase',
    description: 'Play interactive games built with modern web technologies. Experience engaging gameplay while exploring advanced web development techniques.',
    keywords: ['web games', 'interactive games', 'javascript games', 'web development showcase'],
    type: 'website' as const
  },
  
  SHOWCASE: {
    title: 'Component Showcase - SOLO Developer Library',
    description: 'Explore our glassmorphic component library with live examples, interactive demos, and source code. Perfect for modern web applications.',
    keywords: ['component library', 'glassmorphic design', 'react components', 'ui library', 'web components'],
    type: 'website' as const
  }
};
  
  // React hook for SEO management
export function useSEO(config: SEOConfig) {
  React.useEffect(() => {
    const fullConfig = {
      ...config,
      url: config.url || window.location.href
    };
    
    seoManager.updateSEO(fullConfig);
    seoManager.trackPageView(window.location.pathname, config.title);
    
    // Cleanup function to reset to default SEO when component unmounts
    return () => {
      // Optional: Reset to default SEO
    };
  }, [config]);
}

export default seoManager;