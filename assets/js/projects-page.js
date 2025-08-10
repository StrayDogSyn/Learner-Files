/**
 * Projects Page JavaScript
 * Hunter & Cortana Portfolio v2.0
 * Page-specific functionality
 */

import { PortfolioCore } from './modules/core.js';
import { ProjectGallery } from './modules/project-gallery.js';

class ProjectsPage {
  constructor() {
    this.init();
  }
  
  init() {
    this.initNavigation();
    this.initBackToTop();
    this.initStats();
    this.initCategoryCards();
    this.initScrollEffects();
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
   * Initialize and update page stats
   */
  initStats() {
    // Update stats when project gallery is loaded
    const updateStats = () => {
      if (window.projectGallery && window.projectGallery.projects) {
        const projects = window.projectGallery.projects;
        const totalProjects = projects.length;
        const featuredProjects = projects.filter(p => p.featured).length;
        const liveProjects = projects.filter(p => p.status === 'live').length;
        
        // Update DOM elements
        const totalElement = document.getElementById('total-projects');
        const featuredElement = document.getElementById('featured-projects');
        const liveElement = document.getElementById('live-projects');
        
        if (totalElement) totalElement.textContent = totalProjects;
        if (featuredElement) featuredElement.textContent = featuredProjects;
        if (liveElement) liveElement.textContent = liveProjects;
        
        // Animate numbers
        this.animateNumber(totalElement, totalProjects);
        this.animateNumber(featuredElement, featuredProjects);
        this.animateNumber(liveElement, liveProjects);
      }
    };
    
    // Wait for project gallery to load
    const checkProjectGallery = setInterval(() => {
      if (window.projectGallery) {
        clearInterval(checkProjectGallery);
        updateStats();
      }
    }, 100);
  }
  
  /**
   * Animate number counting up
   */
  animateNumber(element, finalValue) {
    if (!element) return;
    
    const duration = 1000;
    const startTime = performance.now();
    const startValue = 0;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(startValue + (finalValue - startValue) * progress);
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  /**
   * Initialize category card interactions
   */
  initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
      // Add click tracking
      card.addEventListener('click', () => {
        const categoryName = card.querySelector('h3').textContent;
        
        // Filter projects by category
        if (window.projectGallery) {
          const categoryMap = {
            'AI/ML Applications': 'ai',
            'Productivity Tools': 'tools',
            'Interactive Games': 'games'
          };
          
          const category = categoryMap[categoryName];
          if (category) {
            // Update filter
            const filterBtn = document.querySelector(`[data-filter="category"][data-value="${category}"]`);
            if (filterBtn) {
              filterBtn.click();
            }
            
            // Scroll to projects section
            const projectsSection = document.querySelector('.projects-section');
            if (projectsSection) {
              projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'category_click', {
            event_category: 'engagement',
            event_label: categoryName
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
   * Initialize scroll effects
   */
  initScrollEffects() {
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
    
    // Parallax effect for page header
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        pageHeader.style.transform = `translateY(${rate}px)`;
      });
    }
  }
  
  /**
   * Initialize URL parameters for filtering
   */
  initURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const technology = urlParams.get('technology');
    const year = urlParams.get('year');
    const search = urlParams.get('search');
    
    if (category || technology || year || search) {
      // Wait for project gallery to load
      const checkProjectGallery = setInterval(() => {
        if (window.projectGallery) {
          clearInterval(checkProjectGallery);
          
          // Apply filters
          if (category) {
            window.projectGallery.filters.category = category;
          }
          if (technology) {
            window.projectGallery.filters.technology = technology;
          }
          if (year) {
            window.projectGallery.filters.year = year;
          }
          if (search) {
            window.projectGallery.filters.search = search;
            
            // Update search input
            const searchInput = document.getElementById('project-search');
            if (searchInput) {
              searchInput.value = search;
            }
          }
          
          // Apply filters
          window.projectGallery.filterProjects();
        }
      }, 100);
    }
  }
  
  /**
   * Initialize keyboard shortcuts
   */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
          searchInput.focus();
        }
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
}

// Initialize projects page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core functionality
  window.portfolioCore = new PortfolioCore();
  
  // Initialize projects page specific functionality
  window.projectsPage = new ProjectsPage();
  
  // Initialize additional features
  window.projectsPage.initURLParameters();
  window.projectsPage.initKeyboardShortcuts();
  window.projectsPage.initPerformanceMonitoring();
});

export default ProjectsPage;
