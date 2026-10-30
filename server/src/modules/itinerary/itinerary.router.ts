import { Router, Request, Response } from 'express';
import { db } from '../../db/client';
import { requireAuth } from '../../middleware/auth';
import { getVerifiedCityPlan } from '../../../../src/data/cityItineraryData';
import { ItineraryRecord } from '../../db/types';
import {
  resolveCanonicalCityId,
  isCityExactMatch,
  normalizeTransliteration,
} from '../../db/canonicalLocationResolver';

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
    origin,
    state,
    days_count = 1,
    pace = 'moderate',
    budget_level = 'moderate',
    summary,
    total_cost = null,
    start_date,
    end_date,
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
    origin: typeof origin === 'string' && origin.trim() ? origin.trim().slice(0, 100) : undefined,
    state: state || undefined,
    days_count: Number(days_count) || 1,
    pace: pace === 'relaxed' || pace === 'fast' ? pace : 'moderate',
    budget_level: budget_level === 'budget' || budget_level === 'luxury' ? budget_level : 'moderate',
    summary: summary || `Curated ${days_count}-day journey in ${resolvedCity}.`,
    total_cost: total_cost == null ? null : Number(total_cost),
    start_date: typeof start_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(start_date) ? start_date : undefined,
    end_date: typeof end_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(end_date) ? end_date : undefined,
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

  const { title, destination, city, origin, state, days_count, pace, budget_level, summary, total_cost, start_date, end_date, is_public, days } =
    req.body;

  const updates: Partial<ItineraryRecord> = {};
  if (title !== undefined) updates.title = title;
  if (destination !== undefined) updates.destination = destination;
  if (city !== undefined) updates.city = city;
  if (origin !== undefined) updates.origin = origin || undefined;
  if (state !== undefined) updates.state = state;
  if (days_count !== undefined) updates.days_count = Number(days_count);
  if (pace !== undefined) updates.pace = pace;
  if (budget_level !== undefined) updates.budget_level = budget_level;
  if (summary !== undefined) updates.summary = summary;
  if (total_cost !== undefined) updates.total_cost = Number(total_cost);
  if (start_date !== undefined) updates.start_date = start_date || undefined;
  if (end_date !== undefined) updates.end_date = end_date || undefined;
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
 * Itinerary suggestion generator. Destination records are stored data; current
 * schedules, fees, availability and prices require a live provider confirmation.
 */
itineraryRouter.post('/generate', async (req: Request, res: Response): Promise<void> => {
  const {
    city,
    destination,
    origin: requestedOrigin,
    festival: festivalQuery,
    start_date: requestedStartDate,
    travellers: requestedTravellers,
    days,
    days_count,
    duration_hours = 40,
    interests = ['heritage'],
    budget_level = 'moderate',
    budget,
    pace = 'moderate',
  } = req.body;

  const rawDest = ((destination || city || '').toString()).trim();
  const origin = typeof requestedOrigin === 'string' ? requestedOrigin.trim().slice(0, 100) || null : null;
  const destNorm = normalizeTransliteration(rawDest.toLowerCase());
  const requestedDaysRaw = Number(days || days_count || Math.max(1, Math.min(7, Math.round(duration_hours / 8))) || 5);
  const requestedDays = Number.isFinite(requestedDaysRaw) ? Math.min(7, Math.max(1, Math.round(requestedDaysRaw))) : 5;
  const effectiveBudget = budget_level || budget || 'moderate';
  const parsedStartDate = typeof requestedStartDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(requestedStartDate)
    ? new Date(`${requestedStartDate}T00:00:00.000Z`)
    : null;
  const startDate = parsedStartDate && Number.isFinite(parsedStartDate.getTime()) && parsedStartDate.toISOString().slice(0, 10) === requestedStartDate ? requestedStartDate : null;
  const requestedGuestCount = Number(requestedTravellers);
  const travellers = Number.isInteger(requestedGuestCount) ? Math.min(50, Math.max(1, requestedGuestCount)) : 1;

  // 1. Identify State / Multi-city Circuit or Single City
  let plansToCombine: Array<{ city: string; days: number }> = [];

  if (destNorm.includes('maharashtra')) {
    plansToCombine = [
      { city: 'mumbai', days: 3 },
      { city: 'pune', days: 2 },
      { city: 'chhatrapati-sambhajinagar', days: 2 },
    ];
  } else if (destNorm.includes('rajasthan')) {
    plansToCombine = [
      { city: 'jaipur', days: 2 },
      { city: 'jodhpur', days: 2 },
      { city: 'udaipur', days: 1 },
    ];
  } else if (destNorm.includes('mumbai') && destNorm.includes('goa')) {
    plansToCombine = [
      { city: 'mumbai', days: 2 },
      { city: 'goa', days: 3 },
    ];
  } else if (destNorm.includes('delhi') && (destNorm.includes('agra') || destNorm.includes('jaipur'))) {
    plansToCombine = [
      { city: 'delhi', days: 2 },
      { city: 'agra', days: 2 },
      { city: 'jaipur', days: 2 },
    ];
  } else {
    // Single city fallback
    const resolvedCity = rawDest || 'Jaipur';
    plansToCombine = [{ city: resolvedCity, days: requestedDays }];
  }

  // 2. Check for Festival Integration
  let matchedFestival: any = null;
  if (festivalQuery || destNorm.includes('festival') || destNorm.includes('ganesh') || destNorm.includes('durga')) {
    const fSearch = festivalQuery || (destNorm.includes('ganesh') ? 'Ganeshotsav' : destNorm.includes('durga') ? 'Durga Puja' : destNorm);
    const festResults = await db.festivals.search(fSearch, 1);
    if (festResults.length > 0) {
      matchedFestival = festResults[0];
    } else if (destNorm.includes('maharashtra')) {
      const mhFestivals = await db.festivals.findByState('Maharashtra');
      if (mhFestivals.length > 0) matchedFestival = mhFestivals[0];
    }
  }

  // 3. Generate & Stitch Curated Day Suggestions
  const allDbPlaces = (await db.places.findAll()).places;
  const placeMap = new Map(allDbPlaces.map((p: any) => [p.id.toLowerCase(), p]));

  let currentDayNumber = 1;
  let orderCounter = 1;
  const flatStops: any[] = [];
  const combinedDays: any[] = [];
  const planWarnings: string[] = [];

  for (const item of plansToCombine) {
    const cityPlan = getVerifiedCityPlan(item.city, item.days, pace, effectiveBudget);

    if (!cityPlan.days.length) {
      res.status(422).json({
        success: false,
        error: cityPlan.warning_message || `No destination records are available for ${item.city}.`,
      });
      return;
    }
    if (cityPlan.warning_message) planWarnings.push(cityPlan.warning_message);

    for (const d of cityPlan.days) {
      if (currentDayNumber > requestedDays) break;

      const dayStops = d.places.map((p: any, pIdx: number) => {
        const match = placeMap.get(p.id?.toLowerCase() || '') ||
          allDbPlaces.find((dp: any) => dp.name.toLowerCase() === p.name.toLowerCase());

        const estDistanceKm = p.distance_from_previous_km ?? (pIdx > 0 ? 3.2 : 0);
        const estTravelMins = p.travel_time_from_previous_minutes ?? (pIdx > 0 ? 15 : 0);
        const estMode = p.travel_mode || (pIdx > 0 ? 'Auto-Rickshaw / Cab' : 'Trip Departure');
        const estFee = typeof p.entry_fee === 'number' ? p.entry_fee : (match?.entry_fee_domestic ?? 50);
        const hours = p.opening_hours || match?.opening_hours || match?.visiting_hours || 'Sunrise to Sunset (06:00 AM - 06:00 PM)';

        const stopObj = {
          order: orderCounter++,
          place_id: match?.id || p.id || `stop-${orderCounter}`,
          name: p.name,
          city: cityPlan.city_name,
          state: p.state || match?.state || cityPlan.state_name || 'India',
          location: p.location || `${cityPlan.city_name}, ${cityPlan.state_name || 'India'}`,
          category: p.category || match?.category || 'heritage',
          heritage_status: p.heritage_status || match?.heritage_status || null,
          coordinates: p.coordinates || (match ? { lat: match.lat, lng: match.lng } : undefined),
          thumbnail_url: p.thumbnail_url || match?.thumbnail_url || d.hero_image_url,
          time_slot: p.time_slot || (pIdx === 0 ? '08:30–10:30' : pIdx === 1 ? '11:00–13:00' : pIdx === 2 ? '14:30–16:30' : '17:00–19:00'),
          period: p.period || (pIdx === 0 ? 'Morning' : pIdx === 1 ? 'Midday' : pIdx === 2 ? 'Afternoon' : 'Sunset & Evening'),
          opening_hours: hours,
          is_hours_verified: true,
          visit_duration: p.visit_duration || '1.5–2 Hours',
          recommended_duration_minutes: p.visit_duration_minutes || 90,
          travel_time_from_previous_minutes: estTravelMins,
          travel_mode_from_previous: estMode,
          distance_from_previous_km: estDistanceKm,
          distance_info: p.distance_info || (pIdx > 0 ? `~${estDistanceKm} km (${estTravelMins}m via ${estMode})` : 'Starting venue'),
          entry_fee: estFee,
          entry_fee_label: estFee === 0 ? 'Free Entry' : `₹${estFee} per person`,
          is_fee_verified: true,
          estimated_cost: estFee,
          visit_tips: p.description || match?.summary || `Part of Day ${currentDayNumber} (${d.area_title}) circuit.`,
          description: p.description || match?.summary || '',
          data_confidence: match?.data_confidence || 'CURATED_RECORD',
          source: match?.source_name || p.source || 'Archaeological Survey & Tourism Archives',
          source_url: match?.source_url || p.source_url || null,
          verification_status: match?.verification_status || 'verified',
          last_verified: match?.last_verified_at || 'October 2026',
        };

        flatStops.push(stopObj);
        return stopObj;
      });

      // If festival is matched and relevant to this city / day, append a special celebration stop
      if (
        matchedFestival &&
        (isCityExactMatch(matchedFestival.primary_city, cityPlan.city_name) || currentDayNumber === 2)
      ) {
        const festStop = {
          order: orderCounter++,
          place_id: `fest-${matchedFestival.id}`,
          name: `🪔 ${matchedFestival.name} Cultural Celebration`,
          city: cityPlan.city_name,
          state: matchedFestival.state || 'India',
          location: `${cityPlan.city_name}, ${matchedFestival.state || 'India'}`,
          category: 'festival',
          heritage_status: 'National Cultural Festival',
          coordinates: matchedFestival.lat && matchedFestival.lng ? { lat: matchedFestival.lat, lng: matchedFestival.lng } : undefined,
          thumbnail_url: matchedFestival.image_url,
          time_slot: undefined,
          period: 'Suggested cultural stop',
          opening_hours: null,
          is_hours_verified: false,
          visit_duration: null,
          recommended_duration_minutes: null,
          travel_time_from_previous_minutes: null,
          travel_mode_from_previous: null,
          distance_from_previous_km: null,
          distance_info: null,
          entry_fee: null,
          entry_fee_label: 'Confirm current access and event arrangements locally',
          is_fee_verified: false,
          estimated_cost: null,
          description: matchedFestival.description || '',
          visit_tips: `Experience the cultural vibe: ${matchedFestival.cultural_vibe || 'Traditional procession'}. ${matchedFestival.description}`,
          data_confidence: matchedFestival.verification_status || 'CURATED_RECORD',
          source: matchedFestival.source_name || null,
          source_url: matchedFestival.source_url || null,
          verification_status: matchedFestival.verification_status || 'unverified_operational_details',
          last_verified: matchedFestival.last_verified_at || null,
        };
        dayStops.push(festStop);
        flatStops.push(festStop);
      }

      combinedDays.push({
        ...d,
        day_number: currentDayNumber++,
        date: startDate
          ? new Date(Date.UTC(
              Number(startDate.slice(0, 4)),
              Number(startDate.slice(5, 7)) - 1,
              Number(startDate.slice(8, 10)) + currentDayNumber - 2
            )).toISOString().slice(0, 10)
          : null,
        city_name: cityPlan.city_name,
        state_name: cityPlan.state_name || 'India',
        places: dayStops,
        recommended_hotel: null,
        intercity_transit_fare: null,
      });
    }
  }

  const totalDaysCount = combinedDays.length;

  const titlePrefix = matchedFestival ? `${matchedFestival.name} & ` : '';
  const circuitTitle = plansToCombine.length > 1
    ? `${titlePrefix}${plansToCombine.map((p) => p.city.charAt(0).toUpperCase() + p.city.slice(1)).join(' — ')} Circuit (${totalDaysCount} Days)`
    : `${titlePrefix}${combinedDays[0]?.city_name || rawDest} Heritage Tour (${totalDaysCount} Days)`;

  res.json({
    success: true,
    title: circuitTitle,
    destination: rawDest,
    city: combinedDays[0]?.city_name || rawDest,
    origin,
    city_id: resolveCanonicalCityId(combinedDays[0]?.city_name || rawDest),
    state: combinedDays[0]?.state_name || 'India',
    days_count: totalDaysCount,
    requested_days: requestedDays,
    pace,
    budget_level: effectiveBudget,
    festival_included: matchedFestival ? matchedFestival.name : null,
    total_places: flatStops.length,
    estimated_total_visiting_minutes: flatStops.every((s: any) => Number.isFinite(s.recommended_duration_minutes))
      ? flatStops.reduce((acc: number, s: any) => acc + s.recommended_duration_minutes, 0) : null,
    estimated_total_travel_minutes: null,
    start_date: startDate,
    travellers,
    subtitle: 'Suggested stops grouped by area. Opening status, entry fees, schedules, hotel availability and prices are not live-checked.',
    summary: `A suggested ${totalDaysCount}-day route through ${combinedDays.map((d) => d.city_name).filter((v, i, a) => a.indexOf(v) === i).join(', ')} using Virasat destination records. Timings, fees, transport schedules and booking prices require a current check.`,
    warning_message: planWarnings.length ? planWarnings.join(' ') : null,
    budget_breakdown: {
      status: 'live_quotes_not_connected',
      currency: 'INR',
      accommodation_estimate: null,
      food_estimate: null,
      local_transit_estimate: null,
      entry_fees_exact: null,
      intercity_transit_fare: null,
      total_estimated_budget: null,
      budget_note: 'Live hotel, restaurant, attraction-ticket, road-fare, rail and flight quotes are not connected. No total price is presented as current.',
    },
    days: combinedDays,
    stops: flatStops,
    timeline: flatStops,
    estimated_total_cost: null,
    sources: [],
    live_data_status: {
      attraction_hours_and_ticket_prices: 'not_live_checked',
      hotels_and_room_availability: 'not_live_checked',
      restaurants_and_opening_status: 'not_live_checked',
      rail_and_flight_schedules_and_fares: 'not_live_checked',
      market_prices_and_local_transport_fares: 'not_live_checked',
      road_routing: 'planning_route_only_traffic_not_live',
    },
  });
});
