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
  const body = req.body || {};
  const query = req.query || {};

  // Extract location from body, query, or headers
  const loc = body.location || body.userLocation || {};
  const lat = loc.latitude ?? loc.lat ?? (query.lat ? parseFloat(String(query.lat)) : undefined);
  const lng = loc.longitude ?? loc.lng ?? (query.lng ? parseFloat(String(query.lng)) : undefined);
  const city = loc.city || body.city || (query.city ? String(query.city) : undefined);
  const state = loc.state || body.state || (query.state ? String(query.state) : undefined);

  // Extract route / page navigation state
  const currentRoute = body.currentRoute || body.path || (req.headers['x-virasat-route'] as string) || '/';
  const selectedPlaceId = body.place_id || body.selectedPlaceId || (query.place_id ? String(query.place_id) : undefined);
  const selectedCity = body.selectedCity || city;
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
    : body.user
    ? {
        id: body.user.id,
        name: body.user.name,
        home_city: body.user.home_city,
      }
    : undefined;

  const userAgent = String(req.headers['user-agent'] || '');
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

  return {
    userLocation: {
      lat,
      lng,
      city,
      state,
      source: lat && lng ? 'GPS Coordinate Stream' : city ? 'City Parameter' : 'Default National Anchor',
    },
    currentRoute,
    selectedCity,
    selectedPlaceId,
    activeItinerary,
    user,
    clientEnvironment: {
      timestamp: new Date().toISOString(),
      isMobile,
      timezone: 'Asia/Kolkata',
    },
    metadata: body.metadata || {},
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
