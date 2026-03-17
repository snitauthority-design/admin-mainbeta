import React from 'react';
import { ShoppingCart, Heart, Star, Tag } from 'lucide-react';
import { LazyImage } from '../../utils/performanceOptimization';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCardProps, getImage, showToast } from './types';

// Style 6: Overlay - Clean card with gradient overlay and floating badges
const ProductCardStyle6: React.FC<ProductCardProps> = ({ product, onClick, onBuyNow, onAddToCart, wishlist = [], onToggleWishlist }) => {
  const { t } = useLanguage();
  const isWishlisted = wishlist.includes(product.id);
  const handleBuyNow = (e?: React.MouseEvent) => { e?.stopPropagation(); onBuyNow ? onBuyNow(product) : onClick(product); };
  const handleCart = (e: React.MouseEvent) => { e.stopPropagation(); onAddToCart?.(product); };
  const handleWishlist = (e: React.MouseEvent) => { e.stopPropagation(); onToggleWishlist?.(product.id); showToast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️'); };
  const discountPercent = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  return (
    <div className="group bg-white rounded-xl overflow-hidden flex flex-col relative border border-gray-100 hover:border-theme-primary/40 hover:shadow-xl transition-all duration-300" style={{ contain: 'layout' }}>
      <div className="relative cursor-pointer overflow-hidden" style={{ aspectRatio: '1/1' }} onClick={() => onClick(product)}>
        <LazyImage src={getImage(product)} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500" width={300} height={300} />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {(product.discount || discountPercent) && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-theme-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
              <Tag size={10} />{product.discount || `-${discountPercent}%`}
            </span>
          </div>
        )}
        <button onClick={handleWishlist} className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center hover:scale-110 hover:shadow-md transition-all">
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-rose-500' : 'text-gray-400 group-hover:text-rose-400'} />
        </button>
      </div>
      <div className="px-2 pb-2 pt-1 flex-1 flex flex-col gap-0.5" style={{ minHeight: '75px' }}>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} className={s <= Math.round(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}
          <span className="text-[10px] text-gray-400 ml-0.5">({product.reviews || 0})</span>
        </div>
        <h3 className="font-medium text-gray-800 text-xs leading-snug line-clamp-2 cursor-pointer hover:text-theme-primary transition-colors" onClick={() => onClick(product)}>{product.name}</h3>
        <div className="flex items-center justify-between mt-auto pt-1 border-t border-dashed border-gray-100">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-theme-primary">৳{product.price?.toLocaleString()}</span>
            {product.originalPrice && <span className="text-[10px] text-gray-400 line-through">৳{product.originalPrice?.toLocaleString()}</span>}
          </div>
        </div>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-500 rounded-lg hover:bg-theme-primary hover:text-white hover:border-theme-primary transition-all" onClick={handleCart}><ShoppingCart size={14} /></button>
          <button className="flex-1 h-8 bg-theme-primary text-white text-xs font-semibold rounded-lg hover:bg-theme-primary/90 transition-all btn-order" onClick={handleBuyNow}>{t('buy_now')}</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardStyle6;
