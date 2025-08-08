'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ContactWizard, ContactFormData } from '@/components/organisms/ContactWizard';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Glass } from '@/components/atoms/Glass';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Calendar,
  Linkedin,
  Github,
  Twitter,
  ExternalLink
} from 'lucide-react';

const ContactInfo: React.FC = () => {
  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@yourportfolio.com',
      href: 'mailto:hello@yourportfolio.com',
      description: 'Best for detailed project discussions'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      description: 'Available Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+1 (555) 123-4567',
      href: 'https://wa.me/15551234567',
      description: 'Quick questions and updates'
    },
    {
      icon: Calendar,
      label: 'Schedule Call',
      value: 'Book a meeting',
      href: 'https://calendly.com/yourname',
      description: '30-min consultation call'
    }
  ];
  
  const socialLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/yourprofile',
      color: 'text-blue-400'
    },
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/yourusername',
      color: 'text-gray-400'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://twitter.com/yourusername',
      color: 'text-blue-400'
    }
  ];
  
  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div>
        <Typography variant="h4" className="text-white font-bold mb-6">
          Get In Touch
        </Typography>
        
        <div className="space-y-4">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            
            return (
              <motion.a
                key={method.label}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="block"
              >
                <Glass variant="card" interactive className="p-4 group hover-glow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-blue-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Typography variant="h6" className="text-white font-medium">
                          {method.label}
                        </Typography>
                        <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-blue-400 transition-colors duration-300" />
                      </div>
                      <Typography variant="body" className="text-blue-400 font-medium">
                        {method.value}
                      </Typography>
                      <Typography variant="caption" className="text-white/60">
                        {method.description}
                      </Typography>
                    </div>
                  </div>
                </Glass>
              </motion.a>
            );
          })}
        </div>
      </div>
      
      {/* Location & Availability */}
      <div>
        <Typography variant="h5" className="text-white font-bold mb-4">
          Location & Availability
        </Typography>
        
        <Glass variant="card" className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <Typography variant="body" className="text-white font-medium">
                  San Francisco, CA
                </Typography>
                <Typography variant="bodySmall" className="text-white/60">
                  Available for remote work worldwide
                </Typography>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <Typography variant="body" className="text-white font-medium">
                  PST (UTC-8)
                </Typography>
                <Typography variant="bodySmall" className="text-white/60">
                  Typically respond within 24 hours
                </Typography>
              </div>
            </div>
          </div>
        </Glass>
      </div>
      
      {/* Social Links */}
      <div>
        <Typography variant="h5" className="text-white font-bold mb-4">
          Connect With Me
        </Typography>
        
        <div className="flex gap-4">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            
            return (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Glass variant="button" className="w-12 h-12 flex items-center justify-center group">
                  <IconComponent className={`w-5 h-5 ${social.color} group-hover:scale-110 transition-transform duration-300`} />
                </Glass>
              </motion.a>
            );
          })}
        </div>
      </div>
      
      {/* FAQ */}
      <div>
        <Typography variant="h5" className="text-white font-bold mb-4">
          Frequently Asked Questions
        </Typography>
        
        <Glass variant="card" className="p-6">
          <div className="space-y-4">
            <div>
              <Typography variant="body" className="text-white font-medium mb-1">
                What&apos;s your typical response time?
              </Typography>
              <Typography variant="bodySmall" className="text-white/70">
                I aim to respond to all inquiries within 24 hours, often much sooner during business hours.
              </Typography>
            </div>
            
            <div>
              <Typography variant="body" className="text-white font-medium mb-1">
                Do you work with international clients?
              </Typography>
              <Typography variant="bodySmall" className="text-white/70">
                Absolutely! I work with clients worldwide and am flexible with time zones for meetings and communication.
              </Typography>
            </div>
            
            <div>
              <Typography variant="body" className="text-white font-medium mb-1">
                What information should I include in my project inquiry?
              </Typography>
              <Typography variant="bodySmall" className="text-white/70">
                The contact form will guide you through all the necessary details, but feel free to include any additional context that might be helpful.
              </Typography>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const [showWizard, setShowWizard] = useState(false);
  
  const handleFormSubmit = async (data: ContactFormData) => {
    // Form submission will be handled by the ContactWizard component
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically send the data to your backend
    // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {!showWizard ? (
            <>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <Typography variant="h1" className="text-4xl lg:text-6xl font-bold mb-4">
                  Let&apos;s Work <span className="gradient-text">Together</span>
                </Typography>
                
                <Typography variant="h5" className="text-white/70 max-w-2xl mx-auto mb-8">
                  Ready to bring your project to life? I&apos;d love to hear about your ideas and discuss how we can create something amazing together.
                </Typography>
                
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => setShowWizard(true)}
                  className="group"
                >
                  Start Project Request
                  <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
              
              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <ContactInfo />
                </motion.div>
                
                {/* Quick Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Glass variant="card" className="p-8">
                    <Typography variant="h4" className="text-white font-bold mb-6">
                      Quick Message
                    </Typography>
                    
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors duration-300"
                      />
                      
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors duration-300"
                      />
                      
                      <textarea
                        rows={4}
                        placeholder="Your Message"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors duration-300 resize-none"
                      />
                      
                      <Button variant="accent" className="w-full">
                        Send Message
                      </Button>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <Typography variant="bodySmall" className="text-white/60 text-center">
                        For detailed project discussions, use the
                      </Typography>
                      <Button
                        variant="ghost"
                        onClick={() => setShowWizard(true)}
                        className="w-full mt-2"
                      >
                        Project Request Wizard
                      </Button>
                    </div>
                  </Glass>
                </motion.div>
              </div>
            </>
          ) : (
            <>
              {/* Wizard Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <Typography variant="h2" className="text-white font-bold mb-4">
                  Project Request <span className="gradient-text">Wizard</span>
                </Typography>
                
                <Typography variant="body" className="text-white/70 max-w-2xl mx-auto mb-6">
                  Let&apos;s gather all the details about your project to provide you with the most accurate proposal and timeline.
                </Typography>
                
                <Button
                  variant="ghost"
                  onClick={() => setShowWizard(false)}
                  className="mb-8"
                >
                  ← Back to Contact Page
                </Button>
              </motion.div>
              
              {/* Contact Wizard */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <ContactWizard
                  onSubmit={handleFormSubmit}
                  onClose={() => setShowWizard(false)}
                />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Metadata is handled in layout.tsx for client components