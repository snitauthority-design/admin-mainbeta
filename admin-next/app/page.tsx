'use client';

/**
 * Store Home Page - Main storefront
 * Maps to: / and /all-products
 */
import { Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from './providers';
import dynamic from 'next/dynamic';

// Standard dynamic import for a default export
const StoreHome = dynamic(() => import('@/views/StoreHome'));

// Named exports: wrap in { default } for next/dynamic
const MobileBottomNav = dynamic(() => 
  import('@/components/store/MobileBottomNav').then((m) => ({ default: m.MobileBottomNav }))
);

const StoreChatModal = dynamic(() => 
  import('@/components/store/StoreChatModal').then((m) => ({ default: m.StoreChatModal }))
);

const LoginModal = dynamic(() => 
  import('@/components/store/LoginModal').then((m) => ({ default: m.LoginModal }))
);

function StorePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="h-16 bg-white dark:bg-gray-800 shadow" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-72 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const app = useApp();

  const categoryFilter = searchParams.get('category');
  const brandFilter = searchParams.get('brand');
  const urlCategoryFilter = categoryFilter || (brandFilter ? `brand:${brandFilter}` : null);

  const handleProductClick = useCallback((product: any) => {
    if (product.slug) {
      router.push(`/product-details/${product.slug}`);
    }
  }, [router]);

  const handleCategoryFilterChange = useCallback((slug: string | null) => {
    if (slug) {
      if (slug === 'all') {
        router.push('/all-products');
      } else if (slug.startsWith('brand:')) {
        router.push(`/all-products?brand=${slug.replace('brand:', '')}`);
      } else {
        router.push(`/all-products?category=${slug}`);
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const handleToggleCart = useCallback((id: number) => {
    const product = app.products.find(p => p.id === id);
    if (product) app.handleCartToggle(product.id, { silent: false });
  }, [app]);

  if (app.isLoading) return <StorePageSkeleton />;

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

      <Suspense fallback={<StorePageSkeleton />}>
        <StoreHome
          products={app.products}
          orders={app.orders}
          tenantId={app.activeTenantId}
          onProductClick={handleProductClick}
          onQuickCheckout={app.handlers.handleCheckoutStart}
          wishlistCount={app.wishlist.length}
          wishlist={app.wishlist}
          onToggleWishlist={(id: number) =>
            app.handlers.isInWishlist(id) ? app.handlers.removeFromWishlist(id) : app.handlers.addToWishlist(id)
          }
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
          onToggleCart={handleToggleCart}
          onCheckoutFromCart={app.handlers.handleCheckoutFromCart}
          onAddToCart={app.handleAddProductToCart}
          categories={app.categories}
          subCategories={app.subCategories}
          childCategories={app.childCategories}
          brands={app.brands}
          tags={app.tags}
          initialCategoryFilter={urlCategoryFilter}
          onCategoryFilterChange={handleCategoryFilterChange}
          onMobileMenuOpenRef={() => {}}
          onCartOpenRef={() => {}}
        />
      </Suspense>

      <Suspense fallback={null}>
        <MobileBottomNav
          onHomeClick={() => { window.scrollTo(0, 0); }}
          onCartClick={() => {}}
          onAccountClick={() => app.user ? router.push('/profile') : app.setIsLoginOpen(true)}
          onMenuClick={() => router.push('/categories')}
          cartCount={app.cartItems.length}
          websiteConfig={app.websiteConfig}
          onChatClick={app.handleOpenChat}
          user={app.user}
          onLogoutClick={app.handleLogout}
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
