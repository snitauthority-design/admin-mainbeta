'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { normalizeImageUrl } from 'admin-next/src/utils/imageUrlHelper';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const handleCheckout = useCallback(() => {
    // TODO: implement checkout flow
    alert('Checkout coming soon!');
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} /> Continue Shopping
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({totalItems} items)</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-4">
            {/* Image */}
            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
              {item.image ? (
                <img src={normalizeImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
              {item.variant && (
                <p className="text-sm text-gray-500">{item.variant}</p>
              )}
              <p className="text-sm font-bold text-blue-600 mt-1">৳{item.price}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="p-1.5 hover:bg-gray-50"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1.5 hover:bg-gray-50"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="font-bold text-gray-900">৳{(item.price * item.quantity).toFixed(0)}</p>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal ({totalItems} items)</span>
          <span className="text-xl font-bold text-gray-900">৳{totalPrice.toFixed(0)}</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
