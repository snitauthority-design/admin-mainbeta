'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchPurchases, createPurchase, deletePurchase, type Purchase } from '@/lib/services/purchases';
import { formatCurrency } from '@/lib/tenant-config';
import { ShoppingBag, Plus, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PurchasesPage() {
  const { tenantId, tenantConfig } = useAuth();
  const fc = (n: number) => formatCurrency(n, tenantConfig.currency);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadPurchases = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const data = await fetchPurchases(tenantId, { page: String(page), pageSize: '20' });
      setPurchases(data.purchases);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  }, [tenantId, page]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  const handleAdd = async (supplier: string, items: Array<{ name: string; quantity: number; price: number }>, note: string) => {
    if (!tenantId) return;
    try {
      const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
      await createPurchase(tenantId, {
        supplierName: supplier,
        items: items.map(i => ({ ...i, total: i.price * i.quantity })),
        totalAmount,
        date: new Date().toISOString(),
        note,
      });
      toast.success('Purchase added');
      setShowForm(false);
      loadPurchases();
    } catch {
      toast.error('Failed to add purchase');
    }
  };

  const handleDelete = async (id: string) => {
    if (!tenantId || !confirm('Delete this purchase?')) return;
    try {
      await deletePurchase(tenantId, id);
      setPurchases(prev => prev.filter(p => p._id !== id));
      toast.success('Purchase deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag size={24} className="text-orange-500" />
            Purchases
          </h1>
          <p className="text-sm text-gray-500">{total} purchases</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} /> Add Purchase
        </button>
      </div>

      {showForm && <PurchaseForm onSave={handleAdd} onCancel={() => setShowForm(false)} />}

      {loading ? (
        <LoadingSkeleton />
      ) : purchases.length === 0 ? (
        <EmptyState icon={<ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />} text="No purchases yet" />
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Supplier</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Items</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {purchases.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{p.supplierName || '-'}</td>
                    <td className="px-4 py-3 text-right font-medium text-green-600">{fc(p.totalAmount)}</td>
                    <td className="px-4 py-3 text-gray-500">{p.items?.length || 0} items</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(p.date || p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {total > 20 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-500">Page {page}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PurchaseForm({ onSave, onCancel }: { onSave: (supplier: string, items: Array<{ name: string; quantity: number; price: number }>, note: string) => void; onCancel: () => void }) {
  const [supplier, setSupplier] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);

  const addItem = () => setItems([...items, { name: '', quantity: 1, price: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, value: string | number) => {
    const updated = [...items];
    (updated[i] as Record<string, string | number>)[field] = value;
    setItems(updated);
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
      <h3 className="font-semibold mb-3">New Purchase</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Supplier name" className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="space-y-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} placeholder="Item name" className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none" />
            <input value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} type="number" placeholder="Qty" className="w-20 border rounded-lg px-3 py-2 text-sm outline-none" />
            <input value={item.price} onChange={e => updateItem(i, 'price', Number(e.target.value))} type="number" placeholder="Price" className="w-24 border rounded-lg px-3 py-2 text-sm outline-none" />
            {items.length > 1 && <button onClick={() => removeItem(i)} className="text-red-500 p-1"><X size={16} /></button>}
          </div>
        ))}
        <button onClick={addItem} className="text-blue-600 text-sm hover:underline">+ Add Item</button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { if (!items[0].name) { toast.error('Add at least one item'); return; } onSave(supplier, items, note); }} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"><Save size={14} /> Save</button>
        <button onClick={onCancel} className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-white border rounded-lg p-4 animate-pulse h-16" />)}
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-center py-12 bg-white border rounded-lg">
      {icon}
      <p className="text-gray-500">{text}</p>
    </div>
  );
}
