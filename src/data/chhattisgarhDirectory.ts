export interface ChhattisgarhStay {
  name: string;
  category: string;
}

export interface ChhattisgarhFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface ChhattisgarhDining {
  veg: ChhattisgarhFoodSpot[];
  nonVeg: ChhattisgarhFoodSpot[];
  tribalNotice?: string;
  peacefulNote?: string;
}

export interface ChhattisgarhAttraction {
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

export interface ChhattisgarhCity {
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
  topStays: ChhattisgarhStay[];
  dining: ChhattisgarhDining;
  attractions: ChhattisgarhAttraction[];
}

export const CHHATTISGARH_DIRECTORY: ChhattisgarhCity[] = [
  {
    id: 'raipur',
    code: 'IN-CT-CITY-RPR',
    name: 'Raipur',
    nickname: 'Bustling Commercial Capital & Gateway to Central India',
    tagline: 'Ancient Kalchuri temples, sprawling tribal museums & serene urban lakes',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: '/images/chhattisgarh/raipur-vivekananda-sarovar.png',
    photoCredit: 'Discover Bharat / Swami Vivekananda Sarovar (Budha Talab)',
    flashcardBlurb:
      'The bustling capital and commercial hub of Chhattisgarh, blending ancient temples, sprawling tribal museums, and serene urban lakes in the heart of the state.',
    topStays: [
      { name: 'Courtyard by Marriott', category: 'Labhandi — Luxury Central Stay' },
      { name: 'Mayfair Lake Resort', category: 'Nava Raipur — Ultra-Luxury Heritage Resort' },
      { name: 'Hotel Babylon International', category: 'VIP Road — Premium Business' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Gadh Kalewa',
          location: 'Civil Lines / Purkhouti Muktangan',
          specialties: 'Authentic Chhattisgarhi snacks like Chila, Fara, Muthia in an open-air ethnic setting',
        },
        {
          restaurant: 'Manju Mamta Restaurant',
          location: 'MG Road',
          specialties: 'Chaat, Chhole Bhature, and rich North Indian vegetarian thalis',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Madrasi Restaurant',
          location: 'Station Road',
          specialties: 'Spicy Chicken Biryani and homestyle Mutton Curry',
        },
        {
          restaurant: "Noah's Ark",
          location: 'Hotel Babylon',
          specialties: 'Continental & Indian Non-Veg fine dining delicacies',
        },
      ],
      peacefulNote:
        'Chhattisgarhi cuisine celebrates the "Rice Bowl of India" with steamed rice-flour dumplings (Fara), rice crepes (Chila), and Mahuwa-infused sweets.',
    },
    attractions: [
      {
        id: 'IN-CT-RPR-ATT-001',
        name: 'Purkhouti Muktangan, Nava Raipur',
        category: 'Arts / Rural · Museums, Tribal-Tourism, Open-Air Cultural Complex',
        timings: '08:00–18:00 (Closed Mondays)',
        fee: { domestic: 'INR 10–20', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Chhattisgarh Tourism',
        summary:
          'Sprawling 200-acre open-air cultural museum showcasing indigenous Bastar village models, vibrant tribal murals, lifelike tribal life sculptures, and traditional handicraft huts.',
      },
      {
        id: 'IN-CT-RPR-ATT-002',
        name: 'Swami Vivekananda Sarovar (Budha Talab)',
        category: 'Nature / Recreation · Rivers & Lakes, Historic Water Body & Landmark Statue',
        timings: '06:00–21:00',
        fee: { domestic: 'Free (Boating extra)', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/chhattisgarh/raipur-vivekananda-sarovar.png',
        photoCredit: 'Discover Bharat',
        summary:
          'Historic city lake dating back to the Kalchuri Dynasty featuring a towering 37-ft bronze statue of Swami Vivekananda, illuminated evening promenades, and pedal boating.',
      },
      {
        id: 'IN-CT-RPR-ATT-003',
        name: 'Mahant Ghasidas Memorial Museum',
        category: 'Heritage / Arts · Museums, Kalchuri Bronzes & Indigenous Tribal Artifacts',
        timings: '10:00–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 5', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Tapt_Kund_Badrinath.jpg/1280px-Tapt_Kund_Badrinath.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Established in 1875 by Raja Balaram Das, this is one of India’s oldest museums, housing 10th-to-12th-century Kalchuri sculptures, Buddhist bronzes, ancient weapons, and tribal epigraphy.',
      },
      {
        id: 'IN-CT-RPR-GEM-001',
        name: 'Ghatarani Waterfalls & Jatmai Temple',
        category: 'Nature / Spiritual · Rivers & Lakes, Hinduism, Forest Cascades & Sacred Shrine',
        timings: '08:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Jungle Waterfall',
        summary:
          'Scenic twin forest waterfalls and sacred stone shrines nestled 85 km from Raipur amidst lush teak groves, where cool perennial streams cascade over natural granite rock shelves.',
      },
      {
        id: 'IN-CT-RPR-GEM-002',
        name: 'MM Fun City',
        category: 'Recreation · Amusement & Theme Parks, Water Rides & Family Resort',
        timings: '10:30–19:00',
        fee: { domestic: 'INR 400–500', foreign: 'INR 400–500' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Waterpark',
        summary:
          'Chhattisgarh’s largest amusement and water theme park, featuring wave pools, multi-lane water slides, rain dance arenas, and expansive family entertainment zones.',
      },
    ],
  },
  {
    id: 'jagdalpur-bastar',
    code: 'IN-CT-CITY-JGB',
    name: 'Jagdalpur & Bastar',
    nickname: 'Tribal Heartland & Niagara of India',
    tagline: "India's widest waterfall, animist festivals, Dhokra metal craft & sal forests",
    accentColor: '#059669',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: '/images/chhattisgarh/bastar-chitrakote-falls.png',
    photoCredit: 'Discover Bharat / Chitrakote Horseshoe Waterfalls',
    flashcardBlurb:
      "The tribal heartland of Bastar, famous for India's widest waterfall, ancient animist traditions, exquisite bell metal (Dhokra) art, and dense, untamed teak forests.",
    topStays: [
      { name: 'Bastar Jungle Resort', category: 'Dharampura — Eco-Tourism Forest Cottages' },
      { name: 'Naman Bastar Resort', category: 'Chitrakote Road — Nature Resort & Spa' },
      { name: 'Aamcho Bastar Resort', category: 'Jagdalpur Outskirts — Tribal-Themed Stay' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Indian Coffee House',
          location: 'Main Road, Jagdalpur',
          specialties: 'Crisp Masala Dosas, South Indian tiffins, and classic filter coffee',
        },
        {
          restaurant: 'Suruchi Thali',
          location: 'Main Market, Jagdalpur',
          specialties: 'Wholesome North Indian and Chhattisgarhi vegetarian thalis',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Bastar Tribal Food Stalls / Haats',
          location: 'Weekly Village Haats & Dhabas',
          specialties: 'Chapra (spicy red ant chutney), Desi Mura (free-range village chicken), and Salphi palm nectar',
        },
      ],
      tribalNotice:
        'Culinary Adventure Note: Commercial restaurants in Jagdalpur are basic. Authentic indigenous Bastar delicacies like Chapra chutney and local millet beers are discovered through licensed cultural village guides at weekly tribal haats.',
      peacefulNote:
        'Bastar tribal cuisine is rooted in deep forest foraging, using dried bamboo shoots (Karil), wild greens, and ancient wood-fired earthen pot roasting.',
    },
    attractions: [
      {
        id: 'IN-CT-JGB-ATT-001',
        name: 'Chitrakote Waterfalls',
        category: 'Nature · Rivers & Lakes, The "Niagara of India", Horseshoe Waterfall',
        timings: 'Open 24 Hours (Best viewed in daylight; roaring during monsoons)',
        fee: { domestic: 'Free (Boating ~INR 50)', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/chhattisgarh/bastar-chitrakote-falls.png',
        photoCredit: 'Discover Bharat',
        summary:
          'Spanning nearly 300 metres across the Indravati River, Chitrakote is India’s widest waterfall, plunging 95 feet over horseshoe sandstone cliffs into a mist-shrouded gorge.',
      },
      {
        id: 'IN-CT-JGB-ATT-002',
        name: 'Bastar Palace & Danteshwari Temple',
        category: 'Heritage / Spiritual · Palaces & Forts, Hinduism, Kakatiya Dynasty Seat',
        timings: '06:00–19:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat',
        summary:
          'The historical royal seat of the Kakatiya kings in Jagdalpur town, hosting the sacred shrine of Maa Danteshwari, the guardian deity of the legendary 75-day Bastar Dussehra festival.',
      },
      {
        id: 'IN-CT-JGB-ATT-003',
        name: 'Kanger Valley National Park & Tirathgarh Falls',
        category: 'Nature · Wildlife-Tourism, Rivers & Lakes, Sal Forests & Tiered Block Falls',
        timings: '08:00–16:00',
        fee: { domestic: 'INR 50 + Vehicle fee', foreign: 'INR 150 + Vehicle fee' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Forest Waterfall',
        summary:
          'Dense 200 sq. km biosphere supporting the endangered Bastar hill myna, highlighted by the breathtaking 300-ft Tirathgarh multi-tiered cascade splitting into multiple white foaming channels.',
      },
      {
        id: 'IN-CT-JGB-GEM-001',
        name: 'Kutumsar Caves',
        category: 'Adventure / Nature · Geological Caves, Subterranean Stalactites & Blind Fish',
        timings: '09:00–15:00 (Closed Monsoons July to October)',
        fee: { domestic: 'INR 50 + Gypsy/Guide', foreign: 'INR 150 + Gypsy/Guide' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Chhattisgarh Tourism',
        summary:
          'Deep underground limestone cavern stretching 330 metres into pitch-black subterranean chambers filled with surreal stalactite formations and natural pools harboring blind troglobitic fish.',
      },
      {
        id: 'IN-CT-JGB-GEM-002',
        name: 'Kondagaon Dhokra Artisan Village',
        category: 'Arts / Rural · Crafts-Tourism, Live Like a Local, Lost-Wax Bell Metal Casting',
        timings: '09:00–18:00',
        fee: { domestic: 'Free (Direct workshop observation)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Bastar Tribal Artisans',
        summary:
          'The artisan craft capital of Bastar where national award-winning tribal metalsmiths practice 4,000-year-old lost-wax Dhokra casting, shaping brass figurines of forest spirits and ritual deities.',
      },
    ],
  },
  {
    id: 'sirpur',
    code: 'IN-CT-CITY-SRP',
    name: 'Sirpur',
    nickname: 'Ancient Syncretic Capital & Archaeological Marvel',
    tagline: '5th–8th century Buddhist viharas, red brick Lakshmana temple & Surang Tila',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-stone-50/50 to-orange-50/30',
    coverImage: '/images/chhattisgarh/sirpur-lakshmana-temple.png',
    photoCredit: 'Discover Bharat / Lakshmana Brick Temple, Sirpur',
    flashcardBlurb:
      'An archaeological treasure trove on the banks of the Mahanadi River, revealing a 5th-to-8th-century syncretic capital of Buddhist viharas, Jain basadis, and Hindu brick temples.',
    topStays: [
      { name: 'Hiuen Tsiang Tourist Resort', category: 'Sirpur — CG Tourism Reliable Basic Resort' },
      { name: 'CG Tourism Motel Sirpur', category: 'Mahanadi Riverfront Guest Lodge' },
      { name: 'Excursion from Raipur', category: 'Most visitors stay in Raipur (80 km) and visit Sirpur on day tours' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Tourist Resort Canteen',
          location: 'Hiuen Tsiang Resort, Sirpur',
          specialties: 'Simple nourishing Indian meals, Dal Tadka, Steamed Rice, Aloo Sabzi & crispy Pakoras',
        },
      ],
      nonVeg: [],
      tribalNotice:
        'Archaeological Buffer Zone Notice: Non-vegetarian dining options and commercial restaurants are strictly restricted around the protected historical excavation precincts.',
      peacefulNote:
        'Travelers enjoy simple vegetarian village meals prepared with locally harvested Mahanadi river valley organic grains and farm-fresh vegetables.',
    },
    attractions: [
      {
        id: 'IN-CT-SRP-ATT-001',
        name: 'Lakshmana Temple',
        category: 'Heritage / Spiritual · Archeological Sites, Hinduism, 7th-Century Red Brick Temple',
        timings: '06:00–18:00',
        fee: { domestic: 'INR 25 (ASI Composite)', foreign: 'INR 300 (ASI Composite)' },
        isHiddenGem: false,
        image: '/images/chhattisgarh/sirpur-lakshmana-temple.png',
        photoCredit: 'Discover Bharat',
        summary:
          'One of India’s finest preserved 7th-century brick temples, built by Queen Vasata in memory of King Harshagupta, featuring exquisite carvings of Vishnu avatars and Krishna Leela.',
      },
      {
        id: 'IN-CT-SRP-ATT-002',
        name: 'Teevardev Buddhist Vihara (Anand Prabhu Kuti Vihara)',
        category: 'Heritage / Spiritual · Archeological Sites, Buddhism, Hiuen Tsang Monastic Ruins',
        timings: '06:00–18:00',
        fee: { domestic: 'Free / Covered in ASI ticket', foreign: 'Free / Covered in ASI ticket' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'ASI / Sirpur Excavations',
        summary:
          'Sprawling residential monastic complex visited by 7th-century Chinese pilgrim Hiuen Tsang, housing a monumental 6-foot seated Buddha touching the earth in Bhumisparsha mudra.',
      },
      {
        id: 'IN-CT-SRP-ATT-003',
        name: 'Surang Tila',
        category: 'Heritage · Archeological Sites, Earthquake-Resistant Stepped Temple',
        timings: '06:00–18:00',
        fee: { domestic: 'Covered in ASI ticket', foreign: 'Covered in ASI ticket' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/7th_-_9th_century_Surang_tila_mandapa_before_shrines%2C_Sirpur_monuments_Chhattisgarh.jpg/1280px-7th_-_9th_century_Surang_tila_mandapa_before_shrines%2C_Sirpur_monuments_Chhattisgarh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Magnificent 30-foot pyramid-like stone platform accessed via 32 steep stone steps, renowned for ingenious earthquake-dampening hollow stone foundation shafts.',
      },
      {
        id: 'IN-CT-SRP-GEM-001',
        name: 'Baleshwar Mahadev Temple Ruins',
        category: 'Heritage · Archeological Sites, 8th-Century Monolithic Shiva Complex',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Archaeological Survey of India',
        summary:
          'Recently excavated 8th-century stone temple complex dedicated to Lord Shiva, characterized by towering sculpted granite pillars, star-shaped plinths, and submerged ritual kunds.',
      },
      {
        id: 'IN-CT-SRP-GEM-002',
        name: 'Gandheshwar Temple',
        category: 'Spiritual · Hinduism, Living Mahanadi Riverbank Temple & Salvaged Antiquities',
        timings: '06:00–19:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Sirpur Pilgrimage',
        summary:
          'Historic living shrine located right on the banks of the sacred Mahanadi River, incorporating ancient 6th-to-8th-century recovered sculptures of Mahishasuramardini and Buddha.',
      },
    ],
  },
  {
    id: 'mainpat',
    code: 'IN-CT-CITY-MPT',
    name: 'Mainpat',
    nickname: 'Shimla of Chhattisgarh & Mini Tibet',
    tagline: 'Tibetan monastic settlements, bouncing peatlands, bauxite cliffs & misty waterfalls',
    accentColor: '#4338CA',
    bgGradient: 'from-indigo-50 via-sky-50/40 to-stone-50/30',
    coverImage: '/images/chhattisgarh/mainpat-dhakpo-monastery.png',
    photoCredit: 'Discover Bharat / Dhakpo Shedupling Monastery, Mainpat',
    flashcardBlurb:
      'The "Shimla of Chhattisgarh," a forested plateau that serves as a quiet Tibetan refugee settlement, adorned with Buddhist monasteries, cascading waterfalls, and bauxite mines.',
    topStays: [
      { name: 'Shaila Tourist Resort', category: 'CG Tourism — Best Plateau Ridge Views' },
      { name: 'Saila Resort', category: 'Mainpat Hills — Comfortable Nature Haven' },
      { name: 'Mercury Resort', category: 'Camp Area — Hilltop Luxury Swiss Tents' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Tibetan Settlement Cafes',
          location: 'Camp No. 1, Mainpat',
          specialties: 'Steamed Vegetable Momos, hot vegetable Thukpa broth, and salted Tibetan Butter Tea',
        },
        {
          restaurant: 'Resort Dining Halls',
          location: 'Saila / Shaila Resorts',
          specialties: 'Piping hot North Indian Dal, Paneer gravies, and hot tawa rotis',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Local Tibetan Joint Stalls',
          location: 'Camp 1 Market',
          specialties: 'Juicy Pork Momos, Shredded Chicken Thukpa, and steamed Tingmo buns',
        },
      ],
      peacefulNote:
        'Mainpat pairs Tibetan butter tea and comforting noodle broths with highland organic farm harvests like buckwheat pancakes and roasted maize.',
    },
    attractions: [
      {
        id: 'IN-CT-MPT-ATT-001',
        name: 'Dhakpo Shedupling Monastery (Camp No. 1)',
        category: 'Spiritual / Arts · Buddhism, Gelugpa Tibetan Monastery & "Mini Tibet"',
        timings: '07:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/chhattisgarh/mainpat-dhakpo-monastery.png',
        photoCredit: 'Discover Bharat',
        summary:
          'Vibrant Tibetan Buddhist monastery established in 1962 by His Holiness the Dalai Lama for resettled Tibetan refugees, featuring gilded stupas, spinning prayer wheels, and intricate thangka murals.',
      },
      {
        id: 'IN-CT-MPT-ATT-002',
        name: 'Tiger Point Waterfall',
        category: 'Nature · Rivers & Lakes, Forest Cascade in Former Tiger Territory',
        timings: '08:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Mainpat Tourism',
        summary:
          'A majestic 60-metre waterfall dropping through dense deodar and sal jungle ravines, where wild tigers historically gathered to drink from the clear mountain stream.',
      },
      {
        id: 'IN-CT-MPT-ATT-003',
        name: 'Jaljali (Bouncing Land)',
        category: 'Nature · Geological Wonder, Trampoline Peat Bog & Spring Phenomenon',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Geological Marvels of India',
        summary:
          'A rare geological wonder where a 3-acre wetland meadow acts like a natural trampoline, bouncing underfoot due to subterranean hydraulic pressure beneath spongy peat soil layers.',
      },
      {
        id: 'IN-CT-MPT-GEM-001',
        name: 'Fish Point Waterfall',
        category: 'Nature / Adventure · Rivers & Lakes, Deep Rocky Gorge & Mountain Rivulet',
        timings: '08:00–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Chhattisgarh Tourism',
        summary:
          'Scenic 48-metre cascade crashing through narrow rocky canyons into the Machhali River, so named because the deep natural pool below is teeming with diverse native Himalayan fish.',
      },
      {
        id: 'IN-CT-MPT-GEM-002',
        name: 'Mehta Point & Parpatiya Sunset Point',
        category: 'Nature · Hills & Mountains, Panoramic Valley Vistas & Sunset Horizons',
        timings: 'Daylight hours (Best at sunset)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Mainpat Highlands',
        summary:
          'Breathtaking high-altitude clifftop viewpoints offering dramatic 180-degree vistas of the forested border valleys dividing Chhattisgarh, Jharkhand, and Madhya Pradesh.',
      },
    ],
  },
];
