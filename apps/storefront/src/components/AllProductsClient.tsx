'use client';

import React, { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const StoreCategoryProducts = dynamic(
  () => import('admin-next/src/components/store/StoreCategoryProducts').then(m => ({ default: m.StoreCategoryProducts })),
  { ssr: false }
);

interface AllProductsClientProps {
  products: any[];
  categories: any[];
  subCategories: any[];
  childCategories: any[];
  brands: any[];
  tags: any[];
  websiteConfig: any;
  logo: string | null;
  tenantId: string;
}

export default function AllProductsClient({
  products,
  categories,
  subCategories,
  childCategories,
  brands,
  tags,
  websiteConfig,
  logo,
  tenantId,
}: AllProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

  const handleProductClick = useCallback((product: any) => {
    router.push(`/products/${product.slug || product._id}`);
  }, [router]);

  const handleCategoryChange = useCallback((categorySlug: string) => {
    if (categorySlug) {
      router.push(`/all-products?category=${categorySlug}`);
    } else {
      router.push('/all-products');
    }
  }, [router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleBuyNow = useCallback((product: any) => {
    router.push(`/products/${product.slug || product._id}`);
  }, [router]);

  return (
    <StoreCategoryProducts
      products={products}
      categories={categories}
      subCategories={subCategories}
      childCategories={childCategories}
      brands={brands}
      tags={tags}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      onBack={handleBack}
      onHome={handleHome}
      onProductClick={handleProductClick}
      onBuyNow={handleBuyNow}
      websiteConfig={websiteConfig}
      logo={logo}
    />
  );
}
