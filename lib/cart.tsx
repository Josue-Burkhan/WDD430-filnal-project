'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure for a single cart item
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Define the structure for the cart context state
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define the props for the CartProvider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      setCartItems([]);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If item doesn't exist, add it to the cart with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove the item
      removeFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => (item._id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate the total number of items in the cart
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Calculate the total price of all items in the cart
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
