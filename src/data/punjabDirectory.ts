export interface PunjabStay {
  name: string;
  category: string;
}

export interface PunjabFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface PunjabDining {
  veg: PunjabFoodSpot[];
  nonVeg: PunjabFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface PunjabAttraction {
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

export interface PunjabCity {
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
  topStays: PunjabStay[];
  dining: PunjabDining;
  attractions: PunjabAttraction[];
}

export const PUNJAB_DIRECTORY: PunjabCity[] = [
  {
    id: 'amritsar',
    code: 'IN-PB-ASR-ULTIMATE',
    name: 'Amritsar',
    nickname: 'The Golden City of Amritsar',
    tagline: 'Spiritual Epicenter of Sikhism, 24/7 Langar Seva, and Border Patriotism',
    accentColor: '#D97706',
    bgGradient: 'from-amber-900/40 via-yellow-950/30 to-amber-950/60',
    coverImage: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=1200&q=80',
    photoCredit: 'Unsplash / Golden Temple Amritsar',
    flashcardBlurb:
      'The spiritual and cultural center of Sikhism, celebrated worldwide for the breathtaking Golden Temple, heroic history, and legendary Punjabi hospitality and street food.',
    topStays: [
      { name: 'Taj Swarna', category: 'Majitha Verka Bypass — Luxury comfort' },
      { name: 'Hyatt Regency Amritsar', category: 'GT Road — 5-Star Hospitality' },
      { name: 'Hotel Ritz Plaza', category: 'Mall Road — Historic Premier Stay' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Kesar Da Dhaba',
          location: 'Chowk Shastri Market',
          specialties: 'Legendary Dal Makhani and stuffed parathas since 1916',
        },
        {
          restaurant: 'Kanha Sweets',
          location: 'Lawrence Road',
          specialties: 'Famous Puri Chana breakfast and sweet Lassi',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Beera Chicken House',
          location: 'Majitha Road',
          specialties: 'World-famous smoky tandoori chicken and tikka',
        },
        {
          restaurant: 'Makhan Fish & Chicken Corner',
          location: 'Majitha Road',
          specialties: 'Crispy Amritsari Fried Sanghara Fish',
        },
      ],
      pilgrimageNotice:
        'Old city lanes around Sri Harmandir Sahib are strictly vegetarian; non-vegetarian dining is available outside the walled perimeter (Majitha Road, Lawrence Road).',
    },
    attractions: [
      {
        id: 'IN-PB-ASR-ATT-001',
        name: 'Sri Harmandir Sahib (Golden Temple)',
        category: 'Spiritual: Sikhism',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Harmandir Sahib',
        summary:
          'The holiest gurdwara enveloped in gold leaf, sitting in the center of the Amrit Sarovar pond, operating the world\'s largest community kitchen (Langar).',
      },
      {
        id: 'IN-PB-ASR-ATT-002',
        name: 'Jallianwala Bagh',
        category: 'Heritage: Historical Sites',
        timings: '06:30–19:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Jallianwala_Bagh%2C_Amritsar_01.jpg/1280px-Jallianwala_Bagh%2C_Amritsar_01.jpg',
        photoCredit: 'Wikimedia Commons / Jallianwala Bagh Memorial',
        summary:
          'Historic public garden memorial preserving bullet marks and the martyr well from the tragic 1919 massacre.',
      },
      {
        id: 'IN-PB-ASR-ATT-003',
        name: 'Wagah Border Ceremony',
        category: 'Heritage / Culture: Landmarks',
        timings: 'Ceremony starts around 16:30 (Winter) / 17:30 (Summer)',
        fee: { domestic: 'Free (Arrive early for seating)', foreign: 'Free (Arrive early for seating)' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Wagah_border_ceremony_india.jpg/1280px-Wagah_border_ceremony_india.jpg',
        photoCredit: 'Wikimedia Commons / Wagah Border Ceremony',
        summary:
          'High-energy military Beating Retreat ceremony conducted daily at sunset by Border Security Forces at the Indo-Pakistan border.',
      },
      {
        id: 'IN-PB-ASR-GEM-001',
        name: 'Gobindgarh Fort',
        category: 'Heritage: Palaces & Forts',
        timings: '10:00–22:00',
        fee: { domestic: 'Entry INR 150+ (Package options available)', foreign: 'Entry INR 150+ (Package options available)' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Gobindgarh_Fort_Amritsar.jpg/1280px-Gobindgarh_Fort_Amritsar.jpg',
        photoCredit: 'Wikimedia Commons / Gobindgarh Fort',
        summary:
          'Historic 19th-century military fort converted into a cultural theme park showcasing Punjabi folk arts, museums, and 7D shows.',
      },
    ],
  },
  {
    id: 'patiala',
    code: 'IN-PB-CITY-PTA',
    name: 'Patiala',
    nickname: 'The Royal City of Punjab',
    tagline: 'Phulkian Dynastic Splendor, Sheesh Mahal Murals, and Master Craftsmanship',
    accentColor: '#1E40AF',
    bgGradient: 'from-blue-950/50 via-indigo-950/40 to-slate-950/70',
    flashcardBlurb:
      'The royal bastion of the Phulkian Dynasty, renowned for its massive brick citadel, Sheesh Mahal mirror galleries, Patiala Shahi turbans, Parandas, and classical musical gharanas.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Qila_Mubarak_Patiala.jpg/1280px-Qila_Mubarak_Patiala.jpg',
    photoCredit: 'Wikimedia Commons / Qila Mubarak Patiala',
    topStays: [
      { name: "Neemrana's The Baradari Palace", category: 'Historic 1876 White Colonial Pavilion Palace' },
      { name: 'Hotel Mohan Continental', category: 'Mall Road — Premium City Hotel' },
      { name: 'The Heritage Villa', category: 'Lehal — Boutique Estate & Heritage Stay' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Gopal Sweets',
          location: 'Leela Bhawan',
          specialties: 'Puffy Chana Bhatura, Dhokla, Malpua, and fresh hot Paneer Jalebi soaked in saffron syrup',
        },
        {
          restaurant: 'Nagpal Pure Veg Dhaba',
          location: 'Choti Baradari',
          specialties: 'Homestyle Dal Tadka, Paneer Bhurji, and crisp tandoori Missi Roti with fresh white butter',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Sahni Bakery & Chicken Corner',
          location: 'Leela Bhawan',
          specialties: 'Rich Butter Chicken, Tandoori Champ (mutton chops), and Cream Chicken with garlic naan',
        },
        {
          restaurant: 'Tunday Kababi Patiala',
          location: 'Urban Estate',
          specialties: 'Melt-in-mouth Galouti kebabs, Awadhi Mutton Korma, and Punjabi spiced roasts',
        },
      ],
      peacefulNote:
        'Patiala’s culinary pride is its rich desi ghee preparations, thick lassi glasses, and rustic roadside tandoor dhabas along the Mall Road and Leela Bhawan.',
    },
    attractions: [
      {
        id: 'IN-PB-PTA-ATT-001',
        name: 'Qila Mubarak Complex & Qila Androon',
        category: 'Heritage · Palaces & Forts, 18th-Century Sikh-Mughal Brick Architecture, Ran Baas & Darbar Hall',
        timings: '09:00–17:00 (Closed Mondays)',
        fee: { domestic: 'Free / Nominal restoration upkeep fee', foreign: 'Free / Nominal upkeep fee' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Qila_Mubarak_Patiala.jpg/1280px-Qila_Mubarak_Patiala.jpg',
        photoCredit: 'Wikimedia Commons / Qila Mubarak',
        summary:
          'Founded in 1763 by Baba Ala Singh using millions of baked bricks, this 10-acre fortified palace was the ancestral citadel of the Patiala rulers. Qila Androon features 16 subterranean courtyards, gold-inlaid Darbar Hall, and 18th-century royal apartments.',
      },
      {
        id: 'IN-PB-PTA-ATT-002',
        name: 'Sheesh Mahal & Medal Gallery',
        category: "Heritage / Arts · Palaces & Forts, Museums, World's Largest Collection of Historic Military Medals & Kangra Murals",
        timings: '10:00–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 20', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Sheesh_Mahal_Patiala.jpg/1280px-Sheesh_Mahal_Patiala.jpg',
        photoCredit: 'Wikimedia Commons / Sheesh Mahal',
        summary:
          '19th-century Palace of Mirrors built by Maharaja Narinder Singh, fronted by an artificial lake and Lakshman Jhula suspension bridge. Houses the world’s largest numismatic collection of royal medals, orders, and exquisite frescoes depicting the Gita Govinda.',
      },
      {
        id: 'IN-PB-PTA-ATT-003',
        name: 'Gurdwara Dukh Niwaran Sahib',
        category: 'Spiritual · Sikhism, Sacred Healing Sarovar consecrated by Guru Tegh Bahadur',
        timings: '04:00–22:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Gurudwara_Dukh_Nivaran_Sahib_Patiala.jpg/1280px-Gurudwara_Dukh_Nivaran_Sahib_Patiala.jpg',
        photoCredit: 'Wikimedia Commons / Gurdwara Dukh Niwaran Sahib',
        summary:
          'Sacred Sikh shrine situated in the heart of Patiala, commemorating the visit of Guru Tegh Bahadur Ji in 1672 to alleviate the village of Lehal from a lethal epidemic. The holy Sarovar is believed to possess divine healing properties.',
      },
      {
        id: 'IN-PB-PTA-ATT-004',
        name: 'Baradari Gardens',
        category: 'Nature · Forests & Gardens, 19th-Century Royal Botanical Arboretum with Historic Cricket Pavilion',
        timings: '05:30–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Baradari_Garden_Patiala.jpg/1280px-Baradari_Garden_Patiala.jpg',
        photoCredit: 'Wikimedia Commons / Baradari Gardens',
        summary:
          'Expansive 19th-century royal botanical park commission by Maharaja Rajinder Singh, centered around a 12-door pavilion (Baradari). Filled with rare flowering trees, statues, fern houses, and one of the oldest private royal cricket grounds in India.',
      },
      {
        id: 'IN-PB-PTA-GEM-001',
        name: 'Phulkari Embroidery & Jutti Bazaars (Adalat Bazaar / Top Khana)',
        category: 'Arts / Rural · Textiles, Crafts-Tourism, Traditional Hand-embroidered Phulkari Dupattas & Tilla Juttis',
        timings: '11:00–20:00',
        fee: { domestic: 'Free (Direct interaction with generational craftspersons)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Phulkari_dupatta_embroidery.jpg/1280px-Phulkari_dupatta_embroidery.jpg',
        photoCredit: 'Wikimedia Commons / Phulkari Crafts',
        summary:
          'Vibrant historic street bazaars near Qila Mubarak where women artisans handcraft radiant silk Phulkari geometric embroidery on khaddar fabric, alongside cobbler ateliers stitching traditional zari and tilla work Patiala juttis.',
      },
      {
        id: 'IN-PB-PTA-GEM-002',
        name: 'Bahadurgarh Fort',
        category: 'Heritage · Palaces & Forts, Circular Moated Fortress founded by Nawab Saif Khan & renovated by Maharaja Karam Singh',
        timings: '09:00–17:00',
        fee: { domestic: 'Free (Portions administered by Police Training Academy)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bahadurgarh_Fort_Patiala.jpg/1280px-Bahadurgarh_Fort_Patiala.jpg',
        photoCredit: 'Wikimedia Commons / Bahadurgarh Fort',
        summary:
          'Magnificent circular fort with double concentric walls and an encircling moat located 6 km from Patiala on the Chandigarh road. Dedicated to Guru Tegh Bahadur, housing a historic Gurdwara and 17th-century Saif Khan mosque.',
      },
    ],
  },
  {
    id: 'anandpur-sahib',
    code: 'IN-PB-CITY-ANS',
    name: 'Anandpur Sahib',
    nickname: 'The Holy City of Bliss',
    tagline: 'Birthplace of the Khalsa Panth and Fortress Sanctuaries of the Shivaliks',
    accentColor: '#EA580C',
    bgGradient: 'from-orange-950/60 via-amber-950/40 to-slate-950/70',
    flashcardBlurb:
      '"The Holy City of Bliss" nestled at the foot of the Shivalik hills, revered as the birthplace of the Khalsa Panth in 1699 and the home of the martial Hola Mohalla festival.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Virasat-e-Khalsa_Anandpur_Sahib.jpg/1280px-Virasat-e-Khalsa_Anandpur_Sahib.jpg',
    photoCredit: 'Wikimedia Commons / Virasat-e-Khalsa',
    topStays: [
      { name: 'Anand at the Satluj', category: 'Rural Eco-Farm Resort on riverbank' },
      { name: 'Kikar Lodge Nature Retreat', category: 'Nurpur Bedi — Forest & Adventure Resort' },
      { name: 'Hotel Temple View', category: 'Near Takht Sahib — Pilgrimage Comfort' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Takht Sri Kesgarh Sahib Guru Ka Langar',
          location: 'Takht Kesgarh Sahib Complex',
          specialties: '24/7 sacred langar serving hot Dal, Missi Roti, Sabzi, and Kheer cooked with devotion and seva',
        },
        {
          restaurant: 'Preet Dhaba',
          location: 'Nangal Highway',
          specialties: 'Winter Makki di Roti with freshly churned butter and Sarson da Saag, creamy Dal Fry',
        },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Non-veg food, liquor, and tobacco are strictly prohibited within the municipal and sacred perimeter of Anandpur Sahib. Available only along the outer Ropar-Nangal highways.',
    },
    attractions: [
      {
        id: 'IN-PB-ANS-ATT-001',
        name: 'Takht Sri Kesgarh Sahib',
        category: 'Spiritual / Heritage · Sikhism, One of the Five Temporal Takhts, Birthplace of the Khalsa, Sacred Historic Weapons',
        timings: '03:30–22:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Takht_Sri_Kesgarh_Sahib_Anandpur.jpg/1280px-Takht_Sri_Kesgarh_Sahib_Anandpur.jpg',
        photoCredit: 'Wikimedia Commons / Takht Kesgarh Sahib',
        summary:
          'One of the Five Temporal Takhts of Sikhism, standing on a hill where Guru Gobind Singh Ji instituted the Khalsa Panth on Baisakhi Day in 1699. Enshrines the sacred relics and personal weapons of the Tenth Guru, including the Khanda double-edged sword.',
      },
      {
        id: 'IN-PB-ANS-ATT-002',
        name: 'Virasat-e-Khalsa',
        category: 'Heritage / Arts · Museums, Moshe Safdie-Designed Architectural Masterpiece Depicting 500 Years of Punjabi & Sikh History',
        timings: '10:00–17:30 (Closed Mondays)',
        fee: { domestic: 'Free (Prior online slot reservation or on-spot token required)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Virasat-e-Khalsa_Anandpur_Sahib.jpg/1280px-Virasat-e-Khalsa_Anandpur_Sahib.jpg',
        photoCredit: 'Wikimedia Commons / Virasat-e-Khalsa',
        summary:
          'Monumental cultural museum designed by world-renowned architect Moshe Safdie, celebrating 500 years of Sikh heritage. Features soaring sandstone petals, reflective water bodies, interactive multimedia galleries, and the world’s largest hand-painted ceiling mural.',
      },
      {
        id: 'IN-PB-ANS-ATT-003',
        name: 'Qila Anandgarh Sahib',
        category: 'Heritage · Palaces & Forts, Military Fortress of Guru Gobind Singh with Baoli (Deep Subterranean Water Well)',
        timings: '05:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Qila_Anandgarh_Sahib.jpg/1280px-Qila_Anandgarh_Sahib.jpg',
        photoCredit: 'Wikimedia Commons / Qila Anandgarh Sahib',
        summary:
          'Foremost military stronghold among the five defensive forts built by Guru Gobind Singh Ji to defend Anandpur from imperial Mughal and hill raja armies. Preserves a deep subterranean stepped baoli with 135 stone steps leading to water.',
      },
      {
        id: 'IN-PB-ANS-GEM-001',
        name: 'Jhajjar Bachauli Wildlife Sanctuary',
        category: 'Nature / Rural · Wildlife-Tourism, Forests & Gardens, Sambar, Barking Deer & Leopard Habitats in Shivalik Scrub',
        timings: '06:00–17:00',
        fee: { domestic: 'Free (Forest permit issued at barrier)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Shivalik Wildlife Sanctuary',
        summary:
          'Protected 288-hectare wildlife refuge in the Shivalik foothill scrub 15 km from Anandpur Sahib, harboring sambar, barking deer, leopards, wild boars, and over 100 species of resident and migratory Himalayan birds.',
      },
      {
        id: 'IN-PB-ANS-GEM-002',
        name: 'Charan Ganga Riverbed Track',
        category: 'Nature / Adventure · Rivers & Lakes, Hiking & Trekking, Historic Stream Valley where Nihangs Camp during Hola Mohalla',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        photoCredit: 'Unsplash / Shivalik Stream Landscape',
        summary:
          'Scenic sand and pebble riverbed flanking the Gurdwara Charan Ganga Sahib, where thousands of blue-robed Nihang warrior Sikhs set up encampments, demonstrate horseback tent-pegging, and practice Gatka martial arts during Hola Mohalla.',
      },
    ],
  },
  {
    id: 'kapurthala',
    code: 'IN-PB-CITY-KPT',
    name: 'Kapurthala',
    nickname: 'The Paris of Punjab',
    tagline: 'Francophile Royal Palaces, Moorish Architecture, and Confluence Wetlands',
    accentColor: '#9333EA',
    bgGradient: 'from-purple-950/50 via-slate-950/40 to-indigo-950/70',
    flashcardBlurb:
      '"The Paris of Punjab", a princely city reflecting the francophile vision of Maharaja Jagatjit Singh through French neoclassical palaces, Moorish mosques, and Indo-Gothic gardens.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Jagatjit_Palace%2C_Kapurthala.jpg/1280px-Jagatjit_Palace%2C_Kapurthala.jpg',
    photoCredit: 'Wikimedia Commons / Jagatjit Palace',
    topStays: [
      { name: 'Ramada by Wyndham Kapurthala', category: 'Jalandhar-Kapurthala Highway — Modern 4-Star Comfort' },
      { name: 'Jagatjit Palace Guest Enclave', category: 'Heritage surroundings' },
      { name: 'Cabbana Resort & Spa', category: 'Phagwara / Kapurthala vicinity — Luxury Resort' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Shere Punjab Sweets',
          location: 'Sadar Bazaar',
          specialties: 'Stuffed Amritsari Kulcha with spicy tamarind chutney, golden Paneer Pakoras, and classic wheat Pinni',
        },
        {
          restaurant: 'Amar Sweet House',
          location: 'Mall Road',
          specialties: 'Pure Desi Ghee traditional Punjabi sweets, Motichoor Ladoo, and full North Indian vegetarian thalis',
        },
      ],
      nonVeg: [
        {
          restaurant: 'The London Street Restaurant',
          location: 'Circular Road',
          specialties: 'Rich Butter Chicken, slow-cooked Rarha Mutton, and smoky Tandoori Chicken platters',
        },
        {
          restaurant: "King's Treat",
          location: 'Mall Road',
          specialties: 'Cream Chicken with black pepper, Keema Naan with aromatic rogan josh gravy',
        },
      ],
      peacefulNote:
        'Kapurthala blends classic Punjabi tandoor cooking with refined royal princely recipes, especially rich gravies and desi ghee pinni sweets.',
    },
    attractions: [
      {
        id: 'IN-PB-KPT-ATT-001',
        name: 'Jagatjit Palace (Sainik School)',
        category: 'Heritage · Historical Buildings, Palaces & Forts, Modeled on the Palace of Versailles & Fontainebleau',
        timings: '09:00–16:00 (Sundays and school breaks best for tourists; campus entry requires gate registration)',
        fee: { domestic: 'INR 20–50', foreign: 'INR 20–50' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Jagatjit_Palace%2C_Kapurthala.jpg/1280px-Jagatjit_Palace%2C_Kapurthala.jpg',
        photoCredit: 'Wikimedia Commons / Jagatjit Palace',
        summary:
          'Breathtaking French Renaissance chateau commissioned in 1900 by Francophile Maharaja Jagatjit Singh, modeled upon Versailles and Fontainebleau by French architect M. Marcel. Currently houses the prestigious Sainik School Kapurthala.',
      },
      {
        id: 'IN-PB-KPT-ATT-002',
        name: 'Moorish Mosque',
        category: 'Spiritual / Heritage · Islam, Modeled after the Grand Mosque of Marrakesh (Morocco), Commissioned by a Sikh Maharaja',
        timings: '08:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Moorish_Mosque_Kapurthala.jpg/1280px-Moorish_Mosque_Kapurthala.jpg',
        photoCredit: 'Wikimedia Commons / Moorish Mosque',
        summary:
          'Rare architectural marvel commissioned in 1930 by Sikh ruler Maharaja Jagatjit Singh for his Muslim subjects, designed by French architect Monsieur M. Mantaux in the authentic Moroccan style resembling the Grand Mosque of Marrakesh.',
      },
      {
        id: 'IN-PB-KPT-ATT-003',
        name: 'Elysee Palace',
        category: 'Heritage · Historical Buildings, Anglo-French Chateau-Style Façade built in 1862',
        timings: '10:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Elysee_Palace_Kapurthala.jpg/1280px-Elysee_Palace_Kapurthala.jpg',
        photoCredit: 'Wikimedia Commons / Elysee Palace',
        summary:
          'Stately palace built in 1862 by Kanwar Bikrama Singh featuring a magnificent Indo-French chateau facade, arcaded verandahs, and manicured gardens that became the royal residence before the construction of Jagatjit Palace.',
      },
      {
        id: 'IN-PB-KPT-GEM-001',
        name: 'Harike Wetland & Bird Sanctuary (Ramsar Site)',
        category: 'Nature / Rural · Wildlife-Tourism, Rivers & Lakes, Confluence of Beas and Sutlej Rivers, Indus River Dolphin Sighting',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Forest boat permit: INR 200–500)', foreign: 'Free (Forest boat permit: INR 200–500)' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Harike_Wetland_Punjab.jpg/1280px-Harike_Wetland_Punjab.jpg',
        photoCredit: 'Wikimedia Commons / Harike Wetland',
        summary:
          'Largest wetland in northern India (4,100 hectares) situated at the confluence of the Beas and Sutlej rivers. International Ramsar site wintering over 200,000 migratory waterfowl from Siberia and Central Asia, and home to rare Indus River Dolphins.',
      },
      {
        id: 'IN-PB-KPT-GEM-002',
        name: 'Shalimar Gardens & Royal Samadhis',
        category: 'Heritage / Nature · Forests & Gardens, Red Sandstone Royal Cenotaphs and Baradari Pavilions',
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Shalimar_Gardens_Kapurthala.jpg/1280px-Shalimar_Gardens_Kapurthala.jpg',
        photoCredit: 'Wikimedia Commons / Shalimar Gardens',
        summary:
          'Picturesque heritage park in the heart of Kapurthala preserving the royal marble and red sandstone samadhis (cenotaphs) of the Ahluwalia rulers, swimming tanks, and marble baradaris set among sprawling manicured lawns.',
      },
      {
        id: 'IN-PB-KPT-GEM-003',
        name: 'Panj Mandir',
        category: 'Spiritual / Heritage · Hinduism, 18th-Century Historic Temple Complex of Five Shrines built by Sardar Fateh Singh Ahluwalia',
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Panch_Mandir_Kapurthala.jpg/1280px-Panch_Mandir_Kapurthala.jpg',
        photoCredit: 'Wikimedia Commons / Panj Mandir',
        summary:
          'Historic temple complex constructed in the 18th century during the reign of Sardar Fateh Singh Ahluwalia, featuring five distinct shrines clustered around a central sanctum, ingeniously designed so that all five can be viewed from a single vantage point.',
      },
    ],
  },
];
