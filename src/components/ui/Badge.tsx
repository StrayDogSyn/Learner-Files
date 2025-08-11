import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = [
      'inline-flex items-center rounded-full font-semibold transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
    ];

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base'
    };

    const variantClasses = {
      default: [
        'bg-blue-500/20 text-blue-700 border border-blue-500/30',
        'dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
        'backdrop-blur-sm'
      ],
      secondary: [
        'bg-gray-500/20 text-gray-700 border border-gray-500/30',
        'dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',
        'backdrop-blur-sm'
      ],
      destructive: [
        'bg-red-500/20 text-red-700 border border-red-500/30',
        'dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
        'backdrop-blur-sm'
      ],
      outline: [
        'text-foreground border border-input bg-white/10',
        'dark:bg-gray-900/10 dark:border-gray-700/20',
        'backdrop-blur-sm'
      ],
      success: [
        'bg-green-500/20 text-green-700 border border-green-500/30',
        'dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
        'backdrop-blur-sm'
      ],
      warning: [
        'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30',
        'dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
        'backdrop-blur-sm'
      ]
    };

    return (
      <div
        ref={ref}
        className={cn(
          ...baseClasses,
          sizeClasses[size],
          ...variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };