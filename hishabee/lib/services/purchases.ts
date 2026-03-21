import api from '@/lib/api';

export interface Purchase {
  _id: string;
  supplierName?: string;
  items: Array<{ name: string; quantity: number; price: number; total: number }>;
  totalAmount: number;
  date: string;
  note?: string;
  status?: string;
  createdAt: string;
}

export async function fetchPurchases(tenantId: string, params?: Record<string, string>): Promise<{ purchases: Purchase[]; total: number }> {
  const res = await api.get('/purchases', { params, headers: { 'X-Tenant-Id': tenantId } });
  // Backend returns { items: [...], total }
  const data = res.data;
  return {
    purchases: data?.items || [],
    total: data?.total || 0,
  };
}

export async function createPurchase(tenantId: string, purchase: Partial<Purchase>): Promise<Purchase> {
  const res = await api.post('/purchases', purchase, { headers: { 'X-Tenant-Id': tenantId } });
  return res.data;
}

export async function deletePurchase(tenantId: string, id: string): Promise<void> {
  await api.delete(`/purchases/${id}`, { headers: { 'X-Tenant-Id': tenantId } });
}
