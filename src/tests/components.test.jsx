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
  });

  describe('AnalyticsDashboard Component', () => {
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

    test('displays chart components', async () => {
      render(<AnalyticsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Page Views Trend')).toBeInTheDocument();
        expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
        expect(screen.getByText('Project Completion Metrics')).toBeInTheDocument();
        expect(screen.getByText('Device Usage Breakdown')).toBeInTheDocument();
      });
    });
  });
});
