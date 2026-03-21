import { Suspense } from 'react';
import StoreHomeClient, { StorePageSkeleton } from '../store-home-client';

export default function AllProductsPage() {
	return (
		<Suspense fallback={<StorePageSkeleton />}>
			<StoreHomeClient />
		</Suspense>
	);
}
