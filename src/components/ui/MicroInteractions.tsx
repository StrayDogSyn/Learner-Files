import React, { useState, useRef, useEffect } from 'react';

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  rippleColor?: string;
  duration?: number;
  onClick?: (e: React.MouseEvent) => void;
}

interface RippleEffect {
  x: number;
  y: number;
  size: number;
  id: number;
}

// Ripple Effect Component
export const RippleButton: React.FC<RippleProps> = ({
  children,
  className = '',
  disabled = false,
  rippleColor = 'rgba(183, 148, 92, 0.6)',
  duration = 600,
  onClick
}) => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (event: React.MouseEvent) => {
    if (disabled || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: RippleEffect = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, duration);

    onClick?.(event);
  };

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden
        transition-all duration-200 ease-out
        active:scale-95
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={createRipple}
      disabled={disabled}
    >
      {children}
      
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
            animationDuration: `${duration}ms`
          }}
        />
      ))}
    </button>
  );
};

// Interactive Card Component
interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  pressable?: boolean;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  pressable = true
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        relative overflow-hidden
        transition-all duration-300 ease-out
        cursor-pointer
        ${hoverable ? 'hover:scale-105 hover:shadow-2xl' : ''}
        ${pressable && isPressed ? 'scale-95' : ''}
        ${isHovered ? 'animate-glow' : ''}
        ${className}
      `}
      onClick={onClick}
      onMouseDown={() => pressable && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
    >
      {children}
      
      {/* Hover Overlay */}
      {isHovered && (
        <div className="
          absolute inset-0
          bg-gradient-to-r from-transparent via-white/5 to-transparent
          animate-shimmer
        " />
      )}
    </div>
  );
};

// Floating Label Input
interface FloatingLabelInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
  error?: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  className = '',
  required = false,
  error
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={`
          w-full px-4 py-3 pt-6
          bg-glass-dark backdrop-blur-sm
          border border-glass-border rounded-lg
          text-white placeholder-transparent
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-metallic-gold/50
          focus:border-metallic-gold
          ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
        `}
        placeholder={label}
      />
      
      {/* Floating Label */}
      <label
        className={`
          absolute left-4 transition-all duration-300 ease-out
          pointer-events-none
          ${isFloating 
            ? 'top-2 text-xs text-metallic-gold' 
            : 'top-3 text-base text-gray-400'
          }
          ${error ? 'text-red-500' : ''}
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Focus Indicator */}
      <div
        className={`
          absolute bottom-0 left-0 h-0.5
          bg-gradient-to-r from-metallic-gold to-hunter-green-400
          transition-all duration-300 ease-out
          ${isFocused ? 'w-full' : 'w-0'}
        `}
      />
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-500 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

// Animated Button
interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  icon,
  iconPosition = 'left'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-gradient-to-r from-hunter-green-500 to-hunter-green-600
          hover:from-hunter-green-400 hover:to-hunter-green-500
          text-white border-transparent
          shadow-lg hover:shadow-xl
        `;
      case 'secondary':
        return `
          bg-gradient-to-r from-metallic-gold to-yellow-600
          hover:from-yellow-400 hover:to-metallic-gold
          text-charcoal-900 border-transparent
          shadow-lg hover:shadow-xl
        `;
      case 'outline':
        return `
          bg-transparent border-2 border-metallic-gold
          hover:bg-metallic-gold hover:text-charcoal-900
          text-metallic-gold
        `;
      case 'ghost':
        return `
          bg-transparent border-transparent
          hover:bg-white/10
          text-white
        `;
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'md':
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <RippleButton
      className={`
        relative inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-300 ease-out
        transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-metallic-gold
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Content */}
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {icon && iconPosition === 'left' && (
          <span className="transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}
        
        <span>{children}</span>
        
        {icon && iconPosition === 'right' && (
          <span className="transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}
      </div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 rounded-lg metallic-shine" />
    </RippleButton>
  );
};

// Progress Bar with Animation
interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
  animated?: boolean;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  className = '',
  showLabel = true,
  color = 'from-hunter-green-400 to-hunter-green-500',
  animated = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`relative ${className}`}>
      {/* Background */}
      <div className="w-full h-3 bg-glass-dark rounded-full overflow-hidden border border-glass-border">
        {/* Progress Fill */}
        <div
          className={`
            h-full bg-gradient-to-r ${color}
            transition-all duration-1000 ease-out
            ${animated ? 'animate-shimmer' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between items-center mt-1 text-sm text-gray-400">
          <span>{Math.round(percentage)}%</span>
          <span>{value}/{max}</span>
        </div>
      )}
    </div>
  );
};

// Tooltip Component
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      case 'top':
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {/* Tooltip */}
      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2
            bg-charcoal-800 text-white text-sm rounded-lg
            border border-glass-border
            backdrop-blur-sm
            animate-fade-in
            ${getPositionClasses()}
          `}
        >
          {content}
          
          {/* Arrow */}
          <div
            className={`
              absolute w-2 h-2 bg-charcoal-800 border border-glass-border
              transform rotate-45
              ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
              ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
              ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
              ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default {
  RippleButton,
  InteractiveCard,
  FloatingLabelInput,
  AnimatedButton,
  AnimatedProgress,
  Tooltip
};