/**
 * Unit tests for LoadingSpinner – default and custom message
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<LoadingSpinner message="Loading pies..." />);
    expect(screen.getByText('Loading pies...')).toBeInTheDocument();
  });

  it('has loading-container class', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.loading-container')).toBeInTheDocument();
  });
});
