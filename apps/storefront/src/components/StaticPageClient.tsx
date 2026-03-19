'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const StaticPageContent = dynamic(
  () => import('admin-next/src/components/store/StaticPageContent').then(m => ({ default: m.StaticPageContent })),
  { ssr: false }
);

interface StaticPageClientProps {
  slug: string;
  websiteConfig: any;
}

export default function StaticPageClient({ slug, websiteConfig }: StaticPageClientProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <StaticPageContent websiteConfig={websiteConfig} />
    </div>
  );
}
