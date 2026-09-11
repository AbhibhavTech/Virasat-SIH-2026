import { db } from '../../server/src/db/client';

export const declaration = {
  name: 'saveCurrentTrip',
  description: "Save a new travel itinerary or heritage circuit to the user's permanent profile in the database.",
  parameters: {
    type: 'OBJECT',
    properties: {
      title: {
        type: 'STRING',
        description: 'Title of the trip (e.g., "Golden Triangle Heritage Odyssey", "Varanasi Spiritual Immersion").',
      },
      destination: {
        type: 'STRING',
        description: 'Primary city or region.',
      },
      duration_days: {
        type: 'NUMBER',
        description: 'Trip length in days.',
      },
      budget_tier: {
        type: 'STRING',
        description: '"budget", "mid_range", or "luxury".',
      },
      places: {
        type: 'ARRAY',
        items: { type: 'STRING' },
        description: 'List of monument or place names included in the trip.',
      },
    },
    required: ['title', 'destination'],
  },
};

export async function execute(args: {
  title: string;
  destination: string;
  duration_days?: number;
  budget_tier?: string;
  places?: string[];
}, context?: any): Promise<any> {
  const uid = context?.userId || context?.user?.id || 'guest_user';
  const tripId = `trip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const days = args.duration_days || 3;

  const created = await db.itineraries.create({
    id: tripId,
    user_id: uid,
    title: args.title,
    destination: args.destination,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + days * 86400000).toISOString().split('T')[0],
    days_count: days,
    budget_level: (args.budget_tier === 'luxury' ? 'luxury' : args.budget_tier === 'budget' ? 'budget' : 'moderate') as any,
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return {
    success: true,
    trip_id: created.id,
    title: created.title,
    days_count: created.days_count,
    destination: args.destination,
    places_included: args.places || [],
    message: `Trip "${args.title}" successfully saved to your Virasat account! You can access it anytime under My Trips.`,
  };
}
