"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  category: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  totalItems: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const initializeCart = async () => {
      try {
        // 1. Try Local Storage first (fastest)
        const localCartJson = localStorage.getItem('trueline_cart');
        const localCart = localCartJson ? JSON.parse(localCartJson) : [];

        if (localCart.length > 0) {
          setCart(localCart);
        }

        // 2. Check Auth & Sync with DB
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // A. MERGE STRATEGY: If we have local items, push them to DB first
          if (localCart.length > 0) {
            const itemsToMerge = localCart.map((item: any) => ({
              id: item.id,
              quantity: item.quantity
            }));

            // Ignore error on merge, proceed to fetch
            await supabase.rpc('merge_carts', { p_items: itemsToMerge }).catch(e => console.error(e));

            localStorage.removeItem('trueline_cart'); // Clear local after attempt
          }

          // B. Fetch Final Merged Cart
          const { data: dbItems, error } = await supabase
            .from('cart_items')
            .select('product_id, quantity, products(id, name, price, image_url, category)');

          if (!error && dbItems && dbItems.length > 0) {
            // Transform DB structure back to CartItem
            const mergedCart = dbItems.map((item: any) => ({
              id: item.products.id,
              name: item.products.name,
              price: item.products.price,
              image_url: item.products.image_url,
              quantity: item.quantity,
              category: item.products.category || 'Uncategorized'
            }));

            setCart(mergedCart);
          }
        }
      } catch (error) {
        console.error("Cart init error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCart();
  }, []);

  // Sync to LocalStorage on every change
  useEffect(() => {
    localStorage.setItem('trueline_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product: any) => {
    // 1. Optimistic Update (Functional for safety)
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
          quantity: 1,
          category: product.category || 'Uncategorized'
        }];
      }
    });

    // 2. DB Sync
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Safe Pattern: Fetch the LATEST quantity from the DB before upserting
      const { data: currentDbItem } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      // Calculate new quantity based on DB reality or fallback to 1
      const nextQty = (currentDbItem?.quantity || 0) + 1;

      await supabase.from('cart_items').upsert({
        user_id: user.id,
        product_id: product.id,
        quantity: nextQty
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    // DB Sync
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId);
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, totalItems, isLoading }}>
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
