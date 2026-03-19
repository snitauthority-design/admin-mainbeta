'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, ShoppingCart, Heart, User, Home } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface StorefrontHeaderProps {
  categories: any[];
  websiteConfig: any;
  logo: string | null;
}

export default function StorefrontHeader({ categories, websiteConfig, logo }: StorefrontHeaderProps) {
  const router = useRouter();
  const { totalItems: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const storeName = websiteConfig?.storeName || websiteConfig?.websiteName || 'Store';

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  const maxCategories = 6;
  const displayCategories = categories.slice(0, maxCategories);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      {websiteConfig?.phones?.[0] && (
        <div className="hidden md:block bg-gray-100 text-xs text-gray-600">
          <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {websiteConfig.phones[0] && <span>📞 {websiteConfig.phones[0]}</span>}
              {websiteConfig.emails?.[0] && <span>✉️ {websiteConfig.emails[0]}</span>}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/track-order')} className="hover:text-blue-600 transition-colors">
                Track Order
              </button>
              <button onClick={() => router.push('/about')} className="hover:text-blue-600 transition-colors">
                About
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => router.push('/')} className="flex-shrink-0">
            {logo ? (
              <img src={logo} alt={storeName} className="h-10 md:h-12 w-auto object-contain" />
            ) : (
              <span className="text-xl font-bold text-gray-900">{storeName}</span>
            )}
          </button>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </form>

          {/* Action buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => router.push('/all-products')}
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              All Products
            </button>
            <button onClick={() => router.push('/wishlist')} className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button onClick={() => router.push('/cart')} className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => router.push('/account')} className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <User size={22} />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Search - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </form>
      </div>

      {/* Category nav - Desktop */}
      {displayCategories.length > 0 && (
        <nav className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 text-sm">
            {displayCategories.map((cat: any) => (
              <button
                key={cat._id || cat.slug}
                onClick={() => router.push(`/all-products?category=${cat.slug}`)}
                className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}
            {categories.length > maxCategories && (
              <button
                onClick={() => router.push('/all-products')}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                More...
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            {/* Mobile actions */}
            <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
              <button onClick={() => { router.push('/'); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm text-gray-700">
                <Home size={18} /> Home
              </button>
              <button onClick={() => { router.push('/wishlist'); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm text-gray-700">
                <Heart size={18} /> Wishlist ({wishlistCount})
              </button>
              <button onClick={() => { router.push('/cart'); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm text-gray-700">
                <ShoppingCart size={18} /> Cart ({cartCount})
              </button>
              <button onClick={() => { router.push('/account'); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm text-gray-700">
                <User size={18} /> Account
              </button>
            </div>

            {/* Mobile categories */}
            <div className="space-y-1">
              <button
                onClick={() => { router.push('/all-products'); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-sm font-medium text-blue-600"
              >
                All Products
              </button>
              {displayCategories.map((cat: any) => (
                <button
                  key={cat._id || cat.slug}
                  onClick={() => { router.push(`/all-products?category=${cat.slug}`); setMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 text-sm text-gray-700 hover:text-blue-600"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Mobile links */}
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <button onClick={() => { router.push('/track-order'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm text-gray-700">
                Track Order
              </button>
              <button onClick={() => { router.push('/about'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm text-gray-700">
                About
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
