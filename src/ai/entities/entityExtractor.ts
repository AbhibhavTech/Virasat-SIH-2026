/**
 * Entity Extractor for Virasat AI Assistant
 * Extracts origins, destinations, duration, budget, transit mode, preferences, and traveller types.
 */

import { AIRequest, ExtractedEntities } from '../types';
import { canonicalizeLocation } from '../utils/locationHelper';

export function extractEntities(request: AIRequest): ExtractedEntities {
  const text = (request.message || '').trim();
  const lower = text.toLowerCase();

  const entities: ExtractedEntities = {
    places: [],
    cities: [],
    states: [],
    stations: [],
  };

  // 1. Origin and Destination Extraction
  // Patterns:
  // "from <origin> to <destination>"
  // "between <origin> and <destination>"
  // "how to reach <destination> from <origin>"
  // "मुंबई से दिल्ली कैसे जाऊं"
  // "CSMT se Churchgate kaise jaaun"
  const devanagariRouteMatch = text.match(/([^\s,?.!]+)\s+से\s+([^\s,?.!]+)\s+कैसे/);
  const seKaiseMatch = lower.match(/\b([a-z0-9\s.]+?)\s+se\s+([a-z0-9\s.]+?)\s+kaise/i);
  const fromToMatch = lower.match(/\bfrom\s+([^,?.!\n]+?)\s+to\s+([^,?.!\n]+)/i);
  const reachFromMatch = lower.match(/\b(?:reach|go to|travel to)\s+([^,?.!\n]+?)\s+from\s+([^,?.!\n]+)/i);
  const betweenMatch = lower.match(/\bbetween\s+([^,?.!\n]+?)\s+and\s+([^,?.!\n]+)/i);
  const directToMatch = lower.match(/\b([a-z0-9\s.]+?)\s+(?:to|se|te)\s+([a-z0-9\s.]+?)(?:\s+(?:kaise|kasa|route|travel|taxi|auto|train|distance|fare)|\?|$)/i);

  if (devanagariRouteMatch) {
    entities.origin = cleanEntityString(devanagariRouteMatch[1]);
    entities.destination = cleanEntityString(devanagariRouteMatch[2]);
  } else if (seKaiseMatch) {
    entities.origin = cleanEntityString(seKaiseMatch[1]);
    entities.destination = cleanEntityString(seKaiseMatch[2]);
  } else if (reachFromMatch) {
    entities.destination = cleanEntityString(reachFromMatch[1]);
    entities.origin = cleanEntityString(reachFromMatch[2]);
  } else if (fromToMatch) {
    entities.origin = cleanEntityString(fromToMatch[1]);
    entities.destination = cleanEntityString(fromToMatch[2]);
  } else if (betweenMatch) {
    entities.origin = cleanEntityString(betweenMatch[1]);
    entities.destination = cleanEntityString(betweenMatch[2]);
  } else if (directToMatch && !lower.includes('best time to visit') && !lower.includes('how to')) {
    const rawOrig = cleanEntityString(directToMatch[1]);
    const rawDest = cleanEntityString(directToMatch[2]);
    if (rawOrig.length >= 3 && rawDest.length >= 3 && !['how', 'way', 'where', 'when'].includes(rawOrig)) {
      entities.origin = rawOrig;
      entities.destination = rawDest;
    }
  }

  // Check travel_context overrides or fallbacks
  if (!entities.origin && request.travel_context?.origin) {
    entities.origin = request.travel_context.origin;
  }
  if (!entities.destination && request.travel_context?.destination) {
    entities.destination = request.travel_context.destination;
  }
  if (!entities.destination && request.place_name) {
    entities.destination = request.place_name;
  }
  if (!entities.destination && request.city) {
    entities.destination = request.city;
  }

  // Scan text for common cities, regions, and monuments if destination still not found
  if (!entities.destination) {
    const knownEntities: Array<{ pattern: RegExp; canonical: string }> = [
      { pattern: /\b(leh\s*ladakh|ladakh|leh)\b/i, canonical: 'Leh Ladakh' },
      { pattern: /\b(amritsar)\b/i, canonical: 'Amritsar' },
      { pattern: /\b(udaipur)\b/i, canonical: 'Udaipur' },
      { pattern: /\b(jaipur)\b/i, canonical: 'Jaipur' },
      { pattern: /\b(varanasi|kashi|banaras)\b/i, canonical: 'Varanasi' },
      { pattern: /\b(agra|taj\s*mahal|ताज\s*महल|ताजमहल)\b/i, canonical: 'Agra' },
      { pattern: /\b(mumbai|bombay|मुंबई)\b/i, canonical: 'Mumbai' },
      { pattern: /\b(delhi|new\s*delhi|dilli|दिल्ली)\b/i, canonical: 'Delhi' },
      { pattern: /\b(goa)\b/i, canonical: 'Goa' },
      { pattern: /\b(kochi|cochin|kerala)\b/i, canonical: 'Kochi' },
      { pattern: /\b(ajanta|ellora|aurangabad|अजिंठा|अजंता)\b/i, canonical: 'Ajanta' },
      { pattern: /\b(qutub\s*minar|qutab\s*minar)\b/i, canonical: 'Qutub Minar' },
      { pattern: /\b(city\s*palace)\b/i, canonical: 'City Palace' },
      { pattern: /\b(amber\s*fort|amer\s*fort)\b/i, canonical: 'Amber Fort' },
    ];

    for (const ke of knownEntities) {
      if (ke.pattern.test(lower)) {
        entities.destination = ke.canonical;
        break;
      }
    }

    if (!entities.destination) {
      const canon = canonicalizeLocation(text);
      if (canon && canon !== text) {
        entities.destination = canon;
      }
    }
  }

  if (entities.origin) {
    entities.origin = canonicalizeLocation(entities.origin);
  }
  if (entities.destination) {
    entities.destination = canonicalizeLocation(entities.destination);
  }

  // 2. Duration / Days extraction
  const daysMatch = lower.match(/(\d+)\s*(?:-|–|\s*)?(?:days?|divas|din|d)\b/i) || lower.match(/(\d+)\s*दिन/i);
  const weekendMatch = lower.match(/\b(weekend|2 days)\b/i);
  const oneDayMatch = lower.match(/\b(1 day|one day|same day|single day)\b/i);
  const weekMatch = lower.match(/\b(1 week|one week|7 days)\b/i);

  if (daysMatch) {
    entities.days = parseInt(daysMatch[1], 10);
  } else if (weekendMatch) {
    entities.days = 2;
  } else if (oneDayMatch) {
    entities.days = 1;
  } else if (weekMatch) {
    entities.days = 7;
  } else if (request.travel_context?.days) {
    entities.days = request.travel_context.days;
  }

  // 3. Budget extraction (handles "budget 30k", "under 3000", "₹30,000", "20k")
  const kBudgetMatch = lower.match(/(?:budget|under|below|within|upto|₹|rs\.?|inr)?\s*(\d+)\s*k\b/i);
  const budgetMatch = lower.match(/(?:under|below|budget of|budget|within|upto|up to|₹|rs\.?|inr)\s*(\d[\d,.]*)/i);
  if (kBudgetMatch) {
    entities.budget = parseInt(kBudgetMatch[1], 10) * 1000;
  } else if (budgetMatch) {
    const cleanBudget = budgetMatch[1].replace(/,/g, '');
    entities.budget = parseFloat(cleanBudget);
  } else if (request.travel_context?.budget) {
    entities.budget = request.travel_context.budget;
  }

  // 4. Traveller type
  if (/\b(family|kids|children|parents|elderly)\b/i.test(lower)) {
    entities.traveller_type = 'family';
  } else if (/\b(solo|alone|myself)\b/i.test(lower)) {
    entities.traveller_type = 'solo';
  } else if (/\b(couple|honeymoon|romantic|partner)\b/i.test(lower)) {
    entities.traveller_type = 'couple';
  } else if (/\b(friends|buddies|group)\b/i.test(lower)) {
    entities.traveller_type = 'friends';
  } else if (/\b(budget|backpacker|cheap|hostel)\b/i.test(lower)) {
    entities.traveller_type = 'budget';
  } else if (request.travel_context?.traveller_type) {
    entities.traveller_type = request.travel_context.traveller_type;
  }

  // 5. Pace
  if (/\b(relaxed|slow|easy|leisure|chill)\b/i.test(lower)) {
    entities.pace = 'relaxed';
  } else if (/\b(fast|packed|express|cover everything|maximum)\b/i.test(lower)) {
    entities.pace = 'fast';
  } else if (request.travel_context?.pace) {
    entities.pace = request.travel_context.pace;
  } else {
    entities.pace = 'moderate';
  }

  // 6. Transit Mode
  if (/\b(train|railway|local train|suburban|express|vande bharat|shatabdi|rajdhani)\b/i.test(lower)) {
    entities.transit_mode = 'train';
  } else if (/\b(flight|air|plane|airport)\b/i.test(lower)) {
    entities.transit_mode = 'air';
  } else if (/\b(cab|taxi|uber|ola|drive|car)\b/i.test(lower)) {
    entities.transit_mode = 'taxi';
  } else if (/\b(auto|rickshaw|tuk tuk)\b/i.test(lower)) {
    entities.transit_mode = 'auto';
  } else if (/\b(bus|state transport|msrtc|dtc)\b/i.test(lower)) {
    entities.transit_mode = 'bus';
  } else if (/\b(metro)\b/i.test(lower)) {
    entities.transit_mode = 'metro';
  } else if (/\b(walk|walking|foot|pedestrian)\b/i.test(lower)) {
    entities.transit_mode = 'walking';
  } else {
    entities.transit_mode = 'all';
  }

  // 7. Food preferences
  const foodPrefs: string[] = [];
  if (/\b(pure veg|vegetarian|jain|shakahari)\b/i.test(lower)) foodPrefs.push('Vegetarian');
  if (/\b(non veg|chicken|mutton|fish|seafood)\b/i.test(lower)) foodPrefs.push('Non-Vegetarian');
  if (/\b(street food|chaat|snacks)\b/i.test(lower)) foodPrefs.push('Street Food');
  if (/\b(sweet|mithai|dessert)\b/i.test(lower)) foodPrefs.push('Sweets');
  if (foodPrefs.length > 0) entities.food_preferences = foodPrefs;

  // 8. Accessibility needs
  const accessNeeds: string[] = [];
  if (/\b(wheelchair|ramp|step-free|handicap)\b/i.test(lower)) accessNeeds.push('Wheelchair Access');
  if (/\b(lift|elevator)\b/i.test(lower)) accessNeeds.push('Elevator / Lift');
  if (/\b(elderly|senior citizen)\b/i.test(lower)) accessNeeds.push('Senior Friendly');
  if (accessNeeds.length > 0) entities.accessibility_needs = accessNeeds;

  // 9. Replanning action
  if (/\b(make it cheaper|reduce budget|cut cost|budget)\b/i.test(lower)) {
    entities.replanning_action = 'reduce_budget';
  } else if (/\b(add another monument|add more|another temple|another palace)\b/i.test(lower)) {
    entities.replanning_action = 'add_monument';
  } else if (/\b(less walking|reduce walking|wheelchair|elderly)\b/i.test(lower)) {
    entities.replanning_action = 'reduce_walking';
  } else if (/\b(family friendly|kids)\b/i.test(lower)) {
    entities.replanning_action = 'family_friendly';
  }

  return entities;
}

function cleanEntityString(str: string): string {
  if (!str) return '';
  return str
    .replace(/^(the|a|an)\s+/i, '')
    .replace(/\s+(by|via|in|using|on)\s+.*$/i, '')
    .replace(/[?.!,]+$/, '')
    .trim();
}
