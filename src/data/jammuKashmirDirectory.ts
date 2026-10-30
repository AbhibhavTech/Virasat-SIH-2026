export interface JammuKashmirStay {
  name: string;
  category: string;
}

export interface JammuKashmirFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface JammuKashmirDining {
  veg: JammuKashmirFoodSpot[];
  nonVeg: JammuKashmirFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface JammuKashmirAttraction {
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

export interface JammuKashmirCity {
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
  topStays: JammuKashmirStay[];
  dining: JammuKashmirDining;
  attractions: JammuKashmirAttraction[];
}

export const JAMMU_KASHMIR_DIRECTORY: JammuKashmirCity[] = [
  {
    id: 'srinagar',
    code: 'IN-JK-SRA-ULTIMATE',
    name: 'Srinagar',
    nickname: 'The Venice of the East & Summer Capital',
    tagline: 'Dal Lake Shikarawalas, Mughal Terraced Water Cascades, and Sufi Sanctuaries',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-950/60 via-teal-950/40 to-slate-950/70',
    flashcardBlurb:
      'The enchanting summer capital of Jammu & Kashmir nestled in the Kashmir Valley, renowned for its iconic Dal Lake houseboats, shikaras, terraced Mughal gardens, and exquisite Kashmiri Wazwan.',
    coverImage: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80',
    photoCredit: 'Unsplash / Dal Lake Shikara Srinagar',
    topStays: [
      { name: 'Vivanta Dal View Srinagar', category: 'Krishi Nagar — Luxury hillside stay' },
      { name: 'The LaLiT Grand Palace Srinagar', category: 'Gupkar Road — Historic Dogra Royal Palace overlooking Dal Lake' },
      { name: 'Houseboat Wangnoo Heritage', category: 'Nigeen Lake — Luxury boutique houseboat' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Ahdoos Bakery',
          location: 'Regal Chowk',
          specialties: 'Traditional Kashmiri bakery and vegetarian snacks',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Mughal Darbar',
          location: 'Residency Road',
          specialties: 'Legendary Kashmiri Wazwan serving Rogan Josh, Rista, and Tabakh Maaz',
        },
        {
          restaurant: 'Ahdoos Restaurant',
          location: 'Residency Road',
          specialties: 'Authentic Wazwan feast and non-veg delicacies',
        },
      ],
      peacefulNote:
        'Srinagar’s culinary tradition bridges age-old royal Wazwan banquets with fragrant saffron kahwa, samovars, and comforting street bakery treats.',
    },
    attractions: [
      {
        id: 'IN-JK-SRA-ATT-001',
        name: 'Dal Lake & Shikara Ride',
        category: 'Nature / Recreation: Rivers & Lakes',
        timings: 'Sunrise to Sunset',
        fee: { domestic: 'Shikara ride ~INR 500–1000 per hour', foreign: 'Shikara ride ~INR 500–1000 per hour' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Shikara on Dal Lake',
        summary:
          'Expansive urban lake famous for floating flower markets, houseboats, and serene shikara boat cruises.',
      },
      {
        id: 'IN-JK-SRA-ATT-002',
        name: 'Mughal Gardens (Shalimar Bagh & Nishat Bagh)',
        category: 'Nature / Heritage: Forests & Gardens',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Nishat_Bagh_Srinagar_Kashmir.jpg/1280px-Nishat_Bagh_Srinagar_Kashmir.jpg',
        photoCredit: 'Wikimedia Commons / Nishat Bagh',
        summary:
          '17th-century terraced imperial gardens featuring fountains, cascading water channels, and vibrant flower beds.',
      },
      {
        id: 'IN-JK-SRA-ATT-003',
        name: 'Shankaracharya Temple',
        category: 'Spiritual / Heritage: Hinduism',
        timings: '07:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shankaracharya_temple_Srinagar_Kashmir.jpg/1280px-Shankaracharya_temple_Srinagar_Kashmir.jpg',
        photoCredit: 'Wikimedia Commons / Shankaracharya Temple',
        summary:
          "Ancient hilltop stone temple atop Takht-e-Sulaiman hill offering panoramic bird's-eye views over Srinagar and Dal Lake.",
      },
      {
        id: 'IN-JK-SRA-GEM-001',
        name: 'Pari Mahal',
        category: 'Heritage / Architecture: Historical Sites',
        timings: '09:30–19:30',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Pari_Mahal%2C_Srinagar.jpg/1280px-Pari_Mahal%2C_Srinagar.jpg',
        photoCredit: 'Wikimedia Commons / Pari Mahal',
        summary:
          'The "Palace of Fairies"—a seven-terraced garden and historic observatory built by Mughal Prince Dara Shikoh.',
      },
      {
        id: 'IN-JK-SRA-GEM-002',
        name: 'Hazratbal Shrine',
        category: 'Spiritual: Islam',
        timings: '05:30–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Hazratbal_Shrine%2C_Srinagar.jpg/1280px-Hazratbal_Shrine%2C_Srinagar.jpg',
        photoCredit: 'Wikimedia Commons / Hazratbal Shrine',
        summary:
          'Revered mosque on the western shore of Dal Lake housing a sacred relic (Moi-e-Muqqadas) of Islamic history.',
      },
    ],
  },
  {
    id: 'gulmarg',
    code: 'IN-JK-CITY-GUL',
    name: 'Gulmarg',
    nickname: 'The Meadow of Flowers & Ski Capital of India',
    tagline: 'Asia’s Highest Gondola, Apharwat Powder Snow, and Alpine Pine Glades',
    accentColor: '#0EA5E9',
    bgGradient: 'from-blue-950/60 via-cyan-950/40 to-slate-950/70',
    flashcardBlurb:
      '"The Meadow of Flowers" in the Pir Panjal Range, transforming from a wildflower-carpeted golf sanctuary in summer to Asia’s premier high-altitude powder-skiing capital in winter.',
    coverImage: 'https://images.unsplash.com/photo-1616190419596-e2839e7380d7?auto=format&fit=crop&w=1200&q=80',
    photoCredit: 'Unsplash / Gulmarg Snow Landscape',
    topStays: [
      { name: 'The Khyber Himalayan Resort & Spa', category: 'Luxury Alpine Resort with heated indoor pool & Apharwat views' },
      { name: "Nedou's Hotel Gulmarg", category: 'Colonial Heritage Estate since 1888' },
      { name: 'Hotel Highlands Park', category: 'Classic Mid-Century Ski Lodge & Heritage Retreat' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Bakshi Restaurant',
          location: 'Main Market',
          specialties: 'Pure Vegetarian North Indian comfort food, Jammu-style Rajma Chawal, hot Dal Makhani, and Stuffed Aloo Parathas',
        },
        {
          restaurant: 'Big Bite Cafe',
          location: 'Near Gondola Base Station',
          specialties: 'Steaming cups of Saffron Kehwa with sliced almonds, rich Hot Chocolate, and toasted sandwiches',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Cloves at The Khyber',
          location: 'The Khyber Himalayan Resort',
          specialties: 'Fine Dining Wazwan, slow-cooked winter Kashmiri Harissa, tender Braised Lamb Shank, and saffron rice',
        },
        {
          restaurant: 'Highlands Park Lounge',
          location: 'Near Golf Club',
          specialties: 'Traditional Kashmiri Mutton Rogan Josh, Continental chicken bakes, and fireside mountain grills',
        },
      ],
      peacefulNote:
        'Gulmarg dining centers around warm wooden hearths and steaming brass samovars serving fragrant kahwa against snowy alpine backdrops.',
    },
    attractions: [
      {
        id: 'IN-JK-GUL-ATT-001',
        name: 'Gulmarg Gondola (Phase 1 & Phase 2)',
        category: "Adventure / Nature · Cable Car, Asia's Highest Operating Ropeway ascending to Apharwat Peak (3,980 m)",
        timings: '09:00–17:00 (Weather dependent; strictly online pre-booking via J&K Cable Car Corporation portal)',
        fee: { domestic: 'Phase 1: ~INR 810 | Phase 2: ~INR 1,010', foreign: 'Phase 1: ~INR 810 | Phase 2: ~INR 1,010' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Gulmarg_Gondola_Kashmir.jpg/1280px-Gulmarg_Gondola_Kashmir.jpg',
        photoCredit: 'Wikimedia Commons / Gulmarg Gondola',
        summary:
          'One of the highest commercial cable cars in the world. Phase 1 transports riders from Gulmarg resort through pine forests to Kongdoori bowl (3,050 m), while Phase 2 soars up the rugged ridges of Mount Apharwat to an elevation of 3,980 meters.',
      },
      {
        id: 'IN-JK-GUL-ATT-002',
        name: 'Apharwat Peak Snow Line & High-Altitude Ski Slopes',
        category: 'Adventure · Skiing, Snowboarding, High-Altitude Heli-Skiing, Powder Snow',
        timings: '09:30–16:00 (Winter ski season mid-December to end-March)',
        fee: { domestic: 'Gear rental & instructor packages ~INR 2,500–5,000/day', foreign: 'Gear rental ~INR 2,500–5,000/day' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Apharwat Snow Slopes',
        summary:
          'Internationally acclaimed powder-snow paradise on the shoulders of Mount Apharwat. Features natural snow bowls, gentle nursery slopes at Kongdoori for beginners, and heart-pounding backcountry trails for expert heli-skiers and snowboarders.',
      },
      {
        id: 'IN-JK-GUL-ATT-003',
        name: "St. Mary's Church & Gulmarg Golf Course",
        category: "Heritage / Recreation · Historical Buildings, 1902 Victorian Alpine Stone Church & World's Highest 18-Hole Green Golf Course",
        timings: '10:00–17:00',
        fee: { domestic: 'Church: Free | Golf green fee: INR 800–1,200', foreign: 'Church: Free | Golf green fee: INR 800–1,200' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/St._Mary%27s_Church%2C_Gulmarg.jpg/1280px-St._Mary%27s_Church%2C_Gulmarg.jpg',
        photoCredit: "Wikimedia Commons / St. Mary's Church",
        summary:
          'Picturesque Victorian stone church built in 1902 with stained-glass windows and timber roof trusses, perched in the meadows amidst the world’s highest 18-hole green golf course established by the British in 1911 at 2,650 meters altitude.',
      },
      {
        id: 'IN-JK-GUL-GEM-001',
        name: 'Drung Frozen Waterfall, Tangmarg',
        category: 'Nature · Rivers & Lakes, Natural Cascading Fall that freezes into colossal ice stalactites in winter',
        timings: 'Daylight hours (07:00–17:30)',
        fee: { domestic: 'Free (ATV / Chain-wheel taxi from Tangmarg in deep snow: INR 1,000–1,500 return)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Drung_Waterfall_Tangmarg_Kashmir.jpg/1280px-Drung_Waterfall_Tangmarg_Kashmir.jpg',
        photoCredit: 'Wikimedia Commons / Drung Frozen Waterfall',
        summary:
          'Cascading mountain waterfall nestled in a forested ravine 3 km from Tangmarg. In deep winter (December to February), the roaring waters completely freeze into gigantic hanging stalactites and frozen ice sculptures against rocky cliff faces.',
      },
      {
        id: 'IN-JK-GUL-GEM-002',
        name: 'Maharani Temple (Rani Temple / Mohineshwar Shivalaya)',
        category: 'Heritage / Spiritual · Hinduism, 1915 Sloped Red-Roof Hilltop Temple built by Queen Mohini Bai Sisodia',
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Maharani_Temple_Gulmarg.jpg/1280px-Maharani_Temple_Gulmarg.jpg',
        photoCredit: 'Wikimedia Commons / Maharani Temple',
        summary:
          'Constructed in 1915 by Queen Mohini Bai Sisodia, wife of Maharaja Hari Singh. Perched atop a hillock in the central meadow, its iconic red roof and brass finials are visible from virtually every vantage point across Gulmarg.',
      },
      {
        id: 'IN-JK-GUL-GEM-003',
        name: 'Strawberry Valley Trek',
        category: 'Nature / Rural · Forests & Gardens, Unpaved Meadow Trails surrounded by pine glades',
        timings: 'Daylight hours',
        fee: { domestic: 'Free (Pony ride rates regulated by local tourism union: INR 800–1,500)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Gulmarg Pine Meadows',
        summary:
          'Quiet, pastoral valley tucked behind Gulmarg’s golf course where wild strawberries bloom in early summer, framed by dense deodar groves, grazing shepherd herds, and secluded picnic trails.',
      },
    ],
  },
  {
    id: 'pahalgam',
    code: 'IN-JK-CITY-PHG',
    name: 'Pahalgam',
    nickname: 'The Valley of Shepherds & Lidder Trout Haven',
    tagline: 'Lidder Angling Streams, Betaab Meadow Panoramas, and Amarnath Yatra Gateway',
    accentColor: '#16A34A',
    bgGradient: 'from-emerald-950/60 via-teal-950/40 to-slate-950/70',
    flashcardBlurb:
      '"The Valley of Shepherds" at the confluence of the Lidder and Sheshnag rivers, serving as the traditional basecamp for the holy Amarnath Yatra and a haven of pine forests and angling streams.',
    coverImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
    photoCredit: 'Unsplash / Betaab Valley Lidder Pahalgam',
    topStays: [
      { name: 'Pine N Peak - ITC Hotels', category: 'Aru Road — Hillside Luxury with Lidder Valley views' },
      { name: 'Kolahoi Green Resort', category: 'KP Road — Riverside Comfort' },
      { name: 'Pahalgam Hotel', category: 'Market Main — Heritage Stay since 1931' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Dana Pani',
          location: 'Pahalgam Market',
          specialties: 'Homestyle Pure Vegetarian Dal Makhani, Paneer Butter Masala, stuffed parathas, and full North Indian thalis',
        },
        {
          restaurant: 'Punjabi Rasoi',
          location: 'KP Road',
          specialties: 'Piping hot Gobi & Aloo Parathas with fresh white butter, Chana Bhatura, and sweet Lassi',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Trout Beat',
          location: 'Pahalgam Market',
          specialties: 'Fresh Pan-Seared Himalayan Brown and Rainbow Trout sourced from clean mountain streams, garlic butter dressing',
        },
        {
          restaurant: 'Cafe Log Inn',
          location: 'Main Market',
          specialties: 'Freshly baked Pahalgam walnut tarts, artisanal coffee, and wood-grilled chicken sandwiches',
        },
      ],
      peacefulNote:
        'Pahalgam is famed for crisp mountain air and freshly caught Lidder river trout, paired with fragrant local saffron and freshly harvested walnuts.',
    },
    attractions: [
      {
        id: 'IN-JK-PHG-ATT-001',
        name: 'Betaab Valley (Hajan Valley)',
        category: 'Nature · Rivers & Lakes, Forests & Gardens, Iconic Deodar Meadows & Lidder Stream',
        timings: '08:00–19:00',
        fee: { domestic: 'INR 100 per person (Accessed by Pahalgam Taxi Union cabs)', foreign: 'INR 100 per person' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Betaab_Valley_Pahalgam.jpg/1280px-Betaab_Valley_Pahalgam.jpg',
        photoCredit: 'Wikimedia Commons / Betaab Valley',
        summary:
          'Lush deodar-fringed meadow basin situated 15 km from Pahalgam on the Chandanwari road, named after the 1983 Bollywood blockbuster "Betaab". The crystal-clear Lidder River meanders through weeping willows against sheer snow-crested mountain walls.',
      },
      {
        id: 'IN-JK-PHG-ATT-002',
        name: 'Aru Valley',
        category: 'Nature / Adventure · Hiking & Trekking, Scenic Mountain Village & Trailhead for Kolahoi Glacier',
        timings: 'Daylight hours',
        fee: { domestic: 'Entry token INR 25–50; Taxi Union return cab ~INR 1,200–1,800', foreign: 'Entry token INR 25–50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Aru_Valley_Pahalgam_Kashmir.jpg/1280px-Aru_Valley_Pahalgam_Kashmir.jpg',
        photoCredit: 'Wikimedia Commons / Aru Valley',
        summary:
          'Pristine highland hamlet 12 km upstream along the Aru stream, famed for rolling green pastures, grazing Gujjar horse herds, and serving as the primary basecamp for iconic high-altitude Himalayan treks to Kolahoi Glacier and Tarsar-Marsar lakes.',
      },
      {
        id: 'IN-JK-PHG-ATT-003',
        name: 'Chandanwari',
        category: 'Nature / Spiritual · Snow Bridges, Official Basecamp & Trailhead of the Annual Shri Amarnath Yatra',
        timings: '07:00–17:00',
        fee: { domestic: 'Free entry (Union taxi from Pahalgam market: INR 1,200–1,600)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Chandanwari_Pahalgam.jpg/1280px-Chandanwari_Pahalgam.jpg',
        photoCredit: 'Wikimedia Commons / Chandanwari',
        summary:
          'Situated 16 km northeast of Pahalgam at 2,895 meters altitude, Chandanwari is celebrated for persistent snow bridges over the Sheshnag river and marks the official starting point for the arduous 32-km pilgrimage to the holy Amarnath Cave shrine.',
      },
      {
        id: 'IN-JK-PHG-ATT-004',
        name: 'Baisaran Valley ("Mini Switzerland")',
        category: 'Nature / Adventure · Hills & Mountains, High-Altitude Meadow, Horse Trekking & Ziplining',
        timings: '07:00–18:00',
        fee: { domestic: 'Free (Pony ride union tariff approx INR 1,500–2,200 per pony)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Baisaran_Valley_Pahalgam.jpg/1280px-Baisaran_Valley_Pahalgam.jpg',
        photoCredit: 'Wikimedia Commons / Baisaran Valley',
        summary:
          'Enchanting hilltop meadow surrounded by thick pine and deodar forests 5 km from Pahalgam. Known as "Mini Switzerland" for its striking alpine resemblance, accessible via a picturesque horseback pony trek.',
      },
      {
        id: 'IN-JK-PHG-GEM-001',
        name: 'Mamal Temple (Mamaleshwar)',
        category: 'Heritage / Spiritual · Hinduism, 12th-Century Stone Shiva Temple built by King Jayasimha with natural spring',
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Mamaleshwar_Temple_Pahalgam.jpg/1280px-Mamaleshwar_Temple_Pahalgam.jpg',
        photoCredit: 'Wikimedia Commons / Mamaleshwar Temple',
        summary:
          'Ancient stone Shiva temple dating to 1165 CE during the reign of King Jayasimha, located across the Lidder River in Mamal. Enshrines a stone lingam surrounded by a natural perennial spring water pool within monolithic granite walls.',
      },
      {
        id: 'IN-JK-PHG-GEM-002',
        name: 'Overa-Aru Wildlife Sanctuary',
        category: 'Nature / Rural · Wildlife-Tourism, Habitat of Endangered Kashmir Stag (Hangul), Musk Deer & Monal',
        timings: '08:00–17:00',
        fee: { domestic: 'INR 50', foreign: 'INR 200' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Wildlife Sanctuary Overa-Aru',
        summary:
          'Sprawling over 500 sq km of rugged mountain terrain, this protected biosphere shelters rare and endangered wildlife including the Hangul (Kashmir Stag), Himalayan Musk Deer, Snow Leopard, Brown Bear, and Himalayan Monal Pheasant.',
      },
    ],
  },
  {
    id: 'jammu',
    code: 'IN-JK-CITY-JMU',
    name: 'Jammu',
    nickname: 'The City of Temples & Dogra Capital',
    tagline: 'Ancient River Tawi Bastions, Dogra Royal Palaces, and Spiritual Gateways',
    accentColor: '#D97706',
    bgGradient: 'from-amber-950/60 via-red-950/40 to-slate-950/70',
    flashcardBlurb:
      '"The City of Temples" along the Tawi River, known for ancient Dogra military bastions, gold-plated temple spires, royal palaces, and the gateway to Shri Mata Vaishno Devi.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bahu_Fort_Jammu.jpg/1280px-Bahu_Fort_Jammu.jpg',
    photoCredit: 'Wikimedia Commons / Bahu Fort Jammu',
    topStays: [
      { name: 'Radisson Blu Jammu', category: 'Bypass Road — Premium 5-Star Luxury' },
      { name: 'Fortune Inn Riviera', category: 'Gulab Singh Marg — City Center Comfort' },
      { name: 'Hari Niwas Palace', category: 'Palace Road — Heritage Dogra Palace Hotel' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Pahalwan Di Hatti',
          location: 'Gole Market, Gandhi Nagar',
          specialties: 'Legendary Jammu Rajma Chawal with Pure Desi Ghee, Sund Panjeeri, Kalari Kulcha with tangy chutney',
        },
        {
          restaurant: 'Rawal Pindi Sweet Shop',
          location: 'Raghunath Bazaar',
          specialties: 'Desi Ghee Poori Chhole at dawn, warm melt-in-mouth Gulab Jamun, and Badam Milk',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Falak Revolving Restaurant',
          location: 'KC Residency, Residency Road',
          specialties: 'Revolving city skyline views serving authentic Dogra Khatta Meat (tangy mutton with pomegranate seeds) and Rara Gosht',
        },
        {
          restaurant: 'Sagar Ratna / Local Dhabas',
          location: 'Jammu Tawi',
          specialties: 'Spiced Jammu Mutton Curry, tandoori rotis, and aromatic chicken kebabs',
        },
      ],
      peacefulNote:
        'Jammu cuisine is celebrated for indigenous Kalari cheese (the mozzarella of Kashmir), slow-simmered spiced Rajma with anardana, and royal Dogra meat specialties.',
    },
    attractions: [
      {
        id: 'IN-JK-JMU-ATT-001',
        name: 'Raghunath Temple Complex',
        category: "Spiritual / Heritage · Hinduism, One of North India's Largest Temple Complexes with Gold-Plated Walls",
        timings: '06:00–20:30 (Closes 12:30–16:00)',
        fee: { domestic: 'Free (Strict security; electronics and leather deposited outside)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Raghunath_Temple_Jammu.jpg/1280px-Raghunath_Temple_Jammu.jpg',
        photoCredit: 'Wikimedia Commons / Raghunath Temple Jammu',
        summary:
          'Constructed between 1835 and 1860 by Dogra rulers Maharaja Gulab Singh and Maharaja Ranbir Singh. Consists of seven distinct shrines with gold-inlaid inner walls, housing 330 million lingams/saligrams and an ancient library of rare Sanskrit manuscripts.',
      },
      {
        id: 'IN-JK-JMU-ATT-002',
        name: 'Bahu Fort & Bagh-e-Bahu Gardens',
        category: 'Heritage / Nature · Palaces & Forts, 3,000-Year-Old Historic Fort, Bave Wali Mata Kali Temple',
        timings: '05:00–22:00',
        fee: { domestic: 'Fort/Garden: INR 10 | Aquarium: INR 20', foreign: 'Fort/Garden: INR 10 | Aquarium: INR 20' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bahu_Fort_Jammu.jpg/1280px-Bahu_Fort_Jammu.jpg',
        photoCredit: 'Wikimedia Commons / Bahu Fort',
        summary:
          'Perched on a rocky cliff commanding the Tawi River, originally built 3,000 years ago by Raja Bahu Lochan. Houses the revered Bave Wali Mata shrine dedicated to Goddess Kali, surrounded by landscaped Mughal gardens and India’s largest underground marine aquarium.',
      },
      {
        id: 'IN-JK-JMU-ATT-003',
        name: 'Amar Mahal Palace & Museum',
        category: 'Heritage / Arts · Palaces & Forts, Museums, 19th-Century French-Château Style Palace with 120-kg Gold Throne',
        timings: '09:00–13:00 & 14:00–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 50', foreign: 'INR 200' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Amar_Mahal_Palace_Jammu.jpg/1280px-Amar_Mahal_Palace_Jammu.jpg',
        photoCredit: 'Wikimedia Commons / Amar Mahal Palace',
        summary:
          'Exquisite French-château style palace constructed with red sandstone in 1862 by French architect for Raja Amar Singh. Today a museum preserving royal Dogra memorabilia, Pahari miniature paintings from Kangra, and the 120-kg solid gold Dogra throne.',
      },
      {
        id: 'IN-JK-JMU-ATT-004',
        name: 'Jammu Ropeway (Bahu Fort to Mahamaya & Peerkho)',
        category: 'Nature / Recreation · Cable Car, Scenic River Tawi Crossing connecting Heritage Sites',
        timings: '10:00–17:30',
        fee: { domestic: 'Section 1 (Bahu to Mahamaya): INR 150 | Full Circuit: INR 300', foreign: 'Same as domestic' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Jammu_Ropeway.jpg/1280px-Jammu_Ropeway.jpg',
        photoCredit: 'Wikimedia Commons / Jammu Ropeway',
        summary:
          '1.65-km passenger cable car connecting three iconic hilltops across the Tawi river basin from Bahu Fort to Mahamaya Temple and Peer Kho Cave temple, providing dramatic bird’s-eye vistas of Jammu city and the Shivalik foothills.',
      },
      {
        id: 'IN-JK-JMU-GEM-001',
        name: 'Peer Kho Cave Temple',
        category: 'Spiritual / Nature · Hinduism, Natural Limestone Cave Temple Dedicated to Lord Shiva (Jamvant Cave)',
        timings: '05:00–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Peer_Kho_Cave_Temple_Jammu.jpg/1280px-Peer_Kho_Cave_Temple_Jammu.jpg',
        photoCredit: 'Wikimedia Commons / Peer Kho Cave Temple',
        summary:
          'Historic underground limestone cave shrine nestled in an acacia grove overlooking the Tawi river. Believed in the Ramayana to be where the bear warrior-king Jamvant (Jambavan) meditated upon Lord Shiva, enshrining a self-manifested Swayambhu lingam.',
      },
      {
        id: 'IN-JK-JMU-GEM-002',
        name: 'Mansar Lake & Sheshnag Sanctuary',
        category: 'Nature / Spiritual · Rivers & Lakes, Sacred Lake ringed by Pine Forests, Ancient Tortoise Colony',
        timings: '07:00–18:30',
        fee: { domestic: 'Free (Boating: INR 100–200)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Mansar_Lake_Jammu.jpg/1280px-Mansar_Lake_Jammu.jpg',
        photoCredit: 'Wikimedia Commons / Mansar Lake Jammu',
        summary:
          'Sacred freshwater lake 60 km east of Jammu ringed by dense pine-clad hills. Venerated as a pilgrimage site for Sheshnag (the serpent king with six heads), celebrated for calm pedal-boating, a thriving colony of harmless freshwater softshell turtles, and the nearby ruined fort of Mahor Garh.',
      },
    ],
  },
];
