import React, { useState, memo } from 'react';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { Product } from '../../types';
import { getCurrencySymbol } from '../../utils/currencyHelper';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';
import { OptimizedImage } from '../OptimizedImage';

export interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
    onBuyNow?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    showSoldCount?: boolean;
    wishlist?: number[];
    onToggleWishlist?: (id: number) => void;
    
}

const ProductCardComponent: React.FC<ProductCardProps> = ({ 
    product, 
    onClick, 
    onBuyNow, 
    onAddToCart,
    showSoldCount,
    wishlist = [],
    onToggleWishlist
}) => {
    const isWishlisted = wishlist.includes(product.id);
    const [isHovered, setIsHovered] = useState(false);
    const imageSrc = normalizeImageUrl(product.galleryImages?.[0] || product.image);
    
    const handleBuyNow = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        onBuyNow ? onBuyNow(product) : onClick(product);
    };

    const discountPercent = product.originalPrice && product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const isOutOfStock = product.stock === 0;

    return (
        <div 
            className="group bg-white rounded-lg md:rounded-xl overflow-hidden flex flex-col relative border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="absolute to p-2 left-2 z-10 flex flex-col gap-1">
                {(product.discount || discountPercent) && (
                    <span className="inline-flex items-center bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        {product.discount || `-${discountPercent}%`}
                    </span>
                )}
                {isOutOfStock && (
                    <span className="inline-flex items-center bg-gray-700 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                        Out of Stock
                    </span>
                )}
            </div>

            {/* Wishlist Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product.id); }}
                className="absolute to p-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-all duration-200"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <Heart size={16} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-gray-600'} />
            </button>

            {/* Image */}
            <div
                className="relative aspect-square p-1 md:p-3 cursor-pointer overflow-hidden bg-gray-50"
                onClick={() => onClick(product)}
            >
                <OptimizedImage
                    src={imageSrc}
                    alt={product.name}
                    width={400}
                    height={400}
                    placeholder="blur"
                    className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 ${isOutOfStock ? 'opacity-50' : ''}`}
                />
                
                {/* Hover Quick Actions Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3 flex justify-center gap-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick(product); }}
                        className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 hover:scale-110 transition-all duration-200"
                        aria-label="Quick view"
                    >
                        <Eye size={16} className="text-gray-700" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) onAddToCart?.(product); }}
                        className={`w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 hover:scale-110 transition-all duration-200 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                        aria-label="Add to cart"
                        disabled={isOutOfStock}
                    >
                        <ShoppingCart size={16} className="text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Details */}
            <div className="px-2 md:px-3.5 pb-2 md:pb-4 pt-1.5 flex-1 flex flex-col">
                {/* Rating & Reviews */}
                <div className="flex items-center justify-between mb-1">
                    {product.rating !== undefined && product.rating > 0 ? (
                        <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-full">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={10}
                                        className={s <= Math.round(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                                        strokeWidth={1.5}
                                    />
                                ))}
                            </div>
                            {product.reviews !== undefined && product.reviews > 0 && (
                                <span className="text-[9px] font-medium text-amber-700">({product.reviews})</span>
                            )}
                        </div>
                    ) : (
                        <span className="text-[10px] text-gray-400">No ratings</span>
                    )}
                    {((product.initialSoldCount || 0) + (product.soldCount || 0)) > 0 && (
                        <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            {(product.initialSoldCount || 0) + (product.soldCount || 0)} sold
                        </span>
                    )}
                </div>

                <h3
                    className="font-medium text-gray-800 text-xs md:text-[13px] leading-tight mb-1 line-clamp-2 cursor-pointer hover:text-theme-primary"
                    style={{ minHeight: '30px' }}
                    onClick={() => onClick(product)}
                >
                    {product.name}
                </h3>

                {/* Pricing Section */}
                <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-sm md:text-xl font-bold text-theme-primary">৳{product.price?.toLocaleString()}</span>
                    {product.originalPrice && (
                        <>
                            <span className="text-[10px] md:text-sm text-gray-400 line-through">৳{product.originalPrice?.toLocaleString()}</span>
                        </>
                    )}
                </div>

                {/* Buy Now Button */}
                <button
                    className={`w-full py-2 md:py-3 font-semibold rounded-lg text-xs md:text-sm ${
                        isOutOfStock
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : product.stock !== undefined && product.stock <= 10 && product.stock > 0
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white active:scale-[0.98]'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white active:scale-[0.98]'
                    }`}
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                >
                    {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                </button>
            </div>
        </div>
    );
};

// Memoize ProductCard to prevent unnecessary re-renders
// Only re-render if product.id changes
// Memoize ProductCard to prevent unnecessary re-renders
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
    return (
        prevProps.product.id === nextProps.product.id &&
        prevProps.product.price === nextProps.product.price &&
        prevProps.product.stock === nextProps.product.stock &&
        prevProps.showSoldCount === nextProps.showSoldCount
    ); // Ensure this semicolon is inside the closing brace
});