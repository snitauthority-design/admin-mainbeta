import { getApiBaseUrl } from '@repo/config';

/**
 * Storefront API client.
 *
 * Communicates with the shared backend API using the same endpoints
 * as the Admin Dashboard, but scoped to public / customer operations.
 */

const apiBase = getApiBaseUrl();

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// ─── Products ────────────────────────────────────────────────────────

export async function getProducts(
  tenantId: string,
): Promise<any[]> {
  const data = await fetchJson<{ data?: { products?: any[] } }>(
    `${apiBase}/api/tenant-data/${tenantId}/bootstrap`,
  );
  return data.data?.products ?? [];
}

export async function getProductBySlug(
  tenantId: string,
  slug: string,
): Promise<any | null> {
  const products = await getProducts(tenantId);
  return products.find((p) => p.slug === slug) ?? null;
}

// ─── Orders (customer-facing) ────────────────────────────────────────

export async function createOrder(
  tenantId: string,
  order: Record<string, unknown>,
  token?: string,
): Promise<any> {
  return fetchJson(`${apiBase}/api/orders`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'x-tenant-id': tenantId,
    },
    body: JSON.stringify(order),
  });
}

export async function getOrderStatus(
  tenantId: string,
  orderNumber: string,
): Promise<any> {
  return fetchJson(
    `${apiBase}/api/orders/track/${orderNumber}?tenantId=${tenantId}`,
  );
}
