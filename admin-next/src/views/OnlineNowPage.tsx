import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Globe, Users, Eye, TrendingUp, RefreshCw, Activity } from 'lucide-react';

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

interface SourceConfig {
  color: string;
  bgColor: string;
  icon?: string;
  image?: string;
}

const ICON_SIZE_CLASSES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const SOURCE_IMAGE_ASSETS = {
  facebook: 'https://hdnfltv.com/image/nitimages/fb-icon.webp',
  google: 'https://hdnfltv.com/image/nitimages/google-icon.webp',
  other: 'https://hdnfltv.com/image/nitimages/other.webp',
  link: 'https://hdnfltv.com/image/nitimages/Link-icon.webp',
};

// Source icon/color mapping
const SOURCE_CONFIG: Record<string, SourceConfig> = {
  'Direct': { color: '#2563EB', bgColor: 'rgba(37, 99, 235, 0.12)', image: SOURCE_IMAGE_ASSETS.link, icon: '🔗' },
  'Google Search': { color: '#4285F4', bgColor: 'rgba(66, 133, 244, 0.12)', image: SOURCE_IMAGE_ASSETS.google, icon: '🔍' },
  'Facebook': { color: '#1877F2', bgColor: 'rgba(24, 119, 242, 0.12)', image: SOURCE_IMAGE_ASSETS.facebook, icon: '📘' },
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
  'Other': { color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.12)', image: SOURCE_IMAGE_ASSETS.other, icon: '🌐' },
};

const resolveSourceKey = (name: string) => {
  const normalized = name.toLowerCase();

  if (normalized.includes('facebook')) return 'Facebook';
  if (normalized.includes('google')) return 'Google Search';
  if (normalized.includes('direct') || normalized.includes('link')) return 'Direct';
  if (normalized.includes('other')) return 'Other';

  return name;
};

const getSourceConfig = (name: string) => SOURCE_CONFIG[resolveSourceKey(name)] || SOURCE_CONFIG['Other'];

const SourceAvatar: React.FC<{ source: string; size?: keyof typeof ICON_SIZE_CLASSES }> = ({
  source,
  size = 'md',
}) => {
  const config = getSourceConfig(source);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={`flex items-center justify-center rounded-xl ${size === 'lg' ? 'w-10 h-10' : size === 'sm' ? 'w-8 h-8' : 'w-9 h-9'}`}
      style={{ backgroundColor: config.bgColor }}
    >
      {config.image && !imageFailed ? (
        <img
          src={config.image}
          alt={`${source} icon`}
          className={`${ICON_SIZE_CLASSES[size]} object-contain`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className={size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-sm' : 'text-base'}>{config.icon}</span>
      )}
    </div>
  );
};

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
      const isLocal = hostname.includes('localhost') || hostname === '127.0.0.1';
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
    <div className="mx-auto max-w-[1360px] space-y-3 p-3 sm:p-4 lg:p-5">
      {/* Header */}
      <div className="rounded-2xl border border-sky-100 bg-white/95 p-3 shadow-[0_18px_48px_-36px_rgba(37,99,235,0.55)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-700 transition-all hover:border-sky-200 hover:bg-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
                <Activity size={12} />
                live insights
              </span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl">
              Visitors Analysis
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Compact real-time overview of traffic sources, page views, and active visitors.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Filter */}
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/80">
            {[
              { label: '24h', value: '24h' },
              { label: '7d', value: '7d' },
              { label: '30d', value: '30d' },
              { label: 'All', value: 'all' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                  period === opt.value
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600 transition-all hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/20"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Online Now */}
        <div className="rounded-2xl border border-sky-100 bg-sky-50/90 p-3 shadow-[0_18px_40px_-34px_rgba(37,99,235,0.55)] dark:border-sky-500/20 dark:bg-sky-500/10">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-900/60">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">Online Now</span>
          </div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white sm:text-3xl">
            {onlineCount}
          </div>
          <p className="mt-1 text-[11px] text-sky-700/80 dark:text-sky-200/80">Active in the last 5 minutes</p>
        </div>

        {/* Total Views */}
        <div className="rounded-2xl border border-orange-100 bg-orange-50/90 p-3 shadow-[0_18px_40px_-34px_rgba(249,115,22,0.55)] dark:border-orange-500/20 dark:bg-orange-500/10">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-900/60">
              <Eye size={16} className="text-orange-600 dark:text-orange-300" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-300">Page Views</span>
          </div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white sm:text-3xl">
            {totalViews.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-orange-700/80 dark:text-orange-200/80">Across the selected range</p>
        </div>

        {/* Top Source */}
        <div className="rounded-2xl border border-sky-100 bg-sky-50/90 p-3 shadow-[0_18px_40px_-34px_rgba(37,99,235,0.55)] dark:border-sky-500/20 dark:bg-sky-500/10">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-900/60">
              <TrendingUp size={16} className="text-sky-600 dark:text-sky-300" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">Top Source</span>
          </div>
          <div className="truncate text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            {topSource}
          </div>
          <p className="mt-1 text-[11px] text-sky-700/80 dark:text-sky-200/80">
            {sources[0]?.percentage || 0}% of traffic
          </p>
        </div>

        {/* Total Sources */}
        <div className="rounded-2xl border border-orange-100 bg-orange-50/90 p-3 shadow-[0_18px_40px_-34px_rgba(249,115,22,0.55)] dark:border-orange-500/20 dark:bg-orange-500/10">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-900/60">
              <Globe size={16} className="text-orange-600 dark:text-orange-300" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-300">Sources</span>
          </div>
          <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white sm:text-3xl">
            {uniqueSourceCount}
          </div>
          <p className="mt-1 text-[11px] text-orange-700/80 dark:text-orange-200/80">Unique traffic channels</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        {/* Traffic Sources Breakdown */}
        <div className="rounded-2xl border border-sky-100 bg-white p-3 shadow-[0_18px_48px_-38px_rgba(37,99,235,0.45)] dark:border-slate-700 dark:bg-slate-900 xl:col-span-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                Traffic Sources
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compact breakdown of where visitors are coming from.
              </p>
            </div>
            <div className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
              {uniqueSourceCount} sources
            </div>
          </div>

          {sources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Globe size={40} className="mb-3 opacity-50" />
              <p className="text-sm">No visitor data yet</p>
              <p className="text-xs mt-1">Traffic sources will appear as visitors arrive</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sources.map((source, idx) => {
                const config = getSourceConfig(source.name);
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-2.5 transition-colors hover:border-slate-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800/70 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <SourceAvatar source={source.name} />

                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {source.name}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {source.visitors} visitors • {source.count.toLocaleString()} views
                            </span>
                          </div>
                          <span
                            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                            style={{ color: config.color, backgroundColor: config.bgColor }}
                          >
                            {source.percentage}%
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{
                                width: `${source.percentage}%`,
                                backgroundColor: config.color,
                                minWidth: source.percentage > 0 ? '4px' : '0'
                              }}
                            />
                          </div>
                          <span className="w-9 text-right text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            #{idx + 1}
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
        <div className="space-y-3 xl:col-span-4">
          {/* Online Now by Source */}
          <div className="rounded-2xl border border-orange-100 bg-white p-3 shadow-[0_18px_48px_-38px_rgba(249,115,22,0.45)] dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                Online by Source
              </h2>
              <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2 py-1 dark:border-orange-500/20 dark:bg-orange-500/10">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-orange-700 dark:text-orange-300">
                  {onlineCount} online
                </span>
              </div>
            </div>

            {Object.keys(onlineBySource).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
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
                      <div
                        key={source}
                        className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-2 transition-colors hover:border-slate-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800/70 dark:hover:border-slate-700"
                      >
                        <SourceAvatar source={source} size="sm" />
                        <span className="flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300">{source}</span>
                        <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{count}</span>
                        <span className="w-8 text-right text-[11px] font-medium text-slate-400">{pct}%</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Active Visitors */}
          <div className="rounded-2xl border border-sky-100 bg-white p-3 shadow-[0_18px_48px_-38px_rgba(37,99,235,0.45)] dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                  Active Visitors
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Latest pages visitors are viewing right now.</p>
              </div>
              <div className="rounded-full border border-sky-100 bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                {onlineVisitors.length}
              </div>
            </div>

            {onlineVisitors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <Users size={32} className="mb-2 opacity-50" />
                <p className="text-xs">No active visitors</p>
              </div>
            ) : (
              <div className="max-h-[280px] space-y-1.5 overflow-y-auto pr-1">
                {onlineVisitors.slice(0, 20).map((visitor, idx) => {
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-2 transition-colors hover:border-slate-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800/70 dark:hover:border-slate-700"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                        <Users size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {visitor.page || '/'}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <SourceAvatar source={visitor.source} size="sm" />
                          <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">{visitor.source}</span>
                        </div>
                      </div>
                      <span className="flex-shrink-0 text-[10px] font-medium text-slate-400 dark:text-slate-500">
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
