import { resolvePlaceEntity, ResolvedPlace } from './placeResolver';

export interface ExtractedEntities {
  destination?: string;
  city?: string;
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
  resolvedPlace?: ResolvedPlace;
  place_id?: string;
  place_name?: string;
  rejected_city?: string;
}

const COMMON_ORIGINS = [
  'mumbai', 'delhi', 'new delhi', 'bangalore', 'bengaluru', 'kolkata', 'chennai',
  'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'chandigarh', 'patna',
  'surat', 'indore', 'bhopal', 'nagpur', 'kochi', 'guwahati'
];

export const INDIAN_DESTINATION_ALIASES: Record<string, string> = {
  // Chennai & Tamil Nadu
  chennai: 'Chennai',
  channi: 'Chennai',
  channai: 'Chennai',
  chenai: 'Chennai',
  chinai: 'Chennai',
  madras: 'Chennai',
  madurai: 'Madurai',
  coimbatore: 'Coimbatore',
  kovai: 'Coimbatore',
  mamallapuram: 'Mamallapuram',
  mahabalipuram: 'Mamallapuram',
  ooty: 'Ooty',
  udhagamandalam: 'Ooty',
  rameswaram: 'Rameswaram',
  thanjavur: 'Thanjavur',
  tanjore: 'Thanjavur',
  tiruchirappalli: 'Tiruchirappalli',
  trichy: 'Tiruchirappalli',
  kanniyakumari: 'Kanniyakumari',
  kanyakumari: 'Kanniyakumari',
  kodaikanal: 'Kodaikanal',

  // Maharashtra
  mumbai: 'Mumbai',
  bombay: 'Mumbai',
  pune: 'Pune',
  nagpur: 'Nagpur',
  nashik: 'Nashik',
  nasik: 'Nashik',
  shirdi: 'Shirdi',
  kolhapur: 'Kolhapur',
  aurangabad: 'Chhatrapati Sambhaji Nagar',
  'chhatrapati sambhaji nagar': 'Chhatrapati Sambhaji Nagar',
  'sambhaji nagar': 'Chhatrapati Sambhaji Nagar',
  mahabaleshwar: 'Mahabaleshwar',
  igatpuri: 'Igatpuri',
  lonavala: 'Lonavala',
  khandala: 'Khandala',
  alibaug: 'Alibaug',

  // North India
  delhi: 'Delhi',
  'new delhi': 'Delhi',
  dilli: 'Delhi',
  agra: 'Agra',
  jaipur: 'Jaipur',
  jaypur: 'Jaipur',
  udaipur: 'Udaipur',
  jodhpur: 'Jodhpur',
  jaisalmer: 'Jaisalmer',
  bikaner: 'Bikaner',
  ajmer: 'Ajmer',
  pushkar: 'Pushkar',
  'mount abu': 'Mount Abu',
  varanasi: 'Varanasi',
  kashi: 'Varanasi',
  banaras: 'Varanasi',
  lucknow: 'Lucknow',
  prayagraj: 'Prayagraj',
  allahabad: 'Prayagraj',
  ayodhya: 'Ayodhya',
  mathura: 'Mathura',
  vrindavan: 'Vrindavan',
  haridwar: 'Haridwar',
  rishikesh: 'Rishikesh',
  dehradun: 'Dehradun',
  mussoorie: 'Mussoorie',
  nainital: 'Nainital',
  shimla: 'Shimla',
  manali: 'Manali',
  dharamshala: 'Dharamshala',
  dharamsala: 'Dharamshala',
  amritsar: 'Amritsar',
  chandigarh: 'Chandigarh',
  srinagar: 'Srinagar',
  gulmarg: 'Gulmarg',
  pahalgam: 'Pahalgam',
  jammu: 'Jammu',
  leh: 'Leh',
  ladakh: 'Leh',
  'spiti valley': 'Spiti Valley',
  spiti: 'Spiti Valley',

  // East & North East
  kolkata: 'Kolkata',
  calcutta: 'Kolkata',
  kolkatta: 'Kolkata',
  darjeeling: 'Darjeeling',
  darjiling: 'Darjeeling',
  siliguri: 'Siliguri',
  gangtok: 'Gangtok',
  pelling: 'Pelling',
  shillong: 'Shillong',
  cherrapunjee: 'Cherrapunjee',
  cherrapunji: 'Cherrapunjee',
  sohra: 'Cherrapunjee',
  guwahati: 'Guwahati',
  kaziranga: 'Kaziranga',
  tawang: 'Tawang',
  patna: 'Patna',
  gaya: 'Gaya',
  nalanda: 'Nalanda',
  bhubaneswar: 'Bhubaneswar',
  puri: 'Puri',
  konark: 'Konark',
  cuttack: 'Cuttack',
  ranchi: 'Ranchi',
  deoghar: 'Deoghar',

  // South India
  bengaluru: 'Bengaluru',
  bangalore: 'Bengaluru',
  bangaluru: 'Bengaluru',
  banglore: 'Bengaluru',
  mysuru: 'Mysuru',
  mysore: 'Mysuru',
  hampi: 'Hampi',
  badami: 'Badami',
  gokarna: 'Gokarna',
  coorg: 'Coorg',
  mangalore: 'Mangaluru',
  mangaluru: 'Mangaluru',
  kochi: 'Kochi',
  cochin: 'Kochi',
  munnar: 'Munnar',
  alappuzha: 'Alappuzha',
  alleppey: 'Alappuzha',
  wayanad: 'Wayanad',
  thiruvananthapuram: 'Thiruvananthapuram',
  trivandrum: 'Thiruvananthapuram',
  kovalam: 'Kovalam',
  varkala: 'Varkala',
  hyderabad: 'Hyderabad',
  warangal: 'Warangal',
  visakhapatnam: 'Visakhapatnam',
  vizag: 'Visakhapatnam',
  tirupati: 'Tirupati',
  vijayawada: 'Vijayawada',
  pondicherry: 'Puducherry',
  puducherry: 'Puducherry',

  // West & Central
  ahmedabad: 'Ahmedabad',
  surat: 'Surat',
  vadodara: 'Vadodara',
  baroda: 'Vadodara',
  bhopal: 'Bhopal',
  indore: 'Indore',
  gwalior: 'Gwalior',
  orchha: 'Orchha',
  khajuraho: 'Khajuraho',
  ujjain: 'Ujjain',
  jabalpur: 'Jabalpur',
  sanchi: 'Sanchi',
  pachmarhi: 'Pachmarhi',
  goa: 'Goa',
  panaji: 'Goa',
  daman: 'Daman',
  diu: 'Diu',
  'port blair': 'Port Blair',
  'sri vijaya puram': 'Sri Vijaya Puram',
  kavaratti: 'Kavaratti',
};

/**
 * Extracts travel entities from natural language query
 */
export function extractEntities(rawText: string, existingContext?: any): ExtractedEntities {
  const text = (rawText || '').trim().toLowerCase();

  const entities: ExtractedEntities = {
    currency: 'INR',
    interests: [],
  };

  // 0. Location Rejection (e.g. "no panvel nahi bhai", "panvel nahi", "not panvel")
  const rejectionMatch =
    text.match(/(?:no|nahi|not)\s+([a-zA-Z\s]+)/i) ||
    text.match(/^([a-zA-Z\s]+?)\s+nahi\b/i);
  if (rejectionMatch) {
    const candidate = rejectionMatch[1]
      .replace(/\b(?:nahi|na|not|bhai|yaar|dost|bhaiya|plz|please)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    if (candidate && candidate.length > 2 && !['kuch', 'koi', 'aisa', 'kisi', 'yeh', 'ye'].includes(candidate)) {
      entities.rejected_city = candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  // 1. Duration Extraction (e.g., "3 din", "3 days", "5 day", "weekend", "1 din", "ek din")
  const dayMatch = text.match(/(\d+)\s*(?:day|days|din|raat|nights)/i);
  if (dayMatch) {
    entities.duration_days = parseInt(dayMatch[1], 10);
  } else if (/weekend/i.test(text)) {
    entities.duration_days = 2;
  } else if (/(?:ek|one)\s*(?:day|din)/i.test(text)) {
    entities.duration_days = 1;
  }

  // 2. Budget Extraction (e.g., "15k", "15000", "₹15000", "15000 rs", "15 hazaar", "2000")
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

  // 3. Place & Monument Resolution
  const placeResult = resolvePlaceEntity(rawText, existingContext);
  if (placeResult) {
    entities.resolvedPlace = placeResult.place;
    entities.place_id = placeResult.place.id;
    entities.place_name = placeResult.place.name;
    entities.destination = placeResult.place.city;
    entities.city = placeResult.place.city;
    entities.state = placeResult.place.state;
    entities.query_focus = placeResult.queryFocus;
    if (placeResult.place.category === 'religious_cultural' && !entities.interests.includes('spiritual')) {
      entities.interests.push('spiritual');
    }
  }

  // 4. Origin & Destination Extraction
  // Pattern: "from X to Y", "X se Y", "X to Y"
  const fromToMatch = text.match(/(?:from|se|starting from)\s+([a-zA-Z\s]+?)\s+(?:to|tak|jana hai|travel to)\s+([a-zA-Z\s]+)/i);
  if (fromToMatch) {
    const rawOrig = fromToMatch[1].trim().toLowerCase();
    const rawDest = fromToMatch[2].trim().toLowerCase();
    entities.origin = INDIAN_DESTINATION_ALIASES[rawOrig] || (rawOrig.charAt(0).toUpperCase() + rawOrig.slice(1));
    entities.destination = INDIAN_DESTINATION_ALIASES[rawDest] || (rawDest.charAt(0).toUpperCase() + rawDest.slice(1));
    entities.city = entities.destination;
  } else {
    // Check for origin indicators ("Mumbai se", "from Delhi")
    for (const o of COMMON_ORIGINS) {
      if (new RegExp(`(?:from|se)\\s+${o}\\b|\\b${o}\\s+se\\b`, 'i').test(text)) {
        entities.origin = o.charAt(0).toUpperCase() + o.slice(1);
        break;
      }
    }

    // Check for known destination mentions or phonetic aliases if not already set by place resolution
    if (!entities.destination) {
      for (const [alias, canonicalName] of Object.entries(INDIAN_DESTINATION_ALIASES)) {
        if (new RegExp(`\\b${alias}\\b`, 'i').test(text)) {
          if (!entities.origin || entities.origin.toLowerCase() !== alias) {
            entities.destination = canonicalName;
            entities.city = canonicalName;
            break;
          }
        }
      }
    }

    // Travel query patterns like "chennai ghumna hain", "ke Channi ghoom sakta hun", "visit jaipur"
    if (!entities.destination) {
      const travelPattern = text.match(/(?:ke|kya|main|hum)?\s*([a-zA-Z\s]{3,20}?)\s*(?:ghoom sakta|ghoom sakte|ghumna|ghumo|visit|explore|travel|trip|jana|ja sakta)/i);
      if (travelPattern) {
        const potentialCity = travelPattern[1].trim().toLowerCase();
        if (INDIAN_DESTINATION_ALIASES[potentialCity]) {
          entities.destination = INDIAN_DESTINATION_ALIASES[potentialCity];
          entities.city = entities.destination;
        }
      }
    }
  }

  // 4b. State & UT Extraction
  const ALL_INDIAN_STATES = [
    'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa',
    'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka', 'kerala',
    'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland',
    'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura',
    'uttar pradesh', 'uttarakhand', 'west bengal',
    'andaman and nicobar', 'chandigarh', 'dadra and nagar haveli', 'daman and diu',
    'delhi', 'jammu and kashmir', 'ladakh', 'lakshadweep', 'puducherry'
  ];
  for (const s of ALL_INDIAN_STATES) {
    if (new RegExp(`\\b${s}\\b`, 'i').test(text)) {
      entities.state = s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  // 5. Party / Family Context
  if (/family|parivar|bachon|kids|parents|buzurg|with family/i.test(text)) {
    entities.party_size = 'family';
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
