export interface ManipurStay {
  name: string;
  category: string;
}

export interface ManipurFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface ManipurDining {
  veg: ManipurFoodSpot[];
  nonVeg: ManipurFoodSpot[];
  permitNotice?: string;
  culinaryNote?: string;
}

export interface ManipurAttraction {
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

export interface ManipurCity {
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
  topStays: ManipurStay[];
  dining: ManipurDining;
  attractions: ManipurAttraction[];
}

export const MANIPUR_DIRECTORY: ManipurCity[] = [
  {
    id: 'imphal',
    code: 'IN-MN-CITY-IMF',
    name: 'Imphal',
    nickname: 'Heart of the Jewelled Land',
    tagline: 'Ancient royal seat of Kangla, 500-year matriarchal Ima Keithel & classical Ras Lila sanctums',
    accentColor: '#047857',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: '/images/manipur/imphal-kangla-sha-fort.jpg',
    photoCredit: 'Discover Bharat / Sacred Kangla Sha Dragon-Lions at Kangla Fort',
    flashcardBlurb:
      'The capital of the "Jewelled Land" set in a valley surrounded by hills, historically significant for the ancient Kangla Palace, Vaishnavite culture, and the all-women Ima Keithel market.',
    topStays: [
      { name: 'The Classic Hotel', category: 'North AOC — Premium City Hotel' },
      { name: 'Classic Grande', category: 'Chingmeirong — 4-Star Luxury Business Stay' },
      { name: 'Sangai Continental', category: 'Thangal Bazar — Central City Comfort' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Govindas',
          location: 'ISKCON Temple Complex, Airport Road',
          specialties: 'Pure vegetarian sanctified Manipuri thalis, Dal, Kanghou, and herbal Chutneys',
        },
        {
          restaurant: 'Luxmi Kitchen',
          location: 'Thangal Bazar',
          specialties: 'Classic vegetarian Meitei thali, Singju (herb salad), Ooti, and freshly steamed rice',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Forage',
          location: '5th Floor, Uripok',
          specialties: 'Contemporary local dining serving authentic Eromba, spicy fish stew, and smoked pork delicacies',
        },
        {
          restaurant: "Naoba's Restaurant",
          location: 'Bir Tikendrajit Road',
          specialties: 'Traditional Meitei grand thali featuring Nga Thongba (aromatic fish curry) & Sareng',
        },
      ],
      permitNotice:
        'All Indian domestic tourists require an Inner Line Permit (ILP), obtainable online or at Imphal Airport / Mao Gate. Foreign nationals require Protected Area Permit (PAP) registration.',
      culinaryNote:
        'Meitei gastronomy relies heavily on fresh garden herbs, chili, and fermented fish (Ngari) or fermented bamboo shoot (Soibum) without heavy oils.',
    },
    attractions: [
      {
        id: 'IN-MN-IMF-ATT-001',
        name: 'Kangla Fort',
        category: 'Heritage: Palaces & Forts, Historical Sites',
        timings: '07:00–17:00 (Closed Wednesdays)',
        fee: {
          domestic: 'INR 50',
          foreign: 'INR 200',
        },
        isHiddenGem: false,
        image: '/images/manipur/imphal-kangla-sha-fort.jpg',
        photoCredit: 'Discover Bharat / Kangla Sha Statues & Royal Shrine',
        summary:
          'The ancient fortified citadel and coronation seat of the Meitei monarchs dating back to 33 CE. Encircled by a deep defensive moat on the banks of the Imphal River, it houses sacred groves (Umang Lai), royal burial mounds, and the towering white Kangla Sha dragon-lion stone guardians.',
      },
      {
        id: 'IN-MN-IMF-ATT-002',
        name: "Ima Keithel (Mother's Market)",
        category: 'Heritage / Arts: Live Like a Local, Crafts-Tourism',
        timings: '06:00–18:00 (Best early morning and late afternoon)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Ima Keithel Imphal',
        summary:
          'Operating for over 500 years, this legendary commercial institution is Asia’s largest all-women market. Over 4,000 married women (Imas) manage multi-story market halls divided into handloom textiles, traditional Phanek sarongs, indigenous herbs, dried fish, and ceremonial brassware.',
      },
      {
        id: 'IN-MN-IMF-ATT-003',
        name: 'Shree Govindajee Temple',
        category: 'Spiritual: Hinduism, Royal Vaishnavite Temples',
        timings: '05:00–12:00 & 16:00–21:00 (Daily Ras Lila dance rituals)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Govindajee Mandir',
        summary:
          'Constructed beside the palace compound under Maharaja Nara Singh, this twin-gold-domed temple is Manipur’s premier Vaishnavite sanctum. It serves as the epicenter for Manipur’s classical dance rituals, devotional Sankirtan singing, and the vibrant annual Yaoshang (Holi) festivities.',
      },
      {
        id: 'IN-MN-IMF-ATT-004',
        name: 'Manipur State Museum',
        category: 'Heritage: Museums, Royal & Tribal Antiquities',
        timings: '10:00–16:30 (Closed Mondays and 2nd Saturdays)',
        fee: {
          domestic: 'INR 10',
          foreign: 'INR 50',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / State Museum Imphal',
        summary:
          'Located near Kangla, this museum showcases the rich ethnographic tapestry of Manipur’s hill tribes and valley communities. Notable exhibits include royal costumes, polo (Sagol Kangjei) memorabilia, weaponry, and the majestic 54-foot-long wooden royal dragon-boat (Hiyang Hiren).',
      },
      {
        id: 'IN-MN-IMF-GEM-001',
        name: 'Andro Cultural Heritage Village',
        category: 'Rural / Arts: Crafts-Tourism, Living Traditions',
        timings: '09:00–17:00 (Open all days)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Andro Heritage Village',
        summary:
          'Nestled at the eastern foothills of Nongmaiching, Andro is an ancient Loi settlement where married women practice unique handmade coil pottery without a wheel. The village preserves the sacred Panam Ningthou Fire Temple, whose flame has been kept perpetually burning for over 1,000 years.',
      },
      {
        id: 'IN-MN-IMF-GEM-002',
        name: 'Khonghampat Orchidarium',
        category: 'Nature: Forests & Gardens, Botanical Reserves',
        timings: '09:00–17:00 (Peak orchid bloom March to April)',
        fee: {
          domestic: 'INR 10',
          foreign: 'INR 50',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Khonghampat Orchids',
        summary:
          'Spanning over 200 lush acres along NH-2 north of Imphal, this state-run sanctuary conserves over 110 rare indigenous Himalayan orchid varieties including endangered Dendrobium and Vanda species under dense forest canopies.',
      },
    ],
  },
  {
    id: 'loktak-lake',
    code: 'IN-MN-CITY-LOK',
    name: 'Loktak Lake & Moirang',
    nickname: 'The Floating Jewel of Northeast India',
    tagline: 'World’s only floating national park, circular phumdi islands & INA flag hoisting memorial',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-50 via-teal-50/40 to-stone-50/30',
    coverImage: '/images/manipur/loktak-lake-floating-phumdis.jpg',
    photoCredit: 'Discover Bharat / Circular Floating Phumdis on Lake Loktak',
    flashcardBlurb:
      "Northeast India's largest freshwater lake, globally famous for its unique circular floating biomass islands (phumdis) and the only floating national park in the world.",
    topStays: [
      { name: 'Sendra Park and Resort by Classic', category: 'Sendra Island — Premier Hilltop Lake View Resort' },
      { name: 'Loktak Aquamarine Floating Homestay', category: 'Thanga — Authentic Floating Hut Experience' },
      { name: 'Maipakchao Family Guesthouse', category: 'Thanga Island — Homely Community Hospitality' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Sendra Resort Coffee Shop',
          location: 'Sendra Island Peak',
          specialties: 'Piping-hot tea, Pakoras, fried rice, and North Indian vegetarian meals with panoramic lake vistas',
        },
        {
          restaurant: 'Moirang Town Vegetarian Canteen',
          location: 'Near INA Memorial, Moirang',
          specialties: 'Simple home-cooked Manipuri dal, steamed local red rice, and seasonal boiled greens',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Loktak Floating Homestays',
          location: 'Thanga & Karang Islands',
          specialties: 'Freshly netted Loktak fish fry, herbal fish curry cooked in earthen pots, and smoked fish relish',
        },
        {
          restaurant: 'Thanga Lakefront Kitchen',
          location: 'Thanga Jetty',
          specialties: 'Traditional Meitei freshwater fish preparations with local fragrant mint & coriander',
        },
      ],
      permitNotice:
        'Boating and entry to Sendra and Keibul Lamjao require valid ILP verification at district entry checkpoints in Bishnupur.',
      culinaryNote:
        'Loktak lake fishermen live in traditional thatched huts called Phumsang on the floating islands, eating fresh lake bounty daily.',
    },
    attractions: [
      {
        id: 'IN-MN-LOK-ATT-001',
        name: 'Loktak Lake Boating & Phumdis',
        category: 'Nature: Rivers & Lakes, Eco-Tourism',
        timings: '06:00–17:00 (Sunrise and golden hour sunset boat rides recommended)',
        fee: {
          domestic: 'INR 500–800 (Per boat ride)',
          foreign: 'INR 500–800 (Per boat ride)',
        },
        isHiddenGem: false,
        image: '/images/manipur/loktak-lake-floating-phumdis.jpg',
        photoCredit: 'Discover Bharat / Loktak Lake Aerial View',
        summary:
          'Spanning nearly 287 sq km, this Ramsar Wetland is celebrated for its hundreds of "phumdis" — floating circular mats of vegetation, soil, and organic matter. Gliding silently on traditional long wooden canoes through emerald water channels reveals a magical floating ecosystem.',
      },
      {
        id: 'IN-MN-LOK-ATT-002',
        name: 'Keibul Lamjao National Park',
        category: 'Nature: Wildlife-Tourism, Endangered Species',
        timings: '06:00–10:00 & 14:00–17:00 (Best early morning for deer sightings)',
        fee: {
          domestic: 'INR 30 (Entry) + Camera Fee',
          foreign: 'INR 200 (Entry) + Camera Fee',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Sangai Deer Habitat Keibul Lamjao',
        summary:
          'The only floating national park on Earth, located on the southern fringes of Loktak Lake. This 40 sq km sanctuary of thick floating biomass is the last wild refuge of the endangered Sangai (Rucervus eldii eldii) or "dancing deer", which gingerly balances on the spongy floating terrain.',
      },
      {
        id: 'IN-MN-LOK-ATT-003',
        name: 'INA Memorial Complex & War Museum, Moirang',
        category: 'Heritage: Historical Sites, Freedom Struggle Memorials',
        timings: '09:00–17:00 (Closed Mondays)',
        fee: {
          domestic: 'INR 10',
          foreign: 'INR 50',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / INA Memorial Moirang',
        summary:
          'On 14 April 1944, Colonel Shaukat Ali of Netaji Subhas Chandra Bose’s Indian National Army (INA) hoisted the Indian tricolor for the first time on liberated Indian soil right here in Moirang. The memorial houses a life-size statue of Netaji, rare wartime photographs, and battlefield relics.',
      },
      {
        id: 'IN-MN-LOK-GEM-001',
        name: 'Sendra Island Viewpoint',
        category: 'Nature: Panoramic Viewpoints, Lake Overlooks',
        timings: 'Daylight hours (05:30–18:00)',
        fee: {
          domestic: 'Free (Vehicle parking extra)',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Sendra Ridge View',
        summary:
          'An elevated rocky hillock connected to the mainland by a narrow scenic causeway. The summit viewing platform provides the most breathtaking aerial-style panoramic perspective of Loktak Lake’s concentric circular fish-farming phumdis set against the Barail hill backdrop.',
      },
      {
        id: 'IN-MN-LOK-GEM-002',
        name: 'Loukoipat Ecological Park, Bishnupur',
        category: 'Nature / Recreation: Forests & Gardens, Lotus Ponds',
        timings: '09:00–17:00 (Open all days)',
        fee: {
          domestic: 'INR 20',
          foreign: 'INR 50',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Loukoipat Lotus Lake',
        summary:
          'Tucked quietly into the low wooded hills of Bishnupur district, this serene ecological park surrounds a natural lotus pond alive with bird calls, offering pedal boating and peaceful walking trails away from tourist trails.',
      },
    ],
  },
  {
    id: 'ukhrul',
    code: 'IN-MN-CITY-UKR',
    name: 'Ukhrul',
    nickname: 'Homeland of the Tangkhul Nagas & Shirui Lily',
    tagline: 'Manipur’s highest hill retreat, prehistoric limestone caverns & endemic mountain blooms',
    accentColor: '#9333EA',
    bgGradient: 'from-purple-50 via-indigo-50/40 to-stone-50/30',
    coverImage: '/images/manipur/ukhrul-shirui-hills.jpg',
    photoCredit: 'Discover Bharat / Shirui Kashong Peak & Mountain Ridges',
    flashcardBlurb:
      'The highest hill station in Manipur and the homeland of the Tangkhul Nagas, famous for the rare Shirui Lily and ancient prehistoric limestone cave systems.',
    topStays: [
      { name: '25 Degrees North', category: 'Ukhrul Town — Premium Boutique Mountain Stay' },
      { name: 'Shalom Lodge', category: 'Viewland, Ukhrul — Comfortable Traveler Base' },
      { name: 'Tangkhul Naga Village Homestays', category: 'Shirui & Khangkhui — Authentic Tribal Living' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Hill Town View Canteen',
          location: 'Ukhrul Main Market',
          specialties: 'Simple rice thalis, fresh mountain boiled cabbage, bamboo shoots, and wild forest herbs',
        },
        {
          restaurant: 'Shirui Village Kitchens',
          location: 'Shirui Foothills',
          specialties: 'Steamed local hill rice, aromatic herbal broth, and spicy chili chutneys',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Zaorla Restaurant',
          location: 'Viewland, Ukhrul',
          specialties: 'Authentic Tangkhul Naga smoked pork with fermented bamboo shoot, beef curry, and organic red rice',
        },
        {
          restaurant: 'Taza Food Hut',
          location: 'Ukhrul Bazaar',
          specialties: 'Traditional wood-smoked meats, boiled local country fowl with ginger, and Naga king chili relish',
        },
      ],
      permitNotice:
        'Ukhrul is located in high hill territory. Domestic visitors must present ILP at police checkpoints along the Imphal-Ukhrul highway.',
      culinaryNote:
        'Tangkhul Naga cuisine is predominantly boiled and smoked, utilizing fiery Hathei chillies and aromatic wild herbs.',
    },
    attractions: [
      {
        id: 'IN-MN-UKR-ATT-001',
        name: 'Shirui Hills (Shirui Kashong Peak)',
        category: 'Nature / Adventure: Hills & Mountains, Hiking & Trekking',
        timings: 'Daylight hours (Trek takes approx. 2.5–3 hours to reach the summit)',
        fee: {
          domestic: 'Free (Local community guide recommended)',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: '/images/manipur/ukhrul-shirui-hills.jpg',
        photoCredit: 'Discover Bharat / Shirui Peak Ridge',
        summary:
          'Standing at 2,835 metres above sea level, Shirui Kashong is the exclusive natural habitat of the rare, pale pink bell-shaped Shirui Lily (Lilium mackliniae) that blooms between mid-May and June. The exhilarating hike rewards trekkers with breathtaking views over clouds rolling into the Myanmar border hills.',
      },
      {
        id: 'IN-MN-UKR-ATT-002',
        name: 'Khangkhui Lime Caves',
        category: 'Adventure / Heritage: Geological Caves, Archaeological Sites',
        timings: 'Daylight hours (08:00–16:00; Flashlights and sturdy shoes required)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Khangkhui Caves',
        summary:
          'A remarkable network of natural limestone caves containing massive stalactites and stalagmites dating back to the Paleolithic age. Archaeologists have excavated stone artifacts and bone tools here, while during World War II, local Tangkhul villagers took shelter in its subterranean chambers from aerial bombings.',
      },
      {
        id: 'IN-MN-UKR-GEM-001',
        name: 'Kachouphung Lake',
        category: 'Nature: High Altitude Lakes, Pine Woodlands',
        timings: 'Daylight hours (Best visited in late morning)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Kachouphung Lake',
        summary:
          'Situated near the Indo-Myanmar boundary roughly 7 km from Khayang falls, this tranquil, offbeat freshwater lake sits encircled by lush slopes and fragrant pine woods, retaining untouched natural wilderness.',
      },
      {
        id: 'IN-MN-UKR-GEM-002',
        name: 'Nillai Tea Estate',
        category: 'Nature / Rural: Agro-Tourism, Organic Tea Gardens',
        timings: '08:00–16:00 (Open all days)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Nillai Tea Gardens',
        summary:
          'Located near Talui village, this pristine, undulating tea estate cultivates organic green and black orthodox tea varieties known for natural curative properties, where visitors can enjoy walks across manicured rows and sample artisanal hill tea.',
      },
    ],
  },
  {
    id: 'moreh',
    code: 'IN-MN-CITY-MOR',
    name: 'Moreh',
    nickname: 'Gateway to Southeast Asia',
    tagline: 'Crucial international trade frontier, vibrant border markets & cross-cultural melting pot',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: '/images/manipur/moreh-india-myanmar-friendship-gate.jpg',
    photoCredit: 'Discover Bharat / Indo-Myanmar Friendship Road Bridge at Moreh Border',
    flashcardBlurb:
      'The bustling commercial frontier and "Gateway to Southeast Asia," a crucial border town connecting India to Myanmar, known for cross-border trade and vibrant markets.',
    topStays: [
      { name: 'Elora Hotel', category: 'Moreh Town — Comfortable Modern Commercial Stay' },
      { name: 'Sangai Lodge', category: 'Trade Center Area — Standard Business Base' },
      { name: 'Indo-Myanmar Trade Centre Rest House', category: 'Tengnoupal Road — Government Transit House' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Trade Centre Road Dhabas',
          location: 'Moreh Bazaar',
          specialties: 'Standard North Indian vegetarian meals, Dal Tadka, Roti, and South Indian idli-dosa from the Tamil diaspora',
        },
        {
          restaurant: 'Punjab Hotel',
          location: 'Main Road Moreh',
          specialties: 'Puri Sabzi, Tandoori rotis, and comforting vegetarian thali',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Border Market Food Stalls',
          location: 'Near Friendship Gate',
          specialties: 'Burmese Mohinga noodle soup, spiced pork skewers, fried snacks, and traditional Manipuri fish curries',
        },
        {
          restaurant: 'Burmese Noodle House',
          location: 'Bazaar Area',
          specialties: 'Khow Suey, pork fried noodles, and authentic Burmese green tea leaf salad (Lahpet Thoke)',
        },
      ],
      permitNotice:
        'Moreh is situated right on the international border line. Strict military and police verification (ILP & valid Government Photo ID) occurs at Tengnoupal and Moreh checkpoints.',
      culinaryNote:
        'Moreh presents a fascinating demographic fusion: alongside Meiteis, Kukis, and Nagas, a vibrant Tamil diaspora settled here in the 1960s, introducing authentic dosas alongside Burmese Mohinga.',
    },
    attractions: [
      {
        id: 'IN-MN-MOR-ATT-001',
        name: 'Indo-Myanmar Friendship Gate',
        category: 'Heritage: International Borders, Strategic Land Borders',
        timings: '07:00–16:00 (Movement subject to current bilateral border protocols)',
        fee: {
          domestic: 'Free (Valid Government ID required)',
          foreign: 'Free (Passport & PAP permit checks apply)',
        },
        isHiddenGem: false,
        image: '/images/manipur/moreh-india-myanmar-friendship-gate.jpg',
        photoCredit: 'Discover Bharat / Friendship Gate & BRO Signboard',
        summary:
          'The historical steel truss bridge spanning the Namphalong stream that serves as the official land border between Moreh (India) and Tamu (Sagaing Region, Myanmar). A vital anchor of India’s "Act East Policy," the Friendship Gate links the Asian Highway AH1 network between South and Southeast Asia.',
      },
      {
        id: 'IN-MN-MOR-ATT-002',
        name: 'Namphalong Market (Myanmar Side)',
        category: 'Rural / Recreation: Shopping, Cross-Border Trading',
        timings: '07:00–15:00 (Subject to active border open protocols)',
        fee: {
          domestic: 'Nominal border gate entry fee when open',
          foreign: 'Subject to border transit rules',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Namphalong Bazaar',
        summary:
          'Located directly across the border bridge on Myanmar soil, this bustling commercial bazaar is renowned for imported electronics, Burmese teak handicrafts, chinaware, jade trinkets, woven blankets, and authentic Southeast Asian street savories.',
      },
      {
        id: 'IN-MN-MOR-ATT-003',
        name: 'Moreh Local Town Market',
        category: 'Rural: Live Like a Local, Cultural Melting Pots',
        timings: '08:00–17:00 (Open all days)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Moreh Market Streets',
        summary:
          'The thriving Indian side of the frontier trading post where Meiteis, Kukis, Nagas, Tamils, and Punjabis trade side-by-side. The market stalls overflow with Southeast Asian canned fruits, packed seasonings, dried fish, woven tribal textiles, and spices.',
      },
      {
        id: 'IN-MN-MOR-GEM-001',
        name: 'Sri Angala Parameswari & Kondong Lairembi Temples',
        category: 'Spiritual: Multicultural Shrines, Border Guardians',
        timings: '06:00–18:00 (Morning and evening prayers)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Border Temples Moreh',
        summary:
          'A testament to Moreh’s diverse cultural fabric, Kondong Lairembi is deeply venerated by Meitei traders for safe border journeys, while nearby stands one of India’s easternmost Tamil Hindu shrines, Sri Angala Parameswari, erected by Tamil settlers.',
      },
      {
        id: 'IN-MN-MOR-GEM-002',
        name: 'Kwatha Village',
        category: 'Rural / Arts: Live Like a Local, Heritage Settlements',
        timings: 'Daylight hours (08:00–16:00)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Kwatha Hamlet',
        summary:
          'Surrounded by thick bamboo hills near the Myanmar border, Kwatha is an ancient, isolated Meitei village that has preserved its customs for generations. It is famous across Manipur as the traditional heartland for producing premium fermented bamboo shoot (Soibum).',
      },
    ],
  },
];
