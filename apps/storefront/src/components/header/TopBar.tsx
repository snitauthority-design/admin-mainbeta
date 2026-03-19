'use client';

import React from 'react';
import Link from 'next/link';

interface TopBarProps {
  contactPhone?: string;
  contactEmail?: string;
  show?: boolean;
}

export default function TopBar({ contactPhone, contactEmail, show = true }: TopBarProps) {
  if (!show) return null;

  return (
    <div className="bg-gray-900 text-white text-xs py-2">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          {contactPhone && (
            <span className="flex items-center gap-1">
              📞 {contactPhone}
            </span>
          )}
          {contactEmail && (
            <span className="hidden sm:flex items-center gap-1">
              ✉️ {contactEmail}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/track" className="hover:text-gray-300 transition-colors">
            Track Order
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
