import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      const { data } = await API.get('/cart');
      setCart(data);
    } catch (err) {
      console.error('Cart fetch error:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, tenure) => {
    setCartLoading(true);
    try {
      const { data } = await API.post('/cart/add', { productId, tenure });
      setCart(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await API.delete(`/cart/remove/${itemId}`);
      setCart(data);
    } catch (err) {
      console.error('Remove from cart error:', err);
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart/clear');
      setCart({ items: [] });
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  const cartCount = cart?.items?.length || 0;
  
  const cartTotal = cart?.items?.reduce((sum, item) => {
    return sum + ((item.product?.monthlyRent || 0) + (item.product?.securityDeposit || 0)) * item.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchCart, cartCount, cartTotal, cartLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
