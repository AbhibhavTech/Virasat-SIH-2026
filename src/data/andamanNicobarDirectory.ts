export interface AndamanStay {
  name: string;
  category: string;
}

export interface AndamanFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface AndamanDining {
  veg: AndamanFoodSpot[];
  nonVeg: AndamanFoodSpot[];
  permitNotice?: string;
  culinaryNote?: string;
}

export interface AndamanAttraction {
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

export interface AndamanDestination {
  id: string;
  code: string;
  name: string;
  officialRenamedName?: string;
  nickname: string;
  tagline: string;
  accentColor: string;
  bgGradient: string;
  flashcardBlurb: string;
  coverImage: string;
  photoCredit: string;
  topStays: AndamanStay[];
  dining: AndamanDining;
  attractions: AndamanAttraction[];
}

export const ANDAMAN_DIRECTORY: AndamanDestination[] = [
  {
    id: "port-blair",
    code: "IN-AN-CITY-IXZ",
    name: "Port Blair / Sri Vijaya Puram",
    officialRenamedName: "Sri Vijaya Puram",
    nickname: "Gateway to the Emerald Archipelago",
    tagline: "Colonial freedom sagas at Cellular Jail, ficus-draped ruins of Ross Island & crescent coral coves",
    accentColor: "#0284C7",
    bgGradient: "from-sky-50 via-cyan-50/40 to-stone-50/30",
    coverImage: "/images/andaman/port-blair-cellular-jail.png",
    photoCredit: "Discover Bharat Contributor / National Memorial Cellular Jail, Sri Vijaya Puram",
    flashcardBlurb:
      "The capital and gateway to the archipelago, featuring a deep colonial past, the poignant Cellular Jail memorial, and access to nearby historic and marine islands.",
    topStays: [
      { name: "Taj Exotica Resort & Spa", category: "Radhanagar / Archipelago Flagship — Quintessential Andaman Ultra-Luxury" },
      { name: "SeaShell Port Blair", category: "Marine Hill — Premium Bay Views, Rooftop Lounge & Harbor Panoramas" },
      { name: "Welcomhotel by ITC Hotels", category: "Bay Island, Marine Hill — Cliffside Overlook & Oceanfront Terraces" },
      { name: "Hotel Sunrise Grand", category: "City Centre — Contemporary Comfort, Family Suites & Tour Desk" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Annapurna Restaurant",
          location: "Aberdeen Bazaar, Port Blair",
          specialties: "Classic pure vegetarian South & North Indian thalis, crisp masala dosas, and filter coffee",
        },
        {
          restaurant: "Kattabomman",
          location: "Aberdeen Bazaar",
          specialties: "Authentic pure veg Tamil tiffin, fluffy idlis, vada sambar, and hot ghee roast dosas",
        },
      ],
      nonVeg: [
        {
          restaurant: "New Lighthouse Restaurant",
          location: "Marina Park, Port Blair",
          specialties: "Freshly caught Andaman lobsters, tandoori crab, garlic butter tiger prawns, and ocean views",
        },
        {
          restaurant: "Sea Dragon Restaurant",
          location: "Marine Hill / Aberdeen Bazaar",
          specialties: "Decadent seafood platters, red snapper curry, butter garlic squid, and island delicacies",
        },
      ],
      permitNotice:
        "Port Blair was officially renamed Sri Vijaya Puram in 2024. Indian nationals do not require travel permits. Foreign visitors no longer require a Restricted Area Permit (RAP) for designated open islands but must possess valid Indian visas and register at immigration counters.",
      culinaryNote:
        "Port Blair is a culinary crossroads where Bengali, Tamil, Telugu, Malayali, and Burmese settlers have merged island traditions. Freshly caught seafood—grouper, snapper, tiger prawns, and mud crabs—is prepared with aromatic coastal coconut curries.",
    },
    attractions: [
      {
        id: "IN-AN-IXZ-ATT-001",
        name: "Cellular Jail (Kala Pani)",
        category: "Heritage: Historical Sites, National Memorials",
        timings: "09:00–12:30 & 13:30–16:45 (Closed Mondays); Light & Sound Show: ~18:00 (Hindi & English)",
        fee: {
          domestic: "INR 30 (Entry) / Light & Sound Show: INR 50–150",
          foreign: "INR 30 (Entry) / Light & Sound Show: INR 50–150",
        },
        isHiddenGem: false,
        image: "/images/andaman/port-blair-cellular-jail.png",
        photoCredit: "Discover Bharat Contributor / National Memorial Cellular Jail Wings",
        summary:
          "The harrowing 1906 colonial prison that housed prominent Indian freedom fighters including Veer Savarkar and Batukeshwar Dutt. Featuring seven radial wings extending from a central watchtower, the complex now stands as a sacred national memorial overlooking the azure waters of the Bay of Bengal.",
      },
      {
        id: "IN-AN-IXZ-ATT-002",
        name: "Ross Island (Netaji Subhash Chandra Bose Island)",
        category: "Heritage / Nature: Colonial Ruins, Historical Islands",
        timings: "08:30–16:00 (Accessed via 15-minute passenger ferry from Aberdeen Water Sports Complex)",
        fee: {
          domestic: "Island Entry: INR 30 (Ferry boat: ~INR 350–500 return)",
          foreign: "Island Entry: INR 30 (Ferry boat: ~INR 350–500 return)",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Ross Island Ficus-Entangled British Ruins",
        summary:
          "The former administrative headquarters of the British penal settlement, once christened the 'Paris of the East'. Today, its colonial ballroom, church, and hospital are romantically reclaimed by massive aerial ficus roots, while tame spotted deer and peafowl roam serenely under tropical breezes.",
      },
      {
        id: "IN-AN-IXZ-ATT-003",
        name: "Corbyn's Cove Beach",
        category: "Nature / Recreation: Coastal Beaches, Water Sports",
        timings: "06:00–18:00 (Water sports operate 09:00–16:30)",
        fee: {
          domestic: "Free (Water sports: jet ski/parasailing ~INR 600–2,500)",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Corbyn's Cove Coconut Palm Coastline",
        summary:
          "A crescent-shaped, palm-fringed sandy bay nestled just 8 km from central Port Blair. The beach features calm turquoise surf, a paved shoreline promenade, bustling seaside snack shacks, jet ski operators, and preserved Japanese World War II bunker pillboxes along the coastal cliffs.",
      },
      {
        id: "IN-AN-IXZ-GEM-001",
        name: "Chidiya Tapu",
        category: "Nature: Forests & Gardens, Avian Sanctuaries, Sunset Points",
        timings: "06:00–18:00 (Sunset golden hour best at 16:30–17:45)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Chidiya Tapu Mangrove Sunset Vantage",
        summary:
          "The iconic 'Bird Island' perched 25 km south of Port Blair on the southern tip of South Andaman Island. Celebrated for dramatic, fiery sunsets dipping behind offshore hills, coastal trekking trails to Munda Pahad, and over 46 species of endemic tropical birds including Andaman woodpeckers and emerald doves.",
      },
      {
        id: "IN-AN-IXZ-GEM-002",
        name: "Mahatma Gandhi Marine National Park, Wandoor",
        category: "Nature: Marine Sanctuaries, Coral Reefs, Glass-Bottom Boating",
        timings: "08:30–14:00 (Closed Mondays; ferry departures early morning from Wandoor Jetty)",
        fee: {
          domestic: "INR 50 (Permit entry) / Boat excursion tickets ~INR 750–1,000",
          foreign: "INR 500 (Foreign permit entry) / Boat excursion ~INR 750–1,000",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Jolly Buoy Island Coral Gardens, Wandoor",
        summary:
          "A protected marine biosphere encompassing 15 unspoilt islands with crystalline shallow waters, mangrove creeks, and vibrant coral banks. Permitted glass-bottom boats ferry visitors to Jolly Buoy or Red Skin Island (opened on rotation) for superlative snorkeling amongst giant sea anemones and clownfish.",
      },
    ],
  },
  {
    id: "havelock-island",
    code: "IN-AN-CITY-HVK",
    name: "Havelock Island / Swaraj Dweep",
    officialRenamedName: "Swaraj Dweep",
    nickname: "Crown Jewel of the Andamans",
    tagline: "Asia's finest white-sand beaches, electric aqua shallows & kaleidoscope coral dive sites",
    accentColor: "#0D9488",
    bgGradient: "from-teal-50 via-cyan-50/40 to-stone-50/30",
    coverImage: "/images/andaman/havelock-radhanagar-beach.jpg",
    photoCredit: "Discover Bharat Contributor / Radhanagar Beach (Beach No. 7), Swaraj Dweep",
    flashcardBlurb:
      "The crown jewel of Andaman tourism, globally renowned for its pristine white-sand beaches, emerald canopy, and world-class scuba diving reefs.",
    topStays: [
      { name: "Taj Exotica Resort & Spa", category: "Radhanagar Beach — 46 Acres of Ultra-Luxury Eco-Villas & Olympic Pool" },
      { name: "Barefoot at Havelock", category: "Radhanagar Beach — Sustainable Rainforest Cottages & Gourmet Dining" },
      { name: "SeaShell Havelock", category: "Govind Nagar Beach — Beachfront Timber Chalets & Scuba Concierge" },
      { name: "Sandyy Wavess Beach Resort", category: "Vijay Nagar Beach — Coconut Grove Cabanas & Private Beach Frontage" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Shakahaar",
          location: "Govind Nagar, Swaraj Dweep",
          specialties: "Pure vegetarian North Indian curries, Gujarati thalis, Dal Baati, and strict Jain preparations",
        },
        {
          restaurant: "Full Moon Cafe",
          location: "Govind Nagar / Beach No. 5",
          specialties: "Cozy beach shack serving wholesome vegan smoothie bowls, falafel platters, pasta, and fresh fruit juices",
        },
      ],
      nonVeg: [
        {
          restaurant: "Something Different (A Beachside Cafe)",
          location: "Beach No. 2, Havelock",
          specialties: "Catch-of-the-day grilled seafood, king prawn sizzlers, thin-crust pizza, with complimentary pickup and drop",
        },
        {
          restaurant: "Squid Restaurant",
          location: "Havelock Village Market",
          specialties: "Budget-friendly authentic island seafood, spicy fried calamari, crab curry, and steamed fish thalis",
        },
      ],
      permitNotice:
        "Havelock Island was renamed Swaraj Dweep in tribute to Netaji Subhash Chandra Bose. Accessible via high-speed luxury catamarans (Makruzz, Nautika, Green Ocean) or government ferries departing Port Blair Haddo Wharf (approx 90–120 minutes journey).",
      culinaryNote:
        "Havelock offers a barefoot bohemian dining scene where travelers dine under candlelit coconut palms. Fresh seafood caught daily by local fishermen is seasoned with fresh lemon grass, garlic, and Andaman black pepper.",
    },
    attractions: [
      {
        id: "IN-AN-HVK-ATT-001",
        name: "Radhanagar Beach (Beach No. 7)",
        category: "Nature: White Sand Beaches, World-Class Sunsets",
        timings: "06:00–17:30 (Swimming strictly prohibited after dusk for maritime safety)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "/images/andaman/havelock-radhanagar-beach.jpg",
        photoCredit: "Discover Bharat Contributor / Sunset Glow at Radhanagar Beach",
        summary:
          "Consistently ranked among the best beaches in Asia and the world by Time Magazine and TripAdvisor. Featuring a two-kilometer crescent of fine white powdery sand, backed by an ancient mahua and rainforest canopy, with turquoise waves transforming into molten gold at sunset.",
      },
      {
        id: "IN-AN-HVK-ATT-002",
        name: "Elephant Beach",
        category: "Adventure / Nature: Coral Reefs, Snorkeling, Water Sports",
        timings: "08:00–15:00 (Reached by 20-min speedboat from Havelock Jetty or a 2-km guided rainforest trek)",
        fee: {
          domestic: "Speedboat return ~INR 1,000 (Snorkeling/Sea Walk ~INR 500–3,500)",
          foreign: "Speedboat return ~INR 1,000",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Elephant Beach Coral Shoals & Snorkel Bays",
        summary:
          "The epicenter of water adventure on Swaraj Dweep. Its shallow fringing reef starts just meters from the shore, making it ideal for snorkeling, helmet sea walking, glass-bottom boat rides, and parasailing over electric-blue shallows teeming with marine life.",
      },
      {
        id: "IN-AN-HVK-ATT-003",
        name: "Kalapathar Beach",
        category: "Nature: Sunrise Beaches, Volcanic Formations",
        timings: "05:00–17:30 (Best experienced at daybreak ~05:00–06:15)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Kalapathar Beach Volcanic Outcrops & Turquoise Seas",
        summary:
          "A stunningly peaceful sunrise haven characterized by dramatic black volcanic rocks scattered along a pristine silvery coastline. Overlooked by towering emerald tropical trees, it provides a quiet, uncommercialized counterpoint to Radhanagar for serene morning strolls.",
      },
      {
        id: "IN-AN-HVK-GEM-001",
        name: "Scuba Diving at Dixon's Pinnacle or Nemo Reef",
        category: "Adventure: PADI Scuba Diving, Pelagic Reefs",
        timings: "Early morning dives (06:00–11:00 for peak water clarity and calm currents)",
        fee: {
          domestic: "~INR 3,500–5,000 per dive (Discover Scuba or PADI certified dives)",
          foreign: "~INR 3,500–5,000 per dive",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Dixon's Pinnacle Pelagic Marine Encounter",
        summary:
          "World-class dive sites catering to novice Discover Scuba divers and seasoned PADI professionals alike. Dixon's Pinnacle features submerged granite pinnacles attracting giant manta rays, barracudas, and reef sharks, while sheltered Nemo Reef boasts anemones, moray eels, and clownfish in shallow turquoise water.",
      },
      {
        id: "IN-AN-HVK-GEM-002",
        name: "Neil's Cove",
        category: "Nature: Secluded Lagoons, Rocky Formations",
        timings: "06:00–17:00 (Accessed via a 10-minute walk north along Radhanagar Beach)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Neil's Cove Hidden Tidal Lagoon",
        summary:
          "A secluded, breathtaking lagoon nestled behind rocky headlands at the far northern bend of Radhanagar Beach. Its glassy, emerald-green inlet reflects lush coastal jungle vines, offering photography lovers complete peace away from day-trippers (swimming restricted due to occasional crocodile advisories).",
      },
    ],
  },
  {
    id: "neil-island",
    code: "IN-AN-CITY-NIL",
    name: "Neil Island / Shaheed Dweep",
    officialRenamedName: "Shaheed Dweep",
    nickname: "Vegetable Bowl of the Andamans",
    tagline: "Tranquil organic farms, prehistoric living coral arches & slow cycling along emerald village lanes",
    accentColor: "#059669",
    bgGradient: "from-emerald-50 via-teal-50/40 to-stone-50/30",
    coverImage: "/images/andaman/neil-island-natural-bridge.jpg",
    photoCredit: "Discover Bharat Contributor / Natural Rock Arch (Howrah Bridge), Shaheed Dweep",
    flashcardBlurb:
      "The laid-back, slow-paced neighbor to Havelock, characterized by flat terrain, rich agricultural lands, and stunning rock formations.",
    topStays: [
      { name: "SeaShell Samssara", category: "Laxmanpur Beach — Ultra-Premium Beachfront Luxury & Infinity Pool" },
      { name: "Summer Sands Beach Resort", category: "Ram Nagar — Sprawling Lagoon Suites & Serene Gardens" },
      { name: "Symphony Summer Sands", category: "Bharatpur Beach Road — Luxury Eco-Friendly Villas & Wellness Spa" },
      { name: "Hotel Neil Banzara", category: "Jetty Road — Friendly Budget-Friendly Stays with Cycle Rentals" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Blue Sea Cafe",
          location: "Near Neil Island Jetty",
          specialties: "Wholesome vegetarian thalis, samosas, dosas, fresh organic vegetable curries, and chai",
        },
        {
          restaurant: "Dugong Restaurant",
          location: "SeaShell Samssara, Laxmanpur",
          specialties: "Upscale dining featuring farm-fresh vegetarian pasta, wok-tossed vegetables, and Indian delicacies",
        },
      ],
      nonVeg: [
        {
          restaurant: "Megha Restaurant",
          location: "Laxmanpur Beach Road",
          specialties: "Legendary island seafood den serving mud crab masala, grilled red snapper, and prawn thalis at honest prices",
        },
      ],
      permitNotice:
        "Neil Island was renamed Shaheed Dweep to honor martyrs of the freedom movement. Connected by private and government catamarans from Port Blair and Havelock. The island's flat topography makes renting a bicycle or scooter the most eco-friendly way to explore.",
      culinaryNote:
        "Nicknamed the 'Vegetable Bowl of the Andamans', Neil produces organic vegetables and fruits that supply Port Blair. Dining is unhurried and farm-to-table, with roadside shacks serving piping hot fish thalis and fresh sweet coconuts.",
    },
    attractions: [
      {
        id: "IN-AN-NIL-ATT-001",
        name: "Laxmanpur Beach",
        category: "Nature: Shell Beaches, Sunset Points",
        timings: "06:00–18:00 (Sunset viewing magical from 16:45–17:45)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Sunset at Laxmanpur Beach Horizon",
        summary:
          "A sweeping triangular tongue of bleached white sand reaching into the Andaman Sea, widely celebrated as the finest sunset vantage point on Shaheed Dweep. Dead coral reefs and exotic seashells line the shoreline, creating breathtaking foreground textures under crimson evening skies.",
      },
      {
        id: "IN-AN-NIL-ATT-002",
        name: "Bharatpur Beach",
        category: "Nature / Adventure: Swimming Lagoons, Coral Snorkeling",
        timings: "08:00–17:00 (Ideal swimming at high and mid tides)",
        fee: {
          domestic: "Free (Water sports & glass-bottom boats: ~INR 500–1,500)",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Bharatpur Beach Turquoise Swimming Reefs",
        summary:
          "The only beach on Shaheed Dweep with calm, coral-free sandy shallows safely suited for leisurely swimming and family wading. Glass-bottom boats and snorkelers drift right off the jetty over vibrant colonies of staghorn corals, brain corals, and neon damsel fish.",
      },
      {
        id: "IN-AN-NIL-ATT-003",
        name: "Natural Bridge (Howrah Bridge)",
        category: "Nature: Geological Formations, Living Coral Arch",
        timings: "Varies daily strictly based on low tide (Accessible only during low tide window; local guide recommended)",
        fee: {
          domestic: "Free (Local reef guide: ~INR 300–500 optional)",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "/images/andaman/neil-island-natural-bridge.jpg",
        photoCredit: "Discover Bharat Contributor / Natural Living Coral Arch at Low Tide",
        summary:
          "A massive natural rock arch formed over centuries of persistent tidal erosion through living limestone and coral bedrock. The trek along the exposed intertidal reef flat during low tide reveals sea cucumbers, brittle stars, live brain corals, and tiny octopus residing in clear rock pools.",
      },
      {
        id: "IN-AN-NIL-GEM-001",
        name: "Sitapur Beach",
        category: "Nature: Sunrise Beaches, Limestone Formations",
        timings: "05:00–17:00 (Best at sunrise between 04:45–05:45)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Sitapur Sunrise Beach & Cliffside Coves",
        summary:
          "Known affectionately as 'Beach No. 5' or Sunrise Beach, situated at the quiet eastern tip of Neil Island. Framed by steep limestone cliffs and lush foliage, it experiences high tidal swells and offers completely uninterrupted, contemplative dawn views over the Bay of Bengal.",
      },
    ],
  },
  {
    id: "baratang-island",
    code: "IN-AN-CITY-BRT",
    name: "Baratang Island",
    officialRenamedName: "Baratang Island",
    nickname: "Gateway to the Northern Wilderness",
    tagline: "Dense Jarawa rainforest convoys, mangrove tunnel speedboats & bubbling mud volcanoes",
    accentColor: "#D97706",
    bgGradient: "from-amber-50 via-orange-50/40 to-stone-50/30",
    coverImage: "/images/andaman/baratang-limestone-caves.jpg",
    photoCredit: "Discover Bharat Contributor / Baratang Limestone Cave Stalactite Formations",
    flashcardBlurb:
      "A thrilling nature adventure located 100 km from Port Blair, accessed via a timed military convoy through the dense Jarawa Tribal Reserve, famous for limestone caves and mud volcanoes.",
    topStays: [
      { name: "Dew Dale Resort", category: "Sundergarh, Baratang — Eco-resort Surrounded by Rural Plantations & Orchards" },
      { name: "Coral Creek Resort", category: "Near Baratang Jetty — Eco-lodge with River Views & Local Jungle Fare" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Baratang Jetty Local Dhabas",
          location: "Baratang Jetty Area",
          specialties: "Simple hot vegetarian meals, steamed rice, dal fry, potato sabzi, and hot milk tea",
        },
      ],
      nonVeg: [
        {
          restaurant: "Baratang Jetty Seafood Stalls",
          location: "Baratang Jetty",
          specialties: "Freshly caught local river and sea fish fry, egg curry, and rice thalis",
        },
        {
          restaurant: "Port Blair Pre-packed Breakfast Boxes",
          location: "Essential Travel Tip",
          specialties: "Travellers are strongly advised to carry packed breakfast boxes and mineral water arranged through their Port Blair hotel prior to early 03:30 AM departure",
        },
      ],
      permitNotice:
        "Travel to Baratang is strictly regulated. Vehicles assemble at Jirkatang checkpost and travel through the Jarawa Tribal Reserve only in official timed convoys. Stopping, filming, photographing, or interacting with the Jarawa indigenous community is illegal and severely punishable under Indian law.",
      culinaryNote:
        "Dining options on Baratang Island are basic and utilitarian. The day excursion entails 12–15 hours of travel, making pre-packed sandwiches, fresh fruit, and adequate hydration essential gear for all travelers.",
    },
    attractions: [
      {
        id: "IN-AN-BRT-ATT-001",
        name: "Jarawa Tribal Reserve Convoy Route",
        category: "Nature / Rural: Tropical Rainforests, Indigenous Sanctuaries",
        timings: "Convoys depart Jirkatang checkpost at strict slots: 06:00, 09:00, 12:00, and 15:00",
        fee: {
          domestic: "Included in cab/tour bookings (Private vehicle from Port Blair ~INR 3,500–4,500)",
          foreign: "Included in cab/tour bookings (Passport & visa registration required)",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Andaman Trunk Road (NH-4) Dense Rainforest Corridor",
        summary:
          "An enforced convoy transit along the Andaman Trunk Road traversing pristine tropical rainforest that has sheltered the nomadic Jarawa tribe for over 50,000 years. Vehicles drive with rolled-up windows under security escort; zero stopping, photography, or communication is permitted under strict penal statutes.",
      },
      {
        id: "IN-AN-BRT-ATT-002",
        name: "Baratang Limestone Caves",
        category: "Nature / Adventure: Geological Caves, Mangrove Creeks",
        timings: "08:00–15:00 (Speedboat through mangrove creeks followed by 1.5 km scenic forest trek)",
        fee: {
          domestic: "Speedboat & forest guide fees apply (~INR 800–1,000 per person)",
          foreign: "Speedboat & forest guide fees apply (~INR 800–1,000 per person)",
        },
        isHiddenGem: false,
        image: "/images/andaman/baratang-limestone-caves.jpg",
        photoCredit: "Discover Bharat Contributor / Natural Stalactites in Baratang Limestone Caves",
        summary:
          "A stunning geological wonder millions of years in the making. Reached after navigating a twisting canopy of dense mangrove creeks on speedboats and trekking through rural plantations, these sedimentary caverns feature spectacular stalactite and stalagmite formations continually evolving with mineral deposits.",
      },
      {
        id: "IN-AN-BRT-ATT-003",
        name: "Mud Volcano",
        category: "Nature: Geological Formations, Mud Volcano Craters",
        timings: "08:00–15:00 (Short jeep/tempo ride from Baratang Jetty)",
        fee: {
          domestic: "Free (Local shared jeep fare: ~INR 50–100)",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Baratang Active Mud Volcano Mounds",
        summary:
          "One of the very few accessible mud volcanoes in South Asia, created by the underground ejection of methane gases and subterranean slurry. Visitors can observe small crater-like mounds bubbling grey mud, signifying deep tectonic activity along the active Burma-Sunda subduction plate.",
      },
      {
        id: "IN-AN-BRT-GEM-001",
        name: "Parrot Island",
        category: "Nature: Wildlife-Tourism, Mangrove Sanctuaries, Sunset Birdwatching",
        timings: "Sunset window (17:00–18:15; requires overnight stay in Baratang)",
        fee: {
          domestic: "Private boat hire ~INR 2,000–2,500 per boat",
          foreign: "Private boat hire ~INR 2,000–2,500 per boat",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Discover Bharat Archive / Parrot Island Mangrove Evening Roost",
        summary:
          "A tiny uninhabited mangrove island located 30 km by boat from Baratang Jetty. Every evening at sunset, thousands of parakeets and parrots converge from across the archipelago in a dramatic, noisy aerial spectacle to roost together among the mangrove trees.",
      },
    ],
  },
];
