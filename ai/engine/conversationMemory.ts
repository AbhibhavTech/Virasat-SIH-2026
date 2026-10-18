import { ExtractedEntities } from './entityExtractor';
import { ResolvedPlace } from './placeResolver';

export interface TripMemoryState {
  currentCity?: string;
  lastHeritageSlug?: string;
  sessionId: string;
  messages?: import('./modelGateway').ChatTurn[];
  origin?: string;
  destination?: string;
  multiCities?: string[];
  duration_days?: number;
  budget?: number;
  currency: string;
  travel_style?: 'budget' | 'moderate' | 'luxury';
  hotel_tier?: 'budget' | 'moderate' | 'luxury';
  transport_mode?: 'train' | 'flight' | 'road' | 'bus' | 'all';
  interests: string[];
  party_size?: string;
  party_size_count?: number;
  travel_date?: string;
  start_date?: string;
  end_date?: string;
  lastPlace?: ResolvedPlace;
  lastPlaceId?: string;
  lastItinerary?: any;
  lastPlaces?: any[];
  lastHotels?: any[];
  lastFestival?: any;
  lastSearch?: {
    query?: string;
    city?: string;
    state?: string;
    category?: string;
    kind?: 'places' | 'hidden_gems';
    offset: number;
    limit: number;
  };
  lastIntent?: string;
  turnCount: number;
  updatedAt: number;
}

const memoryStore = new Map<string, TripMemoryState>();
export function deleteConversationState(sessionId: string) { memoryStore.delete(sessionId); }
const MEMORY_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_MEMORY_SESSIONS = 5000;

/**
 * Retrieves or creates a structured conversation state for a session
 */
export function getConversationState(sessionId: string): TripMemoryState {
  let state = memoryStore.get(sessionId);
  if (state && Date.now() - state.updatedAt > MEMORY_TTL_MS) {
    memoryStore.delete(sessionId);
    state = undefined;
  }
  if (!state) {
    state = {
      sessionId,
      currency: 'INR',
      interests: [],
      turnCount: 0,
      updatedAt: Date.now(),
    };
    memoryStore.set(sessionId, state);
    if (memoryStore.size > MAX_MEMORY_SESSIONS) {
      const oldest = [...memoryStore.values()].reduce((a, b) => a.updatedAt <= b.updatedAt ? a : b);
      memoryStore.delete(oldest.sessionId);
    }
  }
  return state;
}

/**
 * Merges newly extracted entities into the active conversation memory
 */
export function updateConversationState(
  sessionId: string,
  newEntities: ExtractedEntities,
  intent?: string
): TripMemoryState {
  const state = getConversationState(sessionId);

  // If user explicitly rejects a location ("no panvel nahi", "panvel nahi", etc.)
  if (newEntities.rejected_city) {
    const rejLower = newEntities.rejected_city.toLowerCase();
    const destinationRejected = Boolean(
      state.destination && state.destination.toLowerCase().includes(rejLower)
    );
    if (destinationRejected) {
      delete state.destination;
      delete state.lastPlaces;
      delete state.lastHotels;
      delete state.lastFestival;
      delete state.lastSearch;
      delete state.lastItinerary;
    }
    if (state.lastPlace && (state.lastPlace.city.toLowerCase().includes(rejLower) || state.lastPlace.name.toLowerCase().includes(rejLower))) {
      delete state.lastPlace;
      delete state.lastPlaceId;
    }
    if (state.multiCities) {
      state.multiCities = state.multiCities.filter((c) => !c.toLowerCase().includes(rejLower));
    }
  }

  if (newEntities.origin) state.origin = newEntities.origin;
  if (newEntities.destination) {
    // If state already had destination and user adds another, handle multi-city
    if (state.destination && state.destination.toLowerCase() !== newEntities.destination.toLowerCase()) {
      delete state.lastPlace;
      delete state.lastPlaceId;
      delete state.lastPlaces;
      delete state.lastHotels;
      delete state.lastFestival;
      delete state.lastSearch;
      delete state.lastItinerary;
      if (!state.multiCities) state.multiCities = [state.destination];
      if (!state.multiCities.includes(newEntities.destination)) {
        state.multiCities.push(newEntities.destination);
      }
    }
    state.destination = newEntities.destination;
  }
  if (newEntities.duration_days) state.duration_days = newEntities.duration_days;
  if (newEntities.budget) state.budget = newEntities.budget;
  if (newEntities.travel_style) state.travel_style = newEntities.travel_style;
  if (newEntities.hotel_tier) state.hotel_tier = newEntities.hotel_tier;
  if (newEntities.transport_mode) state.transport_mode = newEntities.transport_mode;
  if (newEntities.party_size) state.party_size = newEntities.party_size;
  if (newEntities.party_size_count !== undefined) state.party_size_count = newEntities.party_size_count;
  if (newEntities.travel_date) state.travel_date = newEntities.travel_date;
  if (newEntities.start_date) state.start_date = newEntities.start_date;
  if (newEntities.end_date) state.end_date = newEntities.end_date;

  if (newEntities.resolvedPlace) {
    state.lastPlace = newEntities.resolvedPlace;
    state.lastPlaceId = newEntities.resolvedPlace.id;
    if (!state.destination) {
      state.destination = newEntities.resolvedPlace.city;
    }
  }

  for (const intr of newEntities.interests) {
    if (!state.interests.includes(intr)) {
      state.interests.push(intr);
    }
  }

  // Handle natural language modification commands (Section 17)
  const queryLower = (newEntities.query_focus || '').toLowerCase();
  if (/add food|food bhi add|khana add/i.test(queryLower)) {
    if (!state.interests.includes('food')) state.interests.push('food');
  }
  if (/make it cheaper|aur sasta|kam budget|sasta karo/i.test(queryLower)) {
    state.travel_style = 'budget';
    state.hotel_tier = 'budget';
    state.transport_mode = 'train';
    if (state.budget && state.budget > 10000) {
      state.budget = Math.round(state.budget * 0.7);
    }
  } else if (/make it luxury|royal|luxury banado|five star/i.test(queryLower)) {
    state.travel_style = 'luxury';
    state.hotel_tier = 'luxury';
    state.transport_mode = 'flight';
    if (state.budget) {
      state.budget = Math.max(state.budget, 25000);
    }
  } else if (/hotel moderate|moderate hotel|hotel theek thaak/i.test(queryLower)) {
    state.hotel_tier = 'moderate';
  } else if (/travel cheap|train se jana|cheap travel/i.test(queryLower)) {
    state.transport_mode = 'train';
  } else if (/add spiritual|spiritual place add|mandir add/i.test(queryLower)) {
    if (!state.interests.includes('spiritual')) {
      state.interests.push('spiritual');
    }
  } else if (/remove shopping|shopping hatao|market mat dikhao/i.test(queryLower)) {
    state.interests = state.interests.filter((i) => i !== 'shopping');
  }

  if (/\b(?:only|sirf|bas)\s+(?:heritage|history|historical)\b/i.test(queryLower)) {
    state.interests = ['heritage'];
  } else {
    const removals: Array<[RegExp, string[]]> = [
      [/\b(?:remove|without|exclude|skip|no|hatao|mat dikhao)\s+(?:religious|spiritual|temple|mandir)\b/i, ['spiritual']],
      [/\b(?:remove|without|exclude|skip|no|hatao|mat dikhao)\s+(?:food|restaurant|culinary|khana)\b/i, ['food']],
      [/\b(?:remove|without|exclude|skip|no|hatao|mat dikhao)\s+(?:nature|wildlife|jungle)\b/i, ['nature']],
      [/\b(?:remove|without|exclude|skip|no|hatao|mat dikhao)\s+(?:shopping|market|bazaar)\b/i, ['shopping']],
      [/\b(?:remove|without|exclude|skip|no|hatao|mat dikhao)\s+(?:heritage|history|historical)\b/i, ['heritage']],
    ];
    for (const [pattern, interests] of removals) {
      if (pattern.test(queryLower)) state.interests = state.interests.filter((i) => !interests.includes(i));
    }
  }

  if (intent) state.lastIntent = intent;
  state.turnCount += 1;
  state.updatedAt = Date.now();

  memoryStore.set(sessionId, state);
  return state;
}

/**
 * Resets memory for a specific session
 */
export function resetConversationState(sessionId: string): void {
  memoryStore.delete(sessionId);
}
