export interface GujaratStay {
  name: string;
  category: string;
}

export interface GujaratFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface GujaratDining {
  veg: GujaratFoodSpot[];
  nonVeg: GujaratFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface GujaratAttraction {
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

export interface GujaratCity {
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
  topStays: GujaratStay[];
  dining: GujaratDining;
  attractions: GujaratAttraction[];
}

export const GUJARAT_DIRECTORY: GujaratCity[] = [
  {
    id: 'ahmedabad',
    code: 'IN-GJ-CITY-AMD',
    name: 'Ahmedabad',
    nickname: "India's First UNESCO World Heritage City",
    tagline: 'Carved wooden pols, Islamic sultanate filigree & Gandhi’s Sabarmati sanctuary',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Adalaj_Stepwell_Interior.jpg/1280px-Adalaj_Stepwell_Interior.jpg',
    photoCredit: 'Wikimedia Commons / Adalaj Stepwell',
    flashcardBlurb:
      'India\'s first UNESCO World Heritage City, balancing intricately carved pol houses and Islamic sultanate monuments with Gandhi\'s non-violent revolution and cutting-edge modernist architecture.',
    topStays: [
      { name: 'The House of Mangaldas Girdhardas', category: 'Lal Darwaja — Heritage Haveli Hotel' },
      { name: 'Taj Skyline Ahmedabad', category: 'Sindhu Bhavan Road — Luxury Business Hotel' },
      { name: 'Hyatt Regency Ahmedabad', category: 'Ashram Road — Sabarmati Riverfront Luxury' },
    ],
    dining: {
      veg: [
        { restaurant: 'Agashiye at The House of MG', location: 'Lal Darwaja', specialties: 'Grand rooftop Gujarati thali with steaming Farsan, Rasawala Bateta, Kadhi, Rotlis & Shrikhand' },
        { restaurant: 'Vishalla', location: 'Vasna', specialties: 'Rural village-style open-air floor seated dining on sal leaf platters with authentic bajra rotla, garlic chutney & jaggery' },
        { restaurant: 'Das Khaman', location: 'Nehrunagar', specialties: 'Iconic fresh melt-in-mouth Nylon Khaman, Sev Khamani, Patra & spiced green chillies' },
      ],
      nonVeg: [
        { restaurant: 'Bhatiyar Gali Street Stalls', location: 'Old City / Teen Darwaza', specialties: 'Historic 600-year-old culinary lane serving crisp Bera Samosa, Tawa Chaap & Mutton Biryani' },
        { restaurant: 'Simran Farm', location: 'Hansol', specialties: 'Spiced clay-oven tandoori chicken, aromatic gravies & fresh roomali rotis' },
      ],
      peacefulNote: 'Gujarati gastronomy masterfully harmonizes sweet, salty, and sour flavors with asafoetida, fresh curry leaves, jaggery, and frothy chaas (buttermilk).',
    },
    attractions: [
      {
        id: 'IN-GJ-AMD-ATT-001',
        name: 'Sabarmati Ashram (Gandhi Ashram)',
        category: 'Heritage · Historical Sites, Monuments & Freedom Movement',
        timings: '10:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Sabarmati_Ashram_Ahmedabad.jpg/1280px-Sabarmati_Ashram_Ahmedabad.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Tranquil riverfront headquarters where Mahatma Gandhi lived from 1917 to 1930, preserving his living cottage Hriday Kunj, the iconic spinning charkha, and the launch point of the 1930 Dandi Salt March.',
      },
      {
        id: 'IN-GJ-AMD-ATT-002',
        name: 'Adalaj Stepwell (Rudabai Stepwell)',
        category: 'Heritage · Archeological Sites, Solanki-era Indo-Islamic Carved Stepwell',
        timings: '06:00–18:00',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Adalaj_Stepwell_Interior.jpg/1280px-Adalaj_Stepwell_Interior.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1499 five-storey subterranean octagonal stepwell built by Queen Rudadevi, renowned for exquisite Solanki carved pillars, friezes of musicians, dancing maidens, and naturally cooled deep chambers.',
      },
      {
        id: 'IN-GJ-AMD-ATT-003',
        name: 'Sidi Saiyyed Mosque & Stone Lattice Jali',
        category: 'Heritage / Arts · Historical Buildings, World-Famous "Tree of Life" Marble Filigree',
        timings: '07:00–19:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Sidi_Saiyyed_Mosque_Jali.jpg/1280px-Sidi_Saiyyed_Mosque_Jali.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1573 mosque celebrated worldwide for its semi-circular sandstone tracery windows, featuring intertwined palm tree branches and delicate scrolling vine filigree carved with astonishing lace-like precision.',
      },
      {
        id: 'IN-GJ-AMD-ATT-004',
        name: 'Hutheesing Jain Temple',
        category: 'Spiritual / Heritage · Jainism, White Marble Carvings & 52 Sub-Shrines',
        timings: '08:00–13:00 & 14:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Hutheesing_Jain_Temple.jpg/1280px-Hutheesing_Jain_Temple.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1848 white marble masterpiece dedicated to Dharmanatha (the 15th Tirthankara), featuring a double-storey courtyard encircled by 52 elaborately carved shrines and a towering Manastambha.',
      },
      {
        id: 'IN-GJ-AMD-GEM-001',
        name: 'Sarkhej Roza ("Acropolis of Ahmedabad")',
        category: 'Heritage · Historical Buildings, Sultanate Tomb Complex & Water Pavilion',
        timings: '09:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Sarkhej_Roza_Ahmedabad.jpg/1280px-Sarkhej_Roza_Ahmedabad.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Pioneering 15th-century Indo-Saracenic architectural ensemble praised by Le Corbusier, surrounding a colossal 34-acre man-made lake with palace pavilions, tombs, and open stone pillared halls.',
      },
      {
        id: 'IN-GJ-AMD-GEM-002',
        name: 'Calico Museum of Textiles',
        category: 'Arts / Rural · Textiles, Historic Indian Fabrics & Museum Conservatories',
        timings: '10:30–12:30 (Closed Wednesdays & Public Holidays; pre-registration mandatory)',
        fee: { domestic: 'Free (Strict pre-registered tour quota)', foreign: 'Free (Strict pre-registered tour quota)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Historic Indian Textiles',
        summary:
          'One of the world’s finest textile museums, holding five centuries of Indian hand-woven silk brocades, Mughal court velvets, Kashmiri shawls, and temple Pichwai hangings inside a restored wooden haveli.',
      },
    ],
  },
  {
    id: 'kutch',
    code: 'IN-GJ-CITY-KUT',
    name: 'Rann of Kutch & Bhuj',
    nickname: 'The White Desert & Craft Frontier',
    tagline: 'Infinite seasonal salt flats, Rogan oil art, mirror embroidery & Harappan ruins',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-slate-50/50 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Rann_of_Kutch_White_Desert.jpg/1280px-Rann_of_Kutch_White_Desert.jpg',
    photoCredit: 'Wikimedia Commons / White Rann',
    flashcardBlurb:
      'A seasonal salt marsh wilderness stretching to the Arabian horizon, inhabited by vibrant tribal craft communities known for Rogan art, mirror embroidery, and mud bhunga architecture.',
    topStays: [
      { name: 'Tent City Dhordo', category: 'Dhordo — Luxury Glamping setup during Rann Utsav' },
      { name: 'Rann Riders / Desert Courtyard', category: 'Dasada / Dhordo Border — Eco-Ethnic Mud Cottages' },
      { name: 'Dholavira Tourism Resort', category: 'Khadir Bet — Harappan Ruins Basecamp' },
    ],
    dining: {
      veg: [
        { restaurant: 'Toran Dining Hall', location: 'Bhuj / Dhordo', specialties: 'Traditional Kutchi Bajra no Rotlo with white butter, roasted Ringna no Olo (eggplant mash) & fresh spicy buttermilk' },
        { restaurant: 'Nilam Hotel', location: 'Bhuj', specialties: 'Wholesome Gujarati & Kutchi thalis with sweet Dabeli, Kadhi, Khichdi & Gulab Jamun' },
      ],
      nonVeg: [
        { restaurant: 'Noorani Restaurant', location: 'Bhuj Station Road', specialties: 'Aromatic Kutchi Mutton Biryani, pan-fried chicken & spicy tawa kebabs' },
      ],
      peacefulNote: 'Kutchi desert nourishment is sustained by winter millets (bajra), wood-smoked eggplant, roasted garlic paste, and fresh camel or cow-milk butter.',
    },
    attractions: [
      {
        id: 'IN-GJ-KUT-ATT-001',
        name: 'White Desert of Kutch (Dhordo Salt Flats)',
        category: 'Nature · Deserts, Salt Marshes & Full-Moon Night Expanses',
        timings: '06:00–20:00 (Sunset/Moonrise permits verified at Bhirandiyara checkpoint)',
        fee: { domestic: 'Permit INR 100/person + INR 50/vehicle', foreign: 'Permit INR 100/person + INR 50/vehicle' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Rann_of_Kutch_White_Desert.jpg/1280px-Rann_of_Kutch_White_Desert.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'World’s largest salt desert spanning over 7,500 sq km, transforming into an ethereal blinding white sheet of crystalline salt that glimmers magically under full-moon skies.',
      },
      {
        id: 'IN-GJ-KUT-ATT-002',
        name: 'Aina Mahal & Prag Mahal, Bhuj',
        category: 'Heritage / Arts · Palaces & Forts, Venetian Gothic Tower & Hall of Mirrors',
        timings: '09:00–12:00 & 15:00–18:00 (Closed Thursdays)',
        fee: { domestic: 'INR 30–50', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Aina_Mahal_Bhuj.jpg/1280px-Aina_Mahal_Bhuj.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '18th-century Hall of Mirrors created by master craftsman Ram Singh Malam with Venetian chandeliers and mirror-mosaic walls, alongside the 45-meter clock tower of Prag Mahal.',
      },
      {
        id: 'IN-GJ-KUT-ATT-003',
        name: 'Dholavira Harappan City',
        category: 'Heritage · UNESCO World Heritage, Indus Valley Reservoirs & Citadel',
        timings: '06:00–18:00',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Dholavira_Reservoir.jpg/1280px-Dholavira_Reservoir.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'One of the five largest Harappan cities dating back to 3000 BCE on Khadir Bet island, renowned for its sophisticated rock-cut water reservoirs, underground storm drainage, and giant signage board.',
      },
      {
        id: 'IN-GJ-KUT-GEM-001',
        name: 'Nirona Artisan Village',
        category: 'Arts / Rural · Crafts-Tourism, Live Like a Local, Rogan Castor Oil Art & Copper Bells',
        timings: '09:00–18:00',
        fee: { domestic: 'Free (Artisans offer live demonstrations)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Rogan_Art_Nirona.jpg/1280px-Rogan_Art_Nirona.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Traditional artisan hamlet where the Khatri family preserves the 400-year-old rare art of Rogan painting (freehand fabric motifs using castor-seed oil and natural pigments), alongside Lohar copper bell smiths.',
      },
      {
        id: 'IN-GJ-KUT-GEM-002',
        name: 'Kalo Dungar (Black Hill) & Dattatreya Temple',
        category: 'Nature / Spiritual · Highest Point in Kutch (462 m) & Jackal Feeding Ritual',
        timings: '06:00–19:00',
        fee: { domestic: 'Free (Vehicle toll ~INR 50)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Kalo_Dungar_View.jpg/1280px-Kalo_Dungar_View.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The highest summit in Kutch (462 m) offering panoramic vistas over the Great Rann salt expanse meeting the sky, famous for a 400-year-old temple tradition of feeding vegetarian prasad to wild jackals.',
      },
    ],
  },
  {
    id: 'gir-national-park',
    code: 'IN-GJ-CITY-GIR',
    name: 'Gir National Park & Sasan Gir',
    nickname: 'Last Bastion of the Asiatic Lion',
    tagline: 'Dry deciduous teak reserves, royal lion prides & Maldhari pastoral nes hamlets',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-yellow-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Asiatic_Lion_Gir.jpg/1280px-Asiatic_Lion_Gir.jpg',
    photoCredit: 'Wikimedia Commons / Asiatic Lion',
    flashcardBlurb:
      'The sole sanctuary on Earth for the endangered Asiatic Lion, sheltering royal predators amidst teak-dominated dry deciduous forests, rocky hills, and Maldhari pastoral settlements.',
    topStays: [
      { name: 'The Fern Gir Forest Resort', category: 'Sasan Gir — Eco-Luxury Riverside Sanctuary' },
      { name: 'Woods at Sasan', category: 'Biophilic Luxury & Wellness Forest Retreat' },
      { name: 'Gir Birding Lodge', category: 'Rustic Wilderness Cottages in Mango Orchards' },
    ],
    dining: {
      veg: [
        { restaurant: 'Bapasitaram Kathiyawadi Dhaba', location: 'Sasan Gir', specialties: 'Spiced Sev Tameta, smoky Ringna no Olo, Bafla, garlic-rich Lasaniya Bataka & hot tawa rotlas' },
        { restaurant: 'Swadesh Kathiyawadi', location: 'Junagadh-Gir Highway', specialties: 'Traditional wood-fired Bajra Rotla with pure organic jaggery, white butter & sweet kheer' },
      ],
      nonVeg: [
        { restaurant: 'Wilderness Forest Camp Kitchens', location: 'Sasan Gir Outskirts', specialties: 'Rustic Kathiyawadi Desi Chicken curry simmered with wild cumin, hot roomali rotis & tandoori platters' },
      ],
      peacefulNote: 'Kathiyawadi wilderness kitchens celebrate slow wood-fired earthen cooking, roasted garlic, fiery red chillies, and creamy freshly churned buffalo buttermilk.',
    },
    attractions: [
      {
        id: 'IN-GJ-GIR-ATT-001',
        name: 'Gir Jungle Trail (Core Lion Safari)',
        category: 'Nature / Rural · Wildlife-Tourism, Forests & Asiatic Lion Tracking',
        timings: '06:00–09:00, 09:00–12:00 & 15:00–18:00 (Park closed June 16 to Oct 15)',
        fee: { domestic: 'Permit INR 800–1,000 + Gypsy/Guide (~INR 3,500–4,500)', foreign: 'Permit INR 4,500–5,500 + Gypsy/Guide' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Asiatic_Lion_Gir.jpg/1280px-Asiatic_Lion_Gir.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1,412 sq km protected ecosystem comprising dry teak forests, acacia scrub, and rocky gorges sheltering the world’s entire surviving population of over 600 wild Asiatic lions.',
      },
      {
        id: 'IN-GJ-GIR-ATT-002',
        name: 'Devalia Safari Park (Gir Interpretation Zone)',
        category: 'Nature · Wildlife-Tourism, Fenced Eco-Safari Area & Quick Sightings',
        timings: '07:00–11:00 & 15:00–17:00 (Closed Wednesdays)',
        fee: { domestic: 'Bus Safari INR 150–200; Gypsy Safari INR 4,000–5,000', foreign: 'Bus Safari INR 150–200; Gypsy Safari INR 4,000–5,000' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Asiatic Lioness',
        summary:
          '412-hectare fenced mini-reserve providing guaranteed sightings of Asiatic lions, leopards, Indian gazelles, spotted deer, and sambars in their natural forest habitat.',
      },
      {
        id: 'IN-GJ-GIR-GEM-001',
        name: 'Maldhari Ness (Pastoral Hamlets inside the Reserve)',
        category: 'Rural · Live Like a Local, Coexistence with Wild Lions & Pure Ghee Production',
        timings: 'Governed strictly by official forest day safari routes',
        fee: { domestic: 'Included in authorized safari route', foreign: 'Included in authorized safari route' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Maldhari_Hut_Gir.jpg/1280px-Maldhari_Hut_Gir.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Traditional circular thatched mud settlements (Ness) of the vegetarian Maldhari pastoral tribe who have coexisted symbiotically with wild lions in the Gir forest for generations.',
      },
      {
        id: 'IN-GJ-GIR-GEM-002',
        name: 'Kankai Mata Temple & Forest Shrine',
        category: 'Spiritual / Nature · Hinduism, Deep Forest Sanctuary & En Route Wildlife',
        timings: '07:00–17:00 (Night stay inside reserve strictly prohibited)',
        fee: { domestic: 'Forest checkpost vehicle entry permit ~INR 200', foreign: 'Forest checkpost vehicle entry permit ~INR 200' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Forest Temple Sanctuary',
        summary:
          'Ancient Hindu shrine dedicated to Kankai Mata nestled 25 km deep in the core forest along the Shingavadi River, where pilgrims often encounter lions and leopards during daylight transit.',
      },
    ],
  },
  {
    id: 'dwarka',
    code: 'IN-GJ-CITY-DWK',
    name: 'Dwarka',
    nickname: 'Ancient Char Dham & Kingdom of Krishna',
    tagline: '72-pillared sandstone spire, submerged ocean citadel & cable-stayed sea bridge',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-50 via-teal-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Dwarkadhish_Temple_Spire.jpg/1280px-Dwarkadhish_Temple_Spire.jpg',
    photoCredit: 'Wikimedia Commons / Dwarkadhish Temple',
    flashcardBlurb:
      'An ancient Char Dham pilgrimage destination on the western tip of the Saurashtra peninsula, steeped in Mahabharata legends of Lord Krishna\'s submerged coastal kingdom.',
    topStays: [
      { name: 'Hawthorn Suites by Wyndham Dwarka', category: 'Luxury Eco Villa Resort with Lake Views' },
      { name: 'Mercure Dwarka', category: 'Porbandar-Dwarka Highway — Premium International Comfort' },
      { name: 'Hotel Gomti', category: 'TCGL — Lakeside Heritage Pilgrimage Stay' },
    ],
    dining: {
      veg: [
        { restaurant: 'Shreenath Dining Hall', location: 'Station Road', specialties: 'Hearty Kathiyawadi & Gujarati thali with piping hot Rotlis, ringna olo, dal & unlimited sweet chaas' },
        { restaurant: 'Chotiwala Dwarka', location: 'Near Temple Gate', specialties: 'Puri Bhaji, classic North & South Indian vegetarian thalis & fresh sweets' },
        { restaurant: 'Kant Dining Hall', location: 'Gomti Ghat Road', specialties: 'Authentic Saurashtra vegetarian meals served with ghee-laden rotlas, khichdi & kadhi' },
      ],
      nonVeg: [],
      pilgrimageNotice: 'Sacred Pilgrimage Bylaw: Non-vegetarian food and alcohol are strictly prohibited across the holy temple precinct and pilgrimage town limits of Dwarka.',
      peacefulNote: 'Dwarka’s sacred pilgrim food centers on wholesome sattvic Gujarati thalis, ladva prasad, sweet makhan-mishri, and soothing spiced buttermilk.',
    },
    attractions: [
      {
        id: 'IN-GJ-DWK-ATT-001',
        name: 'Dwarkadhish Temple (Jagat Mandir)',
        category: 'Spiritual / Heritage · Hinduism, Char Dham, 72-Pillared Chalukya Sandstone Shikhara',
        timings: '06:30–13:00 & 17:00–21:30',
        fee: { domestic: 'Free (Special/VIP Darshan INR 200–500; strict no-phone rule)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Dwarkadhish_Temple_Spire.jpg/1280px-Dwarkadhish_Temple_Spire.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '2,200-year-old Char Dham and Sapta Puri temple dedicated to Lord Krishna, featuring a 5-storey sandstone spire resting on 72 ornate limestone pillars flying a 52-yard triangular silk flag.',
      },
      {
        id: 'IN-GJ-DWK-ATT-002',
        name: 'Gomti Ghat & Sudama Setu',
        category: 'Spiritual / Nature · Rivers & Lakes, Holy River-Sea Confluence & Suspension Bridge',
        timings: '06:00–20:00',
        fee: { domestic: 'Free (Sudama Setu pedestrian bridge: INR 10–20)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Gomti_Ghat_Dwarka.jpg/1280px-Gomti_Ghat_Dwarka.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Stepped sacred ghats where the Gomti River enters the Arabian Sea, connected across the estuary by the cable-suspension Sudama Setu leading toward the Panchtirth sand dunes.',
      },
      {
        id: 'IN-GJ-DWK-ATT-003',
        name: 'Nageshwar Jyotirlinga Temple',
        category: 'Spiritual · Hinduism, One of the 12 Sacred Jyotirlinga Shrines & 80-ft Shiva Statue',
        timings: '06:00–12:30 & 17:00–21:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Nageshwar_Shiva_Statue.jpg/1280px-Nageshwar_Shiva_Statue.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'One of the 12 venerated Jyotirlingas of Lord Shiva according to the Shiva Purana, dominated by a towering 80-foot seated statue of Lord Shiva overlooking peaceful gardens.',
      },
      {
        id: 'IN-GJ-DWK-ATT-004',
        name: 'Bet Dwarka & Sudarshan Setu',
        category: 'Heritage / Spiritual · Hinduism, Island Residence & India’s Longest Cable-Stayed Bridge',
        timings: 'Temple open 06:00–13:00 & 17:00–21:00; Bridge open 24 Hours',
        fee: { domestic: 'Free (Bridge is toll-free; ferries charge INR 20–30)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Sudarshan_Setu_Okha_Bet_Dwarka.jpg/1280px-Sudarshan_Setu_Okha_Bet_Dwarka.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Island sanctuary believed to be the ancient personal residence of Lord Krishna, now seamlessly connected from Okha mainland via the architectural marvel Sudarshan Setu—India’s longest cable-stayed bridge (2.32 km).',
      },
      {
        id: 'IN-GJ-DWK-GEM-001',
        name: 'Shivrajpur Blue Flag Beach',
        category: 'Nature / Adventure · Beaches & Cruises, Scuba Diving, Coral Reefs & Eco-Tourism',
        timings: '08:00–19:00',
        fee: { domestic: 'Beach entry INR 30–50; Scuba diving INR 2,000–2,500', foreign: 'Beach entry INR 30–50; Scuba diving INR 2,000–2,500' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Shivrajpur_Beach_Dwarka.jpg/1280px-Shivrajpur_Beach_Dwarka.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Internationally certified Blue Flag beach 12 km from Dwarka featuring pristine white sands, crystal-clear turquoise waters, underwater coral gardens, and guided scuba diving.',
      },
      {
        id: 'IN-GJ-DWK-GEM-002',
        name: 'Rukmini Devi Temple',
        category: 'Heritage / Spiritual · Hinduism, 12th-century Intricately Carved Stone Exterior',
        timings: '06:00–12:00 & 13:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Rukmini_Devi_Temple_Dwarka.jpg/1280px-Rukmini_Devi_Temple_Dwarka.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '12th-century architectural jewel built 2 km outside Dwarka town due to sage Durvasa’s curse, adorned with miniature carved elephants, floral panels, and Nar-Narayan sculptures.',
      },
    ],
  },
];
