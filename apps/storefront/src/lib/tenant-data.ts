import { getApiBaseUrl } from '@repo/config';

export interface TenantBootstrap {
  products: any[];
  website_config: any;
  theme_config: any;
}

export interface TenantSecondary {
  categories: any[];
  subcategories: any[];
  childcategories: any[];
  brands: any[];
  tags: any[];
  logo: any;
}

const EMPTY_BOOTSTRAP: TenantBootstrap = {
  products: [],
  website_config: null,
  theme_config: null,
};

const EMPTY_SECONDARY: TenantSecondary = {
  categories: [],
  subcategories: [],
  childcategories: [],
  brands: [],
  tags: [],
  logo: null,
};

export async function getBootstrapData(tenantId: string): Promise<TenantBootstrap> {
  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(`${apiUrl}/tenant-data/${tenantId}/bootstrap`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return EMPTY_BOOTSTRAP;
    const json = await res.json();
    return {
      products: json?.data?.products ?? [],
      website_config: json?.data?.website_config ?? null,
      theme_config: json?.data?.theme_config ?? null,
    };
  } catch {
    return EMPTY_BOOTSTRAP;
  }
}

export async function getSecondaryData(tenantId: string): Promise<TenantSecondary> {
  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(`${apiUrl}/tenant-data/${tenantId}/secondary`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return EMPTY_SECONDARY;
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
    return EMPTY_SECONDARY;
  }
}

export function resolveTenantId(headerTenantId: string | null): string {
  return headerTenantId || process.env.NEXT_PUBLIC_API_BASE || 'demo';
}

export function resolveLogoUrl(logo: any): string | null {
  return typeof logo === 'string' ? logo : logo?.url ?? null;
}
