export interface MizoramStay {
  name: string;
  category: string;
}

export interface MizoramFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface MizoramDining {
  veg: MizoramFoodSpot[];
  nonVeg: MizoramFoodSpot[];
  permitNotice?: string;
  culinaryNote?: string;
}

export interface MizoramAttraction {
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

export interface MizoramCity {
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
  topStays: MizoramStay[];
  dining: MizoramDining;
  attractions: MizoramAttraction[];
}

export const MIZORAM_DIRECTORY: MizoramCity[] = [
  {
    id: "aizawl",
    code: "IN-MZ-CITY-AJL",
    name: "Aizawl",
    nickname: "The Citadel on the High Ridge",
    tagline: "Dramatic cliffside cityscapes, marble cathedrals, Mizo handloom bazaars & nocturnal Durtlang vistas",
    accentColor: "#2563EB",
    bgGradient: "from-blue-50 via-indigo-50/40 to-stone-50/30",
    coverImage: "/images/mizoram/aizawl-ridge-city-view.jpg",
    photoCredit: "Discover Bharat / Aizawl City Perched on the Mountain Ridge",
    flashcardBlurb:
      "The capital of Mizoram, dramatically perched on a steep ridge, known for its pristine climate, deeply rooted Christian heritage, and the grand Solomon's Temple.",
    topStays: [
      { name: "Hotel Regency", category: "Zarkawt — Premium City Comfort & Central Access" },
      { name: "The Grand Hotel", category: "Chandmari — Contemporary Luxury & Ridge Views" },
      { name: "Hotel Floria", category: "Bara Bazar — Heart of the Commercial City" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Red Pepper",
          location: "Chanmari, Aizawl",
          specialties: "Comforting Indian and Chinese vegetarian dishes, stir-fried greens, and vegetable noodles",
        },
        {
          restaurant: "Hotel Regency Restaurant",
          location: "Zarkawt",
          specialties: "North Indian vegetarian thalis, Paneer Butter Masala, Dal Tadka, and fresh rotis",
        },
      ],
      nonVeg: [
        {
          restaurant: "David's Kitchen",
          location: "Chanmari",
          specialties: "Authentic traditional Mizo cuisine: Bai (herbal vegetable stew), Vawksa Rep (wood-smoked pork with bamboo shoot), and Sanpiau",
        },
        {
          restaurant: "Chopstyx Restaurant",
          location: "Chanmari",
          specialties: "Steaming Tibetan Thukpa, pork momos, spicy chili chicken, and Chinese comfort noodles",
        },
      ],
      permitNotice:
        "All Indian domestic tourists must obtain an Inner Line Permit (ILP), available online at ilp.mizoram.gov.in or on arrival at Lengpui Airport. International visitors no longer require a PAP but must register with the local FRO within 24 hours of arrival.",
      culinaryNote:
        "Mizoram is predominantly non-vegetarian; dedicated vegetarian dining is scarce outside major hotels. Authentic Mizo food is seasoned with local mountain herbs and pork fat, cooked largely without pungent spices or oil.",
    },
    attractions: [
      {
        id: "IN-MZ-AJL-ATT-001",
        name: "Solomon's Temple",
        category: "Spiritual: Christianity, Monumental Churches",
        timings: "09:30–16:00 (Open all days; Sunday service 10:00–12:00)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Solomon's Temple Chawlhhmun",
        summary:
          "Constructed by the Kohhran Thianghlim (Holy Church) religious society in Chawlhhmun, this monumental white marble sanctuary took over 20 years to build. Designed with four towering spires and a 3,000-seat amphitheatre interior, it is framed by natural pine forests and panoramic mountain breezes.",
      },
      {
        id: "IN-MZ-AJL-ATT-002",
        name: "Mizoram State Museum",
        category: "Heritage: Museums, Ethnographic Antiquities",
        timings: "09:30–16:00 (Closed weekends and public holidays)",
        fee: {
          domestic: "INR 20",
          foreign: "INR 50",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Mizoram State Museum",
        summary:
          "Situated at McDonald Hill, this five-tier museum chronicles the transformation of Mizo society from ancient animist warrior clans to modern times. Collections feature royal chief regalia, traditional Puan woven textiles, musical instruments, hunting spears, and life-size dioramas of ancestral village life.",
      },
      {
        id: "IN-MZ-AJL-ATT-003",
        name: "Durtlang Hills & Panoramic Ridge",
        category: "Nature: Hills & Mountains, City Viewpoints",
        timings: "Open 24 Hours (Best viewed at twilight and night)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "/images/mizoram/aizawl-ridge-city-view.jpg",
        photoCredit: "Discover Bharat / View from Durtlang Hills Overlooking Aizawl",
        summary:
          "A dramatic rocky hill range rising north of the city. Winding roads lead to elevated vantage points offering a majestic perspective of Aizawl's high-density skyline draped over mountain ridges. At night, the thousands of sparkling hillside homes resemble a giant sea of stars.",
      },
      {
        id: "IN-MZ-AJL-GEM-001",
        name: "KV Paradise",
        category: "Heritage: Monuments, Memorial Architecture",
        timings: "09:00–16:00 (Closed Sundays)",
        fee: {
          domestic: "INR 20",
          foreign: "INR 50",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / KV Paradise Mausoleum",
        summary:
          "Widely celebrated as the 'Taj Mahal of Mizoram', this pristine three-story marble mausoleum on Durtlang Hill was erected in 1999 by a grieving husband, Mr. Chhawnthu, in memory of his late wife K. Vankungi. The monument houses her wedding accessories and portraits, surrounded by landscaped fountains overlooking the valley.",
      },
      {
        id: "IN-MZ-AJL-GEM-002",
        name: "Bara Bazar",
        category: "Rural / Recreation: Live Like a Local, Frontier Bazaars",
        timings: "08:00–17:00 (Closed Sundays for Sabbath observance)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Bara Bazar Streets",
        summary:
          "The beating commercial heart of Aizawl. Women clad in traditional handwoven Puan sell organic mountain produce, bamboo shoots, fermented soybean, smoked river fish, wild honey, and intricate bamboo cane baskets across steep vertical stairways and buzzing street corners.",
      },
    ],
  },
  {
    id: "lunglei",
    code: "IN-MZ-CITY-LGL",
    name: "Lunglei",
    nickname: "The Bridge of Rock",
    tagline: "Southern hill stronghold, pristine Nghasih river gorges & wildlife sanctuaries",
    accentColor: "#0D9488",
    bgGradient: "from-teal-50 via-emerald-50/40 to-stone-50/30",
    coverImage: "/images/mizoram/lunglei-rock-bridge-river.jpg",
    photoCredit: "Discover Bharat / Natural Rock Formations and Forest Rivers in Lunglei",
    flashcardBlurb:
      'The second-largest city in Mizoram, translating to "Bridge of Rock," known for its deep forested valleys, rich biodiversity, and tranquil trekking routes.',
    topStays: [
      { name: "Hotel Elite", category: "Lunglei Town — Comfortable Central Traveler Stay" },
      { name: "Grand Hotel Lunglei", category: "Venglai — Modern Amenities & Valley Views" },
      { name: "Mizoram Tourism Tourist Lodge", category: "Zotlang — State-Run Reliable Rest House" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Tourist Lodge Dining Hall",
          location: "Zotlang, Lunglei",
          specialties: "Basic North Indian staples, yellow dal, steamed rice, and seasonal stir-fried local vegetables",
        },
        {
          restaurant: "Hotel Elite Canteen",
          location: "Town Center",
          specialties: "Puri Sabzi, vegetable fried rice, and comforting hot black tea",
        },
      ],
      nonVeg: [
        {
          restaurant: "Lunglei Town Food Hubs",
          location: "Bazar Veng",
          specialties: "Traditional Sawhchiar (flavorful Mizo rice and meat porridge), Sanpiau (rice porridge with powdered spices), and spicy pork curry",
        },
        {
          restaurant: "Hillside Mizo Kitchen",
          location: "Venglai Road",
          specialties: "Smoked beef with local mustard greens, herbal chicken stew, and fresh bamboo shoot curry",
        },
      ],
      permitNotice:
        "Visitors traveling from Aizawl to Lunglei must retain valid ILP documents as spot checks occur along national highways in southern districts.",
      culinaryNote:
        "Lunglei cuisine features comforting one-pot rice dishes such as Sawhchiar, traditionally prepared during festivals and community gatherings.",
    },
    attractions: [
      {
        id: "IN-MZ-LGL-ATT-001",
        name: "Lunglei Bridge of Rock",
        category: "Nature / Heritage: Geological Formations, Sacred Landmarks",
        timings: "Daylight hours (07:00–17:00)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "/images/mizoram/lunglei-rock-bridge-river.jpg",
        photoCredit: "Discover Bharat / Natural Rock Formations on Nghasih Stream",
        summary:
          "The legendary geological formation that gave Lunglei its name (meaning 'Bridge of Rock'). Situated along the scenic Nghasih stream roughly 30 km from the town center, this natural monolithic stone arch spans the clear forest watercourse, surrounded by towering sub-tropical trees.",
      },
      {
        id: "IN-MZ-LGL-ATT-002",
        name: "Saikuti Hall Cultural Centre",
        category: "Heritage / Arts: Museums, Folk Collections",
        timings: "10:00–16:00 (Closed Sundays)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Saikuti Hall Lunglei",
        summary:
          "Named after the celebrated Mizo female poetess Saikuti, this prominent multi-story cultural monument houses an auditorium, public library, and art gallery displaying rare ancestral artifacts, regional literature, and traditional musical instruments of southern Mizo clans.",
      },
      {
        id: "IN-MZ-LGL-GEM-001",
        name: "Khawnglung Wildlife Sanctuary",
        category: "Nature: Wildlife-Tourism, Dense Forest Reserves",
        timings: "08:00–16:00 (Best visited October to April)",
        fee: {
          domestic: "Forest Entry Permit Required (~INR 50)",
          foreign: "Forest Entry Permit Required (~INR 100)",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Khawnglung Forest Sanctuary",
        summary:
          "Spanning roughly 35 sq km at an altitude of 1,300 metres, this dense semi-evergreen wildlife haven shelters leopards, Himalayan black bears, hoolock gibbons, bark deer, and the endangered serow (the state animal of Mizoram) amidst cliffs and natural water springs.",
      },
      {
        id: "IN-MZ-LGL-GEM-002",
        name: "Thorangtlang Wildlife Sanctuary",
        category: "Nature: Wildlife-Tourism, Elephant Corridors",
        timings: "08:00–16:00 (Daylight visits)",
        fee: {
          domestic: "Forest Entry Permit Required (~INR 50)",
          foreign: "Forest Entry Permit Required (~INR 100)",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Thorangtlang Sanctuary",
        summary:
          "Located southwest of Lunglei, this 50 sq km sanctuary acts as an international wildlife corridor for wild Asian elephants migrating from the Chittagong Hill Tracts in Bangladesh. The dense bamboo jungle is also an orchid sanctuary home to hundreds of rare bird species.",
      },
    ],
  },
  {
    id: "champhai",
    code: "IN-MZ-CITY-CMP",
    name: "Champhai",
    nickname: "The Rice Bowl of Mizoram",
    tagline: "Expansive fertile valley plains, sacred heart-shaped Rih Dil & pristine Murlen rainforests",
    accentColor: "#D97706",
    bgGradient: "from-amber-50 via-orange-50/40 to-stone-50/30",
    coverImage: "/images/mizoram/champhai-rih-dil-lake.png",
    photoCredit: "Discover Bharat / Sacred Heart-Shaped Rih Dil Lake",
    flashcardBlurb:
      'The "Rice Bowl of Mizoram," a vibrant commercial town on the Indo-Myanmar border offering sweeping views of the Myanmar hills and access to the sacred Rih Dil lake.',
    topStays: [
      { name: "Champhai Tourist Lodge", category: "Chhangphut — State-Run Resort with Valley Views" },
      { name: "Chawngthu Hotel", category: "Champhai Bazaar — Central Commercial Base" },
      { name: "Zokhawthar Border Guest House", category: "Zokhawthar — Frontier Stay near Rih Dil" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Tourist Lodge Dining Canteen",
          location: "Champhai Ridge",
          specialties: "Simple vegetarian thalis, yellow dal, steamed rice, and fresh hill cabbage with ginger",
        },
        {
          restaurant: "Champhai Valley Canteen",
          location: "Bazaar Area",
          specialties: "Puri Bhaji, sweet milky tea, and vegetable fried noodles",
        },
      ],
      nonVeg: [
        {
          restaurant: "Zokhawthar Border Stalls",
          location: "Indo-Myanmar Border Checkpoint",
          specialties: "Burmese noodle soup, crispy pork cracklings, spiced smoked beef curry, and sticky hill rice",
        },
        {
          restaurant: "Local Champhai Diners",
          location: "Main Market",
          specialties: "Traditional Mizo Vawksa (pork) with fermented bamboo shoot, boiled country chicken, and fiery red chili relish",
        },
      ],
      permitNotice:
        "Champhai is located near the international border. Excursions to Rih Dil (just inside Myanmar) require local cross-border clearance at the Zokhawthar Land Customs Station.",
      culinaryNote:
        "Champhai’s flat valley floor produces Mizoram’s finest aromatic rice varieties, complemented by border trade introducing Burmese seasonings and tea culture.",
    },
    attractions: [
      {
        id: "IN-MZ-CMP-ATT-001",
        name: "Rih Dil (Sacred Heart-Shaped Lake)",
        category: "Nature / Spiritual: Rivers & Lakes, International Borders",
        timings: "08:00–16:00 (Best daylight hours; Access via Zokhawthar border)",
        fee: {
          domestic: "Nominal border crossing token fee (~INR 20–50)",
          foreign: "Border clearance subject to bilateral transit rules",
        },
        isHiddenGem: false,
        image: "/images/mizoram/champhai-rih-dil-lake.png",
        photoCredit: "Discover Bharat / Rih Dil Lake",
        summary:
          "A stunning natural heart-shaped lake situated approximately 3 km across the international boundary inside Myanmar, traditionally accessed through Zokhawthar. In ancestral Mizo mythology, Rih Dil was revered as the sacred passage through which departed souls journey to Mitthi Khua (the celestial realm of the dead).",
      },
      {
        id: "IN-MZ-CMP-ATT-002",
        name: "Murlen National Park",
        category: "Nature: Wildlife-Tourism, Virgin Rain Canopies",
        timings: "08:00–16:00 (Forest entry permit required)",
        fee: {
          domestic: "Forest Entry Permit (~INR 50)",
          foreign: "Forest Entry Permit (~INR 200)",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Murlen National Park",
        summary:
          "Often compared to the Amazon rainforest due to its towering multi-layered virgin canopy where less than 1% of sunlight reaches the forest floor even at noon. Located 40 km from Champhai, it shelters endangered Hume's Pheasant, Malayan Giant Squirrels, Clouded Leopards, and centuries-old moss-draped trees.",
      },
      {
        id: "IN-MZ-CMP-GEM-001",
        name: "Thasiama Seno Neihna",
        category: "Nature / Heritage: Hills & Mountains, Legendary Peaks",
        timings: "Daylight hours (08:00–16:00)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Thasiama Plateau",
        summary:
          "A rugged, precipitous plateau rising 86 km from Champhai near Vaphai village. According to Mizo folklore, a legendary farmer named Thasiama had a mythical Mithun that miraculously gave birth on this inaccessible rocky crag, protected from prowling tigers by celestial spirits.",
      },
      {
        id: "IN-MZ-CMP-GEM-002",
        name: "Lianchhiari Lunglen Tlang",
        category: "Nature: Scenic Cliff Viewpoints, Tragic Love Legends",
        timings: "Daylight hours (07:00–17:00)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Lianchhiari Viewpoint",
        summary:
          "A soaring rocky cliff ledge near Dungtlang village offering dramatic views of the rolling hills toward Myanmar. Folklore recalls how the legendary Mizo maiden Lianchhiari spent her days weeping here gazing across the valley toward the village where her exiled lover Chawngfianga had departed.",
      },
    ],
  },
  {
    id: "reiek",
    code: "IN-MZ-CITY-REK",
    name: "Reiek",
    nickname: "Heritage Peak of the Mizo Chieftains",
    tagline: "Spectacular knife-edge ridge trek, authentic tribal village huts & Anthurium festival blooms",
    accentColor: "#15803D",
    bgGradient: "from-emerald-50 via-teal-50/40 to-stone-50/30",
    coverImage: "/images/mizoram/reiek-tlang-mountain-peak.jpg",
    photoCredit: "Discover Bharat / Grassy Ridgeline of Reiek Tlang",
    flashcardBlurb:
      "A pristine heritage village set against a dramatic mountain backdrop, preserving traditional Mizo chief houses and serving as the heart of the annual Anthurium Festival.",
    topStays: [
      { name: "Reiek Tourist Resort", category: "Reiek Peak Foothills — State Tourism Eco-Cottages" },
      { name: "Reiek Community Village Homestays", category: "Reiek Village — Authentic Mizo Hospitality" },
      { name: "Aizawl City Hotels", category: "Day-Trip Base — Only 30 km / 1-hour drive away" },
    ],
    dining: {
      veg: [
        {
          restaurant: "Reiek Tourist Resort Canteen",
          location: "Resort Complex",
          specialties: "Basic North Indian vegetarian meals, dal, mixed vegetable curry, and steamed rice",
        },
        {
          restaurant: "Village Tea Stalls",
          location: "Reiek Trailhead",
          specialties: "Hot local tea, boiled hill sweet corn, and vegetable fritters",
        },
      ],
      nonVeg: [
        {
          restaurant: "Reiek Resort Dining Hall",
          location: "Reiek Foothills",
          specialties: "Local style chicken curry with mountain herbs, boiled pork with bamboo shoot, and Bai stew",
        },
        {
          restaurant: "Reiek Village Homestay Kitchens",
          location: "Reiek Village",
          specialties: "Authentic Mizo Vawksa Rep, roasted meats, and organic red hill rice",
        },
      ],
      permitNotice:
        "Reiek is accessible on a 30 km day-trip from Aizawl. Visitors should keep their Mizoram ILP credentials handy during road travel.",
      culinaryNote:
        "Local village kitchens serve organic, garden-grown squash, mustard greens, and mountain ginger grown on pesticide-free terraced slopes.",
    },
    attractions: [
      {
        id: "IN-MZ-REK-ATT-001",
        name: "Reiek Tlang (Peak) Trek",
        category: "Nature / Adventure: Hiking & Trekking, Hills & Mountains",
        timings: "Daylight hours (06:00–16:30; Trek takes approx. 1 to 1.5 hours)",
        fee: {
          domestic: "Free",
          foreign: "Free",
        },
        isHiddenGem: false,
        image: "/images/mizoram/reiek-tlang-mountain-peak.jpg",
        photoCredit: "Discover Bharat / Reiek Tlang Mountain Peak",
        summary:
          "Rising to 1,548 metres above sea level, Reiek Tlang features a scenic hike through dense, sub-tropical forests alive with singing birds before emerging onto a breathtaking open grassy cliff ridge. The summit drops dramatically into vertical rock walls, offering vistas all the way to the plains of Bangladesh on clear days.",
      },
      {
        id: "IN-MZ-REK-ATT-002",
        name: "Reiek Heritage Village",
        category: "Rural / Arts: Tribal-Tourism, Live Like a Local",
        timings: "09:00–17:00 (Open all days)",
        fee: {
          domestic: "INR 20",
          foreign: "INR 50",
        },
        isHiddenGem: false,
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Reiek Heritage Village",
        summary:
          "A living cultural museum recreating a traditional 19th-century Mizo village. Features reconstructed bamboo-thatched residences including the grand Lal In (Chief's House), the Zawlbuk (bachelor's dormitory), blacksmith quarters, and granaries, illustrating ancient social customs.",
      },
      {
        id: "IN-MZ-REK-GEM-001",
        name: "Khuangchera Puk (Cave)",
        category: "Adventure / Nature: Geological Caves, Spelunking",
        timings: "09:00–15:00 (Guide and headlamps required)",
        fee: {
          domestic: "Guide fee varies (~INR 200–500)",
          foreign: "Guide fee varies (~INR 200–500)",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Khuangchera Cave",
        summary:
          "Located near Ailawng village close to Reiek, this 162-metre-long natural cavern is the second longest cave in Mizoram. Named after the legendary Mizo warrior Khuangchera, it offers an authentic spelunking experience through tight rock passages, underground chambers, and limestone formations.",
      },
      {
        id: "IN-MZ-REK-GEM-002",
        name: "Anthurium Festival Ground",
        category: "Rural / Recreation: Living Traditions, Floral Exhibitions",
        timings: "Seasonal (Annual festival held in September/October)",
        fee: {
          domestic: "Festival Entry Varies (Nominal)",
          foreign: "Festival Entry Varies (Nominal)",
        },
        isHiddenGem: true,
        image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
        photoCredit: "Virasat Archive / Anthurium Festival Grounds",
        summary:
          "Nestled at the base of Reiek peak, this picturesque ground comes alive every autumn during the state's flagship tourism festival. The celebration showcases Mizoram's booming export-quality anthurium blossoms, traditional Cheraw bamboo dances, indigenous archery contests, and acoustic Mizo music.",
      },
    ],
  },
];
