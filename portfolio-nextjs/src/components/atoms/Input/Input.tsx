'use client';

import React, { useId } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  [
    'flex w-full rounded-lg border transition-all duration-300',
    'glass-card border-white/20 bg-white/5 text-white placeholder:text-white/50',
    'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white'
  ],
  {
    variants: {
      variant: {
        default: 'border-white/20 focus:border-blue-500/50',
        error: 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/50',
        success: 'border-green-500/50 focus:border-green-500/70 focus:ring-green-500/50',
        warning: 'border-yellow-500/50 focus:border-yellow-500/70 focus:ring-yellow-500/50'
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-13 px-5 text-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

const labelVariants = cva(
  'text-sm font-medium transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'text-white/80',
        error: 'text-red-400',
        success: 'text-green-400',
        warning: 'text-yellow-400'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const helperTextVariants = cva(
  'text-xs mt-1 transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'text-white/60',
        error: 'text-red-400',
        success: 'text-green-400',
        warning: 'text-yellow-400'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    containerClassName,
    variant,
    size,
    type = 'text',
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    id,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const finalVariant = error ? 'error' : variant;
    const displayHelperText = error || helperText;

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId}
            className={labelVariants({ variant: finalVariant })}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            type={type}
            id={inputId}
            className={cn(
              inputVariants({ variant: finalVariant, size }),
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        
        {displayHelperText && (
          <p className={helperTextVariants({ variant: finalVariant })}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
export default Input;