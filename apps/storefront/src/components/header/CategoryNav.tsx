'use client';

import React from 'react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryNavProps {
  categories: Category[];
  maxDisplay?: number;
  className?: string;
}

export default function CategoryNav({
  categories,
  maxDisplay = 6,
  className = '',
}: CategoryNavProps) {
  if (categories.length === 0) return null;

  const displayCategories = categories.slice(0, maxDisplay);

  return (
    <nav className={`flex items-center gap-6 ${className}`}>
      {displayCategories.map((category) => (
        <Link
          key={category._id}
          href={`/all-products?category=${category.slug}`}
          className="text-gray-700 hover:text-primary transition-colors font-medium"
        >
          {category.name}
        </Link>
      ))}
      {categories.length > maxDisplay && (
        <Link
          href="/all-products"
          className="text-gray-700 hover:text-primary transition-colors font-medium"
        >
          More...
        </Link>
      )}
    </nav>
  );
}
