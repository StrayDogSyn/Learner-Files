// Temporary stub for HelpPage
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, FileText, HelpCircle, MessageSquare } from 'lucide-react';

const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Help Center</h1>
          <p className="text-gray-300 mb-8">
            Find answers to your questions and learn how to use the portfolio features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/help/documentation" className="glass-card p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <Book className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Documentation</h3>
                  <p className="text-gray-300">Comprehensive guides and API documentation</p>
                </div>
              </div>
            </Link>
            
            <Link to="/help/tutorials" className="glass-card p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Tutorials</h3>
                  <p className="text-gray-300">Step-by-step tutorials and examples</p>
                </div>
              </div>
            </Link>
            
            <Link to="/help/faq" className="glass-card p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <HelpCircle className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">FAQ</h3>
                  <p className="text-gray-300">Frequently asked questions and answers</p>
                </div>
              </div>
            </Link>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-4">
                <MessageSquare className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Contact Support</h3>
                  <p className="text-gray-300">Get in touch for additional help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;