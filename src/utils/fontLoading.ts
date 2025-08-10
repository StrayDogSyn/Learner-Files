// Font Loading Optimization Utilities
// Handles Google Fonts preconnect hints, font-display swap, and performance optimization

import { useState, useEffect } from 'react';

export interface FontConfig {
  family: string;
  weights: number[];
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
}

export interface FontLoadingOptions {
  timeout?: number;
  fallback?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Font configurations for the portfolio
export const PORTFOLIO_FONTS: FontConfig[] = [
  {
    family: 'Orbitron',
    weights: [400, 500, 700, 900],
    display: 'swap',
    preload: true
  },
  {
    family: 'Inter',
    weights: [300, 400, 500, 600, 700],
    display: 'swap',
    preload: true
  }
];

/**
 * Creates preconnect links for Google Fonts
 */
export function createFontPreconnects(): void {
  if (typeof document === 'undefined') return;

  const preconnects = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  preconnects.forEach(href => {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      if (href.includes('gstatic')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    }
  });
}

/**
 * Generates Google Fonts URL with optimizations
 */
export function generateFontURL(fonts: FontConfig[]): string {
  const baseURL = 'https://fonts.googleapis.com/css2';
  const families = fonts.map(font => {
    const weights = font.weights.join(';');
    return `family=${font.family.replace(' ', '+')}:wght@${weights}`;
  }).join('&');
  
  return `${baseURL}?${families}&display=swap`;
}

/**
 * Preloads critical font files
 */
export function preloadCriticalFonts(fonts: FontConfig[]): void {
  if (typeof document === 'undefined') return;

  fonts.forEach(font => {
    if (font.preload) {
      // Preload the most critical weight (usually 400)
      const criticalWeight = font.weights.includes(400) ? 400 : font.weights[0];
      const fontURL = `https://fonts.gstatic.com/s/${font.family.toLowerCase()}/v1/${font.family.toLowerCase()}-${criticalWeight}.woff2`;
      
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = fontURL;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
}

/**
 * Loads fonts asynchronously with fallback
 */
export async function loadFontsAsync(
  fonts: FontConfig[],
  options: FontLoadingOptions = {}
): Promise<void> {
  const { timeout = 3000, fallback, onLoad, onError } = options;

  try {
    // Create font face declarations
    const fontPromises = fonts.flatMap(font =>
      font.weights.map(weight => {
        const fontFace = new FontFace(
          font.family,
          `url(https://fonts.gstatic.com/s/${font.family.toLowerCase()}/v1/${font.family.toLowerCase()}-${weight}.woff2)`,
          {
            weight: weight.toString(),
            display: font.display
          }
        );
        
        return fontFace.load();
      })
    );

    // Load fonts with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Font loading timeout')), timeout);
    });

    await Promise.race([
      Promise.all(fontPromises),
      timeoutPromise
    ]);

    // Add loaded fonts to document
    const loadedFonts = await Promise.allSettled(fontPromises);
    loadedFonts.forEach(result => {
      if (result.status === 'fulfilled') {
        document.fonts.add(result.value);
      }
    });

    onLoad?.();
  } catch (error) {
    console.warn('Font loading failed, using fallback:', error);
    
    if (fallback) {
      document.body.style.fontFamily = fallback;
    }
    
    onError?.(error as Error);
  }
}

/**
 * Creates CSS font-face declarations
 */
export function createFontFaceCSS(fonts: FontConfig[]): string {
  return fonts.map(font => {
    return font.weights.map(weight => {
      return `
@font-face {
  font-family: '${font.family}';
  font-style: normal;
  font-weight: ${weight};
  font-display: ${font.display};
  src: url('https://fonts.gstatic.com/s/${font.family.toLowerCase()}/v1/${font.family.toLowerCase()}-${weight}.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`;
    }).join('');
  }).join('');
}

/**
 * Font loading performance monitor
 */
export class FontLoadingMonitor {
  private startTime: number;
  private fonts: FontConfig[];
  private metrics: {
    loadTime: number;
    success: boolean;
    failedFonts: string[];
  } = {
    loadTime: 0,
    success: false,
    failedFonts: []
  };

  constructor(fonts: FontConfig[]) {
    this.fonts = fonts;
    this.startTime = performance.now();
  }

  async monitor(): Promise<typeof this.metrics> {
    try {
      await loadFontsAsync(this.fonts, {
        timeout: 3000,
        onLoad: () => {
          this.metrics.success = true;
          this.metrics.loadTime = performance.now() - this.startTime;
        },
        onError: (error) => {
          this.metrics.success = false;
          this.metrics.loadTime = performance.now() - this.startTime;
          console.error('Font loading error:', error);
        }
      });
    } catch (error) {
      this.metrics.success = false;
      this.metrics.loadTime = performance.now() - this.startTime;
    }

    return this.metrics;
  }

  getMetrics() {
    return this.metrics;
  }
}

/**
 * React hook for font loading
 */
export function useFontLoading(fonts: FontConfig[] = PORTFOLIO_FONTS) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Create preconnects
        createFontPreconnects();
        
        // Load fonts
        await loadFontsAsync(fonts, {
          onLoad: () => setIsLoaded(true),
          onError: (err) => setError(err)
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFonts();
  }, []);

  return { isLoading, isLoaded, error };
}

/**
 * Initialize font loading optimization
 */
export function initializeFontLoading(): void {
  if (typeof document === 'undefined') return;

  // Create preconnects immediately
  createFontPreconnects();
  
  // Preload critical fonts
  preloadCriticalFonts(PORTFOLIO_FONTS);
  
  // Add font loading CSS to head
  const style = document.createElement('style');
  style.textContent = `
    /* Font loading optimization */
    .font-loading {
      font-family: system-ui, -apple-system, sans-serif;
    }
    
    .font-loaded {
      font-family: var(--font-primary), system-ui, -apple-system, sans-serif;
    }
    
    /* Prevent FOIT (Flash of Invisible Text) */
    @supports (font-display: swap) {
      * {
        font-display: swap;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Load fonts asynchronously
  loadFontsAsync(PORTFOLIO_FONTS, {
    onLoad: () => {
      document.body.classList.remove('font-loading');
      document.body.classList.add('font-loaded');
    },
    onError: (error) => {
      console.warn('Font loading failed:', error);
      document.body.classList.remove('font-loading');
    }
  });
}

// Auto-initialize on import in browser environment
if (typeof window !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFontLoading);
} else if (typeof window !== 'undefined') {
  initializeFontLoading();
}

export default {
  PORTFOLIO_FONTS,
  createFontPreconnects,
  generateFontURL,
  preloadCriticalFonts,
  loadFontsAsync,
  createFontFaceCSS,
  FontLoadingMonitor,
  useFontLoading,
  initializeFontLoading
};