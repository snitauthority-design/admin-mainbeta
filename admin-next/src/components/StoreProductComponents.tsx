import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Eye, Zap, Package, Share2 } from 'lucide-react';
import { Product, CarouselItem, WebsiteConfig } from '../types';
import { LazyImage } from '../utils/performanceOptimization';
import { normalizeImageUrl } from '../utils/imageUrlHelper';
import { useLanguage } from '../context/LanguageContext';

const showToast = {
  success: (msg: string) => import('react-hot-toast').then(m => m.toast.success(msg)),
};

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  variant?: string;
  onQuickView?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  wishlist?: number[];
  onToggleWishlist?: (productId: number) => void;
  showSoldCount?: boolean; // Add this line!
  discount?: 'percentage' | 'amount'; // Add this line!
}

const getImage = (p: Product) => normalizeImageUrl(p.galleryImages?.[0] || p.image);

// Style 1: Default - Clean modern card with gradient top bar
const ProductCardStyle1: React.FC<ProductCardProps> = ({ product, onClick, onBuyNow, onAddToCart, wishlist = [], onToggleWishlist, showSoldCount }) => {
  const { t } = useLanguage();
  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock === 0;
  const handleBuyNow = (e?: React.MouseEvent) => { e?.stopPropagation(); if (!isOutOfStock) { onBuyNow ? onBuyNow(product) : onClick(product); } };
  const handleCart = (e: React.MouseEvent) => { e.stopPropagation(); if (!isOutOfStock) onAddToCart?.(product); };
  const handleWishlist = (e: React.MouseEvent) => { e.stopPropagation(); onToggleWishlist?.(product.id); showToast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️'); };
  const discountPercent = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;
  const soldCount = (product.initialSoldCount || 0) + (product.soldCount || 0);

  return (
    <div className="group bg-white rounded-xl overflow-hidden flex flex-col relative border border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" style={{ contain: 'layout' }}>

      <button
        className="absolute top-1.5 left-1.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-pink-500 hover:scale-110 active:scale-95 transition-all"
        onClick={handleWishlist}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2} />
      </button>

      <div className="absolute top-1.5 right-1.5 z-10 flex flex-col gap-0.5">
        {(product.discount || discountPercent) && (
          <span className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm bg-rose-500">
            {product.discount || `-${discountPercent}%`}
          </span>
        )}
        {isOutOfStock && (
          <span className="text-white text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-gray-800">
            Sold Out
          </span>
        )}
      </div>

      <div className={`relative cursor-pointer bg-gray-50/50 overflow-hidden ${isOutOfStock ? 'opacity-40 grayscale-[30%]' : ''}`} style={{ aspectRatio: '1/1' }} onClick={() => onClick(product)}>
        <LazyImage
          src={getImage(product)}
          alt={product.name}
          className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
          width={400}
          height={400}
        />
      </div>

      <div className="px-2 pb-2 pt-1.5 md:px-2.5 md:pb-2.5 flex-1 flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5 text-[9px] md:text-[10px] text-amber-600 font-semibold">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span>{product.rating || 5}</span>
            <span className="text-gray-400 font-normal">({product.reviews || 0})</span>
          </div>
          {(showSoldCount || soldCount > 0) && (
            <span className="text-[8px] md:text-[9px] text-gray-400 font-medium">
              {soldCount > 999 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount} sold
            </span>
          )}
        </div>

        <h3 className="font-medium text-gray-800 text-[11px] md:text-[13px] leading-[1.3] line-clamp-2 cursor-pointer hover:text-theme-primary transition-colors" onClick={() => onClick(product)}>
          {product.name}
        </h3>

        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-[14px] md:text-base font-bold text-theme-primary leading-none">৳{product.price?.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] md:text-[11px] text-gray-400 line-through font-medium leading-none">৳{product.originalPrice?.toLocaleString()}</span>
          )}
        </div>

        <div className="flex gap-1.5 mt-1">
          <button
            className={`flex items-center justify-center w-8 h-7 md:h-8 border rounded-lg transition-all active:scale-95 ${isOutOfStock ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-theme-primary hover:text-white hover:border-theme-primary'}`}
            onClick={handleCart}
            title={t('add_to_cart')}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={14} />
          </button>
          <button
            className={`flex-1 text-[11px] md:text-xs font-bold rounded-lg h-7 md:h-8 transition-all active:scale-95 flex items-center justify-center gap-1 ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-theme-primary text-white hover:brightness-110 shadow-sm shadow-theme-primary/20'}`}
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Sold Out' : t('buy_now')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Style 2: Minimal - Clean with hover overlay actions
const ProductCardStyle2: React.FC<ProductCardProps> = ({ product, onClick, onBuyNow, onAddToCart, wishlist = [], onToggleWishlist }) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock === 0;
  const handleBuyNow = (e?: React.MouseEvent) => { e?.stopPropagation(); onBuyNow ? onBuyNow(product) : onClick(product); };
  const handleCart = (e: React.MouseEvent) => { e.stopPropagation(); if (!isOutOfStock) onAddToCart?.(product); };
  const handleWishlist = (e: React.MouseEvent) => { e.stopPropagation(); onToggleWishlist?.(product.id); showToast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️'); };
  const discountPercent = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;
  const price = product.price || 0;
  const originalPrice = product.originalPrice || 0;
  const soldOutLabel = t('sold_out');
// Note: This style emphasizes a clean look with interactive hover actions for quick view and add to cart, while keeping the product information concise and focused.
return (
    <div 
      className="relative inline-flex h-full w-full cursor-pointer flex-col rounded-lg sm:rounded-xl border border-[#ebebeb] bg-white shadow-[0_0_10px_rgba(0,0,0,0.07)] transition-all duration-500 ease-in-out no-underline"
      style={{ contain: 'layout' }}
      onMouseEnter={() => setIsHovered?.(true)}
      onMouseLeave={() => setIsHovered?.(false)}
    >
      {/* ইমেজ সেকশন */}
      <div 
        className="relative m-1 mb-0 overflow-hidden rounded-lg sm:rounded-xl bg-[#f8f8f8] group-hover:opacity-95 transition-opacity"
        style={{ aspectRatio: '1.2/1' }} 
        onClick={() => onClick?.(product)}
      >
        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-[#FF3C3C] text-white text-[10px] md:text-sm lg:text-base font-bold px-2 py-1 rounded-lg shadow-sm">
            -{discountPercent}%
          </div>
        )}
         <button
          onClick={(e) => { 
            e.stopPropagation(); 
            handleWishlist(e);
          }}
          className="absolute top-0 left-0 z-10 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center cursor-pointer bg-white/80 backdrop-blur-sm rounded-full transition-transform active:scale-90"
        >
          <Heart 
            fill={isWishlisted ? "#E72960" : "transparent"} 
            color="#E72960" 
            className="w-4 h-4 lg:h-6 lg:w-6 transition-colors" 
          />
        </button>


        {/* <img 
          // src={getImage(product)} 
          alt={product?.name || 'Product'} 
          className="w-full h-full object-contain p-4 transform group-hover/img:scale-110 transition-transform duration-700 ease-in-out" 
          loading="lazy"
        /> */}

        <div className="flex h-[130px] sm:h-[150px] md:h-[210px] w-full items-center justify-center overflow-hidden px-1 py-0.5 sm:px-1.5 sm:py-1">
          <img 
            src={getImage(product)}
            alt={product?.name || 'Product'} 
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>

     

        {/* হোভার অ্যাকশন বাটন (Quick View) */}
        {/* <div className={`absolute inset-0 bg-black/5 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); onClick?.(product); }} 
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-theme-primary hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 text-gray-700"
            title="Quick View"
          >
            <Eye size={20} />
          </button>
        </div> */}
      </div>

      {/* কন্টেন্ট সেকশন */}
      <div className="flex flex-1 flex-col px-1.5 pt-1 pb-1.5 sm:px-2 sm:pt-1.5 sm:pb-2 md:px-3 md:pt-2 md:pb-3">
        {/* রেটিং */}
        <div className="mb-1">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
 <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 13 13" fill="none">
                  <path d="M6.04449 0.207218C6.13429 -0.0691755 6.52532 -0.0691763 6.61512 0.207217L7.90372 4.17312C7.94388 4.29673 8.05907 4.38042 8.18904 4.38042H12.359C12.6497 4.38042 12.7705 4.7523 12.5354 4.92312L9.16177 7.37419C9.05663 7.45058 9.01263 7.58599 9.05279 7.7096L10.3414 11.6755C10.4312 11.9519 10.1149 12.1817 9.87974 12.0109L6.50614 9.55985C6.40099 9.48346 6.25862 9.48346 6.15347 9.55985L2.77987 12.0109C2.54475 12.1817 2.22841 11.9519 2.31821 11.6755L3.60682 7.7096C3.64698 7.58599 3.60298 7.45058 3.49783 7.37419L0.124234 4.92312C-0.11088 4.7523 0.00995171 4.38042 0.300569 4.38042H4.47057C4.60054 4.38042 4.71572 4.29673 4.75589 4.17312L6.04449 0.207218Z" fill="#15A4EC" />
                </svg>
              </span>
              <h4 className="text-[#1AA5EB] font-medium text-xs lg:text-base">
                {product.rating || 0} <span className="text-[#727272]">({product.reviews || 0})</span>
              </h4>
            </div>
              <div className="h-3 w-[1px] bg-[#E72960]/30" />
                  <div>
              <h4 className="text-[#727272] text-xs lg:text-base">{(product.initialSoldCount || 0) + (product.soldCount || 0)} Sold</h4>
            </div>
          </div>
        </div>
        {/* প্রোডাক্ট নাম */}
        <h3 
        className="mb-1 h-[33px] overflow-hidden text-ellipsis text-left text-[13px] sm:text-[14px] font-medium leading-[1.25] text-black line-clamp-2"
          onClick={() => onClick?.(product)}
        >
          {String(product?.name || 'Unknown Product')}
        </h3>

        {/* প্রাইজ সেকশন */}
        <div className="mt-auto flex flex-col items-left justify-center space-y-1 sm:space-y-2">
          <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[#2F3485] font-bold text-[16px] text-center font-roboto ">
            ৳{Number(price).toLocaleString()}
          </span>
          {originalPrice > 0 && originalPrice !== price && (
            <span className="text-[#666] text-xs lg:text-base line-through opacity-70">
              ৳{Number(originalPrice).toLocaleString()}
            </span>
          )}
        
       
               {(product.coins !== undefined && product.coins !== null && Number(product.coins) > 0) && (
              <span className="text-[#15A4EC] text-[10px] lg:text-sm font-semibold bg-[#15A4EC]/10 px-2 py-0.5 rounded-full">
                Get {product.coins} Coins
              </span>
               )}
         
         </div>
        {/* অ্যাকশন বাটন গ্রুপ */}
       <div className="mt-0.5 flex w-full items-center gap-1.5">
           {/* Add to Cart Button */}
          <button
            className={`flex h-8 sm:h-9 flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold text-white shadow-sm transition-all active:translate-y-0.5 lg:text-sm ${
              isOutOfStock
                ? 'cursor-not-allowed bg-gray-300'
                : 'bg-gradient-to-b from-[#FF9D1B] to-[#FF6C01] hover:brightness-110'
            }`}
            onClick={(e) => { e.stopPropagation(); handleCart?.(e); }}
            title={t('add_to_cart')}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5" />
             <span className="whitespace-nowrap">{t('cart')}</span>
          </button>

          {/* Buy Now Button */}
          <button
            className={`flex h-8 sm:h-9 flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold text-white shadow-sm transition-all active:translate-y-0.5 lg:text-sm ${
              isOutOfStock
                ? 'cursor-not-allowed bg-gray-300'
                : 'bg-gradient-to-b from-[#38BDF8] to-[#1E90FF] hover:brightness-110'
            }`}
            onClick={(e) => { e.stopPropagation(); handleBuyNow?.(); }}
            disabled={isOutOfStock}
          >
            <span className="whitespace-nowrap">{isOutOfStock ? (soldOutLabel === 'sold_out' ? 'Sold Out' : soldOutLabel) : t('buy_now')}</span>
            
          </button>
        </div>
      </div>
     </div> 
    </div>
)
};

// Style 3: Elegant - Rounded corners with soft shadows and elegant typography
const ProductCardStyle3: React.FC<ProductCardProps> = ({ product, onClick, onBuyNow, onAddToCart, wishlist = [], onToggleWishlist }) => {
  const { t } = useLanguage();
  const isWishlisted = wishlist.includes(product.id);
  const handleBuyNow = (e?: React.MouseEvent) => { e?.stopPropagation(); onBuyNow ? onBuyNow(product) : onClick(product); };
  const handleCart = (e: React.MouseEvent) => { e.stopPropagation(); onAddToCart?.(product); };
  const handleWishlist = (e: React.MouseEvent) => { e.stopPropagation(); onToggleWishlist?.(product.id); showToast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️'); };
  const discountPercent = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  return (
    <div className="group bg-gradient-to-b from-white to-gray-50/50 rounded-2xl overflow-hidden flex flex-col relative shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100" style={{ contain: 'layout' }}>
      {(product.discount || discountPercent) && <div className="absolute top-3 left-3 z-10"><span className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">{product.discount || `-${discountPercent}%`}</span></div>}
      <button onClick={handleWishlist} className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:bg-rose-50 transition-all"><Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-rose-500' : 'text-gray-400 group-hover:text-rose-500 transition-colors'} /></button>
      <div className="relative cursor-pointer bg-white m-2 rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }} onClick={() => onClick(product)}>
        <LazyImage src={getImage(product)} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" width={300} height={300} />
      </div>
      <div className="px-4 pb-4 pt-1 flex-1 flex flex-col" style={{ minHeight: '120px' }}>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className={s <= Math.round(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}
          <span className="text-[10px] text-gray-400 ml-1">({product.reviews || 0})</span>
        </div>
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2 cursor-pointer hover:text-theme-primary transition-colors" onClick={() => onClick(product)}>{product.name}</h3>
        <div className="flex items-baseline gap-2 mb-3 mt-auto">
          <span className="text-lg font-bold text-theme-primary">৳{product.price?.toLocaleString()}</span>
          {product.originalPrice && <span className="text-xs text-gray-400 line-through">৳{product.originalPrice?.toLocaleString()}</span>}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center w-10 h-10 border-2 border-theme-primary/30 text-theme-primary rounded-xl hover:bg-theme-primary hover:text-white hover:border-theme-primary transition-all" onClick={handleCart}><ShoppingCart size={16} /></button>
          <button className="flex-1 text-white text-sm font-semibold py-2.5 rounded-xl transition-all btn-order" onClick={handleBuyNow}>{t('buy_now')}</button>
        </div>
      </div>
    </div>
  );
};

// Style 4: Bold - Dark theme with vibrant accents
const ProductCardStyle4: React.FC<ProductCardProps> = ({ product, onClick, onBuyNow, onAddToCart, wishlist = [], onToggleWishlist }) => {
  const { t } = useLanguage();
  const isWishlisted = wishlist.includes(product.id);
  const handleBuyNow = (e?: React.MouseEvent) => { e?.stopPropagation(); onBuyNow ? onBuyNow(product) : onClick(product); };
  const handleCart = (e: React.MouseEvent) => { e.stopPropagation(); onAddToCart?.(product); };
  const handleWishlist = (e: React.MouseEvent) => { e.stopPropagation(); onToggleWishlist?.(product.id); showToast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️'); };
  const discountPercent = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  return (
    <div className="group bg-gray-900 rounded-xl overflow-hidden flex flex-col relative shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800" style={{ contain: 'layout' }}>
      {(product.discount || discountPercent) && <div className="absolute top-3 left-3 z-10"><span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1"><Zap size={10} />{product.discount || `-${discountPercent}%`}</span></div>}
      <button onClick={handleWishlist} className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-rose-500 transition-all"><Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-white' : 'text-gray-400 group-hover:text-white'} /></button>
      <div className="relative cursor-pointer bg-gray-800 m-2 rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }} onClick={() => onClick(product)}>
        <LazyImage src={getImage(product)} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-300" width={300} height={300} />
      </div>
      <div className="px-3 pb-3 flex-1 flex flex-col" style={{ minHeight: '110px' }}>
        <div className="flex items-center gap-1 mb-1.5">
          {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} className={s <= Math.round(product.rating || 0) ? 'text-cyan-400 fill-cyan-400' : 'text-gray-600'} />)}
          <span className="text-[10px] text-gray-500 ml-1">{product.reviews || 0}</span>
        </div>
        <h3 className="font-medium text-white text-xs leading-snug mb-2 line-clamp-2 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => onClick(product)}>{product.name}</h3>
        <div className="flex items-baseline gap-2 mb-2 mt-auto">
          <span className="text-base font-bold text-cyan-400">৳{product.price?.toLocaleString()}</span>
          {product.originalPrice && <span className="text-[10px] text-gray-500 line-through">৳{product.originalPrice?.toLocaleString()}</span>}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center w-9 h-9 bg-gray-800 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-white transition-all" onClick={handleCart}><ShoppingCart size={14} /></button>
          <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all" onClick={handleBuyNow}>{t('buy_now')}</button>
        </div>
      </div>
    </div>
  );
};

// Style 5: Compact - Space-efficient with horizontal layout on larger screens
const ProductCardStyle5: React.FC<ProductCardProps> = ({ product, onClick, onBuyNow, onAddToCart, wishlist = [], onToggleWishlist }) => {
  const { t } = useLanguage();
  const isWishlisted = wishlist.includes(product.id);
  const handleBuyNow = (e?: React.MouseEvent) => { e?.stopPropagation(); onBuyNow ? onBuyNow(product) : onClick(product); };
  const handleCart = (e: React.MouseEvent) => { e.stopPropagation(); onAddToCart?.(product); };
  const handleWishlist = (e: React.MouseEvent) => { e.stopPropagation(); onToggleWishlist?.(product.id); showToast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️'); };
  const discountPercent = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  return (
    <div className="group bg-white rounded-lg overflow-hidden flex flex-col relative border border-gray-200 hover:border-theme-primary/30 hover:shadow-lg transition-all duration-300" style={{ contain: 'layout' }}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-theme-r opacity-0 group-hover:opacity-100 transition-opacity" />
      {(product.discount || discountPercent) && <div className="absolute top-2 left-2 z-10"><span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{product.discount || `-${discountPercent}%`}</span></div>}
      <button onClick={handleWishlist} className="absolute top-2 right-2 z-10 w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center hover:scale-110 transition-all"><Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-rose-500' : 'text-gray-400 group-hover:text-rose-500'} /></button>
      <div className="relative cursor-pointer bg-gradient-to-br from-gray-50 to-white overflow-hidden" style={{ aspectRatio: '1/1' }} onClick={() => onClick(product)}>
        <LazyImage src={getImage(product)} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" width={300} height={300} />
        <div className="absolute inset-0 bg-theme-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="px-2.5 pb-2.5 pt-2 flex-1 flex flex-col border-t border-gray-100" style={{ minHeight: '95px' }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} size={9} className={s <= Math.round(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}</div>
          <span className="text-[9px] text-gray-400 flex items-center gap-0.5"><Package size={9} />{(product.initialSoldCount || 0) + (product.soldCount || 0)}</span>
        </div>
        <h3 className="font-medium text-gray-700 text-[11px] leading-snug mb-1 line-clamp-2 cursor-pointer hover:text-theme-primary transition-colors" onClick={() => onClick(product)}>{product.name}</h3>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-theme-primary">৳{product.price?.toLocaleString()}</span>
            {product.originalPrice && <span className="text-[9px] text-gray-400 line-through">৳{product.originalPrice?.toLocaleString()}</span>}
          </div>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-500 rounded hover:border-theme-primary hover:text-theme-primary transition-all" onClick={handleCart}><ShoppingCart size={12} /></button>
            <button className="px-3 h-7 bg-theme-primary text-white text-[10px] font-semibold rounded hover:bg-theme-primary/90 transition-all" onClick={handleBuyNow}>Buy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { variant = 'style1' } = props;
  
  switch (variant) {
    case 'style2':
      return <ProductCardStyle2 {...props} />;
    case 'style3':
      return <ProductCardStyle3 {...props} />;
    case 'style4':
      return <ProductCardStyle4 {...props} />;
    case 'style5':
      return <ProductCardStyle5 {...props} />;
    case 'style1':
    default:
      return <ProductCardStyle1 {...props} />;
  }
};
