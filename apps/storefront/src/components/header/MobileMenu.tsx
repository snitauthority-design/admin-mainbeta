'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, User } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  categories: Category[];
  wishlistCount: number;
  cartCount: number;
  onClose: () => void;
  onWishlistClick: () => void;
  onCartClick: () => void;
  onUserClick: () => void;
  maxCategories?: number;
}

export default function MobileMenu({
  isOpen,
  categories,
  wishlistCount,
  cartCount,
  onClose,
  onWishlistClick,
  onCartClick,
  onUserClick,
  maxCategories = 6,
}: MobileMenuProps) {
  if (!isOpen) return null;

  const displayCategories = categories.slice(0, maxCategories);

  return (
    <div className="md:hidden border-t border-gray-200 bg-white">
      <div className="px-4 py-4 space-y-4">
        {/* Mobile Actions */}
        <div className="flex items-center justify-around border-b border-gray-200 pb-4">
          <button
            onClick={() => {
              onWishlistClick();
              onClose();
            }}
            className="flex flex-col items-center gap-1 text-gray-700"
          >
            <div className="relative">
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-xs">Wishlist</span>
          </button>
          <button
            onClick={() => {
              onCartClick();
              onClose();
            }}
            className="flex flex-col items-center gap-1 text-gray-700"
          >
            <div className="relative">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs">Cart</span>
          </button>
          <button
            onClick={() => {
              onUserClick();
              onClose();
            }}
            className="flex flex-col items-center gap-1 text-gray-700"
          >
            <User size={24} />
            <span className="text-xs">Account</span>
          </button>
        </div>

        {/* Mobile Categories */}
        {displayCategories.length > 0 && (
          <nav className="space-y-2">
            <div className="text-sm font-semibold text-gray-500 uppercase">Categories</div>
            {displayCategories.map((category) => (
              <Link
                key={category._id}
                href={`/all-products?category=${category.slug}`}
                className="block py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={onClose}
              >
                {category.name}
              </Link>
            ))}
            {categories.length > maxCategories && (
              <Link
                href="/all-products"
                className="block py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={onClose}
              >
                View All Categories
              </Link>
            )}
          </nav>
        )}

        {/* Mobile Links */}
        <div className="space-y-2 border-t border-gray-200 pt-4">
          <Link
            href="/all-products"
            className="block py-2 text-gray-700 hover:text-primary transition-colors"
            onClick={onClose}
          >
            All Products
          </Link>
          <Link
            href="/track"
            className="block py-2 text-gray-700 hover:text-primary transition-colors"
            onClick={onClose}
          >
            Track Order
          </Link>
          <Link
            href="/about"
            className="block py-2 text-gray-700 hover:text-primary transition-colors"
            onClick={onClose}
          >
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
}
