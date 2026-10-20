export interface GoaStay {
  name: string;
  category: string;
}

export interface GoaFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface GoaDining {
  veg: GoaFoodSpot[];
  nonVeg: GoaFoodSpot[];
  peacefulNote?: string;
}

export interface GoaAttraction {
  id: string;
  name: string;
  category: string;
  timings: string;
  fee: {
    domestic: string;
    foreign: string;
  };
  isHiddenGem: boolean;
  image: string;
  photoCredit: string;
  summary: string;
}

export interface GoaDistrict {
  id: string;
  code: string;
  name: string;
  nickname: string;
  tagline: string;
  accentColor: string;
  bgGradient: string;
  flashcardBlurb: string;
  coverImage: string;
  photoCredit: string;
  topStays: GoaStay[];
  dining: GoaDining;
  attractions: GoaAttraction[];
}

export const GOA_DIRECTORY: GoaDistrict[] = [
  {
    id: 'north-goa',
    code: 'IN-GA-DIST-NGA',
    name: 'North Goa',
    nickname: 'The Sunlit Coast & Colonial Bastions',
    tagline: '17th-century ramparts, Latin Quarter streets & vibrant coastal culture',
    accentColor: '#0284C7',
    bgGradient: 'from-amber-50 via-sky-50/40 to-teal-50/30',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / North Goa Shore',
    flashcardBlurb:
      'A dynamic mix of Portuguese colonial architecture, 17th-century coastal ramparts, bustling flea markets, water sports, and sunset cliff points.',
    topStays: [
      { name: 'Taj Fort Aguada Resort & Spa', category: 'Sinquerim — Luxury Beachfront Heritage' },
      { name: 'Ahilya by the Sea', category: 'Nerul — Boutique Coastal Estate' },
      { name: 'W Goa', category: 'Vagator — Luxury Lifestyle Resort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Bean Me Up', location: 'Anjuna', specialties: 'Vegan garden cafe, wood-fired artisan pizza & organic seasonal bowls' },
        { restaurant: 'Navtara Pure Veg', location: 'Panaji / Calangute', specialties: 'Crispy South Indian tiffins, Goan vegetarian thali & filter coffee' },
      ],
      nonVeg: [
        { restaurant: "Fisherman's Wharf", location: 'Panaji', specialties: 'Traditional Goan Prawn Curry with red rice, crispy Kingfish Rava Fry' },
        { restaurant: 'Gunpowder', location: 'Assagao', specialties: 'Kerala Spiced Beef Roast, Coorg Pandi Curry & fluffy Appams' },
        { restaurant: 'Vinayak Family Restaurant', location: 'Assagao', specialties: 'Legendary fresh Fish Thali, Crab Xacuti & Chonak Fry' },
      ],
      peacefulNote: 'North Goa dining brings together open-air garden vegan cafes with rustic tavern shacks serving freshly caught seafood simmered in roasted kokum and coconut milk.',
    },
    attractions: [
      {
        id: 'IN-GA-NGA-ATT-001',
        name: 'Basilica of Bom Jesus & Se Cathedral, Old Goa',
        category: 'Heritage / Spiritual · UNESCO World Heritage, Christianity & Historical Buildings',
        timings: '09:00–17:00 (Sundays 11:00–17:00)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Basilica_of_Bom_Jesus_in_Goa.jpg/1280px-Basilica_of_Bom_Jesus_in_Goa.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '16th-century Baroque architectural marvel housing the sacred relics of St. Francis Xavier, standing opposite Se Cathedral—the largest ecclesiastical edifice in Asia.',
      },
      {
        id: 'IN-GA-NGA-ATT-002',
        name: 'Fort Aguada & 1864 Lighthouse',
        category: 'Heritage · Palaces & Forts, Monuments & Historical Sites',
        timings: '09:30–18:00',
        fee: { domestic: 'Free (Lower Aguada Jail Museum ticket charged separately)', foreign: 'Free (Lower Aguada Jail Museum ticket charged separately)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Fort_Aguada_Lighthouse.jpg/1280px-Fort_Aguada_Lighthouse.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Commanding 17th-century Portuguese fortress above the Mandovi estuary, built with an underground freshwater cistern of 2.3-million-gallon capacity and an iconic four-tiered historic lighthouse.',
      },
      {
        id: 'IN-GA-NGA-ATT-003',
        name: 'Chapora Fort',
        category: 'Heritage / Nature · Historical Sites, Hills & Mountains, Sunset Vista',
        timings: '06:00–18:30 (Daylight access only)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary:
          'Red-laterite coastal bastion commanding sweeping panoramas over the Chapora River mouth and Vagator sands, celebrated as Goa’s most iconic coastal sunset overlook.',
      },
      {
        id: 'IN-GA-NGA-ATT-004',
        name: 'Fontainhas Latin Quarter, Panaji',
        category: 'Heritage / Arts · Historical Buildings, Traditional Portuguese Architecture',
        timings: 'Open 24 Hours (Best walking 07:00–10:00 & 16:30–18:30)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Fontainhas',
        summary:
          'Asia’s only surviving Latin Quarter, characterized by pastel yellow, blue, and terracotta Portuguese-era manors, overhanging wrought-iron balconies, and tiled Azulejos street names.',
      },
      {
        id: 'IN-GA-NGA-GEM-001',
        name: 'Divar Island',
        category: 'Rural / Heritage · Agro-Tourism, Live Like a Local, Bonderam Culture',
        timings: 'Open 24 Hours (Public vehicle/passenger Ro-Ro ferry from Ribandar/Old Goa runs every 15–30 mins)',
        fee: { domestic: 'Free for pedestrians & two-wheelers (Nominal car tariff)', foreign: 'Free for pedestrians & two-wheelers (Nominal car tariff)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Divar Countryside',
        summary:
          'A tranquil riverine island accessible only by river ferry across the Mandovi, preserving centuries-old ancestral homes, khazan dyke wetlands, and the vibrant harvest pageant of Bonderam.',
      },
      {
        id: 'IN-GA-NGA-GEM-002',
        name: 'Corjuem Fort, Aldona',
        category: 'Heritage · Palaces & Forts, Inland Military Strongholds',
        timings: '09:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Corjuem_Fort.jpg/1280px-Corjuem_Fort.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Rare square-plan 1705 inland fortress built of dark laterite stone guarding the Mapusa river, offering elevated rampart perimeter walks and peaceful views over the Goan countryside.',
      },
      {
        id: 'IN-GA-NGA-GEM-003',
        name: 'Chorao Island & Dr. Salim Ali Bird Sanctuary',
        category: 'Nature / Rural · Wildlife-Tourism, Mangrove Forests, Eco-Tourism',
        timings: '06:00–18:00',
        fee: { domestic: 'INR 20 (Boat tour: INR 200–500)', foreign: 'INR 100 (Boat tour: INR 200–500)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Mangrove Canopy',
        summary:
          'Goa’s premier 440-acre estuarine mangrove sanctuary on Chorao Island, traversed by silent paddle boats observing mudskippers, smooth-coated otters, kingfishers, and wintering waterfowl.',
      },
    ],
  },
  {
    id: 'south-goa',
    code: 'IN-GA-DIST-SGA',
    name: 'South Goa',
    nickname: 'The Peaceful Shore & Ancestral Manors',
    tagline: 'White-sand bays, ancient rock sanctuaries & grand Portuguese estates',
    accentColor: '#0D9488',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-amber-50/30',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Palolem Beach',
    flashcardBlurb:
      'The serene counterpart to the north, characterized by quiet white-sand bays, ancient rock-cut caves, inland wildlife reserves, and grand Portuguese ancestral mansions.',
    topStays: [
      { name: 'The Leela Goa', category: 'Mobor, Cavelossim — Ultra Luxury Beachfront Resort' },
      { name: 'Heritage Village Resort & Spa', category: 'Arossim — Colonial Architecture Estate' },
      { name: 'Cabo Serai', category: 'Cabo de Rama — Eco-Luxury Clifftop Cottages' },
    ],
    dining: {
      veg: [
        { restaurant: 'Martins Pure Veg', location: 'Madgaon', specialties: 'Multi-cuisine Vegetarian, crisp dosas & wholesome regional thalis' },
        { restaurant: 'Blue Planet Cafe', location: 'Agonda', specialties: 'Organic vegan nourish bowls, cold-pressed flaxseed smoothies & raw desserts' },
      ],
      nonVeg: [
        { restaurant: "Martin's Corner", location: 'Betalbatim', specialties: 'Spicy Crab Masala Fry, slow-simmered Pork Vindaloo & warm Bebinca' },
        { restaurant: 'Nostalgia by Chef Fernando', location: 'Raia', specialties: 'Authentic Goan Catholic heritage dining, Chicken Xacuti & Pork Sorpotel with Sannas' },
      ],
      peacefulNote: 'South Goan ancestral cuisine honors ancient clay pots, fragrant coconut vinegars, slow wood-fired braising, and rare heirloom Goan Catholic recipes.',
    },
    attractions: [
      {
        id: 'IN-GA-SGA-ATT-001',
        name: 'Cabo de Rama Fort & Cliff',
        category: 'Heritage / Nature · Palaces & Forts, Hills & Mountains, Coastal Cliff Viewpoints',
        timings: '09:00–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Cabo_de_Rama_Fort_view.jpg/1280px-Cabo_de_Rama_Fort_view.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'One of the oldest coastal fortifications in Goa steeped in Ramayana lore, perched atop dramatic coastal cliffs where ancient cannons overlook turquoise Arabian Sea waters.',
      },
      {
        id: 'IN-GA-SGA-ATT-002',
        name: 'Palolem Beach & Butterfly Island',
        category: 'Nature / Adventure · Beaches & Cruises, Sea Kayaking, Boat Safaris',
        timings: 'Open 24 Hours (Kayaking & boat trips best 06:30–17:30)',
        fee: { domestic: 'Free (Kayak hire: INR 200–400/hr)', foreign: 'Free (Kayak hire: INR 200–400/hr)' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Palolem Crescent',
        summary:
          'World-famous crescent bay of powdery white sands flanked by palm-crested promontories, ideal for gentle swimming, dolphin-spotting boat trips, and kayaking to Butterfly Island.',
      },
      {
        id: 'IN-GA-SGA-ATT-003',
        name: 'Dudhsagar Waterfalls',
        category: 'Nature / Adventure · Rivers & Lakes, Hiking & Trekking, Western Ghats',
        timings: '08:30–16:00 (Forest gate permits; seasonal closure during intense monsoon flooding)',
        fee: { domestic: 'Forest Permit & Jeep Safari from Kulem approx INR 1,999–2,200/person', foreign: 'Forest Permit & Jeep Safari from Kulem approx INR 1,999–2,200/person' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Dudhsagar_Falls_Train.jpg/1280px-Dudhsagar_Falls_Train.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Magnificent four-tiered 310-meter white cataract plummeting down emerald Western Ghats cliffs, crossed midway by a historic arched railway bridge.',
      },
      {
        id: 'IN-GA-SGA-ATT-004',
        name: 'Menezes Bragança House, Chandor',
        category: 'Heritage / Arts · Historical Buildings, Museums & Antique Furniture',
        timings: '09:30–17:00',
        fee: { domestic: 'Donation-based (~INR 100–150/person suggested)', foreign: 'Donation-based (~INR 100–150/person suggested)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Braganza_House_Chandor_Goa.jpg/1280px-Braganza_House_Chandor_Goa.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Grand 17th-century aristocratic mansion with 28 reception rooms, Belgian crystal chandeliers, hand-carved rosewood furniture, and a private library of rare colonial treatises.',
      },
      {
        id: 'IN-GA-SGA-GEM-001',
        name: 'Salaulim Dam & Botanical Gardens',
        category: 'Nature · Rivers & Lakes, Engineering Marvel Duckbill Spillway',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 20', foreign: 'INR 20' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Selaulim_dam_spillway.jpg/1280px-Selaulim_dam_spillway.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Spectacular engineering triumph featuring a rare semi-circular duckbill spillway creating a dramatic vortex mist canyon, adjoining terraced botanical rose gardens.',
      },
      {
        id: 'IN-GA-SGA-GEM-002',
        name: 'Tambdi Surla Mahadev Temple',
        category: 'Spiritual / Heritage · Hinduism, 12th-century Kadamba Basalt Architecture',
        timings: '08:30–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Tambdi_Surla_temple.jpg/1280px-Tambdi_Surla_temple.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Goa’s oldest surviving temple (12th century), carved entirely from grey-black weather-resistant basalt in Kadamba-Yadava style deep in the Bhagwan Mahavir Wildlife Sanctuary.',
      },
      {
        id: 'IN-GA-SGA-GEM-003',
        name: 'Cola Beach & Freshwater Blue Lagoon',
        category: 'Nature · Beaches & Cruises, Hidden Lagoons, Kayaking',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free (Kayaking INR 150–250)', foreign: 'Free (Kayaking INR 150–250)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Cola Beach Lagoon',
        summary:
          'A hidden natural gem where an emerald freshwater river forms a tranquil lagoon separated from the crashing ocean waves by a strip of golden sand.',
      },
    ],
  },
];
