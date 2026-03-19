'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Search, ShoppingCart, User, Menu, X, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface StorefrontHeaderProps {
  logo?: string | null;
  websiteConfig?: any;
  categories?: Category[];
  tenantId?: string;
}

export default function StorefrontHeader({
  logo,
  websiteConfig,
  categories = [],
  tenantId,
}: StorefrontHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const storeName = websiteConfig?.websiteName || 'Store';
  const primaryColor = websiteConfig?.colors?.primary || '#4ea674';
  const headerStyle = websiteConfig?.headerStyle || 1;

  // Get top 6 categories for display
  const displayCategories = useMemo(() => categories.slice(0, 6), [categories]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/all-products?search=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      {/* Top bar with contact info */}
      {websiteConfig?.showTopBar !== false && (
        <div className="bg-gray-900 text-white text-xs py-2">
          <div className="max-w-[1400px] mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              {websiteConfig?.contactPhone && (
                <span className="flex items-center gap-1">
                  📞 {websiteConfig.contactPhone}
                </span>
              )}
              {websiteConfig?.contactEmail && (
                <span className="hidden sm:flex items-center gap-1">
                  ✉️ {websiteConfig.contactEmail}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link href="/track" className="hover:text-gray-300 transition-colors">
                Track Order
              </Link>
              <Link href="/about" className="hover:text-gray-300 transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              {logo ? (
                <div className="relative w-32 h-10 sm:w-40 sm:h-12">
                  <Image
                    src={logo}
                    alt={storeName}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 128px, 160px"
                    priority
                  />
                </div>
              ) : (
                <div className="text-xl sm:text-2xl font-bold" style={{ color: primaryColor }}>
                  {storeName}
                </div>
              )}
            </Link>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl mx-8"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  style={{ color: primaryColor }}
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/all-products"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                All Products
              </Link>
              <button
                className="relative text-gray-700 hover:text-primary transition-colors"
                title="Wishlist"
              >
                <Heart size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
              <button
                className="relative text-gray-700 hover:text-primary transition-colors"
                title="Cart"
              >
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
              <button
                className="text-gray-700 hover:text-primary transition-colors"
                title="Account"
              >
                <User size={24} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                style={{ color: primaryColor }}
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Desktop Categories */}
          {displayCategories.length > 0 && (
            <nav className="hidden md:flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
              {displayCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/all-products?category=${category.slug}`}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  {category.name}
                </Link>
              ))}
              {categories.length > 6 && (
                <Link
                  href="/all-products"
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  More...
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Actions */}
              <div className="flex items-center justify-around border-b border-gray-200 pb-4">
                <button className="flex flex-col items-center gap-1 text-gray-700">
                  <Heart size={24} />
                  <span className="text-xs">Wishlist</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-700">
                  <ShoppingCart size={24} />
                  <span className="text-xs">Cart</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-700">
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
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                  {categories.length > 6 && (
                    <Link
                      href="/all-products"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  href="/track"
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Track Order
                </Link>
                <Link
                  href="/about"
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
