'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductActionsProps {
  product: any;
  productName: string;
  productPrice: number;
  productStock: number;
  imageUrl?: string;
}

export default function ProductActions({
  product,
  productName,
  productPrice,
  productStock,
  imageUrl,
}: ProductActionsProps) {
  const { addItem: addToCart } = useCart();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const isInWishlistState = isInWishlist(product._id || product.id);

  const handleAddToCart = () => {
    addToCart({
      productId: product._id || product.id,
      name: productName,
      price: productPrice,
      quantity,
      image: imageUrl,
      variant: selectedVariant?.name,
    });

    // Show success feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Redirect to cart after a brief delay
    setTimeout(() => {
      window.location.href = '/cart';
    }, 500);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product._id || product.id);
  };

  return (
    <div className="space-y-6">
      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Available Variants
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v: any) => (
              <button
                key={v.id || v._id || v.name}
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                  selectedVariant?.name === v.name
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                {v.name} – ৳{(v.salePrice || v.price || 0).toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            −
          </button>
          <span className="px-4 py-1 min-w-[3rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(productStock, quantity + 1))}
            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={quantity >= productStock}
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={productStock <= 0}
          className="flex-1 px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={productStock <= 0}
          className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
        <button
          onClick={handleToggleWishlist}
          className={`px-4 py-3 border rounded-lg transition-colors ${
            isInWishlistState
              ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
              : 'border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
          }`}
          title={isInWishlistState ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={20} fill={isInWishlistState ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-fade-in">
          ✓ Added to cart successfully!
        </div>
      )}
    </div>
  );
}
