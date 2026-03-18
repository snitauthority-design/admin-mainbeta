/**
 * StoreFront2 – Dynamic Visual Variants
 * Same data engine (StoreFront2Props), completely different layout/styles.
 *
 * Variants:
 *  - neon    → Dark bg + cyan/magenta neon glow, futuristic cards
 *  - earth   → Warm olive/terracotta, organic shapes, nature-inspired
 *  - pastel  → Soft lavender/mint/peach, rounded bubbles, playful
 */

import React, { memo, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  ShoppingCart, Star, Heart, Clock, Tag, ChevronRight, ChevronLeft,
  Zap, Phone, Mail, Package, ArrowUpRight,
} from 'lucide-react';
import type { Product, WebsiteConfig } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

// ─── Shared Interface (same as StoreFront2Page) ──────────────────────────────
interface StoreFront2Props {
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
const slugify = (s: string) => s?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';
const calcDiscount = (price: number, sale: number) => Math.round(((price - sale) / price) * 100);

const useActiveProducts = (products: Product[]) =>
  useMemo(() => products.filter(p => p.status === 'Active' || !p.status), [products]);

const useProductSections = (active: Product[]) => ({
  newArrivals: useMemo(() => active.slice(0, 10), [active]),
  topRated: useMemo(() => [...active].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10), [active]),
  bestSelling: useMemo(() => [...active].sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0)).slice(0, 10), [active]),
  dealProduct: useMemo(() =>
    [...active].sort((a, b) => {
      const dA = a.price && a.salePrice ? calcDiscount(a.price, a.salePrice) : 0;
      const dB = b.price && b.salePrice ? calcDiscount(b.price, b.salePrice) : 0;
      return dB - dA;
    })[0] || active[0],
  [active]),
});

const StarRating = memo(({ rating, color }: { rating: number; color?: string }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={12} className={i < Math.floor(rating) ? 'fill-current' : 'text-gray-400 fill-gray-400'} style={i < Math.floor(rating) ? { color: color || '#f59e0b' } : {}} />
    ))}
  </div>
));
StarRating.displayName = 'SF2V_StarRating';

// Reusable horizontal scroll wrapper
const HScrollSection = memo(({ title, subtitle, products, renderCard, accentColor }: {
  title: string; subtitle?: string; products: Product[];
  renderCard: (p: Product) => React.ReactNode; accentColor?: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  if (!products.length) return null;

  return (
    <section className="py-10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            {subtitle && <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>{subtitle}</div>}
            <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full border flex items-center justify-center hover:opacity-70 transition-opacity"><ChevronLeft size={18} /></button>
            <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: accentColor || '#333' }}><ChevronRight size={18} /></button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {products.map(p => <div key={p.id} className="flex-none w-[180px] md:w-[220px] snap-start">{renderCard(p)}</div>)}
        </div>
      </div>
    </section>
  );
});
HScrollSection.displayName = 'HScrollSection';


// ═════════════════════════════════════════════════════════════════════════════
//  VARIANT 1 – NEON  (Dark bg + cyan/magenta neon glow, futuristic)
// ═════════════════════════════════════════════════════════════════════════════

const N = {
  bg: '#0a0a0f',
  surface: '#12121a',
  card: '#1a1a28',
  cyan: '#00e5ff',
  magenta: '#e91e8c',
  textMain: '#e8e8f0',
  textMuted: '#6b6b7a',
  border: '#2a2a3a',
  font: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

const NeonProductCard = memo(({ product, onClick, onAddToCart, onBuyNow }: {
  product: Product; onClick: () => void; onAddToCart?: () => void; onBuyNow?: () => void;
}) => {
  const img = product.galleryImages?.[0] || product.image;
  const price = product.salePrice || product.price || 0;
  const originalPrice = product.price && product.salePrice && product.price > product.salePrice ? product.price : null;
  const discount = originalPrice ? calcDiscount(originalPrice, price) : 0;

  return (
    <div className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{ backgroundColor: N.card, border: `1px solid ${N.border}` }} onClick={onClick}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
        style={{ boxShadow: `0 0 20px ${N.cyan}30, 0 0 40px ${N.magenta}15` }} />
      <div className="relative aspect-square overflow-hidden">
        {img ? (
          <img src={normalizeImageUrl(img)} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: N.textMuted }}><Package size={40} /></div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: N.magenta, color: '#fff' }}>-{discount}%</span>
        )}
        <div className="absolute inset-0 flex items-end justify-between px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg" style={{ backgroundColor: N.cyan, color: N.bg }}>
            <ShoppingCart size={12} /> Cart
          </button>
          <button onClick={(e) => { e.stopPropagation(); onBuyNow?.(); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg" style={{ backgroundColor: N.magenta, color: '#fff' }}>
            <Zap size={12} /> Buy
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm line-clamp-2 leading-snug mb-1" style={{ color: N.textMain }}>{product.title}</p>
        <StarRating rating={product.rating || 4} color={N.cyan} />
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-base" style={{ color: N.cyan }}>৳{price}</span>
          {originalPrice && <span className="text-xs line-through" style={{ color: N.textMuted }}>৳{originalPrice}</span>}
        </div>
      </div>
    </div>
  );
});
NeonProductCard.displayName = 'NeonProductCard';

const NeonHero = memo(({ websiteConfig, products, onProductClick }: {
  websiteConfig?: WebsiteConfig; products: Product[]; onProductClick: (p: Product) => void;
}) => {
  const [slide, setSlide] = useState(0);
  const items = (websiteConfig?.carouselItems || [])
    .filter(i => String(i.status ?? '').trim().toLowerCase() === 'publish')
    .sort((a, b) => Number(a.serial ?? 0) - Number(b.serial ?? 0));
  const current = items[slide] || null;
  const featured = products[0];

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setSlide(p => (p + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length]);

  const heroBg = current?.imageUrl || current?.image || null;

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: N.bg, minHeight: '480px' }}>
      {heroBg && <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(${normalizeImageUrl(heroBg)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 20% 50%, ${N.cyan}12 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, ${N.magenta}10 0%, transparent 60%)` }} />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 py-20 md:py-28 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4"
            style={{ border: `1px solid ${N.cyan}`, color: N.cyan }}>✦ THE FUTURE IS NOW</span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4" style={{ color: N.textMain, fontFamily: N.font }}>
            {current?.title || 'Next-Gen Shopping'}
          </h1>
          <p className="text-lg mb-8" style={{ color: N.textMuted }}>{current?.subtitle || 'Premium products. Unmatched experience.'}</p>
          <div className="flex gap-3">
            <button className="px-7 py-3 rounded-lg font-bold transition-opacity hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: N.cyan, color: N.bg, fontFamily: N.font }}>
              Explore <ArrowUpRight size={16} />
            </button>
            <button className="px-7 py-3 rounded-lg font-bold border transition-colors hover:bg-white/5"
              style={{ borderColor: N.magenta, color: N.magenta, fontFamily: N.font }}>
              Flash Deals
            </button>
          </div>
        </div>
        {featured && (
          <div className="flex-shrink-0 w-[260px] md:w-[300px] rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor: N.card, border: `1px solid ${N.border}`, boxShadow: `0 0 30px ${N.cyan}15` }}
            onClick={() => onProductClick(featured)}>
            {(featured.galleryImages?.[0] || featured.image) && (
              <img src={normalizeImageUrl(featured.galleryImages?.[0] || featured.image!)} alt={featured.title} className="w-full aspect-square object-cover" />
            )}
            <div className="p-4">
              <p className="font-semibold text-sm line-clamp-2 mb-1" style={{ color: N.textMain }}>{featured.title}</p>
              <span className="font-bold text-lg" style={{ color: N.cyan }}>৳{featured.salePrice || featured.price}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
NeonHero.displayName = 'NeonHero';

const NeonDealStrip = memo(({ product, onProductClick, onBuyNow }: {
  product: Product; onProductClick: (p: Product) => void; onBuyNow?: (p: Product) => void;
}) => {
  const [timeLeft, setTimeLeft] = useState({ h: 11, m: 59, s: 59 });
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) return { h: 23, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  const img = product.galleryImages?.[0] || product.image;
  const price = product.salePrice || product.price || 0;

  return (
    <section className="py-10" style={{ background: `linear-gradient(90deg, ${N.bg}, ${N.surface})` }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-8">
        <div className="text-center md:text-left flex-shrink-0">
          <div className="flex items-center gap-2 mb-2"><Zap size={18} style={{ color: N.magenta }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: N.magenta }}>DEAL OF THE DAY</span>
          </div>
          <div className="flex gap-3 mt-3">
            {[{ l: 'HRS', v: timeLeft.h }, { l: 'MIN', v: timeLeft.m }, { l: 'SEC', v: timeLeft.s }].map(({ l, v }) => (
              <div key={l} className="text-center">
                <div className="text-xl font-mono font-extrabold w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ border: `1px solid ${N.cyan}`, color: N.cyan, backgroundColor: N.card }}>{pad(v)}</div>
                <div className="text-xs mt-1 font-bold tracking-widest" style={{ color: N.textMuted }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-5 rounded-xl p-4 cursor-pointer flex-1 max-w-lg transition-colors"
          style={{ backgroundColor: N.card, border: `1px solid ${N.border}` }} onClick={() => onProductClick(product)}>
          {img && <img src={normalizeImageUrl(img)} alt={product.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg leading-snug mb-1 line-clamp-2" style={{ color: N.textMain }}>{product.title}</p>
            <span className="text-2xl font-extrabold" style={{ color: N.cyan }}>৳{price}</span>
          </div>
        </div>
        <button onClick={() => onBuyNow?.(product)} className="px-7 py-3.5 rounded-lg font-bold text-lg shadow-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: N.magenta, color: '#fff' }}>Grab Deal</button>
      </div>
    </section>
  );
});
NeonDealStrip.displayName = 'NeonDealStrip';

const NeonCategoryGrid = memo(({ categories, products, onCategoryClick, onProductClick, onAddToCart, onBuyNow }: {
  categories: any[]; products: Product[]; onCategoryClick?: (s: string) => void;
  onProductClick: (p: Product) => void; onAddToCart?: (p: Product) => void; onBuyNow?: (p: Product) => void;
}) => {
  const activeCats = categories.filter(c => c.status === 'Active' || !c.status).slice(0, 8);
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!selected) return products.slice(0, 12);
    return products.filter(p => p.category?.toLowerCase() === selected.toLowerCase() || slugify(p.category || '') === selected).slice(0, 12);
  }, [selected, products]);

  const handleSelect = (name: string) => {
    const slug = slugify(name);
    if (selected === slug) { setSelected(null); onCategoryClick?.(''); }
    else { setSelected(slug); onCategoryClick?.(slug); }
  };

  if (!products.length && !categories.length) return null;

  return (
    <section className="py-12" style={{ backgroundColor: N.surface }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-extrabold mb-6" style={{ color: N.textMain }}>Browse by Category</h2>
        {activeCats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => { setSelected(null); onCategoryClick?.(''); }}
              className="px-4 py-1.5 rounded-lg text-sm font-bold transition-colors"
              style={!selected ? { backgroundColor: N.cyan, color: N.bg } : { border: `1px solid ${N.border}`, color: N.textMuted }}>
              All
            </button>
            {activeCats.map(cat => {
              const slug = slugify(cat.name);
              return (
                <button key={cat.id || cat.name} onClick={() => handleSelect(cat.name)}
                  className="px-4 py-1.5 rounded-lg text-sm font-bold transition-colors"
                  style={selected === slug ? { backgroundColor: N.magenta, color: '#fff' } : { border: `1px solid ${N.border}`, color: N.textMuted }}>
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <NeonProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => onAddToCart?.(p)} onBuyNow={() => onBuyNow?.(p)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center" style={{ color: N.textMuted }}><Package size={48} className="mx-auto mb-3 opacity-30" /><p>No products in this category.</p></div>
          )}
        </div>
      </div>
    </section>
  );
});
NeonCategoryGrid.displayName = 'NeonCategoryGrid';

export const StoreFront2Neon: React.FC<StoreFront2Props> = memo(({
  products, categories, brands, websiteConfig, logo, onProductClick, onBuyNow, onAddToCart, onCategoryClick, onOpenChat,
}) => {
  const active = useActiveProducts(products);
  const { newArrivals, topRated, bestSelling, dealProduct } = useProductSections(active);
  const handleAddToCart = useCallback((p: Product) => onAddToCart?.(p, 1, {}), [onAddToCart]);
  const handleBuyNow = useCallback((p: Product) => onBuyNow?.(p), [onBuyNow]);

  const renderNeonCard = useCallback((p: Product) => (
    <NeonProductCard product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} onBuyNow={() => handleBuyNow(p)} />
  ), [onProductClick, handleAddToCart, handleBuyNow]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: N.bg, fontFamily: N.font, color: N.textMain }}>

      <NeonHero websiteConfig={websiteConfig} products={active} onProductClick={onProductClick} />

      {dealProduct && <NeonDealStrip product={dealProduct} onProductClick={onProductClick} onBuyNow={handleBuyNow} />}

      <NeonCategoryGrid categories={categories} products={active} onCategoryClick={onCategoryClick}
        onProductClick={onProductClick} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />

      <HScrollSection title="New Arrivals" subtitle="Just Dropped" products={newArrivals}
        renderCard={renderNeonCard} accentColor={N.cyan} />
      <HScrollSection title="Top Rated" subtitle="Community Picks" products={topRated}
        renderCard={renderNeonCard} accentColor={N.magenta} />
      <HScrollSection title="Best Sellers" subtitle="Hot Right Now" products={bestSelling}
        renderCard={renderNeonCard} accentColor={N.cyan} />

      {/* Footer */}
      <footer style={{ backgroundColor: N.surface, borderTop: `1px solid ${N.border}` }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {logo ? <img src={normalizeImageUrl(logo)} alt={websiteConfig?.storeName || 'Store'} className="h-8 object-contain brightness-0 invert" />
            : <span className="text-xl font-extrabold" style={{ color: N.textMain }}>{websiteConfig?.storeName || 'Store'}</span>}
          <p className="text-xs" style={{ color: N.textMuted }}>© {new Date().getFullYear()} {websiteConfig?.storeName || 'Store'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
});
StoreFront2Neon.displayName = 'StoreFront2Neon';


// ═════════════════════════════════════════════════════════════════════════════
//  VARIANT 2 – EARTH  (Warm olive/terracotta, organic shapes, nature-inspired)
// ═════════════════════════════════════════════════════════════════════════════

const EE = {
  primary: '#3d4f2f',       // olive green
  accent: '#c4693d',        // terracotta
  accentLight: '#f9f2ea',   // warm cream
  bg: '#f7f4ef',            // off-white warm
  card: '#ffffff',
  border: '#e5ddd0',
  text: '#2d3124',
  textMuted: '#8a8274',
  font: "'Georgia', 'Times New Roman', serif",
  fontBody: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

const EarthProductCard = memo(({ product, onClick, onAddToCart, onBuyNow }: {
  product: Product; onClick: () => void; onAddToCart?: () => void; onBuyNow?: () => void;
}) => {
  const img = product.galleryImages?.[0] || product.image;
  const price = product.salePrice || product.price || 0;
  const originalPrice = product.price && product.salePrice && product.price > product.salePrice ? product.price : null;
  const discount = originalPrice ? calcDiscount(originalPrice, price) : 0;

  return (
    <div className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
      style={{ backgroundColor: EE.card, border: `1px solid ${EE.border}` }} onClick={onClick}>
      <div className="relative aspect-[4/5] overflow-hidden">
        {img ? (
          <img src={normalizeImageUrl(img)} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50" style={{ color: EE.textMuted }}><Package size={40} /></div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: EE.accent }}>-{discount}%</span>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: EE.primary }}>Add to Cart</button>
          <button onClick={(e) => { e.stopPropagation(); onBuyNow?.(); }}
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: EE.accent }}>Buy Now</button>
        </div>
      </div>
      <div className="p-3.5">
        <p className="font-semibold text-sm line-clamp-2 leading-snug mb-1.5" style={{ color: EE.text, fontFamily: EE.fontBody }}>{product.title}</p>
        <StarRating rating={product.rating || 4} color={EE.accent} />
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-base" style={{ color: EE.accent, fontFamily: EE.fontBody }}>৳{price}</span>
          {originalPrice && <span className="text-xs line-through" style={{ color: EE.textMuted }}>৳{originalPrice}</span>}
        </div>
      </div>
    </div>
  );
});
EarthProductCard.displayName = 'EarthProductCard';

const EarthHero = memo(({ websiteConfig, products, onProductClick }: {
  websiteConfig?: WebsiteConfig; products: Product[]; onProductClick: (p: Product) => void;
}) => {
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

  const heroBg = current?.imageUrl || current?.image || null;

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: EE.primary, minHeight: '460px' }}>
      {heroBg && <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${normalizeImageUrl(heroBg)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${EE.primary}ee 0%, ${EE.primary}88 50%, ${EE.accent}44 100%)` }} />
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-24 md:py-32 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
          style={{ backgroundColor: EE.accentLight, color: EE.accent, fontFamily: EE.fontBody }}>🌿 Naturally Curated</span>
        <h1 className="text-4xl md:text-6xl leading-tight mb-4 text-white" style={{ fontFamily: EE.font }}>
          {current?.title || 'Timeless Comfort'}
        </h1>
        <p className="text-white/60 text-base max-w-md mx-auto mb-8" style={{ fontFamily: EE.fontBody }}>
          {current?.subtitle || 'Products crafted with care, inspired by nature'}
        </p>
        <button className="px-8 py-3 rounded-full font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: EE.accent, fontFamily: EE.fontBody }}>
          Shop Collection
        </button>
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_: any, i: number) => (
            <button key={i} onClick={() => setSlide(i)} className="w-2.5 h-2.5 rounded-full transition-colors"
              style={{ backgroundColor: i === slide ? EE.accent : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>
      )}
    </div>
  );
});
EarthHero.displayName = 'EarthHero';

export const StoreFront2Earth: React.FC<StoreFront2Props> = memo(({
  products, categories, brands, websiteConfig, logo, onProductClick, onBuyNow, onAddToCart, onCategoryClick, onOpenChat,
}) => {
  const active = useActiveProducts(products);
  const { newArrivals, topRated, bestSelling, dealProduct } = useProductSections(active);
  const handleAddToCart = useCallback((p: Product) => onAddToCart?.(p, 1, {}), [onAddToCart]);
  const handleBuyNow = useCallback((p: Product) => onBuyNow?.(p), [onBuyNow]);

  const activeCategories = useMemo(() => categories.filter(c => c.status === 'Active' || !c.status).slice(0, 6), [categories]);

  const renderEarthCard = useCallback((p: Product) => (
    <EarthProductCard product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} onBuyNow={() => handleBuyNow(p)} />
  ), [onProductClick, handleAddToCart, handleBuyNow]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: EE.bg, fontFamily: EE.fontBody }}>

      <EarthHero websiteConfig={websiteConfig} products={active} onProductClick={onProductClick} />

      {/* Trust strip */}
      <section className="py-5 border-b" style={{ backgroundColor: EE.accentLight, borderColor: EE.border }}>
        <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-center gap-8 text-sm" style={{ color: EE.text }}>
          {['🌱 Eco Friendly', '🚚 Free Delivery 999+', '🔄 Easy Returns', '❤️ 10K+ Happy Customers'].map(t => (
            <span key={t} className="font-bold">{t}</span>
          ))}
        </div>
      </section>

      {/* Categories as organic cards */}
      {activeCategories.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 py-10">
          <h2 className="text-2xl md:text-3xl text-center mb-8" style={{ fontFamily: EE.font, color: EE.text }}>Shop by Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {activeCategories.map((cat: any) => (
              <button key={cat.id || cat.name} onClick={() => onCategoryClick?.(cat.slug || cat.name)}
                className="px-5 py-2.5 rounded-full text-sm font-bold transition-colors hover:text-white"
                style={{ border: `2px solid ${EE.primary}`, color: EE.primary }}
                onMouseEnter={e => { (e.target as HTMLElement).style.backgroundColor = EE.primary; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.backgroundColor = 'transparent'; (e.target as HTMLElement).style.color = EE.primary; }}>
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Featured grid */}
      {newArrivals.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: EE.accent }}>Fresh Picks</span>
            <h2 className="text-2xl md:text-3xl mt-1" style={{ fontFamily: EE.font, color: EE.text }}>New Arrivals</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {newArrivals.slice(0, 8).map(p => (
              <EarthProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} onBuyNow={() => handleBuyNow(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Deal banner */}
      {dealProduct && (
        <section className="py-10" style={{ backgroundColor: EE.primary }}>
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
            <div className="text-white flex-1">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: EE.accent }}>🔥 Today's Deal</span>
              <h2 className="text-3xl mt-2 mb-2" style={{ fontFamily: EE.font }}>{dealProduct.title}</h2>
              <span className="text-2xl font-extrabold" style={{ color: EE.accent }}>৳{dealProduct.salePrice || dealProduct.price}</span>
            </div>
            <button onClick={() => onBuyNow?.(dealProduct)} className="px-8 py-3 rounded-full font-bold text-white"
              style={{ backgroundColor: EE.accent }}>Shop Now</button>
          </div>
        </section>
      )}

      <HScrollSection title="Top Rated" subtitle="Customer Favorites" products={topRated}
        renderCard={renderEarthCard} accentColor={EE.accent} />
      <HScrollSection title="Best Sellers" subtitle="Most Popular" products={bestSelling}
        renderCard={renderEarthCard} accentColor={EE.primary} />

      {/* Footer */}
      <footer className="py-10 border-t" style={{ borderColor: EE.border, backgroundColor: EE.accentLight }}>
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          {logo ? <img src={normalizeImageUrl(logo)} alt={websiteConfig?.storeName || 'Store'} className="h-7 object-contain mx-auto mb-4" />
            : <span className="text-xl block mb-4" style={{ fontFamily: EE.font, color: EE.primary }}>{websiteConfig?.storeName || 'Store'}</span>}
          <p className="text-xs" style={{ color: EE.textMuted }}>© {new Date().getFullYear()} {websiteConfig?.storeName || 'Store'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
});
StoreFront2Earth.displayName = 'StoreFront2Earth';


// ═════════════════════════════════════════════════════════════════════════════
//  VARIANT 3 – PASTEL  (Lavender/mint/peach, rounded bubbles, playful)
// ═════════════════════════════════════════════════════════════════════════════

const P = {
  primary: '#6c5ce7',       // lavender purple
  accent: '#fd79a8',        // soft pink
  mint: '#55efc4',          // mint
  peach: '#fab1a0',         // peach
  bg: '#fefefe',
  cardBg: '#ffffff',
  softBg: '#f8f6ff',       // very light lavender
  text: '#2d3436',
  textMuted: '#a29baf',
  border: '#ede8f5',
  font: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

const PastelProductCard = memo(({ product, onClick, onAddToCart, onBuyNow }: {
  product: Product; onClick: () => void; onAddToCart?: () => void; onBuyNow?: () => void;
}) => {
  const img = product.galleryImages?.[0] || product.image;
  const price = product.salePrice || product.price || 0;
  const originalPrice = product.price && product.salePrice && product.price > product.salePrice ? product.price : null;
  const discount = originalPrice ? calcDiscount(originalPrice, price) : 0;
  const bgColors = ['#f8f6ff', '#f0fff4', '#fff5f5', '#fef9e7'];
  const cardBg = bgColors[product.id ? product.id % bgColors.length : 0];

  return (
    <div className="group cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{ backgroundColor: cardBg, border: `1px solid ${P.border}` }} onClick={onClick}>
      <div className="relative aspect-square overflow-hidden">
        {img ? (
          <img src={normalizeImageUrl(img)} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: P.textMuted }}><Package size={40} /></div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 text-xs font-extrabold px-3 py-1 rounded-full text-white" style={{ backgroundColor: P.accent }}>-{discount}%</span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
            className="px-4 py-2 rounded-full text-xs font-bold text-white shadow-md" style={{ backgroundColor: P.primary }}>
            🛒 Cart
          </button>
          <button onClick={(e) => { e.stopPropagation(); onBuyNow?.(); }}
            className="px-4 py-2 rounded-full text-xs font-bold text-white shadow-md" style={{ backgroundColor: P.accent }}>
            ⚡ Buy
          </button>
        </div>
      </div>
      <div className="p-3.5 text-center">
        <p className="font-bold text-sm line-clamp-2 mb-1" style={{ color: P.text }}>{product.title}</p>
        <StarRating rating={product.rating || 4} color={P.accent} />
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="font-extrabold text-base" style={{ color: P.primary }}>৳{price}</span>
          {originalPrice && <span className="text-xs line-through" style={{ color: P.textMuted }}>৳{originalPrice}</span>}
        </div>
      </div>
    </div>
  );
});
PastelProductCard.displayName = 'PastelProductCard';

const PastelHero = memo(({ websiteConfig }: { websiteConfig?: WebsiteConfig }) => {
  const [slide, setSlide] = useState(0);
  const items = (websiteConfig?.carouselItems || [])
    .filter(i => String(i.status ?? '').trim().toLowerCase() === 'publish')
    .sort((a, b) => Number(a.serial ?? 0) - Number(b.serial ?? 0));
  const current = items[slide] || null;

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setSlide(prev => (prev + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  const heroBg = current?.imageUrl || current?.image || null;

  return (
    <div className="relative overflow-hidden" style={{ minHeight: '440px', background: `linear-gradient(135deg, ${P.primary}15, ${P.accent}15, ${P.mint}15)` }}>
      {heroBg && <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${normalizeImageUrl(heroBg)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20" style={{ backgroundColor: P.primary }} />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full opacity-20" style={{ backgroundColor: P.accent }} />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full opacity-15" style={{ backgroundColor: P.mint }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-24 md:py-32 text-center">
        <span className="inline-block text-sm font-extrabold px-5 py-2 rounded-full mb-6"
          style={{ backgroundColor: P.primary, color: '#fff', fontFamily: P.font }}>✨ New Season!</span>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4" style={{ fontFamily: P.font, color: P.text }}>
          {current?.title || 'Shop Happy!'}
        </h1>
        <p className="text-lg max-w-md mx-auto mb-8" style={{ color: P.textMuted, fontFamily: P.font }}>
          {current?.subtitle || 'Bright products for bright days'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="px-8 py-3 rounded-full font-extrabold text-white transition-transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: P.primary, fontFamily: P.font }}>
            Shop Now 🛍️
          </button>
          <button className="px-8 py-3 rounded-full font-extrabold transition-transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: P.accent, color: '#fff', fontFamily: P.font }}>
            View Deals 🔥
          </button>
        </div>
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_: any, i: number) => (
            <button key={i} onClick={() => setSlide(i)} className="w-3 h-3 rounded-full transition-all"
              style={{ backgroundColor: i === slide ? P.primary : P.border, transform: i === slide ? 'scale(1.3)' : 'scale(1)' }} />
          ))}
        </div>
      )}
    </div>
  );
});
PastelHero.displayName = 'PastelHero';

export const StoreFront2Pastel: React.FC<StoreFront2Props> = memo(({
  products, categories, brands, websiteConfig, logo, onProductClick, onBuyNow, onAddToCart, onCategoryClick, onOpenChat,
}) => {
  const active = useActiveProducts(products);
  const { newArrivals, topRated, bestSelling, dealProduct } = useProductSections(active);
  const handleAddToCart = useCallback((p: Product) => onAddToCart?.(p, 1, {}), [onAddToCart]);
  const handleBuyNow = useCallback((p: Product) => onBuyNow?.(p), [onBuyNow]);

  const activeCategories = useMemo(() => categories.filter(c => c.status === 'Active' || !c.status).slice(0, 8), [categories]);

  const renderPastelCard = useCallback((p: Product) => (
    <PastelProductCard product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} onBuyNow={() => handleBuyNow(p)} />
  ), [onProductClick, handleAddToCart, handleBuyNow]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: P.bg, fontFamily: P.font }}>

      <PastelHero websiteConfig={websiteConfig} />

      {/* Category bubbles */}
      {activeCategories.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 py-8">
          <h2 className="text-xl font-extrabold text-center mb-5" style={{ color: P.text }}>Browse Categories 🏷️</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {activeCategories.map((cat: any, i: number) => {
              const colors = [P.primary, P.accent, P.mint, P.peach];
              return (
                <button key={cat.id || cat.name} onClick={() => onCategoryClick?.(cat.slug || cat.name)}
                  className="px-5 py-2 rounded-full text-sm font-bold text-white transition-transform hover:scale-105 shadow-sm"
                  style={{ backgroundColor: colors[i % colors.length] }}>
                  {cat.name}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* New Arrivals grid */}
      {newArrivals.length > 0 && (
        <section className="py-10" style={{ backgroundColor: P.softBg }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: P.accent }}>✨ Fresh</span>
              <h2 className="text-2xl md:text-3xl font-extrabold mt-1" style={{ color: P.text }}>New Arrivals</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {newArrivals.slice(0, 8).map(p => (
                <PastelProductCard key={p.id} product={p} onClick={() => onProductClick(p)} onAddToCart={() => handleAddToCart(p)} onBuyNow={() => handleBuyNow(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deal banner */}
      {dealProduct && (
        <section className="py-8 max-w-[1200px] mx-auto px-6">
          <div className="rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
            style={{ background: `linear-gradient(135deg, ${P.primary}, ${P.accent})` }}>
            <div className="flex-1 text-white">
              <span className="text-xs font-extrabold uppercase tracking-widest opacity-80">⚡ Deal of the Day</span>
              <h3 className="text-2xl font-extrabold mt-2 mb-1">{dealProduct.title}</h3>
              <span className="text-3xl font-extrabold" style={{ color: P.mint }}>৳{dealProduct.salePrice || dealProduct.price}</span>
            </div>
            <button onClick={() => onBuyNow?.(dealProduct)} className="px-8 py-3 rounded-full font-extrabold text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: '#fff', color: P.primary }}>
              Grab Deal 🎁
            </button>
          </div>
        </section>
      )}

      <HScrollSection title="Top Rated ⭐" subtitle="Loved by Many" products={topRated}
        renderCard={renderPastelCard} accentColor={P.primary} />
      <HScrollSection title="Best Sellers 🏆" subtitle="Hot Picks" products={bestSelling}
        renderCard={renderPastelCard} accentColor={P.accent} />

      {/* Footer */}
      <footer className="py-10 border-t" style={{ borderColor: P.border, backgroundColor: P.softBg }}>
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          {logo ? <img src={normalizeImageUrl(logo)} alt={websiteConfig?.storeName || 'Store'} className="h-7 object-contain mx-auto mb-4" />
            : <span className="text-xl font-extrabold block mb-4" style={{ color: P.primary }}>{websiteConfig?.storeName || 'Store'}</span>}
          <p className="text-xs" style={{ color: P.textMuted }}>© {new Date().getFullYear()} {websiteConfig?.storeName || 'Store'}. Made with 💜</p>
        </div>
      </footer>
    </div>
  );
});
StoreFront2Pastel.displayName = 'StoreFront2Pastel';
