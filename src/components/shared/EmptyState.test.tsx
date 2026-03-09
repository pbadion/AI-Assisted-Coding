/**
 * Unit tests for EmptyState – defaults, custom props, link
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmptyState from './EmptyState';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('EmptyState', () => {
  it('renders heading and default title/description/link', () => {
    renderWithRouter(<EmptyState heading="Cart" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Cart');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Your cart is empty');
    expect(screen.getByText(/Add some delicious pies/)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Continue Shopping/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders custom title, description, linkTo, linkLabel', () => {
    renderWithRouter(
      <EmptyState
        heading="No results"
        title="No pies found"
        description="Try another category."
        linkTo="/fruit"
        linkLabel="Browse Fruit"
      />
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('No pies found');
    expect(screen.getByText('Try another category.')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Browse Fruit/i });
    expect(link).toHaveAttribute('href', '/fruit');
  });
});
