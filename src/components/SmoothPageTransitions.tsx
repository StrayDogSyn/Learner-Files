import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

interface PageTransitionProps {
  children: ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'blur' | 'flip' | 'curtain' | 'wave';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  direction = 'right',
  duration = 500,
  delay = 0,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const location = useLocation();
  const prevLocation = useRef(location.pathname);

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      setIsExiting(true);
      setTimeout(() => {
        setIsExiting(false);
        setIsVisible(false);
        setTimeout(() => {
          setIsVisible(true);
          prevLocation.current = location.pathname;
        }, 50);
      }, duration / 2);
    } else {
      setTimeout(() => setIsVisible(true), delay);
    }
  }, [location.pathname, duration, delay]);

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all ease-out';
    const durationClass = `duration-${duration}`;
    
    if (isExiting) {
      switch (type) {
        case 'fade':
          return `${baseClasses} ${durationClass} opacity-0`;
        case 'slide':
          const exitSlide = {
            left: 'translate-x-full',
            right: '-translate-x-full',
            up: 'translate-y-full',
            down: '-translate-y-full'
          };
          return `${baseClasses} ${durationClass} ${exitSlide[direction]} opacity-0`;
        case 'scale':
          return `${baseClasses} ${durationClass} scale-95 opacity-0`;
        case 'blur':
          return `${baseClasses} ${durationClass} blur-sm opacity-0`;
        case 'flip':
          return `${baseClasses} ${durationClass} rotate-y-90 opacity-0`;
        case 'curtain':
          return `${baseClasses} ${durationClass} scale-y-0 opacity-0`;
        case 'wave':
          return `${baseClasses} ${durationClass} skew-x-12 scale-x-0 opacity-0`;
        default:
          return `${baseClasses} ${durationClass} opacity-0`;
      }
    }
    
    if (!isVisible) {
      switch (type) {
        case 'fade':
          return `${baseClasses} ${durationClass} opacity-0`;
        case 'slide':
          const enterSlide = {
            left: '-translate-x-full',
            right: 'translate-x-full',
            up: '-translate-y-full',
            down: 'translate-y-full'
          };
          return `${baseClasses} ${durationClass} ${enterSlide[direction]} opacity-0`;
        case 'scale':
          return `${baseClasses} ${durationClass} scale-110 opacity-0`;
        case 'blur':
          return `${baseClasses} ${durationClass} blur-lg opacity-0`;
        case 'flip':
          return `${baseClasses} ${durationClass} rotate-y-90 opacity-0`;
        case 'curtain':
          return `${baseClasses} ${durationClass} scale-y-0 opacity-0`;
        case 'wave':
          return `${baseClasses} ${durationClass} skew-x-12 scale-x-0 opacity-0`;
        default:
          return `${baseClasses} ${durationClass} opacity-0`;
      }
    }
    
    return `${baseClasses} ${durationClass} translate-x-0 translate-y-0 scale-100 opacity-100 blur-0 rotate-y-0 skew-x-0`;
  };

  return (
    <div className={cn('transform-gpu', getTransitionClasses(), className)}>
      {children}
    </div>
  );
};

interface RouteTransitionProps {
  children: ReactNode;
  className?: string;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  className
}) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  const onAnimationEnd = () => {
    if (transitionStage === 'fadeOut') {
      setDisplayLocation(location);
      setTransitionStage('fadeIn');
    }
  };

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        transitionStage === 'fadeOut' ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
        className
      )}
      onTransitionEnd={onAnimationEnd}
    >
      {React.cloneElement(children as React.ReactElement, { key: displayLocation.pathname })}
    </div>
  );
};

interface LoadingTransitionProps {
  isLoading: boolean;
  children: ReactNode;
  loadingComponent?: ReactNode;
  type?: 'fade' | 'slide' | 'scale';
  className?: string;
}

export const LoadingTransition: React.FC<LoadingTransitionProps> = ({
  isLoading,
  children,
  loadingComponent,
  type = 'fade',
  className
}) => {
  const [showContent, setShowContent] = useState(!isLoading);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowContent(false);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowContent(true);
        setIsTransitioning(false);
      }, 150);
    }
  }, [isLoading]);

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-out';
    
    if (isLoading || isTransitioning) {
      switch (type) {
        case 'fade':
          return `${baseClasses} opacity-0`;
        case 'slide':
          return `${baseClasses} translate-y-4 opacity-0`;
        case 'scale':
          return `${baseClasses} scale-95 opacity-0`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }
    
    return `${baseClasses} translate-y-0 scale-100 opacity-100`;
  };

  return (
    <div className={cn('relative', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {loadingComponent || (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
        </div>
      )}
      
      <div className={getTransitionClasses()}>
        {showContent && children}
      </div>
    </div>
  );
};

interface StaggeredEntranceProps {
  children: ReactNode[];
  delay?: number;
  type?: 'fade' | 'slide' | 'scale';
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const StaggeredEntrance: React.FC<StaggeredEntranceProps> = ({
  children,
  delay = 100,
  type = 'fade',
  direction = 'up',
  className
}) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(children.length).fill(false));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * delay);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [children.length, delay]);

  const getItemClasses = (index: number) => {
    const baseClasses = 'transition-all duration-500 ease-out';
    
    if (!visibleItems[index]) {
      switch (type) {
        case 'fade':
          return `${baseClasses} opacity-0`;
        case 'slide':
          const slideClasses = {
            up: 'translate-y-8',
            down: '-translate-y-8',
            left: 'translate-x-8',
            right: '-translate-x-8'
          };
          return `${baseClasses} ${slideClasses[direction]} opacity-0`;
        case 'scale':
          return `${baseClasses} scale-95 opacity-0`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }
    
    return `${baseClasses} translate-x-0 translate-y-0 scale-100 opacity-100`;
  };

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div key={index} className={getItemClasses(index)}>
          {child}
        </div>
      ))}
    </div>
  );
};

interface MorphTransitionProps {
  isOpen: boolean;
  children: ReactNode;
  trigger: ReactNode;
  className?: string;
}

export const MorphTransition: React.FC<MorphTransitionProps> = ({
  isOpen,
  children,
  trigger,
  className
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isOpen]);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={triggerRef}
        className={cn(
          'transition-all duration-300 ease-out',
          isOpen && 'opacity-0 scale-95'
        )}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div
          ref={contentRef}
          className={cn(
            'absolute inset-0 transition-all duration-300 ease-out',
            isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface SlideRevealProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  trigger?: 'hover' | 'click' | 'scroll';
  className?: string;
}

export const SlideReveal: React.FC<SlideRevealProps> = ({
  children,
  direction = 'right',
  trigger = 'scroll',
  className
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger === 'scroll') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }
  }, [trigger]);

  const getRevealClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';
    
    if (!isRevealed) {
      const hiddenClasses = {
        left: 'translate-x-full',
        right: '-translate-x-full',
        up: 'translate-y-full',
        down: '-translate-y-full'
      };
      return `${baseClasses} ${hiddenClasses[direction]} opacity-0`;
    }
    
    return `${baseClasses} translate-x-0 translate-y-0 opacity-100`;
  };

  const handleTrigger = () => {
    if (trigger === 'click') {
      setIsRevealed(!isRevealed);
    } else if (trigger === 'hover') {
      setIsRevealed(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsRevealed(false);
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn('overflow-hidden', className)}
      onClick={handleTrigger}
      onMouseEnter={handleTrigger}
      onMouseLeave={handleMouseLeave}
    >
      <div className={getRevealClasses()}>
        {children}
      </div>
    </div>
  );
};

interface FlipCardTransitionProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  trigger?: 'hover' | 'click';
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export const FlipCardTransition: React.FC<FlipCardTransitionProps> = ({
  frontContent,
  backContent,
  trigger = 'hover',
  direction = 'horizontal',
  className
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (trigger === 'click') {
      setIsFlipped(!isFlipped);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsFlipped(false);
    }
  };

  const flipClass = direction === 'horizontal' ? 'rotate-y-180' : 'rotate-x-180';

  return (
    <div
      className={cn('relative w-full h-full perspective-1000', className)}
      onClick={handleFlip}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn(
        'relative w-full h-full transition-transform duration-700 transform-style-preserve-3d',
        isFlipped && flipClass
      )}>
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          {frontContent}
        </div>
        
        {/* Back */}
        <div className={cn(
          'absolute inset-0 w-full h-full backface-hidden',
          direction === 'horizontal' ? 'rotate-y-180' : 'rotate-x-180'
        )}>
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default {
  PageTransition,
  RouteTransition,
  LoadingTransition,
  StaggeredEntrance,
  MorphTransition,
  SlideReveal,
  FlipCardTransition
};