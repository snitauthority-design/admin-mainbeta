import api from '@/lib/api';

export interface DashboardMetrics {
  todaySell: number;
  todayPurchase: number;
  todayExpense: number;
  totalStock: number;
  youWillGet: number;
  youWillGive: number;
  balance: number;
}

export async function fetchDashboardMetrics(tenantId: string, timeframe: string): Promise<DashboardMetrics> {
  const now = new Date();
  let startDate: string;
  const endDate: string = now.toISOString();

  switch (timeframe) {
    case 'Today': {
      const s = new Date(now); s.setHours(0, 0, 0, 0);
      startDate = s.toISOString();
      break;
    }
    case 'Weekly': {
      const s = new Date(now); s.setDate(s.getDate() - 7);
      startDate = s.toISOString();
      break;
    }
    case 'Monthly': {
      const s = new Date(now); s.setMonth(s.getMonth() - 1);
      startDate = s.toISOString();
      break;
    }
    case 'Yearly': {
      const s = new Date(now); s.setFullYear(s.getFullYear() - 1);
      startDate = s.toISOString();
      break;
    }
    default:
      startDate = '2020-01-01T00:00:00.000Z';
  }

  const [ordersRes, expensesRes, purchasesRes, entitiesRes] = await Promise.allSettled([
    api.get(`/orders/${tenantId}`, { params: { startDate, endDate, pageSize: 1000 } }),
    api.get('/expenses/summary', { params: { startDate, endDate }, headers: { 'X-Tenant-Id': tenantId } }),
    api.get('/purchases/summary/stats', { params: { startDate, endDate }, headers: { 'X-Tenant-Id': tenantId } }),
    api.get('/entities', { headers: { 'X-Tenant-Id': tenantId } }),
  ]);

  let todaySell = 0;
  if (ordersRes.status === 'fulfilled') {
    // Backend returns { data: [...orders] }
    const orders = ordersRes.value.data?.data || [];
    if (Array.isArray(orders)) {
      todaySell = orders.reduce((sum: number, o: { total?: number; grandTotal?: number }) => sum + (o.total || o.grandTotal || 0), 0);
    }
  }

  let todayExpense = 0;
  if (expensesRes.status === 'fulfilled') {
    // Backend returns { totalAmount, categories, totalTransactions }
    todayExpense = expensesRes.value.data?.totalAmount || 0;
  }

  let todayPurchase = 0;
  if (purchasesRes.status === 'fulfilled') {
    // Backend returns { totalPurchases, totalAmount, totalItems }
    todayPurchase = purchasesRes.value.data?.totalAmount || 0;
  }

  let youWillGet = 0;
  let youWillGive = 0;
  if (entitiesRes.status === 'fulfilled') {
    // Backend returns plain array of entities
    const entities = entitiesRes.value.data;
    if (Array.isArray(entities)) {
      for (const e of entities) {
        youWillGet += e.totalOwedToMe || 0;
        youWillGive += e.totalIOweThemNumber || 0;
      }
    }
  }

  // Fetch products for stock count
  let totalStock = 0;
  try {
    const prodRes = await api.get(`/tenant-data/${tenantId}/products`);
    // Backend returns { data: <content> }
    const products = prodRes.data?.data || [];
    if (Array.isArray(products)) {
      totalStock = products.reduce((sum: number, p: { stock?: number; quantity?: number }) => sum + (p.stock || p.quantity || 0), 0);
    }
  } catch { /* ignore */ }

  const balance = todaySell - todayPurchase - todayExpense;

  return { todaySell, todayPurchase, todayExpense, totalStock, youWillGet, youWillGive, balance };
}
