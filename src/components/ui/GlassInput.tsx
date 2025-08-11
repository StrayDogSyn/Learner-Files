import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'minimal';
}

const variants = {
  default: 'bg-white/10 border-white/20 focus:bg-white/15 focus:border-white/40',
  filled: 'bg-white/15 border-white/30 focus:bg-white/20 focus:border-white/50',
  minimal: 'bg-transparent border-b border-white/20 rounded-none focus:border-emerald-400/60'
};

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>((
  {
    className,
    label,
    error,
    icon: Icon,
    iconPosition = 'left',
    variant = 'default',
    ...props
  },
  ref
) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
        )}
        <input
          ref={ref}
          className={cn(
            'w-full backdrop-blur-md border rounded-lg px-4 py-3',
            'text-white placeholder-white/50',
            'transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-emerald-400/50',
            variants[variant],
            Icon && iconPosition === 'left' && 'pl-10',
            Icon && iconPosition === 'right' && 'pr-10',
            error && 'border-red-400/60 focus:border-red-400/80',
            className
          )}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
        )}
      </div>
      {error && (
        <motion.p
          className="mt-1 text-sm text-red-400"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

GlassInput.displayName = 'GlassInput';

export default GlassInput;