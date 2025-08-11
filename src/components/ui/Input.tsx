import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass';
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', variant = 'default', error, ...props }, ref) => {
    const baseClasses = [
      'flex h-10 w-full rounded-md px-3 py-2 text-sm',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-200'
    ];

    const variantClasses = {
      default: [
        'border border-input bg-background',
        'focus-visible:ring-ring',
        'dark:bg-gray-800 dark:border-gray-600 dark:text-white'
      ],
      glass: [
        'bg-white/10 backdrop-blur-md border border-white/20',
        'dark:bg-gray-900/10 dark:border-gray-700/20',
        'focus-visible:ring-blue-500/50 focus-visible:border-blue-400/50',
        'text-gray-900 dark:text-white',
        'placeholder:text-gray-500 dark:placeholder:text-gray-400'
      ]
    };

    const errorClasses = error ? [
      'border-red-500 focus-visible:ring-red-500'
    ] : [];

    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            ...baseClasses,
            ...variantClasses[variant],
            ...errorClasses,
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
ex