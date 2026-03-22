'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/tenant-config';
import {
  BarChart3, TrendingUp, DollarSign,
  RefreshCcw, ShoppingCart, Receipt
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfitLossData {
  totalRevenue: number;
  totalExpenses: number;
  totalPurchases: number;
  totalIncome: number;
  netProfit: number;
  orderCount: number;
  expenseCount: number;
  purchaseCount: number;
  incomeCount: number;
}

// Per-tenant localStorage cache helpers
const REPORT_CACHE_PREFIX = 'hishabee_report_';

function getCacheKey(tenantId: string, period: string) {
  return `${REPORT_CACHE_PREFIX}${tenantId}_${period}`;
}

function getCachedReport(tenantId: string, period: string): ProfitLossData | null {
  try {
    const raw = localStorage.getItem(getCacheKey(tenantId, period));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch {
    return null;
  }
}

function setCachedReport(tenantId: string, period: string, data: ProfitLossData) {
  try {
    localStorage.setItem(getCacheKey(tenantId, period), JSON.stringify({ data, ts: Date.now() }));
  } catch { /* quota exceeded — ignore */ }
}

export default function ReportsPage() {
  const { tenantId, tenantConfig } = useAuth();
  const fc = (n: number) => formatCurrency(n, tenantConfig.currency);
  const [data, setData] = useState<ProfitLossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('Monthly');

  // Restore cached data for current tenant+period on mount and period change
  useEffect(() => {
    if (!tenantId) return;
    const cached = getCachedReport(tenantId, period);
    if (cached) setData(cached);
  }, [tenantId, period]);

  const loadReport = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const pMap: Record<string, string> = { Today: 'daily', Weekly: 'weekly', Monthly: 'monthly', Yearly: 'yearly', 'All Time': '' };
      const params: Record<string, string> = {};
      const apiPeriod = pMap[period];
      if (apiPeriod) params.period = apiPeriod;
      const res = await api.get('/profit-loss/summary', {
        params,
        headers: { 'X-Tenant-Id': tenantId },
      });
      const d = res.data;
      const report: ProfitLossData = {
        totalRevenue: d.totalRevenue ?? 0,
        totalExpenses: d.totalExpenses ?? d.otherExpense ?? 0,
        totalPurchases: d.totalPurchases ?? 0,
        totalIncome: d.totalIncome ?? d.otherIncome ?? 0,
        netProfit: d.netProfit ?? d.totalProfitLoss ?? 0,
        orderCount: d.orderCount ?? 0,
        expenseCount: d.expenseCount ?? 0,
        purchaseCount: d.purchaseCount ?? 0,
        incomeCount: d.incomeCount ?? 0,
      };
      setData(report);
      setCachedReport(tenantId, period, report);
    } catch {
      // On failure, keep showing cached data if available
      if (!data) {
        const cached = getCachedReport(tenantId, period);
        if (cached) {
          setData(cached);
        } else {
          setData({ totalRevenue: 0, totalExpenses: 0, totalPurchases: 0, totalIncome: 0, netProfit: 0, orderCount: 0, expenseCount: 0, purchaseCount: 0, incomeCount: 0 });
        }
      }
      toast.error('Report data unavailable');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId, period]);

  useEffect(() => { loadReport(); }, [loadReport]);

  const metricCards = data ? [
    { title: 'Revenue', value: fc(data.totalRevenue), sub: `${data.orderCount} orders`, icon: <DollarSign size={20} className="text-green-500" />, color: 'text-green-600' },
    { title: 'Purchases', value: fc(data.totalPurchases), sub: `${data.purchaseCount} entries`, icon: <ShoppingCart size={20} className="text-blue-500" />, color: 'text-blue-600' },
    { title: 'Expenses', value: fc(data.totalExpenses), sub: `${data.expenseCount} entries`, icon: <Receipt size={20} className="text-orange-500" />, color: 'text-orange-600' },
    { title: 'Net Profit', value: fc(data.netProfit), sub: data.netProfit >= 0 ? 'Profit' : 'Loss', icon: <TrendingUp size={20} className={data.netProfit >= 0 ? 'text-green-500' : 'text-red-500'} />, color: data.netProfit >= 0 ? 'text-green-600' : 'text-red-600' },
  ] : [];

  // Chart data for bar chart
  const chartBars = data ? [
    { label: 'Revenue', value: data.totalRevenue, color: 'bg-green-500' },
    { label: 'Purchases', value: data.totalPurchases, color: 'bg-blue-500' },
    { label: 'Expenses', value: data.totalExpenses, color: 'bg-orange-500' },
    ...(data.totalIncome > 0 ? [{ label: 'Income', value: data.totalIncome, color: 'bg-cyan-500' }] : []),
    { label: 'Net Profit', value: Math.abs(data.netProfit), color: data.netProfit >= 0 ? 'bg-emerald-500' : 'bg-red-500' },
  ] : [];
  const chartMax = Math.max(...chartBars.map(b => b.value), 1);

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      {/* Balance & Filter Bar — same style as Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-white border-2 border-green-100 rounded-md px-3 py-1.5 flex items-center gap-2 shadow-sm">
            <div className="bg-green-100 p-1 rounded">
              <BarChart3 size={16} className="text-green-600" />
            </div>
            <span className="text-sm font-bold text-green-700">
              Net: {data ? fc(data.netProfit) : '...'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white border rounded-md p-1 shadow-sm w-full md:w-auto overflow-x-auto">
          {['Today', 'Weekly', 'Monthly', 'Yearly', 'All Time'].map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
                period === item ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-100' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
          <div className="h-4 w-[1px] bg-gray-200 mx-1" />
          <button onClick={loadReport} disabled={loading} className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded">
            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Cards — same grid style as Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {loading && !data ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-3 shadow-sm animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          ))
        ) : (
          metricCards.map((m, idx) => (
            <div key={idx} className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">{m.title}</span>
                {m.icon}
              </div>
              <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
              <div className="text-[10px] text-gray-400">{m.sub}</div>
            </div>
          ))
        )}
      </div>

      {/* Bar Chart */}
      {data && (
        <div className="bg-white border rounded-lg p-3 shadow-sm mb-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Overview Chart</h2>
          <div className="flex items-end gap-3 h-44 px-2">
            {chartBars.map((bar, i) => {
              const pct = chartMax > 0 ? (bar.value / chartMax) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-gray-600">{fc(bar.value)}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                    <div
                      className={`${bar.color} rounded-t-md w-full max-w-[48px] transition-all duration-700 ease-out`}
                      style={{ height: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 text-center leading-tight">{bar.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Profit Breakdown */}
      {data && (
        <div className="bg-white border rounded-lg p-3 shadow-sm">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Profit Breakdown</h2>
          <div className="space-y-2">
            <BarRow label="Revenue" value={data.totalRevenue} max={Math.max(data.totalRevenue, data.totalExpenses + data.totalPurchases, 1)} color="bg-green-500" fc={fc} />
            <BarRow label="Expenses" value={data.totalExpenses} max={Math.max(data.totalRevenue, data.totalExpenses + data.totalPurchases, 1)} color="bg-orange-400" fc={fc} />
            <BarRow label="Purchases" value={data.totalPurchases} max={Math.max(data.totalRevenue, data.totalExpenses + data.totalPurchases, 1)} color="bg-blue-400" fc={fc} />
            {data.totalIncome > 0 && (
              <BarRow label="Income" value={data.totalIncome} max={Math.max(data.totalRevenue, data.totalExpenses + data.totalPurchases, 1)} color="bg-cyan-400" fc={fc} />
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t flex items-baseline justify-between">
            <span className="text-xs font-medium text-gray-600">Net Profit / Loss</span>
            <span className={`text-sm font-bold ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fc(data.netProfit)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function BarRow({ label, value, max, color, fc }: { label: string; value: number; max: number; color: string; fc: (n: number) => string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-0.5">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-700">{fc(value)}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
