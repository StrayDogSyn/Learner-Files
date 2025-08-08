'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        primary: [
          'glass-card border-blue-500/30 text-white',
          'hover:border-blue-400/50 hover:bg-blue-500/20',
          'active:scale-95 active:bg-blue-500/30'
        ],
        secondary: [
          'glass-card border-white/20 text-white',
          'hover:border-white/30 hover:bg-white/10',
          'active:scale-95 active:bg-white/20'
        ],
        accent: [
          'glass-card border-amber-500/30 text-amber-100',
          'hover:border-amber-400/50 hover:bg-amber-500/20',
          'active:scale-95 active:bg-amber-500/30'
        ],
        ghost: [
          'border-transparent text-white/80',
          'hover:bg-white/10 hover:text-white',
          'active:scale-95'
        ],
        outline: [
          'border border-white/30 bg-transparent text-white',
          'hover:bg-white/10 hover:border-white/50',
          'active:scale-95'
        ]
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-13 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',
        icon: 'h-11 w-11'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
          )}
          
          {children && (
            <span className={cn(
              'transition-all duration-200',
              loading && 'opacity-70'
            )}>
              {children}
            </span>
          )}
          
          {!loading && rightIcon && (
            <span className="flex-shrink-0">{rightIcon}</span>
          )}
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;