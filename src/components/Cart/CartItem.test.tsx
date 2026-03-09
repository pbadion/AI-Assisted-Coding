/**
 * Unit tests for CartItem – quantity boundaries, remove, callbacks
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '../../contexts/CartContext';
import CartItem from './CartItem';
import type { CartItem as CartItemType } from '../../types/pie';

const item: CartItemType = {
  id: 'pie-1',
  name: 'Apple Pie',
  price: 12.99,
  quantity: 2,
};

function renderWithProvider(props: React.ComponentProps<typeof CartItem>) {
  return render(
    <CartProvider>
      <CartItem {...props} />
    </CartProvider>
  );
}

describe('CartItem', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders item name, price, quantity and total', () => {
    renderWithProvider({ item });
    expect(screen.getByText('Apple Pie')).toBeInTheDocument();
    expect(screen.getByText('$12.99 each')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$25.98')).toBeInTheDocument();
  });

  it('boundary: decrease button is disabled when quantity is 1', () => {
    renderWithProvider({ item: { ...item, quantity: 1 } });
    const decreaseBtn = screen.getByRole('button', { name: /decrease quantity/i });
    expect(decreaseBtn).toBeDisabled();
  });

  it('decrease button is enabled when quantity is 2', () => {
    renderWithProvider({ item });
    const decreaseBtn = screen.getByRole('button', { name: /decrease quantity/i });
    expect(decreaseBtn).not.toBeDisabled();
  });

  it('decrease button triggers quantity update', async () => {
    const user = userEvent.setup();
    const onUpdateQuantity = vi.fn();
    renderWithProvider({ item, onUpdateQuantity });
    await user.click(screen.getByRole('button', { name: /decrease quantity/i }));
    expect(onUpdateQuantity).toHaveBeenCalledWith('pie-1', 1);
  });

  it('increase button triggers quantity update', async () => {
    const user = userEvent.setup();
    const onUpdateQuantity = vi.fn();
    renderWithProvider({ item, onUpdateQuantity });
    await user.click(screen.getByRole('button', { name: /increase quantity/i }));
    expect(onUpdateQuantity).toHaveBeenCalledWith('pie-1', 3);
  });

  it('calls onRemove when provided and Remove clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderWithProvider({ item, onRemove });
    await user.click(screen.getByRole('button', { name: /remove apple pie from cart/i }));
    expect(onRemove).toHaveBeenCalledWith('pie-1');
  });
});
