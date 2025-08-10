import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, Check, X, Shield, Eye, BarChart3, Target, ExternalLink } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookieConsentBannerProps {
  onAccept?: (preferences: CookiePreferences) => void;
  onDecline?: () => void;
  className?: string;
  position?: 'bottom' | 'top' | 'center';
  variant?: 'banner' | 'modal' | 'corner';
  showDetailsButton?: boolean;
  companyName?: string;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onAccept,
  onDecline,
  className = '',
  position = 'bottom',
  variant = 'banner',
  showDetailsButton = true,
  companyName = 'SOLO Portfolio'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });

  const cookieCategories = [
    {
      id: 'necessary' as keyof CookiePreferences,
      name: 'Necessary Cookies',
      description: 'Essential for the website to function properly. These cannot be disabled.',
      icon: <Shield className="w-5 h-5" />,
      required: true,
      examples: ['Session management', 'Security', 'Basic functionality']
    },
    {
      id: 'analytics' as keyof CookiePreferences,
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      icon: <BarChart3 className="w-5 h-5" />,
      required: false,
      examples: ['Google Analytics', 'Page views', 'User behavior']
    },
    {
      id: 'marketing' as keyof CookiePreferences,
      name: 'Marketing Cookies',
      description: 'Used to track visitors across websites for advertising purposes.',
      icon: <Target className="w-5 h-5" />,
      required: false,
      examples: ['Ad targeting', 'Social media', 'Retargeting']
    },
    {
      id: 'personalization' as keyof CookiePreferences,
      name: 'Personalization Cookies',
      description: 'Remember your preferences and provide customized content.',
      icon: <Eye className="w-5 h-5" />,
      required: false,
      examples: ['Theme preferences', 'Language settings', 'User preferences']
    }
  ];

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('cookie-consent');
    if (!consentGiven) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    onAccept?.(allAccepted);
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    onAccept?.(preferences);
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    onDecline?.();
    setIsVisible(false);
  };

  const handlePreferenceChange = (category: keyof CookiePreferences, value: boolean) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-0 left-0 right-0';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      case 'bottom':
      default:
        return 'bottom-0 left-0 right-0';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'modal':
        return 'max-w-2xl mx-auto m-4 rounded-2xl shadow-2xl';
      case 'corner':
        return 'max-w-sm m-4 rounded-xl shadow-lg bottom-4 right-4 left-auto';
      case 'banner':
      default:
        return 'w-full';
    }
  };

  const bannerVariants = {
    hidden: {
      opacity: 0,
      y: position === 'top' ? -100 : position === 'bottom' ? 100 : 0,
      scale: position === 'center' ? 0.9 : 1
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        type: 'spring' as const,
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      y: position === 'top' ? -100 : position === 'bottom' ? 100 : 0,
      scale: position === 'center' ? 0.9 : 1,
      transition: { duration: 0.3 }
    }
  };

  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop for modal variant */}
      {variant === 'modal' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsVisible(false)}
        />
      )}

      <AnimatePresence>
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed z-50 ${getPositionClasses()} ${className}`}
        >
          <div className={`${getVariantClasses()}`}>
            <div className="glassmorphic-card border border-gray-200 dark:border-gray-700 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Cookie className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Cookie Preferences
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      We value your privacy
                    </p>
                  </div>
                </div>
                
                {variant === 'modal' && (
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Main Content */}
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {companyName} uses cookies to enhance your browsing experience, serve personalized content, 
                  and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>

                {/* Cookie Details */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      variants={detailsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
                    >
                      {cookieCategories.map((category) => (
                        <div key={category.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-blue-600 dark:text-blue-400">
                                {category.icon}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {category.name}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                  {category.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              {category.required ? (
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                  Required
                                </span>
                              ) : (
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={preferences[category.id]}
                                    onChange={(e) => handlePreferenceChange(category.id, e.target.checked)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                              )}
                            </div>
                          </div>
                          
                          <div className="ml-8">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Examples: {category.examples.join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
                              Your Privacy Matters
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              You can change these preferences at any time in your browser settings or by clicking the cookie icon in the footer.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <div className="flex gap-2 flex-1">
                    <motion.button
                      onClick={handleDeclineAll}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      Decline All
                    </motion.button>
                    
                    {showDetailsButton && (
                      <motion.button
                        onClick={() => setShowDetails(!showDetails)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium flex items-center space-x-1"
                      >
                        <Settings className="w-4 h-4" />
                        <span>{showDetails ? 'Hide' : 'Customize'}</span>
                      </motion.button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {showDetails && (
                      <motion.button
                        onClick={handleAcceptSelected}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Preferences</span>
                      </motion.button>
                    )}
                    
                    <motion.button
                      onClick={handleAcceptAll}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept All</span>
                    </motion.button>
                  </div>
                </div>

                {/* Legal Links */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <a 
                    href="/privacy" 
                    className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1"
                  >
                    <span>Privacy Policy</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="/cookies" 
                    className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1"
                  >
                    <span>Cookie Policy</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="/terms" 
                    className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1"
                  >
                    <span>Terms of Service</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default CookieConsentBanner;