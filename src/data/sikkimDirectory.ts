export interface SikkimStay {
  name: string;
  category: string;
}

export interface SikkimFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface SikkimDining {
  veg: SikkimFoodSpot[];
  nonVeg: SikkimFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface SikkimAttraction {
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

export interface SikkimCity {
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
  topStays: SikkimStay[];
  dining: SikkimDining;
  attractions: SikkimAttraction[];
}

export const SIKKIM_DIRECTORY: SikkimCity[] = [
  {
    id: 'gangtok',
    code: 'IN-SK-CITY-GTK',
    name: 'Gangtok',
    nickname: 'The High-Ridge Himalayan Capital',
    tagline: 'Kangchenjunga Viewlines, Seat of the Karmapa, and Pedestrian Promenade Life',
    accentColor: '#059669',
    bgGradient: 'from-emerald-950/60 via-teal-950/40 to-slate-950/70',
    flashcardBlurb:
      'The clean, high-ridge capital of Sikkim, cascading along the eastern Himalayan ranges with viewlines of Kangchenjunga, Buddhist academic institutes, and traffic-free pedestrian promenades.',
    coverImage: '/images/sikkim/rumtek-monastery.jpg',
    photoCredit: 'User Photo / Rumtek Dharma Chakra Centre',
    topStays: [
      { name: 'Mayfair Spa Resort & Casino', category: 'Ranipool — Luxury Eco-Monastic Sanctuary' },
      { name: 'The Elgin Nor-Khill', category: 'Paljor Stadium Road — Historic Chogyal Royal Heritage' },
      { name: 'Denzong Leisure', category: 'Kazi Road — Hillside Boutique Hotel' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Roll House',
          location: 'MG Marg',
          specialties: 'Fresh spicy vegetable rolls, crispy Wai Wai Sadheko (Himalayan seasoned noodle salad), and momos',
        },
        {
          restaurant: "Baker's Cafe",
          location: 'MG Marg',
          specialties: 'Crusty artisan sourdough toast, fresh espresso, homemade apple pie, and view-terrace pastries',
        },
        {
          restaurant: 'Agarwal Pure Veg',
          location: 'MG Marg',
          specialties: 'North Indian and traditional Marwari pure vegetarian thalis with hot rotis and dal tadka',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Taste of Tibet',
          location: 'MG Marg',
          specialties: 'Steamed juicy Pork Momos, steaming Gyathuk noodle soup, and hearty Thentuk bowls',
        },
        {
          restaurant: 'Mu Kimchi',
          location: 'Development Area',
          specialties: 'Authentic Korean tabletop BBQ, Bibimbap, freshly rolled Kimbap, and Kimchi Jjigae',
        },
        {
          restaurant: 'Nimtho',
          location: 'MG Marg',
          specialties: 'Traditional Sikkimese Thali, Pork Curry, fermented Gundruk soup, and Ningro (fiddlehead fern) with Churpi cheese',
        },
      ],
      peacefulNote:
        'Gangtok dining celebrates organic produce from 100% organic Sikkim farms, mountain cheeses (Churpi), fermented bamboo shoot (Tama), and soothing Himalayan green teas.',
    },
    attractions: [
      {
        id: 'IN-SK-GTK-ATT-001',
        name: 'Rumtek Dharma Chakra Centre',
        category: 'Spiritual / Heritage · Buddhism, Seat of His Holiness the Karmapa, Kagyu Lineage, Golden Stupa',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 10', foreign: 'INR 10' },
        isHiddenGem: false,
        image: '/images/sikkim/rumtek-monastery.jpg',
        photoCredit: 'User Photo / Rumtek Monastery Main Temple',
        summary:
          'Constructed in the 1960s by the 16th Gyalwa Karmapa as the main seat of the Karma Kagyu lineage in exile, mirroring Tsurphu Monastery in Tibet. Preserves a magnificent 13-foot golden stupa containing the sacred relics of the 16th Karmapa and 1,001 miniature golden Buddhas.',
      },
      {
        id: 'IN-SK-GTK-ATT-002',
        name: 'Namgyal Institute of Tibetology & Do Drul Chorten',
        category: 'Heritage / Arts · Museums, Rare Tibetan Manuscripts, Lepcha Leprosy Scrolls, Gilded Stupa with 108 Wheels',
        timings: '10:00–16:00 (Closed Sundays)',
        fee: { domestic: 'INR 10–20', foreign: 'INR 10–20' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Namgyal_Institute_of_Tibetology.jpg/1280px-Namgyal_Institute_of_Tibetology.jpg',
        photoCredit: 'Wikimedia Commons / Namgyal Institute of Tibetology',
        summary:
          'World-renowned center for research on Mahayana Buddhism, housing rare Tibetan manuscripts, 11th-century thangkas, and silver statues. Adjacent stands Do Drul Chorten, a massive golden-spired stupa built in 1945 by Trulshik Rinpoche encircled by 108 Mani prayer wheels.',
      },
      {
        id: 'IN-SK-GTK-ATT-003',
        name: 'Tsomgo (Changu) Lake & Baba Mandir',
        category: 'Nature / Spiritual · Rivers & Lakes, Glacial Alpine Lake (3,753 m), Yak Rides & Border Temple',
        timings: '07:30–14:00 (Transit subject to morning weather)',
        fee: { domestic: 'Protected Area Permit (PAP) mandatory (~INR 200–300 via tour operator)', foreign: 'Protected Area Permit (PAP) mandatory' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tsomgo_Lake_Sikkim.jpg/1280px-Tsomgo_Lake_Sikkim.jpg',
        photoCredit: 'Wikimedia Commons / Tsomgo Lake',
        summary:
          'Sacred high-altitude glacial lake at 3,753 meters on the historic Old Silk Route towards Nathu La. Revered by local Lamas who studied the shifting colors of its water to forecast the year ahead; famous for colorfully draped passenger yaks and the nearby shrine of Baba Harbhajan Singh.',
      },
      {
        id: 'IN-SK-GTK-ATT-004',
        name: 'Gangtok Ropeway (Deorali to Tashiling)',
        category: 'Nature / Recreation · Cable Car, 1-km Bi-cable Zig-zag Ride over Gangtok Valleys',
        timings: '09:30–16:30',
        fee: { domestic: 'INR 110–120 per person', foreign: 'INR 110–120 per person' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gangtok_Ropeway.jpg/1280px-Gangtok_Ropeway.jpg',
        photoCredit: 'Wikimedia Commons / Gangtok Ropeway',
        summary:
          '1-kilometer aerial cable car connecting Deorali bazaar with the Tashiling Secretariat atop the ridge, providing spectacular bird’s-eye vistas of Gangtok township, forested valleys, and on clear mornings, the glistening massif of Mount Kangchenjunga.',
      },
      {
        id: 'IN-SK-GTK-GEM-001',
        name: 'Enchey Monastery',
        category: 'Spiritual / Heritage · Buddhism, 200-Year-Old Nyingma Monastery built on a hermit ridge',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Enchey_Monastery_Gangtok.jpg/1280px-Enchey_Monastery_Gangtok.jpg',
        photoCredit: 'Wikimedia Commons / Enchey Monastery',
        summary:
          'Established in 1840 on a ridge above Gangtok blessed by flying tantric master Lama Druptob Karpo. Built in Chinese pagoda style with vibrant mural paintings of protective deities, Enchey is celebrated for its masked Chaam dances held during the lunar 12th month.',
      },
      {
        id: 'IN-SK-GTK-GEM-002',
        name: 'Fambong Lho Wildlife Sanctuary',
        category: 'Nature / Rural · Wildlife-Tourism, Forests & Gardens, Red Panda & Himalayan Black Bear Habitat',
        timings: '08:00–15:00',
        fee: { domestic: 'INR 55', foreign: 'INR 110' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Himalayan Wildlife Reserve',
        summary:
          'Dense 51-sq-km oak and bamboo forest reserve 20 km west of Gangtok ranging from 1,524 to 2,749 meters. Protects endangered Red Pandas, Himalayan Black Bears, Barking Deer, and over 200 species of Himalayan birds and wild orchids.',
      },
    ],
  },
  {
    id: 'pelling',
    code: 'IN-SK-CITY-PLG',
    name: 'Pelling',
    nickname: 'The Crown View of Mount Kangchenjunga',
    tagline: 'Premier Nyingma Monasteries, Glass Skywalks, and Chogyal Royal Capitals',
    accentColor: '#D97706',
    bgGradient: 'from-amber-950/60 via-orange-950/40 to-slate-950/70',
    flashcardBlurb:
      'West Sikkim’s scenic highland perch, offering unobstructed views of Mount Kangchenjunga’s five peaks alongside ancient royal ruins and holy lakes.',
    coverImage: '/images/sikkim/pelling-skywalk.jpg',
    photoCredit: 'User Photo / Pelling Glass Skywalk & Chenrezig Colossus',
    topStays: [
      { name: 'The Elgin Mount Pandim', category: 'Monastery Road — Heritage Forest Estate adjacent to Pemayangtse' },
      { name: 'Chumbi Mountain Retreat', category: 'Naku-Chumbong — Traditional Sikkimese Architecture & Herbal Spa' },
      { name: 'Magpie The Chestnut Retreat', category: 'Middle Pelling — High-Ridge Mountain View Resort' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Lotus Bakery',
          location: 'Pemayangtse Road',
          specialties: 'Fresh Himalayan herbal teas, home-baked carrot cake, and warm cinnamon rolls served with mountain vistas',
        },
        {
          restaurant: 'Melting Point',
          location: 'Upper Pelling',
          specialties: 'Fresh hot vegetable momos, potato cheese thukpa, and locally harvested nettle soup (Sisnu)',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Haldi Restaurant',
          location: 'Middle Pelling',
          specialties: 'Sikkimese country chicken, local fermented soybean Kinema curry, and spiced pork with bamboo shoot',
        },
        {
          restaurant: 'Kasturi Restaurant',
          location: 'Upper Pelling',
          specialties: 'Tibetan pork ribs, crispy fried river fish, and spiced pan-fried kothey momos',
        },
      ],
      peacefulNote:
        'Pelling’s culinary identity thrives on traditional wood-smoked meats, fermented soy products (Kinema), and fresh mountain nettle broths enjoyed facing the snowy Himalayan massif.',
    },
    attractions: [
      {
        id: 'IN-SK-PLG-ATT-001',
        name: 'Pemayangtse Monastery',
        category: 'Spiritual / Heritage · Buddhism, 1705 AD Premier Nyingma Monastery, 7-Tiered Wooden Celestial Palace',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 20–50', foreign: 'INR 20–50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Pemayangtse_Monastery_Pelling.jpg/1280px-Pemayangtse_Monastery_Pelling.jpg',
        photoCredit: 'Wikimedia Commons / Pemayangtse Monastery',
        summary:
          'One of Sikkim’s oldest and most prestigious Nyingma monasteries, founded in 1705 by Lama Lhatsun Chempo. The top floor houses the breathtaking "Zandogpalri", a 7-tiered hand-carved wooden sculpture depicting Guru Rinpoche’s heavenly palace, crafted single-handedly over five years by late Dungzin Rinpoche.',
      },
      {
        id: 'IN-SK-PLG-ATT-002',
        name: 'Rabdentse Ruins',
        category: 'Heritage · Archeological Sites, Palaces & Forts, Second Royal Capital of the Kingdom of Sikkim',
        timings: '08:00–17:00',
        fee: { domestic: 'Free / Nominal ASI park fee (INR 25)', foreign: 'INR 25' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Rabdentse_Ruins_Sikkim.jpg/1280px-Rabdentse_Ruins_Sikkim.jpg',
        photoCredit: 'Wikimedia Commons / Rabdentse Ruins',
        summary:
          'Second capital of the former Kingdom of Sikkim from 1670 to 1814 until destroyed by invading Nepalese Gurkha armies. The stone palace walls and "Namphogang" royal throne complex sit atop an atmospheric forested ridge offering sweeping views of the valley and Pemayangtse.',
      },
      {
        id: 'IN-SK-PLG-ATT-003',
        name: 'Pelling Skywalk & Chenrezig Colossus',
        category: 'Spiritual / Adventure · First Glass Skywalk in India overlooking deep gorges leading to 137-Foot Bodhisattva',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 50', foreign: 'INR 50' },
        isHiddenGem: false,
        image: '/images/sikkim/pelling-skywalk.jpg',
        photoCredit: 'User Photo / Pelling Glass Skywalk & Chenrezig Statue',
        summary:
          'India’s first transparent glass skywalk perched at 7,200 feet altitude on a rocky spur. Visitors walk along glass panels looking straight down into verdant valley gorges leading up to a monumental 137-foot statue of Bodhisattva Chenrezig (Avalokiteshwara).',
      },
      {
        id: 'IN-SK-PLG-ATT-004',
        name: 'Khecheopalri Lake (The Wish-Fulfilling Sacred Lake)',
        category: 'Spiritual / Nature · Rivers & Lakes, Sacred to Buddhists and Hindus, Clean Waterbody',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Nominal village vehicle tax ~INR 20–30)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Khecheopalri_Lake_Sikkim.jpg/1280px-Khecheopalri_Lake_Sikkim.jpg',
        photoCredit: 'Wikimedia Commons / Khecheopalri Lake',
        summary:
          'Holy footprint-shaped lake cradled in pristine broadleaved forests, revered by Buddhists as the footprint of Goddess Tara and by Hindus as Lord Shiva’s footprint. According to local folklore, birds immediately swoop down and remove any leaf that falls onto the lake’s glassy surface.',
      },
      {
        id: 'IN-SK-PLG-GEM-001',
        name: 'Sanga Choeling Monastery Trek',
        category: "Adventure / Spiritual · Hiking & Trekking, One of Sikkim's Oldest Monasteries (1697) on Pine Ridge",
        timings: '07:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Sanga_Choeling_Monastery_Pelling.jpg/1280px-Sanga_Choeling_Monastery_Pelling.jpg',
        photoCredit: 'Wikimedia Commons / Sanga Choeling Monastery',
        summary:
          'Constructed in 1697 atop a secluded mountain crest opposite Pemayangtse. Accessible only via a serene 45-minute uphill walking trail through pine and rhododendron glades, rewarding hikers with ancient clay sculptures and panoramic views of Kangchenjunga.',
      },
      {
        id: 'IN-SK-PLG-GEM-002',
        name: 'Kanchenjunga Falls & Rimbi Rock Garden',
        category: 'Nature · Rivers & Lakes, Perennial Waterfall plunging over granite ledges into clear pools',
        timings: '08:00–17:00',
        fee: { domestic: 'Waterfall: INR 20 | Rock Garden: INR 10', foreign: 'Waterfall: INR 20 | Rock Garden: INR 10' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kanchenjunga_Falls_Pelling.jpg/1280px-Kanchenjunga_Falls_Pelling.jpg',
        photoCredit: 'Wikimedia Commons / Kanchenjunga Falls',
        summary:
          'Perennial cascade fed by melting glaciers of Mount Kangchenjunga plunging through dense sub-tropical foliage into a granite gorge 25 km from Pelling. Downstream lies the landscaped Rimbi Rock Garden on the banks of the Rimbi River.',
      },
    ],
  },
  {
    id: 'lachung-north-sikkim',
    code: 'IN-SK-CITY-LCG',
    name: 'Lachung & North Sikkim',
    nickname: 'The Alpine Valley of Rhododendrons & Zero Point',
    tagline: 'Glaciated River Basins, Dzumsa Indigenous Governance, and Shingba Wild Orchards',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-950/60 via-cyan-950/40 to-slate-950/70',
    flashcardBlurb:
      'An alpine river settlement tucked beneath glaciated peaks at 2,700 metres, functioning under the unique Dzumsa traditional governance system and serving as the gateway to the Valley of Flowers.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Yumthang_Valley_Sikkim.jpg/1280px-Yumthang_Valley_Sikkim.jpg',
    photoCredit: 'Wikimedia Commons / Yumthang Valley Lachung',
    topStays: [
      { name: 'Yarlam Resort', category: 'Lachung — Luxury Alpine Resort with centrally heated suites' },
      { name: 'Rufina Lachung Heritage', category: 'Boutique Wooden Cottages & Mountain Views' },
      { name: 'Local Dzumsa Eco-Homestays', category: 'Village Hamlets — Authentic Indigenous Hospitality' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Village Homestay Kitchens',
          location: 'Lachung & Katao Base',
          specialties: 'Freshly harvested mustard greens (Sag), local potato curry, warm pan-toasted Phaley bread, hot vegetable Thukpa, and butter tea',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Local Lachung Dhabas',
          location: 'Lachung Bazaar',
          specialties: 'Homestyle mountain country chicken broth, wood-smoked pork with dried wild herbs, and steaming Egg Maggi',
        },
      ],
      peacefulNote:
        'Due to high altitude (2,700–4,700 m), North Sikkim cuisine focuses on warm comforting broths, local mountain root vegetables, and hot Tibetan butter tea to prevent altitude chills.',
    },
    attractions: [
      {
        id: 'IN-SK-LCG-ATT-001',
        name: 'Yumthang Valley (Valley of Flowers)',
        category: 'Nature · Forests & Gardens, Shingba Rhododendron Sanctuary (24 species bloom Mar–May), Hot Springs',
        timings: '06:00–14:00 (Vehicles depart Lachung by dawn)',
        fee: { domestic: 'Included under North Sikkim Protected Area Permit (PAP)', foreign: 'PAP mandatory' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Yumthang_Valley_Sikkim.jpg/1280px-Yumthang_Valley_Sikkim.jpg',
        photoCredit: 'Wikimedia Commons / Yumthang Valley',
        summary:
          'Located at 3,564 meters, this alpine valley surrounded by snow-clad peaks is carpeted with over 24 species of wild rhododendrons in spring. Also features grazing yaks, crystal streams, and natural sulphur hot springs believed to have medicinal healing properties.',
      },
      {
        id: 'IN-SK-LCG-ATT-002',
        name: 'Zero Point (Yumesamdong)',
        category: 'Adventure / Nature · Glaciers, High-Altitude Permafrost Plateau (4,724 m) where civilian roads end',
        timings: '07:00–13:00 (Strict weather clearance from military checkpost)',
        fee: { domestic: 'Driver surcharge (~INR 2,500–3,500/vehicle)', foreign: 'Subject to border clearance' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Zero_Point_Yumesamdong_Sikkim.jpg/1280px-Zero_Point_Yumesamdong_Sikkim.jpg',
        photoCredit: 'Wikimedia Commons / Zero Point Yumesamdong',
        summary:
          'Situated at an astonishing altitude of 4,724 meters (15,500 ft) amidst barren snowfields, Zero Point marks the terminus of all civilian vehicular roads in India near the international boundary, where three snow-fed rivers converge.',
      },
      {
        id: 'IN-SK-LCG-ATT-003',
        name: 'Lachung Monastery (Samten Cheling)',
        category: 'Spiritual / Heritage · Buddhism, 1880 Nyingma Gompa set against snow-draped orchard bluffs',
        timings: '06:30–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Lachung_Monastery_Sikkim.jpg/1280px-Lachung_Monastery_Sikkim.jpg',
        photoCredit: 'Wikimedia Commons / Lachung Monastery',
        summary:
          'Established in 1880 amidst apple and apricot orchards across the Lachung Chu river, this two-storey Nyingmapa monastery is the spiritual sanctuary of the Lachungpa community, housing ancient prayer wheels and hosting the masked religious dances of Chaam.',
      },
      {
        id: 'IN-SK-LCG-GEM-001',
        name: 'Katao Valley Snow Point',
        category: 'Adventure / Nature · Hills & Mountains, Dramatic Snow-Capped Basin and Waterfall Canyon',
        timings: '07:00–13:00',
        fee: { domestic: 'Army clearance pass + local vehicle add-on', foreign: 'Restricted area pass' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Katao Alpine Canyon',
        summary:
          'Dramatic alpine gorge 28 km from Lachung near the Chinese border, often called the Switzerland of Sikkim. Features sheer snow-clad granite massifs, frozen waterfalls, and skiing/snowboarding slopes requiring special Indian Army border clearance.',
      },
      {
        id: 'IN-SK-LCG-GEM-002',
        name: 'Dzumsa Traditional Court & Council Hall',
        category: 'Rural / Heritage · Live Like a Local, Century-Old Indigenous Self-Governance System led by the Pipon',
        timings: 'External viewing during daylight hours',
        fee: { domestic: 'Free (Respectful community observation)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Lachung Valley Village',
        summary:
          'Lachung and Lachen are the only places in India governed by the Dzumsa, an indigenous traditional administrative system preserved since the 19th century. Headed by an elected village leader (Pipon), the council settles local community disputes and oversees community pastoral resources.',
      },
    ],
  },
  {
    id: 'ravangla',
    code: 'IN-SK-CITY-RVG',
    name: 'Ravangla',
    nickname: 'The Sacred Golden Buddha Ridge of South Sikkim',
    tagline: '130-Foot Tathagata Tsal, Temi Organic Tea Slopes, and Sacred Guru Caves',
    accentColor: '#9333EA',
    bgGradient: 'from-purple-950/60 via-indigo-950/40 to-slate-950/70',
    flashcardBlurb:
      'South Sikkim’s tranquil pine ridge town set at 2,100 metres, centered around the colossal gilded Buddha Park, high-altitude tea gardens, and sacred pilgrimage caves.',
    coverImage: '/images/sikkim/buddha-park-ravangla.png',
    photoCredit: 'User Photo / 130-Foot Gilded Buddha at Ravangla',
    topStays: [
      { name: 'Mount Milestone Hotel & Banquets', category: 'Scenic Ridge View & Contemporary Luxury' },
      { name: 'Clouds Villa', category: 'Boutique Forest Cottage near Buddha Park' },
      { name: 'Barfung Retreat', category: 'Barfung Village — Sustainable Organic Farm Stay' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Tathagata Restaurant',
          location: 'Buddha Park Complex',
          specialties: 'Pure vegetarian hot thukpa, fried vegetable momos, vegetable chowmein, and freshly brewed ginger honey tea',
        },
        {
          restaurant: 'Kookay Restaurant',
          location: 'Ravangla Bazaar',
          specialties: 'Homestyle vegetarian thalis, crispy festive Sel Roti with potato curry, and traditional Tibetan butter tea',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Tathagata Kitchen / Town Eateries',
          location: 'Ravangla Main Market',
          specialties: 'Local Sikkimese Chicken Stew, steamed Tingmo breads, spicy Pork Shapta, and river fish preparations',
        },
      ],
      peacefulNote:
        'Ravangla offers tranquil dining amidst sweeping pine groves, renowned for fresh organic tea straight from Temi Tea Estate and freshly fried Sel Roti.',
    },
    attractions: [
      {
        id: 'IN-SK-RVG-ATT-001',
        name: 'Buddha Park of Ravangla (Tathagata Tsal)',
        category: 'Spiritual / Heritage · Buddhism, 130-Foot Gilded Copper Buddha Colossus consecrated by Dalai Lama',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 50 per person', foreign: 'INR 50 per person' },
        isHiddenGem: false,
        image: '/images/sikkim/buddha-park-ravangla.png',
        photoCredit: 'User Photo / Buddha Park of Ravangla',
        summary:
          'Constructed between 2006 and 2013 to celebrate the 2550th birth anniversary of Gautama Buddha, consecrated by the 14th Dalai Lama. Features a monumental 130-foot gilded copper statue of Lord Buddha seated in Dharmachakra mudra set within manicured gardens against Mount Kangchenjunga.',
      },
      {
        id: 'IN-SK-RVG-ATT-002',
        name: 'Ralang Monastery (Palchen Chöling)',
        category: 'Spiritual · Buddhism, Major Kagyu Monastic Institute hosting the sacred Mahakala Chaam masked dances',
        timings: '08:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ralang_Monastery_Ravangla.jpg/1280px-Ralang_Monastery_Ravangla.jpg',
        photoCredit: 'Wikimedia Commons / Ralang Monastery',
        summary:
          'One of the most sacred monasteries of the Karma Kagyu order, founded in 1768 to commemorate the pilgrimage of the 4th Chogyal of Sikkim. The expansive new monastery (Palchen Chöling) houses an extensive collection of thangkas, gilded statuary, and hosts the grand annual Pang Lhabsol Chaam dances.',
      },
      {
        id: 'IN-SK-RVG-ATT-003',
        name: 'Temi Tea Estate',
        category: "Gastronomy / Nature · Farm to Table, Agro-Tourism, Sikkim's Only Tea Garden, 100% Organic Black Tea",
        timings: '08:00–16:00',
        fee: { domestic: 'Free estate walks | Factory tour: INR 50', foreign: 'Free estate walks | Factory tour: INR 50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Temi_Tea_Garden_Sikkim.jpg/1280px-Temi_Tea_Garden_Sikkim.jpg',
        photoCredit: 'Wikimedia Commons / Temi Tea Estate',
        summary:
          'Established in 1969 by the Government of Sikkim across 440 acres on a sloping mountain ridge. As the sole tea garden in Sikkim, it produces world-renowned 100% certified organic orthodox black tea with cherry blossom trees lining the emerald terraces.',
      },
      {
        id: 'IN-SK-RVG-GEM-001',
        name: 'Shar Chok Khorlo Cave (Lho Kando Sangphu)',
        category: 'Spiritual / Adventure · Hiking & Trekking, One of Four Sacred Caves blessed by Guru Padmasambhava',
        timings: 'Daylight hours (Trek from Rangit River basin)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Himalayan Cave Shrine',
        summary:
          'One of the four legendary holy caves of Sikkim sanctified by Guru Padmasambhava (Guru Rinpoche) in the 8th century, situated along the Rangit River basin. Pilgrims traverse subterranean chambers with limestone stalactites believed to bestow spiritual merits.',
      },
      {
        id: 'IN-SK-RVG-GEM-002',
        name: 'Maenam Wildlife Sanctuary & Hilltop Hermitage Trek',
        category: 'Adventure / Nature · Hiking & Trekking, 4-Hour Pine & Oak Forest Trail ascending to 3,140 m',
        timings: '07:00–16:00',
        fee: { domestic: 'INR 55', foreign: 'INR 110' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Maenam Forest Trail',
        summary:
          '4-hour trekking trail ascending from Ravangla through dense temperate forests of magnolia, rhododendron, and oak up to Maenam Peak (3,140 m). The summit features an ancient Buddhist hermitage and breathtaking 360-degree vistas stretching from Kangchenjunga to Bengal plains.',
      },
    ],
  },
];
