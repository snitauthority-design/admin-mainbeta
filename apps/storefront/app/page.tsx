import { getApiBaseUrl } from '@repo/config';
import { headers } from 'next/headers';
import StoreFrontClient from '@/components/StoreFrontClient';

/**
 * Storefront Home Page
 *
 * Server component that fetches all tenant data (products, website config,
 * categories, brands, tags) and renders the appropriate store theme from
 * admin-next's component library.
 *
 * Uses ISR with 60-second revalidation.
 */

interface BootstrapData {
  products: any[];
  website_config: any;
  theme_config: any;
}

interface SecondaryData {
  categories: any[];
  subcategories: any[];
  childcategories: any[];
  brands: any[];
  tags: any[];
  logo: any;
}

async function getBootstrapData(tenantId: string): Promise<BootstrapData> {
  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(
      `${apiUrl}/api/tenant-data/${tenantId}/bootstrap`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return { products: [], website_config: null, theme_config: null };
    const json = await res.json();
    return {
      products: json?.data?.products ?? [],
      website_config: json?.data?.website_config ?? null,
      theme_config: json?.data?.theme_config ?? null,
    };
  } catch {
    return { products: [], website_config: null, theme_config: null };
  }
}

async function getSecondaryData(tenantId: string): Promise<SecondaryData> {
  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(
      `${apiUrl}/api/tenant-data/${tenantId}/secondary`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return { categories: [], subcategories: [], childcategories: [], brands: [], tags: [], logo: null };
    const json = await res.json();
    const data = json?.data ?? {};
    return {
      categories: data.categories ?? [],
      subcategories: data.subcategories ?? [],
      childcategories: data.childcategories ?? [],
      brands: data.brands ?? [],
      tags: data.tags ?? [],
      logo: data.logo ?? null,
    };
  } catch {
    return { categories: [], subcategories: [], childcategories: [], brands: [], tags: [], logo: null };
  }
}

export default async function HomePage() {
  // Resolve tenant from middleware header or fall back to env
  const headerList = await headers();
  const tenantId = headerList.get('x-tenant-id') || process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG || 'demo';

  // Fetch bootstrap (products + config) and secondary (categories, brands, tags) in parallel
  const [bootstrap, secondary] = await Promise.all([
    getBootstrapData(tenantId),
    getSecondaryData(tenantId),
  ]);

  // Derive logo URL
  const logoUrl = typeof secondary.logo === 'string'
    ? secondary.logo
    : secondary.logo?.url ?? null;

  return (
    <StoreFrontClient
      products={bootstrap.products}
      websiteConfig={bootstrap.website_config}
      categories={secondary.categories}
      brands={secondary.brands}
      tags={secondary.tags}
      logo={logoUrl}
    />
  );
}
