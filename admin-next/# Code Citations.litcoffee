# Code Citations

## License: GPL-3.0
https://github.com/pouyakary/idf-vscode/blob/4464b9b1ec4d83de3c6b6120a5e8f20f624ac0a3/src/extension.ts

```
Here is the full analysis and migration map:

---

## Migration Analysis

### Current Architecture

Your project is **not a standard Vite SPA**. You already have a **custom SSR setup** with:
- [entry-client.tsx](entry-client.tsx) — Client-side hydration with prefetch bootstrap
- [entry-server.tsx](entry-server.tsx) — Server-side `renderToString` (minimal shell)
- [server.js](server.js) — Express server with compression, security headers, cache control

**Routing is NOT react-router-dom URL-based.** Instead, you use a **state-driven view system** via [hooks/useNavigation.ts](hooks/useNavigation.ts) with a `currentView` state machine:

```
ViewState = 'store' | 'detail' | 'checkout' | 'success' | 'profile' | 'admin' | 
            'landing_preview' | 'offer_preview' | 'admin-login' | 'super-admin' | 
            'register' | 'static-page'
```

All views render through a single [components/AppRoutes.tsx](components/AppRoutes.tsx) `if/else` chain — there are **no `<Route>` components**.

---

### INCOMPATIBILITY FLAGS (Must Resolve Before Migration)

| Issue | Severity | Detail |
|-------|----------|--------|
| **No URL-based routing** | **CRITICAL** | Your app uses `currentView` state + `window.location` checks, not `react-router-dom` `<Route>`. Next.js App Router requires file-based routes. Every view must become a route. |
| **Massive monolith state** | **HIGH** | `App.tsx` holds ALL state (~40 useState hooks) and passes 100+ props down through `AppRoutes`. Next.js requires state to be scoped per-route or in a global store. |
| **Custom SSR server** | **HIGH** | Your [server.js](server.js) handles SSR, compression, caching, CORS, security headers. All this must be migrated to `next.config.js` + middleware. |
| **Subdomain-based multi-tenancy** | **HIGH** | Tenant resolution via `window.location.hostname` subdomains (`admin.`, `superadmin.`, `tenant.localhost`). Next.js middleware + dynamic domains needed. |
| **Socket.IO real-time** | **MEDIUM** | `socket.io-client` is deeply integrated. Must remain client-only with `"use client"`. |
| **Firebase (auth only)** | **LOW** | Firebase SDK v12 included. Needs `"use client"` wrapper. |
| **`react-hot-toast`** | **LOW** | Compatible, just needs `"use client"`. |
| **Swiper** | **LOW** | Compatible with Next.js via dynamic import. |
| **`recharts`** | **LOW** | Compatible, needs `"use client"`. |

---

### File Structure Migration Map

```
CURRENT (Vite SPA)                          →  NEXT.JS 14+ (App Router)
══════════════════════════════════════════════════════════════════════════

ROOT FILES
──────────────────────────────────────────────────────────────────────────
App.tsx (monolith state)                    →  app/layout.tsx (providers only)
                                               + app/providers.tsx ("use client")
entry-client.tsx                            →  DELETED (Next.js handles hydration)
entry-server.tsx                            →  DELETED (Next.js handles SSR)
server.js                                   →  DELETED (replaced by next.config.js
                                               + middleware.ts)
vite.config.ts                              →  DELETED (replaced by next.config.ts)
index.html                                  →  DELETED (Next.js generates HTML)
tailwind.config.js                          →  tailwind.config.js (keep as-is)
postcss.config.js                           →  postcss.config.js (keep as-is)
types.ts                                    →  types/index.ts

STOREFRONT ROUTES (currentView → file-based)
──────────────────────────────────────────────────────────────────────────
currentView='store'                         →  app/(store)/page.tsx
  pages/StoreHome.tsx                          (Server Component shell)
                                               + components reuse with "use client"

currentView='detail' + /product/:slug       →  app/(store)/product/[slug]/page.tsx
  pages/StoreProductDetail.tsx

currentView='checkout'                      →  app/(store)/checkout/page.tsx
  pages/StoreCheckout.tsx

currentView='success'                       →  app/(store)/order-success/page.tsx
  pages/StoreOrderSuccess.tsx

currentView='profile'                       →  app/(store)/profile/page.tsx
  pages/StoreProfile.tsx

currentView='static-page' + /:slug         →  app/(store)/page/[slug]/page.tsx
  pages/StaticPage.tsx

currentView='offer_preview' + /offer/:slug  →  app/(store)/offer/[slug]/page.tsx
  pages/PublicOfferPage.tsx

currentView='landing_preview' + /p/:slug    →  app/(store)/p/[slug]/page.tsx
  pages/LandingPagePreview.tsx

STORE LAYOUT (shared header/footer/chat)
──────────────────────────────────────────────────────────────────────────
                                            →  app/(store)/layout.tsx
                                               (StoreHeader, StoreFooter,
                                                MobileBottomNav, StoreChatModal)

ADMIN ROUTES (currentView='admin')
──────────────────────────────────────────────────────────────────────────
currentView='admin-login'                   →  app/(admin)/login/page.tsx
  pages/AdminLogin.tsx

currentView='admin' (all adminSections)     →  app/(admin)/dashboard/layout.tsx
  pages/AdminApp.tsx                           (sidebar + header wrapper)

  adminSection='dashboard'                  →  app/(admin)/dashboard/page.tsx
  adminSection='orders'                     →  app/(admin)/dashboard/orders/page.tsx
  adminSection='products'                   →  app/(admin)/dashboard/products/page.tsx
  adminSection='customers'                  →  app/(admin)/dashboard/customers/page.tsx
  adminSection='gallery'                    →  app/(admin)/dashboard/gallery/page.tsx
  adminSection='settings'                   →  app/(admin)/dashboard/settings/page.tsx
  adminSection='settings_facebook_pixel'    →  app/(admin)/dashboard/settings/facebook-pixel/page.tsx
  adminSection='settings_delivery'          →  app/(admin)/dashboard/settings/delivery/page.tsx
  adminSection='settings_payment'           →  app/(admin)/dashboard/settings/payment/page.tsx
  adminSection='settings_courier'           →  app/(admin)/dashboard/settings/courier/page.tsx
  adminSection='settings_marketing'         →  app/(admin)/dashboard/settings/marketing/page.tsx
  adminSection='settings_domain'            →  app/(admin)/dashboard/settings/domain/page.tsx
  adminSection='manage_shop'                →  app/(admin)/dashboard/manage-shop/page.tsx
  (... ~30 more adminSection values)

SUPER ADMIN
──────────────────────────────────────────────────────────────────────────
currentView='super-admin'                   →  app/(superadmin)/page.tsx
  pages/SuperAdminDashboard.tsx

TENANT REGISTRATION
──────────────────────────────────────────────────────────────────────────
currentView='register'                      →  app/register/page.tsx
  pages/TenantRegistration.tsx
```


## License: GPL-3.0
https://github.com/pouyakary/idf-vscode/blob/4464b9b1ec4d83de3c6b6120a5e8f20f624ac0a3/src/extension.ts

```
Here is the full analysis and migration map:

---

## Migration Analysis

### Current Architecture

Your project is **not a standard Vite SPA**. You already have a **custom SSR setup** with:
- [entry-client.tsx](entry-client.tsx) — Client-side hydration with prefetch bootstrap
- [entry-server.tsx](entry-server.tsx) — Server-side `renderToString` (minimal shell)
- [server.js](server.js) — Express server with compression, security headers, cache control

**Routing is NOT react-router-dom URL-based.** Instead, you use a **state-driven view system** via [hooks/useNavigation.ts](hooks/useNavigation.ts) with a `currentView` state machine:

```
ViewState = 'store' | 'detail' | 'checkout' | 'success' | 'profile' | 'admin' | 
            'landing_preview' | 'offer_preview' | 'admin-login' | 'super-admin' | 
            'register' | 'static-page'
```

All views render through a single [components/AppRoutes.tsx](components/AppRoutes.tsx) `if/else` chain — there are **no `<Route>` components**.

---

### INCOMPATIBILITY FLAGS (Must Resolve Before Migration)

| Issue | Severity | Detail |
|-------|----------|--------|
| **No URL-based routing** | **CRITICAL** | Your app uses `currentView` state + `window.location` checks, not `react-router-dom` `<Route>`. Next.js App Router requires file-based routes. Every view must become a route. |
| **Massive monolith state** | **HIGH** | `App.tsx` holds ALL state (~40 useState hooks) and passes 100+ props down through `AppRoutes`. Next.js requires state to be scoped per-route or in a global store. |
| **Custom SSR server** | **HIGH** | Your [server.js](server.js) handles SSR, compression, caching, CORS, security headers. All this must be migrated to `next.config.js` + middleware. |
| **Subdomain-based multi-tenancy** | **HIGH** | Tenant resolution via `window.location.hostname` subdomains (`admin.`, `superadmin.`, `tenant.localhost`). Next.js middleware + dynamic domains needed. |
| **Socket.IO real-time** | **MEDIUM** | `socket.io-client` is deeply integrated. Must remain client-only with `"use client"`. |
| **Firebase (auth only)** | **LOW** | Firebase SDK v12 included. Needs `"use client"` wrapper. |
| **`react-hot-toast`** | **LOW** | Compatible, just needs `"use client"`. |
| **Swiper** | **LOW** | Compatible with Next.js via dynamic import. |
| **`recharts`** | **LOW** | Compatible, needs `"use client"`. |

---

### File Structure Migration Map

```
CURRENT (Vite SPA)                          →  NEXT.JS 14+ (App Router)
══════════════════════════════════════════════════════════════════════════

ROOT FILES
──────────────────────────────────────────────────────────────────────────
App.tsx (monolith state)                    →  app/layout.tsx (providers only)
                                               + app/providers.tsx ("use client")
entry-client.tsx                            →  DELETED (Next.js handles hydration)
entry-server.tsx                            →  DELETED (Next.js handles SSR)
server.js                                   →  DELETED (replaced by next.config.js
                                               + middleware.ts)
vite.config.ts                              →  DELETED (replaced by next.config.ts)
index.html                                  →  DELETED (Next.js generates HTML)
tailwind.config.js                          →  tailwind.config.js (keep as-is)
postcss.config.js                           →  postcss.config.js (keep as-is)
types.ts                                    →  types/index.ts

STOREFRONT ROUTES (currentView → file-based)
──────────────────────────────────────────────────────────────────────────
currentView='store'                         →  app/(store)/page.tsx
  pages/StoreHome.tsx                          (Server Component shell)
                                               + components reuse with "use client"

currentView='detail' + /product/:slug       →  app/(store)/product/[slug]/page.tsx
  pages/StoreProductDetail.tsx

currentView='checkout'                      →  app/(store)/checkout/page.tsx
  pages/StoreCheckout.tsx

currentView='success'                       →  app/(store)/order-success/page.tsx
  pages/StoreOrderSuccess.tsx

currentView='profile'                       →  app/(store)/profile/page.tsx
  pages/StoreProfile.tsx

currentView='static-page' + /:slug         →  app/(store)/page/[slug]/page.tsx
  pages/StaticPage.tsx

currentView='offer_preview' + /offer/:slug  →  app/(store)/offer/[slug]/page.tsx
  pages/PublicOfferPage.tsx

currentView='landing_preview' + /p/:slug    →  app/(store)/p/[slug]/page.tsx
  pages/LandingPagePreview.tsx

STORE LAYOUT (shared header/footer/chat)
──────────────────────────────────────────────────────────────────────────
                                            →  app/(store)/layout.tsx
                                               (StoreHeader, StoreFooter,
                                                MobileBottomNav, StoreChatModal)

ADMIN ROUTES (currentView='admin')
──────────────────────────────────────────────────────────────────────────
currentView='admin-login'                   →  app/(admin)/login/page.tsx
  pages/AdminLogin.tsx

currentView='admin' (all adminSections)     →  app/(admin)/dashboard/layout.tsx
  pages/AdminApp.tsx                           (sidebar + header wrapper)

  adminSection='dashboard'                  →  app/(admin)/dashboard/page.tsx
  adminSection='orders'                     →  app/(admin)/dashboard/orders/page.tsx
  adminSection='products'                   →  app/(admin)/dashboard/products/page.tsx
  adminSection='customers'                  →  app/(admin)/dashboard/customers/page.tsx
  adminSection='gallery'                    →  app/(admin)/dashboard/gallery/page.tsx
  adminSection='settings'                   →  app/(admin)/dashboard/settings/page.tsx
  adminSection='settings_facebook_pixel'    →  app/(admin)/dashboard/settings/facebook-pixel/page.tsx
  adminSection='settings_delivery'          →  app/(admin)/dashboard/settings/delivery/page.tsx
  adminSection='settings_payment'           →  app/(admin)/dashboard/settings/payment/page.tsx
  adminSection='settings_courier'           →  app/(admin)/dashboard/settings/courier/page.tsx
  adminSection='settings_marketing'         →  app/(admin)/dashboard/settings/marketing/page.tsx
  adminSection='settings_domain'            →  app/(admin)/dashboard/settings/domain/page.tsx
  adminSection='manage_shop'                →  app/(admin)/dashboard/manage-shop/page.tsx
  (... ~30 more adminSection values)

SUPER ADMIN
──────────────────────────────────────────────────────────────────────────
currentView='super-admin'                   →  app/(superadmin)/page.tsx
  pages/SuperAdminDashboard.tsx

TENANT REGISTRATION
──────────────────────────────────────────────────────────────────────────
currentView='register'                      →  app/register/page.tsx
  pages/TenantRegistration.tsx
```

