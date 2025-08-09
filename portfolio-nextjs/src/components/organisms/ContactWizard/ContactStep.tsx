'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Glass } from '@/components/atoms/Glass';
import {
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
  DollarSign,
  Clock,
  Target,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export interface ContactFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  
  // Project Details
  projectType: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  goals: string[];
  
  // Additional Information
  additionalInfo: string;
  preferredContact: string;
  urgency: string;
  
  // Files
  attachments: File[];
}

export interface ContactStepProps {
  formData: ContactFormData;
  updateFormData: (data: Partial<ContactFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isValid: boolean;
}

const InputField: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon,
  multiline = false,
  rows = 3
}) => {
  const InputComponent = multiline ? 'textarea' : 'input';
  
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-white font-medium">
        {icon && <span className="text-blue-400">{icon}</span>}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      
      <div className="relative">
        <InputComponent
          type={multiline ? undefined : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={multiline ? rows : undefined}
          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
            error
              ? 'border-red-400 focus:ring-red-400/50'
              : 'border-white/20 focus:border-blue-400 focus:ring-blue-400/50'
          }`}
        />
        
        {error && (
          <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-400 text-sm">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
}> = ({ label, value, onChange, options, required = false, error, icon }) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-white font-medium">
        {icon && <span className="text-blue-400">{icon}</span>}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
            error
              ? 'border-red-400 focus:ring-red-400/50'
              : 'border-white/20 focus:border-blue-400 focus:ring-blue-400/50'
          }`}
        >
          <option value="" className="bg-slate-800">Select an option...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-800">
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-400 text-sm">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

const CheckboxGroup: React.FC<{
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  icon?: React.ReactNode;
}> = ({ label, options, selectedValues, onChange, icon }) => {
  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };
  
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-white font-medium">
        {icon && <span className="text-blue-400">{icon}</span>}
        {label}
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors duration-300"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="w-4 h-4 text-blue-400 bg-transparent border-2 border-white/30 rounded focus:ring-blue-400 focus:ring-2"
            />
            <span className="text-white/80">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Step 1: Personal Information
export const PersonalInfoStep: React.FC<ContactStepProps> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  isValid
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Typography variant="h3" className="text-white font-bold mb-2">
          Let&apos;s Get Started
        </Typography>
        <Typography variant="body" className="text-white/70">
          Tell us a bit about yourself and your company
        </Typography>
      </div>
      
      <Glass config="card" className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="First Name"
            value={formData.firstName}
            onChange={(value) => updateFormData({ firstName: value })}
            placeholder="John"
            required
            error={errors.firstName}
            icon={<User className="w-4 h-4" />}
          />
          
          <InputField
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => updateFormData({ lastName: value })}
            placeholder="Doe"
            required
            error={errors.lastName}
            icon={<User className="w-4 h-4" />}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => updateFormData({ email: value })}
            placeholder="john@company.com"
            required
            error={errors.email}
            icon={<Mail className="w-4 h-4" />}
          />
          
          <InputField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => updateFormData({ phone: value })}
            placeholder="+1 (555) 123-4567"
            error={errors.phone}
            icon={<Phone className="w-4 h-4" />}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Company"
            value={formData.company}
            onChange={(value) => updateFormData({ company: value })}
            placeholder="Acme Inc."
            error={errors.company}
            icon={<Building className="w-4 h-4" />}
          />
          
          <InputField
            label="Position"
            value={formData.position}
            onChange={(value) => updateFormData({ position: value })}
            placeholder="CEO, CTO, Product Manager"
            error={errors.position}
            icon={<User className="w-4 h-4" />}
          />
        </div>
      </Glass>
      
      <div className="flex justify-end">
        <Button
          variant="accent"
          onClick={onNext}
          disabled={!isValid}
          className="px-8"
        >
          Next Step
        </Button>
      </div>
    </motion.div>
  );
};

// Step 2: Project Details
export const ProjectDetailsStep: React.FC<ContactStepProps> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrevious,
  isValid
}) => {
  const projectTypes = [
    { value: 'website', label: 'Website Development' },
    { value: 'webapp', label: 'Web Application' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'ecommerce', label: 'E-commerce Platform' },
    { value: 'api', label: 'API Development' },
    { value: 'consulting', label: 'Technical Consulting' },
    { value: 'other', label: 'Other' }
  ];
  
  const budgetRanges = [
    { value: 'under-5k', label: 'Under $5,000' },
    { value: '5k-15k', label: '$5,000 - $15,000' },
    { value: '15k-50k', label: '$15,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: 'over-100k', label: 'Over $100,000' },
    { value: 'discuss', label: 'Let&apos;s Discuss' }
  ];
  
  const timelines = [
    { value: 'asap', label: 'ASAP' },
    { value: '1-month', label: 'Within 1 Month' },
    { value: '2-3-months', label: '2-3 Months' },
    { value: '3-6-months', label: '3-6 Months' },
    { value: '6-months-plus', label: '6+ Months' },
    { value: 'flexible', label: 'Flexible' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Typography variant="h3" className="text-white font-bold mb-2">
          Project Details
        </Typography>
        <Typography variant="body" className="text-white/70">
          Help us understand your project requirements
        </Typography>
      </div>
      
      <Glass config="card" className="p-6 space-y-6">
        <SelectField
          label="Project Type"
          value={formData.projectType}
          onChange={(value) => updateFormData({ projectType: value })}
          options={projectTypes}
          required
          error={errors.projectType}
          icon={<Target className="w-4 h-4" />}
        />
        
        <InputField
          label="Project Description"
          value={formData.projectDescription}
          onChange={(value) => updateFormData({ projectDescription: value })}
          placeholder="Describe your project, goals, and any specific requirements..."
          required
          error={errors.projectDescription}
          icon={<MessageSquare className="w-4 h-4" />}
          multiline
          rows={4}
        />
        
        <div className="grid md:grid-cols-2 gap-6">
          <SelectField
            label="Budget Range"
            value={formData.budget}
            onChange={(value) => updateFormData({ budget: value })}
            options={budgetRanges}
            required
            error={errors.budget}
            icon={<DollarSign className="w-4 h-4" />}
          />
          
          <SelectField
            label="Timeline"
            value={formData.timeline}
            onChange={(value) => updateFormData({ timeline: value })}
            options={timelines}
            required
            error={errors.timeline}
            icon={<Clock className="w-4 h-4" />}
          />
        </div>
      </Glass>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          variant="accent"
          onClick={onNext}
          disabled={!isValid}
          className="px-8"
        >
          Next Step
        </Button>
      </div>
    </motion.div>
  );
};

// Step 3: Goals & Requirements
export const GoalsStep: React.FC<ContactStepProps> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrevious,
  isValid
}) => {
  const goalOptions = [
    { value: 'increase-sales', label: 'Increase Sales & Revenue' },
    { value: 'improve-efficiency', label: 'Improve Business Efficiency' },
    { value: 'enhance-ux', label: 'Enhance User Experience' },
    { value: 'modernize-tech', label: 'Modernize Technology Stack' },
    { value: 'scale-business', label: 'Scale Business Operations' },
    { value: 'reduce-costs', label: 'Reduce Operational Costs' },
    { value: 'improve-security', label: 'Improve Security & Compliance' },
    { value: 'mobile-presence', label: 'Establish Mobile Presence' }
  ];
  
  const contactPreferences = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'video', label: 'Video Call' },
    { value: 'meeting', label: 'In-Person Meeting' }
  ];
  
  const urgencyLevels = [
    { value: 'low', label: 'Low - Just exploring options' },
    { value: 'medium', label: 'Medium - Planning for next quarter' },
    { value: 'high', label: 'High - Need to start soon' },
    { value: 'urgent', label: 'Urgent - Need immediate assistance' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Typography variant="h3" className="text-white font-bold mb-2">
          Goals & Requirements
        </Typography>
        <Typography variant="body" className="text-white/70">
          What are you hoping to achieve with this project?
        </Typography>
      </div>
      
      <Glass config="card" className="p-6 space-y-6">
        <CheckboxGroup
          label="Project Goals"
          options={goalOptions}
          selectedValues={formData.goals}
          onChange={(values) => updateFormData({ goals: values })}
          icon={<Target className="w-4 h-4" />}
        />
        
        <InputField
          label="Additional Information"
          value={formData.additionalInfo}
          onChange={(value) => updateFormData({ additionalInfo: value })}
          placeholder="Any additional details, specific requirements, or questions you'd like to share..."
          icon={<FileText className="w-4 h-4" />}
          multiline
          rows={4}
        />
        
        <div className="grid md:grid-cols-2 gap-6">
          <SelectField
            label="Preferred Contact Method"
            value={formData.preferredContact}
            onChange={(value) => updateFormData({ preferredContact: value })}
            options={contactPreferences}
            required
            error={errors.preferredContact}
            icon={<MessageSquare className="w-4 h-4" />}
          />
          
          <SelectField
            label="Project Urgency"
            value={formData.urgency}
            onChange={(value) => updateFormData({ urgency: value })}
            options={urgencyLevels}
            required
            error={errors.urgency}
            icon={<Clock className="w-4 h-4" />}
          />
        </div>
      </Glass>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          variant="accent"
          onClick={onNext}
          disabled={!isValid}
          className="px-8"
        >
          Review & Submit
        </Button>
      </div>
    </motion.div>
  );
};

// Step 4: Review & Submit
export const ReviewStep: React.FC<ContactStepProps> = ({
  formData,
  onPrevious,
  isValid
}) => {
  const handleSubmit = async () => {
    // Form submission logic will be implemented here
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Typography variant="h3" className="text-white font-bold mb-2">
          Review Your Information
        </Typography>
        <Typography variant="body" className="text-white/70">
          Please review your details before submitting
        </Typography>
      </div>
      
      <div className="space-y-6">
        {/* Personal Information */}
        <Glass config="card" className="p-6">
          <Typography variant="h5" className="text-white font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Personal Information
          </Typography>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/60">Name:</span>
              <span className="text-white ml-2">{formData.firstName} {formData.lastName}</span>
            </div>
            <div>
              <span className="text-white/60">Email:</span>
              <span className="text-white ml-2">{formData.email}</span>
            </div>
            {formData.phone && (
              <div>
                <span className="text-white/60">Phone:</span>
                <span className="text-white ml-2">{formData.phone}</span>
              </div>
            )}
            {formData.company && (
              <div>
                <span className="text-white/60">Company:</span>
                <span className="text-white ml-2">{formData.company}</span>
              </div>
            )}
          </div>
        </Glass>
        
        {/* Project Details */}
        <Glass config="card" className="p-6">
          <Typography variant="h5" className="text-white font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Project Details
          </Typography>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-white/60">Project Type:</span>
              <span className="text-white ml-2">{formData.projectType}</span>
            </div>
            <div>
              <span className="text-white/60">Budget:</span>
              <span className="text-white ml-2">{formData.budget}</span>
            </div>
            <div>
              <span className="text-white/60">Timeline:</span>
              <span className="text-white ml-2">{formData.timeline}</span>
            </div>
            <div>
              <span className="text-white/60">Description:</span>
              <p className="text-white mt-1">{formData.projectDescription}</p>
            </div>
          </div>
        </Glass>
        
        {/* Goals & Additional Info */}
        {(formData.goals.length > 0 || formData.additionalInfo) && (
          <Glass config="card" className="p-6">
            <Typography variant="h5" className="text-white font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              Goals & Additional Information
            </Typography>
            
            <div className="space-y-3 text-sm">
              {formData.goals.length > 0 && (
                <div>
                  <span className="text-white/60">Goals:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.goals.map((goal) => (
                      <span key={goal} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                        {goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {formData.additionalInfo && (
                <div>
                  <span className="text-white/60">Additional Information:</span>
                  <p className="text-white mt-1">{formData.additionalInfo}</p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-white/60">Preferred Contact:</span>
                  <span className="text-white ml-2">{formData.preferredContact}</span>
                </div>
                <div>
                  <span className="text-white/60">Urgency:</span>
                  <span className="text-white ml-2">{formData.urgency}</span>
                </div>
              </div>
            </div>
          </Glass>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          variant="accent"
          onClick={handleSubmit}
          disabled={!isValid}
          className="px-8"
        >
          Submit Request
        </Button>
      </div>
    </motion.div>
  );
};