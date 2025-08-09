/**
 * Performance Optimization Module
 * Comprehensive performance monitoring and optimization utilities
 * Includes Web Vitals tracking, lazy loading, resource optimization, and image optimization
 */

// Web Vitals measurement utility
class WebVitalsTracker {
  constructor() {
    this.vitals = new Map();
    this.observers = new Map();
    this.callbacks = [];
  }

  // Track First Contentful Paint
  trackFCP() {
    return new Promise((resolve) => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          const fcp = fcpEntry.startTime;
          this.vitals.set('FCP', fcp);
          this.triggerCallbacks('FCP', fcp);
          resolve(fcp);
        }
      }).observe({ entryTypes: ['paint'] });
    });
  }

  // Track Largest Contentful Paint
  trackLCP() {
    return new Promise((resolve) => {
      let lcp = 0;
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcp = lastEntry.startTime;
        this.vitals.set('LCP', lcp);
        this.triggerCallbacks('LCP', lcp);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('LCP', observer);

      // Resolve after a delay to get final LCP value
      setTimeout(() => {
        observer.disconnect();
        resolve(lcp);
      }, 5000);
    });
  }

  // Track First Input Delay
  trackFID() {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fidEntry = entries[0];
        if (fidEntry) {
          const fid = fidEntry.processingStart - fidEntry.startTime;
          this.vitals.set('FID', fid);
          this.triggerCallbacks('FID', fid);
          observer.disconnect();
          resolve(fid);
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('FID', observer);
    });
  }

  // Track Cumulative Layout Shift
  trackCLS() {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries = [];

    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (sessionValue && 
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            this.vitals.set('CLS', clsValue);
            this.triggerCallbacks('CLS', clsValue);
          }
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('CLS', observer);

    return clsValue;
  }

  // Track Time to First Byte
  trackTTFB() {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      this.vitals.set('TTFB', ttfb);
      this.triggerCallbacks('TTFB', ttfb);
      return ttfb;
    }
    return null;
  }

  // Add callback for vital updates
  onVitalUpdate(callback) {
    this.callbacks.push(callback);
  }

  // Trigger all callbacks
  triggerCallbacks(vitalName, value) {
    this.callbacks.forEach(callback => {
      try {
        callback(vitalName, value, this.getAllVitals());
      } catch (error) {
        console.error('Error in vital callback:', error);
      }
    });
  }

  // Get all vitals
  getAllVitals() {
    return Object.fromEntries(this.vitals);
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Lazy Loading Manager
class LazyLoadingManager {
  constructor(options = {}) {
    this.options = {
      rootMargin: options.rootMargin || '50px 0px',
      threshold: options.threshold || 0.1,
      enableImages: options.enableImages !== false,
      enableComponents: options.enableComponents !== false,
      placeholderClass: options.placeholderClass || 'lazy-placeholder',
      loadedClass: options.loadedClass || 'lazy-loaded',
      errorClass: options.errorClass || 'lazy-error'
    };

    this.imageObserver = null;
    this.componentObserver = null;
    this.loadedImages = new Set();
    this.loadedComponents = new Set();

    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupImageLazyLoading();
      this.setupComponentLazyLoading();
    } else {
      this.fallbackLoad();
    }
  }

  // Setup lazy loading for images
  setupImageLazyLoading() {
    if (!this.options.enableImages) return;

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold
    });

    // Observe existing lazy images
    this.observeImages();
  }

  // Setup lazy loading for components
  setupComponentLazyLoading() {
    if (!this.options.enableComponents) return;

    this.componentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadComponent(entry.target);
          this.componentObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold
    });

    // Observe existing lazy components
    this.observeComponents();
  }

  // Load image with progressive enhancement
  loadImage(img) {
    return new Promise((resolve, reject) => {
      const imageLoader = new Image();
      
      imageLoader.onload = () => {
        // Apply blur-up effect
        this.applyBlurUpEffect(img, imageLoader.src);
        
        img.src = imageLoader.src;
        img.classList.add(this.options.loadedClass);
        img.classList.remove(this.options.placeholderClass);
        
        this.loadedImages.add(img);
        resolve(img);
      };

      imageLoader.onerror = () => {
        img.classList.add(this.options.errorClass);
        reject(new Error('Failed to load image'));
      };

      // Load the image
      const src = img.dataset.src || img.dataset.lazySrc;
      if (src) {
        imageLoader.src = src;
      }

      // Handle srcset for responsive images
      const srcset = img.dataset.srcset || img.dataset.lazySrcset;
      if (srcset) {
        imageLoader.srcset = srcset;
        img.srcset = srcset;
      }
    });
  }

  // Apply blur-up effect
  applyBlurUpEffect(img, src) {
    if (img.dataset.placeholder) {
      img.style.backgroundImage = `url(${img.dataset.placeholder})`;
      img.style.backgroundSize = 'cover';
      img.style.backgroundPosition = 'center';
      
      // Animate transition
      img.style.transition = 'opacity 0.3s ease-in-out';
      img.style.opacity = '0';
      
      setTimeout(() => {
        img.style.opacity = '1';
        img.style.backgroundImage = 'none';
      }, 50);
    }
  }

  // Load component dynamically
  async loadComponent(element) {
    const componentPath = element.dataset.component;
    const componentProps = element.dataset.props ? JSON.parse(element.dataset.props) : {};

    if (!componentPath) return;

    try {
      // Dynamic import for code splitting
      const module = await import(componentPath);
      const Component = module.default || module[element.dataset.export];

      if (Component) {
        // In a React environment, you'd render the component here
        // For vanilla JS, we'll dispatch a custom event
        const event = new CustomEvent('lazy-component-loaded', {
          detail: { element, Component, props: componentProps }
        });
        element.dispatchEvent(event);
        
        this.loadedComponents.add(element);
      }
    } catch (error) {
      console.error('Failed to load component:', error);
      element.classList.add(this.options.errorClass);
    }
  }

  // Observe all lazy images
  observeImages() {
    const images = document.querySelectorAll('img[data-src], img[data-lazy-src]');
    images.forEach(img => {
      if (!this.loadedImages.has(img)) {
        this.imageObserver.observe(img);
      }
    });
  }

  // Observe all lazy components
  observeComponents() {
    const components = document.querySelectorAll('[data-component]');
    components.forEach(component => {
      if (!this.loadedComponents.has(component)) {
        this.componentObserver.observe(component);
      }
    });
  }

  // Add new images to observe
  addImages(images) {
    if (this.imageObserver) {
      images.forEach(img => {
        if (!this.loadedImages.has(img)) {
          this.imageObserver.observe(img);
        }
      });
    }
  }

  // Add new components to observe
  addComponents(components) {
    if (this.componentObserver) {
      components.forEach(component => {
        if (!this.loadedComponents.has(component)) {
          this.componentObserver.observe(component);
        }
      });
    }
  }

  // Fallback for browsers without IntersectionObserver
  fallbackLoad() {
    const images = document.querySelectorAll('img[data-src], img[data-lazy-src]');
    images.forEach(img => this.loadImage(img));

    const components = document.querySelectorAll('[data-component]');
    components.forEach(component => this.loadComponent(component));
  }

  // Cleanup
  destroy() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
    if (this.componentObserver) {
      this.componentObserver.disconnect();
    }
  }
}

// Resource Optimizer
class ResourceOptimizer {
  constructor() {
    this.preloadedResources = new Set();
    this.prefetchedResources = new Set();
    this.dnsPrefetched = new Set();
  }

  // Preload critical resources
  preloadCriticalResources(resources = []) {
    const criticalResources = [
      ...resources,
      // Default critical resources
      { href: '/fonts/main.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
      { href: '/css/critical.css', as: 'style' },
      { href: '/js/critical.js', as: 'script' }
    ];

    criticalResources.forEach(resource => {
      if (!this.preloadedResources.has(resource.href)) {
        this.createPreloadLink(resource);
        this.preloadedResources.add(resource.href);
      }
    });
  }

  // Create preload link
  createPreloadLink({ href, as, type, crossorigin, media }) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (type) link.type = type;
    if (crossorigin) link.crossOrigin = 'anonymous';
    if (media) link.media = media;

    document.head.appendChild(link);
    return link;
  }

  // Prefetch likely next pages
  prefetchLikelyPages(pages = []) {
    const likelyPages = [
      ...pages,
      // Default likely pages based on common navigation patterns
      '/about',
      '/projects',
      '/contact'
    ];

    likelyPages.forEach(page => {
      if (!this.prefetchedResources.has(page)) {
        this.createPrefetchLink(page);
        this.prefetchedResources.add(page);
      }
    });
  }

  // Create prefetch link
  createPrefetchLink(href) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    return link;
  }

  // DNS prefetch for external domains
  setupDnsPrefetch(domains = []) {
    const externalDomains = [
      ...domains,
      // Common external domains
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdnjs.cloudflare.com',
      'unpkg.com',
      'cdn.jsdelivr.net'
    ];

    externalDomains.forEach(domain => {
      if (!this.dnsPrefetched.has(domain)) {
        this.createDnsPrefetchLink(domain);
        this.dnsPrefetched.add(domain);
      }
    });
  }

  // Create DNS prefetch link
  createDnsPrefetchLink(domain) {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
    return link;
  }

  // Setup resource hints based on user interaction
  setupIntelligentPrefetch() {
    // Prefetch on hover
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.hostname === window.location.hostname) {
        this.prefetchOnHover(link.href);
      }
    });

    // Prefetch on focus (for keyboard navigation)
    document.addEventListener('focus', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.hostname === window.location.hostname) {
        this.prefetchOnHover(link.href);
      }
    }, true);
  }

  // Prefetch resource on hover
  prefetchOnHover(href) {
    if (!this.prefetchedResources.has(href)) {
      // Delay to avoid prefetching on quick mouse movements
      setTimeout(() => {
        this.createPrefetchLink(href);
        this.prefetchedResources.add(href);
      }, 100);
    }
  }

  // Optimize critical rendering path
  optimizeCriticalRenderingPath() {
    // Inline critical CSS if not already done
    this.inlineCriticalCSS();
    
    // Defer non-critical JavaScript
    this.deferNonCriticalJS();
    
    // Optimize web fonts loading
    this.optimizeWebFonts();
  }

  // Inline critical CSS
  inlineCriticalCSS() {
    const criticalCSS = this.extractCriticalCSS();
    if (criticalCSS) {
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.appendChild(style);
    }
  }

  // Extract critical CSS (would need actual implementation based on your CSS)
  extractCriticalCSS() {
    // This is a simplified version - in practice, you'd use tools like
    // critical, penthouse, or puppeteer to extract critical CSS
    return `
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
      .hero { min-height: 100vh; display: flex; align-items: center; }
      .nav { position: fixed; top: 0; width: 100%; z-index: 1000; }
    `;
  }

  // Defer non-critical JavaScript
  deferNonCriticalJS() {
    const scripts = document.querySelectorAll('script[src]:not([data-critical])');
    scripts.forEach(script => {
      if (!script.defer && !script.async) {
        script.defer = true;
      }
    });
  }

  // Optimize web fonts loading
  optimizeWebFonts() {
    // Use font-display: swap for better performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Main';
        src: url('/fonts/main.woff2') format('woff2'),
             url('/fonts/main.woff') format('woff');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }
}

// Image Optimizer
class ImageOptimizer {
  constructor(options = {}) {
    this.options = {
      webpSupport: null,
      avifSupport: null,
      quality: options.quality || 80,
      placeholder: options.placeholder || 'blur',
      cdnBaseUrl: options.cdnBaseUrl || '',
      breakpoints: options.breakpoints || [320, 640, 768, 1024, 1280, 1536],
      ...options
    };

    this.init();
  }

  async init() {
    this.options.webpSupport = await this.detectWebPSupport();
    this.options.avifSupport = await this.detectAVIFSupport();
  }

  // Detect WebP support
  detectWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // Detect AVIF support
  detectAVIFSupport() {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 2);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }

  // Generate responsive image sources
  generateResponsiveSources(imagePath, alt = '') {
    const extension = imagePath.split('.').pop();
    const basePath = imagePath.replace(`.${extension}`, '');
    
    const sources = [];

    // Generate AVIF sources if supported
    if (this.options.avifSupport) {
      const avifSrcset = this.options.breakpoints
        .map(width => `${this.options.cdnBaseUrl}${basePath}_${width}.avif ${width}w`)
        .join(', ');
      
      sources.push({
        type: 'image/avif',
        srcset: avifSrcset
      });
    }

    // Generate WebP sources if supported
    if (this.options.webpSupport) {
      const webpSrcset = this.options.breakpoints
        .map(width => `${this.options.cdnBaseUrl}${basePath}_${width}.webp ${width}w`)
        .join(', ');
      
      sources.push({
        type: 'image/webp',
        srcset: webpSrcset
      });
    }

    // Fallback to original format
    const fallbackSrcset = this.options.breakpoints
      .map(width => `${this.options.cdnBaseUrl}${basePath}_${width}.${extension} ${width}w`)
      .join(', ');

    return {
      sources,
      fallback: {
        src: `${this.options.cdnBaseUrl}${imagePath}`,
        srcset: fallbackSrcset,
        alt
      }
    };
  }

  // Create responsive picture element
  createResponsivePicture(imagePath, alt = '', className = '', sizes = '100vw') {
    const { sources, fallback } = this.generateResponsiveSources(imagePath, alt);
    
    const picture = document.createElement('picture');
    if (className) picture.className = className;

    // Add source elements
    sources.forEach(source => {
      const sourceEl = document.createElement('source');
      sourceEl.type = source.type;
      sourceEl.srcset = source.srcset;
      sourceEl.sizes = sizes;
      picture.appendChild(sourceEl);
    });

    // Add fallback img
    const img = document.createElement('img');
    img.src = fallback.src;
    img.srcset = fallback.srcset;
    img.alt = fallback.alt;
    img.sizes = sizes;
    img.loading = 'lazy';
    
    picture.appendChild(img);
    
    return picture;
  }

  // Generate blur placeholder
  generateBlurPlaceholder(imagePath, width = 20, height = 20) {
    // In a real implementation, this would generate a tiny, blurred version
    // For now, we'll create a simple colored placeholder
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL();
  }

  // Optimize existing images on page
  optimizeExistingImages() {
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach(img => {
      this.optimizeImage(img);
    });
  }

  // Optimize individual image
  optimizeImage(img) {
    const src = img.src || img.dataset.src;
    if (!src) return;

    // Generate responsive sources
    const { sources, fallback } = this.generateResponsiveSources(src, img.alt);
    
    // Create picture element
    const picture = document.createElement('picture');
    picture.className = img.className;
    
    // Copy attributes
    Array.from(img.attributes).forEach(attr => {
      if (!['src', 'srcset'].includes(attr.name)) {
        picture.setAttribute(attr.name, attr.value);
      }
    });

    // Add sources
    sources.forEach(source => {
      const sourceEl = document.createElement('source');
      sourceEl.type = source.type;
      sourceEl.srcset = source.srcset;
      picture.appendChild(sourceEl);
    });

    // Update img with fallback
    img.src = fallback.src;
    img.srcset = fallback.srcset;
    img.dataset.optimized = 'true';
    
    picture.appendChild(img);
    
    // Replace original img with picture
    if (img.parentNode) {
      img.parentNode.replaceChild(picture, img);
    }
  }

  // CDN URL builder
  buildCDNUrl(imagePath, transformations = {}) {
    if (!this.options.cdnBaseUrl) return imagePath;

    const params = new URLSearchParams();
    
    // Add common transformations
    if (transformations.width) params.append('w', transformations.width);
    if (transformations.height) params.append('h', transformations.height);
    if (transformations.quality) params.append('q', transformations.quality);
    if (transformations.format) params.append('f', transformations.format);
    
    const queryString = params.toString();
    const separator = this.options.cdnBaseUrl.includes('?') ? '&' : '?';
    
    return `${this.options.cdnBaseUrl}${imagePath}${queryString ? separator + queryString : ''}`;
  }
}

// Service Worker Manager
class ServiceWorkerManager {
  constructor(swPath = '/sw.js') {
    this.swPath = swPath;
    this.registration = null;
  }

  // Register service worker
  async register() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register(this.swPath);
        console.log('Service Worker registered successfully');
        
        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          this.handleUpdate();
        });

        return this.registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // Handle service worker updates
  handleUpdate() {
    const newWorker = this.registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New content is available
        this.showUpdateNotification();
      }
    });
  }

  // Show update notification
  showUpdateNotification() {
    if (confirm('New content is available. Reload to update?')) {
      window.location.reload();
    }
  }

  // Unregister service worker
  async unregister() {
    if (this.registration) {
      return await this.registration.unregister();
    }
  }
}

// Main Performance Optimizer Class
class PerformanceOptimizer {
  constructor(options = {}) {
    this.options = {
      enableWebVitals: options.enableWebVitals !== false,
      enableLazyLoading: options.enableLazyLoading !== false,
      enableResourceOptimization: options.enableResourceOptimization !== false,
      enableImageOptimization: options.enableImageOptimization !== false,
      enableServiceWorker: options.enableServiceWorker !== false,
      analyticsEndpoint: options.analyticsEndpoint || null,
      ...options
    };

    // Initialize modules
    this.webVitals = new WebVitalsTracker();
    this.lazyLoader = new LazyLoadingManager(options.lazyLoading);
    this.resourceOptimizer = new ResourceOptimizer();
    this.imageOptimizer = new ImageOptimizer(options.imageOptimization);
    this.serviceWorkerManager = new ServiceWorkerManager(options.serviceWorkerPath);

    // Performance metrics storage
    this.metrics = {
      FCP: null,
      LCP: null,
      FID: null,
      CLS: null,
      TTFB: null,
      customMetrics: new Map()
    };

    this.init();
  }

  // Initialize performance optimization
  async init() {
    console.log('🚀 Performance Optimizer initialized');

    if (this.options.enableWebVitals) {
      this.setupWebVitalsTracking();
    }

    if (this.options.enableResourceOptimization) {
      this.setupResourceOptimization();
    }

    if (this.options.enableImageOptimization) {
      this.setupImageOptimization();
    }

    if (this.options.enableServiceWorker) {
      this.setupServiceWorker();
    }

    // Start monitoring
    this.startPerformanceMonitoring();
  }

  // Setup Web Vitals tracking
  setupWebVitalsTracking() {
    this.webVitals.onVitalUpdate((name, value, allVitals) => {
      this.metrics[name] = value;
      this.handleVitalUpdate(name, value, allVitals);
    });

    // Track all vitals
    this.webVitals.trackFCP();
    this.webVitals.trackLCP();
    this.webVitals.trackFID();
    this.webVitals.trackCLS();
    this.webVitals.trackTTFB();
  }

  // Handle vital updates
  handleVitalUpdate(name, value, allVitals) {
    console.log(`📊 ${name}: ${value.toFixed(2)}ms`);

    // Send to analytics if endpoint provided
    if (this.options.analyticsEndpoint) {
      this.sendToAnalytics(name, value, allVitals);
    }

    // Check for performance issues
    this.checkPerformanceThresholds(name, value);
  }

  // Check performance thresholds
  checkPerformanceThresholds(name, value) {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name];
    if (!threshold) return;

    let status = 'good';
    if (value > threshold.poor) {
      status = 'poor';
    } else if (value > threshold.good) {
      status = 'needs-improvement';
    }

    // Trigger alerts for poor performance
    if (status === 'poor') {
      this.triggerPerformanceAlert(name, value, status);
    }
  }

  // Trigger performance alert
  triggerPerformanceAlert(metric, value, status) {
    console.warn(`⚠️ Performance Alert: ${metric} is ${status} (${value.toFixed(2)}ms)`);
    
    // Dispatch custom event for UI notifications
    const event = new CustomEvent('performance-alert', {
      detail: { metric, value, status }
    });
    document.dispatchEvent(event);
  }

  // Setup resource optimization
  setupResourceOptimization() {
    this.resourceOptimizer.preloadCriticalResources();
    this.resourceOptimizer.prefetchLikelyPages();
    this.resourceOptimizer.setupDnsPrefetch();
    this.resourceOptimizer.setupIntelligentPrefetch();
    this.resourceOptimizer.optimizeCriticalRenderingPath();
  }

  // Setup image optimization
  setupImageOptimization() {
    // Wait for DOM content to be loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.imageOptimizer.optimizeExistingImages();
      });
    } else {
      this.imageOptimizer.optimizeExistingImages();
    }
  }

  // Setup service worker
  async setupServiceWorker() {
    await this.serviceWorkerManager.register();
  }

  // Start performance monitoring
  startPerformanceMonitoring() {
    // Monitor long tasks
    this.monitorLongTasks();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor network quality
    this.monitorNetworkQuality();

    // Generate performance reports
    this.schedulePerformanceReports();
  }

  // Monitor long tasks
  monitorLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach(entry => {
          console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`);
          this.metrics.customMetrics.set('longTasks', 
            (this.metrics.customMetrics.get('longTasks') || 0) + 1
          );
        });
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // longtask not supported
      }
    }
  }

  // Monitor memory usage
  monitorMemoryUsage() {
    if ('memory' in performance) {
      const updateMemoryMetrics = () => {
        const memory = performance.memory;
        this.metrics.customMetrics.set('memoryUsage', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      };

      updateMemoryMetrics();
      setInterval(updateMemoryMetrics, 30000); // Update every 30 seconds
    }
  }

  // Monitor network quality
  monitorNetworkQuality() {
    if ('connection' in navigator) {
      const updateNetworkMetrics = () => {
        const connection = navigator.connection;
        this.metrics.customMetrics.set('networkQuality', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      };

      updateNetworkMetrics();
      navigator.connection.addEventListener('change', updateNetworkMetrics);
    }
  }

  // Schedule performance reports
  schedulePerformanceReports() {
    // Generate report every 5 minutes
    setInterval(() => {
      this.generatePerformanceReport();
    }, 5 * 60 * 1000);

    // Generate report on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.generatePerformanceReport();
      }
    });
  }

  // Generate performance report
  generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      vitals: { ...this.metrics },
      customMetrics: Object.fromEntries(this.metrics.customMetrics),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    console.log('📈 Performance Report:', report);

    // Send to analytics
    if (this.options.analyticsEndpoint) {
      this.sendReportToAnalytics(report);
    }

    return report;
  }

  // Send metrics to analytics
  async sendToAnalytics(metric, value, allVitals) {
    if (!this.options.analyticsEndpoint) return;

    try {
      await fetch(this.options.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'web-vital',
          metric,
          value,
          allVitals,
          timestamp: new Date().toISOString(),
          url: window.location.href
        })
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  // Send report to analytics
  async sendReportToAnalytics(report) {
    if (!this.options.analyticsEndpoint) return;

    try {
      await fetch(this.options.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'performance-report',
          ...report
        })
      });
    } catch (error) {
      console.error('Failed to send performance report:', error);
    }
  }

  // Get current performance metrics
  getMetrics() {
    return {
      ...this.metrics,
      customMetrics: Object.fromEntries(this.metrics.customMetrics)
    };
  }

  // Cleanup
  destroy() {
    this.webVitals.cleanup();
    this.lazyLoader.destroy();
  }
}

export default PerformanceOptimizer;
export {
  WebVitalsTracker,
  LazyLoadingManager,
  ResourceOptimizer,
  ImageOptimizer,
  ServiceWorkerManager
};
