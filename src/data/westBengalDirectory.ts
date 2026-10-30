export interface WestBengalStay {
  name: string;
  category: string;
}

export interface WestBengalFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface WestBengalDining {
  veg: WestBengalFoodSpot[];
  nonVeg: WestBengalFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface WestBengalAttraction {
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

export interface WestBengalCity {
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
  topStays: WestBengalStay[];
  dining: WestBengalDining;
  attractions: WestBengalAttraction[];
}

export const WEST_BENGAL_DIRECTORY: WestBengalCity[] = [
  {
    id: 'kolkata',
    code: 'IN-WB-CCU-ULTIMATE',
    name: 'Kolkata',
    nickname: 'The City of Joy & Cultural Capital',
    tagline: 'Colonial marble grandeur, yellow trams, literature & iconic sweets',
    accentColor: '#BE123C',
    bgGradient: 'from-rose-50 via-amber-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_Kolkata.jpg/1280px-Victoria_Memorial_Kolkata.jpg',
    photoCredit: 'Wikimedia Commons / Victoria Memorial',
    flashcardBlurb:
      "India's cultural capital and the intellectual heart of the East, celebrated for its colonial Victorian architecture, grand art galleries, yellow trams, literature, and mouthwatering sweets.",
    topStays: [
      { name: 'The Oberoi Grand', category: 'Esplanade — Grand Dame colonial luxury' },
      { name: 'Taj Bengal', category: 'Alipore — Luxury Garden Estate' },
      { name: 'The Peerless Inn', category: 'New Market — City Centre Comfort' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Flurys',
          location: 'Park Street',
          specialties: 'Historic tearoom for breakfast, pastries, and hot chocolate',
        },
        {
          restaurant: 'Ganguram',
          location: 'Multiple Outlets',
          specialties: 'Traditional Bengali sweets and rasgulla',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Arsalan',
          location: 'Park Circus',
          specialties: 'Legendary Kolkata Mutton Biryani',
        },
        {
          restaurant: 'Peter Cat',
          location: 'Park Street',
          specialties: 'World-famous Chelo Kebabs',
        },
        {
          restaurant: '6 Ballygunge Place',
          location: 'Ballygunge',
          specialties: 'Authentic Bengali thalis and kosha mangsho',
        },
      ],
      peacefulNote:
        'Kolkata gastronomy honors pungent mustard oil, panch phoron (five-spice blend), rich Kosha Mangsho, sweet soft chhena sandesh, and earthen-pot Mishti Doi.',
    },
    attractions: [
      {
        id: 'IN-WB-CCU-ATT-001',
        name: 'Victoria Memorial',
        category: 'Heritage: Museums',
        timings: 'Museum 10:00–18:00 (Closed Mondays); Gardens 05:30–18:30',
        fee: { domestic: 'Museum INR 50; Gardens INR 20', foreign: 'Museum INR 500; Gardens INR 20' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_Kolkata.jpg/1280px-Victoria_Memorial_Kolkata.jpg',
        photoCredit: 'Wikimedia Commons / Victoria Memorial',
        summary:
          'Iconic 20th-century white marble monument built during the British Raj, surrounded by sprawling gardens and art galleries.',
      },
      {
        id: 'IN-WB-CCU-ATT-002',
        name: 'Howrah Bridge',
        category: 'Heritage: Landmarks',
        timings: 'Open 24 hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Howrah_bridge_at_night.jpg/1280px-Howrah_bridge_at_night.jpg',
        photoCredit: 'Wikimedia Commons / Howrah Bridge',
        summary:
          'A massive balanced cantilever bridge spanning the Hooghly River without a single nut or bolt joining its main span.',
      },
      {
        id: 'IN-WB-CCU-ATT-003',
        name: 'Dakshineswar Kali Temple',
        category: 'Spiritual: Hinduism',
        timings: '06:00–12:30 & 15:30–20:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Dakshineswar_Temple_Kolkata.jpg/1280px-Dakshineswar_Temple_Kolkata.jpg',
        photoCredit: 'Wikimedia Commons / Dakshineswar Kali Temple',
        summary:
          '19th-century Navaratna temple on the riverbank associated with the mystic Ramakrishna Paramahamsa.',
      },
      {
        id: 'IN-WB-CCU-GEM-001',
        name: 'Marble Palace',
        category: 'Heritage: Historical Buildings',
        timings: '10:00–16:00 (Closed Mondays & Thursdays; Free pass required from West Bengal Tourism)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Marble_Palace_Kolkata.jpg/1280px-Marble_Palace_Kolkata.jpg',
        photoCredit: 'Wikimedia Commons / Marble Palace Kolkata',
        summary:
          '19th-century neoclassical mansion in North Kolkata housing Victorian art pieces, marble statues, and a private zoo.',
      },
      {
        id: 'IN-WB-CCU-GEM-002',
        name: 'Kumartuli',
        category: 'Arts / Heritage: Living Craft',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Kumartuli_Durga_Idol.jpg/1280px-Kumartuli_Durga_Idol.jpg',
        photoCredit: 'Wikimedia Commons / Kumartuli Artisans',
        summary:
          "A traditional potters' quarter where clay idols for Durga Puja and festivals are intricately sculpted by hand.",
      },
    ],
  },
  {
    id: 'darjeeling',
    code: 'IN-WB-CITY-DAJ',
    name: 'Darjeeling',
    nickname: 'The Queen of the Hills',
    tagline: 'UNESCO Toy Train, dawn Kanchenjunga panoramas & champagne orthodox tea estates',
    accentColor: '#047857',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Darjeeling_Himalayan_Railway.jpg/1280px-Darjeeling_Himalayan_Railway.jpg',
    photoCredit: 'Wikimedia Commons / DHR Toy Train',
    flashcardBlurb:
      '"The Queen of the Hills" in the Lower Himalayas, celebrated for the UNESCO Toy Train, fragrant champagne orthodox teas, and dawn panoramas over Mount Kanchenjunga.',
    topStays: [
      { name: 'The Glenburn Tea Estate', category: "Luxury Colonial Tea Planter's Bungalow" },
      { name: 'The Elgin Darjeeling', category: 'Heritage Luxury Hotel since 1887' },
      { name: 'Windamere Hotel', category: 'Historic Colonial Heritage on Observatory Hill' },
    ],
    dining: {
      veg: [
        { restaurant: "Sonam's Kitchen", location: 'Zakir Hussain Road', specialties: 'Fresh Hash Browns, warm Banana Buttermilk Pancakes, French Press coffee & ginger lemon tea' },
        { restaurant: "Glenary's Bakery", location: 'Ground Floor, Nehru Road', specialties: 'Fresh Cream Pastries, Cinnamon Buns, Apple Pies, artisanal chocolates & warm sourdough' },
      ],
      nonVeg: [
        { restaurant: 'Kunga Restaurant', location: 'Gandhi Road', specialties: 'Authentic Tibetan Steamed Pork and Chicken Momos, Gyathuk, and warming Thentuk noodle soup' },
        { restaurant: "Glenary's Restaurant & Pub", location: 'First Floor, Nehru Road', specialties: 'Roast Chicken with mushroom stuffing, Sizzlers, draught beer & Anglo-Indian meat pies' },
      ],
      peacefulNote: 'Hill gastronomy fuses aromatic Darjeeling First Flush teas, steaming Tibetan momos, spicy churpee cheese chutneys, and Anglo-Indian bakery roasts.',
    },
    attractions: [
      {
        id: 'IN-WB-DAJ-ATT-001',
        name: 'Tiger Hill Sunrise Point',
        category: 'Nature · Hills & Mountains, Sunrise Vistas of Mount Kanchenjunga & Mount Everest',
        timings: '04:00–07:00 (Jeeps depart central town by 03:30–04:00)',
        fee: { domestic: 'INR 50 (General) / INR 100–150 (Upper Lounge) + Jeep Hire', foreign: 'INR 50 (General) / INR 100–150 (Upper Lounge) + Jeep Hire' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Kanchenjunga_from_Tiger_Hill.jpg/1280px-Kanchenjunga_from_Tiger_Hill.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '2,590-meter summit famous for the breathtaking dawn phenomenon where rising sunrays tint the twin peaks of Mount Kanchenjunga and Mount Everest in shifting hues of gold and orange.',
      },
      {
        id: 'IN-WB-DAJ-ATT-002',
        name: 'Darjeeling Himalayan Railway (Toy Train Joyride)',
        category: 'Heritage · UNESCO World Heritage Sites, Mountain Railways of India, Batasia Loop & Ghum Run',
        timings: 'Joyride slots from 09:00 to 16:30',
        fee: { domestic: 'Diesel: ~INR 800–1,000; Steam: ~INR 1,300–1,500', foreign: 'Diesel: ~INR 800–1,000; Steam: ~INR 1,300–1,500' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Darjeeling_Himalayan_Railway.jpg/1280px-Darjeeling_Himalayan_Railway.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Two-foot narrow-gauge mountain railway opened in 1881, climbing loops and reverses to Ghum (India’s highest railway station at 2,258 m) powered by heritage coal-fired steam engines.',
      },
      {
        id: 'IN-WB-DAJ-ATT-003',
        name: 'Padmaja Naidu Himalayan Zoological Park & HMI',
        category: 'Nature / Adventure · Wildlife-Tourism (Red Panda & Snow Leopard Breeding Centers), Mountaineering Museum',
        timings: '08:30–16:30 (Closed Thursdays)',
        fee: { domestic: 'INR 110 (Combined Zoo & HMI)', foreign: 'INR 110 (Combined Zoo & HMI)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Red_Panda_Darjeeling_Zoo.jpg/1280px-Red_Panda_Darjeeling_Zoo.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'India\'s premier high-altitude zoo internationally renowned for captive breeding of Red Pandas, Snow Leopards, and Himalayan Wolves, co-located with Tenzing Norgay\'s Himalayan Mountaineering Institute.',
      },
      {
        id: 'IN-WB-DAJ-ATT-004',
        name: 'Happy Valley Tea Estate',
        category: 'Gastronomy / Rural · Farm to Table, Agro-Tourism, Century-Old Tea Processing Factory',
        timings: '09:30–16:30 (Factory operational March to November; closed Sundays & Mondays)',
        fee: { domestic: 'INR 100–150 for guided tea-plucking and tasting tour', foreign: 'INR 100–150 for guided tea-plucking and tasting tour' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Happy_Valley_Tea_Estate_Darjeeling.jpg/1280px-Happy_Valley_Tea_Estate_Darjeeling.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Established in 1854, Darjeeling’s second-oldest tea estate sprawling across 437 acres, offering guided garden strolls, factory plucking tours, and sensory tastings of world-class Muscatel and white teas.',
      },
      {
        id: 'IN-WB-DAJ-GEM-001',
        name: 'Old Ghoom Monastery (Yiga Choeling)',
        category: 'Spiritual / Heritage · Buddhism, 1850 Gelugpa Monastery, 15-Foot Clay Maitreya Buddha',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Cameras: INR 10–50)', foreign: 'Free (Cameras: INR 10–50)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Ghum_Monastery_Darjeeling.jpg/1280px-Ghum_Monastery_Darjeeling.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Historic 1850 Tibetan Buddhist monastery of the Yellow Hat (Gelugpa) sect, sheltering an ornate 15-foot clay statue of the Future Buddha (Maitreya) and ancient Sanskrit palm-leaf manuscripts.',
      },
      {
        id: 'IN-WB-DAJ-GEM-002',
        name: 'Batasia Loop War Memorial Garden',
        category: 'Heritage / Nature · Spiral Rail Engineering Marvel, Gorkha War Memorial, 360-Degree Kanchenjunga Panorama',
        timings: '05:00–18:00',
        fee: { domestic: 'INR 20–30', foreign: 'INR 20–30' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Batasia_Loop_Darjeeling.jpg/1280px-Batasia_Loop_Darjeeling.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A looping rail engineering marvel where the Toy Train navigates a 360-degree double-track spiral around a landscaped mountain garden and bronze memorial honoring brave Gorkha soldiers.',
      },
    ],
  },
  {
    id: 'sundarbans',
    code: 'IN-WB-CITY-SUN',
    name: 'Sundarbans',
    nickname: 'The Tidal Mangrove Realm of the Royal Bengal Tiger',
    tagline: 'World’s largest mangrove delta, tidal estuary boat safaris & canopy walkways',
    accentColor: '#0F766E',
    bgGradient: 'from-teal-50 via-emerald-50/30 to-stone-50/20',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Sundarban_Mangrove_Forest.jpg/1280px-Sundarban_Mangrove_Forest.jpg',
    photoCredit: 'Wikimedia Commons / Sundarbans Mangrove Forest',
    flashcardBlurb:
      'The world\'s largest contiguous mangrove delta and UNESCO biosphere reserve at the confluence of the Ganga and Brahmaputra, navigated purely by wooden safari boats through tiger-inhabited tidal estuaries.',
    topStays: [
      { name: 'Waxpol Sundarban Tiger Camp', category: 'Dayapur Island — Eco-Luxury Wildlife Resort' },
      { name: 'Sunderban Mangrove Retreat', category: 'Jamespore, Satjelia Island — Riverside Eco-Cottages' },
      { name: 'Royal Sundarban Wild Resort', category: 'Jharkhali Base — Nature Stay' },
    ],
    dining: {
      veg: [
        { restaurant: 'Resort Dining Halls', location: 'Dayapur & Satjelia Islands', specialties: 'Homestyle Bengali dishes: fluffy Luchi, spicy Aloo Dum, Chholar Dal with coconut bites, Beguni & roasted Moong Dal' },
      ],
      nonVeg: [
        { restaurant: 'Safari Boat Kitchens & Local Camps', location: 'Tidal Waterways', specialties: 'Catch of the day: Bhetki Macher Paturi wrapped in banana leaves, Chingri Malai Curry, Parshe Mach & Country Chicken Gravy cooked freshly on board' },
      ],
      peacefulNote: 'Delta boat dining centers on freshwater river fish, sweet river prawns simmered in thick coconut cream, and wood-fired homestyle Bengali feasts prepared fresh on the moving safari launch.',
    },
    attractions: [
      {
        id: 'IN-WB-SUN-ATT-001',
        name: 'Sajnekhali Watch Tower & Mangrove Interpretation Centre',
        category: 'Nature · Wildlife-Tourism, Forest Head Checkpost, Crocodile Pond & Mangrove Museum',
        timings: '07:00–17:00',
        fee: { domestic: 'Permit: ~INR 60–100 + Boat Permit (~INR 400–500/day)', foreign: 'Permit: INR 200 + Boat Permit (~INR 400–500/day)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Sajnekhali_Watch_Tower_Sundarbans.jpg/1280px-Sajnekhali_Watch_Tower_Sundarbans.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The administrative heart of Sundarbans Tiger Reserve, featuring an elevated observation tower overlooking sweet-water ponds, an endangered estuarine crocodile pond, and an informative Mangrove Interpretation Centre.',
      },
      {
        id: 'IN-WB-SUN-ATT-002',
        name: 'Dobanki Watch Tower & Canopy Walkway',
        category: 'Nature / Adventure · Forests & Gardens, 20-Foot-High Fenced Aerial Canopy Walk over Mangrove Swamps',
        timings: '07:00–16:30',
        fee: { domestic: 'Included in core Sundarbans boat permit', foreign: 'Included in core Sundarbans boat permit' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Dobanki_Canopy_Walk_Sundarbans.jpg/1280px-Dobanki_Canopy_Walk_Sundarbans.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A half-kilometer elevated wire-meshed canopy walkway suspended 20 feet above the tidal mudflats, providing a thrilling bird’s-eye perspective of the dense mangrove jungle and wildlife below.',
      },
      {
        id: 'IN-WB-SUN-ATT-003',
        name: 'Sudhanyakhali Watch Tower',
        category: 'Nature · Wildlife-Tourism, Freshwater Sweet-Water Pond for Spotting Tigers, Axis Deer, Wild Boars',
        timings: '07:00–16:30',
        fee: { domestic: 'Included in boat forest permit', foreign: 'Included in boat forest permit' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Sudhanyakhali_Sundarbans.jpg/1280px-Sudhanyakhali_Sundarbans.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Renowned as the most strategic tiger-sighting vantage point in the delta, built opposite an open meadow and a sweet-water reservoir frequented by Royal Bengal Tigers, spotted deer, and wild boars.',
      },
      {
        id: 'IN-WB-SUN-GEM-001',
        name: 'Netidhopani Watch Tower & 400-Year-Old Shiva Temple Ruins',
        category: 'Heritage / Spiritual · Archeological Sites, Folkloric Behula-Lakhindar Mythological Ruins inside dense core jungle',
        timings: '07:00–16:00 (Limited daily boat entry permits issued)',
        fee: { domestic: 'Special forest permit fees apply', foreign: 'Special forest permit fees apply' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Mangrove Jungle Shrine',
        summary:
          'Remains of a 400-year-old terracotta brick Shiva temple steeped in the folk legends of Manasa Mangal and Behula, surrounded by mysterious core mangrove swamps.',
      },
      {
        id: 'IN-WB-SUN-GEM-002',
        name: 'Burir Dabir Wooden Walkway (India-Bangladesh Border)',
        category: 'Adventure / Nature · Hiking & Trekking, Mudflat Boardwalk over Pneumatophores overlooking Raimangal River',
        timings: '07:30–16:00',
        fee: { domestic: 'Included in deep-zone boat tour permit', foreign: 'Included in deep-zone boat tour permit' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Sundarban_Mangrove_Forest.jpg/1280px-Sundarban_Mangrove_Forest.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A scenic wooden boardwalk traversing thousands of breathing roots (pneumatophores) along the Raimangal River marking the international boundary between India and Bangladesh.',
      },
    ],
  },
  {
    id: 'bishnupur',
    code: 'IN-WB-CITY-BIP',
    name: 'Bishnupur',
    nickname: 'The Terracotta & Baluchari Capital',
    tagline: '17th-century curved terracotta temples, Dhrupad classical music & Baluchari silk epics',
    accentColor: '#9A3412',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Rasmancha_Bishnupur.jpg/1280px-Rasmancha_Bishnupur.jpg',
    photoCredit: 'Wikimedia Commons / Rasmancha Bishnupur',
    flashcardBlurb:
      'The ancient capital of the Malla kings in the red-soil Rarh region, celebrated for 17th-century terracotta temples, classical Dhrupad music gharanas, and Baluchari silk weaving.',
    topStays: [
      { name: 'Baluchari Tourism Property', category: 'WBTDCL — State-Run Garden Retreat' },
      { name: 'Hotel Annapurna', category: 'Near Rasmancha — Central Comfortable Stay' },
      { name: 'Banalata Resort', category: 'Joypur Forest Outskirts — Agro-Eco Farm Resort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Posto-Bora Eateries', location: 'Bishnupur Market', specialties: 'Crisp deep-fried poppy-seed cakes (Posto Bora), Kolai er Dal, and steaming rice with pure cow ghee' },
        { restaurant: 'Ghosh Mistanna Bhandar', location: 'Bhairab Bankura Road', specialties: 'Iconic authentic Mecha Sandesh, Motichoor Ladoos & thick creamy curd' },
      ],
      nonVeg: [
        { restaurant: 'Hotel Amrapali Restaurant', location: 'Near Station Road', specialties: 'Rich Rui and Katla Macher Kalia, spicy Desi Mutton Curry & rice' },
        { restaurant: 'Banalata Forest Dining', location: 'Joypur Forest', specialties: 'Fresh Crab Curry, seasonal Hilsa / Eilsh, and country chicken cooked with stone-ground spices' },
      ],
      peacefulNote: 'Bankura cuisine highlights fragrant white poppy seeds (Posto), nutty Kolai Dal, earthen sweets like Mecha Sandesh, and sweet river crabs.',
    },
    attractions: [
      {
        id: 'IN-WB-BIP-ATT-001',
        name: 'Rasmancha',
        category: 'Heritage · Historical Buildings, Pyramidal Terracotta Pavilion (Oldest brick structure, 1600 AD, unique in India)',
        timings: '06:00–18:00 (Sunrise to Sunset)',
        fee: { domestic: 'INR 25 (ASI composite ticket covers all monuments)', foreign: 'INR 300 (ASI composite ticket covers all monuments)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Rasmancha_Bishnupur.jpg/1280px-Rasmancha_Bishnupur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Constructed in 1600 AD by King Bir Hambir, this unique stepped pyramidal brick pavilion with tiered concentric corridors is the oldest standing terracotta monument in Bengal, built to display Radha-Krishna idols during the Ras festival.',
      },
      {
        id: 'IN-WB-BIP-ATT-002',
        name: 'Jor Bangla Temple (Keshta Raya)',
        category: 'Heritage / Arts · Archeological Sites, Twin-Hut Do-Chala Brick Architecture with Exquisite Mahabharata Reliefs',
        timings: '06:00–18:00',
        fee: { domestic: 'Covered under ASI composite ticket', foreign: 'Covered under ASI composite ticket' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Jor_Bangla_Temple_Bishnupur.jpg/1280px-Jor_Bangla_Temple_Bishnupur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Architectural masterpiece built in 1655 AD replicating two joined traditional Bengal thatched huts (Do-Chala) crowned by a miniature shikhara, enveloped entirely in intricately carved terracotta plaques of the Ramayana, Mahabharata, and royal hunts.',
      },
      {
        id: 'IN-WB-BIP-ATT-003',
        name: 'Shyam Rai Temple (Pancha Ratna)',
        category: 'Heritage / Spiritual · Hinduism, 1643 AD Five-Spired Terracotta Masterpiece with Raslila Panels',
        timings: '06:00–18:00',
        fee: { domestic: 'Covered under ASI composite ticket', foreign: 'Covered under ASI composite ticket' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Shyam_Rai_Temple_Bishnupur.jpg/1280px-Shyam_Rai_Temple_Bishnupur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1643 AD Pancha-Ratna (five-jeweled) terracotta temple featuring five ornate spires and the most celebrated circular terracotta Raslila panels in Indian art history, depicting dancing gopis with Krishna.',
      },
      {
        id: 'IN-WB-BIP-ATT-004',
        name: 'Madan Mohan Temple',
        category: 'Spiritual / Heritage · Hinduism, Active Living Malla Shrine with Vaulted Eka-Ratna Tower',
        timings: '06:00–12:00 & 16:00–20:00',
        fee: { domestic: 'Free (Living temple prayers) / ASI grounds pass', foreign: 'Free (Living temple prayers) / ASI grounds pass' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Madan_Mohan_Temple_Bishnupur.jpg/1280px-Madan_Mohan_Temple_Bishnupur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Active living temple built in 1694 AD in the Eka-Ratna style featuring a curved roof and single pinnacle, deeply revered as the presiding guardian deity of the Malla kings.',
      },
      {
        id: 'IN-WB-BIP-GEM-001',
        name: 'Panchmura Terracotta Artisan Village',
        category: 'Arts / Rural · Crafts-Tourism, Birthplace of the Iconic Long-Eared Bankura Terracotta Horse',
        timings: '08:00–18:00',
        fee: { domestic: 'Free (Direct interaction with potters and kilns)', foreign: 'Free (Direct interaction with potters and kilns)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Bankura_Horse_Panchmura.jpg/1280px-Bankura_Horse_Panchmura.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Artisan hamlet 22 km from Bishnupur where Kumhakar families mold the iconic long-necked, erect-eared Bankura terracotta horse—the universal national symbol of Indian handicrafts.',
      },
      {
        id: 'IN-WB-BIP-GEM-002',
        name: 'Baluchari Silk Weaving Guilds of Tantipara',
        category: 'Arts / Rural · Textiles, Crafts-Tourism, Jacquard Weaving Depicting Epics on Silk Sarees',
        timings: '09:00–19:00',
        fee: { domestic: 'Free workshop visits', foreign: 'Free workshop visits' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Baluchari_Saree_Weaving.jpg/1280px-Baluchari_Saree_Weaving.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Traditional weavers’ quarter where master artisans spend months weaving pure mulberry silk sarees with intricate jacquard borders illustrating mythological episodes of the Ramayana and Mahabharata.',
      },
      {
        id: 'IN-WB-BIP-GEM-003',
        name: 'Dalmadal Kaman (Colossal Wrought-Iron Cannon)',
        category: 'Heritage · Historical Sites, 18th-Century Indigenous Cannon Used Against Maratha Bargi Invasions',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Dalmadal_Cannon_Bishnupur.jpg/1280px-Dalmadal_Cannon_Bishnupur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Massive 3.8-meter wrought-iron cannon forged in the 18th century, legendarily believed to have been fired by Lord Madan Mohan himself to repel the invading Maratha Bargi cavalry.',
      },
    ],
  },
];
