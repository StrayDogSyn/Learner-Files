// Temporary stub for FAQPage
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqItems: FAQItem[] = [
    {
      question: "How do I navigate through the portfolio?",
      answer: "Use the navigation menu at the top of the page to access different sections. The portfolio includes projects, games, analytics, and contact information."
    },
    {
      question: "What interactive features are available?",
      answer: "The portfolio includes an interactive calculator game, project showcases with live demos, and real-time analytics dashboards."
    },
    {
      question: "How does the analytics system work?",
      answer: "The analytics system tracks visitor behavior, performance metrics, and engagement patterns. Currently running in stub mode for demonstration purposes."
    },
    {
      question: "Can I download your resume or CV?",
      answer: "Yes, you can download my resume from the contact section or by clicking the download button in the header navigation."
    },
    {
      question: "How can I get in touch?",
      answer: "You can reach out through the contact form, email, or connect with me on LinkedIn and GitHub. All contact information is available in the contact section."
    },
    {
      question: "What technologies were used to build this portfolio?",
      answer: "This portfolio is built with React, TypeScript, Tailwind CSS, and Vite. It's deployed on GitHub Pages with automated CI/CD workflows."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
          </div>
          
          <p className="text-gray-300 mb-8">
            Find answers to common questions about the portfolio and its features.
          </p>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="glass-card overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">{item.question}</h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Still have questions?</h3>
            <p className="text-gray-300 mb-4">
              If you couldn't find the answer you're looking for, feel free to reach out directly.
            </p>
            <Link 
              to="/contact" 
              className="inline-block px-6 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;