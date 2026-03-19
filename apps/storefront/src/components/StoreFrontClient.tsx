'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';

// Import theme components from admin-next (transpiled via next.config.mjs)
const StoreFrontThemePage = dynamic(
  () =>
    import('admin-next/src/components/store/StoreFrontThemePage').then((m) => ({
      default: m.StoreFrontThemePage,
    })),
  { ssr: false }
);
const StoreFront2Page = dynamic(
  () =>
    import('admin-next/src/components/store/StoreFront2Page').then((m) => ({
      default: m.StoreFront2Page,
    })),
  { ssr: false }
);
const GadgetsThemePage = dynamic(
  () =>
    import('admin-next/src/components/store/GadgetsThemePage').then((m) => ({
      default: m.GadgetsThemePage,
    })),
  { ssr: false }
);

// StoreFront1 variants
const StoreFront1Elegant = dynamic(
  () =>
    import('admin-next/src/components/store/StoreFront1Variants').then(
      (m) => ({ default: m.StoreFront1Elegant })
    ),
  { ssr: false }
);
const StoreFront1Bold = dynamic(
  () =>
    import('admin-next/src/components/store/StoreFront1Variants').then(
      (m) => ({ default: m.StoreFront1Bold })
    ),
  { ssr: false }
);
const StoreFront1Minimal = dynamic(
  () =>
    import('admin-next/src/components/store/StoreFront1Variants').then(
      (m) => ({ default: m.StoreFront1Minimal })
    ),
  { ssr: false }
);

// StoreFront2 variants
const StoreFront2Neon = dynamic(
  () =>
    import('admin-next/src/components/store/StoreFront2Variants').then(
      (m) => ({ default: m.StoreFront2Neon })
    ),
  { ssr: false }
);
const StoreFront2Earth = dynamic(
  () =>
    import('admin-next/src/components/store/StoreFront2Variants').then(
      (m) => ({ default: m.StoreFront2Earth })
    ),
  { ssr: false }
);
const StoreFront2Pastel = dynamic(
  () =>
    import('admin-next/src/components/store/StoreFront2Variants').then(
      (m) => ({ default: m.StoreFront2Pastel })
    ),
  { ssr: false }
);

interface StoreFrontClientProps {
  products: any[];
  categories: any[];
  brands: any[];
  tags: any[];
  websiteConfig: any;
  logo: string | null;
}

export default function StoreFrontClient({
  products,
  categories,
  brands,
  tags,
  websiteConfig,
  logo,
}: StoreFrontClientProps) {
  const handleProductClick = useCallback((product: any) => {
    const slug = product.slug || product._id || product.id;
    if (slug) {
      window.location.href = `/products/${slug}`;
    }
  }, []);

  const handleBuyNow = useCallback((product: any) => {
    handleProductClick(product);
  }, [handleProductClick]);

  const handleAddToCart = useCallback(() => {
    // Cart functionality can be extended later
  }, []);

  const handleCategoryClick = useCallback(() => {
    // Category filtering can be extended later
  }, []);

  const handleOpenChat = useCallback(() => {
    // Chat functionality can be extended later
  }, []);

  // Common props shared by all theme components
  const themeProps = {
    products,
    categories,
    brands,
    websiteConfig,
    logo,
    onProductClick: handleProductClick,
    onBuyNow: handleBuyNow,
    onAddToCart: handleAddToCart,
    onCategoryClick: handleCategoryClick,
    onOpenChat: handleOpenChat,
  };

  const readyTheme = websiteConfig?.readyTheme || '';
  const readyThemeVariant = websiteConfig?.readyThemeVariant || '';

  // Gadgets theme
  if (readyTheme.startsWith('gadgets')) {
    return <GadgetsThemePage {...themeProps} tags={tags} />;
  }

  // StoreFront2 theme and variants
  if (readyTheme === 'storefront2') {
    if (readyThemeVariant === 'neon') return <StoreFront2Neon {...themeProps} />;
    if (readyThemeVariant === 'earth') return <StoreFront2Earth {...themeProps} />;
    if (readyThemeVariant === 'pastel') return <StoreFront2Pastel {...themeProps} />;
    return <StoreFront2Page {...themeProps} />;
  }

  // StoreFront1 theme and variants
  if (readyTheme === 'storefront1' || readyTheme.startsWith('storefront')) {
    if (readyThemeVariant === 'elegant') return <StoreFront1Elegant {...themeProps} />;
    if (readyThemeVariant === 'bold') return <StoreFront1Bold {...themeProps} />;
    if (readyThemeVariant === 'minimal') return <StoreFront1Minimal {...themeProps} />;
    return <StoreFrontThemePage {...themeProps} />;
  }

  // Default: use StoreFrontThemePage as the default theme
  return <StoreFrontThemePage {...themeProps} />;
}
