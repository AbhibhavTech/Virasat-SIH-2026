export interface TamilNaduStay {
  name: string;
  category: string;
}

export interface TamilNaduFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface TamilNaduDining {
  veg: TamilNaduFoodSpot[];
  nonVeg: TamilNaduFoodSpot[];
  peacefulNote?: string;
}

export interface TamilNaduAttraction {
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

export interface TamilNaduCity {
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
  topStays: TamilNaduStay[];
  dining: TamilNaduDining;
  attractions: TamilNaduAttraction[];
}

export const TAMIL_NADU_DIRECTORY: TamilNaduCity[] = [
  {
    id: 'chennai',
    code: 'IN-TN-CITY-MAA',
    name: 'Chennai',
    nickname: 'Cultural Gateway of South India',
    tagline: 'Carnatic music traditions, Dravidian gopurams & colonial seaside ramparts',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Mylapore Temple',
    flashcardBlurb:
      'The cultural gateway of South India, bridging classical Carnatic and Bharatanatyam traditions with British colonial fortresses, Dravidian temple towers, and urban shorelines.',
    topStays: [
      { name: 'Taj Coromandel', category: 'Nungambakkam — Luxury Heritage' },
      { name: 'The Leela Palace Chennai', category: 'MRC Nagar — Seafront Modern Luxury' },
      { name: 'ITC Grand Chola', category: 'Guindy — Chola-inspired Grandeur' },
    ],
    dining: {
      veg: [
        { restaurant: 'Murugan Idli Shop', location: 'Besant Nagar / T. Nagar', specialties: 'Steaming Podi Idli with spicy gun powder, Crisp Ghee Podi Dosa & four signature chutneys' },
        { restaurant: 'Ratna Cafe', location: 'Triplicane', specialties: 'Legendary Sambar Idli bowl served piping hot since 1948, traditional filter coffee' },
      ],
      nonVeg: [
        { restaurant: 'Anjappar Chettinad Restaurant', location: 'T. Nagar', specialties: 'Fiery Chettinad Pepper Chicken, Nattu Kozhi (Country Chicken) Biryani & Crab Roast' },
        { restaurant: 'Buhari Restaurant', location: 'Mount Road', specialties: 'Historic 1965 birthplace and original recipe of the world-famous Chicken 65' },
      ],
      peacefulNote: 'Chennai cuisine is revered for slow-dripped degree filter kaapi, fragrant shallot sambar, freshly ground Chettinad black pepper, and banana-leaf hospitality.',
    },
    attractions: [
      {
        id: 'IN-TN-MAA-ATT-001',
        name: 'Kapaleeshwarar Temple, Mylapore',
        category: 'Spiritual / Heritage · Hinduism, Dravidian Architecture & Sacred Tanks',
        timings: '05:30–12:30 & 16:00–21:30',
        fee: { domestic: 'Free (Special Darshan INR 50)', foreign: 'Free (Special Darshan INR 50)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Kapaleeshwarar_Temple_Mylapore_Chennai.jpg/1280px-Kapaleeshwarar_Temple_Mylapore_Chennai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '7th-century Dravidian temple complex dedicated to Lord Shiva, celebrated for its 37-meter rainbow-hued gopuram sculpted with mythological pantheons and an expansive sacred temple tank.',
      },
      {
        id: 'IN-TN-MAA-ATT-002',
        name: 'San Thome Basilica',
        category: 'Heritage / Spiritual · Christianity & Neo-Gothic Basilica',
        timings: '06:00–21:00 (Museum: 09:00–18:00)',
        fee: { domestic: 'Free (Museum nominal: INR 10)', foreign: 'Free (Museum nominal: INR 10)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/San_Thome_Basilica%2C_Chennai.jpg/1280px-San_Thome_Basilica%2C_Chennai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Stately 16th-century Neo-Gothic cathedral built by Portuguese explorers over the burial site of St. Thomas the Apostle, one of only three basilicas in the world built over an apostle’s tomb.',
      },
      {
        id: 'IN-TN-MAA-ATT-003',
        name: "Fort St. George & St. Mary's Church",
        category: 'Heritage · Historical Buildings, Museums & Coastal Fortresses',
        timings: '09:00–17:00 (Closed Fridays)',
        fee: { domestic: 'INR 25', foreign: 'INR 300' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Fort_St_George_Chennai.jpg/1280px-Fort_St_George_Chennai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The oldest English fortress in India founded in 1644, containing the Fort Museum with Raj-era weaponry and St. Mary’s Church—the oldest Anglican church east of the Suez Canal.',
      },
      {
        id: 'IN-TN-MAA-ATT-004',
        name: 'Marina Beach & Promenade',
        category: 'Nature / Recreation · Beaches & Cruises, City Promenade',
        timings: 'Open 24 Hours (Lighthouse: 10:00–13:00 & 15:00–17:00, closed Mon)',
        fee: { domestic: 'Free (Lighthouse: INR 20)', foreign: 'Free (Lighthouse: INR 20)' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Marina Beach',
        summary:
          'One of the world’s longest natural urban beaches stretching 13 km along the Coromandel Coast, alive with evening sundown stalls, historical statues, and an operating observation lighthouse.',
      },
      {
        id: 'IN-TN-MAA-GEM-001',
        name: 'Theosophical Society & 450-Year-Old Adyar Banyan Tree',
        category: 'Nature / Spiritual · Forests & Gardens, Historic Flora & Meditation',
        timings: '08:30–10:00 & 14:00–16:00 (Closed Sundays)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Adyar_Banyan_Tree.jpg/1280px-Adyar_Banyan_Tree.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A tranquil 260-acre green woodland sanctuary along the Adyar River, housing one of India’s largest living banyan trees whose canopy spreads over 40,000 square feet.',
      },
      {
        id: 'IN-TN-MAA-GEM-002',
        name: 'DakshinaChitra Heritage Living Museum',
        category: 'Rural / Arts · Crafts-Tourism, Live Like a Local & Vernacular Architecture',
        timings: '10:00–18:00 (Closed Tuesdays)',
        fee: { domestic: 'INR 175', foreign: 'INR 350' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/DakshinaChitra_Heritage_Museum.jpg/1280px-DakshinaChitra_Heritage_Museum.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Cross-cultural living museum on the East Coast Road featuring 18 authentic transplanted heritage houses from Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh with resident folk artisans.',
      },
    ],
  },
  {
    id: 'madurai',
    code: 'IN-TN-CITY-IXM',
    name: 'Madurai',
    nickname: 'The Athens of the East',
    tagline: '2,500 years of unbroken living Tamil heritage & lotus temple citadel',
    accentColor: '#9A3412',
    bgGradient: 'from-orange-50 via-rose-50/40 to-amber-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Madurai_Meenakshi_Amman_Temple_Towers.jpg/1280px-Madurai_Meenakshi_Amman_Temple_Towers.jpg',
    photoCredit: 'Wikimedia Commons / Meenakshi Temple',
    flashcardBlurb:
      'The ancient "Athens of the East" and lotus-shaped temple citadel on the Vaigai River, boasting 2,500 years of unbroken living Tamil culture.',
    topStays: [
      { name: 'Heritage Madurai', category: 'Kochadai — Geoffrey Bawa-designed Luxury Resort' },
      { name: 'Gateway Hotel Pasumalai', category: 'Taj Group — Hillside Heritage' },
      { name: 'Courtyard by Marriott Madurai', category: 'City Central Modern Luxury' },
    ],
    dining: {
      veg: [
        { restaurant: 'Sree Sabarees', location: 'Near West Tower', specialties: 'Crispy Ghee Roast Dosa, Poori Masala, hot Pongal & filter coffee' },
        { restaurant: 'Modern Restaurant', location: 'Netaji Road', specialties: 'Authentic traditional Madurai vegetarian meals served on fresh plantain leaves' },
      ],
      nonVeg: [
        { restaurant: 'Amma Mess', location: 'Alagar Kovil Road', specialties: 'Celebrated Bone Marrow Omelette, Kola Urundai (Mutton Meatballs) & Meen Kuzhambu' },
        { restaurant: 'Kumar Mess', location: 'K.K. Nagar', specialties: 'Famous Madurai Mutton Kari Dosa, spicy Viral Fish Fry & Ayirai Meen Kozhambu' },
      ],
      peacefulNote: 'Madurai street cuisine is world-renowned for its legendary night messes, spiced Kari Dosas, fluffy Bun Parottas, and cooling Jigarthanda drinks.',
    },
    attractions: [
      {
        id: 'IN-TN-IXM-ATT-001',
        name: 'Meenakshi Sundareswarar Temple',
        category: 'Spiritual / Heritage · Hinduism, Dravidian Architecture & Historical Sites',
        timings: '05:00–12:30 & 16:00–21:30 (Evening Palliarai Pooja ~21:15)',
        fee: { domestic: 'Free (Strict dress code & no-phone policy)', foreign: 'Free (Courtyard access allowed)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Madurai_Meenakshi_Amman_Temple_Towers.jpg/1280px-Madurai_Meenakshi_Amman_Temple_Towers.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Spiritual heart of Madurai with 14 towering gopurams reaching up to 52 meters, covered with thousands of vibrantly painted stucco figures of deities, demons, and celestial beings.',
      },
      {
        id: 'IN-TN-IXM-ATT-002',
        name: 'Thirumalai Nayakkar Mahal',
        category: 'Heritage · Palaces & Forts, Indo-Saracenic Stucco Architecture',
        timings: '09:00–17:00 (Sound & Light Show: 18:45 Eng / 20:00 Tamil)',
        fee: { domestic: 'INR 10', foreign: 'INR 50' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Thirumalai_Nayak_Palace_Madurai.jpg/1280px-Thirumalai_Nayak_Palace_Madurai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1636 palace erected by King Thirumalai Nayak, renowned for its colossal 82-foot-high brick-and-mortar pillars, grand royal durbar courtyard, and ornate painted cupola domes.',
      },
      {
        id: 'IN-TN-IXM-ATT-003',
        name: 'Gandhi Memorial Museum',
        category: 'Heritage / Arts · Museums & Freedom Struggle Historical Sites',
        timings: '10:00–13:00 & 14:00–17:30 (Closed Fridays)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Gandhi_Memorial_Museum_Madurai.jpg/1280px-Gandhi_Memorial_Museum_Madurai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Housed in the 17th-century Tamukkam summer palace of Rani Mangammal, exhibiting the blood-stained dhoti worn by Mahatma Gandhi during his assassination in 1948.',
      },
      {
        id: 'IN-TN-IXM-GEM-001',
        name: 'Aayiram Kaal Mandapam (Hall of 1,000 Pillars) & Art Museum',
        category: 'Heritage / Arts · Archeological Sites, Stone Carving & Musical Pillars',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 5', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Hall_of_Thousand_Pillars_Meenakshi_Temple.jpg/1280px-Hall_of_Thousand_Pillars_Meenakshi_Temple.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Engineering and sculptural wonder inside the Meenakshi temple containing 985 exquisitely carved granite columns, featuring musical stone pillars that produce distinct swaras when tapped.',
      },
      {
        id: 'IN-TN-IXM-GEM-002',
        name: 'Vilachery Terracotta & Clay Toy Pottery Village',
        category: 'Rural / Arts · Crafts-Tourism, Live Like a Local & Golu Dolls',
        timings: '09:00–18:00',
        fee: { domestic: 'Free (Workshop observation)', foreign: 'Free (Workshop observation)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Terracotta Village',
        summary:
          'A quiet rural potter community where generational artisans shape terracotta idols and hand-painted Navratri Golu dolls using fine clay from surrounding temple tanks.',
      },
    ],
  },
  {
    id: 'thanjavur',
    code: 'IN-TN-CITY-TJV',
    name: 'Thanjavur / Tanjore',
    nickname: 'The Rice Bowl & Chola Citadel',
    tagline: 'Imperial Chola granite vimanas, lost-wax bronzes & gold-leaf Tanjore art',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-yellow-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Brihadisvara_Temple%2C_Thanjavur%2C_Tamil_Nadu.jpg/1280px-Brihadisvara_Temple%2C_Thanjavur%2C_Tamil_Nadu.jpg',
    photoCredit: 'Wikimedia Commons / Brihadisvara Temple',
    flashcardBlurb:
      'The rice bowl of Tamil Nadu and historic capital of the Imperial Cholas, synonymous with colossal granite temple vimanas, bronze casting, and gold-foil paintings.',
    topStays: [
      { name: 'Svatma', category: 'Luxury Heritage Arts & Wellness Hotel' },
      { name: 'Great Trails River View Resort', category: 'Lakeside & Riverfront Luxury' },
      { name: 'Hotel Gnanam', category: 'Comfortable Mid-Scale City Central' },
    ],
    dining: {
      veg: [
        { restaurant: 'Sree Ariya Bhavan', location: 'Opposite Old Bus Stand', specialties: 'Authentic Thanjavur Veg Thali, Melt-in-mouth Ghee Ven Pongal with Medu Vada' },
        { restaurant: 'Pattukkottai Kamatchi Mess', location: 'Tanjore Branch', specialties: 'Rich spicy vegetarian Vatha Kuzhambu, Poondu Kuzhambu & crispy papads' },
      ],
      nonVeg: [
        { restaurant: 'Chettinad Court / Maratha Dining', location: 'Old Bus Stand Road', specialties: 'Tender Mutton Sukka Varuval, Country Chicken Curry & Biryani' },
      ],
      peacefulNote: 'Thanjavur cuisine is renowned for aromatic Kaveri delta rice, roasted lentils, asafoetida-infused rasam, and traditional Tanjore Maratha court delicacies.',
    },
    attractions: [
      {
        id: 'IN-TN-TJV-ATT-001',
        name: 'Brihadisvara Temple (Big Temple / Peruvudaiyar Kovil)',
        category: 'Heritage · UNESCO World Heritage, Great Living Chola Temples',
        timings: '06:00–12:30 & 16:00–20:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Brihadisvara_Temple%2C_Thanjavur%2C_Tamil_Nadu.jpg/1280px-Brihadisvara_Temple%2C_Thanjavur%2C_Tamil_Nadu.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Constructed by Emperor Raja Raja Chola I in 1010 CE, this monolithic architectural marvel boasts a 66-meter granite vimana crowned by an 80-tonne single-stone octagonal dome (Kumbam).',
      },
      {
        id: 'IN-TN-TJV-ATT-002',
        name: 'Thanjavur Maratha Palace Complex & Saraswathi Mahal Library',
        category: 'Heritage / Arts · Palaces, Museums & Ancient Palm-Leaf Manuscripts',
        timings: '09:00–18:00 (Library lunch break 13:00–14:00)',
        fee: { domestic: 'INR 50', foreign: 'INR 200' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Thanjavur_Royal_Palace.jpg/1280px-Thanjavur_Royal_Palace.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '16th-century royal fortress housing the Rajaraja Chola Art Gallery, the Arsenal Tower, and the world-famous Saraswathi Mahal Library with over 60,000 ancient palm-leaf manuscripts.',
      },
      {
        id: 'IN-TN-TJV-ATT-003',
        name: 'Rajarajan Manimandapam',
        category: 'Heritage · Monuments, Historical Sites & Cultural Gardens',
        timings: '10:00–17:45',
        fee: { domestic: 'INR 10', foreign: 'INR 10' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Rajarajan_Manimandapam_Thanjavur.jpg/1280px-Rajarajan_Manimandapam_Thanjavur.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Commemorative pavilion built for the 1000th anniversary of Emperor Raja Raja Chola’s coronation, featuring stone relief sculptures and a cultural heritage museum.',
      },
      {
        id: 'IN-TN-TJV-GEM-001',
        name: 'Swamimalai Bronze Casting Artisan Guilds',
        category: 'Arts / Rural · Crafts-Tourism, UNESCO Lost-Wax Bronze Sculpture',
        timings: '09:30–17:30',
        fee: { domestic: 'Free (Direct workshop observation)', foreign: 'Free (Direct workshop observation)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Bronze_casting_Swamimalai.jpg/1280px-Bronze_casting_Swamimalai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Generational sthapathis practicing the thousand-year-old Chola lost-wax (cire perdue) technique to sculpt sacred Nataraja bronzes with mathematical iconographic precision.',
      },
      {
        id: 'IN-TN-TJV-GEM-002',
        name: 'Manora Fort, Pattukkottai',
        category: 'Heritage · Palaces & Forts, Hexagonal 8-Tiered Pagoda Tower',
        timings: '09:00–17:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Manora_Fort_Pattukkottai.jpg/1280px-Manora_Fort_Pattukkottai.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Unusual 8-storey hexagonal coastal minaret tower erected in 1814 by Maratha King Serfoji II to commemorate the British victory over Napoleon at Waterloo, overlooking Palk Strait.',
      },
    ],
  },
  {
    id: 'ooty',
    code: 'IN-TN-CITY-UAM',
    name: 'Udhagamandalam / Ooty',
    nickname: 'Queen of Hill Stations',
    tagline: 'Colonial bungalows, high-altitude rose terraces & UNESCO Toy Train',
    accentColor: '#065F46',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-cyan-50/30',
    coverImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Nilgiri Hills',
    flashcardBlurb:
      'The "Queen of Hill Stations" nested at 2,240 metres in the Nilgiris, famed for colonial bungalows, high-altitude rose terraces, eucalyptus woods, and the UNESCO Toy Train.',
    topStays: [
      { name: 'Savoy - IHCL SeleQtions', category: 'Colonial Heritage Estate since 1841' },
      { name: 'WelcomHeritage Ferrnhills Royale Palace', category: 'Former Summer Palace of the Maharaja of Mysore' },
      { name: 'Sterling Ooty Elk Hill', category: 'Hilltop Resort overlooking Nilgiri Valleys' },
    ],
    dining: {
      veg: [
        { restaurant: 'Nahar Sidewalk Cafe', location: 'Commercial Road', specialties: 'Crisp wood-fired pizza, vegetarian bakery pastries, hot soups & apple pies' },
        { restaurant: 'Shinkows Chinese', location: 'Commissionary Road', specialties: 'Historic Tibetan & Chinese noodle soups, steamed vegetable momos operating since 1954' },
      ],
      nonVeg: [
        { restaurant: "Earl's Secret at King's Cliff", location: 'Havelock Road', specialties: 'Colonial Roast Chicken, Sizzling Steaks & Nilgiri Spiced Pepper Mutton' },
        { restaurant: 'Hyderabad Biryani House', location: 'Commercial Road', specialties: 'Authentic Hyderabadi Dum Biryani with spiced mirchi ka salan' },
      ],
      peacefulNote: 'High-altitude Nilgiri dining pairs fragrant eucalyptus teas and handmade dark chocolates with comforting British heritage roasts and Tibetan comfort broths.',
    },
    attractions: [
      {
        id: 'IN-TN-UAM-ATT-001',
        name: 'Nilgiri Mountain Railway (UNESCO Toy Train)',
        category: 'Heritage · UNESCO World Heritage, Mountain Railways of India',
        timings: 'Departures between Mettupalayam, Coonoor & Ooty (Morning & afternoon trips)',
        fee: { domestic: 'INR 30 (Second Class) / INR 205 (First Class)', foreign: 'INR 30 (Second Class) / INR 205 (First Class)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Nilgiri_Mountain_Railway_Steam_Loco.jpg/1280px-Nilgiri_Mountain_Railway_Steam_Loco.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Legendary metre-gauge rack-and-pinion mountain railway chugging through 250 bridges, 16 tunnels, and breathtaking shola ravines pulled by vintage steam locomotives.',
      },
      {
        id: 'IN-TN-UAM-ATT-002',
        name: 'Government Botanical Garden',
        category: 'Nature · Forests & Gardens, 20-Million-Year-Old Fossil Tree Trunk',
        timings: '07:00–18:30',
        fee: { domestic: 'INR 50–100', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Government_Botanical_Garden_Ooty.jpg/1280px-Government_Botanical_Garden_Ooty.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Sprawling 55-acre terraced botanical garden established in 1848 by William Graham McIvor, featuring thousands of exotic flora species and a 20-million-year-old petrified fossil tree.',
      },
      {
        id: 'IN-TN-UAM-ATT-003',
        name: 'Doddabetta Peak',
        category: 'Nature / Adventure · Hills & Mountains, Nilgiris Highest Point (2,637 m)',
        timings: '07:00–18:00',
        fee: { domestic: 'INR 10–20 (Camera extra)', foreign: 'INR 10–20 (Camera extra)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Doddabetta_Peak_Ooty.jpg/1280px-Doddabetta_Peak_Ooty.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The loftiest summit in the Nilgiris range (2,637 m) offering a telescope observatory dome with 360-degree vistas across Chamundi Hills, Bandipur, and misty shola valleys.',
      },
      {
        id: 'IN-TN-UAM-GEM-001',
        name: 'Avalanche Lake & Sanctuary Shola Forests',
        category: 'Nature · Rivers & Lakes, Eco-Tourism & Shola Grasslands',
        timings: '09:00–15:00 (Forest Department safari bus only)',
        fee: { domestic: 'Bus safari approx INR 200–300/person', foreign: 'Bus safari approx INR 200–300/person' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Avalanche_Lake_Ooty.jpg/1280px-Avalanche_Lake_Ooty.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Pristine highland lake nestled 28 km from Ooty amidst dense rhododendron forests and mountain streams, protected within the Nilgiri Biosphere Reserve.',
      },
      {
        id: 'IN-TN-UAM-GEM-002',
        name: 'Toda Tribal Hamlet (Mund) at Muthorai Palada',
        category: 'Rural / Arts · Tribal-Tourism, Barrel-Shaped Huts & Toda Embroidery',
        timings: '09:00–17:00',
        fee: { domestic: 'Free (Respectful community access)', foreign: 'Free (Respectful community access)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Toda_Hut_Ooty.jpg/1280px-Toda_Hut_Ooty.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Traditional settlement of the indigenous Toda pastoral community, renowned for unique half-barrel curved bamboo-and-thatch huts and intricate red-and-black Poothkuly hand embroidery.',
      },
    ],
  },
];
