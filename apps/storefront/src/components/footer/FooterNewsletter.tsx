'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface FooterNewsletterProps {
  onSubmit: (email: string) => Promise<void>;
  primaryColor?: string;
}

export default function FooterNewsletter({
  onSubmit,
  primaryColor = '#4ea674',
}: FooterNewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(email);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
