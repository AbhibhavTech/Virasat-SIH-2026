export const FEATURE_REGISTRY = {
  discover: { label: 'Discover Bharat', path: '/explore' },
  heritage: { label: 'Heritage', path: '/heritage' },
  map: { label: 'Open Map', path: '/map' },
  itinerary: { label: 'Itinerary Planner', path: '/itinerary' },
  festivals: { label: 'Festival Calendar', path: '/festivals' },
  assistant: { label: 'AI Assistant', path: '/ai' },
  trips: { label: 'Saved Trips', path: '/trips' },
  favorites: { label: 'Favorites', path: '/favorites' },
  profile: { label: 'Profile', path: '/profile' },
} as const;

export function getAppNavigation(args: { feature: string; city?: string; query?: string; origin?: string; days?: number }) {
  if (!Object.prototype.hasOwnProperty.call(FEATURE_REGISTRY, args.feature)) return { error: 'Unknown feature', features: Object.keys(FEATURE_REGISTRY) };
  const feature = FEATURE_REGISTRY[args.feature as keyof typeof FEATURE_REGISTRY];
  const params = new URLSearchParams();
  if (args.city) params.set('city', args.city.slice(0, 100));
  if (args.query) params.set('q', args.query.slice(0, 200));
  if (args.origin && args.feature === 'map') params.set('origin', args.origin.slice(0, 100));
  if (args.city && args.origin && args.feature === 'map') params.set('destination', args.city.slice(0, 100));
  if (args.days && args.feature === 'itinerary') params.set('days', String(Math.min(14, Math.max(1, Math.floor(args.days)))));
  return { action: { type: args.feature === 'map' ? 'open_map' : args.feature === 'itinerary' ? 'plan_itinerary' : 'view_destination', label: feature.label, url: `${feature.path}${params.size ? `?${params}` : ''}` } };
}
