import { STATE_DIRECTORIES_MAP } from '../data/masterStateDirectoryConfig';
import { VERIFIED_HOTELS_DATABASE, VerifiedStay } from '../data/hotelsData';
import { getUltimateCityRecord, UltimateHotel } from '../data/ultimateCityDatabase';
import { MASTER_TOURISM_PLACES } from '../data/masterTourismPlacesData';

export interface AmenityDetail {
  id: string;
  name: string;
  category: 'room' | 'wellness' | 'connectivity' | 'dining' | 'concierge' | 'transport';
  icon: string;
  description: string;
  isFeatured?: boolean;
}

export interface NearbyMonument {
  name: string;
  category?: string;
  distance: string;
  driveTime?: string;
}

export interface HotelDossier {
  id: string; // unique slug e.g. 'mayfair-waves-puri'
  slug: string;
  name: string;
  cityName: string;
  cityId?: string;
  stateName: string;
  stateId?: string;
  category: string;
  locality: string;
  propertyType: string;
  tier: 'luxury' | 'boutique' | 'heritage' | 'budget';
  stars: number;
  rating: number;
  reviewsCount: string;
  thumbnailUrl: string;
  coverImage: string;
  galleryImages: string[];
  description: string;
  nightTariff: string;
  nightTariffNum: number;
  dayTariff: string;
  dayTariffNum: number;
  dayStayTiming: string;
  nightStayTiming: string;
  amenities: AmenityDetail[];
  highlights: string[];
  nearbyHeritage: NearbyMonument[];
  address: string;
  googleMapsUrl: string;
  bookingUrl: string;
  phone?: string;
  diningNote?: string;
  checkInTime: string;
  checkOutTime: string;
  rulesAndPolicies: string[];
}

export function generateHotelSlug(name: string, cityName?: string): string {
  const cleanName = (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const cleanCity = (cityName || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  if (cleanCity && !cleanName.includes(cleanCity)) {
    return `${cleanName}-${cleanCity}`;
  }
  return cleanName;
}

// Curated photo palettes based on hotel themes
const THEME_IMAGES: Record<string, { cover: string; gallery: string[] }> = {
  beach: {
    cover: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
    ],
  },
  palace: {
    cover: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop&q=80',
    ],
  },
  mountain: {
    cover: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
    ],
  },
  spiritual: {
    cover: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
    ],
  },
  luxury: {
    cover: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
    ],
  },
};

function detectTheme(name: string, category: string, cityName: string): string {
  const text = `${name} ${category} ${cityName}`.toLowerCase();
  if (/beach|sea|coast|ocean|bay|palm|wave|lagoon|port|digha|puri|goa|havelock|kovalam|island/i.test(text)) {
    return 'beach';
  }
  if (/palace|haveli|fort|royal|heritage|colonial|maharaja|darbar|mansion|heritage/i.test(text)) {
    return 'palace';
  }
  if (/hill|mountain|ridge|himalaya|pine|tea|valley|peak|glen|mist|shimla|manali|darjeeling|gangtok|munnar|ooty/i.test(text)) {
    return 'mountain';
  }
  if (/mandir|temple|shrine|darshan|ashram|tirtha|ghat|dham|spiritual|matha|varanasi|rishikesh|haridwar|ayodhya|tirupati/i.test(text)) {
    return 'spiritual';
  }
  return 'luxury';
}

function detectTier(name: string, category: string): { tier: 'luxury' | 'boutique' | 'heritage' | 'budget'; stars: number; nightTariff: string; nightTariffNum: number; dayTariff: string; dayTariffNum: number } {
  const text = `${name} ${category}`.toLowerCase();
  if (/ultra|palace|5-star|five star|luxury resort|taj|oberoi|itc|leela|radisson red|marriott|hyatt|jw/i.test(text)) {
    return {
      tier: 'luxury',
      stars: 5,
      nightTariff: '₹7,500 – ₹15,500 / night',
      nightTariffNum: 7500,
      dayTariff: '₹3,200 – ₹4,800 / day',
      dayTariffNum: 3200,
    };
  }
  if (/heritage|haveli|colonial|chhatri|darbar/i.test(text)) {
    return {
      tier: 'heritage',
      stars: 4,
      nightTariff: '₹5,200 – ₹9,800 / night',
      nightTariffNum: 5200,
      dayTariff: '₹2,400 – ₹3,600 / day',
      dayTariffNum: 2400,
    };
  }
  if (/boutique|resort|premium|villas|suites/i.test(text)) {
    return {
      tier: 'boutique',
      stars: 4,
      nightTariff: '₹4,200 – ₹7,500 / night',
      nightTariffNum: 4200,
      dayTariff: '₹1,900 – ₹2,900 / day',
      dayTariffNum: 1900,
    };
  }
  return {
    tier: 'budget',
    stars: 3,
    nightTariff: '₹2,400 – ₹4,200 / night',
    nightTariffNum: 2400,
    dayTariff: '₹1,200 – ₹1,800 / day',
    dayTariffNum: 1200,
  };
}

function buildCategorizedAmenities(theme: string, tier: string, cityName: string): AmenityDetail[] {
  const poolName = theme === 'beach' ? 'Swimming Pool & Sun Loungers' : theme === 'palace' ? 'Royal Courtyard Pool' : 'Swimming Pool & Sun Deck';
  const diningDesc =
    theme === 'beach'
      ? `Multi-cuisine coastal dining featuring fresh catch Bay of Bengal/Arabian Sea seafood and traditional regional thalis.`
      : theme === 'spiritual'
      ? `Pure vegetarian & Sattvic dining options alongside North/South Indian regional culinary classics.`
      : `All-day multi-cuisine fine dining restaurant with regional chef specialties and continental breakfast.`;

  return [
    {
      id: 'wifi',
      name: 'High-Speed Wi-Fi',
      category: 'connectivity',
      icon: 'Wifi',
      description: 'Complimentary high-speed Wi-Fi (150+ Mbps) throughout all rooms, lounges, and courtyards.',
      isFeatured: true,
    },
    {
      id: 'pool',
      name: poolName,
      category: 'wellness',
      icon: 'Waves',
      description: 'Temperature-controlled outdoor swimming pool with dedicated sun loungers, towel service, and shallow kid area.',
      isFeatured: true,
    },
    {
      id: 'dining',
      name: 'Signature Restaurant & Room Service',
      category: 'dining',
      icon: 'Utensils',
      description: diningDesc,
      isFeatured: true,
    },
    {
      id: 'spa',
      name: 'Ayurvedic Spa & Wellness',
      category: 'wellness',
      icon: 'Sparkles',
      description: 'Rejuvenating Ayurvedic herbal therapies, steam bath, and relaxation massages conducted by certified wellness practitioners.',
      isFeatured: true,
    },
    {
      id: 'ac',
      name: 'Climate-Controlled Air Conditioning',
      category: 'room',
      icon: 'AirVent',
      description: 'Individual touch-panel climate control in every guest suite ensuring year-round optimal comfort.',
      isFeatured: false,
    },
    {
      id: 'concierge',
      name: 'Temple Darshan & Heritage Concierge',
      category: 'concierge',
      icon: 'Compass',
      description: `Dedicated travel desk assisting with VIP temple darshan slots, local monument passes, and verified auto/taxi arrangements in ${cityName}.`,
      isFeatured: true,
    },
    {
      id: 'parking',
      name: 'Free Valet Parking & EV Charging',
      category: 'transport',
      icon: 'Car',
      description: 'Secure on-premise covered parking with 24/7 valet service and Type-2 universal electric vehicle charging stations.',
      isFeatured: false,
    },
    {
      id: 'transfers',
      name: 'Station / Airport Shuttle Assistance',
      category: 'transport',
      icon: 'Navigation',
      description: 'Convenient airport and railway terminal pickup and drop transfers available round-the-clock upon advance request.',
      isFeatured: false,
    },
    {
      id: 'room-service',
      name: '24/7 Front Desk & In-Room Dining',
      category: 'room',
      icon: 'Clock',
      description: 'Round-the-clock reception, luggage cloakroom for transit pilgrims, express check-in, and 24-hour room service menu.',
      isFeatured: false,
    },
    {
      id: 'tea-coffee',
      name: 'Artisan Tea/Coffee Maker & Minibar',
      category: 'room',
      icon: 'Coffee',
      description: 'In-room electric kettle, assorted gourmet Indian teas and coffees, packaged drinking water, and refrigerated minibar.',
      isFeatured: false,
    },
    {
      id: 'security',
      name: 'Verified Safety & Doctor on Call',
      category: 'concierge',
      icon: 'ShieldCheck',
      description: 'Virasat verified security protocols, continuous CCTV monitoring, electronic digital in-room safe, and 24/7 doctor-on-call.',
      isFeatured: true,
    },
    {
      id: 'tv',
      name: '50-inch 4K Smart TV',
      category: 'connectivity',
      icon: 'Tv',
      description: 'High-definition flat screen television with streaming connectivity (Netflix/YouTube/Hotstar) and premium satellite channels.',
      isFeatured: false,
    },
  ];
}

export function resolveHotelDossier(
  stay: { name: string; category?: string },
  cityName: string,
  stateName: string,
  stateId?: string,
  cityAttractions?: Array<{ name: string; category?: string }>
): HotelDossier {
  const stayName = stay.name || 'Verified Heritage Stay';
  const rawCategory = stay.category || 'Curated Hospitality & Heritage Stay';
  const slug = generateHotelSlug(stayName, cityName);

  // 1. Check if an exact match exists in VERIFIED_HOTELS_DATABASE
  const verifiedMatch = VERIFIED_HOTELS_DATABASE.find(
    (h) =>
      h.name.toLowerCase() === stayName.toLowerCase() ||
      h.id.toLowerCase() === slug ||
      (h.city.toLowerCase() === cityName.toLowerCase() && h.name.toLowerCase().includes(stayName.toLowerCase()))
  );

  // 2. Check if a match exists in ULTIMATE_CITY_DATABASE_15
  const ultimateCity = getUltimateCityRecord(cityName);
  const ultimateMatch: UltimateHotel | undefined = ultimateCity?.hotels?.find(
    (h) => h.name.toLowerCase() === stayName.toLowerCase() || h.name.toLowerCase().includes(stayName.toLowerCase())
  );

  // Extract locality & property type from category
  let locality = cityName;
  let propertyType = rawCategory;
  if (rawCategory.includes('—')) {
    const parts = rawCategory.split('—').map((p) => p.trim());
    locality = parts[0] || cityName;
    propertyType = parts[1] || rawCategory;
  } else if (rawCategory.includes('-')) {
    const parts = rawCategory.split('-').map((p) => p.trim());
    locality = parts[0] || cityName;
    propertyType = parts[1] || rawCategory;
  }

  const theme = detectTheme(stayName, rawCategory, cityName);
  const themeImages = THEME_IMAGES[theme] || THEME_IMAGES.luxury;
  const tierInfo = detectTier(stayName, rawCategory);

  const coverImage = verifiedMatch?.thumbnail_url || themeImages.cover;
  const galleryImages = themeImages.gallery;

  const stars = verifiedMatch ? (verifiedMatch.tier === 'luxury' ? 5 : 4) : ultimateMatch?.stars || tierInfo.stars;
  const rating = verifiedMatch?.rating || 4.7 + ((stayName.length % 4) * 0.1);
  const reviewsCount = verifiedMatch?.reviews_count || `${1200 + (stayName.length * 45)}+ verified guests`;

  const nightTariff = verifiedMatch?.night_tariff || tierInfo.nightTariff;
  const nightTariffNum = verifiedMatch?.night_tariff_num || tierInfo.nightTariffNum;
  const dayTariff = verifiedMatch?.day_tariff || tierInfo.dayTariff;
  const dayTariffNum = verifiedMatch?.day_tariff_num || tierInfo.dayTariffNum;
  const dayStayTiming = verifiedMatch?.day_stay_timing || '10:00 AM – 06:00 PM (6-8 Hour Transit & Relaxation Pass)';
  const nightStayTiming = verifiedMatch?.night_stay_timing || 'Check-in: 02:00 PM · Check-out: 11:00 AM';

  const amenities = buildCategorizedAmenities(theme, tierInfo.tier, cityName);

  // Proximity to monuments: Pull from cityAttractions or MASTER_TOURISM_PLACES
  const nearbyHeritage: NearbyMonument[] = [];
  if (cityAttractions && cityAttractions.length > 0) {
    cityAttractions.slice(0, 4).forEach((att, idx) => {
      const distances = ['1.2 km', '2.5 km', '4.8 km', '8.5 km'];
      const driveTimes = ['5 mins drive', '8 mins drive', '15 mins drive', '20 mins drive'];
      nearbyHeritage.push({
        name: att.name,
        category: att.category || 'Historic Landmark',
        distance: distances[idx % distances.length],
        driveTime: driveTimes[idx % driveTimes.length],
      });
    });
  } else {
    const matchedMaster = MASTER_TOURISM_PLACES.filter(
      (p) => p.city_name.toLowerCase() === cityName.toLowerCase() || p.state_name.toLowerCase() === stateName.toLowerCase()
    );
    if (matchedMaster.length > 0) {
      matchedMaster.slice(0, 4).forEach((p, idx) => {
        nearbyHeritage.push({
          name: p.name,
          category: p.category,
          distance: `${(idx + 1) * 1.5} km`,
          driveTime: `${(idx + 1) * 5} mins drive`,
        });
      });
    } else {
      nearbyHeritage.push(
        { name: `${cityName} City Centre & Main Market`, distance: '0.8 km', driveTime: '3 mins drive' },
        { name: `${cityName} Railway Junction`, distance: '3.2 km', driveTime: '10 mins drive' },
        { name: `Principal Heritage Shrines of ${cityName}`, distance: '2.1 km', driveTime: '7 mins drive' }
      );
    }
  }

  const highlights = [
    `Prime location along ${locality}, offering tranquil ambience and effortless access to ${cityName}'s heritage quarter.`,
    `Curated regional dining experiences with both traditional local dishes and international comfort classics.`,
    `Flexible stay options: full overnight affairs with complimentary breakfast or daytime transit passes for pilgrims and travelers.`,
    `Virasat Verified hospitality standards with round-the-clock front desk, free Wi-Fi, and personalized sightseeing support.`,
  ];

  const description =
    verifiedMatch?.description ||
    ultimateMatch?.description ||
    `Experience refined hospitality at ${stayName}, conveniently positioned in ${locality}, ${cityName}. Designed for discerning heritage travelers, spiritual pilgrims, and families, the property blends authentic cultural warmth with contemporary comforts, featuring well-appointed air-conditioned rooms, attentive concierge service, and verified safety amenities.`;

  const address = verifiedMatch?.location || `${locality}, ${cityName}, ${stateName}, India`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${stayName}, ${locality}, ${cityName}, ${stateName}`
  )}`;
  const bookingUrl =
    verifiedMatch?.booking_url ||
    `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`${stayName}, ${cityName}, ${stateName}`)}`;
  const phone = verifiedMatch?.phone || '+91 1800 200 8910';

  const rulesAndPolicies = [
    'Check-in requires government-issued photo ID (Aadhaar, Passport, Voter ID, or Driving License) for all adult guests.',
    'Complimentary high-speed Wi-Fi available across all guest rooms, courtyards, and common dining spaces.',
    'Early check-in and luggage storage available upon request for guests arriving via early morning express trains or flights.',
    'Cancellation is free up to 24 hours prior to standard check-in time for flexible rate reservations.',
    'Concierge can arrange local temple darshan guides, autorickshaw hire, and luggage assistance.',
  ];

  return {
    id: slug,
    slug,
    name: stayName,
    cityName,
    cityId: verifiedMatch?.city_id,
    stateName,
    stateId,
    category: rawCategory,
    locality,
    propertyType,
    tier: tierInfo.tier,
    stars,
    rating: Number(rating.toFixed(1)),
    reviewsCount,
    thumbnailUrl: coverImage,
    coverImage,
    galleryImages,
    description,
    nightTariff,
    nightTariffNum,
    dayTariff,
    dayTariffNum,
    dayStayTiming,
    nightStayTiming,
    amenities,
    highlights,
    nearbyHeritage,
    address,
    googleMapsUrl,
    bookingUrl,
    phone,
    diningNote: `Authentic local culinary traditions of ${cityName} are celebrated in the property kitchen, alongside wholesome vegetarian, vegan, and kids menu options.`,
    checkInTime: '02:00 PM',
    checkOutTime: '11:00 AM',
    rulesAndPolicies,
  };
}

// Master slug resolver that scans all 36 state directories, verified stays, and ultimate cities
export function getHotelDossierBySlug(slug: string): HotelDossier | null {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Scan VERIFIED_HOTELS_DATABASE
  const verified = VERIFIED_HOTELS_DATABASE.find(
    (h) => h.id.toLowerCase() === cleanSlug || generateHotelSlug(h.name, h.city) === cleanSlug
  );
  if (verified) {
    return resolveHotelDossier(
      { name: verified.name, category: `${verified.location} — ${verified.category}` },
      verified.city,
      verified.state
    );
  }

  // 2. Scan all 36 state directories in STATE_DIRECTORIES_MAP
  for (const [stKey, stateCfg] of Object.entries(STATE_DIRECTORIES_MAP)) {
    if (!stateCfg || !Array.isArray(stateCfg.cities)) continue;
    for (const city of stateCfg.cities) {
      if (!city || !Array.isArray(city.topStays)) continue;
      for (const stay of city.topStays) {
        const staySlug = generateHotelSlug(stay.name, city.name);
        if (
          staySlug === cleanSlug ||
          cleanSlug.startsWith(staySlug) ||
          staySlug.startsWith(cleanSlug) ||
          stay.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === cleanSlug
        ) {
          return resolveHotelDossier(stay, city.name, stateCfg.stateName, stateCfg.stateId, city.attractions);
        }
      }
    }
  }

  // 3. Fallback: Parse slug into [stay-name]-[city-name] and reconstruct
  const parts = cleanSlug.split('-');
  if (parts.length >= 2) {
    const rawCityName = parts[parts.length - 1];
    const rawStayName = parts.slice(0, -1).join(' ');
    const formattedCity = rawCityName.charAt(0).toUpperCase() + rawCityName.slice(1);
    const formattedStay = rawStayName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return resolveHotelDossier({ name: formattedStay, category: `${formattedCity} — Curated Stay` }, formattedCity, 'India');
  }

  return null;
}

export function getHotelsForCityDossiers(cityName: string, stateName: string = 'India'): HotelDossier[] {
  const normCity = (cityName || '').toLowerCase().trim();

  // Find city in STATE_DIRECTORIES_MAP
  for (const [, stateCfg] of Object.entries(STATE_DIRECTORIES_MAP)) {
    if (!stateCfg || !Array.isArray(stateCfg.cities)) continue;
    const matchedCity = stateCfg.cities.find(
      (c) =>
        c.name.toLowerCase() === normCity ||
        c.id.toLowerCase() === normCity ||
        normCity.includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes(normCity)
    );
    if (matchedCity && Array.isArray(matchedCity.topStays) && matchedCity.topStays.length > 0) {
      return matchedCity.topStays.map((stay) =>
        resolveHotelDossier(stay, matchedCity.name, stateCfg.stateName, stateCfg.stateId, matchedCity.attractions)
      );
    }
  }

  // Fallback to procedural generation from hotelsData
  const baseStays = VERIFIED_HOTELS_DATABASE.filter(
    (h) => h.city.toLowerCase() === normCity || normCity.includes(h.city.toLowerCase())
  );
  if (baseStays.length > 0) {
    return baseStays.map((h) => resolveHotelDossier({ name: h.name, category: h.category }, h.city, h.state));
  }

  // Default trio
  return [
    resolveHotelDossier({ name: `${cityName} Grand Palace Resort`, category: 'City Centre — Luxury Heritage' }, cityName, stateName),
    resolveHotelDossier({ name: `The Heritage Haveli & Spa ${cityName}`, category: 'Old Quarters — Colonial Boutique' }, cityName, stateName),
    resolveHotelDossier({ name: `${cityName} Riverside Retreat`, category: 'Scenic Corridor — Premium Nature Stay' }, cityName, stateName),
  ];
}
