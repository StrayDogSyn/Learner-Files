import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers';
import { PerformanceProvider } from '@/components/providers/PerformanceProvider';
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';
import PerformanceOptimizer from '@/components/performance/PerformanceOptimizer';
import SEOOptimizer from '@/components/seo/SEOOptimizer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: {
    default: 'StrayDog Syndications - AI-Enhanced Full Stack Developer',
    template: '%s | StrayDog Syndications'
  },
  description: 'Professional portfolio showcasing AI integration, justice reform technology, and modern full-stack development. Specializing in Next.js, TypeScript, Claude 4.1, and AI-powered applications for legal and justice systems.',
  keywords: [
    'Full Stack Developer',
    'AI Integration',
    'Claude 4.1',
    'Justice Reform Technology',
    'Next.js',
    'TypeScript',
    'React',
    'Portfolio',
    'Machine Learning',
    'Legal Technology',
    'Court Automation',
    'Bias Detection',
    'Rehabilitation Support',
    'Three.js',
    'Framer Motion',
    'Tailwind CSS',
    'GitHub Pages',
    'Responsive Design',
    'SEO Optimization'
  ],
  authors: [{ name: 'StrayDog Syndications', url: 'https://straydogsyn.github.io/Learner-Files/' }],
  creator: 'StrayDog Syndications',
  publisher: 'StrayDog Syndications',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/Learner-Files/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' }
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover'
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION,
    }
  },
  alternates: {
    canonical: 'https://straydogsyn.github.io/Learner-Files/',
    languages: {
      'en-US': 'https://straydogsyn.github.io/Learner-Files/',
    },
  },
  category: 'technology',
  classification: 'Portfolio Website',
  other: {
    'cache-control': 'public, max-age=31536000, immutable',
    'version': '2.1.0-phase-b',
    'build-time': new Date().toISOString(),
    'generator': 'Next.js 15.4.6',
    'application-name': 'StrayDog Syndications Portfolio',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Portfolio',
    'format-detection': 'telephone=no',
    'HandheldFriendly': 'true',
    'MobileOptimized': '320',
    'referrer': 'origin-when-cross-origin',
    'color-scheme': 'dark light',
    'supported-color-schemes': 'dark light'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StrayDog Portfolio',
    startupImage: [
      {
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20app%20startup%20screen%20dark%20theme%20professional%20portfolio&image_size=portrait_16_9',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
      }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://straydogsyn.github.io/Learner-Files/',
    siteName: 'StrayDog Syndications Portfolio',
    title: 'StrayDog Syndications - AI-Enhanced Full Stack Developer',
    description: 'Professional portfolio showcasing AI integration, justice reform technology, and modern full-stack development. Specializing in Next.js, TypeScript, Claude 4.1, and AI-powered applications for legal systems.',
    images: [
      {
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20portfolio%20website%20modern%20design%20AI%20technology%20justice%20reform%20dark%20theme%20futuristic&image_size=landscape_16_9',
        width: 1200,
        height: 630,
        alt: 'StrayDog Syndications Portfolio - AI-Enhanced Full Stack Developer',
        type: 'image/png'
      },
      {
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20integration%20justice%20reform%20technology%20modern%20web%20development%20portfolio&image_size=square_hd',
        width: 800,
        height: 800,
        alt: 'AI Integration & Justice Reform Technology',
        type: 'image/png'
      }
    ],
    videos: [
      {
        url: 'https://straydogsyn.github.io/Learner-Files/demo-video.mp4',
        width: 1280,
        height: 720,
        type: 'video/mp4'
      }
    ],
    audio: [
      {
        url: 'https://straydogsyn.github.io/Learner-Files/intro-audio.mp3',
        type: 'audio/mpeg'
      }
    ],
    determiner: 'the',
    countryName: 'United States',
    emails: ['contact@straydogsyn.com'],
    phoneNumbers: ['+1-555-JUSTICE'],
    faxNumbers: ['+1-555-FAX-TECH'],
    alternateLocale: ['en_GB', 'en_CA'],
    tags: ['AI', 'Justice Reform', 'Full Stack', 'Next.js', 'TypeScript', 'Portfolio']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@straydogsyn',
    creator: '@straydogsyn',
    title: 'StrayDog Syndications - AI-Enhanced Full Stack Developer',
    description: 'Professional portfolio showcasing AI integration, justice reform technology, and modern full-stack development. Specializing in Claude 4.1 and legal system automation.',
    images: {
      url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20portfolio%20website%20modern%20design%20AI%20technology%20justice%20reform%20dark%20theme%20futuristic&image_size=landscape_16_9',
      alt: 'StrayDog Syndications Portfolio - AI-Enhanced Full Stack Developer'
    },
    app: {
      name: {
        iphone: 'StrayDog Portfolio',
        ipad: 'StrayDog Portfolio',
        googleplay: 'StrayDog Portfolio'
      },
      id: {
        iphone: 'com.straydogsyn.portfolio',
        ipad: 'com.straydogsyn.portfolio',
        googleplay: 'com.straydogsyn.portfolio'
      },
      url: {
        iphone: 'https://straydogsyn.github.io/Learner-Files/',
        ipad: 'https://straydogsyn.github.io/Learner-Files/',
        googleplay: 'https://straydogsyn.github.io/Learner-Files/'
      }
    }
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: [
      { url: '/Learner-Files/favicon.ico' },
      { url: '/Learner-Files/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/Learner-Files/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/Learner-Files/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/Learner-Files/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/Learner-Files/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/Learner-Files/safari-pinned-tab.svg',
        color: '#0F172A'
      }
    ]
  },
  bookmarks: ['https://straydogsyn.github.io/Learner-Files/'],
  archives: ['https://straydogsyn.github.io/Learner-Files/sitemap.xml']
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <SEOOptimizer />
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS */
            body { margin: 0; padding: 0; background: #0a0a0f; color: white; }
            .hero-section { min-height: 100vh; display: flex; align-items: center; }
            .loading-spinner { 
              width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1);
              border-top: 3px solid #3b82f6; border-radius: 50%; 
              animation: spin 1s linear infinite; margin: 20px auto;
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `
        }} />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external APIs */}
        <link rel="dns-prefetch" href="//api.github.com" />
        <link rel="dns-prefetch" href="//trae-api-us.mchost.guru" />
        
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "StrayDog Syndications",
              "jobTitle": "AI-Enhanced Full Stack Developer",
              "description": "Professional full stack developer specializing in AI integration, justice reform technology, and modern web development.",
              "url": "https://straydogsyn.github.io/Learner-Files/",
              "image": "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20portrait%20AI%20technology%20justice%20reform&image_size=square_hd",
              "sameAs": [
                "https://github.com/straydogsyn",
                "https://linkedin.com/in/straydogsyn",
                "https://twitter.com/straydogsyn"
              ],
              "knowsAbout": [
                "Artificial Intelligence",
                "Machine Learning",
                "Justice Reform Technology",
                "Full Stack Development",
                "Next.js",
                "TypeScript",
                "React",
                "Claude 4.1",
                "Legal Technology",
                "Court Automation",
                "Bias Detection Systems",
                "Rehabilitation Support"
              ],
              "hasOccupation": {
                "@type": "Occupation",
                "name": "Full Stack Developer",
                "occupationLocation": {
                  "@type": "Country",
                  "name": "United States"
                },
                "skills": [
                  "JavaScript",
                  "TypeScript",
                  "React",
                  "Next.js",
                  "Node.js",
                  "Python",
                  "AI Integration",
                  "Machine Learning",
                  "Database Design",
                  "API Development",
                  "Cloud Computing",
                  "DevOps"
                ]
              },
              "worksFor": {
                "@type": "Organization",
                "name": "StrayDog Syndications",
                "url": "https://straydogsyn.github.io/Learner-Files/",
                "description": "Technology consulting focused on AI integration and justice reform solutions."
              },
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Technology Institute"
              },
              "award": [
                "AI Innovation in Justice Reform",
                "Excellence in Full Stack Development",
                "Outstanding Portfolio Design"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "contact@straydogsyn.com",
                "contactType": "Professional Inquiry",
                "availableLanguage": "English"
              }
            })
          }}
        />
        
        {/* Website Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "StrayDog Syndications Portfolio",
              "url": "https://straydogsyn.github.io/Learner-Files/",
              "description": "Professional portfolio showcasing AI integration, justice reform technology, and modern full-stack development.",
              "author": {
                "@type": "Person",
                "name": "StrayDog Syndications"
              },
              "publisher": {
                "@type": "Organization",
                "name": "StrayDog Syndications",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://straydogsyn.github.io/Learner-Files/logo.png"
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://straydogsyn.github.io/Learner-Files/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "WebPage",
                "@id": "https://straydogsyn.github.io/Learner-Files/#main",
                "name": "Portfolio Homepage",
                "description": "Main portfolio page showcasing projects, skills, and AI integration expertise."
              },
              "inLanguage": "en-US",
              "copyrightYear": new Date().getFullYear(),
              "copyrightHolder": {
                "@type": "Person",
                "name": "StrayDog Syndications"
              },
              "license": "https://creativecommons.org/licenses/by/4.0/",
              "isAccessibleForFree": true,
              "audience": {
                "@type": "Audience",
                "audienceType": "Recruiters, Clients, Technology Professionals"
              }
            })
          }}
        />
        
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "StrayDog Syndications",
              "url": "https://straydogsyn.github.io/Learner-Files/",
              "logo": "https://straydogsyn.github.io/Learner-Files/logo.png",
              "description": "Technology consulting and development services specializing in AI integration and justice reform solutions.",
              "foundingDate": "2023",
              "founder": {
                "@type": "Person",
                "name": "StrayDog Syndications"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-JUSTICE",
                "email": "contact@straydogsyn.com",
                "contactType": "Customer Service",
                "availableLanguage": "English"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US",
                "addressRegion": "United States"
              },
              "sameAs": [
                "https://github.com/straydogsyn",
                "https://linkedin.com/company/straydogsyn",
                "https://twitter.com/straydogsyn"
              ],
              "knowsAbout": [
                "AI Development",
                "Justice Reform Technology",
                "Full Stack Development",
                "Web Applications",
                "Machine Learning",
                "Legal Technology"
              ],
              "areaServed": "Worldwide",
              "serviceType": [
                "Web Development",
                "AI Integration",
                "Technology Consulting",
                "Justice Reform Solutions"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AnalyticsProvider enableConsoleLogging={process.env.NODE_ENV === 'development'}>
          <ThemeProvider>
            <PerformanceProvider>
              <PerformanceOptimizer>
                {children}
              </PerformanceOptimizer>
            </PerformanceProvider>
          </ThemeProvider>
        </AnalyticsProvider>
        
        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    // Service worker registered successfully
                  })
                  .catch(function(registrationError) {
                    // Service worker registration failed
                  });
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
