import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  pulse?: boolean;
  outline?: boolean;
}

const variants = {
  default: {
    bg: 'bg-white/20 border-white/30',
    text: 'text-white',
    dot: 'bg-white'
  },
  success: {
    bg: 'bg-emerald-500/20 border-emerald-400/40',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400'
  },
  warning: {
    bg: 'bg-yellow-500/20 border-yellow-400/40',
    text: 'text-yellow-300',
    dot: 'bg-yellow-400'
  },
  error: {
    bg: 'bg-red-500/20 border-red-400/40',
    text: 'text-red-300',
    dot: 'bg-red-400'
  },
  info: {
    bg: 'bg-blue-500/20 border-blue-400/40',
    text: 'text-blue-300',
    dot: 'bg-blue-400'
  },
  purple: {
    bg: 'bg-purple-500/20 border-purple-400/40',
    text: 'text-purple-300',
    dot: 'bg-purple-400'
  },
  orange: {
    bg: 'bg-orange-500/20 border-orange-400/40',
    text: 'text-orange-300',
    dot: 'bg-orange-400'
  }
};

const sizes = {
  sm: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    icon: 'w-3 h-3',
    dot: 'w-1.5 h-1.5'
  },
  md: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'w-4 h-4',
    dot: 'w-2 h-2'
  },
  lg: {
    padding: 'px-4 py-2',
    text: 'text-base',
    icon: 'w-5 h-5',
    dot: 'w-2.5 h-2.5'
  }
};

const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  removable = false,
  onRemove,
  icon,
  pulse = false,
  outline = false
}) => {
  const variantConfig = variants[variant];
  const sizeConfig = sizes[size];
  const Icon = icon;

  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        'backdrop-blur-md border transition-all duration-200',
        outline ? 'bg-transparent' : variantConfig.bg,
        variantConfig.text,
        outline ? `border-current` : variantConfig.bg.replace('bg-', 'border-'),
        sizeConfig.padding,
        sizeConfig.text,
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Status dot with pulse animation */}
      {pulse && (
        <span className="relative flex">
          <span className={cn(
            'absolute inline-flex rounded-full opacity-75 animate-ping',
            variantConfig.dot,
            sizeConfig.dot
          )} />
          <span className={cn(
            'relative inline-flex rounded-full',
            variantConfig.dot,
            sizeConfig.dot
          )} />
        </span>
      )}
      
      {/* Icon */}
      {Icon && (
        <Icon className={cn(sizeConfig.icon)} />
      )}
      
      {/* Content */}
      <span className="truncate">{children}</span>
      
      {/* Remove button */}
      {removable && onRemove && (
        <motion.button
          type="button"
          className={cn(
            'inline-flex items-center justify-center rounded-full',
            'hover:bg-white/20 transition-colors duration-200',
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
          )}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className={cn(
            size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-3.5 h-3.5'
          )} />
        </motion.button>
      )}
    </motion.span>
  );
};

// Badge Group Component for multiple badges
interface GlassBadgeGroupProps {
  badges: Array<{
    id: string;
    content: React.ReactNode;
    variant?: GlassBadgeProps['variant'];
    removable?: boolean;
  }>;
  onRemove?: (id: string) => void;
  className?: string;
  size?: GlassBadgeProps['size'];
}

export const GlassBadgeGroup: React.FC<GlassBadgeGroupProps> = ({
  badges,
  onRemove,
  className,
  size = 'md'
}) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 10 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <GlassBadge
            variant={badge.variant}
            size={size}
            removable={badge.removable}
            onRemove={badge.removable ? () => onRemove?.(badge.id) : undefined}
          >
            {badge.content}
          </GlassBadge>
        </motion.div>
      ))}
    </div>
  );
};

export default GlassBadge;