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
  permitNotice?: string;
  culinaryNote?: string;
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
    id: 'gir',
    code: 'IN-GJ-CITY-GIR',
    name: 'Gir (Sasan Gir)',
    nickname: 'Last Refuge of the Asiatic Lion',
    tagline: 'Rugged dry deciduous forests, Kamleshwar crocodile waters & ancestral Siddhi culture',
    accentColor: '#15803D',
    bgGradient: 'from-emerald-50 via-green-50/40 to-stone-50/30',
    coverImage: '/images/gujarat/gir-asiatic-lion.jpg',
    photoCredit: 'Discover Bharat Contributor / Asiatic Lion in Sasan Gir Forest',
    flashcardBlurb:
      'The sole remaining natural habitat of the endangered Asiatic lion, featuring rugged dry deciduous forests, crocodile-filled rivers, and distinct Siddhi tribal culture.',
    topStays: [
      { name: 'Taj Safari Lodge', category: 'Sasan Gir — Luxury Jungle Retreat & Naturalist Safaris' },
      { name: 'Woods at Sasan', category: 'Eco-Luxury Biophilic Resort & Forest Wellness' },
      { name: 'The Fern Gir Forest Resort', category: 'Hiran Riverbank — Eco-luxury Riverside Cottages' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Swaminarayan Temple Dining',
          location: 'Sasan Gir',
          specialties: 'Simple, pure vegetarian prasad, comforting Gujarati dal, rice, and khichdi',
        },
        {
          restaurant: 'Gir Jungle Lodge Restaurant',
          location: 'Sasan Gir Road',
          specialties: 'Authentic Kathiyawadi thali with Sev Tameta, Ringna no Olo, Bajra no Rotlo, and raw garlic chutney',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Woods at Sasan & Taj Safari Lodge Dining',
          location: 'Private Resort Dining Halls',
          specialties: 'In-house gourmet dining offering tandoori chicken, aromatic mutton curries, and Continental fare (non-veg dining is restricted outside private resorts)',
        },
      ],
      peacefulNote:
        'Sasan Gir is deeply influenced by the vegetarian pastoral culture of the native Maldhari community, who coexist in harmony with the Asiatic lions inside the forest buffer zone.',
      permitNotice:
        'Gir National Park core safari permits must be booked in advance online at the official Gujarat Forest Department portal (girnationalpark.gujarat.gov.in). Core zones remain closed annually during the monsoon (June 16 to October 15).',
    },
    attractions: [
      {
        id: 'IN-GJ-GIR-ATT-001',
        name: 'Gir National Park Safari',
        category: 'Nature: Wildlife-Tourism, Core Lion Safari',
        timings: '06:30–09:30, 09:30–12:30 & 15:00–18:00 (Closed June 16 to Oct 15)',
        fee: {
          domestic: 'Safari Permit ~INR 800–1,000 + Jeep & Guide (Total ~INR 4,000–5,000 per jeep)',
          foreign: 'Safari Permit ~INR 5,600–7,000 + Jeep & Guide',
        },
        isHiddenGem: false,
        image: '/images/gujarat/gir-asiatic-lion.jpg',
        photoCredit: 'Discover Bharat Contributor / Wild Asiatic Lion on Patrol',
        summary:
          'Open jeep wilderness safaris through the core protected lion habitat. Accompanied by certified forest department trackers, visitors explore dry teak scrub to spot majestic wild Asiatic lions, leopards, spotted deer (chital), and sambar.',
      },
      {
        id: 'IN-GJ-GIR-ATT-002',
        name: 'Gir Interpretation Zone, Devalia',
        category: 'Nature: Wildlife-Tourism, Fenced Safari Park',
        timings: '08:00–11:00 & 15:00–17:00 (Closed Wednesdays)',
        fee: {
          domestic: 'INR 150',
          foreign: 'INR 2,800',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Devalia Safari Interpretation Zone',
        summary:
          'A 412-hectare fenced "Gir in a nutshell" created to reduce tourist footprint in the core forest. Guided mini-bus safaris offer near-guaranteed sightings of Asiatic lions, leopards, nilgai, and blackbucks roaming in naturalized deciduous terrain.',
      },
      {
        id: 'IN-GJ-GIR-ATT-003',
        name: 'Kamleshwar Dam',
        category: 'Nature: Rivers & Lakes, Crocodile Habitats',
        timings: 'Accessed during core safari hours (06:30–18:00)',
        fee: {
          domestic: 'Included in safari permit',
          foreign: 'Included in safari permit',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Kamleshwar Dam Reservoir',
        summary:
          'Constructed over the Hiran River right in the middle of Gir sanctuary, this picturesque water body serves as the vital lifeline for wildlife and is renowned as one of the world\'s premier breeding sites for wild marsh crocodiles (muggers).',
      },
      {
        id: 'IN-GJ-GIR-GEM-001',
        name: 'Jamjir Waterfall',
        category: 'Nature / Adventure: Rivers & Lakes, Natural Cascades',
        timings: 'Daylight hours (07:00–18:00)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Jamjir Cascades on Shingoda River',
        summary:
          'A dramatic two-tiered natural waterfall roaring over jagged basalt rock shelves on the Shingoda River near Jamwala. Surrounded by dense scrubland, it forms massive white froth pools (swimming is strictly prohibited due to dangerous undertows and crocodile presence).',
      },
      {
        id: 'IN-GJ-GIR-GEM-002',
        name: 'Siddhi Tribal Villages',
        category: 'Rural: Tribal-Tourism, Indo-African Living Culture',
        timings: 'Daylight hours (08:00–18:00)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Siddhi Cultural Heritage Settlement',
        summary:
          'Ancestral hamlets such as Sirvan inhabited by the Siddhis, an indigenous community of East African Bantu descent who migrated to Gujarat centuries ago. Known for preserving their unique African heritage, rhythmic Dhamal tribal dance, and ancient Sufi traditions honoring Baba Gor.',
      },
    ],
  },
  {
    id: 'somnath',
    code: 'IN-GJ-CITY-SMT',
    name: 'Somnath',
    nickname: 'First of the Twelve Sacred Jyotirlingas',
    tagline: 'Eternal coastal shore temple, holy Triveni Sangam & the divine departure site of Lord Krishna',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: '/images/gujarat/somnath-shore-temple.png',
    photoCredit: 'Discover Bharat Contributor / Somnath Shore Temple Overlooking Arabian Sea',
    flashcardBlurb:
      'A legendary coastal pilgrimage town holding the first of the twelve Jyotirlingas, symbolizing resilience after being destroyed and rebuilt multiple times throughout history.',
    topStays: [
      { name: 'The Fern Residency Somnath', category: 'Prabhas Patan — Premium Comfort & Ocean Proximity' },
      { name: 'Lords Inn Somnath', category: 'Veraval Bypass — Sea-View Rooms & Rooftop Vegetarian Dining' },
      { name: 'Sarovar Portico Somnath', category: 'Near Somnath Temple — Family Pilgrimage Luxury' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Bhabha Dining Hall',
          location: 'Main Market, Somnath',
          specialties: 'Famous for authentic unlimited Gujarati thalis, piping hot rotlis, farsan, dal-bhat, and sweet shrikhand',
        },
        {
          restaurant: 'Somnath Trust Bhojanalay',
          location: 'Somnath Temple Complex',
          specialties: 'Budget-friendly pure vegetarian meals, consecrated temple prasad, buttermilk, and khichdi',
        },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Somnath is a consecrated sacred Hindu holy city. Non-vegetarian food and alcohol are strictly prohibited across the entire municipal pilgrimage boundary and coastal promenade.',
      peacefulNote:
        'Savor piping hot Gujarati snacks such as Ganthiya, Jalebi, and Khaman at the morning bazaar stalls around Prabhas Patan.',
    },
    attractions: [
      {
        id: 'IN-GJ-SMT-ATT-001',
        name: 'Somnath Jyotirlinga Temple',
        category: 'Spiritual / Heritage: Hinduism, Shore Temples',
        timings: '06:00–21:30 (Aarti at 07:00, 12:00, 19:00). Sound & Light Show: 20:00',
        fee: {
          domestic: 'Free (Sound & Light Show: INR 25)',
          foreign: 'Free (Sound & Light Show: INR 25)',
        },
        isHiddenGem: false,
        image: '/images/gujarat/somnath-shore-temple.png',
        photoCredit: 'Discover Bharat Contributor / Majestic Chalukya Shikhara of Somnath',
        summary:
          'A magnificent shore temple rebuilt in the Chalukya (Kailash Mahameru Prasad) architectural style by Sardar Vallabhbhai Patel after Indian independence. As the "Prathama Jyotirlinga", its sanctum overlooks the Arabian Sea, aligned such that no landmass exists between its arrow pillar (Baan Stambh) and Antarctica.',
      },
      {
        id: 'IN-GJ-SMT-ATT-002',
        name: 'Bhalka Tirth',
        category: 'Spiritual: Hinduism, Krishna Sacred Shrines',
        timings: '06:00–21:00',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Bhalka Tirth Holy Banyan Shrine',
        summary:
          'The sacred banyan tree shrine located 4 km from Somnath where Lord Krishna, resting in meditation, was mistakenly struck in the foot by an arrow released by the hunter Jara, marking the conclusion of the Dvapara Yuga and the start of the Kali Yuga.',
      },
      {
        id: 'IN-GJ-SMT-ATT-003',
        name: 'Triveni Sangam',
        category: 'Spiritual / Nature: Rivers & Lakes, Holy Confluences',
        timings: 'Open 24 hours (Best during dawn and twilight prayers)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Triveni Sangam Ghats, Somnath',
        summary:
          'The holy confluence where three sacred rivers—Hiran, Kapila, and the subterranean Saraswati—merge into the churning waves of the Arabian Sea. Pilgrims undertake sacred river dips and perform ancestral Moksha rituals on the broad stone ghats.',
      },
      {
        id: 'IN-GJ-SMT-GEM-001',
        name: 'Prabhas Patan Museum',
        category: 'Heritage: Museums, Archaeological Relics',
        timings: '10:30–17:30 (Closed Wednesdays)',
        fee: {
          domestic: 'INR 5',
          foreign: 'INR 50',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Prabhas Patan Archaeological Gallery',
        summary:
          'An intriguing archaeological museum established near the temple complex housing sculpted fragments, inscriptions, ornate Torana pillars, and exquisite stone statues from the successive historical avatars of the Somnath temple.',
      },
      {
        id: 'IN-GJ-SMT-GEM-002',
        name: 'Somnath Beach',
        category: 'Nature: Beaches, Coastal Promenades',
        timings: '06:00–19:00',
        fee: {
          domestic: 'Free (Camel and horse rides extra)',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Somnath Coastal Sunset Promenade',
        summary:
          'A breezy, non-swimming shoreline promenade adjacent to the temple offering sweeping sunset vistas over the Arabian Sea. Massive stone breakwaters and tetrapods hold back crashing tidal surges while pilgrims stroll along the illuminated sea walk.',
      },
    ],
  },
  {
    id: 'dwarka',
    code: 'IN-GJ-CITY-DWK',
    name: 'Dwarka',
    nickname: 'Ancient Char Dham & Kingdom of Krishna',
    tagline: '5-storied Jagat Mandir, 52-yard Dhwaja flag, Bet Dwarka cable bridge & Blue Flag shores',
    accentColor: '#2563EB',
    bgGradient: 'from-blue-50 via-sky-50/40 to-stone-50/30',
    coverImage: '/images/gujarat/dwarkadhish-jagat-mandir.jpg',
    photoCredit: 'Discover Bharat Contributor / Dwarkadhish Jagat Mandir Shikhara & Dhwaja',
    flashcardBlurb:
      'The ancient kingdom of Lord Krishna and a pivotal Char Dham pilgrimage site, blending vibrant temple mythology with marine archaeological mysteries.',
    topStays: [
      { name: 'Mercure Dwarka', category: 'Porbandar-Dwarka Highway — Modern Upscale Stay' },
      { name: 'Hawthorn Suites by Wyndham', category: 'Luxury Eco Villa Resort with Lake Views' },
      { name: 'Lemon Tree Premier', category: 'Station Road — City Comfort & Family Pilgrimage Rooms' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Shreenath Dining Hall',
          location: 'Dwarka Town',
          specialties: 'Highly rated traditional Gujarati thali with Kadhi, Sev Tameta, Ringna Bateta, and hot phulkas',
        },
        {
          restaurant: 'Chappan Bhog Prasad',
          location: 'Dwarkadhish Temple Complex',
          specialties: 'Sacred temple offerings, consecrated Mahaprasad pedas, and fresh buttermilk',
        },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Dwarka is one of the four sacred Char Dham abodes of Hinduism. Non-vegetarian food and alcohol are strictly prohibited throughout the holy town.',
      peacefulNote:
        'Sample local Kathiyawadi street specialties such as Ghughra, Batata Vada, and piping hot Masala Chai near Gomti Ghat.',
    },
    attractions: [
      {
        id: 'IN-GJ-DWK-ATT-001',
        name: 'Dwarkadhish Temple (Jagat Mandir)',
        category: 'Spiritual / Heritage: Hinduism, Char Dham Temples',
        timings: '06:00–13:00 & 17:00–21:30 (Mobile phones strictly prohibited inside)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: '/images/gujarat/dwarkadhish-jagat-mandir.jpg',
        photoCredit: 'Discover Bharat Contributor / Dwarkadhish Temple 52-Yard Dhwaja',
        summary:
          'A 5-storied limestone temple soaring 78 meters high supported by 72 exquisitely sculpted sandstone pillars, believed to be founded 2,500 years ago by Vajranabha. The temple shikhara flies the magnificent 52-yard five-color Dhwaja flag changed five times daily.',
      },
      {
        id: 'IN-GJ-DWK-ATT-002',
        name: 'Bet Dwarka',
        category: 'Spiritual / Nature: Islands, Holy Shrines',
        timings: '06:00–13:00 & 17:00–21:00 (Ferry timings vary)',
        fee: {
          domestic: 'Ferry ride ~INR 20–30 (Sudarshan Setu bridge transit free)',
          foreign: 'Ferry ride ~INR 20–30',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Bet Dwarka Island Sanctuary',
        summary:
          'An inhabited island located 30 km north of Dwarka, revered as the historic residence of Lord Krishna and Queen Rukmini. Now accessed via India\'s longest cable-stayed bridge Sudarshan Setu or traditional wooden ferries from Okha port.',
      },
      {
        id: 'IN-GJ-DWK-ATT-003',
        name: 'Nageshwar Jyotirlinga',
        category: 'Spiritual: Hinduism, Jyotirlinga Sanctuaries',
        timings: '06:00–12:30 & 17:00–21:30',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Nageshwar Jyotirlinga Colossal Shiva',
        summary:
          'One of the 12 sacred Jyotirlingas of Lord Shiva enshrined in underground sanctum vaults, recognized by a colossal 25-meter (82-foot) statue of Lord Shiva sitting in blessing posture against open Gujarat skies.',
      },
      {
        id: 'IN-GJ-DWK-GEM-001',
        name: 'Shivrajpur Beach',
        category: 'Nature / Adventure: Beaches, Blue Flag Eco-Coastlines',
        timings: '08:00–19:00',
        fee: {
          domestic: 'INR 30 (Activities extra: scuba ~INR 2,500)',
          foreign: 'INR 30',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Shivrajpur Blue Flag Beach Coastline',
        summary:
          'A world-renowned Blue Flag certified beach located 12 km north of Dwarka on the Arabian Sea. Celebrated for immaculate white sands, crystalline calm shallows, certified PADI scuba diving, and wild dolphin spotting.',
      },
      {
        id: 'IN-GJ-DWK-GEM-002',
        name: 'Rukmini Devi Temple',
        category: 'Spiritual / Heritage: Hinduism, 12th-Century Carved Shrines',
        timings: '06:00–12:00 & 13:00–21:00',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Rukmini Devi Temple Carved Mandapa',
        summary:
          'A 12th-century architectural jewel located 2 km outside Dwarka town. Built separately from Jagat Mandir due to Sage Durvasa\'s mythological curse, its exterior panels are embellished with celestial nymphs, elephants, and intricate Chaitya carvings.',
      },
    ],
  },
  {
    id: 'kutch',
    code: 'IN-GJ-CITY-KCH',
    name: 'Rann of Kutch',
    nickname: 'The White Salt Desert & Craft Frontier',
    tagline: 'Endless white salt flats, winter full-moon Rann Utsav, 5000-year-old Dholavira & Rogan mastercrafts',
    accentColor: '#C2410C',
    bgGradient: 'from-orange-50 via-amber-50/40 to-stone-50/30',
    coverImage: '/images/gujarat/rann-of-kutch-white-desert.png',
    photoCredit: 'Discover Bharat Contributor / Sunset Over the Great Rann of Kutch Salt Flats',
    flashcardBlurb:
      'The world\'s largest salt desert transforming into a vibrant canvas during the Rann Utsav, surrounded by rich handicraft villages, ancient Harappan ruins, and wild ass sanctuaries.',
    topStays: [
      { name: 'Rann Resort Dholavira', category: 'Khadir Bet — Heritage / Eco Stay near Harappan Excavations' },
      { name: 'Rann Utsav Tent City', category: 'Dhordo — Luxury Winter Glamping & Cultural Programs' },
      { name: 'Regenta Resort Bhuj', category: 'Mirzapar, Bhuj — Basecamp Comfort & Heritage Kutchi Bhunga Cottages' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Osho Dining Hall',
          location: 'Station Road, Bhuj',
          specialties: 'Iconic authentic Kutchi thali with Bajra rotla, Ringna no Olo (roasted eggplant), fresh white butter, and jaggery',
        },
        {
          restaurant: 'Tent City Dining Hall',
          location: 'Dhordo, Rann of Kutch',
          specialties: 'Traditional Kutchi and Gujarati buffets featuring Khichdi-Kadhi, Gulab Pak, and hot Puris during Rann Utsav',
        },
        {
          restaurant: 'Local Stalls for Kutchi Dabeli',
          location: 'Bhuj & Khavda',
          specialties: 'Authentic spiced potato Dabeli with pomegranate seeds, roasted spiced peanuts, and sweet-sour tamarind chutney',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Noorani Mahal',
          location: 'Bhuj Town',
          specialties: 'Mughlai chicken, mutton roasts, and tandoori naans (dining in the deeper salt desert is exclusively vegetarian)',
        },
      ],
      permitNotice:
        'Visitors to the Great Rann of Kutch must obtain an official tourist permit at the Bhirandiyara checkpost or via the online portal (kutchpermit.gujarat.gov.in) before proceeding to Dhordo and the White Desert.',
      peacefulNote:
        'Kutch is internationally renowned for artisanal dairy and sweets—do not miss sampling authentic Khavda Mesukh and freshly churned Mawa.',
    },
    attractions: [
      {
        id: 'IN-GJ-KCH-ATT-001',
        name: 'Great Rann of Kutch (White Desert)',
        category: 'Nature: Geological Formations, Salt Marshes',
        timings: '06:00–20:00 (Entry permit mandatory from Bhirandiyara checkpost or online)',
        fee: {
          domestic: 'INR 100 + Vehicle charge (~INR 50)',
          foreign: 'INR 280 + Vehicle charge (~INR 50)',
        },
        isHiddenGem: false,
        image: '/images/gujarat/rann-of-kutch-white-desert.png',
        photoCredit: 'Discover Bharat Contributor / Sunset Promenade Across the Salt Flats',
        summary:
          'A vast expanse of sparkling white salt flats stretching over 7,500 sq km into the horizon, formed by seasonal Arabian Sea inundations. It comes alive during winter full-moon nights and the annual Rann Utsav festival with folk music and camel safaris.',
      },
      {
        id: 'IN-GJ-KCH-ATT-002',
        name: 'Kalo Dungar (Black Hill)',
        category: 'Nature / Spiritual: Hills & Mountains, Highest Peak',
        timings: '06:00–18:00',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Kalo Dungar Peak & Panoramic Rann Horizon',
        summary:
          'The highest elevation in Kutch (462 m), offering unmatched 360-degree panoramic vistas where the white desert merges seamlessly into the sky. Home to the legendary 400-year-old Dattatreya Temple where wild jackals are fed consecrated prasad twice daily.',
      },
      {
        id: 'IN-GJ-KCH-ATT-003',
        name: 'Aina Mahal & Prag Mahal, Bhuj',
        category: 'Heritage / Arts: Palaces & Forts, Royal Haveli Antiquities',
        timings: '09:00–12:00 & 15:00–18:00 (Closed Thursdays)',
        fee: {
          domestic: 'INR 20–30',
          foreign: 'INR 50–100',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Prag Mahal Italian Gothic Palace, Bhuj',
        summary:
          'A royal compound housing the 18th-century Aina Mahal (Palace of Mirrors) created by navigator-architect Ramsingh Malam, and the neighboring 19th-century Italian Gothic Prag Mahal featuring grand Corinthian pillars and an iconic 45-meter clock tower.',
      },
      {
        id: 'IN-GJ-KCH-GEM-001',
        name: 'Dholavira (Harappan City)',
        category: 'Heritage: UNESCO World Heritage, Archaeological Sites',
        timings: '09:00–18:00',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Dholavira Ancient Harappan Reservoir',
        summary:
          'One of the five largest and most sophisticated Bronze Age Indus Valley Civilization settlements, situated on Khadir Bet island. Renowned for its monumental stone-cut water reservoirs, sophisticated underground storm-water drainage, and the world-famous 10-symbol Indus signboard.',
      },
      {
        id: 'IN-GJ-KCH-GEM-002',
        name: 'Nirona Handicraft Village',
        category: 'Rural / Arts: Crafts-Tourism, Live Like a Local',
        timings: '09:00–18:00',
        fee: {
          domestic: 'Free (Artisan workshops and direct purchases available)',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Discover Bharat Archive / Nirona Artisan Studio',
        summary:
          'The only place on Earth where the ancient 300-year-old Persian Rogan art (fabric painting using boiled castor oil paste and iron styluses) is preserved by the Khatri family. Visitors also explore traditional copper bell making and lacquer-coated wooden kitchenware.',
      },
    ],
  },
];
