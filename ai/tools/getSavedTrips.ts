import { db } from '../../server/src/db/client';

export const declaration = {
  name: 'getSavedTrips',
  description: "Get the traveler's saved itineraries, historical circuits, and bookmarked favorite monuments from their account.",
  parameters: {
    type: 'OBJECT',
    properties: {},
  },
};

export async function execute(_args: { user_id?: string }, context?: any): Promise<any> {
  const uid = context?.userId || context?.user?.id;
  if (!uid) {
    return {
      is_authenticated: false,
      message: 'Sign in to view your saved trips and favorites.',
      total_saved_trips: 0,
      saved_itineraries: [],
      total_favorites: 0,
      favorite_places: [],
    };
  }

  const [itineraries, favorites, placeResult] = await Promise.all([
    db.itineraries.findByUser(uid),
    db.favorites.listByUser(uid),
    db.places.findAll({ includeAllStatuses: true }),
  ]);
  const placeById = new Map((placeResult.places || []).map((place: any) => [place.id, place]));

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
    favorite_places: favorites.map((f: any) => {
      const place: any = placeById.get(f.place_id);
      return {
        place_id: f.place_id,
        place_name: place?.name || f.place_id,
        city: place?.city_id || place?.city,
        state: place?.state || place?.state_id,
        saved_at: f.created_at,
      };
    }),
  };
}
