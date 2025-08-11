import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFound Component
 * 404 error page with navigation back to home
 */
export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;