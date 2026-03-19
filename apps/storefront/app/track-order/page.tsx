'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Search, ArrowLeft, CheckCircle, Clock, Truck } from 'lucide-react';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrderStatus(null);

    try {
      // TODO: implement actual order tracking API call
      setError('Order tracking will be available soon.');
    } catch {
      setError('Unable to find order. Please check the order number.');
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="text-center mb-8">
        <Package size={48} className="mx-auto text-blue-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-500">Enter your order number to track your delivery</p>
      </div>

      <form onSubmit={handleTrack} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter order number (e.g. ORD-12345)"
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <button
          type="submit"
          disabled={loading || !orderNumber.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Tracking...' : 'Track Order'}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-yellow-50 text-yellow-700 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {orderStatus && (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-500" />
              <span>Order Confirmed</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-blue-500" />
              <span>Processing</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-gray-300" />
              <span className="text-gray-400">Shipped</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
