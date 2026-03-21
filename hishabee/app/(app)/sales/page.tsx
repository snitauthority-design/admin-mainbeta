'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchOrders, updateOrder, type Order } from '@/lib/services/orders';
import { ShoppingCart, Search, Eye, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Processing: 'bg-indigo-100 text-indigo-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Return: 'bg-orange-100 text-orange-700',
};

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return'];

export default function SalesPage() {
  const { tenantId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const loadOrders = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), pageSize: String(pageSize) };
      if (search) params.query = search;
      if (statusFilter) params.status = statusFilter;
      const data = await fetchOrders(tenantId, params);
      setOrders(data.orders);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [tenantId, page, search, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (order: Order, newStatus: string) => {
    if (!tenantId) return;
    try {
      await updateOrder(tenantId, order._id, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === order._id ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart size={24} className="text-yellow-500" />
            Sales / Orders
          </h1>
          <p className="text-sm text-gray-500">{total} orders total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by customer name or phone..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3">Order #{selectedOrder.orderId || selectedOrder._id.slice(-6)}</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Customer:</strong> {selectedOrder.customerName || 'Guest'}</p>
              <p><strong>Phone:</strong> {selectedOrder.customerPhone || '-'}</p>
              <p><strong>Status:</strong> <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[selectedOrder.status] || 'bg-gray-100 text-gray-600'}`}>{selectedOrder.status}</span></p>
              <p><strong>Total:</strong> ৳{selectedOrder.total || selectedOrder.grandTotal || 0}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <strong>Items:</strong>
                  <ul className="mt-1 space-y-1">
                    {selectedOrder.items.map((item, i) => (
                      <li key={i} className="flex justify-between bg-gray-50 px-2 py-1 rounded text-xs">
                        <span>{item.name} × {item.quantity}</span>
                        <span>৳{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button onClick={() => setSelectedOrder(null)} className="mt-4 w-full border py-2 rounded-lg text-sm hover:bg-gray-50">Close</button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-lg">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{order.orderId || order._id.slice(-6)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customerName || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{order.customerPhone || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">৳{order.total || order.grandTotal || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          className={`appearance-none px-2 py-1 pr-6 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > pageSize && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-500">Page {page} of {Math.ceil(total / pageSize)}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
