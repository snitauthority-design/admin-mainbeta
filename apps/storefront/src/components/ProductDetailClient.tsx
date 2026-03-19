'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Minus, Plus, ArrowLeft, Star, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { normalizeImageUrl } from 'admin-next/src/utils/imageUrlHelper';

interface ProductDetailClientProps {
  product: any;
  products: any[];
  websiteConfig: any;
  tenantId: string;
}

export default function ProductDetailClient({
  product,
  products,
  websiteConfig,
  tenantId,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const productId = product._id || product.id;
  const inWishlist = isInWishlist(productId);

  const images = useMemo(() => {
    const gallery = product.galleryImages || [];
    const main = product.image ? [product.image] : [];
    return [...main, ...gallery.filter((img: string) => img !== product.image)];
  }, [product]);

  const price = product.salePrice || product.price || 0;
  const originalPrice = product.price && product.salePrice && product.price > product.salePrice ? product.price : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const inStock = (product.stock ?? 0) > 0;

  const relatedProducts = useMemo(() => {
    return products
      .filter((p: any) => p._id !== productId && p.category === product.category)
      .slice(0, 4);
  }, [products, productId, product.category]);

  const handleAddToCart = useCallback(() => {
    addItem({
      productId,
      name: product.title || product.name,
      price,
      quantity,
      image: images[0] || undefined,
      variant: selectedVariant || undefined,
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [addItem, productId, product, price, quantity, images, selectedVariant]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    router.push('/cart');
  }, [handleAddToCart, router]);

  const currency = websiteConfig?.shopCurrency === 'BDT' ? '৳' : '৳';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Success message */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-pulse">
          ✓ Added to cart!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
            {images.length > 0 ? (
              <img
                src={normalizeImageUrl(images[selectedImageIndex])}
                alt={product.title || product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                No image
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(i => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    i === selectedImageIndex ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img src={normalizeImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.title || product.name}
          </h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    size={16}
                    className={s <= (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              {product.reviews > 0 && (
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-blue-600">{currency}{price}</span>
            {originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{currency}{originalPrice}</span>
                <span className="bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="mb-4">
            {inStock ? (
              <span className="text-sm text-green-600 font-medium">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-sm text-red-600 font-medium">✗ Out of Stock</span>
            )}
          </div>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-gray-600 mb-6 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Variant Selection */}
          {product.variantGroups?.length > 0 && (
            <div className="mb-6">
              {product.variantGroups.map((group: any) => (
                <div key={group.name} className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{group.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {group.options?.map((option: any) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedVariant(option.value)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          selectedVariant === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {option.label || option.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 min-w-[48px] text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                className="p-2 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
            <button
              onClick={() => toggleItem(productId)}
              className={`p-3 rounded-lg border transition-colors ${
                inWishlist
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'border-gray-300 text-gray-500 hover:border-gray-400'
              }`}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Category & Tags */}
          {product.category && (
            <div className="text-sm text-gray-500">
              Category: <span className="text-gray-700">{product.category}</span>
            </div>
          )}
        </div>
      </div>

      {/* Full Description */}
      {product.description && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
          <div
            className="prose max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p: any) => {
              const img = p.galleryImages?.[0] || p.image;
              const pPrice = p.salePrice || p.price || 0;
              return (
                <button
                  key={p._id || p.id}
                  onClick={() => router.push(`/products/${p.slug || p._id}`)}
                  className="bg-white rounded-xl shadow hover:shadow-md transition-all overflow-hidden text-left group"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    {img ? (
                      <img
                        src={normalizeImageUrl(img)}
                        alt={p.title || p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{p.title || p.name}</h3>
                    <p className="text-sm font-bold text-blue-600 mt-1">{currency}{pPrice}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
