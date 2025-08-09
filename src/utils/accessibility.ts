/**
 * Accessibility Utilities
 * Comprehensive tools for WCAG 2.1 AA compliance and enhanced accessibility
 */

// Accessibility Configuration
export interface AccessibilityConfig {
  announceChanges: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
  screenReaderOptimized: boolean;
}

// Focus Management
export class FocusManager {
  private static instance: FocusManager;
  private focusHistory: HTMLElement[] = [];
  private trapStack: HTMLElement[] = [];

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  // Save current focus for restoration
  saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement);
    }
  }

  // Restore previously saved focus
  restoreFocus(): void {
    const lastFocused = this.focusHistory.pop();
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
    }
  }

  // Trap focus within a container
  trapFocus(container: HTMLElement): () => void {
    this.saveFocus();
    this.trapStack.push(container);

    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      this.trapStack.pop();
      this.restoreFocus();
    };
  }

  // Get all focusable elements within a container
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        const htmlElement = element as HTMLElement;
        return htmlElement.offsetParent !== null && 
               getComputedStyle(htmlElement).visibility !== 'hidden';
      }) as HTMLElement[];
  }

  // Move focus to next/previous focusable element
  moveFocus(direction: 'next' | 'previous', container?: HTMLElement): void {
    const root = container || document.body;
    const focusableElements = this.getFocusableElements(root);
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

    let nextIndex: number;
    if (direction === 'next') {
      nextIndex = currentIndex + 1 >= focusableElements.length ? 0 : currentIndex + 1;
    } else {
      nextIndex = currentIndex - 1 < 0 ? focusableElements.length - 1 : currentIndex - 1;
    }

    focusableElements[nextIndex]?.focus();
  }
}

// Screen Reader Announcements
export class ScreenReaderAnnouncer {
  private static instance: ScreenReaderAnnouncer;
  private liveRegion: HTMLElement | null = null;

  static getInstance(): ScreenReaderAnnouncer {
    if (!ScreenReaderAnnouncer.instance) {
      ScreenReaderAnnouncer.instance = new ScreenReaderAnnouncer();
    }
    return ScreenReaderAnnouncer.instance;
  }

  constructor() {
    this.createLiveRegion();
  }

  private createLiveRegion(): void {
    if (typeof document === 'undefined') return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('aria-relevant', 'text');
    this.liveRegion.style.position = 'absolute';
    this.liveRegion.style.left = '-10000px';
    this.liveRegion.style.width = '1px';
    this.liveRegion.style.height = '1px';
    this.liveRegion.style.overflow = 'hidden';
    document.body.appendChild(this.liveRegion);
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, 1000);
  }

  announceNavigation(pageName: string): void {
    this.announce(`Navigated to ${pageName}`, 'polite');
  }

  announceError(error: string): void {
    this.announce(`Error: ${error}`, 'assertive');
  }

  announceSuccess(message: string): void {
    this.announce(`Success: ${message}`, 'polite');
  }
}

// Color Contrast Utilities
export class ColorContrastChecker {
  // Calculate relative luminance
  static getRelativeLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // Calculate contrast ratio between two colors
  static getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getRelativeLuminance(color1);
    const lum2 = this.getRelativeLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  // Check if contrast meets WCAG standards
  static meetsWCAGStandards(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): {
    normal: boolean;
    large: boolean;
    ratio: number;
  } {
    const ratio = this.getContrastRatio(foreground, background);
    const thresholds = level === 'AAA' ? { normal: 7, large: 4.5 } : { normal: 4.5, large: 3 };

    return {
      normal: ratio >= thresholds.normal,
      large: ratio >= thresholds.large,
      ratio
    };
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}

// Keyboard Navigation Handler
export class KeyboardNavigationHandler {
  private handlers: Map<string, (event: KeyboardEvent) => void> = new Map();
  private isActive = false;

  // Register keyboard shortcuts
  register(key: string, handler: (event: KeyboardEvent) => void): void {
    this.handlers.set(key.toLowerCase(), handler);
  }

  // Unregister keyboard shortcuts
  unregister(key: string): void {
    this.handlers.delete(key.toLowerCase());
  }

  // Start listening for keyboard events
  activate(): void {
    if (this.isActive) return;
    this.isActive = true;
    document.addEventListener('keydown', this.handleKeyDown);
  }

  // Stop listening for keyboard events
  deactivate(): void {
    if (!this.isActive) return;
    this.isActive = false;
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    const key = this.getKeyString(event);
    const handler = this.handlers.get(key);
    
    if (handler) {
      event.preventDefault();
      handler(event);
    }
  };

  private getKeyString(event: KeyboardEvent): string {
    const parts: string[] = [];
    
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    
    parts.push(event.key.toLowerCase());
    
    return parts.join('+');
  }
}

// Accessibility Preferences Manager
export class AccessibilityPreferences {
  private static instance: AccessibilityPreferences;
  private preferences: AccessibilityConfig;

  static getInstance(): AccessibilityPreferences {
    if (!AccessibilityPreferences.instance) {
      AccessibilityPreferences.instance = new AccessibilityPreferences();
    }
    return AccessibilityPreferences.instance;
  }

  constructor() {
    this.preferences = this.loadPreferences();
    this.applyPreferences();
  }

  private loadPreferences(): AccessibilityConfig {
    const stored = localStorage.getItem('accessibility-preferences');
    const defaults: AccessibilityConfig = {
      announceChanges: true,
      highContrast: false,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      focusVisible: true,
      screenReaderOptimized: false
    };

    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  }

  private savePreferences(): void {
    localStorage.setItem('accessibility-preferences', JSON.stringify(this.preferences));
  }

  private applyPreferences(): void {
    document.documentElement.classList.toggle('high-contrast', this.preferences.highContrast);
    document.documentElement.classList.toggle('reduced-motion', this.preferences.reducedMotion);
    document.documentElement.classList.toggle('focus-visible', this.preferences.focusVisible);
    document.documentElement.classList.toggle('screen-reader-optimized', this.preferences.screenReaderOptimized);
  }

  updatePreference<K extends keyof AccessibilityConfig>(key: K, value: AccessibilityConfig[K]): void {
    this.preferences[key] = value;
    this.savePreferences();
    this.applyPreferences();
  }

  getPreferences(): AccessibilityConfig {
    return { ...this.preferences };
  }
}

// ARIA Utilities
export class AriaUtils {
  // Generate unique IDs for ARIA relationships
  static generateId(prefix: string = 'aria'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Set up ARIA relationships between elements
  static linkElements(trigger: HTMLElement, target: HTMLElement, relationship: 'describedby' | 'labelledby' | 'controls'): void {
    let targetId = target.id;
    if (!targetId) {
      targetId = this.generateId();
      target.id = targetId;
    }

    const currentValue = trigger.getAttribute(`aria-${relationship}`) || '';
    const values = currentValue.split(' ').filter(Boolean);
    
    if (!values.includes(targetId)) {
      values.push(targetId);
      trigger.setAttribute(`aria-${relationship}`, values.join(' '));
    }
  }

  // Update ARIA live region
  static updateLiveRegion(element: HTMLElement, message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    element.setAttribute('aria-live', priority);
    element.textContent = message;
  }

  // Set ARIA expanded state
  static setExpanded(element: HTMLElement, expanded: boolean): void {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  // Set ARIA selected state
  static setSelected(element: HTMLElement, selected: boolean): void {
    element.setAttribute('aria-selected', selected.toString());
  }

  // Set ARIA pressed state for toggle buttons
  static setPressed(element: HTMLElement, pressed: boolean): void {
    element.setAttribute('aria-pressed', pressed.toString());
  }
}

// Export singleton instances
export const focusManager = FocusManager.getInstance();
export const screenReader = ScreenReaderAnnouncer.getInstance();
export const accessibilityPreferences = AccessibilityPreferences.getInstance();
export const keyboardHandler = new KeyboardNavigationHandler();

// Auto-activate keyboard navigation
if (typeof window !== 'undefined') {
  keyboardHandler.activate();
  
  // Register common keyboard shortcuts
  keyboardHandler.register('escape', () => {
    const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]');
    if (activeModal) {
      const closeButton = activeModal.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement;
      closeButton?.click();
    }
  });
  
  keyboardHandler.register('ctrl+/', () => {
    screenReader.announce('Keyboard shortcuts: Escape to close modals, Tab to navigate, Enter to activate');
  });
}