export interface UttarPradeshStay {
  name: string;
  category: string;
}

export interface UttarPradeshFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface UttarPradeshDining {
  veg: UttarPradeshFoodSpot[];
  nonVeg: UttarPradeshFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface UttarPradeshAttraction {
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

export interface UttarPradeshCity {
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
  topStays: UttarPradeshStay[];
  dining: UttarPradeshDining;
  attractions: UttarPradeshAttraction[];
}

export const UTTAR_PRADESH_DIRECTORY: UttarPradeshCity[] = [
  {
    id: 'varanasi',
    code: 'IN-UP-CITY-VNS',
    name: 'Varanasi / Kashi',
    nickname: 'The Eternal City of Light & Moksha',
    tagline: '84 stone ghats, sacred Kashi Vishwanath corridor & Subah-e-Banaras dawn ragas',
    accentColor: '#EA580C',
    bgGradient: 'from-orange-50 via-amber-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Varanasi_Ghats_Ganga.jpg/1280px-Varanasi_Ghats_Ganga.jpg',
    photoCredit: 'Wikimedia Commons / Varanasi Ghats',
    flashcardBlurb:
      'One of the oldest continuously inhabited cities on Earth, where death, moksha, Vedic chants, and evening Ganga Aarti unfold along 84 sacred stone ghats.',
    topStays: [
      { name: 'BrijRama Palace', category: 'Darbhanga Ghat — Luxury Heritage Palace accessed by private boat' },
      { name: 'Taj Ganges', category: 'Nadesar Palace Grounds — Luxury Estate' },
      { name: 'Suryauday Haveli', category: 'Shivala Ghat — Heritage Riverfront Haveli' },
    ],
    dining: {
      veg: [
        { restaurant: 'Kashi Chaat Bhandar', location: 'Godowlia', specialties: 'Legendary Tamatar Chaat, crispy Palak Patta Chaat, Dahi Puri & warm Gulab Jamuns' },
        { restaurant: 'Ram Bhandar', location: 'Thatheri Bazaar', specialties: 'Crispy Poori Chhole served with hot syrupy Jalebis at dawn' },
        { restaurant: 'Blue Lassi Shop', location: 'Manikarnika Gali', specialties: 'Artisanal hand-churned thick curd lassi topped with fresh seasonal pomegranate, mango & malai rabdi' },
      ],
      nonVeg: [
        { restaurant: 'Aadha-Aadha', location: 'Cantonment', specialties: 'Slow-cooked Awadhi mutton, Mughlai korma & clay-oven tandoori platters' },
        { restaurant: 'Cantonment Dhabas', location: 'Varanasi Cantt', specialties: 'Spiced homestyle Mutton Curry, Chicken Biryani & hot butter tandoori rotis' },
      ],
      pilgrimageNotice: 'Sacred Ghats Rule: Ancient city lanes surrounding Kashi Vishwanath Temple and the 84 Ganga ghats are strictly vegetarian. Non-vegetarian cuisine is served exclusively outside the sacred religious perimeter in Cantonment.',
      peacefulNote: 'Kashi\'s culinary soul thrives on fragrant Banarasi Paan, morning Poori-Jalebi, frothy saffron winter Malaiyo, and earthen kulhad lassi.',
    },
    attractions: [
      {
        id: 'IN-UP-VNS-ATT-001',
        name: 'Kashi Vishwanath Temple & Corridor',
        category: 'Spiritual · Hinduism, Jyotirlinga, Sacred Ganga Concourse',
        timings: '02:30–23:00 (Darshan breaks around afternoon Bhog 11:15–12:20)',
        fee: { domestic: 'Free general darshan (Sugam Darshan VIP: INR 300; Aarti passes: INR 500–1,000)', foreign: 'Free general darshan (Sugam Darshan VIP: INR 300; Aarti passes: INR 500–1,000)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Kashi_Vishwanath_Temple_Varanasi.jpg/1280px-Kashi_Vishwanath_Temple_Varanasi.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'One of the twelve sacred Jyotirlingas dedicated to Lord Shiva, dramatically expanded with a 50,000-sq-meter red sandstone corridor directly connecting the holy temple spire to the steps of the Ganga River.',
      },
      {
        id: 'IN-UP-VNS-ATT-002',
        name: 'Dashashwamedh Ghat & Evening Maha Aarti',
        category: 'Spiritual / Arts · Living Rituals, Brass Lamp Synchronized Aarti',
        timings: '18:30–20:00 (Starts dusk around 19:00 in summer, 18:00 in winter)',
        fee: { domestic: 'Free (Rowboats / Bajra seats cost INR 200–500 per seat)', foreign: 'Free (Rowboats / Bajra seats cost INR 200–500 per seat)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Ganga_Aarti_Dashashwamedh_Ghat.jpg/1280px-Ganga_Aarti_Dashashwamedh_Ghat.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The most vibrant and spiritually charged ghat on the Ganga, celebrated for the world-famous evening Ganga Aarti performed with multi-tiered flaming brass lamps, conch shells, and synchronized Vedic hymns.',
      },
      {
        id: 'IN-UP-VNS-ATT-003',
        name: 'Sarnath Archaeological Deer Park & Dhamek Stupa',
        category: 'Heritage / Spiritual · Buddhism, UNESCO Tentative, Ashoka Lion Capital (First Sermon Site)',
        timings: 'Sunrise to Sunset (06:00–18:00)',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Dhamekh_Stupa_Sarnath.jpg/1280px-Dhamekh_Stupa_Sarnath.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Sacred deer park where Gautama Buddha delivered his first sermon (Dhammacakkappavattana Sutta) after attaining enlightenment; site of the 43.6-meter Dhamek Stupa and the original Ashoka Lion Capital.',
      },
      {
        id: 'IN-UP-VNS-GEM-001',
        name: 'Chunar Fort & Sandstone Quarries',
        category: 'Heritage · Palaces & Forts, Historical Sites (40 km upstream on Ganga, dating to Vikramaditya)',
        timings: '09:00–17:00',
        fee: { domestic: 'Free / Nominal ASI pass', foreign: 'Free / Nominal ASI pass' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Chunar_Fort_Mirzapur.jpg/1280px-Chunar_Fort_Mirzapur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Ancient cliffside river fortress 40 km upstream on the Ganga dating back to King Vikramaditya, Sher Shah Suri, and Warren Hastings, source of the famed buff-coloured sandstone used in Ashokan pillars.',
      },
      {
        id: 'IN-UP-VNS-GEM-002',
        name: 'Subah-e-Banaras at Assi Ghat',
        category: 'Spiritual / Wellness · Meditation, Classical Raga Dawn Recitals & Sunrise Yoga',
        timings: '05:00–07:00 (Year-round every morning)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Assi_Ghat_Sunrise_Varanasi.jpg/1280px-Assi_Ghat_Sunrise_Varanasi.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A serene spiritual dawn program at Assi Ghat beginning before sunrise with Vedic havan, musical classical Indian raga renditions, and guided mass yogic meditation on the riverfront steps.',
      },
    ],
  },
  {
    id: 'agra',
    code: 'IN-UP-CITY-AGR',
    name: 'Agra',
    nickname: 'Imperial City of the Taj & Mughal Splendour',
    tagline: 'Pietra dura marble mausoleums, Yamuna riverfront bastions & Agra petha legacy',
    accentColor: '#C2410C',
    bgGradient: 'from-stone-50 via-orange-50/30 to-amber-50/20',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/1280px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
    photoCredit: 'Wikimedia Commons / Taj Mahal',
    flashcardBlurb:
      'The imperial seat of the Mughal Empire at its zenith, framed by the Yamuna River, white-marble mausoleums, red sandstone ramparts, and petha confectionery traditions.',
    topStays: [
      { name: 'The Oberoi Amarvilas', category: 'Taj East Gate Road — Luxury Suites with direct Taj views' },
      { name: 'ITC Mughal', category: 'Fatehabad Road — Mughal-inspired Luxury Estate' },
      { name: 'Courtyard by Marriott Agra', category: 'Fatehabad Road — Premium Hospitality' },
    ],
    dining: {
      veg: [
        { restaurant: 'Panchhi Petha Store', location: 'Sadar Bazaar / Hari Parbat', specialties: 'Authentic translucent Angoori, Kesar, Paan, and Sandalwood Petha confectionery' },
        { restaurant: 'Dasaprakash', location: 'Sadar Bazaar', specialties: 'Crispy Ghee Roast dosas, South Indian tiffins & wholesome vegetarian thalis' },
      ],
      nonVeg: [
        { restaurant: 'Peshawri at ITC Mughal', location: 'Fatehabad Road', specialties: 'Legendary slow-cooked Dal Bukhara, Murgh Malai Kebab & tender Sikandari Raan roasted in clay ovens' },
        { restaurant: 'Pinch of Spice', location: 'Wazirpura Road / Fatehabad Road', specialties: 'Rich Handi Gosht, Mughlai chicken curries, aromatic gravies & freshly baked garlic naan' },
      ],
      peacefulNote: 'Agra\'s confectionery heritage is crowned by the 350-year-old Petha recipe prepared from ash gourd, paired with crisp Bedmi Poori and spicy Aloo Sabzi for breakfast.',
    },
    attractions: [
      {
        id: 'IN-UP-AGR-ATT-001',
        name: 'The Taj Mahal',
        category: 'Heritage · UNESCO World Heritage, Monuments, Mughal Masterpiece',
        timings: '30 minutes before sunrise to 30 minutes before sunset (Closed every Friday)',
        fee: { domestic: 'INR 50 + INR 200 for Main Mausoleum interior', foreign: 'INR 1,100 + INR 200 for Main Mausoleum interior' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/1280px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '17th-century ivory-white marble mausoleum on the south bank of the Yamuna commissioned by Emperor Shah Jahan for Mumtaz Mahal; celebrated globally as the jewel of Indo-Islamic architecture.',
      },
      {
        id: 'IN-UP-AGR-ATT-002',
        name: 'Agra Fort',
        category: 'Heritage · UNESCO World Heritage, Palaces & Forts (Sheesh Mahal, Diwan-i-Khas, Jahangiri Mahal)',
        timings: '06:00–18:00 (Open all 7 days)',
        fee: { domestic: 'INR 50', foreign: 'INR 650' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Agra_Fort_Amar_Singh_Gate.jpg/1280px-Agra_Fort_Amar_Singh_Gate.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Monumental 94-acre red sandstone fortress palace overlooking the Yamuna River, containing Jahangiri Mahal, Diwan-i-Khas, Sheesh Mahal, and the Musamman Burj where Shah Jahan was imprisoned.',
      },
      {
        id: 'IN-UP-AGR-ATT-003',
        name: 'Fatehpur Sikri & Buland Darwaza',
        category: 'Heritage / Spiritual · UNESCO World Heritage, Historical Sites, Salim Chishti Dargah',
        timings: 'Sunrise to Sunset (06:00–18:00)',
        fee: { domestic: 'INR 50', foreign: 'INR 610' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Buland_Darwaza%2C_Fatehpur_Sikri.jpg/1280px-Buland_Darwaza%2C_Fatehpur_Sikri.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The short-lived 16th-century imperial capital of Emperor Akbar built in red sandstone, entered via the monumental 54-meter Buland Darwaza and housing the white marble Dargah of Sheikh Salim Chishti.',
      },
      {
        id: 'IN-UP-AGR-GEM-001',
        name: "Tomb of I'timad-ud-Daulah (Baby Taj)",
        category: 'Heritage · Monuments, First Mughal White Marble Structure with Pietra Dura Inlay',
        timings: '06:00–18:00',
        fee: { domestic: 'INR 30', foreign: 'INR 310' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Itmad-ud-Daula%2C_Agra.jpg/1280px-Itmad-ud-Daula%2C_Agra.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Often described as the draft or jewel box of the Taj Mahal, this was the first Mughal structure built entirely of white Rajasthani marble featuring delicate floral Pietra Dura inlay.',
      },
      {
        id: 'IN-UP-AGR-GEM-002',
        name: 'Mehtab Bagh Sunset Taj Reflection Point',
        category: 'Nature / Heritage · Forests & Gardens, Charbagh Riverfront Axis',
        timings: '06:00–18:30',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Taj_Mahal_from_Mehtab_Bagh.jpg/1280px-Taj_Mahal_from_Mehtab_Bagh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A 25-acre crescent-shaped Charbagh garden complex on the opposite northern bank of the Yamuna River, aligned perfectly with the Taj Mahal to capture serene sunset reflections away from crowds.',
      },
      {
        id: 'IN-UP-AGR-GEM-003',
        name: 'Bateshwar Temple Complex & Chambal Ravines',
        category: 'Heritage / Nature · 101 Shiva Temples curved along the Yamuna Crescent, Chambal Boat Safari',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Chambal River Safari boat: INR 1,500–2,500)', foreign: 'Free (Chambal River Safari boat: INR 1,500–2,500)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Bateshwar_Temples_Yamuna.jpg/1280px-Bateshwar_Temples_Yamuna.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A spectacular curved crescent of 101 historic white Shiva temples along the Yamuna bank, gateway to the rugged National Chambal Sanctuary sheltering gharials, river dolphins, and migratory birds.',
      },
    ],
  },
  {
    id: 'lucknow',
    code: 'IN-UP-CITY-LKO',
    name: 'Lucknow',
    nickname: 'The City of Nawabs & Tehzeeb',
    tagline: 'Pillarless vaulted halls, Chikankari needlework & centuries-old Dum Pukht gastronomy',
    accentColor: '#7C2D12',
    bgGradient: 'from-amber-50 via-orange-50/30 to-stone-50/20',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Rumi_Darwaza_Lucknow.jpg/1280px-Rumi_Darwaza_Lucknow.jpg',
    photoCredit: 'Wikimedia Commons / Rumi Darwaza',
    flashcardBlurb:
      'The city of Nawabs, celebrated for Tehzeeb (refined etiquette), Chikankari needlecraft, columnless arched imambaras, and the world\'s most nuanced Dum Pukht gastronomy.',
    topStays: [
      { name: 'The Taj Mahal Lucknow', category: 'Gomti Nagar — Luxury Colonial & Awadhi Heritage' },
      { name: 'Lebua Lucknow', category: 'Mall Avenue — 1936 Art Deco Bungalow Estate' },
      { name: 'Hyatt Regency Lucknow', category: 'Vibhuti Khand — Contemporary Luxury' },
    ],
    dining: {
      veg: [
        { restaurant: 'Netram Ajay Kumar', location: 'Aminabad', specialties: 'Fluffy puris fried in Pure Desi Ghee with spicy Hing Aloo and hot Gulab Jamuns' },
        { restaurant: 'Bajpayee Kachodi Bhandar', location: 'Hazratganj', specialties: 'Flaky Khasta Kachori topped with spicy dry Chhole, tangy chutneys and fried green chillies' },
      ],
      nonVeg: [
        { restaurant: 'Tunday Kababi', location: 'Aminabad', specialties: 'The original 160-spice melt-in-the-mouth Galouti and buffalo kebabs crafted since 1905' },
        { restaurant: 'Dastarkhwan', location: 'Tulsi Theatre, Hazratganj', specialties: 'Silken Awadhi Chicken Masala, Boti Kebab, Mutton Biryani & warm Mughlai parathas' },
        { restaurant: 'Idris Biryani', location: 'Raja Bazaar, Chowk', specialties: 'Traditional wood-fired Awadhi Mutton Dum Biryani simmered in earthen handis' },
      ],
      peacefulNote: 'Awadhi Dum Pukht cooking uses slow earthen-pot sealed charcoal steaming, infusing saffron, rosewater, screwpine (kewra), and hand-pounded aromatic spices.',
    },
    attractions: [
      {
        id: 'IN-UP-LKO-ATT-001',
        name: 'Bara Imambara & Bhool Bhulaiya',
        category: "Heritage · Historical Buildings, World's Largest Vaulted Hall without Pillars, Labyrinth",
        timings: '06:00–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 50 (Composite ticket includes Chhota Imambara)', foreign: 'INR 300–500' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Bara_Imambara_Lucknow.jpg/1280px-Bara_Imambara_Lucknow.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Built in 1784 by Nawab Asaf-ud-Daula as famine-relief architecture, featuring a colossal 50-meter unsupported central arched hall and the intricate 3D labyrinth of Bhool Bhulaiya on upper levels.',
      },
      {
        id: 'IN-UP-LKO-ATT-002',
        name: 'Chhota Imambara (Hussainabad Imambara)',
        category: 'Heritage · Historical Buildings, "Palace of Lights", Belgian Glass Chandeliers',
        timings: '06:00–17:00',
        fee: { domestic: 'Covered in Bara Imambara ticket', foreign: 'Covered in Bara Imambara ticket' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Chhota_Imambara_Lucknow.jpg/1280px-Chhota_Imambara_Lucknow.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Exquisite 19th-century mausoleum built by Muhammad Ali Shah, adorned with gilded domes, intricate Urdu calligraphy, and a priceless collection of Belgian crystal chandeliers.',
      },
      {
        id: 'IN-UP-LKO-ATT-003',
        name: 'The British Residency Grounds',
        category: 'Heritage · Historical Sites, 1857 Siege of Lucknow Relics, Cannon-Scared Brickwork',
        timings: '07:00–18:00 (Closed Mondays)',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/British_Residency_Lucknow.jpg/1280px-British_Residency_Lucknow.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Historic 33-acre parkland preserving the ruined brick complex that served as the refuge during the dramatic 1857 Siege of Lucknow, retaining intact cannonball scars, graves, and museum galleries.',
      },
      {
        id: 'IN-UP-LKO-ATT-004',
        name: 'Rumi Darwaza',
        category: 'Heritage · Monuments, 60-ft Turkish Gateway, Awadhi Architectural Icon',
        timings: 'Open 24 Hours (External viewing)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Rumi_Darwaza_Lucknow.jpg/1280px-Rumi_Darwaza_Lucknow.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '60-foot-tall ornamental gateway constructed in 1784 modelled after the Sublime Porte in Istanbul; the quintessential architectural symbol of Awadhi grandeur.',
      },
      {
        id: 'IN-UP-LKO-GEM-001',
        name: 'Chowk Artisan By-lanes (Chikankari & Ittar Distillers)',
        category: 'Arts / Gastronomy · Crafts-Tourism, Traditional Attar (Mitti, Ruh Gulab) & Shadow-Work Embroidery',
        timings: '11:00–20:00 (Closed Thursdays)',
        fee: { domestic: 'Free (Workshops accessible via local guides)', foreign: 'Free (Workshops accessible via local guides)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Chikankari Embroidery',
        summary:
          'Historic bazaar lanes where generations of master artisans hand-distill pure Mitti attar (the scent of baked earth after first rain) in copper degs, alongside delicate white-on-white Chikankari embroidery ateliers.',
      },
      {
        id: 'IN-UP-LKO-GEM-002',
        name: 'La Martiniere College (Constantia)',
        category: 'Heritage · Historical Buildings, 18th-century French-Palladian Palace Fortress',
        timings: '09:00–17:00 (Requires gate entry permission; restricted during school sessions)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Constantia_La_Martiniere_Lucknow.jpg/1280px-Constantia_La_Martiniere_Lucknow.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The extravagant 18th-century estate of French Major General Claude Martin, combining European Palladian arches, Gothic gargoyles, Corinthian pilasters, and subterranean crypt halls.',
      },
    ],
  },
  {
    id: 'ayodhya',
    code: 'IN-UP-CITY-AYD',
    name: 'Ayodhya',
    nickname: 'Sacred Realm of Ram Janmabhoomi',
    tagline: 'Pink sandstone Nagara spires, solar city boulevard & evening Saryu riverfront aarti',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Ram_Mandir_Ayodhya_Night.jpg/1280px-Ram_Mandir_Ayodhya_Night.jpg',
    photoCredit: 'Wikimedia Commons / Ram Janmabhoomi Mandir',
    flashcardBlurb:
      'The birthplace of Lord Rama on the banks of the sacred Saryu, transformed with grand Nagara-style stone temples, solar city infrastructure, and evening riverfront aartis.',
    topStays: [
      { name: 'The Sarayu Waterfront Resort', category: 'Saryu Riverfront — Luxury Eco Resort' },
      { name: 'Royal Heritage Hotel', category: 'Civil Lines — Heritage Property' },
      { name: 'Tent City Ayodhya', category: 'Brahma Kund / Saryu Bank Glamping' },
    ],
    dining: {
      veg: [
        { restaurant: 'Chandra Marwadi Bhojnalaya', location: 'Near Hanuman Garhi', specialties: 'Authentic Rajasthani & Awadhi pure vegetarian thalis with hot rotis, dal, and gatte ki sabzi' },
        { restaurant: 'Kanak Sarkar Rasoi', location: 'Kanak Bhawan', specialties: 'Sanctified traditional temple prasadam lunch served on sal leaf platters with pure ghee kheer' },
        { restaurant: 'Ramji Sweet House', location: 'Naya Ghat', specialties: 'Creamy Rabdi, freshly fried golden Jalebi, and pure Desi Ghee Besan Ladoos' },
      ],
      nonVeg: [],
      pilgrimageNotice: 'Sacred Pilgrimage Bylaw: Non-vegetarian food and alcohol are completely forbidden across the entire holy municipality and perimeter of Ayodhya.',
      peacefulNote: 'Ayodhya’s temple kitchens serve pure sattvic cuisine cooked without onion or garlic, centering on freshly pounded wheat rotis, moong dal, pumpkin sabzi, and makhan prasad.',
    },
    attractions: [
      {
        id: 'IN-UP-AYD-ATT-001',
        name: 'Shri Ram Janmabhoomi Mandir',
        category: 'Spiritual / Heritage · Hinduism, Nagara Pink Sandstone Architecture, Ram Lalla Garbha Griha',
        timings: '07:00–11:30 & 14:00–19:00 (Aarti slots operate from 06:30 Mangala to 21:30 Shayan)',
        fee: { domestic: 'Free general darshan (Aarti passes require prior online trust booking; strict no-phone policy)', foreign: 'Free general darshan (Aarti passes require prior online trust booking; strict no-phone policy)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Ram_Mandir_Ayodhya_Night.jpg/1280px-Ram_Mandir_Ayodhya_Night.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Magnificent 3-storey Nagara-style temple constructed entirely of pink Bansi Paharpur sandstone without structural steel, housing the sacred Garbha Griha of Ram Lalla upon a 161-foot-tall central shikhara.',
      },
      {
        id: 'IN-UP-AYD-ATT-002',
        name: 'Hanuman Garhi Temple',
        category: 'Spiritual · Hinduism, 10th-Century Hilltop Temple Citadel reached by 76 steps',
        timings: '05:00–22:00 (Closes 12:00–15:00)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Hanuman_Garhi_Ayodhya.jpg/1280px-Hanuman_Garhi_Ayodhya.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '10th-century four-sided fortress temple perched on a central hill accessed via 76 steep stone steps, where Lord Hanuman is enshrined as the royal guardian protector of Ayodhya.',
      },
      {
        id: 'IN-UP-AYD-ATT-003',
        name: 'Kanak Bhawan (Sita-Ram Golden Palace)',
        category: 'Spiritual / Heritage · Hinduism, Ornate Palace Shrines with Gold-Leaf Murals',
        timings: '08:00–11:30 & 16:30–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Kanak_Bhawan_Ayodhya.jpg/1280px-Kanak_Bhawan_Ayodhya.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Ornate palace temple gifted to Sita by Queen Kaikeyi upon her wedding, featuring Bundeli-Rajasthani courtyards and shrines adorned with fine gold ornaments and wall murals.',
      },
      {
        id: 'IN-UP-AYD-ATT-004',
        name: 'Ram Ki Paidi & Saryu River Ghats',
        category: 'Spiritual / Nature · Rivers & Lakes, Holy Bathing Ghats, Grand Evening Saryu Aarti & Light Show',
        timings: 'Open 24 Hours (Evening Aarti at 18:30)',
        fee: { domestic: 'Free (Boat ride across Saryu: INR 100–300)', foreign: 'Free (Boat ride across Saryu: INR 100–300)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Ram_Ki_Paidi_Ayodhya.jpg/1280px-Ram_Ki_Paidi_Ayodhya.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Extensive stepped ghats along the Saryu River, illuminated during the spectacular evening Maha Aarti and home to the world-record Deepotsav celebrations with millions of earthen lamps.',
      },
      {
        id: 'IN-UP-AYD-GEM-001',
        name: 'Nageshwarnath Temple',
        category: "Spiritual / Heritage · Hinduism, Shiva Lingam established by Lord Rama's son Kush",
        timings: '05:00–12:00 & 16:00–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Nageshwarnath_Temple_Ayodhya.jpg/1280px-Nageshwarnath_Temple_Ayodhya.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Ancient temple dedicated to Lord Shiva situated beside Ram Ki Paidi, traditionally believed to have been established by Lord Rama’s son Kush after retrieving his lost amulet from the river.',
      },
      {
        id: 'IN-UP-AYD-GEM-002',
        name: 'Guptar Ghat',
        category: 'Spiritual / Nature · Sacred Jal Samadhi Shore of Lord Rama, Sandstone Pavilions & Quiet River Walk',
        timings: '05:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Guptar_Ghat_Ayodhya.jpg/1280px-Guptar_Ghat_Ayodhya.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The peaceful sacred riverfront where Lord Rama took his final Jal Samadhi to return to his divine abode of Vaikuntha, newly renovated with sandstone pavilions, gardens, and quiet walking paths.',
      },
      {
        id: 'IN-UP-AYD-GEM-003',
        name: 'Surya Kund, Darshan Nagar',
        category: 'Heritage / Spiritual · Restored Ancient Sun Temple & Stepped Kund with Evening Laser Show',
        timings: '06:00–21:00 (Light show at 19:30)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Surya_Kund_Ayodhya.jpg/1280px-Surya_Kund_Ayodhya.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Historic solar water reservoir and temple 4 km from Ayodhya, meticulously restored with carved stone ghats, illuminated walkways, and an evening sound-and-laser projection show tracing the Sun dynasty lineage.',
      },
    ],
  },
];
