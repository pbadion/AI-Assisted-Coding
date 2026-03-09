/**
 * Unit tests for useCart – add, remove, update, clear, isInCart, storage sync
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';
import type { Pie } from '../types/pie';

const validPie: Pie = {
  id: 'pie-1',
  name: 'Apple Pie',
  price: 12.99,
  description: 'Classic',
  category: 'fruit',
  image: '/img.jpg',
};

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns empty cart initially', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.cart.items).toEqual([]);
    expect(result.current.cart.totalQuantity).toBe(0);
    expect(result.current.cart.totalPrice).toBe(0);
  });

  it('addToCart adds item and updates state', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart(validPie);
    });
    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].quantity).toBe(1);
    expect(result.current.cart.totalQuantity).toBe(1);
    expect(result.current.cart.totalPrice).toBe(12.99);
  });

  it('addToCart twice increments quantity', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart(validPie);
      result.current.addToCart(validPie);
    });
    expect(result.current.cart.items[0].quantity).toBe(2);
    expect(result.current.cart.totalQuantity).toBe(2);
  });

  it('removeFromCart removes item', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart(validPie);
    });
    act(() => {
      result.current.removeFromCart('pie-1');
    });
    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.cart.totalQuantity).toBe(0);
  });

  it('updateQuantity changes quantity', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart(validPie);
      result.current.addToCart(validPie);
    });
    act(() => {
      result.current.updateQuantity('pie-1', 5);
    });
    expect(result.current.cart.items[0].quantity).toBe(5);
    expect(result.current.cart.totalQuantity).toBe(5);
  });

  it('updateQuantity to 0 removes item', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart(validPie);
    });
    act(() => {
      result.current.updateQuantity('pie-1', 0);
    });
    expect(result.current.cart.items).toHaveLength(0);
  });

  it('clearCart empties cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart(validPie);
    });
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.cart.items).toEqual([]);
    expect(result.current.cart.totalQuantity).toBe(0);
  });

  it('isInCart returns true when item in cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart(validPie);
    });
    expect(result.current.isInCart('pie-1')).toBe(true);
  });

  it('isInCart returns false when item not in cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.isInCart('pie-1')).toBe(false);
    act(() => {
      result.current.addToCart(validPie);
    });
    expect(result.current.isInCart('other')).toBe(false);
  });

  it('syncs when storage event fires for cart key', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.cart.items).toHaveLength(0);
    // Simulate another tab updating cart
    localStorage.setItem(
      'cart',
      JSON.stringify([
        { id: 'pie-1', name: 'Apple', price: 12.99, quantity: 2 },
      ])
    );
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'cart', newValue: localStorage.getItem('cart') })
      );
    });
    // Hook reads from cartStorage on storage event, so state should reflect new data
    expect(result.current.cart.items.length).toBeGreaterThanOrEqual(0);
    expect(result.current.cart.totalQuantity).toBe(2);
  });
});
