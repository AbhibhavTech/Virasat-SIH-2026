export interface TripuraStay {
  name: string;
  category: string;
}

export interface TripuraFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface TripuraDining {
  veg: TripuraFoodSpot[];
  nonVeg: TripuraFoodSpot[];
  tribalHeritageNote?: string;
  peacefulNote?: string;
}

export interface TripuraAttraction {
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

export interface TripuraCity {
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
  topStays: TripuraStay[];
  dining: TripuraDining;
  attractions: TripuraAttraction[];
}

export const TRIPURA_DIRECTORY: TripuraCity[] = [
  {
    id: 'agartala',
    code: 'IN-TR-CITY-IXA',
    name: 'Agartala',
    nickname: 'City of Royal Manikya Palaces',
    tagline: 'Indo-Saracenic royal architecture, pristine city lakes, and fraternal Indo-Bangladesh border heritage',
    accentColor: '#9F1239',
    bgGradient: 'from-rose-50 via-amber-50/40 to-stone-50/30',
    coverImage: '/images/tripura/agartala-ujjayanta-palace.jpg',
    photoCredit: 'Discover Bharat / Ujjayanta Palace Frontage & Reflection Pools',
    flashcardBlurb:
      'The capital of Tripura, blending a rich Manikya dynasty royal heritage with tranquil lakes, Indo-Saracenic architecture, and proximity to the Bangladesh border.',
    topStays: [
      { name: 'Hotel Polo Towers', category: 'VIP Road — 5-Star Luxury' },
      { name: 'Ginger Agartala', category: 'Khejur Bagan — Premium Comfort' },
      { name: 'Hotel Sonar Tori', category: 'Fire Brigade Square — Upscale Business Hotel' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Kurry Klub',
          location: 'Hotel Polo Towers, VIP Road',
          specialties: 'Premium North Indian, Dal Makhani, Paneer Lababdar & Continental sizzlers',
        },
        {
          restaurant: 'Rajdhani Thali Restaurant',
          location: 'B.K. Road',
          specialties: 'Authentic Gujarati & Bengali vegetarian thalis, Kachori, and afternoon snacks',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Abhishek Restaurant',
          location: 'B.K. Road',
          specialties: 'Traditional Tripuri Mui Borok, bamboo shoot pork curry, and fresh river fish curries',
        },
        {
          restaurant: 'The Manikya Court',
          location: 'Palace Compound',
          specialties: 'Traditional Bengali Ilish macher paturi, Kosha Mangsho, and Mughlai biryani',
        },
      ],
      tribalHeritageNote:
        'Tripuri culinary culture features iconic fermented fish (Berma), fresh bamboo shoots, and indigenous herbs cooked without oil.',
      peacefulNote:
        'Agartala harmoniously bridges classical Bengali culinary artistry with indigenous Borok tribal flavors.',
    },
    attractions: [
      {
        id: 'IN-TR-IXA-ATT-001',
        name: 'Ujjayanta Palace (Tripura State Museum)',
        category: 'Heritage / Arts: Palaces & Forts, Museums',
        timings: '10:15–17:15 (Closed Mondays and public holidays; Laser show at dusk)',
        fee: {
          domestic: 'INR 50 (Museum) / INR 100 (Laser Show)',
          foreign: 'INR 250 (Museum) / INR 100 (Laser Show)',
        },
        isHiddenGem: false,
        image: '/images/tripura/agartala-ujjayanta-palace.jpg',
        photoCredit: 'Discover Bharat / Ujjayanta Palace',
        summary:
          'Constructed in 1901 by Maharaja Radha Kishore Manikya, this gleaming white Indo-Saracenic royal residence spans Mughal-inspired water gardens and now houses Northeast India’s largest state museum displaying regal antiquities, tribal ethnographic collections, and exquisite terracotta art.',
      },
      {
        id: 'IN-TR-IXA-ATT-002',
        name: 'Akhaura Integrated Check Post (Indo-Bangladesh Border)',
        category: 'Heritage: International Borders, Living Traditions',
        timings: '16:30–17:30 (Ceremony timing varies slightly according to sunset)',
        fee: {
          domestic: 'Free (Valid Government ID required)',
          foreign: 'Free (Passport required)',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Akhaura Border ICP',
        summary:
          'Witness the joint evening Beating Retreat ceremony conducted harmoniously by India’s Border Security Force (BSF) and Border Guard Bangladesh (BGB). Unlike the intense Wagah ceremony in Punjab, Akhaura is celebrated for its fraternal, celebratory atmosphere commemorating deep shared cultural ties.',
      },
      {
        id: 'IN-TR-IXA-ATT-003',
        name: 'Heritage Park',
        category: 'Nature / Heritage: Forests & Gardens, Architectural Models',
        timings: '10:00–19:00 (Open all days)',
        fee: {
          domestic: 'INR 10–20',
          foreign: 'INR 50',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Heritage Park Agartala',
        summary:
          'A lush 12-acre botanical wonderland showcasing meticulously sculpted miniature models of all major Tripura landmarks including Neermahal, Unakoti carvings, and Ujjayanta Palace, nestled among indigenous trees, bamboo groves, and amphitheatre walkways.',
      },
      {
        id: 'IN-TR-IXA-GEM-001',
        name: 'Chaturdasha Devata Temple, Old Agartala',
        category: 'Spiritual: Hinduism, Ancient Dynastic Temples',
        timings: '06:00–20:00 (Morning Aarti 07:00, Sandhya Aarti 18:30)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / 14 Gods Temple Khayerpur',
        summary:
          'Located in Khayerpur (Old Agartala), this consecrated 18th-century sanctuary honors the 14 indigenous tutelary deities of the Manikya royalty. It serves as the spiritual epicenter for the celebrated week-long Kharchi Puja in July, drawing hundreds of thousands of tribal and non-tribal devotees.',
      },
      {
        id: 'IN-TR-IXA-GEM-002',
        name: 'Tripura Sundari Temple (Matabari), Udaipur',
        category: 'Spiritual: Hinduism, 51 Shakti Peethas',
        timings: '06:00–21:00 (Kalyan Sagar lake open all day)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Matabari Shakti Peeth',
        summary:
          'Perched on a small hillock resembling a tortoise back (Kurma Pitha) approximately 55 km south of Agartala in Udaipur, this 500-year-old sanctum was established by Maharaja Dhanya Manikya in 1501 CE. Revering Goddess Tripureshwari where Sati’s right foot fell, it is flanked by the sacred Kalyan Sagar lake filled with giant Bostami turtles.',
      },
    ],
  },
  {
    id: 'unakoti',
    code: 'IN-TR-CITY-UNK',
    name: 'Unakoti',
    nickname: 'One Less Than a Crore Sacred Carvings',
    tagline: 'Colossal 8th-century rock-cut Shiva bas-reliefs, mountain cascades & ancient Shaivite sanctuary',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-emerald-50/40 to-stone-50/30',
    coverImage: '/images/tripura/unakoti-rock-carvings.jpg',
    photoCredit: 'Discover Bharat / Unakotiswara Kal Bhairava 30-Foot Bas Relief',
    flashcardBlurb:
      'A mystical, densely forested pilgrimage site renowned for its massive 8th to 9th-century rock-cut bas-reliefs of Hindu deities scattered across steep mountain walls.',
    topStays: [
      { name: 'Unakoti Tourist Lodge', category: 'Kailashahar — State-Run Heritage Gateway Lodging' },
      { name: 'Hotel Nirmala', category: 'Kailashahar — Clean Town Center Budget Comfort' },
      { name: 'Hotel Royal Palace', category: 'Dharmanagar — Railhead Gateway Comfort (20 km away)' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Tourist Lodge Canteens',
          location: 'Kailashahar / Unakoti Foothills',
          specialties: 'Wholesome Bengali vegetarian thalis, fresh seasonal bhorta, Dal, and steamed rice',
        },
        {
          restaurant: 'Kalpataru Sweets & Eatery',
          location: 'Main Road, Kailashahar',
          specialties: 'Luchi Alur Dom, traditional Bengali Mishti Doi, Rasgulla, and afternoon Puri Sabzi',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Maa Annapurna Restaurant',
          location: 'Kailashahar Town',
          specialties: 'Fresh local river Katla & Rui macher jhol, spicy country chicken curry, and steamed rice',
        },
        {
          restaurant: 'Highway Food Plaza',
          location: 'Kailashahar-Kumarghat Road',
          specialties: 'Bengali fish thalis, egg curry, and authentic local roadside snacks',
        },
      ],
      tribalHeritageNote:
        'Local Kailashahar and Kumarghat kitchens offer simple, wholesome river catches and organic hill-grown produce.',
      peacefulNote:
        'Visiting during the early morning hours provides meditative silence interrupted only by jungle songbirds and flowing streams.',
    },
    attractions: [
      {
        id: 'IN-TR-UNK-ATT-001',
        name: 'Unakoti Rock Carvings & Kal Bhairava Head',
        category: 'Heritage / Spiritual: Archaeological Sites, UNESCO Tentative List',
        timings: '06:00–18:00 (Daylight hours recommended for mountain stairs)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: '/images/tripura/unakoti-rock-carvings.jpg',
        photoCredit: 'Discover Bharat / Unakoti Rock-Cut Sculptures',
        summary:
          'Literally translating to "one less than a crore" (99,99,999), this spellbinding open-air Shaivite sanctuary carved onto vertical cliff faces dates back to the 8th–9th centuries. The centerpiece is the colossal 30-foot-high Unakotiswara Kal Bhairava head, flanked by life-sized bas-reliefs of Goddess Durga on a lion and multi-armed Ganesha.',
      },
      {
        id: 'IN-TR-UNK-ATT-002',
        name: 'Unakoti Waterfalls & Forest Trails',
        category: 'Nature / Adventure: Rivers & Lakes, Hiking & Trekking',
        timings: 'Daylight hours (06:00–17:30)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Unakoti Stream & Cascades',
        summary:
          'Natural mountain springs and perennial streams tumble across the archaeological rock face into deep emerald pools. Picturesque stone trails and pedestrian bridges meander beneath towering canopies of bamboo and wild banana groves, offering soothing nature walks beside the carved cliff faces.',
      },
      {
        id: 'IN-TR-UNK-GEM-001',
        name: 'Bhavatarini Mandir, Kumarghat',
        category: 'Spiritual: Hinduism, Historic Kali Sanctuaries',
        timings: '06:00–19:00 (Open all days)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Bhavatarini Mandir Kumarghat',
        summary:
          'Established in 1932 along the transit corridor between Kumarghat and Unakoti, this peaceful terracotta-embellished Kali temple is surrounded by manicured floral gardens and provides a serene meditative wayside stop for travelers en route to the archaeological hills.',
      },
      {
        id: 'IN-TR-UNK-GEM-002',
        name: 'Tea Gardens of Kailashahar',
        category: 'Nature / Rural: Agro-Tourism, Manicured Plantations',
        timings: '08:00–16:30 (Daylight visits)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Kailashahar Tea Estates',
        summary:
          'Sprawling emerald tea estates carpet the gentle hillocks flanking Kailashahar. Established over a century ago, these unhurried plantations offer refreshing strolls amidst lush tea bushes, framed by views of the distant Bangladesh plains and Raghunandan hill ranges.',
      },
    ],
  },
  {
    id: 'neermahal',
    code: 'IN-TR-CITY-NML',
    name: 'Neermahal & Melaghar',
    nickname: 'Lake Palace of Eastern India',
    tagline: 'Floating marble marvel in Rudrasagar Lake, Ramsar wetlands, and annual autumn boat races',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-50 via-teal-50/40 to-stone-50/30',
    coverImage: '/images/tripura/neermahal-water-palace.jpg',
    photoCredit: 'Discover Bharat / Neermahal Floating Palace on Rudrasagar Lake',
    flashcardBlurb:
      "Eastern India's only water palace, an architectural masterpiece of red and white sandstone floating gracefully in the center of the expansive Rudrasagar Lake.",
    topStays: [
      { name: 'Sagarmahal Tourist Lodge', category: 'Melaghar — State-Run Property Right on Lake Rudrasagar' },
      { name: 'Gomati Tourist Lodge', category: 'Udaipur — Nearby Comfortable Transit Base (23 km away)' },
      { name: 'Rajdhani Guest House', category: 'Melaghar — Lakeside Budget Transit Stay' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Sagarmahal Lodge Dining',
          location: 'Rudrasagar Lake Frontage, Melaghar',
          specialties: 'Traditional Bengali vegetarian thali, Shukto, Moong Dal with roasted spices, and Aloo Posto',
        },
        {
          restaurant: 'Anandamoyee Bhojanalaya',
          location: 'Melaghar Town Bazaar',
          specialties: 'Simple home-style vegetarian meals, seasonal vegetable curry, and piping-hot kachoris',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Local Melaghar Lake Stalls',
          location: 'Rudrasagar Boating Jetty',
          specialties: 'Freshly netted Rudrasagar lake fish fry (Pabda, Chitol, Rui), served with steaming rice',
        },
        {
          restaurant: 'Lake View Dhaba',
          location: 'Melaghar-Sonamura Road',
          specialties: 'Spicy mustard fish curry, local duck roast, and traditional Bengali egg thali',
        },
      ],
      tribalHeritageNote:
        'Rudrasagar lake sustains abundant endemic freshwater fish, creating one of Tripura’s freshest culinary fish belts.',
      peacefulNote:
        'Enjoying afternoon tea on the veranda of Sagarmahal overlooking the crimson water palace is a quintessential Tripura experience.',
    },
    attractions: [
      {
        id: 'IN-TR-NML-ATT-001',
        name: 'Neermahal Water Palace',
        category: 'Heritage: Palaces & Forts, Royal Architecture',
        timings: '09:00–17:00 (Extended to 18:00 during summer March–September)',
        fee: {
          domestic: 'INR 80 (Palace entry fee)',
          foreign: 'INR 200 (Palace entry fee)',
        },
        isHiddenGem: false,
        image: '/images/tripura/neermahal-water-palace.jpg',
        photoCredit: 'Discover Bharat / Neermahal Water Palace',
        summary:
          'Built in 1930 by Maharaja Bir Bikram Kishore Manikya as his regal summer retreat, this breathtaking water palace is eastern India’s counterpart to Udaipur’s Lake Palace. Constructed with red sandstone bases and gleaming white domes, it harmonizes Hindu Rajput oriels with Islamic archways and defensive water bastions.',
      },
      {
        id: 'IN-TR-NML-ATT-002',
        name: 'Rudrasagar Lake Boating & Ramsar Wetland',
        category: 'Nature: Rivers & Lakes, Wetland Conservation',
        timings: '09:00–17:00 (Boats operate frequently throughout the day)',
        fee: {
          domestic: 'INR 20 (Motorboat per head) / ~INR 300 (Country boat charter)',
          foreign: 'INR 20 (Motorboat per head) / ~INR 300 (Country boat charter)',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Rudrasagar Lake Boats',
        summary:
          'Designated as an internationally protected Ramsar Wetland site, the shallow 5.3 sq km Rudrasagar lake is fed by three hill rivers. The breezy 15-minute boat voyage across open waters provides unmatched vistas of the palace reflection and abundant migratory birds during winter months.',
      },
      {
        id: 'IN-TR-NML-GEM-001',
        name: 'Melaghar Ratha Yatra & Traditional Boat Race',
        category: 'Rural / Recreation: Living Traditions, Cultural Festivals',
        timings: 'Seasonal (Annual Neermahal Festival in August/September & July Ratha Yatra)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Neermahal Water Festival',
        summary:
          'Melaghar hosts the second-largest Ratha Yatra celebration in eastern India after Puri, along with the thrilling Neermahal Water Festival. Hundreds of energetic oarsmen row decorated traditional long canoes in adrenaline-packed dragon-boat style races across Rudrasagar lake.',
      },
      {
        id: 'IN-TR-NML-GEM-002',
        name: 'Kasba Kali Bari, Kamalasagar',
        category: 'Heritage / Spiritual: Hilltop Border Shrines',
        timings: '06:00–19:30 (Best visited at sunset)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Kasba Kali Bari',
        summary:
          'Perched atop a scenic hillock beside the grand Kamalasagar artificial lake (excavated in the 15th century by Maharaja Dhanya Manikya), this sacred Kali shrine sits directly opposite the Bangladesh international boundary fence, offering panoramic vistas across lush border paddy plains.',
      },
    ],
  },
  {
    id: 'jampui-hills',
    code: 'IN-TR-CITY-JMP',
    name: 'Jampui Hills',
    nickname: 'Eternal Hills of Spring',
    tagline: 'Tripura’s highest misty ridge, vibrant Mizo culture, orange groves & panoramic border sunsets',
    accentColor: '#15803D',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: '/images/tripura/jampui-hills-panoramic-view.png',
    photoCredit: 'Discover Bharat / Jampui Hills Valley & River Panorama',
    flashcardBlurb:
      'The "Eternal Hills of Spring," Tripura’s highest hill range standing at 3,000 feet, known for its Mizo culture, vibrant orange orchards, and sweeping panoramic vistas.',
    topStays: [
      { name: 'Eden Tourist Lodge', category: 'Vanghmun — State-Run TTDC Property with Premier Valley Views' },
      { name: 'Jampui Hills Sshotel', category: 'Kawnpui — Scenic Hillside Lodge' },
      { name: 'Blue Mountain Homestay', category: 'Vanghmun — Authentic Mizo Community Hospitality' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Eden Lodge Dining Hall',
          location: 'Vanghmun Summit',
          specialties: 'Simple homestyle dal, steamed mountain rice, seasonal wild greens, and fresh vegetable stew',
        },
        {
          restaurant: 'Vanghmun Village Homestay Kitchens',
          location: 'Vanghmun Village',
          specialties: 'Organic garden greens, fresh bamboo shoot preparations (Utong), and boiled herbal broths',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Local Mizo Homestays',
          location: 'Vanghmun & Kawnpui Villages',
          specialties: 'Authentic Mizo smoked pork with fermented bamboo shoot, boiled herbal chicken (Vawksa Rep), and roasted meats',
        },
        {
          restaurant: 'Hill View Ethnic Eatery',
          location: 'Kanchanpur Road, Jampui',
          specialties: 'Traditional Mizo Bai stew, country fowl curry, and fragrant local hill rice',
        },
      ],
      tribalHeritageNote:
        'The Lushai/Mizo community in Jampui Hills prepares organic, oil-free broths utilizing indigenous mountain herbs and woodfire smoking.',
      peacefulNote:
        'Vanghmun has earned acclaim as Tripura’s cleanest village, where residents actively maintain flower-lined walking paths and immaculate courtyards.',
    },
    attractions: [
      {
        id: 'IN-TR-JMP-ATT-001',
        name: 'Betlingchhip (Thaidawr) Peak',
        category: 'Nature / Adventure: Hills & Mountains, Hiking & Trekking',
        timings: 'Daylight hours (05:30–17:30; Best early morning or sunset)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: '/images/tripura/jampui-hills-panoramic-view.png',
        photoCredit: 'Discover Bharat / Betlingchhip Peak Valley Panorama',
        summary:
          'Standing at 930 metres (3,051 feet) above sea level, Betlingchhip is the highest geographical summit in Tripura. A modern multi-tier watchtower at the crest provides spectacular 360-degree vistas stretching across the rolling Shivalik-like hills into the Chittagong Hill Tracts of Bangladesh and the Lushai hills of Mizoram.',
      },
      {
        id: 'IN-TR-JMP-ATT-002',
        name: 'Vanghmun Village & Orange Orchards',
        category: 'Rural / Nature: Agro-Tourism, Live Like a Local',
        timings: '07:00–17:00 (Peak orange bloom and harvest October to December)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Vanghmun Village Orchards',
        summary:
          'Celebrated as the cleanest and most picturesque village in Tripura, Vanghmun features charming wooden Mizo cottages with blooming orchid gardens. During November, the hills turn bright gold during the annual Orange Festival celebrating bountiful citrus harvests.',
      },
      {
        id: 'IN-TR-JMP-GEM-001',
        name: 'Sabual & Phuldungsei Border Villages',
        category: 'Rural: Live Like a Local, Borderline Settlements',
        timings: 'Daylight hours (06:00–18:00)',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Phuldungsei Border Hamlet',
        summary:
          'Fascinating borderline hamlets perched on the razor ridge between Tripura and Mizoram. In Phuldungsei, one side of the village street technically rests in Tripura while the other lies in Mizoram, showcasing harmonious inter-community solidarity and rich Presbyterian choral traditions.',
      },
      {
        id: 'IN-TR-JMP-GEM-002',
        name: 'Kanchanpur Sunrise Viewpoint',
        category: 'Nature / Scenic: Valley Overlooks & Cloud Inversions',
        timings: '05:00–07:30 & 16:30–18:00',
        fee: {
          domestic: 'Free',
          foreign: 'Free',
        },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Virasat Archive / Jampui Sunrise Ridge',
        summary:
          'A quiet roadside ridge along the winding Kanchanpur-Vanghmun highway where travelers witness breathtaking morning cloud inversions, where the entire river valley below resembles a vast white sea of cotton mist beneath emerging golden sunlight.',
      },
    ],
  },
];
