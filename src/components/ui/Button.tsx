import React from 'react'
import { clsx } from 'clsx'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'relative overflow-hidden',
    ]

    const variants = {
      primary: [
        'bg-navy-950 text-white',
        'hover:bg-navy-800 hover:shadow-lg hover:-translate-y-0.5',
        'focus:ring-navy-500',
        'active:bg-navy-900 active:translate-y-0',
      ],
      secondary: [
        'bg-amber-500 text-navy-950',
        'hover:bg-amber-400 hover:shadow-lg hover:-translate-y-0.5',
        'focus:ring-amber-500',
        'active:bg-amber-600 active:translate-y-0',
      ],
      outline: [
        'border-2 border-navy-950 text-navy-950 bg-transparent',
        'hover:bg-navy-950 hover:text-white hover:shadow-lg',
        'focus:ring-navy-500',
      ],
      ghost: [
        'text-navy-700 bg-transparent',
        'hover:bg-navy-50 hover:text-navy-900',
        'focus:ring-navy-500',
      ],
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-xl',
    }

    const buttonClasses = clsx(
      baseClasses,
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      className
    )

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        {Icon && iconPosition === 'left' && !loading && <Icon className="w-4 h-4" />}
        {children}
        {Icon && iconPosition === 'right' && !loading && <Icon className="w-4 h-4" />}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button