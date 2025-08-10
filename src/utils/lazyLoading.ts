// Lazy Loading System with Intersection Observer
// Optimizes performance by loading content only when needed

interface LazyLoadOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  placeholder?: string;
  errorPlaceholder?: string;
  fadeIn?: boolean;
  onLoad?: (element: Element) => void;
  onError?: (element: Element) => void;
}

interface LazyImageOptions extends LazyLoadOptions {
  srcAttribute?: string;
  srcsetAttribute?: string;
  sizesAttribute?: string;
  backgroundImage?: boolean;
}

interface LazyComponentOptions extends LazyLoadOptions {
  componentLoader?: () => Promise<any>;
  fallback?: React.ComponentType;
}

// Default options
const DEFAULT_OPTIONS: LazyLoadOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 0.1,
  once: true,
  fadeIn: true
};

// Lazy Image Loading Class
export class LazyImageLoader {
  private observer: IntersectionObserver;
  private options: LazyImageOptions;
  private loadedImages = new Set<Element>();

  constructor(options: LazyImageOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.observer = this.createObserver();
  }

  private createObserver(): IntersectionObserver {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target as HTMLImageElement);
            
            if (this.options.once) {
              this.observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: this.options.root,
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      }
    );
  }

  private async loadImage(img: HTMLImageElement): Promise<void> {
    if (this.loadedImages.has(img)) return;

    const srcAttribute = this.options.srcAttribute || 'data-src';
    const srcsetAttribute = this.options.srcsetAttribute || 'data-srcset';
    const sizesAttribute = this.options.sizesAttribute || 'data-sizes';

    const src = img.getAttribute(srcAttribute);
    const srcset = img.getAttribute(srcsetAttribute);
    const sizes = img.getAttribute(sizesAttribute);

    if (!src && !srcset) return;

    try {
      // Add loading class
      img.classList.add('lazy-loading');

      if (this.options.backgroundImage) {
        await this.loadBackgroundImage(img, src!);
      } else {
        await this.loadRegularImage(img, src, srcset, sizes);
      }

      // Mark as loaded
      this.loadedImages.add(img);
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');

      // Add fade-in effect
      if (this.options.fadeIn) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        requestAnimationFrame(() => {
          img.style.opacity = '1';
        });
      }

      // Call success callback
      if (this.options.onLoad) {
        this.options.onLoad(img);
      }

    } catch (error) {
      console.error('Failed to load image:', error);
      this.handleImageError(img);
    }
  }

  private loadRegularImage(
    img: HTMLImageElement, 
    src?: string | null, 
    srcset?: string | null, 
    sizes?: string | null
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const tempImg = new Image();
      
      tempImg.onload = () => {
        if (src) img.src = src;
        if (srcset) img.srcset = srcset;
        if (sizes) img.sizes = sizes;
        resolve();
      };
      
      tempImg.onerror = reject;
      
      if (srcset) {
        tempImg.srcset = srcset;
        if (sizes) tempImg.sizes = sizes;
      }
      if (src) tempImg.src = src;
    });
  }

  private loadBackgroundImage(element: HTMLElement, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const tempImg = new Image();
      
      tempImg.onload = () => {
        element.style.backgroundImage = `url(${src})`;
        resolve();
      };
      
      tempImg.onerror = reject;
      tempImg.src = src;
    });
  }

  private handleImageError(img: HTMLImageElement): void {
    img.classList.remove('lazy-loading');
    img.classList.add('lazy-error');

    if (this.options.errorPlaceholder) {
      if (this.options.backgroundImage) {
        img.style.backgroundImage = `url(${this.options.errorPlaceholder})`;
      } else {
        img.src = this.options.errorPlaceholder;
      }
    }

    if (this.options.onError) {
      this.options.onError(img);
    }
  }

  observe(element: Element): void {
    this.observer.observe(element);
  }

  unobserve(element: Element): void {
    this.observer.unobserve(element);
  }

  disconnect(): void {
    this.observer.disconnect();
    this.loadedImages.clear();
  }
}

// Lazy Component Loading Class
export class LazyComponentLoader {
  private observer: IntersectionObserver;
  private options: LazyComponentOptions;
  private loadedComponents = new Set<Element>();

  constructor(options: LazyComponentOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.observer = this.createObserver();
  }

  private createObserver(): IntersectionObserver {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadComponent(entry.target);
            
            if (this.options.once) {
              this.observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: this.options.root,
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      }
    );
  }

  private async loadComponent(element: Element): Promise<void> {
    if (this.loadedComponents.has(element)) return;

    try {
      element.classList.add('lazy-loading');

      if (this.options.componentLoader) {
        await this.options.componentLoader();
      }

      this.loadedComponents.add(element);
      element.classList.remove('lazy-loading');
      element.classList.add('lazy-loaded');

      if (this.options.onLoad) {
        this.options.onLoad(element);
      }

    } catch (error) {
      console.error('Failed to load component:', error);
      element.classList.remove('lazy-loading');
      element.classList.add('lazy-error');

      if (this.options.onError) {
        this.options.onError(element);
      }
    }
  }

  observe(element: Element): void {
    this.observer.observe(element);
  }

  unobserve(element: Element): void {
    this.observer.unobserve(element);
  }

  disconnect(): void {
    this.observer.disconnect();
    this.loadedComponents.clear();
  }
}

// React Hooks for Lazy Loading
import { useEffect, useRef, useState, useCallback } from 'react';

// Lazy Image Hook
export function useLazyImage(options: LazyImageOptions = {}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;

    const loader = new LazyImageLoader({
      ...options,
      onLoad: (element) => {
        setIsLoaded(true);
        setIsLoading(false);
        if (options.onLoad) options.onLoad(element);
      },
      onError: (element) => {
        setHasError(true);
        setIsLoading(false);
        if (options.onError) options.onError(element);
      }
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded && !isLoading) {
          setIsLoading(true);
          loader.observe(imgRef.current!);
        }
      },
      {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
      loader.disconnect();
    };
  }, [options, isLoaded, isLoading]);

  return {
    imgRef,
    isLoaded,
    isLoading,
    hasError
  };
}

// Lazy Component Hook
export function useLazyComponent(loader: () => Promise<any>, options: LazyComponentOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadComponent = useCallback(async () => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    try {
      const module = await loader();
      const LoadedComponent = module.default || module;
      setComponent(() => LoadedComponent);
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load component:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [loader, isLoaded, isLoading]);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadComponent();
          if (options.once !== false) {
            observer.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1
      }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [loadComponent, options]);

  return {
    elementRef,
    Component,
    isLoaded,
    isLoading,
    hasError
  };
}

// Intersection Observer Hook
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  const elementRef = useRef<Element>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: '0px',
      threshold: 0.1,
      ...options
    });

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return elementRef;
}

// Utility functions
export function createLazyImagePlaceholder(width: number, height: number, color = '#1C1C1C'): string {
  return `data:image/svg+xml;base64,${btoa(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#C0C0C0" font-family="Inter">Loading...</text>
    </svg>`
  )}`;
}

export function createShimmerPlaceholder(width: number, height: number): string {
  return `data:image/svg+xml;base64,${btoa(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1C1C1C"/>
          <stop offset="50%" stop-color="#2A2A2A"/>
          <stop offset="100%" stop-color="#1C1C1C"/>
          <animateTransform attributeName="gradientTransform" type="translate" values="-100 0;100 0;-100 0" dur="2s" repeatCount="indefinite"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shimmer)"/>
    </svg>`
  )}`;
}

// Global lazy loading initialization
export function initializeLazyLoading(): void {
  // Initialize lazy images
  const lazyImages = document.querySelectorAll('img[data-src], [data-background-src]');
  if (lazyImages.length > 0) {
    const imageLoader = new LazyImageLoader({
      fadeIn: true,
      placeholder: createLazyImagePlaceholder(400, 300),
      errorPlaceholder: createLazyImagePlaceholder(400, 300, '#EF4444')
    });

    lazyImages.forEach(img => imageLoader.observe(img));
  }

  // Initialize lazy components
  const lazyComponents = document.querySelectorAll('[data-lazy-component]');
  if (lazyComponents.length > 0) {
    const componentLoader = new LazyComponentLoader();
    lazyComponents.forEach(component => componentLoader.observe(component));
  }
}

// CSS classes for styling
export const LAZY_LOADING_STYLES = `
  .lazy-loading {
    opacity: 0.7;
    filter: blur(2px);
    transition: all 0.3s ease;
  }
  
  .lazy-loaded {
    opacity: 1;
    filter: none;
  }
  
  .lazy-error {
    opacity: 0.5;
    filter: grayscale(100%);
  }
  
  .lazy-placeholder {
    background: linear-gradient(90deg, #1C1C1C 25%, #2A2A2A 50%, #1C1C1C 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

export default {
  LazyImageLoader,
  LazyComponentLoader,
  useLazyImage,
  useLazyComponent,
  useIntersectionObserver,
  createLazyImagePlaceholder,
  createShimmerPlaceholder,
  initializeLazyLoading,
  LAZY_LOADING_STYLES
};