/**
 * Unit tests for cartStorage – edge cases, error cases, boundaries
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cartStorage } from './cartStorage';
import type { Pie, CartItem } from '../types/pie';

const CART_KEY = 'cart';

const validPie: Pie = {
  id: 'pie-1',
  name: 'Apple Pie',
  price: 12.99,
  description: 'Classic apple',
  category: 'fruit',
  image: '/img/apple.jpg',
};

const validCartItem: CartItem = {
  id: 'pie-1',
  name: 'Apple Pie',
  price: 12.99,
  quantity: 2,
};

function getStoredCart(): string | null {
  return localStorage.getItem(CART_KEY);
}

describe('cartStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getCart', () => {
    it('returns empty array when nothing stored', () => {
      expect(cartStorage.getCart()).toEqual([]);
    });

    it('returns valid cart when stored data is valid', () => {
      localStorage.setItem(CART_KEY, JSON.stringify([validCartItem]));
      expect(cartStorage.getCart()).toEqual([validCartItem]);
    });

    it('returns empty array and resets when stored data is invalid (not array)', () => {
      localStorage.setItem(CART_KEY, JSON.stringify({ items: [] }));
      expect(cartStorage.getCart()).toEqual([]);
      expect(console.warn).toHaveBeenCalled();
    });

    it('returns empty array when stored data is invalid JSON', () => {
      localStorage.setItem(CART_KEY, 'not valid json{{{');
      expect(cartStorage.getCart()).toEqual([]);
      expect(console.warn).toHaveBeenCalled();
    });

    it('returns empty array when item has invalid schema (missing id)', () => {
      const invalid = [{ name: 'Pie', price: 10, quantity: 1 }];
      localStorage.setItem(CART_KEY, JSON.stringify(invalid));
      expect(cartStorage.getCart()).toEqual([]);
    });

    it('returns empty array when item has zero or negative quantity', () => {
      const invalid = [{ ...validCartItem, quantity: 0 }];
      localStorage.setItem(CART_KEY, JSON.stringify(invalid));
      expect(cartStorage.getCart()).toEqual([]);
    });

    it('returns empty array when item has negative price', () => {
      const invalid = [{ ...validCartItem, price: -1 }];
      localStorage.setItem(CART_KEY, JSON.stringify(invalid));
      expect(cartStorage.getCart()).toEqual([]);
    });

    it('returns empty array when item has empty string id', () => {
      const invalid = [{ ...validCartItem, id: '' }];
      localStorage.setItem(CART_KEY, JSON.stringify(invalid));
      expect(cartStorage.getCart()).toEqual([]);
    });
  });

  describe('saveCart', () => {
    it('saves valid items and returns true', () => {
      expect(cartStorage.saveCart([validCartItem])).toBe(true);
      expect(JSON.parse(getStoredCart()!)).toEqual([validCartItem]);
    });

    it('returns false when items is not an array', () => {
      expect(cartStorage.saveCart(null as unknown as CartItem[])).toBe(false);
      expect(cartStorage.saveCart(undefined as unknown as CartItem[])).toBe(false);
      expect(cartStorage.saveCart('not array' as unknown as CartItem[])).toBe(false);
    });

    it('sanitizes and filters invalid items, saves only valid ones', () => {
      const mixed = [
        validCartItem,
        { id: '', name: 'Bad', price: 1, quantity: 1 },
        { id: 'x', name: 'Ok', price: 0, quantity: 1 },
      ];
      expect(cartStorage.saveCart(mixed as CartItem[])).toBe(true);
      const stored = cartStorage.getCart();
      expect(stored).toHaveLength(2);
      expect(stored.find((i) => i.id === 'x')).toBeDefined();
    });

    it('saves empty array successfully', () => {
      expect(cartStorage.saveCart([])).toBe(true);
      expect(cartStorage.getCart()).toEqual([]);
    });
  });

  describe('addToCart', () => {
    it('adds new item and returns true', () => {
      expect(cartStorage.addToCart(validPie)).toBe(true);
      expect(cartStorage.getCart()).toHaveLength(1);
      expect(cartStorage.getCart()[0].quantity).toBe(1);
    });

    it('increments quantity when item already in cart', () => {
      cartStorage.addToCart(validPie);
      cartStorage.addToCart(validPie);
      expect(cartStorage.getCart()).toHaveLength(1);
      expect(cartStorage.getCart()[0].quantity).toBe(2);
    });

    it('returns false when pie is null or undefined', () => {
      expect(cartStorage.addToCart(null as unknown as Pie)).toBe(false);
      expect(cartStorage.addToCart(undefined as unknown as Pie)).toBe(false);
    });

    it('returns false when pie is not an object', () => {
      expect(cartStorage.addToCart('string' as unknown as Pie)).toBe(false);
    });

    it('handles pie with minimal valid fields', () => {
      const minimal = { id: 'm1', name: 'M', price: 0, description: '', category: 'fruit' as const, image: '' };
      expect(cartStorage.addToCart(minimal)).toBe(true);
      expect(cartStorage.getCart()[0].quantity).toBe(1);
    });
  });

  describe('removeFromCart', () => {
    it('removes item by id and returns true', () => {
      cartStorage.addToCart(validPie);
      expect(cartStorage.removeFromCart('pie-1')).toBe(true);
      expect(cartStorage.getCart()).toHaveLength(0);
    });

    it('returns true when id not in cart (no-op)', () => {
      expect(cartStorage.removeFromCart('nonexistent')).toBe(true);
    });

    it('returns false when id is invalid', () => {
      expect(cartStorage.removeFromCart('')).toBe(false);
      expect(cartStorage.removeFromCart(null as unknown as string)).toBe(false);
      expect(cartStorage.removeFromCart(123 as unknown as string)).toBe(false);
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      cartStorage.addToCart(validPie);
      cartStorage.addToCart(validPie); // quantity 2
    });

    it('updates quantity and returns true', () => {
      expect(cartStorage.updateQuantity('pie-1', 5)).toBe(true);
      expect(cartStorage.getCart()[0].quantity).toBe(5);
    });

    it('removes item when quantity is 0', () => {
      expect(cartStorage.updateQuantity('pie-1', 0)).toBe(true);
      expect(cartStorage.getCart()).toHaveLength(0);
    });

    it('returns false when quantity is negative', () => {
      expect(cartStorage.updateQuantity('pie-1', -1)).toBe(false);
      expect(cartStorage.getCart()[0].quantity).toBe(2);
    });

    it('returns false when quantity is not an integer', () => {
      expect(cartStorage.updateQuantity('pie-1', 1.5)).toBe(false);
    });

    it('returns false when id is invalid', () => {
      expect(cartStorage.updateQuantity('', 1)).toBe(false);
      expect(cartStorage.updateQuantity('nonexistent', 3)).toBe(false);
    });

    it('boundary: accepts quantity 1', () => {
      expect(cartStorage.updateQuantity('pie-1', 1)).toBe(true);
      expect(cartStorage.getCart()[0].quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('clears all items and returns true', () => {
      cartStorage.addToCart(validPie);
      expect(cartStorage.clearCart()).toBe(true);
      expect(cartStorage.getCart()).toEqual([]);
    });

    it('succeeds when cart already empty', () => {
      expect(cartStorage.clearCart()).toBe(true);
    });
  });

  describe('getCartQuantity', () => {
    it('returns 0 for empty cart', () => {
      expect(cartStorage.getCartQuantity()).toBe(0);
    });

    it('sums quantities correctly', () => {
      cartStorage.saveCart([
        { ...validCartItem, quantity: 2 },
        { ...validCartItem, id: 'p2', name: 'P2', quantity: 3 },
      ]);
      expect(cartStorage.getCartQuantity()).toBe(5);
    });
  });

  describe('getCartTotal', () => {
    it('returns 0 for empty cart', () => {
      expect(cartStorage.getCartTotal()).toBe(0);
    });

    it('calculates total correctly', () => {
      cartStorage.saveCart([
        { id: 'a', name: 'A', price: 10, quantity: 2 },
        { id: 'b', name: 'B', price: 5, quantity: 1 },
      ]);
      expect(cartStorage.getCartTotal()).toBe(25);
    });

    it('handles zero price', () => {
      cartStorage.saveCart([{ ...validCartItem, price: 0, quantity: 3 }]);
      expect(cartStorage.getCartTotal()).toBe(0);
    });
  });

  describe('isInCart', () => {
    it('returns false for empty cart', () => {
      expect(cartStorage.isInCart('any')).toBe(false);
    });

    it('returns true when item exists', () => {
      cartStorage.addToCart(validPie);
      expect(cartStorage.isInCart('pie-1')).toBe(true);
    });

    it('returns false when item does not exist', () => {
      cartStorage.addToCart(validPie);
      expect(cartStorage.isInCart('other')).toBe(false);
    });
  });
});
