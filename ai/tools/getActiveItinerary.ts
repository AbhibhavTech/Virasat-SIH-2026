import { db } from '../../server/src/db/client';

export const declaration = {
  name: 'getActiveItinerary',
  description: "Get the traveler's currently active itinerary, including day-by-day stops, timings, monuments, and notes from their session or saved plans.",
  parameters: {
    type: 'OBJECT',
    properties: {
      itinerary_id: {
        type: 'STRING',
        description: 'Optional ID of a specific itinerary to inspect. If omitted, checks active session itinerary or user latest itinerary.',
      },
    },
  },
};

export async function execute(args: { itinerary_id?: string }, context?: any): Promise<any> {
  // 1. Check if an active itinerary is in the current frontend context
  if (context?.activeItinerary) {
    return {
      source: 'Active Session State',
      itinerary: context.activeItinerary,
    };
  }

  // 2. Check by ID if provided
  if (args.itinerary_id) {
    const it = await db.itineraries.findById(args.itinerary_id);
    if (it) {
      const days = await db.itineraryDays.findByItinerary(it.id);
      const daysWithStops = [];
      for (const d of days) {
        const stops = await db.itineraryStops.findByDay(d.id);
        daysWithStops.push({ ...d, stops });
      }
      return {
        source: 'Database Record',
        itinerary: { ...it, days: daysWithStops },
      };
    }
  }

  // 3. Check for authenticated user's latest itinerary
  const userId = context?.userId || context?.user?.id;
  if (userId) {
    const userItineraries = await db.itineraries.findByUser(userId);
    if (userItineraries.length > 0) {
      const latest = userItineraries[userItineraries.length - 1];
      const days = await db.itineraryDays.findByItinerary(latest.id);
      return {
        source: 'User Profile Itinerary',
        itinerary: { ...latest, days },
      };
    }
  }

  return {
    has_active_itinerary: false,
    message: 'No active itinerary currently open. The traveler can ask to generate or customize a new itinerary for any destination in India.',
  };
}
