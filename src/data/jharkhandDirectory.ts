export interface JharkhandStay {
  name: string;
  category: string;
}

export interface JharkhandFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface JharkhandDining {
  veg: JharkhandFoodSpot[];
  nonVeg: JharkhandFoodSpot[];
  pilgrimageNotice?: string;
  peacefulNote?: string;
}

export interface JharkhandAttraction {
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

export interface JharkhandCity {
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
  topStays: JharkhandStay[];
  dining: JharkhandDining;
  attractions: JharkhandAttraction[];
}

export const JHARKHAND_DIRECTORY: JharkhandCity[] = [
  {
    id: 'ranchi',
    code: 'IN-JH-CITY-IXR',
    name: 'Ranchi',
    nickname: 'City of Waterfalls & Capital of Jharkhand',
    tagline: 'Chota Nagpur plateau, roaring Hundru falls, hill temples & Patratu valley',
    accentColor: '#059669',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Hundru_falls.jpg/1280px-Hundru_falls.jpg',
    photoCredit: 'Wikimedia Commons / Hundru Falls, Ranchi',
    flashcardBlurb:
      'The "City of Waterfalls" and capital of Jharkhand, situated on the Chota Nagpur Plateau, known for its cascading natural rapids, dense surrounding woodlands, and 17th-century hilltop temples.',
    topStays: [
      { name: 'Radisson Blu Hotel Ranchi', category: 'Kadru Diversion Road — Luxury City Comfort' },
      { name: 'Ramada by Wyndham', category: 'Harmu Road — Premium Business Hotel' },
      { name: 'Capitol Hill', category: 'Mahatma Gandhi Main Road — Central Heritage Stay' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Kaveri Restaurant',
          location: 'GEL Church Complex, Main Road',
          specialties: 'Popular North Indian vegetarian thalis, paneer specialties, and South Indian tiffins',
        },
        {
          restaurant: 'Prana Lounge',
          location: 'Kanke Road',
          specialties: 'Vegetarian global cuisine, artisan wood-fired pizzas, mocktails, and fresh salads',
        },
      ],
      nonVeg: [
        {
          restaurant: 'The Great Kebab Factory',
          location: 'Radisson Blu Hotel',
          specialties: 'Unlimited signature Galouti kebabs, Murgh Malai tikka, and rich Mughlai gravies',
        },
        {
          restaurant: 'Jungli Moorgi',
          location: 'Kanke Road',
          specialties: 'Local tribal-style rustic chicken curry, Champaran meat, and spicy Dehati mutton',
        },
      ],
      peacefulNote:
        'Jharkhand cuisine features indigenous tribal flavors such as Dhuska with Chana Ghugni, Chilka Roti, Rugda wild mushrooms, and bamboo shoot pickle.',
    },
    attractions: [
      {
        id: 'IN-JH-IXR-ATT-001',
        name: 'Hundru Falls',
        category: 'Nature · Rivers & Lakes, 320-ft Cascading Waterfall on the Subarnarekha',
        timings: '06:00–17:00',
        fee: { domestic: 'INR 10 (Vehicle parking extra)', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Hundru_falls.jpg/1280px-Hundru_falls.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'One of Jharkhand’s grandest waterfalls, where the sacred Subarnarekha River plunges 320 feet down stepped granite cliffs into a deep, frothing plunge pool framed by dense sal forests.',
      },
      {
        id: 'IN-JH-IXR-ATT-002',
        name: 'Jagannath Temple',
        category: 'Spiritual · Hinduism, 1691 Hill-Top Puri-Style Shrine & Panoramic City Views',
        timings: '05:00–12:00 & 15:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Jagannath_temple_Ranchi.jpg/1280px-Jagannath_temple_Ranchi.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Historic 17th-century temple built by King Thakur Ani Nath Shahdeo of the Barkagarh estate, modeled after Puri’s sacred shrine and famous for its annual grand Rath Yatra.',
      },
      {
        id: 'IN-JH-IXR-ATT-003',
        name: 'Pahari Mandir',
        category: 'Spiritual / Nature · Hinduism, Shiva Temple atop Ranchi Hill (400 Steps)',
        timings: '04:30–19:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat',
        summary:
          'Ancient Shiva shrine perched atop Ranchi Hill at 2,140 feet, accessed by climbing 400 stone steps; historically revered by freedom fighters who hoisted the Tricolour here.',
      },
      {
        id: 'IN-JH-IXR-GEM-001',
        name: 'Dassam Falls',
        category: 'Nature · Rivers & Lakes, 144-Foot Natural Cascade on the Kanchi River',
        timings: '08:00–17:00',
        fee: { domestic: 'INR 10', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Dassam_Falls_1.jpg/1280px-Dassam_Falls_1.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Spectacular waterfall on the Kanchi River near Taimara village (40 km from Ranchi), where water splits into ten distinct torrential streams cascading 144 feet over black basalt rocks.',
      },
      {
        id: 'IN-JH-IXR-GEM-002',
        name: 'Patratu Valley',
        category: 'Nature · Hills & Mountains, Rivers & Lakes, S-Curve Scenic Valley & Dam',
        timings: 'Daylight hours',
        fee: { domestic: 'Free (Boating: ~INR 100–300)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Patratu_Valley_Ranchi.jpg/1280px-Patratu_Valley_Ranchi.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A breathtaking panoramic mountain pass featuring serpentine hairpin bends descending into the emerald Patratu Dam reservoir, famous for boating, jet-skiing, and sunset viewpoints.',
      },
    ],
  },
  {
    id: 'deoghar',
    code: 'IN-JH-CITY-DGH',
    name: 'Deoghar',
    nickname: 'Abode of the Gods & Holy Baidyanath Dham',
    tagline: 'Ancient Jyotirlinga, Shravani Mela, Trikut Pahar cable car & Naulakha temple',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: '/images/jharkhand/deoghar-baidyanath-temple.jpg',
    photoCredit: 'Discover Bharat / Baba Baidyanath Jyotirlinga Dham',
    flashcardBlurb:
      'A deeply revered pilgrimage hub known as "The Abode of the Gods," drawing millions of Kanwariya devotees each year to one of the twelve sacred Jyotirlingas.',
    topStays: [
      { name: 'Imperial Heights', category: 'Castair Town — Premium Modern Stay' },
      { name: 'Hotel Mahadev Palace', category: 'Near Temple — Comfortable Pilgrim Lodging' },
      { name: 'Amrapali Clarks Inn', category: 'Near Clock Tower — Modern Circuit Hotel' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Mint Leaf Restaurant',
          location: 'Imperial Heights, Deoghar',
          specialties: 'Pure vegetarian North Indian curries, paneer delicacies, and Chinese dishes',
        },
        {
          restaurant: 'Neel Kamal Restaurant',
          location: 'Near Tower Chowk',
          specialties: 'Traditional vegetarian thalis, samosas, and world-famous Deoghar Peda sweets',
        },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Sacred Pilgrimage Bylaw: Deoghar is a sacred Shaivite pilgrimage city; non-vegetarian food and alcohol are strictly prohibited around the Baidyanath Temple complex and central town precincts.',
      peacefulNote:
        'Deoghar is renowned for its sacred milk sweets, especially the caramelized mawa Peda crafted near the temple gates, alongside simple sattvic pilgrim meals.',
    },
    attractions: [
      {
        id: 'IN-JH-DGH-ATT-001',
        name: 'Baidyanath Jyotirlinga Temple',
        category: 'Spiritual · Hinduism, One of the 12 Jyotirlingas and 51 Shakti Peethas',
        timings: '04:00–15:30 & 18:30–21:00 (Special Shringar Pooja around 19:30)',
        fee: { domestic: 'Free (VIP Shighra Darshan pass: INR 300)', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/jharkhand/deoghar-baidyanath-temple.jpg',
        photoCredit: 'Discover Bharat',
        summary:
          'One of the twelve sacred Jyotirlingas and the site of Maa Kamala Shakti Peeth, where Ravana sacrificed his ten heads to Lord Shiva; epicenter of the world-famous Shravani Mela.',
      },
      {
        id: 'IN-JH-DGH-ATT-002',
        name: 'Trikut Pahar & Ropeway',
        category: 'Nature / Adventure · Hills & Mountains, Cable Car, Three-Peaked Sacred Summit',
        timings: '09:00–17:00',
        fee: { domestic: 'Ropeway ~INR 150', foreign: 'Ropeway ~INR 150' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Jharkhand Tourism',
        summary:
          'Spectacular three-peaked granite mountain at 2,470 feet representing Brahma, Vishnu, and Shiva, offering ancient hermit caves and Jharkhand’s highest aerial ropeway ride.',
      },
      {
        id: 'IN-JH-DGH-ATT-003',
        name: 'Naulakha Mandir',
        category: 'Spiritual / Heritage · Hinduism, 146-Foot Architectural Marvel',
        timings: '06:00–12:00 & 14:00–19:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Deoghar Heritage Foundation',
        summary:
          'Magnificent 146-foot high temple dedicated to Radha-Krishna, built by Queen Charushila of Pathuria Ghat Kolkata in 1940 at a historical cost of nine lakh rupees.',
      },
      {
        id: 'IN-JH-DGH-GEM-001',
        name: 'Tapovan Caves & Hills',
        category: 'Spiritual / Nature · Hills & Mountains, Hermit Caves of Sage Valmiki',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Tapovan Hills',
        summary:
          'Scenic boulder-strewn hillock 10 km from Deoghar housing a Shiva temple and natural rock-cut caves where Sage Valmiki and later Sri Balananda Brahmachari performed severe penance.',
      },
      {
        id: 'IN-JH-DGH-GEM-002',
        name: 'Satsang Ashram',
        category: 'Spiritual · Ashram of Sri Sri Thakur Anukulchandra, Philanthropy & Meditative Groves',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Satsang Deoghar',
        summary:
          'Sprawling spiritual commune founded by Sri Sri Thakur Anukulchandra, featuring tranquil prayer halls, a printing press, charitable hospitals, and lush botanical gardens.',
      },
    ],
  },
  {
    id: 'hazaribagh',
    code: 'IN-JH-CITY-HBG',
    name: 'Hazaribagh',
    nickname: 'City of a Thousand Gardens',
    tagline: 'Wildlife sanctuary, Meso-Chalcolithic rock art, Canary hill & thermal springs',
    accentColor: '#4F46E5',
    bgGradient: 'from-indigo-50 via-sky-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Hazaribagh Plateau',
    flashcardBlurb:
      'The "City of a Thousand Gardens," situated on a scenic plateau and famous for its sprawling wildlife sanctuary, ancient rock art, and cool climate.',
    topStays: [
      { name: 'Hotel Hill Side', category: 'Main Road — Comfortable City Stay' },
      { name: 'Hotel Aranya Vihar', category: 'JTDC — State-Run Lodging Near the Park' },
      { name: 'Canary Hill Resort', category: 'Canary Hill Road — Scenic Hill Retreat' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Hotel Shree Vinayaka',
          location: 'Main Road, Hazaribagh',
          specialties: 'Wholesome North Indian vegetarian meals, Dal Makhani, Paneer Butter Masala & snacks',
        },
      ],
      nonVeg: [
        {
          restaurant: 'The Royal Retreat',
          location: 'Near Canary Hill',
          specialties: 'Flavorsome Indian and Mughlai curries, Butter Chicken, and Mutton Rogan Josh',
        },
      ],
      peacefulNote:
        'The cool plateau evenings in Hazaribagh are celebrated with roasted sweet corn, steaming vegetable cutlets, and local earthen pot curries.',
    },
    attractions: [
      {
        id: 'IN-JH-HBG-ATT-001',
        name: 'Hazaribagh National Park',
        category: 'Nature · Wildlife-Tourism, Forests & Gardens, Plateau Sal Forest Sanctuary',
        timings: '06:00–20:00 (Best season Oct–April; usually closed during monsoons)',
        fee: { domestic: 'INR 50 (Car: INR 20)', foreign: 'INR 100 (Car: INR 20)' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Jharkhand Forest Department',
        summary:
          'Established in 1955 over 184 sq. km of pristine undulating sal forest, sheltering sambar, spotted deer, nilgai, wild boars, leopards, and diverse avian species.',
      },
      {
        id: 'IN-JH-HBG-ATT-002',
        name: 'Canary Hill',
        category: 'Nature · Hills & Mountains, Forested Belvedere, Rest House & Three Lakes',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat',
        summary:
          'A lush forested prominence located within the town limits, topped with a colonial watchtower providing breathtaking vistas of the surrounding plateau, dams, and woods.',
      },
      {
        id: 'IN-JH-HBG-ATT-003',
        name: 'Hazaribagh Lake',
        category: 'Nature · Rivers & Lakes, Interconnected Promenade Water Bodies',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Hazaribagh City Heritage',
        summary:
          'A chain of four interconnected scenic artificial lakes developed during colonial times, famous for sunset walks, gentle boating, and peaceful picnic spots under shady canopies.',
      },
      {
        id: 'IN-JH-HBG-GEM-001',
        name: 'Isco Rock Art (Megalithic Site)',
        category: 'Heritage · Archeological Sites, Meso-Chalcolithic Cave Paintings (Barkagaon)',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Tribal Research Institute',
        summary:
          'Remarkable prehistoric rock shelters located 40 km from Hazaribagh containing thousands of ochre paintings of animals, hunting scenes, and astronomical symbols dating back 10,000 years.',
      },
      {
        id: 'IN-JH-HBG-GEM-002',
        name: 'Surajkund Hot Spring',
        category: "Nature / Wellness · Rivers & Lakes, India's Hottest Natural Thermal Spring (87°C)",
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Barkatha Tourism',
        summary:
          'Located in Barkatha 60 km from Hazaribagh, Surajkund is one of India’s hottest thermal sulphur springs with bubbling water reaching 87°C, revered for therapeutic skin healing properties.',
      },
    ],
  },
  {
    id: 'netarhat',
    code: 'IN-JH-CITY-NET',
    name: 'Netarhat',
    nickname: 'Queen of Chota Nagpur',
    tagline: '3,622-ft pine-clad plateau, Magnolia sunset point, Lodh falls & misty valleys',
    accentColor: '#9333EA',
    bgGradient: 'from-purple-50 via-rose-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Discover Bharat / Netarhat Valley Horizon',
    flashcardBlurb:
      'The "Queen of Chota Nagpur," a serene plateau hill station at 3,622 feet famous for breathtaking sunrise and sunset viewpoints over deep forested valleys.',
    topStays: [
      { name: 'Prabhat Vihar', category: 'JTDC — State Tourism Property with the Best Sunrise Views' },
      { name: 'Hotel Lake View', category: 'Netarhat Dam — Lakeside Eco-Cottages' },
      { name: 'Ravi & Shashi Lodge', category: 'Town Center — Basic Hill Lodging' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'JTDC Restaurant',
          location: 'Prabhat Vihar, Netarhat',
          specialties: 'Simple homestyle North Indian thalis, Dal, steamed Rice, seasonal Subzi, and hot Puri Sabzi',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Local Dhabas / JTDC Dining',
          location: 'Netarhat Market',
          specialties: 'Rustic Desi Country Chicken curry, fried fish, and steaming rice prepared on wood fire',
        },
      ],
      peacefulNote:
        'Netarhat dining features rustic tribal staples like Marua (finger millet) rotis, forest greens (Saag), and piping hot mountain tea enjoyed amidst pine forests.',
    },
    attractions: [
      {
        id: 'IN-JH-NET-ATT-001',
        name: 'Magnolia Sunset Point',
        category: 'Nature · Hills & Mountains, Dramatic Vindhya Range Sunset Vista (10 km from Town)',
        timings: '06:00–19:00 (Sunset around 17:30–18:30)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Netarhat Tourism',
        summary:
          'Iconic cliffside belvedere named after a British maiden who plunged into the gorge for her tribal lover; celebrated for dramatic crimson sunsets over the rolling Vindhya mountains.',
      },
      {
        id: 'IN-JH-NET-ATT-002',
        name: 'Sunrise Point (Hotel Prabhat Vihar)',
        category: 'Nature · Hills & Mountains, Dawn Viewpoint Over Mist-Filled Valleys',
        timings: 'Dawn (Arrive by 05:30)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat',
        summary:
          'Located in the compound of JTDC Prabhat Vihar, offering front-row vistas as the morning sun rises above sea-like clouds and mist blanketed over the dense Sal forests.',
      },
      {
        id: 'IN-JH-NET-ATT-003',
        name: 'Netarhat Dam',
        category: 'Nature · Rivers & Lakes, Pine-Canopied British Colonial Water Body',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'JTDC Netarhat',
        summary:
          'A peaceful British-era water catchment reservoir tucked inside deep chir pine groves, providing scenic reflection views and tranquil nature walk trails.',
      },
      {
        id: 'IN-JH-NET-GEM-001',
        name: 'Upper Ghaghri & Lower Ghaghri Waterfalls',
        category: 'Nature / Adventure · Rivers & Lakes, Hiking & Trekking, Secluded Pine Cascades',
        timings: '08:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Netarhat Highlands',
        summary:
          'Pair of natural forest waterfalls dropping through narrow rocky ravines 4 km from town, accessed via serene walking trails shaded by dense sal, mahua, and pine trees.',
      },
      {
        id: 'IN-JH-NET-GEM-002',
        name: 'Lodh Falls (Burhaghigh Falls)',
        category: 'Nature · Rivers & Lakes, Highest Waterfall in Jharkhand (468 ft, Palamu)',
        timings: '08:00–16:00',
        fee: { domestic: 'Free (Forest permit may be required)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Palamu Tiger Reserve',
        summary:
          'The highest waterfall in Jharkhand plunging 468 feet on the Burha River inside the deep sal forests of the Palamu Tiger Reserve, roaring with thundering force during monsoons.',
      },
    ],
  },
];
