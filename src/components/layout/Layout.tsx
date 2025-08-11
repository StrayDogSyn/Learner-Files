import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';

interface LayoutProps {
  children?: React.ReactNode;
}

/**
 * Layout Component
 * Main application layout with navigation and content area
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        {children || <Outlet />}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Learner Files. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;