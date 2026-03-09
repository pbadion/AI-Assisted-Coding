/**
 * Unit tests for ErrorMessage – default title, custom message, edge cases
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders default title when title not provided', () => {
    render(<ErrorMessage message="Something broke" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Something went wrong');
    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(<ErrorMessage title="Load failed" message="Network error" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Load failed');
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders with empty message string', () => {
    const { container } = render(<ErrorMessage message="" />);
    const p = container.querySelector('.error-container p');
    expect(p).toBeInTheDocument();
    expect(p).toHaveTextContent('');
  });

  it('has error-container class', () => {
    const { container } = render(<ErrorMessage message="Err" />);
    expect(container.querySelector('.error-container')).toBeInTheDocument();
  });
});
