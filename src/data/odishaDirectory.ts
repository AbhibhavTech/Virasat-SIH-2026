export interface OdishaStay {
  name: string;
  category: string;
}

export interface OdishaFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface OdishaDining {
  veg: OdishaFoodSpot[];
  nonVeg: OdishaFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface OdishaAttraction {
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

export interface OdishaCity {
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
  topStays: OdishaStay[];
  dining: OdishaDining;
  attractions: OdishaAttraction[];
}

export const ODISHA_DIRECTORY: OdishaCity[] = [
  {
    id: 'bhubaneswar',
    code: 'IN-OR-CITY-BBI',
    name: 'Bhubaneswar',
    nickname: 'The Temple City of India',
    tagline: '500+ Kalinga sandstone temples, Ashokan peace edicts & ancient Kharavela rock shelters',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Lingaraja_Temple_Bhubaneswar.jpg/1280px-Lingaraja_Temple_Bhubaneswar.jpg',
    photoCredit: 'Kevin Standage - WordPress.com / Lingaraja Temple – Bhubaneswar – A Non-Hindu View – Kevin Standage',
    flashcardBlurb:
      '"The Temple City of India", boasting over 500 Kalinga-style sandstone shrines, Ashokan rock edicts, and ancient rock-cut Jain monastic caves.',
    topStays: [
      { name: 'Mayfair Lagoon', category: 'Jayadev Vihar — Luxury Eco-Heritage Resort' },
      { name: 'Welcomhotel by ITC Hotels', category: 'Dumduma — Modern Kalinga Architecture' },
      { name: 'Vivanta Bhubaneswar', category: 'DN Regalia — Contemporary Luxury' },
    ],
    dining: {
      veg: [
        { restaurant: 'Hare Krishna Restaurant', location: 'Lalchand Market', specialties: 'Pure Odia vegetarian thalis, wholesome Dalma (lentils with raw papaya & pumpkin), sweet Kanika rice & ghee puris' },
        { restaurant: 'Priya Restaurant', location: 'Unit 3', specialties: 'Crispy South Indian tiffins, Chenna Poda (baked caramelized cheese fudge) & Chenna Gaja' },
      ],
      nonVeg: [
        { restaurant: 'Dalma Restaurant', location: 'Madhusudan Nagar', specialties: 'Authentic Odia Machha Besara (fish in mustard paste), Mansa Kassa (spicy mutton roast) & Chuna Machha Bhaja' },
        { restaurant: "Michael's Kitchen", location: 'Patia', specialties: 'Coastal Bay of Bengal seafood, Crab Kalia, Prawn Malai curry & garlic naan' },
      ],
      peacefulNote: 'Odia cooking celebrates delicate panch phoron tempering, mustard seed paste (besara), fresh grated coconut, and slow earthen-pot Dalma simmered with indigenous vegetables.',
    },
    attractions: [
      {
        id: 'IN-OR-BBI-ATT-001',
        name: 'Lingaraj Temple',
        category: 'Spiritual / Heritage · Hinduism, Kalinga Architecture, 11th-Century Deula',
        timings: '05:00–21:00 (Entry restricted to Hindus; non-Hindus can view from the raised ASI viewing platform)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Lingaraja_Temple_Bhubaneswar.jpg/1280px-Lingaraja_Temple_Bhubaneswar.jpg',
        photoCredit: 'Kevin Standage - WordPress.com / Lingaraja Temple – Bhubaneswar',
        summary:
          '11th-century architectural apex of Kalinga masonry dedicated to Harihara (combined Shiva & Vishnu), dominated by a soaring 55-meter Deula tower and surrounded by 108 subsidiary stone shrines.',
      },
      {
        id: 'IN-OR-BBI-ATT-002',
        name: 'Udayagiri & Khandagiri Caves',
        category: 'Heritage / Spiritual · Jainism, Archeological Sites, 2nd-Century BCE King Kharavela Inscriptions',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Udayagiri_Caves_Bhubaneswar.jpg/1280px-Udayagiri_Caves_Bhubaneswar.jpg',
        photoCredit: 'Wikimedia Commons / Udayagiri Caves',
        summary:
          '33 partly natural and partly carved rock-cut residential caves on twin hills built for Jain monks by King Kharavela, featuring the famous 17-line Brahmi Hathigumpha inscription and Queen’s Palace (Rani Gumpha).',
      },
      {
        id: 'IN-OR-BBI-ATT-003',
        name: 'Mukteshvara Temple',
        category: 'Heritage · Historical Sites, "Gem of Odishan Architecture", Arched Torana Gateway',
        timings: '06:30–19:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Mukteshvara_Temple_Bhubaneswar.jpg/1280px-Mukteshvara_Temple_Bhubaneswar.jpg',
        photoCredit: 'Wikimedia Commons / Mukteshvara Temple',
        summary:
          '10th-century red sandstone architectural gem heralded as the pocket-edition jewel of Odishan temple architecture, celebrated for its freestanding arched torana gateway displaying Buddhist influences.',
      },
      {
        id: 'IN-OR-BBI-ATT-004',
        name: 'Dhauli Giri Shanti Stupa & Ashokan Edicts',
        category: 'Spiritual / Heritage · Buddhism, Historical Sites, Peace Pagoda overlooking Daya River',
        timings: '06:00–18:30 (Light & sound show in evening)',
        fee: { domestic: 'Free (Light & Sound: INR 25)', foreign: 'Free (Light & Sound: INR 25)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Dhauli_Shanti_Stupa.jpg/1280px-Dhauli_Shanti_Stupa.jpg',
        photoCredit: 'Wikimedia Commons / Dhauli Shanti Stupa',
        summary:
          'Dazzling white dome Peace Pagoda built in 1972 on the historic battlegrounds of the Kalinga War beside the Daya River, where Emperor Ashoka renounced bloodshed after embracing Buddhism, adjacent to rock edicts from 261 BCE.',
      },
      {
        id: 'IN-OR-BBI-GEM-001',
        name: 'Chausath Yogini Temple, Hirapur',
        category: 'Spiritual / Heritage · Hinduism, 9th-Century Hypaethral (Open-Roof) Tantric Shrine with 64 Chlorite Yogini Idols',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Chausathi_Jogini_Temple_Hirapur.jpg/1280px-Chausathi_Jogini_Temple_Hirapur.jpg',
        photoCredit: 'Wikimedia Commons / Chausath Yogini Temple',
        summary:
          'Rare circular hypaethral (roofless) 9th-century Tantric temple built of coarse sandstone, housing 64 exquisitely sculpted black chlorite statuettes of female Yoginis mounted on animal vahanas in inner wall niches.',
      },
      {
        id: 'IN-OR-BBI-GEM-002',
        name: 'Odisha Crafts Museum (Kala Bhoomi)',
        category: 'Arts / Rural · Crafts-Tourism, Terracotta, Pattachitra & Silver Filigree (Tarakasi) Galleries',
        timings: '10:00–17:30 (Closed Mondays)',
        fee: { domestic: 'INR 50', foreign: 'INR 200' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Kala Bhoomi / Odisha Crafts Museum',
        summary:
          '12.68-acre state-of-the-art living museum complex celebrating Odisha’s master artisans across 8 galleries of terracotta, palm-leaf engraving, Cuttack silver filigree (Tarakasi), and Sambalpuri ikat textiles.',
      },
    ],
  },
  {
    id: 'puri',
    code: 'IN-OR-CITY-PUI',
    name: 'Puri',
    nickname: 'Sacred Char Dham & Jagannath Realm',
    tagline: '12th-century Kalinga sanctuary, world’s largest temple kitchen & Blue Flag golden sands',
    accentColor: '#EA580C',
    bgGradient: 'from-orange-50 via-amber-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Jagannath_Temple%2C_Puri.jpg/1280px-Jagannath_Temple%2C_Puri.jpg',
    photoCredit: 'Wikipedia / Jagannath Temple, Puri - Wikipedia',
    flashcardBlurb:
      'One of the sacred Char Dham coastal pilgrimage hubs, centered around the 12th-century Jagannath citadel, the grand Ratha Yatra festival, and Golden Beach shores.',
    topStays: [
      { name: 'Mayfair Waves', category: 'Chakratirth Road — Luxury Beachfront Resort' },
      { name: 'The Hans Coco Palms', category: 'Swargadwar Beach — Colonial Coastal Heritage' },
      { name: 'Pramod Convention & Beach Resort', category: 'VIP Road — Premium Coastal Stay' },
    ],
    dining: {
      veg: [
        { restaurant: 'Ananda Bazar inside Jagannath Temple', location: 'Inside Temple Outer Compound', specialties: 'Sacred Chhappan Bhog Mahaprasad cooked in stacked earthen pots over wood fires: Kanika, Dalma, Khechedi & Sweet Poda Pitha' },
        { restaurant: 'Wildgrass Restaurant', location: 'VIP Road', specialties: 'Vegetarian Odia delicacies, Santula (steamed mixed vegetables with garlic tempering), Saaga Badi & crispy arbi fry' },
      ],
      nonVeg: [
        { restaurant: 'Wildgrass Restaurant (Seafood)', location: 'VIP Road', specialties: 'Catch of the Day: Spicy Bay of Bengal Crab Masala, Fresh Pomfret Rava Fry & Tiger Prawn Kassa' },
        { restaurant: 'Chung Wah', location: 'VIP Road', specialties: 'Classic coastal Indo-Chinese garlic prawns, chilli crab & steamed wontons' },
      ],
      pilgrimageNotice: 'Sacred Pilgrimage Bylaw: Entry inside the inner sanctuary of Shree Jagannath Temple is strictly restricted to practicing Hindus. Leather items, mobile phones, cameras, and non-veg food are strictly prohibited on temple grounds.',
      peacefulNote: 'Mahaprasad of Lord Jagannath represents universal brotherhood—in Ananda Bazar, all devotees eat together without any caste or social barriers.',
    },
    attractions: [
      {
        id: 'IN-OR-PUI-ATT-001',
        name: 'Shree Jagannath Temple',
        category: 'Spiritual / Heritage · Hinduism, Char Dham, 65-metre Kalinga Vimana, Ananda Bazar',
        timings: '05:30–22:00 (Darshan pauses during Bhog rituals; entry strictly restricted to practicing Hindus; strict no-phone policy)',
        fee: { domestic: 'Free (VIP/Special entry passes strictly regulated by SJTA)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Jagannath_Temple%2C_Puri.jpg/1280px-Jagannath_Temple%2C_Puri.jpg',
        photoCredit: 'Wikipedia / Jagannath Temple, Puri',
        summary:
          '12th-century Char Dham fortress shrine crowned by the Nilachakra (Blue Wheel) and the fluttering Patita Pavana flag, housing Lord Jagannath, Balabhadra, and Subhadra along with the world’s largest earthen-pot community kitchen.',
      },
      {
        id: 'IN-OR-PUI-ATT-002',
        name: 'Puri Golden Beach (Blue Flag Certified)',
        category: 'Nature / Recreation · Beaches & Cruises, Eco-Tourism, Coastal Water Sports',
        timings: '05:00–19:00 (Lifeguards active during daylight)',
        fee: { domestic: 'INR 20–50 maintenance pass', foreign: 'INR 20–50 maintenance pass' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Puri_Beach_Odisha.jpg/1280px-Puri_Beach_Odisha.jpg',
        photoCredit: 'Wikimedia Commons / Puri Golden Beach',
        summary:
          'Internationally certified Blue Flag beach recognized for pristine golden sands, crystal-clear coastal water, solar-powered boardwalks, continuous lifeguard surveillance, and beach volleyball zones.',
      },
      {
        id: 'IN-OR-PUI-ATT-003',
        name: 'Swargadwar & Local Fishermen Beachfront',
        category: 'Spiritual / Rural · Living Traditions, Traditional Catamarans, Evening Street Markets',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Puri_Fishermen_Boats.jpg/1280px-Puri_Fishermen_Boats.jpg',
        photoCredit: 'Wikimedia Commons / Swargadwar Beachfront',
        summary:
          'Vibrant coastal frontline where local Nolia fishermen launch traditional wooden catamarans into crashing surf at dawn, transforming by dusk into bustling handicraft, seashell, and khaja sweet night markets.',
      },
      {
        id: 'IN-OR-PUI-GEM-001',
        name: 'Raghurajpur Heritage Crafts Village',
        category: 'Arts / Rural · Crafts-Tourism, Live Like a Local, Master Pattachitra Scroll Painters & Gotipua Dancers',
        timings: '08:00–18:30 (Located 12 km before Puri)',
        fee: { domestic: 'Free (Artwork purchased directly from artisan homes)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Pattachitra_Raghurajpur.jpg/1280px-Pattachitra_Raghurajpur.jpg',
        photoCredit: 'Wikimedia Commons / Raghurajpur Pattachitra',
        summary:
          'Celebrated rural crafts village where every home is a studio preserving the 12th-century art of Pattachitra (cloth and dried palm-leaf painting using organic stone colours), alongside live Gotipua classical acrobat dances.',
      },
      {
        id: 'IN-OR-PUI-GEM-002',
        name: 'Gundicha Temple',
        category: 'Spiritual / Heritage · Hinduism, Garden House of Lord Jagannath during Ratha Yatra',
        timings: '06:00–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Gundicha_Temple_Puri.jpg/1280px-Gundicha_Temple_Puri.jpg',
        photoCredit: 'Wikimedia Commons / Gundicha Temple',
        summary:
          'Surrounded by lush mango orchards, this sandstone temple serves as the summer retreat where Lord Jagannath, Balabhadra, and Subhadra stay for nine sacred days after the annual Ratha Yatra chariot journey.',
      },
    ],
  },
  {
    id: 'konark',
    code: 'IN-OR-CITY-KON',
    name: 'Konark',
    nickname: 'The Sun God’s Grand Chariot',
    tagline: '13th-century 24-wheeled solar colossus, sundial wheels & Blue Flag surf shores',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-yellow-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Konark_Sun_Temple_wheel.jpg/1280px-Konark_Sun_Temple_wheel.jpg',
    photoCredit: 'The Stone Studio / Stone Konark Chakra 5.5ft: Buy Best Carved Idol - The Stone Studio',
    flashcardBlurb:
      'Home to the Black Pagoda on the Bay of Bengal, an architectural colossus conceived as a 24-wheeled chariot of Surya, the Sun God, pulled by seven galloping stone horses.',
    topStays: [
      { name: 'Lotus Eco Resort Konark', category: 'Ramchandi Beach — Luxury Waterfront Cottages' },
      { name: 'OTDC Panthanivas Konark', category: 'Near Sun Temple — Reliable State Hospitality' },
      { name: 'Nature Camp Konark Retreat', category: 'Suruchi Beach — Coastal Glamping' },
    ],
    dining: {
      veg: [
        { restaurant: 'Kamat Restaurant', location: 'Opposite Sun Temple', specialties: 'Crispy dosas, South Indian filter coffee & wholesome pure vegetarian Odia thalis' },
        { restaurant: 'OTDC Restaurant (Panthanivas)', location: 'Panthanivas Complex', specialties: 'Homestyle Odia Dalma, Chhencheda, Aloo Bhaja and steaming sona masoori rice' },
      ],
      nonVeg: [
        { restaurant: "Surfer's Cafe / Ramchandi Shacks", location: 'Ramchandi Beach', specialties: 'Fresh Bay of Bengal Pan-Fried Pomfret, Crab Fry, Prawn Thali & coconut water' },
        { restaurant: 'Chandrabhaga Beach Shacks', location: 'Chandrabhaga Coast', specialties: 'Locally caught fish marinated in turmeric, mustard paste and garlic, fried crisp over wood fires' },
      ],
      peacefulNote: 'Coastal Konark fare balances golden fried fish with seasonal green vegetables, roasted cumin lentils, and hot crispy Chenna Jhili sweets.',
    },
    attractions: [
      {
        id: 'IN-OR-KON-ATT-001',
        name: 'Konark Sun Temple',
        category: 'Heritage · UNESCO World Heritage, Monuments, 13th-Century Kalinga Chariot Architecture, Sundial Wheels',
        timings: '06:00–18:00 (Light & sound show in evenings: 19:00 & 20:00)',
        fee: { domestic: 'INR 40 (Light & Sound: INR 50)', foreign: 'INR 600 (Light & Sound: INR 50)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Konark_Sun_Temple_wheel.jpg/1280px-Konark_Sun_Temple_wheel.jpg',
        photoCredit: 'The Stone Studio / Stone Konark Chakra',
        summary:
          '13th-century UNESCO World Heritage marvel built by King Narasimhadeva I, conceived as a 24-wheeled monumental chariot of Surya with 7 galloping stone horses; its 12 pairs of ornate wheels act as precise astronomical sundials.',
      },
      {
        id: 'IN-OR-KON-ATT-002',
        name: 'Chandrabhaga Beach',
        category: 'Nature · Beaches & Cruises, First Blue Flag Certified Beach in Asia, Sunrise Views',
        timings: '05:00–19:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Chandrabhaga_Beach_Konark.jpg/1280px-Chandrabhaga_Beach_Konark.jpg',
        photoCredit: 'Wikimedia Commons / Chandrabhaga Beach',
        summary:
          'Historic beach 3 km from the Sun Temple that became Asia’s first eco-certified Blue Flag beach, famed for spellbinding sunrises over the Bay of Bengal and clean golden dunes.',
      },
      {
        id: 'IN-OR-KON-ATT-003',
        name: 'ASI Archaeological Museum Konark',
        category: 'Heritage / Arts · Museums, Fallen Sculptures and Carved Panels from the Sun Temple complex',
        timings: '09:00–17:00 (Closed Fridays)',
        fee: { domestic: 'INR 10', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'ASI Archaeological Museum Konark',
        summary:
          'Preserves over 800 recovered sandstone chlorite master carvings, celestial musician friezes, and colossal stone animals salvaged during ASI restorations of the Konark complex.',
      },
      {
        id: 'IN-OR-KON-GEM-001',
        name: 'Ramchandi Beach & River Kushabhadra Estuary',
        category: 'Nature / Adventure · Beaches & Cruises, Surfing, Stand-Up Paddleboarding & Kayaking',
        timings: '06:00–18:30',
        fee: { domestic: 'Free (Surfing sessions at India Surf Club: INR 1,500–2,000)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Ramchandi Beach & Kushabhadra Estuary',
        summary:
          'Peaceful estuarine haven where the Kushabhadra River glides into the Bay of Bengal, home of Goddess Ramchandi and the annual India Surf Festival with world-class stand-up paddleboarding.',
      },
      {
        id: 'IN-OR-KON-GEM-002',
        name: 'Kuruma Buddhist Excavation Site',
        category: 'Heritage · Archeological Sites, 9th-Century Ancient Buddhist Monastery and Teracotta Artifacts',
        timings: '08:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Kuruma Buddhist Monastery Excavations',
        summary:
          'Excavated 9th-century Buddhist monastic site 8 km from Konark, unearthing ancient brick prayer halls and a revered stone image of Buddha seated in the Bhumisparsha mudra.',
      },
    ],
  },
  {
    id: 'chilika-lake',
    code: 'IN-OR-CITY-CLK',
    name: 'Chilika Lake',
    nickname: 'Asia’s Largest Brackish Water Lagoon',
    tagline: 'Ramsar wetland sanctuary, Irrawaddy dolphin pods & 1 million winter migratory birds',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-50 via-teal-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Chilika_Lake_Boats.jpg/1280px-Chilika_Lake_Boats.jpg',
    photoCredit: 'Media India Group / Up and close with the Irrawaddy dolphins - Media India Group',
    flashcardBlurb:
      'Asia\'s largest brackish water lagoon, a Ramsar wetland hosting over a million migratory birds each winter, sacred island shrines, and endangered Irrawaddy dolphins.',
    topStays: [
      { name: 'Swosti Chilika Resort', category: 'Ganjam / Rambha — Ultra-Luxury Eco-Resort on Lagoon edge' },
      { name: 'OTDC Panthanivas Barkul', category: 'Boating Hub — Lakeside State Hotel' },
      { name: 'OTDC Panthanivas Satapada', category: 'Dolphin Base — Lagoon-Front Comfort' },
    ],
    dining: {
      veg: [
        { restaurant: 'OTDC Panthanivas Restaurants', location: 'Barkul & Satapada Jetties', specialties: 'Homestyle Odia vegetarian thalis, Khichdi, fresh green vegetable curries & crispy papad' },
      ],
      nonVeg: [
        { restaurant: 'Chilika Fresh Fish & Prawn Outlets', location: 'Satapada & Barkul Jetties', specialties: 'Massive jumbo Tiger Prawns, live Mud Crabs, and Chilika Bhekti cooked fresh with mustard, ginger, and green chillies' },
      ],
      peacefulNote: 'Chilika lagoon gastronomy is world-famous for its giant brackish tiger prawns and mud crabs, freshly cooked at harbor-side open kitchens with rustic village spices.',
    },
    attractions: [
      {
        id: 'IN-OR-CLK-ATT-001',
        name: 'Satapada Dolphin Sanctuary & Sea Mouth',
        category: 'Nature / Rural · Wildlife-Tourism, Irrawaddy Dolphin Spotting, Ocean-Lagoon Confluence',
        timings: '06:00–17:00 (Regulated OTDC / motorized boat trips)',
        fee: { domestic: 'Motorboat hire ~INR 1,200–2,500/boat (6–8 pax)', foreign: 'Motorboat hire ~INR 1,200–2,500/boat (6–8 pax)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Irrawaddy_Dolphin_Chilika.jpg/1280px-Irrawaddy_Dolphin_Chilika.jpg',
        photoCredit: 'Media India Group / Irrawaddy Dolphins',
        summary:
          'Located on the eastern shore of Chilika where the lagoon meets the Bay of Bengal, famous for peaceful boat tours to spot endangered, blunt-nosed Irrawaddy dolphins breaching in natural lagoon shallows.',
      },
      {
        id: 'IN-OR-CLK-ATT-002',
        name: 'Kalijai Island & Temple',
        category: 'Spiritual / Nature · Hinduism, Island Shrine of Goddess Kalijai, Surrounded by Blue Lagoon Waters',
        timings: '07:00–17:00 (Accessible via Barkul jetty boats)',
        fee: { domestic: 'Boat ticket from Barkul: INR 800–1,500/boat', foreign: 'Boat ticket from Barkul: INR 800–1,500/boat' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Kalijai_Island_Chilika.jpg/1280px-Kalijai_Island_Chilika.jpg',
        photoCredit: 'Wikimedia Commons / Kalijai Island',
        summary:
          'Sacred island shrine in the heart of Chilika dedicated to Goddess Kalijai, revered by local fishermen as their oceanic guardian protector, vibrant during the annual Makar Sankranti fair.',
      },
      {
        id: 'IN-OR-CLK-ATT-003',
        name: 'Nalbana Bird Sanctuary',
        category: 'Nature · Wildlife-Tourism, Ramsar Core Wetland for Flamingos, Pelicans, Pintails',
        timings: '06:00–17:00 (Entry inside core island restricted; boat viewing from perimeter permitted Oct–March)',
        fee: { domestic: 'Regulated boat permit from Barkul', foreign: 'Regulated boat permit from Barkul' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Flamingos_Chilika_Lake.jpg/1280px-Flamingos_Chilika_Lake.jpg',
        photoCredit: 'Wikimedia Commons / Nalbana Flamingos',
        summary:
          '15-sq-km core mangrove island sanctuary designated as a Ramsar site, submerging during monsoon and emerging in winter to host over a million migratory birds from Siberia, Central Asia, and the Caspian Sea.',
      },
      {
        id: 'IN-OR-CLK-GEM-001',
        name: 'Mangalajodi Birding Village',
        category: 'Nature / Rural · Eco-Tourism, Sustainable Tourism, Poachers-turned-Conservationists, Hand-Paddled Wooden Boat Birdwatching',
        timings: '06:00–17:30 (Peak bird season: November to February)',
        fee: { domestic: 'Hand-paddled eco-boat hire with community naturalist: INR 1,200–1,800', foreign: 'Hand-paddled eco-boat hire with community naturalist: INR 1,200–1,800' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Mangalajodi_Wetland_Birds.jpg/1280px-Mangalajodi_Wetland_Birds.jpg',
        photoCredit: 'Mangalajodi Ecotourism / Community Naturalists',
        summary:
          'World-renowned community conservation success story where former poachers now guide visitors silently on hand-paddled wooden canoes through dense water-hyacinth marshes for intimate close-ups of rare waterfowl.',
      },
      {
        id: 'IN-OR-CLK-GEM-002',
        name: 'Rambha Bay & Breakfast Island',
        category: 'Nature / Heritage · Rivers & Lakes, Picturesque Southern Lagoon Islets, British Heritage Stone Cottage',
        timings: '07:00–17:00',
        fee: { domestic: 'Speedboat / Motorboat tour from Rambha: INR 1,500–3,000', foreign: 'Speedboat / Motorboat tour from Rambha: INR 1,500–3,000' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Rambha_Bay_Chilika.jpg/1280px-Rambha_Bay_Chilika.jpg',
        photoCredit: 'Wikimedia Commons / Rambha Bay',
        summary:
          'Scenic southern cluster of tranquil rocky islands including Breakfast Island, featuring an old stone bungalow built by Mr. Snodgrass, the British Collector of Ganjam, with panoramic views of emerald hills meeting blue waters.',
      },
    ],
  },
];
