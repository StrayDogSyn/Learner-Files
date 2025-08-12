import * as React from 'react';
const { ReactNode, HTMLAttributes, useEffect, useState } = React;
import { cn } from '../utils/cn';
import * as ChildrenUtils from '../utils/react-children-polyfill';

interface ShimmerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  variant?: 'wave' | 'pulse' | 'slide' | 'glow' | 'rainbow';
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right' | 'top' | 'bottom';
  intensity?: 'subtle' | 'medium' | 'strong';
  loading?: boolean;
}

export const ShimmerContainer: React.FC<ShimmerProps> = ({
  children,
  variant = 'wave',
  speed = 'normal',
  direction = 'right',
  intensity = 'medium',
  loading = true,
  className,
  ...props
}) => {
  const speeds = {
    slow: 'duration-3000',
    normal: 'duration-2000',
    fast: 'duration-1000'
  };

  const intensities = {
    subtle: 'opacity-30',
    medium: 'opacity-50',
    strong: 'opacity-70'
  };

  const getShimmerClasses = () => {
    switch (variant) {
      case 'wave':
        return `animate-shimmer-wave ${speeds[speed]}`;
      case 'pulse':
        return `animate-pulse ${speeds[speed]}`;
      case 'slide':
        return `animate-shimmer-slide ${speeds[speed]}`;
      case 'glow':
        return `animate-shimmer-glow ${speeds[speed]}`;
      case 'rainbow':
        return `animate-shimmer-rainbow ${speeds[speed]}`;
      default:
        return `animate-shimmer-wave ${speeds[speed]}`;
    }
  };

  const getGradientDirection = () => {
    switch (direction) {
      case 'left':
        return 'bg-gradient-to-l';
      case 'right':
        return 'bg-gradient-to-r';
      case 'top':
        return 'bg-gradient-to-t';
      case 'bottom':
        return 'bg-gradient-to-b';
      default:
        return 'bg-gradient-to-r';
    }
  };

  if (!loading && children) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
      <div className={cn(
        'absolute inset-0 -translate-x-full',
        getGradientDirection(),
        'from-transparent via-white to-transparent',
        intensities[intensity],
        getShimmerClasses()
      )} />
    </div>
  );
};

interface ShimmerTextProps {
  lines?: number;
  width?: string[];
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({
  lines = 3,
  width = ['100%', '80%', '60%'],
  height = 'md',
  className
}) => {
  const heights = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <ShimmerContainer
          key={index}
          className={cn(
            'bg-gray-300 dark:bg-gray-700 rounded',
            heights[height]
          )}
          style={{ width: width[index] || width[width.length - 1] }}
        />
      ))}
    </div>
  );
};

interface ShimmerCardProps {
  hasImage?: boolean;
  hasAvatar?: boolean;
  textLines?: number;
  className?: string;
}

export const ShimmerCard: React.FC<ShimmerCardProps> = ({
  hasImage = true,
  hasAvatar = false,
  textLines = 3,
  className
}) => {
  return (
    <div className={cn('p-4 border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
      {hasImage && (
        <ShimmerContainer className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4" />
      )}
      
      <div className="flex items-center space-x-3 mb-4">
        {hasAvatar && (
          <ShimmerContainer className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
        )}
        <div className="flex-1">
          <ShimmerContainer className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <ShimmerContainer className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      
      <ShimmerText lines={textLines} />
    </div>
  );
};

interface ShimmerListProps {
  items?: number;
  hasAvatar?: boolean;
  className?: string;
}

export const ShimmerList: React.FC<ShimmerListProps> = ({
  items = 5,
  hasAvatar = true,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          {hasAvatar && (
            <ShimmerContainer className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
          )}
          <div className="flex-1 space-y-2">
            <ShimmerContainer className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <ShimmerContainer className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface ShimmerTableProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  className?: string;
}

export const ShimmerTable: React.FC<ShimmerTableProps> = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className
}) => {
  return (
    <div className={cn('w-full', className)}>
      {hasHeader && (
        <div className="grid gap-4 p-4 border-b border-gray-200 dark:border-gray-700" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <ShimmerContainer key={index} className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
          ))}
        </div>
      )}
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4 p-4 border-b border-gray-200 dark:border-gray-700" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <ShimmerContainer key={colIndex} className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

interface ShimmerImageProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}

export const ShimmerImage: React.FC<ShimmerImageProps> = ({
  width = 'w-full',
  height = 'h-48',
  rounded = true,
  className
}) => {
  return (
    <ShimmerContainer
      className={cn(
        'bg-gray-300 dark:bg-gray-700',
        width,
        height,
        rounded && 'rounded-lg',
        className
      )}
    />
  );
};

interface RevealAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  duration?: number;
  className?: string;
}

export const RevealAnimation: React.FC<RevealAnimationProps> = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 600,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(ref);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, delay]);

  const getTransformClasses = () => {
    const base = 'transition-all ease-out';
    const durationClass = `duration-${duration}`;
    
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `${base} ${durationClass} translate-y-8 opacity-0`;
        case 'down':
          return `${base} ${durationClass} -translate-y-8 opacity-0`;
        case 'left':
          return `${base} ${durationClass} translate-x-8 opacity-0`;
        case 'right':
          return `${base} ${durationClass} -translate-x-8 opacity-0`;
        case 'fade':
          return `${base} ${durationClass} opacity-0`;
        default:
          return `${base} ${durationClass} translate-y-8 opacity-0`;
      }
    }
    
    return `${base} ${durationClass} translate-x-0 translate-y-0 opacity-100`;
  };

  return (
    <div
      ref={setRef}
      className={cn(getTransformClasses(), className)}
    >
      {children}
    </div>
  );
};

interface StaggeredRevealProps {
  children: ReactNode;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
}

export const StaggeredReveal: React.FC<StaggeredRevealProps> = ({
  children,
  staggerDelay = 100,
  direction = 'up',
  className
}) => {
  const childrenArray = Children.toArray(children);
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <RevealAnimation
          key={index}
          delay={index * staggerDelay}
          direction={direction}
        >
          {child}
        </RevealAnimation>
      ))}
    </div>
  );
};

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  className?: string;
}

export const TypewriterEffect: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  className
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, index + 1));
        index++;
        
        if (index >= text.length) {
          clearInterval(interval);
          if (cursor) {
            setInterval(() => {
              setShowCursor(prev => !prev);
            }, 500);
          }
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text, speed, delay, cursor]);

  return (
    <span className={className}>
      {displayText}
      {cursor && showCursor && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default {
  ShimmerContainer,
  ShimmerText,
  ShimmerCard,
  ShimmerList,
  ShimmerTable,
  ShimmerImage,
  RevealAnimation,
  StaggeredReveal,
  TypewriterEffect
};