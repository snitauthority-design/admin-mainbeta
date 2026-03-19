'use client';

import React, { useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import SearchBar from './header/SearchBar';
import Logo from './header/Logo';
import ActionButtons from './header/ActionButtons';
import TopBar from './header/TopBar';
import CategoryNav from './header/CategoryNav';
import MobileMenu from './header/MobileMenu';

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
  const { totalItems: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const storeName = websiteConfig?.websiteName || 'Store';
  const primaryColor = websiteConfig?.colors?.primary || '#4ea674';

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/all-products?search=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleWishlistClick = useCallback(() => {
    // TODO: Open wishlist modal/page
    window.location.href = '/wishlist';
  }, []);

  const handleCartClick = useCallback(() => {
    // TODO: Open cart modal/page
    window.location.href = '/cart';
  }, []);

  const handleUserClick = useCallback(() => {
    // TODO: Open auth modal/page
    window.location.href = '/account';
  }, []);

  return (
    <>
      <TopBar
        contactPhone={websiteConfig?.contactPhone}
        contactEmail={websiteConfig?.contactEmail}
        show={websiteConfig?.showTopBar !== false}
      />

      {/* Main header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Logo logo={logo} storeName={storeName} primaryColor={primaryColor} />

            {/* Desktop Search */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl mx-8"
              primaryColor={primaryColor}
            />

            {/* Desktop Actions */}
            <ActionButtons
              wishlistCount={wishlistCount}
              cartCount={cartCount}
              onWishlistClick={handleWishlistClick}
              onCartClick={handleCartClick}
              onUserClick={handleUserClick}
              className="hidden md:flex"
            />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Search */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            className="md:hidden mt-4"
            primaryColor={primaryColor}
          />

          {/* Desktop Categories */}
          <CategoryNav
            categories={categories}
            maxDisplay={6}
            className="hidden md:flex mt-4 pt-4 border-t border-gray-200"
          />
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          categories={categories}
          wishlistCount={wishlistCount}
          cartCount={cartCount}
          onClose={toggleMobileMenu}
          onWishlistClick={handleWishlistClick}
          onCartClick={handleCartClick}
          onUserClick={handleUserClick}
        />
      </header>
    </>
  );
}
