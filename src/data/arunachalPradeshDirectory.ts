export interface ArunachalStay {
  name: string;
  category: string;
}

export interface ArunachalFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface ArunachalDining {
  veg: ArunachalFoodSpot[];
  nonVeg: ArunachalFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface ArunachalAttraction {
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

export interface ArunachalCity {
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
  topStays: ArunachalStay[];
  dining: ArunachalDining;
  attractions: ArunachalAttraction[];
}

export const ARUNACHAL_TRAVEL_REQUIREMENTS = {
  domestic: {
    title: 'Inner Line Permit (ILP) Mandatory for Indian Nationals',
    details:
      'All Indian citizens visiting Arunachal Pradesh must obtain an Inner Line Permit (ILP) issued by the Government of Arunachal Pradesh (apply online via arunachalilp.com or e-ILP counters at Guwahati, Tezpur, Naharlagun, and Dibrugarh). Standard validity is 15–30 days.',
  },
  international: {
    title: 'Protected Area Permit (PAP) for Foreign Tourists',
    details:
      'International travelers require a Protected Area Permit (PAP) granted by the Ministry of Home Affairs / Resident Commissioner in New Delhi or Home Commissioner in Itanagar. Foreign tourists must typically travel in groups of two or more via registered tour operators.',
  },
  borderPasses: {
    title: 'Civilian & Army Passes for High-Altitude Border Zones (Bum La & Madhuri Lake)',
    details:
      'High-altitude sensitive frontier zones such as Bum La Pass (4,600 m) on the McMahon Line require an additional civilian pass issued by the Deputy Commissioner (DC) Office in Tawang, countersigned by the Indian Army Brigade Headquarters. Restricted to Indian nationals.',
  },
};

export const ARUNACHAL_PRADESH_DIRECTORY: ArunachalCity[] = [
  {
    id: 'tawang',
    code: 'IN-AR-CITY-TWG',
    name: 'Tawang',
    nickname: 'The Land of the Monpas & Celestial Monastery',
    tagline: 'Highland Alpine Tarns, 1680 Fortified Gompas, and Border Passes',
    accentColor: '#D97706',
    bgGradient: 'from-amber-950/60 via-stone-900/40 to-slate-950/70',
    flashcardBlurb:
      '"The Land of the Monpas" perched at 3,048 metres near the Bhutan and Tibet frontiers, world-renowned for India\'s largest Buddhist monastery, alpine glacial tarns, and war memorials.',
    coverImage: '/images/arunachal/tawang-monastery.jpg',
    photoCredit: 'User Photo / Tawang Monastery Ridge Panorama',
    topStays: [
      { name: 'Vivanta Arunachal Pradesh, Tawang', category: 'Luxury Mountain Resort with Himalayan Panoramas' },
      { name: 'Dewa Elegance', category: 'Old Market — Premium Comfort & Warm Tibetan Hospitality' },
      { name: 'Hotel Dekhang', category: 'Town Center — Traditional Monpa Decor & Panoramic Views' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Woodland Restaurant',
          location: 'Old Market',
          specialties: 'Steamed vegetable Tingmo, vegetable Thukpa, hot butter salt tea (Po Cha), and fried rice',
        },
        {
          restaurant: 'Dharma Coffee House',
          location: 'Near Monastery',
          specialties: 'Fresh artisan bakes, toasted cheese sandwiches, organic honey, and aromatic Monpa herbal tea',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Orange Restaurant',
          location: 'Nehru Market',
          specialties: 'Authentic Monpa pork curry with bamboo shoots, Zan (millet porridge), Gyapa Khazi (spiced rice), and chicken Khow Suey',
        },
        {
          restaurant: 'Dragon Restaurant',
          location: 'Old Market',
          specialties: 'Juicy Tibetan pork and chicken momos, spicy chilli pork, mutton broth, and crispy noodles',
        },
      ],
      peacefulNote:
        'Tawang cuisine is infused with high-altitude Tibetan warmth: freshly steamed Tingmo bread, butter tea (Po Cha) whisked in wooden churns, and local dry yak cheese (Churpi).',
    },
    attractions: [
      {
        id: 'IN-AR-TWG-ATT-001',
        name: 'Tawang Monastery (Galden Namgey Lhatse)',
        category: 'Spiritual / Heritage · Buddhism, Founded 1680–81, Second-Largest Monastery in World, 26-Foot Gilded Buddha',
        timings: '07:00–18:00 (Morning assembly prayers: 07:00)',
        fee: { domestic: 'Free (Monastery Museum entry: INR 20–50)', foreign: 'Free (Museum: INR 50)' },
        isHiddenGem: false,
        image: '/images/arunachal/tawang-monastery.jpg',
        photoCredit: 'User Photo / Galden Namgey Lhatse Monastery',
        summary:
          'Founded in 1680–81 by Merak Lama Lodre Gyatso according to the wishes of the 5th Dalai Lama. Rising fortress-like at 3,000 m, it is India\'s largest and the world\'s second-largest Buddhist monastery. Houses a three-storey assembly hall (Dukhang), an immense 26-foot gilded Buddha statue, and an invaluable library of gold-lettered Buddhist scriptures (Kangyur).',
      },
      {
        id: 'IN-AR-TWG-ATT-002',
        name: 'Sela Pass (4,170 m) & Sela Lake',
        category: 'Nature / Adventure · Hills & Mountains, High-Altitude Sacred Glacial Lake & Twin Sela Road Tunnel Portal',
        timings: 'Daylight transit (Best crossed before 14:00 due to sudden blizzard & freezing fog risks)',
        fee: { domestic: 'Free (Regulated under district ILP checkpost)', foreign: 'Free (Regulated under PAP)' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Sela_Lake_near_Sela_pass%2C_Arunachal_Pradesh%2C_India.jpg/1280px-Sela_Lake_near_Sela_pass%2C_Arunachal_Pradesh%2C_India.jpg',
        photoCredit: 'Wikimedia Commons / Sela Lake & Pass',
        summary:
          'High-altitude Himalayan pass at 4,170 m (13,700 ft) connecting Tawang with the rest of India. Cradles the sacred, crystal Sela Lake (Lake of the 101 Lakes) surrounded by prayer flags and snowfields. The newly commissioned engineering feat—the world\'s longest twin-lane Sela Tunnel—now guarantees all-weather connectivity.',
      },
      {
        id: 'IN-AR-TWG-ATT-003',
        name: 'Tawang War Memorial & Sound & Light Show',
        category: 'Heritage · Historical Sites, Monuments, 1962 Sino-Indian War Memorial built in Sacred Stupa Form',
        timings: '08:00–19:00 (Sound & Light Show: 17:30 Hindi / 18:30 English)',
        fee: { domestic: 'Memorial entry: Free | Sound & Light Show: INR 100', foreign: 'Memorial: Free | Show: INR 100' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Tawang_War_Memorial.jpg/1280px-Tawang_War_Memorial.jpg',
        photoCredit: 'Wikimedia Commons / Tawang War Memorial',
        summary:
          'Constructed in the design of a sacred Buddhist stupa (Namgyal Chorten) overlooking the Tawang Chu valley, commemorating the supreme sacrifice of 2,420 Indian Army officers and soldiers during the 1962 Sino-Indian War. The poignant evening sound and light presentation narrates heroic battles including Subedar Joginder Singh\'s PVC stand.',
      },
      {
        id: 'IN-AR-TWG-ATT-004',
        name: 'Bum La Pass & Madhuri Lake (Sangetsar Tso)',
        category: 'Nature / Heritage · Rivers & Lakes, International Border Post (4,600 m), Tree-Stump Glacial Tarn',
        timings: '07:30–15:00 (DC Office & Army civilian pass mandatory; Indian nationals only)',
        fee: { domestic: 'Army pass free; Local union 4WD vehicle hire ~INR 5,000–6,500', foreign: 'Not permitted (Restricted Border Area)' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Sangestar_Tso%2C_Tawang%2C_Arunachal_Pradesh%2C_India.jpg/1280px-Sangestar_Tso%2C_Tawang%2C_Arunachal_Pradesh%2C_India.jpg',
        photoCredit: 'Wikimedia Commons / Sangetsar Tso (Madhuri Lake)',
        summary:
          'Historic border pass at 4,600 m (15,200 ft) on the Indo-China frontier where Dalai Lama entered India in 1959. En route lies Sangetsar Tso, formed by a 1950 earthquake that submerged a pine forest, leaving haunting weathered dead tree trunks standing erect from crystal alpine waters (popularized as Madhuri Lake).',
      },
      {
        id: 'IN-AR-TWG-GEM-001',
        name: 'Urgelling Gompa',
        category: 'Spiritual / Heritage · Buddhism, 14th-Century Birthplace of Tsangyang Gyatso (His Holiness the 6th Dalai Lama)',
        timings: '07:00–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ugyenling_monastery_oak_tree.jpg/1280px-Ugyenling_monastery_oak_tree.jpg',
        photoCredit: 'Wikimedia Commons / Urgelling Gompa Sacred Oak Tree',
        summary:
          'Historic 14th-century monastery 5 km south of Tawang, celebrated as the sacred birthplace of Tsangyang Gyatso, the 6th Dalai Lama, born here in 1683. Features a towering ancient sacred oak tree said to have grown from the staff planted into the soil by the 6th Dalai Lama with the prophecy of his eventual return.',
      },
      {
        id: 'IN-AR-TWG-GEM-002',
        name: 'Nuranang Falls (Bong Bong Falls), Jang',
        category: 'Nature · Rivers & Lakes, 100-Metre Roaring Waterfall cascade fed by northern Sela glaciers',
        timings: '06:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Nuranang_Falls%2C_Jang.jpg/1280px-Nuranang_Falls%2C_Jang.jpg',
        photoCredit: 'Wikimedia Commons / Nuranang Waterfall Jang',
        summary:
          'Magnificent 100-metre white cascade plunging through deep forested valleys near Jang town. Fed by pristine meltwater from Sela Pass glaciers, it is named after Nura, a brave Monpa tribal girl who assisted Rifleman Jaswant Singh Rawat (MVC) during the 1962 war. Features a small hydel power generating station at its base.',
      },
      {
        id: 'IN-AR-TWG-GEM-003',
        name: 'Gorsam Chorten, Zemithang',
        category: 'Heritage / Spiritual · Buddhism, 12th-Century 93-Foot Hemispherical Stupa Modeled on Nepal\'s Boudhanath',
        timings: '07:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gorsam_Chorten_Zemithang.jpg/1280px-Gorsam_Chorten_Zemithang.jpg',
        photoCredit: 'Wikimedia Commons / Gorsam Chorten Zemithang',
        summary:
          'Rare 12th-century Buddhist stupa located 92 km west of Tawang in Zemithang near the Bhutan-Tibet border. Standing 93 feet tall and 186 feet across, it was built by Lama Pradhar and modeled directly after Boudhanath Stupa in Kathmandu, surrounded by 120 stone prayer niches and sacred forest circumambulation paths.',
      },
    ],
  },
  {
    id: 'ziro',
    code: 'IN-AR-CITY-ZRO',
    name: 'Ziro Valley',
    nickname: 'Cradle of the Apatanis & Living UNESCO Landscape',
    tagline: 'Terraced Wet-Rice & Fish Farming, Bamboo Groves, and Apatani Villages',
    accentColor: '#16A34A',
    bgGradient: 'from-emerald-950/60 via-green-950/40 to-slate-950/70',
    flashcardBlurb:
      'A high-altitude cradle of the Apatani tribe on the UNESCO Tentative List, famed for terraced wet-rice and fish farming, bamboo groves, and the iconic outdoor Ziro Music Festival.',
    coverImage: '/images/arunachal/ziro-valley.jpg',
    photoCredit: 'User Photo / Ziro Valley Terraced Paddy Fields',
    topStays: [
      { name: 'Ziro Valley Resort', category: 'Hapoli — Scenic Pine-fringed Cottages with Valley Views' },
      { name: 'Siiro Resort', category: 'Siiro Village — Cultural Comfort Stay in Subtropical Wilderness' },
      { name: 'Lempia Ude Homestay / Abasa Homestay', category: 'Traditional Apatani Wooden Stays with Open Fireplace' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Apatani Kitchen at Abasa',
          location: 'Biate Village',
          specialties: 'Steamed organic red rice, boiled wild forest leaves (Pike), roasted maize, tender pumpkin curries, and herbal green tea',
        },
        {
          restaurant: 'Blue Pine Restaurant',
          location: 'Hapoli',
          specialties: 'Vegetable fried rice, hot Hakka chowmein, crispy vegetable spring rolls, and steamed momos',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Ziro Valley Restaurant',
          location: 'Hapoli',
          specialties: 'Traditional Lukter (smoked meat with fermented bamboo shoot), Pike (fish soup), Pika Pila (fermented bamboo shoot and pork fat pickle)',
        },
        {
          restaurant: 'Apatani Homestays',
          location: 'Hong & Bulla Villages',
          specialties: 'Country chicken roasted inside freshly cut green bamboo tubes over open hearths, served with organic homebrewed millet Apong',
        },
      ],
      peacefulNote:
        'Apatani gastronomy is an organic celebration of forest bounty: salt derived from plant ashes (Tapyo), freshly tapped bamboo shoots, mountain fish, and warm millet Apong.',
    },
    attractions: [
      {
        id: 'IN-AR-ZRO-ATT-001',
        name: 'Hong, Hari & Bulla Apatani Tribal Villages',
        category: 'Rural / Arts · UNESCO Tentative, Live Like a Local, Crafts-Tourism, Traditional Bamboo Stilt Houses & Facial Tattoos',
        timings: 'Daylight hours (Respectful village walking; always ask permission before photographing elders)',
        fee: { domestic: 'Free (Voluntary village community donation appreciated)', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/arunachal/ziro-valley.jpg',
        photoCredit: 'User Photo / Apatani Valley Architecture & Terraces',
        summary:
          'Vibrant indigenous villages of the Apatani people on the UNESCO Tentative World Heritage list. Characterized by tightly packed bamboo stilt houses, sacred ceremonial platforms (Lapang), totem poles (Babo), and elderly matriarchs bearing the iconic indigo facial tattoos (Tiipe) and nose plugs (Yaping Hullo).',
      },
      {
        id: 'IN-AR-ZRO-ATT-002',
        name: 'Apatani Integrated Wet-Rice & Fish Agricultural Terraces',
        category: 'Rural / Gastronomy · Sustainable Tourism, Agro-Tourism, Unique Carbon-Neutral Aquatic Rice-Fish Farming Ecosystem',
        timings: 'Open 24 Hours (Best photographed at sunrise and late golden hour)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Apatani_Rice_Paddies.jpg/1280px-Apatani_Rice_Paddies.jpg',
        photoCredit: 'Wikimedia Commons / Apatani Paddy Terraces',
        summary:
          'Globally renowned traditional agro-ecological system practiced for centuries without animal ploughing or chemical fertilizers. Terraced paddy basins with bamboo sluices channel mountain streams to simultaneously cultivate high-yield indigenous rice varieties (Mipa and Emo) alongside carp fish in flooded furrows.',
      },
      {
        id: 'IN-AR-ZRO-ATT-003',
        name: 'Kardo Shiva Lingam (Siddheshwar Nath Temple)',
        category: 'Spiritual · Hinduism, Massive 25-Foot Naturally Formed Monolithic Shiva Lingam inside Kardo Forest',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Kardo_Shiva_Linga_Ziro.jpg/1280px-Kardo_Shiva_Linga_Ziro.jpg',
        photoCredit: 'Wikimedia Commons / Kardo Shiva Lingam',
        summary:
          'A miraculous discovery in 2004 inside the dense pine and bamboo forests of Kardo. This monumental, naturally formed rock monolith stands 25 feet tall and 22 feet in circumference, venerated by pilgrims across Northeast India as an authentic Svayambhu Shiva Lingam with perennial spring water flowing at its base.',
      },
      {
        id: 'IN-AR-ZRO-ATT-004',
        name: 'Talley Valley Wildlife Sanctuary',
        category: 'Nature / Adventure · Forests & Gardens, Hiking & Trekking, Sub-Tropical Cloud Forest, Home to Clouded Leopard',
        timings: '07:00–15:00 (Mandatory forest guide & register at forest entry gate)',
        fee: { domestic: 'Forest Permit: INR 100 per person + Guide fee (~INR 1,000–1,500)', foreign: 'INR 500 per person + Guide fee' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Close_wing_position_of_Delias_belladonna_Fabricius%2C_1793_%E2%80%93_Hill_Jezebel_Butterflies_of_Talle_valley_-_5.jpg/1280px-Close_wing_position_of_Delias_belladonna_Fabricius%2C_1793_%E2%80%93_Hill_Jezebel_Butterflies_of_Talle_valley_-_5.jpg',
        photoCredit: 'Wikimedia Commons / Talley Valley Flora & Butterflies',
        summary:
          'Dense 337-sq-km wilderness plateau spanning altitudes of 1,200 m to 3,000 m, 30 km from Ziro. Serving as a crucial biodiversity corridor, this virgin cloud forest protects endangered clouded leopards, Himalayan black bears, rare orchids, and Pleioblastus simone—a rare endemic single-stem bamboo species.',
      },
      {
        id: 'IN-AR-ZRO-GEM-001',
        name: 'Tarin Fish Farm',
        category: 'Rural / Gastronomy · Agro-Tourism, High-Altitude Hatchery Breeding Carp for Apatani Paddy Farming',
        timings: '09:00–16:00',
        fee: { domestic: 'INR 20', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / High Altitude Fish Hatchery',
        summary:
          'High-altitude government pisciculture farm in Bulla village surrounded by towering pine trees and bamboo plantations. Established to breed fingerlings of Common Carp and Grass Carp, which are transferred directly into local agricultural fields for synchronized rice-fish co-cultivation.',
      },
      {
        id: 'IN-AR-ZRO-GEM-002',
        name: 'Dolo Mando Hill Trek',
        category: 'Adventure / Nature · Hiking & Trekking, Gentle Ridge Walk offering 360-Degree Views over Old Ziro and Hapoli',
        timings: '06:00–17:00 (Best at dawn)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Himalayan Ridge Panoramas',
        summary:
          'Scenic hiking ridge situated west of Hapoli town. A gentle 45-minute uphill walking path leads through pine-scented mountain air to the hill crest, rewarding hikers with panoramic 360-degree vistas overlooking the emerald Hapoli township, sprawling Apatani rice terraces, and distant snow peaks.',
      },
    ],
  },
  {
    id: 'bomdila',
    code: 'IN-AR-CITY-BOM',
    name: 'Bomdila',
    nickname: 'Himalayan Ridge Gateway of West Kameng',
    tagline: 'Apple Orchards, Monpa Tibetan Craftsmanship, and Snow Peak Panoramas',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-950/60 via-blue-950/40 to-slate-950/70',
    flashcardBlurb:
      'The headquarters of West Kameng, set amidst apple orchards, coniferous ridges, and Buddhist monasteries, offering clear views of Kangto and Gorichen snow peaks.',
    coverImage: '/images/arunachal/bomdila-monastery.jpg',
    photoCredit: 'User Photo / Bomdila Upper Gompa Complex',
    topStays: [
      { name: 'Elysium Hotel & Resort', category: 'Conifer Ridge — Modern Mountain Comfort & Valley Views' },
      { name: 'Hotel Tsepal Yangjom', category: 'Main Bazaar — Traditional Tibetan Decor & In-house Dining' },
      { name: 'Siphiyang Phong', category: 'Heritage-style Boutique Resort with Organic Kitchen Gardens' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Komus Kitchen',
          location: 'Main Market',
          specialties: 'Homestyle yellow dal, steamed rice, stir-fried fresh mountain vegetables, and piping hot Thukpa',
        },
        {
          restaurant: 'Coffee Studio Bomdila',
          location: 'Main Bazaar',
          specialties: 'Freshly brewed mountain coffee, ginger honey lemon tea, chocolate brownies, and warm pastries',
        },
      ],
      nonVeg: [
        {
          restaurant: 'The Wok House',
          location: 'Central Market',
          specialties: 'Spicy Asian and Tibetan pork fry, steamed chicken momos, crispy chilly chicken, and rich broth thukpa',
        },
        {
          restaurant: 'Exotic Naga Kitchen',
          location: 'Near Taxi Stand',
          specialties: 'Smoked pork cooked with fermented Akhuni, bamboo shoot country chicken, and fiery King Chilli (Bhut Jolokia) chutneys',
        },
      ],
      peacefulNote:
        'Bomdila is renowned for its crisp high-altitude air, sweet hand-picked Kameng apples, hot momos served with fiery bird-eye chilli salsa, and peaceful monastic chants.',
    },
    attractions: [
      {
        id: 'IN-AR-BOM-ATT-001',
        name: 'Bomdila Monastery (Gentse Gaden Rabgyel Lling / Upper Gompa)',
        category: 'Spiritual / Heritage · Buddhism, 1965 Mahayana Monastic Center, Blue & Red Tiered Pagoda, Tibetan Sand Mandalas',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/arunachal/bomdila-monastery.jpg',
        photoCredit: 'User Photo / Upper Gompa Bomdila',
        summary:
          'Established in 1965 by the 12th reincarnate of Tsona Gontse Rinpoche, this prominent Gelugpa monastery is divided into Upper, Middle, and Lower Gompas. The Upper Gompa features a magnificent prayer hall with vibrant Tibetan fresco murals, intricate butter sculptures, mandalas, and an eight-foot Buddha statue.',
      },
      {
        id: 'IN-AR-BOM-ATT-002',
        name: 'Craft Centre & Ethnographic Museum',
        category: 'Arts / Rural · Crafts-Tourism, Handwoven Monpa Woolen Carpets, Dragon Wall Hangings, Wooden Masks',
        timings: '09:30–16:30 (Closed Sundays)',
        fee: { domestic: 'Free / Nominal museum entry (INR 20)', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Monpa_Carpet_Weaving.jpg/1280px-Monpa_Carpet_Weaving.jpg',
        photoCredit: 'Wikimedia Commons / Monpa Handloom Carpets',
        summary:
          'A vibrant preservation hub of indigenous craftsmanship where visitors can watch master artisans weave traditional Monpa wool carpets with dragon motifs, carve wooden dance masks (Dhepa), and produce handloom wall hangings, masks, and thangka paintings.',
      },
      {
        id: 'IN-AR-BOM-ATT-003',
        name: 'Bomdila View Point & RR Hill',
        category: 'Nature · Hills & Mountains, Highest Ridge Point in Town with Views of the Nechiphu Pass & Snowlines',
        timings: 'Daylight hours (Best at early sunrise)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Bomdila_View_Point.jpg/1280px-Bomdila_View_Point.jpg',
        photoCredit: 'Wikimedia Commons / Bomdila Himalayan Viewpoint',
        summary:
          'Highest ridge viewpoint in Bomdila commanding breathtaking panoramic vistas of the winding Kameng river valley, the Nechiphu pass gorge, and on clear days, the dazzling snow-capped Himalayan massifs of Kangto (7,060 m) and Gorichen (6,488 m).',
      },
      {
        id: 'IN-AR-BOM-GEM-001',
        name: 'Sangti Valley & Black-Necked Crane Wintering Ground',
        category: 'Nature / Rural · Rivers & Lakes, Eco-Tourism, Riverbed Valley where endangered Tibetan Black-Necked Cranes migrate',
        timings: '06:00–17:30 (Crane season: November to February; located 35 km from Bomdila)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Sangti_Valley_Dirang.jpg/1280px-Sangti_Valley_Dirang.jpg',
        photoCredit: 'Wikimedia Commons / Sangti Valley & Riverbeds',
        summary:
          'Enchanting pastoral valley 35 km from Bomdila with meandering rivers, apple and kiwi orchards, and stone Monpa bridges. Celebrated as one of only two winter nesting habitats in India for the revered, endangered Tibetan Black-Necked Cranes (Grus nigricollis).',
      },
      {
        id: 'IN-AR-BOM-GEM-002',
        name: 'Chilipam Monastery, Rupa',
        category: 'Arts / Spiritual · Buddhism, Intricately Hand-Painted Himalayan Gompa perched on an isolated hill with 360-degree views',
        timings: '07:00–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Chilipam_Monastery_Rupa.jpg/1280px-Chilipam_Monastery_Rupa.jpg',
        photoCredit: 'Wikimedia Commons / Chilipam Monastery Rupa',
        summary:
          'A hidden architectural jewel perched atop an isolated cliff near Rupa town, 20 km from Bomdila. Every inch of its facade, columns, and ceilings is hand-painted with extraordinary Buddhist iconography, wheel of life murals, and mythical dragons, offering unobstructed 360-degree views over the alpine valley.',
      },
      {
        id: 'IN-AR-BOM-GEM-003',
        name: 'Dirang Dzong',
        category: 'Heritage · Palaces & Forts, 17th-Century Monpa Stone-and-Timber Fortress-Village built along the Kameng River',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Dirang_Dzong_Monpa.jpg/1280px-Dirang_Dzong_Monpa.jpg',
        photoCredit: 'Wikimedia Commons / Dirang Dzong Fortress Architecture',
        summary:
          'Historic 17th-century fortified settlement constructed around 1831 (with origins dating back to the 17th century) to protect the Monpa kingdom against neighboring tribal incursions. Built with indigenous stone slabs and timber, its four-storey watchtower and traditional living quarters remain continuously inhabited.',
      },
    ],
  },
  {
    id: 'namdapha',
    code: 'IN-AR-CITY-NAM',
    name: 'Namdapha National Park & Tiger Reserve',
    nickname: 'The Great Northern Rainforest & Hoolock Gibbon Haven',
    tagline: '4 Big Cat Species, Dipterocarp Cloud Rainforests, and Indigenous Singpho Tea',
    accentColor: '#059669',
    bgGradient: 'from-emerald-950/60 via-teal-950/40 to-slate-950/70',
    flashcardBlurb:
      'India\'s fourth-largest national park and one of the world\'s northernmost tropical rainforests, spanning altitudes from 200 m to 4,571 m; home to four big cat species and the Hoolock Gibbon.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Namdapha_National_Park_Rainforest.jpg/1280px-Namdapha_National_Park_Rainforest.jpg',
    photoCredit: 'Wikimedia Commons / Namdapha Dipterocarp Rainforest & Noa-Dihing',
    topStays: [
      { name: 'Forest Inspection Bungalow', category: 'Deban — Riverside Forest Rest House inside the reserve core' },
      { name: 'Eco-Tourist Huts', category: 'Miao Gateway Town — Comfortable base before wilderness entry' },
      { name: 'Forest Department Expedition Tents', category: 'Hornbill & Firmbase Camps — Deep Jungle Tented Camping' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Forest Rest House Mess',
          location: 'Deban',
          specialties: 'Homestyle wilderness meals: steamed rice, yellow dal, fried wild potatoes, sauteed fiddlehead ferns (Dhekia), and hot tea',
        },
        {
          restaurant: 'Miao Town Canteens',
          location: 'Miao Bazaar',
          specialties: 'Simple Assamese and North Indian vegetarian thalis, poori sabzi, and fresh parathas',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Deban Camp Kitchens',
          location: 'Deban Camp',
          specialties: 'Locally sourced country chicken broth, smoked pork with mountain herbs, dry fish curry, and wood-fired rice',
        },
      ],
      peacefulNote:
        'Namdapha is an untamed wilderness experience where meals are prepared over crackling campfires using natural mountain springs and edible wild forest herbs.',
    },
    attractions: [
      {
        id: 'IN-AR-NAM-ATT-001',
        name: 'Deban Forest Base & Noa-Dihing River Safari',
        category: 'Nature / Adventure · Wildlife-Tourism, Rivers & Lakes, Foot Safaris into Primary Dipterocarp Rainforest, Clouded Leopard Habitats',
        timings: '06:00–16:00 (Vehicles enter via M\'Pen gate at Miao; best season October to April)',
        fee: {
          domestic: 'Park Entry: INR 50 + Vehicle: INR 100 + Guide: ~INR 1,000–1,500/day',
          foreign: 'Park Entry: INR 350 + Vehicle: INR 100 + Guide: ~INR 1,000–1,500/day',
        },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Namdapha_National_Park_Rainforest.jpg/1280px-Namdapha_National_Park_Rainforest.jpg',
        photoCredit: 'Wikimedia Commons / Noa-Dihing River at Deban',
        summary:
          'The primary operational base inside Namdapha National Park, located on the picturesque banks of the turquoise Noa-Dihing River. Spanning 1,985 sq km with altitudes from 200 m to 4,571 m at Daphabum peak, it is the only reserve on Earth harboring four feline species: Tiger, Leopard, Snow Leopard, and Clouded Leopard.',
      },
      {
        id: 'IN-AR-NAM-ATT-002',
        name: 'Hornbill Camp & Rainforest Birding Trail',
        category: 'Nature · Wildlife-Tourism, Forests & Gardens, World-Famous Habitat for 5 Hornbill Species',
        timings: '06:00–16:00 (Located 9 km trek beyond Deban across the Noa-Dihing)',
        fee: { domestic: 'Included under core park trekking permit', foreign: 'Included under park permit' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Great_Hornbill_Namdapha.jpg/1280px-Great_Hornbill_Namdapha.jpg',
        photoCredit: 'Wikimedia Commons / Great Indian Hornbill',
        summary:
          'A legendary birdwatcher\'s sanctuary situated 9 km deep inside the rainforest from Deban. Globally recognized for harboring five magnificent hornbill species: Great Indian Hornbill, Rufous-Necked Hornbill, Wreathed Hornbill, White-Throated Brown Hornbill, and Oriental Pied Hornbill.',
      },
      {
        id: 'IN-AR-NAM-ATT-003',
        name: 'Hoolock Gibbon Canopy Trail',
        category: 'Nature / Rural · Wildlife-Tourism, Tracking India\'s Only Ape Species singing through the upper rainforest canopy',
        timings: '05:30–09:00 (Guided morning canopy walking trail)',
        fee: { domestic: 'Included in wildlife permit', foreign: 'Included in wildlife permit' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Western_Hoolock_Gibbon.jpg/1280px-Western_Hoolock_Gibbon.jpg',
        photoCredit: 'Wikimedia Commons / Western Hoolock Gibbon',
        summary:
          'A specialized sunrise wildlife expedition guided by indigenous Singpho trackers. Echoing calls of the Western Hoolock Gibbon—India\'s only ape species—ring through the dense 50-metre-tall dipterocarp tree canopy as families swing with effortless agility between branches.',
      },
      {
        id: 'IN-AR-NAM-GEM-001',
        name: 'Firmbase Camping Grounds',
        category: 'Adventure / Nature · Hiking & Trekking, Pristine Deep-Jungle Expedition Camp on the Noa-Dihing Riverbank',
        timings: 'Multi-day expedition (Forest department clearance & registered forest guides mandatory)',
        fee: { domestic: 'Forest camping fee: ~INR 500/night + tentage', foreign: 'Forest camping fee: ~INR 500/night + tentage' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Deep Dipterocarp Wilderness Camp',
        summary:
          'Remote wilderness expedition camp situated 25 km inside the core jungle along the boulder-strewn Noa-Dihing riverbank. Reached after an adventurous trek through Haldibari and Hornbill camps, offering night skies untainted by light pollution and sightings of the critically endangered Namdapha Flying Squirrel.',
      },
      {
        id: 'IN-AR-NAM-GEM-002',
        name: 'Singpho Traditional Village & Phalap Tea Craft, Miao',
        category: 'Rural / Gastronomy · Agro-Tourism, Crafts-Tourism, Indigenous Singpho Tribe & Organic Coin-Shaped Smoked Tea (Phalap)',
        timings: '08:00–17:00',
        fee: { domestic: 'Free (Direct interaction with village tea elders)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Singpho_Tea_Phalap.jpg/1280px-Singpho_Tea_Phalap.jpg',
        photoCredit: 'Wikimedia Commons / Traditional Singpho Phalap Smoked Tea',
        summary:
          'Located near Miao, this village is home to the Singpho tribe, who originally introduced wild tea plants to British officer Robert Bruce in 1823. Visitors learn the centuries-old method of hand-plucking wild Camellia sinensis, roasting the leaves, and stuffing them into bamboo stalks smoked over kitchen hearths to age into solid coin tea (Phalap).',
      },
      {
        id: 'IN-AR-NAM-GEM-003',
        name: 'Miao Mini Zoo & Wildlife Rescue Centre',
        category: 'Nature · Wildlife-Tourism, Conservation Sanctuary for Hoolock Gibbons, Marbled Cats, and Red Pandas',
        timings: '09:00–16:00 (Closed Mondays)',
        fee: { domestic: 'INR 20', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Red_Panda_Miao_Rescue.jpg/1280px-Red_Panda_Miao_Rescue.jpg',
        photoCredit: 'Wikimedia Commons / Red Panda Rescue Miao',
        summary:
          'Dedicated wildlife transit and rehabilitation facility situated on the outskirts of Miao gateway town. Cares for rescued animals from the surrounding Eastern Himalayan forests, providing visitors a rare opportunity to observe elusive fauna like the Red Panda, Slow Loris, and Himalayan Black Bear up close.',
      },
    ],
  },
];
