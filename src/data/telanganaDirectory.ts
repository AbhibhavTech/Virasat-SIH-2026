export interface TelanganaStay {
  name: string;
  category: string;
}

export interface TelanganaFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface TelanganaDining {
  veg: TelanganaFoodSpot[];
  nonVeg: TelanganaFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface TelanganaAttraction {
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

export interface TelanganaCity {
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
  topStays: TelanganaStay[];
  dining: TelanganaDining;
  attractions: TelanganaAttraction[];
}

export const TELANGANA_DIRECTORY: TelanganaCity[] = [
  {
    id: 'hyderabad',
    code: 'IN-TG-CITY-HYD',
    name: 'Hyderabad',
    nickname: 'The City of Pearls & Nizami Splendour',
    tagline: '400 Years of Qutb Shahi Heritage, Diamond Forts, and World-Famous Dum Biryani',
    accentColor: '#D97706',
    bgGradient: 'from-amber-950/60 via-stone-900/40 to-slate-950/70',
    flashcardBlurb:
      '"The City of Pearls", fusing 400 years of Qutb Shahi and Asaf Jahi royal heritage with high-tech HITEC City corridors, diamond trade fortresses, and world-renowned Hyderabadi Dum Biryani.',
    coverImage: '/images/telangana/charminar.jpg',
    photoCredit: 'User Photo / Charminar & Laad Bazaar Street Scene',
    topStays: [
      { name: 'Taj Falaknuma Palace', category: 'Engine Bowli — 2,000-ft Clifftop Palace of the 6th Nizam' },
      { name: 'ITC Kohenur', category: 'HITEC City — Luxury Overlooking Durgam Cheruvu Lake' },
      { name: 'Park Hyatt Hyderabad', category: 'Banjara Hills — Contemporary Architectural Luxury' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Chutneys',
          location: 'Banjara Hills / Himayatnagar',
          specialties: 'Steaming Guntur Idli, crisp Babai Hotel Dosa, and six signature assorted house chutneys',
        },
        {
          restaurant: 'Tatva',
          location: 'Jubilee Hills',
          specialties: 'Global vegetarian fine dining, Mediterranean platters, and truffle mushroom risotto',
        },
        {
          restaurant: 'Govind Dosa',
          location: 'Near Charminar, Old City',
          specialties: 'Tawa-roasted butter butter dosas, cheese tawa idli, and spicy podi toppings served at dawn',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Paradise Food Court',
          location: 'Secunderabad',
          specialties: 'Classic Hyderabadi Mutton Dum Biryani cooked with fragrant aged basmati and saffron',
        },
        {
          restaurant: 'Shadab Hotel',
          location: 'Ghansi Bazaar, Near High Court',
          specialties: 'Authentic Hyderabadi Mutton Biryani, slow-cooked Haleem, morning Nihari with kulcha, and spiced Bheja Fry',
        },
        {
          restaurant: 'Shah Ghouse',
          location: 'Tolichowki',
          specialties: 'Late-night spicy Biryani, charcoal Mutton Boti Kebab, and seasonal Ramzan slow-cooked Haleem',
        },
        {
          restaurant: 'Jewel of Nizam at The Golkonda Hotel',
          location: 'Masab Tank',
          specialties: 'Regal Kacchi Dum Biryani, Shikampur kebabs, and signature Anokhi Kheer made of onions',
        },
      ],
      peacefulNote:
        'Hyderabad is a gastronomic empire celebrated for dum cooking: basmati sealed with dough over simmering charcoal coals, Osmania biscuits dipped in Irani chai, and saffron-sweet Qubani ka Meetha.',
    },
    attractions: [
      {
        id: 'IN-TG-HYD-ATT-001',
        name: 'Charminar & Laad Bazaar',
        category: 'Heritage / Arts · Historical Buildings, 1591 Cego-Islamic Architecture, Lacquer & Stone Bangles (Laad)',
        timings: '09:30–17:30 (Bazaars vibrant until 22:30)',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: '/images/telangana/charminar.jpg',
        photoCredit: 'User Photo / Charminar Four Minarets View',
        summary:
          'Erected in 1591 by Muhammad Quli Qutb Shah to commemorate the eradication of plague. Its four 48.7-metre ornamental minarets overlook the bustling medieval arcades of Laad Bazaar, renowned across the Orient for handcrafted lacquer stone-studded bangles, natural pearls, and attar perfumes.',
      },
      {
        id: 'IN-TG-HYD-ATT-002',
        name: 'Golconda Fort',
        category: 'Heritage · UNESCO Tentative, Palaces & Forts, Acoustic Engineering Marvel, Diamond Vaults',
        timings: '08:00–17:30 (Sound & Light Show: 18:30 English / 19:45 Hindi/Telugu)',
        fee: { domestic: 'INR 25 (Sound & Light: INR 140)', foreign: 'INR 300 (Sound & Light: INR 140)' },
        isHiddenGem: false,
        image: '/images/telangana/golconda-fort.jpg',
        photoCredit: 'User Photo / Golconda Fort Royal Palaces & Courtyards',
        summary:
          'Monumental 16th-century granite fortress perched atop a 400-foot knoll. World-famed for its acoustic wizardry—a handclap beneath Fateh Darwaza portico is audible at the Bala Hissar pavilion a kilometer away—and its fortified vaults that once safeguarded the Koh-i-Noor, Hope, and Daria-i-Noor diamonds.',
      },
      {
        id: 'IN-TG-HYD-ATT-003',
        name: 'Qutb Shahi Tombs & Stepwells (Ibrahim Bagh)',
        category: 'Heritage · Historical Sites, Domed Necropolis of Seven Sultans, Aga Khan Trust Restored Baolis',
        timings: '09:30–18:30 (Closed Fridays for worship)',
        fee: { domestic: 'INR 40', foreign: 'INR 150' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Qutb_Shahi_Tombs_Hyderabad.jpg/1280px-Qutb_Shahi_Tombs_Hyderabad.jpg',
        photoCredit: 'Wikimedia Commons / Qutb Shahi Tombs Complex',
        summary:
          'Magnificent domed necropolis in Ibrahim Bagh comprising the mausoleums of seven Qutb Shahi rulers. Blends Persian, Pashtun, and Hindu architectural elements, newly conserved alongside five historic stepped wells (baolis) by the Aga Khan Trust for Culture.',
      },
      {
        id: 'IN-TG-HYD-ATT-004',
        name: 'Salar Jung Museum',
        category: "Arts / Heritage · Museums, One of the World's Largest One-Man Collections (Veiled Rebecca, Musical Clock)",
        timings: '10:00–17:00 (Closed Fridays)',
        fee: { domestic: 'INR 50', foreign: 'INR 500' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Salar_Jung_Museum_Building.jpg/1280px-Salar_Jung_Museum_Building.jpg',
        photoCredit: 'Wikimedia Commons / Salar Jung Museum',
        summary:
          'National museum on the southern banks of the Musi River housing over 40,000 priceless artifacts amassed by Nawab Mir Yousuf Ali Khan (Salar Jung III). Highlights include GB Benzoni\'s translucent marble sculpture "Veiled Rebecca", the 19th-century British musical bracket clock, and Tipu Sultan\'s ivory wardrobe.',
      },
      {
        id: 'IN-TG-HYD-GEM-001',
        name: 'Paigah Tombs, Santosh Nagar',
        category: 'Heritage / Arts · Historical Buildings, Intricate Lime-Mortar Stucco Geometries, Marble Inlay & Asaf Jahi Synthesis',
        timings: '10:00–17:00 (Closed Fridays)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Paigah_Tombs_Hyderabad.jpg/1280px-Paigah_Tombs_Hyderabad.jpg',
        photoCredit: 'Wikimedia Commons / Paigah Tombs Stucco Work',
        summary:
          'Quiet aristocratic necropolis of the noble Paigah family, fierce loyalists and kinsmen of the Nizams. Built in lime-and-sand mortar, the tombs display mesmerizing, lace-like geometric stucco carvings, carved teakwood doors, and marble inlays fusing Mughal, Persian, and European styles.',
      },
      {
        id: 'IN-TG-HYD-GEM-002',
        name: 'Spanish Mosque (Masjid Iqbal Ud Daula), Begumpet',
        category: 'Spiritual / Heritage · Islam, Unique Moorish-Gothic Architecture Modeled after the Cathedral-Mosque of Córdoba',
        timings: '05:00–21:00 (Accessible outside prayer hours)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Spanish_Mosque_Begumpet_Hyderabad.jpg/1280px-Spanish_Mosque_Begumpet_Hyderabad.jpg',
        photoCredit: 'Wikimedia Commons / Spanish Mosque Begumpet',
        summary:
          'Commissioned in 1906 by Paigah Nawab Sir Vicar-ul-Umra after his travels through southern Spain. Resembling the Cathedral-Mosque of Córdoba with pointed Gothic spires, horseshoe Islamic arches, and Romanesque turrets, it is India\'s only mosque built in the Moorish architectural style.',
      },
    ],
  },
  {
    id: 'warangal',
    code: 'IN-TG-CITY-WGL',
    name: 'Warangal & Hanamkonda',
    nickname: 'The Medieval Citadel of the Kakatiyas',
    tagline: 'Monolithic Granite Gateway Arches, Star-Shaped Sanctuaries, and Rudrama Devi Forts',
    accentColor: '#B45309',
    bgGradient: 'from-amber-950/60 via-red-950/40 to-slate-950/70',
    flashcardBlurb:
      'The medieval capital of the Kakatiya Dynasty, celebrated for monolithic granite gateway arches, star-shaped temples, and Queen Rudrama Devi\'s historic moated fortifications.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Warangal_Fort_Kakatiya_Kala_Thoranam.jpg/1280px-Warangal_Fort_Kakatiya_Kala_Thoranam.jpg',
    photoCredit: 'Wikimedia Commons / Kakatiya Kala Thoranam Arch',
    topStays: [
      { name: 'Haritha Kakatiya Hotel', category: 'Hanamkonda — TG Tourism Star Comfort with Garden Dining' },
      { name: 'Hotel Grand Gayatri', category: 'Kazipet / Nayeem Nagar — Premium Corporate Comfort' },
      { name: 'City Grand Hotel', category: 'Subedari — Central Location & Modern Amenities' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Geetha Bhavan',
          location: 'Hanamkonda',
          specialties: 'Traditional Telangana breakfast, crispy Sarva Pindi (spiced rice-flour pancake), and hot Pesarattu with ginger pachadi',
        },
        {
          restaurant: 'Subhapradha Veg Restaurant',
          location: 'Nayeem Nagar',
          specialties: 'Authentic South Indian thali, Pappu Charu, Bagara Baingan, and house-churned curd',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Kakatiya Military Hotel',
          location: 'Warangal Town',
          specialties: 'Spicy Telangana Mutton Curry, Natu Kodi Pulao (country chicken), and Tala Kura',
        },
        {
          restaurant: 'Palamuru Grill',
          location: 'Hanamkonda',
          specialties: 'Potlam Biryani (spiced meat encased in an omelette), Telangana dry roasted chicken, and Rayalaseema ragi mudda',
        },
      ],
      peacefulNote:
        'Warangal’s culinary heritage is defined by fierce Telangana flavors: fiery crushed red chillies, Bagara rice paired with Dalcha, and crispy village Sarva Pindi baked in cast-iron skillets.',
    },
    attractions: [
      {
        id: 'IN-TG-WGL-ATT-001',
        name: 'Thousand Pillar Temple (Rudreswara Swamy), Hanamkonda',
        category: 'Heritage / Spiritual · Hinduism, 1163 AD Star-Shaped Trikuta Architecture, Monolithic Polished Black Basalt Nandi',
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Thousand_Pillar_Temple_Hanamkonda.jpg/1280px-Thousand_Pillar_Temple_Hanamkonda.jpg',
        photoCredit: 'Wikimedia Commons / Thousand Pillar Temple',
        summary:
          'Commissioned in 1163 AD by King Rudra Deva. Constructed in the star-shaped Trikuta architectural plan dedicated to Shiva, Vishnu, and Surya. Supported by tightly clustered, exquisitely carved basalt pillars that never obstruct sightlines to the inner sanctum, guarded by a monolithic, polished black basalt Nandi bull.',
      },
      {
        id: 'IN-TG-WGL-ATT-002',
        name: 'Warangal Fort & Kakatiya Kala Thoranam',
        category: 'Heritage · Archeological Sites, Palaces & Forts, Emblem of Telangana State, 4 Massive Ornamental Stone Archways',
        timings: '09:00–18:00 (Laser Light & Sound Show: 19:00 Telugu / 20:00 English)',
        fee: { domestic: 'INR 25 (Light Show: INR 40–80)', foreign: 'INR 300 (Light Show: INR 80)' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Warangal_Fort_Kakatiya_Kala_Thoranam.jpg/1280px-Warangal_Fort_Kakatiya_Kala_Thoranam.jpg',
        photoCredit: 'Wikimedia Commons / Warangal Fort Gateways',
        summary:
          '13th-century capital citadel of King Ganapatideva and his warrior daughter Queen Rudrama Devi. Features concentric earthen and stone fortifications and four monumental freestanding granite ornamental gateway arches (Kakatiya Kala Thoranam), which now constitute the official emblem of Telangana State.',
      },
      {
        id: 'IN-TG-WGL-ATT-003',
        name: 'Bhadrakali Temple & Lake Promenade',
        category: 'Spiritual / Nature · Hinduism, 7th-Century Chalukya/Kakatiya Goddess Shrine, Bund Walkway',
        timings: '05:30–13:00 & 15:00–20:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bhadrakali_Temple_Warangal.jpg/1280px-Bhadrakali_Temple_Warangal.jpg',
        photoCredit: 'Wikimedia Commons / Bhadrakali Temple & Lake',
        summary:
          'Ancient lakefront sanctuary dating back to 625 AD under the Chalukyas, extensively patronized by Kakatiya kings who invoked the blessing of Mother Bhadrakali before military conquests. Houses a 2.7-metre stone idol of Goddess Bhadrakali with eight arms holding weapons, overlooking a serene lake bund with illuminated walkways.',
      },
      {
        id: 'IN-TG-WGL-GEM-001',
        name: 'Khush Mahal, Warangal Fort',
        category: 'Heritage · Historical Buildings, 14th-Century Tughlaq-era Sloping Stone Audience Pavilion inside Fort Precinct',
        timings: '09:00–18:00',
        fee: { domestic: 'Covered under Warangal Fort ticket', foreign: 'Covered under Fort ticket' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Khush_Mahal_Warangal_Fort.jpg/1280px-Khush_Mahal_Warangal_Fort.jpg',
        photoCredit: 'Wikimedia Commons / Khush Mahal Warangal',
        summary:
          'Imposing sloping-walled stone audience hall constructed in the 14th century following the Delhi Sultanate conquest of Warangal. Built over the site of a Kakatiya palace, this austere Indo-Islamic pavilion retains its soaring arched vaults and today shelters recovered Kakatiya sculptures and inscribed stone plaques.',
      },
      {
        id: 'IN-TG-WGL-GEM-002',
        name: 'Pakhal Lake & Wildlife Sanctuary',
        category: 'Nature / Rural · Rivers & Lakes, Eco-Tourism, 1213 AD Man-Made Kakatiya Reservoir set inside Nallamalla Deciduous Forest',
        timings: '06:00–18:00 (50 km from Warangal)',
        fee: { domestic: 'INR 20–30 (Boating extra)', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Pakhal_Lake_Telangana.jpg/1280px-Pakhal_Lake_Telangana.jpg',
        photoCredit: 'Wikimedia Commons / Pakhal Lake Reservoir',
        summary:
          'Constructed in 1213 AD by Kakatiya ruler Ganapatideva by damming a tributary of the Krishna River. The vast 30-sq-km freshwater lake is cradled by deciduous teak and bamboo jungles of the Pakhal Wildlife Sanctuary, harboring leopards, sambars, nilgai, and marsh crocodiles.',
      },
    ],
  },
  {
    id: 'ramappa',
    code: 'IN-TG-CITY-RMP',
    name: 'Ramappa / Palampet',
    nickname: 'UNESCO Masterpiece of Floating Bricks',
    tagline: '800-Year-Old Seismic Sandbox Foundations and Sculpted Dolerite Madanikas',
    accentColor: '#059669',
    bgGradient: 'from-emerald-950/60 via-stone-900/40 to-slate-950/70',
    flashcardBlurb:
      'A rural jewel in Mulugu district holding Telangana\'s first UNESCO World Heritage Site—an 800-year-old temple engineered with floating bricks and sandbox earthquake foundations.',
    coverImage: '/images/telangana/ramappa-temple.png',
    photoCredit: 'User Photo / Kakatiya Rudreshwara Ramappa Temple',
    topStays: [
      { name: 'Haritha Lake View Resort, Ramappa', category: 'Lakeside TG Tourism Cottages with Water Views' },
      { name: 'Heritage Homestays in Palampet', category: 'Village Farm Stays with Traditional Courtyards' },
      { name: 'Haritha Hotel Mulugu', category: 'Highway Comfort Base on Warangal-Ramappa Road' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Haritha Restaurant at Ramappa Resort',
          location: 'Palampet',
          specialties: 'Homestyle Andhra & Telangana meals, Pappu Charu (tangy lentil soup), Gutti Vankaya (stuffed brinjal curry), and fresh curd rice',
        },
        {
          restaurant: 'Local Palampet Village Dhabas',
          location: 'Palampet Main Road',
          specialties: 'Jowar Rotte (sorghum flatbreads) paired with spiced tomato-onion chutney, gongura pickle, and fresh butter',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Village Dhaba Canteens',
          location: 'Near Ramappa Lake',
          specialties: 'Fiery Natu Kodi Kura (country chicken curry) served with steaming hot rice, and pan-fried fresh pond fish',
        },
      ],
      peacefulNote:
        'Dining around Palampet is an authentic rural immersion: warm jowar rotis pressed by village women over wood stoves, aromatic Gongura leaves, and fresh lake fish cooked with crushed green chillies.',
    },
    attractions: [
      {
        id: 'IN-TG-RMP-ATT-001',
        name: 'Kakatiya Rudreshwara (Ramappa) Temple',
        category: 'Heritage / Spiritual · UNESCO World Heritage, Lightweight "Floating Bricks", Carved Dolerite Madanikas, Sandbox Technique',
        timings: '06:00–18:00',
        fee: { domestic: 'Free general entry', foreign: 'Free general entry' },
        isHiddenGem: false,
        image: '/images/telangana/ramappa-temple.png',
        photoCredit: 'User Photo / Ramappa Temple Stepped Vimana & Pillars',
        summary:
          'Telangana\'s first UNESCO World Heritage Site, consecrated in 1213 AD by General Recharla Rudra during the reign of Kakatiya ruler Ganapati Deva. Named after its chief sculptor Ramappa. Its pyramidal tower was constructed using porous "floating bricks" so light they float on water, resting atop an anti-seismic sandbox foundation that has preserved the structure across eight centuries.',
      },
      {
        id: 'IN-TG-RMP-ATT-002',
        name: 'Ramappa Lake & Boating',
        category: 'Nature / Adventure · Rivers & Lakes, Massive 13th-Century Irrigation Engineering Reservoir, Speedboating & Kayaking',
        timings: '08:30–17:30',
        fee: { domestic: 'Free lakeside access (Speedboat: INR 350–500 per trip)', foreign: 'Free lakeside access' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ramappa_Lake_Telangana.jpg/1280px-Ramappa_Lake_Telangana.jpg',
        photoCredit: 'Wikimedia Commons / Ramappa Lake Basin',
        summary:
          'Constructed concurrently with the Ramappa temple in the 13th century, this immense irrigation engineering reservoir spans over 82 sq km. Enclosed by low forested hills and paddy fields, it offers TG Tourism motorized speedboating, pedal-boating, and serene shoreline picnic walks.',
      },
      {
        id: 'IN-TG-RMP-GEM-001',
        name: 'Kameshwaralaya Temple Ruins',
        category: 'Heritage · Archeological Sites, Subsidiary Kakatiya Shiva Shrine located 200m from Ramappa under conservation',
        timings: '07:00–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Kameshwaralaya_Temple_Ramappa.jpg/1280px-Kameshwaralaya_Temple_Ramappa.jpg',
        photoCredit: 'Wikimedia Commons / Kameshwaralaya Temple Ruins',
        summary:
          'Located just 200 metres north of the main Ramappa sanctum. Built in the same era as a sister shrine, this ornate Shiva temple underwent seismic damage in historical earthquakes and is now undergoing scientific restoration by the Archaeological Survey of India (ASI).',
      },
      {
        id: 'IN-TG-RMP-GEM-002',
        name: 'Pandavula Gutta (Prehistoric Rock Art)',
        category: 'Heritage / Adventure · Archeological Sites, Hiking & Trekking, Paleolithic Cave Paintings & Sandstone Formations',
        timings: '07:00–17:00 (Located 30 km from Ramappa in Regonda)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Pandavula_Gutta_Rock_Art.jpg/1280px-Pandavula_Gutta_Rock_Art.jpg',
        photoCredit: 'Wikimedia Commons / Pandavula Gutta Rock Formations',
        summary:
          'Ancient archaeological hillock older than the Himalayan ranges, bearing Mesolithic to medieval rock art. The natural sandstone rock shelters feature ochre paintings of wild animals, weapons, Swastikas, and astronomical symbols, alongside challenging bouldering trails.',
      },
      {
        id: 'IN-TG-RMP-GEM-003',
        name: 'Laknavaram Lake & Suspension Bridges',
        category: 'Nature / Adventure · Rivers & Lakes, 10,000-Acre Forest Reservoir with 13 Islands connected by Hanging Cable Bridges',
        timings: '08:00–17:30 (Located 25 km from Ramappa)',
        fee: { domestic: 'Lake Entry: INR 30–50 | Speedboat Island Transfer: INR 100–300', foreign: 'Entry: INR 50' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Laknavaram_Lake_Suspension_Bridge.jpg/1280px-Laknavaram_Lake_Suspension_Bridge.jpg',
        photoCredit: 'Wikimedia Commons / Laknavaram Hanging Bridge',
        summary:
          'Vast 10,000-acre reservoir created by Kakatiya engineers tucked inside dense Govindaraopet forests. Features 13 picturesque verdant islands connected by a 160-metre yellow hanging cable suspension bridge, with island cottages and speedboat transfers.',
      },
    ],
  },
  {
    id: 'nagarjuna-sagar',
    code: 'IN-TG-CITY-NGS',
    name: 'Nagarjuna Sagar & Nalgonda',
    nickname: 'Colossus of the Krishna & Mahayana Island Citadel',
    tagline: 'World\'s Largest Masonry Dam, Relocated 3rd-Century Buddhist Stupas, and Waterfalls',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-950/60 via-teal-950/40 to-slate-950/70',
    flashcardBlurb:
      'An engineering and ancient heritage confluence along the Krishna River, home to one of the world\'s largest masonry dams and the island museum of Nagarjunakonda.',
    coverImage: '/images/telangana/nagarjuna-sagar.jpg',
    photoCredit: 'User Photo / Nagarjuna Sagar Dam Crest Gates in Full Spurt',
    topStays: [
      { name: 'Haritha Vijay Vihar', category: 'Nagarjuna Sagar — TG Tourism Resort with Panoramic Reservoir Vistas' },
      { name: 'Royal Palace Hotel', category: 'Macherla Road — Contemporary Comfort & Family Suites' },
      { name: 'Haritha Hill Colony Cottages', category: 'Hillside Forest Retreat overlooking the River Krishna Basin' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Vijay Vihar Restaurant',
          location: 'Reservoir View Terrace',
          specialties: 'Crispy dosas, hot filter coffee, traditional Andhra & Telangana vegetarian thali, Sambar, and Rasam',
        },
        {
          restaurant: 'Highway Annapurna Dhabas',
          location: 'Hyderabad-Nagarjuna Sagar Highway',
          specialties: 'Fluffy pooris with potato masala, steamed curd rice, and Andhra tomato pickle',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Krishna River Fish Stalls near Launch Station',
          location: 'Launch Jetty',
          specialties: 'Freshly netted Krishna River Catla and Rohu fish fry with lemon and green chillies, and tangy prawn curry',
        },
        {
          restaurant: 'Vijay Vihar Dining',
          location: 'Nagarjuna Sagar',
          specialties: 'Spicy Andhra style chicken curry, Mutton Sukka, and Gongura chicken with steamed rice',
        },
      ],
      peacefulNote:
        'Riverfront stalls near the boat jetty serve freshly catch-of-the-day Krishna fish, pan-seared with turmeric, red chilli paste, and curry leaves right before your eyes.',
    },
    attractions: [
      {
        id: 'IN-TG-NGS-ATT-001',
        name: 'Nagarjuna Sagar Dam & Crest Gates',
        category: 'Nature / Heritage · Engineering Marvels, 124-Metre-High Masonry Dam, 26 Massive Spillway Crest Gates across River Krishna',
        timings: 'Viewpoint open 08:00–18:00 (Water release spectacular July–October)',
        fee: { domestic: 'Free viewpoint access / Nominal vehicle toll', foreign: 'Free viewpoint access' },
        isHiddenGem: false,
        image: '/images/telangana/nagarjuna-sagar.jpg',
        photoCredit: 'User Photo / Nagarjuna Sagar Dam 26 Crest Gates',
        summary:
          'Constructed between 1955 and 1967 across the River Krishna, this is the world\'s tallest and largest masonry dam, standing 124 metres tall and spanning 1.5 km with 26 massive radial spillway crest gates. When opened during the monsoon, the discharging waters create a thunderous white curtain of spray.',
      },
      {
        id: 'IN-TG-NGS-ATT-002',
        name: 'Nagarjunakonda Island & Archaeological Museum',
        category: 'Heritage / Spiritual · Buddhism, Archeological Sites, Relocated 3rd-Century Mahayana Buddhist Stupas on an Island',
        timings: 'Museum: 09:00–16:00 (Closed Fridays); Ferry boat operations: 09:30–15:30',
        fee: { domestic: 'Museum Entry: INR 20–30 | Return Ferry: ~INR 150–200 per adult', foreign: 'Museum: INR 100 | Ferry: ~INR 200' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Nagarjunakonda_Island_Museum.jpg/1280px-Nagarjunakonda_Island_Museum.jpg',
        photoCredit: 'Wikimedia Commons / Nagarjunakonda Island Museum',
        summary:
          'One of the world\'s greatest salvage archaeology projects. Before the valley was flooded by the dam, extensive 3rd-century Buddhist universities, stupas, monasteries, and Roman coin relic caskets of the Ikshvaku dynasty were meticulously relocated stone-by-stone onto a high hilltop that is now an island accessible via a 45-minute scenic ferry boat ride.',
      },
      {
        id: 'IN-TG-NGS-ATT-003',
        name: 'Anupu Buddhist Reconstruction Site',
        category: 'Heritage · Historical Sites, Faithfully Reconstructed Ancient Mahavihara, Monastic University & Amphitheatre',
        timings: '09:00–17:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Anupu_Buddhist_Site.jpg/1280px-Anupu_Buddhist_Site.jpg',
        photoCredit: 'Wikimedia Commons / Anupu Ancient Buddhist Amphitheatre',
        summary:
          'Located on the mainland eastern bank of the reservoir 4 km from the dam. Here, ASI reconstructed a complete 3rd-century Buddhist monastic university, including a tiered open-air Greco-Roman influenced stone amphitheatre, vihara living cells, and apsidal chaitya halls.',
      },
      {
        id: 'IN-TG-NGS-ATT-004',
        name: 'Ethipothala Waterfalls',
        category: 'Nature / Rural · Rivers & Lakes, 70-Foot Cascading Mountain Stream, Crocodile Breeding Lagoon',
        timings: '06:30–21:00 (Illuminated with colorful lighting after dark; 11 km from Dam)',
        fee: { domestic: 'INR 20', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Ethipothala_Falls.jpg/1280px-Ethipothala_Falls.jpg',
        photoCredit: 'Wikimedia Commons / Ethipothala Waterfalls Lagoon',
        summary:
          'Spectacular 70-foot waterfall formed by three mountain streams—Chandravanka Vagu, Nakkala Vagu, and Tummala Vagu—tumbling over stepped limestone crags into a tranquil green lagoon that serves as a state-protected crocodile breeding sanctuary.',
      },
      {
        id: 'IN-TG-NGS-GEM-001',
        name: 'Deverakonda Fort',
        category: 'Heritage / Adventure · Palaces & Forts, Hiking & Trekking, Rugged 14th-Century Hilltop Citadel of Padma Nayaka Kings',
        timings: '08:00–17:30 (Located in Nalgonda district, 60 km from Dam)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Deverakonda_Fort_Hilltop.jpg/1280px-Deverakonda_Fort_Hilltop.jpg',
        photoCredit: 'Wikimedia Commons / Deverakonda Fort Bastions',
        summary:
          'Dramatic 14th-century hill citadel built by the Recherla Padma Nayaka kings across seven rugged granite hills. Known as an impregnable fortress in medieval Deccan warfare, it retains multi-tiered stone bastions, secret escape tunnels, granaries, and water cisterns reached via a rewarding trekking trail.',
      },
    ],
  },
];
