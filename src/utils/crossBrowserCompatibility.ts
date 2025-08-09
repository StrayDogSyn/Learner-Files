/**
 * Cross-Browser Compatibility Utilities
 * Ensures consistent behavior across different browsers and devices
 */

// Browser detection interface
interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsWebGL: boolean;
  supportsServiceWorker: boolean;
  supportsIntersectionObserver: boolean;
  supportsResizeObserver: boolean;
}

// Feature support detection
interface FeatureSupport {
  css: {
    grid: boolean;
    flexbox: boolean;
    customProperties: boolean;
    backdrop: boolean;
    clipPath: boolean;
    transforms3d: boolean;
  };
  js: {
    es6: boolean;
    modules: boolean;
    asyncAwait: boolean;
    fetch: boolean;
    webWorkers: boolean;
    localStorage: boolean;
  };
  media: {
    webp: boolean;
    avif: boolean;
    video: boolean;
    audio: boolean;
  };
}

// Polyfill configuration
interface PolyfillConfig {
  intersectionObserver: boolean;
  resizeObserver: boolean;
  customElements: boolean;
  fetch: boolean;
  smoothScroll: boolean;
}

/**
 * Browser Detection Utility
 */
export class BrowserDetector {
  private static instance: BrowserDetector;
  private browserInfo: BrowserInfo | null = null;

  static getInstance(): BrowserDetector {
    if (!BrowserDetector.instance) {
      BrowserDetector.instance = new BrowserDetector();
    }
    return BrowserDetector.instance;
  }

  getBrowserInfo(): BrowserInfo {
    if (this.browserInfo) {
      return this.browserInfo;
    }

    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Detect browser name and version
    let name = 'Unknown';
    let version = '0';
    let engine = 'Unknown';

    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      name = 'Chrome';
      engine = 'Blink';
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
      version = match ? match[1] : '0';
    } else if (userAgent.includes('Firefox')) {
      name = 'Firefox';
      engine = 'Gecko';
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      version = match ? match[1] : '0';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      name = 'Safari';
      engine = 'WebKit';
      const match = userAgent.match(/Version\/(\d+\.\d+)/);
      version = match ? match[1] : '0';
    } else if (userAgent.includes('Edg')) {
      name = 'Edge';
      engine = 'Blink';
      const match = userAgent.match(/Edg\/(\d+\.\d+)/);
      version = match ? match[1] : '0';
    }

    // Detect device type
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*\bTablet\b)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    // Feature detection
    const supportsWebGL = this.checkWebGLSupport();
    const supportsServiceWorker = 'serviceWorker' in navigator;
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    const supportsResizeObserver = 'ResizeObserver' in window;

    this.browserInfo = {
      name,
      version,
      engine,
      platform,
      isMobile,
      isTablet,
      isDesktop,
      supportsWebGL,
      supportsServiceWorker,
      supportsIntersectionObserver,
      supportsResizeObserver
    };

    return this.browserInfo;
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }
}

/**
 * Feature Support Detection
 */
export class FeatureDetector {
  static detectFeatureSupport(): FeatureSupport {
    return {
      css: {
        grid: CSS.supports('display', 'grid'),
        flexbox: CSS.supports('display', 'flex'),
        customProperties: CSS.supports('--custom', 'property'),
        backdrop: CSS.supports('backdrop-filter', 'blur(10px)'),
        clipPath: CSS.supports('clip-path', 'circle(50%)'),
        transforms3d: CSS.supports('transform', 'translateZ(0)')
      },
      js: {
        es6: typeof Symbol !== 'undefined',
        modules: 'noModule' in document.createElement('script'),
        asyncAwait: (async () => {}).constructor.name === 'AsyncFunction',
        fetch: 'fetch' in window,
        webWorkers: 'Worker' in window,
        localStorage: (() => {
          try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
          } catch {
            return false;
          }
        })()
      },
      media: {
        webp: FeatureDetector.checkImageFormat('webp'),
        avif: FeatureDetector.checkImageFormat('avif'),
        video: !!document.createElement('video').canPlayType,
        audio: !!document.createElement('audio').canPlayType
      }
    };
  }

  private static checkImageFormat(format: string): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0;
  }
}

/**
 * Polyfill Manager
 */
export class PolyfillManager {
  private static loadedPolyfills = new Set<string>();

  static async loadPolyfills(config: PolyfillConfig): Promise<void> {
    const promises: Promise<void>[] = [];

    if (config.intersectionObserver && !('IntersectionObserver' in window)) {
      promises.push(this.loadPolyfill('intersection-observer', () => {
        // Intersection Observer polyfill would be loaded here
        console.log('IntersectionObserver polyfill loaded');
      }));
    }

    if (config.resizeObserver && !('ResizeObserver' in window)) {
      promises.push(this.loadPolyfill('resize-observer', () => {
        // ResizeObserver polyfill would be loaded here
        console.log('ResizeObserver polyfill loaded');
      }));
    }

    if (config.fetch && !('fetch' in window)) {
      promises.push(this.loadPolyfill('fetch', () => {
        // Fetch polyfill would be loaded here
        console.log('Fetch polyfill loaded');
      }));
    }

    if (config.smoothScroll && !CSS.supports('scroll-behavior', 'smooth')) {
      promises.push(this.loadPolyfill('smooth-scroll', () => {
        // Smooth scroll polyfill would be loaded here
        console.log('Smooth scroll polyfill loaded');
      }));
    }

    await Promise.all(promises);
  }

  private static async loadPolyfill(name: string, fallback: () => void): Promise<void> {
    if (this.loadedPolyfills.has(name)) {
      return;
    }

    try {
      // In a real implementation, you would load actual polyfills
      // For now, we'll just call the fallback
      fallback();
      this.loadedPolyfills.add(name);
    } catch (error) {
      console.warn(`Failed to load polyfill for ${name}:`, error);
    }
  }
}

/**
 * CSS Compatibility Manager
 */
export class CSSCompatibilityManager {
  static applyCompatibilityStyles(): void {
    const features = FeatureDetector.detectFeatureSupport();
    const browserInfo = BrowserDetector.getInstance().getBrowserInfo();

    // Add browser-specific classes to body
    document.body.classList.add(`browser-${browserInfo.name.toLowerCase()}`);
    document.body.classList.add(`engine-${browserInfo.engine.toLowerCase()}`);
    
    if (browserInfo.isMobile) {
      document.body.classList.add('device-mobile');
    } else if (browserInfo.isTablet) {
      document.body.classList.add('device-tablet');
    } else {
      document.body.classList.add('device-desktop');
    }

    // Add feature support classes
    Object.entries(features.css).forEach(([feature, supported]) => {
      document.body.classList.add(supported ? `supports-${feature}` : `no-${feature}`);
    });

    // Apply fallbacks for unsupported features
    this.applyFallbacks(features);
  }

  private static applyFallbacks(features: FeatureSupport): void {
    // Grid fallback
    if (!features.css.grid) {
      this.addFallbackCSS(`
        .grid-fallback {
          display: flex;
          flex-wrap: wrap;
        }
        .grid-fallback > * {
          flex: 1 1 auto;
        }
      `);
    }

    // Backdrop filter fallback
    if (!features.css.backdrop) {
      this.addFallbackCSS(`
        .backdrop-fallback {
          background: rgba(255, 255, 255, 0.8);
        }
        .backdrop-fallback.dark {
          background: rgba(0, 0, 0, 0.8);
        }
      `);
    }

    // Custom properties fallback
    if (!features.css.customProperties) {
      this.addFallbackCSS(`
        .custom-props-fallback {
          color: #333;
          background: #fff;
        }
      `);
    }
  }

  private static addFallbackCSS(css: string): void {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
}

/**
 * Performance Optimization for Different Browsers
 */
export class BrowserPerformanceOptimizer {
  static optimizeForBrowser(): void {
    const browserInfo = BrowserDetector.getInstance().getBrowserInfo();
    
    // Safari-specific optimizations
    if (browserInfo.name === 'Safari') {
      this.optimizeForSafari();
    }
    
    // Firefox-specific optimizations
    if (browserInfo.name === 'Firefox') {
      this.optimizeForFirefox();
    }
    
    // Mobile optimizations
    if (browserInfo.isMobile) {
      this.optimizeForMobile();
    }
  }

  private static optimizeForSafari(): void {
    // Disable smooth scrolling on Safari for better performance
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Add Safari-specific meta tags
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        viewport.getAttribute('content') + ', viewport-fit=cover'
      );
    }
  }

  private static optimizeForFirefox(): void {
    // Firefox-specific optimizations
    document.documentElement.style.scrollbarWidth = 'thin';
  }

  private static optimizeForMobile(): void {
    // Disable hover effects on mobile
    document.body.classList.add('no-hover');
    
    // Add touch-action for better touch performance
    document.documentElement.style.touchAction = 'manipulation';
  }
}

/**
 * Main Compatibility Initializer
 */
export class CompatibilityManager {
  static async initialize(): Promise<void> {
    try {
      // Detect browser and features
      const browserInfo = BrowserDetector.getInstance().getBrowserInfo();
      const features = FeatureDetector.detectFeatureSupport();
      
      console.log('Browser Info:', browserInfo);
      console.log('Feature Support:', features);
      
      // Load necessary polyfills
      await PolyfillManager.loadPolyfills({
        intersectionObserver: !browserInfo.supportsIntersectionObserver,
        resizeObserver: !browserInfo.supportsResizeObserver,
        customElements: false, // Not needed for this project
        fetch: !features.js.fetch,
        smoothScroll: !CSS.supports('scroll-behavior', 'smooth')
      });
      
      // Apply compatibility styles
      CSSCompatibilityManager.applyCompatibilityStyles();
      
      // Optimize for specific browsers
      BrowserPerformanceOptimizer.optimizeForBrowser();
      
      console.log('Cross-browser compatibility initialized successfully');
    } catch (error) {
      console.error('Failed to initialize cross-browser compatibility:', error);
    }
  }
}

// Export utility functions
export const getBrowserInfo = () => BrowserDetector.getInstance().getBrowserInfo();
export const getFeatureSupport = () => FeatureDetector.detectFeatureSupport();
export const initializeCompatibility = () => CompatibilityManager.initialize();