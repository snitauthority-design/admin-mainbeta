'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  className?: string;
  primaryColor?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search for products...',
  className = '',
  primaryColor = '#4ea674',
}: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          style={{ color: primaryColor }}
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
}
