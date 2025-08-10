import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import ProjectGallery from '../ProjectGallery';

describe('ProjectGallery Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProjectGallery />);
    expect(container).toBeTruthy();
  });

  it('displays the correct heading', () => {
    const { container } = render(<ProjectGallery />);
    expect(container.textContent).toContain('Project Gallery');
  });
});
