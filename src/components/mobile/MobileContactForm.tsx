import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  Mail, 
  MessageSquare, 
  Phone, 
  Building, 
  Globe,
  Check,
  AlertCircle,
  X,
  Camera,
  Paperclip
} from 'lucide-react';
import TouchGestureHandler from './TouchGestureHandler';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: (value: string) => string | null;
  icon?: React.ReactNode;
}

interface MobileContactFormProps {
  fields?: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  className?: string;
  title?: string;
  subtitle?: string;
  submitText?: string;
  showProgress?: boolean;
  allowAttachments?: boolean;
  maxAttachments?: number;
  maxFileSize?: number; // in MB
}

interface FormData {
  [key: string]: string | File[];
}

interface ValidationErrors {
  [key: string]: string;
}

const defaultFields: FormField[] = [
  {
    id: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your full name',
    icon: <User size={20} />,
    validation: (value) => {
      if (value.length < 2) return 'Name must be at least 2 characters';
      return null;
    }
  },
  {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'Enter your email address',
    icon: <Mail size={20} />,
    validation: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      return null;
    }
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Enter your phone number (optional)',
    icon: <Phone size={20} />
  },
  {
    id: 'company',
    label: 'Company',
    type: 'text',
    placeholder: 'Enter your company name (optional)',
    icon: <Building size={20} />
  },
  {
    id: 'subject',
    label: 'Subject',
    type: 'select',
    required: true,
    options: [
      'General Inquiry',
      'Project Collaboration',
      'Job Opportunity',
      'Technical Support',
      'Other'
    ],
    icon: <Globe size={20} />
  },
  {
    id: 'message',
    label: 'Message',
    type: 'textarea',
    required: true,
    placeholder: 'Tell me about your project or inquiry...',
    icon: <MessageSquare size={20} />,
    validation: (value) => {
      if (value.length < 10) return 'Message must be at least 10 characters';
      if (value.length > 1000) return 'Message must be less than 1000 characters';
      return null;
    }
  }
];

const MobileContactForm: React.FC<MobileContactFormProps> = ({
  fields = defaultFields,
  onSubmit,
  className = '',
  title = 'Get in Touch',
  subtitle = 'Let\'s discuss your project or opportunity',
  submitText = 'Send Message',
  showProgress = true,
  allowAttachments = true,
  maxAttachments = 3,
  maxFileSize = 5
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate form progress
  const requiredFields = fields.filter(field => field.required);
  const completedRequiredFields = requiredFields.filter(field => {
    const value = formData[field.id] as string;
    return value && value.trim() !== '';
  });
  const progress = (completedRequiredFields.length / requiredFields.length) * 100;

  // Handle input change
  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Handle field focus
  const handleFieldFocus = (fieldId: string) => {
    setFocusedField(fieldId);
  };

  // Handle field blur
  const handleFieldBlur = (fieldId: string) => {
    setFocusedField(null);
    setTouchedFields(prev => new Set([...prev, fieldId]));
    
    // Validate field on blur
    validateField(fieldId);
  };

  // Validate individual field
  const validateField = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    
    const value = (formData[fieldId] as string) || '';
    let error: string | null = null;
    
    // Required field validation
    if (field.required && !value.trim()) {
      error = `${field.label} is required`;
    }
    // Custom validation
    else if (field.validation && value.trim()) {
      error = field.validation(value);
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [fieldId]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    fields.forEach(field => {
      const value = (formData[field.id] as string) || '';
      
      if (field.required && !value.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (field.validation && value.trim()) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file attachment
  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file size and count
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        return false;
      }
      return true;
    });
    
    const totalFiles = attachments.length + validFiles.length;
    if (totalFiles > maxAttachments) {
      alert(`Maximum ${maxAttachments} files allowed.`);
      return;
    }
    
    setAttachments(prev => [...prev, ...validFiles]);
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const submitData = {
        ...formData,
        attachments
      };
      
      await onSubmit(submitData);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({});
        setAttachments([]);
        setTouchedFields(new Set());
        setSubmitStatus('idle');
      }, 2000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle swipe gestures for multi-step forms
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (fields.length <= 3) return; // Only use steps for longer forms
    
    const stepsCount = Math.ceil(fields.length / 3);
    
    if (direction === 'left' && currentStep < stepsCount - 1) {
      setCurrentStep(currentStep + 1);
    } else if (direction === 'right' && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get fields for current step
  const getCurrentStepFields = () => {
    if (fields.length <= 3) return fields;
    
    const fieldsPerStep = 3;
    const startIndex = currentStep * fieldsPerStep;
    const endIndex = startIndex + fieldsPerStep;
    return fields.slice(startIndex, endIndex);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <TouchGestureHandler
      onSwipe={handleSwipe}
      className={`mobile-contact-form ${className}`}
    >
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <h2 className="form-title">{title}</h2>
          {subtitle && (
            <p className="form-subtitle">{subtitle}</p>
          )}
          
          {/* Progress Bar */}
          {showProgress && (
            <div className="progress-container">
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="progress-text">
                {Math.round(progress)}% complete
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="form-step"
            >
              {getCurrentStepFields().map((field, index) => (
                <div
                  key={field.id}
                  className={`form-field ${
                    errors[field.id] ? 'error' : ''
                  } ${
                    focusedField === field.id ? 'focused' : ''
                  } ${
                    touchedFields.has(field.id) && !errors[field.id] && formData[field.id] ? 'valid' : ''
                  }`}
                >
                  <label htmlFor={field.id} className="field-label">
                    {field.icon && (
                      <span className="field-icon">{field.icon}</span>
                    )}
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.id}
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      onFocus={() => handleFieldFocus(field.id)}
                      onBlur={() => handleFieldBlur(field.id)}
                      placeholder={field.placeholder}
                      className="field-input textarea"
                      rows={4}
                      maxLength={1000}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.id}
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      onFocus={() => handleFieldFocus(field.id)}
                      onBlur={() => handleFieldBlur(field.id)}
                      className="field-input select"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      onFocus={() => handleFieldFocus(field.id)}
                      onBlur={() => handleFieldBlur(field.id)}
                      placeholder={field.placeholder}
                      className="field-input"
                      autoComplete={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'off'}
                    />
                  )}
                  
                  {/* Field Status Icon */}
                  <div className="field-status">
                    {errors[field.id] && (
                      <AlertCircle size={20} className="error-icon" />
                    )}
                    {touchedFields.has(field.id) && !errors[field.id] && formData[field.id] && (
                      <Check size={20} className="success-icon" />
                    )}
                  </div>
                  
                  {/* Error Message */}
                  <AnimatePresence>
                    {errors[field.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="error-message"
                      >
                        {errors[field.id]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* File Attachments */}
          {allowAttachments && (
            <div className="attachments-section">
              <div className="attachments-header">
                <h4>Attachments (Optional)</h4>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="attach-btn"
                  disabled={attachments.length >= maxAttachments}
                >
                  <Paperclip size={16} />
                  Add File
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileAttachment}
                className="file-input"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
              
              {/* Attachment List */}
              <AnimatePresence>
                {attachments.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="attachment-item"
                  >
                    <div className="attachment-info">
                      <span className="attachment-name">{file.name}</span>
                      <span className="attachment-size">{formatFileSize(file.size)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="remove-attachment"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className={`submit-btn ${
              submitStatus === 'success' ? 'success' : submitStatus === 'error' ? 'error' : ''
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="submit-content"
                >
                  <div className="loading-spinner" />
                  Sending...
                </motion.div>
              ) : submitStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="submit-content"
                >
                  <Check size={20} />
                  Message Sent!
                </motion.div>
              ) : submitStatus === 'error' ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="submit-content"
                >
                  <AlertCircle size={20} />
                  Try Again
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="submit-content"
                >
                  <Send size={20} />
                  {submitText}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </div>

      {/* Styles */}
      <style>{`
        .mobile-contact-form {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 16px;
        }
        
        .form-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .form-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .form-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0 0 8px 0;
        }
        
        .form-subtitle {
          font-size: 1rem;
          color: var(--text-secondary, #6b7280);
          margin: 0 0 16px 0;
        }
        
        .progress-container {
          margin-top: 16px;
        }
        
        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-color, #3b82f6), #10b981);
          border-radius: 2px;
        }
        
        .progress-text {
          font-size: 0.875rem;
          color: var(--text-secondary, #6b7280);
        }
        
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-step {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-field {
          position: relative;
        }
        
        .field-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary, #1f2937);
          margin-bottom: 8px;
        }
        
        .field-icon {
          color: var(--text-secondary, #6b7280);
        }
        
        .required {
          color: #ef4444;
        }
        
        .field-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          color: var(--text-primary, #1f2937);
          font-size: 1rem;
          transition: all 0.2s ease;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }
        
        .field-input:focus {
          border-color: var(--accent-color, #3b82f6);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .field-input.textarea {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }
        
        .field-input.select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
          padding-right: 40px;
        }
        
        .form-field.error .field-input {
          border-color: #ef4444;
          background: rgba(254, 242, 242, 0.8);
        }
        
        .form-field.valid .field-input {
          border-color: #10b981;
          background: rgba(240, 253, 244, 0.8);
        }
        
        .field-status {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        
        .error-icon {
          color: #ef4444;
        }
        
        .success-icon {
          color: #10b981;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 4px;
          padding-left: 4px;
        }
        
        .attachments-section {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          padding-top: 20px;
        }
        
        .attachments-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .attachments-header h4 {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-primary, #1f2937);
          margin: 0;
        }
        
        .attach-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.8);
          color: var(--text-primary, #1f2937);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .attach-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.95);
          border-color: var(--accent-color, #3b82f6);
        }
        
        .attach-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .file-input {
          display: none;
        }
        
        .attachment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        
        .attachment-info {
          flex: 1;
          min-width: 0;
        }
        
        .attachment-name {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary, #1f2937);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .attachment-size {
          display: block;
          font-size: 0.75rem;
          color: var(--text-secondary, #6b7280);
        }
        
        .remove-attachment {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .remove-attachment:hover {
          background: rgba(239, 68, 68, 0.1);
        }
        
        .submit-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: var(--accent-color, #3b82f6);
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: var(--accent-color-dark, #2563eb);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .submit-btn.success {
          background: #10b981;
        }
        
        .submit-btn.error {
          background: #ef4444;
        }
        
        .submit-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Mobile optimizations */
        @media (max-width: 480px) {
          .mobile-contact-form {
            padding: 12px;
          }
          
          .form-container {
            padding: 20px;
          }
          
          .form-title {
            font-size: 1.5rem;
          }
          
          .field-input {
            padding: 12px 14px;
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }
        
        /* Touch device optimizations */
        @media (pointer: coarse) {
          .field-input,
          .attach-btn,
          .submit-btn {
            min-height: 44px;
          }
          
          .remove-attachment {
            min-width: 44px;
            min-height: 44px;
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .field-input,
          .submit-btn,
          .loading-spinner {
            transition: none;
            animation: none;
          }
        }
        
        /* High contrast mode */
        @media (forced-colors: active) {
          .form-container {
            background: Canvas;
            border: 1px solid CanvasText;
          }
          
          .field-input {
            background: Field;
            border: 1px solid FieldText;
            color: FieldText;
          }
          
          .submit-btn {
            background: ButtonFace;
            color: ButtonText;
            border: 1px solid ButtonText;
          }
        }
      `}</style>
    </TouchGestureHandler>
  );
};

export default MobileContactForm;
export type { MobileContactFormProps, FormField };