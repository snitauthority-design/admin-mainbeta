'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface WishlistContextType {
  items: string[]; // Product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = useCallback((productId: string) => {
    setItems((prevItems) => {
      if (prevItems.includes(productId)) {
        return prevItems;
      }
      return [...prevItems, productId];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((id) => id !== productId));
  }, []);

  const toggleItem = useCallback((productId: string) => {
    setItems((prevItems) => {
      if (prevItems.includes(productId)) {
        return prevItems.filter((id) => id !== productId);
      }
      return [...prevItems, productId];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist,
        count: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
