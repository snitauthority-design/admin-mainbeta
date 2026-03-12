/**
 * AppRoutes.tsx - All view rendering logic extracted from App.tsx
 */
import React, { Suspense, lazy } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import type {
  Product, Order, ThemeConfig, WebsiteConfig, DeliveryConfig,
  ProductVariantSelection, LandingPage, FacebookPixelConfig, CourierConfig,
  Category, SubCategory, ChildCategory, Brand, Tag, User, ChatMessage, PaymentMethod
} from '../types';
import type { ViewState } from '../hooks/useNavigation';
import { isAdminSubdomain, isTenantLoginPortal } from '../hooks/useNavigation';
import { SuperAdminDashboardSkeleton, StorePageSkeleton, ProductDetailSkeleton, RegistrationPageSkeleton } from './SkeletonLoaders';
import { ensureVariantSelection, isAdminRole } from '../utils/appHelpers';

// Lazy load pages - loaded on demand when view changes
const StoreHome = lazy(() => import('../pages/StoreHome'));
const StoreProductDetail = lazy(() => import('../pages/StoreProductDetail'));
const StoreCheckout = lazy(() => import('../pages/StoreCheckout'));
const StoreOrderSuccess = lazy(() => import('../pages/StoreOrderSuccess'));
const StoreProfile = lazy(() => import('../pages/StoreProfile'));
const LandingPagePreview = lazy(() => import('../pages/LandingPagePreview'));
const PublicOfferPage = lazy(() => import('../pages/PublicOfferPage'));
const SuperAdminDashboard = lazy(() => import('../pages/SuperAdminDashboard'));
const AdminLogin = lazy(() => import('../pages/AdminLogin'));
const AdminAppWithAuth = lazy(() => import('../pages/AdminAppWithAuth'));
const MobileBottomNav = lazy(() => import('./store/MobileBottomNav').then(m => ({ default: m.MobileBottomNav })));
const StoreChatModal = lazy(() => import('./store/StoreChatModal').then(m => ({ default: m.StoreChatModal })));

// TenantRegistration - Completely isolated lazy load
// This component is ONLY loaded when user navigates to /register URL
// It will NOT be loaded for shop/subdomain/main domain visits
const TenantRegistration = lazy(() => 
  import(/* webpackChunkName: "tenant-registration" */ '../pages/TenantRegistration')
);
const StaticPage = lazy(() => import('../pages/StaticPage'));

interface AppRoutesProps {
  currentView: string;
  isSuperAdminSubdomain: boolean;
  
  // Data
  products: Product[];
  orders: Order[];
  logo: string | null;
  themeConfig: ThemeConfig | null;
  websiteConfig: WebsiteConfig | undefined;
  deliveryConfig: DeliveryConfig[];
  paymentMethods: PaymentMethod[];
  courierConfig: CourierConfig;
  facebookPixelConfig: FacebookPixelConfig;
  categories: Category[];
  subCategories: SubCategory[];
  childCategories: ChildCategory[];
  brands: Brand[];
  tags: Tag[];
  chatMessages: ChatMessage[];
 
  
  // User & Auth
  user: User | null;
  wishlist: number[];
  cartItems: any[];
  
  // Selected items
  selectedProduct: Product | null;
  selectedLandingPage: LandingPage | null;
  selectedVariant: ProductVariantSelection | null;
  checkoutQuantity: number;
  
  // Search
  storeSearchQuery: string;
  urlCategoryFilter: string | null;
  
  // Tenant
  activeTenantId: string;
  headerTenants: any[];
  isTenantSwitching: boolean;
  isTenantSeeding: boolean;
  deletingTenantId: string | null;
  
  // Chat state
  isChatOpen: boolean;
  isAdminChatOpen: boolean;
  hasUnreadChat: boolean;
  canAccessAdminChat: boolean;
  // Handlers
  onProductClick: (product: Product) => void;
  onQuickCheckout: (product: Product, quantity: number, variant?: ProductVariantSelection) => void;
  onToggleWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  onLogin: (email: string, password: string) => Promise<any>;
  onRegister: (newUser: User) => Promise<boolean>;
  onGoogleLogin: () => Promise<any>;
  onLogout: () => void;
  onUpdateProfile: (updatedUser: User) => void;
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onBulkDeleteProducts: (ids: number[]) => void;
  onBulkUpdateProducts: (ids: number[], updates: Partial<Product>) => void;
  onBulkFlashSale: (ids: number[], action: 'add' | 'remove') => void;
  onBulkAddProducts: (products: Product[]) => void;
  onProductOrderChange?: (order: number[]) => Promise<void>;
  onUpdateLogo: (logo: string | null) => void;
  onUpdateTheme: (config: ThemeConfig) => Promise<void>;
  onUpdateWebsiteConfig: (config: WebsiteConfig) => Promise<void>;
  onUpdateDeliveryConfig: (configs: DeliveryConfig[]) => void;
  onUpdatePaymentMethods: (methods: PaymentMethod[]) => void;
  onUpdateCourierConfig: (config: CourierConfig) => void;
  onUpdateFacebookPixelConfig: (config: FacebookPixelConfig) => void;
  onPlaceOrder: (formData: any) => Promise<void>;
  onLandingOrderSubmit: (payload: any) => Promise<void>;
  onCloseLandingPreview: () => void;
  onTenantChange: (tenantId: string) => void;
  onCreateTenant: (payload: any, options?: { activate?: boolean }) => Promise<any>;
  onDeleteTenant: (tenantId: string) => Promise<void>;
  onRefreshTenants: () => Promise<any>;
  onSearchChange: (query: string) => void;
  onCategoryFilterChange: (category: string | null) => void;
  onMobileMenuOpenRef: (fn: () => void) => void;
  
  // Cart handlers
  onToggleCart: (product: Product, quantity: number, variant?: ProductVariantSelection) => void;
  onCheckoutFromCart: (productId: number) => void;
  onAddToCart: (product: Product, quantity: number, variant?: ProductVariantSelection, options?: { silent?: boolean }) => void;
  
  // Chat handlers
  onOpenChat: () => void;
  onCloseChat: () => void;
  onOpenAdminChat: () => void;
  onCloseAdminChat: () => void;
  onCustomerSendChat: (message: string) => void;
  onAdminSendChat: (message: string, replyTarget?: { customerEmail?: string; guestSessionId?: string }) => void;
  onEditChatMessage: (messageId: string, newText: string) => void;
  onDeleteChatMessage: (messageId: string) => void;
  
  // View setters
  setCurrentView: (view: ViewState) => void;
  setUser: (user: User | null) => void;
  setIsLoginOpen: (open: boolean) => void;
  
  // Landing pages
  landingPages: LandingPage[];
  onCreateLandingPage: (page: any) => void;
  onUpsertLandingPage: (page: any) => void;
  onToggleLandingPublish: (pageId: string, status: string) => void;

  // Order management
  onAddOrder?: (order: Order) => void;

  // Login modal
  isLoginOpen: boolean;
}

// Login Modal component (lazy loaded separately)
const LoginModal = lazy(() => import('./store/LoginModal').then(m => ({ default: m.LoginModal })));

export const AppRoutes: React.FC<AppRoutesProps> = (props) => {
  const navigate = useNavigate();
  const {
    currentView,
    isSuperAdminSubdomain,
    products,
    orders,
    logo,
    themeConfig,
    websiteConfig,
    deliveryConfig,
    paymentMethods,
    courierConfig,
    facebookPixelConfig,
    categories,
    subCategories,
    childCategories,
    brands,
    tags,
    chatMessages,
    user,
    wishlist,
    cartItems,
    selectedProduct,
    selectedLandingPage,
    selectedVariant,
    checkoutQuantity,
    storeSearchQuery,
    urlCategoryFilter,
    activeTenantId,
    headerTenants,
    isTenantSwitching,
    isTenantSeeding,
    deletingTenantId,
    isChatOpen,
    isAdminChatOpen,
    hasUnreadChat,
    canAccessAdminChat,
    onProductClick,
    onQuickCheckout,
    onToggleWishlist,
    isInWishlist,
    onLogin,
    onRegister,
    onGoogleLogin,
    onLogout,
    onUpdateProfile,
    onUpdateOrder,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onBulkDeleteProducts,
    onBulkUpdateProducts,
    onBulkFlashSale,
    onBulkAddProducts,
    onProductOrderChange,
    onUpdateLogo,
    onUpdateTheme,
    onUpdateWebsiteConfig,
    onUpdateDeliveryConfig,
    onUpdatePaymentMethods,
    onUpdateCourierConfig,
    onUpdateFacebookPixelConfig,
    onPlaceOrder,
    onLandingOrderSubmit,
    onCloseLandingPreview,
    onTenantChange,
    onCreateTenant,
    onDeleteTenant,
    onRefreshTenants,
    onSearchChange,
    onCategoryFilterChange,
    onMobileMenuOpenRef,
    onToggleCart,
    onCheckoutFromCart,
    onAddToCart,
    onOpenChat,
    onCloseChat,
    onOpenAdminChat,
    onCloseAdminChat,
    onCustomerSendChat,
    onAdminSendChat,
    onEditChatMessage,
    onDeleteChatMessage,
    setCurrentView,
    setUser,
    setIsLoginOpen,
    isLoginOpen,
    landingPages,
    onCreateLandingPage,
    onUpsertLandingPage,
    onToggleLandingPublish,
    onAddOrder,
  } = props;

  const mobileMenuOpenFnRef = React.useRef<(() => void) | null>(null);
  const cartOpenFnRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    if (onMobileMenuOpenRef) {
      onMobileMenuOpenRef(() => mobileMenuOpenFnRef.current?.());
    }
  }, [onMobileMenuOpenRef]);

  // Static page paths for route matching
  const staticPagePaths = [
    'privacy', 'privacy-policy', 'about', 'about-us', 'terms', 'terms-and-conditions',
    'termsnconditions', 'returnpolicy', 'return-policy', 'refund', 'refund-policy'
  ];

  // ── Reusable elements ──

  const loginModalElement = isLoginOpen ? (
    <Suspense fallback={null}>
      <LoginModal
        onClose={() => setIsLoginOpen(false)}
        onLogin={onLogin}
        onRegister={onRegister}
        onGoogleLogin={onGoogleLogin}
      />
    </Suspense>
  ) : null;

  const adminLoginElement = (
    <Suspense fallback={null}>
      <AdminLogin
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          if (loggedUser.role === 'super_admin' && isSuperAdminSubdomain) {
            setCurrentView('super-admin');
          } else {
            setCurrentView('admin');
          }
        }}
      />
    </Suspense>
  );

  const adminAppElement = (
    <Suspense fallback={null}>
      <AdminAppWithAuth
        activeTenantId={activeTenantId}
        tenants={headerTenants}
        orders={orders}
        products={products}
        logo={logo}
        themeConfig={themeConfig}
        websiteConfig={websiteConfig}
        deliveryConfig={deliveryConfig}
        paymentMethods={paymentMethods}
        courierConfig={courierConfig}
        facebookPixelConfig={facebookPixelConfig}
        chatMessages={chatMessages}
        parentUser={user}
        onLogout={onLogout}
        onUpdateOrder={onUpdateOrder}
        onAddProduct={onAddProduct}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
        onBulkDeleteProducts={onBulkDeleteProducts}
        onBulkUpdateProducts={onBulkUpdateProducts}
        onBulkFlashSale={onBulkFlashSale}
        onBulkAddProducts={onBulkAddProducts}
        onProductOrderChange={onProductOrderChange}
        onUpdateLogo={onUpdateLogo}
        onUpdateTheme={onUpdateTheme}
        onUpdateWebsiteConfig={onUpdateWebsiteConfig}
        onUpdateDeliveryConfig={onUpdateDeliveryConfig}
        onUpdatePaymentMethods={onUpdatePaymentMethods}
        onUpdateCourierConfig={onUpdateCourierConfig}
        onUpdateFacebookPixelConfig={onUpdateFacebookPixelConfig}
        onUpdateProfile={onUpdateProfile}
        onTenantChange={onTenantChange}
        onCreateTenant={onCreateTenant}
        onDeleteTenant={onDeleteTenant}
        onRefreshTenants={onRefreshTenants}
        isTenantSwitching={isTenantSwitching}
        onSwitchToStore={() => setCurrentView('store')}
        onOpenAdminChat={onOpenAdminChat}
        hasUnreadChat={hasUnreadChat}
        landingPages={landingPages}
        onCreateLandingPage={onCreateLandingPage}
        onUpsertLandingPage={onUpsertLandingPage}
        onToggleLandingPublish={onToggleLandingPublish}
        onAddOrder={onAddOrder}
      />
    </Suspense>
  );

  const toggleCartHandler = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) onToggleCart(product, 1);
  };

  const storeHomeElement = (
    <Suspense fallback={<StorePageSkeleton />}>
      <StoreHome
        products={products}
        orders={orders}
        tenantId={activeTenantId}
        onProductClick={onProductClick}
        onQuickCheckout={onQuickCheckout}
        wishlistCount={wishlist.length}
        wishlist={wishlist}
        onToggleWishlist={(id) => onToggleWishlist(id)}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={onLogout}
        onProfileClick={() => setCurrentView('profile')}
        logo={logo}
        websiteConfig={websiteConfig}
        searchValue={storeSearchQuery}
        onSearchChange={onSearchChange}
        onOpenChat={onOpenChat}
        cart={cartItems}
        onToggleCart={toggleCartHandler}
        onCheckoutFromCart={onCheckoutFromCart}
        onAddToCart={onAddToCart}
        categories={categories}
        subCategories={subCategories}
        childCategories={childCategories}
        brands={brands}
        tags={tags}
        initialCategoryFilter={urlCategoryFilter}
        onCategoryFilterChange={onCategoryFilterChange}
        onMobileMenuOpenRef={(fn) => { mobileMenuOpenFnRef.current = fn; }}
        onCartOpenRef={(fn) => { cartOpenFnRef.current = fn; }}
      />
    </Suspense>
  );

  const productDetailElement = selectedProduct ? (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <StoreProductDetail
        product={selectedProduct}
        orders={orders}
        tenantId={activeTenantId}
        onBack={() => { navigate('/', { replace: true }); setCurrentView('store'); }}
        onProductClick={onProductClick}
        wishlistCount={wishlist.length}
        isWishlisted={isInWishlist(selectedProduct.id)}
        onToggleWishlist={() => onToggleWishlist(selectedProduct.id)}
        onCheckout={onQuickCheckout}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={onLogout}
        onProfileClick={() => setCurrentView('profile')}
        logo={logo}
        websiteConfig={websiteConfig}
        searchValue={storeSearchQuery}
        onSearchChange={onSearchChange}
        onOpenChat={onOpenChat}
        cart={cartItems}
        onToggleCart={toggleCartHandler}
        onCheckoutFromCart={onCheckoutFromCart}
        onAddToCart={(product, quantity, variant) => onAddToCart(product, quantity, variant, { silent: true })}
        productCatalog={products}
        categories={categories}
        onCategoryClick={onCategoryFilterChange}
      />
    </Suspense>
  ) : <ProductDetailSkeleton />;

  const staticPageElement = (
    <Suspense fallback={<StorePageSkeleton />}>
      <StaticPage
        products={products}
        orders={orders}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={onLogout}
        onProfileClick={() => setCurrentView('profile')}
        logo={logo}
        tenantId={activeTenantId}
        websiteConfig={websiteConfig}
        searchValue={storeSearchQuery}
        onSearchChange={onSearchChange}
        onOpenChat={onOpenChat}
        onProductClick={onProductClick}
        wishlistCount={wishlist.length}
        wishlist={wishlist}
        onToggleWishlist={(id) => onToggleWishlist(id)}
        cart={cartItems}
        onToggleCart={toggleCartHandler}
        onCheckoutFromCart={onCheckoutFromCart}
        categories={categories}
        subCategories={subCategories}
        childCategories={childCategories}
        brands={brands}
        tags={tags}
      />
    </Suspense>
  );

  const storeChatElement = (
    <Suspense fallback={null}>
      <StoreChatModal
        isOpen={isChatOpen}
        onClose={onCloseChat}
        tenantId={activeTenantId}
        websiteConfig={websiteConfig}
        themeConfig={themeConfig ?? undefined}
        user={user}
        messages={chatMessages}
        onSendMessage={onCustomerSendChat}
        context="customer"
        onEditMessage={onEditChatMessage}
        onDeleteMessage={onDeleteChatMessage}
        onLoginClick={() => setIsLoginOpen(true)}
      />
    </Suspense>
  );

  const adminChatElement = canAccessAdminChat ? (
    <Suspense fallback={null}>
      <StoreChatModal
        isOpen={Boolean(isAdminChatOpen && currentView.startsWith('admin'))}
        onClose={onCloseAdminChat}
        tenantId={activeTenantId}
        websiteConfig={websiteConfig}
        themeConfig={themeConfig ?? undefined}
        user={user}
        messages={chatMessages}
        onSendMessage={onAdminSendChat}
        context="admin"
        onEditMessage={onEditChatMessage}
        onDeleteMessage={onDeleteChatMessage}
        canDeleteAll
      />
    </Suspense>
  ) : null;

  const mobileNavElement = (activeTab?: string) => (
    <Suspense fallback={null}>
      <MobileBottomNav
        onHomeClick={() => { setCurrentView('store'); window.scrollTo(0, 0); }}
        onCartClick={() => cartOpenFnRef.current?.()}
        onAccountClick={() => user ? setCurrentView('profile') : setIsLoginOpen(true)}
        onMenuClick={() => mobileMenuOpenFnRef.current?.()}
        cartCount={cartItems.length}
        websiteConfig={websiteConfig}
        onChatClick={onOpenChat}
        user={user}
        onLogoutClick={onLogout}
        activeTab={activeTab}
      />
    </Suspense>
  );

  // ── Super admin subdomain ──
  if (isSuperAdminSubdomain) {
    return (
      <>
        {loginModalElement}
        <Routes>
          <Route path="/admin/login" element={adminLoginElement} />
          <Route path="*" element={
            user?.role === 'super_admin' ? (
              <Suspense fallback={<SuperAdminDashboardSkeleton />}>
                <SuperAdminDashboard />
              </Suspense>
            ) : adminLoginElement
          } />
        </Routes>
        {adminChatElement}
      </>
    );
  }

  // ── Admin subdomain / tenant login portal ──
  if (isAdminSubdomain || isTenantLoginPortal) {
    return (
      <>
        {loginModalElement}
        <Routes>
          <Route path="/admin/login" element={adminLoginElement} />
          <Route path="*" element={isAdminRole(user?.role) ? adminAppElement : adminLoginElement} />
        </Routes>
        {adminChatElement}
      </>
    );
  }

  // ── Standard tenant/store routing ──
  return (
    <>
      {loginModalElement}

      <Routes>
        {/* Registration */}
        <Route path="/register" element={
          <Suspense fallback={<RegistrationPageSkeleton />}>
            <TenantRegistration />
          </Suspense>
        } />

        {/* Admin */}
        <Route path="/admin/login" element={adminLoginElement} />
        <Route path="/admin/*" element={isAdminRole(user?.role) ? adminAppElement : adminLoginElement} />

        {/* Product Detail */}
        <Route path="/product-details/:slug" element={productDetailElement} />

        {/* Checkout */}
        <Route path="/checkout" element={
          selectedProduct ? (
            <Suspense fallback={null}>
              <StoreCheckout
                product={selectedProduct}
                quantity={checkoutQuantity}
                variant={selectedVariant || ensureVariantSelection(selectedProduct)}
                onBack={() => navigate(-1)}
                onConfirmOrder={onPlaceOrder}
                user={user}
                onLoginClick={() => setIsLoginOpen(true)}
                onLogoutClick={onLogout}
                onProfileClick={() => setCurrentView('profile')}
                logo={logo}
                tenantId={activeTenantId}
                websiteConfig={websiteConfig}
                deliveryConfigs={deliveryConfig}
                paymentMethods={paymentMethods}
                searchValue={storeSearchQuery}
                onSearchChange={onSearchChange}
                onOpenChat={onOpenChat}
                cart={cartItems}
                onToggleCart={toggleCartHandler}
                onCheckoutFromCart={onCheckoutFromCart}
                productCatalog={products}
                orders={orders}
              />
            </Suspense>
          ) : <StorePageSkeleton />
        } />

        {/* Order Success */}
        <Route path="/success-order" element={
          <Suspense fallback={null}>
            <StoreOrderSuccess
              onHome={() => setCurrentView('store')}
              user={user}
              onLoginClick={() => setIsLoginOpen(true)}
              onLogoutClick={onLogout}
              onProfileClick={() => setCurrentView('profile')}
              logo={logo}
              tenantId={activeTenantId}
              websiteConfig={websiteConfig}
              searchValue={storeSearchQuery}
              onSearchChange={onSearchChange}
              onOpenChat={onOpenChat}
              cart={cartItems}
              onToggleCart={toggleCartHandler}
              onCheckoutFromCart={onCheckoutFromCart}
              productCatalog={products}
              orders={orders}
            />
          </Suspense>
        } />

        {/* Profile */}
        <Route path="/profile" element={
          user ? (
            <Suspense fallback={null}>
              <>
                <StoreProfile
                  user={user}
                  onUpdateProfile={onUpdateProfile}
                  orders={orders}
                  onHome={() => setCurrentView('store')}
                  onLoginClick={() => setIsLoginOpen(true)}
                  onLogoutClick={onLogout}
                  logo={logo}
                  tenantId={activeTenantId}
                  websiteConfig={websiteConfig}
                  searchValue={storeSearchQuery}
                  onSearchChange={onSearchChange}
                  onOpenChat={onOpenChat}
                  cart={cartItems}
                  onToggleCart={toggleCartHandler}
                  onCheckoutFromCart={onCheckoutFromCart}
                  productCatalog={products}
                  onCartOpenRef={(fn) => { cartOpenFnRef.current = fn; }}
                />
                {mobileNavElement('account')}
              </>
            </Suspense>
          ) : <StorePageSkeleton />
        } />

        {/* Landing Page Preview */}
        <Route path="/p/:slug" element={
          selectedLandingPage ? (
            <Suspense fallback={null}>
              <LandingPagePreview
                page={selectedLandingPage}
                product={selectedLandingPage.productId ? products.find(p => p.id === selectedLandingPage.productId) : undefined}
                onBack={onCloseLandingPreview}
                onSubmitLandingOrder={onLandingOrderSubmit}
              />
            </Suspense>
          ) : <StorePageSkeleton />
        } />

        {/* Offer Page */}
        <Route path="/offer/:slug" element={
          <Suspense fallback={null}>
            <PublicOfferPage websiteConfig={websiteConfig} />
          </Suspense>
        } />

        {/* All Products */}
        <Route path="/all-products" element={storeHomeElement} />

        {/* Static Pages */}
        {staticPagePaths.map(pagePath => (
          <Route key={pagePath} path={`/${pagePath}`} element={staticPageElement} />
        ))}

        {/* Home */}
        <Route path="/" element={storeHomeElement} />

        {/* Catch-all: dynamic product slugs, landing pages, or fallback to store */}
        <Route path="*" element={
          currentView === 'detail' && selectedProduct ? productDetailElement
          : currentView === 'landing_preview' && selectedLandingPage ? (
            <Suspense fallback={null}>
              <LandingPagePreview
                page={selectedLandingPage}
                product={selectedLandingPage.productId ? products.find(p => p.id === selectedLandingPage.productId) : undefined}
                onBack={onCloseLandingPreview}
                onSubmitLandingOrder={onLandingOrderSubmit}
              />
            </Suspense>
          )
          : currentView === 'static-page' ? staticPageElement
          : storeHomeElement
        } />
      </Routes>

      {/* Mobile Bottom Nav for store view */}
      {currentView === 'store' && mobileNavElement()}

      {/* Store Chat */}
      {storeChatElement}

      {/* Admin Chat */}
      {adminChatElement}
    </>
  );
};

export default AppRoutes;
