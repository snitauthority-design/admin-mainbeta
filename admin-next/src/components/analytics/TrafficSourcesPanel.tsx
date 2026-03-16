import React from 'react';
import { ExternalLink, Globe, MousePointerClick, Search, ShoppingCart } from 'lucide-react';
import { getSourceConfig, TrafficSourceAvatar } from './TrafficSourceAvatar';
import type { TrafficSource, TrafficSourceDetails } from './types';

interface TrafficSourcesPanelProps {
  sources: TrafficSource[];
  selectedSourceName: string | null;
  details: TrafficSourceDetails | null;
  detailsLoading: boolean;
  onSourceSelect: (sourceName: string) => void;
  formatTimeAgo: (value: string) => string;
}

const DetailListCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  emptyLabel: string;
  children: React.ReactNode;
}> = ({ title, icon, emptyLabel, children }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/70">
    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
      {icon}
      <span>{title}</span>
    </div>
    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">{children || <p className="text-xs text-slate-400">{emptyLabel}</p>}</div>
  </div>
);

export const TrafficSourcesPanel: React.FC<TrafficSourcesPanelProps> = ({
  sources,
  selectedSourceName,
  details,
  detailsLoading,
  onSourceSelect,
  formatTimeAgo
}) => {
  const selectedSourceConfig = details ? getSourceConfig(details.source) : null;

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-3 shadow-[0_18px_48px_-38px_rgba(37,99,235,0.45)] dark:border-slate-700 dark:bg-slate-900 xl:col-span-8">
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">Traffic Sources</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click a source to review the persisted visitor history, search behavior, product interest, and checkout paths.
          </p>
        </div>
        <div className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
          {sources.length} sources
        </div>
      </div>

      {sources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <Globe size={40} className="mb-3 opacity-50" />
          <p className="text-sm">No visitor data yet</p>
          <p className="mt-1 text-xs">Traffic sources will appear as visitors arrive</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {sources.map((source, idx) => {
              const config = getSourceConfig(source.name);
              const isSelected = source.name === selectedSourceName;

              return (
                <button
                  key={source.name}
                  type="button"
                  onClick={() => onSourceSelect(source.name)}
                  className={`w-full rounded-2xl border p-2.5 text-left transition-all ${
                    isSelected
                      ? 'border-sky-300 bg-sky-50/80 shadow-[0_18px_40px_-36px_rgba(37,99,235,0.65)] dark:border-sky-500/40 dark:bg-sky-500/10'
                      : 'border-slate-100 bg-slate-50/80 hover:border-slate-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800/70 dark:hover:border-slate-700 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TrafficSourceAvatar source={source.name} />

                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{source.name}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {source.visitors} visitors • {source.count.toLocaleString()} views
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                            style={{ color: config.color, backgroundColor: config.bgColor }}
                          >
                            {source.percentage}%
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                            {isSelected ? 'selected' : `#${idx + 1}`}
                          </span>
                        </div>
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
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-orange-50/70 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-orange-500/5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: selectedSourceConfig?.bgColor || 'rgba(148, 163, 184, 0.14)' }}
                >
                  {details ? <TrafficSourceAvatar source={details.source} size="lg" /> : <Globe size={18} className="text-slate-500" />}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Persisted details</p>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {details?.source || selectedSourceName || 'Choose a traffic source'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Historical data stays available here even after visitors leave the site.
                  </p>
                </div>
              </div>

              {details && (
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/80 bg-white/80 p-2 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{details.visitors}</div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Visitors</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{details.views}</div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Views</div>
                  </div>
                </div>
              )}
            </div>

            {detailsLoading ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="rounded-2xl border border-slate-100 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/70">
                    <div className="mb-3 h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="space-y-2">
                      {[1, 2, 3].map(row => (
                        <div key={row} className="h-3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : details ? (
              <div className="grid gap-3 lg:grid-cols-2">
                <DetailListCard title="Top Referrers" icon={<ExternalLink size={16} className="text-sky-500" />} emptyLabel="No referrer URLs recorded for this source yet.">
                  {details.topReferrers.length ? (
                    details.topReferrers.map(referrer => (
                      <div key={referrer.referrer} className="flex items-start justify-between gap-3 rounded-2xl bg-white/80 px-3 py-2 dark:bg-slate-900/70">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">{referrer.referrer}</div>
                        </div>
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                          {referrer.count}
                        </span>
                      </div>
                    ))
                  ) : null}
                </DetailListCard>

                <DetailListCard title="Product Clicks" icon={<MousePointerClick size={16} className="text-orange-500" />} emptyLabel="No product detail visits were recorded for this source in the selected period.">
                  {details.topProducts.length ? (
                    details.topProducts.map(product => (
                      <div key={product.page} className="rounded-2xl bg-white/80 px-3 py-2 dark:bg-slate-900/70">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate font-medium text-slate-800 dark:text-slate-100">{product.productLabel}</div>
                            <div className="truncate text-[11px] text-slate-400">{product.page}</div>
                          </div>
                          <span className="text-xs font-semibold text-orange-600 dark:text-orange-300">{product.views} views</span>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{product.visitors} visitors clicked this product</div>
                      </div>
                    ))
                  ) : null}
                </DetailListCard>

                <DetailListCard title="Search Terms" icon={<Search size={16} className="text-emerald-500" />} emptyLabel="Search queries will appear here after visitors use the storefront search bar.">
                  {details.recentSearches.length ? (
                    details.recentSearches.map(search => (
                      <div key={`${search.query}-${search.lastSeen}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 px-3 py-2 dark:bg-slate-900/70">
                        <div className="min-w-0">
                          <div className="truncate font-medium text-slate-800 dark:text-slate-100">{search.query}</div>
                          <div className="text-[11px] text-slate-400">Last seen {formatTimeAgo(search.lastSeen)}</div>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          {search.count}
                        </span>
                      </div>
                    ))
                  ) : null}
                </DetailListCard>

                <DetailListCard title="Checkout Journeys" icon={<ShoppingCart size={16} className="text-violet-500" />} emptyLabel="Checkout transitions from products will appear here as visitors move into checkout.">
                  {details.checkoutJourneys.length ? (
                    details.checkoutJourneys.map(journey => (
                      <div key={`${journey.productPage}-${journey.lastSeen}`} className="rounded-2xl bg-white/80 px-3 py-2 dark:bg-slate-900/70">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate font-medium text-slate-800 dark:text-slate-100">{journey.productLabel}</div>
                            <div className="truncate text-[11px] text-slate-400">{journey.productPage}</div>
                          </div>
                          <span className="text-xs font-semibold text-violet-600 dark:text-violet-300">{journey.count} starts</span>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          {journey.visitors} visitors • last seen {formatTimeAgo(journey.lastSeen)}
                        </div>
                      </div>
                    ))
                  ) : null}
                </DetailListCard>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 lg:col-span-2 dark:border-slate-800 dark:bg-slate-800/70">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Globe size={16} className="text-slate-500" />
                    <span>Recent Visitors</span>
                  </div>
                  {details.recentVisitors.length ? (
                    <div className="grid gap-2 md:grid-cols-2">
                      {details.recentVisitors.map(visitor => (
                        <div key={`${visitor.visitorId}-${visitor.lastSeen}`} className="rounded-2xl bg-white/80 px-3 py-2 dark:bg-slate-900/70">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate font-medium text-slate-800 dark:text-slate-100">{visitor.lastPage || '/'}</div>
                              <div className="truncate text-[11px] text-slate-400">
                                {visitor.pageViews} views • first seen {formatTimeAgo(visitor.firstSeen)}
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{formatTimeAgo(visitor.lastSeen)}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {visitor.pages.slice(0, 4).map(page => (
                              <span
                                key={`${visitor.visitorId}-${page}`}
                                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {page}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Recent visitor activity will show here when data becomes available.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400 dark:border-slate-700">
                Select a traffic source to inspect its historical visitor behavior.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
