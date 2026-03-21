'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchDashboardMetrics, type DashboardMetrics } from '@/lib/services/dashboard';
import {
  ShoppingBag, ShoppingCart, Receipt,
  Package, Wallet, ArrowUpRight,
  BookOpen, Calculator, Users, List, BarChart3,
  Smartphone, Printer, Megaphone, Globe, AlertCircle,
  ShieldCheck, Trash2, RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const formatCurrency = (n: number) => `৳ ${n.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export default function DashboardPage() {
  const { tenantId } = useAuth();
  const router = useRouter();
  const [timeframe, setTimeframe] = useState('Today');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const data = await fetchDashboardMetrics(tenantId, timeframe);
      setMetrics(data);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [tenantId, timeframe]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const metricCards = metrics ? [
    { title: 'Today Sell', value: formatCurrency(metrics.todaySell), icon: <ArrowUpRight className="text-green-500" />, color: 'text-green-600' },
    { title: 'Today Purchase', value: formatCurrency(metrics.todayPurchase), icon: <ShoppingCart className="text-blue-500" />, color: 'text-blue-600' },
    { title: 'Today Expense', value: formatCurrency(metrics.todayExpense), icon: <Receipt className="text-orange-500" />, color: 'text-orange-600' },
    { title: 'Total Stock', value: metrics.totalStock.toFixed(2), icon: <Package className="text-green-600" />, color: 'text-green-700' },
    { title: 'You Will Get', value: formatCurrency(metrics.youWillGet), icon: <Wallet className="text-red-500" />, color: 'text-red-600' },
    { title: 'You Will Give', value: formatCurrency(metrics.youWillGive), icon: <Wallet className="text-green-500" />, color: 'text-green-600' },
  ] : [];

  const bookList = [
    { name: 'Purchase Book', icon: <BookOpen className="text-orange-400" />, href: '/purchases' },
    { name: 'Sales Book', icon: <Calculator className="text-yellow-500" />, href: '/sales' },
    { name: 'Due Book', icon: <Receipt className="text-red-400" />, href: '/due-book' },
    { name: 'Expense Book', icon: <Wallet className="text-blue-400" />, href: '/expenses' },
  ];

  const businessTools = [
    { name: 'Contacts', icon: <Users className="text-blue-500" />, href: '/contacts' },
    { name: 'Product List', icon: <List className="text-orange-500" />, href: '/products' },
    { name: 'Stock Book', icon: <Package className="text-green-500" />, href: '/products' },
    { name: 'Business Report', icon: <BarChart3 className="text-gray-600" />, href: '/reports' },
  ];

  const others = [
    { name: 'Cashbox', icon: <Calculator className="text-orange-400" />, href: '/reports' },
    { name: 'App Training', icon: <Smartphone className="text-yellow-600" />, href: '#' },
    { name: 'App Access', icon: <ShieldCheck className="text-blue-500" />, href: '#' },
    { name: 'Printer', icon: <Printer className="text-gray-500" />, href: '#' },
    { name: 'Marketing', icon: <Megaphone className="text-blue-400" />, href: '#' },
    { name: 'Online Shop', icon: <Globe className="text-red-400" />, href: '#' },
    { name: 'Expired Product', icon: <AlertCircle className="text-red-500" />, href: '#' },
    { name: 'Warranty Product', icon: <Package className="text-orange-400" />, href: '#' },
    { name: 'Recycle Bin', icon: <Trash2 className="text-blue-400" />, href: '#' },
  ];

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      {/* Balance & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div className="bg-white border-2 border-green-100 rounded-md px-3 py-1.5 flex items-center gap-2 shadow-sm">
          <div className="bg-green-100 p-1 rounded">
            <Wallet size={16} className="text-green-600" />
          </div>
          <span className="text-sm font-bold text-green-700">
            Balance: {metrics ? formatCurrency(metrics.balance) : '...'}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white border rounded-md p-1 shadow-sm w-full md:w-auto overflow-x-auto">
          {['Today', 'Weekly', 'Monthly', 'Yearly', 'All Time'].map((item) => (
            <button
              key={item}
              onClick={() => setTimeframe(item)}
              className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
                timeframe === item ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-100' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
          <div className="h-4 w-[1px] bg-gray-200 mx-1" />
          <button
            onClick={loadMetrics}
            disabled={loading}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
          >
            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {loading && !metrics ? (
          Array.from({ length: 6 }).map((_, i) => (
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
            </div>
          ))
        )}
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { name: 'Purchase', color: 'bg-orange-50 text-orange-600', icon: <ShoppingBag size={28} />, href: '/purchases' },
          { name: 'Sell', color: 'bg-yellow-50 text-yellow-600', icon: <ShoppingCart size={28} />, href: '/sales' },
          { name: 'Quick Sell', color: 'bg-blue-50 text-blue-600', icon: <div className="relative"><ShoppingCart size={28} /><div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5"><ArrowUpRight size={10} /></div></div>, href: '/sales' },
        ].map((action, idx) => (
          <button
            key={idx}
            onClick={() => router.push(action.href)}
            className={`${action.color} border border-transparent hover:border-current transition-all rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm`}
          >
            {action.icon}
            <span className="text-sm font-bold">{action.name}</span>
          </button>
        ))}
      </div>

      {/* Categorized Shortcut Sections */}
      <div className="space-y-4">
        <Section title="Book List" items={bookList} router={router} />
        <Section title="For Your Business" items={businessTools} router={router} />
        <Section title="Others" items={others} router={router} cols="grid-cols-4 md:grid-cols-6 lg:grid-cols-9" />
      </div>
    </div>
  );
}

function Section({ title, items, router, cols = 'grid-cols-4 md:grid-cols-4 lg:grid-cols-8' }: {
  title: string;
  items: Array<{ name: string; icon: React.ReactNode; href: string }>;
  router: ReturnType<typeof useRouter>;
  cols?: string;
}) {
  return (
    <section className="bg-white border rounded-lg p-3 shadow-sm">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">{title}</h2>
      <div className={`grid ${cols} gap-1`}>
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => item.href !== '#' && router.push(item.href)}
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
          >
            <div className="mb-2 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <span className="text-[10px] md:text-xs text-center font-medium text-gray-600 line-clamp-1">{item.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
