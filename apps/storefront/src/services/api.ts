import { getApiBaseUrl } from '@repo/config';
import type {
  Product,
  Order,
  ApiResponse,
  PaginatedResponse,
} from '@repo/shared-types';

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
): Promise<Product[]> {
  const data = await fetchJson<{ products?: Product[] }>(
    `${apiBase}/api/tenant-data/${tenantId}/secondary`,
  );
  return data.products ?? [];
}

export async function getProductBySlug(
  tenantId: string,
  slug: string,
): Promise<Product | null> {
  const products = await getProducts(tenantId);
  return products.find((p) => p.slug === slug) ?? null;
}

// ─── Orders (customer-facing) ────────────────────────────────────────

export async function createOrder(
  tenantId: string,
  order: Omit<Order, 'id' | '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>,
  token?: string,
): Promise<ApiResponse<Order>> {
  return fetchJson<ApiResponse<Order>>(`${apiBase}/api/orders`, {
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
): Promise<ApiResponse<Order>> {
  return fetchJson<ApiResponse<Order>>(
    `${apiBase}/api/orders/track/${orderNumber}?tenantId=${tenantId}`,
  );
}
