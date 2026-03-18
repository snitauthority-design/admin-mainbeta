/**
 * StoreFront1 – Dynamic Visual Variants
 * Same data engine (StoreFrontThemeProps), completely different layout/styles.
 *
 * Variants:
 *  - elegant   → Rose-gold + charcoal, serif font, minimal grid, editorial feel
 *  - bold      → Electric blue + neon-yellow, chunky cards, dark hero, bold type
 *  - minimal   → Monochrome, lots of whitespace, thin borders, light font
 */

import React, { memo, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, ArrowRight, Heart, Package } from 'lucide-react';
import type { Product, WebsiteConfig } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

// ─── Shared Interface (same as StoreFrontThemePage) ──────────────────────────
interface StoreFrontThemeProps {
  products: Product[];
  categories: any[];
  brands: any[];
  websiteConfig?: WebsiteConfig;
  logo?: string | null;
  onProductClick: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number, variant: any) => void;
  onCategoryClick?: (categorySlug: string) => void;
  onOpenChat?: () => void;
}

// ─── Shared Helpers ──────────────────────────────────────────────────────────
const StarRating = memo(({ rating, starColor }: { rating: number; starColor?: string }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={13} className={i < Math.floor(rating) ? `fill-current` : 'text-gray-300'} style={i < Math.floor(rating) ? { color: starColor || '#f59e0b' } : {}} />
    ))}
  </div>
));
StarRating.displayName = 'SF1V_StarRating';

const useActiveProducts = (products: Product[]) =>
  useMemo(() => products.filter(p => p.status === 'Active' || !p.status), [products]);

const useProductSections = (active: Product[]) => ({
  trending: useMemo(() => [...active].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8), [active]),
  bestSelling: useMemo(() => [...active].sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0)).slice(0, 8), [active]),
  newArrivals: useMemo(() => active.slice(0, 6), [active]),
});

// ═════════════════════════════════════════════════════════════════════════════
//  VARIANT 1 – ELEGANT  (Rose-gold + Charcoal, serif font, editorial feel)
// ═════════════════════════════════════════════════════════════════════════════

const E = {
  primary: '#3d3029',       // charcoal brown
  accent: '#c9956b',        // rose-gold
  accentLight: '#fdf6f0',   // warm cream
  bg: '#faf8f5',            // off-white
  text: '#2d2420',
  textMuted: '#8c7e75',
  font: "'Georgia', 'Times New Roman', serif",
  fontBody: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

const ElegantProductCard = memo(({ product, onClick, onAddToCart }: {
  product: Product; onClick: () => void; onAddToCart?: () => void;
}) => {
  const img = product.galleryImages?.[0] || product.image;
  const price = product.salePrice || product.price || 0;
  const originalPrice = product.price && product.salePrice && product.price > product.salePrice ? product.price : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100 mb-3">
        {img ? (
          <img src={normalizeImageUrl(img)} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={40} /></div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 text-white text-xs px-2.5 py-1 tracking-widest uppercase" style={{ backgroundColor: E.accent, fontFamily: E.fontBody, fontSize: '10px', letterSpacing: '0.1em' }}>{discount}% off</span>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
            className="w-full py-2.5 text-white text-xs uppercase tracking-[0.15em] border border-white/80 hover:bg-white hover:text-gray-900 transition-colors"
            style={{ fontFamily: E.fontBody }}>
            Add to Bag
          </button>
        </div>
      </div>
      <h3 className="text-sm font-normal tracking-wide line-clamp-1 mb-1" style={{ fontFamily: E.font, color: E.text }}>{product.title}</h3>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold" style={{ color: E.accent, fontFamily: E.fontBody }}>৳{price}</span>
        {originalPrice && <span className="text-xs line-through" style={{ color: E.textMuted }}>৳{originalPrice}</span>}
      </div>
    </div>
  );
});
ElegantProductCard.displayName = 'ElegantProductCard';

const ElegantHero = memo(({ websiteConfig }: { websiteConfig?: WebsiteConfig }) => {
  const [slide, setSlide] = useState(0);
  const items = (websiteConfig?.carouselItems || [])
    .filter(i => String(i.status ?? '').trim().toLowerCase() === 'publish')
    .sort((a, b) => Number(a.serial ?? 0) - Number(b.serial ?? 0));
  const current = items[slide] || null;

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setSlide(p => (p + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  const heroImage = current?.imageUrl || current?.image || null;

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: E.primary, minHeight: '480px' }}>
      {heroImage && (
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${normalizeImageUrl(heroImage)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-24 flex flex-col items-center text-center">
        <span className="uppercase text-xs tracking-[0.3em] mb-4" style={{ color: E.accent, fontFamily: E.fontBody }}>New Collection</span>
        <h1 className="text-4xl md:text-6xl text-white leading-tight mb-6" style={{ fontFamily: E.font }}>
          {current?.title || 'Curated Elegance'}
        </h1>
        <p className="text-white/60 text-base max-w-lg mb-8" style={{ fontFamily: E.fontBody }}>
          {current?.subtitle || 'Discover handpicked selections for refined taste'}
        </p>
        <button className="px-10 py-3 text-xs uppercase tracking-[0.2em] border border-white/60 text-white hover:bg-white hover:text-gray-900 transition-colors" style={{ fontFamily: E.fontBody }}>
          Explore Now
        </button>
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {items.map((_: any, i: number) => (
            <button key={i} onClick={() => setSlide(i)} className="w-8 h-[2px] transition-colors" style={{ backgroundColor: i === slide ? E.accent : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>
      )}
    </div>
  );
});
ElegantHero.displayName = 'ElegantHero';

export const StoreFront1Elegant: React.FC<StoreFrontThemeProps> = memo(({
  products, categories, brands, websiteConfig, logo, onProductClick, onBuyNow, onAddToCart, onCategoryClick, onOpenChat,
}) => {
  const active = useActiveProducts(products);
  const { trending, bestSelling, newArrivals } = useProductSections(active);
  const handleAddToCart = useCallback((p: Product) => onAddToCart?.(p, 1, {}), [onAddToCart]);

  const activeCategories = useMemo(() => categories.filter(c => c.status === 'Active' || !c.status).slice(0, 6), [categories]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: E.bg, fontFamily: E.fontBody }}>

      <ElegantHero websiteConfig={websiteConfig} />

      {/* Categories as text links */}
      {activeCategories.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 py-12 border-b" style={{ borderColor: '#e8e0d8' }}>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {activeCategories.map((cat: any) => (
              <button key={cat.id || cat.name} onClick={() => onCategoryClick?.(cat.slug || cat.name)}
                className="uppercase text-xs tracking-[0.2em] hover:opacity-60 transition-opacity" style={{ color: E.primary, fontFamily: E.fontBody }}>
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals – 3-column editorial grid */}
      {newArrivals.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <span className="uppercase text-xs tracking-[0.3em] block mb-2" style={{ color: E.accent }}>Just In</span>
            <h2 className="text-3xl" style={{ fontFamily: E.font, color: E.text }}>New Arrivals</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {newArrivals.map(p => (
              <ElegantProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Trending – wider spacing, 4-column */}
      {trending.length > 0 && (
        <section className="py-14" style={{ backgroundColor: E.accentLight }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-10">
              <span className="uppercase text-xs tracking-[0.3em] block mb-2" style={{ color: E.accent }}>Bestsellers</span>
              <h2 className="text-3xl" style={{ fontFamily: E.font, color: E.text }}>Most Loved</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trending.map(p => (
                <ElegantProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers – editorial strip */}
      {bestSelling.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <span className="uppercase text-xs tracking-[0.3em] block mb-2" style={{ color: E.accent }}>Trending</span>
            <h2 className="text-3xl" style={{ fontFamily: E.font, color: E.text }}>Best Sellers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSelling.map(p => (
              <ElegantProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 text-center" style={{ backgroundColor: E.primary }}>
        <span className="uppercase text-xs tracking-[0.3em] block mb-3" style={{ color: E.accent, fontFamily: E.fontBody }}>Membership</span>
        <h2 className="text-3xl md:text-4xl text-white mb-4" style={{ fontFamily: E.font }}>Join Our World</h2>
        <p className="text-white/50 max-w-lg mx-auto mb-8 text-sm" style={{ fontFamily: E.fontBody }}>Get early access to new arrivals, exclusive offers, and curated recommendations.</p>
        <button className="px-10 py-3 text-xs uppercase tracking-[0.2em] border border-white/40 text-white hover:bg-white hover:text-gray-900 transition-colors" style={{ fontFamily: E.fontBody }}>
          Sign Up
        </button>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t" style={{ borderColor: '#e8e0d8', backgroundColor: E.bg }}>
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {logo ? (
            <img src={normalizeImageUrl(logo)} alt={websiteConfig?.storeName || 'Store'} className="h-7 object-contain" />
          ) : (
            <span className="text-lg" style={{ fontFamily: E.font, color: E.primary }}>{websiteConfig?.storeName || 'Store'}</span>
          )}
          <p className="text-xs" style={{ color: E.textMuted }}>© {new Date().getFullYear()} {websiteConfig?.storeName || 'Store'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
});
StoreFront1Elegant.displayName = 'StoreFront1Elegant';


// ═════════════════════════════════════════════════════════════════════════════
//  VARIANT 2 – BOLD  (Electric blue + neon-yellow, chunky cards, dark hero)
// ═════════════════════════════════════════════════════════════════════════════

const B = {
  primary: '#0f172a',       // deep navy
  accent: '#3b82f6',        // electric blue
  highlight: '#facc15',     // neon yellow
  surface: '#1e293b',       // dark card bg
  bg: '#f8fafc',
  text: '#0f172a',
  textLight: '#94a3b8',
  font: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

const BoldProductCard = memo(({ product, onClick, onAddToCart }: {
  product: Product; onClick: () => void; onAddToCart?: () => void;
}) => {
  const img = product.galleryImages?.[0] || product.image;
  const price = product.salePrice || product.price || 0;
  const originalPrice = product.price && product.salePrice && product.price > product.salePrice ? product.price : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col border-2 border-transparent hover:border-blue-500"
      onClick={onClick}>
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {img ? (
          <img src={normalizeImageUrl(img)} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingCart size={48} /></div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 text-xs font-black px-3 py-1.5 rounded-lg" style={{ backgroundColor: B.highlight, color: B.primary }}>
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2" style={{ fontFamily: B.font }}>
        <h3 className="font-bold text-base line-clamp-1" style={{ color: B.text }}>{product.title}</h3>
        <StarRating rating={product.rating || 4} starColor={B.highlight} />
        <div className="flex items-end gap-2 mt-auto">
          <span className="font-black text-xl" style={{ color: B.accent }}>৳{price}</span>
          {originalPrice && <span className="text-sm line-through" style={{ color: B.textLight }}>৳{originalPrice}</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
          className="mt-2 py-2.5 rounded-xl text-white font-bold text-sm transition-colors hover:opacity-90"
          style={{ backgroundColor: B.accent }}>
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
});
BoldProductCard.displayName = 'BoldProductCard';

const BoldHero = memo(({ websiteConfig }: { websiteConfig?: WebsiteConfig }) => {
  const [slide, setSlide] = useState(0);
  const items = (websiteConfig?.carouselItems || [])
    .filter(i => String(i.status ?? '').trim().toLowerCase() === 'publish')
    .sort((a, b) => Number(a.serial ?? 0) - Number(b.serial ?? 0));
  const current = items[slide] || null;

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setSlide(p => (p + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [items.length]);

  const heroImage = current?.imageUrl || current?.image || null;

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: B.primary, minHeight: '420px' }}>
      {heroImage && (
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(${normalizeImageUrl(heroImage)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${B.primary} 40%, ${B.accent}33 100%)` }} />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6" style={{ backgroundColor: B.highlight, color: B.primary, fontFamily: B.font }}>
          🔥 HOT DEALS
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4" style={{ fontFamily: B.font }}>
          {current?.title || 'MEGA SALE'}
        </h1>
        <p className="text-white/60 text-lg mb-8 max-w-lg" style={{ fontFamily: B.font }}>
          {current?.subtitle || 'Unbeatable prices. Limited time offers.'}
        </p>
        <div className="flex gap-4">
          <button className="px-8 py-3.5 rounded-xl font-bold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: B.accent, fontFamily: B.font }}>
            Shop Now →
          </button>
          <button className="px-8 py-3.5 rounded-xl font-bold transition-transform hover:scale-105 border-2"
            style={{ borderColor: B.highlight, color: B.highlight, fontFamily: B.font }}>
            View Deals
          </button>
        </div>
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_: any, i: number) => (
            <button key={i} onClick={() => setSlide(i)} className="w-3 h-3 rounded-full transition-colors" style={{ backgroundColor: i === slide ? B.highlight : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      )}
    </div>
  );
});
BoldHero.displayName = 'BoldHero';

export const StoreFront1Bold: React.FC<StoreFrontThemeProps> = memo(({
  products, categories, brands, websiteConfig, logo, onProductClick, onBuyNow, onAddToCart, onCategoryClick, onOpenChat,
}) => {
  const active = useActiveProducts(products);
  const { trending, bestSelling, newArrivals } = useProductSections(active);
  const handleAddToCart = useCallback((p: Product) => onAddToCart?.(p, 1, {}), [onAddToCart]);

  const activeCategories = useMemo(() => categories.filter(c => c.status === 'Active' || !c.status).slice(0, 8), [categories]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: B.bg, fontFamily: B.font }}>

      <BoldHero websiteConfig={websiteConfig} />

      {/* Category pills */}
      {activeCategories.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-wrap gap-2">
            {activeCategories.map((cat: any) => (
              <button key={cat.id || cat.name} onClick={() => onCategoryClick?.(cat.slug || cat.name)}
                className="px-5 py-2 rounded-xl text-sm font-bold border-2 hover:border-blue-500 hover:text-blue-600 transition-colors"
                style={{ borderColor: '#e2e8f0', color: B.text }}>
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Flash Deal Banner */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
        <div className="rounded-2xl p-6 flex items-center justify-between" style={{ background: `linear-gradient(90deg, ${B.primary}, ${B.accent})` }}>
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: B.highlight, color: B.primary }}>⚡ FLASH SALE</span>
            <h3 className="text-xl font-black text-white mt-2">Up to 50% OFF — Limited Stock!</h3>
          </div>
          <button className="hidden md:block px-6 py-2.5 rounded-xl font-bold text-sm" style={{ backgroundColor: B.highlight, color: B.primary }}>
            Shop Deals
          </button>
        </div>
      </section>

      {/* Trending – chunky 4-col grid */}
      {trending.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: B.accent }} />
            <h2 className="text-2xl md:text-3xl font-black" style={{ color: B.text }}>Trending Now 🔥</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {trending.map(p => (
              <BoldProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSelling.length > 0 && (
        <section className="py-10" style={{ backgroundColor: '#eef2ff' }}>
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: B.highlight }} />
              <h2 className="text-2xl md:text-3xl font-black" style={{ color: B.text }}>Best Sellers 🏆</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSelling.map(p => (
                <BoldProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: B.accent }} />
            <h2 className="text-2xl md:text-3xl font-black" style={{ color: B.text }}>Just Dropped 🆕</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {newArrivals.map(p => (
              <BoldProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10" style={{ backgroundColor: B.primary }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {logo ? (
              <img src={normalizeImageUrl(logo)} alt={websiteConfig?.storeName || 'Store'} className="h-8 object-contain brightness-0 invert" />
            ) : (
              <span className="text-xl font-black text-white">{websiteConfig?.storeName || 'Store'}</span>
            )}
            <p className="text-white/40 text-xs">© {new Date().getFullYear()} {websiteConfig?.storeName || 'Store'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
});
StoreFront1Bold.displayName = 'StoreFront1Bold';


// ═════════════════════════════════════════════════════════════════════════════
//  VARIANT 3 – MINIMAL  (Monochrome, whitespace, thin borders, light feel)
// ═════════════════════════════════════════════════════════════════════════════

const M = {
  text: '#111111',
  textMuted: '#999999',
  border: '#eeeeee',
  bg: '#ffffff',
  accent: '#111111',
  font: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

const MinimalProductCard = memo(({ product, onClick, onAddToCart }: {
  product: Product; onClick: () => void; onAddToCart?: () => void;
}) => {
  const img = product.galleryImages?.[0] || product.image;
  const price = product.salePrice || product.price || 0;
  const originalPrice = product.price && product.salePrice && product.price > product.salePrice ? product.price : null;

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 mb-4">
        {img ? (
          <img src={normalizeImageUrl(img)} alt={product.title} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200"><Package size={40} /></div>
        )}
        <button onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
          className="absolute bottom-4 left-4 right-4 py-2.5 bg-black text-white text-xs text-center tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ fontFamily: M.font }}>
          Add to Cart
        </button>
      </div>
      <h3 className="text-sm font-normal mb-1 line-clamp-1" style={{ fontFamily: M.font, color: M.text }}>{product.title}</h3>
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: M.text, fontFamily: M.font }}>৳{price}</span>
        {originalPrice && <span className="text-xs line-through" style={{ color: M.textMuted }}>৳{originalPrice}</span>}
      </div>
    </div>
  );
});
MinimalProductCard.displayName = 'MinimalProductCard';

const MinimalHero = memo(({ websiteConfig }: { websiteConfig?: WebsiteConfig }) => {
  const items = (websiteConfig?.carouselItems || [])
    .filter(i => String(i.status ?? '').trim().toLowerCase() === 'publish')
    .sort((a, b) => Number(a.serial ?? 0) - Number(b.serial ?? 0));
  const [slide, setSlide] = useState(0);
  const current = items[slide] || null;

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setSlide(p => (p + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length]);

  const heroImage = current?.imageUrl || current?.image || null;

  return (
    <div className="relative" style={{ backgroundColor: '#f5f5f5', minHeight: '400px' }}>
      {heroImage && (
        <img src={normalizeImageUrl(heroImage)} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-80" />
      )}
      <div className="relative z-10 max-w-[1000px] mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4" style={{ fontFamily: M.font, color: M.text }}>
          {current?.title || 'Less is More'}
        </h1>
        <p className="text-base mb-8" style={{ color: M.textMuted, fontFamily: M.font }}>
          {current?.subtitle || 'Thoughtfully designed, carefully crafted'}
        </p>
        <button className="px-8 py-3 text-xs uppercase tracking-[0.15em] bg-black text-white hover:bg-gray-800 transition-colors" style={{ fontFamily: M.font }}>
          Discover
        </button>
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {items.map((_: any, i: number) => (
            <button key={i} onClick={() => setSlide(i)} className="w-6 h-[1px] transition-colors" style={{ backgroundColor: i === slide ? '#111' : '#ccc' }} />
          ))}
        </div>
      )}
    </div>
  );
});
MinimalHero.displayName = 'MinimalHero';

export const StoreFront1Minimal: React.FC<StoreFrontThemeProps> = memo(({
  products, categories, brands, websiteConfig, logo, onProductClick, onBuyNow, onAddToCart, onCategoryClick, onOpenChat,
}) => {
  const active = useActiveProducts(products);
  const { trending, bestSelling, newArrivals } = useProductSections(active);
  const handleAddToCart = useCallback((p: Product) => onAddToCart?.(p, 1, {}), [onAddToCart]);

  const activeCategories = useMemo(() => categories.filter(c => c.status === 'Active' || !c.status).slice(0, 6), [categories]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: M.bg, fontFamily: M.font }}>

      <MinimalHero websiteConfig={websiteConfig} />

      {/* Categories – thin underline style */}
      {activeCategories.length > 0 && (
        <section className="max-w-[1000px] mx-auto px-6 py-10 border-b" style={{ borderColor: M.border }}>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2">
            {activeCategories.map((cat: any) => (
              <button key={cat.id || cat.name} onClick={() => onCategoryClick?.(cat.slug || cat.name)}
                className="text-xs tracking-widest uppercase hover:underline underline-offset-4 transition-all"
                style={{ color: M.text }}>
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* New */}
      {newArrivals.length > 0 && (
        <section className="max-w-[1000px] mx-auto px-6 py-14">
          <h2 className="text-2xl font-light text-center mb-10 tracking-tight" style={{ color: M.text }}>New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {newArrivals.map(p => (
              <MinimalProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="max-w-[200px] mx-auto border-b" style={{ borderColor: M.border }} />

      {/* Trending */}
      {trending.length > 0 && (
        <section className="max-w-[1000px] mx-auto px-6 py-14">
          <h2 className="text-2xl font-light text-center mb-10 tracking-tight" style={{ color: M.text }}>Popular</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trending.map(p => (
              <MinimalProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="max-w-[200px] mx-auto border-b" style={{ borderColor: M.border }} />

      {/* Best Sellers */}
      {bestSelling.length > 0 && (
        <section className="max-w-[1000px] mx-auto px-6 py-14">
          <h2 className="text-2xl font-light text-center mb-10 tracking-tight" style={{ color: M.text }}>Best Sellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {bestSelling.map(p => (
              <MinimalProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 border-t" style={{ borderColor: M.border }}>
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          {logo ? (
            <img src={normalizeImageUrl(logo)} alt={websiteConfig?.storeName || 'Store'} className="h-6 object-contain mx-auto mb-4" />
          ) : (
            <span className="text-sm font-medium block mb-4" style={{ color: M.text }}>{websiteConfig?.storeName || 'Store'}</span>
          )}
          <p className="text-xs" style={{ color: M.textMuted }}>© {new Date().getFullYear()} {websiteConfig?.storeName || 'Store'}</p>
        </div>
      </footer>
    </div>
  );
});
StoreFront1Minimal.displayName = 'StoreFront1Minimal';
