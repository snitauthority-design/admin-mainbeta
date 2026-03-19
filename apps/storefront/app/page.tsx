import { headers } from 'next/headers';
import { getBootstrapData, getSecondaryData, resolveTenantId, resolveLogoUrl } from '@/lib/tenant-data';
import StoreFrontClient from '@/components/StoreFrontClient';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const headersList = await headers();
  const tenantId = resolveTenantId(headersList.get('x-tenant-id'));

  const [bootstrap, secondary] = await Promise.all([
    getBootstrapData(tenantId),
    getSecondaryData(tenantId),
  ]);

  const products = bootstrap?.products || [];
  const websiteConfig = bootstrap?.website_config || {};
  const categories = secondary?.categories || [];
  const subCategories = secondary?.subcategories || [];
  const childCategories = secondary?.childcategories || [];
  const brands = secondary?.brands || [];
  const tags = secondary?.tags || [];
  const logo = resolveLogoUrl(secondary?.logo);

  return (
    <StoreFrontClient
      tenantId={tenantId}
      products={products}
      websiteConfig={websiteConfig}
      categories={categories}
      subCategories={subCategories}
      childCategories={childCategories}
      brands={brands}
      tags={tags}
      logo={logo}
    />
  );
}
