'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const StaticPageContent = dynamic(
  () =>
    import('admin-next/src/components/store/StaticPageContent').then(
      (m) => ({ default: m.StaticPageContent })
    ),
  { ssr: false }
);

interface StaticPageClientProps {
  websiteConfig: any;
}

export default function StaticPageClient({ websiteConfig }: StaticPageClientProps) {
  return <StaticPageContent websiteConfig={websiteConfig} />;
}
