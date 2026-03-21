/**
 * GadgetsThemePage – Dynamic version of StoreFrontTheme2 (Gadgets Theme)
 * 
 * Exact same Figma design (lime-green accent, orange buy-now, rounded cards,
 * category grid, time counter, View All links, desktop/mobile responsive),
 * but powered by the shared data engine (products, categories, websiteConfig).
 */

import React, { memo, useMemo, useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import type { Product, WebsiteConfig } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

const TagCountdownTimer = lazy(() => import('./TagCountdownTimer').then(m => ({ default: m.TagCountdownTimer })));

// ─── Interface (same data engine) ────────────────────────────────────────────
interface GadgetTag {
  id?: number | string;
  name: string;
  status?: string;
  showCountdown?: boolean;
  expiresAt?: string;
}

interface GadgetsThemeProps {
  products: Product[];
  categories: any[];
  brands: any[];
  websiteConfig?: WebsiteConfig;
  logo?: string | null;
  tags?: GadgetTag[];
  onProductClick: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number, variant: any) => void;
  onCategoryClick?: (categorySlug: string) => void;
  onOpenChat?: () => void;
}

// ─── Palette (matches Figma: lime-500 accent, orange CTA) ────────────────────
const G = {
  accent: '#84cc16',       // lime-500
  accentDark: '#65a30d',   // lime-600
  buyNow: '#fb923c',       // orange-400
  buyNowHover: '#f97316',  // orange-500
  bg: '#f3f4f6',           // gray-100
  cardBg: '#ffffff',
  text: '#171717',         // neutral-900
  textMuted: '#525252',    // neutral-600
  border: '#e5e7eb',       // gray-200
  discountBg: '#fb923c',   // orange-400
  counterBorder: '#6d28d9', // violet-700
  counterText: '#6d28d9',
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const slugify = (s: string) =>
  s?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';

const formatPrice = (p: number) => `৳ ${p.toLocaleString('en-BD')}`;

const calcDiscount = (price: number, sale: number) =>
  Math.round(((price - sale) / price) * 100);

// ─── Time Counter (violet bordered boxes — uses real expiresAt if provided) ──
const GadgetTimeCounter = memo(({ expiresAt }: { expiresAt?: string }) => {
  const getSecondsLeft = () => {
    if (expiresAt) {
      return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
    }
    // Fallback: rolling timer to next hour
    const now = new Date();
    return (59 - now.getMinutes()) * 60 + (59 - now.getSeconds());
  };

  const [seconds, setSeconds] = useState(getSecondsLeft);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="relative items-center bg-transparent flex gap-x-[6px] gap-y-[6px] justify-center max-w-[430px] text-center w-auto z-[2] mx-auto md:bg-white md:w-full">
      {[
        { v: pad(h), l: 'Hours' },
        { v: pad(m), l: 'Mins' },
        { v: pad(s), l: 'Sec' },
      ].map(({ v, l }) => (
        <div key={l} className="items-center flex flex-col h-[34px] justify-center w-10 border-violet-700 rounded-[5px] border-2 border-solid">
          <div className="text-violet-700 text-xs font-bold leading-3">{v}</div>
          <div className="text-violet-700 text-[11px] font-medium brightness-[1.2] leading-3">{l}</div>
        </div>
      ))}
    </div>
  );
});
GadgetTimeCounter.displayName = 'GadgetTimeCounter';

// ─── Product Card (exact Figma design) ───────────────────────────────────────
const GadgetProductCard = memo(({ product, onClick, onAddToCart, onBuyNow }: {
  product: Product; onClick: () => void; onAddToCart?: () => void; onBuyNow?: () => void;
}) => {
  const img = product.galleryImages?.[0] || product.image;
  const basePrice = Number(product.price) || 0;
  const salePrice = Number(product.salePrice) || 0;
  const originalFromData = Number(product.originalPrice) || 0;

  const price = salePrice > 0 ? salePrice : basePrice;
  const displayOriginalPrice = originalFromData > price
    ? originalFromData
    : (salePrice > 0 && basePrice > salePrice ? basePrice : null);

  const parsedDiscount = Number(String(product.discount || '').replace(/[^0-9.]/g, '')) || 0;
  const discount = displayOriginalPrice
    ? calcDiscount(displayOriginalPrice, price)
    : parsedDiscount;
  const isStockOut = product.stock != null && product.stock <= 0;

  return (
    <div className="block">
      <div
        onClick={onClick}
        className="relative shadow-[rgba(0,0,0,0.07)_0px_0px_10px_0px] inline-block w-full border border-gray-200 rounded-2xl border-solid cursor-pointer hover:shadow-[rgba(0,0,0,0.07)_0px_0px_10px_0px] hover:border hover:border-lime-500 hover:rounded-2xl hover:border-solid transition-all"
      >
        <div className="bg-white max-w-xs w-full overflow-hidden rounded-2xl">
          {/* Image */}
          <div className="relative max-h-[50%]">
            <div className="items-center flex justify-center">
              <div className="items-center flex h-[149.25px] justify-center w-full overflow-hidden md:h-[220px]">
                {img ? (
                  <img
                    alt={product.title}
                    src={normalizeImageUrl(img)}
                    className="block h-full max-h-full max-w-full object-cover w-full md:object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                    <Package size={40} />
                  </div>
                )}
              </div>
            </div>
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute z-[9] left-0 top-0">
                <span className="text-white text-[11px] bg-orange-400 inline-block leading-3 px-2 py-[5px] rounded-[5px]">
                  -{discount}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="px-1.5 pb-2 md:px-2 md:pb-2.5">
            <div className="items-center gap-x-[3px] flex flex-col gap-y-0.5 my-1">
              <div>
                <p className="text-neutral-900 text-[13px] font-medium flow-root h-7 leading-[15px] text-center text-ellipsis break-all overflow-hidden mb-0.5 md:text-black md:text-sm md:h-[34px] md:leading-[17px] md:break-normal">
                 {String(product?.name || 'Unknown Product')}
                </p>
              </div>
              <div className="mb-0.5">
                <div className="flex items-center pt-0.5">
                  <span className="text-black text-[15px] font-medium flex h-[22px] tracking-[-0.56px] leading-[22px]">
                    {formatPrice(price)}
                  </span>
                  {displayOriginalPrice && (
                    <span className="text-black text-[13px] font-medium flex h-[22px] tracking-[-0.56px] leading-[22px] line-through ml-[7px]">
                      {formatPrice(displayOriginalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="items-center gap-x-1.5 flex gap-y-1.5 mt-1.5">
              {isStockOut ? (
                <button className="text-black items-center flex justify-center text-center text-sm font-semibold bg-neutral-200 h-9 opacity-70 w-full p-0 rounded-[5px] cursor-not-allowed md:h-[38px]">
                  Stock Out
                </button>
              ) : (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
                    className="text-black items-center flex justify-center text-center text-xs bg-neutral-400/40 shadow-[rgba(0,0,0,0.07)_0px_2px_8px_0px] gap-x-1 basis-[0%] grow h-9 gap-y-1 w-[38px] px-1 py-0 rounded md:text-[13px] md:h-[38px] md:px-0 hover:text-white hover:bg-lime-500 hover:shadow-[rgba(0,0,0,0.07)_0px_2px_8px_0px] hover:rounded transition-colors"
                  >
                    <ShoppingCart size={16} />
                    <span className="text-xs font-medium block px-px md:text-sm md:px-0">
                      Cart
                    </span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onBuyNow?.(); }}
                    className="text-white text-xs font-semibold items-center bg-orange-400 shadow-[rgba(0,0,0,0.07)_0px_2px_8px_0px] flex basis-[0%] grow h-9 justify-center text-center px-2 py-0 rounded-[5px] md:text-sm md:h-[38px] md:px-4 hover:bg-orange-500 hover:shadow-[rgba(0,0,0,0.07)_0px_2px_8px_0px] hover:rounded-[5px] transition-colors"
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
GadgetProductCard.displayName = 'GadgetProductCard';

// ─── Category Card (exact Figma design) ──────────────────────────────────────
const GadgetCategoryCard = memo(({ category, onClick }: {
  category: any; onClick: () => void;
}) => {
  const img = category.image || category.icon;

  return (
    <div className="block">
      <div
        onClick={onClick}
        className="items-center flex flex-col h-[86px] justify-center w-full border border-neutral-200 pt-1 rounded-[10px] border-solid cursor-pointer md:inline-block md:h-full md:pt-3 hover:shadow-[rgba(0,0,0,0.1)_1px_5px_10px_0px] hover:border-zinc-500/60 transition-shadow"
      >
        <div className="bg-white h-10 w-10 overflow-hidden mx-auto rounded-md md:h-[68px] md:w-[68px] md:rounded-[5px]">
          {img ? (
            <img
              alt={category.name}
              src={normalizeImageUrl(img)}
              className="inline-block h-full object-contain w-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 text-xs">
              {category.name?.[0] || '?'}
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="text-neutral-900 text-[12px] font-medium flow-root h-auto leading-[14px] overflow-hidden mx-0 my-1 px-2 md:text-black md:text-sm md:block md:h-[34px] md:leading-[17px] md:mt-1.5 md:mb-0 md:mx-2 md:px-0">
            {category.name}
          </div>
        </div>
      </div>
    </div>
  );
});
GadgetCategoryCard.displayName = 'GadgetCategoryCard';

// ─── Hero Carousel (exact Figma design) ──────────────────────────────────────
const GadgetHero = memo(({ websiteConfig }: { websiteConfig?: WebsiteConfig }) => {
  const items = (websiteConfig?.carouselItems || [])
    .filter(i => String(i.status ?? '').trim().toLowerCase() === 'publish')
    .sort((a, b) => Number(a.serial ?? 0) - Number(b.serial ?? 0));
  const [current, setCurrent] = useState(0);
  const total = items.length;

  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % total), 4000);
    return () => clearInterval(t);
  }, [total]);

  const goPrev = useCallback(() => setCurrent(p => (p - 1 + total) % total), [total]);
  const goNext = useCallback(() => setCurrent(p => (p + 1) % total), [total]);

  if (!total) return null;

  const item = items[current];
  const heroImg = item?.image || item?.imageUrl;

  return (
    <div className="flex-col h-[118px] max-w-[1340px] w-[92%] mt-1 mb-1 mx-auto md:flex-row md:h-[345px] md:w-full md:mb-0">
      <div className="relative bg-neutral-200 h-[118px] w-full overflow-hidden m-auto rounded-lg md:h-[345px] md:rounded-none">
        {/* Slides */}
        <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {items.map((itm: any, i: number) => {
            const imgSrc = itm?.image || itm?.imageUrl;
            return (
              <div key={i} className="h-full min-w-full w-full rounded-lg md:rounded-none flex-shrink-0">
                {imgSrc ? (
                  <img alt={itm?.title || `Slide ${i + 1}`} src={normalizeImageUrl(imgSrc)} className="block h-full object-cover w-full rounded-lg md:rounded-none" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-lime-100 to-lime-200 flex items-center justify-center">
                    <span className="text-lime-700 text-xl font-bold">{itm?.title || 'Sale'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Nav Arrows (desktop only) */}
        {total > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute text-white bg-gray-100 block h-[35px] opacity-0 invisible text-center w-[35px] z-[100] rounded-[50%] left-5 top-1/2 -translate-y-1/2 md:opacity-100 md:visible hover:bg-lime-500 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              className="absolute text-white bg-gray-100 block h-[35px] opacity-0 invisible text-center w-[35px] z-[100] rounded-[50%] right-5 top-1/2 -translate-y-1/2 md:opacity-100 md:visible hover:bg-lime-500 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="absolute flex gap-x-2.5 gap-y-2.5 -translate-x-1/2 left-1/2 bottom-[15px]">
            {items.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="block h-2 w-2 rounded-[50%] md:h-2.5 md:w-2.5 transition-colors"
                style={{ backgroundColor: i === current ? G.accent : 'rgba(255,255,255,0.4)' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
GadgetHero.displayName = 'GadgetHero';

// ─── Footer (dynamic version of Figma Footer) ───────────────────────────────
// Default footer link fallbacks (same as StoreFooter)
const defaultQuickLinks = [
  { id: '1', label: 'Home', url: '/' },
  { id: '2', label: 'Terms and Conditions', url: '/termsnconditions' },
  { id: '3', label: 'Return Policy', url: '/returnpolicy' },
];
const defaultUsefulLinks = [
  { id: '1', label: 'About Us', url: '/about' },
  { id: '2', label: 'Privacy Policy', url: '/privacy' },
  { id: '3', label: 'FAQ', url: '/faq' },
  { id: '4', label: 'Track Order', url: '/track' },
];

const GADGET_FOOTER_EMAIL_ICON = 'https://hdnfltv.com/image/nitimages/pasted_1773746473256.webp';
const GADGET_FOOTER_PHONE_ICON = 'https://hdnfltv.com/image/nitimages/pasted_1773746487757.webp';
const GADGET_FOOTER_ADDRESS_ICON = 'https://hdnfltv.com/image/nitimages/pasted_1773746503062.webp';

const GADGET_SOCIAL_ICON_URLS: Record<string, string> = {
  facebook: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg',
  fb: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg',
  instagram: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg',
  ig: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg',
  youtube: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/YouTube_social_red_circle_%282017%29.svg',
  yt: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/YouTube_social_red_circle_%282017%29.svg',
  twitter: 'https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg',
  x: 'https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg',
  linkedin: 'https://hdnfltv.com/image/nitimages/pasted_1773746619238.webp',
  tiktok: 'https://hdnfltv.com/image/nitimages/pasted_1773746605870.webp',
  tt: 'https://hdnfltv.com/image/nitimages/pasted_1773746605870.webp',
  whatsapp: 'https://hdnfltv.com/image/nitimages/2062095_application_chat_communication_logo_whatsapp_icon.webp',
  wa: 'https://hdnfltv.com/image/nitimages/2062095_application_chat_communication_logo_whatsapp_icon.webp',
  pinterest: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/YouTube_social_red_circle_%282017%29.svg',
  daraz: 'https://hdnfltv.com/image/nitimages/pasted_1773759254557.webp',
};

const GadgetFooter = memo(({ websiteConfig, logo }: { websiteConfig?: WebsiteConfig; logo?: string | null }) => {
  const storeName = websiteConfig?.storeName || 'Store';
  const description = websiteConfig?.shortDescription || '';
  const emails = websiteConfig?.emails || [];
  const phones = websiteConfig?.phones || [];
  const addresses = websiteConfig?.addresses || [];
  const socialLinks = websiteConfig?.socialLinks || [];
  const rawQuickLinks = websiteConfig?.footerQuickLinks || [];
  const rawUsefulLinks = websiteConfig?.footerUsefulLinks || [];
  const quickLinks = rawQuickLinks.filter(l => l.label && l.url).length > 0
    ? rawQuickLinks.filter(l => l.label && l.url)
    : defaultQuickLinks;
  const usefulLinks = rawUsefulLinks.filter(l => l.label && l.url).length > 0
    ? rawUsefulLinks.filter(l => l.label && l.url)
    : defaultUsefulLinks;

  return (
    <div>
      {/* Desktop Footer */}
      <div className="hidden md:block">
        <div className="bg-white mt-2">
          <div className="max-w-[1340px] w-[95%] mx-auto">
            <div className="gap-x-4 grid grid-cols-[1fr] gap-y-4 p-[10px] md:gap-x-5 md:grid-cols-[repeat(4,1fr)] md:gap-y-4 md:px-2 md:py-3">
              {/* Brand */}
              <div className="text-center w-full md:text-start">
                <div className="flex justify-center text-center mb-3 md:block md:justify-normal md:text-start">
                  {logo ? (
                    <img alt={storeName} src={normalizeImageUrl(logo)} className="block h-10 max-w-[180px] object-contain w-full" />
                  ) : (
                    <span className="text-xl font-bold text-neutral-900">{storeName}</span>
                  )}
                </div>
                {description && <p className="text-sm text-center md:text-start">{description}</p>}
                {socialLinks.length > 0 && (
                  <div className="items-center gap-x-2 flex justify-center gap-y-2 text-center mt-3 md:justify-normal md:text-start">
                    {socialLinks.map((s, i) => {
                      const platform = String(s.platform || '').toLowerCase();
                      const iconSrc = GADGET_SOCIAL_ICON_URLS[platform] || GADGET_SOCIAL_ICON_URLS.facebook;
                      return (
                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                          className="bg-gray-400/30 flex items-center justify-center w-9 h-9 rounded-full hover:bg-lime-500 transition-colors overflow-hidden">
                          <img src={iconSrc} alt={s.platform || 'social'} className="w-5 h-5 object-contain" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="text-center md:text-start">
                <b className="text-xl font-semibold block tracking-[-0.3px] leading-[30px] mb-3">Contact Us</b>
                <ul className="list-none pl-0">
                  {emails.map((e, i) => (
                    <li key={`e${i}`} className="items-center gap-x-2 flex flex-wrap justify-center gap-y-1.5 text-center w-full mb-1.5 md:flex-nowrap md:justify-start md:text-start">
                      <img src={GADGET_FOOTER_EMAIL_ICON} alt="email" className="w-4 h-4 object-contain" />
                      <span className="text-sm leading-[26px]">{e}</span>
                    </li>
                  ))}
                  {phones.map((p, i) => (
                    <li key={`p${i}`} className="items-center gap-x-2 flex flex-wrap justify-center gap-y-1.5 text-center w-full mb-1.5 md:flex-nowrap md:justify-start md:text-start">
                      <img src={GADGET_FOOTER_PHONE_ICON} alt="phone" className="w-4 h-4 object-contain" />
                      <a href={`tel:${p}`} className="text-sm leading-[26px] hover:text-black hover:no-underline">{p}</a>
                    </li>
                  ))}
                  {addresses.map((a, i) => (
                    <li key={`a${i}`} className="items-center gap-x-2 flex flex-wrap justify-center gap-y-1.5 text-center w-full mb-1.5 md:flex-nowrap md:justify-start md:text-start">
                      <img src={GADGET_FOOTER_ADDRESS_ICON} alt="address" className="w-4 h-4 object-contain" />
                      <span className="text-sm leading-[26px]">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              {quickLinks.length > 0 && (
                <div className="text-center md:text-start">
                  <b className="text-xl font-semibold block tracking-[-0.3px] leading-[30px] mb-3">Quick Links</b>
                  <ul className="list-none pl-0">
                    {quickLinks.map((link, i) => (
                      <li key={i} className="text-center py-1 md:text-start">
                        <a href={link.url} className="text-zinc-800 inline-block hover:text-blue-600 hover:no-underline">{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Useful Links */}
              {usefulLinks.length > 0 && (
                <div className="text-center md:text-start">
                  <b className="text-xl font-semibold block tracking-[-0.3px] leading-[30px] mb-3">Useful Links</b>
                  <ul className="list-none pl-0">
                    {usefulLinks.map((link, i) => (
                      <li key={i} className="text-center py-1 md:text-start">
                        <a href={link.url} className="text-zinc-800 inline-block hover:text-blue-600 hover:no-underline">{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Copyright */}
            {!websiteConfig?.hideCopyright && (
              <div className="border-t-indigo-300 flex justify-center mb-0 border-t px-3 py-3 md:px-6 md:py-4">
                <b className="text-neutral-600 text-sm block leading-[22px] text-center">
                  Copyright © {new Date().getFullYear()} {storeName}
                  {websiteConfig?.showPoweredBy && (
                    <><br /><span className="font-normal text-xs text-gray-400">Powered by Paatalika</span></>
                  )}
                </b>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="block md:hidden">
        <div className="bg-white mt-2">
          <div className="max-w-[1340px] w-[95%] mx-auto">
            <div className="gap-x-3 grid grid-cols-[1fr] gap-y-3 p-[10px]">
              <div className="text-center w-full">
                <div className="flex justify-center mb-3">
                  {logo ? (
                    <img alt={storeName} src={normalizeImageUrl(logo)} className="block h-10 max-w-[180px] object-contain w-full" />
                  ) : (
                    <span className="text-xl font-bold">{storeName}</span>
                  )}
                </div>
                {description && <p className="text-sm text-center mb-2">{description}</p>}
                {socialLinks.length > 0 && (
                  <div className="flex justify-center gap-2 mb-2">
                    {socialLinks.map((s, i) => {
                      const platform = String(s.platform || '').toLowerCase();
                      const iconSrc = GADGET_SOCIAL_ICON_URLS[platform] || GADGET_SOCIAL_ICON_URLS.facebook;
                      return (
                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                          className="bg-gray-400/30 flex items-center justify-center w-auto h-auto rounded-full hover:bg-lime-500 transition-colors overflow-hidden">
                          <img src={iconSrc} alt={s.platform || 'social'} className="w-5 h-5 object-contain" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* Contact */}
              {(emails.length > 0 || phones.length > 0 || addresses.length > 0) && (
                <div className="text-center">
                  <b className="text-base font-semibold block mb-1.5">Contact Us</b>
                  <ul className="list-none pl-0">
                    {emails.map((e, i) => (
                      <li key={`e${i}`} className="text-sm mb-0.5 flex items-center justify-center gap-1.5">
                        <img src={GADGET_FOOTER_EMAIL_ICON} alt="email" className="w-4 h-4 object-contain" />
                        <span>{e}</span>
                      </li>
                    ))}
                    {phones.map((p, i) => (
                      <li key={`p${i}`} className="text-sm mb-0.5 flex items-center justify-center gap-1.5">
                        <img src={GADGET_FOOTER_PHONE_ICON} alt="phone" className="w-4 h-4 object-contain" />
                        <a href={`tel:${p}`} className="hover:no-underline">{p}</a>
                      </li>
                    ))}
                    {addresses.map((a, i) => (
                      <li key={`a${i}`} className="text-sm mb-0.5 flex items-center justify-center gap-1.5">
                        <img src={GADGET_FOOTER_ADDRESS_ICON} alt="address" className="w-4 h-4 object-contain" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Quick Links */}
              <div className="text-center">
                <b className="text-base font-semibold block mb-1.5">Quick Links</b>
                <ul className="list-none pl-0">
                  {quickLinks.map((link, i) => (
                    <li key={i} className="py-0.5">
                      <a href={link.url} className="text-sm text-zinc-800 hover:text-lime-600 hover:no-underline">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Useful Links */}
              <div className="text-center">
                <b className="text-base font-semibold block mb-1.5">Useful Links</b>
                <ul className="list-none pl-0">
                  {usefulLinks.map((link, i) => (
                    <li key={i} className="py-0.5">
                      <a href={link.url} className="text-sm text-zinc-800 hover:text-lime-600 hover:no-underline">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {!websiteConfig?.hideCopyright && (
              <div className="border-t-indigo-300 flex justify-center mb-2 border-t px-3 py-2.5">
                <b className="text-neutral-600 text-sm block leading-[22px] text-center">
                  Copyright © {new Date().getFullYear()} {storeName}
                </b>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
GadgetFooter.displayName = 'GadgetFooter';

// ─── Product Section (section with title + optional timer + 2x5 grid) ────────
const GadgetProductSection = memo(({ title, products, expiresAt, onProductClick, onAddToCart, onBuyNow }: {
  title: string;
  products: Product[];
  expiresAt?: string;
  onProductClick: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
  onBuyNow?: (p: Product) => void;
}) => {
  if (!products.length) return null;
  const showTimer = !!expiresAt && new Date(expiresAt).getTime() > Date.now();

  return (
    <div>
      <div className="items-center flex-col max-w-[1340px] w-full mx-0 px-[10px] md:flex-row md:w-[95%] md:mx-auto md:px-0">
        <div className="items-center flex justify-between mt-2.5 mb-2">
          <div className="items-center gap-x-[5px] flex flex-col justify-center gap-y-[5px] md:gap-x-2 md:flex-row md:gap-y-2">
            <h2 className="text-neutral-900 text-base font-bold leading-[18px] md:text-neutral-700 md:text-[22px] md:font-medium md:leading-[normal] whitespace-nowrap">
              {title}
            </h2>
            {showTimer && <GadgetTimeCounter expiresAt={expiresAt} />}
          </div>
          <span className="text-black text-[13px] font-medium items-center flex leading-[15px] md:text-zinc-800 md:text-base cursor-pointer hover:text-lime-500">
            View All
            <ChevronRight size={20} className="ml-0 md:ml-2" />
          </span>
        </div>
        <div className="gap-x-[6px] grid grid-cols-[repeat(2,1fr)] gap-y-[6px] mb-3 md:gap-x-[10px] md:grid-cols-[repeat(5,1fr)] md:gap-y-[10px] md:mb-4">
          {products.map((product) => (
            <GadgetProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product)}
              onAddToCart={() => onAddToCart?.(product)}
              onBuyNow={() => onBuyNow?.(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
GadgetProductSection.displayName = 'GadgetProductSection';

// ─── Main Component ──────────────────────────────────────────────────────────
export const GadgetsThemePage: React.FC<GadgetsThemeProps> = memo(({
  products,
  categories,
  brands,
  websiteConfig,
  logo,
  tags,
  onProductClick,
  onBuyNow,
  onAddToCart,
  onCategoryClick,
  onOpenChat,
}) => {
  const active = useMemo(() => products.filter(p => p.status === 'Active' || !p.status), [products]);

  // Algorithmic sections
  const popularProducts = useMemo(() =>
    [...active].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10),
  [active]);
  const flashSaleProducts = useMemo(() =>
    active.filter(p => p.flashSale).slice(0, 10),
  [active]);
  const bestSaleProducts = useMemo(() =>
    [...active].sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0)).slice(0, 10),
  [active]);

  // Active tags from admin — each shows its own product section with optional countdown
  const activeTags = useMemo(() =>
    (tags || []).filter(t => !t.status || t.status === 'Active' || t.status?.toLowerCase() === 'active'),
  [tags]);

  const activeCategories = useMemo(() =>
    categories.filter(c => c.status === 'Active' || !c.status).slice(0, 8),
  [categories]);

  const handleAddToCart = useCallback((p: Product) => onAddToCart?.(p, 1, {}), [onAddToCart]);
  const handleBuyNow = useCallback((p: Product) => onBuyNow?.(p), [onBuyNow]);

  return (
    <main className="text-black text-base font-normal bg-gray-100 overflow-x-hidden scroll-smooth w-full font-sans md:bg-transparent">
      <div>
        {/* Hero Carousel */}
        <div className="min-h-[118px] mb-3 md:min-h-0 md:mb-0">
          <GadgetHero websiteConfig={websiteConfig} />

          {/* Categories */}
          {activeCategories.length > 0 && (
            <div>
              <div className="bg-white max-w-[1340px] w-[92%] mt-0 mx-auto pt-0 pb-[6px] px-[8px] rounded-[10px] md:bg-transparent md:w-[95%] md:mt-1 md:pt-1 md:pb-0 md:px-0 md:rounded-none">
                <div className="items-center flex h-[38px] justify-between leading-[38px]">
                  <h2 className="text-neutral-900 text-base font-bold leading-[18px] md:text-neutral-700 md:text-[22px] md:font-medium md:leading-[38px] whitespace-nowrap">
                    Categories
                  </h2>
                  <span className="text-black text-[13px] font-medium items-center flex leading-[15px] md:text-zinc-800 md:text-base md:leading-[38px] cursor-pointer hover:text-lime-500">
                    View All
                    <ChevronRight size={20} className="ml-0 md:ml-2" />
                  </span>
                </div>
                <div className="gap-x-[6px] grid grid-cols-[repeat(2,1fr)] gap-y-[6px] md:gap-x-[10px] md:grid-cols-[repeat(8,1fr)] md:gap-y-[10px]">
                  {activeCategories.map((cat: any) => (
                    <GadgetCategoryCard
                      key={cat.id || cat.name}
                      category={cat}
                      onClick={() => onCategoryClick?.(cat.slug || slugify(cat.name))}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Admin-created tag sections (appear first) ── */}
          {activeTags.map(tag => {
            const tagProducts = active.filter(p =>
              Array.isArray(p.tags) && p.tags.some((pt: any) =>
                (typeof pt === 'string' ? pt : pt?.name)?.toLowerCase() === tag.name?.toLowerCase()
              )
            ).slice(0, 10);
            if (!tagProducts.length) return null;
            return (
              <GadgetProductSection
                key={tag.id || tag.name}
                title={tag.name}
                products={tagProducts}
                expiresAt={tag.showCountdown && tag.expiresAt ? tag.expiresAt : undefined}
                onProductClick={onProductClick}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            );
          })}

          {/* ── Flash Sale (only when shop owner explicitly marks products) ── */}
          {flashSaleProducts.length > 0 && (
            <GadgetProductSection
              title="Flash Sale"
              products={flashSaleProducts}
              onProductClick={onProductClick}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          )}

          {/* ── Algorithmic sections ── */}
          <GadgetProductSection
            title="Popular Products"
            products={popularProducts}
            onProductClick={onProductClick}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />

          <GadgetProductSection
            title="Best Sale Products"
            products={bestSaleProducts}
            onProductClick={onProductClick}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>

        {/* Footer */}
        <GadgetFooter websiteConfig={websiteConfig} logo={logo} />
      </div>
    </main>
  );
});
GadgetsThemePage.displayName = 'GadgetsThemePage';
