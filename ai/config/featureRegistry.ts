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

/** Concise, retrieval-backed help so Astra can explain the real product pages. */
export const FEATURE_HELP = {
  discover: { overview: 'Browse India by state and union territory, then open state and city guides and their listed attractions.', actions: ['Search states, cities, or places', 'Open a region or destination card'], limitations: ['Coverage depends on the records currently in Virasat; a missing record does not mean the place does not exist.'] },
  heritage: { overview: 'Read heritage place profiles, history, architecture, visitor guidance, and recorded source/status details.', actions: ['Search a heritage place', 'Open its detail profile'], limitations: ['Hours, fees, and access details can need confirmation. UNESCO status must match the record.'] },
  map: { overview: 'Explore places on a map, use nearby discovery, and compare route modes between a chosen origin and destination.', actions: ['Search a place', 'Choose an origin and destination', 'Select a supported travel mode'], limitations: ['Route geometry and time may be estimates; a mapped corridor does not confirm a live service or timetable.'] },
  itinerary: { overview: 'Build an editable trip plan using destination, duration, travel pace, budget, and interests.', actions: ['Choose destination and trip length', 'Set pace, budget, and interests', 'Review and edit the generated plan'], limitations: ['Live availability and booking are not guaranteed; saving requires the app flow and any requested confirmation.'] },
  festivals: { overview: 'Browse festival cards and calendar information by search, region, or date.', actions: ['Search a festival', 'Filter or browse festival cards'], limitations: ['Festival dates can vary by year and should be confirmed when not live-verified.'] },
  assistant: { overview: 'Ask general questions or request India tourism help; the assistant can use Virasat records and page navigation.', actions: ['Ask naturally in supported languages', 'Ask for a route, place, trip, festival, or page'], limitations: ['It cannot make purchases or guarantee live facts unless a tool explicitly verifies them.'] },
  trips: { overview: 'View trips saved to your account.', actions: ['Sign in', 'Open Saved Trips'], limitations: ['Only trips actually saved through the application appear here.'] },
  favorites: { overview: 'Keep a personal list of places you want to revisit.', actions: ['Open a place and add it to Favorites', 'Review the Favorites page'], limitations: ['Favorites depend on your signed-in account and available app records.'] },
  profile: { overview: 'Manage your account and travel preferences.', actions: ['Sign in', 'Open your profile'], limitations: ['Account options depend on the authentication state.'] },
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
