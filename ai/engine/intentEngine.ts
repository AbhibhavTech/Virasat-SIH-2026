export type UserIntent =
  | 'GREETING'
  | 'CASUAL_CONVERSATION'
  | 'FAREWELL'
  | 'THANKS'
  | 'ABOUT_VIRASAT'
  | 'HELP'
  | 'YOU_DECIDE'
  | 'DESTINATION_INFO'
  | 'CITY_INFO'
  | 'STATE_INFO'
  | 'UT_INFO'
  | 'TOURIST_PLACE_SEARCH'
  | 'NEARBY_SEARCH'
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
function _classifyIntent(rawText: string, context?: any): { intent: UserIntent; confidence: number; language: 'en' | 'hi_hinglish'; isHinglish: boolean } {
  const text = (rawText || '').trim().toLowerCase();

  // Detect Hindi / Hinglish indicators
  const hinglishMarkers = [
    'kya', 'hai', 'batao', 'kaise', 'kaha', 'kar', 'karo', 'mujhe', 'hum', 'jana', 'chahiye',
    'bhai', 'yaar', 'din', 'hazar', 'kharcha', 'rupaye', 'chota', 'accha', 'badhiya', 'aaj',
    'kal', 'dekho', 'rakho', 'rakh', 'safar', 'khana', 'peena', 'ghumne', 'jagah'
  ];
  const isHinglish = hinglishMarkers.some((m) => new RegExp(`\\b${m}\\b`, 'i').test(text));
  const language = isHinglish ? 'hi_hinglish' : 'en';

  // 1. Casual Greetings & Social
  if (/^(hello|hi|hey|heya|namaste|namaskar|pranam|adaab|vanakkam|sasriakal)[\s!.]*$/i.test(text)) {
    return { intent: 'GREETING', confidence: 0.99, language, isHinglish };
  }
  if (/^(kaise ho|how are you|kya haal|whats up|sup|sab badhiya|kya chal raha hai)[\s!?.]*$/i.test(text)) {
    return { intent: 'CASUAL_CONVERSATION', confidence: 0.98, language, isHinglish };
  }
  if (/^(bye|alvida|goodbye|see you|tata|baad me baat karte|chalta hu)[\s!.]*$/i.test(text)) {
    return { intent: 'FAREWELL', confidence: 0.98, language, isHinglish };
  }
  if (/^(thank you|thanks|shukriya|dhanyawad|dhanyavaad|thx)[\s!.]*$/i.test(text)) {
    return { intent: 'THANKS', confidence: 0.98, language, isHinglish };
  }
  if (/(what is this|who are you|tum kaun ho|ye kya hai|virasat kya hai|about virasat|introduce yourself)/i.test(text)) {
    return { intent: 'ABOUT_VIRASAT', confidence: 0.95, language, isHinglish };
  }
  if (/^(help|madad|what can you do|tum kya kar sakte ho|features batao|options batao)[\s!.]*$/i.test(text)) {
    return { intent: 'HELP', confidence: 0.95, language, isHinglish };
  }

  // 2. "You Decide" Mode (Section 36)
  if (/(you decide|tum decide karo|kaha jau|suggest me a place|kaha jana chahiye|any destination|decide for me)/i.test(text)) {
    return { intent: 'YOU_DECIDE', confidence: 0.95, language, isHinglish };
  }

  // 3. Itinerary Modification (incremental turns)
  if (
    /(make it cheaper|make it luxury|hotel moderate|travel cheap|add spiritual|remove shopping|add udaipur|remove udaipur|final budget|recalculate|aur sasta|kam budget|spiritual place add|free day|start at \d+)/i.test(text)
  ) {
    return { intent: 'ITINERARY_MODIFICATION', confidence: 0.95, language, isHinglish };
  }

  // 4. Comparison (e.g. Jaipur vs Udaipur, Train vs Flight)
  if (/\bvs\b|\bversus\b|compare|which is better|kisme jau|kaun sa accha hai/i.test(text)) {
    if (/hotel/i.test(text)) return { intent: 'HOTEL_COMPARISON', confidence: 0.95, language, isHinglish };
    return { intent: 'COMPARISON', confidence: 0.95, language, isHinglish };
  }

  // 5. Trip Planning
  if (
    /(plan a trip|plan trip|itinerary|trip bana|tour plan|circuit|day trip|\d+\s*(?:day|days|din)\s*(?:trip|plan)|ghumne ka plan)/i.test(text)
  ) {
    return { intent: 'TRIP_PLANNING', confidence: 0.92, language, isHinglish };
  }

  // 6. Nearby Search
  if (/(near me|nearby|aas paas|mere paas|close by|around here|explore near me)/i.test(text)) {
    return { intent: 'NEARBY_SEARCH', confidence: 0.95, language, isHinglish };
  }

  // 7. Hotels / Stays
  if (/(hotel|hotels|resort|resorts|stay|stays|lodge|dharamshala|guest house|accommodation|room|rukne ki jagah)/i.test(text)) {
    return { intent: 'HOTEL_SEARCH', confidence: 0.95, language, isHinglish };
  }

  // 8. Food / Restaurants / Culinary
  if (/(food|restaurant|restaurants|dish|dishes|cuisine|khana|sweets|mithai|street food|thali|biryani|chaat|famous food)/i.test(text)) {
    return { intent: 'FOOD_SEARCH', confidence: 0.92, language, isHinglish };
  }

  // 9. Markets / Shopping
  if (/(market|markets|bazaar|bazaars|shopping|shop|kharidari|handicrafts|souvenirs|silk|pottery|bapu bazaar|johari bazaar)/i.test(text)) {
    return { intent: 'SHOPPING_SEARCH', confidence: 0.92, language, isHinglish };
  }

  // 10. Transport / Train / Flight / Distance
  if (/(train|railway|irctc|flight|airport|flight ticket|bus|cab|taxi|kaise jau|how to reach|how to travel|route|safar|distance between|kitni door)/i.test(text)) {
    if (/train|railway/i.test(text)) return { intent: 'TRAIN_SEARCH', confidence: 0.95, language, isHinglish };
    if (/flight|airport/i.test(text)) return { intent: 'FLIGHT_SEARCH', confidence: 0.95, language, isHinglish };
    return { intent: 'TRANSPORT_SEARCH', confidence: 0.92, language, isHinglish };
  }

  // 11. Budget
  if (/(budget|cost|expense|kitna kharcha|total cost|kitne paise|estimate|price breakdown)/i.test(text)) {
    return { intent: 'BUDGET_PLANNING', confidence: 0.95, language, isHinglish };
  }

  // 12. Weather / Climate / Best time
  if (/(weather|climate|temperature|mausam|garmi|sardi|baarish|rain|best time to visit|kab jana chahiye)/i.test(text)) {
    return { intent: 'WEATHER_QUERY', confidence: 0.95, language, isHinglish };
  }

  // 13. Current Time / What is open
  if (/(open right now|what can i do now|tonight|aaj raat|abhi kya|what's open|timing right now)/i.test(text)) {
    return { intent: 'TIME_QUERY', confidence: 0.92, language, isHinglish };
  }

  // 14. Emergency & Helplines
  if (/(emergency|police|hospital|doctor|helpline|tourist police|safety|madad|112|1363)/i.test(text)) {
    return { intent: 'EMERGENCY_QUERY', confidence: 0.98, language, isHinglish };
  }

  // 15. Festivals & Cultural Fairs
  if (/(festival|festivals|mela|events|fair|utsav|aarti|celebration|timing)/i.test(text)) {
    return { intent: 'FESTIVAL_QUERY', confidence: 0.95, language, isHinglish };
  }

  // 16. State / UT Query
  for (const reg of INDIAN_STATES_AND_UTS) {
    if (text.includes(reg)) {
      if (/(best places in|attractions in|places to visit in|places in|ghumne ki jagah)/i.test(text)) {
        return { intent: 'STATE_INFO', confidence: 0.90, language, isHinglish };
      }
    }
  }

  // 17. Monuments / Heritage Query
  if (/(fort|palace|temple|monument|mandir|masjid|church|gurudwara|caves|stupa|tomb|history|itihaas|architecture)/i.test(text)) {
    return { intent: 'HERITAGE_QUERY', confidence: 0.88, language, isHinglish };
  }

  // 18. Destination / City info
  if (/(tell me about|ke baare mein|ke baare me|janna hai|explore|visit)/i.test(text)) {
    return { intent: 'DESTINATION_INFO', confidence: 0.85, language, isHinglish };
  }

  return { intent: 'DESTINATION_INFO', confidence: 0.5, language, isHinglish };
}

export function detectIntent(rawText: string, context?: any): IntentResult {
  const result = _classifyIntent(rawText, context);
  return {
    ...result,
    rawQuery: rawText || '',
  };
}
