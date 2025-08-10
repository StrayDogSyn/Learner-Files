import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Phone, MapPin, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAccessibility, AccessibleFormField } from '../AccessibilityProvider';


interface FormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
  projectType?: string;
}

interface FormErrors {
  [key: string]: string;
}

interface EnhancedContactFormProps {
  formspreeEndpoint?: string;
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: string) => void;
  className?: string;
}

const EnhancedContactForm: React.FC<EnhancedContactFormProps> = ({
  formspreeEndpoint = 'https://formspree.io/f/your-form-id',
  onSubmitSuccess,
  onSubmitError,
  className = ''
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    budget: '',
    timeline: '',
    projectType: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const { announceMessage, prefersReducedMotion } = useAccessibility();

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'phone':
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return 'Please enter a valid phone number';
        }
        return '';
      
      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.trim().length < 5) return 'Subject must be at least 5 characters';
        return '';
      
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (['name', 'email', 'subject', 'message'].includes(key)) {
        const error = validateField(key, formData[key as keyof FormData] || '');
        if (error) newErrors[key] = error;
      }
    });

    // Validate phone if provided
    if (formData.phone) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      announceMessage(`Form has ${Object.keys(newErrors).length} validation errors. Please review and correct them.`, 'assertive');
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your message has been sent successfully.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          budget: '',
          timeline: '',
          projectType: ''
        });
        announceMessage('Your message has been sent successfully! We will get back to you soon.', 'assertive');
        onSubmitSuccess?.();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      announceMessage(`There was an error sending your message: ${errorMessage}. Please try again.`, 'assertive');
      onSubmitError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)',
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glassmorphic-card p-8 rounded-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Work Together
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ready to bring your ideas to life? Send me a message and let's discuss your project.
          </p>
        </div>

        <motion.form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <motion.div className="space-y-2" variants={inputVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="inline w-4 h-4 mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg glassmorphic-input transition-all duration-200 ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your full name"
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    id="name-error"
                    className="text-red-500 text-sm flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email Field */}
            <motion.div className="space-y-2" variants={inputVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg glassmorphic-input transition-all duration-200 ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="your.email@example.com"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    id="email-error"
                    className="text-red-500 text-sm flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Phone Field */}
            <motion.div className="space-y-2" variants={inputVariants}>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <Phone className="inline w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg glassmorphic-input transition-all duration-200 ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="+1 (555) 123-4567"
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              <AnimatePresence>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    id="phone-error"
                    className="text-red-500 text-sm flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Project Type */}
            <motion.div className="space-y-2" variants={inputVariants}>
              <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg glassmorphic-input transition-all duration-200"
              >
                <option value="">Select project type</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-app">Mobile App</option>
                <option value="ui-ux-design">UI/UX Design</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </motion.div>
          </div>

          {/* Subject Field */}
          <motion.div className="space-y-2" variants={inputVariants}>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <MessageSquare className="inline w-4 h-4 mr-2" />
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg glassmorphic-input transition-all duration-200 ${
                errors.subject ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="What's your project about?"
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
            <AnimatePresence>
              {errors.subject && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  id="subject-error"
                  className="text-red-500 text-sm flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.subject}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget */}
            <motion.div className="space-y-2" variants={inputVariants}>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg glassmorphic-input transition-all duration-200"
              >
                <option value="">Select budget range</option>
                <option value="under-5k">Under $5,000</option>
                <option value="5k-10k">$5,000 - $10,000</option>
                <option value="10k-25k">$10,000 - $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="over-50k">Over $50,000</option>
              </select>
            </motion.div>

            {/* Timeline */}
            <motion.div className="space-y-2" variants={inputVariants}>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <Clock className="inline w-4 h-4 mr-2" />
                Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg glassmorphic-input transition-all duration-200"
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="1-month">Within 1 month</option>
                <option value="2-3-months">2-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </motion.div>
          </div>

          {/* Message Field */}
          <motion.div className="space-y-2" variants={inputVariants}>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg glassmorphic-input transition-all duration-200 resize-none ${
                errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Tell me about your project, goals, and any specific requirements..."
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            <AnimatePresence>
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  id="message-error"
                  className="text-red-500 text-sm flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit Status */}
          <AnimatePresence>
            {submitStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg flex items-center ${
                  submitStatus === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}
              >
                {submitStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                {submitMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default EnhancedContactForm;