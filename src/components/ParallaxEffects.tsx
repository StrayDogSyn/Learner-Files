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
          <div className="absolute in