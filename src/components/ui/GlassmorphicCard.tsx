// Glassmorphic Card Component
// Implements glassmorphism design with backdrop-filter blur effects

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface GlassmorphicCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'elevated' | 'subtle' | 'intense';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  border?: 'none' | 'subtle' | 'visible';
  glow?: boolean;
  shimmer?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

const GlassmorphicCard = forwardRef<HTMLDivElement, GlassmorphicCardProps>(
  ({
    className,
    variant = 'base',
    blur = 'md',
    border = 'subtle',
    glow = false,
    shimmer = false,
    interactive = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = 'relative overflow-hidden transition-all duration-300 ease-out';
    
    const variantClasses = {
      base: 'bg-glass-base backdrop-blur-md',
      elevated: 'bg-glass-elevated backdrop-blur-lg shadow-glass-elevated',
      subtle: 'bg-glass-subtle backdrop-blur-sm',
      intense: 'bg-glass-intense backdrop-blur-xl shadow-glass-intense'
    };
    
    const blurClasses = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl'
    };
    
    const borderClasses = {
      none: '',
      subtle: 'border border-glass-border',
      visible: 'border border-glass-border-visible'
    };
    
    const interactiveClasses = interactive
      ? 'cursor-pointer hover:bg-glass-hover hover:shadow-glass-hover hover:scale-[1.02] active:scale-[0.98]'
      : '';
    
    const glowClasses = glow ? 'shadow-glow' : '';
    const shimmerClasses = shimmer ? 'shimmer' : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          blurClasses[blur],
          borderClasses[border],
          interactiveClasses,
          glowClasses,
          shimmerClasses,
          className
        )}
        {...props}
      >
        {shimmer && (
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        )}
        {children}
        {glow && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-hunter-green-400/20 via-metallic-400/20 to-hunter-green-400/20 blur-xl" />
        )}
      </div>
    );
  }
);

GlassmorphicCard.displayName = 'GlassmorphicCard';

export { GlassmorphicCard, type GlassmorphicCardProps };