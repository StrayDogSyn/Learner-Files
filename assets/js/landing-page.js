/**
 * Landing Page JavaScript
 * Hunter & Cortana Portfolio v2.0
 * Page-specific functionality
 */

import { PortfolioCore } from './modules/core.js';

class LandingPage {
  constructor() {
    this.init();
  }
  
  init() {
    this.initNavigation();
    this.initBackToTop();
    this.initScrollEffects();
    this.initCTAButtons();
    this.initProjectCards();
  }
  
  /**
   * Initialize navigation functionality
   */
  initNavigation() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Update icon
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
          icon.className = navMenu.classList.contains('active') 
            ? 'fas fa-times' 
            : 'fas fa-bars';
        }
      });
    }
    
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        if (icon) {
          icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
      });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          
          const icon = mobileMenuToggle.querySelector('i');
          if (icon) {
            icon.className = 'fas fa-bars';
          }
        }
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu && 
          !navMenu.contains(e.target) && 
          !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-bars';
        }
      }
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    });
  }
  
  /**
   * Initialize back to top button
   */
  initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
      // Show/hide button based on scroll position
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      });
      
      // Smooth scroll to top when clicked
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
  
  /**
   * Initialize scroll effects
   */
  initScrollEffects() {
    // Parallax effect for hero section
    const heroContainer = document.querySelector('.hero-container');
    const particleCanvas = document.getElementById('particle-canvas');
    
    if (heroContainer && particleCanvas) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        particleCanvas.style.transform = `translateY(${rate}px)`;
      });
    }
    
    // Fade in elements on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
  
  /**
   * Initialize CTA buttons
   */
  initCTAButtons() {
    const ctaButton = document.getElementById('cta-button');
    const heroCTA = document.querySelector('[data-analytics="hero_cta_primary"]');
    const resumeButton = document.querySelector('[data-analytics="hero_cta_secondary"]');
    
    // CTA button in navbar
    if (ctaButton) {
      ctaButton.addEventListener('click', () => {
        // Scroll to projects section
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'cta_click', {
            event_category: 'engagement',
            event_label: 'navbar_cta'
          });
        }
      });
    }
    
    // Hero CTA button
    if (heroCTA) {
      heroCTA.addEventListener('click', () => {
        // Scroll to projects section
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'cta_click', {
            event_category: 'engagement',
            event_label: 'hero_cta_primary'
          });
        }
      });
    }
    
    // Resume download button
    if (resumeButton) {
      resumeButton.addEventListener('click', () => {
        // Create a temporary link to download resume
        const link = document.createElement('a');
        link.href = '/assets/documents/resume.pdf'; // Update with actual resume path
        link.download = 'Hunter_Cortana_Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'download', {
            event_category: 'engagement',
            event_label: 'resume_download'
          });
        }
      });
    }
  }
  
  /**
   * Initialize project card interactions
   */
  initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card-featured');
    
    projectCards.forEach(card => {
      // Add click tracking
      card.addEventListener('click', (e) => {
        // Don't track if clicking on buttons
        if (e.target.closest('.btn')) return;
        
        const projectTitle = card.querySelector('h3').textContent;
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'project_view', {
            event_category: 'engagement',
            event_label: projectTitle
          });
        }
      });
      
      // Add hover effects
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }
  
  /**
   * Initialize ripple effect for buttons
   */
  initRippleEffect() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.ripple');
      if (!button) return;
      
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple-effect');
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
  
  /**
   * Initialize lazy loading for images
   */
  initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  /**
   * Initialize performance monitoring
   */
  initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
            
            // Track LCP in analytics
            if (typeof gtag !== 'undefined') {
              gtag('event', 'timing_complete', {
                name: 'lcp',
                value: Math.round(entry.startTime)
              });
            }
          }
          if (entry.entryType === 'first-input') {
            console.log('FID:', entry.processingStart - entry.startTime);
            
            // Track FID in analytics
            if (typeof gtag !== 'undefined') {
              gtag('event', 'timing_complete', {
                name: 'fid',
                value: Math.round(entry.processingStart - entry.startTime)
              });
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    }
    
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: 'load',
          value: Math.round(loadTime)
        });
      }
    });
  }
  
  /**
   * Initialize keyboard shortcuts
   */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K: Focus search (if implemented)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Implement search functionality
        console.log('Search shortcut pressed');
      }
      
      // Escape: Close mobile menu
      if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          
          const icon = mobileMenuToggle.querySelector('i');
          if (icon) {
            icon.className = 'fas fa-bars';
          }
        }
      }
    });
  }
}

// Initialize landing page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core functionality
  window.portfolioCore = new PortfolioCore();
  
  // Initialize landing page specific functionality
  window.landingPage = new LandingPage();
  
  // Initialize additional features
  window.landingPage.initRippleEffect();
  window.landingPage.initLazyLoading();
  window.landingPage.initPerformanceMonitoring();
  window.landingPage.initKeyboardShortcuts();
});

export default LandingPage;
