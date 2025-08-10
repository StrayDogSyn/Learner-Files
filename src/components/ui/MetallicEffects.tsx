import React, { useState, useRef, useEffect } from 'react';

interface MetallicHoverProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: 'gold' | 'silver' | 'copper' | 'green';
  effect?: 'glow' | 'shine' | 'pulse' | 'ripple';
  disabled?: boolean;
}

// Metallic Hover Effect Component
export const MetallicHover: React.FC<MetallicHoverProps> = ({
  children,
  className = '',
  intensity = 'medium',
  color = 'gold',
  effect = 'glow',
  disabled = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const getColorClasses = () => {
    const colors = {
      gold: {
        glow: 'shadow-metallic-gold/50',
        shine: 'from-metallic-gold/20 via-yellow-300/30 to-metallic-gold/20',
        border: 'border-metallic-gold/50',
        text: 'text-metallic-gold'
      },
      silver: {
        glow: 'shadow-gray-300/50',
        shine: 'from-gray-300/20 via-white/30 to-gray-300/20',
        border: 'border-gray-300/50',
        text: 'text-gray-300'
      },
      copper: {
        glow: 'shadow-orange-400/50',
        shine: 'from-orange-400/20 via-orange-300/30 to-orange-400/20',
        border: 'border-orange-400/50',
        text: 'text-orange-400'
      },
      green: {
        glow: 'shadow-hunter-green-400/50',
        shine: 'from-hunter-green-400/20 via-green-300/30 to-hunter-green-400/20',
        border: 'border-hunter-green-400/50',
        text: 'text-hunter-green-400'
      }
    };
    return colors[color];
  };

  const getIntensityClasses = () => {
    const intensities = {
      low: {
        glow: 'hover:shadow-lg',
        scale: 'hover:scale-[1.02]',
        brightness: 'hover:brightness-110'
      },
      medium: {
        glow: 'hover:shadow-xl',
        scale: 'hover:scale-105',
        brightness: 'hover:brightness-125'
      },
      high: {
        glow: 'hover:shadow-2xl',
        scale: 'hover:scale-110',
        brightness: 'hover:brightness-150'
      }
    };
    return intensities[intensity];
  };

  const colorClasses = getColorClasses();
  const intensityClasses = getIntensityClasses();

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={elementRef}
      className={`
        relative overflow-hidden
        transition-all duration-300 ease-out
        ${intensityClasses.scale}
        ${intensityClasses.brightness}
        ${isHovered ? `${intensityClasses.glow} ${colorClasses.glow}` : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      
      {/* Glow Effect */}
      {effect === 'glow' && isHovered && (
        <div
          className={`
            absolute inset-0 rounded-lg
            bg-gradient-to-r ${colorClasses.shine}
            opacity-20 animate-pulse
          `}
        />
      )}
      
      {/* Shine Effect */}
      {effect === 'shine' && (
        <div
          className={`
            absolute inset-0 rounded-lg
            bg-gradient-to-r ${colorClasses.shine}
            opacity-0 transition-opacity duration-300
            ${isHovered ? 'opacity-30' : ''}
          `}
          style={{
            background: isHovered ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(183, 148, 92, 0.3) 0%, transparent 50%)` : undefined
          }}
        />
      )}
      
      {/* Pulse Effect */}
      {effect === 'pulse' && isHovered && (
        <div
          className={`
            absolute inset-0 rounded-lg
            border-2 ${colorClasses.border}
            animate-ping
          `}
        />
      )}
      
      {/* Ripple Effect */}
      {effect === 'ripple' && isHovered && (
        <div
          className="absolute rounded-full animate-ripple"
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${colorClasses.shine.split(' ')[0].replace('from-', '')} 0%, transparent 70%)`
          }}
        />
      )}
    </div>
  );
};

// Metallic Navigation Item
interface MetallicNavItemProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MetallicNavItem: React.FC<MetallicNavItemProps> = ({
  children,
  href,
  active = false,
  onClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const Component = href ? 'a' : 'button';
  const props = href ? { href } : { onClick };

  return (
    <MetallicHover
      effect="shine"
      intensity="medium"
      color="gold"
      className={`
        relative px-4 py-2 rounded-lg
        transition-all duration-300 ease-out
        ${active 
          ? 'bg-metallic-gold/20 text-metallic-gold border border-metallic-gold/30' 
          : 'text-white hover:text-metallic-gold'
        }
        ${className}
      `}
    >
      <Component
        {...props}
        className="relative z-10 font-medium"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
        
        {/* Active Indicator */}
        {active && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-metallic-gold rounded-full" />
        )}
        
        {/* Hover Underline */}
        {!active && (
          <div
            className={`
              absolute bottom-0 left-0 h-0.5 bg-metallic-gold rounded-full
              transition-all duration-300 ease-out
              ${isHovered ? 'w-full' : 'w-0'}
            `}
          />
        )}
      </Component>
    </MetallicHover>
  );
};

// Metallic Button
interface MetallicButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const MetallicButton: React.FC<MetallicButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-gradient-to-r from-metallic-gold to-yellow-600
          hover:from-yellow-400 hover:to-metallic-gold
          text-charcoal-900 border-transparent
          shadow-lg hover:shadow-metallic-gold/50
        `;
      case 'secondary':
        return `
          bg-gradient-to-r from-hunter-green-500 to-hunter-green-600
          hover:from-hunter-green-400 hover:to-hunter-green-500
          text-white border-transparent
          shadow-lg hover:shadow-hunter-green-400/50
        `;
      case 'outline':
        return `
          bg-transparent border-2 border-metallic-gold
          hover:bg-metallic-gold hover:text-charcoal-900
          text-metallic-gold
          shadow-lg hover:shadow-metallic-gold/50
        `;
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'md':
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <MetallicHover
      effect="glow"
      intensity="high"
      color="gold"
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-metallic-gold
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Content */}
        <span className={loading ? 'opacity-0' : ''}>
          {children}
        </span>
      </button>
    </MetallicHover>
  );
};

// Metallic Card
interface MetallicCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export const MetallicCard: React.FC<MetallicCardProps> = ({
  children,
  className = '',
  hoverable = true,
  clickable = false,
  onClick
}) => {
  return (
    <MetallicHover
      effect="shine"
      intensity="medium"
      color="gold"
      disabled={!hoverable}
      className={`
        bg-glass-dark backdrop-blur-md
        border border-glass-border rounded-xl
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      <div
        onClick={clickable ? onClick : undefined}
        className="relative p-6 h-full"
      >
        {children}
      </div>
    </MetallicHover>
  );
};

// Metallic Icon
interface MetallicIconProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'silver' | 'copper' | 'green';
  className?: string;
  animated?: boolean;
}

export const MetallicIcon: React.FC<MetallicIconProps> = ({
  children,
  size = 'md',
  color = 'gold',
  className = '',
  animated = true
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      case 'md':
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'silver':
        return 'text-gray-300';
      case 'copper':
        return 'text-orange-400';
      case 'green':
        return 'text-hunter-green-400';
      case 'gold':
      default:
        return 'text-metallic-gold';
    }
  };

  return (
    <MetallicHover
      effect="glow"
      intensity="low"
      color={color}
      disabled={!animated}
      className={`
        inline-flex items-center justify-center
        ${getSizeClasses()}
        ${getColorClasses()}
        ${className}
      `}
    >
      {children}
    </MetallicHover>
  );
};

// Metallic Badge
interface MetallicBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export const MetallicBadge: React.FC<MetallicBadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'default':
      default:
        return 'bg-metallic-gold/20 text-metallic-gold border-metallic-gold/30';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'md':
        return 'px-3 py-1 text-sm';
      case 'sm':
      default:
        return 'px-2 py-0.5 text-xs';
    }
  };

  return (
    <MetallicHover
      effect="pulse"
      intensity="low"
      color="gold"
      className={`
        inline-flex items-center
        font-medium rounded-full
        border backdrop-blur-sm
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {children}
    </MetallicHover>
  );
};

export default {
  MetallicHover,
  MetallicNavItem,
  MetallicButton,
  MetallicCard,
  MetallicIcon,
  MetallicBadge
};