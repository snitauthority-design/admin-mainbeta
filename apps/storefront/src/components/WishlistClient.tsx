'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { normalizeImageUrl } from 'admin-next/src/utils/imageUrlHelper';

interface WishlistClientProps {
  products: any[];
}

export default function WishlistClient({ products }: WishlistClientProps) {
  const router = useRouter();
  const { items: wishlistIds, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const wishlistProducts = useMemo(() => {
    return products.filter((p: any) => wishlistIds.includes(p._id || p.id));
  }, [products, wishlistIds]);

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product._id || product.id,
      name: product.title || product.name,
      price: product.salePrice || product.price || 0,
      quantity: 1,
      image: product.galleryImages?.[0] || product.image || undefined,
    });
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-6">Save products you love to your wishlist</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wishlist ({wishlistProducts.length})</h1>
        <button
          onClick={clearWishlist}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistProducts.map((product: any) => {
          const img = product.galleryImages?.[0] || product.image;
          const price = product.salePrice || product.price || 0;
          const originalPrice = product.price && product.salePrice && product.price > product.salePrice ? product.price : null;

          return (
            <div key={product._id || product.id} className="bg-white rounded-xl shadow hover:shadow-md transition-all overflow-hidden group">
              <button
                onClick={() => router.push(`/products/${product.slug || product._id}`)}
                className="block w-full text-left"
              >
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {img ? (
                    <img
                      src={normalizeImageUrl(img)}
                      alt={product.title || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{product.title || product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-blue-600">৳{price}</span>
                    {originalPrice && (
                      <span className="text-xs text-gray-400 line-through">৳{originalPrice}</span>
                    )}
                  </div>
                </div>
              </button>
              <div className="px-3 pb-3 flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>
                <button
                  onClick={() => removeItem(product._id || product.id)}
                  className="p-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Heart size={14} fill="currentColor" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
