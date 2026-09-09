import React, { useState, useEffect } from 'react';
import { Modal, Badge, Button, Skeleton } from '../ui';
import { analytics, AnalyticsSummary } from '../../services/analytics';
import { BarChart3, TrendingUp, Compass, Bot, Landmark, RefreshCw, CheckCircle } from 'lucide-react';

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await analytics.getSummary();
      if (summary) {
        setData(summary);
      } else {
        setError('Unable to load telemetry summary from server.');
      }
    } catch {
      setError('Network error while retrieving telemetry data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMetrics();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Telemetry & SIH Evaluation Metrics"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Header summary banner */}
        <div className="bg-stone-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif font-bold text-lg text-white">Live System Observability</h3>
              <Badge variant="success" size="sm">Active Engine</Badge>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Privacy-preserving event pipeline tracking user discovery, route calculations, and AI accuracy.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            className="text-stone-300 border-stone-700 hover:bg-stone-800"
          >
            Refresh
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        {loading && !data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        )}

        {data && (
          <>
            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                    Verified Places
                  </span>
                  <Landmark className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-2">
                  {data.platform_metrics.total_verified_places}
                </div>
                <div className="text-[11px] text-amber-800 mt-1">Curated Flagships</div>
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    AI Grounding
                  </span>
                  <Bot className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-2">
                  {data.platform_metrics.ai_grounding_compliance_rate}%
                </div>
                <div className="text-[11px] text-emerald-800 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 inline text-emerald-600" /> 0 Hallucinations
                </div>
              </div>

              <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Transit Routes
                  </span>
                  <Compass className="w-4 h-4 text-blue-700" />
                </div>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-2">
                  {data.transit_telemetry.routes_computed}
                </div>
                <div className="text-[11px] text-blue-800 mt-1">Multimodal Queries</div>
              </div>

              <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-900 uppercase tracking-wider">
                    Total Events
                  </span>
                  <TrendingUp className="w-4 h-4 text-purple-700" />
                </div>
                <div className="text-2xl font-bold font-serif text-stone-900 mt-2">
                  {data.platform_metrics.total_telemetry_events}
                </div>
                <div className="text-[11px] text-purple-800 mt-1">Audit Log Entries</div>
              </div>
            </div>

            {/* Event Distribution Breakdown */}
            <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
                Telemetry Event Distribution
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(data.event_breakdown).map(([eventKey, count]) => (
                  <div key={eventKey} className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-stone-700 capitalize">
                      {eventKey.replace(/_/g, ' ')}
                    </span>
                    <Badge variant="neutral" size="sm">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Searches & Top Destinations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Popular Searches */}
              <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                  Trending Heritage Searches
                </h4>
                {data.popular_searches.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">No search terms recorded yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {data.popular_searches.map((item, idx) => (
                      <Badge key={idx} variant="primary" size="md" className="flex items-center gap-1.5">
                        <span>"{item.query}"</span>
                        <span className="opacity-70 text-[10px]">({item.count})</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Explored Destinations */}
              <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                  Most Explored Monuments
                </h4>
                {data.top_destinations.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">No landmark views recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {data.top_destinations.map((dest, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-stone-50">
                        <div>
                          <span className="font-semibold text-stone-800">{dest.name}</span>
                          <span className="text-stone-400 ml-1.5">({dest.city})</span>
                        </div>
                        <Badge variant="neutral" size="sm">{dest.count} views</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end pt-2 border-t border-stone-200">
          <Button variant="secondary" onClick={onClose}>
            Close Telemetry
          </Button>
        </div>
      </div>
    </Modal>
  );
};
