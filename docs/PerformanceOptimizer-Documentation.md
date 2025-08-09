# Performance Optimizer Module Documentation

## Overview

The Performance Optimizer Module is a comprehensive JavaScript utility designed to monitor, analyze, and optimize web application performance. It provides real-time Web Vitals tracking, intelligent lazy loading, resource optimization, image optimization, and performance monitoring capabilities.

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Core Features](#core-features)
4. [API Reference](#api-reference)
5. [Configuration Options](#configuration-options)
6. [Web Vitals Tracking](#web-vitals-tracking)
7. [Lazy Loading](#lazy-loading)
8. [Resource Optimization](#resource-optimization)
9. [Image Optimization](#image-optimization)
10. [Performance Monitoring](#performance-monitoring)
11. [Service Worker Integration](#service-worker-integration)
12. [Best Practices](#best-practices)
13. [Troubleshooting](#troubleshooting)
14. [Browser Support](#browser-support)

## Installation

### NPM Installation (if packaging as module)
```bash
npm install performance-optimizer
```

### Direct Import
```javascript
import PerformanceOptimizer from './utils/performance.js';
```

### CDN Usage
```html
<script type="module" src="path/to/performance.js"></script>
```

## Quick Start

```javascript
// Basic initialization
const optimizer = new PerformanceOptimizer();

// Advanced initialization with options
const optimizer = new PerformanceOptimizer({
  enableWebVitals: true,
  enableLazyLoading: true,
  enableResourceOptimization: true,
  enableImageOptimization: true,
  analyticsEndpoint: '/api/analytics'
});

// Listen for performance alerts
document.addEventListener('performance-alert', (event) => {
  const { metric, value, status } = event.detail;
  console.warn(`Performance Alert: ${metric} is ${status}`);
});

// Get current metrics
const metrics = optimizer.getMetrics();
console.log('Web Vitals:', metrics);
```

## Core Features

### 1. Web Vitals Tracking
- **First Contentful Paint (FCP)**: Measures loading performance
- **Largest Contentful Paint (LCP)**: Measures loading performance
- **First Input Delay (FID)**: Measures interactivity
- **Cumulative Layout Shift (CLS)**: Measures visual stability
- **Time to First Byte (TTFB)**: Measures server responsiveness

### 2. Lazy Loading
- **Image Lazy Loading**: Intersection Observer-based image loading
- **Component Lazy Loading**: Dynamic component imports
- **Progressive Image Enhancement**: Blur-up effect and placeholders
- **Responsive Images**: Automatic srcset generation

### 3. Resource Optimization
- **Critical Resource Preloading**: Preload fonts, CSS, and JavaScript
- **Intelligent Prefetching**: Hover-based and route-based prefetching
- **DNS Prefetch**: External domain optimization
- **Critical Rendering Path**: Optimization strategies

### 4. Image Optimization
- **Format Detection**: WebP and AVIF support detection
- **Responsive Images**: Multi-breakpoint image generation
- **CDN Integration**: Automatic URL transformation
- **Progressive Loading**: Placeholder and blur-up effects

### 5. Performance Monitoring
- **Long Task Detection**: Monitor blocking tasks
- **Memory Usage**: JavaScript heap monitoring
- **Network Quality**: Connection speed and type detection
- **Performance Reports**: Automated reporting system

## API Reference

### PerformanceOptimizer Class

#### Constructor
```javascript
new PerformanceOptimizer(options)
```

**Parameters:**
- `options` (Object): Configuration options

#### Methods

##### getMetrics()
Returns current performance metrics.

```javascript
const metrics = optimizer.getMetrics();
// Returns: { FCP, LCP, FID, CLS, TTFB, customMetrics }
```

##### destroy()
Cleanup method to remove observers and event listeners.

```javascript
optimizer.destroy();
```

### WebVitalsTracker Class

#### Methods

##### trackFCP()
```javascript
const fcp = await vitals.trackFCP();
```

##### trackLCP()
```javascript
const lcp = await vitals.trackLCP();
```

##### trackFID()
```javascript
const fid = await vitals.trackFID();
```

##### trackCLS()
```javascript
const cls = vitals.trackCLS();
```

##### trackTTFB()
```javascript
const ttfb = vitals.trackTTFB();
```

##### onVitalUpdate(callback)
```javascript
vitals.onVitalUpdate((name, value, allVitals) => {
  console.log(`${name}: ${value}`);
});
```

### LazyLoadingManager Class

#### Constructor
```javascript
new LazyLoadingManager(options)
```

**Options:**
- `rootMargin` (String): Intersection Observer root margin
- `threshold` (Number): Intersection threshold
- `enableImages` (Boolean): Enable image lazy loading
- `enableComponents` (Boolean): Enable component lazy loading

#### Methods

##### addImages(images)
```javascript
const images = document.querySelectorAll('img[data-src]');
lazyLoader.addImages(images);
```

##### addComponents(components)
```javascript
const components = document.querySelectorAll('[data-component]');
lazyLoader.addComponents(components);
```

### ResourceOptimizer Class

#### Methods

##### preloadCriticalResources(resources)
```javascript
resourceOptimizer.preloadCriticalResources([
  { href: '/fonts/main.woff2', as: 'font', type: 'font/woff2' },
  { href: '/css/critical.css', as: 'style' }
]);
```

##### prefetchLikelyPages(pages)
```javascript
resourceOptimizer.prefetchLikelyPages(['/about', '/contact']);
```

##### setupDnsPrefetch(domains)
```javascript
resourceOptimizer.setupDnsPrefetch([
  'fonts.googleapis.com',
  'cdnjs.cloudflare.com'
]);
```

### ImageOptimizer Class

#### Constructor
```javascript
new ImageOptimizer(options)
```

**Options:**
- `quality` (Number): Image quality (1-100)
- `cdnBaseUrl` (String): CDN base URL
- `breakpoints` (Array): Responsive breakpoints

#### Methods

##### createResponsivePicture(imagePath, alt, className, sizes)
```javascript
const picture = imageOptimizer.createResponsivePicture(
  '/images/hero.jpg',
  'Hero image',
  'hero-image',
  '(max-width: 768px) 100vw, 50vw'
);
document.body.appendChild(picture);
```

##### optimizeExistingImages()
```javascript
imageOptimizer.optimizeExistingImages();
```

## Configuration Options

### Complete Configuration Example

```javascript
const optimizer = new PerformanceOptimizer({
  // Web Vitals Configuration
  enableWebVitals: true,
  analyticsEndpoint: '/api/performance',
  
  // Lazy Loading Configuration
  enableLazyLoading: true,
  lazyLoading: {
    rootMargin: '50px 0px',
    threshold: 0.1,
    enableImages: true,
    enableComponents: true,
    placeholderClass: 'lazy-placeholder',
    loadedClass: 'lazy-loaded',
    errorClass: 'lazy-error'
  },
  
  // Resource Optimization Configuration
  enableResourceOptimization: true,
  resourceOptimization: {
    preloadResources: [
      { href: '/fonts/main.woff2', as: 'font', type: 'font/woff2' }
    ],
    prefetchPages: ['/about', '/contact'],
    dnsPrefetchDomains: ['fonts.googleapis.com']
  },
  
  // Image Optimization Configuration
  enableImageOptimization: true,
  imageOptimization: {
    quality: 80,
    placeholder: 'blur',
    cdnBaseUrl: 'https://cdn.example.com/',
    breakpoints: [320, 640, 768, 1024, 1280, 1536],
    webpSupport: true,
    avifSupport: true
  },
  
  // Service Worker Configuration
  enableServiceWorker: true,
  serviceWorkerPath: '/sw.js'
});
```

## Web Vitals Tracking

### Understanding Web Vitals

#### First Contentful Paint (FCP)
- **Good**: ≤ 1.8s
- **Needs Improvement**: 1.8s - 3.0s
- **Poor**: > 3.0s

#### Largest Contentful Paint (LCP)
- **Good**: ≤ 2.5s
- **Needs Improvement**: 2.5s - 4.0s
- **Poor**: > 4.0s

#### First Input Delay (FID)
- **Good**: ≤ 100ms
- **Needs Improvement**: 100ms - 300ms
- **Poor**: > 300ms

#### Cumulative Layout Shift (CLS)
- **Good**: ≤ 0.1
- **Needs Improvement**: 0.1 - 0.25
- **Poor**: > 0.25

#### Time to First Byte (TTFB)
- **Good**: ≤ 800ms
- **Needs Improvement**: 800ms - 1800ms
- **Poor**: > 1800ms

### Custom Event Handling

```javascript
// Listen for specific vital updates
document.addEventListener('performance-alert', (event) => {
  const { metric, value, status } = event.detail;
  
  // Send to analytics
  gtag('event', 'web_vital', {
    metric_name: metric,
    metric_value: value,
    metric_status: status
  });
  
  // Show user notification for poor performance
  if (status === 'poor') {
    showPerformanceNotification(metric, value);
  }
});
```

## Lazy Loading

### Image Lazy Loading Setup

#### HTML Structure
```html
<!-- Basic lazy loading -->
<img data-src="/images/photo.jpg" alt="Description" class="lazy-placeholder">

<!-- With responsive images -->
<img 
  data-src="/images/photo.jpg"
  data-srcset="/images/photo-320.jpg 320w, /images/photo-640.jpg 640w"
  alt="Description"
  class="lazy-placeholder"
  sizes="(max-width: 768px) 100vw, 50vw"
>

<!-- With placeholder -->
<img 
  data-src="/images/photo.jpg"
  data-placeholder="/images/photo-blur.jpg"
  alt="Description"
  class="lazy-placeholder blur-up"
>
```

#### CSS Styling
```css
.lazy-placeholder {
  background: #f0f0f0;
  min-height: 200px;
  transition: opacity 0.3s ease;
}

.lazy-loaded {
  opacity: 1;
}

.blur-up.loading img {
  filter: blur(5px);
}

.blur-up.loaded img {
  filter: blur(0);
}
```

### Component Lazy Loading

#### HTML Structure
```html
<div 
  data-component="/components/HeavyComponent.js"
  data-props='{"title": "Hello", "count": 42}'
  data-export="default"
>
  <div class="loading-placeholder">Loading component...</div>
</div>
```

#### Event Handling
```javascript
document.addEventListener('lazy-component-loaded', (event) => {
  const { element, Component, props } = event.detail;
  
  // React example
  ReactDOM.render(
    React.createElement(Component, props),
    element
  );
});
```

## Resource Optimization

### Critical Resource Preloading

```javascript
// Preload fonts
resourceOptimizer.preloadCriticalResources([
  {
    href: '/fonts/main.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: true
  },
  {
    href: '/css/critical.css',
    as: 'style'
  },
  {
    href: '/js/critical.js',
    as: 'script'
  }
]);
```

### Intelligent Prefetching

```javascript
// Hover-based prefetching
document.addEventListener('mouseover', (e) => {
  const link = e.target.closest('a[href]');
  if (link && !link.dataset.prefetched) {
    resourceOptimizer.prefetchOnHover(link.href);
    link.dataset.prefetched = 'true';
  }
});
```

### DNS Prefetching

```javascript
// Setup DNS prefetch for external domains
resourceOptimizer.setupDnsPrefetch([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  'unpkg.com'
]);
```

## Image Optimization

### Responsive Images

```javascript
// Generate responsive picture element
const picture = imageOptimizer.createResponsivePicture(
  '/images/hero.jpg',
  'Hero image',
  'hero-image',
  '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
);

// Generated HTML structure:
// <picture class="hero-image">
//   <source type="image/avif" srcset="..." sizes="...">
//   <source type="image/webp" srcset="..." sizes="...">
//   <img src="..." srcset="..." alt="Hero image" sizes="...">
// </picture>
```

### CDN Integration

```javascript
const imageOptimizer = new ImageOptimizer({
  cdnBaseUrl: 'https://cdn.example.com/',
  quality: 80
});

// Build optimized CDN URL
const optimizedUrl = imageOptimizer.buildCDNUrl('/images/photo.jpg', {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp'
});
// Result: https://cdn.example.com/images/photo.jpg?w=800&h=600&q=85&f=webp
```

### Progressive Image Loading

```javascript
// Create progressive image with blur-up effect
const container = document.querySelector('.image-container');

// Add placeholder
const placeholder = imageOptimizer.generateBlurPlaceholder('/images/photo.jpg');
container.style.backgroundImage = `url(${placeholder})`;

// Load full image
const img = new Image();
img.onload = () => {
  container.style.backgroundImage = `url(${img.src})`;
  container.classList.add('loaded');
};
img.src = '/images/photo.jpg';
```

## Performance Monitoring

### Long Task Monitoring

```javascript
// Monitor tasks longer than 50ms
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach(entry => {
      if (entry.duration > 50) {
        console.warn(`Long task detected: ${entry.duration}ms`);
        // Send to analytics
        sendLongTaskAlert(entry.duration);
      }
    });
  });
  
  observer.observe({ entryTypes: ['longtask'] });
}
```

### Memory Monitoring

```javascript
// Monitor memory usage
function monitorMemory() {
  if ('memory' in performance) {
    const memory = performance.memory;
    const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    
    if (usagePercent > 80) {
      console.warn(`High memory usage: ${usagePercent.toFixed(1)}%`);
      // Trigger garbage collection if available
      if (window.gc) {
        window.gc();
      }
    }
  }
}

setInterval(monitorMemory, 30000);
```

### Network Quality Detection

```javascript
// Monitor network changes
if ('connection' in navigator) {
  const connection = navigator.connection;
  
  function updateNetworkStrategy() {
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      // Enable data saver mode
      document.body.classList.add('data-saver');
      // Reduce image quality
      imageOptimizer.options.quality = 60;
    } else {
      document.body.classList.remove('data-saver');
      imageOptimizer.options.quality = 80;
    }
  }
  
  connection.addEventListener('change', updateNetworkStrategy);
  updateNetworkStrategy();
}
```

## Service Worker Integration

### Basic Service Worker Setup

```javascript
// Register service worker
const swManager = new ServiceWorkerManager('/sw.js');
await swManager.register();

// Handle updates
swManager.registration.addEventListener('updatefound', () => {
  const newWorker = swManager.registration.installing;
  newWorker.addEventListener('statechange', () => {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      showUpdateNotification();
    }
  });
});
```

### Service Worker Template (sw.js)

```javascript
const CACHE_NAME = 'performance-optimizer-v1';
const urlsToCache = [
  '/',
  '/css/critical.css',
  '/js/critical.js',
  '/fonts/main.woff2'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

## Best Practices

### 1. Performance Budgets

```javascript
// Set performance budgets
const performanceBudgets = {
  FCP: 1800,
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  TTFB: 800,
  totalPageSize: 1024 * 1024, // 1MB
  imageSize: 500 * 1024 // 500KB
};

// Monitor budget violations
document.addEventListener('performance-alert', (event) => {
  const { metric, value } = event.detail;
  const budget = performanceBudgets[metric];
  
  if (budget && value > budget) {
    console.error(`Performance budget exceeded: ${metric} (${value} > ${budget})`);
    // Send alert to monitoring system
    sendBudgetAlert(metric, value, budget);
  }
});
```

### 2. Progressive Enhancement

```javascript
// Feature detection and progressive enhancement
const optimizer = new PerformanceOptimizer({
  enableWebVitals: 'PerformanceObserver' in window,
  enableLazyLoading: 'IntersectionObserver' in window,
  enableServiceWorker: 'serviceWorker' in navigator,
  enableImageOptimization: true // Always enable with fallbacks
});
```

### 3. Critical CSS Inlining

```javascript
// Inline critical CSS
function inlineCriticalCSS() {
  const criticalCSS = `
    body { margin: 0; font-family: system-ui, sans-serif; }
    .hero { min-height: 100vh; display: flex; align-items: center; }
    .nav { position: fixed; top: 0; width: 100%; z-index: 1000; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
  
  // Load non-critical CSS asynchronously
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/css/non-critical.css';
  link.media = 'print';
  link.onload = function() { this.media = 'all'; };
  document.head.appendChild(link);
}
```

### 4. Resource Hints Optimization

```html
<!-- DNS prefetch for external domains -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//fonts.gstatic.com">

<!-- Preconnect for critical external resources -->
<link rel="preconnect" href="//fonts.googleapis.com" crossorigin>

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/css/critical.css" as="style">

<!-- Prefetch likely next pages -->
<link rel="prefetch" href="/about">
<link rel="prefetch" href="/contact">
```

## Troubleshooting

### Common Issues

#### 1. Lazy Loading Not Working

**Problem**: Images not loading when scrolled into view.

**Solution**:
```javascript
// Check browser support
if (!('IntersectionObserver' in window)) {
  // Load all images immediately
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
}

// Check element visibility
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    console.log('Element visibility:', entry.isIntersecting, entry.target);
  });
});
```

#### 2. Web Vitals Not Being Tracked

**Problem**: No Web Vitals data being reported.

**Solution**:
```javascript
// Check PerformanceObserver support
if (!('PerformanceObserver' in window)) {
  console.warn('PerformanceObserver not supported');
  // Use fallback methods
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    console.log('Fallback metrics:', { navigation, fcp });
  });
}
```

#### 3. High Memory Usage

**Problem**: Memory usage continuously increasing.

**Solution**:
```javascript
// Cleanup observers and event listeners
class PerformanceOptimizer {
  destroy() {
    // Disconnect all observers
    this.webVitals.cleanup();
    this.lazyLoader.destroy();
    
    // Clear intervals
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    
    // Remove event listeners
    document.removeEventListener('performance-alert', this.handleAlert);
  }
}
```

### Debug Mode

```javascript
// Enable debug mode
const optimizer = new PerformanceOptimizer({
  debug: true,
  enableWebVitals: true,
  enableLazyLoading: true
});

// Debug mode will log:
// - All vital measurements
// - Lazy loading events
// - Resource preloading
// - Performance alerts
```

### Performance Testing

```javascript
// Synthetic performance testing
function runPerformanceTest() {
  const metrics = {};
  
  // Measure page load time
  const startTime = performance.now();
  window.addEventListener('load', () => {
    metrics.pageLoadTime = performance.now() - startTime;
  });
  
  // Measure resource loading
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
      if (entry.entryType === 'resource') {
        metrics[entry.name] = entry.duration;
      }
    });
  });
  observer.observe({ entryTypes: ['resource'] });
  
  return metrics;
}
```

## Browser Support

### Core Features
- **Modern Browsers**: Full support (Chrome 76+, Firefox 70+, Safari 13+, Edge 79+)
- **Legacy Browsers**: Graceful degradation with fallbacks

### Feature-Specific Support

#### Web Vitals (PerformanceObserver)
- ✅ Chrome 52+
- ✅ Firefox 57+
- ✅ Safari 11+
- ✅ Edge 79+

#### Lazy Loading (IntersectionObserver)
- ✅ Chrome 51+
- ✅ Firefox 55+
- ✅ Safari 12.1+
- ✅ Edge 15+

#### Service Workers
- ✅ Chrome 40+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Edge 17+

#### WebP/AVIF Support
- ✅ WebP: Chrome 23+, Firefox 65+, Safari 14+, Edge 18+
- ✅ AVIF: Chrome 85+, Firefox 86+, Safari 16+

### Polyfills

```javascript
// IntersectionObserver polyfill
if (!('IntersectionObserver' in window)) {
  import('intersection-observer').then(() => {
    // Initialize lazy loading after polyfill loads
    this.setupLazyLoading();
  });
}

// PerformanceObserver polyfill (limited functionality)
if (!('PerformanceObserver' in window)) {
  // Fallback to performance.getEntries()
  this.fallbackToPerformanceEntries();
}
```

## Performance Metrics Reference

### Measurement Units
- **Time**: Milliseconds (ms)
- **Data**: Bytes, KB, MB
- **Ratios**: Decimal (0.0 - 1.0)

### Thresholds
| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| FCP | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |
| LCP | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| FID | ≤ 100ms | 100ms - 300ms | > 300ms |
| CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| TTFB | ≤ 800ms | 800ms - 1.8s | > 1.8s |

### Custom Metrics
- **Long Tasks**: Tasks > 50ms
- **Memory Usage**: JS heap size
- **Network Quality**: Connection type and speed
- **Bundle Size**: JavaScript and CSS size

## License

MIT License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release with Web Vitals tracking
- Lazy loading implementation
- Resource optimization features
- Image optimization with WebP/AVIF support
- Performance monitoring and alerts
- Service worker integration
