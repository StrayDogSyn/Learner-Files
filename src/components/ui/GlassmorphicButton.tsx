// Glassmorphic Button Component
// Interactive button with glassmorphism effects and animations

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface GlassmorphicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'metallic';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  glow?: boolean;
  shimmer?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const GlassmorphicButton = forwardRef<HTMLButtonElement, GlassmorphicButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    glow = false,
    shimmer = false,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = [
      'relative inline-flex items-center justify-center',
      'font-medium transition-all duration-300 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-hunter-green-400/50',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'overflow-hidden backdrop-blur-md'
    ].join(' ');

    const variantClasses = {
      primary: [
        'bg-gradient-to-r from-hunter-green-500 to-hunter-green-400',
        'text-white shadow-glass-button',
        'hover:from-hunter-green-400 hover:to-hunter-green-300',
        'hover:shadow-glass-button-hover hover:scale-105',
        'active:scale-95'
      ].join(' '),
      
      secondary: [
        'bg-glass-base border border-glass-border',
        'text-metallic-300 shadow-glass-subtle',
        'hover:bg-glass-hover hover:border-glass-border-visible',
        'hover:shadow-glass-elevated hover:scale-105',
        'active:scale-95'
      ].join(' '),
      
      ghost: [
        'bg-transparent text-metallic-300',
        'hover:bg-glass-subtle hover:backdrop-blur-sm',
        'hover:scale-105 active:scale-95'
      ].join(' '),
      
      outline: [
        'bg-transparent border-2 border-hunter-green-400/50',
        'text-hunter-green-400',
        'hover:bg-hunter-green-400/10 hover:border-hunter-green-400',
        'hover:scale-105 active:scale-95'
      ].join(' '),
      
      metallic: [
        'bg-gradient-to-r from-metallic-400 to-metallic-300',
        'text-charcoal-900 shadow-glass-metallic',
        'hover:from-metallic-300 hover:to-metallic-200',
        'hover:shadow-glass-metallic-hover hover:scale-105',
        'active:scale-95'
      ].join(' ')
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
      md: 'px-4 py-2 text-base rounded-xl gap-2',
      lg: 'px-6 py-3 text-lg rounded-xl gap-2.5',
      xl: 'px-8 py-4 text-xl rounded-2xl gap-3'
    };

    const glowClasses = glow ? 'shadow-glow' : '';
    const shimmerClasses = shimmer ? 'shimmer' : '';
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          glowClasses,
          shimmerClasses,
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {shimmer && (
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
        
        {loading && (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 18 : 20} />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        
        {children && (
          <span className={loading ? 'opacity-0' : ''}>
            {children}
          </span>
        )}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        
        {glow && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-hunter-green-400/30 via-transparent to-hunter-green-400/30 blur-lg" />
        )}
      </button>
    );
  }
);

GlassmorphicButton.displayName = 'GlassmorphicButton';

export { GlassmorphicButton, type GlassmorphicButtonProps };