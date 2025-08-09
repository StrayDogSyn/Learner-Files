/**
 * SEO Validation Tests
 * Tests for meta tags, structured data, and search optimization
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import '@testing-library/jest-dom';

// Mock document head manipulation
const createMockDocument = () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Page</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `);

  return dom.window.document;
};

// SEO utilities for meta tag management
class SEOManager {
  static setTitle(title) {
    document.title = title;
  }

  static setMetaTag(name, content, property = false) {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  }

  static setCanonicalURL(url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  static addStructuredData(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  static setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
  }

  static addAlternateLanguage(lang, url) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', lang);
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  static getMetaContent(name, property = false) {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    const meta = document.querySelector(selector);
    return meta ? meta.getAttribute('content') : null;
  }

  static hasStructuredData(type) {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    return Array.from(scripts).some(script => {
      try {
        const data = JSON.parse(script.textContent);
        return data['@type'] === type || data.some?.(item => item['@type'] === type);
      } catch {
        return false;
      }
    });
  }
}

// SEO-optimized page component
const SEOPage = ({ 
  title = 'Default Title',
  description = 'Default description',
  keywords = 'default, keywords',
  canonicalUrl = 'https://example.com',
  ogImage = 'https://example.com/image.jpg',
  author = 'John Doe',
  publishDate = '2024-01-01',
  structuredData = null
}) => {
  React.useEffect(() => {
    // Set basic meta tags
    SEOManager.setTitle(title);
    SEOManager.setMetaTag('description', description);
    SEOManager.setMetaTag('keywords', keywords);
    SEOManager.setMetaTag('author', author);
    SEOManager.setCanonicalURL(canonicalUrl);

    // Open Graph tags
    SEOManager.setMetaTag('og:title', title, true);
    SEOManager.setMetaTag('og:description', description, true);
    SEOManager.setMetaTag('og:image', ogImage, true);
    SEOManager.setMetaTag('og:url', canonicalUrl, true);
    SEOManager.setMetaTag('og:type', 'website', true);

    // Twitter Card tags
    SEOManager.setMetaTag('twitter:card', 'summary_large_image');
    SEOManager.setMetaTag('twitter:title', title);
    SEOManager.setMetaTag('twitter:description', description);
    SEOManager.setMetaTag('twitter:image', ogImage);

    // Article-specific tags
    if (publishDate) {
      SEOManager.setMetaTag('article:published_time', publishDate, true);
      SEOManager.setMetaTag('article:author', author, true);
    }

    // Structured data
    if (structuredData) {
      SEOManager.addStructuredData(structuredData);
    }

    // Default structured data for website
    SEOManager.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description: description,
      url: canonicalUrl,
      author: {
        '@type': 'Person',
        name: author
      }
    });
  }, [title, description, keywords, canonicalUrl, ogImage, author, publishDate, structuredData]);

  return React.createElement('div', {
    'data-testid': 'seo-page'
  },
    React.createElement('h1', null, title),
    React.createElement('p', null, description)
  );
};

// Article component with rich SEO
const ArticlePage = ({
  title,
  content,
  author,
  publishDate,
  tags = [],
  readingTime = '5 min read'
}) => {
  React.useEffect(() => {
    SEOManager.setTitle(`${title} | Blog`);
    SEOManager.setMetaTag('description', content.substring(0, 160));
    SEOManager.setMetaTag('article:published_time', publishDate, true);
    SEOManager.setMetaTag('article:author', author, true);
    SEOManager.setMetaTag('article:section', 'Technology', true);
    
    tags.forEach(tag => {
      SEOManager.setMetaTag('article:tag', tag, true);
    });

    // Article structured data
    SEOManager.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      author: {
        '@type': 'Person',
        name: author
      },
      datePublished: publishDate,
      articleBody: content,
      keywords: tags.join(', ')
    });
  }, [title, content, author, publishDate, tags]);

  return React.createElement('article', {
    'data-testid': 'article-page'
  },
    React.createElement('h1', null, title),
    React.createElement('div', { 'data-testid': 'article-meta' },
      `By ${author} • ${publishDate} • ${readingTime}`
    ),
    React.createElement('div', { 'data-testid': 'article-content' }, content)
  );
};

// Product page component
const ProductPage = ({ product }) => {
  React.useEffect(() => {
    SEOManager.setTitle(`${product.name} | Store`);
    SEOManager.setMetaTag('description', product.description);
    
    // Product structured data
    SEOManager.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: product.rating ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount
      } : undefined
    });
  }, [product]);

  return React.createElement('div', {
    'data-testid': 'product-page'
  },
    React.createElement('h1', null, product.name),
    React.createElement('p', { 'data-testid': 'product-price' }, `$${product.price}`),
    React.createElement('p', null, product.description)
  );
};

// Breadcrumb component
const Breadcrumb = ({ items }) => {
  React.useEffect(() => {
    // Breadcrumb structured data
    SEOManager.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    });
  }, [items]);

  return React.createElement('nav', {
    'data-testid': 'breadcrumb',
    'aria-label': 'Breadcrumb'
  },
    React.createElement('ol', null,
      items.map((item, index) =>
        React.createElement('li', {
          key: index,
          'data-testid': `breadcrumb-item-${index}`
        },
          index < items.length - 1 ?
            React.createElement('a', { href: item.url }, item.name) :
            React.createElement('span', null, item.name)
        )
      )
    )
  );
};

describe('SEO Validation Tests', () => {
  beforeEach(() => {
    // Reset document head
    document.head.innerHTML = `
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test Page</title>
    `;
    document.documentElement.setAttribute('lang', 'en');
  });

  describe('Basic Meta Tags', () => {
    test('sets title correctly', () => {
      render(React.createElement(SEOPage, {
        title: 'Test Page Title'
      }));

      expect(document.title).toBe('Test Page Title');
    });

    test('sets meta description', () => {
      render(React.createElement(SEOPage, {
        description: 'This is a test page description for SEO testing'
      }));

      const description = SEOManager.getMetaContent('description');
      expect(description).toBe('This is a test page description for SEO testing');
    });

    test('sets meta keywords', () => {
      render(React.createElement(SEOPage, {
        keywords: 'test, seo, meta, keywords'
      }));

      const keywords = SEOManager.getMetaContent('keywords');
      expect(keywords).toBe('test, seo, meta, keywords');
    });

    test('sets author meta tag', () => {
      render(React.createElement(SEOPage, {
        author: 'Jane Doe'
      }));

      const author = SEOManager.getMetaContent('author');
      expect(author).toBe('Jane Doe');
    });

    test('sets canonical URL', () => {
      render(React.createElement(SEOPage, {
        canonicalUrl: 'https://example.com/page'
      }));

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical?.getAttribute('href')).toBe('https://example.com/page');
    });
  });

  describe('Open Graph Tags', () => {
    test('sets Open Graph title', () => {
      render(React.createElement(SEOPage, {
        title: 'OG Test Title'
      }));

      const ogTitle = SEOManager.getMetaContent('og:title', true);
      expect(ogTitle).toBe('OG Test Title');
    });

    test('sets Open Graph description', () => {
      render(React.createElement(SEOPage, {
        description: 'OG test description'
      }));

      const ogDescription = SEOManager.getMetaContent('og:description', true);
      expect(ogDescription).toBe('OG test description');
    });

    test('sets Open Graph image', () => {
      render(React.createElement(SEOPage, {
        ogImage: 'https://example.com/og-image.jpg'
      }));

      const ogImage = SEOManager.getMetaContent('og:image', true);
      expect(ogImage).toBe('https://example.com/og-image.jpg');
    });

    test('sets Open Graph URL', () => {
      render(React.createElement(SEOPage, {
        canonicalUrl: 'https://example.com/og-page'
      }));

      const ogUrl = SEOManager.getMetaContent('og:url', true);
      expect(ogUrl).toBe('https://example.com/og-page');
    });

    test('sets Open Graph type', () => {
      render(React.createElement(SEOPage));

      const ogType = SEOManager.getMetaContent('og:type', true);
      expect(ogType).toBe('website');
    });
  });

  describe('Twitter Card Tags', () => {
    test('sets Twitter card type', () => {
      render(React.createElement(SEOPage));

      const twitterCard = SEOManager.getMetaContent('twitter:card');
      expect(twitterCard).toBe('summary_large_image');
    });

    test('sets Twitter title', () => {
      render(React.createElement(SEOPage, {
        title: 'Twitter Test Title'
      }));

      const twitterTitle = SEOManager.getMetaContent('twitter:title');
      expect(twitterTitle).toBe('Twitter Test Title');
    });

    test('sets Twitter description', () => {
      render(React.createElement(SEOPage, {
        description: 'Twitter test description'
      }));

      const twitterDescription = SEOManager.getMetaContent('twitter:description');
      expect(twitterDescription).toBe('Twitter test description');
    });

    test('sets Twitter image', () => {
      render(React.createElement(SEOPage, {
        ogImage: 'https://example.com/twitter-image.jpg'
      }));

      const twitterImage = SEOManager.getMetaContent('twitter:image');
      expect(twitterImage).toBe('https://example.com/twitter-image.jpg');
    });
  });

  describe('Structured Data', () => {
    test('adds basic webpage structured data', () => {
      render(React.createElement(SEOPage, {
        title: 'Structured Data Test',
        description: 'Test description'
      }));

      expect(SEOManager.hasStructuredData('WebPage')).toBe(true);
    });

    test('adds article structured data', () => {
      render(React.createElement(ArticlePage, {
        title: 'Test Article',
        content: 'Article content goes here...',
        author: 'John Doe',
        publishDate: '2024-01-01',
        tags: ['technology', 'web development']
      }));

      expect(SEOManager.hasStructuredData('Article')).toBe(true);
    });

    test('adds product structured data', () => {
      const product = {
        name: 'Test Product',
        description: 'Product description',
        price: 99.99,
        image: 'https://example.com/product.jpg',
        rating: 4.5,
        reviewCount: 10
      };

      render(React.createElement(ProductPage, { product }));

      expect(SEOManager.hasStructuredData('Product')).toBe(true);
    });

    test('adds breadcrumb structured data', () => {
      const breadcrumbItems = [
        { name: 'Home', url: '/' },
        { name: 'Category', url: '/category' },
        { name: 'Current Page', url: '/category/page' }
      ];

      render(React.createElement(Breadcrumb, { items: breadcrumbItems }));

      expect(SEOManager.hasStructuredData('BreadcrumbList')).toBe(true);
    });

    test('validates structured data format', () => {
      render(React.createElement(SEOPage, {
        title: 'Schema Test'
      }));

      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const script = Array.from(scripts).find(s => {
        try {
          const data = JSON.parse(s.textContent);
          return data['@type'] === 'WebPage';
        } catch {
          return false;
        }
      });

      expect(script).toBeTruthy();

      const data = JSON.parse(script.textContent);
      expect(data).toHaveProperty('@context', 'https://schema.org');
      expect(data).toHaveProperty('@type', 'WebPage');
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('description');
    });
  });

  describe('Article-Specific SEO', () => {
    test('sets article published time', () => {
      render(React.createElement(ArticlePage, {
        title: 'Article Title',
        content: 'Article content',
        author: 'Jane Doe',
        publishDate: '2024-01-15'
      }));

      const publishedTime = SEOManager.getMetaContent('article:published_time', true);
      expect(publishedTime).toBe('2024-01-15');
    });

    test('sets article author', () => {
      render(React.createElement(ArticlePage, {
        title: 'Article Title',
        content: 'Article content',
        author: 'Jane Doe',
        publishDate: '2024-01-15'
      }));

      const articleAuthor = SEOManager.getMetaContent('article:author', true);
      expect(articleAuthor).toBe('Jane Doe');
    });

    test('sets article section', () => {
      render(React.createElement(ArticlePage, {
        title: 'Article Title',
        content: 'Article content',
        author: 'Jane Doe',
        publishDate: '2024-01-15'
      }));

      const articleSection = SEOManager.getMetaContent('article:section', true);
      expect(articleSection).toBe('Technology');
    });

    test('truncates description for meta tag', () => {
      const longContent = 'A'.repeat(200);
      
      render(React.createElement(ArticlePage, {
        title: 'Article Title',
        content: longContent,
        author: 'Jane Doe',
        publishDate: '2024-01-15'
      }));

      const description = SEOManager.getMetaContent('description');
      expect(description?.length).toBeLessThanOrEqual(160);
    });
  });

  describe('Language and Internationalization', () => {
    test('sets document language', () => {
      SEOManager.setLanguage('fr');
      
      expect(document.documentElement.getAttribute('lang')).toBe('fr');
    });

    test('adds alternate language links', () => {
      SEOManager.addAlternateLanguage('es', 'https://example.com/es/');
      SEOManager.addAlternateLanguage('fr', 'https://example.com/fr/');

      const alternateLinks = document.querySelectorAll('link[rel="alternate"]');
      expect(alternateLinks).toHaveLength(2);

      const esLink = Array.from(alternateLinks).find(link => 
        link.getAttribute('hreflang') === 'es'
      );
      expect(esLink?.getAttribute('href')).toBe('https://example.com/es/');
    });
  });

  describe('SEO Best Practices', () => {
    test('title length is within recommended range', () => {
      const longTitle = 'A'.repeat(70);
      
      render(React.createElement(SEOPage, {
        title: longTitle
      }));

      expect(document.title.length).toBeLessThanOrEqual(60);
    });

    test('meta description length is within recommended range', () => {
      const description = 'This is a test meta description that should be within the recommended length for SEO purposes';
      
      render(React.createElement(SEOPage, {
        description
      }));

      const metaDescription = SEOManager.getMetaContent('description');
      expect(metaDescription?.length).toBeLessThanOrEqual(160);
      expect(metaDescription?.length).toBeGreaterThanOrEqual(120);
    });

    test('has robots meta tag', () => {
      SEOManager.setMetaTag('robots', 'index, follow');
      
      const robots = SEOManager.getMetaContent('robots');
      expect(robots).toBe('index, follow');
    });

    test('has viewport meta tag', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      expect(viewport).toBeTruthy();
      expect(viewport?.getAttribute('content')).toContain('width=device-width');
    });

    test('uses semantic HTML structure', () => {
      render(React.createElement(ArticlePage, {
        title: 'Semantic Article',
        content: 'Article content',
        author: 'Author',
        publishDate: '2024-01-01'
      }));

      const article = screen.getByTestId('article-page');
      expect(article.tagName.toLowerCase()).toBe('article');
    });
  });

  describe('Performance and Core Web Vitals', () => {
    test('preloads critical resources', () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = '/critical.css';
      link.as = 'style';
      document.head.appendChild(link);

      const preloadLink = document.querySelector('link[rel="preload"]');
      expect(preloadLink).toBeTruthy();
      expect(preloadLink?.getAttribute('as')).toBe('style');
    });

    test('sets appropriate cache headers via meta tags', () => {
      SEOManager.setMetaTag('cache-control', 'public, max-age=3600');
      
      const cacheControl = SEOManager.getMetaContent('cache-control');
      expect(cacheControl).toBe('public, max-age=3600');
    });
  });

  describe('Rich Snippets', () => {
    test('provides FAQ structured data', () => {
      const faqData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is SEO?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SEO stands for Search Engine Optimization.'
            }
          }
        ]
      };

      SEOManager.addStructuredData(faqData);
      
      expect(SEOManager.hasStructuredData('FAQPage')).toBe(true);
    });

    test('provides organization structured data', () => {
      const orgData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Test Company',
        url: 'https://example.com',
        logo: 'https://example.com/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-555-0123',
          contactType: 'Customer Service'
        }
      };

      SEOManager.addStructuredData(orgData);
      
      expect(SEOManager.hasStructuredData('Organization')).toBe(true);
    });
  });

  describe('Local SEO', () => {
    test('provides local business structured data', () => {
      const businessData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Test Restaurant',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '123 Main St',
          addressLocality: 'Anytown',
          addressRegion: 'CA',
          postalCode: '12345'
        },
        telephone: '+1-555-0123',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 40.7128,
          longitude: -74.0060
        }
      };

      SEOManager.addStructuredData(businessData);
      
      expect(SEOManager.hasStructuredData('LocalBusiness')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('handles missing meta tags gracefully', () => {
      const nonExistent = SEOManager.getMetaContent('non-existent-tag');
      expect(nonExistent).toBeNull();
    });

    test('handles invalid structured data', () => {
      const invalidData = { invalidProperty: 'test' };
      
      expect(() => {
        SEOManager.addStructuredData(invalidData);
      }).not.toThrow();
    });

    test('validates structured data JSON format', () => {
      SEOManager.addStructuredData({ '@type': 'WebPage' });
      
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const lastScript = scripts[scripts.length - 1];
      
      expect(() => {
        JSON.parse(lastScript.textContent);
      }).not.toThrow();
    });
  });
});
