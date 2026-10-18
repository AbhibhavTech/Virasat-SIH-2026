import fs from 'fs';
import path from 'path';
import { TripMemoryState } from './conversationMemory';

let cachedTourismDb: any = null;
function getTourismDatabase() {
  if (!cachedTourismDb) {
    const p = path.join(process.cwd(), 'data', 'india_tourism_database.json');
    if (fs.existsSync(p)) {
      try {
        cachedTourismDb = JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch {
        cachedTourismDb = null;
      }
    }
  }
  return cachedTourismDb;
}

export interface DayItinerary {
  day_number: number;
  theme: string;
  morning_cluster: {
    title: string;
    places: any[];
    duration: string;
    tips: string;
  };
  afternoon_cluster: {
    title: string;
    places: any[];
    duration: string;
    lunch_spot: string;
  };
  evening_cluster: {
    title: string;
    places: any[];
    duration: string;
    sunset_or_aarti: string;
    dinner_vibe: string;
  };
}

export interface GeneratedTripPlan {
  destination: string;
  origin?: string;
  duration_days: number;
  party_size: number;
  travel_dates?: string;
  travel_style: string;
  hotel_recommendation: {
    tier: string;
    rate_indication: string;
    suggested_areas: string[];
  };
  transport_recommendation: {
    mode: string;
    summary: string;
    approx_duration: string;
  };
  days: DayItinerary[];
  budget_breakdown: {
    accommodation: string;
    meals: string;
    local_transit: string;
    monument_tickets: string;
    total_estimated: string;
  };
  places_included: any[];
}

/**
 * Generates an intelligent, cluster-optimized day-by-day itinerary
 * using the real 36-region Virasat tourism database.
 */
export function generateSmartItinerary(state: TripMemoryState): GeneratedTripPlan {
  const destName = state.destination || '';
  const cleanDest = destName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const daysCount = Math.min(Math.max(state.duration_days || 3, 1), 7);
  const travelers = Math.min(Math.max(state.party_size_count || 1, 1), 20);
  const style = state.travel_style || 'moderate';
  const hotelTier = state.hotel_tier || (style === 'luxury' ? 'luxury' : style === 'budget' ? 'budget' : 'moderate');

  const db = getTourismDatabase();
  const availablePlaces: any[] = [];
  let foundCityName = destName;
  let foundStateName = 'India';

  if (db && db.states) {
    for (const s of db.states) {
      for (const c of s.cities || []) {
        const cityKey = c.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (cityKey === cleanDest || c.id?.toLowerCase() === cleanDest || c.slug?.toLowerCase() === cleanDest) {
          foundCityName = c.name;
          foundStateName = s.name;
          const allCityPlaces = [
            ...(c.heritage || []),
            ...(c.monuments || []),
            ...(c.religious_cultural || []),
            ...(c.nature_parks_zoo || []),
            ...(c.museums || []),
            ...(c.tourist_places || []),
          ];
          for (const p of allCityPlaces) {
            // Legacy generated placeholders are not named visitor attractions.
            if (/^Celebrated highlight of /i.test(p.summary || '') || /Heritage Fort Complex$/i.test(p.name || '')) continue;
            if ((p.name || '').trim().toLowerCase() === c.name.trim().toLowerCase()) continue;
            availablePlaces.push({
              id: p.id,
              name: p.name,
              category: p.category,
              summary: p.summary,
              timings: p.visiting_hours || p.timings,
              entry_fee: p.entry_fee,
              recommended_duration: p.recommended_duration || p.suggested_duration,
              coordinates: p.coordinates || (p.lat && p.lng ? { lat: p.lat, lng: p.lng } : undefined),
              source_url: p.source_url || p.source_page,
            });
          }
          break;
        }
      }
      if (availablePlaces.length > 0) break;
    }
  }

  // If a specific monument was discussed in active conversation, start Day 1 with it
  if (
    state.lastPlace &&
    state.lastPlace.city.toLowerCase() === foundCityName.toLowerCase() &&
    state.lastPlace.name.toLowerCase() !== foundCityName.toLowerCase()
  ) {
    const existingIdx = availablePlaces.findIndex(
      (p) => p.id === state.lastPlace?.id || p.name.toLowerCase() === state.lastPlace?.name.toLowerCase()
    );
    if (existingIdx > 0) {
      const [item] = availablePlaces.splice(existingIdx, 1);
      availablePlaces.unshift(item);
    } else if (existingIdx === -1) {
      availablePlaces.unshift({
        id: state.lastPlace.id,
        name: state.lastPlace.name,
        category: state.lastPlace.category,
        summary: state.lastPlace.summary,
        timings: state.lastPlace.visiting_hours,
        entry_fee: state.lastPlace.entry_fee,
        recommended_duration: state.lastPlace.recommended_duration,
      });
    }
  }

  // Filter or prioritize based on interests
  if (state.interests.includes('spiritual')) {
    availablePlaces.sort((a, b) => {
      const aSpiritual = a.category === 'religious_cultural' || /temple|mandir|ghat|mosque|gurudwara/i.test(a.name) ? 1 : 0;
      const bSpiritual = b.category === 'religious_cultural' || /temple|mandir|ghat|mosque|gurudwara/i.test(b.name) ? 1 : 0;
      return bSpiritual - aSpiritual;
    });
  }

  const days: DayItinerary[] = [];
  let placeIdx = 0;

  for (let d = 1; d <= daysCount; d++) {
    const morningPlace = availablePlaces[placeIdx];
    placeIdx++;
    const afternoonPlace = availablePlaces[placeIdx];
    placeIdx++;
    const eveningPlace = availablePlaces[placeIdx];
    placeIdx++;

    const dayTheme = `${foundCityName} exploration`;

    days.push({
      day_number: d,
      theme: dayTheme,
      morning_cluster: {
        title: `Morning visit (confirm opening hours)`,
        places: morningPlace ? [morningPlace] : [],
        duration: morningPlace?.recommended_duration || 'Visit duration not available in local records',
        tips: 'Check the venue’s current opening hours before setting out.',
      },
      afternoon_cluster: {
        title: `Afternoon visit (confirm opening hours)`,
        places: afternoonPlace ? [afternoonPlace] : [],
        duration: afternoonPlace?.recommended_duration || 'Visit duration not available in local records',
        lunch_spot: `Meal break in ${foundCityName}; choose and verify a venue separately`,
      },
      evening_cluster: {
        title: `Evening visit (confirm seasonal access)`,
        places: eveningPlace ? [eveningPlace] : [],
        duration: eveningPlace?.recommended_duration || 'Visit duration not available in local records',
        sunset_or_aarti: 'Optional evening visit; verify venue access and timings',
        dinner_vibe: `Dinner break in ${foundCityName}; verify restaurant details separately`,
      },
    });
  }

  // Budget calculations
  let hotelRate = 4200;
  if (hotelTier === 'budget') hotelRate = 1600;
  if (hotelTier === 'luxury') hotelRate = 18000;

  let foodRate = 750;
  if (style === 'budget') foodRate = 400;
  if (style === 'luxury') foodRate = 2400;

  let transitDaily = 900;
  if (style === 'budget') transitDaily = 400;
  if (style === 'luxury') transitDaily = 2800;

  let totalHotel = hotelRate * Math.max(daysCount - 1, 1) * Math.ceil(travelers / 2);
  let totalFood = foodRate * daysCount * travelers;
  let totalTransit = transitDaily * daysCount;
  let totalTickets = 350 * daysCount * travelers;

  // If user requested a 1-day local day plan with low budget (e.g. ₹2000)
  if (daysCount === 1 && state.budget && state.budget <= 3000) {
    totalHotel = 0; // Day trip without overnight stay
    totalTransit = 250;
    totalFood = 650 * travelers;
    totalTickets = 300 * travelers;
  } else if (daysCount === 1) {
    totalHotel = 0; // Day trip
  }

  const grandTotal = totalHotel + totalFood + totalTransit + totalTickets;

  return {
    destination: foundCityName,
    origin: state.origin,
    duration_days: daysCount,
    party_size: travelers,
    travel_dates: state.start_date && state.end_date
      ? `${state.start_date} to ${state.end_date}`
      : state.travel_date || undefined,
    travel_style: style.toUpperCase(),
    hotel_recommendation: {
      tier: hotelTier.toUpperCase(),
      rate_indication: `planning allowance ₹${hotelRate.toLocaleString('en-IN')} / night (not a hotel quote)`,
      suggested_areas: [`Central ${foundCityName} Heritage Corridor`, 'Near Main Station / City Center'],
    },
    transport_recommendation: {
      mode: state.transport_mode === 'flight' ? 'Flight (check live route options)' : state.transport_mode === 'train' ? 'Train (check live route options)' : 'Choose after route lookup',
      summary: state.origin
        ? `Route options from ${state.origin} to ${foundCityName} need a separate transport lookup.`
        : 'Add an origin to compare intercity transport options.',
      approx_duration: 'Not estimated by the itinerary planner',
    },
    days,
    budget_breakdown: {
      accommodation: `₹${totalHotel.toLocaleString('en-IN')}`,
      meals: `₹${totalFood.toLocaleString('en-IN')}`,
      local_transit: `₹${totalTransit.toLocaleString('en-IN')}`,
      monument_tickets: `₹${totalTickets.toLocaleString('en-IN')}`,
      total_estimated: `₹${grandTotal.toLocaleString('en-IN')}`,
    },
    places_included: availablePlaces.slice(0, daysCount * 3),
  };
}
