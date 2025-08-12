import React, { useState, useEffect, useRef, createContext, useContext, isValidElement, Children } from 'react';

// Transition Context
interface TransitionContextType {
  isTransitioning: boolean;
  startTransition: (callback: () => void, duration?: number) => void;
  transitionState: 'idle' | 'entering' | 'exiting';
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

// Transition Provider
interface TransitionProviderProps {
  children: React.ReactNode;
}

export const TransitionProvider: React.FC<TransitionProviderProps> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionState, setTransitionState] = useState<'idle' | 'entering' | 'exiting'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTransition = (callback: () => void, duration = 300) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTransitionState('exiting');

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Execute callback after exit animation
    timeoutRef.current = setTimeout(() => {
      callback();
      setTransitionState('entering');
      
      // Complete transition after enter animation
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionState('idle');
      }, duration);
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition, transitionState }}>
      {children}
    </TransitionContext.Provider>
  );
};

// Page Transition Component
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  type?: 'fade' | 'slide' | 'scale' | 'blur';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  type = 'fade',
  direction = 'up',
  duration = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setShouldRender(true);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getTransitionClasses = () => {
    const baseClasses = `transition-all duration-${duration} ease-out`;
    
    switch (type) {
      case 'slide':
        const slideDirection = {
          up: isVisible ? 'translate-y-0' : 'translate-y-8',
          down: isVisible ? 'translate-y-0' : '-translate-y-8',
          left: isVisible ? 'translate-x-0' : 'translate-x-8',
          right: isVisible ? 'translate-x-0' : '-translate-x-8'
        };
        return `${baseClasses} ${slideDirection[direction]} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
      
      case 'scale':
        return `${baseClasses} ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`;
      
      case 'blur':
        return `${baseClasses} ${isVisible ? 'blur-0 opacity-100' : 'blur-sm opacity-0'}`;
      
      case 'fade':
      default:
        return `${baseClasses} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
    }
  };

  if (!shouldRender) return null;

  return (
    <div className={`${getTransitionClasses()} ${className}`}>
      {children}
    </div>
  );
};

// Staggered Animation Container
interface StaggeredAnimationProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  animationType?: 'fadeInUp' | 'slideInLeft' | 'scaleIn' | 'fadeIn';
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  className = '',
  staggerDelay = 100,
  animationType = 'fadeInUp'
}) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, index]));
            }, index * staggerDelay);
          }
        });
      },
      { threshold: 0.1 }
    );

    const container = containerRef.current;
    if (container) {
      const items = container.querySelectorAll('[data-index]');
      items.forEach(item => observer.observe(item));
    }

    return () => observer.disconnect();
  }, [staggerDelay]);

  const getAnimationClass = (index: number) => {
    const isVisible = visibleItems.has(index);
    const baseClasses = 'transition-all duration-500 ease-out';
    
    switch (animationType) {
      case 'slideInLeft':
        return `${baseClasses} ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`;
      case 'scaleIn':
        return `${baseClasses} ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`;
      case 'fadeIn':
        return `${baseClasses} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
      case 'fadeInUp':
      default:
        return `${baseClasses} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`;
    }
  };

  return (
    <div ref={containerRef} className={className}>
      {children && Children.map(children, (child, index) => (
        <div
          key={index}
          data-index={index}
          className={getAnimationClass(index)}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Modal Transition
interface ModalTransitionProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
}

export const ModalTransition: React.FC<ModalTransitionProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  overlayClassName = '',
  closeOnOverlayClick = true
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-300 ease-out
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
        ${overlayClassName}
      `}
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
      />
      
      {/* Modal Content */}
      <div
        className={`
          relative z-10 max-w-lg w-full mx-4
          transition-all duration-300 ease-out
          ${isAnimating 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
          }
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
};

// Tab Transition
interface TabTransitionProps {
  activeTab: string;
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export const TabTransition: React.FC<TabTransitionProps> = ({
  activeTab,
  children,
  className = '',
  direction = 'horizontal'
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (activeTab !== currentTab) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentTab(activeTab);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 150);
    }
  }, [activeTab, currentTab]);

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-out';
    
    if (direction === 'vertical') {
      return `${baseClasses} ${isTransitioning 
        ? 'opacity-0 -translate-y-4' 
        : 'opacity-100 translate-y-0'
      }`;
    }
    
    return `${baseClasses} ${isTransitioning 
      ? 'opacity-0 translate-x-4' 
      : 'opacity-100 translate-x-0'
    }`;
  };

  return (
    <div className={`${getTransitionClasses()} ${className}`}>
      {children && Children.map(children, (child) => {
        if (isValidElement(child) && child.props.value === currentTab) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

// Accordion Transition
interface AccordionTransitionProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const AccordionTransition: React.FC<AccordionTransitionProps> = ({
  isOpen,
  children,
  className = '',
  duration = 300
}) => {
  const [height, setHeight] = useState<number | 'auto'>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;

    if (isOpen) {
      setIsAnimating(true);
      setHeight(contentHeight);
      
      setTimeout(() => {
        setHeight('auto');
        setIsAnimating(false);
      }, duration);
    } else {
      setIsAnimating(true);
      setHeight(contentHeight);
      
      setTimeout(() => {
        setHeight(0);
      }, 10);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, duration);
    }
  }, [isOpen, duration]);

  return (
    <div
      className={`overflow-hidden transition-all ease-out ${className}`}
      style={{
        height: height,
        transitionDuration: `${duration}ms`
      }}
    >
      <div ref={contentRef} className={`${isAnimating ? '' : 'transition-opacity duration-200'}`}>
        {children}
      </div>
    </div>
  );
};

// Loading State Transition
interface LoadingStateTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingComponent: React.ReactNode;
  className?: string;
}

export const LoadingStateTransition: React.FC<LoadingStateTransitionProps> = ({
  isLoading,
  children,
  loadingComponent,
  className = ''
}) => {
  const [showLoading, setShowLoading] = useState(isLoading);
  const [showContent, setShowContent] = useState(!isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowContent(false);
      setTimeout(() => setShowLoading(true), 50);
    } else {
      setShowLoading(false);
      setTimeout(() => setShowContent(true), 300);
    }
  }, [isLoading]);

  return (
    <div className={`relative ${className}`}>
      {/* Loading State */}
      <div
        className={`
          transition-all duration-300 ease-out
          ${showLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
          ${showContent ? 'absolute inset-0' : ''}
        `}
      >
        {loadingComponent}
      </div>
      
      {/* Content State */}
      <div
        className={`
          transition-all duration-300 ease-out
          ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        {children}
      </div>
    </div>
  );
};

// Route Transition Hook
export const useRouteTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('');

  const transitionToRoute = (newRoute: string, callback?: () => void) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    
    // Exit animation
    setTimeout(() => {
      setCurrentRoute(newRoute);
      callback?.();
      
      // Enter animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  return {
    isTransitioning,
    currentRoute,
    transitionToRoute
  };
};

export default {
  TransitionProvider,
  PageTransition,
  StaggeredAnimation,
  ModalTransition,
  TabTransition,
  AccordionTransition,
  LoadingStateTransition,
  useTransition,
  useRouteTransition
};