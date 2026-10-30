export interface TamilNaduStay {
  name: string;
  category: string;
}

export interface TamilNaduFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface TamilNaduDining {
  veg: TamilNaduFoodSpot[];
  nonVeg: TamilNaduFoodSpot[];
  peacefulNote?: string;
}

export interface TamilNaduAttraction {
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

export interface TamilNaduCity {
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
  topStays: TamilNaduStay[];
  dining: TamilNaduDining;
  attractions: TamilNaduAttraction[];
}

export const TAMIL_NADU_DIRECTORY: TamilNaduCity[] = [
  {
    id: 'chennai',
    code: 'IN-TN-MAA-ULTIMATE',
    name: 'Chennai',
    nickname: 'Cultural Capital of South India',
    tagline: 'Carnatic music traditions, Dravidian gopurams & colonial seaside ramparts',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: '/images/tamil-nadu/chennai-kapaleeshwarar.jpg',
    photoCredit: 'User Photo / Kapaleeshwarar Temple & Tank',
    flashcardBlurb:
      "The cultural capital of South India, set along the Coromandel Coast, famous for classical Carnatic music, Dravidian architecture, long sandy beaches, and authentic South Indian cuisine.",
    topStays: [
      { name: 'The Leela Palace Chennai', category: 'MRC Nagar — Sea-facing luxury' },
      { name: 'Taj Coromandel', category: 'Nungambakkam — Luxury Heritage' },
      { name: 'ITC Grand Chola', category: 'Guindy — Chola-inspired Grandeur' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Ratna Cafe',
          location: 'Triplicane',
          specialties: 'Legendary Sambar Idli since 1948',
        },
        {
          restaurant: 'Murugan Idli Shop',
          location: 'T. Nagar',
          specialties: 'Iconic fluffy idlis with specialized chutneys',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Buhari Hotel',
          location: 'Mount Road',
          specialties: 'Reputed birthplace of Chicken 65 and Chennai-style biryani',
        },
        {
          restaurant: 'Junior Kuppanna',
          location: 'Chennai Central',
          specialties: 'Authentic Kongu & Chettinad non-veg specialties',
        },
      ],
      peacefulNote:
        'Chennai cuisine is revered for slow-dripped degree filter kaapi, fragrant shallot sambar, freshly ground Chettinad black pepper, and banana-leaf hospitality.',
    },
    attractions: [
      {
        id: 'IN-TN-MAA-ATT-001',
        name: 'Marina Beach',
        category: 'Nature / Recreation: Beaches',
        timings: 'Open 24 hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Marina Beach',
        summary:
          "The country's longest natural urban beach spanning across the Bay of Bengal coastline.",
      },
      {
        id: 'IN-TN-MAA-ATT-002',
        name: 'Kapaleeshwarar Temple, Mylapore',
        category: 'Spiritual / Heritage: Hinduism',
        timings: '05:00–12:30 & 16:00–21:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/tamil-nadu/chennai-kapaleeshwarar.jpg',
        photoCredit: 'User Photo / Kapaleeshwarar Temple & Tank',
        summary:
          '7th-century classical Dravidian temple showcasing a towering multi-tiered gopuram covered in intricate stucco sculptures.',
      },
      {
        id: 'IN-TN-MAA-ATT-003',
        name: 'Government Museum, Egmore',
        category: 'Heritage: Museums',
        timings: '09:30–17:00 (Closed Fridays)',
        fee: { domestic: 'INR 15', foreign: 'INR 250' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Madras_museum_theatre_in_October_2007.jpg/1280px-Madras_museum_theatre_in_October_2007.jpg',
        photoCredit: 'Wikimedia Commons / Government Museum Egmore Theatre',
        summary:
          "One of India's oldest museums holding an exceptional collection of South Indian bronze sculptures and archaeological artifacts.",
      },
      {
        id: 'IN-TN-MAA-GEM-001',
        name: 'DakshinaChitra Heritage Museum',
        category: 'Heritage / Arts: Living History',
        timings: '10:00–18:00 (Closed Tuesdays)',
        fee: { domestic: 'INR 175', foreign: 'INR 350' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/DakshinaChitra_Heritage_Museum.jpg/1280px-DakshinaChitra_Heritage_Museum.jpg',
        photoCredit: 'Wikimedia Commons / DakshinaChitra Heritage Museum',
        summary:
          'Open-air cultural museum preserving authentic historic architectural houses and crafts from across Southern states.',
      },
      {
        id: 'IN-TN-MAA-GEM-002',
        name: 'San Thome Basilica',
        category: 'Spiritual / Heritage: Christianity',
        timings: '06:00–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/San_Thome_Basilica%2C_Chennai.jpg/1280px-San_Thome_Basilica%2C_Chennai.jpg',
        photoCredit: 'Wikimedia Commons / San Thome Basilica',
        summary:
          '19th-century Neo-Gothic cathedral built over the tomb of St. Thomas the Apostle.',
      },
    ],
  },
  {
    id: 'madurai',
    code: 'IN-TN-CITY-IXM',
    name: 'Madurai',
    nickname: 'The Athens of the East',
    tagline: '2,500 years of unbroken living Tamil heritage & lotus temple citadel',
    accentColor: '#9A3412',
    bgGradient: 'from-orange-50 via-rose-50/40 to-amber-50/30',
    coverImage: '/images/tamil-nadu/madurai-meenakshi.jpg',
    photoCredit: 'User Photo / Meenakshi Sundareswarar Temple Gopurams',
    flashcardBlurb:
      'The ancient "Athens of the East" and lotus-shaped temple citadel on the Vaigai River, boasting 2,500 years of unbroken living Tamil culture.',
    topStays: [
      { name: 'Heritage Madurai', category: 'Kochadai — Geoffrey Bawa-designed Luxury Resort' },
      { name: 'Gateway Hotel Pasumalai', category: 'Taj Group — Hillside Heritage' },
      { name: 'Courtyard by Marriott Madurai', category: 'City Central' },
    ],
    dining: {
      veg: [
        { restaurant: 'Sree Sabarees', location: 'Near West Tower', specialties: 'Ghee Roast, Poori Masala, Filter Coffee' },
        { restaurant: 'Modern Restaurant', location: 'Netaji Road', specialties: 'Authentic Madurai Veg Meals' },
      ],
      nonVeg: [
        { restaurant: 'Amma Mess', location: 'Alagar Kovil Road', specialties: 'Bone Marrow Omelette, Kola Urundai, Meen Kuzhambu' },
        { restaurant: 'Kumar Mess', location: 'K.K. Nagar', specialties: 'Mutton Kari Dosa, Viral Fish Fry' },
      ],
      peacefulNote: 'Madurai street cuisine is world-renowned for its legendary night messes, spiced Kari Dosas, fluffy Bun Parottas, and cooling Jigarthanda drinks.',
    },
    attractions: [
      {
        id: 'IN-TN-IXM-ATT-001',
        name: 'Meenakshi Sundareswarar Temple',
        category: 'Spiritual / Heritage: Hinduism, Dravidian Architecture, Historical Sites',
        timings: '05:00–12:30 & 16:00–21:30 (Evening Palliarai Pooja around 21:15)',
        fee: { domestic: 'Free (Non-Hindus permitted up to inner courtyard; strict no-phone policy)', foreign: 'Free (Non-Hindus permitted up to inner courtyard; strict no-phone policy)' },
        isHiddenGem: false,
        image: '/images/tamil-nadu/madurai-meenakshi.jpg',
        photoCredit: 'User Photo / Meenakshi Sundareswarar Temple Gopurams',
        summary:
          'Spiritual heart of Madurai with 14 towering gopurams reaching up to 52 meters, covered with thousands of vibrantly painted stucco figures of deities, demons, and celestial beings.',
      },
      {
        id: 'IN-TN-IXM-ATT-002',
        name: 'Thirumalai Nayakkar Mahal',
        category: 'Heritage: Palaces & Forts, Historical Buildings, Indo-Saracenic Stucco Pillars',
        timings: '09:00–17:00 (Sound & Light Show 18:45 English / 20:00 Tamil)',
        fee: { domestic: 'INR 10', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Thirumalai_Nayak_Palace_Madurai.jpg/1280px-Thirumalai_Nayak_Palace_Madurai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1636 palace erected by King Thirumalai Nayak, renowned for its colossal 82-foot-high brick-and-mortar pillars, grand royal durbar courtyard, and ornate painted cupola domes.',
      },
      {
        id: 'IN-TN-IXM-ATT-003',
        name: 'Gandhi Memorial Museum',
        category: 'Heritage / Arts: Museums, Historical Sites (Tamukkam Palace Grounds)',
        timings: '10:00–13:00 & 14:00–17:30 (Closed Fridays)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Gandhi_Memorial_Museum_Madurai.jpg/1280px-Gandhi_Memorial_Museum_Madurai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Housed in the 17th-century Tamukkam summer palace of Rani Mangammal, exhibiting the blood-stained dhoti worn by Mahatma Gandhi during his assassination in 1948.',
      },
      {
        id: 'IN-TN-IXM-GEM-001',
        name: 'Aayiram Kaal Mandapam (Hall of 1,000 Pillars) & Art Museum',
        category: 'Heritage / Arts: Archeological Sites, Stone Carving, Musical Pillars',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 5', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Hall_of_Thousand_Pillars_Meenakshi_Temple.jpg/1280px-Hall_of_Thousand_Pillars_Meenakshi_Temple.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Engineering and sculptural wonder inside the Meenakshi temple containing 985 exquisitely carved granite columns, featuring musical stone pillars that produce distinct swaras when tapped.',
      },
      {
        id: 'IN-TN-IXM-GEM-002',
        name: 'Vilachery Terracotta & Clay Toy Pottery Village',
        category: 'Rural / Arts: Crafts-Tourism, Live Like a Local, Traditional Golu Doll Workshops',
        timings: '09:00–18:00',
        fee: { domestic: 'Free (Workshops by request)', foreign: 'Free (Workshops by request)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Terracotta Village',
        summary:
          'A quiet rural potter community where generational artisans shape terracotta idols and hand-painted Navratri Golu dolls using fine clay from surrounding temple tanks.',
      },
    ],
  },
  {
    id: 'thanjavur',
    code: 'IN-TN-CITY-TJV',
    name: 'Thanjavur / Tanjore',
    nickname: 'The Rice Bowl & Chola Citadel',
    tagline: 'Imperial Chola granite vimanas, lost-wax bronzes & gold-leaf Tanjore art',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-yellow-50/40 to-stone-50/30',
    coverImage: '/images/tamil-nadu/thanjavur-brihadisvara.png',
    photoCredit: 'User Photo / Brihadisvara Temple Granite Vimana',
    flashcardBlurb:
      'The rice bowl of Tamil Nadu and historic capital of the Imperial Cholas, synonymous with colossal granite temple vimanas, bronze casting, and gold-foil paintings.',
    topStays: [
      { name: 'Svatma', category: 'Luxury Heritage Arts & Wellness Hotel' },
      { name: 'Great Trails River View Resort', category: 'Lakeside/Riverfront' },
      { name: 'Hotel Gnanam', category: 'Comfortable Mid-Scale' },
    ],
    dining: {
      veg: [
        { restaurant: 'Sree Ariya Bhavan', location: 'Opposite Old Bus Stand', specialties: 'Thanjavur Veg Thali, Pongal' },
        { restaurant: 'Pattukkottai Kamatchi Mess', location: 'Tanjore Branch', specialties: 'Spicy Vegetarian Kuzhambu' },
      ],
      nonVeg: [
        { restaurant: 'Chettinad Court / Maratha Dining', location: 'Old Bus Stand Road', specialties: 'Mutton Sukka, Country Chicken Curry' },
      ],
      peacefulNote: 'Thanjavur cuisine is renowned for aromatic Kaveri delta rice, roasted lentils, asafoetida-infused rasam, and traditional Tanjore Maratha court delicacies.',
    },
    attractions: [
      {
        id: 'IN-TN-TJV-ATT-001',
        name: 'Brihadisvara Temple (Peruvudaiyar Kovil / Big Temple)',
        category: 'Heritage: UNESCO World Heritage, Great Living Chola Temples, Historical Sites',
        timings: '06:00–12:30 & 16:00–20:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/tamil-nadu/thanjavur-brihadisvara.png',
        photoCredit: 'User Photo / Brihadisvara Temple Granite Vimana',
        summary:
          'Constructed by Emperor Raja Raja Chola I in 1010 CE, this monolithic architectural marvel boasts a 66-meter granite vimana crowned by an 80-tonne single-stone octagonal dome (Kumbam).',
      },
      {
        id: 'IN-TN-TJV-ATT-002',
        name: 'Thanjavur Maratha Palace Complex & Saraswathi Mahal Library',
        category: 'Heritage / Arts: Palaces & Forts, Historical Buildings, Rare Palm-Leaf Manuscript Library',
        timings: '09:00–18:00 (Lunch closure for library 13:00–14:00)',
        fee: { domestic: 'INR 50', foreign: 'INR 200' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Thanjavur_Royal_Palace.jpg/1280px-Thanjavur_Royal_Palace.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '16th-century royal fortress housing the Rajaraja Chola Art Gallery, the Arsenal Tower, and the world-famous Saraswathi Mahal Library with over 60,000 ancient palm-leaf manuscripts.',
      },
      {
        id: 'IN-TN-TJV-ATT-003',
        name: 'Rajarajan Manimandapam',
        category: 'Heritage: Monuments, Historical Sites',
        timings: '10:00–17:45',
        fee: { domestic: 'INR 10', foreign: 'INR 10' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Rajarajan_Manimandapam_Thanjavur.jpg/1280px-Rajarajan_Manimandapam_Thanjavur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Commemorative pavilion built for the 1000th anniversary of Emperor Raja Raja Chola’s coronation, featuring stone relief sculptures and a cultural heritage museum.',
      },
      {
        id: 'IN-TN-TJV-GEM-001',
        name: 'Swamimalai Bronze Casting Artisan Guilds',
        category: 'Arts / Rural: Crafts-Tourism, UNESCO-recognized Lost-Wax Bronze Sculpture',
        timings: '09:30–17:30',
        fee: { domestic: 'Free (Direct workshop observation)', foreign: 'Free (Direct workshop observation)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Bronze_casting_Swamimalai.jpg/1280px-Bronze_casting_Swamimalai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Generational sthapathis practicing the thousand-year-old Chola lost-wax (cire perdue) technique to sculpt sacred Nataraja bronzes with mathematical iconographic precision.',
      },
      {
        id: 'IN-TN-TJV-GEM-002',
        name: 'Manora Fort, Pattukkottai',
        category: 'Heritage: Palaces & Forts, Hexagonal 8-Tiered Pagoda Tower',
        timings: '09:00–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Manora_Fort_Pattukkottai.jpg/1280px-Manora_Fort_Pattukkottai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Unusual 8-storey hexagonal coastal minaret tower erected in 1814 by Maratha King Serfoji II to commemorate the British victory over Napoleon at Waterloo, overlooking Palk Strait.',
      },
    ],
  },
  {
    id: 'ooty',
    code: 'IN-TN-CITY-UAM',
    name: 'Udhagamandalam / Ooty',
    nickname: 'Queen of Hill Stations',
    tagline: 'Colonial bungalows, high-altitude rose terraces & UNESCO Toy Train',
    accentColor: '#065F46',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-cyan-50/30',
    coverImage: '/images/tamil-nadu/ooty-toy-train.jpg',
    photoCredit: 'User Photo / Nilgiri Mountain Railway Steam Locomotive',
    flashcardBlurb:
      'The "Queen of Hill Stations" nested at 2,240 metres in the Nilgiris, famed for colonial bungalows, high-altitude rose terraces, eucalyptus woods, and the UNESCO Toy Train.',
    topStays: [
      { name: 'Savoy - IHCL SeleQtions', category: 'Colonial Heritage Estate since 1841' },
      { name: 'WelcomHeritage Ferrnhills Royale Palace', category: 'Former Summer Palace of the Maharaja of Mysore' },
      { name: 'Sterling Ooty Elk Hill', category: 'Hilltop Resort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Nahar Sidewalk Cafe', location: 'Commercial Road', specialties: 'Wood-fired pizza, vegetarian bakery treats' },
        { restaurant: 'Shinkows Chinese', location: 'Commissionary Road', specialties: 'Historic Tibetan/Chinese noodles & momos since 1954' },
      ],
      nonVeg: [
        { restaurant: "Earl's Secret at King's Cliff", location: 'Havelock Road', specialties: 'Colonial Roasts, Steaks, Nilgiri Pepper Mutton' },
        { restaurant: 'Hyderabad Biryani House', location: 'Commercial Road', specialties: 'Hyderabadi Dum Biryani' },
      ],
      peacefulNote: 'High-altitude Nilgiri dining pairs fragrant eucalyptus teas and handmade dark chocolates with comforting British heritage roasts and Tibetan comfort broths.',
    },
    attractions: [
      {
        id: 'IN-TN-UAM-ATT-001',
        name: 'Nilgiri Mountain Railway (Toy Train)',
        category: 'Heritage: UNESCO World Heritage Sites, Mountain Railways of India',
        timings: 'Departures scheduled between Mettupalayam, Coonoor, and Ooty',
        fee: { domestic: 'INR 30 (Second Class) / INR 205 (First Class)', foreign: 'INR 30 (Second Class) / INR 205 (First Class)' },
        isHiddenGem: false,
        image: '/images/tamil-nadu/ooty-toy-train.jpg',
        photoCredit: 'User Photo / Nilgiri Mountain Railway Steam Locomotive',
        summary:
          'Legendary metre-gauge rack-and-pinion mountain railway chugging through 250 bridges, 16 tunnels, and breathtaking shola ravines pulled by vintage steam locomotives.',
      },
      {
        id: 'IN-TN-UAM-ATT-002',
        name: 'Government Botanical Garden',
        category: 'Nature: Forests & Gardens, 20-Million-Year-Old Fossil Tree Trunk',
        timings: '07:00–18:30',
        fee: { domestic: 'INR 50–100 (Dom)', foreign: 'INR 100 (Foreign)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Government_Botanical_Garden_Ooty.jpg/1280px-Government_Botanical_Garden_Ooty.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Sprawling 55-acre terraced botanical garden established in 1848 by William Graham McIvor, featuring thousands of exotic flora species and a 20-million-year-old petrified fossil tree.',
      },
      {
        id: 'IN-TN-UAM-ATT-003',
        name: 'Doddabetta Peak',
        category: 'Nature / Adventure: Hills & Mountains, Nilgiris\' Highest Point (2,637 m)',
        timings: '07:00–18:00',
        fee: { domestic: 'INR 10–20 (Camera extra)', foreign: 'INR 10–20 (Camera extra)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Doddabetta_Peak_Ooty.jpg/1280px-Doddabetta_Peak_Ooty.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The loftiest summit in the Nilgiris range (2,637 m) offering a telescope observatory dome with 360-degree vistas across Chamundi Hills, Bandipur, and misty shola valleys.',
      },
      {
        id: 'IN-TN-UAM-GEM-001',
        name: 'Avalanche Lake & Sanctuary Shola Forests',
        category: 'Nature: Rivers & Lakes, Eco-Tourism, Shola Grasslands',
        timings: '09:00–15:00 (Forest Department bus/safari only)',
        fee: { domestic: 'Bus safari approx INR 200–300 per person', foreign: 'Bus safari approx INR 200–300 per person' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Avalanche_Lake_Ooty.jpg/1280px-Avalanche_Lake_Ooty.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Pristine highland lake nestled 28 km from Ooty amidst dense rhododendron forests and mountain streams, protected within the Nilgiri Biosphere Reserve.',
      },
      {
        id: 'IN-TN-UAM-GEM-002',
        name: 'Toda Tribal Hamlet (Mund) at Muthorai Palada',
        category: 'Rural / Arts: Tribal-Tourism, Traditional Barrel-Shaped Toda Huts, Toda Embroidery',
        timings: '09:00–17:00',
        fee: { domestic: 'Free (Respectful community access)', foreign: 'Free (Respectful community access)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Toda_Hut_Ooty.jpg/1280px-Toda_Hut_Ooty.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Traditional settlement of the indigenous Toda pastoral community, renowned for unique half-barrel curved bamboo-and-thatch huts and intricate red-and-black Poothkuly hand embroidery.',
      },
    ],
  },
];
