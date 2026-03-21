import { Suspense } from 'react';
import StoreHomeClient, { StorePageSkeleton } from './store-home-client';

export default function HomePage() {
  return (
    <Suspense fallback={<StorePageSkeleton />}>
      <StoreHomeClient />
    </Suspense>
  );
}
