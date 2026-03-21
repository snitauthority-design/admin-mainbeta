import api from '@/lib/api';

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category?: string;
  date: string;
  note?: string;
  createdAt: string;
}

export async function fetchExpenses(tenantId: string, params?: Record<string, string>): Promise<{ expenses: Expense[]; total: number }> {
  const res = await api.get('/expenses', { params, headers: { 'X-Tenant-Id': tenantId } });
  const data = res.data;
  return {
    expenses: data?.expenses || data || [],
    total: data?.total || 0,
  };
}

export async function createExpense(tenantId: string, expense: Partial<Expense>): Promise<Expense> {
  const res = await api.post(`/expenses/${tenantId}`, expense, { headers: { 'X-Tenant-Id': tenantId } });
  return res.data;
}

export async function deleteExpense(tenantId: string, id: string): Promise<void> {
  await api.delete(`/expenses/${id}`, { headers: { 'X-Tenant-Id': tenantId } });
}
