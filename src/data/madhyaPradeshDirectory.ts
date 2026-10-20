export interface MadhyaPradeshStay {
  name: string;
  category: string;
}

export interface MadhyaPradeshFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface MadhyaPradeshDining {
  veg: MadhyaPradeshFoodSpot[];
  nonVeg: MadhyaPradeshFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface MadhyaPradeshAttraction {
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

export interface MadhyaPradeshCity {
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
  topStays: MadhyaPradeshStay[];
  dining: MadhyaPradeshDining;
  attractions: MadhyaPradeshAttraction[];
}

export const MADHYA_PRADESH_DIRECTORY: MadhyaPradeshCity[] = [
  {
    id: 'khajuraho-orchha',
    code: 'IN-MP-CITY-HJR',
    name: 'Khajuraho & Orchha',
    nickname: 'The Temple & Fortress Heartland',
    tagline: 'Sacred Chandela nagara carvings, Betwa river cenotaphs & Bundela palaces',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Kandariya_Mahadeva_Temple.jpg/1280px-Kandariya_Mahadeva_Temple.jpg',
    photoCredit: 'Wikimedia Commons / Kandariya Mahadeva',
    flashcardBlurb:
      "The epicentre of Bundelkhand's creative zenith, where Chandela nagara temples celebrate sacred sensuality alongside Orchha's riverside cenotaphs and Bundela fort-palaces.",
    topStays: [
      { name: 'The Lalit Temple View', category: 'Khajuraho — Luxury adjacent to Western Group' },
      { name: 'Radisson Jass Hotel', category: 'Khajuraho — Heritage Gardens' },
      { name: 'Amar Mahal', category: 'Orchha — Bundela Palace Architecture' },
    ],
    dining: {
      veg: [
        { restaurant: 'Raja Cafe', location: 'Khajuraho Western Group', specialties: 'Wood-fired pizza, Indian breakfast & Swiss bakery overlooking the temples since 1978' },
        { restaurant: 'Agrasen Bhojnalaya', location: 'Khajuraho', specialties: 'Pure Bundelkhandi & North Indian homestyle thali with fresh tawa rotis and dal' },
        { restaurant: 'Betwa Tarang', location: 'Orchha', specialties: 'Authentic Bundeli Dal Bafla, smoky roasted brinjals, and wholesome village thali' },
      ],
      nonVeg: [
        { restaurant: 'Mediterraneo', location: 'Khajuraho', specialties: 'Italian wood-smoked meats, handcrafted pastas, and charcoal grill delicacies' },
        { restaurant: 'Panna Restaurant', location: 'Khajuraho', specialties: 'Rich Mughlai Mutton Curry, tandoori kebabs & aromatic spiced biryani' },
      ],
      peacefulNote: 'Bundelkhandi gastronomy is defined by comforting Dal Bafla drenched in pure desi ghee, smoked brinjal bharta, and refreshing wild mint buttermilk.',
    },
    attractions: [
      {
        id: 'IN-MP-HJR-ATT-001',
        name: 'Western Group of Temples (Kandariya Mahadeva & Lakshmana)',
        category: 'Heritage · UNESCO World Heritage, Nagara Architecture, Historical Sites',
        timings: 'Sunrise to Sunset (06:00–18:00; Light & Sound Show: 18:30 English / 19:30 Hindi)',
        fee: { domestic: 'INR 40', foreign: 'INR 600' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Kandariya_Mahadeva_Temple.jpg/1280px-Kandariya_Mahadeva_Temple.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '10th–11th century nagara architectural apex built by the Chandela dynasty, famed for intricate soaring shikharas and sculpted friezes celebrating celestial maidens, rituals, and sacred sensuality.',
      },
      {
        id: 'IN-MP-HJR-ATT-002',
        name: 'Eastern & Southern Group (Javari, Vamana & Dulhadev)',
        category: 'Heritage / Spiritual · Hinduism, Jainism, Archeological Sites',
        timings: 'Sunrise to Sunset (06:00–18:00)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Parsvanatha_temple_Khajuraho.jpg/1280px-Parsvanatha_temple_Khajuraho.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Serene, uncrowded shrines including the Jain temple cluster (Parshvanatha & Adinatha) and the solitary Dulhadev temple dedicated to Lord Shiva along the Khodar River.',
      },
      {
        id: 'IN-MP-HJR-ATT-003',
        name: 'Orchha Fort Complex & Jahangir Mahal',
        category: 'Heritage · Palaces & Forts, Historical Buildings, Bundela-Mughal Fusion',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 10–40', foreign: 'INR 250–600' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Jahangir_Mahal_Orchha.jpg/1280px-Jahangir_Mahal_Orchha.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '16th-century fortress on an island in the Betwa River featuring the Raja Mahal with vibrant mythological murals and the symmetrical tiered courtyards of Jahangir Mahal.',
      },
      {
        id: 'IN-MP-HJR-ATT-004',
        name: 'Chaturbhuj Temple & Ram Raja Mandir, Orchha',
        category: 'Spiritual / Heritage · Hinduism, Only Temple Where Lord Rama is Revering as King',
        timings: '08:00–12:30 & 19:00–21:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Chaturbhuj_Temple_Orchha.jpg/1280px-Chaturbhuj_Temple_Orchha.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Soaring multi-storey cathedral-like Chaturbhuj Temple facing the Ram Raja Mandir—the only sacred site in India where Lord Rama is venerated with official police gun-salute guard of honour as sovereign King.',
      },
      {
        id: 'IN-MP-HJR-GEM-001',
        name: 'Raneh Falls & Ken River Canyon',
        category: 'Nature · Rivers & Lakes, Canyons, Pure Crystalline Granite Rock Formations',
        timings: '08:00–17:00 (Ken Gharial Sanctuary open Oct–April)',
        fee: { domestic: 'INR 65 + Vehicle entry', foreign: 'INR 350 + Vehicle entry' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Raneh_Falls_Ken_River.jpg/1280px-Raneh_Falls_Ken_River.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A breathtaking 30-meter-deep canyon of pure multi-coloured crystalline granite (shades of pink, green, and red) carved by the Ken River, often referred to as India’s Grand Canyon.',
      },
      {
        id: 'IN-MP-HJR-GEM-002',
        name: 'Chhatris of Orchha (Betwa River Cenotaphs)',
        category: 'Heritage / Nature · Historical Sites, Monuments, River Reflection Sunset View',
        timings: '07:00–18:30',
        fee: { domestic: 'Free (Grounds accessed via fort entry pass)', foreign: 'Free (Grounds accessed via fort entry pass)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Chhatris_on_the_bank_of_Betwa_River_Orchha.jpg/1280px-Chhatris_on_the_bank_of_Betwa_River_Orchha.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Fourteen monumental spire-domed royal Bundela cenotaphs aligned along Kanchana Ghat, creating iconic evening reflections across the emerald waters of the Betwa River.',
      },
    ],
  },
  {
    id: 'bhopal',
    code: 'IN-MP-CITY-BHO',
    name: 'Bhopal, Sanchi & Bhimbetka',
    nickname: 'City of Lakes & Ancient Foundations',
    tagline: 'Begum dynasty palaces, Ashokan Buddhist stupas & 10,000-year-old rock shelters',
    accentColor: '#0D9488',
    bgGradient: 'from-teal-50 via-emerald-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Sanchi_Stupa_from_Eastern_gate%2C_Madhya_Pradesh.jpg/1280px-Sanchi_Stupa_from_Eastern_gate%2C_Madhya_Pradesh.jpg',
    photoCredit: 'Wikimedia Commons / Great Stupa of Sanchi',
    flashcardBlurb:
      '"The City of Lakes" governed by four generations of enlightened Begums, acting as the base for 10,000-year-old Mesolithic rock paintings and Ashoka\'s Great Stupa.',
    topStays: [
      { name: 'Jehan Numa Palace Hotel', category: 'Shamla Hills — 19th-Century Royal Residence' },
      { name: 'Noor-Us-Sabah Palace', category: 'VIP Road — Heritage Hillside Palace' },
      { name: 'Gateway Retreat', category: 'Sanchi — MPSTDC Garden Resort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Manohar Bikhar', location: 'Hamidia Road / MP Nagar', specialties: 'Authentic Bhopali Poha-Jalebi with Ratlami sev, piping hot Dal Bafla, and spicy street chaat' },
        { restaurant: 'Under The Mango Tree at Jehan Numa', location: 'Shamla Hills', specialties: 'Royal Bhopali vegetarian koftas, aromatic paneer curries & freshly baked tandoori breads' },
      ],
      nonVeg: [
        { restaurant: 'Chatori Gali', location: 'Old Bhopal', specialties: 'Legendary culinary lane serving rich Bhopali Rizaala, slow-simmered Nalli Nihari & melt-in-mouth Pasanda Kebabs' },
        { restaurant: 'Filfora', location: 'Kohefiza', specialties: 'Aromatic Bhopali Mutton Korma, spicy Dum Biryani & succulent seekh kebabs' },
      ],
      peacefulNote: 'Bhopal’s culinary heritage marries royal Nawabi slow-simmered aromatic gravies with iconic street breakfasts of crisp sev-garnished Poha-Jalebi.',
    },
    attractions: [
      {
        id: 'IN-MP-BHO-ATT-001',
        name: 'Great Stupa of Sanchi',
        category: 'Heritage / Spiritual · UNESCO World Heritage, Buddhism, Ashokan Torana Gateways',
        timings: '06:30–18:30',
        fee: { domestic: 'INR 40', foreign: 'INR 600' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Sanchi_Stupa_from_Eastern_gate%2C_Madhya_Pradesh.jpg/1280px-Sanchi_Stupa_from_Eastern_gate%2C_Madhya_Pradesh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '3rd-century BCE hemispherical stone dome commissioned by Emperor Ashoka, featuring four monumental stone gateways (toranas) carved with scenes from the Buddha\'s life and Jataka tales.',
      },
      {
        id: 'IN-MP-BHO-ATT-002',
        name: 'Rock Shelters of Bhimbetka',
        category: 'Heritage · UNESCO World Heritage, Archeological Sites, Mesolithic Cave Art',
        timings: '07:00–18:00',
        fee: { domestic: 'INR 25–40 + Vehicle fee (~INR 100–300)', foreign: 'INR 300–600 + Vehicle fee (~INR 100–300)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Bhimbetka_rock_paintings.jpg/1280px-Bhimbetka_rock_paintings.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Over 750 sandstone rock shelters amidst teak forests displaying cave paintings spanning from the Upper Paleolithic to the Medieval period, depicting hunting, dancing, and animal spirits.',
      },
      {
        id: 'IN-MP-BHO-ATT-003',
        name: 'Taj-ul-Masajid',
        category: 'Spiritual / Heritage · Islam, One of the Largest Mosques in Asia, Pink Sandstone Minarets',
        timings: '06:00–20:00 (Closed to visitors during prayer times)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Taj-ul-Masajid_Bhopal.jpg/1280px-Taj-ul-Masajid_Bhopal.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Colossal pink sandstone mosque initiated by Nawab Shah Jahan Begum, boasting towering 18-storey octagonal minarets, marble dome cupolas, and an enormous courtyard accommodating over 175,000 worshippers.',
      },
      {
        id: 'IN-MP-BHO-ATT-004',
        name: 'Upper Lake (Bhojtal) & Van Vihar',
        category: 'Nature / Rural · Rivers & Lakes, Eco-Tourism, Open-Enclosure Safari',
        timings: 'Van Vihar: 06:30–18:30 (Closed Fridays)',
        fee: { domestic: 'INR 20–50', foreign: 'INR 20–50 (Walking/cycling tariffs nominal)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Upper_Lake_Bhopal.jpg/1280px-Upper_Lake_Bhopal.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '11th-century lake created by Raja Bhoj bordered by Van Vihar National Park, an open-enclosure zoological sanctuary along the water where visitors cycle alongside free-roaming herbivores and tigers.',
      },
      {
        id: 'IN-MP-BHO-GEM-001',
        name: 'Bhojeshwar Shiva Temple, Bhojpur',
        category: 'Heritage / Spiritual · Archeological Sites, Unfinished 11th-Century Colossus with World\'s Largest Single-Stone Lingam',
        timings: '06:00–19:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Bhojeshwar_Temple_Bhojpur.jpg/1280px-Bhojeshwar_Temple_Bhojpur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Monumental unfinished 11th-century stone temple attributed to King Bhoja, housing a colossal 7.5-ft-high polished Shiva lingam mounted on a 20-ft square limestone platform.',
      },
      {
        id: 'IN-MP-BHO-GEM-002',
        name: 'Madhya Pradesh Tribal Museum',
        category: 'Arts / Rural · Museums, Tribal-Tourism, Interactive Indigenous Habitats (Gond, Bhil, Baiga)',
        timings: '12:00–20:00 (Closed Mondays & State Holidays)',
        fee: { domestic: 'INR 20', foreign: 'INR 400' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Indigenous Indian Arts',
        summary:
          'Immersive cultural showcase celebrating the life, cosmologies, musical instruments, and life-size village dwellings of MP’s indigenous tribes (Gond, Bhil, Baiga, Sahariya, and Korku).',
      },
    ],
  },
  {
    id: 'kanha-bandhavgarh',
    code: 'IN-MP-CITY-KHA',
    name: 'Kanha & Bandhavgarh Tiger Reserves',
    nickname: "Kipling's Jungle Book & Tiger Heartlands",
    tagline: 'Sal canopy forests, highest tiger density, hard-ground Barasingha & 2,000-year-old Vishnu colossus',
    accentColor: '#15803D',
    bgGradient: 'from-emerald-50 via-green-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Tiger_in_Bandhavgarh.jpg/1280px-Tiger_in_Bandhavgarh.jpg',
    photoCredit: 'Wikimedia Commons / Royal Bengal Tiger',
    flashcardBlurb:
      "Central India's premier sal and bamboo wilderness, celebrated for the highest wild tiger density in Asia, Kipling’s Jungle Book inspiration, and the revival of the hard-ground Barasingha.",
    topStays: [
      { name: 'Banjaar Tola - Taj Safaris', category: 'Kanha — Luxury Tented River Lodges along Banjaar River' },
      { name: 'Mahua Kothi - Taj Safaris', category: 'Bandhavgarh — Heritage Mud Kutiyas in 40-Acre Estate' },
      { name: 'Pugdundee Safaris Kings Lodge', category: 'Bandhavgarh — Eco-Luxury Bush Cottages' },
    ],
    dining: {
      veg: [
        { restaurant: 'Jungle Lodge In-house Dining', location: 'Kanha / Bandhavgarh', specialties: 'Locally grown Millets, Kodo-Kutki Kheer, Mahua flower syrup desserts & Baiga-style earthy Dal' },
        { restaurant: 'MP Tourism MPT Jungle Home Canteen', location: 'Mocha / Tala Gate', specialties: 'Wholesome North Indian thalis with fresh seasonal vegetables, tawa phulkas & curd' },
      ],
      nonVeg: [
        { restaurant: 'Wildlife Resort Kitchens', location: 'Bandhavgarh / Kanha', specialties: 'Traditional Desi Murgh Curry, Shikar-style smoked mutton prepared over aromatic wood fires & tandoori chicken' },
      ],
      peacefulNote: 'Forest kitchen dining focuses on indigenous millets (Kodo and Kutki), wild Mahua flower syrup, earthen-pot cooked lentils, and slow wood-fire roasted meats.',
    },
    attractions: [
      {
        id: 'IN-MP-KHA-ATT-001',
        name: 'Kanha Tiger Reserve (Mukki, Kisli & Kanha Zones)',
        category: 'Nature / Rural · Wildlife-Tourism, Forests & Gardens, Barasingha & Tiger Habitats',
        timings: 'Morning (06:00–11:00) & Afternoon (15:00–18:30) (Reserve closed July 1 to October 15 annually)',
        fee: { domestic: 'Core Safari Entry INR 2,400–3,000 + Gypsy/Guide (~INR 3,500–4,500)', foreign: 'Core Safari Entry INR 2,400–3,000 + Gypsy/Guide (~INR 3,500–4,500)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Barasingha_Kanha.jpg/1280px-Barasingha_Kanha.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Central India’s largest tiger reserve spanning 940 sq km of lush sal and bamboo forests and expansive meadows; famous as the sole natural home and successful revival ground of the swamp deer (Barasingha).',
      },
      {
        id: 'IN-MP-KHA-ATT-002',
        name: 'Bandhavgarh National Park (Tala, Magdhi & Khitauli)',
        category: 'Nature / Rural · Wildlife-Tourism, High Density Tiger Tracking, Bamboo Foothills',
        timings: 'Morning (06:00–11:00) & Afternoon (15:30–18:30) (Core zones closed July to mid-October)',
        fee: { domestic: 'Permit INR 2,400–3,000 + Gypsy & Guide (~INR 3,500–4,500)', foreign: 'Permit INR 2,400–3,000 + Gypsy & Guide (~INR 3,500–4,500)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Tiger_in_Bandhavgarh.jpg/1280px-Tiger_in_Bandhavgarh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Renowned worldwide for possessing the highest density of Royal Bengal Tigers in the wild, nestled among dramatic sandstone cliffs, grasslands, and mixed bamboo forests.',
      },
      {
        id: 'IN-MP-KHA-ATT-003',
        name: 'Bandhavgarh Fort & Shesh Shaiya',
        category: 'Heritage / Spiritual · Hinduism, 2,000-Year-Old 35-ft Reclining Vishnu Sandstone Colossus',
        timings: 'Regulated via authorized Tala Zone Safari route',
        fee: { domestic: 'Included inside Tala Safari booking', foreign: 'Included inside Tala Safari booking' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Shesh_Shaiya_Bandhavgarh.jpg/1280px-Shesh_Shaiya_Bandhavgarh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A 2,000-year-old plateau fortress atop an 811-meter hill featuring the iconic Shesh Shaiya—a 35-foot monolithic sandstone statue of Lord Vishnu reclining on the serpent Sheshanaga beside the source of the Charanganga River.',
      },
      {
        id: 'IN-MP-KHA-GEM-001',
        name: 'Bamni Dadar (Sunset Point, Kanha)',
        category: 'Nature / Adventure · Hills & Mountains, Plateau Cliff Viewpoint Over Grazing Gaurs & Sambhar',
        timings: 'Late afternoon safari slot',
        fee: { domestic: 'Covered in Kanha Core permit', foreign: 'Covered in Kanha Core permit' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Sunset Over Forest Plateau',
        summary:
          'Highest point of Kanha known as Sunset Point, providing a majestic bird\'s-eye panorama over the dense sal canopy where herds of Indian Gaur (bison) and Sambar graze against crimson evening skies.',
      },
      {
        id: 'IN-MP-KHA-GEM-002',
        name: 'Baiga & Gond Tribal Hamlets (Mocha & Tala)',
        category: 'Rural / Arts · Tribal-Tourism, Crafts-Tourism, Authentic Gond Wall Painting & Mud Relief Art',
        timings: '09:00–17:00',
        fee: { domestic: 'Free (Artworks purchased directly from resident artists)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Gond_Art_Painting.jpg/1280px-Gond_Art_Painting.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Indigenous forested hamlets outside park gates where Baiga and Gond tribal families invite visitors to observe traditional mud-plastered dighna patterns, vibrant Gond folk art on canvas, and bamboo weaving.',
      },
    ],
  },
  {
    id: 'rewa-panna-chitrakoot',
    code: 'IN-MP-CITY-REW',
    name: 'Varanasi-Corridor: Rewa, Panna & Chitrakoot',
    nickname: 'Vindhyan Ramayana & White Tiger Corridor',
    tagline: 'Ramayana pilgrimage ghats, Mandakini river aarti, diamond mines & 130m canyon waterfalls',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-yellow-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Ramghat_Chitrakoot.jpg/1280px-Ramghat_Chitrakoot.jpg',
    photoCredit: 'Wikimedia Commons / Chitrakoot Ramghat',
    flashcardBlurb:
      'The eastern Vindhyan borderland connecting central Madhya Pradesh to the holy Varanasi plains, marked by Ramayana pilgrimage forests, cascading gorges, and white tiger sanctuaries.',
    topStays: [
      { name: 'Ken River Lodge', category: 'Panna — Treehouse & Cottage Estate on Ken River' },
      { name: 'MPT Mandakini Resort', category: 'Chitrakoot — Riverside Heritage Pilgrimage Stay' },
      { name: 'Rewa Rajvilas Palace', category: 'Rewa — Royal Baghelkhand Heritage Property' },
    ],
    dining: {
      veg: [
        { restaurant: 'Kamadgiri Bhojnalaya', location: 'Chitrakoot', specialties: 'Pure vegetarian sattvic thalis, piping hot Puri-Kachori, khichdi & sweet rabdi' },
        { restaurant: 'MP Tourism Betwa Canteen', location: 'Panna', specialties: 'Wholesome North Indian & Bundeli thalis, seasonal vegetable curries and hot rotis' },
      ],
      nonVeg: [
        { restaurant: 'Rewa Darbar Restaurant', location: 'Rewa bypass', specialties: 'Authentic Baghelkhandi Meat curries, tandoori rotis & fragrant Dum Biryani' },
      ],
      pilgrimageNotice: 'Sacred Pilgrimage Bylaw: Chitrakoot ghats and sacred pilgrimage perimeters are strictly vegetarian. Non-vegetarian cuisine is only available along designated highways in Rewa outskirts.',
      peacefulNote: 'Baghelkhandi and Chitrakoot cooking centers on sattvic buckwheat, wood-fired baati, spicy tomato chokha, and fresh rabdi offered to pilgrims.',
    },
    attractions: [
      {
        id: 'IN-MP-REW-ATT-001',
        name: 'Chitrakoot Ramghat & Kamadgiri Parikrama',
        category: 'Spiritual · Hinduism, Living Ramayana Pilgrimage, Mandakini River Aarti',
        timings: 'Open 24 Hours (Evening Maha Aarti at 18:30)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Ramghat_Chitrakoot.jpg/1280px-Ramghat_Chitrakoot.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Sacred riverside ghats along the holy Mandakini where Lord Rama, Sita, and Lakshmana spent eleven of their fourteen years of exile; celebrated for the hypnotic evening Maha Aarti and the 5-km barefoot Kamadgiri Parikrama.',
      },
      {
        id: 'IN-MP-REW-ATT-002',
        name: 'Panna National Park & Pandav Falls',
        category: 'Nature · Wildlife-Tourism, Rivers & Lakes, Tiger Reserve & Natural Gorge',
        timings: '06:30–10:30 & 14:30–17:30 (Safari)',
        fee: { domestic: 'Pandav Falls INR 50; Jungle Safari standard MP tariff', foreign: 'Pandav Falls INR 50; Jungle Safari standard MP tariff' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Pandav_Falls_Panna.jpg/1280px-Pandav_Falls_Panna.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Dramatic teak forest and Ken River sanctuary famous for successful tiger reintroduction, accompanied by Pandav Falls—a serene 30-meter waterfall plunging into a heart-shaped pool where the Pandavas sheltered.',
      },
      {
        id: 'IN-MP-REW-ATT-003',
        name: 'Govindgarh Palace & Rewa White Tiger Safari, Mukundpur',
        category: 'Heritage / Nature · Historical Buildings, World\'s First White Tiger Habitat',
        timings: '09:00–16:30 (Closed Wednesdays)',
        fee: { domestic: 'Safari bus INR 100–150', foreign: 'INR 500' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/White_Tiger_Rewa.jpg/1280px-White_Tiger_Rewa.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The historic lakefront royal summer palace of the Maharaja of Rewa alongside the Mukundpur Zoological Park, honouring the 1951 discovery of Mohan, the ancestor of all captive white tigers in the world.',
      },
      {
        id: 'IN-MP-REW-GEM-001',
        name: 'Chachai Falls & Keoti Gorge, Rewa',
        category: 'Nature / Adventure · Rivers & Lakes, Hills & Mountains, 130-Metre Bihad River Canyon Falls',
        timings: '07:00–18:00 (Spectacular during and post-monsoon)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Keoti_Falls_Rewa.jpg/1280px-Keoti_Falls_Rewa.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'One of India’s highest single-drop waterfalls (130 meters) plummeting over the jagged sandstone cliffs of the Rewa plateau into a deep dramatic canyon on the Bihad River.',
      },
      {
        id: 'IN-MP-REW-GEM-002',
        name: 'Gupt Godavari Caves, Chitrakoot',
        category: 'Spiritual / Nature · Geological Caves, Underground Stream Flowing Through Sacred Rocks',
        timings: '07:00–18:00',
        fee: { domestic: 'INR 20–30', foreign: 'INR 20–30' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Gupt_Godavari_Caves.jpg/1280px-Gupt_Godavari_Caves.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Twin natural limestone cavern system where a knee-deep sacred subterranean stream flows mysteriously out of the rocks, said to be the clandestine emergence of the River Godavari.',
      },
    ],
  },
];
