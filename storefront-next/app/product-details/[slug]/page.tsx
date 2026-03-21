'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useApp } from '../../providers';

const StoreProductDetail = dynamic(() => import('@/views/StoreProductDetail'), { ssr: false });
const LoginModal = dynamic(() => import('@/components/store/LoginModal').then(m => ({ default: m.LoginModal })), { ssr: false });
const StoreChatModal = dynamic(() => import('@/components/store/StoreChatModal').then(m => ({ default: m.StoreChatModal })), { ssr: false });

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="h-16 bg-white dark:bg-gray-800 shadow" />
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const app = useApp();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const isCatalogPending = app.isLoading || !app.activeTenantId;

  const product = useMemo(() => {
    if (!slug) return null;

    return app.products.find(p => p.slug === slug)
      || (!Number.isNaN(Number(slug)) ? app.products.find(p => p.id === Number(slug)) : null)
      || null;
  }, [app.products, slug]);

  useEffect(() => {
    if (product && app.selectedProduct?.id !== product.id) {
      app.setSelectedProduct(product);
    }
  }, [app, product]);

  if (isCatalogPending) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">Product not found</h1>
          <p className="mt-3 text-sm text-gray-500">
            This product is not available in the current shop catalog.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => router.push('/all-products')}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              View products
            </button>
            <button
              onClick={() => router.push('/')}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {app.isLoginOpen && (
        <Suspense fallback={null}>
          <LoginModal
            onClose={() => app.setIsLoginOpen(false)}
            onLogin={app.handleLogin}
            onRegister={app.handleRegister}
            onGoogleLogin={app.handleGoogleLogin}
          />
        </Suspense>
      )}

      <Suspense fallback={<ProductDetailSkeleton />}>
        <StoreProductDetail
          product={product}
          orders={app.orders}
          tenantId={app.activeTenantId}
          onBack={() => router.back()}
          onProductClick={(p: any) => p.slug && router.push(`/product-details/${p.slug}`)}
          wishlistCount={app.wishlist.length}
          isWishlisted={app.handlers.isInWishlist(product.id)}
          onToggleWishlist={() =>
            app.handlers.isInWishlist(product.id)
              ? app.handlers.removeFromWishlist(product.id)
              : app.handlers.addToWishlist(product.id)
          }
          onCheckout={app.handlers.handleCheckoutStart}
          user={app.user}
          onLoginClick={() => app.setIsLoginOpen(true)}
          onLogoutClick={app.handleLogout}
          onProfileClick={() => router.push('/profile')}
          logo={app.logo}
          websiteConfig={app.websiteConfig}
          searchValue=""
          onSearchChange={() => {}}
          onOpenChat={app.handleOpenChat}
          cart={app.cartItems}
          onToggleCart={(id: number) => {
            const nextProduct = app.products.find(p => p.id === id);
            if (nextProduct) app.handleCartToggle(nextProduct.id, { silent: false });
          }}
          onCheckoutFromCart={app.handlers.handleCheckoutFromCart}
          onAddToCart={(nextProduct: any, quantity: number, variant: any) =>
            app.handleAddProductToCart(nextProduct, quantity, variant, { silent: true })
          }
          productCatalog={app.products}
          categories={app.categories}
          onCategoryClick={(categorySlug: string) => router.push(`/all-products?category=${categorySlug}`)}
        />
      </Suspense>

      <Suspense fallback={null}>
        <StoreChatModal
          isOpen={app.isChatOpen}
          onClose={app.handleCloseChat}
          tenantId={app.activeTenantId}
          websiteConfig={app.websiteConfig}
          user={app.user}
          messages={app.chatMessages}
          onSendMessage={app.handleCustomerSendChat}
          context="customer"
          onEditMessage={app.handleEditChatMessage}
          onDeleteMessage={app.handleDeleteChatMessage}
          onLoginClick={() => app.setIsLoginOpen(true)}
        />
      </Suspense>
    </>
  );
}