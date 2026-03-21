import api from '@/lib/api';

export interface Order {
  _id?: string;
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
  // Backend expects 'search' not 'query', and 'perPage' not 'pageSize'
  const mapped: Record<string, string> = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (k === 'query') mapped.search = v;
      else if (k === 'pageSize') mapped.perPage = v;
      else mapped[k] = v;
    }
  }
  const res = await api.get(`/orders/${tenantId}`, { params: mapped });
  // Backend returns { data: [...orders] }
  const orders = Array.isArray(res.data?.data) ? res.data.data : [];
  return {
    orders,
    total: orders.length,
  };
}

export async function updateOrder(tenantId: string, orderId: string, updates: Partial<Order>): Promise<void> {
  await api.patch(`/orders/${tenantId}/${orderId}`, updates);
}

export async function deleteOrder(tenantId: string, orderId: string): Promise<void> {
  await api.delete(`/orders/${tenantId}/${orderId}`);
}
