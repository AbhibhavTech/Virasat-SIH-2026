export interface AssamStay {
  name: string;
  category: string;
}

export interface AssamFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface AssamDining {
  veg: AssamFoodSpot[];
  nonVeg: AssamFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface AssamAttraction {
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

export interface AssamCity {
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
  topStays: AssamStay[];
  dining: AssamDining;
  attractions: AssamAttraction[];
}

export const ASSAM_DIRECTORY: AssamCity[] = [
  {
    id: 'guwahati',
    code: 'IN-AS-GHY-ULTIMATE',
    name: 'Guwahati',
    nickname: 'Gateway to the Northeast',
    tagline: 'Maa Kamakhya Shakti Peetha, Sacred River Islands, and Kalakshetra Traditions',
    accentColor: '#10B981',
    bgGradient: 'from-emerald-950/60 via-teal-950/40 to-slate-950/70',
    flashcardBlurb:
      'The bustling gateway to Northeast India set along the majestic Brahmaputra River, famed for ancient hill shrines, wildlife reserves, and rich Assamese cultural traditions.',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Kamakhya_Temple_Guwahati.jpg/1280px-Kamakhya_Temple_Guwahati.jpg',
    photoCredit: 'Wikimedia Commons / Kamakhya Temple',
    topStays: [
      { name: 'Radisson Blu Hotel Guwahati', category: 'Gotanagar — Premium 5-star comfort' },
      { name: 'Vivanta Guwahati', category: 'Khanapara — Modern luxury resort' },
      { name: 'Hotel Brahmaputra Ashok', category: 'Pan Bazar — Riverside hotel' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Café B Direct',
          location: 'GS Road',
          specialties: 'Continental and North Indian veg snacks',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Paradise Restaurant',
          location: 'Pan Bazar',
          specialties: 'Legendary traditional Assamese thalis featuring local fish curries and duck meat preparations',
        },
      ],
      peacefulNote:
        'Guwahati celebrates authentic Assamese flavors including fragrant Joha rice, Maasor Tenga (sour fish curry), and duck with ash gourd.',
    },
    attractions: [
      {
        id: 'IN-AS-GHY-ATT-001',
        name: 'Kamakhya Temple',
        category: 'Spiritual: Hinduism',
        timings: '05:30–13:00 & 14:30–17:30',
        fee: { domestic: 'Free (Special entry passes available)', foreign: 'Free (Special entry passes available)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Kamakhya_Temple_Guwahati.jpg/1280px-Kamakhya_Temple_Guwahati.jpg',
        photoCredit: 'Wikimedia Commons / Kamakhya Temple',
        summary:
          'One of the oldest and most revered Shakti Peethas perched on Nilachal Hill, famous for the annual Ambubachi Mela.',
      },
      {
        id: 'IN-AS-GHY-ATT-002',
        name: 'Umananda Island & Temple',
        category: 'Spiritual / Nature: Rivers & Lakes',
        timings: '07:30–17:00',
        fee: { domestic: 'Ferry ride ~INR 50–100', foreign: 'Ferry ride ~INR 50–100' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Umananda_Island_Guwahati.jpg/1280px-Umananda_Island_Guwahati.jpg',
        photoCredit: 'Wikimedia Commons / Umananda Island',
        summary:
          "The world's smallest inhabited river island on the Brahmaputra River, housing a 17th-century Shiva temple.",
      },
      {
        id: 'IN-AS-GHY-ATT-003',
        name: 'Srimanta Sankaradeva Kalakshetra',
        category: 'Arts / Heritage: Museums',
        timings: '10:00–19:00',
        fee: { domestic: 'INR 30', foreign: 'INR 30' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Sankardev_Kalakshetra_Guwahati.jpg/1280px-Sankardev_Kalakshetra_Guwahati.jpg',
        photoCredit: 'Wikimedia Commons / Sankardev Kalakshetra',
        summary:
          'Cultural complex preserving Assamese performing arts, fine arts, tribal artifacts, and heritage heritage models.',
      },
      {
        id: 'IN-AS-GHY-GEM-001',
        name: 'Pobitora Wildlife Sanctuary (Excursion Hub)',
        category: 'Nature: Wildlife-Tourism',
        timings: '07:00–17:00',
        fee: { domestic: 'Park entry + Jeep/Elephant safari fees apply', foreign: 'Park entry + Jeep/Elephant safari fees apply' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Pobitora_Rhino.jpg/1280px-Pobitora_Rhino.jpg',
        photoCredit: 'Wikimedia Commons / Pobitora Rhino',
        summary:
          'Wetland sanctuary located 40 km from Guwahati boasting the world\'s highest density of Great Indian One-Horned Rhinoceros.',
      },
    ],
  },
  {
    id: 'kaziranga',
    code: 'IN-AS-CITY-KAZ',
    name: 'Kaziranga',
    nickname: 'Sanctuary of the Great One-Horned Rhino',
    tagline: 'UNESCO elephant grasslands, two-thirds of the world’s one-horned rhinos & organic tea estates',
    accentColor: '#15803D',
    bgGradient: 'from-emerald-50 via-green-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/One-horned_Rhino_Kaziranga.jpg/1280px-One-horned_Rhino_Kaziranga.jpg',
    photoCredit: 'Wikimedia Commons / Kaziranga National Park',
    flashcardBlurb:
      'A UNESCO World Heritage wilderness of tall elephant grass and marshland along the Brahmaputra, harboring two-thirds of the world\'s Great One-Horned Rhinoceroses.',
    topStays: [
      { name: 'Diphlu River Lodge', category: 'Bokakhat — Ultra-Luxury Eco-Lodge, hosted British Royalty' },
      { name: 'IORA - The Retreat', category: 'Kohora — Premium 20-Acre Wildlife Resort' },
      { name: 'Borgos Resort', category: 'Central Range — Forest Canopy Hideaway' },
    ],
    dining: {
      veg: [
        { restaurant: 'Kaziranga Orchid Park Dining Hall', location: 'Kohora', specialties: 'Lavish 28-item traditional Assamese organic vegetarian thali served on bell-metal plates with wild herbs, pitika & kheer' },
        { restaurant: 'Maihang', location: 'Kohora', specialties: 'Traditional Assamese vegetarian cuisine, Baanhe Gakheer (curd in bamboo), Pitika platters & sticky rice' },
      ],
      nonVeg: [
        { restaurant: 'Wild Grass Lodge Dining', location: 'Kohora', specialties: 'Roasted country chicken with wild ginger, Rohu fish curry & Boror Tenga (lentil fritters in tangy fish gravy)' },
        { restaurant: 'Maihang', location: 'Kohora', specialties: 'Assamese duck curry with ash gourd (Kumura), pork with tender bamboo shoots & smoked river fish' },
      ],
      peacefulNote: 'Wilderness meals in Kaziranga are prepared using organic river vegetables, wild ferns (Dhekia Xaak), and locally pressed mustard oil cooked over wood embers.',
    },
    attractions: [
      {
        id: 'IN-AS-KAZ-ATT-001',
        name: 'Kaziranga National Park Safaris (Kohora, Bagori & Agaratoli Ranges)',
        category: 'Nature / Rural · UNESCO World Heritage, Wildlife-Tourism, One-Horned Rhino, Wild Buffalo, Swamp Deer',
        timings: 'Jeep Safari 07:30–10:00 & 13:30–15:00; Elephant Safari dawn shifts 05:30–07:30 (Park open Oct to May; closed monsoon)',
        fee: { domestic: 'Park View Fee INR 100 + Jeep hire (~INR 3,600–5,000 per vehicle); Elephant seat: ~INR 1,800', foreign: 'Park View Fee INR 650 + Jeep hire (~INR 3,600–5,000 per vehicle); Elephant seat: ~INR 1,800' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/One-horned_Rhino_Kaziranga.jpg/1280px-One-horned_Rhino_Kaziranga.jpg',
        photoCredit: 'Wikimedia Commons / Kaziranga National Park',
        summary:
          '430-sq-km floodplains of elephant grass, marshes, and tropical wet evergreen forests supporting over 2,400 one-horned rhinos, wild water buffaloes, Royal Bengal tigers, and Asian elephants.',
      },
      {
        id: 'IN-AS-KAZ-ATT-002',
        name: 'Kaziranga National Orchid and Biodiversity Park',
        category: 'Nature / Arts · Forests & Gardens, Over 600 Wild Orchid Species, Traditional Bihu & Jhumur Folk Dances',
        timings: '08:30–18:00',
        fee: { domestic: 'INR 120', foreign: 'INR 250' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Kaziranga_Orchid_Park.jpg/1280px-Kaziranga_Orchid_Park.jpg',
        photoCredit: 'Wikimedia Commons / Kaziranga Orchid Park',
        summary:
          'Sprawling botanical conservation park cultivating over 600 indigenous wild orchid species, medicinal herb gardens, a cactus greenhouse, and hourly live cultural performances of Bihu and tea-tribe Jhumur dances.',
      },
      {
        id: 'IN-AS-KAZ-ATT-003',
        name: 'Hathikuli & Methoni Organic Tea Estates',
        category: 'Gastronomy / Rural · Farm to Table, Agro-Tourism, Certified Organic Black Tea Tasting',
        timings: '08:00–17:00',
        fee: { domestic: 'Free estate walks (Tea tasting counter paid per cup)', foreign: 'Free estate walks (Tea tasting counter paid per cup)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Assam_Tea_Garden.jpg/1280px-Assam_Tea_Garden.jpg',
        photoCredit: 'Wikimedia Commons / Assam Tea Garden',
        summary:
          'Verdant rolling tea gardens skirting the national park boundary; Hathikuli ("frequented by elephants") is a pioneer in certified 100% organic orthodox black, green, and white CTC tea cultivation.',
      },
      {
        id: 'IN-AS-KAZ-GEM-001',
        name: 'Panbari Reserve Forest & Hoolock Gibbon Trail',
        category: 'Nature / Adventure · Hiking & Trekking, India\'s Only Ape (Hoolock Gibbon) Canopy Spotting, Woodland Birding',
        timings: '06:00–14:00 (Forest guard escort mandatory)',
        fee: { domestic: 'Forest trail permit: INR 100 + Guide charge', foreign: 'Forest trail permit: INR 100 + Guide charge' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Hoolock_Gibbon_Assam.jpg/1280px-Hoolock_Gibbon_Assam.jpg',
        photoCredit: 'Wikimedia Commons / Hoolock Gibbon',
        summary:
          'Semi-evergreen rainforest tract providing guided nature walks to spot the Western Hoolock Gibbon—India’s only ape species—swinging acrobatically through tall Dipterocarpus tree canopies.',
      },
      {
        id: 'IN-AS-KAZ-GEM-002',
        name: 'Kakochang Waterfalls',
        category: 'Nature / Adventure · Rivers & Lakes, Hiking & Trekking, Hidden Jungle Cascade tucked between rubber & coffee plantations',
        timings: '07:00–16:00',
        fee: { domestic: 'Free (30-minute foot trek from roadhead)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Kakochang_Waterfall_Assam.jpg/1280px-Kakochang_Waterfall_Assam.jpg',
        photoCredit: 'Wikimedia Commons / Kakochang Waterfalls',
        summary:
          'Stunning perennial cascade 13 km from Bokakhat plunging into a clear emerald pool, reached by a scenic 30-minute walk through rubber groves, coffee bushes, and jungle streams.',
      },
    ],
  },
  {
    id: 'majuli',
    code: 'IN-AS-CITY-MJL',
    name: 'Majuli',
    nickname: 'World’s Largest Inhabited River Island',
    tagline: 'Neo-Vaishnavite monastic Satras, 500-year-old theatrical mask guilds & tribal Mishing stilt architecture',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-orange-50/30 to-stone-50/20',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Kamalabari_Satra_Majuli.jpg/1280px-Kamalabari_Satra_Majuli.jpg',
    photoCredit: 'Wikimedia Commons / Kamalabari Satra',
    flashcardBlurb:
      'The world\'s largest inhabited river island, floating in the braided channels of the Brahmaputra; the epicenter of 15th-century Neo-Vaishnavite monastic culture and tribal Mishing stilt settlements.',
    topStays: [
      { name: 'Dekasang Majuli', category: 'Sitadar Chuk — Bamboo Eco-Cottages on Riverbank' },
      { name: 'La Maison de Ananda', category: 'Karanga Village — Traditional Mishing Bamboo Stilt Architecture' },
      { name: 'Ayang Okum River Bank', category: 'Bamboo Thatched Cottages overlooking Brahmaputra' },
    ],
    dining: {
      veg: [
        { restaurant: 'Satra Kitchens / Bhojan Griha', location: 'Kamalabari & Garamur', specialties: 'Sattvik Vaishnavite meals cooked with indigenous forest herbs, moong dal, roasted pumpkin & Joha rice' },
        { restaurant: 'Ural Restaurant', location: 'Garamur', specialties: 'Vegetarian Assamese Thalis with leafy xak, fried eggplant, lentils and sweet payas' },
      ],
      nonVeg: [
        { restaurant: 'Tribal Kitchen at La Maison de Ananda', location: 'Karanga Village', specialties: 'Authentic Mishing Pork roasted inside bamboo hollows (Khorika), fresh river fish smoked over hearth fires & red Bora sticky rice' },
        { restaurant: "Risang's Kitchen", location: 'Garamur', specialties: 'Local Mishing freshwater river fish curry cooked with elephant apple (Ou Tenga) and green chillies' },
      ],
      peacefulNote: 'Monastic culinary traditions on Majuli prohibit onion and garlic, relying on sacred tulsi leaves, wild ginger, raw mustard oil, and wholesome river pulses.',
    },
    attractions: [
      {
        id: 'IN-AS-MJL-ATT-001',
        name: 'Uttar Kamalabari & Auniati Satra',
        category: 'Spiritual / Arts · Neo-Vaishnavism, Monastic Centers, Sacred Celibate Monks, Classical Sattriya Dance & Borgeet',
        timings: '08:00–18:00',
        fee: { domestic: 'Free (Voluntary donations for Satra upkeep)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Kamalabari_Satra_Majuli.jpg/1280px-Kamalabari_Satra_Majuli.jpg',
        photoCredit: 'Wikimedia Commons / Kamalabari Satra',
        summary:
          'Influential 17th-century Vaishnavite monastic institution where celibate monk disciples (Bhokots) practice and preserve the Indian classical dance form Sattriya, devotional Borgeet hymns, and Khol drum rhythms.',
      },
      {
        id: 'IN-AS-MJL-ATT-002',
        name: 'Samaguri Satra (Traditional Mask-Making Guild)',
        category: 'Arts / Rural · Crafts-Tourism, Mukha Shilpa (Handcrafted bamboo, cane, and cow-dung theatrical masks for Bhaona folk plays)',
        timings: '09:00–17:00',
        fee: { domestic: 'Free (Artisans demonstrate mask mechanics; miniature masks available)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Samaguri_Satra_Masks_Majuli.jpg/1280px-Samaguri_Satra_Masks_Majuli.jpg',
        photoCredit: 'Wikimedia Commons / Samaguri Satra Mukha Shilpa',
        summary:
          'World-famous artisan monastery led by Sangeet Natak Akademi awardees, creating elaborate movable-jaw masks (Mukha Shilpa) from woven bamboo splits, clay, and cow dung for Bhaona mythological plays.',
      },
      {
        id: 'IN-AS-MJL-ATT-003',
        name: 'Dakhinpat Satra',
        category: 'Heritage / Spiritual · 16th-Century Monastery, Ancient Silver Filigree Thrones, Rasotsava Cultural Hub',
        timings: '08:00–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Dakhinpat_Satra_Majuli.jpg/1280px-Dakhinpat_Satra_Majuli.jpg',
        photoCredit: 'Wikimedia Commons / Dakhinpat Satra',
        summary:
          'Established in 1584 AD under royal patronage of Ahom King Jayadhwaj Singha, renowned for its grand ornamental arched gateway, ancient silver filigree thrones, and the vibrant annual Rasotsava festival.',
      },
      {
        id: 'IN-AS-MJL-GEM-001',
        name: 'Salmora Ancient Earthen Pottery Village',
        category: 'Arts / Rural · Live Like a Local, Crafts-Tourism, Pre-Historic Beaten Clay Pottery crafted without a potter\'s wheel',
        timings: '08:00–17:00',
        fee: { domestic: 'Free (Direct interaction with village women artisans)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Salmora_Pottery_Majuli.jpg/1280px-Salmora_Pottery_Majuli.jpg',
        photoCredit: 'Wikimedia Commons / Salmora Pottery',
        summary:
          'Unique riverbank village where women artisans practice a prehistoric craft of beating clay slabs by hand using wooden mallets and stones to shape pots without ever using a mechanical potter’s wheel.',
      },
      {
        id: 'IN-AS-MJL-GEM-002',
        name: 'Kalandi & Dhekiakhowa Water Channels by Country Boat',
        category: 'Nature / Adventure · Rivers & Lakes, Wetland Birding, Spotting Spot-Billed Pelicans & Greater Adjutant Storks',
        timings: '05:30–09:00 & 16:00–18:00',
        fee: { domestic: 'Country boat hire with local fisherman: INR 300–600', foreign: 'Country boat hire with local fisherman: INR 300–600' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Country Boat Wetland Channel',
        summary:
          'Tranquil inland river channels navigatable by silent wooden rowboats at dawn, perfect for spotting critically endangered Greater Adjutant Storks, Whistling Ducks, and local fishermen casting cast-nets.',
      },
    ],
  },
  {
    id: 'tezpur',
    code: 'IN-AS-CITY-TEZ',
    name: 'Tezpur',
    nickname: 'City of Eternal Romance & Mythological Ruins',
    tagline: 'Agnigarh mythological fire-fort, 9th-century Gupta stone carvings & Jia Bhoroli river rafting',
    accentColor: '#C2410C',
    bgGradient: 'from-orange-50 via-amber-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Agnigarh_Hill_Tezpur.jpg/1280px-Agnigarh_Hill_Tezpur.jpg',
    photoCredit: 'Wikimedia Commons / Agnigarh Hill',
    flashcardBlurb:
      '"The City of Eternal Romance" in Sonitpur district, steeped in the mythological love legend of Usha and Aniruddha, tea garden vistas, and colonial Brahmaputra riverfronts.',
    topStays: [
      { name: 'The Heritage Club - Tara Tea Estate', category: "Luxury Tea Planter's Bungalow Estate" },
      { name: 'Hotel Kanyapur', category: 'Central Comfortable Business Stay' },
      { name: 'Hotel Grand Park', category: 'Mission Chariali — Premium Hospitality' },
    ],
    dining: {
      veg: [
        { restaurant: 'Spring Valley Restaurant', location: 'Main Road', specialties: 'Crisp vegetarian thalis, fresh paneer curries, tandoori rotis & Hakka noodles' },
        { restaurant: 'Sree Marwari Bhojanalaya', location: 'Chowk Bazaar', specialties: 'Pure vegetarian homestyle Marwari thali with ghee-roasted rotis, dal, and pickles' },
      ],
      nonVeg: [
        { restaurant: 'Khorika Restaurant', location: 'Near ASTC Bus Stand', specialties: 'Traditional Assamese mutton curry, fish pithas, and country chicken cooked with wild coriander' },
        { restaurant: 'The Flora', location: 'Tezpur Town', specialties: 'Tribal smoked pork with dry chillies, freshwater rohu fry, and steamed rice' },
      ],
      peacefulNote: 'Tezpur cuisine draws on the bounties of Sonitpur tea gardens and the Jia Bhoroli River, renowned for river carp curries simmered with bamboo shoots.',
    },
    attractions: [
      {
        id: 'IN-AS-TEZ-ATT-001',
        name: 'Agnigarh Hill Park',
        category: 'Heritage / Arts · Historical Sites, Mythological Fort of Fire, Hilltop Stone Sculptures overlooking Brahmaputra',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 20–30', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Agnigarh_Hill_Tezpur.jpg/1280px-Agnigarh_Hill_Tezpur.jpg',
        photoCredit: 'Wikimedia Commons / Agnigarh Hill',
        summary:
          'Circular hillock overlooking the Brahmaputra where King Banasura legendarily erected a fortress surrounded by fire to isolate his daughter Usha, featuring dynamic open-air sculpted tableaux of the mythological war.',
      },
      {
        id: 'IN-AS-TEZ-ATT-002',
        name: 'Cole Park (Chitralekha Udyan)',
        category: 'Heritage / Nature · Forests & Gardens, Archeological Sites (9th-century Bamuni Hill stone-carved pillar relics, paddle boating)',
        timings: '09:00–19:00',
        fee: { domestic: 'INR 20', foreign: 'INR 20' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Chitralekha_Udyan_Tezpur.jpg/1280px-Chitralekha_Udyan_Tezpur.jpg',
        photoCredit: 'Wikimedia Commons / Chitralekha Udyan',
        summary:
          'Landscaped park with a horseshoe lake established by British Commissioner Mr. Cole in 1906, preserving 9th-century carved stone doorframes, lotus-motif pillars, and mythological reliefs from Bamuni Hill.',
      },
      {
        id: 'IN-AS-TEZ-ATT-003',
        name: 'Mahabhairab Temple',
        category: 'Spiritual · Hinduism, Ancient Shiva Temple attributed to Demon King Banasura, Massive Stone Lingam',
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Mahabhairab_Temple_Tezpur.jpg/1280px-Mahabhairab_Temple_Tezpur.jpg',
        photoCredit: 'Wikimedia Commons / Mahabhairab Temple',
        summary:
          'Ancient Hindu shrine dedicated to Lord Shiva atop a hillock in northern Tezpur, traditionally believed to have been established by King Banasura and enshrining one of the largest living stone Shiva Lingams in Asia.',
      },
      {
        id: 'IN-AS-TEZ-ATT-004',
        name: 'Kolia Bhomora Setu',
        category: 'Heritage / Nature · Engineering Marvels, 3-km Pre-stressed Concrete Bridge over Brahmaputra, Gangetic Dolphin Sighting Point',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Kolia_Bhomora_Setu_Tezpur.jpg/1280px-Kolia_Bhomora_Setu_Tezpur.jpg',
        photoCredit: 'Wikimedia Commons / Kolia Bhomora Setu',
        summary:
          '3-kilometer pre-stressed concrete road bridge spanning the Brahmaputra connecting Tezpur to Nagaon, named after the legendary Ahom General Kolia Bhomora Borphukan, renowned for boat safaris to spot Gangetic River Dolphins.',
      },
      {
        id: 'IN-AS-TEZ-GEM-001',
        name: 'Bamuni Hills Archaeological Ruins',
        category: 'Heritage · Archeological Sites, 10th-Century Gupta-Assamese Stone Friezes depicting the Dashavatara',
        timings: '08:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Bamuni_Hills_Tezpur.jpg/1280px-Bamuni_Hills_Tezpur.jpg',
        photoCredit: 'Wikimedia Commons / Bamuni Hills',
        summary:
          'Atmospheric archeological remains of a 10th-century medieval temple complex on the Brahmaputra banks, littered with ornately sculpted lintels, cross-legged ascetics, and Dashavatara stone panels.',
      },
      {
        id: 'IN-AS-TEZ-GEM-002',
        name: 'Nameri National Park Eco-Camp & Jia Bhoroli Rafting',
        category: 'Adventure / Nature · Rafting, Wildlife-Tourism, Forests & Gardens (35 km north of Tezpur; White-Winged Wood Duck & Golden Mahseer)',
        timings: '06:00–16:00',
        fee: { domestic: 'Forest entry: INR 50; Rafting float: INR 2,000–2,500/raft', foreign: 'Forest entry: INR 250; Rafting float: INR 2,000–2,500/raft' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Nameri_National_Park.jpg/1280px-Nameri_National_Park.jpg',
        photoCredit: 'Wikimedia Commons / Nameri National Park',
        summary:
          'Located in the Eastern Himalayan foothills 35 km north of Tezpur, offering guided jungle walks to spot the endangered White-Winged Wood Duck and gentle rubber raft floats along the crystal-clear Jia Bhoroli River.',
      },
    ],
  },
];
