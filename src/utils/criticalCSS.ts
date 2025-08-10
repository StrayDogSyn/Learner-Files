/**
 * Critical CSS Performance Utilities
 * Handles inline critical CSS and deferred loading of non-critical styles
 */

// Import performance types for gtag
import '../types/performance';

// Critical CSS content for inline injection
export const criticalCSS = `
/* Critical above-the-fold styles - minified for performance */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
:root{--color-charcoal:#1C1C1C;--color-hunter-green:#355E3B;--color-hunter-green-light:#50C878;--color-metallic:#C0C0C0;--color-metallic-light:#D7D7D7;--color-glass-base:rgba(43,43,43,0.15);--color-glass-border:rgba(192,192,192,0.2);--font-heading:'Orbitron',sans-serif;--font-body:'Inter',sans-serif;--backdrop-blur-lg:blur(12px);--transition-normal:250ms ease-in-out;--space-4:1rem;--space-6:1.5rem;--space-8:2rem;--radius-2xl:1.25rem;--z-sticky:1020}*{box-sizing:border-box;margin:0;padding:0}html{font-size:16px;scroll-behavior:smooth;-webkit-font-smoothing:antialiased}body{font-family:var(--font-body);color:var(--color-metallic-light);background:linear-gradient(135deg,#2B2B2B 0%,#1C1C1C 100%);min-height:100vh;overflow-x:hidden}#root{min-height:100vh;display:flex;flex-direction:column}.navigation{position:fixed;top:0;left:0;right:0;z-index:var(--z-sticky);background:var(--color-glass-base);backdrop-filter:var(--backdrop-blur-lg);-webkit-backdrop-filter:var(--backdrop-blur-lg);border-bottom:1px solid var(--color-glass-border)}.nav-container{display:flex;align-items:center;justify-content:space-between;height:4rem;padding:0 var(--space-4)}.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;padding-top:4rem}.hero-content{text-align:center;max-width:800px;padding:0 var(--space-4)}.hero-title{font-family:var(--font-heading);font-size:2.25rem;font-weight:900;line-height:1.25;margin-bottom:var(--space-6);background:linear-gradient(135deg,var(--color-metallic-light),var(--color-metallic));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}@media(min-width:640px){.hero-title{font-size:3rem}}@media(min-width:1024px){.hero-title{font-size:3.75rem}}
`;

// Non-critical CSS files to load after initial render
const nonCriticalCSS = [
  '/src/css/design-tokens.css',
  '/src/css/animations.css',
  '/src/css/components.css',
  '/src/css/utilities.css'
];

/**
 * Injects critical CSS directly into the document head
 * This ensures immediate styling for above-the-fold content
 */
export function injectCriticalCSS(): void {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
}

/**
 * Loads non-critical CSS files asynchronously after initial render
 * Uses requestIdleCallback for optimal performance
 */
export function loadNonCriticalCSS(): void {
  if (typeof document === 'undefined') return;

  const loadCSS = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; // Load as print to avoid render blocking
    link.onload = () => {
      link.media = 'all'; // Switch to all media types once loaded
    };
    document.head.appendChild(link);
  };

  // Use requestIdleCallback for better performance
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      nonCriticalCSS.forEach(loadCSS);
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      nonCriticalCSS.forEach(loadCSS);
    }, 100);
  }
}

/**
 * Preloads critical resources for better performance
 */
export function preloadCriticalResources(): void {
  if (typeof document === 'undefined') return;

  const resources = [
    {
      href: 'https://fonts.googleapis.com',
      rel: 'preconnect'
    },
    {
      href: 'https://fonts.gstatic.com',
      rel: 'preconnect',
      crossorigin: 'anonymous'
    },
    {
      href: 'https://api.github.com',
      rel: 'dns-prefetch'
    }
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = resource.rel;
    link.href = resource.href;
    if (resource.crossorigin) {
      link.crossOrigin = resource.crossorigin;
    }
    document.head.appendChild(link);
  });
}

/**
 * Optimizes font loading with font-display: swap
 */
export function optimizeFontLoading(): void {
  if (typeof document === 'undefined') return;

  const fontCSS = `
    @font-face {
      font-family: 'Orbitron';
      font-style: normal;
      font-weight: 400 900;
      font-display: swap;
      src: url('https://fonts.gstatic.com/s/orbitron/v29/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
  `;

  const style = document.createElement('style');
  style.textContent = fontCSS;
  style.setAttribute('data-fonts', 'true');
  document.head.appendChild(style);
}

/**
 * Measures and reports Core Web Vitals
 */
export function measureCoreWebVitals(): void {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
      
      // Report to analytics if available
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'web_vitals', {
          event_category: 'performance',
          event_label: 'LCP',
          value: Math.round(lastEntry.startTime)
        });
      }
    });
    
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if ('processingStart' in entry && 'startTime' in entry) {
          console.log('FID:', entry.processingStart - entry.startTime);
          
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vitals', {
              event_category: 'performance',
              event_label: 'FID',
              value: Math.round(entry.processingStart - entry.startTime)
            });
          }
        }
      });
    });
    
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if ('hadRecentInput' in entry && !entry.hadRecentInput && 'value' in entry) {
          clsValue += entry.value;
        }
      });
      
      console.log('CLS:', clsValue);
      
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'web_vitals', {
          event_category: 'performance',
          event_label: 'CLS',
          value: Math.round(clsValue * 1000)
        });
      }
    });
    
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

/**
 * Initializes all critical CSS optimizations
 */
export function initializeCriticalCSS(): void {
  // Inject critical CSS immediately
  injectCriticalCSS();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Optimize font loading
  optimizeFontLoading();
  
  // Load non-critical CSS after initial render
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNonCriticalCSS);
  } else {
    loadNonCriticalCSS();
  }
  
  // Start measuring Core Web Vitals
  measureCoreWebVitals();
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined' && document.readyState !== 'complete') {
  initializeCriticalCSS();
}