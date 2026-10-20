export interface UttarakhandStay {
  name: string;
  category: string;
}

export interface UttarakhandFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface UttarakhandDining {
  veg: UttarakhandFoodSpot[];
  nonVeg: UttarakhandFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface UttarakhandAttraction {
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

export interface UttarakhandCity {
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
  topStays: UttarakhandStay[];
  dining: UttarakhandDining;
  attractions: UttarakhandAttraction[];
}

export const UTTARAKHAND_DIRECTORY: UttarakhandCity[] = [
  {
    id: 'rishikesh',
    code: 'IN-UK-CITY-RSK',
    name: 'Rishikesh',
    nickname: 'Yoga Capital of the World & Gateway to Garhwal',
    tagline: 'Emerald Ganga rapids, Vedic ashrams, cliffside cafes & evening Ganga Aarti',
    accentColor: '#059669',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-cyan-50/30',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Rishikesh Ganga',
    flashcardBlurb:
      'The Yoga Capital of the World and gateway to the Garhwal Himalayas, where the emerald Ganga emerges from the foothills alongside Vedic ashrams, cliffside cafes, and white-water rapids.',
    topStays: [
      { name: 'Ananda in the Himalayas', category: 'Narendra Nagar — Ultra-Luxury Destination Wellness & Ayurveda' },
      { name: 'Taj Rishikesh Resort & Spa', category: 'Singthali — Riverfront Luxury' },
      { name: 'Aloha on the Ganges', category: 'Tapovan — Riverfront Resort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Chotiwala Restaurant', location: 'Swarg Ashram', specialties: 'Historic Garhwali thalis, Aloo ke Gutke, hot Jalebi & North Indian meals since 1958' },
        { restaurant: 'Beatles Cafe / Cafe Delmar', location: 'Tapovan', specialties: 'Plant-based vegan burgers, artisan sourdough toast & organic cold brew with river panoramas' },
        { restaurant: 'Little Buddha Cafe', location: 'Lakshman Jhula', specialties: 'Fresh Israeli platters, wood-fired pizzas, herbal infusion teas & treehouse Ganga seating' },
      ],
      nonVeg: [],
      pilgrimageNotice: 'Sacred Pilgrimage Bylaw: Non-vegetarian food and alcohol are strictly prohibited within Rishikesh municipal municipal limits. Dining on the pilgrim ghats is purely vegetarian and sattvic.',
      peacefulNote: 'Rishikesh cafe dining combines ancient Ayurvedic sattvic balancing with organic mountain greens, herbal teas, and international bohemian vegan cuisine.',
    },
    attractions: [
      {
        id: 'IN-UK-RSK-ATT-001',
        name: 'Triveni Ghat Evening Maha Aarti',
        category: 'Spiritual · Hinduism, Living Rituals & Sacred River Confluence',
        timings: '18:00–19:30 (Aarti starts around sunset)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Ganga_Aarti_at_Triveni_Ghat%2C_Rishikesh.jpg/1280px-Ganga_Aarti_at_Triveni_Ghat%2C_Rishikesh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Soul-stirring dusk congregation where priests chant Vedic hymns and swing multi-tiered brass oil lamps, while devotees float thousands of leaf diyas down the sacred Ganga.',
      },
      {
        id: 'IN-UK-RSK-ATT-002',
        name: 'Beatles Ashram (Chaurasi Kutia)',
        category: 'Heritage / Arts · Maharishi Mahesh Yogi Ashram, Graffiti Murals & Meditation Caves',
        timings: '09:00–16:00 (Exit by 16:30)',
        fee: { domestic: 'INR 150–200', foreign: 'INR 600–1,200' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Beatles_Ashram_Chaurasi_Kutia_Rishikesh.jpg/1280px-Beatles_Ashram_Chaurasi_Kutia_Rishikesh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Iconic 14-acre forest ashram within Rajaji Tiger Reserve where The Beatles stayed in 1968 composing 48 songs, featuring 84 stone meditation igloos and psychedelic graffiti art.',
      },
      {
        id: 'IN-UK-RSK-ATT-003',
        name: 'White-Water Rafting & Cliff Jump (Shivpuri to NIM Beach)',
        category: 'Adventure · Rafting, Kayaking & River Expeditions',
        timings: '08:00–15:30 (Operational mid-Sep to June; closed during monsoon)',
        fee: { domestic: 'INR 600–1,500 depending on stretch', foreign: 'INR 600–1,500 depending on stretch' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Ganga River Rafting',
        summary:
          'World-class grade III & IV rapids (Roller Coaster, Golf Course, Club House) navigating through the dramatic emerald river canyon of the Garhwal foothills.',
      },
      {
        id: 'IN-UK-RSK-ATT-004',
        name: 'Parmarth Niketan & Ram Jhula',
        category: 'Spiritual / Wellness · Yoga, Meditation & Historic Suspension Bridges',
        timings: '06:00–21:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Ram_Jhula_Rishikesh.jpg/1280px-Ram_Jhula_Rishikesh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Premier residential spiritual ashram on the east bank of the Ganga famous for its riverfront Lord Shiva statue, evening prayers, and the landmark 750-foot iron suspension bridge.',
      },
      {
        id: 'IN-UK-RSK-GEM-001',
        name: 'Vashistha Gufa (Cave) & Ganga Beach',
        category: 'Spiritual / Wellness · Meditation, Natural River Caves & Arundhati Cave',
        timings: '08:00–12:00 & 15:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Vashishta_Cave_Rishikesh.jpg/1280px-Vashishta_Cave_Rishikesh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Sacred natural cave 25 km upstream where sage Vashistha meditated, filled with pin-drop stillness and an oil lamp flame, opening onto a pristine white-sand river beach.',
      },
      {
        id: 'IN-UK-RSK-GEM-002',
        name: 'Neer Garh Waterfall Trek',
        category: 'Nature / Adventure · Hiking & Trekking, Natural Limestone Cascades',
        timings: '08:00–17:00',
        fee: { domestic: 'INR 30', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Neer Garh Cascades',
        summary:
          'Two-tiered natural limestone waterfall tumbling into turquoise wading pools shaded by dense forest canopy, reached via a scenic 2-km hike from the Badrinath highway.',
      },
    ],
  },
  {
    id: 'nainital',
    code: 'IN-UK-CITY-NNT',
    name: 'Nainital',
    nickname: 'The Lake District of Kumaon',
    tagline: 'Emerald volcanic lake, colonial boat clubs & snow-clad Nanda Devi views',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-50 via-teal-50/40 to-stone-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Naini_Lake_Nainital.jpg/1280px-Naini_Lake_Nainital.jpg',
    photoCredit: 'Wikimedia Commons / Naini Lake',
    flashcardBlurb:
      'The pear-shaped lake town of Kumaon nestled in a valley ringed by seven hills, renowned for colonial boat clubs, pine ridges, and views of the snow-clad Nanda Devi range.',
    topStays: [
      { name: 'The Naini Retreat by Leisure Hotels', category: 'Ayapatta Slopes — Heritage Estate' },
      { name: 'Manu Maharani', category: 'Mallital — Hill View Luxury' },
      { name: 'The Grand Hotel', category: 'Mall Road — Colonial Lakeside Heritage' },
    ],
    dining: {
      veg: [
        { restaurant: 'Shiva Restaurant', location: 'Mall Road', specialties: 'Homestyle Kumaoni meals, Bhatt ki Churkani, Aloo ke Gutke & fresh vegetarian thalis' },
        { restaurant: "Sakley's Restaurant & Pastry Shop", location: 'The Mall', specialties: 'Handcrafted fresh fruit tarts, warm apple pies, chocolate eclairs & Italian bakes since 1944' },
      ],
      nonVeg: [
        { restaurant: 'Embassy Restaurant', location: 'Mall Road', specialties: 'Succulent roasted chicken, spiced Kumaoni Mutton Curry & Rogan Josh' },
        { restaurant: "Zooby's Kitchen", location: 'Boat House Club / Tallital', specialties: 'Slow-simmered Kumaoni Mutton, Chicken Seekh Kebabs & Dal Makhani' },
      ],
      peacefulNote: 'Kumaoni dining highlights black soybean stews (Bhatt ki Churkani), hemp seed chutney (Bhaang ki Chutney), and English bakery pies perfected over a century.',
    },
    attractions: [
      {
        id: 'IN-UK-NNT-ATT-001',
        name: 'Naini Lake & Yacht Boating',
        category: 'Nature / Recreation · Rivers & Lakes, Sailing, Paddle & Row Boating',
        timings: '06:00–18:00',
        fee: { domestic: 'Row/Pedal boat: INR 210–420 per round', foreign: 'Row/Pedal boat: INR 210–420 per round' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Naini_Lake_Nainital.jpg/1280px-Naini_Lake_Nainital.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Crescent-shaped natural freshwater body at 1,938 m ringed by seven lush wooded peaks (Ayapatta, Deopatta, Handi-Bandi, Naina, Alma, Manora, and Sher-ka-Danda).',
      },
      {
        id: 'IN-UK-NNT-ATT-002',
        name: 'Naina Devi Temple',
        category: 'Spiritual · Hinduism, Shakti Peeth & Lakeside Shrine',
        timings: '06:00–21:30',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Naina_Devi_Temple_Nainital.jpg/1280px-Naina_Devi_Temple_Nainital.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Revered 15th-century Shakti Peeth on the northern shore of Naini Lake where Goddess Sati’s eyes (Nayan) fell, revered by millions of Kumaoni and Garhwali devotees.',
      },
      {
        id: 'IN-UK-NNT-ATT-003',
        name: 'Naina Peak (Cheena Peak)',
        category: 'Adventure / Nature · Hiking & Trekking, Highest Summit (2,615 m)',
        timings: 'Daylight access (06:00–17:00)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Nainital_View_from_Naina_Peak.jpg/1280px-Nainital_View_from_Naina_Peak.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The loftiest elevation in Nainital (2,615 m) reached via a scenic 6-km forest trail, offering bird’s-eye vistas of the town below and the glistening Himalayan peaks from Bandarpoonch to Api.',
      },
      {
        id: 'IN-UK-NNT-ATT-004',
        name: 'Snow View Point & Aerial Ropeway',
        category: 'Nature / Recreation · Cable Car & Panoramic Himalayan Vistas',
        timings: '10:00–17:00',
        fee: { domestic: 'Cable car round-trip: ~INR 300–400', foreign: 'Cable car round-trip: ~INR 300–400' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Snow_View_Nainital.jpg/1280px-Snow_View_Nainital.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Popular viewpoint connected by a 2.5-minute aerial ropeway car from Mallital, offering mounted telescope vistas of Trishul, Nanda Devi, and Nanda Kot snow massifs.',
      },
      {
        id: 'IN-UK-NNT-GEM-001',
        name: 'Pangot & Kilbury Bird Sanctuary',
        category: 'Nature / Rural · Wildlife-Tourism, Over 250 Himalayan Bird Species',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Trail permits may apply)', foreign: 'Free (Trail permits may apply)' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Himalayan Oak Woods',
        summary:
          'Secluded birdwatching paradise nestled 15 km from Nainital in dense oak, pine, and rhododendron forests, home to cheer pheasants, koklass pheasants, and brown wood owls.',
      },
      {
        id: 'IN-UK-NNT-GEM-002',
        name: "Gurney House (Jim Corbett's Historic Cottage)",
        category: 'Heritage / Arts · Historical Buildings, Museums & Private Memorabilia',
        timings: '10:00–16:30 (Prior appointment strictly required)',
        fee: { domestic: 'Free / Nominal conservation fee', foreign: 'Free / Nominal conservation fee' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Gurney_House_Nainital.jpg/1280px-Gurney_House_Nainital.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1881 stone-and-timber cottage on Ayapatta Hill where hunter-conservationist Jim Corbett lived with his sister Maggie, preserving his hunting trophies, library books, and vintage furniture.',
      },
    ],
  },
  {
    id: 'mussoorie',
    code: 'IN-UK-CITY-DED',
    name: 'Mussoorie',
    nickname: 'Queen of the Hills & Landour Ridge',
    tagline: 'Misty oak trails, Ruskin Bond literary haunts & the winterline horizon',
    accentColor: '#9333EA',
    bgGradient: 'from-purple-50 via-rose-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Mussoorie Winterline',
    flashcardBlurb:
      '"The Queen of the Hills" commanding a ridge over the Doon Valley, famous for its misty oak trails, author Ruskin Bond’s literary haunts, and the winterline phenomenon.',
    topStays: [
      { name: 'JW Marriott Mussoorie Walnut Grove Resort & Spa', category: 'Kempty Fall Road — Luxury Alpine Haven' },
      { name: 'Welcomhotel The Savoy', category: 'Library End — Historic 1902 Castle Hotel' },
      { name: 'Rokeby Manor', category: 'Landour — 1840 English Country Estate' },
    ],
    dining: {
      veg: [
        { restaurant: "Emily's at Rokeby Manor", location: 'Landour', specialties: 'Alpine brunch, signature sticky toffee pudding, quiches & rustic continental comforts' },
        { restaurant: 'Lovely Omelette Centre', location: 'Mall Road', specialties: 'Famous sizzling butter-cheese-chilli omelettes served with toasted buns' },
      ],
      nonVeg: [
        { restaurant: 'Kalsang Friends Corner', location: 'Mall Road', specialties: 'Authentic Tibetan pork momos, fiery Devil Chicken & rich broth Thukpas' },
        { restaurant: 'The Tavern', location: 'Picture Palace', specialties: 'Wood-smoked sizzlers, colonial roast chicken & live acoustic evening performances' },
      ],
      peacefulNote: 'Mussoorie dining pairs English country tearoom bakes and homemade peanut butters in Landour with comforting Tibetan mountain broths on the bustling Mall.',
    },
    attractions: [
      {
        id: 'IN-UK-DED-ATT-001',
        name: 'Gun Hill & Cable Car',
        category: 'Nature / Recreation · Hills & Mountains, Historic British Noon-Gun Summit',
        timings: '10:00–18:00',
        fee: { domestic: 'Cable car round-trip: ~INR 150–200', foreign: 'Cable car round-trip: ~INR 150–200' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Gun_Hill_Mussoorie.jpg/1280px-Gun_Hill_Mussoorie.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Second highest peak in Mussoorie where a cannon was fired daily at noon during British rule, reached via a 400-meter ropeway journey overlooking Bunderpunch and Gangotri.',
      },
      {
        id: 'IN-UK-DED-ATT-002',
        name: 'Kempty Falls',
        category: 'Nature / Recreation · Rivers & Lakes, Natural Cascades & Splash Pools',
        timings: '08:00–17:00',
        fee: { domestic: 'Free (Ropeway down to basin: ~INR 150)', foreign: 'Free (Ropeway down to basin: ~INR 150)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Kempty_Falls_Mussoorie.jpg/1280px-Kempty_Falls_Mussoorie.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Perennial waterfall dropping 40 feet into a natural pool framed by high mountain cliffs, developed by British officer John Mekinan in the 1830s for summer tea parties.',
      },
      {
        id: 'IN-UK-DED-ATT-003',
        name: "Camel's Back Road Walk",
        category: 'Nature / Wellness · Walking Trails, Sunset & Winterline Horizon',
        timings: 'Open 24 Hours (Best walked 06:00–08:30 & 16:30–18:30)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Camels_Back_Road_Mussoorie.jpg/1280px-Camels_Back_Road_Mussoorie.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'A quiet 3-km cliffside promenade named after natural rock formations shaped like a camel’s hump, celebrated as the best vantage point for witnessing the rare evening winterline.',
      },
      {
        id: 'IN-UK-DED-GEM-001',
        name: "Landour Heritage Quarter & Sister's Bazaar",
        category: 'Heritage / Gastronomy · Colonial Cantonment, Prakash Jams & Char Dukan',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Landour_Clock_Tower.jpg/1280px-Landour_Clock_Tower.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Atmospheric non-motorized cantonment ridge established in 1827 under towering deodars, famous for historic Char Dukan teashops, author Ruskin Bond’s retreat, and handmade gooseberry jams.',
      },
      {
        id: 'IN-UK-DED-GEM-002',
        name: 'Jabarkhet Nature Reserve',
        category: 'Nature / Rural · Eco-Tourism, Privately Conserved Himalayan Forest Trails',
        timings: '06:00–18:00 (Entry closes 16:00)',
        fee: { domestic: 'INR 400–500 (Includes naturalist guide/map)', foreign: 'INR 400–500' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Himalayan Forest Trail',
        summary:
          'Uttarakhand’s first private eco-reserve spread across 110 pristine acres, supporting leopards, barking deer, flying squirrels, and 140+ native bird species on marked nature trails.',
      },
      {
        id: 'IN-UK-DED-GEM-003',
        name: "George Everest's House & Observatory Peak",
        category: 'Heritage / Adventure · Cartography Museum, Historic Estate & Panoramic Ridge',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 50–100 (Museum separate)', foreign: 'INR 50–100 (Museum separate)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/George_Everest_House_Mussoorie.jpg/1280px-George_Everest_House_Mussoorie.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1832 estate of Sir George Everest, Surveyor General of India, commanding panoramic views of the Aglar river valley on one side and the Doon valley on the other, featuring a modern cartography museum.',
      },
    ],
  },
  {
    id: 'valley-of-flowers',
    code: 'IN-UK-CITY-VOF',
    name: 'Valley of Flowers & Hemkund Sahib',
    nickname: 'UNESCO Alpine Floral Sanctuary & Glacial Hemkund',
    tagline: '500 wild alpine blossom species, sacred glacial lake & blue poppies',
    accentColor: '#E11D48',
    bgGradient: 'from-rose-50 via-teal-50/40 to-emerald-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Valley_of_Flowers_National_Park.jpg/1280px-Valley_of_Flowers_National_Park.jpg',
    photoCredit: 'Wikimedia Commons / Valley of Flowers',
    flashcardBlurb:
      'A UNESCO World Heritage floral sanctuary in West Himalaya\'s alpine meadows, carpeted by over 500 wild blossom species and flanked by the sacred glacial lake of Hemkund Sahib.',
    topStays: [
      { name: 'GMVN Tourist Rest House', category: 'Ghangaria — State Run Trek Basecamp' },
      { name: 'Hotel Kuber Annex', category: 'Ghangaria — Comfortable Trek Stay' },
      { name: 'Blue Poppy Resort', category: 'Govindghat / Bhyundar — Wooden Cottages' },
    ],
    dining: {
      veg: [
        { restaurant: 'Gurdwara Hemkund Sahib Langar', location: 'Ghangaria & Hemkund Shrine', specialties: 'Sacred community kitchen serving piping hot wholesome Khichdi, warm dal & spiced tea to all' },
        { restaurant: 'GMVN Dining Hall', location: 'Ghangaria', specialties: 'Simple nourishing mountain dal, steamed basmati rice, seasonal subzi & hot tawa parathas' },
      ],
      nonVeg: [],
      pilgrimageNotice: 'Sacred Sanctuary Bylaw: Non-vegetarian food and alcohol are strictly forbidden across Govindghat, Ghangaria, and the entire pilgrim corridor of Hemkund Sahib and the Bhyundar Valley.',
      peacefulNote: 'Highland trekking sustenance emphasizes hot wholesome dal-khichdi, ginger-lemon-honey water, and warming gurdwara community tea to combat alpine chill.',
    },
    attractions: [
      {
        id: 'IN-UK-VOF-ATT-001',
        name: 'Valley of Flowers National Park Meadow',
        category: 'Nature / Adventure · UNESCO World Heritage, High-Altitude Floral Sanctuary',
        timings: '07:00–14:00 (Last entry 14:00; mandatory exit by 17:00; overnight camping banned)',
        fee: { domestic: '3-day pass: INR 150–200', foreign: '3-day pass: INR 600–800' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Valley_of_Flowers_National_Park.jpg/1280px-Valley_of_Flowers_National_Park.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'UNESCO World Heritage glacial valley situated at 3,658 m, home to over 500 species of wild flowering plants (Brahma Kamal, Himalayan Blue Poppy, Cobra Lily) blooming between June and October.',
      },
      {
        id: 'IN-UK-VOF-ATT-002',
        name: 'Joan Margaret Legge Memorial Grave',
        category: 'Heritage / Nature · Historical Memorial to English Botanist',
        timings: 'Governed by Park entry (07:00–14:00)',
        fee: { domestic: 'Included in Valley entry pass', foreign: 'Included in Valley entry pass' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Joan_Margaret_Legge_Memorial.jpg/1280px-Joan_Margaret_Legge_Memorial.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Solitary stone grave and memorial inside the meadow dedicated to English botanist Joan Margaret Legge from Kew Gardens, who slipped and lost her life here in 1939 while collecting rare floral specimens.',
      },
      {
        id: 'IN-UK-VOF-ATT-003',
        name: 'Gurdwara Sri Hemkund Sahib',
        category: 'Spiritual · Sikhism, World’s Highest Gurdwara (4,329 m) & Glacial Lake',
        timings: '05:00–14:00 (All pilgrims must descend to Ghangaria by 14:00)',
        fee: { domestic: 'Free (Ponies/Palkis/Helicopters regulated by state)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Hemkund_Sahib_Gurudwara.jpg/1280px-Hemkund_Sahib_Gurudwara.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Star-shaped stone gurdwara situated beside a high-altitude crystal-clear glacial lake ringed by seven snow-clad peaks, associated with the meditation of Guru Gobind Singh.',
      },
      {
        id: 'IN-UK-VOF-GEM-001',
        name: 'Bhyundar Valley & Pushpawati River Gorge',
        category: 'Nature / Rural · Eco-Tourism, Glacier-Fed Riverbed Trails & Hanging Glaciers',
        timings: '07:00–17:00',
        fee: { domestic: 'Free along trekking route', foreign: 'Free along trekking route' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Pushpawati_River_Valley.jpg/1280px-Pushpawati_River_Valley.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Pristine mountain river canyon carving through granite gorges beneath towering glaciated peaks, flanked by birch forests, wild strawberries, and cascading snowmelt rivulets.',
      },
      {
        id: 'IN-UK-VOF-GEM-002',
        name: 'Kakbhusandi Tal Trek Ridge Base',
        category: 'Adventure / Nature · High-Altitude Glacial Tarn Expedition',
        timings: 'Multi-day expedition (Forest permits required from Joshimath)',
        fee: { domestic: 'Forest expedition fees apply', foreign: 'Forest expedition fees apply' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / High Glacial Lake',
        summary:
          'An emerald high-altitude tarn situated at 4,500 m in the shadow of Hathi Parvat, steeped in mythological folklore of sage Kakbhusandi reciting the Ramayana to Garuda.',
      },
    ],
  },
];
