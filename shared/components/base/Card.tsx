import React, { forwardRef, HTMLAttributes } from 'react';
import { ComponentProps, StyleProps, EventProps, AccessibilityProps, ThemeProps, AnimationProps } from '../index';

export interface CardProps 
  extends HTMLAttributes<HTMLDivElement>,
    ComponentProps,
    StyleProps,
    EventProps,
    AccessibilityProps,
    ThemeProps,
    AnimationProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled' | 'glassmorphic';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  clickable?: boolean;
  loading?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  image?: string | React.ReactNode;
  imagePosition?: 'top' | 'bottom' | 'left' | 'right' | 'background';
  imageAlt?: string;
  bordered?: boolean;
  rounded?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  gradient?: boolean;
  blur?: boolean;
  interactive?: boolean;
  selectable?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>((
  {
    variant = 'default',
    padding = 'md',
    hoverable = false,
    clickable = false,
    loading = false,
    header,
    footer,
    actions,
    image,
    imagePosition = 'top',
    imageAlt = '',
    bordered = false,
    rounded = true,
    shadow = 'md',
    gradient = false,
    blur = false,
    interactive = false,
    selectable = false,
    selected = false,
    disabled = false,
    children,
    className = '',
    style,
    sx,
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
    'aria-selected': ariaSelected,
    'data-testid': testId,
    id,
    role,
    tabIndex,
    ...rest
  },
  ref
) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      if (clickable && !disabled && !loading) {
        setIsPressed(true);
        onClick?.(event as any);
      }
    }
    onKeyDown?.(event);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (clickable || interactive) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    setIsPressed(false);
    onMouseLeave?.(event);
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(false);
    setIsPressed(false);
    onBlur?.(event);
  };

  // Base styles
  const baseStyles = `
    relative overflow-hidden transition-all duration-${duration}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${clickable || interactive ? 'cursor-pointer' : ''}
    ${selectable ? 'select-none' : ''}
    ${animate && (hoverable || clickable || interactive) ? 'transform hover:scale-105' : ''}
    ${isPressed ? 'scale-95' : ''}
    ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
  `;

  // Padding styles
  const paddingStyles = {
    none: '',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  // Border radius styles
  const roundedStyles = rounded ? 'rounded-xl' : 'rounded-none';

  // Shadow styles
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  // Variant styles
  const variantStyles = {
    default: `
      bg-white dark:bg-gray-800
      ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''}
      ${shadowStyles[shadow]}
      ${hoverable && isHovered ? 'shadow-lg' : ''}
    `,
    outlined: `
      bg-transparent border-2 border-gray-200 dark:border-gray-700
      ${hoverable && isHovered ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50' : ''}
    `,
    elevated: `
      bg-white dark:bg-gray-800
      shadow-lg hover:shadow-xl
      ${hoverable && isHovered ? 'shadow-2xl' : ''}
    `,
    filled: `
      bg-gray-100 dark:bg-gray-700
      ${hoverable && isHovered ? 'bg-gray-200 dark:bg-gray-600' : ''}
    `,
    glassmorphic: `
      bg-white/10 backdrop-blur-md border border-white/20
      ${shadowStyles[shadow]}
      ${hoverable && isHovered ? 'bg-white/20 border-white/30' : ''}
      ${blur ? 'backdrop-blur-lg' : ''}
    `
  };

  // Gradient overlay
  const gradientOverlay = gradient ? `
    before:absolute before:inset-0 before:bg-gradient-to-br 
    before:from-blue-500/10 before:to-purple-600/10 before:pointer-events-none
  ` : '';

  // Selection styles
  const selectionStyles = selected ? `
    ring-2 ring-blue-500 ring-offset-2
    bg-blue-50 dark:bg-blue-900/20
    border-blue-200 dark:border-blue-700
  ` : '';

  const combinedClassName = `
    ${baseStyles}
    ${paddingStyles[padding]}
    ${roundedStyles}
    ${variantStyles[variant]}
    ${gradientOverlay}
    ${selectionStyles}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const combinedStyle = {
    ...style,
    ...sx
  };

  const renderImage = () => {
    if (!image) return null;

    const imageElement = typeof image === 'string' ? (
      <img
        src={image}
        alt={imageAlt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    ) : (
      image
    );

    if (imagePosition === 'background') {
      return (
        <div className="absolute inset-0 z-0">
          {imageElement}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      );
    }

    const imageContainerStyles = {
      top: 'w-full h-48 mb-4',
      bottom: 'w-full h-48 mt-4',
      left: 'w-48 h-full mr-4 flex-shrink-0',
      right: 'w-48 h-full ml-4 flex-shrink-0'
    };

    return (
      <div className={`overflow-hidden ${rounded ? 'rounded-lg' : ''} ${imageContainerStyles[imagePosition]}`}>
        {imageElement}
      </div>
    );
  };

  const renderHeader = () => {
    if (!header) return null;
    return (
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        {header}
      </div>
    );
  };

  const renderFooter = () => {
    if (!footer) return null;
    return (
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {footer}
      </div>
    );
  };

  const renderActions = () => {
    if (!actions) return null;
    return (
      <div className="mt-4 flex flex-wrap gap-2 justify-end">
        {actions}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
      );
    }

    const contentLayout = imagePosition === 'left' || imagePosition === 'right' ? 'flex' : 'block';
    const contentOrder = imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row';

    return (
      <div className={`${contentLayout} ${contentOrder} ${imagePosition === 'background' ? 'relative z-10' : ''}`}>
        {(imagePosition === 'left' || imagePosition === 'right') && renderImage()}
        
        <div className="flex-1 min-w-0">
          {imagePosition === 'top' && renderImage()}
          {renderHeader()}
          
          <div className="relative">
            {children}
          </div>
          
          {renderActions()}
          {renderFooter()}
          {imagePosition === 'bottom' && renderImage()}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className={combinedClassName}
      style={combinedStyle}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-selected={selectable ? (selected || ariaSelected) : undefined}
      aria-disabled={disabled}
      data-testid={testId}
      id={id}
      role={role || (clickable ? 'button' : undefined)}
      tabIndex={clickable || interactive ? (disabled ? -1 : tabIndex || 0) : tabIndex}
      {...rest}
    >
      {imagePosition === 'background' && renderImage()}
      {renderContent()}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

/**
 * Card Component
 * 
 * A versatile card container component that provides consistent
 * styling and behavior across all platforms.
 * 
 * Features:
 * - Multiple variants (default, outlined, elevated, filled, glassmorphic)
 * - Flexible padding options
 * - Image support with multiple positions
 * - Header, footer, and actions sections
 * - Interactive states (hoverable, clickable, selectable)
 * - Loading state with skeleton
 * - Gradient and blur effects
 * - Full accessibility support
 * - Platform-specific optimizations
 * - Touch-friendly interactions
 * 
 * Usage:
 * ```tsx
 * import { Card, Button } from '@shared/components';
 * 
 * function MyComponent() {
 *   return (
 *     <>
 *       <Card variant="default" hoverable>
 *         <h3>Card Title</h3>
 *         <p>Card content goes here...</p>
 *       </Card>
 *       
 *       <Card 
 *         variant="glassmorphic"
 *         image="/image.jpg"
 *         imagePosition="top"
 *         header={<h2>Card Header</h2>}
 *         actions={<Button>Action</Button>}
 *         clickable
 *         gradient
 *       >
 *         Glassmorphic card with image
 *       </Card>
 *       
 *       <Card 
 *         variant="outlined"
 *         selectable
 *         selected={isSelected}
 *         onClick={() => setSelected(!isSelected)}
 *       >
 *         Selectable card
 *       </Card>
 *     </>
 *   );
 * }
 * ```
 */