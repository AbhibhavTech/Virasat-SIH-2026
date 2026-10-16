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
  party_size_count?: number;
  travel_date?: string;
  start_date?: string;
  end_date?: string;
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

  // Maharashtra & MMR
  mumbai: 'Mumbai',
  bombay: 'Mumbai',
  kharghar: 'Navi Mumbai',
  panvel: 'Panvel',
  'navi mumbai': 'Navi Mumbai',
  thane: 'Thane',
  kalyan: 'Kalyan',
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
  vaishali: 'Vaishali',
  kesaria: 'Kesaria',
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

  for (const [alias, canonicalName] of Object.entries(INDIAN_DESTINATION_ALIASES)) {
    const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escapedAlias}\\s+(?:nahi|nahin|not)\\b|\\b(?:no|not|nahi|nahin)\\s+${escapedAlias}\\b`, 'i').test(text)) {
      entities.rejected_city = canonicalName;
      break;
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

  // Preserve only unambiguous, year-qualified dates; do not infer a year for
  // "next Friday" or turn a changing calendar expression into a fixed date.
  const isoDates = [...text.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g)]
    .map((match) => `${match[1]}-${match[2]}-${match[3]}`)
    .filter((date) => {
      const parsed = new Date(`${date}T00:00:00Z`);
      return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
    });
  if (isoDates.length >= 2) {
    entities.start_date = isoDates[0];
    entities.end_date = isoDates[1];
  } else if (isoDates.length === 1) {
    entities.travel_date = isoDates[0];
  }

  // 2. Budget Extraction (e.g., "15k", "15000", "₹15000", "15000 rs", "15 hazaar", "2000")
  const kBudgetMatch = text.match(/(\d+)\s*k\b/i);
  const numberBudgetMatches = [...text.matchAll(/(?:₹|rs\.?|inr|budget)?\s*(\d{4,6})\b/gi)];
  const numberBudgetMatch = numberBudgetMatches.find((match) => {
    const numberStart = (match.index || 0) + match[0].lastIndexOf(match[1]);
    const number = Number(match[1]);
    const hasBudgetMarker = /(?:budget|₹|rs\.?|inr)\s*$/i.test(text.slice(Math.max(0, numberStart - 12), numberStart));
    const isIsoDate = /^20\d{2}-\d{2}-\d{2}\b/.test(text.slice(numberStart));
    const looksLikeYear = number >= 1900 && number <= 2100;
    return hasBudgetMarker || (!isIsoDate && !looksLikeYear);
  });
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
  if (!entities.origin || !entities.destination) {
    // Find all mentioned city aliases with character indices
    const mentioned: Array<{ alias: string; canonical: string; index: number }> = [];
    for (const [alias, canonical] of Object.entries(INDIAN_DESTINATION_ALIASES)) {
      const match = text.match(new RegExp(`\\b${alias}\\b`, 'i'));
      if (match && match.index !== undefined) {
        mentioned.push({ alias, canonical, index: match.index });
      }
    }
    // Prefer longer aliases to prevent "new delhi" getting split with "delhi"
    mentioned.sort((a, b) => b.alias.length - a.alias.length);
    const nonOverlapping: Array<{ alias: string; canonical: string; index: number }> = [];
    for (const item of mentioned) {
      const overlaps = nonOverlapping.some(
        (prev) => (item.index >= prev.index && item.index < prev.index + prev.alias.length) ||
                  (prev.index >= item.index && prev.index < item.index + item.alias.length)
      );
      if (!overlaps) nonOverlapping.push(item);
    }
    nonOverlapping.sort((a, b) => a.index - b.index);

    if (nonOverlapping.length >= 2) {
      const first = nonOverlapping[0];
      const second = nonOverlapping[1];
      const between = text.slice(first.index + first.alias.length, second.index);
      const beforeFirst = text.slice(0, first.index);

      // Check if second was preceded by "from" or "se"
      if (/\b(?:from|se)\b/i.test(between) && !/\b(?:from|living in|staying in|currently in|based in)\b/i.test(beforeFirst)) {
        if (/\bfrom\b/i.test(between)) {
          if (!entities.origin) entities.origin = second.canonical;
          if (!entities.destination) {
            entities.destination = first.canonical;
            entities.city = first.canonical;
          }
        } else {
          if (!entities.origin) entities.origin = first.canonical;
          if (!entities.destination) {
            entities.destination = second.canonical;
            entities.city = second.canonical;
          }
        }
      } else {
        if (!entities.origin) entities.origin = first.canonical;
        if (!entities.destination) {
          entities.destination = second.canonical;
          entities.city = second.canonical;
        }
      }
    } else if (nonOverlapping.length === 1) {
      const item = nonOverlapping[0];
      const before = text.slice(0, item.index);
      const after = text.slice(item.index + item.alias.length);

      if (
        /\b(?:from|starting from|living in|staying in|currently in|based in|i am in|i'm in)\s*$/i.test(before) ||
        /^\s*(?:se)\b/i.test(after)
      ) {
        if (!entities.origin) entities.origin = item.canonical;
      } else {
        if (!entities.destination) {
          entities.destination = item.canonical;
          entities.city = item.canonical;
        }
      }
    }

    // Direct living/staying match fallback
    if (!entities.origin) {
      const livingMatch = text.match(/(?:living in|staying in|currently in|i am in|i'm in|located in|based in)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
      if (livingMatch) {
        const phrase = livingMatch[1].trim().toLowerCase();
        const firstWord = phrase.split(/\s+/)[0];
        if (INDIAN_DESTINATION_ALIASES[phrase]) {
          entities.origin = INDIAN_DESTINATION_ALIASES[phrase];
        } else if (INDIAN_DESTINATION_ALIASES[firstWord]) {
          entities.origin = INDIAN_DESTINATION_ALIASES[firstWord];
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
  const friendCountMatch = text.match(/(\d+)\s*(?:friends|dost|log|people|person|members)/i);
  if (friendCountMatch) {
    entities.party_size = `${friendCountMatch[1]} Friends Group`;
    entities.party_size_count = parseInt(friendCountMatch[1], 10);
  } else if (/solo|alone|akele/i.test(text)) {
    entities.party_size = 'Solo Traveler';
    entities.party_size_count = 1;
  } else if (/couple|honeymoon|partner/i.test(text)) {
    entities.party_size = 'Couple';
    entities.party_size_count = 2;
  } else if (/family|parivar|parents|kids/i.test(text)) {
    entities.party_size = 'Family';
    entities.party_size_count = 4;
  } else if (/friends|dost|group/i.test(text)) {
    entities.party_size = 'Friends Group';
    entities.party_size_count = 3;
  }

  if (entities.rejected_city) {
    const rejected = entities.rejected_city.toLowerCase();
    if (entities.destination?.toLowerCase() === rejected) {
      delete entities.destination;
      delete entities.city;
      delete entities.state;
    }
    if (entities.resolvedPlace?.city.toLowerCase() === rejected) {
      delete entities.resolvedPlace;
      delete entities.place_id;
      delete entities.place_name;
    }
  }

  return entities;
}
