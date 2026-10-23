export interface HaryanaStay {
  name: string;
  category: string;
}

export interface HaryanaFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface HaryanaDining {
  veg: HaryanaFoodSpot[];
  nonVeg: HaryanaFoodSpot[];
  pilgrimageNotice?: string;
  peacefulNote?: string;
}

export interface HaryanaAttraction {
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

export interface HaryanaCity {
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
  topStays: HaryanaStay[];
  dining: HaryanaDining;
  attractions: HaryanaAttraction[];
}

export const HARYANA_DIRECTORY: HaryanaCity[] = [
  {
    id: 'kurukshetra',
    code: 'IN-HR-CITY-KUK',
    name: 'Kurukshetra',
    nickname: 'Dharmakshetra & Cradle of the Bhagavad Gita',
    tagline: 'Mahabharata epicentre, colossal Brahma Sarovar, holy Jyotisar banyan & Shakti Peeth',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: '/images/haryana/kurukshetra-brahma-sarovar.png',
    photoCredit: 'Discover Bharat / Brahma Sarovar at Sunset',
    flashcardBlurb:
      'The epicentre of the Mahabharata war and the birthplace of the Bhagavad Gita, drawing pilgrims to its massive holy sarovars and ancient banyan trees.',
    topStays: [
      { name: 'Divine Clarks Inn Suites', category: 'Pipli Road — Modern 4-Star Comfort' },
      { name: 'Hotel Krishna Mahal', category: 'Near Brahma Sarovar — Central Pilgrim Stay' },
      { name: 'Haryana Tourism Parakeet Resort', category: 'Pipli — State-Run Reliable Highway Haven' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Hot Millions',
          location: 'Sector 17, Kurukshetra',
          specialties: 'North Indian vegetarian thalis, Paneer Tikka, Dal Makhani & family comfort meals',
        },
        {
          restaurant: 'Chacha Ka Dhaba',
          location: 'Pipli Highway (NH-44)',
          specialties: 'Famous stuffed Aloo-Pyaaz and Gobhi tandoori parathas with white butter and thick churned lassi',
        },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Sacred Pilgrimage Bylaw: As a major holy city, non-vegetarian food and alcohol are strictly restricted within the core pilgrimage precincts around Brahma Sarovar and Jyotisar. Highway dhabas on the NH-44 outskirts cater to travelers with standard Punjabi preparations.',
      peacefulNote:
        'Haryanvi culinary heritage highlights wholesome rural farm food—steaming Bajra Khichdi, fresh white butter (Makhan), Sarson ka Saag, and tall glasses of sweet buttermilk.',
    },
    attractions: [
      {
        id: 'IN-HR-KUK-ATT-001',
        name: 'Brahma Sarovar',
        category: "Spiritual / Nature · Hinduism, Rivers & Lakes, One of Asia's Largest Man-Made Tanks",
        timings: 'Open 24 Hours (Best during morning & evening Maha Aarti)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/haryana/kurukshetra-brahma-sarovar.png',
        photoCredit: 'Discover Bharat',
        summary:
          'Enormous 1,200-metre sacred water reservoir where Lord Brahma is believed to have performed cosmic creation; millions gather here during solar eclipses for a sanctifying holy dip.',
      },
      {
        id: 'IN-HR-KUK-ATT-002',
        name: 'Jyotisar & The Holy Banyan Tree',
        category: 'Spiritual · Hinduism, The Birthplace of the Bhagavad Gita & Immortal Banyan',
        timings: '06:00–20:00 (Light & Sound show in the evening)',
        fee: { domestic: 'Free (Light & Sound Show: INR 30)', foreign: 'Free (Light & Sound Show: INR 30)' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Kurukshetra Development Board',
        summary:
          'The sacred sanctum where Lord Krishna delivered the immortal 700 verses of the Bhagavad Gita to Arjuna beneath a five-thousand-year-old banyan tree (Akshaya Vat).',
      },
      {
        id: 'IN-HR-KUK-ATT-003',
        name: 'Sri Krishna Museum',
        category: "Heritage / Arts · Museums, Antiquities, Sculptures & Paintings of Krishna's Life",
        timings: '10:00–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 30', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Ministry of Culture, India',
        summary:
          'Multi-gallery heritage museum displaying 1st-to-12th-century stone sculptures, Kangra and Pichwai paintings, bronze icons, and dioramas narrating the Mahabharata.',
      },
      {
        id: 'IN-HR-KUK-GEM-001',
        name: "Sheikh Chehli's Tomb",
        category: "Heritage · Monuments, 17th-Century Mughal Persian Architecture & Dara Shikoh's Guru",
        timings: '09:00–17:00',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Archaeological Survey of India',
        summary:
          'Stunning octagonal marble and red sandstone mausoleum built in 1650 for Sufi master Abd-ur-Rahim (Sheikh Chehli), spiritual mentor of Prince Dara Shikoh, resembling the Taj Mahal.',
      },
      {
        id: 'IN-HR-KUK-GEM-002',
        name: 'Bhadrakali Temple',
        category: "Spiritual · Hinduism, One of the 51 Shakti Peethas (Sati's Right Ankle)",
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Bhadrakali Shrine Trust',
        summary:
          'Ancient Shakti shrine where the Pandavas worshiped Goddess Kali before the Mahabharata war; devotees traditionally offer brass and clay horse figurines upon wish fulfillment.',
      },
    ],
  },
  {
    id: 'gurugram',
    code: 'IN-HR-CITY-GUG',
    name: 'Gurugram / Gurgaon',
    nickname: 'Millennium City & Silicon Financial Corridor',
    tagline: 'Cyber Hub lifestyle, Aravalli biodiversity, Sultanpur avian wetlands & luxury golf estates',
    accentColor: '#2563EB',
    bgGradient: 'from-blue-50 via-sky-50/40 to-stone-50/30',
    coverImage: '/images/haryana/gurugram-sultanpur-sanctuary.png',
    photoCredit: 'Discover Bharat / Sultanpur National Bird Sanctuary',
    flashcardBlurb:
      'A sprawling "Millennium City" characterized by towering corporate skylines and bustling entertainment hubs, uniquely juxtaposed with serene avian wetland sanctuaries.',
    topStays: [
      { name: 'The Oberoi Gurugram', category: 'Udyog Vihar — Ultra-Luxury Urban Oasis with Reflecting Pools' },
      { name: 'ITC Grand Bharat', category: 'Hasanpur, Manesar — 300-Acre Luxury Golf Resort' },
      { name: 'Taj City Centre', category: 'Sector 44 — Contemporary Cosmopolitan Elegance' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Burma Burma',
          location: 'DLF Cyber Hub',
          specialties: 'Premium Vegetarian Pan-Asian, signature Tea Leaf Salad, Samosa Soup & Khow Suey',
        },
        {
          restaurant: "Haldiram's",
          location: 'NH-48, Kherki Daula',
          specialties: 'Famous Delhi-NCR street chaat, Raj Kachori, Chhole Bhature, and Indian mithai',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Farzi Cafe',
          location: 'DLF Cyber Hub',
          specialties: 'Modern Indian gastronomy, molecular gastronomy chaats, and fusion meat roasts',
        },
        {
          restaurant: 'Dhaba Estd 1986 Delhi',
          location: 'DLF Cyber Hub',
          specialties: 'Highway Balti Meat, Highway Tandoori Chicken, and Galouti Kebab with Roomali Roti',
        },
        {
          restaurant: 'Comorin',
          location: 'Two Horizon Center, Golf Course Road',
          specialties: 'Regional Indian culinary craft, Champaran mutton, inventive cocktails, and sous-vide curries',
        },
      ],
      peacefulNote:
        'Gurugram’s dining scene is among India’s most sophisticated, offering Michelin-caliber progressive Indian cooking, craft cocktail bars, and international microbreweries.',
    },
    attractions: [
      {
        id: 'IN-HR-GUG-ATT-001',
        name: 'Sultanpur Bird Sanctuary',
        category: 'Nature · Wildlife-Tourism, Rivers & Lakes, Ramsar Wetland Haven for Migratory Birds',
        timings: '07:00–16:30 (Closed Tuesdays; best season Oct to March)',
        fee: { domestic: 'INR 5 (Camera: INR 10)', foreign: 'INR 40 (Camera: INR 10)' },
        isHiddenGem: false,
        image: '/images/haryana/gurugram-sultanpur-sanctuary.png',
        photoCredit: 'Discover Bharat',
        summary:
          'Ramsar-designated freshwater wetland 15 km from town sheltering over 250 bird species including Siberian cranes, flamingos, bar-headed geese, and pelicans during winter.',
      },
      {
        id: 'IN-HR-GUG-ATT-002',
        name: 'DLF Cyber Hub',
        category: 'Recreation · Gastronomy, Integrated Corporate Dining & Lifestyle Amphitheatre',
        timings: '10:00–01:00',
        fee: { domestic: 'Free entry', foreign: 'Free entry' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'DLF CyberCity Gurugram',
        summary:
          'India’s premier 200,000 sq. ft. open-air socializing destination, buzzing with 50+ upscale restaurants, craft cocktail lounges, bookstores, and an open-air cultural amphitheatre.',
      },
      {
        id: 'IN-HR-GUG-ATT-003',
        name: 'Sheetla Mata Mandir',
        category: 'Spiritual · Hinduism, Historic Shrine Dedicated to Kripi, Wife of Guru Dronacharya',
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Gurugram Religious Trust',
        summary:
          'Century-old pilgrimage shrine honouring Mata Sheetla Devi (Kripi), revered across North India for protecting infants and curing ailments; origin of the name Gurugram (Guru Drona’s village).',
      },
      {
        id: 'IN-HR-GUG-GEM-001',
        name: 'Museo Camera Centre for the Photographic Arts',
        category: 'Arts / Heritage · Museums, Southeast Asia’s Largest Photography Museum',
        timings: '11:00–19:00 (Closed Mondays)',
        fee: { domestic: 'INR 300', foreign: 'INR 300' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Museo Camera / Aditya Arya',
        summary:
          'State-of-the-art 18,000 sq. ft. photography museum housing 3,000+ vintage cameras, daguerreotypes, early Kodak apparatus, working darkrooms, and global fine-art photo galleries.',
      },
      {
        id: 'IN-HR-GUG-GEM-002',
        name: 'Aravalli Biodiversity Park',
        category: 'Nature / Recreation · Forests & Gardens, Eco-Tourism, 380-Acre Restored Native Wilderness',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'iamgurgaon Eco Project',
        summary:
          'Award-winning 380-acre ecological restoration of former stone quarries into dense native Aravalli thorn forest, home to jackals, monitor lizards, nilgai, and 200 bird species on nature trails.',
      },
    ],
  },
  {
    id: 'pinjore',
    code: 'IN-HR-CITY-PNJ',
    name: 'Pinjore',
    nickname: 'Terraced Garden City of the Shivaliks',
    tagline: '17th-century Mughal water gardens, 8th-century Bhima Devi ruins & mountain ropeways',
    accentColor: '#059669',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: '/images/haryana/pinjore-yadavindra-gardens.png',
    photoCredit: 'Discover Bharat / Yadavindra Mughal Gardens, Pinjore',
    flashcardBlurb:
      'A historic town nestled in the Shivalik foothills, celebrated for its beautifully restored 17th-century Mughal terraced gardens and ancient temple ruins.',
    topStays: [
      { name: 'Timber Trail Resort', category: 'Parwanoo Border — Cable Car Access Mountain Resort' },
      { name: 'Haryana Tourism Yadavindra Gardens Motel', category: 'Inside Garden Complex — Heritage Bungalow' },
      { name: 'Excursion from Chandigarh/Panchkula', category: 'Most visitors tour Pinjore as a scenic day trip (20 km)' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Jal Mahal Cafe',
          location: 'Inside Pinjore Gardens',
          specialties: 'Piping hot tea, vegetable cutlets, paneer pakoras, and North Indian vegetarian snacks',
        },
        {
          restaurant: 'Gopal Sweets',
          location: 'Panchkula (Near Pinjore)',
          specialties: 'Famous Dahi Bhalla, Raj Kachori, Chhole Bhature, Rasmalai, and Desi Ghee bakes',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Highway Dhabas (Kalka-Shimla Route)',
          location: 'NH-5, Pinjore Outskirts',
          specialties: 'Authentic Punjabi roadside Chicken Curry, Tandoori Roti, and slow-simmered Mutton Rogan Josh',
        },
      ],
      peacefulNote:
        'Evenings at Pinjore Gardens are enlivened by illuminated cascading fountains, cool foothill breezes, and sweet roasted corn on the cob.',
    },
    attractions: [
      {
        id: 'IN-HR-PNJ-ATT-001',
        name: 'Yadavindra Gardens (Pinjore Gardens)',
        category: 'Heritage / Nature · Forests & Gardens, 17th-Century Charbagh Mughal Terraces',
        timings: '07:00–21:30',
        fee: { domestic: 'INR 20', foreign: 'INR 50' },
        isHiddenGem: false,
        image: '/images/haryana/pinjore-yadavindra-gardens.png',
        photoCredit: 'Discover Bharat',
        summary:
          'Magnificent 100-acre terraced garden created in 1660 by Mughal architect Nawab Fidai Khan, descending across seven levels with water canals, fountains, pavilions, and royal palms.',
      },
      {
        id: 'IN-HR-PNJ-ATT-002',
        name: 'Bhima Devi Temple Complex',
        category: 'Heritage / Spiritual · Archeological Sites, 8th–11th Century "Khajuraho of North India"',
        timings: '08:00–18:00',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Haryana Archeological Department',
        summary:
          'Excavated ruins of an 8th-to-11th-century Gurjara-Pratihara Panchayatana temple destroyed during medieval invasions, celebrated for intricate erotic and divine stone sculptures.',
      },
      {
        id: 'IN-HR-PNJ-GEM-001',
        name: 'Timber Trail Ropeway, Parwanoo',
        category: 'Adventure / Nature · Cable Car, Scenic Mountain Gorge Ascent into Shivalik Hills',
        timings: '09:00–17:00',
        fee: { domestic: 'Ropeway INR 1,200 (Return)', foreign: 'Ropeway INR 1,200 (Return)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Timber Trail Resorts',
        summary:
          'Thrilling 1.8-km cable car ride gliding 5,000 feet above the Kaushalya river gorge, connecting the base highway directly to the clifftop Timber Trail Heights resort.',
      },
      {
        id: 'IN-HR-PNJ-GEM-002',
        name: 'Kaushalya Dam',
        category: 'Nature · Rivers & Lakes, Scenic Earth-Fill Dam in Shivalik Foothills',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Pinjore Water Resources',
        summary:
          'Tranquil earth-fill embankment dam constructed on the Kaushalya River, offering picturesque sunset vistas of Shivalik pine slopes, migratory water birds, and tranquil waters.',
      },
    ],
  },
  {
    id: 'panipat',
    code: 'IN-HR-CITY-PNP',
    name: 'Panipat',
    nickname: 'City of Weavers & Historic Imperial Battlefield',
    tagline: 'Three epoch-defining battlefields, Lodhi & Mughal mausoleums & handloom craft',
    accentColor: '#9333EA',
    bgGradient: 'from-purple-50 via-rose-50/40 to-stone-50/30',
    coverImage: '/images/haryana/panipat-ibrahim-lodhi-tomb.jpg',
    photoCredit: "Discover Bharat / Sultan Ibrahim Lodhi's Tomb, Panipat",
    flashcardBlurb:
      'The "City of Weavers" and the historic battlefield where three pivotal wars shaped India\'s destiny, today known for its textile industries and historical monuments.',
    topStays: [
      { name: 'Hotel Gold', category: 'GT Road — Premium City Comfort & Banquets' },
      { name: 'Hive Panipat', category: 'GT Road — Contemporary Business Stay' },
      { name: 'Haryana Tourism Skylark Resort', category: 'GT Road — State-Run Reliable Motel' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Ahuja Sweets',
          location: 'GT Road, Panipat',
          specialties: 'Piping hot Chhole Bhature, thick creamy Malai Lassi, and Panipat’s famous Paneer Jalebi',
        },
        {
          restaurant: 'Skylark Resort Canteen',
          location: 'GT Road',
          specialties: 'Homestyle North Indian vegetarian meals, Dal Tadka, Tandoori Roti & Mixed Veg',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Dawat Restaurant',
          location: 'Near GT Road',
          specialties: 'Aromatic Mughlai gravies, smoky Tandoori Chicken, and Chicken Korma',
        },
        {
          restaurant: 'Highway NH-44 Dhabas',
          location: 'NH-44 Bypass',
          specialties: 'Dhaba-style spicy Mutton Curry, Egg Bhurji, and crisp Tandoori Parathas',
        },
      ],
      peacefulNote:
        'Panipat is celebrated across India for its warm golden Paneer Jalebi, rich Pachranga pickles matured under the sun, and artisan handloom textile markets.',
    },
    attractions: [
      {
        id: 'IN-HR-PNP-ATT-001',
        name: 'Panipat Museum',
        category: 'Heritage · Museums, Artifacts, Armory & Relics of the Three Historic Battles',
        timings: '10:00–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 10–15', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Haryana Archeological Museum',
        summary:
          'Dedicated to the three historic Battles of Panipat (1526, 1556, and 1761), preserving ancient matchlock muskets, suits of chain mail, battle maps, coins, and miniature paintings.',
      },
      {
        id: 'IN-HR-PNP-ATT-002',
        name: "Ibrahim Lodhi's Tomb",
        category: 'Heritage · Monuments, Final Resting Place of the Last Delhi Sultan (Battle of 1526)',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/haryana/panipat-ibrahim-lodhi-tomb.jpg',
        photoCredit: 'Discover Bharat',
        summary:
          'Simple red-brick tomb standing in a peaceful park marking where Sultan Ibrahim Lodhi fell facing Babur’s artillery in the First Battle of Panipat on April 21, 1526, inaugurating Mughal rule.',
      },
      {
        id: 'IN-HR-PNP-ATT-003',
        name: 'Kabuli Bagh Mosque',
        category: 'Heritage / Spiritual · Islam, 1527 Timurid Mosque Built by Emperor Babur',
        timings: '08:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'ASI Panipat Sub-Circle',
        summary:
          'Built in 1527 by Emperor Babur to commemorate his victory over Ibrahim Lodhi, named after his queen Kabuli Begum, featuring early Timurid-style arched gates and a tranquil garden quadrangle.',
      },
      {
        id: 'IN-HR-PNP-GEM-001',
        name: 'Kala Amb Park',
        category: 'Heritage · Historical Sites, Ground of the Third Battle of Panipat (1761)',
        timings: '08:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Panipat War Memorial Trust',
        summary:
          'Memorial garden marking the tragic site of the Third Battle of Panipat (1761), named after a black mango tree that stood witness to the clash between Sadashivrao Bhau’s Maratha army and Ahmad Shah Abdali.',
      },
      {
        id: 'IN-HR-PNP-GEM-002',
        name: 'Tomb of Bu-Ali Shah Qalandar',
        category: 'Spiritual · Islam, 13th-Century Sufi Dargah of the Chisti Saint',
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Dargah Sharif Panipat',
        summary:
          '700-year-old dargah of revered Sufi philosopher Shaikh Sharafuddeen Bu Ali Qalandar, drawing thousands of devotees of all faiths for evening Qawwalis and sacred blessings.',
      },
    ],
  },
];
