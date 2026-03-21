import api from '@/lib/api';

export interface Entity {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  type: 'customer' | 'supplier' | 'both';
  balance: number;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  entityId: string;
  type: 'due' | 'payment' | 'advance';
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
}

export async function fetchEntities(tenantId: string): Promise<Entity[]> {
  const res = await api.get('/entities', { headers: { 'X-Tenant-Id': tenantId } });
  return res.data?.entities || res.data || [];
}

export async function createEntity(tenantId: string, entity: Partial<Entity>): Promise<Entity> {
  const res = await api.post('/entities', entity, { headers: { 'X-Tenant-Id': tenantId } });
  return res.data;
}

export async function updateEntity(tenantId: string, id: string, updates: Partial<Entity>): Promise<Entity> {
  const res = await api.put(`/entities/${id}`, updates, { headers: { 'X-Tenant-Id': tenantId } });
  return res.data;
}

export async function deleteEntity(tenantId: string, id: string): Promise<void> {
  await api.delete(`/entities/${id}`, { headers: { 'X-Tenant-Id': tenantId } });
}

export async function fetchTransactions(tenantId: string, entityId?: string): Promise<Transaction[]> {
  const params = entityId ? { entityId } : {};
  const res = await api.get('/transactions', { params, headers: { 'X-Tenant-Id': tenantId } });
  return res.data?.transactions || res.data || [];
}

export async function createTransaction(tenantId: string, tx: Partial<Transaction>): Promise<Transaction> {
  const res = await api.post('/transactions', tx, { headers: { 'X-Tenant-Id': tenantId } });
  return res.data;
}
