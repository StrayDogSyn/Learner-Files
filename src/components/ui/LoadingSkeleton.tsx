import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'shimmer';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'shimmer'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-wave';
      case 'shimmer':
      default:
        return 'animate-shimmer';
    }
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined)
  };

  return (
    <div
      className={`
        bg-glass-dark backdrop-blur-sm
        border border-glass-border
        ${getVariantClasses()}
        ${getAnimationClasses()}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    />
  );
};

// Project Card Skeleton
export const ProjectCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`
      bg-glass-dark backdrop-blur-md
      border border-glass-border rounded-xl
      p-6 space-y-4
      ${className}
    `}>
      {/* Image Skeleton */}
      <Skeleton 
        variant="rounded" 
        height="200px" 
        className="w-full" 
      />
      
      {/* Title */}
      <Skeleton 
        variant="text" 
        height="24px" 
        width="80%" 
      />
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton variant="text" height="16px" width="100%" />
        <Skeleton variant="text" height="16px" width="90%" />
        <Skeleton variant="text" height="16px" width="70%" />
      </div>
      
      {/* Tech Stack */}
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton 
            key={i}
            variant="rounded" 
            height="24px" 
            width={`${Math.random() * 40 + 60}px`}
          />
        ))}
      </div>
      
      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Skeleton variant="rounded" height="36px" width="100px" />
        <Skeleton variant="rounded" height="36px" width="80px" />
      </div>
    </div>
  );
};

// Timeline Item Skeleton
export const TimelineItemSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Timeline Dot */}
      <div className="flex flex-col items-center">
        <Skeleton variant="circular" width="12px" height="12px" />
        <div className="w-px h-20 bg-glass-border mt-2" />
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-3">
        {/* Date */}
        <Skeleton variant="text" height="14px" width="120px" />
        
        {/* Title */}
        <Skeleton variant="text" height="20px" width="60%" />
        
        {/* Company */}
        <Skeleton variant="text" height="16px" width="40%" />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton variant="text" height="14px" width="100%" />
          <Skeleton variant="text" height="14px" width="85%" />
        </div>
        
        {/* Skills */}
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3].map((i) => (
            <Skeleton 
              key={i}
              variant="rounded" 
              height="20px" 
              width={`${Math.random() * 30 + 50}px`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Tech Skill Skeleton
export const TechSkillSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Skill Name and Percentage */}
      <div className="flex justify-between items-center">
        <Skeleton variant="text" height="16px" width="120px" />
        <Skeleton variant="text" height="14px" width="40px" />
      </div>
      
      {/* Progress Bar */}
      <div className="relative">
        <Skeleton variant="rounded" height="8px" width="100%" />
        <Skeleton 
          variant="rounded" 
          height="8px" 
          width={`${Math.random() * 40 + 40}%`}
          className="absolute top-0 left-0 bg-gradient-to-r from-hunter-green-400 to-hunter-green-500"
        />
      </div>
    </div>
  );
};

// Service Card Skeleton
export const ServiceCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`
      bg-glass-dark backdrop-blur-md
      border border-glass-border rounded-xl
      p-6 space-y-4 text-center
      ${className}
    `}>
      {/* Icon */}
      <div className="flex justify-center">
        <Skeleton variant="circular" width="48px" height="48px" />
      </div>
      
      {/* Title */}
      <Skeleton variant="text" height="24px" width="70%" className="mx-auto" />
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton variant="text" height="16px" width="100%" />
        <Skeleton variant="text" height="16px" width="90%" className="mx-auto" />
        <Skeleton variant="text" height="16px" width="80%" className="mx-auto" />
      </div>
      
      {/* Features */}
      <div className="space-y-2 pt-2">
        {[1, 2, 3].map((i) => (
          <Skeleton 
            key={i}
            variant="text" 
            height="14px" 
            width={`${Math.random() * 30 + 60}%`}
            className="mx-auto"
          />
        ))}
      </div>
      
      {/* CTA Button */}
      <div className="pt-4">
        <Skeleton variant="rounded" height="40px" width="120px" className="mx-auto" />
      </div>
    </div>
  );
};

// Blog Post Skeleton
export const BlogPostSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`
      bg-glass-dark backdrop-blur-md
      border border-glass-border rounded-xl
      overflow-hidden
      ${className}
    `}>
      {/* Featured Image */}
      <Skeleton variant="rectangular" height="200px" width="100%" />
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category and Date */}
        <div className="flex justify-between items-center">
          <Skeleton variant="rounded" height="20px" width="80px" />
          <Skeleton variant="text" height="14px" width="100px" />
        </div>
        
        {/* Title */}
        <Skeleton variant="text" height="24px" width="90%" />
        
        {/* Excerpt */}
        <div className="space-y-2">
          <Skeleton variant="text" height="16px" width="100%" />
          <Skeleton variant="text" height="16px" width="95%" />
          <Skeleton variant="text" height="16px" width="75%" />
        </div>
        
        {/* Read More */}
        <div className="pt-2">
          <Skeleton variant="text" height="16px" width="100px" />
        </div>
      </div>
    </div>
  );
};

// Generic Content Skeleton
export const ContentSkeleton: React.FC<{ 
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i}
          variant="text" 
          height="16px" 
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
};

export default Skeleton;