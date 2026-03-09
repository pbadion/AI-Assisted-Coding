/**
 * Unit tests for OrderSummary – empty cart, with items, showItemDetails, children
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderSummary from './OrderSummary';
import type { Cart } from '../../types/pie';

const emptyCart: Cart = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartWithItems: Cart = {
  items: [
    { id: '1', name: 'Apple Pie', price: 12.99, quantity: 2 },
    { id: '2', name: 'Berry Pie', price: 14.5, quantity: 1 },
  ],
  totalQuantity: 3,
  totalPrice: 40.48,
};

describe('OrderSummary', () => {
  it('renders totals for empty cart', () => {
    render(<OrderSummary cart={emptyCart} />);
    expect(screen.getByText(/Items \(0\):/)).toBeInTheDocument();
    expect(screen.getAllByText('$0.00').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('renders totals for cart with items', () => {
    render(<OrderSummary cart={cartWithItems} />);
    expect(screen.getByText(/Items \(3\):/)).toBeInTheDocument();
    expect(screen.getAllByText('$40.48').length).toBeGreaterThanOrEqual(1);
  });

  it('hides item details when showItemDetails is false', () => {
    const { container } = render(<OrderSummary cart={cartWithItems} showItemDetails={false} />);
    expect(container.querySelector('.order-items')).not.toBeInTheDocument();
  });

  it('shows item details when showItemDetails is true', () => {
    render(<OrderSummary cart={cartWithItems} showItemDetails />);
    expect(screen.getByText('Apple Pie')).toBeInTheDocument();
    expect(screen.getByText('Berry Pie')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <OrderSummary cart={emptyCart}>
        <button>Place Order</button>
      </OrderSummary>
    );
    expect(screen.getByRole('button', { name: 'Place Order' })).toBeInTheDocument();
  });

  it('boundary: single item with quantity 1', () => {
    const single: Cart = {
      items: [{ id: '1', name: 'Solo', price: 9.99, quantity: 1 }],
      totalQuantity: 1,
      totalPrice: 9.99,
    };
    render(<OrderSummary cart={single} showItemDetails />);
    expect(screen.getByText('Solo')).toBeInTheDocument();
    expect(screen.getByText(/Items \(1\):/)).toBeInTheDocument();
    expect(screen.getAllByText('$9.99').length).toBeGreaterThanOrEqual(1);
  });
});
