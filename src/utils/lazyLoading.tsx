import React, { Suspense, ComponentType } from 'react';
import { motion } from 'framer-motion';

// Loading spinner component
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-[400px] bg-[var(--deep-black)]">
    <div className="text-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-[var(--electric-blue)]/30 border-t-[var(--electric-blue)] rounded-full mx-auto"
      />
      <p className="text-white/70 font-body">{message}</p>
    </div>
  </div>
);

// Skeleton loader for project cards
const ProjectCardSkeleton: React.FC = () => (
  <div className="bg-[var(--deep-black)]/90 backdrop-blur-sm border border-[var(--hunter-green)]/30 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-48 bg-white/10" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-full" />
      <div className="h-4 bg-white/10 rounded w-2/3" />
      <div className="flex gap-2">
        <div className="h-6 bg-white/10 rounded w-16" />
        <div className="h-6 bg-white/10 rounded w-20" />
        <div className="h-6 bg-white/10 rounded w-14" />
      </div>
      <div className="flex gap-3 pt-2">
        <div className="h-12 bg-white/10 rounded flex-1" />
        <div className="h-12 bg-white/10 rounded w-16" />
      </div>
    </div>
  </div>
);

// Section skeleton loader
const SectionSkeleton: React.FC<{ title?: string; cardCount?: number }> = ({ 
  title = 'Loading Section...', 
  cardCount = 4 
}) => (
  <section className="py-20 px-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-black)] via-[var(--deep-black)]/95 to-[var(--deep-black)]" />
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--ai-purple)]/20 border border-[var(--ai-purple)]/30 rounded-full mb-6">
          <div className="w-5 h-5 bg-white/20 rounded animate-pulse" />
          <span className="text-[var(--ai-purple)] font-semibold">{title}</span>
        </div>
        <div className="h-12 bg-white/10 rounded w-96 mx-auto mb-6 animate-pulse" />
        <div className="h-6 bg-white/10 rounded w-[600px] mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: cardCount }).map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    </div>
  </section>
);

// Enhanced lazy loading wrapper with intersection observer
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  threshold?: number;
  rootMargin?: string;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback: Fallback = LoadingSpinner,
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : <Fallback />}
    </div>
  );
};

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ComponentType,
  options?: {
    threshold?: number;
    rootMargin?: string;
  }
) {
  return React.forwardRef<any, P>((props, ref) => (
    <Suspense fallback={fallback ? React.createElement(fallback) : <LoadingSpinner />}>
      <LazyWrapper 
        fallback={fallback}
        threshold={options?.threshold}
        rootMargin={options?.rootMargin}
      >
        <Component {...(props as any)} ref={ref} />
      </LazyWrapper>
    </Suspense>
  ));
}

// Lazy loading factory function
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFn);
  
  return React.forwardRef<any, P>((props, ref) => (
    <Suspense fallback={fallback ? React.createElement(fallback) : <LoadingSpinner />}>
      <LazyComponent {...(props as any)} ref={ref} />
    </Suspense>
  ));
}

// Image lazy loading component
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-white/10 animate-pulse flex items-center justify-center">
          {placeholder ? (
            <img src={placeholder} alt="" className="w-full h-full object-cover opacity-50" />
          ) : (
            <div className="w-8 h-8 border-2 border-[var(--electric-blue)]/30 border-t-[var(--electric-blue)] rounded-full animate-spin" />
          )}
        </div>
      )}
      
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full object-cover ${isLoaded ? 'block' : 'hidden'}`}
        />
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
          <div className="text-center text-white/50">
            <div className="w-8 h-8 mx-auto mb-2 opacity-50">⚠️</div>
            <p className="text-xs">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export { LoadingSpinner, ProjectCardSkeleton, SectionSkeleton, LazyWrapper };
export default {
  withLazyLoading,
  createLazyComponent,
  LazyImage,
  LoadingSpinner,
  ProjectCardSkeleton,
  SectionSkeleton,
  LazyWrapper
};