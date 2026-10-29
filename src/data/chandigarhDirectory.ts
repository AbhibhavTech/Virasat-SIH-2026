export interface ChandigarhStay {
  name: string;
  category: string;
}

export interface ChandigarhFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface ChandigarhDining {
  veg: ChandigarhFoodSpot[];
  nonVeg: ChandigarhFoodSpot[];
  architectureNote?: string;
  culinaryNote?: string;
}

export interface ChandigarhAttraction {
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

export interface ChandigarhCity {
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
  topStays: ChandigarhStay[];
  dining: ChandigarhDining;
  attractions: ChandigarhAttraction[];
}

export const CHANDIGARH_DIRECTORY: ChandigarhCity[] = [
  {
    id: "chandigarh",
    code: "IN-CH-CITY-CHD",
    name: "Chandigarh (The City Beautiful)",
    nickname: "The City Beautiful",
    tagline: "Le Corbusier's modernist grid, Nek Chand's recycled rock art & Shivalik lake breezes",
    accentColor: "#059669",
    bgGradient: "from-emerald-50 via-teal-50/40 to-stone-50/30",
    coverImage: "/images/chandigarh/chandigarh-rock-garden.png",
    photoCredit: "Discover Bharat Contributor / Nek Chand Rock Garden Ceramic Sculptures",
    flashcardBlurb:
      "India's first planned city, designed by the legendary architect Le Corbusier, celebrated for its urban grid system, modernist brutalist architecture, lush green sectors, and serene artificial lakes.",
    topStays: [
      { name: "The Oberoi Sukhvilas Spa Resort", category: "New Chandigarh Foothills — Ultra-Luxury Forest Oasis & Ayurvedic Wellness" },
      { name: "Hyatt Regency Chandigarh", category: "Industrial Area Phase 1 — Premium Business, Luxury Suites & Alfresco Dining" },
      { name: "JW Marriott Hotel Chandigarh", category: "Sector 35 — Five-Star Central Luxury, Executive Lounge & Rooftop Pool" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Gopal Sweets",
          location: "Sector 8 & Sector 35",
          specialties: "Legendary for golden crisp Chole Bhature, soft Rasmalai, spicy Khasta Kachori, and authentic Indian festive sweets",
        },
        {
          restaurant: "Nik Baker's",
          location: "Sector 9",
          specialties: "Iconic European-style bakery cafe: Belgian chocolate waffles, blueberry cheesecakes, artisanal sandwiches, and barista coffee",
        },
      ],
      nonVeg: [
        {
          restaurant: "The Back Room",
          location: "Sector 17",
          specialties: "Speakeasy lounge atmosphere with craft cocktails, continental tapas, and spiced North Indian non-veg creations",
        },
        {
          restaurant: "Peddlers",
          location: "Sector 35",
          specialties: "Lively British pub ambiance, authentic Butter Chicken, fish fingers, craft beer, and regular live indie music performances",
        },
        {
          restaurant: "Pal Dhaba",
          location: "Sector 28",
          specialties: "Legendary rustic highway-style Mutton Curry, rich Rogan Josh, Dal Makhani, and velvety Butter Chicken with garlic naan",
        },
      ],
      architectureNote:
        "Chandigarh's unique urban master plan, created by Swiss-French master architect Le Corbusier along with Pierre Jeanneret, Jane Drew, and Maxwell Fry, is divided into self-sufficient sectors (each 800m × 1200m) with dedicated green lungs, market plazas, and segregated 7V traffic circulation corridors.",
      culinaryNote:
        "Chandigarh's food culture marries authentic Punjabi rustic hospitality with cosmopolitan cafe culture. From street-side Kulchas and highway-style Dhabas in Sector 28 to refined fine dining in Sector 35, the city offers rich north Indian flavors and contemporary global bistros.",
    },
    attractions: [
      {
        id: "IN-CH-CHD-ATT-001",
        name: "The Rock Garden of Chandigarh",
        category: "Art / Heritage: Sculpture Garden, Folk Art",
        timings: "09:00–19:30 (April–October) / 09:00–18:00 (November–March)",
        fee: {
          domestic: "INR 30",
          foreign: "INR 30",
        },
        isHiddenGem: false,
        image: "/images/chandigarh/chandigarh-rock-garden.png",
        photoCredit: "Discover Bharat Contributor / Nek Chand Rock Garden Mosaic Sculptures",
        summary:
          "A 40-acre visionary folk-art kingdom secretly created by road inspector Nek Chand over decades using urban debris, industrial discard, broken ceramic plates, electrical porcelain sockets, and colorful glass bangles arranged into winding stone canyons, open-air courtyards, and charming humanoid sculptures.",
      },
      {
        id: "IN-CH-CHD-ATT-002",
        name: "Chandigarh Capitol Complex",
        category: "Heritage: UNESCO World Heritage, Brutalist Architecture",
        timings: "09:00–17:00 (Guided tours mandatory; advance online booking required via Tourism Information Centre)",
        fee: {
          domestic: "INR 50",
          foreign: "INR 200",
        },
        isHiddenGem: false,
        image: "/images/chandigarh/chandigarh-capitol-complex.png",
        photoCredit: "Discover Bharat Contributor / Palace of Assembly & Reflecting Pool, Capitol Complex",
        summary:
          "Inscribed as a UNESCO World Heritage site, this monumental 100-acre government enclave represents the crowning pinnacle of Le Corbusier's modernist concrete vision. Comprises the Palace of Assembly with its hyperbolic tower, the High Court, the Secretariat, and the 26-meter Open Hand Monument symbolizing peaceful exchange.",
      },
      {
        id: "IN-CH-CHD-ATT-003",
        name: "Sukhna Lake",
        category: "Nature / Recreation: Rivers & Lakes, Urban Reservoirs",
        timings: "05:00–21:00 (Boating operates 09:00–18:00)",
        fee: {
          domestic: "Free entry (Boating: ~INR 100–300 per boat)",
          foreign: "Free entry (Boating: ~INR 100–300 per boat)",
        },
        isHiddenGem: false,
        image: "/images/chandigarh/chandigarh-sukhna-lake.jpg",
        photoCredit: "Discover Bharat Contributor / Colorful Paddle Boating Promenade at Sukhna Lake",
        summary:
          "A picturesque 3-km long artificial lake created in 1958 at the base of the Shivalik hills by damming the seasonal Sukhna Choe. It serves as Chandigarh's favorite outdoor haven for morning joggers, paddle boating, and seasonal birdwatching for migratory Siberian ducks and cranes.",
      },
      {
        id: "IN-CH-CHD-ATT-004",
        name: "Rose Garden (Zakir Hussain Rose Garden)",
        category: "Nature: Forests & Gardens, Botanical Gardens",
        timings: "06:00–20:00 (Open all days)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Zakir Hussain Rose Garden, Sector 16",
        summary:
          "Asia's largest botanical rose sanctuary, sprawling across 30 landscaped acres in Sector 16. Named after India's third President, it nurtures over 50,000 rose bushes of 1,600 varieties alongside rare medicinal trees, manicured lawns, and musical fountains, culminating in the annual February Rose Festival.",
      },
      {
        id: "IN-CH-CHD-GEM-001",
        name: "Government Museum and Art Gallery",
        category: "Heritage / Arts: Museums, Ancient Sculptures & Miniatures",
        timings: "10:00–16:30 (Closed Mondays and public holidays)",
        fee: {
          domestic: "INR 10",
          foreign: "INR 50",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Gandhara Antiquities Gallery, Sector 10",
        summary:
          "Housed in an exquisite modernist building designed by Le Corbusier in Sector 10. Born from the 1947 partition division of the Lahore Museum collection, it preserves priceless Gandharan Buddhist stone sculptures from the 1st–5th centuries CE, Pahari miniature paintings, and modern masterworks by Jamini Roy and Amrita Sher-Gil.",
      },
      {
        id: "IN-CH-CHD-GEM-002",
        name: "Leisure Valley",
        category: "Nature / Recreation: Forests & Gardens, Linear Green Belt",
        timings: "Open 24 Hours",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Leisure Valley Linear Park Corridor",
        summary:
          "An 8-km continuous linear green corridor conceptualized by Le Corbusier as the pulmonary lungs of the city. Stretching uninterrupted from Sector 1 through Sector 53, it stitches together diverse themed parks including the Bougainvillea Garden, Fragrance Garden, Topiary Park, and Shanti Kunj.",
      },
    ],
  },
];
