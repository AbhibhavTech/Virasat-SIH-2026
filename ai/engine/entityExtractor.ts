export interface ExtractedEntities {
  destination?: string;
  origin?: string;
  state?: string;
  duration_days?: number;
  budget?: number;
  currency: string;
  travel_style?: 'budget' | 'moderate' | 'luxury';
  hotel_tier?: 'budget' | 'moderate' | 'luxury';
  transport_mode?: 'train' | 'flight' | 'road' | 'bus';
  interests: string[];
  party_size?: string;
  query_focus?: string;
}

const COMMON_ORIGINS = [
  'mumbai', 'delhi', 'new delhi', 'bangalore', 'bengaluru', 'kolkata', 'chennai',
  'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'chandigarh', 'patna',
  'surat', 'indore', 'bhopal', 'nagpur', 'kochi', 'guwahati'
];

const KNOWN_DESTINATIONS = [
  'jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'agra', 'varanasi', 'delhi', 'new delhi',
  'mumbai', 'goa', 'hampi', 'mysuru', 'mysore', 'kochi', 'munnar', 'shimla', 'manali',
  'dharamshala', 'leh', 'ladakh', 'srinagar', 'rishikesh', 'haridwar', 'amritsar',
  'khajuraho', 'bhubaneswar', 'puri', 'konark', 'madurai', 'thanjavur', 'mahabalipuram',
  'darjeeling', 'gangtok', 'shillong', 'kaziranga', 'gwalior', 'orchha', 'bhopal',
  'hyderabad', 'aurangabad', 'ajanta', 'ellora', 'port blair', 'kavaratti', 'pondicherry', 'puducherry'
];

/**
 * Extracts travel entities from natural language query
 */
export function extractEntities(rawText: string, existingContext?: any): ExtractedEntities {
  const text = (rawText || '').trim().toLowerCase();

  const entities: ExtractedEntities = {
    currency: 'INR',
    interests: [],
  };

  // 1. Duration Extraction (e.g., "3 din", "3 days", "5 day", "weekend")
  const dayMatch = text.match(/(\d+)\s*(?:day|days|din|raat|nights)/i);
  if (dayMatch) {
    entities.duration_days = parseInt(dayMatch[1], 10);
  } else if (/weekend/i.test(text)) {
    entities.duration_days = 2;
  }

  // 2. Budget Extraction (e.g., "15k", "15000", "₹15000", "15000 rs", "15 hazaar")
  const kBudgetMatch = text.match(/(\d+)\s*k\b/i);
  const numberBudgetMatch = text.match(/(?:₹|rs\.?|inr|budget)?\s*(\d{4,6})\b/i);
  const hazarBudgetMatch = text.match(/(\d+)\s*(?:hazar|hazaar)\b/i);

  if (kBudgetMatch) {
    entities.budget = parseInt(kBudgetMatch[1], 10) * 1000;
  } else if (hazarBudgetMatch) {
    entities.budget = parseInt(hazarBudgetMatch[1], 10) * 1000;
  } else if (numberBudgetMatch) {
    entities.budget = parseInt(numberBudgetMatch[1], 10);
  }

  // 3. Origin & Destination Extraction
  // Pattern: "from X to Y", "X se Y", "X to Y"
  const fromToMatch = text.match(/(?:from|se|starting from)\s+([a-zA-Z\s]+?)\s+(?:to|tak|jana hai|travel to)\s+([a-zA-Z\s]+)/i);
  if (fromToMatch) {
    entities.origin = fromToMatch[1].trim();
    entities.destination = fromToMatch[2].trim();
  } else {
    // Check for origin indicators ("Mumbai se", "from Delhi")
    for (const o of COMMON_ORIGINS) {
      if (new RegExp(`(?:from|se)\\s+${o}\\b|\\b${o}\\s+se\\b`, 'i').test(text)) {
        entities.origin = o.charAt(0).toUpperCase() + o.slice(1);
        break;
      }
    }

    // Check for known destination mentions
    for (const d of KNOWN_DESTINATIONS) {
      if (new RegExp(`\\b${d}\\b`, 'i').test(text)) {
        // If it's not the already identified origin
        if (!entities.origin || entities.origin.toLowerCase() !== d) {
          entities.destination = d.charAt(0).toUpperCase() + d.slice(1);
          break;
        }
      }
    }
  }

  // 4. Travel Style & Hotel Preference
  if (/luxury|five star|5 star|heritage palace|royal/i.test(text)) {
    entities.travel_style = 'luxury';
    entities.hotel_tier = 'luxury';
  } else if (/cheap|cheaper|sasta|low budget|kam budget|hostel|dharamshala/i.test(text)) {
    entities.travel_style = 'budget';
    entities.hotel_tier = 'budget';
  } else if (/moderate|mid range|3 star|normal|theek thaak/i.test(text)) {
    entities.travel_style = 'moderate';
    entities.hotel_tier = 'moderate';
  }

  // 5. Transport Mode
  if (/train|railway|irctc|sleeper|vande bharat/i.test(text)) {
    entities.transport_mode = 'train';
  } else if (/flight|plane|air|hawai jahaz/i.test(text)) {
    entities.transport_mode = 'flight';
  } else if (/road|drive|car|cab|taxi/i.test(text)) {
    entities.transport_mode = 'road';
  } else if (/bus|volvo/i.test(text)) {
    entities.transport_mode = 'bus';
  }

  // 6. Interests
  if (/heritage|fort|palace|history|itihaas|monument/i.test(text)) entities.interests.push('heritage');
  if (/food|culinary|street food|thali|dish|khana/i.test(text)) entities.interests.push('food');
  if (/spiritual|temple|mandir|aarti|ghat|sacred|puja/i.test(text)) entities.interests.push('spiritual');
  if (/nature|waterfall|mountain|hill station|beach|jungle|safari/i.test(text)) entities.interests.push('nature');
  if (/market|shopping|bazaar|handicraft|silk|souvenir/i.test(text)) entities.interests.push('shopping');

  // 7. Party Size
  if (/solo|alone|akele/i.test(text)) entities.party_size = 'Solo Traveler';
  else if (/couple|honeymoon|partner/i.test(text)) entities.party_size = 'Couple';
  else if (/family|parivar|parents|kids/i.test(text)) entities.party_size = 'Family';
  else if (/friends|dost|group/i.test(text)) entities.party_size = 'Friends Group';

  return entities;
}
