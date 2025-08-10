import React, { ReactNode, useEffect, useState, useRef, HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface ParallaxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  offset?: number;
  disabled?: boolean;
}

export const ParallaxContainer: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  offset = 0,
  disabled = false,
  className,
  ...props
}) => {
  const [scrollY, setScrollY] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [disabled]);

  const getTransform = () => {
    if (disabled || !isInView) return 'none';

    const movement = (scrollY + offset) * speed;
    
    switch (direction) {
      case 'up':
        return `translateY(-${movement}px)`;
      case 'down':
        return `translateY(${movement}px)`;
      case 'left':
        return `translateX(-${movement}px)`;
      case 'right':
        return `translateX(${movement}px)`;
      default:
        return `translateY(-${movement}px)`;
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn('will-change-transform', className)}
      style={{ transform: getTransform() }}
      {...props}
    >
      {children}
    </div>
  );
};

interface ParallaxLayerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  depth?: number;
  speed?: number;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  depth = 1,
  speed,
  className,
  ...props
}) => {
  const calculatedSpeed = speed || depth * 0.1;
  
  return (
    <ParallaxContainer
      speed={calculatedSpeed}
      className={cn('absolute inset-0', className)}
      style={{ zIndex: -depth }}
      {...props}
    >
      {children}
    </ParallaxContainer>
  );
};

interface ParallaxHeroProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  backgroundImage?: string;
  overlayOpacity?: number;
  height?: string;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  children,
  backgroundImage,
  overlayOpacity = 0.5,
  height = 'h-screen',
  className,
  ...props
}) => {
  return (
    <div className={cn('relative overflow-hidden', height, className)} {...props}>
      {/* Background layers */}
      <ParallaxLayer depth={3} speed={0.2}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-black/40" />
      </ParallaxLayer>
      
      <ParallaxLayer depth={2} speed={0.4}>
        {backgroundImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
        )}
      </ParallaxLayer>
      
      <ParallaxLayer depth={1} speed={0.6}>
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      </ParallaxLayer>
      
      {/* Floating particles */}
      <ParallaxLayer depth={0} speed={0.8}>
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </ParallaxLayer>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {children}
      </div>
    </div>
  );
};

interface ScrollTriggeredParallaxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  triggerPoint?: number;
  endPoint?: number;
  startTransform?: string;
  endTransform?: string;
}

export const ScrollTriggeredParallax: React.FC<ScrollTriggeredParallaxProps> = ({
  children,
  triggerPoint = 0.2,
  endPoint = 0.8,
  startTransform = 'translateY(100px) scale(0.8)',
  endTransform = 'translateY(0px) scale(1)',
  className,
  ...props
}) => {
  const [progress, setProgress] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      const triggerStart = windowHeight * (1 - triggerPoint);
      const triggerEnd = windowHeight * (1 - endPoint);
      
      if (elementTop <= triggerStart && elementTop >= triggerEnd) {
        const scrollProgress = (triggerStart - elementTop) / (triggerStart - triggerEnd);
        setProgress(Math.min(Math.max(scrollProgress, 0), 1));
      } else if (elementTop < triggerEnd) {
        setProgress(1);
      } else {
        setProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerPoint, endPoint]);

  const interpolateTransform = () => {
    // Simple linear interpolation between start and end transforms
    if (progress === 0) return startTransform;
    if (progress === 1) return endTransform;
    
    // For more complex interpolation, you might want to parse the transform strings
    // For now, we'll use a simple opacity and scale effect
    const opacity = progress;
    const scale = 0.8 + (progress * 0.2);
    const translateY = 100 - (progress * 100);
    
    return `translateY(${translateY}px) scale(${scale})`;
  };

  return (
    <div
      ref={elementRef}
      className={cn('transition-all duration-100 ease-out will-change-transform', className)}
      style={{ 
        transform: interpolateTransform(),
        opacity: progress
      }}
      {...props}
    >
      {children}
    </div>
  );
};

interface MouseParallaxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  intensity?: number;
  reverse?: boolean;
}

export const MouseParallax: React.FC<MouseParallaxProps> = ({
  children,
  intensity = 20,
  reverse = false,
  className,
  ...props
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => setMousePosition({ x: 0, y: 0 }));
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', () => setMousePosition({ x: 0, y: 0 }));
      }
    };
  }, []);

  const getTransform = () => {
    const multiplier = reverse ? -1 : 1;
    const x = mousePosition.x * intensity * multiplier;
    const y = mousePosition.y * intensity * multiplier;
    return `translate(${x}px, ${y}px)`;
  };

  return (
    <div ref={containerRef} className={cn('relative', className)} {...props}>
      <div 
        className="transition-transform duration-200 ease-out will-change-transform"
        style={{ transform: getTransform() }}
      >
        {children}
      </div>
    </div>
  );
};

interface ParallaxTextProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  speed?: number;
  blur?: boolean;
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({
  children,
  speed = 0.3,
  blur = false,
  className,
  ...props
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const getStyle = () => {
    if (!isVisible) return {};
    
    const movement = scrollY * speed;
    const blurAmount = blur ? Math.abs(movement) * 0.02 : 0;
    
    return {
      transform: `translateY(${movement}px)`,
      filter: blur ? `blur(${blurAmount}px)` : 'none'
    };
  };

  return (
    <div
      ref={textRef}
      className={cn('will-change-transform', className)}
      style={getStyle()}
      {...props}
    >
      {children}
    </div>
  );
};

interface ParallaxImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  speed?: number;
  scale?: number;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  speed = 0.5,
  scale = 1.1,
  className,
  ...props
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      <ParallaxContainer speed={speed}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover will-change-transform"
          style={{ transform: `scale(${scale})` }}
        />
      </ParallaxContainer>
    </div>
  );
};

export default {
  ParallaxContainer,
  ParallaxLayer,
  ParallaxHero,
  ScrollTriggeredParallax,
  MouseParallax,
  ParallaxText,
  ParallaxImage
};