import { extractEntities, INDIAN_DESTINATION_ALIASES } from './entityExtractor';
import { TripMemoryState } from './conversationMemory';
import { LiveContextPayload } from '../context/buildContextPayload';

export function understandTravel(message: string, state: TripMemoryState, context: LiveContextPayload) {
  const lower = message.toLowerCase();
  const current = lower.match(/(?:i am|i'm|im|main|mein)\s+(?:currently\s+|abhi\s+)?(?:in|at)?\s*([a-z ]+?)(?=\s+(?:right now|now|mein|me |hoon|hun|which|what)|[?.!,]|$)/)?.[1]?.trim();
  const city = current && Object.entries(INDIAN_DESTINATION_ALIASES).sort((a,b) => b[0].length-a[0].length).find(([alias]) => current === alias)?.[1];
  if (city) {
    state.currentCity = city;
    state.origin = city;
    context.userLocation = { city, source: 'Traveler stated current city' };
  } else if (state.currentCity) context.userLocation = { city: state.currentCity, source: 'Traveler stated current city' };
  else if (context.userLocation.city) state.currentCity = context.userLocation.city;
  const entities = extractEntities(message, { ...context, destination: state.destination });
  const planning = /\b(trip|itinerary|package|packet|holiday|vacation|day\s*\d+)\b|\d+[- ]?days?\b|yatra|ghumne/i.test(message);
  if (planning) {
    const explicit = Object.entries(INDIAN_DESTINATION_ALIASES).sort((a,b) => b[0].length-a[0].length)
      .find(([alias]) => new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(lower));
    if (explicit) state.destination = explicit[1];
    else if (entities.destination) state.destination = entities.destination;
    const days = lower.match(/\b(\d{1,2})\s*[- ]?\s*(?:days?|din)\b/);
    if (days) state.duration_days = Math.min(7, Math.max(1, Number(days[1])));
    if (/luxury|luxurious|premium/.test(lower)) state.travel_style = 'luxury';
    else if (/budget|cheap|affordable/.test(lower)) state.travel_style = 'budget';
    if (entities.party_size_count) state.party_size_count = entities.party_size_count;
    if (entities.budget) state.budget = entities.budget;
  }
  if (/my location|current location|near me|from here/i.test(message) && !context.userLocation.city && context.userLocation.lat === undefined) {
    context.metadata = { ...context.metadata, origin_missing: true };
    // A selected destination or saved home city is not evidence of current location.
    delete state.origin;
  }
  return { planning, entities };
}
