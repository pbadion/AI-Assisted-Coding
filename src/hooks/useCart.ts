import { useState, useEffect, useCallback } from 'react';
import { Cart, Pie, UseCartReturn } from '../types/pie';
import { cartStorage } from '../utils/cartStorage';

const buildCartSnapshot = (): Cart => ({
  items: cartStorage.getCart(),
  totalQuantity: cartStorage.getCartQuantity(),
  totalPrice: cartStorage.getCartTotal(),
});

const EMPTY_CART: Cart = { items: [], totalQuantity: 0, totalPrice: 0 };

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);

  useEffect(() => {
    setCart(buildCartSnapshot());
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        setCart(buildCartSnapshot());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = useCallback((pie: Pie) => {
    if (cartStorage.addToCart(pie)) {
      setCart(buildCartSnapshot());
    }
  }, []);

  const removeFromCart = useCallback((id: string) => {
    if (cartStorage.removeFromCart(id)) {
      setCart(buildCartSnapshot());
    }
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (cartStorage.updateQuantity(id, quantity)) {
      setCart(buildCartSnapshot());
    }
  }, []);

  const clearCart = useCallback(() => {
    if (cartStorage.clearCart()) {
      setCart(EMPTY_CART);
    }
  }, []);

  const isInCart = useCallback((id: string) => cartStorage.isInCart(id), []);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, isInCart };
};
