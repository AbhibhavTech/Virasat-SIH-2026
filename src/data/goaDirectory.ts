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
    id: 'goa',
    code: 'IN-GA-GOA-ULTIMATE',
    name: 'Goa (Panaji & Coastal Hubs)',
    nickname: "India's Coastal Paradise & Latin Quarter",
    tagline: 'Baroque UNESCO churches, sunlit sands, Latin quarter alleys & Indo-Portuguese gastronomy',
    accentColor: '#0284C7',
    bgGradient: 'from-amber-50 via-sky-50/40 to-teal-50/30',
    coverImage: '/images/goa/bom-jesus.png',
    photoCredit: 'Discover Bharat Contributor / Basilica of Bom Jesus & Fontainhas',
    flashcardBlurb:
      "India's coastal paradise, celebrated for its golden sand beaches, Portuguese colonial Baroque architecture, vibrant nightlife, and distinct Indo-Latin culinary heritage.",
    topStays: [
      { name: 'Taj Exotica Resort & Spa', category: 'Benaulim — Mediterranean-style Luxury Beach Resort' },
      { name: 'The Leela Goa', category: 'Cavelossim — 5-Star Beachfront Luxury Estate' },
      { name: 'Ahilya by the Sea', category: 'Dolceman - Candolim — Boutique Heritage Coastal Stay' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Gunpowder',
          location: 'Assagao',
          specialties: 'South Indian coastal fusion in a jungle garden setting',
        },
        {
          restaurant: 'Cafe Bhonsle',
          location: 'Panaji',
          specialties: 'Local Goan vegetarian breakfast like Samosa misal and puri bhaji',
        },
      ],
      nonVeg: [
        {
          restaurant: "Fisherman's Wharf",
          location: 'Cavelossim',
          specialties: 'Riverside Goan prawn curry and bebinca',
        },
        {
          restaurant: "Mum's Kitchen",
          location: 'Panaji',
          specialties: 'Authentic traditional Goan Catholic house recipes like Xacuti and Sorpotel',
        },
      ],
      peacefulNote:
        'Goan cuisine marries Portuguese colonial zest with coastal Konkani spices, featuring fiery vindaloo, coconut-infused fish curries, and multi-layered sweet bebinca.',
    },
    attractions: [
      {
        id: 'IN-GA-GOA-ATT-001',
        name: 'Basilica of Bom Jesus & Old Goa Churches',
        category: 'Heritage: UNESCO World Heritage, Christianity',
        timings: '09:00–18:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/goa/bom-jesus.png',
        photoCredit: 'User Photo / Basilica of Bom Jesus',
        summary:
          '16th-century Baroque church holding the mortal remains of St. Francis Xavier.',
      },
      {
        id: 'IN-GA-GOA-ATT-002',
        name: 'Fort Aguada',
        category: 'Heritage: Palaces & Forts',
        timings: '09:30–18:00',
        fee: { domestic: 'INR 25', foreign: 'INR 25' },
        isHiddenGem: false,
        image: '/images/goa/fort-aguada.png',
        photoCredit: 'User Photo / Fort Aguada Coastal Ramparts',
        summary:
          '17th-century Portuguese fort and lighthouse overlooking the confluence of the Mandovi River and Arabian Sea.',
      },
      {
        id: 'IN-GA-GOA-ATT-003',
        name: 'Palolem & Anjuna Beaches',
        category: 'Nature / Adventure: Beaches',
        timings: 'Open 24 hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Palolem_Beach%2C_South_Goa.jpg/1280px-Palolem_Beach%2C_South_Goa.jpg',
        photoCredit: 'Wikimedia Commons / Palolem Beach Crescent',
        summary:
          'Iconic contrasting coastal stretches ranging from the serene southern crescent of Palolem to the rocky northern bohemian vibe of Anjuna.',
      },
      {
        id: 'IN-GA-GOA-GEM-001',
        name: 'Chorla Ghat',
        category: 'Nature / Adventure: Hills & Mountains',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Chorla Ghat Rainforest',
        summary:
          'A misty rainforest plateau at the tri-junction of Goa, Maharashtra, and Karnataka featuring hidden waterfalls and rare wildlife.',
      },
      {
        id: 'IN-GA-GOA-GEM-002',
        name: 'Fontainhas Latin Quarter',
        category: 'Heritage: Architecture',
        timings: 'Walking tours anytime',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Fontainhas Latin Quarter',
        summary:
          'Panaji\'s oldest heritage ward filled with narrow winding lanes, bright pastel-colored colonial houses with shell-window panes.',
      },
    ],
  },
  {
    id: 'north-goa',
    code: 'IN-GA-DIST-NGA',
    name: 'North Goa',
    nickname: 'The Sunlit Coast & Colonial Bastions',
    tagline: '17th-century ramparts, Latin Quarter streets & vibrant coastal culture',
    accentColor: '#0284C7',
    bgGradient: 'from-amber-50 via-sky-50/40 to-teal-50/30',
    coverImage: '/images/goa/bom-jesus.png',
    photoCredit: 'User Photo / Basilica of Bom Jesus',
    flashcardBlurb:
      'A dynamic mix of Portuguese colonial architecture, 17th-century coastal ramparts, bustling flea markets, water sports, and energetic beach stretches from Candolim to Vagator.',
    topStays: [
      { name: 'Taj Fort Aguada Resort & Spa', category: 'Sinquerim — Luxury Beachfront Heritage' },
      { name: 'Ahilya by the Sea', category: 'Nerul — Boutique Coastal Estate' },
      { name: 'W Goa', category: 'Vagator — Luxury Lifestyle Resort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Bean Me Up', location: 'Anjuna', specialties: 'Vegan garden cafe, wood-fired pizza' },
        { restaurant: 'Navtara Pure Veg', location: 'Panaji / Calangute', specialties: 'South Indian tiffins & Goan veg thali' },
      ],
      nonVeg: [
        { restaurant: 'The Greek Taverna Thalassa', location: 'Siolim', specialties: 'Mediterranean cuisine with sunsets' },
        { restaurant: 'Gunpowder', location: 'Assagao', specialties: 'Kerala Beef Roast, Pandi Curry, Appam' },
        { restaurant: 'Vinayak Family Restaurant', location: 'Assagao', specialties: 'Fresh Fish Thali' },
      ],
      peacefulNote: 'North Goa dining brings together open-air garden vegan cafes with rustic tavern shacks serving freshly caught seafood simmered in roasted kokum and coconut milk.',
    },
    attractions: [
      {
        id: 'IN-GA-NGA-ATT-001',
        name: 'Basilica of Bom Jesus & Se Cathedral, Old Goa',
        category: 'Heritage / Spiritual: UNESCO World Heritage, Christianity, Historical Buildings',
        timings: '09:00–17:00 (Sundays 11:00–17:00)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/goa/bom-jesus.png',
        photoCredit: 'User Photo / Basilica of Bom Jesus',
        summary:
          '16th-century Baroque architectural marvel housing the sacred relics of St. Francis Xavier, standing opposite Se Cathedral—the largest ecclesiastical edifice in Asia.',
      },
      {
        id: 'IN-GA-NGA-ATT-002',
        name: 'Fort Aguada & 1864 Lighthouse',
        category: 'Heritage: Palaces & Forts, Monuments, Historical Sites',
        timings: '09:30–18:00',
        fee: { domestic: 'Free (Lower Aguada Jail Museum entry ticket charged separately)', foreign: 'Free (Lower Aguada Jail Museum entry ticket charged separately)' },
        isHiddenGem: false,
        image: '/images/goa/fort-aguada.png',
        photoCredit: 'User Photo / Fort Aguada Coastal Ramparts',
        summary:
          'Commanding 17th-century Portuguese fortress above the Mandovi estuary, built with an underground freshwater cistern of 2.3-million-gallon capacity and an iconic four-tiered historic lighthouse.',
      },
      {
        id: 'IN-GA-NGA-ATT-003',
        name: 'Chapora Fort',
        category: 'Heritage / Nature: Historical Sites, Hills & Mountains, Sunset Vista',
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
        name: 'Anjuna Flea Market & Beach',
        category: 'Arts / Nature: Boho Lifestyle, Beaches, Trance & Crafts',
        timings: 'Beach open 24 hours; Market on Wednesdays',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary:
          'Legendary beach promenade and flea market that birthed Goa’s 1960s bohemian culture, featuring handmade silver jewelry, Tibetan singing bowls, and beachside live acoustic sets.',
      },
      {
        id: 'IN-GA-NGA-GEM-001',
        name: 'Divar Island',
        category: 'Rural / Heritage: Agro-Tourism, Live Like a Local, Bonderam Culture',
        timings: 'Open 24 Hours (Public vehicle/passenger Ro-Ro ferry from Ribandar runs frequently)',
        fee: { domestic: 'Free for pedestrians & two-wheelers (Nominal car tariff)', foreign: 'Free for pedestrians & two-wheelers (Nominal car tariff)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Divar Countryside',
        summary:
          'A tranquil riverine island accessible only by river ferry across the Mandovi, preserving centuries-old ancestral homes, khazan dyke wetlands, and the vibrant harvest pageant of Bonderam.',
      },
      {
        id: 'IN-GA-NGA-GEM-002',
        name: 'Fontainhas Latin Quarter, Panaji',
        category: 'Heritage / Arts: Historical Buildings, 18th-century Portuguese Architecture',
        timings: 'Open 24 Hours (Best walking 07:00–10:00 & 16:30–18:30)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Fontainhas',
        summary:
          'Asia’s only surviving Latin Quarter, characterized by pastel yellow, blue, and terracotta Portuguese-era manors, overhanging wrought-iron balconies, and tiled Azulejos street names.',
      },
      {
        id: 'IN-GA-NGA-GEM-003',
        name: 'Chorao Island & Dr. Salim Ali Bird Sanctuary',
        category: 'Nature / Rural: Wildlife-Tourism, Mangrove Forests, Eco-Tourism',
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
        { restaurant: 'Martins Pure Veg', location: 'Madgaon', specialties: 'Multi-cuisine Vegetarian, Thalis' },
        { restaurant: 'Blue Planet Cafe', location: 'Agonda', specialties: 'Organic Vegan bowls, Flaxseed smoothies' },
      ],
      nonVeg: [
        { restaurant: "Martin's Corner", location: 'Betalbatim', specialties: 'Crab Masala Fry, Pork Vindaloo, Bebinca' },
        { restaurant: 'Zeebop by the Sea', location: 'Majorda', specialties: 'Fresh seafood by the beach' },
        { restaurant: "The Fisherman's Wharf", location: 'Salcette', specialties: 'Traditional Goan fish curry, butter garlic crab' },
      ],
      peacefulNote: 'South Goan ancestral cuisine honors ancient clay pots, fragrant coconut vinegars, slow wood-fired braising, and rare heirloom Goan Catholic recipes.',
    },
    attractions: [
      {
        id: 'IN-GA-SGA-ATT-001',
        name: 'Dudhsagar Waterfalls',
        category: 'Nature / Adventure: Rivers & Lakes, Hiking & Trekking, India\'s 5th-highest waterfall (310 m)',
        timings: '08:30–16:00 (Forest gate permits)',
        fee: { domestic: 'Forest Permit & Jeep Safari from Kulem approx INR 1,999–2,200 per person', foreign: 'Forest Permit & Jeep Safari from Kulem approx INR 1,999–2,200 per person' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Dudhsagar_Falls_Train.jpg/1280px-Dudhsagar_Falls_Train.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Magnificent four-tiered 310-meter white cataract plummeting down emerald Western Ghats cliffs, crossed midway by a historic arched railway bridge.',
      },
      {
        id: 'IN-GA-SGA-ATT-002',
        name: 'Palolem Beach & Butterfly Island',
        category: 'Nature / Adventure: Beaches & Cruises, Sea Kayaking, Boat Safaris',
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
        name: 'Cabo de Rama Fort & Cliff',
        category: 'Heritage / Nature: Palaces & Forts, Hills & Mountains, Coastal Cliff Viewpoints',
        timings: '09:00–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Cabo_de_Rama_Fort_view.jpg/1280px-Cabo_de_Rama_Fort_view.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'One of the oldest coastal fortifications in Goa steeped in Ramayana lore, perched atop dramatic coastal cliffs where ancient cannons overlook turquoise Arabian Sea waters.',
      },
      {
        id: 'IN-GA-SGA-ATT-004',
        name: 'Shri Shantadurga Temple, Kavlem',
        category: 'Spiritual: Hinduism, South Goa\'s most important Hindu pilgrimage site',
        timings: '05:00–22:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Shanta_durga_temple.JPG/1280px-Shanta_durga_temple.JPG',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Venerable 1738 temple complex dedicated to Goddess Shantadurga who mediated between Vishnu and Shiva, featuring a striking blend of Indo-Portuguese temple architecture with a pyramidical shikhar and deepstambha.',
      },
      {
        id: 'IN-GA-SGA-GEM-001',
        name: 'Tambdi Surla Mahadev Temple',
        category: 'Spiritual / Heritage: Hinduism, 12th-century Kadamba-Yadava Basalt Architecture',
        timings: '08:30–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Tambdi_Surla_temple.jpg/1280px-Tambdi_Surla_temple.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Goa’s oldest surviving temple (12th century), carved entirely from grey-black weather-resistant basalt in Kadamba-Yadava style deep in the Bhagwan Mahavir Wildlife Sanctuary.',
      },
      {
        id: 'IN-GA-SGA-GEM-002',
        name: 'Cola Beach & Freshwater Lagoon',
        category: 'Nature: Beaches & Cruises, Hidden Lagoons, Kayaking',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free (Kayaking INR 150–250)', foreign: 'Free (Kayaking INR 150–250)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Cola Beach Lagoon',
        summary:
          'A hidden natural gem where an emerald freshwater river forms a tranquil lagoon separated from the crashing ocean waves by a strip of golden sand.',
      },
      {
        id: 'IN-GA-SGA-GEM-003',
        name: 'Netravali & Cotigao Wildlife Sanctuaries',
        category: 'Nature: Wildlife-Tourism, Forests & Gardens, Western Ghats Biodiversity',
        timings: '08:00–17:00',
        fee: { domestic: 'INR 20–50', foreign: 'INR 100' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Western Ghats Canopy',
        summary:
          'Dense evergreen tropical rain forests in the southern foothills of the Western Ghats, sheltering rare black panthers, giant flying squirrels, the mystical bubbling Netravali lake, and ancient multi-tiered canopies.',
      },
    ],
  },
];
