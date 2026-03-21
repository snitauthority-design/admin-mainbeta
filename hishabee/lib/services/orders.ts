import api from '@/lib/api';

export interface Order {
  _id: string;
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  total?: number;
  grandTotal?: number;
  status: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  createdAt: string;
  paymentMethod?: string;
  address?: string;
}

export async function fetchOrders(tenantId: string, params?: Record<string, string>): Promise<{ orders: Order[]; total: number }> {
  const res = await api.get(`/orders/${tenantId}`, { params });
  const data = res.data;
  return {
    orders: data?.orders || data || [],
    total: data?.total || data?.totalOrders || 0,
  };
}

export async function updateOrder(tenantId: string, orderId: string, updates: Partial<Order>): Promise<void> {
  await api.patch(`/orders/${tenantId}/${orderId}`, updates);
}

export async function deleteOrder(tenantId: string, orderId: string): Promise<void> {
  await api.delete(`/orders/${tenantId}/${orderId}`);
}
