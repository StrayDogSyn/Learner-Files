import React, { useState, useEffect } from 'react';
import { ChevronUp, Download, Mail, Menu, X } from 'lucide-react';

interface FloatingActionButtonProps {
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const downloadResume = () => {
    // Create a temporary link to download resume
    const link = document.createElement('a');
    link.href = '/resume/resume.pdf'; // Adjust path as needed
    link.download = 'Resume_StrayDogSyndicate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const actions = [
    {
      icon: Download,
      label: 'Download Resume',
      action: downloadResume,
      color: 'text-hunter-green-400'
    },
    {
      icon: Mail,
      label: 'Contact Me',
      action: scrollToContact,
      color: 'text-metallic-400'
    },
    ...(showScrollTop ? [{
      icon: ChevronUp,
      label: 'Scroll to Top',
      action: scrollToTop,
      color: 'text-hunter-green-300'
    }] : [])
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Action Buttons */}
      <div className={`flex flex-col-reverse gap-3 mb-3 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={index}
              onClick={() => {
                action.action();
                setIsExpanded(false);
              }}
              className={`
                group relative flex items-center justify-center
                w-12 h-12 rounded-full
                bg-glass-dark backdrop-blur-md
                border border-glass-border
                ${action.color} hover:text-white
                transition-all duration-300
                hover:scale-110 hover:shadow-glow
                focus:outline-none focus:ring-2 focus:ring-hunter-green-400
              `}
              aria-label={action.label}
              title={action.label}
            >
              <IconComponent size={20} />
              
              {/* Tooltip */}
              <div className="
                absolute right-full mr-3 px-3 py-2
                bg-glass-dark backdrop-blur-md
                border border-glass-border rounded-lg
                text-sm text-metallic-200 whitespace-nowrap
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                pointer-events-none
              ">
                {action.label}
              </div>
              
              {/* Ripple Effect */}
              <div className="
                absolute inset-0 rounded-full
                bg-gradient-to-r from-hunter-green-400/20 to-metallic-400/20
                opacity-0 group-active:opacity-100
                transition-opacity duration-150
              " />
            </button>
          );
        })}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          group relative flex items-center justify-center
          w-14 h-14 rounded-full
          bg-gradient-to-r from-hunter-green-500 to-hunter-green-600
          text-white shadow-lg hover:shadow-glow
          transition-all duration-300
          hover:scale-110 focus:outline-none focus:ring-2 focus:ring-hunter-green-400
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
        aria-label={isExpanded ? 'Close menu' : 'Open quick actions'}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <X size={24} className="transition-transform duration-300" />
        ) : (
          <Menu size={24} className="transition-transform duration-300" />
        )}
        
        {/* Pulse Animation */}
        <div className="
          absolute inset-0 rounded-full
          bg-gradient-to-r from-hunter-green-400 to-hunter-green-500
          animate-ping opacity-20
        " />
        
        {/* Ripple Effect */}
        <div className="
          absolute inset-0 rounded-full
          bg-gradient-to-r from-white/20 to-white/10
          opacity-0 group-active:opacity-100
          transition-opacity duration-150
        " />
      </button>
    </div>
  );
};

export default FloatingActionButton;