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
  title: 'StrayDog Syndications - AI-Enhanced Full Stack Developer',
  description: 'Professional portfolio showcasing AI integration, justice reform technology, and modern full-stack development. Specializing in Next.js, TypeScript, and AI-powered applications.',
  keywords: ['Full Stack Developer', 'AI Integration', 'Claude 4.1', 'Justice Reform Technology', 'Next.js', 'TypeScript', 'React', 'Portfolio'],
  authors: [{ name: 'StrayDog Syndications' }],
  creator: 'StrayDog Syndications',
  publisher: 'StrayDog Syndications',
  manifest: '/Learner-Files/manifest.json',
  themeColor: '#1a1a2e',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
    'pragma': 'no-cache',
    'expires': '0',
    'version': '2.0.0-emergency-sync'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Portfolio'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://straydogsyn.github.io/Learner-Files/',
    siteName: 'StrayDog Syndications',
    title: 'StrayDog Syndications - AI-Enhanced Full Stack Developer',
    description: 'Professional portfolio showcasing AI integration, justice reform technology, and modern full-stack development.',
    images: [{
      url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20portfolio%20website%20modern%20design%20technology%20showcase&image_size=landscape_16_9',
      width: 1200,
      height: 630,
      alt: 'Portfolio Preview'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StrayDog Syndications - AI-Enhanced Full Stack Developer',
    description: 'Professional portfolio showcasing AI integration, justice reform technology, and modern full-stack development.',
    images: ['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20portfolio%20website%20modern%20design%20technology%20showcase&image_size=landscape_16_9']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
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
