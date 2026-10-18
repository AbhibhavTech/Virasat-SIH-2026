import { Request } from 'express';

export interface LiveContextPayload {
  userLocation: {
    lat?: number;
    lng?: number;
    city?: string;
    state?: string;
    source?: string;
  };
  currentRoute?: string;
  selectedCity?: string;
  selectedPlaceId?: string;
  activeItinerary?: any;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    home_city?: string;
    preferences?: any;
  };
  clientEnvironment: {
    timestamp: string;
    isMobile?: boolean;
    timezone: string;
  };
  metadata?: Record<string, any>;
}

/**
 * Assembles the full live context object from incoming request data,
 * headers, session parameters, and current browser navigation state.
 */
export function buildContextPayload(req: Request): LiveContextPayload {
  const shortText = (value: unknown, max = 120) => typeof value === 'string' ? value.slice(0, max) : undefined;
  const coordinate = (value: unknown, bound: number) => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= bound ? value : undefined;
  const body = req.body || {};
  const query = req.query || {};

  // Extract location from body, query, or headers
  const loc = body.location || body.userLocation || {};
  const lat = loc.latitude ?? loc.lat ?? (query.lat ? parseFloat(String(query.lat)) : undefined);
  const lng = loc.longitude ?? loc.lng ?? (query.lng ? parseFloat(String(query.lng)) : undefined);
  const city = loc.city;
  const state = loc.state;

  // Extract route / page navigation state
  const currentRoute = body.currentRoute || body.path || (req.headers['x-virasat-route'] as string) || '/';
  const selectedPlaceId = body.place_id || body.selectedPlaceId || (query.place_id ? String(query.place_id) : undefined);
  // selectedCity is specifically a tourist destination explicitly chosen by the user, never the user's current GPS anchor
  const selectedCity = body.selectedCity || (query.selectedCity ? String(query.selectedCity) : undefined);
  const activeItinerary = body.activeItinerary || body.itinerary || null;

  // Extract user info if authenticated via middleware
  const reqUser = (req as any).user;
  const user = reqUser
    ? {
        id: reqUser.id,
        name: reqUser.name,
        email: reqUser.email,
        home_city: reqUser.home_city,
        preferences: reqUser.travel_preferences,
      }
    : undefined;

  const userAgent = String(req.headers['user-agent'] || '');
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

  return {
    userLocation: {
      lat: coordinate(lat, 90),
      lng: coordinate(lng, 180),
      city: shortText(city),
      state: shortText(state),
      source: lat && lng ? 'GPS Coordinate Stream' : city ? 'City Parameter' : 'Default National Anchor',
    },
    currentRoute: typeof currentRoute === 'string' && /^\/(?!\/)[a-zA-Z0-9/_-]*([?#].*)?$/.test(currentRoute) ? currentRoute.split(/[?#]/)[0].slice(0, 200) : '/',
    selectedCity: shortText(selectedCity),
    selectedPlaceId: shortText(selectedPlaceId),
    activeItinerary: activeItinerary && typeof activeItinerary === 'object' ? {
      id: shortText(activeItinerary.id), title: shortText(activeItinerary.title),
      destination: shortText(activeItinerary.destination),
      days_count: Number.isInteger(activeItinerary.days_count) ? Math.min(30, Math.max(1, activeItinerary.days_count)) : undefined,
    } : null,
    user,
    clientEnvironment: {
      timestamp: new Date().toISOString(),
      isMobile,
      timezone: 'Asia/Kolkata',
    },
    metadata: { language: ['en','as','bn','brx','doi','gu','hi','kn','ks','kok','mai','ml','mni','mr','ne','or','pa','sa','sat','sd','ta','te','ur'].includes(body.language) ? body.language : 'auto' },
  };
}

/**
 * Formats the live context payload into a compact string representation
 * for grounding the LLM system prompt.
 */
export function formatContextForPrompt(ctx: LiveContextPayload): string {
  const lines: string[] = [];

  if (ctx.selectedCity) {
    lines.push(`Active Destination City: ${ctx.selectedCity}`);
  }
  if (ctx.selectedPlaceId) {
    lines.push(`Currently Inspected Monument/Place ID: ${ctx.selectedPlaceId}`);
  }
  if (ctx.userLocation.city || (ctx.userLocation.lat && ctx.userLocation.lng)) {
    lines.push(`Traveler Current Location: ${ctx.userLocation.city || ''} (${ctx.userLocation.lat ?? ''}, ${ctx.userLocation.lng ?? ''})`);
  }
  if (ctx.currentRoute) {
    lines.push(`Frontend Navigation View: ${ctx.currentRoute}`);
  }
  if (ctx.user?.name) {
    lines.push(`Traveler: ${ctx.user.name}${ctx.user.home_city ? ` (Home: ${ctx.user.home_city})` : ''}`);
  }
  if (ctx.activeItinerary) {
    lines.push(`Active Itinerary Loaded: ${ctx.activeItinerary.title || 'Custom Circuit'}`);
  }

  return lines.length > 0 ? `LIVE TRAVELER CONTEXT:\n${lines.join('\n')}` : 'LIVE TRAVELER CONTEXT: Open exploration mode.';
}
