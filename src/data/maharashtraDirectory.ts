export interface MaharashtraStay {
  name: string;
  category: string;
}

export interface MaharashtraFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface MaharashtraDining {
  veg: MaharashtraFoodSpot[];
  nonVeg: MaharashtraFoodSpot[];
  culinaryNote?: string;
  coastalNote?: string;
  spicyNote?: string;
  wineNote?: string;
}

export interface MaharashtraAttraction {
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

export interface MaharashtraCity {
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
  topStays: MaharashtraStay[];
  dining: MaharashtraDining;
  attractions: MaharashtraAttraction[];
}

export const MAHARASHTRA_DIRECTORY: MaharashtraCity[] = [
  {
    id: "mumbai",
    code: "IN-MH-MUM-ULTIMATE",
    name: "Mumbai",
    nickname: "City of Dreams / Financial Capital",
    tagline: "Colonial Victorian Gothic UNESCO wonders, bustling marine promenades & 24/7 street life",
    accentColor: "#C2410C",
    bgGradient: "from-amber-50 via-orange-50/40 to-stone-50/30",
    coverImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
    photoCredit: "Discover Bharat Contributor / Gateway of India Basalt Arch",
    flashcardBlurb:
      "India's vibrant megacity and commercial powerhouse, featuring colonial Victorian architecture, art deco streetscapes, thriving coastal biodiversity, and deep-rooted heritage enclaves.",
    topStays: [
      {
        name: "The Taj Mahal Palace",
        category: "Colaba — Iconic Luxury Heritage Facing Gateway of India & Arabian Sea",
      },
      {
        name: "The Oberoi",
        category: "Nariman Point — Sea-Facing Ultra-Luxury on Marine Drive Queen's Necklace",
      },
      {
        name: "The Leela",
        category: "Andheri East — Contemporary Luxury Oasis near International Airport",
      },
      {
        name: "Abode Bombay",
        category: "Colaba — Boutique Heritage Hotel in South Mumbai's Historic Art Quarter",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Ram Ashraya",
          location: "Matunga",
          specialties: "Legendary South Indian filter coffee, Mysore Masala Dosa, and melt-in-mouth idlis",
        },
        {
          restaurant: "Soam",
          location: "Girgaon",
          specialties: "Authentic heritage Maharashtrian and Gujarati snacks, seasonal Undhiyu, and Farsan",
        },
        {
          restaurant: "Swati Snacks",
          location: "Tardeo",
          specialties: "Beloved Gujarati comfort food, Panki Chutney, handvo, and fresh sugarcane juice",
        },
      ],
      nonVeg: [
        {
          restaurant: "Britannia & Co.",
          location: "Ballard Estate",
          specialties: "Historic 1923 Parsi cafe institution famous for Berry Pulao, Duck Patia, and Caramel Custard",
        },
        {
          restaurant: "Gajalee",
          location: "Vile Parle",
          specialties: "Coastal Malvani Green-masala Crab, tandoori jumbo prawns, stuffed bombil, and Solkadhi",
        },
        {
          restaurant: "The Table",
          location: "Colaba",
          specialties: "Contemporary global fine dining, farm-to-table small plates, and inventive cocktails",
        },
      ],
      culinaryNote:
        "Mumbai's culinary mosaic bridges century-old Irani cafes, fiery coastal Malvani seafood, Gujarati farsan, and iconic street food from Pav Bhaji to Vada Pav.",
    },
    attractions: [
      {
        id: "IN-MH-MUM-ATT-001",
        name: "Gateway of India & Colaba Causeway",
        category: "Heritage: Monuments",
        timings: "Open 24 Hours",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
        photoCredit: "Unsplash / Gateway of India Basalt Arch",
        summary:
          "Iconic 26-meter basalt triumphal arch overlooking Mumbai Harbour, built to commemorate King George V's visit, anchoring South Mumbai's bustling Colaba Causeway heritage quarter.",
      },
      {
        id: "IN-MH-MUM-ATT-002",
        name: "Marine Drive & Chowpatty",
        category: "Nature / Recreation: Beaches",
        timings: "Open 24 Hours",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=1200&auto=format&fit=crop&q=80",
        photoCredit: "Unsplash / Marine Drive Coastline",
        summary:
          "The 3.6-km arc-shaped coastal boulevard known as the Queen's Necklace, lined with UNESCO-listed Art Deco heritage buildings and ending at vibrant Chowpatty beach.",
      },
      {
        id: "IN-MH-MUM-ATT-003",
        name: "Sanjay Gandhi National Park & Kanheri Caves",
        category: "Nature / Heritage: Forests & Caves",
        timings: "07:30–17:30 (Closed Mondays for caves)",
        fee: { domestic: "Park Entry INR 88; Cave entry extra", foreign: "Park Entry INR 88; Cave entry extra" },
        isHiddenGem: false,
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Kanheri_Caves_prayer_hall.JPG/1280px-Kanheri_Caves_prayer_hall.JPG",
        photoCredit: "Wikimedia Commons / Kanheri Caves Prayer Hall",
        summary:
          "A massive 104-sq-km protected forest within city limits housing 109 1st-century BCE Buddhist rock-cut caves, ancient prayer halls, and lush deciduous jungle trails.",
      },
      {
        id: "IN-MH-MUM-ATT-004",
        name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS)",
        category: "Heritage: Museums",
        timings: "10:15–18:00",
        fee: { domestic: "INR 100", foreign: "INR 700" },
        isHiddenGem: false,
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Chhatrapati_Shivaji_Maharaj_Vastu_Sangrahalaya.jpg/1280px-Chhatrapati_Shivaji_Maharaj_Vastu_Sangrahalaya.jpg",
        photoCredit: "Wikimedia Commons / CSMVS Museum Façade",
        summary:
          "Indo-Saracenic museum housing over 50,000 artifacts of Indian history, art, and natural history, set in heritage botanical gardens with a grand Mughal-style dome.",
      },
      {
        id: "IN-MH-MUM-GEM-001",
        name: "Khotachiwadi Village",
        category: "Heritage / Architecture: Living Heritage",
        timings: "Daylight hours",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Khotachiwadi_-_Street.jpg/1280px-Khotachiwadi_-_Street.jpg",
        photoCredit: "Wikimedia Commons / Khotachiwadi Heritage Street",
        summary:
          "A quaint 19th-century heritage pocket in Girgaon featuring narrow winding lanes and Portuguese-style wooden bungalows preserved by the East Indian community.",
      },
      {
        id: "IN-MH-MUM-GEM-002",
        name: "Gilbert Hill, Andheri",
        category: "Nature: Geological Formations",
        timings: "06:00–20:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Gilbert_Hill.jpg/1280px-Gilbert_Hill.jpg",
        photoCredit: "Wikimedia Commons / Gilbert Hill Basalt Monolith",
        summary:
          "A massive 200-foot monolithic column of black basalt rock (one of only two such formations globally, matching Wyoming's Devils Tower), formed 66 million years ago during the Mesozoic Era.",
      },
      {
        id: "IN-MH-MUM-GEM-003",
        name: "Sewri Flamingo Point",
        category: "Nature: Wildlife-Tourism",
        timings: "Best visited during low tide",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Lesser_Flamingos_at_Sewri_harbour%28Mumbai%29.jpg/1280px-Lesser_Flamingos_at_Sewri_harbour%28Mumbai%29.jpg",
        photoCredit: "Wikimedia Commons / Lesser Flamingos at Sewri",
        summary:
          "Mudflats along the eastern harbor where thousands of migratory lesser flamingos flock every winter (Nov–March), creating a stunning pink spectacle against the industrial harbor backdrop.",
      },
      {
        id: "IN-MH-MUM-GEM-004",
        name: "Worli Fort",
        category: "Heritage: Palaces & Forts",
        timings: "06:00–19:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Worli_Fort_Mumbai.jpg/1280px-Worli_Fort_Mumbai.jpg",
        photoCredit: "Wikimedia Commons / Worli Fort Arabian Sea Overlook",
        summary:
          "A small 17th-century British fort nestled inside a quiet Koli (fisherman) hamlet offering panoramic views of the Arabian Sea and the Bandra-Worli Sea Link.",
      },
    ],
  },
  {
    id: "pune",
    code: "IN-MH-PUN-ULTIMATE",
    name: "Pune",
    nickname: "Cultural Capital of Maharashtra / Oxford of the East",
    tagline: "Imperial Peshwa seat, Sinhagad hill fortresses, lush Osho ashrams & vibrant university vibe",
    accentColor: "#B45309",
    bgGradient: "from-amber-50 via-yellow-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Shaniwarwada_Pune.jpg/1280px-Shaniwarwada_Pune.jpg",
    photoCredit: "Wikimedia Commons / Shaniwar Wada Delhi Gate",
    flashcardBlurb:
      "Maharashtra's cultural and intellectual capital, blending Maratha imperial history, 8th-century rock-cut architecture, vibrant student districts, and serene hill sanctuaries.",
    topStays: [
      {
        name: "JW Marriott Pune",
        category: "Senapati Bapat Road — Ultra-Luxury Urban Hotel with Rooftop Lounge & Spa",
      },
      {
        name: "The Corinthians Resort & Club",
        category: "Nyati County — Egyptian Themed Architecture, Microbrewery & Greenery",
      },
      {
        name: "Conrad Pune",
        category: "Core Business District — Hilton Flagship Art Deco Luxury",
      },
      {
        name: "Hotel Deccan Rendezvous",
        category: "Deccan Gymkhana — Elegant Boutique Stay in Central Pune",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Vaishali",
          location: "FC Road (Fergusson College Road)",
          specialties: "Iconic student hangout for SPDP (Sev Potato Dahi Puri), Mysore Masala Dosa, and South Indian tiffin",
        },
        {
          restaurant: "Sujata Mastani",
          location: "Sadashiv Peth",
          specialties: "Thick fruit milkshakes with ice cream, signature mango and sitaphal mastani topped with dry fruits",
        },
        {
          restaurant: "Bedekar Tea Stall",
          location: "Narayan Peth",
          specialties: "Legendary authentic Puneri Misal Pav served with crunchy farsan and spiced usal",
        },
      ],
      nonVeg: [
        {
          restaurant: "Hotel Shreyas",
          location: "Deccan Gymkhana",
          specialties: "Traditional Maharashtrian mutton thalis, Sukka Mutton, and flavorful Tambda Rassa",
        },
        {
          restaurant: "Marz-O-Dan",
          location: "MG Road (Camp Area)",
          specialties: "Legendary Parsi cafe chicken mayo rolls, cheese burgers, sandwiches, and rich cold coffee",
        },
        {
          restaurant: "George Restaurant",
          location: "Camp",
          specialties: "Iconic heritage dining serving legendary Chicken Biryani, Butter Chicken, and seekh kebabs",
        },
      ],
      culinaryNote:
        "From spicy Puneri Misal and Bakarwadi to thick Mastani fruit milkshakes and Peshwa mutton thalis, Pune blends traditional satvik snacking with robust non-veg classics.",
    },
    attractions: [
      {
        id: "IN-MH-PUN-ATT-001",
        name: "Shaniwar Wada",
        category: "Heritage: Palaces & Forts",
        timings: "08:00–18:30",
        fee: { domestic: "INR 25", foreign: "INR 300" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Shaniwarwada_Pune.jpg/1280px-Shaniwarwada_Pune.jpg",
        photoCredit: "Wikimedia Commons / Shaniwar Wada Delhi Gate",
        summary:
          "18th-century historical fortification and majestic seat of the Peshwa rulers of the Maratha Empire, featuring imposing spiked Delhi Darwaza gates and royal fountain courtyards.",
      },
      {
        id: "IN-MH-PUN-ATT-002",
        name: "Aga Khan Palace",
        category: "Heritage: Historical Sites",
        timings: "09:00–17:30",
        fee: { domestic: "INR 25", foreign: "INR 100" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Aga_Khan_Palace_Pune.jpg/1280px-Aga_Khan_Palace_Pune.jpg",
        photoCredit: "Wikimedia Commons / Aga Khan Palace",
        summary:
          "Imposing Italian-arched monument holding profound national importance in India's freedom struggle and Gandhi's imprisonment; houses Kasturba Gandhi's memorial samadhi.",
      },
      {
        id: "IN-MH-PUN-ATT-003",
        name: "Sinhagad Fort",
        category: "Heritage / Adventure: Hiking & Trekking",
        timings: "05:00–18:00",
        fee: { domestic: "INR 50 per vehicle", foreign: "INR 50 per vehicle" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sinhagad_Fort_Kalyan_Darwaza.jpg/1280px-Sinhagad_Fort_Kalyan_Darwaza.jpg",
        photoCredit: "Wikimedia Commons / Sinhagad Fort",
        summary:
          "Historic hilltop fortress perched on the Sahyadri edge, renowned for the heroics of Tanaji Malusare, panoramic mountain vistas, and hot pitla-bhakri served at the summit.",
      },
      {
        id: "IN-MH-PUN-ATT-004",
        name: "Pataleshwar Cave Temple",
        category: "Spiritual / Heritage: Rock-cut Architecture",
        timings: "08:00–17:30",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Pataleshwar_Cave_Temple%2C_Pune.jpg/1280px-Pataleshwar_Cave_Temple%2C_Pune.jpg",
        photoCredit: "Wikimedia Commons / Pataleshwar Cave",
        summary:
          "8th-century monolithic rock-cut cave temple dedicated to Lord Shiva, carved entirely out of a single basalt rock block with a monumental circular Nandi pavilion.",
      },
      {
        id: "IN-MH-PUN-GEM-001",
        name: "Zapurza Museum of Art & Culture",
        category: "Arts / Heritage: Museums",
        timings: "10:00–19:00 (Closed Mondays)",
        fee: { domestic: "INR 500", foreign: "INR 500" },
        isHiddenGem: true,
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Signboard_at_the_entrance_of_Zapurza.jpg/1280px-Signboard_at_the_entrance_of_Zapurza.jpg",
        photoCredit: "Wikimedia Commons / Zapurza Entrance",
        summary:
          "Sprawling lakeside museum campus showcasing traditional Indian decorative arts, paintings, and master crafts in a tranquil open-air design along Khadakwasla backwaters.",
      },
      {
        id: "IN-MH-PUN-GEM-002",
        name: "Taljai Hills & Woods",
        category: "Nature: Forests & Gardens",
        timings: "05:30–10:00 & 16:00–19:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Taljai.JPG/1280px-Taljai.JPG",
        photoCredit: "Wikimedia Commons / Taljai Hills Pune",
        summary:
          "A dense protected forest hill within Pune city limits offering peaceful walking trails, deer sightings, and birdwatching away from urban noise.",
      },
      {
        id: "IN-MH-PUN-GEM-003",
        name: "National Defence Academy (NDA) Museum & Khadakwasla Dam",
        category: "Heritage / Nature: Landmarks",
        timings: "Daylight hours",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Khadakwasla_Dam_image.JPG/1280px-Khadakwasla_Dam_image.JPG",
        photoCredit: "Wikimedia Commons / Khadakwasla Dam Backwaters",
        summary:
          "Scenic backwater lake region near the premier military training institution with historical war trophies display, waterfront strolls, and panoramic reservoir views.",
      },
    ],
  },
  {
    id: "chhatrapati-sambhajinagar",
    code: "IN-MH-CITY-CSN",
    name: "Chhatrapati Sambhajinagar (Aurangabad)",
    nickname: "City of Gates / Tourism Capital of Maharashtra",
    tagline: "UNESCO wonders of Ajanta & Ellora, monolithic Kailasa temple & medieval Daulatabad fortifications",
    accentColor: "#9333EA",
    bgGradient: "from-purple-50 via-indigo-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Ajanta_%2863%29.jpg",
    photoCredit: "Wikimedia Commons / Ajanta Caves Panorama",
    flashcardBlurb:
      "The historic gateway to world-famous UNESCO rock-cut wonders, medieval fortresses, and architectural marvels like the Taj-inspired Bibi Ka Maqbara.",
    topStays: [
      {
        name: "Welcomhotel by ITC Hotels",
        category: "CIDCO — Modern Luxury Resort Infused with Maratha Heritage Motifs",
      },
      {
        name: "Vivanta Aurangabad",
        category: "Railway Station Road — Palatial Architecture, Lush Gardens & Poolside Cabanas",
      },
      {
        name: "Lemon Tree Hotel",
        category: "Airport Road — Contemporary Comfort with Quick Access to Historic City Gates",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Thali's Restaurant",
          location: "Central City Hub",
          specialties: "Authentic Maharashtrian and North Indian thalis featuring piping hot Jowar Bhakri, Shengdana Chutney, and Dal Bati",
        },
      ],
      nonVeg: [
        {
          restaurant: "Green Leaf",
          location: "Town Centre, CIDCO",
          specialties: "Famous for authentic local Mughlai cuisine, fragrant Biryani, and fiery regional Marathwada mutton curries",
        },
      ],
      culinaryNote:
        "Sambhajinagar cuisine reflects a rich fusion of Marathwada rustic spice and Deccani Mughlai royal feasts, including Naan Qalia and fragrant Dum Biryanis.",
    },
    attractions: [
      {
        id: "IN-MH-CSN-ATT-001",
        name: "Ajanta Caves",
        category: "Heritage · UNESCO World Heritage Site, 2nd-century BCE Buddhist Cave Murals",
        timings: "09:00–17:00 (Closed on Mondays)",
        fee: { domestic: "INR 40", foreign: "INR 600" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Ajanta_%2863%29.jpg",
        photoCredit: "Wikimedia Commons / Ajanta Caves",
        summary:
          "A dramatic horseshoe-shaped ravine housing 30 rock-cut Buddhist cave monuments dating from the 2nd century BCE to the 5th century CE. Renowned globally as the pinnacle of ancient Indian mural painting and expressive Buddhist iconography.",
      },
      {
        id: "IN-MH-CSN-ATT-002",
        name: "Ellora Caves & Kailasa Temple",
        category: "Heritage · UNESCO World Heritage Site, Monolithic Rock-cut Architecture",
        timings: "06:00–18:00 (Closed on Tuesdays)",
        fee: { domestic: "INR 40", foreign: "INR 600" },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?w=1200&auto=format&fit=crop&q=80",
        photoCredit: "Unsplash / Kailasa Temple Ellora",
        summary:
          "Sprawling complex of 34 monasteries and temples carved side-by-side into basalt cliffs, representing Hindu, Buddhist, and Jain traditions. Anchored by Cave 16 (Kailasa Temple), the largest monolithic rock excavation in the world, carved top-down from a single cliff face.",
      },
      {
        id: "IN-MH-CSN-ATT-003",
        name: "Bibi Ka Maqbara",
        category: "Heritage · Monuments, 17th-century Mughal Marble Mausoleum",
        timings: "06:00–22:00",
        fee: { domestic: "INR 25", foreign: "INR 300" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Bibi_Ka_Maqbara_Front.jpg/1280px-Bibi_Ka_Maqbara_Front.jpg",
        photoCredit: "Wikimedia Commons / Bibi Ka Maqbara",
        summary:
          "Known as the 'Dakkhani Taj' (Taj of the Deccan), this striking 1660 mausoleum was commissioned by Prince Azam Shah in memory of his mother Dilras Banu Begum. Features intricate stucco plasterwork, marble domes, and Charbagh water gardens.",
      },
      {
        id: "IN-MH-CSN-ATT-004",
        name: "Daulatabad (Devagiri) Fort",
        category: "Heritage / Adventure · Palaces & Forts, 14th-century Impregnable Hilltop Fortress",
        timings: "09:00–18:00",
        fee: { domestic: "INR 25", foreign: "INR 300" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Daulatabad_Fort_Entrance.jpg/1280px-Daulatabad_Fort_Entrance.jpg",
        photoCredit: "Wikimedia Commons / Daulatabad Fort",
        summary:
          "An extraordinary medieval fortress perched on a 200-meter conical hill. Features ingenious multi-layered defensive engineering including a deep moat filled with crocodiles, the famous pitch-dark Andhari labyrinth, and the stately Chand Minar.",
      },
      {
        id: "IN-MH-CSN-GEM-001",
        name: "Lonar Crater Lake",
        category: "Nature · Geological Formations, Hyper-Saline Meteoric Impact Crater",
        timings: "Open 24 hours",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Lonar_Lake_Aerial_View.jpg/1280px-Lonar_Lake_Aerial_View.jpg",
        photoCredit: "Wikimedia Commons / Lonar Crater",
        summary:
          "Created over 50,000 years ago by a high-velocity hyper-velocity meteorite impact into basalt bedrock. Located ~140 km from the city, this unique ecological wonder hosts an alkaline, hyper-saline inland lake fringed with ancient stone temples.",
      },
    ],
  },
  {
    id: "mahabaleshwar",
    code: "IN-MH-CITY-MHB",
    name: "Mahabaleshwar",
    nickname: "Queen of Maharashtra Hill Stations",
    tagline: "Rolling strawberry valleys, misty Western Ghats viewpoints & Chhatrapati Shivaji's Pratapgad fort",
    accentColor: "#E11D48",
    bgGradient: "from-rose-50 via-pink-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Venna_Lake_Mahabaleshwar.jpg/1280px-Venna_Lake_Mahabaleshwar.jpg",
    photoCredit: "Wikimedia Commons / Venna Lake Mahabaleshwar",
    flashcardBlurb:
      "The queen of Maharashtra's hill stations, nestled in the evergreen Western Ghats, celebrated for its strawberry farms, misty viewpoints, and colonial charm.",
    topStays: [
      {
        name: "Le Méridien Mahabaleshwar Resort & Spa",
        category: "Forest Hills — Ultra-Luxury Sahyadri Sanctuary with Heated Infinity Pool",
      },
      {
        name: "Citrus Chambers",
        category: "Heritage Hill Retreat — Colonial Architecture Nestled in Dense Evergreen Groves",
      },
      {
        name: "Saj Mahabaleshwar",
        category: "Panchgani-Mahabaleshwar Road — Scenic Mountain Cottages & Landscaped Lawns",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Bagicha Corner",
          location: "Mahabaleshwar-Panchgani Road",
          specialties: "Famous for seasonal fresh Strawberry Cream with dollops of soft cream, rich milkshakes, and hot corn patties",
        },
        {
          restaurant: "The Grapevine",
          location: "Masjid Road",
          specialties: "Parsi and Continental multi-cuisine restaurant with refreshing fresh salads, pasta, and baked desserts",
        },
      ],
      nonVeg: [
        {
          restaurant: "The Grapevine",
          location: "Masjid Road",
          specialties: "Exceptional slow-cooked Lamb Shanks, Butter Garlic Prawns, and authentic non-veg Parsi delights",
        },
      ],
      culinaryNote:
        "Synonymous with strawberries, mulberries, and fresh organic hill honey, Mahabaleshwar's dining pairs fresh farm fruits with hearty Parsi and Malvani treats.",
    },
    attractions: [
      {
        id: "IN-MH-MHB-ATT-001",
        name: "Venna Lake Boating",
        category: "Nature / Recreation · Rivers & Lakes, Picturesque High-Altitude Lake",
        timings: "07:00–19:00",
        fee: { domestic: "Free entry (Boating fees ~INR 250–500)", foreign: "Free entry (Boating fees ~INR 250–500)" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Venna_Lake_Mahabaleshwar.jpg/1280px-Venna_Lake_Mahabaleshwar.jpg",
        photoCredit: "Wikimedia Commons / Venna Lake",
        summary:
          "Picturesque 28-acre man-made lake built in 1842 by Appasaheb Maharaj. Lined with lush trees, it is a bustling recreational hub offering pedal boats, rowboats, horse riding along the banks, and local food stalls.",
      },
      {
        id: "IN-MH-MHB-ATT-002",
        name: "Arthur's Seat",
        category: "Nature · Hills & Mountains, Dramatic Sahyadri Ridge Viewpoint",
        timings: "09:00–20:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Arthur%27s_Seat_Mahabaleshwar.jpg/1280px-Arthur%27s_Seat_Mahabaleshwar.jpg",
        photoCredit: "Wikimedia Commons / Arthur's Seat Point",
        summary:
          "Known as the 'Queen of all points', perched at an elevation of 1,470 meters. Offers breathtaking vertical sheer drops into the deep valley of the Savitri River on one side and the dense Konkan valleys on the other.",
      },
      {
        id: "IN-MH-MHB-ATT-003",
        name: "Elephant's Head Point (Needle Hole)",
        category: "Nature · Hills & Mountains, Natural Basalt Rock Formation",
        timings: "07:00–18:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Elephant%27s_Head_Point_Mahabaleshwar.jpg/1280px-Elephant%27s_Head_Point_Mahabaleshwar.jpg",
        photoCredit: "Wikimedia Commons / Elephant's Head Point",
        summary:
          "A stunning geological overhang that strikingly resembles the head and trunk of an elephant. The natural cavity between the rocks forms a needle hole through which the Sahyadri mountains can be viewed.",
      },
      {
        id: "IN-MH-MHB-ATT-004",
        name: "Mapro Garden",
        category: "Nature / Arts · Agro-Tourism, Strawberry Farms & Gourmet Food Hub",
        timings: "08:00–21:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Mapro_Garden_Panchgani.jpg/1280px-Mapro_Garden_Panchgani.jpg",
        photoCredit: "Wikimedia Commons / Mapro Garden",
        summary:
          "A sprawling agro-tourism destination nestled in the hills between Mahabaleshwar and Panchgani. Features lush strawberry fields, artisan chocolate-making units, gourmet wood-fired pizza counters, and the annual Strawberry Festival.",
      },
      {
        id: "IN-MH-MHB-GEM-001",
        name: "Pratapgad Fort",
        category: "Heritage · Palaces & Forts, 17th-century Maratha Mountain Citadel",
        timings: "10:00–18:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pratapgad_Fort_Bastion.jpg/1280px-Pratapgad_Fort_Bastion.jpg",
        photoCredit: "Wikimedia Commons / Pratapgad Fort",
        summary:
          "Commanding fortress built in 1656 by Chhatrapati Shivaji Maharaj, located 24 km from Mahabaleshwar. The site of the historic Battle of Pratapgad where Shivaji defeated Afzal Khan; features double-line fortifications, the Bhavani Temple, and commanding valley lookouts.",
      },
    ],
  },
  {
    id: "lonavala-khandala",
    code: "IN-MH-CITY-LNK",
    name: "Lonavala & Khandala",
    nickname: "Jewel of the Sahyadri / Twin Monsoon Retreats",
    tagline: "Dramatic monsoon waterfalls, mist-shrouded ghats, ancient Buddhist caves & crunchy walnut chikki",
    accentColor: "#0284C7",
    bgGradient: "from-sky-50 via-cyan-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Karla_Caves_Chaitya_Interior.jpg/1280px-Karla_Caves_Chaitya_Interior.jpg",
    photoCredit: "Wikimedia Commons / Karla Caves Chaitya",
    flashcardBlurb:
      "The ultimate twin hill stations of the Western Ghats, famous for dramatic mist-covered valleys, roaring monsoon waterfalls, ancient rock-cut caves, and crunchy chikki.",
    topStays: [
      {
        name: "The Machan",
        category: "Jambulne — Unique Eco-Luxury Treehouses Floating 30-45 Feet in the Forest Canopy",
      },
      {
        name: "Radisson Blu Resort & Spa",
        category: "Karjat-Lonavala Road — Mountain View Luxury with Extensive Wellness Spa",
      },
      {
        name: "The Dukes Retreat",
        category: "Khandala — Panoramic Cliffside Resort Overlooking Khandala Valley",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Rama Krishna",
          location: "Lonavala Highway",
          specialties: "Iconic family dining known for steaming South Indian breakfasts, crisp Dosas, and filling North Indian Punjabi thalis",
        },
        {
          restaurant: "Cooper's Fudge and Chikki",
          location: "Opposite Lonavala Railway Station",
          specialties: "Original heritage confectionery since 1926, legendary for rich handmade Chocolate Walnut Fudge and crunchy crushed peanut chikki",
        },
      ],
      nonVeg: [
        {
          restaurant: "Sunny's Da Dhaba",
          location: "Mumbai-Pune Expressway, Kamshet",
          specialties: "Famous highway stop for butter-laden tandoori platters, succulent Butter Chicken, and spicy Mutton Karahi",
        },
      ],
      culinaryNote:
        "Synonymous with crunchy traditional chikki (peanut, sesame, cashew) and soft hot sweet corn cobs savored during foggy monsoon drizzles.",
    },
    attractions: [
      {
        id: "IN-MH-LNK-ATT-001",
        name: "Tiger's Leap & Sunset Point",
        category: "Nature · Hills & Mountains, 650-meter Sahyadri Cliff Precipice",
        timings: "06:00–18:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Tiger%27s_Leap_Lonavala.jpg/1280px-Tiger%27s_Leap_Lonavala.jpg",
        photoCredit: "Wikimedia Commons / Tiger's Leap",
        summary:
          "A dramatic cliff edge with a sheer drop of over 650 meters, named for its striking resemblance to a leaping tiger plunging into the abyss. Offers breathtaking vistas of the surrounding Western Ghats valleys and sunset panoramas.",
      },
      {
        id: "IN-MH-LNK-ATT-002",
        name: "Bhushi Dam",
        category: "Nature / Recreation · Rivers & Lakes, Masonry Waterfall Overflow Dam",
        timings: "09:00–18:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bhushi_Dam_Lonavala.jpg/1280px-Bhushi_Dam_Lonavala.jpg",
        photoCredit: "Wikimedia Commons / Bhushi Dam",
        summary:
          "A masonry dam built on the Indrayani River. During peak monsoon months, water cascades over stepped rocky terraces, making it a wildly popular recreation spot for wading in foaming hill waters.",
      },
      {
        id: "IN-MH-LNK-ATT-003",
        name: "Karla & Bhaja Caves",
        category: "Heritage · Archeological Sites, 2nd-century BCE Buddhist Rock-Cut Chaityas",
        timings: "09:00–17:00",
        fee: { domestic: "INR 25", foreign: "INR 300" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Karla_Caves_Chaitya_Interior.jpg/1280px-Karla_Caves_Chaitya_Interior.jpg",
        photoCredit: "Wikimedia Commons / Karla Caves Grand Chaitya",
        summary:
          "Ancient rock-cut Buddhist complexes dating back to the 2nd century BCE. The Great Chaitya at Karla is India's largest rock-cut prayer hall, featuring a teak wood-ribbed vaulted ceiling, ornate carved elephant pillars, and monumental stupas.",
      },
      {
        id: "IN-MH-LNK-GEM-001",
        name: "Rajmachi Fort",
        category: "Heritage / Adventure · Hiking & Trekking, Twin Sahyadri Fortresses",
        timings: "Daylight hours",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Rajmachi_Fort_Shrivardhan.jpg/1280px-Rajmachi_Fort_Shrivardhan.jpg",
        photoCredit: "Wikimedia Commons / Rajmachi Fort",
        summary:
          "A pair of strategic twin fortresses (Shrivardhan and Manaranjan) situated high on the Sahyadri mountains overlooking the historic Borghat trade route. A paradise for monsoon trekkers surrounded by seasonal fireflies, deep valleys, and cloud cover.",
      },
      {
        id: "IN-MH-LNK-GEM-002",
        name: "Lohagad Fort",
        category: "Heritage / Adventure · Palaces & Forts, Maratha Hill Fort with Scorpion's Tail Ridge",
        timings: "09:00–18:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Lohagad_Fort_Vinchukata.jpg/1280px-Lohagad_Fort_Vinchukata.jpg",
        photoCredit: "Wikimedia Commons / Lohagad Fort",
        summary:
          "Historic 'Iron Fort' celebrated for its four sequential fortified gates (Ganesh, Narayan, Hanuman, and Maha Darwaza) and its famous 'Vinchukata' (Scorpion's Tail) — a dramatic 1,500-meter narrow rock tongue projecting out into the clouds.",
      },
    ],
  },
  {
    id: "alibaug-konkan",
    code: "IN-MH-CITY-ALB",
    name: "Alibaug & Coastal Konkan",
    nickname: "Hamptons of Mumbai / Sea Fort Paradise",
    tagline: "Arabian Sea fortresses, black & white sand coconut beaches & spicy Malvani surmai feasts",
    accentColor: "#0D9488",
    bgGradient: "from-teal-50 via-emerald-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Murud_Janjira_Fort.jpg/1280px-Murud_Janjira_Fort.jpg",
    photoCredit: "Wikimedia Commons / Murud-Janjira Marine Fortress",
    flashcardBlurb:
      "A scenic coastal paradise south of Mumbai known for sun-soaked black/white sand beaches, sea forts, and fresh Konkani seafood.",
    topStays: [
      {
        name: "Radisson Blu Resort & Spa Alibaug",
        category: "Gondhalpada — Five-Star Coastal Resort with Expansive Lagoon Pools & Spa",
      },
      {
        name: "U Tropicana Alibaug",
        category: "Chondi — Tropical Boutique Resort with Manicured Lawns & Peaceful Suites",
      },
      {
        name: "Cobalt Woods Villas",
        category: "Awas Beach — Luxury Private Villas Nestled in Coastal Groves",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Sanman Restaurant",
          location: "Alibaug Town",
          specialties: "Legendary authentic Maharashtrian vegetarian thalis, steaming Pitla Bhakri, and Solkadhi",
        },
      ],
      nonVeg: [
        {
          restaurant: "Hotel SunCTC",
          location: "Alibaug Core",
          specialties: "Famous for crisp Prawns Koliwada, golden Surmai Thali, and pan-fried Bombil cooked in secret Malvani spice masala",
        },
      ],
      coastalNote:
        "Coastal Konkan gastronomy revolves around freshly caught Arabian sea fish, coconut milk, tart kokum extract, and fragrant stone-ground red masala pastes.",
    },
    attractions: [
      {
        id: "IN-MH-ALB-ATT-001",
        name: "Kolaba Fort",
        category: "Heritage · Palaces & Forts, 17th-century Tidal Marine Citadel",
        timings: "09:00–18:00 (Tide dependent)",
        fee: { domestic: "INR 25", foreign: "INR 25" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kolaba_Fort_Alibag.jpg/1280px-Kolaba_Fort_Alibag.jpg",
        photoCredit: "Wikimedia Commons / Kolaba Fort",
        summary:
          "A 17th-century naval station fortified by Chhatrapati Shivaji Maharaj, standing in the Arabian Sea roughly 1–2 km off Alibaug Beach. Remarkable because visitors can walk across the seabed during low tide or take horse-drawn carts through shallow water.",
      },
      {
        id: "IN-MH-ALB-ATT-002",
        name: "Nagaon & Kashid Beaches",
        category: "Nature · Beaches, White-sand Coastal Shores & Watersports",
        timings: "Open 24 hours",
        fee: { domestic: "Free (Activities extra)", foreign: "Free (Activities extra)" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Kashid_Beach_Alibaug.jpg/1280px-Kashid_Beach_Alibaug.jpg",
        photoCredit: "Wikimedia Commons / Kashid Beach",
        summary:
          "Pristine white and silver sand beaches framed by casuarina (suru) tree plantations. Renowned for clear surf, paragliding, jet-skiing, banana boat rides, and tranquil shoreline sunset walks away from urban commotion.",
      },
      {
        id: "IN-MH-ALB-ATT-003",
        name: "Murud-Janjira Fort",
        category: "Heritage · Palaces & Forts, Impregnable Arabian Sea Island Bastion",
        timings: "07:00–18:00",
        fee: { domestic: "Boat ride ~INR 100–200; Fort entry Free", foreign: "Boat ride ~INR 100–200; Fort entry Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Murud_Janjira_Fort.jpg/1280px-Murud_Janjira_Fort.jpg",
        photoCredit: "Wikimedia Commons / Murud-Janjira Fort",
        summary:
          "An awe-inspiring marine fortress situated on an oval rock off the coast of Murud. Built by the Siddis in the 15th century, it is famed as an impregnable stronghold that resisted repeated sieges by the British, Portuguese, and Marathas; houses 26 massive cannons including the famous Kalal Bangadi.",
      },
      {
        id: "IN-MH-ALB-GEM-001",
        name: "Korlai Fort & Lighthouse",
        category: "Heritage / Nature · Historical Sites, Portuguese-era Island Citadel",
        timings: "09:00–17:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Korlai_Fort_and_Lighthouse.jpg/1280px-Korlai_Fort_and_Lighthouse.jpg",
        photoCredit: "Wikimedia Commons / Korlai Lighthouse",
        summary:
          "A 1521 Portuguese fort built on Morro de Chaul, an island-like headland connected by a narrow sandbar. Features ancient battlements, church ruins, and a functioning active lighthouse commanding 360-degree ocean views where Portuguese Creole is still spoken locally.",
      },
    ],
  },
  {
    id: "nashik",
    code: "IN-MH-CITY-NSK",
    name: "Nashik",
    nickname: "Wine Capital of India / Holy City of the Godavari",
    tagline: "Ancient Kumbh Mela bathing ghats, sacred Trimbakeshwar Jyotirlinga & sun-drenched vineyards",
    accentColor: "#854D0E",
    bgGradient: "from-yellow-50 via-amber-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Sula_Vineyards_Nashik.jpg/1280px-Sula_Vineyards_Nashik.jpg",
    photoCredit: "Wikimedia Commons / Sula Vineyards Nashik",
    flashcardBlurb:
      "The 'Wine Capital of India' set along the holy Godavari River, balancing ancient temple towns with expansive rolling vineyard estates.",
    topStays: [
      {
        name: "The Gateway Hotel Ambad",
        category: "Ambad (Taj Property) — Five-Star Luxury Amid 20 Acres of Manicured Gardens",
      },
      {
        name: "Sula Vineyards Resort (The Source)",
        category: "Gangapur Dam — Tuscany-Inspired Vineyard Suites Overlooking Rolling Grape Vines",
      },
      {
        name: "Express Inn",
        category: "Pathardi Phata — Modern Business & Leisure Hotel with Rooftop Lounge",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Sadhana Sweets (Chulivarchi Misal)",
          location: "Gangapur Road",
          specialties: "Famous for traditional Misal Pav simmered on woodfire chulhas, served in earthen pots with roasted papad and jalebi",
        },
        {
          restaurant: "Panchavati Gaurav",
          location: "Core City",
          specialties: "Authentic unlimited vegetarian thalis featuring seasonal subzis, hot rotis, and sweets",
        },
      ],
      nonVeg: [
        {
          restaurant: "The Tasting Room",
          location: "Sula Vineyards",
          specialties: "Contemporary Italian and pan-Indian fine dining paired with estate-produced Shiraz, Chenin Blanc, and sparkling wines",
        },
        {
          restaurant: "Sadhana Non-Veg Chulha Section",
          location: "Gangapur Road",
          specialties: "Fiery Khandeshi mutton rassa and rustic gavran country-chicken thali cooked over slow charcoal embers",
        },
      ],
      wineNote:
        "Nashik produces over 80% of India's wine, offering winery cellar tours, grape-stomping during winter harvest (Jan–Mar), and scenic barrel rooms.",
    },
    attractions: [
      {
        id: "IN-MH-NSK-ATT-001",
        name: "Kumbh Mela Sites & Kalaram Temple",
        category: "Spiritual · Hinduism, Sacred Ramayana Heritage & Godavari Ghats",
        timings: "05:30–22:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Kalaram_Temple_Nashik.jpg/1280px-Kalaram_Temple_Nashik.jpg",
        photoCredit: "Wikimedia Commons / Kalaram Temple",
        summary:
          "An 18th-century temple built entirely of jet-black polished stone by Sardar Odhekar on the sacred spot where Lord Rama, Sita, and Lakshmana stayed during their Panchavati exile. Located near Ramkund, the epicenter of the Simhastha Kumbh Mela.",
      },
      {
        id: "IN-MH-NSK-ATT-002",
        name: "Sula Vineyards Tour & Tasting",
        category: "Nature / Recreation · Agro-Tourism, India's Premier Viticulture Estate",
        timings: "11:30–22:00",
        fee: { domestic: "Tours start ~INR 500–1,000 per head", foreign: "Tours start ~INR 500–1,000 per head" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Sula_Vineyards_Nashik.jpg/1280px-Sula_Vineyards_Nashik.jpg",
        photoCredit: "Wikimedia Commons / Sula Vineyards",
        summary:
          "India's pioneering commercial winery established in 1999 along the Gangapur Dam backwaters. Offers guided estate walks through grape vineyards, barrel aging cellar tours, wine appreciation sessions, and alfresco vineyard bistros.",
      },
      {
        id: "IN-MH-NSK-ATT-003",
        name: "Trimbakeshwar Jyotirlinga",
        category: "Spiritual · Hinduism, Sacred 12 Jyotirlingas of Lord Shiva",
        timings: "05:30–21:00",
        fee: { domestic: "Free (Special VIP darshan queues optional)", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Trimbakeshwar_Temple.jpg/1280px-Trimbakeshwar_Temple.jpg",
        photoCredit: "Wikimedia Commons / Trimbakeshwar Temple",
        summary:
          "Ancient black basalt stone temple situated 28 km from Nashik at the foothills of Brahmagiri mountain, where the sacred Godavari River originates. Houses a unique three-faced lingam embodying Brahma, Vishnu, and Shiva.",
      },
      {
        id: "IN-MH-NSK-GEM-001",
        name: "Pandavleni Caves",
        category: "Heritage · Archeological Sites, 1st-century BCE Hinayana Buddhist Monasteries",
        timings: "08:00–18:00",
        fee: { domestic: "INR 25", foreign: "INR 300" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pandavleni_Caves_Cave_3.jpg/1280px-Pandavleni_Caves_Cave_3.jpg",
        photoCredit: "Wikimedia Commons / Pandavleni Caves",
        summary:
          "A group of 24 rock-cut Buddhist caves dating from the 1st century BCE to the 3rd century CE, carved into the Trirashmi hills. Features pristine Hinayana prayer halls, water cisterns, and rare Brahmi inscriptions chronicling ancient royal patrons.",
      },
    ],
  },
  {
    id: "kolhapur",
    code: "IN-MH-CITY-KOL",
    name: "Kolhapur",
    nickname: "City of Wrestlers / Historical Land of Ambabai",
    tagline: "Shakti Peetha blessings, royal Chhatrapati Shahu palaces, leather chappals & fiery Tambaada Rassa",
    accentColor: "#DC2626",
    bgGradient: "from-red-50 via-rose-50/40 to-stone-50/30",
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mahalaxmi_Temple_Kolhapur.jpg/1280px-Mahalaxmi_Temple_Kolhapur.jpg",
    photoCredit: "Wikimedia Commons / Mahalaxmi Ambabai Temple",
    flashcardBlurb:
      "A historic Maratha city known for its royal heritage, spicy culinary traditions (Kolhapuri Misal & Tambaada/Pandhra Rassa), intricate handicrafts, and the revered Mahalaxmi Temple.",
    topStays: [
      {
        name: "Sayaji Hotel Kolhapur",
        category: "Old Pune-Bangalore Highway — Flagship Five-Star Luxury with Moon Tree Cafe & Barbeque",
      },
      {
        name: "Hotel Ayodhya",
        category: "Tarabai Park — Elegant Business Comfort with Celebrated Maharashtrian Hospitality",
      },
      {
        name: "Hotel Opal",
        category: "Old Pune-Bangalore Road — Classic Heritage Stays Famous for Epicurean Kolhapuri Feasts",
      },
    ],
    dining: {
      veg: [
        {
          restaurant: "Phadtare Misal",
          location: "Udyamnagar",
          specialties: "Legendary fiery breakfast Misal prepared in groundnut oil, served with farsan, cut onions, and fresh pao",
        },
        {
          restaurant: "Hotel Opal (Veg)",
          location: "Old Pune-Bangalore Road",
          specialties: "Pure vegetarian Maharashtrian thali with Pithla, Bhakri, Shengdana Chutney, and Solkadhi",
        },
      ],
      nonVeg: [
        {
          restaurant: "Hotel Parakh or Opal",
          location: "Shahupuri & Pune-Bangalore Road",
          specialties: "Legendary non-veg thalis with fiery Mutton Sukka, red chili broth (Tambaada Rassa), soothing coconut-milk broth (Pandhra Rassa), and Solkadhi",
        },
      ],
      spicyNote:
        "Kolhapuri cuisine is celebrated for its unique pairing of two complimentary broths: the tongue-tingling red Tambaada Rassa and the aromatic coconut-and-mutton stock Pandhra Rassa.",
    },
    attractions: [
      {
        id: "IN-MH-KOL-ATT-001",
        name: "Shree Mahalaxmi (Ambabai) Temple",
        category: "Spiritual / Heritage · Hinduism, Major 7th-century Shakti Peetha",
        timings: "04:00–22:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mahalaxmi_Temple_Kolhapur.jpg/1280px-Mahalaxmi_Temple_Kolhapur.jpg",
        photoCredit: "Wikimedia Commons / Mahalaxmi Temple Kolhapur",
        summary:
          "One of the 51 sacred Shakti Peethas in India, constructed in the 7th century by the Chalukya dynasty. Houses a majestic 40-kg single-piece black stone idol of Goddess Ambabai. Celebrated for the biannual 'Kiranotsav' festival when rays of the setting sun fall directly on the deity's face.",
      },
      {
        id: "IN-MH-KOL-ATT-002",
        name: "New Palace Museum (Chhatrapati Shahu Museum)",
        category: "Heritage · Palaces & Forts, Museums, 19th-century Indo-Saracenic Royal Palace",
        timings: "09:30–18:00",
        fee: { domestic: "INR 20", foreign: "INR 50" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/New_Palace_Kolhapur.jpg/1280px-New_Palace_Kolhapur.jpg",
        photoCredit: "Wikimedia Commons / New Palace Kolhapur",
        summary:
          "Stately black-and-pink polished basalt palace completed in 1884, designed by British architect Charles Mant. The ground floor houses the Chhatrapati Shahu Museum, exhibiting personal royal armaments (including swords of Aurangzeb), silver thrones, hunting trophies, and Maratha historical documents.",
      },
      {
        id: "IN-MH-KOL-ATT-003",
        name: "Rankala Lake",
        category: "Nature / Recreation · Rivers & Lakes, Historic 9th-century Quarry Reservoir",
        timings: "Open 24 hours",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: false,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Rankala_Lake_Kolhapur.jpg/1280px-Rankala_Lake_Kolhapur.jpg",
        photoCredit: "Wikimedia Commons / Rankala Lake",
        summary:
          "A picturesque lake dating back to 9th-century stone quarries, transformed into an urban oasis with the historic Sandhya Mandap temple and the Shalini Palace along its edge. Features paved evening promenades, boat rides, and street stalls serving spicy Bhel.",
      },
      {
        id: "IN-MH-KOL-GEM-001",
        name: "Panhala Fort",
        category: "Heritage / Adventure · Palaces & Forts, Historic Sahyadri Hill Fortress",
        timings: "08:00–18:00",
        fee: { domestic: "Free", foreign: "Free" },
        isHiddenGem: true,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Panhala_Fort_Teen_Darwaza.jpg/1280px-Panhala_Fort_Teen_Darwaza.jpg",
        photoCredit: "Wikimedia Commons / Panhala Fort Teen Darwaza",
        summary:
          "Massive hill fortress situated 20 km from Kolhapur, with a perimeter of 14 km. Historically celebrated as the fortress where Chhatrapati Shivaji Maharaj was besieged by Siddi Jauhar, escaping in a daring midnight mist trek to Vishalgad through Pavankhind, valiantly defended by Baji Prabhu Deshpande.",
      },
    ],
  },
];
