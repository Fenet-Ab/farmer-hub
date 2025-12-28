import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Calculate total items count (sum of all quantities)
      // API returns {cart, totalPrice} when cart exists, or {message: "Cart is empty"} when empty
      if (response.data.cart && response.data.cart.items && Array.isArray(response.data.cart.items)) {
        const totalItems = response.data.cart.items.reduce(
          (total, item) => total + (item.quantity || 0),
          0
        );
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      // If cart doesn't exist or error, set count to 0
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart count on mount and when token changes
  useEffect(() => {
    fetchCartCount();
    
    // Also check for token changes
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
      } else {
        fetchCartCount();
      }
    };

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkToken);
    
    // Listen for custom cart update events
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const refreshCartCount = () => {
    fetchCartCount();
  };

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, loading }}>
      {children}
    </CartContext.Provider>
  );
};

