'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchEntities, createEntity, deleteEntity, fetchTransactions, createTransaction, type Entity, type Transaction } from '@/lib/services/entities';
import { BookOpen, Plus, ChevronRight, ArrowUpRight, ArrowDownLeft, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DueBookPage() {
  const { tenantId } = useAuth();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);

  const loadEntities = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const data = await fetchEntities(tenantId);
      setEntities(data);
    } catch {
      toast.error('Failed to load entities');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { loadEntities(); }, [loadEntities]);

  const loadTransactions = useCallback(async (entityId: string) => {
    if (!tenantId) return;
    setTxLoading(true);
    try {
      const data = await fetchTransactions(tenantId, entityId);
      setTransactions(data);
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setTxLoading(false);
    }
  }, [tenantId]);

  const selectEntity = (entity: Entity) => {
    setSelectedEntity(entity);
    loadTransactions(entity._id);
  };

  const handleAddEntity = async (name: string, phone: string, type: 'customer' | 'supplier') => {
    if (!tenantId) return;
    try {
      await createEntity(tenantId, { name, phone, type, balance: 0 });
      toast.success('Contact added');
      setShowAddEntity(false);
      loadEntities();
    } catch {
      toast.error('Failed to add contact');
    }
  };

  const handleAddTransaction = async (type: 'due' | 'payment', amount: number, description: string) => {
    if (!tenantId || !selectedEntity) return;
    try {
      await createTransaction(tenantId, { entityId: selectedEntity._id, type, amount, description, date: new Date().toISOString() });
      toast.success('Transaction added');
      setShowAddTx(false);
      loadTransactions(selectedEntity._id);
      loadEntities();
    } catch {
      toast.error('Failed to add transaction');
    }
  };

  const handleDeleteEntity = async (id: string) => {
    if (!tenantId || !confirm('Delete this contact?')) return;
    try {
      await deleteEntity(tenantId, id);
      setEntities(prev => prev.filter(e => e._id !== id));
      if (selectedEntity?._id === id) {
        setSelectedEntity(null);
        setTransactions([]);
      }
      toast.success('Contact deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const totalGet = entities.reduce((s, e) => s + (e.balance > 0 ? e.balance : 0), 0);
  const totalGive = entities.reduce((s, e) => s + (e.balance < 0 ? Math.abs(e.balance) : 0), 0);

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen size={24} className="text-red-500" />
            Due Book
          </h1>
          <div className="flex gap-4 text-sm mt-1">
            <span className="text-red-600 font-medium">Get: ৳{totalGet.toLocaleString()}</span>
            <span className="text-green-600 font-medium">Give: ৳{totalGive.toLocaleString()}</span>
          </div>
        </div>
        <button onClick={() => setShowAddEntity(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} /> Add Contact
        </button>
      </div>

      {showAddEntity && (
        <AddEntityForm onSave={handleAddEntity} onCancel={() => setShowAddEntity(false)} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Entity List */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b font-medium text-sm text-gray-600">Contacts ({entities.length})</div>
          {loading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : entities.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No contacts yet</div>
          ) : (
            <div className="divide-y max-h-[60vh] overflow-y-auto">
              {entities.map(entity => (
                <div
                  key={entity._id}
                  onClick={() => selectEntity(entity)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${selectedEntity?._id === entity._id ? 'bg-blue-50' : ''}`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{entity.name}</p>
                    <p className="text-xs text-gray-400">{entity.phone || entity.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${entity.balance > 0 ? 'text-red-600' : entity.balance < 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      ৳{Math.abs(entity.balance).toLocaleString()}
                    </span>
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction Detail */}
        <div className="bg-white border rounded-lg overflow-hidden">
          {selectedEntity ? (
            <>
              <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{selectedEntity.name}</p>
                  <p className={`text-sm font-bold ${selectedEntity.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedEntity.balance > 0 ? 'Will Get' : 'Will Give'}: ৳{Math.abs(selectedEntity.balance).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setShowAddTx(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700">+ Transaction</button>
                  <button onClick={() => handleDeleteEntity(selectedEntity._id)} className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-xs hover:bg-red-100">Delete</button>
                </div>
              </div>
              {showAddTx && (
                <div className="p-3 border-b bg-gray-50">
                  <AddTransactionForm onSave={handleAddTransaction} onCancel={() => setShowAddTx(false)} />
                </div>
              )}
              {txLoading ? (
                <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
              ) : transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No transactions yet</div>
              ) : (
                <div className="divide-y max-h-[50vh] overflow-y-auto">
                  {transactions.map(tx => (
                    <div key={tx._id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        {tx.type === 'due' ? (
                          <ArrowUpRight size={16} className="text-red-500" />
                        ) : (
                          <ArrowDownLeft size={16} className="text-green-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium capitalize">{tx.type}</p>
                          {tx.description && <p className="text-xs text-gray-400">{tx.description}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium text-sm ${tx.type === 'due' ? 'text-red-600' : 'text-green-600'}`}>
                          {tx.type === 'due' ? '+' : '-'}৳{tx.amount}
                        </p>
                        <p className="text-xs text-gray-400">{new Date(tx.date || tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              Select a contact to view transactions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddEntityForm({ onSave, onCancel }: { onSave: (name: string, phone: string, type: 'customer' | 'supplier') => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'customer' | 'supplier'>('customer');

  return (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
      <h3 className="font-semibold mb-3">Add Contact</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name *" className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={type} onChange={e => setType(e.target.value as 'customer' | 'supplier')} className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
        </select>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => { if (!name) { toast.error('Name required'); return; } onSave(name, phone, type); }} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"><Save size={14} /> Save</button>
        <button onClick={onCancel} className="flex items-center gap-1 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"><X size={14} /> Cancel</button>
      </div>
    </div>
  );
}

function AddTransactionForm({ onSave, onCancel }: { onSave: (type: 'due' | 'payment', amount: number, desc: string) => void; onCancel: () => void }) {
  const [type, setType] = useState<'due' | 'payment'>('due');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <select value={type} onChange={e => setType(e.target.value as 'due' | 'payment')} className="border rounded px-2 py-1.5 text-sm">
        <option value="due">Due</option>
        <option value="payment">Payment</option>
      </select>
      <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Amount" className="border rounded px-2 py-1.5 text-sm w-24" />
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="border rounded px-2 py-1.5 text-sm flex-1 min-w-[100px]" />
      <button onClick={() => { if (!amount) { toast.error('Amount required'); return; } onSave(type, Number(amount), desc); }} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">Add</button>
      <button onClick={onCancel} className="border px-3 py-1.5 rounded text-sm hover:bg-gray-50">Cancel</button>
    </div>
  );
}
