// Glassmorphic Input Component
// Form input with glassmorphism effects and validation states

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface GlassmorphicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showPasswordToggle?: boolean;
}

const GlassmorphicInput = forwardRef<HTMLInputElement, GlassmorphicInputProps>(
  ({
    className,
    label,
    error,
    success,
    hint,
    icon,
    iconPosition = 'left',
    variant = 'default',
    size = 'md',
    type,
    showPasswordToggle = false,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type;

    const baseClasses = [
      'w-full transition-all duration-300 ease-out',
      'backdrop-blur-md border rounded-xl',
      'focus:outline-none focus:ring-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-metallic-400/60'
    ].join(' ');

    const variantClasses = {
      default: [
        'bg-glass-base border-glass-border',
        'text-metallic-300',
        'focus:border-hunter-green-400 focus:ring-hunter-green-400/30',
        'hover:border-glass-border-visible'
      ].join(' '),
      
      filled: [
        'bg-glass-elevated border-glass-border-visible',
        'text-metallic-300',
        'focus:border-hunter-green-400 focus:ring-hunter-green-400/30',
        'hover:bg-glass-hover'
      ].join(' '),
      
      minimal: [
        'bg-transparent border-b-2 border-glass-border rounded-none',
        'text-metallic-300',
        'focus:border-hunter-green-400 focus:ring-0',
        'hover:border-glass-border-visible'
      ].join(' ')
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    };

    const stateClasses = error
      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30'
      : success
      ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30'
      : '';

    const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;
    const hasLeftIcon = icon && iconPosition === 'left';
    const hasRightIcon = (icon && iconPosition === 'right') || showPasswordToggle || error || success;
    
    const paddingClasses = [
      hasLeftIcon ? (size === 'sm' ? 'pl-9' : size === 'md' ? 'pl-11' : 'pl-12') : '',
      hasRightIcon ? (size === 'sm' ? 'pr-9' : size === 'md' ? 'pr-11' : 'pr-12') : ''
    ].filter(Boolean).join(' ');

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-metallic-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {hasLeftIcon && (
            <div className={cn(
              'absolute left-0 top-0 h-full flex items-center justify-center',
              size === 'sm' ? 'w-9' : size === 'md' ? 'w-11' : 'w-12',
              'text-metallic-400'
            )}>
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[size],
              stateClasses,
              paddingClasses,
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            {...props}
          />
          
          {hasRightIcon && (
            <div className={cn(
              'absolute right-0 top-0 h-full flex items-center justify-center gap-1',
              size === 'sm' ? 'w-9' : size === 'md' ? 'w-11' : 'w-12'
            )}>
              {error && (
                <AlertCircle 
                  size={iconSize} 
                  className="text-red-400" 
                />
              )}
              
              {success && !error && (
                <CheckCircle 
                  size={iconSize} 
                  className="text-green-400" 
                />
              )}
              
              {showPasswordToggle && !error && !success && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-metallic-400 hover:text-metallic-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={iconSize} />
                  ) : (
                    <Eye size={iconSize} />
                  )}
                </button>
              )}
              
              {icon && iconPosition === 'right' && !showPasswordToggle && !error && !success && (
                <span className="text-metallic-400">
                  {icon}
                </span>
              )}
            </div>
          )}
          
          {isFocused && (
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-hunter-green-400/10 via-transparent to-hunter-green-400/10 rounded-xl blur-sm" />
          )}
        </div>
        
        {(error || success || hint) && (
          <div className="mt-2 text-sm">
            {error && (
              <p className="text-red-400 flex items-center gap-1">
                <AlertCircle size={14} />
                {error}
              </p>
            )}
            
            {success && !error && (
              <p className="text-green-400 flex items-center gap-1">
                <CheckCircle size={14} />
                {success}
              </p>
            )}
            
            {hint && !error && !success && (
              <p className="text-metallic-400">
                {hint}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

GlassmorphicInput.displayName = 'GlassmorphicInput';

export { GlassmorphicInput, type GlassmorphicInputProps };