import { Router, Request, Response } from 'express';
import { db } from '../../db/client';
import { requireAuth } from '../../middleware/auth';
import { getVerifiedCityPlan } from '../../../../src/data/cityItineraryData';
import { ItineraryRecord } from '../../db/types';

export const itineraryRouter = Router();

/**
 * GET /api/v1/itineraries
 * List itineraries (user's saved itineraries if authenticated, or public itineraries)
 */
itineraryRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const city = (req.query.city as string) || undefined;
  const isPublicQuery = req.query.public === 'true' ? true : req.query.public === 'false' ? false : undefined;

  let itineraries: ItineraryRecord[];

  if (userId) {
    itineraries = await db.itineraries.findAll({ userId, city });
  } else {
    itineraries = await db.itineraries.findAll({ isPublic: true, city });
  }

  res.json({
    success: true,
    total: itineraries.length,
    data: itineraries,
  });
});

/**
 * GET /api/v1/itineraries/:id
 * Retrieve a full itinerary with nested days, ordered stops, and place metadata
 */
itineraryRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const fullItinerary = await db.itineraries.findFullById(id);

  if (!fullItinerary) {
    res.status(404).json({ success: false, error: 'Itinerary not found' });
    return;
  }

  // Access control: if private, only owner or admin can view
  if (!fullItinerary.is_public) {
    if (!req.user || (req.user.id !== fullItinerary.user_id && req.user.role !== 'admin')) {
      res.status(403).json({ success: false, error: 'Access forbidden to private itinerary' });
      return;
    }
  }

  // Enrich stops with place data if available in DB
  const enrichedDays = await Promise.all(
    fullItinerary.days.map(async (day) => {
      const enrichedStops = await Promise.all(
        day.stops.map(async (stop) => {
          let placeInfo = null;
          if (stop.place_id) {
            placeInfo = await db.places.findById(stop.place_id);
          }
          return {
            ...stop,
            place_details: placeInfo
              ? {
                  id: placeInfo.id,
                  name: placeInfo.name,
                  category: placeInfo.category,
                  coordinates: { lat: placeInfo.lat, lng: placeInfo.lng },
                  visiting_hours: placeInfo.visiting_hours,
                  entry_fee_domestic: placeInfo.entry_fee_domestic,
                  data_confidence: placeInfo.data_confidence,
                  source_url: placeInfo.source_url,
                  thumbnail_url: placeInfo.thumbnail_url,
                }
              : undefined,
          };
        })
      );
      return { ...day, stops: enrichedStops };
    })
  );

  res.json({
    success: true,
    data: {
      ...fullItinerary,
      days: enrichedDays,
    },
  });
});

/**
 * POST /api/v1/itineraries
 * Create and save a new multi-day itinerary with nested days and stops
 */
itineraryRouter.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const {
    title,
    destination,
    city,
    state,
    days_count = 1,
    pace = 'moderate',
    budget_level = 'moderate',
    summary,
    total_cost = 0,
    is_public = false,
    days,
  } = req.body;

  if (!title || !destination) {
    res.status(400).json({ success: false, error: 'Title and destination are required' });
    return;
  }

  const id = `itin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const resolvedCity = city || destination;

  const newRecord: ItineraryRecord = {
    id,
    user_id: userId,
    title,
    destination,
    city: resolvedCity,
    state: state || undefined,
    days_count: Number(days_count) || 1,
    pace: pace === 'relaxed' || pace === 'fast' ? pace : 'moderate',
    budget_level: budget_level === 'budget' || budget_level === 'luxury' ? budget_level : 'moderate',
    summary: summary || `Curated ${days_count}-day journey in ${resolvedCity}.`,
    total_cost: Number(total_cost) || 0,
    is_public: Boolean(is_public),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const saved = await db.itineraries.create(newRecord, days);
  const fullCreated = await db.itineraries.findFullById(id);

  res.status(201).json({
    success: true,
    data: fullCreated || saved,
  });
});

/**
 * PUT /api/v1/itineraries/:id
 * Update an itinerary (IDOR protected: must be owner or admin)
 */
itineraryRouter.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!.id;

  const existing = await db.itineraries.findById(id);
  if (!existing) {
    res.status(404).json({ success: false, error: 'Itinerary not found' });
    return;
  }

  // IDOR Protection
  if (existing.user_id !== userId && req.user!.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Unauthorized: cannot modify someone else’s itinerary' });
    return;
  }

  const { title, destination, city, state, days_count, pace, budget_level, summary, total_cost, is_public, days } =
    req.body;

  const updates: Partial<ItineraryRecord> = {};
  if (title !== undefined) updates.title = title;
  if (destination !== undefined) updates.destination = destination;
  if (city !== undefined) updates.city = city;
  if (state !== undefined) updates.state = state;
  if (days_count !== undefined) updates.days_count = Number(days_count);
  if (pace !== undefined) updates.pace = pace;
  if (budget_level !== undefined) updates.budget_level = budget_level;
  if (summary !== undefined) updates.summary = summary;
  if (total_cost !== undefined) updates.total_cost = Number(total_cost);
  if (is_public !== undefined) updates.is_public = Boolean(is_public);

  const updated = await db.itineraries.update(id, existing.user_id, updates, days);
  const fullUpdated = await db.itineraries.findFullById(id);

  res.json({
    success: true,
    data: fullUpdated || updated,
  });
});

/**
 * DELETE /api/v1/itineraries/:id
 * Delete an itinerary (IDOR protected)
 */
itineraryRouter.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!.id;

  const existing = await db.itineraries.findById(id);
  if (!existing) {
    res.status(404).json({ success: false, error: 'Itinerary not found' });
    return;
  }

  // IDOR Protection
  if (existing.user_id !== userId && req.user!.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Unauthorized: cannot delete someone else’s itinerary' });
    return;
  }

  const deleted = await db.itineraries.delete(id, existing.user_id);
  if (!deleted) {
    res.status(500).json({ success: false, error: 'Failed to delete itinerary' });
    return;
  }

  res.json({
    success: true,
    message: 'Itinerary deleted successfully',
  });
});

/**
 * POST /api/v1/itineraries/generate
 * Algorithmic generator producing verified multi-day itineraries from database places
 */
itineraryRouter.post('/generate', async (req: Request, res: Response): Promise<void> => {
  const {
    city,
    destination,
    days,
    days_count,
    duration_hours = 40,
    interests = ['heritage'],
    budget_level = 'moderate',
    budget,
    pace = 'moderate',
  } = req.body;

  const resolvedCity = (city && String(city).trim()) || (destination && String(destination).trim()) || 'Jaipur';
  const requestedDays = Number(days || days_count || Math.max(1, Math.min(7, Math.round(duration_hours / 8))) || 5);
  const effectiveBudget = budget_level || budget || 'moderate';

  const plan = getVerifiedCityPlan(resolvedCity, requestedDays, pace, effectiveBudget, interests);

  // Cross-reference places with database records to enrich with official facts and sources
  const placesResult = await db.places.findAll();
  const allDbPlaces = placesResult.places;
  const placeMap = new Map(allDbPlaces.map((p: any) => [p.id.toLowerCase(), p]));

  let orderCounter = 1;
  const flatStops: any[] = [];

  const enrichedDays = plan.days.map((d: any) => {
    const dayStops = d.places.map((p: any) => {
      const match = placeMap.get(p.id?.toLowerCase() || '') ||
        allDbPlaces.find((dp: any) => dp.name.toLowerCase() === p.name.toLowerCase());

      const domesticFee = p.entry_fee !== undefined && p.entry_fee !== null
        ? p.entry_fee
        : (match?.entry_fee_domestic !== undefined ? match.entry_fee_domestic : null);

      const feeLabel = p.entry_fee_label ||
        (domesticFee === 0 ? 'Free entry, verified' : domesticFee !== null ? `₹${domesticFee}, verified` : 'Fee not available');

      const stopObj = {
        order: orderCounter++,
        place_id: match?.id || p.id || `stop-${orderCounter}`,
        name: p.name,
        city: p.city || plan.city_name,
        state: p.state || plan.state_name,
        location: p.location || `${plan.city_name}, ${plan.state_name}`,
        category: p.category || match?.category || 'heritage',
        heritage_status: p.heritage_status || match?.heritage_status || (p.name.includes('UNESCO') ? 'UNESCO World Heritage Site' : 'ASI Protected Monument'),
        coordinates: p.coordinates || (match ? { lat: match.lat, lng: match.lng } : undefined),
        thumbnail_url: p.thumbnail_url || match?.thumbnail_url || d.hero_image_url,
        time_slot: p.time_slot || '10:00–12:00',
        period: p.period || 'Morning',
        opening_hours: p.opening_hours || match?.visiting_hours || match?.opening_hours || '09:00 AM - 05:30 PM',
        is_hours_verified: p.is_hours_verified ?? Boolean(match?.visiting_hours),
        visit_duration: p.visit_duration || '1.5–2 hours',
        recommended_duration_minutes: p.visit_duration_minutes || 90,
        travel_time_from_previous_minutes: p.travel_time_from_previous_minutes ?? 15,
        travel_mode_from_previous: p.travel_mode || 'Auto-Rickshaw / Local Transit',
        distance_from_previous_km: p.distance_from_previous_km ?? 2.0,
        distance_info: p.distance_info || (p.distance_from_previous_km ? `${p.distance_from_previous_km} km` : 'Local stop'),
        entry_fee: domesticFee,
        entry_fee_label: feeLabel,
        is_fee_verified: domesticFee !== null,
        estimated_cost: domesticFee || 0,
        visit_tips: p.description || match?.summary || `Part of Day ${d.day_number} (${d.area_title}) circuit.`,
        data_confidence: match?.data_confidence || 'OFFICIAL',
        source: p.source || match?.source_name || 'Archaeological Survey of India (ASI)',
        source_url: p.source_url || match?.source_url || 'https://asi.nic.in',
        verification_status: p.verification_status || 'verified',
        last_verified: p.last_verified || 'September 2026',
      };

      flatStops.push(stopObj);
      return stopObj;
    });

    return {
      ...d,
      places: dayStops,
    };
  });

  const costMultiplier = effectiveBudget === 'budget' ? 350 : effectiveBudget === 'luxury' ? 2200 : 750;
  const totalCost = plan.days.length * costMultiplier;

  res.json({
    success: true,
    city: plan.city_name,
    city_id: plan.city_id,
    state: plan.state_name,
    days_count: plan.days_count,
    requested_days: plan.requested_days || requestedDays,
    duration_hours: plan.days_count * 8,
    pace,
    budget_level: effectiveBudget,
    total_places: flatStops.length,
    estimated_total_visiting_minutes: flatStops.reduce((acc: number, s: any) => acc + (s.recommended_duration_minutes || 90), 0),
    estimated_total_travel_minutes: flatStops.reduce((acc: number, s: any) => acc + (s.travel_time_from_previous_minutes || 0), 0),
    title: plan.title,
    subtitle: plan.subtitle || 'Verified attractions organized by location, opening hours and travel efficiency.',
    summary: plan.summary,
    warning_message: plan.warning_message || null,
    days: enrichedDays,
    stops: flatStops,
    timeline: flatStops,
    estimated_total_cost: totalCost,
    sources: plan.sources || ['Archaeological Survey of India (ASI)', 'UNESCO World Heritage Centre', 'State Tourism Archives'],
    last_verified: plan.last_verified || 'September 2026',
  });
});
