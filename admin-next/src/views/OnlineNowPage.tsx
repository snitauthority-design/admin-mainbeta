import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Globe, Users, Eye, TrendingUp, RefreshCw, Monitor, Smartphone, Tablet } from 'lucide-react';

interface TrafficSource {
  name: string;
  count: number;
  visitors: number;
  percentage: number;
  referrers: string[];
}

interface OnlineVisitor {
  visitorId: string;
  page: string;
  source: string;
  lastSeen: string;
}

interface SourcesData {
  sources: TrafficSource[];
  dailySourceData: any[];
  onlineCount: number;
  onlineBySource: Record<string, number>;
  onlineVisitors: OnlineVisitor[];
  totalViews: number;
  period: string;
}

interface OnlineNowPageProps {
  tenantId?: string;
  onBack?: () => void;
}

// Source icon/color mapping
const SOURCE_CONFIG: Record<string, { color: string; bgColor: string; icon: string }> = {
  'Direct': { color: '#6366F1', bgColor: 'rgba(99, 102, 241, 0.1)', icon: '🔗' },
  'Google Search': { color: '#4285F4', bgColor: 'rgba(66, 133, 244, 0.1)', icon: '🔍' },
  'Facebook': { color: '#1877F2', bgColor: 'rgba(24, 119, 242, 0.1)', icon: '📘' },
  'Instagram': { color: '#E4405F', bgColor: 'rgba(228, 64, 95, 0.1)', icon: '📷' },
  'YouTube': { color: '#FF0000', bgColor: 'rgba(255, 0, 0, 0.1)', icon: '▶️' },
  'Twitter/X': { color: '#1DA1F2', bgColor: 'rgba(29, 161, 242, 0.1)', icon: '🐦' },
  'TikTok': { color: '#000000', bgColor: 'rgba(0, 0, 0, 0.08)', icon: '🎵' },
  'LinkedIn': { color: '#0A66C2', bgColor: 'rgba(10, 102, 194, 0.1)', icon: '💼' },
  'Pinterest': { color: '#E60023', bgColor: 'rgba(230, 0, 35, 0.1)', icon: '📌' },
  'WhatsApp': { color: '#25D366', bgColor: 'rgba(37, 211, 102, 0.1)', icon: '💬' },
  'Telegram': { color: '#0088CC', bgColor: 'rgba(0, 136, 204, 0.1)', icon: '✈️' },
  'Reddit': { color: '#FF4500', bgColor: 'rgba(255, 69, 0, 0.1)', icon: '🔴' },
  'Bing': { color: '#008373', bgColor: 'rgba(0, 131, 115, 0.1)', icon: '🔎' },
  'Yahoo': { color: '#6001D2', bgColor: 'rgba(96, 1, 210, 0.1)', icon: '🟣' },
  'Baidu': { color: '#2932E1', bgColor: 'rgba(41, 50, 225, 0.1)', icon: '🔵' },
  'Other': { color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)', icon: '🌐' },
};

const getSourceConfig = (name: string) => SOURCE_CONFIG[name] || SOURCE_CONFIG['Other'];

const OnlineNowPage: React.FC<OnlineNowPageProps> = ({ tenantId, onBack }) => {
  const [data, setData] = useState<SourcesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>('7d');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const activeTenantId = tenantId || localStorage.getItem('activeTenantId');
    if (!activeTenantId) {
      setLoading(false);
      return;
    }

    try {
      const hostname = window.location.hostname;
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
      const apiUrl = isLocal ? 'http://localhost:5001' : `${window.location.protocol}//${hostname.split('.').slice(-2).join('.')}`;

      const res = await fetch(`${apiUrl}/api/visitors/${activeTenantId}/sources?period=${period}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching traffic sources:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tenantId, period]);

  useEffect(() => {
    setLoading(true);
    fetchData();

    // Refresh every 30 seconds for online data
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="w-48 h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
              <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 animate-pulse">
          <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const onlineCount = data?.onlineCount || 0;
  const totalViews = data?.totalViews || 0;
  const sources = data?.sources || [];
  const onlineVisitors = data?.onlineVisitors || [];
  const onlineBySource = data?.onlineBySource || {};

  // Calculate top source
  const topSource = sources.length > 0 ? sources[0].name : 'N/A';
  const uniqueSourceCount = sources.length;

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Visitors Analysis
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Real-time traffic sources & visitor insights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Filter */}
          <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {[
              { label: '24h', value: '24h' },
              { label: '7d', value: '7d' },
              { label: '30d', value: '30d' },
              { label: 'All', value: 'all' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  period === opt.value
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all text-gray-600 dark:text-gray-300"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Online Now */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 sm:p-5 border border-green-100 dark:border-green-800/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-800/40 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400">Online Now</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-300 tabular-nums">
            {onlineCount}
          </div>
          <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-500 mt-1">Active in last 5 min</p>
        </div>

        {/* Total Views */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 sm:p-5 border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center">
              <Eye size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400">Page Views</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-300 tabular-nums">
            {totalViews.toLocaleString()}
          </div>
          <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-500 mt-1">In selected period</p>
        </div>

        {/* Top Source */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 sm:p-5 border border-purple-100 dark:border-purple-800/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-800/40 flex items-center justify-center">
              <TrendingUp size={16} className="text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-400">Top Source</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-300 truncate">
            {topSource}
          </div>
          <p className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-500 mt-1">
            {sources[0]?.percentage || 0}% of traffic
          </p>
        </div>

        {/* Total Sources */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 sm:p-5 border border-orange-100 dark:border-orange-800/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-800/40 flex items-center justify-center">
              <Globe size={16} className="text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-400">Sources</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-orange-800 dark:text-orange-300 tabular-nums">
            {uniqueSourceCount}
          </div>
          <p className="text-[10px] sm:text-xs text-orange-600 dark:text-orange-500 mt-1">Unique traffic sources</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Traffic Sources Breakdown */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">
            Traffic Sources
          </h2>

          {sources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Globe size={40} className="mb-3 opacity-50" />
              <p className="text-sm">No visitor data yet</p>
              <p className="text-xs mt-1">Traffic sources will appear as visitors arrive</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((source, idx) => {
                const config = getSourceConfig(source.name);
                return (
                  <div key={idx} className="group">
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      {/* Source Icon */}
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-base sm:text-lg flex-shrink-0"
                        style={{ backgroundColor: config.bgColor }}
                      >
                        {config.icon}
                      </div>

                      {/* Source Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {source.name}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {source.visitors} visitors
                            </span>
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ color: config.color, backgroundColor: config.bgColor }}
                            >
                              {source.percentage}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 sm:h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${source.percentage}%`,
                              backgroundColor: config.color,
                              minWidth: source.percentage > 0 ? '4px' : '0'
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                            {source.count.toLocaleString()} page views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          {/* Online Now by Source */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                Online by Source
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {onlineCount} online
                </span>
              </div>
            </div>

            {Object.keys(onlineBySource).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Users size={32} className="mb-2 opacity-50" />
                <p className="text-xs">No visitors online right now</p>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(onlineBySource)
                  .sort(([, a], [, b]) => b - a)
                  .map(([source, count]) => {
                    const config = getSourceConfig(source);
                    const pct = onlineCount > 0 ? Math.round((count / onlineCount) * 100) : 0;
                    return (
                      <div key={source} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <span className="text-base flex-shrink-0">{config.icon}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{source}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">{count}</span>
                        <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Active Visitors */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">
              Active Visitors
            </h2>

            {onlineVisitors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Users size={32} className="mb-2 opacity-50" />
                <p className="text-xs">No active visitors</p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                {onlineVisitors.slice(0, 20).map((visitor, idx) => {
                  const config = getSourceConfig(visitor.source);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <Users size={12} className="text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                          {visitor.page || '/'}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px]">{config.icon}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">{visitor.source}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">
                        {formatTimeAgo(visitor.lastSeen)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineNowPage;
