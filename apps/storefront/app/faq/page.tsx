'use client';

import React from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How do I place an order?',
      a: 'Browse products, add items to your cart, and proceed to checkout. Follow the on-screen instructions to complete your purchase.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Cash on Delivery (COD), bKash, Nagad, and other popular payment methods.',
    },
    {
      q: 'How can I track my order?',
      a: 'Visit the Track Order page and enter your order ID to see the latest status of your delivery.',
    },
    {
      q: 'What is your return policy?',
      a: 'Please visit our Return Policy page for detailed information about returns and refunds.',
    },
    {
      q: 'How do I contact customer support?',
      a: 'You can reach us through the Contact page or use the live chat feature on our website.',
    },
  ];

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
      <div className="max-w-3xl mx-auto mt-8 px-4 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle size={28} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h1>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
