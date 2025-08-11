import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle' | 'accent';
  hover?: boolean;
  onClick?: () => void;
  gradient?: boolean;
}

const variants = {
  default: 'bg-white/10 border-white/20',
  elevated: 'bg-white/15 border-white/30 shadow-2xl',
  subtle: 'bg-white/5 border-white/10',
  accent: 'bg-emerald-500/10 border-emerald-400/30'
};

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  onClick,
  gradient = false
}) => {
  return (
    <motion.div
      className={cn(
        'backdrop-blur-md border rounded-xl p-6 transition-all duration-300',
        variants[variant],
        gradient && 'bg-gradient-to-br from-white/10 to-white/5',
        hover && 'hover:bg-white/20 hover:border-white/40 hover:shadow-xl',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;