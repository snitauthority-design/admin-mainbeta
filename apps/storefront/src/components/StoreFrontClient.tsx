'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamically import admin-next store theme components
const GadgetsThemePage = dynamic(
  () => import('admin-next/src/components/store/GadgetsThemePage').then(m => ({ default: m.GadgetsThemePage })),
  { ssr: false }
);

const StoreFront2Page = dynamic(
  () => import('admin-next/src/components/store/StoreFront2Page').then(m => ({ default: m.StoreFront2Page })),
  { ssr: false }
);

const StoreFront2Neon = dynamic(
  () => import('admin-next/src/components/store/StoreFront2Variants').then(m => ({ default: m.StoreFront2Neon })),
  { ssr: false }
);

const StoreFront2Earth = dynamic(
  () => import('admin-next/src/components/store/StoreFront2Variants').then(m => ({ default: m.StoreFront2Earth })),
  { ssr: false }
);

const StoreFront2Pastel = dynamic(
  () => import('admin-next/src/components/store/StoreFront2Variants').then(m => ({ default: m.StoreFront2Pastel })),
  { ssr: false }
);

const StoreFront1Elegant = dynamic(
  () => import('admin-next/src/components/store/StoreFront1Variants').then(m => ({ default: m.StoreFront1Elegant })),
  { ssr: false }
);

const StoreFront1Bold = dynamic(
  () => import('admin-next/src/components/store/StoreFront1Variants').then(m => ({ default: m.StoreFront1Bold })),
  { ssr: false }
);

const StoreFront1Minimal = dynamic(
  () => import('admin-next/src/components/store/StoreFront1Variants').then(m => ({ default: m.StoreFront1Minimal })),
  { ssr: false }
);

const StoreFrontThemePage = dynamic(
  () => import('admin-next/src/components/store/StoreFrontThemePage').then(m => ({ default: m.StoreFrontThemePage })),
  { ssr: false }
);

interface StoreFrontClientProps {
  tenantId: string;
  products: any[];
  websiteConfig: any;
  categories: any[];
  subCategories?: any[];
  childCategories?: any[];
  brands: any[];
  tags: any[];
  logo: string | null;
}

export default function StoreFrontClient({
  tenantId,
  products,
  websiteConfig,
  categories,
  subCategories,
  childCategories,
  brands,
  tags,
  logo,
}: StoreFrontClientProps) {
  const router = useRouter();

  const handleProductClick = useCallback((product: any) => {
    router.push(`/products/${product.slug || product._id}`);
  }, [router]);

  const handleBuyNow = useCallback((product: any) => {
    router.push(`/products/${product.slug || product._id}`);
  }, [router]);

  const handleCategoryClick = useCallback((categorySlug: string) => {
    router.push(`/all-products?category=${categorySlug}`);
  }, [router]);

  const handleAddToCart = useCallback((product: any, quantity: number, variant: any) => {
    // Cart logic handled via CartContext in the product detail page
  }, []);

  const theme = websiteConfig?.readyTheme || '';
  const variant = websiteConfig?.readyThemeVariant || '';

  const commonProps = {
    products,
    categories,
    brands,
    websiteConfig,
    logo,
    tags,
    onProductClick: handleProductClick,
    onBuyNow: handleBuyNow,
    onAddToCart: handleAddToCart,
    onCategoryClick: handleCategoryClick,
  };

  // Route to the correct theme component based on readyTheme
  if (theme.startsWith('gadgets')) {
    return <GadgetsThemePage {...commonProps} />;
  }

  if (theme === 'storefront2') {
    if (variant === 'neon') return <StoreFront2Neon {...commonProps} />;
    if (variant === 'earth') return <StoreFront2Earth {...commonProps} />;
    if (variant === 'pastel') return <StoreFront2Pastel {...commonProps} />;
    return <StoreFront2Page {...commonProps} />;
  }

  if (theme === 'storefront1' || theme.startsWith('storefront')) {
    if (variant === 'elegant') return <StoreFront1Elegant {...commonProps} />;
    if (variant === 'bold') return <StoreFront1Bold {...commonProps} />;
    if (variant === 'minimal') return <StoreFront1Minimal {...commonProps} />;
    return <StoreFront1Elegant {...commonProps} />;
  }

  // Default theme
  return <StoreFrontThemePage {...commonProps} />;
}
