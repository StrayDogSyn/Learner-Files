'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const typographyVariants = cva(
  'transition-all duration-300',
  {
    variants: {
      variant: {
        h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
        h2: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
        h3: 'text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight',
        h4: 'text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight',
        h5: 'text-lg md:text-xl lg:text-2xl font-semibold tracking-tight',
        h6: 'text-base md:text-lg lg:text-xl font-semibold tracking-tight',
        body: 'text-base leading-relaxed',
        bodyLarge: 'text-lg leading-relaxed',
        bodySmall: 'text-sm leading-relaxed',
        caption: 'text-xs leading-normal',
        code: 'font-mono text-sm bg-white/10 px-2 py-1 rounded border border-white/20',
        lead: 'text-xl md:text-2xl leading-relaxed font-light',
        muted: 'text-sm text-white/60',
        quote: 'text-lg italic border-l-4 border-amber-500/50 pl-4 text-white/90'
      },
      color: {
        primary: 'text-white',
        secondary: 'text-white/80',
        accent: 'text-amber-400',
        muted: 'text-white/60',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400',
        gradient: 'bg-gradient-to-r from-blue-400 via-amber-400 to-blue-400 bg-clip-text text-transparent'
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold'
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify'
      },
      transform: {
        none: 'normal-case',
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize'
      }
    },
    defaultVariants: {
      variant: 'body',
      color: 'primary',
      weight: 'normal',
      align: 'left',
      transform: 'none'
    }
  }
);

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'code' | 'blockquote';

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: TypographyElement;
  gradient?: boolean;
  glow?: boolean;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ 
    className, 
    variant, 
    color, 
    weight, 
    align, 
    transform,
    as,
    gradient = false,
    glow = false,
    children,
    ...props 
  }, ref) => {
    // Auto-determine element based on variant if not specified
    const getElement = (): TypographyElement => {
      if (as) return as;
      
      switch (variant) {
        case 'h1': return 'h1';
        case 'h2': return 'h2';
        case 'h3': return 'h3';
        case 'h4': return 'h4';
        case 'h5': return 'h5';
        case 'h6': return 'h6';
        case 'code': return 'code';
        case 'quote': return 'blockquote';
        default: return 'p';
      }
    };

    const Element = getElement();
    const finalColor = gradient ? 'gradient' : color;

    return React.createElement(
      Element,
      {
        className: cn(
          typographyVariants({ 
            variant, 
            color: finalColor, 
            weight, 
            align, 
            transform 
          }),
          glow && 'drop-shadow-glow',
          className
        ),
        ref,
        ...props
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

export { Typography, typographyVariants };
export default Typography;