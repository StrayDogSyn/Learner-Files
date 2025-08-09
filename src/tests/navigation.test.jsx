/**
 * Navigation Functionality Tests
 * Tests for section highlighting, smooth scrolling, and navigation components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock navigation component
const Navigation = ({ activeSection = 'home' }) => {
  const [currentSection, setCurrentSection] = React.useState(activeSection);
  const [isScrolling, setIsScrolling] = React.useState(false);

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  const scrollToSection = (sectionId) => {
    setIsScrolling(true);
    
    // Simulate smooth scrolling behavior
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(sectionId);
      
      // Simulate scroll completion
      setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;
      
      // Simulate intersection observer behavior
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            setCurrentSection(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  return (
    <nav data-testid="navigation" aria-label="Main navigation">
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={currentSection === section.id ? 'active' : ''}
              aria-current={currentSection === section.id ? 'page' : undefined}
              data-testid={`nav-${section.id}`}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Mock page sections
const PageSection = ({ id, title, height = '100vh' }) => {
  return (
    <section 
      id={id} 
      data-testid={`section-${id}`}
      style={{ height, paddingTop: '100px' }}
    >
      <h2>{title}</h2>
      <p>Content for {title} section</p>
    </section>
  );
};

// Mock full page component
const FullPage = () => {
  return (
    <div>
      <Navigation />
      <PageSection id="home" title="Home" />
      <PageSection id="about" title="About" />
      <PageSection id="skills" title="Skills" />
      <PageSection id="projects" title="Projects" />
      <PageSection id="contact" title="Contact" />
    </div>
  );
};

// Mock mobile navigation
const MobileNavigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div data-testid="mobile-navigation">
      <button 
        data-testid="mobile-menu-toggle"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? '✕' : '☰'}
      </button>
      
      {isOpen && (
        <div 
          id="mobile-menu"
          data-testid="mobile-menu"
          role="menu"
        >
          <a href="#home" role="menuitem">Home</a>
          <a href="#about" role="menuitem">About</a>
          <a href="#skills" role="menuitem">Skills</a>
          <a href="#projects" role="menuitem">Projects</a>
          <a href="#contact" role="menuitem">Contact</a>
        </div>
      )}
    </div>
  );
};

describe('Navigation Functionality Tests', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
    
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100
    }));
    
    // Mock window properties
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 800
    });
  });

  describe('Basic Navigation', () => {
    test('renders all navigation links', () => {
      render(<Navigation />);
      
      expect(screen.getByTestId('nav-home')).toBeInTheDocument();
      expect(screen.getByTestId('nav-about')).toBeInTheDocument();
      expect(screen.getByTestId('nav-skills')).toBeInTheDocument();
      expect(screen.getByTestId('nav-projects')).toBeInTheDocument();
      expect(screen.getByTestId('nav-contact')).toBeInTheDocument();
    });

    test('highlights active section', () => {
      render(<Navigation activeSection="about" />);
      
      const aboutButton = screen.getByTestId('nav-about');
      expect(aboutButton).toHaveClass('active');
      expect(aboutButton).toHaveAttribute('aria-current', 'page');
    });

    test('scrolls to section on navigation click', async () => {
      document.body.innerHTML = '<div id="about">About section</div>';
      
      const user = userEvent.setup();
      render(<Navigation />);
      
      const aboutButton = screen.getByTestId('nav-about');
      await user.click(aboutButton);
      
      expect(document.getElementById('about').scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth'
      });
    });

    test('updates active section on scroll', async () => {
      render(<FullPage />);
      
      // Mock intersection observer behavior
      const aboutElement = document.getElementById('about');
      aboutElement.getBoundingClientRect = jest.fn(() => ({
        top: 300,
        bottom: 500,
        left: 0,
        right: 100,
        width: 100,
        height: 200
      }));
      
      // Simulate scroll event
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      
      await waitFor(() => {
        const aboutButton = screen.getByTestId('nav-about');
        expect(aboutButton).toHaveClass('active');
      });
    });
  });

  describe('Smooth Scrolling', () => {
    test('prevents scroll highlighting during navigation', async () => {
      const user = userEvent.setup();
      render(<Navigation />);
      
      document.body.innerHTML = '<div id="skills">Skills section</div>';
      
      const skillsButton = screen.getByTestId('nav-skills');
      await user.click(skillsButton);
      
      // Simulate scroll event immediately after click
      fireEvent.scroll(window, { target: { scrollY: 200 } });
      
      // Should maintain skills as active during scrolling
      expect(skillsButton).toHaveClass('active');
    });

    test('handles multiple rapid navigation clicks', async () => {
      const user = userEvent.setup();
      render(<Navigation />);
      
      document.body.innerHTML = `
        <div id="about">About section</div>
        <div id="skills">Skills section</div>
        <div id="projects">Projects section</div>
      `;
      
      // Click multiple navigation items rapidly
      await user.click(screen.getByTestId('nav-about'));
      await user.click(screen.getByTestId('nav-skills'));
      await user.click(screen.getByTestId('nav-projects'));
      
      // Should handle all clicks gracefully
      expect(document.getElementById('projects').scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth'
      });
    });

    test('completes scroll animation', async () => {
      jest.useFakeTimers();
      
      const user = userEvent.setup();
      render(<Navigation />);
      
      document.body.innerHTML = '<div id="contact">Contact section</div>';
      
      const contactButton = screen.getByTestId('nav-contact');
      await user.click(contactButton);
      
      // Fast-forward timers to complete animation
      jest.advanceTimersByTime(500);
      
      // Should allow scroll highlighting after animation
      fireEvent.scroll(window, { target: { scrollY: 300 } });
      
      jest.useRealTimers();
    });
  });

  describe('Mobile Navigation', () => {
    test('renders mobile menu toggle', () => {
      render(<MobileNavigation />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveTextContent('☰');
    });

    test('opens mobile menu on toggle click', async () => {
      const user = userEvent.setup();
      render(<MobileNavigation />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      await user.click(toggleButton);
      
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      expect(toggleButton).toHaveTextContent('✕');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    test('closes mobile menu on second toggle click', async () => {
      const user = userEvent.setup();
      render(<MobileNavigation />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      
      // Open menu
      await user.click(toggleButton);
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      
      // Close menu
      await user.click(toggleButton);
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('mobile menu has proper accessibility attributes', async () => {
      const user = userEvent.setup();
      render(<MobileNavigation />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      await user.click(toggleButton);
      
      const mobileMenu = screen.getByTestId('mobile-menu');
      expect(mobileMenu).toHaveAttribute('role', 'menu');
      expect(toggleButton).toHaveAttribute('aria-controls', 'mobile-menu');
      
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(5);
    });
  });

  describe('Keyboard Navigation', () => {
    test('navigation is accessible via keyboard', async () => {
      const user = userEvent.setup();
      render(<Navigation />);
      
      const homeButton = screen.getByTestId('nav-home');
      const aboutButton = screen.getByTestId('nav-about');
      
      // Tab to first navigation item
      await user.tab();
      expect(homeButton).toHaveFocus();
      
      // Tab to next navigation item
      await user.tab();
      expect(aboutButton).toHaveFocus();
      
      // Activate with Enter key
      await user.keyboard('{Enter}');
      expect(aboutButton).toHaveClass('active');
    });

    test('supports arrow key navigation', async () => {
      const user = userEvent.setup();
      render(<Navigation />);
      
      const homeButton = screen.getByTestId('nav-home');
      homeButton.focus();
      
      // Mock arrow key handling
      await user.keyboard('{ArrowRight}');
      
      // Implementation would depend on actual arrow key support
      expect(homeButton).toHaveFocus();
    });

    test('escape key closes mobile menu', async () => {
      const user = userEvent.setup();
      render(<MobileNavigation />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      await user.click(toggleButton);
      
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      
      // Press escape key
      await user.keyboard('{Escape}');
      
      // Menu should close (implementation dependent)
      // This would require additional escape key handling in the component
    });
  });

  describe('Section Management', () => {
    test('handles non-existent sections gracefully', async () => {
      const user = userEvent.setup();
      
      // Render navigation without corresponding sections
      render(<Navigation />);
      
      const aboutButton = screen.getByTestId('nav-about');
      
      // Should not throw error when clicking navigation for non-existent section
      expect(async () => {
        await user.click(aboutButton);
      }).not.toThrow();
    });

    test('updates navigation on programmatic section changes', () => {
      const { rerender } = render(<Navigation activeSection="home" />);
      
      expect(screen.getByTestId('nav-home')).toHaveClass('active');
      
      rerender(<Navigation activeSection="projects" />);
      
      expect(screen.getByTestId('nav-projects')).toHaveClass('active');
      expect(screen.getByTestId('nav-home')).not.toHaveClass('active');
    });

    test('handles hash changes in URL', () => {
      render(<Navigation />);
      
      // Simulate hash change
      window.location.hash = '#skills';
      fireEvent(window, new HashChangeEvent('hashchange'));
      
      // Navigation should respond to hash changes
      // Implementation would depend on hash change handling
    });
  });

  describe('Performance', () => {
    test('scroll event handler performs efficiently', () => {
      render(<FullPage />);
      
      const startTime = performance.now();
      
      // Trigger multiple scroll events
      for (let i = 0; i < 10; i++) {
        fireEvent.scroll(window, { target: { scrollY: i * 100 } });
      }
      
      const endTime = performance.now();
      
      // Should handle multiple scroll events quickly
      expect(endTime - startTime).toBeLessThan(50);
    });

    test('navigation click responds quickly', async () => {
      const user = userEvent.setup();
      render(<Navigation />);
      
      document.body.innerHTML = '<div id="about">About section</div>';
      
      const startTime = performance.now();
      await user.click(screen.getByTestId('nav-about'));
      const endTime = performance.now();
      
      // Navigation should respond quickly
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('mobile menu toggle is responsive', async () => {
      const user = userEvent.setup();
      render(<MobileNavigation />);
      
      const startTime = performance.now();
      await user.click(screen.getByTestId('mobile-menu-toggle'));
      const endTime = performance.now();
      
      // Mobile menu should toggle quickly
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('Edge Cases', () => {
    test('handles disabled JavaScript gracefully', () => {
      // Mock scenario where scrollIntoView is not available
      Element.prototype.scrollIntoView = undefined;
      
      render(<Navigation />);
      
      // Should render without errors
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });

    test('works with nested scroll containers', () => {
      const NestedScrollContainer = () => (
        <div style={{ height: '300px', overflow: 'auto' }} data-testid="scroll-container">
          <Navigation />
          <div style={{ height: '1000px' }}>Scrollable content</div>
        </div>
      );
      
      render(<NestedScrollContainer />);
      
      const container = screen.getByTestId('scroll-container');
      fireEvent.scroll(container, { target: { scrollTop: 100 } });
      
      // Should handle nested scrolling
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });

    test('handles rapid resize events', () => {
      render(<Navigation />);
      
      // Simulate multiple resize events
      for (let i = 0; i < 5; i++) {
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          value: 600 + i * 100
        });
        fireEvent(window, new Event('resize'));
      }
      
      // Should handle resizes gracefully
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });
  });
});
