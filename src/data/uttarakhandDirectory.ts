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
    code: 'IN-UK-CITY-RIS',
    name: 'Rishikesh',
    nickname: 'Yoga Capital of the World',
    tagline: 'Emerald Ganges rapids, Vedic ashrams, cliffside cafes & evening Ganga Aarti',
    accentColor: '#059669',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-cyan-50/30',
    coverImage: '/images/uttarakhand/rishikesh-ganga-aarti.jpg',
    photoCredit: 'Discover Bharat / Evening Ganga Aarti at Rishikesh',
    flashcardBlurb:
      'The "Yoga Capital of the World" where the emerald Ganges leaves the Himalayas, uniting ashram spirituality, evening aartis, and adrenaline-pumping white-water rafting.',
    topStays: [
      { name: 'Taj Rishikesh Resort & Spa', category: 'Singthali — Ultra-Luxury Himalayan Retreat' },
      { name: 'Ananda in the Himalayas', category: 'Narendra Nagar — World-Class Ayurvedic Spa Estate' },
      { name: 'Aloha on the Ganges', category: 'Tapovan — Riverfront Comfort' },
    ],
    dining: {
      veg: [
        { restaurant: 'Chotiwala Restaurant', location: 'Swarg Ashram', specialties: 'Legendary North Indian Thali since 1958' },
        { restaurant: 'Little Buddha Cafe', location: 'Tapovan', specialties: 'Riverside backpacker hub serving Israeli platters, pizza, and shakes' },
        { restaurant: 'The Sitting Elephant', location: 'Ellbee Ganga View', specialties: 'Fine dining with river views' },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Sacred Pilgrimage Bylaw: Rishikesh is a holy city; non-vegetarian food and alcohol are strictly prohibited within the city limits and pilgrimage zones. (Available only on the far outskirts toward Dehradun/Haridwar).',
      peacefulNote:
        'Rishikesh cafe dining combines ancient Ayurvedic sattvic balancing with organic mountain greens, herbal teas, and international bohemian vegan cuisine.',
    },
    attractions: [
      {
        id: 'IN-UK-RIS-ATT-001',
        name: 'Triveni Ghat & Evening Maha Aarti',
        category: 'Spiritual · Hinduism, Living Rituals, Grand River Ganga Aarti',
        timings: '18:00–19:30 (Daily at dusk)',
        fee: { domestic: 'Free (VIP seating sometimes requires advance donation)', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/uttarakhand/rishikesh-ganga-aarti.jpg',
        photoCredit: 'Discover Bharat',
        summary:
          'Soul-stirring dusk congregation where priests chant Vedic hymns and swing multi-tiered brass oil lamps, while devotees float thousands of leaf diyas down the sacred Ganges.',
      },
      {
        id: 'IN-UK-RIS-ATT-002',
        name: 'Laxman Jhula & Ram Jhula',
        category: 'Heritage / Nature · Engineering Marvels, Iron Suspension Bridges over the Ganges',
        timings: 'Open 24 Hours (Laxman Jhula currently restricted for vehicles/heavy footfall due to structural aging, but still viewable)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Ram_Jhula_Rishikesh.jpg/1280px-Ram_Jhula_Rishikesh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Iconic iron suspension footbridges spanning the turquoise Ganges, connecting vibrant ashram corridors, meditation centers, and cliffside riverside bazaars.',
      },
      {
        id: 'IN-UK-RIS-ATT-003',
        name: 'Beatles Ashram (Chaurasi Kutia)',
        category: 'Heritage / Arts · Historical Sites, Rajaji Tiger Reserve, 1968 Transcendental Meditation Hub, Graffiti Art',
        timings: '09:00–16:00',
        fee: { domestic: 'INR 150', foreign: 'INR 600' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Beatles_Ashram_Chaurasi_Kutia_Rishikesh.jpg/1280px-Beatles_Ashram_Chaurasi_Kutia_Rishikesh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Historic 14-acre forest ashram in Rajaji Tiger Reserve where The Beatles composed their White Album in 1968, renowned for 84 stone meditation caves and vivid murals.',
      },
      {
        id: 'IN-UK-RIS-ATT-004',
        name: 'Shivpuri White-Water Rafting',
        category: 'Adventure / Nature · River Rafting, Himalayan Rapids (Grades II to IV)',
        timings: '08:00–15:00 (Season: Mid-September to June; Closed in monsoon)',
        fee: { domestic: 'INR 600–1,500 depending on the stretch length', foreign: 'INR 600–1,500 depending on the stretch length' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Ganga River Rafting',
        summary:
          'Adrenaline-charged white-water rafting expeditions through grade II to IV Himalayan rapids (Roller Coaster, Golf Course, Club House) navigating dramatic canyon cliffs.',
      },
      {
        id: 'IN-UK-RIS-GEM-001',
        name: 'Vashishta Gufa (Cave)',
        category: 'Spiritual / Wellness · Meditation, Ancient Cave where Sage Vashishta meditated on the banks of the Ganges',
        timings: '08:00–12:00 & 15:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Vashishta_Cave_Rishikesh.jpg/1280px-Vashishta_Cave_Rishikesh.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Ancient natural river cave 25 km from Rishikesh where Sage Vashishta meditated on the banks of the Ganges, filled with stillness and opening to a pristine white-sand beach.',
      },
      {
        id: 'IN-UK-RIS-GEM-002',
        name: 'Neer Garh Waterfall',
        category: 'Nature / Adventure · Rivers & Lakes, Hiking & Trekking, Multi-tiered cascading waterfall with turquoise pools',
        timings: '08:00–18:00',
        fee: { domestic: 'INR 30', foreign: 'INR 30' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Neer Garh Cascades',
        summary:
          'Multi-tiered natural waterfall tumbling into crystal-clear turquoise wading pools shaded by dense forest canopy, reached via a short picturesque mountain hike.',
      },
    ],
  },
  {
    id: 'nainital',
    code: 'IN-UK-CITY-NTL',
    name: 'Nainital',
    nickname: 'The Lake District of India',
    tagline: 'Emerald mango-shaped Naini Lake, colonial architecture & Snow View panoramas',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-50 via-teal-50/40 to-stone-50/30',
    coverImage: '/images/uttarakhand/nainital-naini-lake.jpg',
    photoCredit: 'Discover Bharat / Naini Lake Aerial View',
    flashcardBlurb:
      'The "Lake District of India," a classic Kumaoni hill station centered around the mango-shaped Naini Lake, surrounded by pine forests, colonial architecture, and bustling Mall Road promenades.',
    topStays: [
      { name: 'The Manu Maharani', category: 'Mallital — Premium Lakeview Luxury' },
      { name: 'The Naini Retreat', category: 'Ayarpatta Slopes — Heritage Maharaja Palace Hotel' },
      { name: 'Alka The Lake Side Hotel', category: 'Mall Road — Scenic Lakeside Comfort' },
    ],
    dining: {
      veg: [
        { restaurant: "Sakley's Restaurant & Pastries", location: 'Mallital', specialties: 'Iconic bakes, sizzlers, and coffee since 1944' },
        { restaurant: 'Sonam Fast Food', location: 'Tibetan Market', specialties: 'Famous for Veg & Mutton Momos and Thukpa' },
      ],
      nonVeg: [
        { restaurant: 'Machan Restaurant', location: 'Mall Road', specialties: 'Chinese, North Indian, and Tibetan non-veg delicacies' },
        { restaurant: 'Giannis Pure Veg / Non-Veg Outlets', location: 'Mall Road', specialties: 'Kumaoni Chicken Curry & Indian curries' },
      ],
      peacefulNote:
        'Kumaoni dining highlights black soybean stews (Bhatt ki Churkani), hemp seed chutney (Bhaang ki Chutney), and English bakery pies perfected over eight decades.',
    },
    attractions: [
      {
        id: 'IN-UK-NTL-ATT-001',
        name: 'Naini Lake Boating',
        category: 'Nature · Rivers & Lakes, Traditional Wooden Rowboats and Paddle Boats',
        timings: '06:00–18:00',
        fee: { domestic: 'Rowboat INR 210–350; Paddle boat INR 150/hr', foreign: 'Rowboat INR 210–350; Paddle boat INR 150/hr' },
        isHiddenGem: false,
        image: '/images/uttarakhand/nainital-naini-lake.jpg',
        photoCredit: 'Discover Bharat',
        summary:
          'Scenic mango-shaped natural freshwater body at 1,938 m surrounded by seven wooded peaks, famous for traditional wooden rowboats and yachting across crystal waters.',
      },
      {
        id: 'IN-UK-NTL-ATT-002',
        name: 'Naina Devi Temple',
        category: 'Spiritual · Hinduism, One of the 51 Shakti Peethas located at the northern edge of Naini Lake',
        timings: '06:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Naina_Devi_Temple_Nainital.jpg/1280px-Naina_Devi_Temple_Nainital.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Revered Shakti Peeth on the northern shoreline where Goddess Sati’s eyes (Nayan) are believed to have fallen, revered by thousands of Himalayan pilgrims.',
      },
      {
        id: 'IN-UK-NTL-ATT-003',
        name: 'Nainital Ropeway & Snow View Point',
        category: 'Nature / Adventure · Cable Car, Hills & Mountains, Views of Nanda Devi and Trishul peaks',
        timings: '10:00–16:00',
        fee: { domestic: 'INR 300 per adult (Return ticket)', foreign: 'INR 300 per adult (Return ticket)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Snow_View_Nainital.jpg/1280px-Snow_View_Nainital.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Aerial cable car ascent offering dramatic views over Nainital town and high-powered binoculars framing Nanda Devi, Trishul, and Nanda Kot snow massifs.',
      },
      {
        id: 'IN-UK-NTL-GEM-001',
        name: "Gurney House (Jim Corbett's Former Home)",
        category: 'Heritage · Historical Buildings, 1881 Colonial Cottage belonging to the famous conservationist',
        timings: 'By prior appointment only',
        fee: { domestic: 'Free (Private residence, respectful viewing permitted)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Gurney_House_Nainital.jpg/1280px-Gurney_House_Nainital.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1881 stone-and-timber cottage on Ayarpatta Hill where hunter-conservationist Jim Corbett lived with his sister Maggie, preserving vintage furniture and colonial memorabilia.',
      },
      {
        id: 'IN-UK-NTL-GEM-002',
        name: 'Pangot & Kilbury Bird Sanctuary',
        category: 'Nature · Wildlife-Tourism, Forests & Gardens, High-altitude birding hotspot with over 580 avian species',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Oak Woods',
        summary:
          'Tranquil high-altitude forest 15 km from Nainital amid dense oak, pine, and rhododendron, renowned worldwide as a birdwatcher’s paradise with over 580 recorded species.',
      },
    ],
  },
  {
    id: 'mussoorie',
    code: 'IN-UK-CITY-MSS',
    name: 'Mussoorie',
    nickname: 'Queen of the Hills',
    tagline: 'Misty Doon Valley ridges, Ruskin Bond literary haunts & the winterline horizon',
    accentColor: '#9333EA',
    bgGradient: 'from-purple-50 via-rose-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Mussoorie Mountain Ridge',
    flashcardBlurb:
      'The "Queen of the Hills" perched above the Doon Valley, charming visitors with misty ridges, Ruskin Bond’s literary heritage, colonial-era bakeries, and roaring waterfalls.',
    topStays: [
      { name: 'JW Marriott Mussoorie Walnut Grove', category: 'Village Siya — Ultra-Luxury Resort & Spa' },
      { name: 'Welcomhotel The Savoy', category: 'Library Bazaar — Historic 1902 Gothic Castle Estate' },
      { name: 'Rokeby Manor', category: 'Landour — 19th-Century Heritage Stone Manor' },
    ],
    dining: {
      veg: [
        { restaurant: 'Lovely Omelette Centre', location: 'Mall Road', specialties: 'Legendary street-side cheese and masala omelettes, often with long queues' },
        { restaurant: 'Little Llama Cafe', location: 'Picture Palace', specialties: 'Wood-fired pizza, burgers, and hibiscus tea' },
      ],
      nonVeg: [
        { restaurant: 'Kalsang Friends Corner', location: 'Mall Road', specialties: 'Authentic Tibetan Momos, Tingmo, Chilli Pork' },
        { restaurant: 'Landour Bakehouse', location: "Sister's Bazaar", specialties: 'Historic British-era roasts, crepes, and heritage cakes' },
      ],
      peacefulNote:
        'Mussoorie dining pairs English country tearoom bakes and homemade peanut butters in Landour with comforting Tibetan mountain broths on the bustling Mall.',
    },
    attractions: [
      {
        id: 'IN-UK-MSS-ATT-001',
        name: 'Kempty Falls',
        category: 'Nature / Recreation · Rivers & Lakes, Massive Terraced Waterfall located 15 km from town',
        timings: '08:00–17:00',
        fee: { domestic: 'Free (Ropeway to base: INR 150)', foreign: 'Free (Ropeway to base: INR 150)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Kempty_Falls_Mussoorie.jpg/1280px-Kempty_Falls_Mussoorie.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Massive 40-foot terraced waterfall surrounded by high mountain ranges 15 km from town, developed by British officers in the 1830s for summer picnics.',
      },
      {
        id: 'IN-UK-MSS-ATT-002',
        name: "Camel's Back Road & Gun Hill",
        category: "Nature / Recreation · Hills & Mountains, Cable Car, Scenic 3-km ridge walk and Mussoorie's second-highest peak",
        timings: 'Walk open 24 hours; Ropeway 10:00–18:00',
        fee: { domestic: 'Ropeway INR 100', foreign: 'Ropeway INR 100' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Camels_Back_Road_Mussoorie.jpg/1280px-Camels_Back_Road_Mussoorie.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          "Peaceful 3-km cliffside promenade shaped like a camel's hump, alongside the aerial ropeway leading to Gun Hill for breathtaking snow peak panoramas.",
      },
      {
        id: 'IN-UK-MSS-ATT-003',
        name: 'Company Garden',
        category: 'Nature / Recreation · Forests & Gardens, Amusement & Theme Parks, Colonial Botanical Garden with artificial waterfalls and boating',
        timings: '09:00–18:00',
        fee: { domestic: 'INR 25', foreign: 'INR 25' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Colonial Garden',
        summary:
          'Vibrant colonial botanical garden filled with terraced floral flowerbeds, an artificial waterfall, and paddle boating pools against high mountain backdrops.',
      },
      {
        id: 'IN-UK-MSS-GEM-001',
        name: "Landour Sister's Bazaar & Kellogg Memorial Church",
        category: 'Heritage / Rural · Historical Buildings, Quiet cantonment town walking trail featuring 1903 Gothic architecture and heritage stores',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Landour_Clock_Tower.jpg/1280px-Landour_Clock_Tower.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Quiet non-motorized cantonment ridge shaded by towering deodars, featuring the 1903 Gothic Presbyterian church, Prakash peanut butter stores, and Char Dukan.',
      },
      {
        id: 'IN-UK-MSS-GEM-002',
        name: "George Everest's House (Park Estate)",
        category: 'Heritage / Nature · Historical Sites, Hiking & Trekking, Observatory ruins of the Surveyor General of India offering panoramic Doon Valley sunset views',
        timings: '08:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/George_Everest_House_Mussoorie.jpg/1280px-George_Everest_House_Mussoorie.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1832 estate and laboratory of Sir George Everest, Surveyor General of India, commanding 360-degree views of the Aglar river valley and Doon Valley.',
      },
    ],
  },
  {
    id: 'valley-of-flowers',
    code: 'IN-UK-CITY-VOF',
    name: 'Valley of Flowers National Park',
    nickname: 'UNESCO Alpine Floral Sanctuary',
    tagline: '500 wild blossom species, glacial Hemkund Sahib & Pushpawati gorge',
    accentColor: '#E11D48',
    bgGradient: 'from-rose-50 via-teal-50/40 to-emerald-50/30',
    coverImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Valley_of_Flowers_National_Park.jpg/1280px-Valley_of_Flowers_National_Park.jpg',
    photoCredit: 'Wikimedia Commons / Valley of Flowers',
    flashcardBlurb:
      'A high-altitude Himalayan UNESCO World Heritage Site bursting into a carpet of vibrant endemic alpine flora during the monsoon, bordered by rugged glaciers and the sacred Sikh pilgrimage of Hemkund Sahib.',
    topStays: [
      { name: 'Blue Poppy Swiss Cottage Camps', category: 'Ghangaria — Comfortable Tented Basecamp' },
      { name: 'GMVN Tourist Rest House', category: 'Ghangaria — State-run basic lodging' },
      { name: 'Park Accommodation Policy', category: 'No accommodations or camping allowed inside the National Park' },
    ],
    dining: {
      veg: [
        { restaurant: 'Gurudwara Sri Hemkund Sahib Langar', location: 'Ghangaria / Hemkund', specialties: 'Sacred free meals serving hot Dal, Roti, and Khichdi' },
        { restaurant: 'Local Dhabas in Ghangaria', location: 'Ghangaria', specialties: 'Basic North Indian veg meals and Maggi' },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Sacred Sanctuary Bylaw: The entire Ghangaria basecamp and Hemkund Sahib route is strictly vegetarian and alcohol-free.',
      peacefulNote:
        'Highland trekking sustenance emphasizes hot wholesome dal-khichdi, ginger-lemon-honey water, and warming gurdwara community tea to combat alpine chill.',
    },
    attractions: [
      {
        id: 'IN-UK-VOF-ATT-001',
        name: 'Valley of Flowers National Park Trek',
        category: 'Nature / Adventure · UNESCO World Heritage, Hiking & Trekking, Forests & Gardens, Over 500 species of wildflowers including the Blue Poppy and Brahma Kamal',
        timings: 'Park opens June 1 to October 31. Entry timing 07:00–12:00 (Must exit park by 17:00; overnight stay strictly prohibited)',
        fee: { domestic: 'Indian Nationals: INR 200 (Valid for 3 days; online registration required)', foreign: 'Foreign Nationals: INR 800 (Valid for 3 days; online registration required)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Valley_of_Flowers_National_Park.jpg/1280px-Valley_of_Flowers_National_Park.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'UNESCO World Heritage glacial meadow at 3,658 m blanketed with over 500 endemic alpine blossom species including the Blue Poppy, Brahma Kamal, and Himalayan bellflower.',
      },
      {
        id: 'IN-UK-VOF-ATT-002',
        name: 'Sri Hemkund Sahib Sarovar & Gurudwara',
        category: 'Spiritual / Adventure · Sikhism, Hiking & Trekking, High-altitude glacial lake and star-shaped Gurudwara at 4,329 metres',
        timings: '06:00–14:00 (Must descend back to Ghangaria before evening)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Hemkund_Sahib_Gurudwara.jpg/1280px-Hemkund_Sahib_Gurudwara.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'High-altitude glacial lake and star-shaped gurdwara situated at 4,329 m ringed by seven snow-clad peaks, reached via a steep 6 km trek from Ghangaria.',
      },
      {
        id: 'IN-UK-VOF-ATT-003',
        name: 'Govindghat to Ghangaria Trek',
        category: 'Adventure / Nature · Hiking & Trekking, The 9-km basecamp approach trail running alongside the Pushpawati River',
        timings: 'Daylight hours (Start early from Govindghat)',
        fee: { domestic: 'Free (Helicopter one-way: ~INR 3,000–3,500)', foreign: 'Free (Helicopter one-way: ~INR 3,000–3,500)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Pushpawati_River_Valley.jpg/1280px-Pushpawati_River_Valley.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Scenic basecamp approach trail along the roaring Pushpawati River, passing through pine groves, suspension footbridges, and mountain rest stalls.',
      },
      {
        id: 'IN-UK-VOF-GEM-001',
        name: 'Badrinath Temple & Mana Village',
        category: 'Spiritual / Rural · Char Dham, Hinduism, "Last Village of India" located just 25 km drive from the Govindghat trailhead',
        timings: '04:30–13:00 & 16:00–21:00 (Temple)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: '/images/uttarakhand/badrinath-temple.png',
        photoCredit: 'Discover Bharat',
        summary:
          'The venerated Char Dham shrine and border hamlet of Mana near the Indo-Tibetan frontier, easily accessible as a spiritual extension from Govindghat.',
      },
    ],
  },
  {
    id: 'badrinath',
    code: 'IN-UK-CITY-BAD',
    name: 'Badrinath',
    nickname: 'Revered Char Dham Vaishnavite Shrine',
    tagline: 'Nar-Narayana mountains, Alaknanda river, sacred Tapt Kund & Vyas Gufa',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: '/images/uttarakhand/badrinath-temple.png',
    photoCredit: 'Discover Bharat / Badrinath Temple Shrine',
    flashcardBlurb:
      'One of the most revered Char Dham pilgrimage sites, nestled between the Nar and Narayana mountains along the Alaknanda River, famous for its colorful Vaishnavite temple and thermal springs.',
    topStays: [
      { name: 'Sarovar Portico Badrinath', category: 'Luxury Pilgrim Stay' },
      { name: 'Narayan Palace Hotel', category: 'Comfortable Base near the Temple' },
      { name: 'GMVN Tourist Bungalow', category: 'State-run reliable lodging' },
    ],
    dining: {
      veg: [
        { restaurant: 'Saket Restaurant', location: 'Near Temple', specialties: 'Pure vegetarian North Indian, Dal Makhani, Parathas' },
        { restaurant: 'Sardeshwari Restaurant', location: 'Main Bazaar', specialties: 'Homestyle Thali' },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Sacred Pilgrimage Bylaw: Non-vegetarian food and alcohol are strictly prohibited within the holy town limits.',
      peacefulNote:
        'Pilgrim dining in Badrinath centers on pure sattvic nourishment, hot ginger tea, and steaming rotis to sustain pilgrims in the high Himalayas.',
    },
    attractions: [
      {
        id: 'IN-UK-BAD-ATT-001',
        name: 'Badrinath Temple',
        category: 'Spiritual · Char Dham, Hinduism, 8th-Century Vaishnavite Shrine established by Adi Shankaracharya',
        timings: '04:30–13:00 & 16:00–21:00 (Opens May to October/November)',
        fee: { domestic: 'Free (Special Darshan and Pooja passes available via the temple committee)', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/uttarakhand/badrinath-temple.png',
        photoCredit: 'Discover Bharat',
        summary:
          'Revered 8th-century black stone Shaligram deity of Lord Badri Narayana housed in an ornately painted temple between the Nar and Narayana peaks beside the Alaknanda.',
      },
      {
        id: 'IN-UK-BAD-ATT-002',
        name: 'Tapt Kund',
        category: 'Spiritual / Nature · Rivers & Lakes, Natural Thermal Sulphur Springs (55 °C) for a holy dip before Darshan',
        timings: '04:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Tapt_Kund_Badrinath.jpg/1280px-Tapt_Kund_Badrinath.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Natural geothermal sulphur spring with water at 55 °C on the riverbank, where pilgrims traditionally take a purifying dip before entering the main sanctum.',
      },
      {
        id: 'IN-UK-BAD-GEM-001',
        name: 'Mana Village & Vyas Gufa',
        category: 'Rural / Spiritual · Historical Sites, "First Village of India" (formerly known as the last village), Cave where sage Vyasa dictated the Mahabharata',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Vyas_Gufa_Mana.jpg/1280px-Vyas_Gufa_Mana.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Indo-Tibetan border village 3 km from Badrinath, featuring the ancient rock-shelter cave where Maharishi Vyasa composed the Mahabharata with Lord Ganesha.',
      },
      {
        id: 'IN-UK-BAD-GEM-002',
        name: 'Vasudhara Falls',
        category: 'Nature / Adventure · Rivers & Lakes, Hiking & Trekking, 400-ft cascading waterfall believed to turn away from those carrying guilt',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Vasudhara_Falls.jpg/1280px-Vasudhara_Falls.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Stunning 400-foot glacial cascade tumbling down sheer granite cliffs 6 km beyond Mana village, revered for sacred folklore and surrounded by Himalayan glaciers.',
      },
    ],
  },
  {
    id: 'kedarnath',
    code: 'IN-UK-CITY-KED',
    name: 'Kedarnath',
    nickname: 'Highest of the 12 Jyotirlingas',
    tagline: '3,583m granite Jyotirlinga, Kedar Dome backdrop, Mandakini river & glacial tarns',
    accentColor: '#0284C7',
    bgGradient: 'from-cyan-50 via-sky-50/40 to-stone-50/30',
    coverImage: '/images/uttarakhand/kedarnath-temple.png',
    photoCredit: 'Discover Bharat / Kedarnath Jyotirlinga',
    flashcardBlurb:
      'One of the twelve Jyotirlingas and the highest among the Char Dham shrines, set at 3,583 metres against the majestic Kedar Dome, accessible via a rigorous Himalayan trek.',
    topStays: [
      { name: 'GMVN Kedarnath Tourist Rest House', category: 'Swargarohini/Nandi Complex — Basic state-run shelter near the temple' },
      { name: 'Local Pilgrim Dharamshalas', category: 'Near Mandir Complex — Basic pilgrim shelter' },
      { name: 'Kedar River Retreat', category: 'Sitapur/Guptkashi Basecamps for pre-trek stays' },
    ],
    dining: {
      veg: [
        { restaurant: 'Kedarnath Temple Canteens', location: 'Near Temple', specialties: 'Basic sustenance: hot Dal, Rice, Khichdi' },
        { restaurant: 'GMVN Dining Halls', location: 'Near Temple', specialties: 'Hot wholesome pilgrim meals' },
        { restaurant: 'Local Dhabas en route', location: 'Jungle Chatti / Bheembali / Lincholi', specialties: 'Piping hot Maggi, Tea & Roti Sabzi' },
      ],
      nonVeg: [],
      pilgrimageNotice:
        'Sacred Pilgrimage Bylaw: Non-vegetarian food and alcohol are strictly prohibited along the entire pilgrimage route and within the town.',
      peacefulNote:
        'Trekking sustenance along the 16-km ascent from Gaurikund includes energy-replenishing hot ginger tea, khichdi, and glucose water.',
    },
    attractions: [
      {
        id: 'IN-UK-KED-ATT-001',
        name: 'Kedarnath Temple',
        category: 'Spiritual · Char Dham, Hinduism, 8th-Century Stone Jyotirlinga Shrine built by Adi Shankaracharya',
        timings: '04:00–15:00 & 17:00–21:00 (Opens May to October/November)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/uttarakhand/kedarnath-temple.png',
        photoCredit: 'Discover Bharat',
        summary:
          'Monumental grey granite stone shrine standing at 3,583 m in front of the snow-clad Kedar Dome, sheltering the conical stone hump manifestation of Lord Shiva.',
      },
      {
        id: 'IN-UK-KED-ATT-002',
        name: 'Bhairav Nath Temple',
        category: 'Spiritual · Hinduism, Guardian Deity shrine offering panoramic views of the Kedarnath valley, located 500m from the main temple',
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Kedarnath_Bhairavnath_Temple.jpg/1280px-Kedarnath_Bhairavnath_Temple.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Perched on a ridge 500 meters above Kedarnath, dedicated to the guardian deity Bhairav Nath who protects the valley during severe winter months when the temple is closed.',
      },
      {
        id: 'IN-UK-KED-GEM-001',
        name: 'Vasuki Tal',
        category: 'Nature / Adventure · Rivers & Lakes, Hiking & Trekking, High-altitude glacial lake offering views of Chaukhamba peaks (8 km rigorous trek from Kedarnath)',
        timings: 'Early morning start required',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Vasuki_Tal_Kedarnath.jpg/1280px-Vasuki_Tal_Kedarnath.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Prismatic glacial lake resting at 4,135 m surrounded by towering Himalayan ridges, renowned for blooming Brahma Kamals and striking reflections of Mt. Chaukhamba.',
      },
      {
        id: 'IN-UK-KED-GEM-002',
        name: 'Chorabari Tal (Gandhi Sarovar)',
        category: "Nature / Spiritual · Rivers & Lakes, Glacial tarn located at the snout of the Chorabari glacier where some of Mahatma Gandhi's ashes were immersed",
        timings: 'Daylight hours',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Chorabari_Tal_Gandhi_Sarovar.jpg/1280px-Chorabari_Tal_Gandhi_Sarovar.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          "Pristine glacial tarn situated at 3,900 m at the snout of Chorabari Glacier, named after Mahatma Gandhi whose immersion took place in its clear waters in 1948.",
      },
    ],
  },
];
