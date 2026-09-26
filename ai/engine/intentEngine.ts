import { resolvePlaceEntity, ResolvedPlace, QueryFocus } from './placeResolver';
import { INDIAN_DESTINATION_ALIASES } from './entityExtractor';

export type UserIntent =
  | 'GREETING'
  | 'CASUAL_CONVERSATION'
  | 'FAREWELL'
  | 'THANKS'
  | 'ABOUT_VIRASAT'
  | 'HELP'
  | 'YOU_DECIDE'
  | 'MAP_ACTION'
  | 'TICKET_BOOKING'
  | 'UNESCO_QUERY'
  | 'NATIONAL_PARK_QUERY'
  | 'HIDDEN_GEMS_QUERY'
  | 'DESTINATION_INFO'
  | 'CITY_INFO'
  | 'STATE_INFO'
  | 'UT_INFO'
  | 'TOURIST_PLACE_SEARCH'
  | 'NEARBY_SEARCH'
  | 'MONUMENT_INFO'
  | 'TRIP_PLANNING'
  | 'ITINERARY_MODIFICATION'
  | 'HOTEL_SEARCH'
  | 'HOTEL_COMPARISON'
  | 'RESTAURANT_SEARCH'
  | 'FOOD_SEARCH'
  | 'MARKET_SEARCH'
  | 'SHOPPING_SEARCH'
  | 'TRANSPORT_SEARCH'
  | 'TRAIN_SEARCH'
  | 'FLIGHT_SEARCH'
  | 'ROUTE_PLANNING'
  | 'HERITAGE_QUERY'
  | 'BUDGET_PLANNING'
  | 'WEATHER_QUERY'
  | 'TIME_QUERY'
  | 'EMERGENCY_QUERY'
  | 'FESTIVAL_QUERY'
  | 'COMPARISON'
  | 'UNKNOWN';

export interface IntentResult {
  intent: UserIntent;
  confidence: number;
  language: 'en' | 'hi_hinglish';
  isHinglish: boolean;
  rawQuery: string;
  resolvedPlace?: ResolvedPlace;
  queryFocus?: QueryFocus;
}

const INDIAN_STATES_AND_UTS = [
  'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa',
  'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka', 'kerala',
  'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland',
  'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura',
  'uttar pradesh', 'uttarakhand', 'west bengal',
  'andaman and nicobar', 'chandigarh', 'dadra and nagar haveli', 'daman and diu',
  'delhi', 'jammu and kashmir', 'ladakh', 'lakshadweep', 'puducherry'
];

/**
 * Classifies user intent and detects language style (English vs Hindi/Hinglish)
 */
function _classifyIntent(
  rawText: string,
  context?: any
): {
  intent: UserIntent;
  confidence: number;
  language: 'en' | 'hi_hinglish';
  isHinglish: boolean;
  resolvedPlace?: ResolvedPlace;
  queryFocus?: QueryFocus;
} {
  const text = (rawText || '').trim().toLowerCase();

  // Detect Hindi / Hinglish indicators
  const hinglishMarkers = [
    'kya', 'hai', 'batao', 'kaise', 'kaha', 'kar', 'karo', 'mujhe', 'hum', 'jana', 'chahiye',
    'bhai', 'yaar', 'din', 'hazar', 'kharcha', 'rupaye', 'chota', 'accha', 'badhiya', 'aaj',
    'kal', 'dekho', 'rakho', 'rakh', 'safar', 'khana', 'peena', 'ghumne', 'jagah', 'wahan',
    'waha', 'paas', 'aas paas', 'kidhar', 'kholo', 'dikhao', 'jaun', 'jaun?', 'jaunga', 'ghumna',
    'chalna', 'hona', 'hota', 'kyun', 'mein', 'me', 'dost', 'log', 'sasta', 'kam', 'sirf'
  ];
  const isHinglish = hinglishMarkers.some((m) => new RegExp(`\\b${m}\\b`, 'i').test(text));
  const language = isHinglish ? 'hi_hinglish' : 'en';

  // 1. Casual Greetings & Social
  if (/\b(hello|hi|hey|heya|namaste|namaskar|pranam|adaab|vanakkam|sasriakal)\b/i.test(text)) {
    if (/(kaise ho|how are you|kya haal|whats up|sup|sab badhiya|kya chal raha hai)/i.test(text)) {
      return { intent: 'CASUAL_CONVERSATION', confidence: 0.98, language, isHinglish };
    }
    return { intent: 'GREETING', confidence: 0.99, language, isHinglish };
  }
  if (/(kaise ho|how are you|kya haal|whats up|sup|sab badhiya|kya chal raha hai)/i.test(text)) {
    return { intent: 'CASUAL_CONVERSATION', confidence: 0.98, language, isHinglish };
  }
  if (/\b(bye|alvida|goodbye|see you|tata|baad me baat karte|chalta hu)\b/i.test(text)) {
    return { intent: 'FAREWELL', confidence: 0.98, language, isHinglish };
  }
  if (/\b(thank you|thanks|shukriya|dhanyawad|dhanyavaad|thx)\b/i.test(text)) {
    return { intent: 'THANKS', confidence: 0.98, language, isHinglish };
  }
  if (/(what is this|who are you|tum kaun ho|ye kya hai|what is virasat|virasat kya hai|about virasat|introduce yourself)/i.test(text)) {
    return { intent: 'ABOUT_VIRASAT', confidence: 0.95, language, isHinglish };
  }
  if (/^(help|madad|what can you do|tum kya kar sakte ho|features batao|options batao)[\s!.]*$/i.test(text)) {
    return { intent: 'HELP', confidence: 0.95, language, isHinglish };
  }

  // 2. Direct Website Navigation / Map Action ("Map kholo", "Iska map dikhao", "Show map")
  if (
    /(map kholo|kholo map|map dikhao|show on map|open map|view map|map pe dikhao|map par dikhao|map open karo|iska map|is itinerary ka map kholo|route map|map par dekhe|open the map)/i.test(text)
  ) {
    return { intent: 'MAP_ACTION', confidence: 0.99, language, isHinglish };
  }

  // 3. Ticket Booking / Reservation Links ("Ticket kahan book hoga?", "Train ka ticket kahan book hoga?")
  if (
    /(ticket kahan book|ticket book|kahan book hoga|irctc ticket|railway ticket book|train ticket book|flight ticket book|entry ticket|ticket booking|kahan book karna hai|booking link|ticket kahan se)/i.test(text)
  ) {
    return { intent: 'TICKET_BOOKING', confidence: 0.98, language, isHinglish };
  }

  // 4. UNESCO World Heritage Sites Query
  if (
    /(unesco|world heritage site|world heritage sites|unesco sites|unesco monuments|unesco list)/i.test(text)
  ) {
    return { intent: 'UNESCO_QUERY', confidence: 0.97, language, isHinglish };
  }

  // 5. National Parks & Wildlife Sanctuaries ("Kaziranga National Park kis state mein hai?")
  if (
    /(national park|wildlife sanctuary|tiger reserve|bird sanctuary|kaziranga|jim corbett|ranthambore|gir national park|periyar|kanha|bandhavgarh|sundarbans national)/i.test(text)
  ) {
    return { intent: 'NATIONAL_PARK_QUERY', confidence: 0.97, language, isHinglish };
  }

  // 6. Hidden Gems Query ("Udaipur ke hidden gems batao", "hidden gems near Udaipur")
  if (
    /(hidden gem|hidden gems|offbeat|lesser known|secret spots|undiscovered)/i.test(text)
  ) {
    return { intent: 'HIDDEN_GEMS_QUERY', confidence: 0.96, language, isHinglish };
  }

  // 7. Resolve place/monument entity from query or conversation memory
  const placeResult = resolvePlaceEntity(rawText, context);
  const resolvedPlace = placeResult ? placeResult.place : undefined;
  const queryFocus = placeResult ? placeResult.queryFocus : undefined;

  // 8. "You Decide" Mode (Section 36)
  if (/(you decide|tum decide karo|kaha jau|suggest me a place|kaha jana chahiye|any destination|decide for me)/i.test(text)) {
    return { intent: 'YOU_DECIDE', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 9. Comparison (e.g. Jaipur vs Udaipur, Train vs Flight)
  if (/\bvs\b|\bversus\b|compare|which is better|kisme jau|kaun sa accha hai/i.test(text)) {
    if (/hotel/i.test(text)) return { intent: 'HOTEL_COMPARISON', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
    return { intent: 'COMPARISON', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 10. Itinerary Modification (incremental turns like "Budget 5000 kar do", "Ab sirf heritage places include karo")
  if (
    /(make it cheaper|make it luxury|hotel moderate|travel cheap|add spiritual|add a spiritual|add food|food bhi add|remove shopping|add udaipur|remove udaipur|final budget|ab final budget|recalculate|aur sasta|kam budget|spiritual place add|free day|start at \d+|budget \d+\s*(?:kar do|karo|rakho|rakh do|chahiye)|budget \d+k\b|sirf heritage|heritage places only|sirf heritage places)/i.test(text) &&
    !/(itinerary bana|trip bana|plan bana|itinerary create)/i.test(text)
  ) {
    return { intent: 'ITINERARY_MODIFICATION', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 11. Trip Planning (multi-day or 1-day plans like "Mujhe Jaipur ghumna hai 2 din mein", "Budget 5000 hai, 3 friends hain, itinerary bana")
  if (
    /(plan a trip|plan trip|itinerary|trip bana|tour plan|circuit|day trip|\d+\s*(?:day|days|din)(?:\s*(?:mein|me|ka|ke liye|trip|plan))?|1 din ka plan|ek din ka plan|one day plan|ghumne ka plan|itinerary bana|ghumna hai \d+\s*din|\d+\s*friends)/i.test(text)
  ) {
    return { intent: 'TRIP_PLANNING', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 12. Festivals & Cultural Fairs ("Mysore Dasara kab hota hai", "Durga Puja ka cultural significance", "Is festival ka origin kya hai?")
  if (
    /(festival|festivals|mela|events|fair|utsav|aarti|celebration|timing|dasara|durga puja|diwali|holi|bihu|onam|chhath|pushkar|hornbill|hemis|kumbh|navaratri|eid|christmas|losar|baisakhi|pongal|origin kya hai|is festival ka origin|cultural significance|kyun famous hai|kab hota hai)/i.test(text)
  ) {
    return { intent: 'FESTIVAL_QUERY', confidence: 0.96, language, isHinglish };
  }

  // 13. Hotels / Stays (e.g. "Nearby hotels dikhao", "Gateway of India ke paas hotel batao", "ab hotel bata", "hotels in Jaipur")
  if (/(hotel|hotels|resort|resorts|stay|stays|lodge|dharamshala|guest house|accommodation|room|rukne ki jagah)/i.test(text)) {
    return { intent: 'HOTEL_SEARCH', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 14. Nearby Search ("nearby kya hai?", "wahan aur kya hai?", "explore near me")
  if (
    queryFocus === 'nearby' ||
    /(near me|nearby|aas paas|mere paas|close by|around here|explore near me|wahan aur kya|waha aur kya|wahan kya|is ke paas)/i.test(text)
  ) {
    return { intent: 'NEARBY_SEARCH', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 15. Food / Restaurants / Culinary (e.g. "Gateway of India ke paas food", "food in Jaipur")
  if (/(food|restaurant|restaurants|dish|dishes|cuisine|khana|sweets|mithai|street food|thali|biryani|chaat|famous food)/i.test(text)) {
    return { intent: 'FOOD_SEARCH', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 16. Markets / Shopping
  if (/(market|markets|bazaar|bazaars|shopping|shop|kharidari|handicrafts|souvenirs|silk|pottery|bapu bazaar|johari bazaar)/i.test(text)) {
    return { intent: 'SHOPPING_SEARCH', confidence: 0.92, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 17. Transport / Train / Flight / Distance / How to reach ("Mumbai se Goa train se kaise jaun?", "Mumbai se Pune train se kaise jaun?", "Wahan kaise pahuchenge?")
  if (
    queryFocus === 'how_to_reach' ||
    /(train|railway|irctc|flight|airport|flight ticket|bus|cab|taxi|kaise jaun|kaise jaaun|how to reach|kaise jaye|kaise pahunche|wahan kaise pahuchenge|route|safar|distance between|kitni door|train se)/i.test(text)
  ) {
    if (/train|railway|train se/i.test(text)) return { intent: 'TRAIN_SEARCH', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
    if (/flight|airport/i.test(text)) return { intent: 'FLIGHT_SEARCH', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
    return { intent: 'TRANSPORT_SEARCH', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 18. Budget
  if (/(budget|cost|expense|kitna kharcha|total cost|kitne paise|estimate|price breakdown)/i.test(text)) {
    return { intent: 'BUDGET_PLANNING', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 19. Weather / Climate / Best time
  if (/(weather|climate|temperature|mausam|garmi|sardi|baarish|rain|best time to visit|kab jana chahiye)/i.test(text)) {
    return { intent: 'WEATHER_QUERY', confidence: 0.95, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 20. Current Time / What is open / Tomorrow options ("Kal ke liye kya options hain?")
  if (queryFocus === 'timing' || /(open right now|what can i do now|tonight|aaj raat|abhi kya|what's open|timing right now|kal ke liye kya options|kal kya kare|tomorrow options)/i.test(text)) {
    return { intent: 'TIME_QUERY', confidence: 0.92, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 21. Emergency & Helplines
  if (/(emergency|police|hospital|doctor|helpline|tourist police|safety|madad|112|1363)/i.test(text)) {
    return { intent: 'EMERGENCY_QUERY', confidence: 0.98, language, isHinglish };
  }

  // 22. Direct Monument / Heritage query (A specific place was resolved!)
  if (resolvedPlace) {
    return { intent: 'MONUMENT_INFO', confidence: 0.99, language, isHinglish, resolvedPlace, queryFocus };
  }

  // 23. Rejection of a location (e.g. "no panvel nahi bhai", "panvel nahi", "not panvel")
  if (/(?:no|nahi|not)\s+[a-zA-Z\s]+?(?:nahi|bhai|yaar)?$/i.test(text) || /^[a-zA-Z\s]+?\s+nahi\b/i.test(text)) {
    return { intent: 'CASUAL_CONVERSATION', confidence: 0.98, language, isHinglish };
  }

  // 24. Destination / City Inquiry (e.g. "chennai ghumna hain mujhe", "ke Channi ghoom sakta hun main", "chennai", "delhi??")
  const cleanedSingleWord = text.replace(/[?!.,;]/g, '').trim();
  if (INDIAN_DESTINATION_ALIASES[cleanedSingleWord]) {
    return { intent: 'DESTINATION_INFO', confidence: 0.98, language, isHinglish };
  }

  // Check if any destination alias exists with travel verbs ("ghumna", "ghoom", "visit", "trip", "explore")
  for (const alias of Object.keys(INDIAN_DESTINATION_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`, 'i').test(text)) {
      if (/(ghoom|ghumna|visit|explore|travel|trip|tour|jana|ja sakte|ghumte|chalna)/i.test(text)) {
        return { intent: 'DESTINATION_INFO', confidence: 0.96, language, isHinglish };
      }
    }
  }

  // 25. State / UT Query
  for (const reg of INDIAN_STATES_AND_UTS) {
    if (new RegExp(`\\b${reg}\\b`, 'i').test(text)) {
      return { intent: 'STATE_INFO', confidence: 0.95, language, isHinglish };
    }
  }

  // 26. General Destination / City match
  for (const alias of Object.keys(INDIAN_DESTINATION_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`, 'i').test(text)) {
      return { intent: 'DESTINATION_INFO', confidence: 0.92, language, isHinglish };
    }
  }

  // 27. Monuments / Heritage generic keywords
  if (/(fort|palace|temple|monument|mandir|masjid|church|gurudwara|caves|stupa|tomb|history|itihaas|architecture|heritage)/i.test(text)) {
    return { intent: 'HERITAGE_QUERY', confidence: 0.88, language, isHinglish };
  }

  // 28. Destination / City info
  if (/(tell me about|ke baare mein|k baare main|ke baare me|k bare me|ke bare mein|janna hai|explore|visit)/i.test(text)) {
    return { intent: 'DESTINATION_INFO', confidence: 0.85, language, isHinglish };
  }

  return { intent: 'UNKNOWN', confidence: 0.4, language, isHinglish };
}

export function detectIntent(rawText: string, context?: any): IntentResult {
  const result = _classifyIntent(rawText, context);
  return {
    ...result,
    rawQuery: rawText || '',
  };
}
