import React, { forwardRef, InputHTMLAttributes } from 'react';
import { ComponentProps, StyleProps, EventProps, AccessibilityProps, ThemeProps, AnimationProps } from '../index';

export interface InputProps 
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    ComponentProps,
    StyleProps,
    EventProps,
    AccessibilityProps,
    ThemeProps,
    AnimationProps {
  variant?: 'default' | 'outlined' | 'filled' | 'underlined' | 'glassmorphic';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  helperText?: string;
  error?: string | boolean;
  success?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  bordered?: boolean;
  focused?: boolean;
  invalid?: boolean;
  required?: boolean;
  counter?: boolean;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  multiline?: boolean;
  rows?: number;
  autoResize?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    variant = 'default',
    size = 'md',
    type = 'text',
    label,
    helperText,
    error,
    success = false,
    loading = false,
    leftIcon,
    rightIcon,
    leftAddon,
    rightAddon,
    clearable = false,
    showPasswordToggle = false,
    fullWidth = false,
    rounded = true,
    bordered = true,
    focused = false,
    invalid = false,
    required = false,
    counter = false,
    maxLength,
    resize = 'none',
    multiline = false,
    rows = 3,
    autoResize = false,
    disabled = false,
    value,
    defaultValue,
    placeholder,
    className = '',
    style,
    sx,
    animate = true,
    duration = 200,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClick,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    'data-testid': testId,
    id,
    name,
    ...rest
  },
  ref
) => {
  const [isFocused, setIsFocused] = React.useState(focused);
  const [showPassword, setShowPassword] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || defaultValue || '');
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasError = error && error !== false;
  const isPasswordType = type === 'password';
  const actualType = isPasswordType && showPassword ? 'text' : type;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(event as React.ChangeEvent<HTMLInputElement>);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(event as React.FocusEvent<HTMLInputElement>);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(event as React.FocusEvent<HTMLInputElement>);
  };

  const handleClear = () => {
    const event = {
      target: { value: '' },
      currentTarget: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    
    if (!isControlled) {
      setInternalValue('');
    }
    
    onChange?.(event);
    inputRef.current?.focus();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Auto-resize textarea
  React.useEffect(() => {
    if (autoResize && multiline && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [currentValue, autoResize, multiline]);

  // Base styles
  const baseStyles = `
    w-full transition-all duration-${duration}
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${animate ? 'transform focus:scale-[1.02]' : ''}
    ${multiline && resize !== 'none' ? `resize-${resize}` : 'resize-none'}
  `;

  // Size styles
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs min-h-[24px]',
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[40px]',
    lg: 'px-5 py-3 text-lg min-h-[48px]',
    xl: 'px-6 py-4 text-xl min-h-[56px]'
  };

  // Border radius styles
  const roundedStyles = rounded ? {
    xs: 'rounded-sm',
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl'
  }[size] : 'rounded-none';

  // Variant styles
  const variantStyles = {
    default: `
      bg-white dark:bg-gray-800
      ${bordered ? 'border border-gray-300 dark:border-gray-600' : ''}
      ${isFocused ? 'border-blue-500 ring-blue-500' : ''}
      ${hasError ? 'border-red-500 ring-red-500' : ''}
      ${success ? 'border-green-500 ring-green-500' : ''}
    `,
    outlined: `
      bg-transparent border-2 border-gray-300 dark:border-gray-600
      ${isFocused ? 'border-blue-500 ring-blue-500' : ''}
      ${hasError ? 'border-red-500 ring-red-500' : ''}
      ${success ? 'border-green-500 ring-green-500' : ''}
    `,
    filled: `
      bg-gray-100 dark:bg-gray-700 border-0 border-b-2 border-gray-300 dark:border-gray-600
      ${isFocused ? 'border-blue-500 ring-blue-500' : ''}
      ${hasError ? 'border-red-500 ring-red-500' : ''}
      ${success ? 'border-green-500 ring-green-500' : ''}
      rounded-t-lg rounded-b-none
    `,
    underlined: `
      bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600
      ${isFocused ? 'border-blue-500' : ''}
      ${hasError ? 'border-red-500' : ''}
      ${success ? 'border-green-500' : ''}
      rounded-none px-0
    `,
    glassmorphic: `
      bg-white/10 backdrop-blur-md border border-white/20
      ${isFocused ? 'border-white/40 ring-white/20' : ''}
      ${hasError ? 'border-red-400/50 ring-red-400/20' : ''}
      ${success ? 'border-green-400/50 ring-green-400/20' : ''}
      text-white placeholder-white/60
    `
  };

  // Icon and addon padding adjustments
  const paddingAdjustments = {
    left: leftIcon || leftAddon ? {
      xs: 'pl-8',
      sm: 'pl-10',
      md: 'pl-12',
      lg: 'pl-14',
      xl: 'pl-16'
    }[size] : '',
    right: rightIcon || rightAddon || clearable || showPasswordToggle ? {
      xs: 'pr-8',
      sm: 'pr-10',
      md: 'pr-12',
      lg: 'pr-14',
      xl: 'pr-16'
    }[size] : ''
  };

  const combinedClassName = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${roundedStyles}
    ${variantStyles[variant]}
    ${paddingAdjustments.left}
    ${paddingAdjustments.right}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const combinedStyle = {
    ...style,
    ...sx
  };

  const inputProps = {
    ref: inputRef,
    className: combinedClassName,
    style: combinedStyle,
    type: actualType,
    value: currentValue,
    placeholder,
    disabled,
    required,
    maxLength,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown,
    onKeyUp,
    onClick,
    'aria-label': ariaLabel || label,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy || (helperText || hasError ? `${id}-helper` : undefined),
    'aria-invalid': ariaInvalid || hasError || invalid,
    'aria-required': ariaRequired || required,
    'data-testid': testId,
    id,
    name,
    ...rest
  };

  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <label
        htmlFor={id}
        className={`
          block text-sm font-medium mb-1
          ${hasError ? 'text-red-600 dark:text-red-400' : ''}
          ${success ? 'text-green-600 dark:text-green-400' : ''}
          ${variant === 'glassmorphic' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
          ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}
        `}
      >
        {label}
      </label>
    );
  };

  const renderHelperText = () => {
    const text = hasError ? (typeof error === 'string' ? error : 'Invalid input') : helperText;
    if (!text && !counter) return null;
    
    return (
      <div className="mt-1 flex justify-between items-center">
        {text && (
          <p
            id={`${id}-helper`}
            className={`
              text-xs
              ${hasError ? 'text-red-600 dark:text-red-400' : ''}
              ${success ? 'text-green-600 dark:text-green-400' : ''}
              ${variant === 'glassmorphic' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}
            `}
          >
            {text}
          </p>
        )}
        
        {counter && maxLength && (
          <span
            className={`
              text-xs
              ${variant === 'glassmorphic' ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}
            `}
          >
            {String(currentValue).length}/{maxLength}
          </span>
        )}
      </div>
    );
  };

  const renderLeftElement = () => {
    if (!leftIcon && !leftAddon) return null;
    
    const iconSize = {
      xs: 'w-4 h-4',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7'
    }[size];
    
    const position = {
      xs: 'left-2',
      sm: 'left-3',
      md: 'left-3',
      lg: 'left-4',
      xl: 'left-5'
    }[size];
    
    return (
      <div className={`absolute ${position} top-1/2 transform -translate-y-1/2 pointer-events-none`}>
        {leftAddon || (
          <span className={`${iconSize} text-gray-400 dark:text-gray-500`}>
            {leftIcon}
          </span>
        )}
      </div>
    );
  };

  const renderRightElement = () => {
    const elements = [];
    
    if (loading) {
      elements.push(
        <div key="loading" className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
      );
    }
    
    if (clearable && currentValue && !loading) {
      elements.push(
        <button
          key="clear"
          type="button"
          onClick={handleClear}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Clear input"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      );
    }
    
    if (showPasswordToggle && isPasswordType && !loading) {
      elements.push(
        <button
          key="password-toggle"
          type="button"
          onClick={togglePasswordVisibility}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      );
    }
    
    if (rightIcon && !loading) {
      const iconSize = {
        xs: 'w-4 h-4',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-7 h-7'
      }[size];
      
      elements.push(
        <span key="right-icon" className={`${iconSize} text-gray-400 dark:text-gray-500`}>
          {rightIcon}
        </span>
      );
    }
    
    if (rightAddon) {
      elements.push(
        <span key="right-addon">
          {rightAddon}
        </span>
      );
    }
    
    if (elements.length === 0) return null;
    
    const position = {
      xs: 'right-2',
      sm: 'right-3',
      md: 'right-3',
      lg: 'right-4',
      xl: 'right-5'
    }[size];
    
    return (
      <div className={`absolute ${position} top-1/2 transform -translate-y-1/2 flex items-center space-x-1`}>
        {elements}
      </div>
    );
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {renderLabel()}
      
      <div className="relative">
        {multiline ? (
          <textarea
            {...(inputProps as any)}
            ref={textareaRef}
            rows={autoResize ? undefined : rows}
          />
        ) : (
          <input {...inputProps} />
        )}
        
        {renderLeftElement()}
        {renderRightElement()}
      </div>
      
      {renderHelperText()}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

/**
 * Input Component
 * 
 * A comprehensive input component that provides consistent
 * styling and behavior across all platforms.
 * 
 * Features:
 * - Multiple variants (default, outlined, filled, underlined, glassmorphic)
 * - Different sizes (xs, sm, md, lg, xl)
 * - Label and helper text support
 * - Error and success states
 * - Loading state with spinner
 * - Icon support (left and right)
 * - Addon support for custom elements
 * - Clearable functionality
 * - Password visibility toggle
 * - Character counter
 * - Multiline support (textarea)
 * - Auto-resize for textarea
 * - Full accessibility support
 * - Platform-specific optimizations
 * - Touch-friendly interactions
 * 
 * Usage:
 * ```tsx
 * import { Input } from '@shared/components';
 * 
 * function MyComponent() {
 *   return (
 *     <>
 *       <Input
 *         label="Email"
 *         type="email"
 *         placeholder="Enter your email"
 *         required
 *       />
 *       
 *       <Input
 *         variant="glassmorphic"
 *         type="password"
 *         label="Password"
 *         showPasswordToggle
 *         clearable
 *       />
 *       
 *       <Input
 *         multiline
 *         rows={4}
 *         autoResize
 *         label="Message"
 *         helperText="Enter your message here"
 *         counter
 *         maxLength={500}
 *       />
 *     </>
 *   );
 * }
 * ```
 */