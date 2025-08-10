// Performance optimization utilities for animations and effects

/**
 * Throttle function to limit the rate of function execution
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Debounce function to delay function execution
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Request animation frame with fallback
 */
export const requestAnimationFrame = (
  callback: FrameRequestCallback
): number => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    ((callback: FrameRequestCallback) => window.setTimeout(callback, 1000 / 60))
  )(callback);
};

/**
 * Cancel animation frame with fallback
 */
export const cancelAnimationFrame = (id: number): void => {
  (
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.clearTimeout
  )(id);
};

/**
 * Check if device prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get device performance tier based on hardware capabilities
 */
export const getPerformanceTier = (): 'low' | 'medium' | 'high' => {
  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check for connection speed
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || '4g';
  
  // Simple scoring system
  let score = 0;
  
  if (cores >= 8) score += 3;
  else if (cores >= 4) score += 2;
  else score += 1;
  
  if (memory >= 8) score += 3;
  else if (memory >= 4) score += 2;
  else score += 1;
  
  if (effectiveType === '4g') score += 2;
  else if (effectiveType === '3g') score += 1;
  
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
};

/**
 * Optimize animation settings based on device performance
 */
export const getOptimizedAnimationSettings = () => {
  const tier = getPerformanceTier();
  const reducedMotion = prefersReducedMotion();
  
  if (reducedMotion) {
    return {
      enableAnimations: false,
      enableParallax: false,
      enableParticles: false,
      animationDuration: 0,
      maxParticles: 0
    };
  }
  
  switch (tier) {
    case 'high':
      return {
        enableAnimations: true,
        enableParallax: true,
        enableParticles: true,
        animationDuration: 300,
        maxParticles: 50,
        enableBlur: true,
        enable3D: true
      };
    case 'medium':
      return {
        enableAnimations: true,
        enableParallax: true,
        enableParticles: true,
        animationDuration: 200,
        maxParticles: 25,
        enableBlur: false,
        enable3D: false
      };
    case 'low':
      return {
        enableAnimations: true,
        enableParallax: false,
        enableParticles: false,
        animationDuration: 150,
        maxParticles: 0,
        enableBlur: false,
        enable3D: false
      };
    default:
      return {
        enableAnimations: true,
        enableParallax: false,
        enableParticles: false,
        animationDuration: 200,
        maxParticles: 10,
        enableBlur: false,
        enable3D: false
      };
  }
};

/**
 * Intersection Observer with performance optimizations
 */
export const createOptimizedObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Optimized scroll listener with throttling
 */
export const createOptimizedScrollListener = (
  callback: () => void,
  throttleMs: number = 16
) => {
  const throttledCallback = throttle(callback, throttleMs);
  
  const addListener = () => {
    window.addEventListener('scroll', throttledCallback, { passive: true });
  };
  
  const removeListener = () => {
    window.removeEventListener('scroll', throttledCallback);
  };
  
  return { addListener, removeListener };
};

/**
 * Optimized resize listener with debouncing
 */
export const createOptimizedResizeListener = (
  callback: () => void,
  debounceMs: number = 250
) => {
  const debouncedCallback = debounce(callback, debounceMs);
  
  const addListener = () => {
    window.addEventListener('resize', debouncedCallback, { passive: true });
  };
  
  const removeListener = () => {
    window.removeEventListener('resize', debouncedCallback);
  };
  
  return { addListener, removeListener };
};

/**
 * Memory-efficient animation loop
 */
export class AnimationLoop {
  private animationId: number | null = null;
  private isRunning = false;
  private callbacks: Set<() => void> = new Set();
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.loop();
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
  }
  
  addCallback(callback: () => void) {
    this.callbacks.add(callback);
  }
  
  removeCallback(callback: () => void) {
    this.callbacks.delete(callback);
  }
  
  private loop = () => {
    if (!this.isRunning) return;
    
    this.callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn('Animation callback error:', error);
      }
    });
    
    this.animationId = requestAnimationFrame(this.loop);
  };
}

/**
 * Global animation loop instance
 */
export const globalAnimationLoop = new AnimationLoop();

/**
 * CSS transform optimization
 */
export const optimizeTransform = (element: HTMLElement, transform: string) => {
  // Use transform3d to trigger hardware acceleration
  if (!transform.includes('translate3d') && !transform.includes('translateZ')) {
    element.style.transform = `${transform} translateZ(0)`;
  } else {
    element.style.transform = transform;
  }
  
  // Ensure will-change is set for better performance
  if (!element.style.willChange) {
    element.style.willChange = 'transform';
  }
};

/**
 * Cleanup will-change property after animation
 */
export const cleanupWillChange = (element: HTMLElement, delay: number = 1000) => {
  setTimeout(() => {
    element.style.willChange = 'auto';
  }, delay);
};

/**
 * Check if element is in viewport with margin
 */
export const isInViewport = (
  element: HTMLElement,
  margin: number = 0
): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= -margin &&
    rect.left >= -margin &&
    rect.bottom <= windowHeight + margin &&
    rect.right <= windowWidth + margin
  );
};

/**
 * Batch DOM reads and writes for better performance
 */
export class DOMBatcher {
  private readCallbacks: (() => void)[] = [];
  private writeCallbacks: (() => void)[] = [];
  private scheduled = false;
  
  read(callback: () => void) {
    this.readCallbacks.push(callback);
    this.schedule();
  }
  
  write(callback: () => void) {
    this.writeCallbacks.push(callback);
    this.schedule();
  }
  
  private schedule() {
    if (this.scheduled) return;
    
    this.scheduled = true;
    requestAnimationFrame(() => {
      // Execute all reads first
      this.readCallbacks.forEach(callback => callback());
      this.readCallbacks.length = 0;
      
      // Then execute all writes
      this.writeCallbacks.forEach(callback => callback());
      this.writeCallbacks.length = 0;
      
      this.scheduled = false;
    });
  }
}

/**
 * Global DOM batcher instance
 */
export const globalDOMBatcher = new DOMBatcher();

/**
 * Performance monitoring
 */
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

/**
 * Memory usage monitoring (if available)
 */
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit
    };
  }
  return null;
};

export default {
  throttle,
  debounce,
  requestAnimationFrame,
  cancelAnimationFrame,
  prefersReducedMotion,
  getPerformanceTier,
  getOptimizedAnimationSettings,
  createOptimizedObserver,
  createOptimizedScrollListener,
  createOptimizedResizeListener,
  AnimationLoop,
  globalAnimationLoop,
  optimizeTransform,
  cleanupWillChange,
  isInViewport,
  DOMBatcher,
  globalDOMBatcher,
  measurePerformance,
  getMemoryUsage
};