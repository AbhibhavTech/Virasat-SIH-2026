export interface LadakhStay {
  name: string;
  category: string;
}

export interface LadakhFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface LadakhDining {
  veg: LadakhFoodSpot[];
  nonVeg: LadakhFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface LadakhAttraction {
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

export interface LadakhCity {
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
  topStays: LadakhStay[];
  dining: LadakhDining;
  attractions: LadakhAttraction[];
}

export const LADAKH_DIRECTORY: LadakhCity[] = [
  {
    id: 'leh',
    code: 'IN-LA-CITY-IXL',
    name: 'Leh',
    nickname: 'The Trans-Himalayan Crown & Silk Route Crossroads',
    tagline: 'Ancient Tibetan Palaces, Golden Maitreyas, and High Mountain Monasteries',
    accentColor: '#D97706',
    bgGradient: 'from-amber-950/60 via-stone-900/40 to-slate-950/70',
    flashcardBlurb:
      'The trans-Himalayan crossroads of the Silk Route, set at 3,500 metres amidst Tibetan-style palace fortresses, stupas, prayer wheels, and mud-brick old town bazaars.',
    coverImage: '/images/ladakh/leh-palace.jpg',
    photoCredit: 'User Photo / Leh Palace & Old Town Citadel',
    topStays: [
      { name: 'The Grand Dragon Ladakh', category: 'Old Road — Luxury Eco-Centric Heritage Hotel' },
      { name: 'Stok Palace Heritage Hotel', category: 'Stok Village — Living Royal Palace Suite Stay' },
      { name: 'Chamba Camp Thiksey', category: 'Thiksey — Ultra-Luxury Glamping by TUTC' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Tibetan Kitchen',
          location: 'Fort Road',
          specialties: 'Steamed fluffy Tingmo bread, piping-hot Vegetable Thukpa, Mokthuk (dumpling soup), and handmade Thenthuk noodles',
        },
        {
          restaurant: 'Gesmo Restaurant',
          location: 'Fort Road',
          specialties: 'Freshly baked Yak-cheese pizza, legendary warm apple crumble, and ginger lemon honey tea since 1939',
        },
        {
          restaurant: 'Bodhi Greens',
          location: 'Main Bazaar',
          specialties: 'Organic vegan bowls, mountain berry smoothies, beetroot hummus toast, and gluten-free Ladakhi treats',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Lamayuru Restaurant',
          location: 'Fort Road',
          specialties: 'Handcrafted Mutton Momos, slow-simmered Tibetan Gyako hotpot, and kothey dumplings',
        },
        {
          restaurant: 'Bon Appetit',
          location: 'Changspa',
          specialties: 'Slow-braised Ladakhi Mutton Stew, charcoal grilled local chicken, and wood-fired continental mains',
        },
      ],
      peacefulNote:
        'Leh dining combines warming Tibetan comfort broths with mountain herbs, locally churned yak butter salt tea (Gur-Gur Chai), and freshly harvested apricots.',
    },
    attractions: [
      {
        id: 'IN-LA-IXL-ATT-001',
        name: 'Leh Palace (Lhachen Palkhar)',
        category: 'Heritage · Palaces & Forts, 17th-Century 9-Storey Dunghill Palace built by King Sengge Namgyal',
        timings: '07:00–19:00',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: '/images/ladakh/leh-palace.jpg',
        photoCredit: 'User Photo / Leh Palace Fortification',
        summary:
          'Constructed in the 1600s by King Sengge Namgyal atop Namgyal Hill. Modeled on Lhasa’s Potala Palace, this nine-storey mud-brick fortress features wooden cantilevered balconies and a rooftop offering panoramic views of Leh town, Shanti Stupa, and Stok Kangri.',
      },
      {
        id: 'IN-LA-IXL-ATT-002',
        name: 'Shanti Stupa',
        category: 'Spiritual · Buddhism, White-Domed Chorten on Changspa Ridge with 360-Degree Views',
        timings: '05:00–21:00 (Illuminated after dark)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Shanti_Stupa_Ladakh.jpg/1280px-Shanti_Stupa_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Shanti Stupa Leh',
        summary:
          'White-domed Buddhist stupa consecrated by the 14th Dalai Lama in 1991, established by Japanese and Ladakhi Buddhists on a rocky ridge at 3,609 meters to promote world peace. Famed for its gilded Buddha relief panels and sunrise/sunset panoramas.',
      },
      {
        id: 'IN-LA-IXL-ATT-003',
        name: 'Thiksey Monastery',
        category: 'Spiritual / Heritage · Buddhism, 12-Storey Gelugpa Complex resembling Potala Palace, 49-Foot Maitreya',
        timings: '06:00–18:00 (Morning prayer assembly at 07:00)',
        fee: { domestic: 'INR 50', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Thiksey_Monastery_Ladakh.jpg/1280px-Thiksey_Monastery_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Thiksey Monastery',
        summary:
          'Affiliated with the Gelugpa Yellow Hat sect, cascading down a prominent hill 19 km from Leh. Houses the awe-inspiring 49-foot-tall gilded statue of Maitreya Buddha (Future Buddha) spanning two storeys, alongside precious thangkas, stupas, and assembly halls.',
      },
      {
        id: 'IN-LA-IXL-ATT-004',
        name: 'Hemis Monastery & Museum',
        category: 'Heritage / Spiritual · Buddhism, Largest Drukpa Lineage Monastery in Ladakh, Annual Masked Dance',
        timings: '08:00–13:00 & 14:00–18:00',
        fee: { domestic: 'Monastery: INR 50 | Museum: INR 50', foreign: 'Monastery: INR 50 | Museum: INR 50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Hemis_monastery_Ladakh.jpg/1280px-Hemis_monastery_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Hemis Monastery',
        summary:
          'Hidden within a secluded mountain gorge south of the Indus, Hemis is the wealthiest and largest monastery of the Drukpa Kagyu lineage in Ladakh, dating back to 1672. Renowned for its subterranean museum of ancient relics and the vibrant annual Hemis Tsechu festival.',
      },
      {
        id: 'IN-LA-IXL-GEM-001',
        name: 'Hall of Fame & Spituk Monastery',
        category: 'Heritage / Spiritual · War Memorial Museum & 11th-Century Monastery housing veiled Mahakala shrine',
        timings: '09:00–13:00 & 14:00–19:00',
        fee: { domestic: 'Hall of Fame: INR 250 | Spituk: INR 30', foreign: 'Hall of Fame: INR 250 | Spituk: INR 30' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Spituk_Monastery_Ladakh.jpg/1280px-Spituk_Monastery_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Spituk Monastery',
        summary:
          'Twin landmark excursion on the Leh-Srinagar road: Hall of Fame memorializes Indian Army bravery and Siachen operations, while ancient 11th-century Spituk Gompa crowns a hillock enshrining the sacred fierce Mahakala idol unveiled once a year during Spituk Gustor.',
      },
      {
        id: 'IN-LA-IXL-GEM-002',
        name: 'Basgo Fortress & Clay Murals',
        category: 'Heritage / Arts · Archeological Sites, Mud-brick Citadel & 16th-Century Chamba Maitreya Temple',
        timings: '08:00–18:00',
        fee: { domestic: 'INR 30', foreign: 'INR 30' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Basgo_Monastery_Ladakh.jpg/1280px-Basgo_Monastery_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Basgo Monastery',
        summary:
          'Ancient clay and stone fortification dramatically situated atop eroded clay crags 40 km west of Leh. Former capital of lower Ladakh, featuring the 16th-century Chamba copper-gilded statue and masterfully preserved murals acclaimed on World Monuments Watch.',
      },
      {
        id: 'IN-LA-IXL-GEM-003',
        name: 'Alchi Choskor (Oldest Monastic Enclave)',
        category: 'Arts / Spiritual · UNESCO Tentative, 11th-Century Kashmiri-Tibetan Wood Carvings & Mineral-Pigment Murals',
        timings: '08:00–13:00 & 14:00–18:00',
        fee: { domestic: 'INR 50–100', foreign: 'INR 50–100' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Alchi_Monastery_Ladakh.jpg/1280px-Alchi_Monastery_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Alchi Choskor',
        summary:
          'Unlike other Ladakhi gompas perched on ridges, Alchi is built on lowland plains on the Indus bank. Founded by Guru Rinchen Zangpo around 1000 CE, showcasing rare Kashmiri-Himalayan wooden carvings and exquisite mineral frescoes depicting secular and sacred life.',
      },
    ],
  },
  {
    id: 'nubra-valley',
    code: 'IN-LA-CITY-NUB',
    name: 'Nubra Valley',
    nickname: 'The Valley of Flowers & Karakoram Silk Outpost',
    tagline: 'Khardung La Pass, Cold-Desert Dunes, and Double-Humped Bactrian Camels',
    accentColor: '#0EA5E9',
    bgGradient: 'from-cyan-950/60 via-blue-950/40 to-slate-950/70',
    flashcardBlurb:
      '"The Valley of Flowers" where the Shyok and Siachen rivers carve through the Karakoram Range, celebrated for cold-desert sand dunes, double-humped Bactrian camels, and ancient silk outposts.',
    coverImage: '/images/ladakh/diskit-buddha.jpg',
    photoCredit: 'User Photo / 106-Foot Maitreya Buddha at Diskit',
    topStays: [
      { name: 'Stone Hedge Hotel', category: 'Hunder — Luxury Contemporary Earth-Architecture' },
      { name: 'Lchang Nang Retreat - The House of Trees', category: 'Tegar — Sustainable Solar-Powered Eco-Resort' },
      { name: 'Nubra Ecolodge', category: 'Sumur — Village Farm Stay & Organic Orchards' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Rangyul Restaurant',
          location: 'Diskit Market',
          specialties: 'Steaming Vegetable Thukpa, Chowmein, hot Ladakhi Butter Tea (Gur-Gur), and fried vegetable momos',
        },
        {
          restaurant: 'Farmhouse Kitchens at Sumur',
          location: 'Sumur Village',
          specialties: 'Organic local apricot chutney, roasted barley flour Tsampa, freshly plucked garden greens, and herbal teas',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Hunder Dune Tents & Cafes',
          location: 'Hunder Sand Dunes',
          specialties: 'Hearty Ladakhi mutton soup, crispy chicken fried momos, and traditional high-altitude noodle broths',
        },
      ],
      peacefulNote:
        'Nubra dining highlights cold-pressed mustard oils, sun-dried wild apricots, and comforting barley tsampa dishes served with steaming butter tea.',
    },
    attractions: [
      {
        id: 'IN-LA-NUB-ATT-001',
        name: 'Diskit Monastery & 106-Foot Maitreya Buddha',
        category: 'Spiritual · Buddhism, Oldest & Largest Gompa in Nubra, Giant Open-Air Colossus overlooking Shyok',
        timings: '07:00–18:00',
        fee: { domestic: 'INR 30', foreign: 'INR 30' },
        isHiddenGem: false,
        image: '/images/ladakh/diskit-buddha.jpg',
        photoCredit: 'User Photo / Diskit Maitreya Buddha',
        summary:
          'Founded in the 14th century by Changzem Tserab Zangpo. The monastery is famed for its monumental 32-metre (106-foot) open-air statue of Jampa (Maitreya Buddha), inaugurated by the Dalai Lama in 2010 facing down the Shyok River valley towards Pakistan.',
      },
      {
        id: 'IN-LA-NUB-ATT-002',
        name: 'Hunder Sand Dunes & Bactrian Camel Safaris',
        category: 'Nature / Rural · Deserts, High-Altitude White Sand Dunes, Double-Humped Silk Route Camels',
        timings: '06:00–09:00 & 16:00–19:00',
        fee: { domestic: 'Dune entry: Free | 15-minute camel ride: INR 300–400', foreign: 'Dune entry: Free | Camel ride: INR 300–400' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hunder_sand_dunes_Ladakh.jpg/1280px-Hunder_sand_dunes_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Hunder Sand Dunes',
        summary:
          'Striking cold-desert dunes of silver sand nestled between snow-capped Karakoram ridges and the braided Shyok River. Home to double-humped shaggy Bactrian camels, remnants of the historic Silk Route trade caravans.',
      },
      {
        id: 'IN-LA-NUB-ATT-003',
        name: 'Khardung La Pass (5,359 m)',
        category: 'Adventure / Nature · Hills & Mountains, Historic Motorway Ridge connecting Indus and Nubra Valleys',
        timings: 'Daylight transit (07:00–17:00; halts limited to 15–20 minutes due to acute altitude sickness risk)',
        fee: { domestic: 'Protected Area Permit (PAP/ILP) required (~INR 400 + Env Fee INR 20/day)', foreign: 'Protected Area Permit (PAP/ILP) required' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Khardung_La_Pass_Ladakh.jpg/1280px-Khardung_La_Pass_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Khardung La Pass',
        summary:
          'Legendary mountain col perched at an elevation of 5,359 metres (17,582 ft) in the Ladakh Range north of Leh. Gateway to the Nubra and Siachen valleys, draped in fluttering Buddhist prayer flags with views of the Karakoram giants.',
      },
      {
        id: 'IN-LA-NUB-GEM-001',
        name: 'Turtuk Village & Baltic Heritage Museum',
        category: 'Rural / Heritage · Live Like a Local, Balti Muslim Culture, Apricot Orchards, 16th-Century Yabgo Palace',
        timings: '08:00–18:00',
        fee: { domestic: 'Free (Yabgo Palace heritage museum: INR 100)', foreign: 'Free (Yabgo Palace: INR 100)' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Turtuk_Village_Nubra_Valley.jpg/1280px-Turtuk_Village_Nubra_Valley.jpg',
        photoCredit: 'Wikimedia Commons / Turtuk Village',
        summary:
          'India’s northernmost inhabited border settlement on the Shyok River, annexed from Pakistan in the 1971 war and opened to tourists in 2010. Famed for lush organic apricot and walnut orchards, wooden canals, and the ancestral palace museum of the Yabgo royal dynasty.',
      },
      {
        id: 'IN-LA-NUB-GEM-002',
        name: 'Panamik Hot Sulphur Springs & Ensa Gompa',
        category: 'Wellness / Nature · Naturopathy, Natural Thermal Mineral Baths & Isolated 400-Year-Old Hermitage',
        timings: '07:00–18:00',
        fee: { domestic: 'Bath complex ticket: INR 30–50', foreign: 'Bath complex ticket: INR 30–50' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Panamik_Nubra_Valley.jpg/1280px-Panamik_Nubra_Valley.jpg',
        photoCredit: 'Wikimedia Commons / Panamik Nubra Valley',
        summary:
          'Located in upper Nubra near the Siachen base road, Panamik is renowned for its therapeutic natural sulphur hot water springs with dedicated bathhouses. Nearby, across the river on a rocky spur, sits the isolated 400-year-old Ensa Gompa hermitage.',
      },
      {
        id: 'IN-LA-NUB-GEM-003',
        name: 'Yarab Tso (The Hidden Sacred Lake)',
        category: 'Nature / Spiritual · Rivers & Lakes, Holy High-Altitude Clear-Water Tarn hidden behind Sumur rocks',
        timings: 'Daylight hours (Reached via a 20-minute uphill rocky trek)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / High-Altitude Mountain Tarn',
        summary:
          'Venerated as a sacred "wish-fulfilling lake", this secluded crystal-clear tarn lies concealed behind rocky crags near Sumur village. Swimming or washing in its waters is forbidden, preserving its serene stillness reflecting surrounding mountain peaks.',
      },
    ],
  },
  {
    id: 'pangong-tso',
    code: 'IN-LA-CITY-PAN',
    name: 'Pangong Tso & Changthang',
    nickname: 'The Shifting Cobalt Lake & Changpa Nomad Highlands',
    tagline: 'Endorheic Saline Waters, Chang La Mountain Col, and Stargazing at 4,350 m',
    accentColor: '#2563EB',
    bgGradient: 'from-blue-950/60 via-indigo-950/40 to-slate-950/70',
    flashcardBlurb:
      'An endorheic saline marvel resting at 4,350 metres on the Indo-Tibetan Changthang plateau, famed for shifting shades of cobalt and azure framed by jagged arid mountains.',
    coverImage: '/images/ladakh/pangong-tso.png',
    photoCredit: 'User Photo / Pangong Tso Lake & Mountains',
    topStays: [
      { name: 'The Pangong Inn', category: 'Lukung — Eco-Comfortable Lake-view Stay' },
      { name: 'Falcon Camp', category: 'Spangmik — Insulated Tented Camps' },
      { name: 'Eco-Homestays in Maan & Merak', category: 'Maan & Merak Villages — Traditional Ladakhi Farm Hospitality' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Lukung & Spangmik Canteens',
          location: 'Lake Shoreline',
          specialties: 'Steaming Maggi noodles, hot Dal Chawal, comforting Khichdi, Veg Momos, and piping-hot saffron Kahwa / Sweet Ginger Lemon Tea',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Lakeside Camp Mess Tents',
          location: 'Spangmik & Maan Camps',
          specialties: 'Freshly prepared homestyle Egg Curry, hot Chicken Curry, and Tibetan meat thukpa cooked over LPG burners',
        },
      ],
      peacefulNote:
        'Due to extreme altitude (4,350 m) and remote terrain, dining at Pangong focuses on freshly cooked warm meals, soups, and continuous hydration with hot water and herbal teas.',
    },
    attractions: [
      {
        id: 'IN-LA-PAN-ATT-001',
        name: 'Pangong Tso Lake (Spangmik & Lukung Shorelines)',
        category: 'Nature · Rivers & Lakes, High-Altitude Saline Lake extending 134 km across India and Tibet',
        timings: 'Daylight access (06:00–19:00; night stargazing magnificent)',
        fee: { domestic: 'PAP/ILP mandatory (included in Leh district pass)', foreign: 'PAP/ILP mandatory' },
        isHiddenGem: false,
        image: '/images/ladakh/pangong-tso.png',
        photoCredit: 'User Photo / Pangong Tso Shoreline',
        summary:
          'World’s highest saltwater lake extending 134 km across the international boundary from India to Tibet. At 4,350 metres altitude, its saline waters do not support fish but create mesmerizing shifting shades from emerald green to deep cobalt blue throughout the day.',
      },
      {
        id: 'IN-LA-PAN-ATT-002',
        name: 'Chang La Pass (5,360 m) & Changla Baba Temple',
        category: 'Adventure / Nature · Hills & Mountains, Third Highest Motor-Accessible Pass in the World',
        timings: 'Daylight vehicular transit',
        fee: { domestic: 'Included under Ladakh PAP/ILP', foreign: 'Included under Ladakh PAP/ILP' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Chang_La_pass_Ladakh.jpg/1280px-Chang_La_pass_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Chang La Pass',
        summary:
          'Rugged high-altitude pass situated at 5,360 metres on the route to Pangong Tso. Guarded by the Changla Baba temple and an Indian Army tea transit post, this windy snowbound pass tests travelers’ acclimatization before descending to Tangtse.',
      },
      {
        id: 'IN-LA-PAN-ATT-003',
        name: 'Merak & Chushul Border Route',
        category: 'Rural / Nature · Live Like a Local, Pastoral Changpa Nomads, Pashmina Goats & Kiang (Wild Ass)',
        timings: 'Regulated transit with special border permits',
        fee: { domestic: 'Included under Changthang PAP', foreign: 'Included under Changthang PAP' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Changthang_Plateau_Ladakh.jpg/1280px-Changthang_Plateau_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Changthang Plateau',
        summary:
          'Remote road stretching along Pangong’s eastern shoreline through stone-walled hamlets of Merak and Chushul. Traverses high-altitude grazing grounds of the nomadic Changpa tribe, herds of Pashmina (Changthangi) goats, and Tibetan wild asses (Kiang).',
      },
      {
        id: 'IN-LA-PAN-GEM-001',
        name: 'Tangtse Gompa & Ancient Silk Route Rock Inscriptions',
        category: 'Heritage · Archeological Sites, 10th-Century Sogdian and Tibetan Inscribed Petroglyphs',
        timings: '08:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tangtse_Monastery_Ladakh.jpg/1280px-Tangtse_Monastery_Ladakh.jpg',
        photoCredit: 'Wikimedia Commons / Tangtse Monastery',
        summary:
          'Historic staging post 35 km before Pangong Lake. The cliffside Tangtse monastery overlooks ancient granite rock faces inscribed with 10th-century petroglyphs, Christian crosses in Sogdian script, and Tibetan characters carved by Central Asian Silk Route merchants.',
      },
      {
        id: 'IN-LA-PAN-GEM-002',
        name: 'Hanle Dark Sky Reserve & Indian Astronomical Observatory',
        category: "Nature / Arts · World's Highest Optical Telescope (4,500 m), India's First Dark Sky Sanctuary",
        timings: 'Observatory viewing 10:00–16:00 (Night stargazing regulated under eco-tourism guidelines)',
        fee: { domestic: 'Free (Special Hanle permit required via Leh DC office portal)', foreign: 'Special Hanle permit required' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Milky Way over Dark Sky Reserve',
        summary:
          'Located in southeastern Ladakh at 4,500 metres, Hanle hosts the 2-meter Himalayan Chandra Telescope operated by the Indian Institute of Astrophysics. Designated India’s first official Dark Sky Reserve, offering unpolluted views of the Milky Way core.',
      },
    ],
  },
  {
    id: 'zanskar',
    code: 'IN-LA-CITY-ZAN',
    name: 'Zanskar',
    nickname: 'The Lost Himalayan Kingdom & Land of White Bronze',
    tagline: 'Phuktal Cliff Cave Gompa, Drang-Drung Glacier, and Gonbo Rangjon Monolith',
    accentColor: '#9333EA',
    bgGradient: 'from-purple-950/60 via-slate-900/40 to-indigo-950/70',
    flashcardBlurb:
      'One of the most remote and dramatic high-altitude valleys on Earth, carved by glacial streams, hanging cliff monasteries, and deep frozen-river gorge histories.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Phuktal_Monastery_Zanskar.jpg/1280px-Phuktal_Monastery_Zanskar.jpg',
    photoCredit: 'Wikimedia Commons / Phuktal Cave Monastery Zanskar',
    topStays: [
      { name: 'Hotel Padum & Zanskar Grand', category: 'Padum — Core Town Hub & Modern Mountain Comfort' },
      { name: 'Eco-Homestays in Karsha & Purney', category: 'Village Hamlets — Authentic Mud-Brick Homestays' },
      { name: 'NunKun Deluxe Camp', category: 'Rangdum base — Wilderness Glamping below Nun Kun Peaks' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Potala Restaurant',
          location: 'Padum Market',
          specialties: 'Fresh Tibetan Thukpa, Butter Salt Tea, steaming Veg Momos, fried rice, and potato thenthuk',
        },
        {
          restaurant: 'Local Homestays',
          location: 'Across Zanskar Villages',
          specialties: 'Traditional roasted barley Tsampa with churned yak butter, wild mountain herbs, fresh curd, and dried apricots',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Padum Market Eateries',
          location: 'Padum Main Road',
          specialties: 'Local Mutton broths, Yak meat preparations in winter, and Kashmiri spiced mutton curries',
        },
      ],
      peacefulNote:
        'Zanskar’s culinary soul is rooted in high-altitude subsistence farming: hand-ground barley tsampa, dried cheeses (chhurpi), hot butter tea, and local vegetable stews.',
    },
    attractions: [
      {
        id: 'IN-LA-ZAN-ATT-001',
        name: 'Karsha Monastery',
        category: 'Spiritual / Heritage · Buddhism, Largest Gelugpa Monastery in Zanskar, Whitewashed Monastic Town',
        timings: '06:00–18:00',
        fee: { domestic: 'INR 50', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Karsha_Monastery_Zanskar.jpg/1280px-Karsha_Monastery_Zanskar.jpg',
        photoCredit: 'Wikimedia Commons / Karsha Monastery',
        summary:
          'Largest and most influential monastery in Zanskar, founded in the 10th century by Phagpa Sherab. Its tiered whitewashed monastic complex tumbles down the slopes of the Zanskar Range facing Padum across the valley floor, home to ancient chortens and lamasery shrines.',
      },
      {
        id: 'IN-LA-ZAN-ATT-002',
        name: 'Padum & Bardan Monastery',
        category: 'Heritage · Palaces & Forts, 17th-Century Drukpa Monastery built atop an isolated rocky river crag',
        timings: '07:00–18:00',
        fee: { domestic: 'INR 30–50', foreign: 'INR 30–50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Bardan_Monastery_Zanskar.jpg/1280px-Bardan_Monastery_Zanskar.jpg',
        photoCredit: 'Wikimedia Commons / Bardan Monastery',
        summary:
          '17th-century Drukpa monastery perched precariously atop a vertical granite tower rising sheer from the raging Tsarap River 12 km south of Padum. Notable for its compact timber assembly hall, large prayer wheel, and ancient bronze statues.',
      },
      {
        id: 'IN-LA-ZAN-ATT-003',
        name: 'Drang-Drung Glacier & Pensi La Pass',
        category: 'Nature / Adventure · Glaciers, Hills & Mountains, Second Largest Glacier in Ladakh outside Siachen',
        timings: 'Daylight transit (Pensi La connects Suru Valley to Zanskar; open June to October)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Drang_Drung_Glacier_Zanskar.jpg/1280px-Drang_Drung_Glacier_Zanskar.jpg',
        photoCredit: 'Wikimedia Commons / Drang-Drung Glacier',
        summary:
          'A majestic 23-km river of ice winding down the Doda Peak slopes beneath the 4,400-meter Pensi La pass. It is the source of the Stod (Doda) River and provides one of the most accessible viewpoints of a colossal Himalayan glacier right from the motor road.',
      },
      {
        id: 'IN-LA-ZAN-GEM-001',
        name: 'Phugtal (Phuktal) Cave Monastery',
        category: 'Spiritual / Adventure · Buddhism, Hiking & Trekking, 12th-Century Honeycomb Monastery in Cliff Cave',
        timings: 'Daylight access (Requires a 2 to 3-hour walk from Purney / Cha bridge roadhead)',
        fee: { domestic: 'Free / Voluntary donation', foreign: 'Free / Voluntary donation' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Phuktal_Monastery_Zanskar.jpg/1280px-Phuktal_Monastery_Zanskar.jpg',
        photoCredit: 'Wikimedia Commons / Phuktal Cave Monastery',
        summary:
          'One of the world’s most astonishing monastic structures, built around the mouth of a massive natural limestone cave high up on the sheer cliffs of the Lungnak (Tsarap) river gorge. Established in the 12th century by Gangsem Sherap Sampo, resembling a cliffside swallow’s nest.',
      },
      {
        id: 'IN-LA-ZAN-GEM-002',
        name: 'Zangla Palace Ruins & Nunnery',
        category: 'Heritage · Historical Buildings, Ancient Hilltop Palace where Csoma de Körös compiled Tibetan dictionary',
        timings: '08:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Zangla_Palace_Zanskar.jpg/1280px-Zangla_Palace_Zanskar.jpg',
        photoCredit: 'Wikimedia Commons / Zangla Palace Ruins',
        summary:
          'Ancient fortified hilltop palace in northern Zanskar where pioneer Hungarian philologist Alexander Csoma de Körös lived in extreme isolation between 1823 and 1824, compiling the first English-Tibetan dictionary. Nearby lies an active Tibetan nunnery.',
      },
      {
        id: 'IN-LA-ZAN-GEM-003',
        name: 'Gonbo Rangjon (The Sacred Holy Mountain)',
        category: 'Nature / Spiritual · Hills & Mountains, Standalone Monolithic Basalt Peak on Darcha-Padum route',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gonbo_Rangjon_Zanskar.jpg/1280px-Gonbo_Rangjon_Zanskar.jpg',
        photoCredit: 'Wikimedia Commons / Gonbo Rangjon',
        summary:
          'Stupendous standalone monolithic basalt mountain towering like a natural dark pyramid above the Kargyak River on the southern border of Zanskar along the Darcha-Shinkun La route. Revered by local Buddhists as the sacred residence of Mahakala, untouched by climbers.',
      },
    ],
  },
];
