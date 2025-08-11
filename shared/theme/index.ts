// Shared Theme System
// Provides consistent design tokens across all platforms

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ThemeColors {
  primary: ColorPalette;
  secondary: ColorPalette;
  success: ColorPalette;
  warning: ColorPalette;
  error: ColorPalette;
  info: ColorPalette;
  gray: ColorPalette;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    glass: string;
    overlay: string;
  };
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    glass: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    disabled: string;
    link: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  border: {
    primary: string;
    secondary: string;
    tertiary: string;
    focus: string;
    error: string;
    success: string;
    glass: string;
  };
  shadow: {
    primary: string;
    secondary: string;
    tertiary: string;
    colored: string;
    glass: string;
  };
}

export interface ThemeSpacing {
  0: string;
  px: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
    display: string[];
  };
  fontSize: {
    xs: [string, { lineHeight: string; letterSpacing?: string }];
    sm: [string, { lineHeight: string; letterSpacing?: string }];
    base: [string, { lineHeight: string; letterSpacing?: string }];
    lg: [string, { lineHeight: string; letterSpacing?: string }];
    xl: [string, { lineHeight: string; letterSpacing?: string }];
    '2xl': [string, { lineHeight: string; letterSpacing?: string }];
    '3xl': [string, { lineHeight: string; letterSpacing?: string }];
    '4xl': [string, { lineHeight: string; letterSpacing?: string }];
    '5xl': [string, { lineHeight: string; letterSpacing?: string }];
    '6xl': [string, { lineHeight: string; letterSpacing?: string }];
    '7xl': [string, { lineHeight: string; letterSpacing?: string }];
    '8xl': [string, { lineHeight: string; letterSpacing?: string }];
    '9xl': [string, { lineHeight: string; letterSpacing?: string }];
  };
  fontWeight: {
    thin: number;
    extralight: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  lineHeight: {
    none: string;
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

export interface ThemeBreakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ThemeShadows {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  glass: string;
  glow: string;
}

export interface ThemeTransitions {
  duration: {
    75: string;
    100: string;
    150: string;
    200: string;
    300: string;
    500: string;
    700: string;
    1000: string;
  };
  timing: {
    linear: string;
    in: string;
    out: string;
    'in-out': string;
  };
  property: {
    none: string;
    all: string;
    default: string;
    colors: string;
    opacity: string;
    shadow: string;
    transform: string;
  };
}

export interface ThemeZIndex {
  auto: string;
  0: number;
  10: number;
  20: number;
  30: number;
  40: number;
  50: number;
  dropdown: number;
  sticky: number;
  fixed: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
  overlay: number;
}

export interface ThemeGlassmorphism {
  blur: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  opacity: {
    5: string;
    10: string;
    15: string;
    20: string;
    25: string;
    30: string;
  };
  border: {
    light: string;
    medium: string;
    strong: string;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  breakpoints: ThemeBreakpoints;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  transitions: ThemeTransitions;
  zIndex: ThemeZIndex;
  glassmorphism: ThemeGlassmorphism;
}

// Color Palettes
const primaryPalette: ColorPalette = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554'
};

const secondaryPalette: ColorPalette = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617'
};

const successPalette: ColorPalette = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16'
};

const warningPalette: ColorPalette = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
  950: '#451a03'
};

const errorPalette: ColorPalette = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
  950: '#450a0a'
};

const infoPalette: ColorPalette = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49'
};

const grayPalette: ColorPalette = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#030712'
};

// Light Theme
export const lightTheme: Theme = {
  colors: {
    primary: primaryPalette,
    secondary: secondaryPalette,
    success: successPalette,
    warning: warningPalette,
    error: errorPalette,
    info: infoPalette,
    gray: grayPalette,
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      inverse: '#111827',
      glass: 'rgba(255, 255, 255, 0.1)',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    surface: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      elevated: '#ffffff',
      glass: 'rgba(255, 255, 255, 0.15)'
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      tertiary: '#9ca3af',
      inverse: '#ffffff',
      disabled: '#d1d5db',
      link: '#2563eb',
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0284c7'
    },
    border: {
      primary: '#e5e7eb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af',
      focus: '#2563eb',
      error: '#dc2626',
      success: '#16a34a',
      glass: 'rgba(255, 255, 255, 0.2)'
    },
    shadow: {
      primary: 'rgba(0, 0, 0, 0.1)',
      secondary: 'rgba(0, 0, 0, 0.05)',
      tertiary: 'rgba(0, 0, 0, 0.02)',
      colored: 'rgba(59, 130, 246, 0.15)',
      glass: 'rgba(0, 0, 0, 0.1)'
    }
  },
  spacing: {
    0: '0px',
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem'
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      display: ['Cal Sans', 'Inter', 'ui-sans-serif', 'system-ui']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }]
    },
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)'
  },
  transitions: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms'
    },
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    property: {
      none: 'none',
      all: 'all',
      default: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
      colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
      opacity: 'opacity',
      shadow: 'box-shadow',
      transform: 'transform'
    }
  },
  zIndex: {
    auto: 'auto',
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
    overlay: 1080
  },
  glassmorphism: {
    blur: {
      none: 'blur(0)',
      sm: 'blur(4px)',
      base: 'blur(8px)',
      md: 'blur(12px)',
      lg: 'blur(16px)',
      xl: 'blur(24px)',
      '2xl': 'blur(40px)',
      '3xl': 'blur(64px)'
    },
    opacity: {
      5: '0.05',
      10: '0.1',
      15: '0.15',
      20: '0.2',
      25: '0.25',
      30: '0.3'
    },
    border: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      strong: 'rgba(255, 255, 255, 0.3)'
    }
  }
};

// Dark Theme
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: {
      primary: '#111827',
      secondary: '#1f2937',
      tertiary: '#374151',
      inverse: '#ffffff',
      glass: 'rgba(0, 0, 0, 0.2)',
      overlay: 'rgba(0, 0, 0, 0.7)'
    },
    surface: {
      primary: '#1f2937',
      secondary: '#374151',
      tertiary: '#4b5563',
      elevated: '#374151',
      glass: 'rgba(0, 0, 0, 0.25)'
    },
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af',
      inverse: '#111827',
      disabled: '#6b7280',
      link: '#60a5fa',
      success: '#4ade80',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#38bdf8'
    },
    border: {
      primary: '#374151',
      secondary: '#4b5563',
      tertiary: '#6b7280',
      focus: '#60a5fa',
      error: '#f87171',
      success: '#4ade80',
      glass: 'rgba(255, 255, 255, 0.1)'
    },
    shadow: {
      primary: 'rgba(0, 0, 0, 0.3)',
      secondary: 'rgba(0, 0, 0, 0.2)',
      tertiary: 'rgba(0, 0, 0, 0.1)',
      colored: 'rgba(96, 165, 250, 0.2)',
      glass: 'rgba(0, 0, 0, 0.3)'
    }
  },
  glassmorphism: {
    ...lightTheme.glassmorphism,
    border: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.15)'
    }
  }
};

// Theme utilities
export const getTheme = (mode: 'light' | 'dark' = 'light'): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

export const createCustomTheme = (overrides: Partial<Theme>, baseTheme: Theme = lightTheme): Theme => {
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...overrides.colors
    },
    typography: {
      ...baseTheme.typography,
      ...overrides.typography
    },
    glassmorphism: {
      ...baseTheme.glassmorphism,
      ...overrides.glassmorphism
    }
  };
};

// CSS Custom Properties Generator
export const generateCSSVariables = (theme: Theme): Record<string, string> => {
  const variables: Record<string, string> = {};
  
  // Colors
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    variables[`--color-primary-${key}`] = value;
  });
  
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    variables[`--color-secondary-${key}`] = value;
  });
  
  Object.entries(theme.colors.background).forEach(([key, value]) => {
    variables[`--color-background-${key}`] = value;
  });
  
  Object.entries(theme.colors.text).forEach(([key, value]) => {
    variables[`--color-text-${key}`] = value;
  });
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value;
  });
  
  // Typography
  Object.entries(theme.typography.fontSize).forEach(([key, [size, { lineHeight }]]) => {
    variables[`--font-size-${key}`] = size;
    variables[`--line-height-${key}`] = lineHeight;
  });
  
  // Border Radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables[`--border-radius-${key}`] = value;
  });
  
  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    variables[`--shadow-${key}`] = value;
  });
  
  return variables;
};

// Platform-specific theme adaptations
export const adaptThemeForPlatform = (theme: Theme, platform: 'web' | 'mobile' | 'desktop' | 'cli'): Theme => {
  switch (platform) {
    case 'mobile':
      return {
        ...theme,
        spacing: {
          ...theme.spacing,
          // Increase touch targets for mobile
          4: '1.25rem',
          6: '1.75rem',
          8: '2.25rem'
        },
        typography: {
          ...theme.typography,
          fontSize: {
            ...theme.typography.fontSize,
            // Slightly larger text for mobile readability
            sm: ['1rem', { lineHeight: '1.5rem' }],
            base: ['1.125rem', { lineHeight: '1.75rem' }],
            lg: ['1.25rem', { lineHeight: '1.875rem' }]
          }
        }
      };
    
    case 'desktop':
      return {
        ...theme,
        shadows: {
          ...theme.shadows,
          // More pronounced shadows for desktop
          md: '0 6px 12px -2px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.1)',
          lg: '0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.1)'
        }
      };
    
    case 'cli':
      return {
        ...theme,
        colors: {
          ...theme.colors,
          // Terminal-friendly colors
          text: {
            ...theme.colors.text,
            primary: '#ffffff',
            secondary: '#d1d5db',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
          }
        }
      };
    
    default:
      return theme;
  }
};

// Export default theme
export default lightTheme;

/**
 * Shared Theme System
 * 
 * Provides a comprehensive design system with consistent tokens
 * across all platforms in the portfolio ecosystem.
 * 
 * Features:
 * - Light and dark theme variants
 * - Comprehensive color palettes
 * - Typography scale
 * - Spacing system
 * - Border radius tokens
 * - Shadow definitions
 * - Transition configurations
 * - Z-index management
 * - Glassmorphism effects
 * - Platform-specific adaptations
 * - CSS custom properties generation
 * 
 * Usage:
 * ```typescript
 * import { lightTheme, darkTheme, getTheme, adaptThemeForPlatform } from '@shared/theme';
 * 
 * // Get theme based on user preference
 * const theme = getTheme('dark');
 * 
 * // Adapt theme for specific platform
 * const mobileTheme = adaptThemeForPlatform(theme, 'mobile');
 * 
 * // Generate CSS variables
 * const cssVars = generateCSSVariables(theme);
 * ```
 */