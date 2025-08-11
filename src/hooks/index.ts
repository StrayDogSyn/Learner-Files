/**
 * Custom Hooks Library
 * 
 * This module provides a comprehensive collection of custom React hooks
 * for common patterns and functionality throughout the application.
 * 
 * Categories:
 * - State Management: useLocalStorage, useSessionStorage, useDebounce, useThrottle
 * - UI/UX: useToggle, useDisclosure, useClipboard, useKeyboard, useFocus
 * - Performance: useMemo, useCallback, useVirtualization, useLazyLoading
 * - Network: useFetch, useAPI, useWebSocket, useOnlineStatus
 * - Browser: useMediaQuery, useViewport, useScrollPosition, usePageVisibility
 * - Game/Animation: useAnimation, useGameLoop, useTimer, useCountdown
 * - Utility: useInterval, useTimeout, usePrevious, useMount, useUnmount
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAppStore, useAppActions } from '@/store/appStore';
import { getUnifiedAPI } from '@/services/api';
import { useGameAnalytics } from './useGameAnalytics';
import { useGameState } from './useGameState';
import { usePerformanceMetrics } from './usePerformanceMetrics';

// Re-export existing hooks
export { useGameAnalytics } from './useGameAnalytics';
export { useGameState } from './useGameState';
export { usePerformanceMetrics } from './usePerformanceMetrics';

// State Management Hooks

/**
 * Hook for managing localStorage with type safety
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing sessionStorage with type safety
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for debouncing values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttling function calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

// UI/UX Hooks

/**
 * Hook for toggle state management
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setToggle = useCallback((newValue: boolean) => setValue(newValue), []);

  return [value, toggle, setToggle];
}

/**
 * Hook for disclosure state (modals, dropdowns, etc.)
 */
export function useDisclosure(initialOpen: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    onOpen: open,
    onClose: close,
    onToggle: toggle
  };
}

/**
 * Hook for clipboard operations
 */
export function useClipboard(timeout: number = 2000) {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), timeout);
      return true;
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
      setHasCopied(false);
      return false;
    }
  }, [timeout]);

  return { copy, hasCopied };
}

/**
 * Hook for keyboard event handling
 */
export function useKeyboard(
  targetKey: string | string[],
  handler: (event: KeyboardEvent) => void,
  options: {
    event?: 'keydown' | 'keyup' | 'keypress';
    target?: EventTarget;
    preventDefault?: boolean;
    stopPropagation?: boolean;
  } = {}
) {
  const {
    event = 'keydown',
    target = window,
    preventDefault = false,
    stopPropagation = false
  } = options;

  useEffect(() => {
    const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

    const eventHandler = (e: KeyboardEvent) => {
      if (keys.includes(e.key) || keys.includes(e.code)) {
        if (preventDefault) e.preventDefault();
        if (stopPropagation) e.stopPropagation();
        handler(e);
      }
    };

    target.addEventListener(event, eventHandler as EventListener);

    return () => {
      target.removeEventListener(event, eventHandler as EventListener);
    };
  }, [targetKey, handler, event, target, preventDefault, stopPropagation]);
}

/**
 * Hook for focus management
 */
export function useFocus<T extends HTMLElement>(): [
  React.RefObject<T>,
  () => void,
  boolean
] {
  const ref = useRef<T>(null);
  const [isFocused, setIsFocused] = useState(false);

  const focus = useCallback(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, []);

  return [ref, focus, isFocused];
}

// Network Hooks

/**
 * Hook for API calls with loading, error, and data states
 */
export function useAPI<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => execute(), [execute]);

  return {
    data,
    loading,
    error,
    refetch,
    execute
  };
}

/**
 * Hook for fetch operations with caching
 */
export function useFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheKey?: string
) {
  const { getCache, setCache } = useAppActions();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    const key = cacheKey || `fetch_${url}`;
    
    // Check cache first
    const cached = getCache(key);
    if (cached) {
      setData(cached);
      return cached;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      
      // Cache the result
      setCache(key, result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Fetch failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [url, options, cacheKey, getCache, setCache]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook for WebSocket connections
 */
export function useWebSocket(
  url: string,
  options: {
    onOpen?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    reconnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
  } = {}
) {
  const {
    onOpen,
    onMessage,
    onError,
    onClose,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = (event) => {
        setIsConnected(true);
        setReconnectCount(0);
        onOpen?.(event);
      };

      ws.onmessage = (event) => {
        onMessage?.(event);
      };

      ws.onerror = (event) => {
        onError?.(event);
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        onClose?.(event);

        if (reconnect && reconnectCount < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };

      setSocket(ws);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, [url, onOpen, onMessage, onError, onClose, reconnect, reconnectCount, maxReconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    socket?.close();
    setSocket(null);
    setIsConnected(false);
  }, [socket]);

  const sendMessage = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (socket && isConnected) {
      socket.send(data);
    }
  }, [socket, isConnected]);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    socket,
    isConnected,
    sendMessage,
    connect,
    disconnect,
    reconnectCount
  };
}

/**
 * Hook for online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Browser Hooks

/**
 * Hook for media queries
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Hook for viewport dimensions
 */
export function useViewport() {
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

/**
 * Hook for scroll position
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}

/**
 * Hook for page visibility
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
}

// Timer Hooks

/**
 * Hook for intervals
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook for timeouts
 */
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current();
    const id = setTimeout(tick, delay);
    return () => clearTimeout(id);
  }, [delay]);
}

/**
 * Hook for countdown timer
 */
export function useCountdown(initialTime: number) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  useInterval(
    () => {
      setTime(time => {
        if (time <= 1) {
          setIsRunning(false);
          return 0;
        }
        return time - 1;
      });
    },
    isRunning ? 1000 : null
  );

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    isFinished: time === 0
  };
}

// Utility Hooks

/**
 * Hook for getting previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

/**
 * Hook for component mount/unmount
 */
export function useMount(callback: () => void) {
  useEffect(() => {
    callback();
  }, []);
}

export function useUnmount(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return () => callbackRef.current();
  }, []);
}

/**
 * Hook for async operations with cleanup
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      });
      throw error;
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    ...state,
    execute
  };
}

/**
 * Hook for lazy loading with Intersection Observer
 */
export function useLazyLoading(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(element);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [ref, isIntersecting];
}

/**
 * Hook for form validation
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validate field
    const error = validationRules[field]?.(value);
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
  }, [validationRules]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field as keyof T](values[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setFieldTouched,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0
  };
}

/**
 * Hook for managing app-wide state with Zustand
 */
export function useAppState() {
  const store = useAppStore();
  const actions = useAppActions();

  return {
    ...store,
    ...actions
  };
}

/**
 * Hook for theme management
 */
export function useThemeManager() {
  const { user } = useAppStore();
  const { updateUserPreferences } = useAppActions();

  const theme = user?.preferences.theme || 'system';
  const colorScheme = user?.preferences.colorScheme || 'blue';

  const setTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    updateUserPreferences({ theme: newTheme });
  }, [updateUserPreferences]);

  const setColorScheme = useCallback((newColorScheme: string) => {
    updateUserPreferences({ colorScheme: newColorScheme as any });
  }, [updateUserPreferences]);

  const isDark = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }, [theme]);

  return {
    theme,
    colorScheme,
    isDark,
    setTheme,
    setColorScheme
  };
}

/**
 * Hook for API service integration
 */
export function useAPIService() {
  const { api } = useAppStore();
  const { updateAPIStatus, updateAPIMetrics, addAPIError } = useAppActions();

  const getService = useCallback(() => {
    try {
      return getUnifiedAPI();
    } catch (error) {
      console.warn('Unified API not initialized');
      return null;
    }
  }, []);

  const checkHealth = useCallback(async () => {
    const service = getService();
    if (!service) return;

    try {
      const status = await service.getServiceStatus();
      updateAPIStatus(status as any);
    } catch (error) {
      addAPIError({
        service: 'unified',
        message: error instanceof Error ? error.message : 'Health check failed',
        timestamp: Date.now(),
        resolved: false
      });
    }
  }, [getService, updateAPIStatus, addAPIError]);

  return {
    api,
    getService,
    checkHealth,
    isInitialized: api.isInitialized
  };
}

// Export all hooks as a collection
export const hooks = {
  // State Management
  useLocalStorage,
  useSessionStorage,
  useDebounce,
  useThrottle,
  
  // UI/UX
  useToggle,
  useDisclosure,
  useClipboard,
  useKeyboard,
  useFocus,
  
  // Network
  useAPI,
  useFetch,
  useWebSocket,
  useOnlineStatus,
  
  // Browser
  useMediaQuery,
  useViewport,
  useScrollPosition,
  usePageVisibility,
  
  // Timer
  useInterval,
  useTimeout,
  useCountdown,
  
  // Utility
  usePrevious,
  useMount,
  useUnmount,
  useAsync,
  useLazyLoading,
  useFormValidation,
  
  // App-specific
  useAppState,
  useThemeManager,
  useAPIService,
  useGameAnalytics,
  useGameState,
  usePerformanceMetrics
};

export default hooks;