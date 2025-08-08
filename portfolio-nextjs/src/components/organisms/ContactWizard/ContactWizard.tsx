'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Glass } from '@/components/atoms/Glass';
import {
  ContactFormData,
  PersonalInfoStep,
  ProjectDetailsStep,
  GoalsStep,
  ReviewStep
} from './ContactStep';
import {
  User,
  Target,
  CheckCircle,
  FileText,
  Check
} from 'lucide-react';

interface ContactWizardProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  onClose?: () => void;
}

const initialFormData: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  projectType: '',
  projectDescription: '',
  budget: '',
  timeline: '',
  goals: [],
  additionalInfo: '',
  preferredContact: '',
  urgency: '',
  attachments: []
};

const steps = [
  {
    id: 1,
    title: 'Personal Info',
    description: 'Basic information',
    icon: User
  },
  {
    id: 2,
    title: 'Project Details',
    description: 'Project requirements',
    icon: Target
  },
  {
    id: 3,
    title: 'Goals',
    description: 'Objectives & preferences',
    icon: CheckCircle
  },
  {
    id: 4,
    title: 'Review',
    description: 'Confirm & submit',
    icon: FileText
  }
];

const StepIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/20">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        
        {/* Step Indicators */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const IconComponent = step.icon;
          
          return (
            <div key={step.id} className="relative flex flex-col items-center">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 border-transparent'
                    : isCurrent
                    ? 'bg-blue-500/20 border-blue-400'
                    : 'bg-white/10 border-white/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <IconComponent className={`w-5 h-5 ${
                    isCurrent ? 'text-blue-400' : 'text-white/60'
                  }`} />
                )}
              </motion.div>
              
              <div className="mt-3 text-center">
                <Typography
                  variant="bodySmall"
                  className={`font-medium ${
                    isCurrent ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-white/40 hidden sm:block"
                >
                  {step.description}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ContactWizard: React.FC<ContactWizardProps> = ({
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const updateFormData = useCallback((data: Partial<ContactFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(data);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        delete newErrors[field];
      });
      return newErrors;
    });
  }, []);
  
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
        
      case 2:
        if (!formData.projectType) newErrors.projectType = 'Project type is required';
        if (!formData.projectDescription.trim()) newErrors.projectDescription = 'Project description is required';
        if (!formData.budget) newErrors.budget = 'Budget range is required';
        if (!formData.timeline) newErrors.timeline = 'Timeline is required';
        break;
        
      case 3:
        if (!formData.preferredContact) newErrors.preferredContact = 'Preferred contact method is required';
        if (!formData.urgency) newErrors.urgency = 'Project urgency is required';
        break;
        
      case 4:
        // Final validation - check all required fields
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.projectType) newErrors.projectType = 'Project type is required';
        if (!formData.projectDescription.trim()) newErrors.projectDescription = 'Project description is required';
        if (!formData.budget) newErrors.budget = 'Budget range is required';
        if (!formData.timeline) newErrors.timeline = 'Timeline is required';
        if (!formData.preferredContact) newErrors.preferredContact = 'Preferred contact method is required';
        if (!formData.urgency) newErrors.urgency = 'Project urgency is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default submission logic
        // Submitting form data
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setIsSubmitted(true);
    } catch {
      // Form submission error occurred
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isStepValid = validateStep(currentStep);
  
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <Glass variant="modal" className="p-8 max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
          
          <Typography variant="h4" className="text-white font-bold mb-4">
            Thank You!
          </Typography>
          
          <Typography variant="body" className="text-white/70 mb-6">
            Your project request has been submitted successfully. I&apos;ll review your information and get back to you within 24 hours.
          </Typography>
          
          <Typography variant="bodySmall" className="text-white/60">
            Check your email for a confirmation and next steps.
          </Typography>
        </Glass>
      </motion.div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
      
      {/* Form Steps */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <PersonalInfoStep
            key="step-1"
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={true}
            isLastStep={false}
            isValid={isStepValid}
          />
        )}
        
        {currentStep === 2 && (
          <ProjectDetailsStep
            key="step-2"
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={false}
            isLastStep={false}
            isValid={isStepValid}
          />
        )}
        
        {currentStep === 3 && (
          <GoalsStep
            key="step-3"
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={false}
            isLastStep={false}
            isValid={isStepValid}
          />
        )}
        
        {currentStep === 4 && (
          <ReviewStep
            key="step-4"
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            onNext={handleSubmit}
            onPrevious={handlePrevious}
            isFirstStep={false}
            isLastStep={true}
            isValid={isStepValid}
          />
        )}
      </AnimatePresence>
      
      {/* Loading State */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <Glass variant="modal" className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <Typography variant="h6" className="text-white font-medium">
              Submitting your request...
            </Typography>
          </Glass>
        </motion.div>
      )}
      
      {/* Error Display */}
      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Glass variant="card" className="p-4 border border-red-400/30 bg-red-500/10">
            <Typography variant="bodySmall" className="text-red-400">
              {errors.submit}
            </Typography>
          </Glass>
        </motion.div>
      )}
    </div>
  );
};

export default ContactWizard;