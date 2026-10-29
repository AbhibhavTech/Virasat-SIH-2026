export interface PuducherryStay {
  name: string;
  category: string;
}

export interface PuducherryFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface PuducherryDining {
  veg: PuducherryFoodSpot[];
  nonVeg: PuducherryFoodSpot[];
  frenchNote?: string;
  aurovilleNote?: string;
  coastalNote?: string;
  tamilNote?: string;
}

export interface PuducherryAttraction {
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

export interface PuducherryCity {
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
  topStays: PuducherryStay[];
  dining: PuducherryDining;
  attractions: PuducherryAttraction[];
}

export const PUDUCHERRY_DIRECTORY: PuducherryCity[] = [
  {
    id: "white-town",
    code: "IN-PY-CITY-WHT",
    name: "White Town & Promenade Beach",
    nickname: "Quartier Français / French Quarter",
    tagline: "Mustard-yellow colonial villas, bougainvillea lanes, seaside promenade & French-Creole bistros",
    accentColor: "#EAB308",
    bgGradient: "from-amber-50 via-yellow-50/40 to-stone-50/30",
    coverImage: "/images/puducherry/puducherry-white-town.jpg",
    photoCredit: "Discover Bharat Contributor / French Quarter Colonial Street",
    flashcardBlurb:
      "The historic French Quarter characterized by mustard-yellow colonial villas, grid-iron streets lined with bougainvillea, chic cafes, and a breezy rocky promenade along the Bay of Bengal.",
    topStays: [
      {
        name: "Palais de Mahé",
        category: "CGH Earth — Heritage Luxury Boutique Hotel Steps from the Promenade",
      },
      {
        name: "Villa Shanti",
        category: "Rue Suffren — Restored 19th-Century Townhouse Boutique Hotel & Courtyard",
      },
      {
        name: "Le Dupleix",
        category: "Rue de La Bourdonnais — Historic French Governor's Residence with Woodwork",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Cafe des Arts",
          location: "Rue Suffren",
          specialties: "Artisanal French crepes, waffles, organic salads, and vegetarian baguettes in a bohemian yellow courtyard",
        },
        {
          restaurant: "Baker Street",
          location: "Bussy Street",
          specialties: "Authentic French bakery renowned for buttery croissants, quiches, eclairs, macarons, and sourdough bread",
        },
      ],
      nonVeg: [
        {
          restaurant: "Villa Shanti Restaurant",
          location: "Rue Suffren",
          specialties: "Contemporary Franco-Indian fine dining featuring crispy pork belly, saffron seafood risotto, and coastal fish curries",
        },
        {
          restaurant: "Carte Blanche",
          location: "Hotel de L'Orient, Rue Romain Rolland",
          specialties: "Puducherry Creole cuisine blending authentic Tamil spices with classic French culinary sauces",
        },
      ],
      frenchNote:
        "White Town's cuisine celebrates French-Creole fusion, where coconut-based coastal Tamil curries meet bouillabaisse, ratatouille, and freshly baked baguettes.",
    },
    attractions: [
      {
        id: "IN-PY-WHT-ATT-001",
        name: "Promenade Beach (Rock Beach)",
        category: "Nature / Recreation · Beaches, Seaside Esplanade & Colonial Boulevard",
        timings: "Open 24 hours (Vehicle ban: 17:30–05:00)",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "/images/puducherry/puducherry-promenade-beach.jpg",
        photoCredit: "Discover Bharat Contributor / Promenade Beach & Goubert Avenue",
        summary:
          "A 1.5-km long coastal boulevard along Goubert Avenue, closed to motor vehicles every evening. Lined with black volcanic rock barriers, the 4-meter bronze Mahatma Gandhi Statue, the French War Memorial, and the Old Light House overlooking the Bay of Bengal.",
      },
      {
        id: "IN-PY-WHT-ATT-002",
        name: "Basilica of the Sacred Heart of Jesus",
        category: "Spiritual / Heritage · Christianity, 1908 Neo-Gothic Basilica",
        timings: "07:00–18:30",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Sacred_Heart_Church_Pondicherry.jpg/1280px-Sacred_Heart_Church_Pondicherry.jpg",
        photoCredit: "Wikimedia Commons / Sacred Heart Church",
        summary:
          "Erected in 1908 by French missionaries, this stunning basilica is a masterpiece of Neo-Gothic architecture. Features soaring twin bell towers, corinthian columns, and 28 rare stained-glass panels depicting the life of Jesus Christ.",
      },
      {
        id: "IN-PY-WHT-ATT-003",
        name: "French War Memorial",
        category: "Heritage · Monuments, WWI Memorial on Goubert Avenue",
        timings: "10:00–17:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/French_War_Memorial_Pondicherry.jpg/1280px-French_War_Memorial_Pondicherry.jpg",
        photoCredit: "Wikimedia Commons / French War Memorial",
        summary:
          "A solemn memorial erected in 1971 opposite the Gandhi statue, dedicated to the soldiers of French India who sacrificed their lives in World War I. Beautifully illuminated during the annual Bastille Day commemoration on 14th July.",
      },
      {
        id: "IN-PY-WHT-GEM-001",
        name: "Goubert Avenue Sunrise Point",
        category: "Nature · Beaches, Early Morning Golden Hour Coastal Vista",
        timings: "Dawn (05:30–06:30)",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "/images/puducherry/puducherry-promenade-beach.jpg",
        photoCredit: "Discover Bharat Contributor / Goubert Avenue Coast",
        summary:
          "The premier dawn vantage point along the vehicle-free promenade where visitors gather to watch the sun rise out of the Bay of Bengal, casting crimson and gold reflections over the crashing shoreline boulders.",
      },
      {
        id: "IN-PY-WHT-GEM-002",
        name: "French Consulate General & Heritage Walk",
        category: "Heritage · Historical Buildings, 18th-century French Colonial Enclave",
        timings: "Daylight hours",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "/images/puducherry/puducherry-white-town.jpg",
        photoCredit: "Discover Bharat Contributor / French Quarter Villas",
        summary:
          "An atmospheric self-guided architectural stroll through Rue Romain Rolland, Rue Dumas, and Rue Suffren. Showcases original French street name plaques, high compound walls, wooden louvered shutters, and private colonial courtyards.",
      },
    ],
  },
  {
    id: "auroville",
    code: "IN-PY-CITY-AUV",
    name: "Auroville",
    nickname: "City of Dawn / Universal Township",
    tagline: "Golden geodesic Matrimandir, human unity, sustainable permaculture & international crafts",
    accentColor: "#F59E0B",
    bgGradient: "from-amber-50 via-orange-50/40 to-stone-50/30",
    coverImage: "/images/puducherry/puducherry-matrimandir-auroville.png",
    photoCredit: "Discover Bharat Contributor / Matrimandir Golden Sphere",
    flashcardBlurb:
      "An experimental universal township founded in 1968 dedicated to human unity, sustainable living, alternative architecture, and spiritual growth, centered around the iconic Matrimandir.",
    topStays: [
      {
        name: "Dune Eco Village & Spa",
        category: "Keelputtapet — 35-Acre Eco-Luxury Beachfront Resort with Ayurvedic Wellness",
      },
      {
        name: "Auroville Guest Houses",
        category: "Township Perimeter — Tranquil Community Cottages Amid Forest Sanctuaries",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Solar Kitchen",
          location: "Crown Road, Auroville",
          specialties: "Communal organic vegetarian dining powered by a massive rooftop solar concentrator, serving farm-fresh grains and produce",
        },
        {
          restaurant: "Tanto Pizzeria",
          location: "Kuilapalayam, Auroville Road",
          specialties: "Authentic Italian wood-fired pizzas with farm herbs, homemade pasta, iced teas, and artisanal gelato",
        },
      ],
      nonVeg: [
        {
          restaurant: "Right Path Cafe",
          location: "Auroville Visitors Centre",
          specialties: "Healthy global fusion plates, organic grilled chicken, fresh local fish, sourdough sandwiches, and fresh juices",
        },
      ],
      aurovilleNote:
        "Auroville champions organic farm-to-table cuisine, dairy-free vegan alternatives, spirulina products, and handmade sourdough bakery items.",
    },
    attractions: [
      {
        id: "IN-PY-AUV-ATT-001",
        name: "Matrimandir Viewing Point",
        category: "Spiritual / Architecture · Landmarks, Iconic Golden Geodesic Sphere",
        timings: "Visitor Centre 09:00–17:30 (Viewing passes issued on-site; inner chamber requires advance booking)",
        fee: { domestic: "Free (Pass required)", foreign: "Free" },
        isHiddenGem: false,
        image: "/images/puducherry/puducherry-matrimandir-auroville.png",
        photoCredit: "Discover Bharat Contributor / Matrimandir Golden Geodesic Sphere",
        summary:
          "The spiritual heart of Auroville—a colossal 36-meter golden geodesic dome clad in gold-plated stainless steel discs. Set within peaceful botanical gardens, the inner chamber houses the world's largest optically-pure glass crystal ball for silent concentration.",
      },
      {
        id: "IN-PY-AUV-ATT-002",
        name: "Auroville Visitors Centre",
        category: "Arts / Rural · Crafts-Tourism, Eco-Architecture & Sustainable Innovations",
        timings: "09:00–17:30",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Auroville_Visitors_Centre.jpg/1280px-Auroville_Visitors_Centre.jpg",
        photoCredit: "Wikimedia Commons / Auroville Visitors Centre",
        summary:
          "An eco-friendly compressed-earth architectural complex serving as the welcoming gate to Auroville. Features interactive photo galleries, video screenings, fair-trade craft boutiques (handcrafted paper, pottery, incense, clothing), and organic open-air cafes.",
      },
      {
        id: "IN-PY-AUV-ATT-003",
        name: "Savitri Bhavan",
        category: "Spiritual / Arts · Libraries, Center for Integral Studies",
        timings: "09:00–17:00 (Closed on Sundays)",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Savitri_Bhavan_Auroville.jpg/1280px-Savitri_Bhavan_Auroville.jpg",
        photoCredit: "Wikimedia Commons / Savitri Bhavan",
        summary:
          "A serene study center, library, and gallery dedicated to fostering understanding of Sri Aurobindo's monumental spiritual epic 'Savitri'. Houses original paintings by Huta illustrating Sri Aurobindo's verses and peaceful reading courtyards.",
      },
      {
        id: "IN-PY-AUV-GEM-001",
        name: "Botanical Garden of Auroville (Sadhana Forest)",
        category: "Nature · Forests & Gardens, 70-acre Tropical Dry Evergreen Forest Restoration",
        timings: "09:00–16:00",
        fee: { domestic: "Free (Guided tours available)", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Auroville_Botanical_Gardens.jpg/1280px-Auroville_Botanical_Gardens.jpg",
        photoCredit: "Wikimedia Commons / Auroville Botanical Garden",
        summary:
          "An inspiring 70-acre ecological project dedicated to conserving the severely threatened Tropical Dry Evergreen Forest (TDEF). Features 250 species of rare indigenous trees, organic seed banks, educational nature trails, and sustainable water harvesting swales.",
      },
    ],
  },
  {
    id: "paradise-beach",
    code: "IN-PY-CITY-PRD",
    name: "Paradise Beach & Chunnambar",
    nickname: "Plage Paradiso / Backwater Island Gateway",
    tagline: "Pristine golden sands, backwater catamaran cruises & serene mangrove kayaking",
    accentColor: "#0284C7",
    bgGradient: "from-sky-50 via-cyan-50/40 to-stone-50/30",
    coverImage: "/images/puducherry/puducherry-paradise-beach.png",
    photoCredit: "Discover Bharat Contributor / Paradise Beach Huts & Golden Sands",
    flashcardBlurb:
      "A secluded, pristine stretch of golden sand accessible via a scenic backwater boat ride, offering clear waters, water sports, and pristine coastal solitude.",
    topStays: [
      {
        name: "The Residency Towers Puducherry",
        category: "Maraimalai Adigal Salai — 5-Star Luxury with Fine Dining & Spa",
      },
      {
        name: "Accord Puducherry",
        category: "Gnanathilagam Nagar — Grand City Luxury with Large Swimming Pool",
      },
      {
        name: "Nalla Eco Beach Resort",
        category: "Near Chunnambar — Beachfront Eco-Resort with Thatched Sea-Facing Huts",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Chunnambar Boat House Canteen",
          location: "Nonankuppam, Chunnambar",
          specialties: "Fresh tender coconut water, south Indian vegetable samosas, lemon soda, and filter coffee",
        },
      ],
      nonVeg: [
        {
          restaurant: "Paradise Beach Food Shacks",
          location: "Paradise Beach Island",
          specialties: "Pan-fried local sea catch, fish fry, prawn masala, and casual beachside finger foods",
        },
      ],
      coastalNote:
        "Paradise Beach offers authentic coastal beach-shack fare: freshly split coconuts, spicy fried vanjaram (kingfish), and crisp snacks after a swim.",
    },
    attractions: [
      {
        id: "IN-PY-PRD-ATT-001",
        name: "Chunnambar Boat House",
        category: "Nature / Adventure · Rivers & Lakes, Backwater Embarkation & Water Sports",
        timings: "09:00–17:00",
        fee: { domestic: "Entry INR 10; Ferry ride ~INR 350–500", foreign: "Entry INR 10; Ferry ride ~INR 350–500" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Chunnambar_Boat_House.jpg/1280px-Chunnambar_Boat_House.jpg",
        photoCredit: "Wikimedia Commons / Chunnambar Boat House",
        summary:
          "Situated 8 km south of the city along the Cuddalore Main Road, where the Chunnambar river joins the Bay of Bengal. The launching point for passenger motor ferries, speedboats, and pedal boats sailing through lush mangrove estuaries to Paradise Beach.",
      },
      {
        id: "IN-PY-PRD-ATT-002",
        name: "Paradise Beach (Plage Paradiso)",
        category: "Nature / Adventure · Beaches, Secluded Golden Sand Spit & Water Sports",
        timings: "09:00–17:00 (Managed ferry schedule)",
        fee: { domestic: "Ferry ticket includes beach landing access", foreign: "Ferry ticket includes beach landing access" },
        isHiddenGem: false,
        image: "/images/puducherry/puducherry-paradise-beach.png",
        photoCredit: "Discover Bharat Contributor / Paradise Beach Cabanas",
        summary:
          "An idyllic, isolated sandbar beach accessible exclusively by boat from Chunnambar. Boasts soft golden sands, gentle sea breezes, thatched beach huts, changing rooms, and exciting water sports such as jet-skiing, kayaking, and banana boat rides.",
      },
      {
        id: "IN-PY-PRD-GEM-001",
        name: "Ariyankuppam Backwaters",
        category: "Nature · Rivers & Lakes, Mangrove Channels & Kayaking Trails",
        timings: "Daylight hours",
        fee: { domestic: "Kayak hire ~INR 500", foreign: "Kayak hire ~INR 500" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pondicherry_Backwaters.jpg/1280px-Pondicherry_Backwaters.jpg",
        photoCredit: "Wikimedia Commons / Ariyankuppam Backwaters",
        summary:
          "A tranquil network of brackish mangrove estuaries and narrow water corridors near the historic Arikamedu Roman trade site. A haven for migratory kingfishers and herons, perfect for guided silent kayaking away from the mainstream beach crowds.",
      },
    ],
  },
  {
    id: "heritage-town",
    code: "IN-PY-CITY-HTN",
    name: "Heritage Town & Tamil Quarter",
    nickname: "Ville Noire / Cultural Heart of Puducherry",
    tagline: "Traditional Tamil thinnai verandas, ancient Manakula Vinayagar temple & Sri Aurobindo Ashram",
    accentColor: "#EA580C",
    bgGradient: "from-orange-50 via-amber-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Manakula_Vinayagar_Temple_Pondicherry.jpg/1280px-Manakula_Vinayagar_Temple_Pondicherry.jpg",
    photoCredit: "Wikimedia Commons / Manakula Vinayagar Temple",
    flashcardBlurb:
      "The vibrant counterpart to White Town, featuring traditional Tamil-style houses with thinnai (verandas), tiled roofs, vibrant courtyards, bustling markets, and ancient temples.",
    topStays: [
      {
        name: "Hotel Surguru",
        category: "Sardar Vallabhbhai Patel Salai — Classic Vegetarian Stay with Renowned Restaurant",
      },
      {
        name: "Hotel de L'Orient",
        category: "Romain Rolland Street — 18th-Century French-Tamil Heritage Mansion",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Surguru Restaurant",
          location: "Sardar Vallabhbhai Patel Salai",
          specialties: "Famous for traditional South Indian morning tiffins, crisp medu vadas, ghee roast dosas, and unlimited Tamil vegetarian thalis",
        },
        {
          restaurant: "Hotel Anandha Inn",
          location: "S.V. Patel Salai",
          specialties: "Pure vegetarian multi-cuisine dining serving filter coffee, paneer preparations, and South Indian delicacies",
        },
      ],
      nonVeg: [
        {
          restaurant: "Sri Kamatchi Biryani",
          location: "Kamatchi Amman Kovil Street",
          specialties: "Authentic spicy Chettinad-style mutton biryani, chicken sukka, and country-chicken gravy",
        },
      ],
      tamilNote:
        "The Tamil Quarter's food scene features traditional Chettinad spices, steaming idlis with four varieties of coconut chutneys, and filter coffee served in stainless steel dabarah sets.",
    },
    attractions: [
      {
        id: "IN-PY-HTN-ATT-001",
        name: "Manakula Vinayagar Temple",
        category: "Spiritual · Hinduism, Ancient 5th-century Ganesha Temple",
        timings: "05:30–12:30 & 16:00–21:30",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Manakula_Vinayagar_Temple_Pondicherry.jpg/1280px-Manakula_Vinayagar_Temple_Pondicherry.jpg",
        photoCredit: "Wikimedia Commons / Manakula Vinayagar Temple",
        summary:
          "Pre-dating French arrival by centuries, this revered temple dedicated to Lord Ganesha features a magnificent golden chariot (Thanga Ther), colorful ceiling frescoes illustrating Ganesha's incarnations, and a vibrant tradition of temple blessings.",
      },
      {
        id: "IN-PY-HTN-ATT-002",
        name: "Grand Bazaar (Idaikazhi Market)",
        category: "Rural / Arts · Bazaars, Live Like a Local, Historic Produce & Flower Arcade",
        timings: "08:00–20:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Goubert_Market_Pondicherry.jpg/1280px-Goubert_Market_Pondicherry.jpg",
        photoCredit: "Wikimedia Commons / Grand Bazaar Pondicherry",
        summary:
          "Built in 1827 under Governor Desbassyns de Richemont, this bustling market arcade on J.N. Street overflows with fragrant jasmine flower garlands, mountains of fresh South Indian spices, terracotta pottery, brass lamps, and tropical produce.",
      },
      {
        id: "IN-PY-HTN-ATT-003",
        name: "Aurobindo Ashram",
        category: "Spiritual · Ashram, Peaceful Spiritual Sanctuary & Samadhi",
        timings: "08:00–12:00 & 14:00–18:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Sri_Aurobindo_Ashram_Pondicherry.jpg/1280px-Sri_Aurobindo_Ashram_Pondicherry.jpg",
        photoCredit: "Wikimedia Commons / Sri Aurobindo Ashram",
        summary:
          "Founded in 1926 by Sri Aurobindo and Mirra Alfassa (The Mother), this world-renowned spiritual center is located on Rue de la Marine. Centers around the flower-bedecked marble Samadhi courtyard where seekers from around the world gather for silent meditation.",
      },
      {
        id: "IN-PY-HTN-GEM-001",
        name: "Bharathi Park & Government Park (Aayi Mandapam)",
        category: "Nature · Forests & Gardens, Colonial Park & Greco-Roman Monument",
        timings: "06:00–21:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Aayi_Mandapam_Bharathi_Park_Pondicherry.jpg/1280px-Aayi_Mandapam_Bharathi_Park_Pondicherry.jpg",
        photoCredit: "Wikimedia Commons / Aayi Mandapam Bharathi Park",
        summary:
          "A lush colonial public park surrounded by the Governor's Palace and High Court. Anchored by the neoclassical white 'Aayi Mandapam' monument pavilion built during the reign of Napoleon III to honor a 16th-century courtesan who gave her water reservoir to the city.",
      },
    ],
  },
];
