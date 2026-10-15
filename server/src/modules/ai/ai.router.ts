import { Router, Request, Response } from 'express';
import { db } from '../../db/client';
import { aiChatRouter } from '../../../../ai/routes/chatHandler';
import { haversineKm } from '../../../../src/server/railwayRoutingEngine';

export const aiRouter = Router();

// Both chat URLs are backed by the same local Virasat AI Astra engine.
aiRouter.use('/', aiChatRouter);

/**
 * POST /api/v1/ai/place-maps-info
 * Uses Virasat place records and regular Maps links.
 */
aiRouter.post('/place-maps-info', async (req: Request, res: Response): Promise<void> => {
  const { place_name, city, state, lat, lng } = req.body || {};
  if (!place_name || typeof place_name !== 'string') {
    res.status(400).json({ success: false, error: 'place_name is required' });
    return;
  }

  const placesResult = await db.places.findAll({ includeAllStatuses: true });
  const normalizedName = place_name.trim().toLowerCase();
  const matched = (placesResult.places || []).find((place: any) => {
    const nameMatches = String(place.name || '').toLowerCase() === normalizedName;
    const placeCity = String(place.city_id || place.city || '').toLowerCase();
    return nameMatches && (!city || placeCity === String(city).toLowerCase());
  });
  const query = [matched?.name || place_name, city || matched?.city_id, state || matched?.state_id, 'India'].filter(Boolean).join(', ');
  const encodedQuery = encodeURIComponent(query);

  res.json({
    success: true,
    place_name,
    verified_title: matched?.name || place_name,
    city: city || matched?.city_id || 'India',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=' + encodedQuery,
    directions_url: 'https://www.google.com/maps/dir/?api=1&destination=' + encodedQuery,
    summary: matched?.summary || matched?.description || 'This place is not in the local Virasat registry yet. Check its location and visitor details with an official source.',
    review_snippets: [],
    registry_match: Boolean(matched),
    coordinates: Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
      ? { lat: Number(lat), lng: Number(lng) }
      : matched && Number.isFinite(Number(matched.lat)) && Number.isFinite(Number(matched.lng))
        ? { lat: Number(matched.lat), lng: Number(matched.lng) }
        : undefined,
  });
});

/**
 * POST /api/v1/ai/heritage-route-analyzer
 * Produces a local distance and time estimate from supplied coordinates.
 */
aiRouter.post('/heritage-route-analyzer', async (req: Request, res: Response): Promise<void> => {
  const { monuments, transport_mode = 'DRIVE', city } = req.body || {};
  if (!Array.isArray(monuments) || monuments.length < 2) {
    res.status(400).json({ success: false, error: 'At least 2 monuments are required to analyze a heritage transit route.' });
    return;
  }

  const validMonuments = monuments.map((item: any, index: number) => ({
    id: String(item.id || 'monument-' + (index + 1)),
    name: String(item.name || 'Place ' + (index + 1)),
    city: String(item.city || city || 'India'),
    lat: Number(item.lat),
    lng: Number(item.lng),
    summary: String(item.summary || ''),
  }));

  if (validMonuments.some((item) => !Number.isFinite(item.lat) || !Number.isFinite(item.lng) || Math.abs(item.lat) > 90 || Math.abs(item.lng) > 180)) {
    res.status(400).json({ success: false, error: 'Every stop needs valid coordinates from the Virasat place record.' });
    return;
  }

  const mode = String(transport_mode).toUpperCase();
  const speeds: Record<string, number> = { WALK: 4.5, TRANSIT: 22, DRIVE: 32 };
  const speed = speeds[mode] || speeds.DRIVE;
  const remaining = [...validMonuments];
  const ordered: typeof validMonuments = [remaining.shift()!];

  while (remaining.length) {
    const current = ordered[ordered.length - 1];
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    for (let index = 0; index < remaining.length; index += 1) {
      const nextDistance = haversineKm(current.lat, current.lng, remaining[index].lat, remaining[index].lng);
      if (nextDistance < nearestDistance) {
        nearestDistance = nextDistance;
        nearestIndex = index;
      }
    }
    ordered.push(remaining.splice(nearestIndex, 1)[0]);
  }

  let totalDistance = 0;
  let totalMinutes = 0;
  const segments = ordered.slice(0, -1).map((from, index) => {
    const to = ordered[index + 1];
    const distance = Math.round(haversineKm(from.lat, from.lng, to.lat, to.lng) * 1.25 * 10) / 10;
    const minutes = Math.max(8, Math.round((distance / speed) * 60));
    totalDistance += distance;
    totalMinutes += minutes;
    return {
      segment_index: index + 1,
      from_stop_id: from.id,
      from_name: from.name,
      to_stop_id: to.id,
      to_name: to.name,
      distance_km: distance,
      travel_time_minutes: minutes,
      recommended_mode: mode === 'WALK' ? 'Walking estimate' : mode === 'TRANSIT' ? 'Public transit estimate' : 'Road transfer estimate',
      transit_tip: 'This is a coordinate-based estimate. Confirm the street route and current conditions in Maps before traveling.',
      historical_significance: 'Historical interpretation is not generated from route coordinates.',
      architectural_transition: 'See each place record for verified architectural details.',
      notable_landmarks_en_route: [],
    };
  });

  const orderedStops = ordered.map((item, index) => ({
    stop_order: index + 1,
    id: item.id,
    name: item.name,
    lat: item.lat,
    lng: item.lng,
    visit_duration_minutes: 60,
    historical_era: '',
    key_highlight: item.summary,
  }));

  res.json({
    success: true,
    circuit_title: (city || 'Heritage') + ' route estimate',
    narrative_theme: 'Stops are ordered by nearest coordinate; this local route estimate does not include live traffic or road-network routing.',
    total_distance_km: Math.round(totalDistance * 10) / 10,
    total_transit_minutes: totalMinutes,
    total_recommended_hours: Math.round((totalMinutes / 60 + ordered.length) * 10) / 10,
    ordered_stops: orderedStops,
    segments,
    expert_recommendation: 'Verify opening hours and the final route with the site operator and a current map before departure.',
    estimate_only: true,
  });
});

/**
 * Photo recognition requires a vision model, which is not part of the local engine.
 */
aiRouter.post('/visual-identify', async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    feature_available: false,
    error: 'Photo recognition is unavailable in this local build. Search for the monument by name in Discover Bharat to open its Virasat record.',
    browse_url: '/explore',
  });
});

/**
 * GET /api/v1/ai/sessions
 */
aiRouter.get('/sessions', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.json({ success: true, total: 0, data: [] });
    return;
  }
  const sessions = await db.aiSessions.findByUser(userId);
  res.json({ success: true, total: sessions.length, data: sessions });
});

/**
 * GET /api/v1/ai/sessions/:id
 */
aiRouter.get('/sessions/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, error: 'Sign in to view saved assistant conversations.' });
    return;
  }
  const session = await db.aiSessions.findById(req.params.id);
  if (!session || session.user_id !== userId) {
    res.status(404).json({ success: false, error: 'Session not found' });
    return;
  }

  const messages = await db.aiMessages.findBySession(session.id);
  const groundings = await db.aiGroundings.findBySession(session.id);
  res.json({ success: true, data: { session, messages, groundings } });
});
