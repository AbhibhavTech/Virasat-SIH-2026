/**
 * Virasat Privacy-First Analytics Telemetry Service
 *
 * Implements non-invasive, anonymous telemetry tracking without capturing PII.
 * Uses navigator.sendBeacon when available with non-blocking fetch fallback.
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'search_query'
  | 'route_calculated'
  | 'itinerary_created'
  | 'place_viewed'
  | '3d_viewed'
  | 'feedback_submitted';

export interface AnalyticsEvent {
  event_type: AnalyticsEventType;
  path?: string;
  session_id?: string;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsSummary {
  status: string;
  timestamp: string;
  platform_metrics: {
    total_verified_places: number;
    total_stewardship_reports: number;
    total_itineraries_saved: number;
    total_telemetry_events: number;
    ai_grounding_compliance_rate: number;
  };
  event_breakdown: Record<string, number>;
  popular_searches: Array<{ query: string; count: number }>;
  top_destinations: Array<{ place_id: string; name: string; city: string; count: number }>;
  transit_telemetry: {
    routes_computed: number;
    itineraries_planned: number;
  };
}

class AnalyticsService {
  private sessionId: string;
  private endpoint = '/api/v1/analytics/event';

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server_session';
    try {
      let id = sessionStorage.getItem('virasat_session_id');
      if (!id) {
        id = `s_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
        sessionStorage.setItem('virasat_session_id', id);
      }
      return id;
    } catch {
      return `s_${Math.random().toString(36).slice(2, 10)}`;
    }
  }

  /**
   * Dispatches an event to the backend telemetry router asynchronously.
   */
  public trackEvent(
    eventType: AnalyticsEventType,
    metadata?: Record<string, unknown>,
    path?: string
  ): void {
    if (typeof window === 'undefined') return;

    const payload: AnalyticsEvent = {
      event_type: eventType,
      path: path || window.location.pathname,
      session_id: this.sessionId,
      metadata: metadata || {},
    };

    const jsonPayload = JSON.stringify(payload);

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([jsonPayload], { type: 'application/json' });
        navigator.sendBeacon(this.endpoint, blob);
      } else {
        fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: jsonPayload,
          keepalive: true,
        }).catch(() => {
          // Non-blocking telemetry; silently absorb network anomalies
        });
      }
    } catch {
      // Absorb errors to never crash client rendering
    }
  }

  public trackPageView(path: string, title?: string): void {
    this.trackEvent('page_view', { title: title || (typeof document !== 'undefined' ? document.title : '') }, path);
  }

  public trackSearch(query: string, resultCount?: number): void {
    this.trackEvent('search_query', { query, result_count: resultCount });
  }

  public trackPlaceView(placeId: string, placeName?: string, city?: string): void {
    this.trackEvent('place_viewed', { place_id: placeId, name: placeName, city });
  }

  public trackRouteCalculation(from: string, to: string, mode?: string): void {
    this.trackEvent('route_calculated', { from, to, mode });
  }

  public trackItineraryCreation(destination: string, days?: number): void {
    this.trackEvent('itinerary_created', { destination, days });
  }

  public track3DView(monumentId: string): void {
    this.trackEvent('3d_viewed', { monument_id: monumentId });
  }

  /**
   * Fetches real-time telemetry summary from backend for dashboard / judges.
   */
  public async getSummary(): Promise<AnalyticsSummary | null> {
    try {
      const res = await fetch('/api/v1/analytics/summary');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}

export const analytics = new AnalyticsService();
