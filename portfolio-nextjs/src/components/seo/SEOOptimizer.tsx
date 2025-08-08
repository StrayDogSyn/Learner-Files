'use client';

import React from 'react';
import Head from 'next/head';

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  structuredData?: object;
}

const SEOOptimizer: React.FC<SEOOptimizerProps> = ({
  title = 'Portfolio - Full Stack Developer & AI Specialist',
  description = 'Professional portfolio showcasing cutting-edge web development, AI integration, and modern design. Specializing in React, Next.js, TypeScript, and AI-powered applications.',
  keywords = ['Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'AI', 'Machine Learning', 'Web Development', 'Portfolio'],
  author = 'Portfolio Developer',
  url = 'https://your-portfolio.com',
  image = 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20portfolio%20website%20modern%20design%20technology%20showcase&image_size=landscape_16_9',
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags,
  structuredData
}) => {
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author,
    jobTitle: 'Full Stack Developer & AI Specialist',
    description: description,
    url: url,
    image: image,
    sameAs: [
      'https://github.com/your-username',
      'https://linkedin.com/in/your-profile',
      'https://twitter.com/your-handle'
    ],
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Python',
      'Artificial Intelligence',
      'Machine Learning',
      'Web Development',
      'Software Engineering'
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Your University'
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance Developer'
    }
  };

  const portfolioStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    description: description,
    url: url,
    author: {
      '@type': 'Person',
      name: author
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: url
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: `${url}/projects`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Contact',
        item: `${url}/contact`
      }
    ]
  };

  const finalStructuredData = structuredData || {
    '@graph': [defaultStructuredData, portfolioStructuredData, breadcrumbStructuredData]
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
          <meta property="article:author" content={author} />
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@your-handle" />
      <meta name="twitter:site" content="@your-handle" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1a1a2e" />
      <meta name="msapplication-TileColor" content="#1a1a2e" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1a1a2e" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.github.com" />
      <link rel="preconnect" href="https://trae-api-us.mchost.guru" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//api.github.com" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />
      
      {/* Performance and Security Headers */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* PWA Meta Tags */}
      <meta name="application-name" content="Portfolio" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Portfolio" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Alternate Languages */}
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </Head>
  );
};

export default SEOOptimizer;