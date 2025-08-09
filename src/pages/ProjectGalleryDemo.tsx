import React from 'react';
import ProjectGallery from '../components/ProjectGallery';
import '../css/project-gallery.css';

const ProjectGalleryDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Project Showcase Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              An interactive gallery showcasing projects with advanced filtering, multiple view modes, 
              and smooth animations powered by Framer Motion.
            </p>
          </div>
        </div>
      </header>

      {/* Gallery Component */}
      <ProjectGallery className="pt-8" />

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Gallery Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Filtering</h3>
              <p className="text-gray-600">
                Filter by category, search by name, description, or technologies
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Views</h3>
              <p className="text-gray-600">
                Grid, list, carousel, and timeline view modes
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smooth Animations</h3>
              <p className="text-gray-600">
                Framer Motion powered animations and transitions
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Responsive Design</h3>
              <p className="text-gray-600">
                Optimized for all devices and screen sizes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            How to Use
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Filtering & Search</h3>
              <p className="text-gray-600 mb-3">
                Use the filter buttons to view projects by category (Games, Tools, Educational) or use the search bar to find specific projects by name, description, or technology.
              </p>
              <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono">
                Filter by: All Projects | Games | Tools | Educational
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. View Modes</h3>
              <p className="text-gray-600 mb-3">
                Switch between different view modes using the toggle buttons in the top right:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-blue-100 p-3 rounded-lg text-center">
                  <div className="text-lg mb-1">⊞</div>
                  <div className="text-sm font-medium">Grid</div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <div className="text-lg mb-1">☰</div>
                  <div className="text-sm font-medium">List</div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <div className="text-lg mb-1">⊞</div>
                  <div className="text-sm font-medium">Carousel</div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <div className="text-lg mb-1">⏰</div>
                  <div className="text-sm font-medium">Timeline</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Sorting Options</h3>
              <p className="text-gray-600 mb-3">
                Sort projects by popularity, recent updates, alphabetical order, or custom arrangement:
              </p>
              <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono">
                Sort by: Most Popular | Recently Updated | Alphabetical | Custom Order
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Project Interactions</h3>
              <p className="text-gray-600 mb-3">
                Hover over project cards to see quick actions, click "Quick Play" to open live demos, or "View Details" for more information.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                💡 <strong>Tip:</strong> Use the Quick Play button to instantly test projects in a new tab
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Advanced Project Showcase Gallery</h3>
          <p className="text-gray-400 mb-6">
            Built with React, TypeScript, Framer Motion, and Tailwind CSS
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <span>✨ Interactive Filtering</span>
            <span>🎭 Multiple View Modes</span>
            <span>🚀 Smooth Animations</span>
            <span>📱 Responsive Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectGalleryDemo;
