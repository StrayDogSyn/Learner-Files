import React, { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'subtle' | 'medium' | 'strong' | 'ultra';
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  opacity?: number;
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  animated?: boolean;
}

export const GlassContainer: React.FC<GlassProps> = ({
  children,
  variant = 'medium',
  blur = 'md',
  opacity = 0.1,
  border = true,
  shadow = 'lg',
  glow = false,
  animated = false,
  className,
  ...props
}) => {
  const variants = {
    subtle: 'bg-white/5 backdrop-blur-sm',
    medium: 'bg-white/10 backdrop-blur-md',
    strong: 'bg-white/15 backdrop-blur-lg',
    ultra: 'bg-white/20 backdrop-blur-xl'
  };

  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg shadow-black/20',
    xl: 'shadow-xl shadow-black/25'
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        variants[variant],
        blurClasses[blur],
        border && 'border border-white/20',
        shadowClasses[shadow],
        glow && 'ring-1 ring-white/30 ring-opacity-50',
        animated && 'transition-all duration-300 hover:bg-white/20 hover:shadow-xl hover:shadow-black/30',
        className
      )}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`
      }}
      {...props}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface GlassCardProps extends GlassProps {
  hover3d?: boolean;
  tilt?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hover3d = false,
  tilt = false,
  className,
  ...props
}) => {
  return (
    <GlassContainer
      className={cn(
        'rounded-xl p-6',
        hover3d && 'transform-gpu transition-transform duration-300 hover:scale-105 hover:rotate-1',
        tilt && 'hover:rotate-2 hover:scale-105',
        'group cursor-pointer',
        className
      )}
      animated
      {...props}
    >
      {children}
    </GlassContainer>
  );
};

interface GlassButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30',
    secondary: 'bg-white/10 hover:bg-white/20',
    accent: 'bg-gradient-to-r from-pink-500/20 to-orange-500/20 hover:from-pink-500/30 hover:to-orange-500/30'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-lg backdrop-blur-md border border-white/20',
        'transition-all duration-300 transform-gpu',
        'hover:scale-105 hover:shadow-lg hover:shadow-black/25',
        'active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </span>
    </button>
  );
};

interface GlassNavProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  floating?: boolean;
}

export const GlassNav: React.FC<GlassNavProps> = ({
  children,
  position = 'top',
  floating = false,
  className,
  ...props
}) => {
  const positions = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    left: 'top-0 bottom-0 left-0',
    right: 'top-0 bottom-0 right-0'
  };

  return (
    <nav
      className={cn(
        'backdrop-blur-xl bg-white/10 border-white/20',
        floating ? 'fixed z-50 m-4 rounded-2xl border shadow-2xl shadow-black/20' : 'sticky border-b',
        positions[position],
        className
      )}
      {...props}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative z-10 p-4">
          {children}
        </div>
      </div>
    </nav>
  );
};

interface GlassModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassModal: React.FC<GlassModalProps> = ({
  children,
  isOpen,
  onClose,
  size = 'md',
  className,
  ...props
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full backdrop-blur-xl bg-white/10 border border-white/20',
          'rounded-2xl shadow-2xl shadow-black/25 p-6',
          'transform transition-all duration-300',
          sizes[size],
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 rounded-2xl" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

interface GlassInputProps extends HTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full backdrop-blur-md bg-white/10 border border-white/20',
            'rounded-lg px-4 py-3 text-white placeholder-white/50',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
            'transition-all duration-300',
            icon && 'pl-10',
            error && 'border-red-500/50 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export const GlassTooltip: React.FC<{
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ children, content, position = 'top' }) => {
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative group">
      {children}
      <div className={cn(
        'absolute z-50 px-3 py-2 text-sm text-white',
        'backdrop-blur-md bg-black/80 border border-white/20 rounded-lg',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'pointer-events-none whitespace-nowrap',
        positions[position]
      )}>
        {content}
      </div>
    </div>
  );
};

export const GlassBadge: React.FC<{
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, variant = 'default', size = 'md', className }) => {
  const variants = {
    default: 'bg-white/20 text-white',
    success: 'bg-green-500/20 text-green-300 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-300 border-red-500/30'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={cn(
      'inline-flex items-center backdrop-blur-md border border-white/20 rounded-full',
      'font-medium transition-all duration-300',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};

export default {
  GlassContainer,
  GlassCard,
  GlassButton,
  GlassNav,
  GlassModal,
  GlassInput,
  GlassTooltip,
  GlassBadge
};