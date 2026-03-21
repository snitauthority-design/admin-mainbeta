'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/tenant-config';
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfitLossData {
  totalRevenue: number;
  totalExpenses: number;
  totalPurchases: number;
  netProfit: number;
  orderCount: number;
}

export default function ReportsPage() {
  const { tenantId, tenantConfig } = useAuth();
  const fc = (n: number) => formatCurrency(n, tenantConfig.currency);
  const [data, setData] = useState<ProfitLossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  const loadReport = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const res = await api.get('/profit-loss/summary', {
        params: { period },
        headers: { 'X-Tenant-Id': tenantId },
      });
      const d = res.data;
      setData({
        totalRevenue: d.totalRevenue || d.revenue || 0,
        totalExpenses: d.totalExpenses || d.expenses || 0,
        totalPurchases: d.totalPurchases || d.purchases || 0,
        netProfit: d.netProfit || d.profit || 0,
        orderCount: d.orderCount || d.orders || 0,
      });
    } catch {
      // If profit-loss endpoint doesn't exist, show zeros
      setData({ totalRevenue: 0, totalExpenses: 0, totalPurchases: 0, netProfit: 0, orderCount: 0 });
      toast.error('Report data unavailable');
    } finally {
      setLoading(false);
    }
  }, [tenantId, period]);

  useEffect(() => { loadReport(); }, [loadReport]);

  const cards = data ? [
    { title: 'Total Revenue', value: data.totalRevenue, icon: <DollarSign className="text-green-500" />, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Expenses', value: data.totalExpenses, icon: <TrendingDown className="text-red-500" />, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Total Purchases', value: data.totalPurchases, icon: <TrendingDown className="text-orange-500" />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Net Profit', value: data.netProfit, icon: <TrendingUp className="text-blue-500" />, color: data.netProfit >= 0 ? 'text-green-600' : 'text-red-600', bg: 'bg-blue-50' },
  ] : [];

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={24} className="text-gray-600" />
            Business Report
          </h1>
          {data && <p className="text-sm text-gray-500">{data.orderCount} orders in this period</p>}
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="daily">Today</option>
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
          <option value="yearly">This Year</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white border rounded-xl p-6 animate-pulse h-32" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <div key={i} className={`${card.bg} border rounded-xl p-6`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-gray-600">{card.title}</span>
                {card.icon}
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>{fc(card.value)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Summary Bar */}
      {data && (
        <div className="mt-6 bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Profit Breakdown</h3>
          <div className="space-y-3">
            <BarRow label="Revenue" value={data.totalRevenue} max={Math.max(data.totalRevenue, data.totalExpenses + data.totalPurchases)} color="bg-green-500" currencyFn={fc} />
            <BarRow label="Expenses" value={data.totalExpenses} max={Math.max(data.totalRevenue, data.totalExpenses + data.totalPurchases)} color="bg-red-400" currencyFn={fc} />
            <BarRow label="Purchases" value={data.totalPurchases} max={Math.max(data.totalRevenue, data.totalExpenses + data.totalPurchases)} color="bg-orange-400" currencyFn={fc} />
          </div>
        </div>
      )}
    </div>
  );
}

function BarRow({ label, value, max, color, currencyFn }: { label: string; value: number; max: number; color: string; currencyFn: (n: number) => string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{currencyFn(value)}</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
