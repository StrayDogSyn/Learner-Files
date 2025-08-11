import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  className?: string;
  text?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const SpinnerLoader: React.FC<{ size: string; className?: string }> = ({ size, className }) => (
  <motion.div
    className={cn(
      'border-2 border-white/20 border-t-emerald-400 rounded-full',
      size,
      className
    )}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  />
);

const DotsLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-emerald-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2
        }}
      />
    ))}
  </div>
);

const PulseLoader: React.FC<{ size: string; className?: string }> = ({ size, className }) => (
  <motion.div
    className={cn(
      'bg-emerald-400/30 rounded-full',
      size,
      className
    )}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.8, 0.3]
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
  />
);

const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-3', className)}>
    {[1, 0.8, 0.6].map((width, i) => (
      <motion.div
        key={i}
        className="h-4 bg-white/10 rounded"
        style={{ width: `${width * 100}%` }}
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2
        }}
      />
    ))}
  </div>
);

const GlassLoader: React.FC<GlassLoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  className,
  text
}) => {
  const sizeClass = sizes[size];

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <SpinnerLoader size={sizeClass} className={className} />;
      case 'dots':
        return <DotsLoader className={className} />;
      case 'pulse':
        return <PulseLoader size={sizeClass} className={className} />;
      case 'skeleton':
        return <SkeletonLoader className={className} />;
      default:
        return <SpinnerLoader size={sizeClass} className={className} />;
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderLoader()}
      {text && (
        <motion.p
          className="text-white/70 text-sm font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export default GlassLoader;