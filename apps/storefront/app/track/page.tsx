'use client';

import React, { useState } from 'react';
import { Truck, CheckCircle, ArrowLeft } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = () => {
    if (orderId.trim()) setSearched(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3">
        <button
          onClick={() => (window.location.href = '/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
      </div>
      <div className="max-w-md mx-auto mt-12 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Truck size={28} className="text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Track Your Order</h1>
          </div>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. #0024)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            />
            <button
              onClick={handleTrack}
              className="px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-sky-500 hover:to-blue-600 transition-all whitespace-nowrap"
            >
              Track
            </button>
          </div>
          {searched && (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3 text-sky-500">
                <CheckCircle size={24} />
              </div>
              <p className="font-bold text-gray-800 mb-1">Looking up order...</p>
              <p className="text-sm text-gray-500">
                Order tracking details for <strong>{orderId}</strong> will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
