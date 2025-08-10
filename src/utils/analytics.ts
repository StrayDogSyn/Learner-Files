// Google Analytics 4 Configuration and Event Tracking

// GA4 Configuration
interface GAConfig {
  measurementId: string;
  debug?: boolean;
  anonymizeIp?: boolean;
  cookieFlags?: string;
}

// Custom Event Types
interface CustomEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Portfolio-specific Events
interface PortfolioEvents {
  project_view: {
    project_name: string;
    project_category: string;
    view_duration?: number;
  };
  resume_download: {
    format: 'pdf' | 'doc';
    source: string;
  };
  contact_form_submit: {
    form_type: 'contact' | 'newsletter' | 'booking';
    success: boolean;
  };
  navigation_click: {
    destination: string;
    source_page: string;
  };
  social_link_click: {
    platform: string;
    link_type: 'header' | 'footer' | 'contact';
  };
  theme_toggle: {
    from_theme: 'light' | 'dark' | 'system';
    to_theme: 'light' | 'dark' | 'system';
  };
  interactive_element: {
    element_type: 'button' | 'card' | 'modal' | 'tooltip';
    action: 'hover' | 'click' | 'focus';
    element_id?: string;
  };
  performance_metric: {
    metric_name: string;
    value: number;
    page: string;
  };
}

class GoogleAnalytics {
  private measurementId: string;
  private isInitialized: boolean = false;
  private debug: boolean = false;

  constructor(config: GAConfig) {
    this.measurementId = config.measurementId;
    this.debug = config.debug || false;
    
    if (typeof window !== 'undefined') {
      this.initialize(config);
    }
  }

  private initialize(config: GAConfig): void {
    try {
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        anonymize_ip: config.anonymizeIp || true,
        cookie_flags: config.cookieFlags || 'SameSite=None;Secure',
        debug_mode: this.debug,
        send_page_view: true
      });

      this.isInitialized = true;
      
      if (this.debug) {
        console.log('Google Analytics 4 initialized:', this.measurementId);
      }
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  // Track page views
  trackPageView(page_title: string, page_location?: string): void {
    if (!this.isInitialized || typeof window === 'undefined') return;

    try {
      window.gtag('event', 'page_view', {
        page_title,
        page_location: page_location || window.location.href,
        page_referrer: document.referrer
      });

      if (this.debug) {
        console.log('Page view tracked:', { page_title, page_location });
      }
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  // Track custom events
  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (!this.isInitialized || typeof window === 'undefined') return;

    try {
      window.gtag('event', eventName, {
        ...parameters,
        timestamp: Date.now()
      });

      if (this.debug) {
        console.log('Event tracked:', eventName, parameters);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  // Portfolio-specific event tracking methods
  trackProjectView(data: PortfolioEvents['project_view']): void {
    this.trackEvent('project_view', {
      project_name: data.project_name,
      project_category: data.project_category,
      view_duration: data.view_duration,
      event_category: 'Portfolio',
      event_label: 'Project Interaction'
    });
  }

  trackResumeDownload(data: PortfolioEvents['resume_download']): void {
    this.trackEvent('resume_download', {
      format: data.format,
      source: data.source,
      event_category: 'Engagement',
      event_label: 'Resume Download'
    });
  }

  trackContactFormSubmit(data: PortfolioEvents['contact_form_submit']): void {
    this.trackEvent('contact_form_submit', {
      form_type: data.form_type,
      success: data.success,
      event_category: 'Lead Generation',
      event_label: 'Form Submission'
    });
  }

  trackNavigation(data: PortfolioEvents['navigation_click']): void {
    this.trackEvent('navigation_click', {
      destination: data.destination,
      source_page: data.source_page,
      event_category: 'Navigation',
      event_label: 'Internal Link'
    });
  }

  trackSocialClick(data: PortfolioEvents['social_link_click']): void {
    this.trackEvent('social_link_click', {
      platform: data.platform,
      link_type: data.link_type,
      event_category: 'Social Media',
      event_label: 'External Link'
    });
  }

  trackThemeToggle(data: PortfolioEvents['theme_toggle']): void {
    this.trackEvent('theme_toggle', {
      from_theme: data.from_theme,
      to_theme: data.to_theme,
      event_category: 'User Preference',
      event_label: 'Theme Change'
    });
  }

  trackInteractiveElement(data: PortfolioEvents['interactive_element']): void {
    this.trackEvent('interactive_element', {
      element_type: data.element_type,
      action: data.action,
      element_id: data.element_id,
      event_category: 'User Interaction',
      event_label: 'UI Element'
    });
  }

  trackPerformanceMetric(data: PortfolioEvents['performance_metric']): void {
    this.trackEvent('performance_metric', {
      metric_name: data.metric_name,
      value: data.value,
      page: data.page,
      event_category: 'Performance',
      event_label: 'Web Vitals'
    });
  }

  // Conversion tracking
  trackConversion(conversionId: string, value?: number, currency: string = 'USD'): void {
    if (!this.isInitialized || typeof window === 'undefined') return;

    try {
      window.gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
        currency: currency,
        event_category: 'Conversion',
        event_label: 'Goal Completion'
      });

      if (this.debug) {
        console.log('Conversion tracked:', { conversionId, value, currency });
      }
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  }

  // Enhanced ecommerce tracking (for potential future use)
  trackPurchase(transactionId: string, items: any[], value: number, currency: string = 'USD'): void {
    if (!this.isInitialized || typeof window === 'undefined') return;

    try {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items,
        event_category: 'Ecommerce',
        event_label: 'Purchase'
      });

      if (this.debug) {
        console.log('Purchase tracked:', { transactionId, value, currency, items });
      }
    } catch (error) {
      console.error('Failed to track purchase:', error);
    }
  }

  // User properties
  setUserProperty(property: string, value: string): void {
    if (!this.isInitialized || typeof window === 'undefined') return;

    try {
      window.gtag('config', this.measurementId, {
        custom_map: { [property]: value }
      });

      if (this.debug) {
        console.log('User property set:', { property, value });
      }
    } catch (error) {
      console.error('Failed to set user property:', error);
    }
  }

  // Consent management
  updateConsent(consentSettings: {
    analytics_storage?: 'granted' | 'denied';
    ad_storage?: 'granted' | 'denied';
    functionality_storage?: 'granted' | 'denied';
    personalization_storage?: 'granted' | 'denied';
  }): void {
    if (typeof window === 'undefined') return;

    try {
      window.gtag('consent', 'update', consentSettings);

      if (this.debug) {
        console.log('Consent updated:', consentSettings);
      }
    } catch (error) {
      console.error('Failed to update consent:', error);
    }
  }
}

// Global gtag interface
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Analytics instance
const analytics = new GoogleAnalytics({
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  debug: import.meta.env.DEV,
  anonymizeIp: true,
  cookieFlags: 'SameSite=None;Secure'
});

// React hook for analytics
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views on route changes
  useEffect(() => {
    const pageTitle = document.title;
    const pagePath = location.pathname + location.search;
    
    analytics.trackPageView(pageTitle, window.location.origin + pagePath);
  }, [location]);

  // Return tracking functions
  return {
    trackEvent: useCallback((eventName: string, parameters?: Record<string, any>) => {
      analytics.trackEvent(eventName, parameters);
    }, []),
    
    trackProjectView: useCallback((data: PortfolioEvents['project_view']) => {
      analytics.trackProjectView(data);
    }, []),
    
    trackResumeDownload: useCallback((data: PortfolioEvents['resume_download']) => {
      analytics.trackResumeDownload(data);
    }, []),
    
    trackContactFormSubmit: useCallback((data: PortfolioEvents['contact_form_submit']) => {
      analytics.trackContactFormSubmit(data);
    }, []),
    
    trackNavigation: useCallback((data: PortfolioEvents['navigation_click']) => {
      analytics.trackNavigation(data);
    }, []),
    
    trackSocialClick: useCallback((data: PortfolioEvents['social_link_click']) => {
      analytics.trackSocialClick(data);
    }, []),
    
    trackThemeToggle: useCallback((data: PortfolioEvents['theme_toggle']) => {
      analytics.trackThemeToggle(data);
    }, []),
    
    trackInteractiveElement: useCallback((data: PortfolioEvents['interactive_element']) => {
      analytics.trackInteractiveElement(data);
    }, []),
    
    trackPerformanceMetric: useCallback((data: PortfolioEvents['performance_metric']) => {
      analytics.trackPerformanceMetric(data);
    }, []),
    
    trackConversion: useCallback((conversionId: string, value?: number, currency?: string) => {
      analytics.trackConversion(conversionId, value, currency);
    }, []),
    
    setUserProperty: useCallback((property: string, value: string) => {
      analytics.setUserProperty(property, value);
    }, []),
    
    updateConsent: useCallback((consentSettings: Parameters<typeof analytics.updateConsent>[0]) => {
      analytics.updateConsent(consentSettings);
    }, [])
  };
};

export default analytics;
export type { PortfolioEvents, CustomEvent, GAConfig };