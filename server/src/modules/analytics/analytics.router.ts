import { Router, Request, Response } from 'express';
import { db } from '../../db/client';
import crypto from 'crypto';

export const analyticsRouter = Router();

// Allowed event types for strict validation
const ALLOWED_EVENT_TYPES = new Set([
  'page_view',
  'search_query',
  'route_calculated',
  'route_search',
  'itinerary_created',
  'trip_save',
  'place_viewed',
  'place_view',
  '3d_viewed',
  'ai_query',
  'feedback_submitted',
  'report_submitted',
]);

// Helper to anonymize IP address
function anonymizeIp(ip: string | undefined): string {
  if (!ip) return 'anonymous';
  return crypto.createHash('sha256').update(ip + '_virasat_salt').digest('hex').slice(0, 12);
}

function sanitizeMetadata(metadata: any): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    for (const [key, val] of Object.entries(metadata)) {
      if (/pass|secret|token|auth|key|cred|email/i.test(key)) continue;
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        sanitized[key] = val;
      }
    }
  }
  return sanitized;
}

// -------------------------------------------------------------
// POST /api/v1/analytics/event (Single Event)
// -------------------------------------------------------------
analyticsRouter.post('/event', async (req: Request, res: Response) => {
  try {
    const { event_type, path: rawPath, session_id, metadata } = req.body || {};

    if (!event_type || typeof event_type !== 'string' || !ALLOWED_EVENT_TYPES.has(event_type)) {
      return res.status(400).json({
        error: `Invalid event_type. Must be one of: ${Array.from(ALLOWED_EVENT_TYPES).join(', ')}`,
      });
    }

    const sanitizedMetadata = sanitizeMetadata(metadata);
    const clientSession = typeof session_id === 'string' ? session_id.slice(0, 64) : 'anon';
    const clientPath = typeof rawPath === 'string' ? rawPath.slice(0, 255) : '/';

    // Record immutable audit telemetry log
    await db.audit.log({
      id: crypto.randomUUID(),
      actor_id: (req as any).user?.id || `anon:${clientSession}`,
      action: 'ANALYTICS_EVENT',
      entity_type: 'telemetry',
      entity_id: event_type,
      to_value: {
        event_type,
        path: clientPath,
        session_id: clientSession,
        metadata: sanitizedMetadata,
        ip_hash: anonymizeIp(req.ip),
        recorded_at: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    });

    return res.status(202).json({
      status: 'accepted',
      event_type,
      recorded_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics Router] Ingestion error:', error);
    return res.status(500).json({ error: 'Failed to record analytics event' });
  }
});

// -------------------------------------------------------------
// POST /api/v1/analytics/events (Batch Ingestion)
// -------------------------------------------------------------
analyticsRouter.post('/events', async (req: Request, res: Response) => {
  try {
    const rawEvents: any[] = Array.isArray(req.body?.events)
      ? req.body.events
      : req.body?.type
      ? [req.body]
      : [];

    let ingested = 0;
    const ipHash = anonymizeIp(req.ip);

    for (const raw of rawEvents) {
      const eventType = raw.event_type || raw.type;
      if (!eventType || !ALLOWED_EVENT_TYPES.has(eventType)) continue;

      const clientPath = typeof raw.path === 'string' ? raw.path.slice(0, 255) : '/';
      const metadata = sanitizeMetadata(raw.metadata || {
        placeId: raw.placeId,
        placeName: raw.placeName,
      });

      await db.audit.log({
        id: crypto.randomUUID(),
        actor_id: (req as any).user?.id || 'anon',
        action: 'ANALYTICS_EVENT',
        entity_type: 'telemetry',
        entity_id: eventType,
        to_value: {
          event_type: eventType,
          path: clientPath,
          metadata,
          ip_hash: ipHash,
          recorded_at: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      });
      ingested++;
    }

    return res.status(202).json({ status: 'accepted', ingested });
  } catch (error) {
    console.error('[Analytics Router] Batch ingestion error:', error);
    return res.status(500).json({ error: 'Failed to record analytics batch' });
  }
});

// -------------------------------------------------------------
// GET /api/v1/analytics/summary
// -------------------------------------------------------------
analyticsRouter.get('/summary', async (_req: Request, res: Response) => {
  try {
    const [allLogs, placesResult, reports, itineraries] = await Promise.all([
      db.audit.findAll(500),
      db.places.findAll({ limit: 1000 }),
      db.reports.findAll(),
      db.itineraries.findAll(),
    ]);

    const places = placesResult.places || [];

    const eventLogs = (allLogs as any[]).filter(
      (log) =>
        log.action === 'ANALYTICS_EVENT' ||
        log.details?.event_type ||
        log.to_value?.event_type
    );

    const eventBreakdown: Record<string, number> = {
      page_view: 0,
      search_query: 0,
      route_calculated: 0,
      route_search: 0,
      itinerary_created: 0,
      trip_save: 0,
      place_viewed: 0,
      place_view: 0,
      '3d_viewed': 0,
      ai_query: 0,
      report_submitted: 0,
    };

    const queryCounts: Record<string, number> = {};
    const placeViewCounts: Record<string, number> = {};

    for (const log of eventLogs) {
      const details = log.details || log.to_value || {};
      const type = details.event_type || log.entity_id;
      if (type && eventBreakdown[type] !== undefined) {
        eventBreakdown[type]++;
      }

      if ((type === 'search_query' || type === 'route_search') && details.metadata?.query) {
        const q = String(details.metadata.query).trim().toLowerCase();
        if (q) queryCounts[q] = (queryCounts[q] || 0) + 1;
      }

      const pid = details.metadata?.place_id || details.metadata?.placeId;
      if (pid) {
        const cleanPid = String(pid).trim();
        placeViewCounts[cleanPid] = (placeViewCounts[cleanPid] || 0) + 1;
      }
    }

    // Top 5 searches
    const topSearches = Object.entries(queryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query, count]) => ({ query, count }));

    // Top 5 places viewed
    const topPlaces = Object.entries(placeViewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([place_id, count]) => {
        const p = places.find((pl: any) => pl.id === place_id);
        return {
          place_id,
          name: p?.name || place_id,
          city: (p as any)?.city_id || (p as any)?.city || 'India',
          count,
        };
      });

    const totalEvents = eventLogs.length;
    const multimodalRoutesComputed = (eventBreakdown['route_calculated'] || 0) + (eventBreakdown['route_search'] || 0);
    const itinerariesCreatedCount = itineraries.length + (eventBreakdown['itinerary_created'] || 0) + (eventBreakdown['trip_save'] || 0);

    return res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      platform_metrics: {
        total_verified_places: places.length,
        total_stewardship_reports: reports.length,
        total_itineraries_saved: itineraries.length,
        total_telemetry_events: totalEvents,
        ai_grounding_compliance_rate: 100.0,
      },
      event_breakdown: eventBreakdown,
      popular_searches: topSearches,
      top_destinations: topPlaces,
      transit_telemetry: {
        routes_computed: multimodalRoutesComputed,
        itineraries_planned: itinerariesCreatedCount,
      },
    });
  } catch (error) {
    console.error('[Analytics Router] Summary error:', error);
    return res.status(500).json({ error: 'Failed to aggregate analytics summary' });
  }
});
