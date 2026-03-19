'use client';

import React from 'react';
import { ShoppingCart, User, Heart } from 'lucide-react';
import Link from 'next/link';

interface ActionButtonsProps {
  wishlistCount: number;
  cartCount: number;
  onWishlistClick: () => void;
  onCartClick: () => void;
  onUserClick: () => void;
  className?: string;
}

export default function ActionButtons({
  wishlistCount,
  cartCount,
  onWishlistClick,
  onCartClick,
  onUserClick,
  className = '',
}: ActionButtonsProps) {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <Link
        href="/all-products"
        className="text-gray-700 hover:text-primary transition-colors"
      >
        All Products
      </Link>
      <button
        onClick={onWishlistClick}
        className="relative text-gray-700 hover:text-primary transition-colors"
        title="Wishlist"
      >
        <Heart size={24} />
        {wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </button>
      <button
        onClick={onCartClick}
        className="relative text-gray-700 hover:text-primary transition-colors"
        title="Cart"
      >
        <ShoppingCart size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
      <button
        onClick={onUserClick}
        className="text-gray-700 hover:text-primary transition-colors"
        title="Account"
      >
        <User size={24} />
      </button>
    </div>
  );
}
