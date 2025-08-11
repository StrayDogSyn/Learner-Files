import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { ComponentProps, StyleProps, EventProps, AccessibilityProps, ThemeProps, AnimationProps } from '../index';

export interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ComponentProps,
    StyleProps,
    EventProps,
    AccessibilityProps,
    ThemeProps,
    AnimationProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  as?: 'button' | 'a' | 'div';
  ripple?: boolean;
  gradient?: boolean;
  glassmorphic?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    style,
    sx,
    href,
    target,
    rel,
    as = 'button',
    ripple = true,
    gradient = false,
    glassmorphic = false,
    animate = true,
    duration = 200,
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-expanded': ariaExpanded,
    'aria-pressed': ariaPressed,
    'data-testid': testId,
    id,
    role,
    tabIndex,
    ...rest
  },
  ref
) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const [rippleEffect, setRippleEffect] = React.useState<{ x: number; y: number; id: number } | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useImperativeHandle(ref, () => buttonRef.current!);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    if (ripple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setRippleEffect({ x, y, id: Date.now() });
      
      setTimeout(() => setRippleEffect(null), 600);
    }

    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      setIsPressed(true);
    }
    onKeyDown?.(event);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onMouseLeave?.(event);
  };

  // Base styles
  const baseStyles = `
    relative inline-flex items-center justify-center
    font-medium transition-all duration-${duration}
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
    ${fullWidth ? 'w-full' : ''}
    ${animate ? 'transform hover:scale-105 active:scale-95' : ''}
    ${isPressed ? 'scale-95' : ''}
  `;

  // Size styles
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs rounded-sm min-h-[24px]',
    sm: 'px-3 py-1.5 text-sm rounded-md min-h-[32px]',
    md: 'px-4 py-2 text-base rounded-lg min-h-[40px]',
    lg: 'px-6 py-3 text-lg rounded-xl min-h-[48px]',
    xl: 'px-8 py-4 text-xl rounded-2xl min-h-[56px]'
  };

  // Variant styles
  const variantStyles = {
    primary: glassmorphic
      ? `
        bg-white/10 backdrop-blur-md border border-white/20
        text-white hover:bg-white/20 focus:ring-blue-500
        shadow-lg hover:shadow-xl
        ${gradient ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
      `
      : `
        bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500
        shadow-md hover:shadow-lg
        ${gradient ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : ''}
      `,
    secondary: glassmorphic
      ? `
        bg-white/5 backdrop-blur-md border border-white/10
        text-white hover:bg-white/10 focus:ring-gray-500
        shadow-lg hover:shadow-xl
      `
      : `
        bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500
        shadow-md hover:shadow-lg
      `,
    outline: glassmorphic
      ? `
        bg-transparent backdrop-blur-md border-2 border-white/30
        text-white hover:bg-white/10 focus:ring-blue-500
        shadow-lg hover:shadow-xl
      `
      : `
        bg-transparent border-2 border-blue-600 text-blue-600
        hover:bg-blue-600 hover:text-white focus:ring-blue-500
        shadow-sm hover:shadow-md
      `,
    ghost: glassmorphic
      ? `
        bg-transparent backdrop-blur-md
        text-white hover:bg-white/10 focus:ring-gray-500
        shadow-lg hover:shadow-xl
      `
      : `
        bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500
        dark:text-gray-300 dark:hover:bg-gray-800
      `,
    link: `
      bg-transparent text-blue-600 hover:text-blue-800 focus:ring-blue-500
      underline-offset-4 hover:underline
      dark:text-blue-400 dark:hover:text-blue-300
    `,
    destructive: glassmorphic
      ? `
        bg-red-500/20 backdrop-blur-md border border-red-500/30
        text-red-100 hover:bg-red-500/30 focus:ring-red-500
        shadow-lg hover:shadow-xl
      `
      : `
        bg-red-600 text-white hover:bg-red-700 focus:ring-red-500
        shadow-md hover:shadow-lg
      `
  };

  const combinedClassName = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const combinedStyle = {
    ...style,
    ...sx
  };

  const commonProps = {
    ref: buttonRef,
    className: combinedClassName,
    style: combinedStyle,
    disabled: disabled || loading,
    onClick: handleClick,
    onFocus,
    onBlur,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseEnter,
    onMouseLeave: handleMouseLeave,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-expanded': ariaExpanded,
    'aria-pressed': ariaPressed,
    'aria-disabled': disabled || loading,
    'data-testid': testId,
    id,
    role: role || 'button',
    tabIndex: disabled ? -1 : tabIndex
  };

  const content = (
    <>
      {leftIcon && (
        <span className={`inline-flex ${children ? 'mr-2' : ''}`}>
          {leftIcon}
        </span>
      )}
      
      {loading ? (
        <span className="inline-flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
      
      {rightIcon && (
        <span className={`inline-flex ${children ? 'ml-2' : ''}`}>
          {rightIcon}
        </span>
      )}
      
      {rippleEffect && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${rippleEffect.x}px ${rippleEffect.y}px, rgba(255,255,255,0.3) 0%, transparent 70%)`
          }}
        />
      )}
    </>
  );

  if (as === 'a' || href) {
    return (
      <a
        {...(commonProps as any)}
        href={href}
        target={target}
        rel={rel}
        {...rest}
      >
        {content}
      </a>
    );
  }

  if (as === 'div') {
    return (
      <div
        {...(commonProps as any)}
        {...rest}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      {...commonProps}
      type={rest.type || 'button'}
      {...rest}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

/**
 * Button Component
 * 
 * A versatile button component that works across all platforms with
 * consistent styling and behavior.
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, link, destructive)
 * - Different sizes (xs, sm, md, lg, xl)
 * - Loading states with spinner
 * - Icon support (left and right)
 * - Ripple effect animation
 * - Glassmorphic design option
 * - Gradient backgrounds
 * - Full accessibility support
 * - Platform-specific optimizations
 * - Touch-friendly interactions
 * 
 * Usage:
 * ```tsx
 * import { Button } from '@shared/components';
 * 
 * function MyComponent() {
 *   return (
 *     <>
 *       <Button variant="primary" size="lg">
 *         Primary Button
 *       </Button>
 *       
 *       <Button 
 *         variant="outline" 
 *         loading={isLoading}
 *         leftIcon={<Icon />}
 *       >
 *         Loading Button
 *       </Button>
 *       
 *       <Button 
 *         variant="primary"
 *         glassmorphic
 *         gradient
 *         fullWidth
 *       >
 *         Glassmorphic Button
 *       </Button>
 *     </>
 *   );
 * }
 * ```
 */