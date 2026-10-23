export interface LakshadweepStay {
  name: string;
  category: string;
}

export interface LakshadweepFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface LakshadweepDining {
  veg: LakshadweepFoodSpot[];
  nonVeg: LakshadweepFoodSpot[];
  permitNotice?: string;
  culinaryNote?: string;
}

export interface LakshadweepAttraction {
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

export interface LakshadweepIsland {
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
  topStays: LakshadweepStay[];
  dining: LakshadweepDining;
  attractions: LakshadweepAttraction[];
}

export const LAKSHADWEEP_DIRECTORY: LakshadweepIsland[] = [
  {
    id: "agatti",
    code: "IN-LD-CITY-AGX",
    name: "Agatti Island",
    nickname: "Gateway to Lakshadweep",
    tagline: "7.6 km coral atoll barrier, narrow runway over turquoise sea, glass-bottom boats & turtle coves",
    accentColor: "#0284C7",
    bgGradient: "from-sky-50 via-cyan-50/40 to-stone-50/30",
    coverImage: "/images/lakshadweep/agatti-coral-beach.jpg",
    photoCredit: "Discover Bharat Contributor / Agatti Coral Atoll & White Sand Beach",
    flashcardBlurb:
      "The 'Gateway to Lakshadweep,' featuring a stunning 7.6 km long coral atoll and the archipelago's sole airstrip, surrounded by mesmerizing turquoise lagoons and vibrant marine life.",
    topStays: [
      { name: "Agatti Island Beach Resort (AIBER)", category: "Beachfront Cottages — Lagoon-facing rooms & on-site Scuba Dive Centre" },
      { name: "Sea Shells Beach Resort", category: "Agatti Beach — Eco-friendly wooden cottages with direct reef access" },
      { name: "White Pearl Beach Hotel", category: "Central Atoll — Warm island hospitality, AC family suites & boat transfer desks" },
    ],
    dining: {
      veg: [
        {
          restaurant: "AIBER & Sea Shells Resort Dining Rooms",
          location: "Agatti Island Beachfront",
          specialties: "Simple home-style North and South Indian vegetarian meals: Dal Tadka, Jeera Rice, soft Idlis, Sambar, and crisp Dosas",
        },
      ],
      nonVeg: [
        {
          restaurant: "Local Island Homestays & Resort Dining",
          location: "Agatti Beach Road",
          specialties: "Freshly caught Yellowfin Tuna curries, Malabar-style crispy kingfish fry, and spicy island coconut gravies",
        },
      ],
      permitNotice:
        "All visitors (including Indian domestic tourists) must obtain an official Entry Permit from the Lakshadweep Administration prior to boarding flights or passenger vessels. Foreign travelers are restricted to Agatti, Kadmat, and Bangaram.",
      culinaryNote:
        "Cuisine is centered around fresh ocean catch, notably Yellowfin Tuna and Skipjack, cooked with grated coconut, dried red chilies, and curry leaves in the Malabar tradition. Dedicated pure-vegetarian restaurants are rare outside of resort dining.",
    },
    attractions: [
      {
        id: "IN-LD-AGX-ATT-001",
        name: "Agatti Lagoon & Coral Reefs",
        category: "Nature / Adventure: Beaches, Scuba Diving, Coral Lagoons",
        timings: "06:00–18:00 (Best reef visibility during mid-morning high tide)",
        fee: {
          domestic: "Free (Snorkeling/Glass-bottom boats: ~INR 500–1,500)",
          foreign: "Free (Snorkeling/Glass-bottom boats: ~INR 500–1,500)",
        },
        isHiddenGem: false,
        image: "/images/lakshadweep/agatti-coral-beach.jpg",
        photoCredit: "Discover Bharat Contributor / Agatti Coral Lagoon Coast",
        summary:
          "Crystal-clear shallow lagoons extending over several kilometers, offering world-class snorkeling, sea kayaking, and glass-bottom boat excursions over kaleidoscopic living coral gardens teeming with neon reef fish, stingrays, and sea turtles.",
      },
      {
        id: "IN-LD-AGX-ATT-002",
        name: "Agatti Airport Runway Viewpoint",
        category: "Nature: Engineering Marvels, Coastal Airstrips",
        timings: "Flight arrival/departure windows (~10:00–14:00)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Agatti Coral Runway Oceanic Approach",
        summary:
          "One of the world's most spectacular and picturesque airstrips, built on a narrow sliver of coral atoll with azure oceanic waves lapping within meters on both sides of the tarmac. Landing here is widely hailed as one of aviation's most breathtaking experiences.",
      },
      {
        id: "IN-LD-AGX-GEM-001",
        name: "Kalpitti Island",
        category: "Nature: Beaches, Turtle Sanctuaries, Uninhabited Islets",
        timings: "08:00–17:00 (Accessed via short canoe or kayak ride)",
        fee: {
          domestic: "Canoe / kayak hire ~INR 500",
          foreign: "Canoe / kayak hire ~INR 500",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Kalpitti Island Pristine Shoreline",
        summary:
          "A tiny, uninhabited coral sand cay located at the southern tip of the Agatti barrier reef. Accessible by a leisurely canoe or kayak paddle across placid turquoise shallows, it serves as a critical nesting ground for green sea turtles and hawksbill turtles.",
      },
      {
        id: "IN-LD-AGX-GEM-002",
        name: "Golden Jubilee Museum",
        category: "Heritage: Museums, Maritime & Islamic Antiquities",
        timings: "10:00–17:00 (Closed Fridays)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Lakshadweep Maritime Heritage Gallery",
        summary:
          "The only museum in Lakshadweep, exhibiting traditional Minicoy sailboats (Jahadhoni models), antique Chinese ceramic jars recovered from underwater wrecks, traditional shark-catching harpoons, and centuries-old Islamic calligraphy artifacts.",
      },
    ],
  },
  {
    id: "bangaram",
    code: "IN-LD-CITY-BGM",
    name: "Bangaram Island",
    nickname: "Jewel of the Arabian Sea",
    tagline: "Uninhabited eco-sanctuary, luminescent nocturnal sands, 200-year-old galleon shipwreck & castaway picnics",
    accentColor: "#0D9488",
    bgGradient: "from-teal-50 via-cyan-50/40 to-stone-50/30",
    coverImage: "/images/lakshadweep/bangaram-aerial-lagoon.jpg",
    photoCredit: "Discover Bharat Contributor / Bangaram Island Aerial Lagoon & Reef",
    flashcardBlurb:
      "A teardrop-shaped, uninhabited island serving as Lakshadweep's exclusive eco-resort destination, famous for phosphorescent waters, shipwreck diving, and being the only island where alcohol is permitted.",
    topStays: [
      { name: "Bangaram Island Resort (SPORTS)", category: "Eco-Resort — State-run thatched beach cottages on turquoise shoreline with dive center" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Bangaram Resort Dining Hall (SPORTS)",
          location: "Bangaram Island Resort",
          specialties: "Pre-set Indian and Continental buffet with vegetarian curries, dal tadka, steamed basmati rice, rotis, and pasta",
        },
      ],
      nonVeg: [
        {
          restaurant: "Bangaram Beachside Bar & Grill",
          location: "Bangaram Lagoon Front",
          specialties: "Fresh oceanic catch of the day, grilled yellowfin tuna steaks, squid fry, and Malabar coconut seafood curries; licensed beer and wine service",
        },
      ],
      permitNotice:
        "Bangaram is uninhabited and dedicated exclusively to tourism. It is the only island in the entire Union Territory of Lakshadweep where alcohol is legally permitted for resort guests. Day visits from Agatti require a 45-minute speedboat voyage across the reef.",
      culinaryNote:
        "Dining is buffet-style, coordinated by the Lakshadweep Tourism Development Corporation (SPORTS). Fresh reef fish, yellowfin tuna, and island coconuts form the highlights of the daily kitchen.",
    },
    attractions: [
      {
        id: "IN-LD-BGM-ATT-001",
        name: "Bangaram Beach & Bioluminescence",
        category: "Nature: Beaches, Bioluminescent Seas, Coral Coves",
        timings: "Open 24 hours for resident guests",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "/images/lakshadweep/bangaram-aerial-lagoon.jpg",
        photoCredit: "Discover Bharat Contributor / Aerial View of Bangaram Island Lagoon",
        summary:
          "Pristine white sand beaches fringed by a vast, tranquil lagoon. On moonless nights, the shoreline often sparks with magical electric-blue bioluminescence caused by marine dinoflagellates washing gently across the surf.",
      },
      {
        id: "IN-LD-BGM-ATT-002",
        name: "Princess Royal Shipwreck Dive",
        category: "Adventure: Scuba Diving, Marine Archaeology",
        timings: "Morning dive slots (07:00–12:00 for optimal visibility)",
        fee: {
          domestic: "~INR 4,000–5,000 per dive",
          foreign: "~INR 4,000–5,000 per dive",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Princess Royal Historic Shipwreck Reef",
        summary:
          "A famed 200-year-old sunken British sailing ship lying at a depth of 9 to 30 meters off Bangaram's reef. Now transformed into a thriving artificial coral reef teeming with stingrays, giant trevally, barracuda, and reef sharks.",
      },
      {
        id: "IN-LD-BGM-GEM-001",
        name: "Thinnakara Island",
        category: "Nature / Adventure: Beaches, Castaway Picnics, Turtle Habitats",
        timings: "08:00–17:00 (Reached by 15-min speedboat ride from Bangaram)",
        fee: {
          domestic: "Speedboat transfer ~INR 1,000–1,500",
          foreign: "Speedboat transfer ~INR 1,000–1,500",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Thinnakara Castaway Sandspit",
        summary:
          "A tiny, teardrop-shaped uninhabited sister atoll sharing the same vast lagoon with Bangaram. A favorite for castaway-style day excursions, coconut groves, and snorkeling alongside giant sea turtles grazing in shallow seagrass beds.",
      },
      {
        id: "IN-LD-BGM-GEM-002",
        name: "Parali I & II Sandbanks",
        category: "Nature: Beaches, Marine Ecology, Vanishing Sandbars",
        timings: "Subject to daily tide schedules",
        fee: {
          domestic: "Included in local island hopping boat tours",
          foreign: "Included in local island hopping boat tours",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Parali Tidal Sandbanks",
        summary:
          "Remote, windswept sandbanks situated near Bangaram. Parali I has notably eroded and largely submerged due to sea level shifts, serving as a poignant, living reminder of island vulnerability to global climate change.",
      },
    ],
  },
  {
    id: "kavaratti",
    code: "IN-LD-CITY-KVT",
    name: "Kavaratti",
    nickname: "Capital of the Coral Atolls",
    tagline: "Administrative capital, 17th-century driftwood mosque ceilings, thermal desalination & marine aquariums",
    accentColor: "#059669",
    bgGradient: "from-emerald-50 via-teal-50/40 to-stone-50/30",
    coverImage: "/images/lakshadweep/kavaratti-ujra-mosque.png",
    photoCredit: "Discover Bharat Contributor / Historic Carved Ujra Mosque, Kavaratti",
    flashcardBlurb:
      "The administrative capital of Lakshadweep, boasting the highest percentage of non-forest green canopy, beautifully carved wooden mosques, and the premier marine aquarium.",
    topStays: [
      { name: "Kavaratti Island Beach Resort (SPORTS)", category: "Beachfront Resort — AC/Non-AC tourist cottages operated by Lakshadweep Tourism" },
      { name: "Paradise Hut Eco Resort", category: "Lagoon Road — Traditional thatched palm chalets in peaceful coconut groves" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Cafe de Saina",
          location: "Main Road, Kavaratti",
          specialties: "Vegetarian thalis, flaky Malabar parottas, vegetable biryani, and hot spiced chai",
        },
        {
          restaurant: "Government Canteen & Local Tea Stalls",
          location: "Administrative Zone",
          specialties: "Steaming hot dosas, appam with vegetable stew, and crispy sweet banana fritters (Pazham Pori)",
        },
      ],
      nonVeg: [
        {
          restaurant: "Z Corner",
          location: "Kavaratti Bazaar",
          specialties: "Fiery dry Tuna pepper roast, Malabar chicken curry, and fresh layered Kerala parottas",
        },
        {
          restaurant: "Local Island Diners",
          location: "Near Passenger Jetty",
          specialties: "Steamed rice meals served with spicy fried seer fish, kingfish curry, and tuna pickle",
        },
      ],
      permitNotice:
        "Kavaratti is an inhabited capital island requiring strict entry permits. Foreign nationals are generally not permitted to disembark on Kavaratti unless on official administrative business.",
      culinaryNote:
        "Kavaratti dining combines coastal Malabar flavors with distinct island ingredients. Tuna roasts, coconut-based meat gravies, and rice rotis (Pathiri) are staple culinary traditions.",
    },
    attractions: [
      {
        id: "IN-LD-KVT-ATT-001",
        name: "Ujra Mosque",
        category: "Spiritual / Arts: Islam, Traditional Island Architecture",
        timings: "06:00–20:00 (Modest attire required; prayer intervals observed)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "/images/lakshadweep/kavaratti-ujra-mosque.png",
        photoCredit: "Discover Bharat Contributor / Historic Carved Driftwood Ujra Mosque",
        summary:
          "A revered 17th-century mosque built by Sheikh Mohammad Kasim, famous for an intricately hand-carved floral ceiling sculpted from a single colossal driftwood log. Unique for its lack of traditional minarets, its courtyard houses a miraculous freshwater well.",
      },
      {
        id: "IN-LD-KVT-ATT-002",
        name: "Marine Aquarium & Museum",
        category: "Nature / Heritage: Museums, Marine Ecology",
        timings: "10:00–17:00 (Open all days)",
        fee: {
          domestic: "INR 15",
          foreign: "INR 15",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Kavaratti Marine Aquarium Specimens",
        summary:
          "The premier marine biological center in the territory, featuring living tanks filled with vibrant sea anemones, lionfish, moray eels, and living coral specimens, alongside a massive preserved sperm whale skeleton.",
      },
      {
        id: "IN-LD-KVT-ATT-003",
        name: "Kavaratti Lagoon & Water Sports Centre",
        category: "Adventure / Nature: Scuba Diving, Kayaking, Water Sports",
        timings: "08:00–17:00 (Water activities operate throughout the day)",
        fee: {
          domestic: "Varies by activity (~INR 300–3,500)",
          foreign: "Varies by activity (~INR 300–3,500)",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Kavaratti Lagoon Water Sports",
        summary:
          "A serene, protected lagoon on the western side of the atoll with shallow turquoise waters ideal for kayaking, windsurfing, stand-up paddleboarding, and PADI open-water dive certification courses.",
      },
      {
        id: "IN-LD-KVT-GEM-001",
        name: "Desalination Plant",
        category: "Heritage: Engineering Marvels, Thermal Desalination",
        timings: "09:30–16:00 (Entry requires prior administrative permission)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Kavaratti LTTD Desalination Facility",
        summary:
          "India's pioneering Low-Temperature Thermal Desalination (LTTD) plant, established by the National Institute of Ocean Technology (NIOT). It utilizes the thermal gradient between ocean surface and deep cold water to produce 100,000 liters of pure drinking water daily.",
      },
    ],
  },
  {
    id: "minicoy",
    code: "IN-LD-CITY-MIN",
    name: "Minicoy Island",
    nickname: "The Crescent of Maliku",
    tagline: "Southern outpost, 1885 British lighthouse, Mahl linguistic heritage, traditional Avahs & snake boat regattas",
    accentColor: "#D97706",
    bgGradient: "from-amber-50 via-orange-50/40 to-stone-50/30",
    coverImage: "/images/lakshadweep/minicoy-lighthouse.png",
    photoCredit: "Discover Bharat Contributor / Historic 1885 Minicoy British Lighthouse",
    flashcardBlurb:
      "The southernmost island of the archipelago, culturally distinct from the rest of Lakshadweep due to its Mahl language, Maldivian heritage, and traditional lava dance.",
    topStays: [
      { name: "Minicoy Island Beach Resort (SPORTS)", category: "Eco-Resort — Traditional thatched beach cottages set amidst dense coconut palm groves" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Resort Dining Hall (SPORTS)",
          location: "Minicoy Island Beach Resort",
          specialties: "Limited North and South Indian staples, vegetable pulao, dal fry, curd rice, and freshly rolled chapatis",
        },
      ],
      nonVeg: [
        {
          restaurant: "Traditional Minicoy Resort Dining & Local Homestays",
          location: "Minicoy Island",
          specialties: "Distinctive Mahl cuisine: Mus Kavaab (spiced smoked tuna skewers), Faruhi, Tuna Farata, and coconut jaggery halwa",
        },
      ],
      permitNotice:
        "Minicoy (Maliku) lies 398 km southwest of Kochi and is culturally distinct from northern Lakshadweep islands. Entry permits must specifically list Minicoy, and travel is primarily by government passenger vessels (MV Kavaratti, MV Arabian Sea).",
      culinaryNote:
        "Minicoy's cuisine is deeply Maldivian. The islanders speak Mahl (a dialect of Dhivehi) and specialize in drying and smoking tuna to produce Masmin, seasoned with unique local spices and coconut cream.",
    },
    attractions: [
      {
        id: "IN-LD-MIN-ATT-001",
        name: "Minicoy Lighthouse",
        category: "Heritage / Nature: Historical Monuments, Maritime Beacons",
        timings: "15:00–17:00 (Open to visitors during afternoon hours)",
        fee: {
          domestic: "INR 20",
          foreign: "INR 20",
        },
        isHiddenGem: false,
        image: "/images/lakshadweep/minicoy-lighthouse.png",
        photoCredit: "Discover Bharat Contributor / Historic 1885 Minicoy British Lighthouse",
        summary:
          "An iconic 300-foot (49-meter) towering white masonry lighthouse erected by the British in 1885. Climbing its spiral staircase rewards visitors with panoramic 360-degree vistas across the crescent-shaped island, lagoon, and open Indian Ocean.",
      },
      {
        id: "IN-LD-MIN-ATT-002",
        name: "Traditional Villages (Avah)",
        category: "Rural / Arts: Live Like a Local, Village Culture",
        timings: "Daylight hours (08:00–18:00)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Minicoy Avah Traditional Village Lane",
        summary:
          "The island is partitioned into 11 strictly organized traditional village communes called Avahs, each presided over by an elected village headman (Bodukaaka). Noted for spotless paved streets, colorful painted homes, community houses (Baaru), and the mesmerizing Lava dance.",
      },
      {
        id: "IN-LD-MIN-ATT-003",
        name: "Jahadhoni (Snake Boat) Race",
        category: "Rural / Recreation: Living Traditions, Cultural Regattas",
        timings: "Seasonal festival timings (Eid, Lakshadweep Fest)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Traditional Jahadhoni Racing Canoe",
        summary:
          "Exquisite, hand-crafted wooden longboats called Jahadhoni, brightly painted with intricate Maldivian tribal motifs. Rowed synchronously by dozens of islanders during Eid and community festivals across the sparkling Minicoy lagoon.",
      },
      {
        id: "IN-LD-MIN-GEM-001",
        name: "Viringili (Small Pox Island)",
        category: "Nature / Heritage: Beaches, Coral Islets, Snorkeling",
        timings: "08:00–16:00 (Short boat transfer from Minicoy jetty)",
        fee: {
          domestic: "Local boat transfer ~INR 500",
          foreign: "Local boat transfer ~INR 500",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Viringili Coral Islet Coast",
        summary:
          "A tiny, uninhabited palm-dotted islet perched on the southwestern reef ring. Historically used to quarantine smallpox patients arriving on trading dhows, it has evolved into a secluded snorkeling paradise with virgin coral gardens and reef sharks.",
      },
    ],
  },
];
