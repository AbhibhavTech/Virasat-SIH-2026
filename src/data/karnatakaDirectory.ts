export interface KarnatakaStay {
  name: string;
  category: string;
}

export interface KarnatakaFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface KarnatakaDining {
  veg: KarnatakaFoodSpot[];
  nonVeg: KarnatakaFoodSpot[];
  peacefulNote?: string;
}

export interface KarnatakaAttraction {
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

export interface KarnatakaCity {
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
  topStays: KarnatakaStay[];
  dining: KarnatakaDining;
  attractions: KarnatakaAttraction[];
}

export const KARNATAKA_DIRECTORY: KarnatakaCity[] = [
  {
    id: 'bengaluru',
    code: 'IN-KA-CITY-BLR',
    name: 'Bengaluru / Bangalore',
    nickname: 'Silicon Valley & Garden City',
    tagline: 'Kempe Gowda ramparts, botanical conservatories & artisanal cafe culture',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-emerald-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Bangalore_Palace_front.jpg/1280px-Bangalore_Palace_front.jpg',
    photoCredit: 'Wikimedia Commons / Bangalore Palace',
    flashcardBlurb:
      'India’s high-tech Silicon Valley, deeply rooted in Kempe Gowda’s historic mud fortresses, sprawling botanical conservatories, and premier artisanal microbrewery culture.',
    topStays: [
      { name: 'The Leela Palace Bengaluru', category: 'Old Airport Road — Royal Mysore-inspired Luxury' },
      { name: 'Taj West End', category: 'Racecourse Road — Heritage Garden Estate since 1887' },
      { name: 'ITC Gardenia', category: 'Residency Road — Luxury Sustainable Hotel' },
    ],
    dining: {
      veg: [
        { restaurant: 'Vidyarthi Bhavan', location: 'Gandhi Bazaar', specialties: 'Legendary crispy thick Ghee Masala Dosa with rich mint-coconut chutney since 1943' },
        { restaurant: "Brahmin's Coffee Bar", location: 'Shankarapuram', specialties: 'Feather-light steaming Idlis, crispy Vada dunked in unlimited fresh coconut chutney' },
        { restaurant: 'CTR / Shri Sagar', location: 'Malleshwaram', specialties: 'World-famous crunchy golden Benne Dosa (butter dosa) & frothy filter coffee' },
      ],
      nonVeg: [
        { restaurant: 'Shivaji Military Hotel', location: 'Jayanagar', specialties: 'Iconic Seeraga Samba Donne Biryani served in eco-friendly leaf cups with tender Mutton Chops' },
        { restaurant: 'Karavalli at The Gateway Hotel', location: 'Residency Road', specialties: 'Coastal Mangalorean Ghee Roast, Kori Rotti, fresh Crab Milagu & Alleppey Fish Curry' },
      ],
      peacefulNote: 'Bengaluru tiffin culture pairs slow-simmered filter coffee with melting butter dosas, alongside authentic Military Hotel donne biryanis wrapped in fragrant banana leaves.',
    },
    attractions: [
      {
        id: 'IN-KA-BLR-ATT-001',
        name: 'Bangalore Palace',
        category: 'Heritage · Palaces & Forts, Tudor-Style Architecture & Royal Grounds',
        timings: '10:00–17:30',
        fee: { domestic: 'INR 240', foreign: 'INR 460' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Bangalore_Palace_front.jpg/1280px-Bangalore_Palace_front.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1887 Tudor-style royal residence built by Chamaraja Wadiyar with castellated ramparts, fortified towers, Tudor stained glass, and opulent woodcarvings inspired by Windsor Castle.',
      },
      {
        id: 'IN-KA-BLR-ATT-002',
        name: 'Lalbagh Botanical Garden & Glass House',
        category: 'Nature · Forests & Gardens, 240-Acre Conservatory & Historic Trees',
        timings: '06:00–19:00 (Free 06:00–09:00 & 18:00–19:00 for walkers)',
        fee: { domestic: 'INR 30', foreign: 'INR 30' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Lalbagh_Glasshouse.jpg/1280px-Lalbagh_Glasshouse.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Commissioned by Hyder Ali in 1760, this botanical paradise holds over 1,800 exotic tropical flora species, a 3,000-million-year-old rock, and the famous Crystal Palace-inspired Glass House.',
      },
      {
        id: 'IN-KA-BLR-ATT-003',
        name: 'Cubbon Park & Vidhana Soudha View',
        category: 'Nature / Heritage · Forests & Gardens, Neo-Dravidian Architecture',
        timings: 'Park open 06:00–20:00 (Vidhana Soudha viewing from perimeter)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Vidhana_Soudha_Bangalore.jpg/1280px-Vidhana_Soudha_Bangalore.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '300-acre lush lung space in the city center adjoining the monumental granite Vidhana Soudha, India’s largest legislative building constructed in Neo-Dravidian architectural style.',
      },
      {
        id: 'IN-KA-BLR-ATT-004',
        name: "Tipu Sultan's Summer Palace & Bangalore Fort",
        category: 'Heritage · Palaces & Forts, Teakwood Architecture & Indo-Islamic Art',
        timings: '08:30–17:30',
        fee: { domestic: 'INR 20', foreign: 'INR 250' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Tipu_Sultan%27s_Summer_Palace%2C_Bangalore.jpg/1280px-Tipu_Sultan%27s_Summer_Palace%2C_Bangalore.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1791 two-storey summer residence constructed entirely of carved teakwood pillars and cusped arches, once acclaimed by Tipu Sultan as the "Abode of Happiness and Envy of Heaven".',
      },
      {
        id: 'IN-KA-BLR-GEM-001',
        name: 'Begur Fort & 9th-Century Panchalinga Nageshwara Temple',
        category: 'Heritage · Archeological Sites, Ganga Dynasty Inscriptions (First "Bengaluru")',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Panchalinga_temple_Begur.jpg/1280px-Panchalinga_temple_Begur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Ancient Western Ganga temple complex containing a 900 CE stone inscription recording the "Battle of Bengaluru"—the earliest known historical written record of the city’s name.',
      },
      {
        id: 'IN-KA-BLR-GEM-002',
        name: 'Bugle Rock & Bull Temple (Nandi Temple), Basavanagudi',
        category: 'Spiritual / Nature · 3-Billion-Year-Old Peninsular Gneiss & Monolithic Nandi',
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Bull_Temple_Bangalore.jpg/1280px-Bull_Temple_Bangalore.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Massive 16th-century granite monolithic Nandi carved in Dravidian style perched atop ancient peninsular gneiss rock formations dated to 3,000 million years old by geological surveys.',
      },
    ],
  },
  {
    id: 'mysuru',
    code: 'IN-KA-CITY-MYS',
    name: 'Mysuru / Mysore',
    nickname: 'City of Palaces & Royal Wadiyar Seat',
    tagline: 'Illuminated Indo-Saracenic grandeur, Ashtanga yoga & fragrant sandalwood',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-yellow-50/40 to-orange-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Mysore_Palace_Morning.jpg/1280px-Mysore_Palace_Morning.jpg',
    photoCredit: 'Wikimedia Commons / Mysore Palace',
    flashcardBlurb:
      'The royal capital of the Wadiyars, world-renowned for illuminated Indo-Saracenic palace complexes, Ashtanga yoga traditions, silk sarees, and aromatic sandalwood.',
    topStays: [
      { name: 'Lalitha Mahal Palace Hotel', category: 'Heritage Hillside Palace overlooking Mysore' },
      { name: 'Grand Mercure Mysore', category: 'Yadavagiri — Premium Modern Luxury' },
      { name: 'Ropposo Boutique Stay', category: 'Gokulam — Yoga & Wellness Retreat' },
    ],
    dining: {
      veg: [
        { restaurant: 'Hotel Mylari', location: 'Agrahara', specialties: 'Legendary melt-in-the-mouth soft Butter Masala Dosa with fragrant white butter dollop' },
        { restaurant: 'Guru Sweet Mart', location: 'Sayyaji Rao Road', specialties: 'Original royal inventors of the golden crumbly Mysore Pak made with pure cow ghee' },
        { restaurant: 'Dasaprakash', location: 'Gandhi Square', specialties: 'Traditional authentic Mysore vegetarian full meal served with sambar, rasam & payasam' },
      ],
      nonVeg: [
        { restaurant: 'Hotel RRR', location: 'Gandhi Square', specialties: 'Fiery Andhra-style spiced Mutton Biryani served on green banana leaf with spicy chicken fry' },
        { restaurant: 'Hotel Hanumanthu Original', location: 'Mandi Mohalla', specialties: 'Time-tested Mutton Pulao cooked over wood fire with tender meat since 1930' },
      ],
      peacefulNote: 'Mysore’s culinary legacy revolves around pure cow ghee, slow wood-fired pulao, soft cloud-like Mylari dosas, and warm freshly roasted filter kaapi.',
    },
    attractions: [
      {
        id: 'IN-KA-MYS-ATT-001',
        name: 'Mysore Palace (Amba Vilas)',
        category: 'Heritage · Palaces & Forts, Indo-Saracenic Architecture & Durbar Halls',
        timings: '10:00–17:30 (Illumination: Sun & Holidays 19:00–20:00)',
        fee: { domestic: 'INR 70', foreign: 'INR 200' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Mysore_Palace_Morning.jpg/1280px-Mysore_Palace_Morning.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Henry Irwin-designed Indo-Saracenic royal seat of the Wadiyar dynasty featuring stained-glass peacock domes, silver doors, jewel-encrusted golden thrones, and 97,000 bulbs illuminating the facade.',
      },
      {
        id: 'IN-KA-MYS-ATT-002',
        name: 'Chamundeshwari Temple & Chamundi Hill',
        category: 'Spiritual / Heritage · Hinduism, Dravidian Gopuram & Monolithic Nandi',
        timings: '07:30–14:00, 15:30–18:00 & 19:30–21:00',
        fee: { domestic: 'Free (Special Darshan INR 100)', foreign: 'Free (Special Darshan INR 100)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Chamundeshwari_Temple_Mysore.jpg/1280px-Chamundeshwari_Temple_Mysore.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '17th-century hill shrine perched at 1,000 meters dedicated to Goddess Durga slaying Mahishasura, featuring a 7-tier gopuram and a colossal 16-foot monolithic granite Nandi statue along the stone stairway.',
      },
      {
        id: 'IN-KA-MYS-ATT-003',
        name: 'Devaraja Market',
        category: 'Rural / Gastronomy · Spices, Crafts-Tourism & Sandalwood Bazaar',
        timings: '06:30–20:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Devaraja_Market_Mysore.jpg/1280px-Devaraja_Market_Mysore.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Vibrant 130-year-old covered market lined with fragrant mounds of jasmine flowers, authentic sandalwood oils, incense cones, betel leaves, and stacks of colorful kumkum pigments.',
      },
      {
        id: 'IN-KA-MYS-GEM-001',
        name: 'Chennakeshava Temple, Somanathapura',
        category: 'Heritage · UNESCO World Heritage (Hoysala Sacred Ensembles), Soapstone Marvel',
        timings: '09:00–17:30',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Somanathapura_Keshava_Temple.jpg/1280px-Somanathapura_Keshava_Temple.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1268 CE trikuta Hoysala temple carved from soft chloritic schist soapstone on a raised star-shaped platform, featuring miniature friezes of charging elephants, mythical makaras, and Ramayana epics.',
      },
      {
        id: 'IN-KA-MYS-GEM-002',
        name: 'Ranganathittu Bird Sanctuary, Srirangapatna',
        category: 'Nature · Wildlife-Tourism, Kaveri River Islets & Migratory Waterfowl',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 70 (Boat safari: INR 100–300)', foreign: 'INR 500 (Boat safari: INR 100–300)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Ranganathittu_Bird_Sanctuary.jpg/1280px-Ranganathittu_Bird_Sanctuary.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Serene Kaveri River archipelago where wooden rowboats glide close to nesting colonies of painted storks, spoonbills, and basking freshwater mugger crocodiles on river rocks.',
      },
    ],
  },
  {
    id: 'hampi',
    code: 'IN-KA-CITY-HMP',
    name: 'Hampi',
    nickname: 'Granite City of the Vijayanagara Empire',
    tagline: 'Boulder-strewn hills, stone temple chariots & riverside ruins',
    accentColor: '#CA8A04',
    bgGradient: 'from-amber-50 via-stone-50/40 to-yellow-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Stone_Chariot_Hampi.jpg/1280px-Stone_Chariot_Hampi.jpg',
    photoCredit: 'Wikimedia Commons / Hampi Stone Chariot',
    flashcardBlurb:
      'The sprawling granite open-air museum of the Vijayanagara Empire, featuring boulder-strewn hills, stone temple chariots, and riverside ruins.',
    topStays: [
      { name: 'Evolve Back, Kamalapura Palace', category: 'Ultra Luxury Vijayanagara-inspired Palace Resort' },
      { name: 'Heritage Resort Hampi', category: 'Hospet Road — Eco-Luxe Resort' },
      { name: 'Kishkinda Heritage Resort', category: 'Anegundi — Riverside Cottages' },
    ],
    dining: {
      veg: [
        { restaurant: 'Mango Tree Restaurant', location: 'Near Kamalapura / Hampi Bazaar', specialties: 'Authentic South Indian banana leaf thali, Kashmiri sheermal & fresh fruit shakes' },
        { restaurant: 'Suresh Restaurant', location: 'Hampi Bazaar', specialties: 'Homestyle South Indian breakfasts, crisp dosas, idlis & filter coffee' },
      ],
      nonVeg: [
        { restaurant: 'Laughing Buddha Cafe', location: 'Sanapur / Anegundi (Across River)', specialties: 'Wood-fired chicken sizzlers, thin-crust pizzas & fresh river fish with sunset views' },
      ],
      peacefulNote: 'Hampi’s sacred monument core is purely vegetarian; across the river in Anegundi & Sanapur, relaxed open-air cafes serve wood-fired bakes overlooking boulder fields.',
    },
    attractions: [
      {
        id: 'IN-KA-HMP-ATT-001',
        name: 'Virupaksha Temple',
        category: 'Spiritual / Heritage · Hinduism, 7th-Century Living Shrine & UNESCO World Heritage',
        timings: '06:00–13:00 & 17:00–21:00',
        fee: { domestic: 'Free for prayers (ASI monument passes apply for broader complex)', foreign: 'Free for prayers' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Virupaksha_Temple_Hampi.jpg/1280px-Virupaksha_Temple_Hampi.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Oldest functioning temple in Hampi with an unbroken worship lineage since the 7th century, featuring a 50-meter tiered eastern gopuram rising over the Tungabhadra River.',
      },
      {
        id: 'IN-KA-HMP-ATT-002',
        name: 'Vijaya Vittala Temple & Stone Chariot',
        category: 'Heritage · UNESCO World Heritage, Iconic Stone Chariot & Musical Pillars',
        timings: '08:30–17:30',
        fee: { domestic: 'INR 40 (Composite ticket valid across Zenana Enclosure)', foreign: 'INR 600 (Composite ticket)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Stone_Chariot_Hampi.jpg/1280px-Stone_Chariot_Hampi.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '15th-century apex of Vijayanagara architectural grandeur, holding the world-renowned granite Stone Chariot shrine to Garuda and the Ranga Mandapa musical columns.',
      },
      {
        id: 'IN-KA-HMP-ATT-003',
        name: 'Zenana Enclosure, Lotus Mahal & Elephant Stables',
        category: 'Heritage · Palaces & Forts, Indo-Islamic Architecture & Royal Courts',
        timings: '08:30–17:30',
        fee: { domestic: 'Covered under Vittala ASI composite ticket', foreign: 'Covered under Vittala ASI composite ticket' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Lotus_Mahal_Hampi.jpg/1280px-Lotus_Mahal_Hampi.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Walled royal precinct featuring the graceful symmetrical Lotus Mahal with recessed cusped arches and the monumental eleven-domed chambers of the Elephant Stables.',
      },
      {
        id: 'IN-KA-HMP-ATT-004',
        name: 'Matanga Hill Sunrise Point',
        category: 'Nature / Adventure · Hills & Mountains, Hiking & Panoramic Ruins View',
        timings: '05:30–18:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Hampi_View_from_Matanga_Hill.jpg/1280px-Hampi_View_from_Matanga_Hill.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Highest elevation in the central ruins offering 360-degree sunrise views over the golden granite boulder landscapes, banana plantations, and the towers of Virupaksha.',
      },
      {
        id: 'IN-KA-HMP-GEM-001',
        name: 'Anegundi Village & Kishkinda Kingdom',
        category: 'Rural / Heritage · Banana Fiber Handicrafts, Pampa Sarovar & Live Like a Local',
        timings: '07:00–18:00 (Crossed via Tungabhadra coracle boats or bridge)',
        fee: { domestic: 'Free (Coracle boat: INR 50–100)', foreign: 'Free (Coracle boat: INR 50–100)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Anegundi_Village.jpg/1280px-Anegundi_Village.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Mythological monkey kingdom of Kishkinda from the Ramayana, preserving traditional whitewashed clay houses, women-led banana fiber artisan cooperatives, and the sacred Pampa Sarovar lotus tank.',
      },
      {
        id: 'IN-KA-HMP-GEM-002',
        name: 'Sanapur Lake & Granite Bouldering Tracks',
        category: 'Adventure / Nature · Rivers & Lakes, Rock Bouldering & Coracle Rides',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Coracle ride: INR 300–500)', foreign: 'Free (Coracle ride: INR 300–500)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Sanapur Reservoir',
        summary:
          'Quiet freshwater reservoir surrounded by dramatic granite boulder formations, where travelers glide across serene waters in round woven coracle boats and explore bouldering routes.',
      },
    ],
  },
  {
    id: 'coorg',
    code: 'IN-KA-CITY-COI',
    name: 'Kodagu / Coorg',
    nickname: 'Scotland of India & Coffee Country',
    tagline: 'Misty coffee plantations, Kodava warrior culture & Kaveri headwaters',
    accentColor: '#065F46',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Coorg Coffee Estate',
    flashcardBlurb:
      '"The Scotland of India" in the southern Western Ghats, celebrated for misty coffee and spice plantations, Kodava warrior culture, and the sacred Kaveri headwaters.',
    topStays: [
      { name: 'The Tamara Coorg', category: 'Luxury Eco-Resort tucked in rainforest' },
      { name: 'Evolve Back Coorg', category: 'Chikkana Halli Estate — Luxury Plantation Villas' },
      { name: 'Taj Madikeri Resort & Spa', category: 'Monsooned Hillside Retreat' },
    ],
    dining: {
      veg: [
        { restaurant: 'Udupi The Veg', location: 'Madikeri', specialties: 'Traditional Karnataka Akki Rotti with fresh coconut chutney & aromatic filter coffee' },
        { restaurant: 'Sri Krishna Bhavan', location: 'Virajpet', specialties: 'Fluffy lace Neer Dosa with vegetable sagu, steaming hot idlis & filter coffee' },
      ],
      nonVeg: [
        { restaurant: 'Coorg Cuisine', location: 'Madikeri', specialties: 'Authentic Kodava Pandi Curry (Pork with Kachampuli vinegar), Kadambuttu & Bamboo Shoot Curry' },
        { restaurant: 'Taste of Coorg', location: 'Madikeri', specialties: 'Steamed rice noodle Noolputtu with Koli (Chicken) Curry & spicy mutton pepper fry' },
      ],
      peacefulNote: 'Kodava cuisine is unique in India for its use of Kachampuli (dark wild fruit garcinia vinegar), freshly plucked green peppercorns, bamboo shoots, and steamed rice dumplings.',
    },
    attractions: [
      {
        id: 'IN-KA-COI-ATT-001',
        name: 'Abbey Falls',
        category: 'Nature · Rivers & Lakes, Forests & Coffee Plantation Cascades',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 15', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Abbey_Falls_Madikeri_Coorg.jpg/1280px-Abbey_Falls_Madikeri_Coorg.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Roaring 70-foot waterfall tumbling down steep volcanic rocks amidst private spice and coffee estates, viewed from an atmospheric pedestrian suspension bridge.',
      },
      {
        id: 'IN-KA-COI-ATT-002',
        name: 'Namdroling Monastery (Golden Temple), Bylakuppe',
        category: 'Spiritual / Arts · Buddhism, Tibetan Settlement & 40-ft Gilded Statues',
        timings: '09:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Golden_Temple_Bylakuppe_Coorg.jpg/1280px-Golden_Temple_Bylakuppe_Coorg.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The largest Tibetan settlement in South India, housing the stunning Golden Temple decorated with three 40-foot gilded statues of Padmasambhava, Buddha, and Amitayus.',
      },
      {
        id: 'IN-KA-COI-ATT-003',
        name: "Raja's Seat & Sunset Viewpoint",
        category: 'Nature / Heritage · Forests & Gardens, Hills & Mountains, Historic Royal Garden',
        timings: '06:00–20:00 (Musical fountain: 19:00)',
        fee: { domestic: 'INR 20', foreign: 'INR 20' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Rajas_Seat_Madikeri.jpg/1280px-Rajas_Seat_Madikeri.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Scenic seasonal garden of flowers and artificial fountains where the Kodagu kings spent evenings watching the sun set over rolling misty Western Ghats ridges.',
      },
      {
        id: 'IN-KA-COI-ATT-004',
        name: 'Talakaveri & Bhagamandala',
        category: 'Spiritual / Nature · Hinduism, River Kaveri Birthplace & Brahmagiri Hills',
        timings: '06:00–18:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Talakaveri_Temple_Pond.jpg/1280px-Talakaveri_Temple_Pond.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Holy origin of the sacred Kaveri River on the slopes of the Brahmagiri hill range at 1,276 m elevation, where a natural spring feeds a stepped bathing kalyani tank.',
      },
      {
        id: 'IN-KA-COI-GEM-001',
        name: 'Chelavara Falls & Chomakund Hill Trek',
        category: 'Nature / Adventure · Hiking & Trekking, Natural Tortoise-Shaped Rock Waterfall',
        timings: '07:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Chelavara_Falls_Coorg.jpg/1280px-Chelavara_Falls_Coorg.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Spectacular natural cascade tumbling 150 feet over a tortoise-shaped rock formation, framed by dense silver oak groves and the Chomakund mountain ridge along the Kerala border.',
      },
      {
        id: 'IN-KA-COI-GEM-002',
        name: 'Pachat Traditional Kodava Ancestral Ainmane',
        category: 'Rural / Arts · Live Like a Local, 200-Year-Old Kodava Timber Architecture',
        timings: '10:00–16:00 (Respectful prior local permission recommended)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Ancestral Heritage Home',
        summary:
          'Centuries-old ancestral joint-family manor constructed with hand-hewn rosewood pillars, clay-tile gables, carved veranda seating (aimara), and traditional Kodava weapon shrines.',
      },
    ],
  },
];
