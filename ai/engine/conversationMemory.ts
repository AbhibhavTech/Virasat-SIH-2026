import { ExtractedEntities } from './entityExtractor';
import { ResolvedPlace } from './placeResolver';

export interface TripMemoryState {
  sessionId: string;
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
  lastPlace?: ResolvedPlace;
  lastPlaceId?: string;
  lastItinerary?: any;
  lastPlaces?: any[];
  lastHotels?: any[];
  lastIntent?: string;
  turnCount: number;
  updatedAt: number;
}

const memoryStore = new Map<string, TripMemoryState>();

/**
 * Retrieves or creates a structured conversation state for a session
 */
export function getConversationState(sessionId: string): TripMemoryState {
  let state = memoryStore.get(sessionId);
  if (!state) {
    state = {
      sessionId,
      currency: 'INR',
      interests: [],
      turnCount: 0,
      updatedAt: Date.now(),
    };
    memoryStore.set(sessionId, state);
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

  if (newEntities.origin) state.origin = newEntities.origin;
  if (newEntities.destination) {
    // If state already had destination and user adds another, handle multi-city
    if (state.destination && state.destination.toLowerCase() !== newEntities.destination.toLowerCase()) {
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
