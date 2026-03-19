'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';

const StoreCategoryProducts = dynamic(
  () =>
    import('admin-next/src/components/store/StoreCategoryProducts/StoreCategoryProducts').then(
      (m) => ({ default: m.StoreCategoryProducts })
    ),
  { ssr: false }
);

interface AllProductsClientProps {
  products: any[];
  categories: any[];
  subcategories: any[];
  childcategories: any[];
  brands: any[];
  tags: any[];
  websiteConfig: any;
  logo: string | null;
  initialCategory: string;
}

export default function AllProductsClient({
  products,
  categories,
  subcategories,
  childcategories,
  brands,
  tags,
  websiteConfig,
  logo,
  initialCategory,
}: AllProductsClientProps) {
  const handleProductClick = useCallback((product: any) => {
    const slug = product.slug || product._id || product.id;
    if (slug) window.location.href = `/products/${slug}`;
  }, []);

  const handleCategoryChange = useCallback((cat: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (cat) {
      params.set('category', cat);
    } else {
      params.delete('category');
    }
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `/all-products?${qs}` : '/all-products');
  }, []);

  const handleBack = useCallback(() => {
    window.location.href = '/';
  }, []);

  return (
    <StoreCategoryProducts
      products={products}
      categories={categories}
      subCategories={subcategories}
      childCategories={childcategories}
      brands={brands}
      tags={tags}
      selectedCategory={initialCategory}
      websiteConfig={websiteConfig}
      logo={logo}
      onCategoryChange={handleCategoryChange}
      onBack={handleBack}
      onHome={handleBack}
      onProductClick={handleProductClick}
      onBuyNow={handleProductClick}
      onAddToCart={() => {}}
      onOpenChat={() => {}}
    />
  );
}
