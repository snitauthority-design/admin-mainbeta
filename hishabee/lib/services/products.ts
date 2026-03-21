import api from '@/lib/api';

export interface Product {
  _id?: string;
  id?: number;
  name: string;
  price: number;
  stock?: number;
  quantity?: number;
  category?: string;
  image?: string;
  images?: string[];
  status?: string;
  sku?: string;
  cost?: number;
  description?: string;
}

export async function fetchProducts(tenantId: string): Promise<Product[]> {
  const res = await api.get(`/tenant-data/${tenantId}/products`);
  return res.data?.products || res.data || [];
}

export async function updateProducts(tenantId: string, products: Product[]): Promise<void> {
  await api.put(`/tenant-data/${tenantId}/products`, { products });
}
