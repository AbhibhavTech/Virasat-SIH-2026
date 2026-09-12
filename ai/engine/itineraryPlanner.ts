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
    sunset_or_aarti: string;
    dinner_vibe: string;
  };
}

export interface GeneratedTripPlan {
  destination: string;
  origin?: string;
  duration_days: number;
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
  const destName = state.destination || 'Jaipur';
  const cleanDest = destName.toLowerCase();
  const daysCount = Math.min(Math.max(state.duration_days || 3, 1), 7);
  const style = state.travel_style || 'moderate';
  const hotelTier = state.hotel_tier || (style === 'luxury' ? 'luxury' : style === 'budget' ? 'budget' : 'moderate');

  const db = getTourismDatabase();
  const availablePlaces: any[] = [];
  let foundCityName = destName;
  let foundStateName = 'India';

  if (db && db.states) {
    for (const s of db.states) {
      for (const c of s.cities || []) {
        if (c.name.toLowerCase().includes(cleanDest) || cleanDest.includes(c.name.toLowerCase()) || s.name.toLowerCase().includes(cleanDest)) {
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
            availablePlaces.push({
              id: p.id,
              name: p.name,
              category: p.category,
              topic: p.topic,
              summary: p.summary,
              timings: p.visiting_hours || p.timings || '9:00 AM - 5:30 PM',
              entry_fee: p.entry_fee || 'Standard Entry',
            });
          }
          break;
        }
      }
      if (availablePlaces.length > 0) break;
    }
  }

  // If a specific monument was discussed in active conversation, start Day 1 with it
  if (state.lastPlace && state.lastPlace.city.toLowerCase().includes(cleanDest)) {
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
        topic: state.lastPlace.topic,
        summary: state.lastPlace.summary,
        timings: state.lastPlace.visiting_hours,
        entry_fee: state.lastPlace.entry_fee,
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
    const morningPlace = availablePlaces[placeIdx % Math.max(availablePlaces.length, 1)];
    placeIdx++;
    const afternoonPlace = availablePlaces[placeIdx % Math.max(availablePlaces.length, 1)];
    placeIdx++;
    const eveningPlace = availablePlaces[placeIdx % Math.max(availablePlaces.length, 1)];
    placeIdx++;

    let dayTheme = `Day ${d}: Royal Heritage & Architecture`;
    if (d === 2) dayTheme = `Day ${d}: Living Culture, Bazaars & Local Flavors`;
    if (d === 3) dayTheme = `Day ${d}: Spiritual Sanctuaries & Sunset Vistas`;
    if (d > 3) dayTheme = `Day ${d}: Hidden Gems & Scenic Environs`;

    days.push({
      day_number: d,
      theme: dayTheme,
      morning_cluster: {
        title: `Morning Heritage Cluster (~8:30 AM - 12:30 PM)`,
        places: morningPlace ? [morningPlace] : [],
        duration: '2.5 to 3 hours exploration',
        tips: 'Visit early to enjoy peaceful courtyards and optimal photography light.',
      },
      afternoon_cluster: {
        title: `Afternoon Cultural Walk (~1:30 PM - 4:30 PM)`,
        places: afternoonPlace ? [afternoonPlace] : [],
        duration: '2 hours',
        lunch_spot: `Local heritage eatery in ${foundCityName} central market precinct`,
      },
      evening_cluster: {
        title: `Evening Sunset & Promenade (~5:30 PM - 8:30 PM)`,
        places: eveningPlace ? [eveningPlace] : [],
        sunset_or_aarti: 'Sunset viewpoint / evening heritage illumination',
        dinner_vibe: `Authentic regional thali or garden restaurant dinner in ${foundCityName}`,
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

  let totalHotel = hotelRate * Math.max(daysCount - 1, 1);
  let totalFood = foodRate * daysCount;
  let totalTransit = transitDaily * daysCount;
  let totalTickets = 350 * daysCount;

  // If user requested a 1-day local day plan with low budget (e.g. ₹2000)
  if (daysCount === 1 && state.budget && state.budget <= 3000) {
    totalHotel = 0; // Day trip without overnight stay
    totalTransit = 250;
    totalFood = 650;
    totalTickets = 300;
  } else if (daysCount === 1) {
    totalHotel = 0; // Day trip
  }

  const grandTotal = totalHotel + totalFood + totalTransit + totalTickets;

  return {
    destination: foundCityName,
    origin: state.origin || 'Mumbai / Delhi',
    duration_days: daysCount,
    travel_style: style.toUpperCase(),
    hotel_recommendation: {
      tier: hotelTier.toUpperCase(),
      rate_indication: `₹${hotelRate.toLocaleString('en-IN')} / night`,
      suggested_areas: [`Central ${foundCityName} Heritage Corridor`, 'Near Main Station / City Center'],
    },
    transport_recommendation: {
      mode: state.transport_mode === 'flight' ? 'Flight' : 'Train (Indian Railways IRCTC)',
      summary: state.origin
        ? `Direct connection between ${state.origin} and ${foundCityName}`
        : `Intercity rail or highway route connecting to ${foundCityName}`,
      approx_duration: state.transport_mode === 'flight' ? '1.5 - 2 hrs' : '5 - 8 hrs',
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
