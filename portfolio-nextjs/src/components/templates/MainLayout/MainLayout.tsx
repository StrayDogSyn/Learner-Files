'use client';

import React from 'react';
import { Navigation } from '@/components/organisms/Navigation/Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`min-h-screen relative ${className}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-navy" />
      <div className="fixed inset-0 bg-gradient-to-br from-navy-900/20 via-transparent to-amber-500/10" />
      
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-navy-400/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer Glass Effect */}
      <footer className="relative z-10 mt-32">
        <div className="glass-card border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-white/60">
              <p className="text-sm">
                © 2024 Portfolio. Crafted with passion and cutting-edge technology.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;