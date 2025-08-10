import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, Loader2, Gift, Bell, Zap } from 'lucide-react';

interface NewsletterSignupProps {
  onSubscribe?: (email: string, preferences: NewsletterPreferences) => Promise<void>;
  className?: string;
  variant?: 'default' | 'minimal' | 'featured' | 'sidebar';
  showPreferences?: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

interface NewsletterPreferences {
  frequency: 'weekly' | 'monthly' | 'important';
  topics: string[];
  format: 'html' | 'text';
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  onSubscribe,
  className = '',
  variant = 'default',
  showPreferences = false,
  title = 'Stay in the Loop',
  description = 'Get the latest updates, insights, and exclusive content delivered to your inbox.',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe'
}) => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<NewsletterPreferences>({
    frequency: 'monthly',
    topics: [],
    format: 'html'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPreferencesPanel, setShowPreferencesPanel] = useState(false);

  const availableTopics = [
    { id: 'web-dev', label: 'Web Development', icon: '🌐' },
    { id: 'design', label: 'UI/UX Design', icon: '🎨' },
    { id: 'tech-news', label: 'Tech News', icon: '📰' },
    { id: 'tutorials', label: 'Tutorials', icon: '📚' },
    { id: 'case-studies', label: 'Case Studies', icon: '📊' },
    { id: 'tools', label: 'Tools & Resources', icon: '🛠️' }
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleTopicToggle = (topicId: string) => {
    setPreferences(prev => ({
      ...prev,
      topics: prev.topics.includes(topicId)
        ? prev.topics.filter(id => id !== topicId)
        : [...prev.topics, topicId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      if (onSubscribe) {
        await onSubscribe(email, preferences);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setStatus('success');
      setEmail('');
      setShowPreferencesPanel(false);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4';
      case 'featured':
        return 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8';
      case 'sidebar':
        return 'bg-gray-50 dark:bg-gray-800 rounded-lg p-6';
      default:
        return 'glassmorphic-card rounded-xl p-6';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, type: 'spring' }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${getVariantStyles()} ${className}`}
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="text-center"
          >
            <div className="mb-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome Aboard! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Thank you for subscribing! Check your email for a confirmation link.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                <Gift className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Bonus: Free starter template pack coming your way!
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setStatus('idle');
                setEmail('');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Subscribe another email
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                {variant === 'featured' && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {description}
              </p>
            </div>

            {/* Benefits */}
            {variant === 'featured' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Weekly insights</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Gift className="w-4 h-4 text-purple-500" />
                  <span>Exclusive content</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No spam, ever</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg glassmorphic-input transition-all duration-200 ${
                      status === 'error' ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                
                <AnimatePresence>
                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errorMessage}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Preferences Toggle */}
              {showPreferences && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowPreferencesPanel(!showPreferencesPanel)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showPreferencesPanel ? 'Hide' : 'Customize'} preferences
                  </button>

                  <AnimatePresence>
                    {showPreferencesPanel && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        {/* Frequency */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Frequency
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['weekly', 'monthly', 'important'] as const).map((freq) => (
                              <button
                                key={freq}
                                type="button"
                                onClick={() => setPreferences(prev => ({ ...prev, frequency: freq }))}
                                className={`px-3 py-2 text-xs rounded-md transition-colors ${
                                  preferences.frequency === freq
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                                }`}
                              >
                                {freq.charAt(0).toUpperCase() + freq.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Topics */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Interested Topics
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {availableTopics.map((topic) => (
                              <button
                                key={topic.id}
                                type="button"
                                onClick={() => handleTopicToggle(topic.id)}
                                className={`flex items-center space-x-2 px-3 py-2 text-xs rounded-md transition-colors ${
                                  preferences.topics.includes(topic.id)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                                }`}
                              >
                                <span>{topic.icon}</span>
                                <span>{topic.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{buttonText}</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Privacy Notice */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              By subscribing, you agree to our{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                Privacy Policy
              </a>
              . Unsubscribe at any time.
            </p>

            {/* Social Proof */}
            {variant === 'featured' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Join <strong>2,500+</strong> developers already subscribed
                </p>
                <div className="flex justify-center mt-2 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 text-xs">
                    +
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewsletterSignup;