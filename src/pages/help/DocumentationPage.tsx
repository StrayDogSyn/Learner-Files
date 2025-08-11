// Temporary stub for DocumentationPage
import React from 'react';
import { ArrowLeft, Code, Database, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const DocumentationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Documentation</h1>
          </div>
          
          <p className="text-gray-300 mb-8">
            Comprehensive documentation for the portfolio platform and its features.
          </p>
          
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Code className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Getting Started</h2>
              </div>
              <p className="text-gray-300 mb-4">
                Learn how to navigate and use the portfolio features effectively.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Portfolio overview and navigation</li>
                <li>• Interactive games and demos</li>
                <li>• Project showcases and case studies</li>
                <li>• Contact and networking features</li>
              </ul>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Technical Architecture</h2>
              </div>
              <p className="text-gray-300 mb-4">
                Understanding the technical stack and architecture decisions.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• React + TypeScript frontend</li>
                <li>• Vite build system and development server</li>
                <li>• Tailwind CSS for styling</li>
                <li>• GitHub Pages deployment</li>
              </ul>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">Performance & Analytics</h2>
              </div>
              <p className="text-gray-300 mb-4">
                Analytics and performance monitoring capabilities.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Real-time visitor tracking</li>
                <li>• Performance monitoring</li>
                <li>• User behavior insights</li>
                <li>• Conversion analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;