'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { cn } from '@/lib/utils';

interface NavigationItem {
  href: string;
  label: string;
  external?: boolean;
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/chat', label: 'AI Chat' },
  { href: '/contact', label: 'Contact' },
];

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'glass-card border-b border-white/10 backdrop-blur-xl' 
          : 'bg-transparent'
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
              onClick={closeMobileMenu}
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 glass-card rounded-lg flex items-center justify-center border border-blue-500/30 group-hover:border-blue-400/50 transition-all duration-300">
                <Typography 
                  variant="h6" 
                  className="text-blue-400 font-bold text-sm lg:text-base"
                >
                  P
                </Typography>
              </div>
              <Typography 
                variant="h6" 
                className="font-bold text-white group-hover:text-blue-400 transition-colors duration-300 hidden sm:block"
              >
                Portfolio
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group',
                      isActive
                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent rounded-lg" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button variant="accent" size="sm">
                Let&apos;s Connect
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={cn(
                  'block w-5 h-0.5 bg-white transition-all duration-300',
                  isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                )} />
                <span className={cn(
                  'block w-5 h-0.5 bg-white transition-all duration-300',
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                )} />
                <span className={cn(
                  'block w-5 h-0.5 bg-white transition-all duration-300',
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                )} />
              </div>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={closeMobileMenu}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Menu */}
      <div className={cn(
        'fixed top-16 left-0 right-0 z-50 lg:hidden transition-all duration-300 transform',
        isMobileMenuOpen 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0 pointer-events-none'
      )}>
        <div className="glass-card border-b border-white/10 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'px-4 py-3 rounded-lg text-base font-medium transition-all duration-300',
                      isActive
                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-white/10">
                <Button 
                  variant="accent" 
                  className="w-full"
                  onClick={closeMobileMenu}
                >
                  Let&apos;s Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;