'use client';
import { Suspense } from 'react';
import { useApp } from '../../providers';
import dynamic from 'next/dynamic';

const PublicOfferPage = dynamic(() => import('@/views/PublicOfferPage'), { ssr: false });

export default function OfferPage() {
  const app = useApp();
  return (
    <Suspense fallback={null}>
      <PublicOfferPage websiteConfig={app.websiteConfig} />
    </Suspense>
  );
}
