'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { AuthProvider } from './AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Toaster position="top-right" />
          {children}
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
