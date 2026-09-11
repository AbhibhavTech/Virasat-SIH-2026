import { db } from '../../server/src/db/client';

export const declaration = {
  name: 'getSavedTrips',
  description: "Get the traveler's saved itineraries, historical circuits, and bookmarked favorite monuments from their account.",
  parameters: {
    type: 'OBJECT',
    properties: {
      user_id: {
        type: 'STRING',
        description: 'Optional User ID. If omitted, checks current authenticated session.',
      },
    },
  },
};

export async function execute(args: { user_id?: string }, context?: any): Promise<any> {
  const uid = args.user_id || context?.userId || context?.user?.id || 'guest_user';

  const [itineraries, favorites] = await Promise.all([
    db.itineraries.findByUser(uid),
    db.favorites.listByUser(uid),
  ]);

  return {
    user_id: uid,
    total_saved_trips: itineraries.length,
    saved_itineraries: itineraries.map((it: any) => ({
      id: it.id,
      title: it.title,
      destination: it.destination || 'India Circuit',
      days_count: it.days_count,
      start_date: it.start_date,
      budget_tier: it.budget_level,
      visibility: it.is_public ? 'public' : 'private',
    })),
    total_favorites: favorites.length,
    favorite_places: favorites.map((f: any) => ({
      place_id: f.place_id,
      saved_at: f.created_at,
    })),
  };
}
