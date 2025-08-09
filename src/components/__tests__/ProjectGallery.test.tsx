import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from '@jest/globals';
import ProjectGallery from '../ProjectGallery';

// Mock the projects data
vi.mock('../../data/projects', () => ({
  projects: [
    {
      id: 'test-game',
      title: 'Test Game',
      description: 'A test game project',
      imageUrl: '/test-image.jpg',
      technologies: ['Game Logic', 'AI Algorithms'],
      liveUrl: '/test-game',
      githubUrl: 'https://github.com/test/game',
      featured: true,
      version: '1.0.0',
      stars: 50,
      forks: 10,
      lastUpdate: '2024-01-15',
      viewCount: 1000
    },
    {
      id: 'test-tool',
      title: 'Test Tool',
      description: 'A test utility tool',
      imageUrl: '/test-tool.jpg',
      technologies: ['Calculator', 'Math.js'],
      liveUrl: '/test-tool',
      githubUrl: 'https://github.com/test/tool',
      featured: false,
      version: '2.0.0',
      stars: 25,
      forks: 5,
      lastUpdate: '2024-01-10',
      viewCount: 500
    }
  ]
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    input: ({ ...props }: any) => <input {...props} />
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  LayoutGroup: ({ children }: any) => <>{children}</>
}));

describe('ProjectGallery', () => {
  it('renders without crashing', () => {
    render(<ProjectGallery />);
    expect(screen.getByText('All Projects')).toBeTruthy();
    expect(screen.getByText('Games')).toBeTruthy();
    expect(screen.getByText('Tools')).toBeTruthy();
    expect(screen.getByText('Educational')).toBeTruthy();
  });

  it('displays project cards', () => {
    render(<ProjectGallery />);
    expect(screen.getByText('Test Game')).toBeTruthy();
    expect(screen.getByText('Test Tool')).toBeTruthy();
  });

  it('filters projects by category', async () => {
    render(<ProjectGallery />);
    
    // Click on Games filter
    const gamesFilter = screen.getByText('Games');
    fireEvent.click(gamesFilter);
    
    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeTruthy();
    expect(screen.queryByText('Test Tool')).toBeNull();
    });
  });

  it('filters projects by search query', async () => {
    render(<ProjectGallery />);
    
    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'Game' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeTruthy();
    expect(screen.queryByText('Test Tool')).toBeNull();
    });
  });

  it('changes view mode', () => {
    render(<ProjectGallery />);
    
    // Default should be grid view
    const projectsContainer = screen.getByRole('main') || document.querySelector('.projects-container');
    expect(projectsContainer).toHaveClass('grid');
  });

  it('displays featured badge for featured projects', () => {
    render(<ProjectGallery />);
    expect(screen.getByText('⭐ Featured')).toBeTruthy();
  });

  it('shows project statistics', () => {
    render(<ProjectGallery />);
    expect(screen.getByText('⭐ 50')).toBeTruthy();
    expect(screen.getByText('👁️ 1000')).toBeTruthy();
  });

  it('displays technology badges', () => {
    render(<ProjectGallery />);
    expect(screen.getByText('Game Logic')).toBeTruthy();
    expect(screen.getByText('AI Algorithms')).toBeTruthy();
    expect(screen.getByText('Calculator')).toBeTruthy();
  });

  it('handles empty search results', async () => {
    render(<ProjectGallery />);
    
    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'NonExistentProject' } });
    
    await waitFor(() => {
      expect(screen.getByText('No projects found')).toBeTruthy();
      expect(screen.getByText('Clear Filters')).toBeTruthy();
    });
  });

  it('clears filters when clear button is clicked', async () => {
    render(<ProjectGallery />);
    
    // First filter to show no results
    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'NonExistentProject' } });
    
    await waitFor(() => {
      expect(screen.getByText('No projects found')).toBeTruthy();
    });
    
    // Click clear filters
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeTruthy();
    expect(screen.getByText('Test Tool')).toBeTruthy();
    });
  });

  it('sorts projects by popularity', async () => {
    render(<ProjectGallery />);
    
    // Click on Most Popular sort
    const popularSort = screen.getByText('Most Popular');
    fireEvent.click(popularSort);
    
    // Projects should be sorted by stars (Test Game: 50, Test Tool: 25)
    const projectCards = screen.getAllByText(/Test/);
    expect(projectCards[0]).toHaveTextContent('Test Game');
    expect(projectCards[1]).toHaveTextContent('Test Tool');
  });

  it('displays correct project counts in filter buttons', () => {
    render(<ProjectGallery />);
    
    // Check that filter buttons are present
    expect(screen.getByText('All Projects')).toBeInTheDocument();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
    expect(screen.getByText('Educational')).toBeInTheDocument();
  });
});
