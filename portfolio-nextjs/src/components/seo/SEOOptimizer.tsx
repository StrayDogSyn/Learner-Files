import { Metadata } from 'next';

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  url?: string;
  image?: string;
  type?: string;
  structuredData?: object;
}

export function generateSEOMetadata({
  title = 'Petro Kolosov - Full Stack Developer & AI Specialist',
  description = 'Experienced full-stack developer specializing in React, TypeScript, Node.js, and AI integration. Building modern web applications with cutting-edge technologies.',
  keywords = 'full stack developer, React, TypeScript, Node.js, AI integration, web development, software engineer',
  author = 'Petro Kolosov',
  url = 'https://petrokolosov.dev',
  image = '/images/og-image.jpg',
  type = 'website'
}: SEOOptimizerProps = {}): Metadata {
  return {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    robots: 'index, follow',
    alternates: {
      canonical: url
    },
    openGraph: {
      type: type as 'website' | 'article' | 'profile',
      title,
      description,
      url,
      siteName: 'Petro Kolosov Portfolio',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@petrokolosov'
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png'
    },
    themeColor: '#0F172A',
    other: {
      'msapplication-TileColor': '#0F172A'
    }
  };
}

export function generateStructuredData({
  title = 'Petro Kolosov - Full Stack Developer & AI Specialist',
  description = 'Experienced full-stack developer specializing in React, TypeScript, Node.js, and AI integration. Building modern web applications with cutting-edge technologies.',
  author = 'Petro Kolosov',
  url = 'https://petrokolosov.dev',
  image = '/images/og-image.jpg',
  structuredData
}: SEOOptimizerProps = {}) {
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${url}#person`,
        name: author,
        url: url,
        image: {
          '@type': 'ImageObject',
          url: image
        },
        jobTitle: 'Full Stack Developer',
        worksFor: {
          '@type': 'Organization',
          name: 'Freelance'
        },
        sameAs: [
          'https://github.com/petrokolosov',
          'https://linkedin.com/in/petrokolosov'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url: url,
        name: title,
        description: description,
        publisher: {
          '@id': `${url}#person`
        },
        inLanguage: 'en-US'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: url
          }
        ]
      }
    ]
  };

  return structuredData || defaultStructuredData;
}

// Component for structured data script tag
export function StructuredDataScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
}

// Main SEO component
export default function SEOOptimizer() {
  const structuredData = generateStructuredData({});
  
  return (
    <>
      <StructuredDataScript data={structuredData} />
    </>
  );
}