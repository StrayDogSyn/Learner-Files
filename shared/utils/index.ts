// Shared Utilities Library
// Common functions and helpers for all platforms

// Platform Detection
export interface PlatformInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  platform: 'web' | 'mobile' | 'desktop' | 'cli';
  os: 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'unknown';
  browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';
  userAgent: string;
  screenSize: {
    width: number;
    height: number;
  };
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  colorScheme: 'light' | 'dark' | 'no-preference';
  reducedMotion: boolean;
  highContrast: boolean;
}

export const detectPlatform = (): PlatformInfo => {
  // Default values for non-browser environments
  const defaults: PlatformInfo = {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    platform: 'cli',
    os: 'unknown',
    browser: 'unknown',
    userAgent: '',
    screenSize: { width: 1920, height: 1080 },
    orientation: 'landscape',
    pixelRatio: 1,
    colorScheme: 'light',
    reducedMotion: false,
    highContrast: false
  };

  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return defaults;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || '';
  
  // Detect OS
  let os: PlatformInfo['os'] = 'unknown';
  if (/iphone|ipad|ipod/.test(userAgent)) {
    os = 'ios';
  } else if (/android/.test(userAgent)) {
    os = 'android';
  } else if (/mac/.test(platform)) {
    os = 'macos';
  } else if (/win/.test(platform)) {
    os = 'windows';
  } else if (/linux/.test(platform)) {
    os = 'linux';
  }

  // Detect browser
  let browser: PlatformInfo['browser'] = 'unknown';
  if (/chrome/.test(userAgent) && !/edge/.test(userAgent)) {
    browser = 'chrome';
  } else if (/firefox/.test(userAgent)) {
    browser = 'firefox';
  } else if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) {
    browser = 'safari';
  } else if (/edge/.test(userAgent)) {
    browser = 'edge';
  } else if (/opera/.test(userAgent)) {
    browser = 'opera';
  }

  // Detect device type
  const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent);
  const isTablet = /tablet|ipad|playbook|silk/.test(userAgent);
  const isDesktop = !isMobile && !isTablet;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Determine platform
  let platformType: PlatformInfo['platform'] = 'web';
  if (typeof window !== 'undefined' && (window as any).electronAPI) {
    platformType = 'desktop';
  } else if (isMobile || isTablet) {
    platformType = 'mobile';
  }

  // Screen information
  const screenSize = {
    width: window.screen?.width || window.innerWidth || 1920,
    height: window.screen?.height || window.innerHeight || 1080
  };

  const orientation = screenSize.width > screenSize.height ? 'landscape' : 'portrait';
  const pixelRatio = window.devicePixelRatio || 1;

  // Accessibility preferences
  const colorScheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  const highContrast = window.matchMedia?.('(prefers-contrast: high)').matches || false;

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    platform: platformType,
    os,
    browser,
    userAgent,
    screenSize,
    orientation,
    pixelRatio,
    colorScheme,
    reducedMotion,
    highContrast
  };
};

// String Utilities
export const stringUtils = {
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  camelCase: (str: string): string => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  },

  kebabCase: (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  snakeCase: (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },

  truncate: (str: string, length: number, suffix = '...'): string => {
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
  },

  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  stripHtml: (str: string): string => {
    return str.replace(/<[^>]*>/g, '');
  },

  escapeHtml: (str: string): string => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  unescapeHtml: (str: string): string => {
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || '';
  }
};

// Number Utilities
export const numberUtils = {
  formatNumber: (num: number, locale = 'en-US'): string => {
    return new Intl.NumberFormat(locale).format(num);
  },

  formatCurrency: (amount: number, currency = 'USD', locale = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount);
  },

  formatPercentage: (value: number, decimals = 2): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  formatBytes: (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  },

  lerp: (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  },

  roundTo: (value: number, decimals: number): number => {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  },

  randomBetween: (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  },

  randomInt: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

// Date Utilities
export const dateUtils = {
  formatDate: (date: Date | string | number, locale = 'en-US', options?: Intl.DateTimeFormatOptions): string => {
    const d = new Date(date);
    return new Intl.DateTimeFormat(locale, options).format(d);
  },

  formatRelativeTime: (date: Date | string | number, locale = 'en-US'): string => {
    const d = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
  },

  isToday: (date: Date | string | number): boolean => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  isYesterday: (date: Date | string | number): boolean => {
    const d = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.toDateString() === yesterday.toDateString();
  },

  isTomorrow: (date: Date | string | number): boolean => {
    const d = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.toDateString() === tomorrow.toDateString();
  },

  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addMonths: (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },

  addYears: (date: Date, years: number): Date => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  },

  startOfDay: (date: Date): Date => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  },

  endOfDay: (date: Date): Date => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }
};

// Array Utilities
export const arrayUtils = {
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  shuffle: <T>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  uniqueBy: <T, K>(array: T[], keyFn: (item: T) => K): T[] => {
    const seen = new Set<K>();
    return array.filter(item => {
      const key = keyFn(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },

  groupBy: <T, K extends string | number | symbol>(array: T[], keyFn: (item: T) => K): Record<K, T[]> => {
    return array.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  },

  sortBy: <T>(array: T[], keyFn: (item: T) => any, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = keyFn(a);
      const bVal = keyFn(b);
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  findLast: <T>(array: T[], predicate: (item: T) => boolean): T | undefined => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) {
        return array[i];
      }
    }
    return undefined;
  },

  sample: <T>(array: T[]): T | undefined => {
    if (array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
  },

  sampleSize: <T>(array: T[], size: number): T[] => {
    const shuffled = arrayUtils.shuffle(array);
    return shuffled.slice(0, Math.min(size, array.length));
  }
};

// Object Utilities
export const objectUtils = {
  pick: <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array) return obj.map(item => objectUtils.deepClone(item)) as any;
    if (typeof obj === 'object') {
      const cloned = {} as any;
      Object.keys(obj).forEach(key => {
        cloned[key] = objectUtils.deepClone((obj as any)[key]);
      });
      return cloned;
    }
    return obj;
  },

  deepMerge: <T>(target: T, ...sources: Partial<T>[]): T => {
    if (!sources.length) return target;
    const source = sources.shift();
    
    if (objectUtils.isObject(target) && objectUtils.isObject(source)) {
      for (const key in source) {
        if (objectUtils.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          objectUtils.deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    
    return objectUtils.deepMerge(target, ...sources);
  },

  isObject: (item: any): boolean => {
    return item && typeof item === 'object' && !Array.isArray(item);
  },

  isEmpty: (obj: any): boolean => {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
  },

  hasPath: (obj: any, path: string): boolean => {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current == null || typeof current !== 'object' || !(key in current)) {
        return false;
      }
      current = current[key];
    }
    
    return true;
  },

  getPath: (obj: any, path: string, defaultValue?: any): any => {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current == null || typeof current !== 'object' || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current;
  },

  setPath: (obj: any, path: string, value: any): void => {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }
};

// URL Utilities
export const urlUtils = {
  parseQuery: (queryString: string): Record<string, string> => {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    
    return result;
  },

  buildQuery: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  getBaseUrl: (url: string): string => {
    try {
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.host}`;
    } catch {
      return '';
    }
  },

  joinPaths: (...paths: string[]): string => {
    return paths
      .map(path => path.replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .join('/');
  }
};

// Color Utilities
export const colorUtils = {
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  rgbToHex: (r: number, g: number, b: number): string => {
    return `#${[r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  },

  rgbToHsl: (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
  },

  hslToRgb: (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  },

  lighten: (color: string, amount: number): string => {
    const rgb = colorUtils.hexToRgb(color);
    if (!rgb) return color;
    
    const hsl = colorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.min(100, hsl.l + amount);
    
    const newRgb = colorUtils.hslToRgb(hsl.h, hsl.s, hsl.l);
    return colorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  },

  darken: (color: string, amount: number): string => {
    const rgb = colorUtils.hexToRgb(color);
    if (!rgb) return color;
    
    const hsl = colorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.max(0, hsl.l - amount);
    
    const newRgb = colorUtils.hslToRgb(hsl.h, hsl.s, hsl.l);
    return colorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  },

  getContrastRatio: (color1: string, color2: string): number => {
    const getLuminance = (color: string): number => {
      const rgb = colorUtils.hexToRgb(color);
      if (!rgb) return 0;
      
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }
};

// Validation Utilities
export const validationUtils = {
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },

  isCreditCard: (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const cardRegex = /^\d{13,19}$/;
    
    if (!cardRegex.test(cleaned)) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  },

  isStrongPassword: (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },

  isIPAddress: (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }
};

// Performance Utilities
export const performanceUtils = {
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout;
    
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    }) as T;
  },

  throttle: <T extends (...args: any[]) => any>(func: T, limit: number): T => {
    let inThrottle: boolean;
    
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },

  memoize: <T extends (...args: any[]) => any>(func: T): T => {
    const cache = new Map();
    
    return ((...args: any[]) => {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = func.apply(null, args);
      cache.set(key, result);
      return result;
    }) as T;
  },

  once: <T extends (...args: any[]) => any>(func: T): T => {
    let called = false;
    let result: any;
    
    return ((...args: any[]) => {
      if (!called) {
        called = true;
        result = func.apply(null, args);
      }
      return result;
    }) as T;
  },

  measureTime: async <T>(func: () => Promise<T> | T): Promise<{ result: T; time: number }> => {
    const start = performance.now();
    const result = await func();
    const end = performance.now();
    
    return {
      result,
      time: end - start
    };
  }
};

// Storage Utilities
export const storageUtils = {
  setItem: (key: string, value: any, storage: Storage = localStorage): void => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to storage:', error);
    }
  },

  getItem: <T>(key: string, defaultValue: T, storage: Storage = localStorage): T => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to read from storage:', error);
      return defaultValue;
    }
  },

  removeItem: (key: string, storage: Storage = localStorage): void => {
    try {
      storage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from storage:', error);
    }
  },

  clear: (storage: Storage = localStorage): void => {
    try {
      storage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  },

  getStorageSize: (storage: Storage = localStorage): number => {
    let total = 0;
    
    for (let key in storage) {
      if (storage.hasOwnProperty(key)) {
        total += storage[key].length + key.length;
      }
    }
    
    return total;
  }
};

// Export all utilities
export default {
  detectPlatform,
  stringUtils,
  numberUtils,
  dateUtils,
  arrayUtils,
  objectUtils,
  urlUtils,
  colorUtils,
  validationUtils,
  performanceUtils,
  storageUtils
};

/**
 * Shared Utilities Library
 * 
 * Provides a comprehensive set of utility functions that work
 * across all platforms in the portfolio ecosystem.
 * 
 * Features:
 * - Platform detection and device information
 * - String manipulation and formatting
 * - Number formatting and calculations
 * - Date and time utilities
 * - Array operations and transformations
 * - Object manipulation and deep operations
 * - URL parsing and building
 * - Color conversion and manipulation
 * - Input validation
 * - Performance optimization helpers
 * - Local storage management
 * 
 * Usage:
 * ```typescript
 * import { detectPlatform, stringUtils, numberUtils, dateUtils } from '@shared/utils';
 * 
 * // Platform detection
 * const platform = detectPlatform();
 * console.log(platform.isMobile); // true/false
 * 
 * // String utilities
 * const slug = stringUtils.slugify('Hello World!'); // 'hello-world'
 * 
 * // Number formatting
 * const formatted = numberUtils.formatCurrency(1234.56); // '$1,234.56'
 * 
 * // Date utilities
 * const relative = dateUtils.formatRelativeTime(new Date()); // 'just now'
 * ```
 */