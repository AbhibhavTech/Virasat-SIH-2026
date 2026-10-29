export interface DamanDiuStay {
  name: string;
  category: string;
}

export interface DamanDiuFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface DamanDiuDining {
  veg: DamanDiuFoodSpot[];
  nonVeg: DamanDiuFoodSpot[];
  culinaryNote?: string;
  coastalNote?: string;
  tribalNote?: string;
}

export interface DamanDiuAttraction {
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

export interface DamanDiuCity {
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
  topStays: DamanDiuStay[];
  dining: DamanDiuDining;
  attractions: DamanDiuAttraction[];
}

export const DAMAN_DIU_DIRECTORY: DamanDiuCity[] = [
  {
    id: "daman",
    code: "IN-DN-CITY-DMN",
    name: "Daman",
    nickname: "Porto de Damão / Pearl of the Gulf of Khambhat",
    tagline: "Portuguese sea fortresses, Church of Bom Jesus, black-sand beaches & breezy coastal promenades",
    accentColor: "#0D9488",
    bgGradient: "from-teal-50 via-cyan-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Moti_Daman_Fort_Entrance.jpg/1280px-Moti_Daman_Fort_Entrance.jpg",
    photoCredit: "Wikimedia Commons / Moti Daman Fort Gate",
    flashcardBlurb:
      "A coastal enclave on the Gulf of Khambhat featuring distinct Portuguese colonial architecture, historic sea forts, quiet black-sand beaches, and vibrant seaside promenades.",
    topStays: [
      {
        name: "The Deltin Hotel",
        category: "Vapi-Daman Main Road — Five-Star Ultra-Luxury Resort & Grand Casino Haven",
      },
      {
        name: "Cidade de Daman",
        category: "Devka Beach — Premium Beachfront Resort with Swimming Pools & Sunset Lawns",
      },
      {
        name: "Hotel Sovereign",
        category: "Seaface Road — Classic Coastal Comfort Overlooking the Arabian Shoreline",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Pavitra Restaurant",
          location: "Devka Road",
          specialties: "Pure vegetarian North Indian, Gujarati thalis, Dal Bati, and crisp snacks with mint chutney",
        },
      ],
      nonVeg: [
        {
          restaurant: "Mirasol Lake Resort Dining",
          location: "Kadaiya, Daman",
          specialties: "Famous for fresh coastal seafood, crisp Prawns Koliwada, butter garlic crab, and Goan-Portuguese influenced fish curries",
        },
      ],
      culinaryNote:
        "Daman's unique culinary heritage harmonizes Gujarati vegetarian sweets with Portuguese-coastal seafood delights, featuring pomfret, surmai, and solkadhi.",
    },
    attractions: [
      {
        id: "IN-DN-DMN-ATT-001",
        name: "Moti Daman Fort & Church of Bom Jesus",
        category: "Heritage · Palaces & Forts, Christianity & Portuguese Colonial Architecture",
        timings: "08:00–18:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Moti_Daman_Fort_Entrance.jpg/1280px-Moti_Daman_Fort_Entrance.jpg",
        photoCredit: "Wikimedia Commons / Moti Daman Fort Gate",
        summary:
          "Massive 16th-century polygonal Portuguese fortress built in 1559, enclosing a 30,000 sq. meter historic settlement with ten bastions and two sea-facing gateways. Shelters the ornate 1603 Church of Bom Jesus with its exquisite gilded rosewood altarpiece.",
      },
      {
        id: "IN-DN-DMN-ATT-002",
        name: "Devka Beach",
        category: "Nature · Beaches, Sunset Promenades & Amusement Park",
        timings: "Open 24 hours",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Devka_Beach_Daman.jpg/1280px-Devka_Beach_Daman.jpg",
        photoCredit: "Wikimedia Commons / Devka Beach Daman",
        summary:
          "A picturesque rocky shoreline featuring an amusement park area with musical fountains, kid-friendly recreation zones, evening street-food kiosks, and sunset viewing promenades overlooking the Gulf of Khambhat.",
      },
      {
        id: "IN-DN-DMN-ATT-003",
        name: "Jampore Beach",
        category: "Nature / Adventure · Beaches, Dark-sand Palm Groves & Water Sports",
        timings: "Open 24 hours",
        fee: { domestic: "Free (Activities extra)", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Jampore_Beach_Daman.jpg/1280px-Jampore_Beach_Daman.jpg",
        photoCredit: "Wikimedia Commons / Jampore Beach Daman",
        summary:
          "A peaceful, dark-sand palm-fringed beach situated south of Moti Daman, celebrated for its tranquil ambiance, safe shallow swimming during low tide, parasailing, buggy rides, and scenic camel treks along the shoreline.",
      },
      {
        id: "IN-DN-DMN-GEM-001",
        name: "Fort of St. Jerome (Nani Daman Fort)",
        category: "Heritage · Palaces & Forts, 17th-century Riverfront Bastion",
        timings: "08:00–19:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Nani_Daman_Fort_Entrance.jpg/1280px-Nani_Daman_Fort_Entrance.jpg",
        photoCredit: "Wikimedia Commons / Nani Daman Fort Gate",
        summary:
          "A compact, high-walled 17th-century fort built by the Portuguese in 1615, overlooking the Daman Ganga river estuary. Encloses the revered Church of Our Lady of the Sea and an ancient Portuguese cemetery, offering tranquil rampart walks.",
      },
    ],
  },
  {
    id: "diu",
    code: "IN-DN-CITY-DIU",
    name: "Diu",
    nickname: "Ilha de Diu / Isle of Calm",
    tagline: "Dramatic ocean caves, Arabian Sea sea fort bastions, horseshoe beaches & baroque Portuguese churches",
    accentColor: "#0284C7",
    bgGradient: "from-sky-50 via-blue-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Diu_Fort_Lighthouse_and_Bastions.jpg/1280px-Diu_Fort_Lighthouse_and_Bastions.jpg",
    photoCredit: "Wikimedia Commons / Diu Fort Lighthouse & Bastions",
    flashcardBlurb:
      "A serene, picturesque island district off the southern coast of Gujarat, steeped in Portuguese history, featuring dramatic rock caves, sun-drenched beaches, and massive sea forts.",
    topStays: [
      {
        name: "Radisson Blu Resort Diu",
        category: "Nagoa Beach — Five-Star Ultra-Luxury Beachfront with Infinity Ocean Views",
      },
      {
        name: "Hotel Apa Relogio",
        category: "Bunder Road — Portuguese Heritage Boutique Stay with Colonial Arches",
      },
      {
        name: "The Fern Seaside Luxurious Tent Resort",
        category: "Nagoa Beach — Eco-Friendly Glamping Tents Steps from the Surf",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "O Coqueiro",
          location: "Main Town, Diu",
          specialties: "Charming garden restaurant serving multi-cuisine vegetarian pasta, pizzas, Gujarati snacks, and continental salads",
        },
      ],
      nonVeg: [
        {
          restaurant: "Apurva Restaurant",
          location: "Bunder Road",
          specialties: "Celebrated for fresh catch of the day, jumbo butter-garlic prawns, tandoori lobster, and authentic Portuguese-coastal fish curries",
        },
        {
          restaurant: "Night Heron",
          location: "Nagoa Beach Road",
          specialties: "Open-air coastal dining offering spicy seafood sizzlers, calamari rings, and cold beverages",
        },
      ],
      coastalNote:
        "Diu's culinary scene features freshly caught lobster, crab, and kingfish prepared with Portuguese olive oil and Gujarati spices.",
    },
    attractions: [
      {
        id: "IN-DN-DIU-ATT-001",
        name: "Diu Fort",
        category: "Heritage · Palaces & Forts, 16th-century Massive Maritime Citadel",
        timings: "08:00–18:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Diu_Fort_Lighthouse_and_Bastions.jpg/1280px-Diu_Fort_Lighthouse_and_Bastions.jpg",
        photoCredit: "Wikimedia Commons / Diu Fort",
        summary:
          "A colossal seaside defense fortification built in 1535 by the Portuguese, surrounded on three sides by the Arabian Sea and on the fourth by a moat. Boasts massive stone bastions, old cast-iron cannons, a functioning lighthouse, and panoramic ocean views.",
      },
      {
        id: "IN-DN-DIU-ATT-002",
        name: "Nagoa Beach",
        category: "Nature / Adventure · Beaches, Horseshoe Bay & Water Sports",
        timings: "Open 24 hours",
        fee: { domestic: "Free (Activities extra)", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Nagoa_Beach_Diu.jpg/1280px-Nagoa_Beach_Diu.jpg",
        photoCredit: "Wikimedia Commons / Nagoa Beach",
        summary:
          "A world-famous semi-circular horseshoe-shaped white-sand beach lined with rare branching Hoka (Hyphaene thebaica) palm trees native to Africa. Famous for parasailing, jet-skiing, dolphin boat tours, and gentle swimming waters.",
      },
      {
        id: "IN-DN-DIU-ATT-003",
        name: "Naida Caves",
        category: "Nature / Adventure · Geological Caves, Sunlit Rock Tunnels & Labyrinths",
        timings: "07:00–19:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Naida_Caves_Diu.jpg/1280px-Naida_Caves_Diu.jpg",
        photoCredit: "Wikimedia Commons / Naida Caves",
        summary:
          "A mesmerizing subterranean network of carved rock tunnels, staircases, and hollow chambers located just outside Diu Fort. Formed over centuries of geological erosion and Portuguese stone quarrying, creating dramatic skylight photography rays through natural roof openings.",
      },
      {
        id: "IN-DN-DIU-ATT-004",
        name: "Gangeshwar Mahadev Temple",
        category: "Spiritual · Hinduism, Ancient Shoreline Cave Shrine",
        timings: "06:00–20:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Gangeshwar_Temple_Diu.jpg/1280px-Gangeshwar_Temple_Diu.jpg",
        photoCredit: "Wikimedia Commons / Gangeshwar Temple",
        summary:
          "An ancient cave shrine situated on the rocky shoreline of Fudam village. Features five naturally formed Shiva lingas believed to have been established by the Pandava brothers, where the Arabian Sea waves continuously crash over and perform a natural 'abhisheka' during high tide.",
      },
      {
        id: "IN-DN-DIU-GEM-001",
        name: "St. Paul's Church",
        category: "Heritage / Spiritual · Christianity, 17th-century Baroque Architecture",
        timings: "08:00–18:30",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/St._Paul%27s_Church%2C_Diu.jpg/1280px-St._Paul%27s_Church%2C_Diu.jpg",
        photoCredit: "Wikimedia Commons / St. Paul's Church",
        summary:
          "Dedicated to Our Lady of the Immaculate Conception, completed in 1601. A magnificent specimen of Baroque church architecture featuring an ornate white facade, intricate floral wood relief carvings, and volute scrollwork executed by Goan and Portuguese artisans.",
      },
    ],
  },
  {
    id: "silvassa",
    code: "IN-DN-CITY-SLV",
    name: "Silvassa & Dadra",
    nickname: "Forest Garden of the West / Capital of Warli Culture",
    tagline: "Dense tropical forests, Warli tribal art, Vasona lion safaris & Madhuban reservoir waters",
    accentColor: "#15803D",
    bgGradient: "from-emerald-50 via-green-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Vanganga_Lake_Garden_Silvassa.jpg/1280px-Vanganga_Lake_Garden_Silvassa.jpg",
    photoCredit: "Wikimedia Commons / Vanganga Lake Garden",
    flashcardBlurb:
      "The forested inland capital of the union territory, serving as the gateway to tribal Warli culture, serene lakes, sprawling gardens, and wildlife sanctuaries.",
    topStays: [
      {
        name: "The Ras Resorts",
        category: "Silvassa — Luxury Riverside Sanctuary with Landscaped Greenery along the Daman Ganga",
      },
      {
        name: "Khanvel Resort",
        category: "Chauda, Silvassa — Forest Resort Surrounded by Rolling Woods, Cottages & Spa",
      },
      {
        name: "Silvassa Forest Retreat",
        category: "Silvassa — Peaceful Eco-Resort Surrounded by Western Ghats Foothills",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Hotel Woodlands",
          location: "Central Silvassa",
          specialties: "Popular pure vegetarian family dining serving South Indian dosas, idlis, wholesome Gujarati thalis, and Punjabi paneer dishes",
        },
      ],
      nonVeg: [
        {
          restaurant: "Tribal Kitchen Pop-Ups & Resort Dining",
          location: "Silvassa & Dudhani",
          specialties: "Local rustic Maharashtrian and Gujarati influenced country-chicken curry, spicy fish fry, and tandoori meat kebabs",
        },
      ],
      tribalNote:
        "Dadra and Nagar Haveli is home to indigenous Warli, Dhodia, and Kokna tribes, celebrated for rice-flour Warli wall paintings and rustic organic millets.",
    },
    attractions: [
      {
        id: "IN-DN-SLV-ATT-001",
        name: "Vanganga Lake Garden (Dadra Garden)",
        category: "Nature / Recreation · Forests & Gardens, Japanese-style Lake Park",
        timings: "08:00–20:00",
        fee: { domestic: "INR 20", foreign: "INR 20" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Vanganga_Lake_Garden_Silvassa.jpg/1280px-Vanganga_Lake_Garden_Silvassa.jpg",
        photoCredit: "Wikimedia Commons / Vanganga Lake Garden",
        summary:
          "A beautifully landscaped 7.58-hectare Japanese-style island garden set around a central lake in Dadra. Features picturesque wooden arched bridges, jogging pathways, pedal boating, musical fountains, and thatched gazebos.",
      },
      {
        id: "IN-DN-SLV-ATT-002",
        name: "Tribal Cultural Museum",
        category: "Heritage / Arts · Museums, Indigenous Warli Heritage & Artifacts",
        timings: "10:00–17:00 (Closed on Sundays)",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Warli_Art_Painting.jpg/1280px-Warli_Art_Painting.jpg",
        photoCredit: "Wikimedia Commons / Warli Painting Exhibit",
        summary:
          "Located in central Silvassa, this museum showcases the rich heritage of the Warli, Dhodia, and Kokna tribes. Exhibits life-sized tribal dioramas, traditional hunting gears, musical instruments (tarpa), clay masks, and authentic Warli canvas paintings.",
      },
      {
        id: "IN-DN-SLV-ATT-003",
        name: "Vasona Lion Safari Park",
        category: "Nature · Wildlife-Tourism, 20-acre Asiatic Lion Habitat",
        timings: "09:00–17:00 (Closed on Mondays)",
        fee: { domestic: "INR 30 (Dom) / Safari bus ticket extra", foreign: "INR 30" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1280px-Lion_waiting_in_Namibia.jpg",
        photoCredit: "Wikimedia Commons / Asiatic Lion Sanctuary",
        summary:
          "A 20-acre wildlife sanctuary part of the Dadra and Nagar Haveli Wildlife Sanctuary complex. Visitors board net-shielded safari mini-buses to view majestic Asiatic lions roaming in a protected natural forest habitat.",
      },
      {
        id: "IN-DN-SLV-GEM-001",
        name: "Dudhani Lake & Water Sports Complex",
        category: "Nature / Adventure · Rivers & Lakes, 'Kashmir of the West' Reservoir",
        timings: "08:00–18:00",
        fee: { domestic: "Free entry (Water sports/boating extra)", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Madhuban_Dam_Reservoir_Dudhani.jpg/1280px-Madhuban_Dam_Reservoir_Dudhani.jpg",
        photoCredit: "Wikimedia Commons / Dudhani Lake Madhuban Dam",
        summary:
          "A massive freshwater reservoir formed by the Madhuban Dam on the Daman Ganga river, 40 km from Silvassa. Dubbed the 'Kashmir of the West', it offers colorful shikara boat rides, speedboating, jet-skiing, and camping amidst the foothills of the Western Ghats.",
      },
    ],
  },
];
