export interface NagalandStay {
  name: string;
  category: string;
}

export interface NagalandFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface NagalandDining {
  veg: NagalandFoodSpot[];
  nonVeg: NagalandFoodSpot[];
  permitNotice?: string;
  culinaryNote?: string;
}

export interface NagalandAttraction {
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

export interface NagalandCity {
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
  topStays: NagalandStay[];
  dining: NagalandDining;
  attractions: NagalandAttraction[];
}

export const NAGALAND_DIRECTORY: NagalandCity[] = [
  {
    id: 'kohima',
    code: 'IN-NL-CITY-KOH',
    name: 'Kohima',
    nickname: 'Land of Warriors & The Hornbill Festival',
    tagline: 'Heroic WWII battlefield memories, vibrant Kisama Morungs, green Khonoma & emerald Dzukou valleys',
    accentColor: '#DC2626',
    bgGradient: 'from-rose-50 via-amber-50/40 to-stone-50/30',
    coverImage: '/images/nagaland/kohima-war-cemetery.jpg',
    photoCredit: 'Discover Bharat / Kohima War Cemetery on Garrison Hill',
    flashcardBlurb:
      'The capital of Nagaland, famous for the heroic WWII Battle of Kohima, Angami Naga heritage, and the spectacular annual Hornbill Festival celebrating the state’s vibrant tribal diversity.',
    topStays: [
      { name: 'Hotel Vivor', category: 'Near Secretariat — Premium Comfort & Panoramic Views' },
      { name: 'The Heritage', category: 'Old DC Bungalow, Officers Hill — Colonial Charm' },
      { name: 'Niraamaya Retreats Aradura', category: 'Aradura Hill — Luxury Hillside Wellness' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Dream Cafe',
          location: "Ser's Bazaar, High School Junction",
          specialties: 'Valley-view coffee, pasta, sandwiches, vegetable momos, and fresh bakes',
        },
        {
          restaurant: 'Hotel Vivor Restaurant',
          location: 'Secretariat Road',
          specialties: 'North Indian vegetarian curries, Paneer butter masala, Dal Makhani, and warm naans',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Oking A Naga Kitchen',
          location: 'Near Old Tata Mobile Stand',
          specialties: 'Authentic Angami Naga thali featuring smoked pork with bamboo shoot, Axone, and fiery Raja Mircha',
        },
        {
          restaurant: 'Ozone Cafe',
          location: 'PR Hill, Kohima',
          specialties: 'Tender pork ribs, local beef curry, smoked meat platters, and burgers',
        },
      ],
      permitNotice:
        'All Indian domestic visitors require an Inner Line Permit (ILP), obtainable online at ilp.nagaland.gov.in. International visitors must register at the local Foreigners Registration Office (FRO) within 24 hours of arrival.',
      culinaryNote:
        'Nagaland is predominantly non-vegetarian; traditional meals feature wood-smoked pork or beef seasoned with fermented bamboo shoot, Axone (fermented soya), and King Chili without cooking oil.',
    },
    attractions: [
      {
        id: 'IN-NL-KOH-ATT-001',
        name: 'Kohima War Cemetery & Garrison Hill',
        category: 'Heritage: Historical Sites, WWII Memorials',
        timings: '09:00–16:00 (Open daily)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: '/images/nagaland/kohima-war-cemetery.jpg',
        photoCredit: 'Discover Bharat / Kohima War Cemetery',
        summary:
          'Constructed on the terraced battlefield of Garrison Hill where Allied and Japanese troops clashed in ferocious close-quarter combat in 1944. Maintained by the Commonwealth War Graves Commission, it contains 1,420 bronze graves and bears the world-famous Kohima Epitaph: "When You Go Home, Tell Them Of Us And Say, For Your Tomorrow, We Gave Our Today."',
      },
      {
        id: 'IN-NL-KOH-ATT-002',
        name: 'Kisama Heritage Village (Hornbill Venue)',
        category: 'Rural / Arts: Tribal-Tourism, Cultural Heritage',
        timings: '08:00–18:00 (Year-round; Grand Hornbill Festival held 1–10 December)',
        fee: {
          domestic: 'INR 50–100 (During Hornbill Festival)',
          foreign: 'INR 50–100 (During Hornbill Festival)',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Kisama Heritage Village',
        summary:
          'Located 12 km from Kohima at the foothills of Mount Japfu, Kisama serves as the permanent open-air cultural village for the "Festival of Festivals" (Hornbill Festival). It features authentic full-scale Morungs (traditional bachelor dormitories) representing all 16 recognized tribes of Nagaland, complete with carved totem gates and log drums.',
      },
      {
        id: 'IN-NL-KOH-ATT-003',
        name: 'Kohima State Museum',
        category: 'Heritage / Arts: Museums, Ethnographic Collections',
        timings: '09:30–15:00 (Closed Mondays and state holidays)',
        fee: {
          domestic: 'INR 20',
          foreign: 'INR 50',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / State Museum Kohima',
        summary:
          'Located in Upper Bayavu Hill, this museum offers an invaluable introduction to Naga anthropology. Collections include ceremonial hornbill feathers, cowrie-shell jewelry, ancestral headhunting weaponry, carved wooden log drums, and life-size dioramas depicting traditional village occupations.',
      },
      {
        id: 'IN-NL-KOH-GEM-001',
        name: 'Dzukou Valley Trek',
        category: 'Nature / Adventure: Hiking & Trekking, High Altitude Valleys',
        timings: 'Multi-day trek (Best season June–September for lilies; October–March for clear skies)',
        fee: {
          domestic: 'Entry ~INR 100 (Guide & Porter charges extra)',
          foreign: 'Entry ~INR 100 (FRO registration required)',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Dzukou Valley Landscape',
        summary:
          'Sitting at 2,452 metres on the border of Nagaland and Manipur, this ethereal valley is celebrated as the "Valley of Flowers of the Northeast." Characterized by rolling emerald-green bamboo hills and serpentine crystal streams, it is the exclusive home of the rare, pale violet Dzukou Lily (Lilium chitrangadae).',
      },
      {
        id: 'IN-NL-KOH-GEM-002',
        name: 'Khonoma Green Village',
        category: 'Rural / Nature: Eco-Tourism, Sustainable Villages',
        timings: 'Daylight hours (07:00–17:00)',
        fee: {
          domestic: 'Village Entry INR 50',
          foreign: 'Village Entry INR 50',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Khonoma Terraced Valley',
        summary:
          'A historic 700-year-old Angami settlement known for fierce resistance against British colonial expansion. Today it is celebrated as India’s first green village, having banished commercial logging and hunting in 1998 to establish the 20 sq km Khonoma Nature Conservation and Tragopan Sanctuary, while practicing ancient alder-based terraced cultivation.',
      },
    ],
  },
  {
    id: 'dimapur',
    code: 'IN-NL-CITY-DMU',
    name: 'Dimapur',
    nickname: 'Ancient Gateway of the Kacharis',
    tagline: '10th-century monolithic mushroom pillars, vibrant cross-border markets & wildlife sanctuaries',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: '/images/nagaland/dimapur-kachari-ruins.jpg',
    photoCredit: 'Discover Bharat / 10th-Century Mushroom Pillars at Kachari Ruins',
    flashcardBlurb:
      'The commercial hub and primary gateway to Nagaland, reflecting an ancient Kachari kingdom heritage juxtaposed against bustling modern markets and transit corridors.',
    topStays: [
      { name: 'Hotel Niathu Resort', category: 'Chumukedima — Luxury Sprawling Riverside Retreat' },
      { name: 'Zone Niathu by The Park', category: 'Chumukedima — Contemporary Boutique Luxury' },
      { name: 'Hotel Saramati', category: 'Circular Road, City Center — Convenient Transit Base' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Plaza Restaurant',
          location: 'NL Road, Dimapur',
          specialties: 'Popular North Indian vegetarian thalis, Paneer Tikka, Chowmein, and South Indian dosas',
        },
        {
          restaurant: 'Fresh Bite',
          location: 'Circular Road',
          specialties: 'Clean vegetarian meals, Dal Tadka, mixed vegetable curry, and refreshing beverages',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Ethnic Table',
          location: 'Old NST Road',
          specialties: 'Signature Naga smoked pork with Axone (fermented soybean), dry fish chutney, and sticky rice',
        },
        {
          restaurant: 'The Naga Bowl Express',
          location: 'Christian Colony',
          specialties: 'Excellent introductory Naga combo bowls with smoked chicken, boiled seasonal greens, and spicy Raja Mircha relish',
        },
      ],
      permitNotice:
        'Dimapur is Nagaland’s sole railhead and airport hub. While travelers transit freely in city zones, an ILP is mandatory for moving past Chumukedima into Kohima and other hill districts.',
      culinaryNote:
        'As Nagaland’s commercial crossroad, Dimapur offers both authentic indigenous Naga kitchens and multi-cuisine North Indian & Assamese dhabas.',
    },
    attractions: [
      {
        id: 'IN-NL-DMU-ATT-001',
        name: 'Kachari Ruins (Rajbari)',
        category: 'Heritage: Archaeological Sites, Ancient Megaliths',
        timings: 'Daylight hours (08:00–17:00)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: '/images/nagaland/dimapur-kachari-ruins.jpg',
        photoCredit: 'Discover Bharat / Kachari Monoliths at Rajbari',
        summary:
          'Dating back to the 10th-century Kachari Kingdom prior to the Ahom invasion, this protected archaeological garden contains remarkable carved sandstone megaliths. The enigmatic mushroom-domed pillars and V-shaped carved stones represent ancient fertility cults and battlefield victory markers.',
      },
      {
        id: 'IN-NL-DMU-ATT-002',
        name: 'Nagaland Zoological Park',
        category: 'Nature: Wildlife-Tourism, Conservation Sanctuaries',
        timings: '09:00–16:00 (Closed Mondays)',
        fee: {
          domestic: 'INR 10–20',
          foreign: 'INR 100',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Nagaland Zoo Dimapur',
        summary:
          'Spread over 176 hectares of undulating forested slopes 6 km from Dimapur, this rescue and conservation center shelters endangered fauna of Northeast India, including the state bird Blyth’s Tragopan, Hoolock Gibbons, Himalayan Black Bears, and Great Indian Hornbills.',
      },
      {
        id: 'IN-NL-DMU-ATT-003',
        name: 'Hong Kong Market',
        category: 'Rural / Recreation: Shopping, Frontier Bazaars',
        timings: '09:00–18:00 (Closed Sundays)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Hong Kong Market Dimapur',
        summary:
          'Located in the heart of town near the railway station, this bustling commercial hub is famed for imported Southeast Asian electronics, apparel, Korean blankets, traditional handloom textiles, and lively street food corners.',
      },
      {
        id: 'IN-NL-DMU-GEM-001',
        name: 'Triple Falls, Seithekima',
        category: 'Nature / Adventure: Rivers & Lakes, Hiking & Trekking',
        timings: '08:00–16:00 (Best during post-monsoon September–November)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Triple Falls Seithekima',
        summary:
          'A three-tier natural waterfall nestled within the bamboo-clad hills of Seithekima village. The streams plunge into a wide, clear natural pool surrounded by dense forest, providing a popular trek and picnic getaway from the plains.',
      },
      {
        id: 'IN-NL-DMU-GEM-002',
        name: 'Chumukedima Village & Waterfall Viewpoint',
        category: 'Nature / Rural: Hills & Mountains, Foothill Gateways',
        timings: 'Daylight hours (06:00–18:00)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Chumukedima Heights',
        summary:
          'Historically the first headquarters of the Naga Hills District under the British in the 19th century, this picturesque foothill settlement on the Chathe River offers cliff viewpoints with sweeping panoramic views overlooking the vast lights and plains of Dimapur.',
      },
    ],
  },
  {
    id: 'mokokchung',
    code: 'IN-NL-CITY-MOK',
    name: 'Mokokchung',
    nickname: 'Cultural Heart of the Ao Nagas',
    tagline: 'Ancient ridgeline villages, ancestral log drums, rhododendron cliffs & Moatsu festival songs',
    accentColor: '#059669',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: '/images/nagaland/mokokchung-ao-village.jpg',
    photoCredit: 'Discover Bharat / Traditional Ao Naga Ridgeline Settlement',
    flashcardBlurb:
      'The cultural and intellectual heartland of the Ao Naga tribe, characterized by picturesque ridgeline villages, rich folklore, and vibrant Moatsu and Tsungremong festivals.',
    topStays: [
      { name: 'Whispering Winds', category: 'Mokokchung Town — Comfortable Hilltop Stay with Valley Views' },
      { name: 'Hotel Metsuben', category: 'City Center — Traditional Ao Hospitality & Comfort' },
      { name: 'Ao Naga Village Homestays', category: 'Ungma & Mopungchuket — Authentic Cultural Immersion' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Town Bakeries & Tea Lounges',
          location: 'Mokokchung Main Square',
          specialties: 'Fresh milk breads, vegetable patties, butter cookies, and hot local black tea',
        },
        {
          restaurant: 'Metsuben Restaurant',
          location: 'Hotel Metsuben',
          specialties: 'Basic North Indian vegetarian curries, yellow dal, steamed rice, and mixed vegetable stir-fry',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Local Town Cafes & Homestays',
          location: 'Ungma & Mokokchung Town',
          specialties: 'Authentic Ao Naga pork cooked with Anishi (fermented yam leaf cakes), bamboo shoot chicken, and river crabs',
        },
        {
          restaurant: 'Bamboo Shoot Kitchen',
          location: 'Near Old Bus Stand',
          specialties: 'Smoked beef with Naga dal, fermented soya relish, and spicy Raja Mircha chutneys',
        },
      ],
      permitNotice:
        'Mokokchung is an interior hill district; valid ILP documentation is checked by Nagaland Police checkpoints when traveling along the Mariani-Mokokchung route from Assam or from Kohima.',
      culinaryNote:
        'The Ao Nagas are celebrated for inventing "Anishi" — carefully fermented and smoke-dried paste patties of colocasia/yam leaves that lend a distinctive deep savory umami to meats.',
    },
    attractions: [
      {
        id: 'IN-NL-MOK-ATT-001',
        name: 'Ungma Village',
        category: 'Rural / Heritage: Living Traditions, Ao Naga Folklore',
        timings: '08:00–17:00 (Open daily)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: '/images/nagaland/mokokchung-ao-village.jpg',
        photoCredit: 'Discover Bharat / Ungma Village Ridges',
        summary:
          'Located 3 km south of Mokokchung, Ungma is the oldest, largest, and most revered ancestral settlement of the Ao Naga tribe. Legend recounts that the entire Ao community branched out from here. Visitors can view colossal wooden log drums, Baptist historical landmarks, and traditional Angh-style village council halls.',
      },
      {
        id: 'IN-NL-MOK-ATT-002',
        name: 'Longkhum Village & Rhododendron Cliffs',
        category: 'Nature / Rural: Hills & Mountains, High Altitude Vistas',
        timings: 'Daylight hours (07:00–17:00)',
        fee: {
          domestic: 'Nominal Village Entry INR 20–50',
          foreign: 'Nominal Village Entry INR 20–50',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Longkhum Village View',
        summary:
          'Perched at an elevation of 1,846 metres, Longkhum was historically the "vanguard" defensive village of the Ao tribe during headhunting conflicts. Famed for its spring rhododendron blooms, stone footprint trails of mythical lovers, and sheer limestone cliff lookouts offering uninterrupted vistas towards the snow-covered Himalayan peaks of Arunachal.',
      },
      {
        id: 'IN-NL-MOK-ATT-003',
        name: 'Mokokchung District Museum',
        category: 'Heritage: Museums, Tribal Antiquities',
        timings: '10:00–15:00 (Closed Sundays and public holidays)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Mokokchung Museum',
        summary:
          'Houses an intimate, carefully curated repository of Ao Naga artifacts. Exhibits include distinctive black-and-red Tsungkotepsu warrior shawls, boar-tusk headgear, brass horn neckpieces, wooden smoking pipes, and ancient agricultural implements.',
      },
      {
        id: 'IN-NL-MOK-GEM-001',
        name: 'Langpangkong Caves',
        category: 'Adventure / Heritage: Geological Caves, Historic Shelters',
        timings: 'Daylight hours (08:00–16:00)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Langpangkong Caves',
        summary:
          'Located in the Langpangkong mountain range between Dikhu and Tzula rivers, this natural cavern system is steeped in folklore. An Ahom prince named Godapani reputedly found sanctuary here in the 17th century while fleeing royal purges, protected by local Ao chieftains.',
      },
      {
        id: 'IN-NL-MOK-GEM-002',
        name: 'Chuchuyimlang Cultural Village',
        category: 'Rural / Arts: Living Traditions, Spring Festivals',
        timings: '08:00–17:00 (Best during Moatsu Festival in early May)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Chuchuyimlang Festival Ground',
        summary:
          'A scenic village clinging to a high mountain ridge that serves as the prime host for the vibrant Moatsu Mong festival in May. Residents in elaborate feathered headdresses perform rhythmic warrior dances, fire-making rituals, and community feast songs celebrating post-sowing blessings.',
      },
    ],
  },
  {
    id: 'mon',
    code: 'IN-NL-CITY-MON',
    name: 'Mon',
    nickname: 'Land of the Tattooed Konyak Headhunters',
    tagline: 'Border-splitting Longwa palace, last tattooed warrior elders, ancestral Morungs & Veda peak',
    accentColor: '#7C3AED',
    bgGradient: 'from-purple-50 via-rose-50/40 to-stone-50/30',
    coverImage: '/images/nagaland/mon-longwa-konyak-village.jpg',
    photoCredit: 'Discover Bharat / Longwa Village Ridgeline Spanning India & Myanmar',
    flashcardBlurb:
      'The remote, rugged territory of the Konyak Nagas—historically famed as fierce headhunters with distinct facial tattoos—spanning across the India-Myanmar border.',
    topStays: [
      { name: 'Helsa Resort', category: 'Mon Town Outskirts — Basic Eco-Cottages with Mountain Views' },
      { name: 'Paramount Guest House', category: 'Mon Town — Simple Local Traveler Guesthouse' },
      { name: 'Traditional Konyak Homestays', category: 'Longwa Village — Living inside the Border Hamlet' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Mon Town Tea Stalls',
          location: 'Mon Town Market',
          specialties: 'Simple black tea, basic dal, white rice, and boiled wild cabbage or squash leaves',
        },
        {
          restaurant: 'Longwa Homestay Kitchens',
          location: 'Longwa Ridge',
          specialties: 'Fresh mountain potatoes, organic boiled hill greens, and plain steamed rice (advance request essential)',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Authentic Konyak Homestay Dining',
          location: 'Longwa & Chui Villages',
          specialties: 'Hardwood woodfire-smoked pork, local beef with fresh ginger, and traditional rice beer served in bamboo mugs',
        },
        {
          restaurant: 'Borderside Eatery',
          location: 'Longwa Gate',
          specialties: 'Smoked meat stew with fiery local chilies, boiled forest herbs, and mountain red rice',
        },
      ],
      permitNotice:
        'Mon is a sensitive frontier district bordering Myanmar. Domestic tourists must carry a verified ILP; foreign travelers must ensure valid passport visas and FRO documentation for border travel.',
      culinaryNote:
        'Dining in Mon is deeply traditional and rustic; travelers dine alongside Konyak families around hearth woodfires in long wooden thatched houses.',
    },
    attractions: [
      {
        id: 'IN-NL-MON-ATT-001',
        name: "Longwa Village & The Angh's Border House",
        category: 'Rural / Heritage: International Borders, Living Royalty',
        timings: 'Daylight hours (07:00–16:30)',
        fee: {
          domestic: 'Free (Small courtesy gift or buying handicrafts from the Angh expected)',
          foreign: 'Free (Courtesy donations recommended)',
        },
        isHiddenGem: false,
        image: '/images/nagaland/mon-longwa-konyak-village.jpg',
        photoCredit: 'Discover Bharat / Longwa Village Ridge',
        summary:
          'A world-unique settlement where the international boundary between India and Myanmar literally bisects the village and cuts directly through the middle of the Angh’s (hereditary King’s) royal residence. The Angh sleeps in India and dines in Myanmar, ruling over dozens of Konyak villages across both nations without border restrictions.',
      },
      {
        id: 'IN-NL-MON-ATT-002',
        name: 'Konyak Naga Facial Tattoos & Ancestral Morungs',
        category: 'Rural / Arts: Tribal-Tourism, Vanishing Traditions',
        timings: 'Dependent on village elder permissions (Daylight hours)',
        fee: {
          domestic: 'Discretionary (Donations and purchasing local woodcrafts recommended)',
          foreign: 'Discretionary (Donations and purchasing local woodcrafts recommended)',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Konyak Elders & Carved Morungs',
        summary:
          'An extraordinary opportunity to meet the last generation of Konyak warrior elders who bear intricate facial tattoos earned during historical headhunting expeditions prior to the 1960s. Village Morungs feature massive log drums, carved wooden pillars displaying animal motifs, and brass neck collars.',
      },
      {
        id: 'IN-NL-MON-ATT-003',
        name: 'Veda Peak (Mount Chinghan)',
        category: 'Nature / Adventure: Hills & Mountains, Panoramic Summits',
        timings: 'Early morning hours recommended (05:30–10:00)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Veda Peak Summit',
        summary:
          'Located roughly 70 km from Mon town, Veda Peak is the highest geographical crest in the district. On crisp clear mornings, the vantage point affords a breathtaking double panorama: looking west reveals the glistening Brahmaputra river plains of Assam, while looking east reveals the Chindwin river valley in Myanmar.',
      },
      {
        id: 'IN-NL-MON-GEM-001',
        name: 'Chui Village (Basti)',
        category: 'Rural: Living Traditions, Traditional Konyak Hamlets',
        timings: 'Daylight hours (08:00–16:00)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Chui Village Homes',
        summary:
          'Located just 8 km from Mon town, Chui is an exceptionally preserved traditional Konyak village. Palm-thatched royal residences display historical trophy horns and intricate woodcarvings, offering an intimate perspective on centuries-old clan governance.',
      },
      {
        id: 'IN-NL-MON-GEM-002',
        name: 'Shangnyu Village & Sacred Wooden Monument',
        category: 'Heritage / Rural: Sacred Art, Ancient Relics',
        timings: 'Daylight hours (08:00–16:00)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Shangnyu Wooden Carving',
        summary:
          'Ruled by a prominent Angh, Shangnyu is celebrated for an intricately carved solid wooden monument measuring 8 feet in height and 12 feet in breadth. Local folklore attributes its creation to heavenly spirits, adorned with motifs of human figures, tigers, hornbills, and celestial constellations.',
      },
    ],
  },
];
