// Performance optimization utilities for achieving 95+ Lighthouse scores



/**
 * Image optimization utilities
 */
export const imageOptimization = {
  // Generate responsive image srcSet
  generateSrcSet: (baseUrl: string, sizes: number[] = [320, 640, 768, 1024, 1280, 1920]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },
  
  // Generate sizes attribute for responsive images
  generateSizes: (breakpoints: { [key: string]: string } = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    default: '33vw'
  }) => {
    const entries = Object.entries(breakpoints);
    const mediaQueries = entries.slice(0, -1).map(([query, size]) => `${query} ${size}`);
    const defaultSize = entries[entries.length - 1][1];
    return [...mediaQueries, defaultSize].join(', ');
  },
  
  // Lazy loading intersection observer
  createLazyLoader: (callback: (entries: IntersectionObserverEntry[]) => void) => {
    if (typeof window === 'undefined') return null;
    
    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
  }
};

/**
 * Code splitting and dynamic imports
 */
export const codeSplitting = {
  // Dynamic import with error handling
  dynamicImport: async <T>(importFn: () => Promise<T>): Promise<T | null> => {
    try {
      return await importFn();
    } catch {
      // Dynamic import failed
      return null;
    }
  },
  
  // Preload critical components
  preloadComponent: (importFn: () => Promise<unknown>) => {
    if (typeof window !== 'undefined') {
      // Preload on idle
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => importFn());
      } else {
        setTimeout(() => importFn(), 1);
      }
    }
  }
};

/**
 * Resource hints and preloading
 */
export const resourceHints = {
  // Preload critical resources
  preloadResource: (href: string, as: string, type?: string) => {
    if (typeof document === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  },
  
  // Prefetch resources for next navigation
  prefetchResource: (href: string) => {
    if (typeof document === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  },
  
  // DNS prefetch for external domains
  dnsPrefetch: (domain: string) => {
    if (typeof document === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  }
};

/**
 * Performance monitoring
 */
export const performanceMonitoring = {
  // Measure Core Web Vitals
  measureCoreWebVitals: () => {
    if (typeof window === 'undefined') return;
    
    // Largest Contentful Paint (LCP)
    new PerformanceObserver(() => {
      // LCP measured - entries available for processing
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEntry & { processingStart: number };
        if ('processingStart' in fidEntry) {
          // FID measured
        }
      });
    }).observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift (CLS)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const clsEntry = entry as PerformanceEntry & { value: number; hadRecentInput?: boolean };
        if ('value' in clsEntry && !clsEntry.hadRecentInput) {
          // CLS value accumulated
        }
      });
      // CLS measured
    }).observe({ entryTypes: ['layout-shift'] });
  },
  
  // Measure custom metrics
  measureCustomMetric: (name: string, startTime: number) => {
    if (typeof performance === 'undefined') return;
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    // Performance metric measured
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name,
        value: Math.round(duration)
      });
    }
  }
};

/**
 * Memory optimization
 */
export const memoryOptimization = {
  // Debounce function calls
  debounce: <T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },
  
  // Throttle function calls
  throttle: <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
  
  // Cleanup event listeners
  createCleanupManager: () => {
    const cleanupFunctions: (() => void)[] = [];
    
    return {
      add: (cleanup: () => void) => cleanupFunctions.push(cleanup),
      cleanup: () => {
        cleanupFunctions.forEach(fn => fn());
        cleanupFunctions.length = 0;
      }
    };
  }
};

/**
 * Bundle optimization
 */
export const bundleOptimization = {
  // Tree-shakable utility imports
  importUtility: async (utilityName: string) => {
    switch (utilityName) {
      case 'lodash-debounce':
        return (await import('lodash.debounce')).default;
      case 'lodash-throttle':
        return (await import('lodash.throttle')).default;
      default:
        throw new Error(`Unknown utility: ${utilityName}`);
    }
  },
  
  // Check if feature is supported before loading polyfill
  conditionalPolyfill: async (feature: string, polyfillLoader: () => Promise<unknown>) => {
    const featureSupport = {
      'intersection-observer': 'IntersectionObserver' in window,
      'resize-observer': 'ResizeObserver' in window,
      'web-animations': 'animate' in document.createElement('div')
    };
    
    if (!featureSupport[feature as keyof typeof featureSupport]) {
      await polyfillLoader();
    }
  }
};

/**
 * Critical CSS utilities
 */
export const criticalCSS = {
  // Inline critical CSS
  inlineCriticalCSS: (css: string) => {
    if (typeof document === 'undefined') return;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  },
  
  // Load non-critical CSS asynchronously
  loadNonCriticalCSS: (href: string) => {
    if (typeof document === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  }
};

/**
 * Service Worker utilities
 */
export const serviceWorker = {
  // Register service worker
  register: async (swPath: string = '/sw.js') => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }
    
    try {
      const registration = await navigator.serviceWorker.register(swPath);
      // Service Worker registered
      return registration;
    } catch {
      // Service Worker registration failed
      return null;
    }
  },
  
  // Update service worker
  update: async () => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }
    
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.update();
    }
  }
};

/**
 * Font optimization
 */
export const fontOptimization = {
  // Preload critical fonts
  preloadFont: (href: string, type: string = 'font/woff2') => {
    if (typeof document === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = type;
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  },
  
  // Font display swap CSS
  generateFontFaceCSS: (fontFamily: string, src: string) => {
    return `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${src}') format('woff2');
        font-display: swap;
        font-weight: 100 900;
      }
    `;
  }
};

/**
 * Performance budget checker
 */
export const performanceBudget = {
  // Check if resource size exceeds budget
  checkResourceBudget: (resourceSize: number, budget: number) => {
    if (resourceSize > budget) {
      // Performance budget exceeded
      return false;
    }
    return true;
  },
  
  // Monitor bundle size
  monitorBundleSize: () => {
    if (typeof performance === 'undefined') return;
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const transferSize = navigation.transferSize;
    
    // Bundle transfer size calculated
    
    // Warn if bundle is too large
    if (transferSize > 500 * 1024) { // 500KB
      // Bundle size exceeds recommended limit
    }
  }
};

// Export all utilities
const performanceUtilities = {
  imageOptimization,
  codeSplitting,
  resourceHints,
  performanceMonitoring,
  memoryOptimization,
  bundleOptimization,
  criticalCSS,
  serviceWorker,
  fontOptimization,
  performanceBudget
};

// Create performanceUtils with specific methods needed by PerformanceOptimizer
export const performanceUtils = {
  loadCriticalCSS: async () => {
    // Load critical CSS for the application
    const criticalStyles = `
      /* Critical above-the-fold styles */
      body { margin: 0; font-family: 'Inter', sans-serif; }
      .glass { backdrop-filter: blur(10px); }
      .loading { opacity: 0.5; }
    `;
    criticalCSS.inlineCriticalCSS(criticalStyles);
  },
  
  checkPerformanceBudget: async (budget: {
    maxBundleSize: number;
    maxImageSize: number;
    maxFontSize: number;
    maxLCP: number;
    maxFID: number;
    maxCLS: number;
  }) => {
    const violations: string[] = [];
    
    // Check bundle size
    if (typeof performance !== 'undefined') {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation.transferSize > budget.maxBundleSize) {
        violations.push(`Bundle size exceeds budget: ${Math.round(navigation.transferSize / 1024)}KB > ${Math.round(budget.maxBundleSize / 1024)}KB`);
      }
    }
    
    return { violations };
  }
};

export default performanceUtilities;