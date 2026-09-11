import fs from 'fs';
import path from 'path';

const placesPath = path.join(process.cwd(), 'data', 'mumbai', 'places.json');
const places = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));

const FEATURED_IDS = [
  'mumbai-004', // Gateway of India
  'mumbai-001', // Chhatrapati Shivaji Maharaj Terminus
  'mumbai-002', // Elephanta Caves
  'mumbai-035', // Marine Drive
  'mumbai-003', // Victorian Gothic and Art Deco Ensembles
  'mumbai-010', // Bandra Fort
  'mumbai-031', // Sanjay Gandhi National Park
  'mumbai-008', // Kanheri Caves
  'mumbai-005', // Chhatrapati Shivaji Maharaj Vastu Sangrahalaya
  'mumbai-020', // Haji Ali Dargah
];

const LOCAL_PICKS = {
  restaurants: [
    {
      id: 'britannia-co',
      name: 'Britannia & Co. Restaurant',
      area: 'Ballard Estate, Fort',
      cuisine: 'Parsi & Irani Heritage',
      specialties: ['Berry Pulao', 'Sali Boti', 'Caramel Custard'],
      description: 'Iconic century-old colonial dining institution famous for traditional Parsi-Irani home recipes.',
      price_for_two: '₹800 - ₹1,200',
      address: 'Wakefield House, 11 Sprott Rd, Ballard Estate, Fort, Mumbai',
      timing: '12:00 PM – 4:00 PM (Closed Sundays)',
      thumbnail_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'bademiya-sardar',
      name: 'Bademiya & Sardar Refreshments',
      area: 'Colaba & Tardeo',
      cuisine: 'Iconic Mumbai Street Flavors',
      specialties: ['Butter Pav Bhaji', 'Seekh Kebabs', 'Baida Roti'],
      description: 'The golden standards of Mumbai street food, serving late-night crowds and heritage food connoisseurs.',
      price_for_two: '₹400 - ₹700',
      address: 'Tulloch Road, Colaba & 166-A Tardeo Road, Mumbai',
      timing: '12:00 PM – 1:00 AM',
      thumbnail_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'cafe-mondegar',
      name: 'Cafe Mondegar & Leopold Cafe',
      area: 'Colaba Causeway',
      cuisine: 'Continental & Irani Cafe',
      specialties: ['Keema Pav', 'Draft Brews', 'Chilly Cheese Toast'],
      description: 'Historic 1932 bistro adorned with Mario Miranda murals, celebrating Bombay’s vibrant cosmopolitan spirit.',
      price_for_two: '₹900 - ₹1,500',
      address: 'Metro House, Colaba Causeway, Apollo Bunder, Mumbai',
      timing: '7:30 AM – 11:30 PM',
      thumbnail_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    }
  ],
  shops: [
    {
      id: 'colaba-causeway-market',
      name: 'Colaba Causeway Street Bazaars',
      area: 'Colaba',
      specialties: ['Antique Brassware', 'Silver Jewelry', 'Vintage Handicrafts', 'Books'],
      description: 'Mumbai’s premier heritage flea market, lined with old colonial buildings and eclectic curio stalls.',
      best_time: 'Late afternoon to evening',
      address: 'Shahid Bhagat Singh Road, Colaba, Mumbai',
      thumbnail_url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'crawford-market',
      name: 'Crawford Market (Jyotiba Phule Mandai)',
      area: 'Fort / Dhobi Talao',
      specialties: ['Indian Spices', 'Alphonso Mangoes', 'Dry Fruits', 'Herbal Extracts'],
      description: 'A grand High Victorian Gothic market complex built in 1869 featuring stone bas-reliefs by Lockwood Kipling.',
      best_time: 'Morning 10:00 AM – 2:00 PM',
      address: 'Dhobi Talao, Chhatrapati Shivaji Maharaj Terminus Area, Mumbai',
      thumbnail_url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'linking-road-bandra',
      name: 'Linking Road & Hill Road Bazaars',
      area: 'Bandra West',
      specialties: ['Artisan Footwear', 'Handmade Bags', 'Fashion Boutiques', 'Street Apparel'],
      description: 'The epicenter of suburban Mumbai street fashion, brimming with energetic vendors and chic coastal stores.',
      best_time: '4:00 PM – 9:00 PM',
      address: 'Linking Road, Bandra West, Mumbai',
      thumbnail_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80',
    }
  ]
};

const STAYS = {
  budget: [
    {
      id: 'zostel-mumbai',
      name: 'Zostel Mumbai',
      type: 'Backpacker Hostel & Private Rooms',
      area: 'Andheri East / Marol',
      price_range: '₹1,400 - ₹2,800 / night',
      rating: 4.6,
      highlights: ['Community Rooftop', 'AC Dorms & Privates', 'Metro Connectivity'],
      thumbnail_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'hotel-suba-palace',
      name: 'Hotel Suba Palace',
      type: 'Affordable Heritage Boutique',
      area: 'Colaba (200m from Gateway)',
      price_range: '₹3,800 - ₹5,200 / night',
      rating: 4.4,
      highlights: ['Prime Historic Location', 'Breakfast Included', 'Safe & Clean'],
      thumbnail_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'residency-hotel-fort',
      name: 'Residency Hotel Fort',
      type: 'Heritage Quarter Hotel',
      area: 'Fort (Walking distance to CSMT)',
      price_range: '₹3,900 - ₹5,500 / night',
      rating: 4.5,
      highlights: ['Heritage Street Access', 'Quiet Rooms', 'High-Speed Wi-Fi'],
      thumbnail_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80',
    }
  ],
  moderate: [
    {
      id: 'trident-nariman-point',
      name: 'Trident Nariman Point',
      type: 'Premium Oceanfront Hotel',
      area: 'Nariman Point, Marine Drive',
      price_range: '₹9,500 - ₹15,000 / night',
      rating: 4.8,
      highlights: ['Queen\'s Necklace Views', 'Outdoor Pool', 'Fine Dining'],
      thumbnail_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'fariyas-hotel-mumbai',
      name: 'Fariyas Hotel Mumbai',
      type: '4-Star Boutique Comfort',
      area: 'Colaba Waterfront',
      price_range: '₹7,800 - ₹12,500 / night',
      rating: 4.6,
      highlights: ['Poolside Lounge', 'Colaba Causeway Walking', 'Fitness Centre'],
      thumbnail_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'itc-grand-central',
      name: 'ITC Grand Central',
      type: 'Luxury Collection Heritage Style',
      area: 'Parel, Central Mumbai',
      price_range: '₹8,900 - ₹14,000 / night',
      rating: 4.7,
      highlights: ['Victorian Architecture', 'Kaya Kalp Spa', 'Central Connectivity'],
      thumbnail_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80',
    }
  ],
  luxury: [
    {
      id: 'taj-mahal-palace-mumbai',
      name: 'The Taj Mahal Palace & Tower',
      type: 'Iconic 1903 Heritage Grand Palace',
      area: 'Apollo Bunder, Colaba',
      price_range: '₹28,000 - ₹65,000 / night',
      rating: 4.9,
      highlights: ['Arabian Sea Gateway View', 'Jiva Spa', '10 Historic Restaurants', 'Royal Butler Service'],
      thumbnail_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'the-oberoi-mumbai',
      name: 'The Oberoi Mumbai',
      type: 'Ultra-Luxury Waterfront Landmark',
      area: 'Marine Drive, Nariman Point',
      price_range: '₹24,000 - ₹52,000 / night',
      rating: 4.9,
      highlights: ['Floor-to-Ceiling Sea Vistas', 'Michelin-Caliber Cuisine', '24-Hour Butler Service'],
      thumbnail_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'the-st-regis-mumbai',
      name: 'The St. Regis Mumbai',
      type: 'Contemporary Skyscraper Luxury',
      area: 'Lower Parel',
      price_range: '₹21,000 - ₹48,000 / night',
      rating: 4.8,
      highlights: ['Highest Bar in India (Asilo)', 'Signature St. Regis Butler', 'Direct Palladium Access'],
      thumbnail_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&auto=format&fit=crop&q=80',
    }
  ]
};

const TRANSPORTATION = {
  budget: [
    {
      mode: 'Mumbai Metro',
      icon: 'Train',
      cost_indication: '₹10 - ₹40 per trip',
      description: 'Fast, air-conditioned transit across Lines 1, 2A, 7, and the newly operational underground Aqua Line 3.'
    },
    {
      mode: 'Mumbai Suburban Local Train',
      icon: 'Train',
      cost_indication: '₹5 - ₹20 per trip',
      description: 'The legendary lifeline of Mumbai connecting CSMT and Churchgate to Northern suburbs.'
    },
    {
      mode: 'BEST Bus Network',
      icon: 'Bus',
      cost_indication: '₹6 - ₹25 per trip',
      description: 'Affordable red AC and electric buses reaching every street, fort, and coastal promenade.'
    },
    {
      mode: 'Heritage Walking',
      icon: 'Footprints',
      cost_indication: 'Free',
      description: 'Pedestrian-friendly paths throughout Fort, Kala Ghoda, Oval Maidan, and Marine Drive.'
    }
  ],
  moderate: [
    {
      mode: 'App-Based Cabs (Uber / Ola)',
      icon: 'Car',
      cost_indication: '₹150 - ₹450 per ride',
      description: 'On-demand AC comfort covering all city journeys and Sea Link crossings smoothly.'
    },
    {
      mode: 'Iconic Kaali-Peeli Taxis',
      icon: 'Car',
      cost_indication: '₹28 meter base + ₹18/km',
      description: 'Classic black-and-yellow metered taxis, ideal for historic South Mumbai hops.'
    },
    {
      mode: 'Mumbai Metro & AC Local',
      icon: 'Train',
      cost_indication: '₹20 - ₹65 per trip',
      description: 'First-class AC local trains and metro corridors for traffic-free transit.'
    },
    {
      mode: 'BEST AC Express Buses',
      icon: 'Bus',
      cost_indication: '₹15 - ₹50 per trip',
      description: 'Point-to-point air-conditioned transit on major arterial routes.'
    }
  ],
  luxury: [
    {
      mode: 'Dedicated Chauffeur-Driven Luxury Sedan',
      icon: 'Car',
      cost_indication: '₹4,500 - ₹9,500 / 8-hour package',
      description: 'Private Mercedes-Benz, Audi, or Toyota Innova Crysta with a professional uniform chauffeur.'
    },
    {
      mode: 'Airport Luxury Escort Transfer',
      icon: 'Plane',
      cost_indication: '₹3,000 - ₹5,500 per transfer',
      description: 'Pre-arranged priority pickup from Chhatrapati Shivaji Maharaj International Airport.'
    },
    {
      mode: 'Private Speedboat Charter to Elephanta',
      icon: 'Ship',
      cost_indication: '₹8,000 - ₹15,000 charter',
      description: 'Exclusive private boat transfer across Mumbai Harbour departing directly from Gateway of India.'
    },
    {
      mode: 'Bespoke Heritage City Tour Chauffeur',
      icon: 'Compass',
      cost_indication: '₹7,500 / day',
      description: 'Full-day premium touring with English-speaking heritage concierge driver.'
    }
  ]
};

const SECTIONS = [
  {
    id: 'featured',
    title: 'Popular & Featured Landmarks',
    description: 'The ten most iconic and world-renowned destinations in Mumbai.',
    placeIds: FEATURED_IDS,
  },
  {
    id: 'heritage',
    title: 'Heritage & Colonial Landmarks',
    description: 'Victorian Gothic masterpieces, UNESCO sites, and ancient stone monuments.',
    placeIds: [
      'mumbai-001', 'mumbai-002', 'mumbai-003', 'mumbai-004', 'mumbai-008',
      'mumbai-009', 'mumbai-010', 'mumbai-011', 'mumbai-012', 'mumbai-013',
      'mumbai-014', 'mumbai-015', 'mumbai-034'
    ],
  },
  {
    id: 'religious',
    title: 'Religious & Cultural Shrines',
    description: 'Sacred coastal temples, historic dargahs, basilicas, and synagogues.',
    placeIds: [
      'mumbai-016', 'mumbai-017', 'mumbai-018', 'mumbai-019', 'mumbai-020',
      'mumbai-021', 'mumbai-022'
    ],
  },
  {
    id: 'museums',
    title: 'Museums & Art Galleries',
    description: 'Indo-Saracenic galleries, cinematic archives, and contemporary art hubs.',
    placeIds: [
      'mumbai-005', 'mumbai-006', 'mumbai-007', 'mumbai-024', 'mumbai-025',
      'mumbai-026', 'mumbai-027', 'mumbai-028'
    ],
  },
  {
    id: 'nature',
    title: 'Nature, Parks & Wildlife',
    description: 'Tropical rainforests, hilltop viewpoints, terraced gardens, and zoos.',
    placeIds: [
      'mumbai-030', 'mumbai-031', 'mumbai-032', 'mumbai-033', 'mumbai-040'
    ],
  },
  {
    id: 'beaches',
    title: 'Beaches & Coastal Promenades',
    description: 'Panoramic Arabian Sea boulevards, sunset sands, and sea-spray vistas.',
    placeIds: [
      'mumbai-035', 'mumbai-036', 'mumbai-037', 'mumbai-039'
    ],
  },
  {
    id: 'modern',
    title: 'Modern Mumbai Attractions',
    description: 'Architectural engineering marvels, interactive science parks, and innovation hubs.',
    placeIds: [
      'mumbai-023', 'mumbai-029', 'mumbai-038'
    ],
  }
];

const ITINERARY_CIRCUITS = [
  {
    day_number: 1,
    area_title: 'South Mumbai & Colaba Heritage',
    area_name: 'Colaba & Fort',
    subtitle: 'Iconic waterfront monuments, Indo-Saracenic museums and sunset promenades.',
    hero_image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    places: [
      { id: 'mumbai-004', name: 'Gateway of India', distance_info: '0 km', category: 'Heritage Landmark' },
      { id: 'mumbai-005', name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya', distance_info: '~ 1.2 km', category: 'Museum and Heritage' },
      { id: 'mumbai-025', name: 'National Gallery of Modern Art', distance_info: '~ 0.5 km', category: 'Art Gallery' },
      { id: 'mumbai-035', name: 'Marine Drive', distance_info: '~ 2.0 km', category: 'Beachfront and Viewpoint' }
    ],
    shopping: ['Colaba Causeway Street Stalls', 'Kala Ghoda Art Boutiques']
  },
  {
    day_number: 2,
    area_title: 'Fort & Victorian Gothic World Heritage',
    area_name: 'Fort Precinct',
    subtitle: 'UNESCO Victorian Gothic & Art Deco Ensembles, clock towers and historic libraries.',
    hero_image_url: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&auto=format&fit=crop&q=80',
    places: [
      { id: 'mumbai-001', name: 'Chhatrapati Shivaji Maharaj Terminus', distance_info: '0 km', category: 'UNESCO and Heritage' },
      { id: 'mumbai-003', name: 'Victorian Gothic and Art Deco Ensembles of Mumbai', distance_info: '~ 1.0 km', category: 'UNESCO and Heritage' },
      { id: 'mumbai-014', name: 'Rajabai Clock Tower', distance_info: '~ 0.8 km', category: 'Heritage Landmark' },
      { id: 'mumbai-013', name: 'Asiatic Society Library', distance_info: '~ 0.9 km', category: 'Heritage and Library' },
      { id: 'mumbai-034', name: 'Horniman Circle Garden', distance_info: '~ 0.3 km', category: 'Park and Heritage' }
    ],
    shopping: ['Crawford Market Spices', 'Fort Antique Book Stalls']
  },
  {
    day_number: 3,
    area_title: 'Kala Ghoda Art Quarter & Heritage Villages',
    area_name: 'Kala Ghoda & Girgaon',
    subtitle: 'Contemporary art galleries, historic synagogues and Portuguese-era lanes.',
    hero_image_url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop&q=80',
    places: [
      { id: 'mumbai-026', name: 'Jehangir Art Gallery', distance_info: '0 km', category: 'Art Gallery' },
      { id: 'mumbai-015', name: 'David Sassoon Library', distance_info: '~ 0.2 km', category: 'Heritage and Library' },
      { id: 'mumbai-022', name: 'Knesset Eliyahoo Synagogue', distance_info: '~ 0.4 km', category: 'Religious and Heritage' },
      { id: 'mumbai-012', name: 'Khotachiwadi Heritage Village', distance_info: '~ 3.5 km', category: 'Heritage Village' },
      { id: 'mumbai-007', name: 'Mani Bhavan Gandhi Sangrahalaya', distance_info: '~ 1.5 km', category: 'Museum and Religious-Historical' }
    ],
    shopping: ['Kala Ghoda Designer Studios', 'Girgaon Sweet Marts']
  },
  {
    day_number: 4,
    area_title: 'Elephanta Island UNESCO Excursion & Malabar Sunset',
    area_name: 'Elephanta Island & Malabar Hill',
    subtitle: 'Ancient 6th-century rock-cut cave temples and terraced hilltop gardens.',
    hero_image_url: 'https://images.unsplash.com/photo-1609137144822-79f972b901fc?w=800&auto=format&fit=crop&q=80',
    places: [
      { id: 'mumbai-002', name: 'Elephanta Caves', distance_info: '0 km (Ferry from Gateway)', category: 'UNESCO and Heritage' },
      { id: 'mumbai-036', name: 'Girgaum Chowpatty', distance_info: '~ 11 km (Post-ferry return)', category: 'Beach' },
      { id: 'mumbai-032', name: 'Hanging Gardens', distance_info: '~ 2.5 km', category: 'Park and Viewpoint' },
      { id: 'mumbai-033', name: 'Kamala Nehru Park', distance_info: '~ 0.2 km', category: 'Park and Viewpoint' }
    ],
    shopping: ['Chowpatty Beach Kiosks', 'Malabar Hill Curios']
  },
  {
    day_number: 5,
    area_title: 'Worli & Byculla Coastal & Cultural Trail',
    area_name: 'Worli & Byculla',
    subtitle: 'Sacred marine dargahs, coastal forts and Victorian botanical gardens.',
    hero_image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    places: [
      { id: 'mumbai-020', name: 'Haji Ali Dargah', distance_info: '0 km', category: 'Religious and Heritage' },
      { id: 'mumbai-017', name: 'Mahalakshmi Temple', distance_info: '~ 1.0 km', category: 'Religious' },
      { id: 'mumbai-039', name: 'Worli Sea Face', distance_info: '~ 2.5 km', category: 'Modern Mumbai Attraction and Viewpoint' },
      { id: 'mumbai-011', name: 'Worli Fort', distance_info: '~ 2.0 km', category: 'Heritage Landmark' },
      { id: 'mumbai-006', name: 'Dr. Bhau Daji Lad Museum', distance_info: '~ 4.5 km', category: 'Museum and Heritage' },
      { id: 'mumbai-030', name: 'Veermata Jijabai Bhosale Udyan and Zoo', distance_info: '~ 0.2 km', category: 'Park and Zoo' }
    ],
    shopping: ['High Street Phoenix', 'Byculla Flower Bazaar']
  },
  {
    day_number: 6,
    area_title: 'Bandra West & Modern Mumbai Sea Link',
    area_name: 'Bandra & Prabhadevi',
    subtitle: 'Coastal battlements, hilltop basilicas, modern bridges and vibrant bazaars.',
    hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    places: [
      { id: 'mumbai-010', name: 'Bandra Fort', distance_info: '0 km', category: 'Heritage Landmark' },
      { id: 'mumbai-021', name: 'Mount Mary Basilica', distance_info: '~ 1.2 km', category: 'Religious and Heritage' },
      { id: 'mumbai-038', name: 'Bandra–Worli Sea Link', distance_info: '~ 2.0 km', category: 'Modern Mumbai Attraction' },
      { id: 'mumbai-016', name: 'Siddhivinayak Temple', distance_info: '~ 3.5 km', category: 'Religious' },
      { id: 'mumbai-023', name: 'Nehru Science Centre', distance_info: '~ 4.0 km', category: 'Science Centre' }
    ],
    shopping: ['Linking Road Street Fashion', 'Hill Road Artisan Markets']
  },
  {
    day_number: 7,
    area_title: 'Sanjay Gandhi National Park & Northern Wilderness',
    area_name: 'Borivali & Juhu',
    subtitle: 'Ancient rock-cut Buddhist caves, dense forest safari and sunset beaches.',
    hero_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    places: [
      { id: 'mumbai-031', name: 'Sanjay Gandhi National Park', distance_info: '0 km', category: 'National Park and Nature' },
      { id: 'mumbai-008', name: 'Kanheri Caves', distance_info: '~ 6.0 km (Inside SGNP)', category: 'Heritage and Religious' },
      { id: 'mumbai-040', name: 'Sanjay Gandhi National Park Lion and Tiger Safari', distance_info: '~ 2.0 km', category: 'Wildlife Attraction' },
      { id: 'mumbai-037', name: 'Juhu Beach', distance_info: '~ 18 km (Southbound Sunset)', category: 'Beach' }
    ],
    shopping: ['SGNP Nature Souvenir Kiosk', 'Juhu Beach Handicraft Stalls']
  }
];

const tsContent = `/**
 * AUTOGENERATED MUMBAI MASTER DATASET — SINGLE SOURCE OF TRUTH
 * 
 * Contains all 40 verified Mumbai attractions with complete metadata,
 * verified coordinates, authentic photography, tiered stays, transportation modes,
 * and invariant local food & shopping recommendations.
 */

export interface MumbaiAttraction {
  id: string;
  name: string;
  category: string;
  area: string;
  description: string;
  best_for: string[];
  suggested_duration: string;
  best_time_to_visit: string;
  entry_fee: string;
  opening_hours: string;
  visitor_notes: string;
  map_search: string;
  tags: string[];
  city: string;
  city_id: string;
  state: string;
  state_id: string;
  country: string;
  lat: number;
  lng: number;
  latitude: number;
  longitude: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  thumbnail_url: string;
  image_url: string;
  images: string[];
  section: string;
  source_url: string;
  source_name: string;
  heritage_status: string;
  verification_status: string;
  data_confidence: string;
  rating: number;
  features: {
    map: boolean;
    navigation: boolean;
    ai: boolean;
    '3d': boolean;
  };
}

export interface LocalPickItem {
  id: string;
  name: string;
  area: string;
  cuisine?: string;
  specialties: string[];
  description: string;
  price_for_two?: string;
  best_time?: string;
  address: string;
  timing?: string;
  thumbnail_url: string;
}

export interface RecommendedStayItem {
  id: string;
  name: string;
  type: string;
  area: string;
  price_range: string;
  rating: number;
  highlights: string[];
  thumbnail_url: string;
}

export interface TransitModeItem {
  mode: string;
  icon: string;
  cost_indication: string;
  description: string;
}

export interface DestinationSection {
  id: string;
  title: string;
  description: string;
  placeIds: string[];
}

export const MUMBAI_ATTRACTIONS: MumbaiAttraction[] = ${JSON.stringify(places, null, 2)};

export const MUMBAI_FEATURED_IDS: string[] = ${JSON.stringify(FEATURED_IDS, null, 2)};

export const MUMBAI_LOCAL_PICKS = ${JSON.stringify(LOCAL_PICKS, null, 2)};

export const MUMBAI_STAYS = ${JSON.stringify(STAYS, null, 2)};

export const MUMBAI_TRANSPORTATION = ${JSON.stringify(TRANSPORTATION, null, 2)};

export const MUMBAI_SECTIONS: DestinationSection[] = ${JSON.stringify(SECTIONS, null, 2)};

export const MUMBAI_ITINERARY_CIRCUITS = ${JSON.stringify(ITINERARY_CIRCUITS, null, 2)};

export function getMumbaiAttractionById(id: string): MumbaiAttraction | undefined {
  const norm = (id || '').toLowerCase().trim();
  return MUMBAI_ATTRACTIONS.find((p) => p.id.toLowerCase() === norm);
}

export function searchMumbaiAttractions(query: string): MumbaiAttraction[] {
  if (!query || !query.trim()) return MUMBAI_ATTRACTIONS;
  const q = query.toLowerCase().trim();
  return MUMBAI_ATTRACTIONS.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.map_search.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.best_for.some((b) => b.toLowerCase().includes(q))
    );
  });
}
`;

const destTsPath = path.join(process.cwd(), 'src', 'data', 'mumbaiMasterData.ts');
fs.writeFileSync(destTsPath, tsContent, 'utf-8');
console.log('✅ Wrote Mumbai master TypeScript module to', destTsPath);
