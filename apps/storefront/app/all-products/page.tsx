import { headers } from 'next/headers';
import AllProductsClient from '@/components/AllProductsClient';
import {
  getBootstrapData,
  getSecondaryData,
  resolveTenantId,
  resolveLogoUrl,
} from '@/lib/tenant-data';

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function AllProductsPage({ searchParams }: Props) {
  const headerList = await headers();
  const tenantId = resolveTenantId(headerList.get('x-tenant-id'));
  const params = await searchParams;
  const initialCategory = params.category || '';

  const [bootstrap, secondary] = await Promise.all([
    getBootstrapData(tenantId),
    getSecondaryData(tenantId),
  ]);

  return (
    <AllProductsClient
      products={bootstrap.products}
      categories={secondary.categories}
      subcategories={secondary.subcategories}
      childcategories={secondary.childcategories}
      brands={secondary.brands}
      tags={secondary.tags}
      websiteConfig={bootstrap.website_config}
      logo={resolveLogoUrl(secondary.logo)}
      initialCategory={initialCategory}
    />
  );
}
