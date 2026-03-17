/**
 * StoreFront2Page – Visual Variant #2
 * Same data engine as StoreFront1, completely different layout & style.
 *
 * Design language:
 *  - Deep indigo (#1e1b4b) + coral-orange (#f97316) accent
 *  - Sidebar category nav on desktop, top pill-scroll on mobile
 *  - Wide hero with gradient overlay + split content
 *  - Masonry-style featured grid
 *  - Horizontal scroll product rows
 *  - Countdown "Deal of the Day" strip
 *  - Minimalist card with hover lift
 *  - Clean footer with newsletter CTA
 */

import React, {
  memo,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  ShoppingCart,
  Star,
  Heart,
  Clock,
  Tag,
  ChevronRight,
  ChevronLeft,
  Zap,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  ArrowUpRight,
  Package,
} from 'lucide-react';
import type { Product, WebsiteConfig } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  primary: '#1e1b4b',      // deep indigo
  accent: '#f97316',       // coral-orange
  accentLight: '#fff7ed',  // very light orange
  secondaryBg: '#f8f7ff',  // light lavender bg
  surface: '#ffffff',
  borderLight: '#e8e6f8',
  textMain: '#111827',
  textMuted: '#6b7280',
  textInverse: '#ffffff',
} as const;

// ─── Interface (mirrors StoreFrontThemePage) ─────────────────────────────────
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
const slugify = (s: string) =>
  s?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';

const calcDiscount = (price: number, sale: number) =>
  Math.round(((price - sale) / price) * 100);

// ─── StarRating ───────────────────────────────────────────────────────────────
const StarRating = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={12}
        className={
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'text-gray-200 fill-gray-200'
        }
      />
    ))}
  </div>
));
StarRating.displayName = 'StarRating';

// ─── SF2 Product Card ─────────────────────────────────────────────────────────
const SF2ProductCard = memo(
  ({
    product,
    onClick,
    onAddToCart,
    onBuyNow,
    compact = false,
  }: {
    product: Product;
    onClick: () => void;
    onAddToCart?: () => void;
    onBuyNow?: () => void;
    compact?: boolean;
  }) => {
    const img = product.galleryImages?.[0] || product.image;
    const price = product.salePrice || product.price || 0;
    const originalPrice =
      product.price && product.salePrice && product.price > product.salePrice
        ? product.price
        : null;
    const discount = originalPrice ? calcDiscount(originalPrice, price) : 0;

    return (
      <div
        className={`group relative bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${compact ? 'shadow-sm border border-gray-100' : 'shadow-md'}`}
        onClick={onClick}
        style={{ borderColor: C.borderLight }}
      >
        {/* image */}
        <div className={`relative overflow-hidden bg-gray-50 ${compact ? 'aspect-[4/3]' : 'aspect-square'}`}>
          {img ? (
            <img
              src={normalizeImageUrl(img)}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <Package size={40} />
            </div>
          )}
          {discount > 0 && (
            <span
              className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: C.accent }}
            >
              -{discount}%
            </span>
          )}
          {/* hover overlay buttons */}
          <div className="absolute inset-0 flex items-end justify-between px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg"
              style={{ backgroundColor: C.primary }}
            >
              <ShoppingCart size={13} />
              Cart
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onBuyNow?.(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg"
              style={{ backgroundColor: C.accent }}
            >
              <Zap size={13} />
              Buy
            </button>
          </div>
        </div>

        {/* info */}
        <div className="p-3 flex flex-col flex-1 gap-1.5">
          <p className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">
            {product.title}
          </p>
          <StarRating rating={product.rating || 4} />
          <div className="flex items-center gap-2 mt-auto pt-1">
            <span className="font-bold text-base" style={{ color: C.accent }}>
              ৳{price}
            </span>
            {originalPrice && (
              <span className="text-gray-400 text-xs line-through">৳{originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
);
SF2ProductCard.displayName = 'SF2ProductCard';

// ─── Horizontal Scroll Row ────────────────────────────────────────────────────
const HScrollRow = memo(
  ({
    title,
    subtitle,
    products,
    onProductClick,
    onAddToCart,
    onBuyNow,
    accentColor,
  }: {
    title: string;
    subtitle?: string;
    products: Product[];
    onProductClick: (p: Product) => void;
    onAddToCart?: (p: Product) => void;
    onBuyNow?: (p: Product) => void;
    accentColor?: string;
  }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    };

    if (!products.length) return null;

    return (
      <section className="py-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: accentColor || C.accent }}
              >
                {subtitle}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">{title}</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors"
                style={{ borderColor: C.borderLight }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors"
                style={{ backgroundColor: C.primary }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((p) => (
              <div key={p.id} className="flex-none w-[180px] md:w-[220px] snap-start">
                <SF2ProductCard
                  product={p}
                  onClick={() => onProductClick(p)}
                  onAddToCart={() => onAddToCart?.(p)}
                  onBuyNow={() => onBuyNow?.(p)}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);
HScrollRow.displayName = 'HScrollRow';

// ─── Hero Banner ──────────────────────────────────────────────────────────────
const SF2Hero = memo(
  ({
    websiteConfig,
    categories,
    products,
    onCategoryClick,
    onProductClick,
  }: {
    websiteConfig?: WebsiteConfig;
    categories: any[];
    products: Product[];
    onCategoryClick?: (slug: string) => void;
    onProductClick: (p: Product) => void;
  }) => {
    const [slide, setSlide] = useState(0);
    const items = websiteConfig?.carouselItems || [];
    const featuredProduct = products[0];

    useEffect(() => {
      if (items.length <= 1) return;
      const t = setInterval(() => setSlide((p) => (p + 1) % items.length), 4000);
      return () => clearInterval(t);
    }, [items.length]);

    const current = items[slide] || null;
    const heroBg =
      current?.imageUrl ||
      current?.image ||
      (featuredProduct?.galleryImages?.[0] || featuredProduct?.image) ||
      null;

    const heroTitle = current?.title || websiteConfig?.storeName || 'Discover Premium Products';
    const heroSub = current?.subtitle || 'Best deals, every day';

    const activeCategories = categories
      .filter((c) => c.status === 'Active' || !c.status)
      .slice(0, 6);

    return (
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #312e81 50%, #4338ca 100%)` }}
      >
        {/* Background product image */}
        {heroBg && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${normalizeImageUrl(heroBg)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row gap-12 items-center">
          {/* Text side */}
          <div className="flex-1 text-white">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: C.accent, color: '#fff' }}
            >
              New Season
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              {heroTitle}
            </h1>
            <p className="text-white/70 text-lg mb-8">{heroSub}</p>
            <div className="flex flex-wrap gap-3">
              <button
                className="px-7 py-3 rounded-full font-bold text-white transition-opacity hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: C.accent }}
                onClick={() => onCategoryClick?.('')}
              >
                Shop Now <ArrowUpRight size={18} />
              </button>
              <button
                className="px-7 py-3 rounded-full font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                Browse Deals
              </button>
            </div>

            {/* Quick category pills */}
            {activeCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => onCategoryClick?.(slugify(cat.name))}
                    className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-sm font-medium transition-colors backdrop-blur-sm"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product showcase */}
          {featuredProduct && (
            <div
              className="flex-shrink-0 w-[260px] md:w-[320px] bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 cursor-pointer transition-transform hover:scale-105"
              onClick={() => onProductClick(featuredProduct)}
            >
              {(featuredProduct.galleryImages?.[0] || featuredProduct.image) && (
                <img
                  src={normalizeImageUrl(featuredProduct.galleryImages?.[0] || featuredProduct.image!)}
                  alt={featuredProduct.title}
                  className="w-full aspect-square object-cover"
                />
              )}
              <div className="p-4 text-white">
                <p className="font-semibold text-sm line-clamp-2 mb-1">{featuredProduct.title}</p>
                <span className="font-bold text-lg" style={{ color: C.accent }}>
                  ৳{featuredProduct.salePrice || featuredProduct.price}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Slide dots */}
        {items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {items.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === slide ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: i === slide ? C.accent : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
SF2Hero.displayName = 'SF2Hero';

// ─── Deal of the Day Strip ────────────────────────────────────────────────────
const DealStrip = memo(
  ({
    dealProduct,
    onProductClick,
    onBuyNow,
  }: {
    dealProduct: Product;
    onProductClick: (p: Product) => void;
    onBuyNow?: (p: Product) => void;
  }) => {
    const [timeLeft, setTimeLeft] = useState({ h: 11, m: 59, s: 59 });

    useEffect(() => {
      const t = setInterval(() => {
        setTimeLeft((prev) => {
          let { h, m, s } = prev;
          s--;
          if (s < 0) { s = 59; m--; }
          if (m < 0) { m = 59; h--; }
          if (h < 0) return { h: 23, m: 59, s: 59 };
          return { h, m, s };
        });
      }, 1000);
      return () => clearInterval(t);
    }, []);

    const pad = (n: number) => String(n).padStart(2, '0');
    const img = dealProduct.galleryImages?.[0] || dealProduct.image;
    const price = dealProduct.salePrice || dealProduct.price || 0;
    const originalPrice = dealProduct.price && dealProduct.salePrice && dealProduct.price > dealProduct.salePrice ? dealProduct.price : null;

    return (
      <section
        className="py-8 md:py-12"
        style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #1e3a5f 100%)` }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Timer */}
            <div className="text-white text-center md:text-left flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={20} style={{ color: C.accent }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: C.accent }}>
                  Deal of the Day
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                Limited Time Offer
              </h2>
              <div className="flex gap-3">
                {[
                  { label: 'HRS', value: timeLeft.h },
                  { label: 'MIN', value: timeLeft.m },
                  { label: 'SEC', value: timeLeft.s },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div
                      className="text-2xl font-mono font-extrabold w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: C.accent, color: '#fff' }}
                    >
                      {pad(value)}
                    </div>
                    <div className="text-white/60 text-xs mt-1 font-bold tracking-widest">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product */}
            <div
              className="flex items-center gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-5 cursor-pointer flex-1 max-w-lg hover:bg-white/15 transition-colors border border-white/10"
              onClick={() => onProductClick(dealProduct)}
            >
              {img && (
                <img
                  src={normalizeImageUrl(img)}
                  alt={dealProduct.title}
                  className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
                />
              )}
              <div className="text-white flex-1 min-w-0">
                <p className="font-bold text-lg leading-snug mb-2 line-clamp-2">{dealProduct.title}</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold" style={{ color: C.accent }}>
                    ৳{price}
                  </span>
                  {originalPrice && (
                    <span className="text-white/50 text-sm line-through">৳{originalPrice}</span>
                  )}
                </div>
                {originalPrice && (
                  <span
                    className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-2"
                    style={{ backgroundColor: C.accent }}
                  >
                    {calcDiscount(originalPrice, price)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={(e) => { e.stopPropagation(); onBuyNow?.(dealProduct); }}
              className="flex-shrink-0 px-8 py-4 rounded-full font-bold text-white transition-opacity hover:opacity-90 text-lg shadow-lg"
              style={{ backgroundColor: C.accent }}
            >
              Grab Deal
            </button>
          </div>
        </div>
      </section>
    );
  }
);
DealStrip.displayName = 'DealStrip';

// ─── Category Sidebar + Grid ──────────────────────────────────────────────────
const CategorySection = memo(
  ({
    categories,
    products,
    onCategoryClick,
    onProductClick,
    onAddToCart,
    onBuyNow,
  }: {
    categories: any[];
    products: Product[];
    onCategoryClick?: (slug: string) => void;
    onProductClick: (p: Product) => void;
    onAddToCart?: (p: Product) => void;
    onBuyNow?: (p: Product) => void;
  }) => {
    const activeCategories = categories
      .filter((c) => c.status === 'Active' || !c.status)
      .slice(0, 8);

    const [selected, setSelected] = useState<string | null>(null);

    const filteredProducts = useMemo(() => {
      if (!selected) return products.slice(0, 12);
      return products
        .filter(
          (p) =>
            p.category?.toLowerCase() === selected.toLowerCase() ||
            slugify(p.category || '') === selected
        )
        .slice(0, 12);
    }, [selected, products]);

    const handleCatSelect = (name: string) => {
      const slug = slugify(name);
      if (selected === slug) {
        setSelected(null);
        onCategoryClick?.('');
      } else {
        setSelected(slug);
        onCategoryClick?.(slug);
      }
    };

    if (products.length === 0 && categories.length === 0) return null;

    return (
      <section className="py-12" style={{ backgroundColor: C.secondaryBg }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar categories */}
            {activeCategories.length > 0 && (
              <aside className="md:w-48 flex-shrink-0">
                <h3 className="font-extrabold text-lg mb-4" style={{ color: C.primary }}>
                  Categories
                </h3>
                <ul className="space-y-1 md:space-y-0.5">
                  <li>
                    <button
                      onClick={() => { setSelected(null); onCategoryClick?.(''); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${selected === null ? 'text-white' : 'text-gray-700 hover:bg-white'}`}
                      style={selected === null ? { backgroundColor: C.primary } : {}}
                    >
                      All Products
                    </button>
                  </li>
                  {activeCategories.map((cat) => {
                    const slug = slugify(cat.name);
                    const active = selected === slug;
                    return (
                      <li key={cat.id || cat.name}>
                        <button
                          onClick={() => handleCatSelect(cat.name)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${active ? 'text-white' : 'text-gray-700 hover:bg-white'}`}
                          style={active ? { backgroundColor: C.accent } : {}}
                        >
                          <span>{cat.name}</span>
                          <ChevronRight size={14} />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Mobile pill scroll */}
                <div className="md:hidden flex gap-2 overflow-x-auto pb-1 mt-2" style={{ scrollbarWidth: 'none' }}>
                  {activeCategories.map((cat) => {
                    const slug = slugify(cat.name);
                    const active = selected === slug;
                    return (
                      <button
                        key={cat.id || cat.name}
                        onClick={() => handleCatSelect(cat.name)}
                        className="flex-none px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border"
                        style={
                          active
                            ? { backgroundColor: C.accent, color: '#fff', borderColor: C.accent }
                            : { backgroundColor: '#fff', color: C.textMain, borderColor: C.borderLight }
                        }
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </aside>
            )}

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <SF2ProductCard
                    key={p.id}
                    product={p}
                    onClick={() => onProductClick(p)}
                    onAddToCart={() => onAddToCart?.(p)}
                    onBuyNow={() => onBuyNow?.(p)}
                  />
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-16 text-center text-gray-400">
                    <Package size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No products in this category yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
CategorySection.displayName = 'CategorySection';

// ─── Featured Masonry Grid ─────────────────────────────────────────────────────
const FeaturedMasonry = memo(
  ({
    products,
    onProductClick,
  }: {
    products: Product[];
    onProductClick: (p: Product) => void;
  }) => {
    if (products.length < 3) return null;
    const [big, ...rest] = products.slice(0, 5);
    const smallItems = rest.slice(0, 4);

    const renderSmall = (p: Product) => {
      const img = p.galleryImages?.[0] || p.image;
      return (
        <div
          key={p.id}
          className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] cursor-pointer group"
          onClick={() => onProductClick(p)}
        >
          {img && (
            <img
              src={normalizeImageUrl(img)}
              alt={p.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white font-semibold text-sm line-clamp-1">{p.title}</p>
            <span className="text-white/90 text-xs font-bold">
              ৳{p.salePrice || p.price}
            </span>
          </div>
          <span
            className="absolute top-2 right-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: C.accent }}
          >
            Shop Now
          </span>
        </div>
      );
    };

    const bigImg = big.galleryImages?.[0] || big.image;

    return (
      <section className="py-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: C.accent }}>
              Featured
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Handpicked Picks
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {/* Big card spans 2 rows */}
          <div
            className="relative rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group row-span-2 col-span-1"
            onClick={() => onProductClick(big)}
          >
            {bigImg && (
              <img
                src={normalizeImageUrl(bigImg)}
                alt={big.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white font-bold text-lg line-clamp-2 mb-1">{big.title}</p>
              <span className="font-extrabold text-xl" style={{ color: C.accent }}>
                ৳{big.salePrice || big.price}
              </span>
            </div>
          </div>
          {/* Small cards */}
          {smallItems.map(renderSmall)}
        </div>
      </section>
    );
  }
);
FeaturedMasonry.displayName = 'FeaturedMasonry';

// ─── Trust Banner ─────────────────────────────────────────────────────────────
const TrustBanner = memo(() => {
  const items = [
    { icon: <Package size={22} />, title: 'Free Delivery', desc: 'On orders over ৳999' },
    { icon: <Tag size={22} />, title: 'Best Prices', desc: 'Guaranteed lowest prices' },
    { icon: <Clock size={22} />, title: '24/7 Support', desc: 'Always here to help' },
    { icon: <Heart size={22} />, title: 'Trusted Store', desc: '10,000+ happy customers' },
  ];

  return (
    <section
      className="border-y py-6"
      style={{ backgroundColor: C.accentLight, borderColor: '#fde8d0' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x"
          style={{ '--tw-divide-opacity': '1' } as React.CSSProperties}
        >
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3 px-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: C.accent, color: '#fff' }}
              >
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: C.primary }}>{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
TrustBanner.displayName = 'TrustBanner';

// ─── Full-width Promo Banner ──────────────────────────────────────────────────
const PromoBanner = memo(({ products, onProductClick }: { products: Product[]; onProductClick: (p: Product) => void }) => {
  const featured = products.slice(0, 3);
  if (featured.length === 0) return null;

  const colors = [
    { bg: '#fdf4ff', accent: '#a855f7', label: 'New Arrival' },
    { bg: '#f0fdf4', accent: '#22c55e', label: 'Top Rated' },
    { bg: '#fff7ed', accent: C.accent, label: 'Flash Deal' },
  ];

  return (
    <section className="py-8 max-w-[1400px] mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.map((p, i) => {
          const img = p.galleryImages?.[0] || p.image;
          const color = colors[i % colors.length];
          return (
            <div
              key={p.id}
              className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: color.bg }}
              onClick={() => onProductClick(p)}
            >
              {img && (
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={normalizeImageUrl(img)} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: color.accent }}
                >
                  {color.label}
                </span>
                <p className="font-bold text-gray-900 text-sm mt-0.5 line-clamp-2">{p.title}</p>
                <p className="font-extrabold mt-1" style={{ color: color.accent }}>
                  ৳{p.salePrice || p.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});
PromoBanner.displayName = 'PromoBanner';

// ─── Footer ───────────────────────────────────────────────────────────────────
const SF2Footer = memo(
  ({
    logo,
    websiteConfig,
  }: {
    logo?: string | null;
    websiteConfig?: WebsiteConfig;
  }) => {
    const storeName = websiteConfig?.storeName || 'Our Store';
    const phone = websiteConfig?.phones || '';
    const email = websiteConfig?.emails || '';

    return (
      <footer style={{ backgroundColor: C.primary }}>
        {/* Newsletter */}
        <div
          className="py-12 border-b border-white/10"
          style={{ background: `linear-gradient(135deg, ${C.accent}22, transparent)` }}
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center">
            <h3 className="text-2xl font-extrabold text-white mb-2">
              Stay in the Loop
            </h3>
            <p className="text-white/60 mb-6">
              Get exclusive deals and updates delivered to your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3 rounded-full bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-white/50 text-sm"
              />
              <button
                type="submit"
                className="px-7 py-3 rounded-full font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: C.accent }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Links */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              {logo ? (
                <img
                  src={normalizeImageUrl(logo)}
                  alt={storeName}
                  className="h-8 mb-4 object-contain brightness-0 invert"
                />
              ) : (
                <span className="text-white font-extrabold text-xl mb-4 block">{storeName}</span>
              )}
              <p className="text-white/50 text-sm leading-relaxed">
                Quality products at prices that make sense.
              </p>
              <div className="flex gap-3 mt-5">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                    style={{ backgroundColor: C.accent }}
                  >
                    <Icon size={15} className="text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            {[
              {
                title: 'Shop',
                links: ['All Products', 'New Arrivals', 'Best Sellers', 'Flash Sale'],
              },
              {
                title: 'Help',
                links: ['FAQ', 'Shipping Info', 'Returns', 'Contact'],
              },
              {
                title: 'Company',
                links: ['About Us', 'Privacy Policy', 'Terms of Service'],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact row */}
          {(phone || email) && (
            <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-white/10">
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                  <Phone size={16} style={{ color: C.accent }} />
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                  <Mail size={16} style={{ color: C.accent }} />
                  {email}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 text-center text-white/30 text-xs">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </div>
      </footer>
    );
  }
);
SF2Footer.displayName = 'SF2Footer';

// ─── Main Component ────────────────────────────────────────────────────────────
export const StoreFront2Page: React.FC<StoreFront2Props> = memo(({
  products,
  categories,
  brands,
  websiteConfig,
  logo,
  onProductClick,
  onBuyNow,
  onAddToCart,
  onCategoryClick,
  onOpenChat,
}) => {
  const activeProducts = useMemo(
    () => products.filter((p) => p.status === 'Active' || !p.status),
    [products]
  );

  // Product sections
  const newArrivals = useMemo(() => [...activeProducts].slice(0, 10), [activeProducts]);
  const topRated = useMemo(
    () => [...activeProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10),
    [activeProducts]
  );
  const bestSelling = useMemo(
    () => [...activeProducts].sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0)).slice(0, 10),
    [activeProducts]
  );
  const dealProduct = useMemo(() => {
    // Pick product with highest discount
    return [...activeProducts].sort((a, b) => {
      const discA = a.price && a.salePrice ? calcDiscount(a.price, a.salePrice) : 0;
      const discB = b.price && b.salePrice ? calcDiscount(b.price, b.salePrice) : 0;
      return discB - discA;
    })[0] || activeProducts[0];
  }, [activeProducts]);

  const handleAddToCart = useCallback(
    (p: Product) => { onAddToCart?.(p, 1, {}); },
    [onAddToCart]
  );
  const handleBuyNow = useCallback(
    (p: Product) => { onBuyNow?.(p); },
    [onBuyNow]
  );

  return (
    <div
      className="bg-white min-h-screen"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Inter font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Hero */}
      <SF2Hero
        websiteConfig={websiteConfig}
        categories={categories}
        products={activeProducts}
        onCategoryClick={onCategoryClick}
        onProductClick={onProductClick}
      />

      {/* Trust Banner */}
      <TrustBanner />

      {/* Promo banners (new arrivals highlight) */}
      <PromoBanner products={activeProducts.slice(1, 4)} onProductClick={onProductClick} />

      {/* Deal of the Day */}
      {dealProduct && (
        <DealStrip
          dealProduct={dealProduct}
          onProductClick={onProductClick}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Featured Masonry */}
      <FeaturedMasonry
        products={activeProducts.slice(0, 5)}
        onProductClick={onProductClick}
      />

      {/* Category Sidebar + Grid */}
      <CategorySection
        categories={categories}
        products={activeProducts}
        onCategoryClick={onCategoryClick}
        onProductClick={onProductClick}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* New Arrivals horizontal row */}
      <HScrollRow
        title="New Arrivals"
        subtitle="Just Dropped"
        products={newArrivals}
        onProductClick={onProductClick}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        accentColor="#a855f7"
      />

      {/* Top Rated horizontal row */}
      <HScrollRow
        title="Top Rated"
        subtitle="Customer Favourites"
        products={topRated}
        onProductClick={onProductClick}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        accentColor="#22c55e"
      />

      {/* Best Selling horizontal row */}
      <HScrollRow
        title="Best Sellers"
        subtitle="Flying off the shelves"
        products={bestSelling}
        onProductClick={onProductClick}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Footer */}
      <SF2Footer logo={logo} websiteConfig={websiteConfig} />
    </div>
  );
});

StoreFront2Page.displayName = 'StoreFront2Page';
export default StoreFront2Page;
