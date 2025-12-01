// src/context/CartContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: number) => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add Item Logic
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            image_url: product.image_url, 
            quantity: 1 
        }];
      }
    });
  };

  // Remove Item Logic
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Calculate Total Items
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}