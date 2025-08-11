import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cookie, 
  Shield, 
  Settings, 
  Check, 
  X, 
  Info,
  Eye,
  BarChart3,
  Target
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassToggle } from '../ui/GlassToggle';
import { GlassModal } from '../ui/GlassModal';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export interface CookieConsentProps {
  onConsentChange: (preferences: ConsentPreferences) => void;
  companyName?: string;
  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;
}

const STORAGE_KEY = 'cookie_consent_preferences';
const CONSENT_VERSION = '1.0';

export const EnhancedCookieConsent: React.FC<CookieConsentProps> = ({
  onConsentChange,
  companyName = 'Portfolio',
  privacyPolicyUrl = '/privacy',
  cookiePolicyUrl = '/cookies'
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConsentStatus();
  }, []);

  const checkConsentStatus = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const { preferences: storedPrefs, version, timestamp } = JSON.parse(stored);
        
        // Check if consent is still valid (1 year)
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        const isExpired = Date.now() - timestamp > oneYear;
        
        if (!isExpired && version === CONSENT_VERSION) {
          setPreferences(storedPrefs);
          onConsentChange(storedPrefs);
          return;
        }
      } catch (error) {
        console.error('Failed to parse stored consent:', error);
      }
    }
    
    // Show banner if no valid consent found
    setShowBanner(true);
  };

  const saveConsent = (newPreferences: ConsentPreferences) => {
    const consentData = {
      preferences: newPreferences,
      version: CONSENT_VERSION,
      timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
    setPreferences(newPreferences);
    onConsentChange(newPreferences);
  };

  const handleAcceptAll = async () => {
    setIsLoading(true);
    
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
    
    saveConsent(allAccepted);
    setShowBanner(false);
    setIsLoading(false);
  };

  const handleRejectAll = async () => {
    setIsLoading(true);
    
    const onlyNecessary: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    saveConsent(onlyNecessary);
    setShowBanner(false);
    setIsLoading(false);
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  const handleSaveCustom = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    saveConsent(preferences);
    setShowSettings(false);
    setShowBanner(false);
    setIsLoading(false);
  };

  const updatePreference = (key: keyof ConsentPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: key === 'necessary' ? true : value // Necessary cookies cannot be disabled
    }));
  };

  const cookieCategories = [
    {
      key: 'necessary' as keyof ConsentPreferences,
      title: 'Necessary Cookies',
      description: 'Essential for the website to function properly. These cannot be disabled.',
      icon: Shield,
      required: true,
      examples: ['Session management', 'Security', 'Basic functionality']
    },
    {
      key: 'analytics' as keyof ConsentPreferences,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      icon: BarChart3,
      required: false,
      examples: ['Google Analytics', 'Mixpanel', 'Performance monitoring']
    },
    {
      key: 'marketing' as keyof ConsentPreferences,
      title: 'Marketing Cookies',
      description: 'Used to track visitors across websites for marketing purposes.',
      icon: Target,
      required: false,
      examples: ['Social media tracking', 'Advertising', 'Retargeting']
    },
    {
      key: 'personalization' as keyof ConsentPreferences,
      title: 'Personalization Cookies',
      description: 'Remember your preferences and provide personalized content.',
      icon: Eye,
      required: false,
      examples: ['Theme preferences', 'Language settings', 'Customizations']
    }
  ];

  if (!showBanner && !showSettings) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <GlassCard className="max-w-4xl mx-auto p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Cookie className="w-8 h-8 text-blue-500" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    We value your privacy
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    We use cookies and similar technologies to enhance your browsing experience, 
                    analyze site traffic, and provide personalized content. By clicking "Accept All", 
                    you consent to our use of cookies.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <GlassButton
                      onClick={handleAcceptAll}
                      disabled={isLoading}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Accept All
                        </>
                      )}
                    </GlassButton>
                    
                    <GlassButton
                      onClick={handleRejectAll}
                      disabled={isLoading}
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject All
                    </GlassButton>
                    
                    <GlassButton
                      onClick={handleCustomize}
                      disabled={isLoading}
                      variant="outline"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Customize
                    </GlassButton>
                  </div>
                  
                  <div className="flex gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <a 
                      href={privacyPolicyUrl} 
                      className="hover:text-blue-500 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                    <a 
                      href={cookiePolicyUrl} 
                      className="hover:text-blue-500 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cookie Policy
                    </a>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Cookie Preferences"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              Customize your cookie preferences below. You can change these settings at any time, 
              but some features may not work properly if certain cookies are disabled.
            </p>
          </div>

          <div className="space-y-4">
            {cookieCategories.map((category) => {
              const IconComponent = category.icon;
              const isEnabled = preferences[category.key];
              
              return (
                <motion.div
                  key={category.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <IconComponent className="w-5 h-5 text-blue-500 mt-0.5" />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {category.title}
                          </h4>
                          {category.required && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {category.description}
                        </p>
                        
                        <details className="text-xs text-gray-500 dark:text-gray-400">
                          <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                            Examples
                          </summary>
                          <ul className="mt-1 ml-4 list-disc">
                            {category.examples.map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    </div>
                    
                    <GlassToggle
                      checked={isEnabled}
                      onChange={(checked) => updatePreference(category.key, checked)}
                      disabled={category.required}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <Info className="w-3 h-3 inline mr-1" />
              Changes will take effect immediately
            </div>
            
            <div className="flex gap-3">
              <GlassButton
                onClick={() => setShowSettings(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </GlassButton>
              
              <GlassButton
                onClick={handleSaveCustom}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Save Preferences'
                )}
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassModal>
    </>
  );
};

export default EnhancedCookieConsent;