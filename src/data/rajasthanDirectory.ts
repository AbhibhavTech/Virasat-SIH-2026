export interface RajasthanStay {
  name: string;
  category: string;
}

export interface RajasthanFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface RajasthanDining {
  veg: RajasthanFoodSpot[];
  nonVeg: RajasthanFoodSpot[];
  peacefulNote?: string;
}

export interface RajasthanAttraction {
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

export interface RajasthanCity {
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
  topStays: RajasthanStay[];
  dining: RajasthanDining;
  attractions: RajasthanAttraction[];
}

export const RAJASTHAN_DIRECTORY: RajasthanCity[] = [
  {
    id: 'jaipur',
    code: 'IN-RJ-JAI-ULTIMATE',
    name: 'Jaipur',
    nickname: 'The Pink City',
    tagline: 'Grid-planned architecture, terracotta facades & royal citadels',
    accentColor: '#E07A5F',
    bgGradient: 'from-orange-50 via-rose-50/40 to-amber-50/30',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Hawa Mahal',
    flashcardBlurb:
      'India\'s iconic "Pink City" and the royal capital of Rajasthan, celebrated for its majestic hilltop fortresses, pink-hued palaces, bustling bazaars, and astronomical heritage.',
    topStays: [
      { name: 'Rambagh Palace', category: 'Taj Luxury — Former residence of the Maharaja' },
      { name: 'Fairmont Jaipur', category: 'Palatial Luxury Resort' },
      { name: 'Samode Haveli', category: 'Heritage boutique' },
    ],
    dining: {
      veg: [
        { restaurant: 'Laxmi Mishthan Bhandar', location: 'Johari Bazaar', specialties: 'Legendary Pyaaz Kachori and Ghevar' },
        { restaurant: 'Rawat Mishthan Bhandar', location: 'Sindhi Camp', specialties: 'Crispy Pyaaz Kachori, Mawa Kachori' },
      ],
      nonVeg: [
        { restaurant: 'Suvarna Mahal', location: 'Rambagh Palace', specialties: 'Royal Indian fine dining' },
        { restaurant: '1135 AD', location: 'Amber Fort', specialties: 'Regal Rajasthani non-veg platters' },
      ],
    },
    attractions: [
      {
        id: 'IN-RJ-JAI-ATT-001',
        name: 'Amber Fort & Palace',
        category: 'Heritage: UNESCO World Heritage, Palaces & Forts',
        timings: '08:00–17:30 & 18:30–21:30',
        fee: { domestic: 'INR 100', foreign: 'INR 550' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg/1280px-20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg',
        photoCredit: 'Wikimedia Commons / Amber Palace Fort',
        summary:
          'Hilltop fortress complex featuring the breathtaking mirror-adorned Sheesh Mahal.',
      },
      {
        id: 'IN-RJ-JAI-ATT-002',
        name: 'Hawa Mahal (Palace of Winds)',
        category: 'Heritage: Monuments',
        timings: '09:00–16:30',
        fee: { domestic: 'INR 50', foreign: 'INR 200' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
        photoCredit: 'Wikimedia Commons / Hawa Mahal East Façade',
        summary:
          '5-story honeycomb facade featuring 953 stone-screened windows built for royal women to observe street festivals.',
      },
      {
        id: 'IN-RJ-JAI-ATT-003',
        name: 'City Palace & Jantar Mantar',
        category: 'Heritage: Palaces & Forts',
        timings: '09:30–17:00',
        fee: { domestic: 'City Palace INR 200; Jantar Mantar INR 50', foreign: 'City Palace INR 700; Jantar Mantar INR 200' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Jantar_Mantar_at_Jaipur.jpg/1280px-Jantar_Mantar_at_Jaipur.jpg',
        photoCredit: 'Wikimedia Commons / Jantar Mantar Jaipur',
        summary:
          'Royal residence museum alongside the 18th-century UNESCO astronomical observatory.',
      },
      {
        id: 'IN-RJ-JAI-GEM-001',
        name: 'Panna Meena ka Kund',
        category: 'Heritage: Historical Sites',
        timings: '07:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Panna Meena Kund Geometric Stepwell',
        summary:
          'A striking 16th-century geometric stepwell with intersecting symmetrical staircases near Amber.',
      },
      {
        id: 'IN-RJ-JAI-GEM-002',
        name: 'Nahargarh Biological Park',
        category: 'Nature: Wildlife-Tourism',
        timings: '08:30–17:30 (Closed Tuesdays)',
        fee: { domestic: 'INR 50', foreign: 'INR 300' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1603228254119-e6aef383a83d?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Nahargarh Foothills Reserve',
        summary:
          'Forest reserve at the foothills of Nahargarh Fort housing leopards, tigers, and Asiatic lions.',
      },
    ],
  },
  {
    id: 'udaipur',
    code: 'IN-RJ-UDP-ULTIMATE',
    name: 'Udaipur',
    nickname: 'The City of Lakes',
    tagline: 'Aravalli lake shores, white marble palaces & living Mewar heritage',
    accentColor: '#2A9D8F',
    bgGradient: 'from-cyan-50 via-teal-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Udaipur Lakes',
    flashcardBlurb:
      'Known as the "Venice of the East" and the "City of Lakes," Udaipur is a romantic desert oasis framed by the Aravalli hills, marble palaces, and shimmering blue waters.',
    topStays: [
      { name: 'Taj Lake Palace', category: 'Lake Pichola — Floating marble luxury palace' },
      { name: 'The Oberoi Udaivilas', category: 'Luxury Lakeside Palace Resort' },
      { name: 'Jagat Niwas Palace', category: 'Heritage boutique' },
    ],
    dining: {
      veg: [
        { restaurant: 'Ambrai Restaurant', location: 'Waterside', specialties: 'Waterside dining overlooking Lake Pichola and City Palace' },
        { restaurant: "Jheel's Ginger Coffee Bar", location: 'Gangaur Ghat', specialties: 'Lakeside coffees, wood-fired pizzas and desserts' },
      ],
      nonVeg: [
        { restaurant: 'Vantage By Pameys', location: 'Rooftop', specialties: 'Rooftop dining with lake views serving traditional Laal Maas and non-veg specialties' },
        { restaurant: 'Charcoal By Carlsson', location: 'Lal Ghat', specialties: 'Coal-grilled meats, Rajasthani kebabs, and continental grills' },
      ],
    },
    attractions: [
      {
        id: 'IN-RJ-UDP-ATT-001',
        name: 'City Palace Udaipur',
        category: 'Heritage: Palaces & Forts',
        timings: '09:30–17:30',
        fee: { domestic: 'INR 400', foreign: 'INR 400' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / City Palace Udaipur',
        summary:
          'Massive 400-year-old palace complex overlooking Lake Pichola, showcasing courtyards, museums, and peacock mosaics.',
      },
      {
        id: 'IN-RJ-UDP-ATT-002',
        name: 'Lake Pichola Boat Cruise',
        category: 'Nature / Recreation: Rivers & Lakes',
        timings: '10:00–18:00',
        fee: { domestic: 'Boat ride ~INR 400–800 per head', foreign: 'Boat ride ~INR 400–800 per head' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Udaipur_Lake_India.JPG/1280px-Udaipur_Lake_India.JPG',
        photoCredit: 'Wikimedia Commons / Lake Pichola Cruise',
        summary:
          'Scenic boat ride across Lake Pichola passing Jag Mandir island and the City Palace.',
      },
      {
        id: 'IN-RJ-UDP-ATT-003',
        name: 'Saheliyon-ki-Bari',
        category: 'Nature / Heritage: Forests & Gardens',
        timings: '08:00–20:00',
        fee: { domestic: 'INR 20', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Saheliyon-ki-Bari_Fountain.JPG/1280px-Saheliyon-ki-Bari_Fountain.JPG',
        photoCredit: 'Wikimedia Commons / Saheliyon-ki-Bari Fountain',
        summary:
          '18th-century royal garden featuring marble fountains, lotus pools, and elephant-shaped water spouts.',
      },
      {
        id: 'IN-RJ-UDP-GEM-001',
        name: 'Sajjangarh Monsoon Palace',
        category: 'Heritage / Nature: Palaces & Forts',
        timings: '08:00–18:00',
        fee: { domestic: 'INR 10 (vehicle fee extra)', foreign: 'INR 100 (vehicle fee extra)' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Monsoon_Palace.jpg',
        photoCredit: 'Wikimedia Commons / Monsoon Palace Sajjangarh',
        summary:
          'Hilltop 19th-century palace perched high on a peak offering panoramic sunset vistas over Udaipur\'s lakes and Aravalli hills.',
      },
    ],
  },
  {
    id: 'jodhpur',
    code: 'IN-RJ-CITY-JDH',
    name: 'Jodhpur',
    nickname: 'The Blue City',
    tagline: 'Colossal Mehrangarh fortress & cobalt Brahmin alleys',
    accentColor: '#1D3557',
    bgGradient: 'from-blue-50 via-indigo-50/40 to-slate-50/30',
    coverImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Mehrangarh',
    flashcardBlurb: 'The Blue City, overlooked by the colossal Mehrangarh Fort towering above cobalt-washed bramhapuri dwellings.',
    topStays: [
      { name: 'Umaid Bhawan Palace', category: 'Ultra Luxury' },
      { name: 'RAAS Jodhpur', category: 'Luxury Boutique Heritage' },
    ],
    dining: {
      veg: [
        { restaurant: 'Janta Sweet Home', location: 'Nai Sarak', specialties: 'Spicy Mirchi Bada, Sweet Mawa Kachori' },
        { restaurant: 'Gypsy Vegetarian Restaurant', location: 'Sardarpura', specialties: 'Grand 31-item Traditional Rajasthani Dining Hall Thali' },
      ],
      nonVeg: [
        { restaurant: 'Darikhana at RAAS', location: 'Stepwell Precinct', specialties: 'Smoked Dal Makhani & Royal Marwari Laal Maas' },
      ],
    },
    attractions: [
      {
        id: 'IN-RJ-JDH-ATT-001',
        name: 'Mehrangarh Fort',
        category: 'Palaces & Forts · Museums',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 100', foreign: 'INR 600' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'One of India’s largest hill forts perched 400 feet above the skyline, featuring imposing ramparts and preserved royal palanquins.',
      },
      {
        id: 'IN-RJ-JDH-ATT-002',
        name: 'Jaswant Thada',
        category: 'Monuments · Historical Buildings',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 30', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'Intricately carved white marble cenotaph built by Maharaja Sardar Singh in 1899, featuring sun-translucent marble sheets.',
      },
      {
        id: 'IN-RJ-JDH-GEM-001',
        name: 'Toorji Ka Jhalra',
        category: 'Archeological Stepwells',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'Restored 1740s geometric stepwell adorned with hand-carved dancing elephants, medieval lions, and waterside cafes.',
      },
    ],
  },
  {
    id: 'jaisalmer',
    code: 'IN-RJ-CITY-JSM',
    name: 'Jaisalmer',
    nickname: 'The Golden City',
    tagline: 'Yellow-sandstone living fort & master-crafted merchant havelis',
    accentColor: '#D4A373',
    bgGradient: 'from-amber-50 via-yellow-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/1280px-Jaisalmer_forteresse.jpg',
    photoCredit: 'Wikimedia Commons / Jaisalmer Fort',
    flashcardBlurb: 'The Golden City, defined by yellow-sandstone ramparts rising above the Thar Desert, living fort communities, and master-crafted merchant havelis.',
    topStays: [
      { name: 'Suryagarh Jaisalmer', category: 'Luxury Heritage' },
      { name: 'Killa Bhawan', category: 'Living Fort Haveli' },
      { name: 'Hotel Pleasant Haveli', category: 'Mid-scale' },
    ],
    dining: {
      veg: [
        { restaurant: 'The Trio', location: 'Gandhi Chowk', specialties: 'Authentic Ker Sangri, Gatta Curry, Bajra Roti' },
        { restaurant: 'Chandan Shree', location: 'Hanuman Circle', specialties: 'Marwari Thali, Khata Dal & Chhena Sweets' },
      ],
      nonVeg: [
        { restaurant: 'Suryagarh Dining Courtyard', location: 'Sam Road', specialties: 'Smoked Desert Mutton, Traditional Laal Maas' },
        { restaurant: 'Freezeking', location: 'Dhibba Para', specialties: 'Fiery Thar Junglee Maas' },
      ],
    },
    attractions: [
      {
        id: 'IN-RJ-JSM-ATT-001',
        name: 'Jaisalmer Fort / Sonar Quila',
        category: 'UNESCO World Heritage · Living Fort',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 50', foreign: 'INR 250' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/1280px-Jaisalmer_forteresse.jpg',
        photoCredit: 'Wikimedia Commons',
        summary: 'One of the few living forts in the world, home to one-fourth of the old city population with medieval Jain temples inside.',
      },
      {
        id: 'IN-RJ-JSM-ATT-002',
        name: 'Patwon Ki Haveli',
        category: 'Historical Buildings · Museums',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 50', foreign: 'INR 150' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/800px-Jaisalmer_forteresse.jpg',
        photoCredit: 'Wikimedia Commons',
        summary: 'Cluster of five opulent 19th-century merchant havelis adorned with lace-like yellow sandstone jharokhas and frescoes.',
      },
      {
        id: 'IN-RJ-JSM-ATT-003',
        name: 'Gadisar Lake',
        category: 'Rivers & Lakes · Historical Sites',
        timings: '06:00–20:00',
        fee: { domestic: 'Free (Boating extra)', foreign: 'Free (Boating extra)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/800px-Jaisalmer_forteresse.jpg',
        photoCredit: 'Wikimedia Commons',
        summary: 'Rainwater conservation lake founded in 1367, surrounded by carved sandstone shrines, chhatris, and the Tillon ki Pol gateway.',
      },
      {
        id: 'IN-RJ-JSM-GEM-001',
        name: 'Kuldhara Abandoned Village',
        category: 'Archeological Ghost Village',
        timings: '08:00–18:00',
        fee: { domestic: 'INR 20', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/800px-Jaisalmer_forteresse.jpg',
        photoCredit: 'Wikimedia Commons',
        summary: 'Eerie, evocative ruins of an 800-year-old Paliwal Brahmin village deserted overnight in the 19th century.',
      },
      {
        id: 'IN-RJ-JSM-GEM-002',
        name: 'Bada Bagh Cenotaphs',
        category: 'Historical Cenotaphs',
        timings: '08:00–18:30',
        fee: { domestic: 'INR 50', foreign: 'INR 100' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Jaisalmer_forteresse.jpg/800px-Jaisalmer_forteresse.jpg',
        photoCredit: 'Wikimedia Commons',
        summary: 'Serene ridge overlooking the desert garden with yellow-stone carved royal chhatris glowing golden in sunset light.',
      },
    ],
  },
  {
    id: 'pushkar',
    code: 'IN-RJ-CITY-PUS',
    name: 'Pushkar',
    nickname: 'Sacred Pilgrimage Oasis',
    tagline: '52 holy lake ghats, rare Brahma shrines & rose cultivation valleys',
    accentColor: '#B5838D',
    bgGradient: 'from-rose-50 via-pink-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Pushkar Ghats',
    flashcardBlurb: 'A sacred desert pilgrimage oasis centered around a holy lake with 52 ghats, rare Brahma shrines, and rose cultivation valleys.',
    topStays: [
      { name: 'Ananta Spa & Resorts', category: 'Luxury Wellness' },
      { name: 'The Westin Pushkar Resort', category: 'Luxury Villa' },
      { name: 'Pushkar Palace', category: 'Lakeside Heritage' },
    ],
    dining: {
      veg: [
        { restaurant: 'Halwai Gali / Radhey Halwai', location: 'Main Bazaar', specialties: 'Crispy Rabdi Malpua, Warm Poha & Kadhi' },
        { restaurant: 'La Pizzeria', location: 'Near Medical Mobile Unit', specialties: 'Wood-fired Italian Pizzas & Fresh Salads' },
      ],
      nonVeg: [],
      peacefulNote: 'Strictly prohibited: Non-vegetarian food and alcohol are legally prohibited across the holy pilgrimage municipality of Pushkar.',
    },
    attractions: [
      {
        id: 'IN-RJ-PUS-ATT-001',
        name: 'Jagatpita Brahma Mandir',
        category: 'Spiritual: Hinduism · Historical Sites',
        timings: '06:30–20:30 (Closed 13:30–15:00)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'One of the few active temples in the world dedicated to Creator God Brahma, marked by its red spire and silver turtle symbol.',
      },
      {
        id: 'IN-RJ-PUS-ATT-002',
        name: 'Pushkar Sarovar & 52 Ghats',
        category: 'Spiritual: Hinduism · Holy Lake',
        timings: '05:00–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'Sacred water body surrounded by 52 bathing ghats where evening maha-aarti bells echo peacefully across the water.',
      },
      {
        id: 'IN-RJ-PUS-GEM-001',
        name: 'Savitri Devi Temple',
        category: 'Spiritual / Adventure · Hiking & Ridge Views',
        timings: '05:00–19:00',
        fee: { domestic: 'Free (Ropeway: ~INR 150–180)', foreign: 'Free (Ropeway: ~INR 150–180)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'Hilltop shrine perched on Ratnagiri hill offering 360-degree sunrise and sunset panoramas over Pushkar lake and sand dunes.',
      },
    ],
  },
  {
    id: 'ranthambore',
    code: 'IN-RJ-CITY-RTH',
    name: 'Ranthambore',
    nickname: 'The Tiger Wilderness',
    tagline: 'Dry deciduous wilderness, Project Tiger habitat & ancient stone citadels',
    accentColor: '#386641',
    bgGradient: 'from-emerald-50 via-stone-50/40 to-amber-50/30',
    coverImage: '/images/rajasthan/ranthambore-tiger-safari.png',
    photoCredit: 'User Photo / Bengal Tiger Safari',
    flashcardBlurb: 'One of northern India’s finest tiger reserves, centered around a majestic 10th-century hilltop fortress, offering thrilling wildlife safaris amidst dry deciduous forests and ancient ruins.',
    topStays: [
      { name: 'The Oberoi Vanyavilas Wildlife Resort', category: 'Luxury tented camp' },
      { name: 'Aman-i-Khas', category: 'Ultra-luxury wilderness retreat' },
      { name: 'Nahargarh Ranthambore', category: 'Heritage Style Resort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Asha Hotel & Restaurant', location: 'Ranthambore Road', specialties: 'Fresh Dal Baati, Spicy Sev Tamatar' },
        { restaurant: 'Resort Dining (Veg)', location: 'Ranthambore Lodges', specialties: 'Gourmet Rajasthani thalis & organic farm dishes' },
      ],
      nonVeg: [
        { restaurant: 'Resort Dining (Non-Veg)', location: 'Ranthambore Lodges', specialties: 'Continental fare, multi-cuisine non-veg dishes & shikar recipes' },
      ],
      peacefulNote: 'Resort dining features gourmet Rajasthani thalis, continental fare, and multi-cuisine non-veg dishes prepared by luxury lodges.',
    },
    attractions: [
      {
        id: 'IN-RJ-RTH-ATT-001',
        name: 'Ranthambore National Park Safari',
        category: 'Nature: Wildlife-Tourism',
        timings: 'Morning (06:30–10:00) & Afternoon (14:30–18:00). Closed July–Sept 30',
        fee: { domestic: 'Safari Booking Fee + Vehicle/Guide charges', foreign: 'Safari Booking Fee + Vehicle/Guide charges' },
        isHiddenGem: false,
        image: '/images/rajasthan/ranthambore-tiger-safari.png',
        photoCredit: 'User Photo / Bengal Tiger Safari',
        summary: 'Open-top Jeep (6-seater) and Canter (20-seater) safaris across distinct zones to spot wild Bengal tigers, leopards, and marsh crocodiles (Pre-booking mandatory).',
      },
      {
        id: 'IN-RJ-RTH-ATT-002',
        name: 'Ranthambore Fort',
        category: 'Heritage: UNESCO World Heritage, Palaces & Forts',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Guide recommended)', foreign: 'Free (Guide recommended)' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'Massive 10th-century hilltop fortress inside the reserve housing ancient temples and historical ruins.',
      },
      {
        id: 'IN-RJ-RTH-ATT-003',
        name: 'Trinetra Ganesh Temple',
        category: 'Spiritual: Hinduism',
        timings: '06:00–19:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'One of the oldest Ganesha temples in Rajasthan, nestled inside the historic Ranthambore Fort.',
      },
      {
        id: 'IN-RJ-RTH-GEM-001',
        name: 'Padam Talao & Jogi Mahal',
        category: 'Nature / Heritage: Rivers & Lakes',
        timings: 'Accessed during core park safaris',
        fee: { domestic: 'Included in safari permit', foreign: 'Included in safari permit' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'The largest lake in the park blanketed with blooming water lilies, overlooked by a historic royal hunting lodge.',
      },
    ],
  },
  {
    id: 'bikaner',
    code: 'IN-RJ-CITY-BKN',
    name: 'Bikaner',
    nickname: 'The Desert Outpost',
    tagline: 'Unbreached red sandstone citadel, camel breeding & merchant havelis',
    accentColor: '#9C6644',
    bgGradient: 'from-amber-50 via-stone-50/40 to-orange-50/30',
    coverImage: '/images/rajasthan/bikaner-lalgarh-palace.png',
    photoCredit: 'User Photo / Lalgarh Palace',
    flashcardBlurb: 'A vibrant royal desert city in northern Rajasthan renowned for its imposing uncaptured palaces, intricate havelis, the legendary Karni Mata rat temple, and delicious Bhujia.',
    topStays: [
      { name: 'Laxmi Niwas Palace', category: 'Lalgarh Complex — Heritage Palace Luxury' },
      { name: 'Narendra Bhawan', category: 'Art deco boutique heritage' },
      { name: 'Hotel Gajner Palace', category: 'Lakefront heritage stay' },
    ],
    dining: {
      veg: [
        { restaurant: 'Chotu Motu Joshi Sweet Mart', location: 'Kote Gate', specialties: 'Famous for hot Kachoris, Rasgullas, and traditional sweets' },
        { restaurant: 'Bikaji Outlets', location: 'Bikaner City', specialties: 'Authentic Bikaneri Bhujia, snacks & sweets' },
      ],
      nonVeg: [
        { restaurant: 'The Rajputana Restaurant', location: 'Laxmi Niwas Palace', specialties: 'Authentic royal non-veg thalis and Laal Maas' },
      ],
    },
    attractions: [
      {
        id: 'IN-RJ-BKN-ATT-001',
        name: 'Junagadh Fort',
        category: 'Heritage: Palaces & Forts',
        timings: '10:00–16:30',
        fee: { domestic: 'INR 50', foreign: 'INR 300' },
        isHiddenGem: false,
        image: '/images/rajasthan/bikaner-junagarh.png',
        photoCredit: 'User Photo / Junagarh Fort',
        summary: 'Imposing 16th-century uncaptured fort featuring stunning courtyards, mirror work, and royal courtyards.',
      },
      {
        id: 'IN-RJ-BKN-ATT-002',
        name: 'Karni Mata Temple (Deshnok)',
        category: 'Spiritual: Hinduism',
        timings: '04:00–22:00',
        fee: { domestic: 'Free (Camera fee extra)', foreign: 'Free (Camera fee extra)' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'Globally famous temple 30 km from Bikaner where thousands of sacred black rats roam freely and are revered.',
      },
      {
        id: 'IN-RJ-BKN-ATT-003',
        name: 'Lalgarh Palace & Museum',
        category: 'Heritage: Palaces & Forts',
        timings: '10:00–17:00 (Closed Sundays)',
        fee: { domestic: 'INR 50', foreign: 'INR 50' },
        isHiddenGem: false,
        image: '/images/rajasthan/bikaner-lalgarh-palace.png',
        photoCredit: 'User Photo / Lalgarh Palace',
        summary: 'Grand red sandstone architectural marvel built in Indo-Saracenic style by Maharaja Ganga Singh.',
      },
      {
        id: 'IN-RJ-BKN-GEM-001',
        name: 'Bhandasar Jain Temple',
        category: 'Spiritual / Heritage: Jainism',
        timings: '05:00–13:00 & 16:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: '16th-century 3-story temple famous for its rich gold leaf paintings and the legend that ghee was used instead of mortar in its foundation.',
      },
    ],
  },
  {
    id: 'chittorgarh',
    code: 'IN-RJ-CITY-CTR',
    name: 'Chittorgarh',
    nickname: 'Citadel of Valour',
    tagline: 'India’s largest hill fort, legendary victory towers & sacred stepped pools',
    accentColor: '#BC4749',
    bgGradient: 'from-rose-50 via-amber-50/40 to-stone-50/30',
    coverImage: '/images/rajasthan/chittorgarh-vijaya-stambha.png',
    photoCredit: 'User Photo / Vijaya Stambha',
    flashcardBlurb: 'The epitome of Rajput valour, romance, and sacrifice, anchored by India\'s largest fort sprawled across a steep 7-kilometer-long hill overlooking the Berach River.',
    topStays: [
      { name: 'Hotel Panna', category: 'RTDC - State tourism' },
      { name: 'Amritara Chandra Mahal Haveli', category: 'Heritage Haveli' },
      { name: 'Hotel Meera', category: 'City Comfort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Govind Restaurant', location: 'Near Fort', specialties: 'Authentic Rajasthani Dal Baati Churma and thalis' },
        { restaurant: 'Nakoda Dining Hall', location: 'Fort Road', specialties: 'Marwari and Gujarati Thali' },
      ],
      nonVeg: [
        { restaurant: 'Local Town Dhabas', location: 'Chittorgarh Town', specialties: 'Spicy Rajasthani Laal Maas and non-veg curries' },
      ],
    },
    attractions: [
      {
        id: 'IN-RJ-CTR-ATT-001',
        name: 'Chittorgarh Fort Complex',
        category: 'Heritage: UNESCO World Heritage, Palaces & Forts',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 40', foreign: 'INR 600' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'Sprawling massive fort containing Rana Kumbha Palace, Padmini Palace, and ancient water reservoirs.',
      },
      {
        id: 'IN-RJ-CTR-ATT-002',
        name: 'Vijaya Stambha (Tower of Victory)',
        category: 'Heritage: Monuments',
        timings: '09:00–18:00',
        fee: { domestic: 'Covered in fort entry', foreign: 'Covered in fort entry' },
        isHiddenGem: false,
        image: '/images/rajasthan/chittorgarh-vijaya-stambha.png',
        photoCredit: 'User Photo / Vijaya Stambha',
        summary: '37-meter high 9-story tower built by Maharana Kumbha in 1448 to commemorate his victory over Malwa forces.',
      },
      {
        id: 'IN-RJ-CTR-ATT-003',
        name: 'Kirti Stambha (Tower of Fame)',
        category: 'Heritage: Monuments',
        timings: '09:00–18:00',
        fee: { domestic: 'Covered in fort entry', foreign: 'Covered in fort entry' },
        isHiddenGem: false,
        image: '/images/rajasthan/chittorgarh-vijay-stambh.png',
        photoCredit: 'Wikimedia / Kirti Stambha',
        summary: '12th-century tower dedicated to Adinath, the first Jain Tirthankara, adorned with naked figures of Jain deities.',
      },
      {
        id: 'IN-RJ-CTR-GEM-001',
        name: 'Kalika Mata Temple',
        category: 'Spiritual / Heritage: Hinduism',
        timings: '06:00–19:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'Originally built as an 8th-century Sun temple before being dedicated to Goddess Kali.',
      },
    ],
  },
  {
    id: 'mount-abu',
    code: 'IN-RJ-CITY-MBU',
    name: 'Mount Abu',
    nickname: 'Aravalli Hill Sanctuary',
    tagline: 'Rajasthan’s sole hill station, Dilwara marble poetry & forested crags',
    accentColor: '#4A7C59',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: '/images/rajasthan/mount-abu-nakki-lake.png',
    photoCredit: 'User Photo / Nakki Lake Boating',
    flashcardBlurb: 'Rajasthan’s only hill station, perched high on the Aravalli range, celebrated for its cool climate, serene lakes, dense evergreen forests, and the world-renowned marble architecture of the Dilwara Temples.',
    topStays: [
      { name: 'Cama Rajputana Club Resort', category: 'Heritage colonial stay' },
      { name: 'Palace Hotel (Bikaner House)', category: 'Royal heritage' },
      { name: 'Hotel Hillock', category: 'Hillside Comfort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Shikhar Restaurant', location: 'Nakki Lake', specialties: 'Gujarati and North Indian thalis' },
        { restaurant: 'Saroj Restaurant', location: 'Main Market', specialties: 'Pure vegetarian regional snacks and meals' },
      ],
      nonVeg: [
        { restaurant: 'Resort & Hill Hotel Dining', location: 'Mount Abu Resorts', specialties: 'Standard North Indian and Continental non-veg dishes (restricted in central temple zones)' },
      ],
      peacefulNote: 'Mount Abu has restricted non-veg options in central temple zones; resorts and select hill hotels offer standard non-veg dishes.',
    },
    attractions: [
      {
        id: 'IN-RJ-MBU-ATT-001',
        name: 'Dilwara Temples',
        category: 'Spiritual / Heritage: Jainism',
        timings: '12:00–17:00 (Morning hours reserved for Jains)',
        fee: { domestic: 'Free (Audio guides available; photography prohibited)', foreign: 'Free (Audio guides available; photography prohibited)' },
        isHiddenGem: false,
        image: '/images/rajasthan/mount-abu-dilwara.png',
        photoCredit: 'Wikimedia Commons / Dilwara Temples',
        summary: '11th-to-13th century marble temples famed for extraordinarily intricate, translucent ceiling carvings and peerless marble craftsmanship.',
      },
      {
        id: 'IN-RJ-MBU-ATT-002',
        name: 'Nakki Lake Boating',
        category: 'Nature / Recreation: Rivers & Lakes',
        timings: '09:30–18:00',
        fee: { domestic: 'Boating ~INR 100–300 per boat', foreign: 'Boating ~INR 100–300 per boat' },
        isHiddenGem: false,
        image: '/images/rajasthan/mount-abu-nakki-lake.png',
        photoCredit: 'User Photo / Nakki Lake Boating',
        summary: 'An ancient sacred lake surrounded by hills and unique rock formations like Toad Rock, offering paddle and row boats.',
      },
      {
        id: 'IN-RJ-MBU-ATT-003',
        name: 'Guru Shikhar',
        category: 'Nature / Spiritual: Hills & Mountains',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'The highest peak in the Aravalli range (1,722 meters) housing a temple dedicated to Dattatreya and sweeping panoramic vistas.',
      },
      {
        id: 'IN-RJ-MBU-GEM-001',
        name: "Trevor's Tank",
        category: 'Nature: Wildlife-Tourism',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 30 + Vehicle fee', foreign: 'INR 30 + Vehicle fee' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash',
        summary: 'A secluded crocodile breeding park and wooded nature spot ideal for birdwatching and quiet walks amidst lush green hills.',
      },
    ],
  },
];
