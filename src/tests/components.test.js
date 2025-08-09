/**
 * Component Rendering Tests
 * Tests for all major components to ensure they render correctly
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Import components
import SkillsMatrix from '../components/SkillsMatrix';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import GitHubDashboard from '../components/GitHubDashboard';

// Mock data
const mockSkillsData = {
  frontend: [
    { name: 'React.js', level: 95, experience: '4+ years', projects: 15 },
    { name: 'TypeScript', level: 90, experience: '3+ years', projects: 12 }
  ]
};

describe('Component Rendering Tests', () => {
  describe('SkillsMatrix Component', () => {
    test('renders skills matrix with default category', () => {
      render(<SkillsMatrix />);
      
      expect(screen.getByText('Skills & Expertise')).toBeInTheDocument();
      expect(screen.getByText('Frontend')).toBeInTheDocument();
      expect(screen.getByText('Backend')).toBeInTheDocument();
      expect(screen.getByText('Mobile')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
      expect(screen.getByText('DevOps')).toBeInTheDocument();
    });

    test('displays skills for selected category', () => {
      render(<SkillsMatrix />);
      
      // Frontend skills should be visible by default
      expect(screen.getByText('React.js')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Next.js')).toBeInTheDocument();
    });

    test('switches categories when category button is clicked', async () => {
      const user = userEvent.setup();
      render(<SkillsMatrix />);
      
      // Click on Backend category
      const backendButton = screen.getByText('Backend');
      await user.click(backendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Node.js')).toBeInTheDocument();
        expect(screen.getByText('Express.js')).toBeInTheDocument();
      });
    });

    test('displays skill proficiency levels correctly', () => {
      render(<SkillsMatrix />);
      
      // Check for Expert level skills
      const expertBadges = screen.getAllByText('Expert');
      expect(expertBadges.length).toBeGreaterThan(0);
      
      // Check for Advanced level skills
      const advancedBadges = screen.getAllByText('Advanced');
      expect(advancedBadges.length).toBeGreaterThan(0);
    });

    test('shows progress bars for skills', () => {
      render(<SkillsMatrix />);
      
      // Progress bars should be rendered (checking for proficiency text)
      const proficiencyLabels = screen.getAllByText('Proficiency');
      expect(proficiencyLabels.length).toBeGreaterThan(0);
    });

    test('displays experience and project information', () => {
      render(<SkillsMatrix />);
      
      // Check for experience indicators
      expect(screen.getByText('4+ years experience')).toBeInTheDocument();
      expect(screen.getByText('15 projects completed')).toBeInTheDocument();
    });

    test('shows continuous learning section', () => {
      render(<SkillsMatrix />);
      
      expect(screen.getByText('Continuous Learning & Growth')).toBeInTheDocument();
      expect(screen.getByText('Certified Developer')).toBeInTheDocument();
      expect(screen.getByText('Active Learner')).toBeInTheDocument();
      expect(screen.getByText('Skill Growth')).toBeInTheDocument();
    });

    test('handles hover interactions', async () => {
      const user = userEvent.setup();
      render(<SkillsMatrix />);
      
      const skillCard = screen.getByText('React.js').closest('div');
      await user.hover(skillCard);
      
      // Hover should work without errors
      expect(skillCard).toBeInTheDocument();
    });

    test('has proper accessibility attributes', () => {
      render(<SkillsMatrix />);
      
      const section = screen.getByRole('region', { name: /skills/i });
      expect(section).toBeInTheDocument();
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('AnalyticsDashboard Component', () => {
    test('renders analytics dashboard with loading state', () => {
      render(<AnalyticsDashboard />);
      
      // Should show loading spinner initially
      const spinner = screen.getByRole('status') || screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    test('displays key metrics after loading', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Total Page Views')).toBeInTheDocument();
        expect(screen.getByText('Unique Visitors')).toBeInTheDocument();
        expect(screen.getByText('Project Downloads')).toBeInTheDocument();
        expect(screen.getByText('GitHub Stars')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    test('shows period selector buttons', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Week')).toBeInTheDocument();
        expect(screen.getByText('Month')).toBeInTheDocument();
        expect(screen.getByText('Quarter')).toBeInTheDocument();
        expect(screen.getByText('Year')).toBeInTheDocument();
      });
    });

    test('switches time periods when buttons are clicked', async () => {
      const user = userEvent.setup();
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        const weekButton = screen.getByText('Week');
        expect(weekButton).toBeInTheDocument();
      });
      
      const weekButton = screen.getByText('Week');
      await user.click(weekButton);
      
      // Button should become active
      expect(weekButton).toHaveClass('bg-purple-600');
    });

    test('displays chart components', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Page Views Trend')).toBeInTheDocument();
        expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
        expect(screen.getByText('Project Completion Metrics')).toBeInTheDocument();
        expect(screen.getByText('Device Usage Breakdown')).toBeInTheDocument();
      });
    });

    test('renders chart containers', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        const areaChart = screen.getByTestId('area-chart');
        const pieChart = screen.getByTestId('pie-chart');
        const barChart = screen.getByTestId('bar-chart');
        
        expect(areaChart).toBeInTheDocument();
        expect(pieChart).toBeInTheDocument();
        expect(barChart).toBeInTheDocument();
      });
    });

    test('displays device breakdown with icons', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Desktop')).toBeInTheDocument();
        expect(screen.getByText('Mobile')).toBeInTheDocument();
        expect(screen.getByText('Tablet')).toBeInTheDocument();
      });
    });

    test('shows percentage values for device usage', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('65%')).toBeInTheDocument();
        expect(screen.getByText('30%')).toBeInTheDocument();
        expect(screen.getByText('5%')).toBeInTheDocument();
      });
    });
  });

  describe('Component Integration', () => {
    test('components render without conflicts', () => {
      render(
        <div>
          <SkillsMatrix />
          <AnalyticsDashboard />
        </div>
      );
      
      expect(screen.getByText('Skills & Expertise')).toBeInTheDocument();
      
      // Wait for analytics dashboard to load
      setTimeout(() => {
        expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      }, 1000);
    });

    test('multiple skill matrices can be rendered', () => {
      render(
        <div>
          <SkillsMatrix />
          <SkillsMatrix />
        </div>
      );
      
      const skillsTitles = screen.getAllByText('Skills & Expertise');
      expect(skillsTitles).toHaveLength(2);
    });

    test('components handle rapid re-renders', () => {
      const { rerender } = render(<SkillsMatrix />);
      
      // Rapidly re-render
      for (let i = 0; i < 5; i++) {
        rerender(<SkillsMatrix key={i} />);
      }
      
      expect(screen.getByText('Skills & Expertise')).toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    test('components handle missing props gracefully', () => {
      // Test with undefined props
      const { container } = render(<SkillsMatrix data={undefined} />);
      expect(container).toBeInTheDocument();
    });

    test('components handle invalid data gracefully', () => {
      const { container } = render(<AnalyticsDashboard data="invalid" />);
      expect(container).toBeInTheDocument();
    });

    test('components recover from errors', () => {
      // Simulate error recovery
      const { rerender } = render(<SkillsMatrix />);
      
      // Force error by passing invalid props
      try {
        rerender(<SkillsMatrix data={null} />);
      } catch (error) {
        // Should handle error gracefully
      }
      
      // Recover with valid props
      rerender(<SkillsMatrix />);
      expect(screen.getByText('Skills & Expertise')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('components render quickly', () => {
      const startTime = performance.now();
      render(<SkillsMatrix />);
      const endTime = performance.now();
      
      // Should render in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('components handle large datasets', () => {
      // Test with large mock data
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        name: `Skill ${i}`,
        level: Math.floor(Math.random() * 100),
        experience: `${Math.floor(Math.random() * 5)}+ years`,
        projects: Math.floor(Math.random() * 20)
      }));
      
      const { container } = render(<SkillsMatrix data={largeData} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('components adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<SkillsMatrix />);
      expect(screen.getByText('Skills & Expertise')).toBeInTheDocument();
    });

    test('components adapt to desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      
      render(<AnalyticsDashboard />);
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    });

    test('components handle window resize', () => {
      render(<SkillsMatrix />);
      
      // Simulate window resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      expect(screen.getByText('Skills & Expertise')).toBeInTheDocument();
    });
  });
});
