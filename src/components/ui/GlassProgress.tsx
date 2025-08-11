import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'linear' | 'circular';
  showValue?: boolean;
  label?: string;
  className?: string;
  color?: 'emerald' | 'blue' | 'purple' | 'orange';
}

const sizes = {
  sm: { height: 'h-2', text: 'text-xs' },
  md: { height: 'h-3', text: 'text-sm' },
  lg: { height: 'h-4', text: 'text-base' }
};

const colors = {
  emerald: 'from-emerald-400 to-emerald-600',
  blue: 'from-blue-400 to-blue-600',
  purple: 'from-purple-400 to-purple-600',
  orange: 'from-orange-400 to-orange-600'
};

const LinearProgress: React.FC<GlassProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  showValue = false,
  label,
  className,
  color = 'emerald'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const sizeConfig = sizes[size];

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className={cn('font-medium text-white/80', sizeConfig.text)}>
              {label}
            </span>
          )}
          {showValue && (
            <span className={cn('font-medium text-white/60', sizeConfig.text)}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        'w-full bg-white/10 backdrop-blur-sm rounded-full overflow-hidden',
        sizeConfig.height
      )}>
        <motion.div
          className={cn(
            'h-full bg-gradient-to-r rounded-full',
            colors[color]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

const CircularProgress: React.FC<GlassProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  showValue = true,
  className,
  color = 'emerald'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 40;
  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const svgSize = radius * 2;
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        height={svgSize}
        width={svgSize}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        
        {/* Progress circle */}
        <motion.circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color === 'emerald' ? '#10b981' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#8b5cf6' : '#f97316'} />
            <stop offset="100%" stopColor={color === 'emerald' ? '#059669' : color === 'blue' ? '#2563eb' : color === 'purple' ? '#7c3aed' : '#ea580c'} />
          </linearGradient>
        </defs>
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-semibold text-white', textSize)}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

const GlassProgress: React.FC<GlassProgressProps> = (props) => {
  const { variant = 'linear' } = props;
  
  return variant === 'circular' ? (
    <CircularProgress {...props} />
  ) : (
    <LinearProgress {...props} />
  );
};

export default GlassProgress;