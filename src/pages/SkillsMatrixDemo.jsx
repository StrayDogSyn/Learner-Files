/**
 * Skills Matrix Demo Page
 * Interactive demonstration of the Skills Matrix component
 */

import React from 'react';
import SkillsMatrix from './components/SkillsMatrix';

const SkillsMatrixDemo = () => {
  return (
    <div className="skills-matrix-demo">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Skills Matrix Demo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="#features" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Features
              </a>
              <a 
                href="#matrix" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Matrix
              </a>
              <a 
                href="#docs" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Interactive Skills Matrix
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive, interactive visualization component for showcasing technical skills,
            experience levels, and project applications with advanced filtering and comparison features.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="#matrix"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Live Demo
            </a>
            <a 
              href="#features"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors font-medium"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create an engaging and informative skills presentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Hover Effects</h3>
              <p className="text-gray-600">
                Detailed skill information appears on hover, including descriptions, projects, and certifications.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Animated Progress Bars</h3>
              <p className="text-gray-600">
                Beautiful animated progress bars that fill on scroll into view, showing proficiency levels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Filtering</h3>
              <p className="text-gray-600">
                Filter skills by category (Frontend, Backend, AI/ML, Tools) with smooth transitions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">↕️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Sorting</h3>
              <p className="text-gray-600">
                Sort by proficiency level, name, or experience with ascending/descending options.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Skill Comparison</h3>
              <p className="text-gray-600">
                Compare up to 3 skills side-by-side in a detailed comparison table.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Export Functionality</h3>
              <p className="text-gray-600">
                Export skills matrix as PNG image or structured JSON data for further use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Matrix Component */}
      <section id="matrix" className="bg-gray-100">
        <SkillsMatrix />
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Use</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with the Skills Matrix component in your project
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Usage Instructions */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Usage Instructions</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">1. Category Filtering</h4>
                  <p className="text-gray-600">
                    Use the category dropdown to filter skills by Frontend, Backend, AI/ML, or Tools.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">2. Sorting Options</h4>
                  <p className="text-gray-600">
                    Sort skills by proficiency level, name, or experience. Toggle between ascending and descending order.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">3. Skill Comparison</h4>
                  <p className="text-gray-600">
                    Enable compare mode and click on skills to compare up to 3 skills in a detailed table.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">4. Export Data</h4>
                  <p className="text-gray-600">
                    Export your skills matrix as a PNG image or JSON data using the export dropdown.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Technical Details</h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Component Features:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    React hooks for state management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Intersection Observer for scroll animations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    CSS transitions and transforms
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Responsive grid layout
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Tailwind CSS styling
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Accessible keyboard navigation
                  </li>
                </ul>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Data Structure:</h4>
                <pre className="text-sm text-gray-700 overflow-x-auto">
{`{
  name: 'React',
  level: 90,
  experience: '3 years',
  projects: ['Portfolio', 'Dashboard'],
  description: 'Component-based UI...',
  certifications: ['React Developer'],
  color: '#61DAFB'
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Implement?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            The Skills Matrix component is ready to integrate into your portfolio or project.
            Customize the skills data and styling to match your needs.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Download Component
            </button>
            <button className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              View Source Code
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SkillsMatrixDemo;
