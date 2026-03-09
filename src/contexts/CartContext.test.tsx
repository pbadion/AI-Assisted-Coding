/**
 * Unit tests for CartContext – provider and useCartContext error boundary
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartProvider, useCartContext } from './CartContext';

function Consumer() {
  const { cart } = useCartContext();
  return <span data-testid="cart-count">{cart.totalQuantity}</span>;
}

describe('CartContext', () => {
  it('provides cart state to children', () => {
    render(
      <CartProvider>
        <Consumer />
      </CartProvider>
    );
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  it('useCartContext throws when used outside CartProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow('useCartContext must be used within a CartProvider');
    consoleSpy.mockRestore();
  });
});
