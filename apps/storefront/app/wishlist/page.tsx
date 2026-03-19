'use client';

import React, { useEffect, useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getApiBaseUrl } from '@repo/config';

interface Product {
  _id: string;
  slug: string;
  title: string;
  name: string;
  price: number;
  salePrice: number;
  image: string;
  galleryImages: string[];
  stock: number;
}

export default function WishlistPage() {
  const { items: wishlistItems, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        // Fetch bootstrap data to get products
        const apiUrl = getApiBaseUrl();
        const tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG || 'demo';
        const res = await fetch(`${apiUrl}/tenant-data/${tenantId}/bootstrap`);
        const data = await res.json();
        const allProducts: Product[] = data?.data?.products || [];

        // Filter to only wishlist products
        const wishlistProducts = allProducts.filter((p) =>
          wishlistItems.includes(p._id)
        );
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Failed to load wishlist products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (wishlistItems.length > 0) {
      loadProducts();
    } else {
      setIsLoading(false);
    }
  }, [wishlistItems]);

  const handleAddToCart = (product: Product) => {
    const price = product.salePrice || product.price;
    addToCart({
      productId: product._id,
      name: product.title || product.name,
      price,
      quantity: 1,
      image: product.galleryImages?.[0] || product.image,
    });
    // Show success feedback
    alert('Added to cart!');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Loading your wishlist...</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Your Wishlist is Empty
        </h1>
        <p className="text-gray-600 mb-8">
          Save products you love so you can easily find them later.
        </p>
        <Link
          href="/all-products"
          className="inline-block px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        My Wishlist ({wishlistItems.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const price = product.salePrice || product.price;
          const originalPrice =
            product.price && product.salePrice && product.price > product.salePrice
              ? product.price
              : null;
          const image = product.galleryImages?.[0] || product.image;

          return (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square bg-gray-100">
                  {image ? (
                    <Image
                      src={image}
                      alt={product.title || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                    {product.title || product.name}
                  </h3>
                </Link>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    ৳{price.toLocaleString()}
                  </span>
                  {originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳{originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(product._id)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
