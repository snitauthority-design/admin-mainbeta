import { headers } from 'next/headers';
import { getBootstrapData, resolveTenantId } from '@/lib/tenant-data';
import WishlistClient from '@/components/WishlistClient';

export const revalidate = 60;

export default async function WishlistPage() {
  const headersList = await headers();
  const tenantId = resolveTenantId(headersList.get('x-tenant-id'));

  const bootstrap = await getBootstrapData(tenantId);
  const products = bootstrap?.products || [];

  return <WishlistClient products={products} />;
}
