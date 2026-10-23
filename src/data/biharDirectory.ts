export interface BiharStay {
  name: string;
  category: string;
}

export interface BiharFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface BiharDining {
  veg: BiharFoodSpot[];
  nonVeg: BiharFoodSpot[];
  pilgrimageNotice?: string;
  peacefulNote?: string;
}

export interface BiharAttraction {
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

export interface BiharCity {
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
  topStays: BiharStay[];
  dining: BiharDining;
  attractions: BiharAttraction[];
}

export const BIHAR_DIRECTORY: BiharCity[] = [
  {
    id: 'patna',
    code: 'IN-BR-CITY-PAT',
    name: 'Patna',
    nickname: 'Ancient Pataliputra & Capital of Bihar',
    tagline: 'Mauryan assembly halls, sacred Takht Patna Sahib & colonial Golghar granary',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: '/images/bihar/patna-golghar.png',
    photoCredit: 'Discover Bharat / Historic Golghar Granary',
    flashcardBlurb:
      'The ancient city of Pataliputra sitting on the southern banks of the Ganges, blending Mauryan archaeological ruins, revered Sikh heritage, and sprawling modern museums.',
    topStays: [
      { name: 'Taj City Centre Patna', category: 'Lodipur — Premium 5-Star Luxury' },
      { name: 'Hotel Maurya', category: 'South Gandhi Maidan — Classic City Heritage Hub' },
      { name: 'Lemon Tree Premier', category: 'Exhibition Road — Contemporary Comfort' },
    ],
    dining: {
      veg: [
        {
          restaurant: "Harilal's",
          location: 'Frazer Road',
          specialties: 'Pure vegetarian North Indian thalis, street chaat, and traditional Bihari sweets like Khaja & Chena Murki',
        },
        {
          restaurant: 'Bansi Vihar',
          location: 'Frazer Road',
          specialties: 'Crispy ghee dosas, Mysore masala dosa, and authentic filter coffee',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Pind Balluchi',
          location: 'Biscomaun Tower (18th Floor)',
          specialties: 'Revolving restaurant with North Indian tandoori meats, spicy mutton curry, and 360° Ganges city vistas',
        },
        {
          restaurant: "Kapil Dev's Elevens",
          location: 'Frazer Road',
          specialties: 'Multi-cuisine non-veg dining featuring Lucknowi Murgh Biryani and Tawa Chicken',
        },
      ],
      peacefulNote:
        'Bihari gastronomy celebrates hearty Litti Chokha baked over cow dung cakes, Sattu parathas, and Silao Khaja paired with ginger kulhad chai.',
    },
    attractions: [
      {
        id: 'IN-BR-PAT-ATT-001',
        name: 'Takht Sri Harmandir Ji (Patna Sahib)',
        category: 'Spiritual · Sikhism, One of the Five Takhts, Guru Gobind Singh Ji Birthplace',
        timings: '05:00–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat',
        summary:
          'One of Sikhism’s five Takhts, marking the birthplace of the tenth master Guru Gobind Singh Ji in 1666, housing sacred weapons, relics, and serving communal langar 24/7.',
      },
      {
        id: 'IN-BR-PAT-ATT-002',
        name: 'Bihar Museum',
        category: 'Heritage / Arts · Museums, World-Class Contemporary Architecture & Didarganj Yakshi',
        timings: '10:30–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 100', foreign: 'INR 500' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Bihar Museum / Maki & Associates',
        summary:
          'Architectural marvel designed by Fumihiko Maki across 13 acres, exhibiting 2,300-year-old Mauryan treasures including the polished sandstone Didarganj Yakshi.',
      },
      {
        id: 'IN-BR-PAT-ATT-003',
        name: 'Golghar',
        category: 'Heritage · Historical Buildings, 1786 Colonial Granary & Ganges Belvedere',
        timings: '10:00–17:00',
        fee: { domestic: 'INR 10', foreign: 'INR 50' },
        isHiddenGem: false,
        image: '/images/bihar/patna-golghar.png',
        photoCredit: 'Discover Bharat',
        summary:
          'Massive 29-metre beehive-shaped granary erected in 1786 following the 1770 Bengal famine, surrounded by 145 spiral stairs ascending to panoramic city and Ganges views.',
      },
      {
        id: 'IN-BR-PAT-ATT-004',
        name: 'Kumhrar Park (Mauryan Ruins)',
        category: 'Heritage · Archeological Sites, 80-Pillared Hall of Emperor Ashoka',
        timings: '10:00–17:00',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'ASI / Kumhrar Excavations',
        summary:
          'The archaeological excavation site of ancient Pataliputra, showcasing the wooden palisades, canal systems, and the legendary 80-pillared assembly hall from the 3rd century BCE.',
      },
      {
        id: 'IN-BR-PAT-GEM-001',
        name: 'Agam Kuan',
        category: 'Heritage · Archeological Sites, Ancient Mauryan "Unfathomable Well"',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Patna Heritage Circle',
        summary:
          'A circular brick well dating back to Emperor Ashoka’s reign, shrouded in legend as his torture dungeon chamber, with water that changes colour and never dries up.',
      },
      {
        id: 'IN-BR-PAT-GEM-002',
        name: 'Khuda Bakhsh Oriental Public Library',
        category: 'Heritage / Arts · Historical Buildings, Rare Persian & Mughal Manuscripts',
        timings: '09:30–17:00 (Closed Fridays)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'National Mission for Manuscripts',
        summary:
          'National treasure library established in 1891 housing over 21,000 priceless hand-lettered Arabic and Persian manuscripts, Mughal miniatures, and Emperor Jahangir’s personal Quran.',
      },
    ],
  },
  {
    id: 'bodh-gaya',
    code: 'IN-BR-CITY-BGY',
    name: 'Bodh Gaya',
    nickname: 'Global Epicenter of Enlightenment',
    tagline: 'The sacred Bodhi Tree, Mahabodhi UNESCO temple & international monasteries',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-yellow-50/40 to-stone-50/30',
    coverImage: '/images/bihar/bodhgaya-mahabodhi-temple.png',
    photoCredit: 'Discover Bharat / UNESCO Mahabodhi Temple Sanctuary',
    flashcardBlurb:
      'The global epicenter of Buddhism where Prince Siddhartha attained enlightenment under the Bodhi Tree, now a peaceful international spiritual hub filled with global monasteries.',
    topStays: [
      { name: 'Marigold Hotel', category: 'Bypass Road — Premium Comfort & Serenity' },
      { name: 'The Royal Residency', category: 'Domuhan Road — Buddhist Circuit Hospitality' },
      { name: 'Oaks Bodhgaya', category: 'Near Mahabodhi — Luxury Contemporary Retreat' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Be Happy Cafe',
          location: 'Near Kalachakra Ground',
          specialties: 'Organic vegan thin-crust Italian pizza, homemade granola, fresh fruit salads, and espresso bakes',
        },
        {
          restaurant: 'Sujata Restaurant',
          location: 'Hotel Sujata',
          specialties: 'Pure vegetarian North Indian curries, Chinese wok noodles, and traditional Buddhist pilgrim meals',
        },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Sacred Pilgrimage Bylaw: Bodh Gaya town center and temple precincts are strictly vegetarian and alcohol-free out of deep Buddhist reverence. Standard non-veg dining is available only at select hotel dining rooms on the outer highway bypass.',
      peacefulNote:
        'International pilgrim cafes in Bodh Gaya offer a calming fusion of Tibetan butter tea, Japanese matcha, Himalayan sourdough bread, and fresh herbal infusions.',
    },
    attractions: [
      {
        id: 'IN-BR-BGY-ATT-001',
        name: 'Mahabodhi Temple & The Bodhi Tree',
        category: 'Spiritual / Heritage · UNESCO World Heritage, Buddhism, Diamond Throne (Vajrasana)',
        timings: '05:00–21:00',
        fee: { domestic: 'Free (Camera/Mobile fee strictly enforced: INR 100)', foreign: 'Free (Camera/Mobile fee: INR 100)' },
        isHiddenGem: false,
        image: '/images/bihar/bodhgaya-mahabodhi-temple.png',
        photoCredit: 'Discover Bharat',
        summary:
          'UNESCO World Heritage 50-metre grand pyramidal brick temple enshrining the exact spot where Prince Siddhartha attained supreme enlightenment under the sacred Bodhi Tree in 528 BCE.',
      },
      {
        id: 'IN-BR-BGY-ATT-002',
        name: 'Great Buddha Statue',
        category: 'Spiritual / Arts · Monuments, Buddhism, 80-Foot Monolithic Sandstone Buddha',
        timings: '07:00–12:00 & 14:00–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat / Great Buddha',
        summary:
          'Towering 80-foot Buddha statue in Dhyana Mudra seated on a lotus, carved from Chunar sandstone and red granite, consecrated in 1989 by the 14th Dalai Lama.',
      },
      {
        id: 'IN-BR-BGY-ATT-003',
        name: 'Royal Bhutan Monastery & Thai Monastery',
        category: 'Spiritual · Buddhism, International Monastic Enclave & Gilded Murals',
        timings: '07:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Bodh Gaya Monastic Circuit',
        summary:
          'Vibrant diplomatic Buddhist monasteries showcasing regional Buddhist aesthetics—from traditional Bhutanese clay relief carvings of Buddha’s life to Thailand’s gilded curved roofs.',
      },
      {
        id: 'IN-BR-BGY-GEM-001',
        name: 'Sujata Stupa',
        category: 'Heritage · Archeological Sites, Ancient Stupa across the Phalgu River',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Bodh Gaya Heritage Project',
        summary:
          'Monumental 2nd-century BCE brick stupa in Bakraur across the Niranjana (Phalgu) River, honouring the milkmaid Sujata whose bowl of milk rice saved Siddhartha Gautama from starvation.',
      },
      {
        id: 'IN-BR-BGY-GEM-002',
        name: 'Dungeshwari Cave Temples (Mahakala Caves)',
        category: 'Spiritual / Nature · Hills & Mountains, Buddhism, Pre-Enlightenment Penance Caves',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Dungeshwari Hills Pilgrimage',
        summary:
          'Rugged hill caves 12 km from Bodh Gaya where the Buddha engaged in six agonizing years of extreme self-mortification before realizing the wisdom of the Middle Path (Madhyama-pratipad).',
      },
    ],
  },
  {
    id: 'nalanda',
    code: 'IN-BR-CITY-NAL',
    name: 'Nalanda',
    nickname: 'Cradle of World Knowledge & Ancient University',
    tagline: '5th-century red-brick mahavihara, monastic dormitories & Xuanzang memorial',
    accentColor: '#DC2626',
    bgGradient: 'from-rose-50 via-amber-50/40 to-stone-50/30',
    coverImage: '/images/bihar/nalanda-mahavihara-ruins.png',
    photoCredit: 'Discover Bharat / Nalanda Mahavihara Temple No. 3',
    flashcardBlurb:
      'The sprawling red-brick ruins of one of the world’s oldest residential universities (5th century CE), which once drew thousands of scholars from across Asia.',
    topStays: [
      { name: 'Indo Hokke Hotel', category: 'Rajgir (15 km) — Japanese Buddhist Serene Retreat' },
      { name: 'The Rajgir Residency', category: 'Rajgir (15 km) — Comfortable Central Circuit Stay' },
      { name: 'Day Tour Logistics', category: 'Most visitors tour Nalanda as an excursion from nearby Rajgir' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Nalanda Cafeteria',
          location: 'Near Archaeological Ruins Gate',
          specialties: 'Simple nourishing vegetarian thalis, hot samosas, Dal, Roti & spiced milk tea',
        },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Archaeological Sanctuary Bylaw: Non-vegetarian dining is strictly restricted around the UNESCO World Heritage excavation zones. High quality multi-cuisine dining is concentrated in Rajgir (15 km).',
      peacefulNote:
        'Tourists enjoy freshly fried samosas, seasonal sugarcane juice, and Silao Khaja snacks along the heritage avenue leading to the ruins.',
    },
    attractions: [
      {
        id: 'IN-BR-NAL-ATT-001',
        name: 'Nalanda Mahavihara Archaeological Ruins',
        category: 'Heritage · UNESCO World Heritage, Archeological Sites, Ancient Residential University',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 40', foreign: 'INR 600' },
        isHiddenGem: false,
        image: '/images/bihar/nalanda-mahavihara-ruins.png',
        photoCredit: 'Discover Bharat',
        summary:
          'UNESCO World Heritage ancient campus founded in the 5th century CE, featuring red-brick stupas, tiered viharas, lecture halls, and the towering votive terraces of Temple No. 3.',
      },
      {
        id: 'IN-BR-NAL-ATT-002',
        name: 'Nalanda Archaeological Museum',
        category: 'Heritage / Arts · Museums, Excavated Bronzes, Terracotta Seals & Pala Art',
        timings: '10:00–17:00 (Closed Fridays)',
        fee: { domestic: 'INR 20', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Archaeological Survey of India',
        summary:
          'Located directly opposite the ruins, this repository showcases 13,000 antiquities excavated from Nalanda and Rajgir, including intricate Pala bronze sculptures and burnt grain samples.',
      },
      {
        id: 'IN-BR-NAL-ATT-003',
        name: 'Xuanzang Memorial Hall',
        category: 'Heritage · Monuments, Chinese Pagoda Dedicated to 7th-Century Master Xuanzang',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 50', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Sino-Indian Cultural Society',
        summary:
          'A majestic Chinese-style temple hall commemorating Xuanzang, the intrepid 7th-century scholar who studied and taught at Nalanda for 16 years, preserving Sanskrit treatises for humanity.',
      },
      {
        id: 'IN-BR-NAL-GEM-001',
        name: 'Black Buddha of Kundalpur (Telhara)',
        category: 'Spiritual / Heritage · Archeological Sites, Ancient Basalt Monolith',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Telhara Archeological Project',
        summary:
          'A rare, highly polished black basalt statue of the Buddha in Bhumisparsha mudra dating back to the Pala Empire, venerated by local villagers and Buddhist pilgrims near the Telhara ruins.',
      },
    ],
  },
  {
    id: 'rajgir',
    code: 'IN-BR-CITY-RJG',
    name: 'Rajgir',
    nickname: 'Ancient Royal Magadha Capital & Hill Retreat',
    tagline: 'Vishwa Shanti Stupa, Cyclopean stone walls, glass skywalk & Griddhakuta peak',
    accentColor: '#059669',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: '/images/bihar/rajgir-vishwa-shanti-stupa.jpg',
    photoCredit: 'Discover Bharat / Vishwa Shanti Stupa atop Ratnagiri Hill',
    flashcardBlurb:
      'The first capital of the Magadha empire, framed by five rocky hills, renowned for its hot springs, Buddhist peace pagoda, and the modern glass-bottom bridge at Nature Safari.',
    topStays: [
      { name: 'Indo Hokke Hotel', category: 'Buddha Marg — Japanese-Style Serene Property' },
      { name: 'Rajgir Residency', category: 'Bangali Para — Comfortable Central Stay' },
      { name: 'Gargee Gautam Vihar Resort', category: 'Kund Road — Modern Amenities & Gardens' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Green Restaurant',
          location: 'Near Bus Stand, Rajgir',
          specialties: 'Wholesome North Indian thalis, Dal Fry, Jeera Rice, and Jain vegetarian cuisine',
        },
        {
          restaurant: 'Lotus Restaurant',
          location: 'Indo Hokke Hotel',
          specialties: 'Authentic Japanese vegetarian set meals, Tempura, Udon noodles, and Indian delicacies',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Rajgir Residency Dining Hall',
          location: 'Rajgir Residency',
          specialties: 'Standard Indian chicken and mutton curries prepared with regional spices',
        },
        {
          restaurant: 'Gargee Resort Restaurant',
          location: 'Gargee Gautam Vihar',
          specialties: 'Tandoori chicken, butter chicken, and multi-cuisine non-vegetarian preparations',
        },
      ],
      peacefulNote:
        'Rajgir is famous throughout Bihar for crisp multi-layered Silao Khaja pastries, prepared by master confectioners using ancient water spring techniques.',
    },
    attractions: [
      {
        id: 'IN-BR-RJG-ATT-001',
        name: 'Vishwa Shanti Stupa & Rajgir Ropeway',
        category: 'Spiritual / Nature · Buddhism, Cable Car, Ratnagiri Hilltop Peace Pagoda',
        timings: '09:00–17:00',
        fee: { domestic: 'Stupa Free; Ropeway INR 100–120 (Return)', foreign: 'Stupa Free; Ropeway INR 100–120 (Return)' },
        isHiddenGem: false,
        image: '/images/bihar/rajgir-vishwa-shanti-stupa.jpg',
        photoCredit: 'Discover Bharat',
        summary:
          'Gleaming white marble peace pagoda perched at 1,000 feet atop Ratnagiri Hill, built by Japanese master Nichidatsu Fujii, accessible via India’s oldest single-seater aerial ropeway.',
      },
      {
        id: 'IN-BR-RJG-ATT-002',
        name: 'Rajgir Nature Safari & Glass Bridge',
        category: 'Adventure / Nature · Eco-Tourism, Glass-Bottomed Gorge Skywalk & Ziplining',
        timings: '09:00–17:00 (Closed Mondays)',
        fee: { domestic: 'Safari Entry INR 50; Glass Bridge INR 125', foreign: 'Safari Entry INR 50; Glass Bridge INR 125' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Bihar State Tourism Development Corporation',
        summary:
          'Thrilling 85-foot long transparent glass-bottom skywalk suspended 250 feet over a deep forest canyon, surrounded by archery ranges, suspension footbridges, and rock climbing.',
      },
      {
        id: 'IN-BR-RJG-ATT-003',
        name: 'Venu Vana (Bamboo Grove)',
        category: 'Spiritual / Nature · Forests & Gardens, Buddhism, King Bimbisara Gifted Grove',
        timings: '06:00–18:00',
        fee: { domestic: 'INR 10', foreign: 'INR 10' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Rajgir Forest Sanctuary',
        summary:
          'Tranquil bamboo park gifted to Lord Buddha by King Bimbisara of Magadha as the first monastic residence, featuring lotus ponds and shaded walkways where the Buddha meditated.',
      },
      {
        id: 'IN-BR-RJG-GEM-001',
        name: "Griddhakuta Peak (Vulture's Peak)",
        category: 'Spiritual / Adventure · Hiking & Trekking, Buddhism, Lotus Sutra Discourse Site',
        timings: '06:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Rajgir Sacred Hills',
        summary:
          'A sacred craggy outcrop shaped like a resting vulture’s beak, revered as the Buddha’s favorite meditation retreat where he delivered the famous Lotus Sutra and Heart Sutra.',
      },
      {
        id: 'IN-BR-RJG-GEM-002',
        name: 'Cyclopean Wall of Rajgir',
        category: 'Heritage · Archeological Sites, Pre-Mauryan 40-km Dry Stone Rampart',
        timings: 'Open 24 Hours (Roadside view)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Archaeological Survey of India',
        summary:
          'Massive 2,500-year-old pre-Mauryan stone wall extending 40 km along the perimeter of the ancient Magadhan capital, built of enormous unmortared stone boulders comparable to Mycenaean ruins.',
      },
      {
        id: 'IN-BR-RJG-GEM-003',
        name: 'Saptaparni Cave',
        category: 'Spiritual / Heritage · Geological Caves, Buddhism, First Buddhist Council Site',
        timings: '07:00–17:00 (Requires a short hillside hike)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Rajgir Heritage Caves',
        summary:
          'Sacred hillside cavern on Vaibhava Hill where 500 arhats convened under the leadership of Mahakasyapa to recite and codify the Buddha’s teachings during the First Buddhist Council in 483 BCE.',
      },
    ],
  },
];
