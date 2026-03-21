import { Suspense } from 'react';
import SuccessOrderClient, { SuccessOrderSkeleton } from './success-order-client';

export default function SuccessOrderPage() {
  return (
    <Suspense fallback={<SuccessOrderSkeleton />}>
      <SuccessOrderClient />
    </Suspense>
  );
}
