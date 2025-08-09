import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  User, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Clock, 
  Phone, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Sparkles,
  Shield,
  Globe,
  Save,
  LucideIcon
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { projects } from '../data/projects';

// Types and interfaces
interface BudgetRange {
  value: string;
  label: string;
  icon: string;
}

interface TimelineOption {
  value: string;
  label: string;
  icon: string;
}

interface ContactMethod {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface SubjectCategory {
  value: string;
  label: string;
  icon: string;
}

interface SpamCheckResult {
  isSpam: boolean;
  score: number;
  confidence: number;
}

interface AISuggestions {
  messageTemplate?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectInterest: string;
  budgetRange: string;
  timeline: string;
  preferredContact: string;
  honeypot: string;
  recaptchaToken: string;
}

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  projectInterest: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  preferredContact: z.string().optional(),
  honeypot: z.string().max(0, 'Invalid submission'),
  recaptchaToken: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Budget range options
const budgetRanges: BudgetRange[] = [
  { value: 'under-1k', label: 'Under $1,000', icon: '💰' },
  { value: '1k-5k', label: '$1,000 - $5,000', icon: '💵' },
  { value: '5k-10k', label: '$5,000 - $10,000', icon: '💎' },
  { value: '10k-25k', label: '$10,000 - $25,000', icon: '🏆' },
  { value: '25k+', label: '$25,000+', icon: '🚀' },
  { value: 'discuss', label: 'Let\'s discuss', icon: '🤝' },
];

// Timeline options
const timelineOptions: TimelineOption[] = [
  { value: 'asap', label: 'ASAP (1-2 weeks)', icon: '⚡' },
  { value: '1month', label: '1 month', icon: '📅' },
  { value: '2months', label: '2 months', icon: '📆' },
  { value: '3months', label: '3 months', icon: '🗓️' },
  { value: 'flexible', label: 'Flexible', icon: '🔄' },
];

// Contact method options
const contactMethods: ContactMethod[] = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone Call', icon: Phone },
  { value: 'video', label: 'Video Call', icon: MessageSquare },
  { value: 'meeting', label: 'Schedule Meeting', icon: Calendar },
];

// Subject categories with AI suggestions
const subjectCategories: SubjectCategory[] = [
  { value: 'project-inquiry', label: 'Project Inquiry', icon: '🚀' },
  { value: 'freelance-work', label: 'Freelance Work', icon: '💼' },
  { value: 'collaboration', label: 'Collaboration', icon: '🤝' },
  { value: 'consultation', label: 'Consultation', icon: '💡' },
  { value: 'bug-report', label: 'Bug Report', icon: '🐛' },
  { value: 'feature-request', label: 'Feature Request', icon: '✨' },
  { value: 'general', label: 'General Inquiry', icon: '📧' },
];

// AI-powered message templates
const getAITemplate = (subject: string, projectInterest?: string): string => {
  const templates: Record<string, string> = {
    'project-inquiry': `Hi there! I'm interested in discussing a project with you. I've been following your work and I'm particularly impressed by your expertise in ${projectInterest || 'web development'}.

I'd love to learn more about your process and discuss how we might work together. Could you share some details about your availability and typical project timelines?

Looking forward to hearing from you!`,
    
    'freelance-work': `Hello! I'm reaching out regarding potential freelance opportunities. I have a project that requires expertise in ${projectInterest || 'your technical skills'} and I believe you'd be a great fit.

I'd appreciate if you could share your current availability and typical rates for similar projects.

Thanks for your time!`,
    
    'collaboration': `Hi! I'm excited about the possibility of collaborating with you on a project. I think our skills would complement each other well, especially in ${projectInterest || 'this area'}.

Would you be interested in discussing potential collaboration opportunities? I'd love to learn more about your approach and see if we might work together.

Best regards!`,
    
    'consultation': `Hello! I'm seeking consultation on a project and I believe your expertise would be invaluable. I'm particularly interested in your insights on ${projectInterest || 'this technical challenge'}.

Could you let me know if you offer consultation services and what your typical process looks like?

Thank you for considering!`
  };
  
  return templates[subject] || templates['general'] || '';
};

// Spam detection using AI patterns
const detectSpam = (formData: Partial<ContactFormData>): SpamCheckResult => {
  const spamIndicators = [
    { pattern: /\b(viagra|casino|loan|credit)\b/i, weight: 10 },
    { pattern: /\b(click here|buy now|limited time)\b/i, weight: 5 },
    { pattern: /\b(free money|make money fast|earn \$)\b/i, weight: 8 },
    { pattern: /\b(urgent|asap|immediate)\b/i, weight: 3 },
    { pattern: /\b(winner|congratulations|you've won)\b/i, weight: 7 },
  ];
  
  let spamScore = 0;
  const text = `${formData.name || ''} ${formData.email || ''} ${formData.subject || ''} ${formData.message || ''}`.toLowerCase();
  
  spamIndicators.forEach(({ pattern, weight }) => {
    if (pattern.test(text)) {
      spamScore += weight;
    }
  });
  
  // Check for suspicious patterns
  if (formData.message && formData.message.length < 10 && formData.message.includes('http')) spamScore += 5;
  if (formData.email && (formData.email.includes('@temp.com') || formData.email.includes('@test.com'))) spamScore += 3;
  
  return {
    isSpam: spamScore > 15,
    score: spamScore,
    confidence: Math.min(spamScore / 20, 1)
  };
};

// Language detection (simplified)
const detectLanguage = (text: string): string => {
  const languages: Record<string, RegExp> = {
    en: /^[a-zA-Z\s.,!?]+$/,
    es: /[áéíóúñü]/,
    fr: /[àâäéèêëïîôöùûüÿç]/,
    de: /[äöüß]/,
    it: /[àèéìíîòóù]/,
  };
  
  for (const [lang, pattern] of Object.entries(languages)) {
    if (pattern.test(text)) return lang;
  }
  return 'en';
};

// Auto-save to localStorage
const useAutoSave = (formData: Partial<ContactFormData>, formId: string = 'contact-form') => {
  const saveToStorage = useCallback((data: Partial<ContactFormData>) => {
    try {
      localStorage.setItem(`${formId}-draft`, JSON.stringify({
        ...data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save draft:', error);
    }
  }, [formId]);

  const loadFromStorage = useCallback((): Partial<ContactFormData> | null => {
    try {
      const saved = localStorage.getItem(`${formId}-draft`);
      if (saved) {
        const data = JSON.parse(saved);
        // Only load if draft is less than 24 hours old
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          return data;
        }
      }
    } catch (error) {
      console.warn('Failed to load draft:', error);
    }
    return null;
  }, [formId]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`${formId}-draft`);
    } catch (error) {
      console.warn('Failed to clear draft:', error);
    }
  }, [formId]);

  return { saveToStorage, loadFromStorage, clearDraft };
};

// Main component
export const SmartContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formProgress, setFormProgress] = useState<number>(0);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions>({});
  const [spamCheck, setSpamCheck] = useState<SpamCheckResult | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('en');
  const [showTranslationOffer, setShowTranslationOffer] = useState<boolean>(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
    reset,
    trigger
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      projectInterest: '',
      budgetRange: '',
      timeline: '',
      preferredContact: 'email',
      honeypot: '',
      recaptchaToken: '',
    }
  });

  const watchedValues = watch();
  const { saveToStorage, loadFromStorage, clearDraft } = useAutoSave(watchedValues);

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = loadFromStorage();
    if (savedDraft) {
      Object.keys(savedDraft).forEach(key => {
        if (key !== 'timestamp') {
          setValue(key as keyof ContactFormData, savedDraft[key as keyof ContactFormData] || '');
        }
      });
    }
  }, [loadFromStorage, setValue]);

  // Auto-save on form changes
  useEffect(() => {
    if (isDirty) {
      const timeoutId = setTimeout(() => {
        saveToStorage(watchedValues);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedValues, isDirty, saveToStorage]);

  // Calculate form progress
  useEffect(() => {
    const filledFields = Object.values(watchedValues).filter(value => 
      value && value !== '' && value !== 'email'
    ).length;
    const totalFields = Object.keys(watchedValues).length - 2; // Exclude honeypot and recaptcha
    setFormProgress(Math.round((filledFields / totalFields) * 100));
  }, [watchedValues]);

  // Language detection
  useEffect(() => {
    if (watchedValues.message && watchedValues.message.length > 10) {
      const lang = detectLanguage(watchedValues.message);
      setDetectedLanguage(lang);
      if (lang !== 'en') {
        setShowTranslationOffer(true);
      }
    }
  }, [watchedValues.message]);

  // Spam detection
  useEffect(() => {
    if (watchedValues.message && watchedValues.message.length > 20) {
      const spamResult = detectSpam(watchedValues);
      setSpamCheck(spamResult);
    }
  }, [watchedValues]);

  // AI suggestions
  useEffect(() => {
    if (watchedValues.subject && watchedValues.projectInterest) {
      const template = getAITemplate(watchedValues.subject, watchedValues.projectInterest);
      setAiSuggestions(prev => ({
        ...prev,
        messageTemplate: template
      }));
    }
  }, [watchedValues.subject, watchedValues.projectInterest]);

  // Handle form submission
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Final spam check
      const finalSpamCheck = detectSpam(data);
      if (finalSpamCheck.isSpam) {
        throw new Error('Message flagged as potential spam');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      setSubmitStatus('success');
      clearDraft();
      reset();
      
      // Trigger success actions
      triggerSuccessActions(data);
      
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger success actions
  const triggerSuccessActions = async (data: ContactFormData) => {
    try {
      // Send to email service
      await sendEmailNotification(data);
      
      // Store in database
      await storeInDatabase(data);
      
      // Create GitHub issue if project inquiry
      if (data.projectInterest) {
        await createGitHubIssue(data);
      }
      
      // Send Slack/Discord notification
      await sendTeamNotification(data);
      
    } catch (error) {
      console.error('Success actions failed:', error);
    }
  };

  // Mock API functions
  const sendEmailNotification = async (data: ContactFormData): Promise<void> => {
    // Implementation would use SendGrid/Mailgun
    console.log('Sending email notification:', data);
  };

  const storeInDatabase = async (data: ContactFormData): Promise<void> => {
    // Implementation would store in CRM database
    console.log('Storing in database:', data);
  };

  const createGitHubIssue = async (data: ContactFormData): Promise<void> => {
    // Implementation would create GitHub issue
    console.log('Creating GitHub issue:', data);
  };

  const sendTeamNotification = async (data: ContactFormData): Promise<void> => {
    // Implementation would send Slack/Discord notification
    console.log('Sending team notification:', data);
  };

  // Apply AI suggestion
  const applyAISuggestion = (suggestionType: keyof AISuggestions) => {
    if (aiSuggestions[suggestionType]) {
      setValue('message', aiSuggestions[suggestionType] || '');
      trigger('message');
    }
  };

  // Handle meeting scheduling
  const scheduleMeeting = (): void => {
    // Implementation would integrate with Calendly or similar
    window.open('https://calendly.com/your-link', '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <Sparkles className="w-6 h-6 text-blue-400" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Smart Contact Form
          </h2>
          <Shield className="w-6 h-6 text-green-400" />
        </motion.div>
        <p className="text-gray-300 text-lg">
          AI-powered form with intelligent suggestions and spam protection
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Form Progress</span>
          <span className="text-sm text-blue-400">{formProgress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            ref={progressRef}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${formProgress}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Honeypot field */}
        <div className="hidden">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...control.register('honeypot')}
          />
        </div>

        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Full Name *
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              )}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.name.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              Email Address *
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@example.com"
                />
              )}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Subject and Project Interest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MessageSquare className="inline w-4 h-4 mr-2" />
              Subject *
            </label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a subject</option>
                  {subjectCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.subject && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.subject.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MessageSquare className="inline w-4 h-4 mr-2" />
              Project Interest
            </label>
            <Controller
              name="projectInterest"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        {/* Budget and Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <DollarSign className="inline w-4 h-4 mr-2" />
              Budget Range
            </label>
            <Controller
              name="budgetRange"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.icon} {range.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Clock className="inline w-4 h-4 mr-2" />
              Timeline
            </label>
            <Controller
              name="timeline"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select timeline</option>
                  {timelineOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MessageSquare className="inline w-4 h-4 mr-2" />
            Message *
          </label>
          
          {/* AI Suggestions */}
          {aiSuggestions.messageTemplate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">AI Suggestion</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">{aiSuggestions.messageTemplate}</p>
              <button
                type="button"
                onClick={() => applyAISuggestion('messageTemplate')}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200"
              >
                Use This Template
              </button>
            </motion.div>
          )}

          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={6}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell me about your project or inquiry..."
              />
            )}
          />
          
          {/* Language detection and translation offer */}
          {showTranslationOffer && detectedLanguage !== 'en' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">
                  I detected {detectedLanguage === 'es' ? 'Spanish' : detectedLanguage === 'fr' ? 'French' : detectedLanguage === 'de' ? 'German' : detectedLanguage === 'it' ? 'Italian' : 'another language'} in your message. 
                  Would you like me to respond in the same language?
                </span>
              </div>
            </motion.div>
          )}

          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.message.message}
            </motion.p>
          )}
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Phone className="inline w-4 h-4 mr-2" />
            Preferred Contact Method
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {contactMethods.map(method => (
              <Controller
                key={method.value}
                name="preferredContact"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 p-3 bg-gray-800/30 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors duration-200">
                    <input
                      type="radio"
                      {...field}
                      value={method.value}
                      className="sr-only"
                    />
                    <method.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{method.label}</span>
                  </label>
                )}
              />
            ))}
          </div>
        </div>

        {/* Spam Detection Warning */}
        {spamCheck && spamCheck.score > 10 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg border ${
              spamCheck.isSpam 
                ? 'bg-red-900/20 border-red-500/30' 
                : 'bg-yellow-900/20 border-yellow-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${
                spamCheck.isSpam ? 'text-red-400' : 'text-yellow-400'
              }`} />
              <span className={`text-sm font-medium ${
                spamCheck.isSpam ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {spamCheck.isSpam 
                  ? 'Message flagged as potential spam' 
                  : 'Message has some suspicious elements'
                }
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Spam score: {spamCheck.score}/20 (Confidence: {Math.round(spamCheck.confidence * 100)}%)
            </p>
          </motion.div>
        )}

        {/* Meeting Scheduler */}
        {watchedValues.preferredContact === 'meeting' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Schedule a Meeting</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              Let's find a time that works for both of us. Click below to view my calendar and schedule a meeting.
            </p>
            <button
              type="button"
              onClick={scheduleMeeting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors duration-200"
            >
              View Calendar
            </button>
          </motion.div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Save className="w-4 h-4" />
            <span>Draft auto-saved</span>
          </div>
          
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-sm ${
              submitStatus === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {submitStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                {submitStatus === 'success'
                  ? 'Message sent successfully!'
                  : 'Failed to send message. Please try again.'
                }
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartContactForm;
