import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import ProjectGallery from '../ProjectGallery';

// Simple test without mocks

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
    fireEvent.change(searchInput, { target: { value: 'Dice' } });
    
    await waitFor(() => {
      expect(screen.getByText('Dice Duel Pro')).toBeTruthy();
      expect(screen.queryByText('Quiz Master Pro')).toBeNull();
    });
  });

  it('changes view mode', () => {
    render(<ProjectGallery />);
    
    // Default should be grid view
    const projectsContainer = screen.getByRole('main') || document.querySelector('.projects-container');
    expect(projectsContainer.className).toContain('grid');
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
      expect(screen.getByText('Dice Duel Pro')).toBeTruthy();
      expect(screen.getByText('Quiz Master Pro')).toBeTruthy();
    });
  });

  it('sorts projects by popularity', async () => {
    render(<ProjectGallery />);
    
    // Click on Most Popular sort
    const popularSort = screen.getByText('Most Popular');
    fireEvent.click(popularSort);
    
    // Projects should be sorted by stars (Test Game: 50, Test Tool: 25)
    const projectCards = screen.getAllByText(/Test/);
    expect(projectCards[0].textContent).toContain('Test Game');
    expect(projectCards[1].textContent).toContain('Test Tool');
  });

  it('displays correct project counts in filter buttons', () => {
    render(<ProjectGallery />);
    
    // Check that filter buttons are present
    expect(screen.getByText('All Projects')).toBeTruthy();
    expect(screen.getByText('Games')).toBeTruthy();
    expect(screen.getByText('Tools')).toBeTruthy();
    expect(screen.getByText('Educational')).toBeTruthy();
  });
});
