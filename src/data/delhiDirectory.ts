export interface DelhiStay {
  name: string;
  category: string;
}

export interface DelhiFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface DelhiDining {
  veg: DelhiFoodSpot[];
  nonVeg: DelhiFoodSpot[];
  peacefulNote?: string;
}

export interface DelhiAttraction {
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

export interface DelhiCity {
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
  topStays: DelhiStay[];
  dining: DelhiDining;
  attractions: DelhiAttraction[];
}

export const DELHI_DIRECTORY: DelhiCity[] = [
  {
    id: 'south-east-delhi',
    code: 'IN-DL-CITY-SED',
    name: 'South-East Delhi (Tughlaqabad & Okhla)',
    nickname: 'The Fortress & Wetlands Expanse',
    tagline: 'Rugged 14th-century Tughlaq fortifications, Yamuna floodplains & ecological bird sanctuary',
    accentColor: '#854D0E',
    bgGradient: 'from-amber-50 via-stone-50/40 to-emerald-50/30',
    coverImage: '/images/delhi/tughlaq-tomb.png',
    photoCredit: "User Photo / Ghiyas-ud-din Tughlaq's Tomb",
    flashcardBlurb:
      "The rugged southern expanse holding the monumental 14th-century ruins of Ghiyas-ud-din Tughlaq's fortress city and vibrant ecological wetlands along the Yamuna riverbed.",
    topStays: [
      { name: 'Crowne Plaza Today New Delhi Okhla', category: 'Luxury Business & Leisure' },
      { name: 'The Suryaa New Delhi', category: 'New Friends Colony — 5-Star Heritage Hotel' },
    ],
    dining: {
      veg: [
        { restaurant: "Govinda's", location: 'ISKCON, East of Kailash', specialties: 'Pure vegetarian satvik buffet' },
        { restaurant: 'Sagar Ratna', location: 'New Friends Colony', specialties: 'Classic South Indian dosas, idlis and filter coffee' },
      ],
      nonVeg: [
        { restaurant: 'Copper Chimney', location: 'Jasola', specialties: 'North Indian kebabs and curries' },
        { restaurant: 'Al-Bek', location: 'New Friends Colony', specialties: 'Mughlai shawarmas, kathi rolls, and tandoori chicken' },
      ],
      peacefulNote: 'South-East Delhi balances the rugged Sultanate stone history of Tughlaqabad with peaceful wetland birdwatching and authentic Mughlai savouries.',
    },
    attractions: [
      {
        id: 'IN-DL-SED-ATT-001',
        name: 'Tughlaqabad Fort',
        category: 'Heritage: Palaces & Forts',
        timings: '07:00–17:00',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: '/images/delhi/tughlaq-tomb.png',
        photoCredit: 'User Photo / Tughlaqabad Fort & Tomb',
        summary:
          'Massive 14th-century ruined fortified city built with sloping stone monoliths and cyclopean walls.',
      },
      {
        id: 'IN-DL-SED-ATT-002',
        name: 'Okhla Bird Sanctuary',
        category: 'Nature: Wildlife-Tourism, Wetlands & Birdwatching',
        timings: '07:30–17:00',
        fee: { domestic: 'INR 30', foreign: 'INR 350' },
        isHiddenGem: false,
        image: '/images/delhi/okhla-bird-sanctuary.png',
        photoCredit: 'User Photo / Okhla Bird Sanctuary Migratory Geese',
        summary:
          'A 4-sq-km sanctuary at the Okhla barrage hosting over 300 species of migratory and resident birds.',
      },
      {
        id: 'IN-DL-SED-GEM-001',
        name: "Ghiyas-ud-din Tughlaq's Tomb",
        category: 'Heritage: Monuments',
        timings: '07:00–17:00',
        fee: { domestic: 'Covered in fort entry', foreign: 'Covered in fort entry' },
        isHiddenGem: true,
        image: '/images/delhi/tughlaq-tomb.png',
        photoCredit: "User Photo / Ghiyas-ud-din Tughlaq's Tomb",
        summary:
          'Fortified marble-domed mausoleum connected to the main fort via a causeway over a former water reservoir.',
      },
    ],
  },
  {
    id: 'south-west-delhi',
    code: 'IN-DL-CITY-SWD',
    name: 'South-West Delhi (Dwarka & Aerocity)',
    nickname: 'The Modern Gateway & Aerocity Hub',
    tagline: 'Ultra-modern hospitality, sub-city boulevards, transit connectivity & grand spiritual landmarks',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-50 via-indigo-50/30 to-stone-50/20',
    coverImage: '/images/delhi/iskcon-dwarka.png',
    photoCredit: 'User Photo / ISKCON Temple Dwarka',
    flashcardBlurb:
      'The ultra-modern gateway district anchored by luxury transit hospitality, expansive residential sectors, and grand spiritual landmarks.',
    topStays: [
      { name: 'JW Marriott Hotel New Delhi Aerocity', category: 'Aerocity — Ultra-Luxury Transit Oasis' },
      { name: 'Roseate House New Delhi', category: 'Aerocity — Contemporary Luxury Hotel' },
      { name: 'Welcomhotel by ITC Hotels Dwarka', category: 'Sector 10 Dwarka — 5-Star Comfort' },
    ],
    dining: {
      veg: [
        { restaurant: "Govinda's", location: 'ISKCON Dwarka Sector 13', specialties: 'Pure vegetarian dining and bakery' },
        { restaurant: "Haldiram's", location: 'Sector 6 Dwarka', specialties: 'Pure veg Indian snacks, raj kachori & thalis' },
      ],
      nonVeg: [
        { restaurant: 'K3', location: 'JW Marriott Aerocity', specialties: 'Multi-cuisine live cooking stations' },
        { restaurant: 'Honk', location: 'Pullman New Delhi Aerocity', specialties: 'Pan-Asian fine dining' },
      ],
      peacefulNote: 'Aerocity and Dwarka connect world-class international dining and upscale airport transit hospitality with serene temple sanctums.',
    },
    attractions: [
      {
        id: 'IN-DL-SWD-ATT-001',
        name: 'ISKCON Temple Dwarka',
        category: 'Spiritual: Hinduism',
        timings: '04:30–12:30 & 16:00–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/delhi/iskcon-dwarka.png',
        photoCredit: 'User Photo / ISKCON Temple Dwarka',
        summary:
          'Magnificent spiritual complex featuring cultural galleries, automated darshan exhibits, and a large prayer hall.',
      },
      {
        id: 'IN-DL-SWD-GEM-001',
        name: 'Dada Boudhi Temple & Heritage Wells',
        category: 'Heritage / Spiritual: Historical Sites',
        timings: 'Daylight hours (06:00–18:30)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary:
          'Ancient village shrines and rural pockets preserved amidst modern urban planning.',
      },
    ],
  },
  {
    id: 'west-delhi',
    code: 'IN-DL-CITY-WST',
    name: 'West Delhi (Rajouri Garden & Janakpuri)',
    nickname: 'The Punjabi Culinary & Shopping Epicenter',
    tagline: 'High-street fashion, open-air artisan bazaars, wedding couture & legendary Tandoori culture',
    accentColor: '#E11D48',
    bgGradient: 'from-rose-50 via-amber-50/40 to-stone-50/20',
    coverImage: '/images/delhi/dilli-haat-janakpuri.png',
    photoCredit: 'User Photo / Dilli Haat Janakpuri Aerial View',
    flashcardBlurb:
      'The bustling commercial and cultural epicenter of West Delhi, famous for high-end fashion markets, vibrant Punjabi food culture, and community arts hubs.',
    topStays: [
      { name: 'Radisson Blu Hotel New Delhi Paschim Vihar', category: '5-Star Luxury' },
      { name: 'Taj Vivanta', category: 'Dwarka / West Delhi Border — Luxury Stay' },
    ],
    dining: {
      veg: [
        { restaurant: 'Rajinder Da Dhaba', location: 'Naraina', specialties: 'Legendary Galouti kebabs and butter chicken gravies (veg/non-veg)' },
        { restaurant: 'BTW (Bittoo Tikki Wala)', location: 'Rajouri Garden', specialties: 'Chhole Bhature, crispy Aloo Tikki and street chaat' },
      ],
      nonVeg: [
        { restaurant: 'Aslam Chicken', location: 'Rajouri Garden branch', specialties: 'Butter-drenched roasted tandoori chicken' },
        { restaurant: 'Artinci & Local Tandoori Specialists', location: 'Rajouri Garden Market', specialties: 'Kebabs, butter chicken, and tandoori breads' },
      ],
      peacefulNote: 'West Delhi is famous for its warm Punjabi hospitality, bustling late-night street food markets, and traditional Afghan bakeries.',
    },
    attractions: [
      {
        id: 'IN-DL-WST-ATT-001',
        name: 'Dilli Haat Janakpuri',
        category: 'Arts / Rural: Crafts-Tourism',
        timings: '10:00–22:00',
        fee: { domestic: 'INR 30', foreign: 'INR 100' },
        isHiddenGem: false,
        image: '/images/delhi/dilli-haat-janakpuri.png',
        photoCredit: 'User Photo / Dilli Haat Janakpuri Aerial View',
        summary:
          'Cultural open-air plaza showcasing traditional Indian handicrafts, handlooms, and regional food stalls.',
      },
      {
        id: 'IN-DL-WST-ATT-002',
        name: 'Rajouri Garden Main Market',
        category: 'Rural / Recreation: Bazaars',
        timings: '11:00–21:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary:
          'Bustling retail shopping hub packed with ethnic wear, jewelry, and legendary Punjabi food joints.',
      },
      {
        id: 'IN-DL-WST-GEM-001',
        name: 'Tilak Nagar Bazaars',
        category: 'Rural / Arts: Live Like a Local',
        timings: '10:00–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary:
          'Vibrant market famous for authentic Afghan bakeries, dry fruits, and traditional Punjabi street snacks.',
      },
    ],
  },
  {
    id: 'north-west-delhi',
    code: 'IN-DL-CITY-NWD',
    name: 'North-West Delhi (Rohini & Pitampura)',
    nickname: 'The Planned Parkland & Recreational District',
    tagline: 'Urban lakes, expansive Japanese-style parklands, craft villages & thrilling amusement lagoons',
    accentColor: '#059669',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/20',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Dilli_Haat_Pitampura.jpg/1280px-Dilli_Haat_Pitampura.jpg',
    photoCredit: 'Wikimedia Commons / Dilli Haat Pitampura',
    flashcardBlurb:
      'A sprawling planned urban residential and recreational zone featuring large green parks, shopping complexes, and the iconic Dilli Haat Pitampura.',
    topStays: [
      { name: 'Crowne Plaza Today Rohini', category: 'Sector 10 Rohini — 5-Star Hotel with Waterpark Access' },
      { name: 'Hotel Crowne Residency', category: 'Pitampura — Contemporary Comfort' },
    ],
    dining: {
      veg: [
        { restaurant: 'The Tikka Town', location: 'Rohini', specialties: 'Pure vegetarian North Indian chaat, tikkas and platters' },
        { restaurant: 'Local Sweet Houses', location: 'Sector 7 Rohini', specialties: 'Jalebi, samosas, dhokla, and regional sweets' },
      ],
      nonVeg: [
        { restaurant: 'Barbeque Nation', location: 'Pitampura', specialties: 'Live table grill skewers, buffet & kebabs' },
        { restaurant: 'Local North Indian Diners', location: 'Rohini & Pitampura', specialties: 'Butter chicken, rolls, and tandoori platters' },
      ],
      peacefulNote: 'North-West Delhi features spacious lakeside green expanses, vibrant shopping complexes, and family entertainment centers.',
    },
    attractions: [
      {
        id: 'IN-DL-NWD-ATT-001',
        name: 'Swarna Jayanti Park (Japanese Park)',
        category: 'Nature / Recreation: Forests & Gardens',
        timings: '05:00–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Swarna_Jayanti_Park_Rohini.jpg/1280px-Swarna_Jayanti_Park_Rohini.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '250-acre landscaped park featuring lakes, walking tracks, and children\'s play areas.',
      },
      {
        id: 'IN-DL-NWD-ATT-002',
        name: 'Dilli Haat Pitampura',
        category: 'Arts / Heritage: Crafts-Tourism',
        timings: '10:00–22:00',
        fee: { domestic: 'INR 30', foreign: 'INR 30' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Dilli_Haat_Pitampura.jpg/1280px-Dilli_Haat_Pitampura.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Air-conditioned craft galleries and open-air amphitheater celebrating Indian folk arts and cuisine.',
      },
      {
        id: 'IN-DL-NWD-GEM-001',
        name: 'Adventure Island, Rohini',
        category: 'Recreation / Adventure: Amusement Park',
        timings: '11:00–19:00',
        fee: { domestic: 'Ride packages ~INR 600–900', foreign: 'Ride packages ~INR 600–900' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Adventure_Island_Rohini.jpg/1280px-Adventure_Island_Rohini.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Popular amusement and water park spanning 62 acres with thrilling rides and artificial lagoons.',
      },
    ],
  },
];
