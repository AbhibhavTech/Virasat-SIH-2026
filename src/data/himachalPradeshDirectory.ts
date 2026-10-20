export interface HimachalStay {
  name: string;
  category: string;
}

export interface HimachalFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface HimachalDining {
  veg: HimachalFoodSpot[];
  nonVeg: HimachalFoodSpot[];
  peacefulNote?: string;
}

export interface HimachalAttraction {
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

export interface HimachalCity {
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
  topStays: HimachalStay[];
  dining: HimachalDining;
  attractions: HimachalAttraction[];
}

export const HIMACHAL_PRADESH_DIRECTORY: HimachalCity[] = [
  {
    id: 'shimla',
    code: 'IN-HP-CITY-SLV',
    name: 'Shimla',
    nickname: 'Summer Capital of the Raj',
    tagline: 'Cedar-clad ridges, Victorian neo-Gothic landmarks & UNESCO mountain railway',
    accentColor: '#047857',
    bgGradient: 'from-emerald-50 via-teal-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Shimla Ridge',
    flashcardBlurb:
      'The former summer capital of British India, perched along cedar-clad ridges with Victorian neo-Gothic landmarks, pedestrianized promenades, and narrow-gauge mountain rail history.',
    topStays: [
      { name: 'The Oberoi Cecil', category: 'Chaura Maidan — Luxury Heritage since 1884' },
      { name: 'Wildflower Hall, An Oberoi Resort', category: 'Mashobra — Luxury Forest Retreat' },
      { name: 'Clarkes Hotel', category: 'Mall Road — Heritage Boutique' },
    ],
    dining: {
      veg: [
        { restaurant: 'Wake & Bake Cafe', location: 'The Mall', specialties: 'Handcrafted savoury crepes, organic pies & rich hill filter coffee' },
        { restaurant: 'Indian Coffee House', location: 'The Mall', specialties: 'Historic intellectual hub serving crisp dosas, pakoras & filter coffee since 1957' },
      ],
      nonVeg: [
        { restaurant: 'Cecil Restaurant at The Oberoi', location: 'Chaura Maidan', specialties: 'Authentic Himachali Khatta Meat, Anglo-Indian roasts & wild mushroom risotto' },
        { restaurant: 'Baljees Restaurant', location: 'The Mall', specialties: 'Rich Kashmiri Rogan Josh, spiced Mutton cutlets & warm Gulab Jamuns' },
      ],
      peacefulNote: 'Shimla gastronomy combines British colonial teahouse treats with slow-cooked mountain mutton seasoned with dried pomegranate seeds (anardana) and local wild greens.',
    },
    attractions: [
      {
        id: 'IN-HP-SLV-ATT-001',
        name: 'Viceregal Lodge & IIAS (Rashtrapati Niwas)',
        category: 'Heritage · Historical Buildings, Museums & Scottish Baronial Architecture',
        timings: '10:00–17:00 (Closed Mondays)',
        fee: { domestic: 'INR 20–40', foreign: 'INR 50–100' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Viceregal_Lodge_Shimla.jpg/1280px-Viceregal_Lodge_Shimla.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Stately 1888 Scottish Baronial stone palace on Observatory Hill where historic partition conferences unfolded, now housing the Indian Institute of Advanced Study among heritage manicured lawns.',
      },
      {
        id: 'IN-HP-SLV-ATT-002',
        name: 'The Ridge & Christ Church',
        category: 'Heritage / Spiritual · Christianity, Neo-Gothic Stained Glass & Open Plaza',
        timings: '08:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Christ_Church_Shimla.jpg/1280px-Christ_Church_Shimla.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Shimla’s cultural heart and open-air pedestrian promenade, dominated by the yellow facade of North India’s second oldest church (1857) with five stained-glass windows symbolizing Christian virtues.',
      },
      {
        id: 'IN-HP-SLV-ATT-003',
        name: 'Jakhu Temple & Ropeway',
        category: 'Spiritual / Adventure · Hinduism, Hills & Mountains (Highest Peak)',
        timings: '07:00–20:00',
        fee: { domestic: 'Free (Jakhu Ropeway round-trip: ~INR 500)', foreign: 'Free (Jakhu Ropeway round-trip: ~INR 500)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Jakhu_Hanuman_Statue_Shimla.jpg/1280px-Jakhu_Hanuman_Statue_Shimla.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Sacred shrine atop Shimla’s highest summit (2,455 m) surrounded by alpine deodar trees, dominated by a monumental 108-foot saffron statue of Lord Hanuman visible across the valley.',
      },
      {
        id: 'IN-HP-SLV-ATT-004',
        name: 'Kalka-Shimla Mountain Railway (Toy Train)',
        category: 'Heritage · UNESCO World Heritage, Mountain Railways of India',
        timings: 'Daily scheduled mountain train departures',
        fee: { domestic: 'INR 50–300 depending on train class', foreign: 'INR 50–300 depending on train class' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Kalka_Shimla_Railway_Train.jpg/1280px-Kalka_Shimla_Railway_Train.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1903 engineering masterpiece rising from the plains to 2,076 m across 102 tunnels, 864 arched stone bridges, and 919 sharp curves through pine-fragrant foothills.',
      },
      {
        id: 'IN-HP-SLV-GEM-001',
        name: 'Annandale Ground & Army Heritage Museum',
        category: 'Heritage / Nature · Museums, Military Heritage & Deodar Glades',
        timings: '10:00–14:00 & 15:00–17:00 (Closed Mondays)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Annandale_Ground_Shimla.jpg/1280px-Annandale_Ground_Shimla.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Historic green glade used since colonial times for cricket, polo, and military parades, containing the Army Heritage Museum with rare war trophies, historic uniforms, and brass artillery.',
      },
      {
        id: 'IN-HP-SLV-GEM-002',
        name: 'Chadwick Falls & Glen Forest Walk',
        category: 'Nature / Adventure · Rivers & Lakes, Hiking & Trekking & Glen Woods',
        timings: '06:00–18:00 (Best observed post-monsoon)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Pine Forest Falls',
        summary:
          'A secluded 86-meter cascade dropping into a deep forested gorge surrounded by thick deodar and oak trees, accessible via peaceful nature trails from the historic Glen valley.',
      },
    ],
  },
  {
    id: 'manali',
    code: 'IN-HP-CITY-KUU',
    name: 'Manali',
    nickname: 'Alpine Valley of the Gods',
    tagline: 'Ancient timber pagoda sanctuaries, apple orchards & trans-Himalayan gates',
    accentColor: '#0D9488',
    bgGradient: 'from-teal-50 via-cyan-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Manali River Valley',
    flashcardBlurb:
      'An alpine hub in the northern Beas Valley, bridging ancient timber pagoda temples and apple orchards with high-altitude Himalayan mountain passes.',
    topStays: [
      { name: 'The Himalayan', category: 'Old Manali — Gothic Castle Luxury Resort' },
      { name: 'Span Resort & Spa', category: 'Kullu-Manali Highway — Riverside Luxury Estate' },
      { name: 'Apple Country Resort', category: 'Log Huts Area — Hillside Alpine Stay' },
    ],
    dining: {
      veg: [
        { restaurant: "Drifter's Cafe", location: 'Old Manali', specialties: 'Mediterranean Shakshuka, herbal mountain teas, wood-fired vegetarian pizzas' },
        { restaurant: 'Cafe 1947', location: 'Old Manali (Manalsu River)', specialties: 'Handcrafted pasta, creamy risottos & acoustic music beside the rushing mountain stream' },
      ],
      nonVeg: [
        { restaurant: "Johnson's Bar & Restaurant", location: 'Circuit House Road', specialties: 'Signature Kullu pan-fried mountain trout, grilled lamb cutlets & wood-fired meats' },
        { restaurant: 'Il Forno', location: 'Hadimba Temple Road', specialties: 'Rustic wood-fired pizzas, stuffed calzones & authentic Italian bakes in an orchard setting' },
      ],
      peacefulNote: 'Manali dining features fresh Himalayan rainbow trout caught from glacial tributaries, wood-fired artisanal sourdough, and crisp orchard cider.',
    },
    attractions: [
      {
        id: 'IN-HP-KUU-ATT-001',
        name: 'Hadimba Devi Temple',
        category: 'Heritage / Spiritual · Hinduism, 16th-Century Pagoda Timber Sanctuary',
        timings: '08:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Hidimba_Devi_Temple_Manali.jpg/1280px-Hidimba_Devi_Temple_Manali.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '1553 pagoda temple built around a natural cave where Hidimba meditated, featuring four-tiered wooden roofs intricately carved with animals, foliage, and folk deities amidst towering deodars.',
      },
      {
        id: 'IN-HP-KUU-ATT-002',
        name: 'Solang Valley Adventure Base',
        category: 'Adventure · Paragliding, Skiing, Zorbing & Mountain Trails',
        timings: '09:00–18:00',
        fee: { domestic: 'Free entry (Paragliding INR 1,500–3,200; Skiing INR 500–1,500)', foreign: 'Free entry (Activities separate)' },
        isHiddenGem: false,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Solang Valley',
        summary:
          'High alpine meadow framed by glaciers and snow-capped peaks, serving as Himachal’s thrill sports hub for tandem paragliding, winter skiing, quad biking, and cable car rides.',
      },
      {
        id: 'IN-HP-KUU-ATT-003',
        name: 'Atal Tunnel & Sissu Falls Portal',
        category: 'Nature / Adventure · Engineering Marvels & Trans-Himalayan Gateways',
        timings: 'Open 24 Hours (Subject to winter pass conditions)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Atal_Tunnel_North_Portal_Sissu.jpg/1280px-Atal_Tunnel_North_Portal_Sissu.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'The world’s longest highway tunnel above 10,000 feet (9.02 km) bored beneath the Pir Panjal range, emerging suddenly into the arid grandeur of Lahaul and the towering Sissu waterfall.',
      },
      {
        id: 'IN-HP-KUU-GEM-001',
        name: 'Naggar Castle & Nicholas Roerich Art Gallery',
        category: 'Heritage / Arts · Palaces & Forts, Kath-Kuni Timber-Stone Architecture',
        timings: '09:00–17:00',
        fee: { domestic: 'INR 30', foreign: 'INR 50' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Naggar_Castle_Himachal.jpg/1280px-Naggar_Castle_Himachal.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          '15th-century regional seat of the Kullu Rajas constructed with alternating earthquake-resistant timber beams and dressed stone, overlooking the Russian master Nicholas Roerich’s Himalayan estate.',
      },
      {
        id: 'IN-HP-KUU-GEM-002',
        name: 'Jogini Waterfalls Trek',
        category: 'Adventure / Nature · Hiking & Trekking, Streams & Apple Orchards',
        timings: '06:00–17:30 (Daylight access from Vashisht)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Mountain Stream Trek',
        summary:
          'A gentle 3-km cliff trek starting from the hot sulfur springs of Vashisht, winding past rustic village hamlets and pine groves to reach a cascading sacred waterfall sanctuary.',
      },
    ],
  },
  {
    id: 'dharamshala',
    code: 'IN-HP-CITY-DHM',
    name: 'Dharamshala & McLeod Ganj',
    nickname: 'Little Lhasa & Seat of the Dalai Lama',
    tagline: 'Tibetan monastic sanctuaries, cedar woods & granite Dhauladhar walls',
    accentColor: '#B45309',
    bgGradient: 'from-amber-50 via-orange-50/40 to-stone-50/30',
    coverImage: 'https://images.unsplash.com/photo-1588096344356-9b59b1285268?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Dhauladhar Mountains',
    flashcardBlurb:
      'The seat of His Holiness the Dalai Lama and the Central Tibetan Administration, tucked beneath the granite cliffs of the Dhauladhar mountain range.',
    topStays: [
      { name: 'Fortune Park Moksha', category: 'Strawberry Hills — Mountain View Luxury' },
      { name: 'Hyatt Regency Dharamshala Resort', category: 'Kotwali Bazaar — Luxury Forest Wellness' },
      { name: 'Chonor House', category: 'McLeod Ganj — Authentic Tibetan Boutique Stay' },
    ],
    dining: {
      veg: [
        { restaurant: 'Tibet Kitchen', location: 'Jogiwara Road', specialties: 'Steamed vegetable Momos, warm Vegetable Thukpa & fluffy Tingmo with chili mushroom' },
        { restaurant: 'Illiterati Books & Coffee', location: 'Jogiwara Road', specialties: 'Fresh farm salads, organic bakes, espresso & panoramic mountain balcony reading' },
      ],
      nonVeg: [
        { restaurant: 'Common Ground Cafe', location: 'Dharamkot', specialties: 'Hand-pulled noodle Thenthuk, Tibetan braised pork ribs & steamed momos' },
        { restaurant: 'McLlo Restaurant', location: 'Main Square', specialties: 'Classic Tibetan chicken momos, grilled Himalayan trout & rooftop evening ambience' },
      ],
      peacefulNote: 'McLeod Ganj dining seamlessly unites comforting Tibetan mountain broths, hand-rolled noodles, and butter tea with cosmopolitan cedar-terrace cafes.',
    },
    attractions: [
      {
        id: 'IN-HP-DHM-ATT-001',
        name: 'Tsuglagkhang Complex & Dalai Lama Temple',
        category: 'Spiritual / Arts · Buddhism, Historical Sites & Tibet Museum',
        timings: '05:00–19:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Tsuglagkhang_Complex_McLeod_Ganj.jpg/1280px-Tsuglagkhang_Complex_McLeod_Ganj.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Spiritual nerve-center of Tibetan Buddhism in exile, housing the main temple, monumental gilded statues of Shakyamuni Buddha and Avalokiteshvara, and monastic debate courtyards.',
      },
      {
        id: 'IN-HP-DHM-ATT-002',
        name: 'Namgyal Monastery & Kora Circuit',
        category: 'Spiritual · Buddhism, Meditation & Sacred Prayer-Wheel Walkways',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Prayer_Wheels_McLeod_Ganj.jpg/1280px-Prayer_Wheels_McLeod_Ganj.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Personal monastery of the Dalai Lama dating back to 1575 in Lhasa, featuring the forested Kora circumambulation path draped in fluttering prayer flags and spinning bronze wheels.',
      },
      {
        id: 'IN-HP-DHM-ATT-003',
        name: 'HPCA Cricket Stadium, Dharamshala',
        category: 'Recreation · Sports, World’s Most Scenic High-Altitude Stadium',
        timings: '09:00–17:30',
        fee: { domestic: 'INR 30 (Non-match days)', foreign: 'INR 30 (Non-match days)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Dharamsala_Cricket_Stadium.jpg/1280px-Dharamsala_Cricket_Stadium.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'World-famous cricket ground situated at 1,457 m elevation, designed with Tibetan pagoda-style stands set immediately against the towering snow-covered Dhauladhar wall.',
      },
      {
        id: 'IN-HP-DHM-GEM-001',
        name: 'Norbulingka Institute',
        category: 'Arts / Rural · Crafts-Tourism, Thangka Painting, Woodcarving & Metalcasting',
        timings: '09:00–17:30',
        fee: { domestic: 'INR 50', foreign: 'INR 100' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Norbulingka_Institute_Dharamshala.jpg/1280px-Norbulingka_Institute_Dharamshala.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Dedicated to preserving Tibetan artistic lineages, featuring Japanese-inspired willow and water gardens where master artisans practice intricate Thangka silk applique and statue gilding.',
      },
      {
        id: 'IN-HP-DHM-GEM-002',
        name: 'St. John in the Wilderness Church',
        category: 'Heritage / Spiritual · Christianity, 1852 Neo-Gothic Cedar Sanctuary',
        timings: '08:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/St_John_in_the_Wilderness_Dharamshala.jpg/1280px-St_John_in_the_Wilderness_Dharamshala.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Atmospheric 1852 stone Anglican church set amidst tall deodar woods, noted for its Belgian stained-glass windows and the memorial obelisk of Viceroy Lord Elgin.',
      },
      {
        id: 'IN-HP-DHM-GEM-003',
        name: 'Triund Ridge Trek Base',
        category: 'Adventure / Nature · Hiking & Trekking, Alpine Meadow Viewpoint',
        timings: '06:00–17:00 (Registration mandatory at forest checkpoint)',
        fee: { domestic: 'Free trail access (Forest permits separate for overnight)', foreign: 'Free trail access' },
        isHiddenGem: true,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        photoCredit: 'Unsplash / Triund Ridge',
        summary:
          'Popular 9-km mountain trek rising from Dharamkot to an open alpine ridge (2,828 m) offering front-row panoramas of the colossal Mun peak and the vast Kangra valley.',
      },
    ],
  },
  {
    id: 'spiti-valley',
    code: 'IN-HP-CITY-SPT',
    name: 'Spiti Valley',
    nickname: 'The Middle Land & Cold Desert Citadel',
    tagline: '1,000-year-old mud-brick gompas, Moon Lake & prehistoric fossil beds',
    accentColor: '#9A3412',
    bgGradient: 'from-amber-50 via-stone-50/40 to-orange-50/30',
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    photoCredit: 'Unsplash / Key Monastery Spiti',
    flashcardBlurb:
      '"The Middle Land" between India and Tibet, a high-altitude cold desert plateau defined by 1,000-year-old mud-brick gompas, deep gorges, and fossil-rich villages.',
    topStays: [
      { name: 'Grand Dewachen', category: 'Rangrik — Premium Eco-Hotel' },
      { name: 'Spiti Valley Hotel / The Heritage Kaza', category: 'Kaza Central Boutique Comfort' },
      { name: 'Local Eco-Homestays', category: 'Langza, Komic & Kibber — Community Living' },
    ],
    dining: {
      veg: [
        { restaurant: 'Sol Cafe', location: 'Kaza Market', specialties: 'Antioxidant-rich Seabuckthorn tea, roasted barley Tsampa porridge & spiced walnut cakes' },
        { restaurant: 'Taste of Spiti', location: 'Kaza', specialties: 'Traditional warm butter tea, mountain barley pancakes & hearty vegetable skyu' },
      ],
      nonVeg: [
        { restaurant: 'The Himalayan Cafe', location: 'Kaza', specialties: 'Warm Mutton Thukpa, fluffy Tingmo with spiced local mutton gravies & herbal broths' },
        { restaurant: 'Deyzor Cafe (Hotel Deyzor)', location: 'Kaza', specialties: 'Local yak cheese salads, wood-fired flatbreads & pan-seared river trout' },
      ],
      peacefulNote: 'Spiti cold-desert nutrition is grounded in roasted barley flour (tsampa), wild seabuckthorn berries, dry cheeses, and comforting herbal broths.',
    },
    attractions: [
      {
        id: 'IN-HP-SPT-ATT-001',
        name: 'Key (Kye) Gompa',
        category: 'Spiritual / Heritage · Buddhism, 11th-Century Fortress Monastery & Murals',
        timings: '06:00–18:00',
        fee: { domestic: 'Free (Donations voluntary)', foreign: 'Free (Donations voluntary)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Key_Monastery_Spiti.jpg/1280px-Key_Monastery_Spiti.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Iconic 11th-century cliff-top fortress monastery rising 4,166 m above the Spiti River, housing rare Buddhist thangkas, ancient manuscripts, and wind-instrument chambers.',
      },
      {
        id: 'IN-HP-SPT-ATT-002',
        name: 'Tabo Monastery',
        category: 'Heritage / Spiritual · UNESCO Tentative List, "Ajanta of the Himalayas"',
        timings: '06:00–18:00 (Clay sanctum closes at dusk)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Tabo_Monastery_Spiti.jpg/1280px-Tabo_Monastery_Spiti.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Founded in 996 AD by Buddhist king Yeshe-Ö, this mud-brick complex contains 9 earthen temples adorned with thousand-year-old fresco murals and life-size clay bodhisattva sculptures.',
      },
      {
        id: 'IN-HP-SPT-ATT-003',
        name: 'Dhankar Monastery & Fortified Cliff',
        category: 'Heritage · Buddhism, Monasteries & High-Cliff Architecture',
        timings: '06:30–17:30',
        fee: { domestic: 'INR 25 museum upkeep fee', foreign: 'INR 25 museum upkeep fee' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Dhankar_Gompa_Spiti.jpg/1280px-Dhankar_Gompa_Spiti.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Spectacular cliff-hanging gompa and former royal fortress poised 300 meters above the confluence of the Spiti and Pin rivers on sharp, crumbling sedimentary pinnacles.',
      },
      {
        id: 'IN-HP-SPT-ATT-004',
        name: 'Chandra Taal (The Moon Lake)',
        category: 'Nature / Adventure · Rivers & Lakes, High-Altitude Wetlands (4,300 m)',
        timings: 'Daylight access (Accessible June to October only)',
        fee: { domestic: 'Free (Campsite tariffs separate)', foreign: 'Free (Campsite tariffs separate)' },
        isHiddenGem: false,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Chandra_Taal_Lake_Spiti.jpg/1280px-Chandra_Taal_Lake_Spiti.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Crescent-shaped sapphire alpine lake at 4,300 m in the Samudra Tapu plateau, mirroring snow-streaked peaks and shifting in color from turquoise to deep emerald through the daylight hours.',
      },
      {
        id: 'IN-HP-SPT-GEM-001',
        name: "Hikkim Post Office (World's Highest at 4,440 m)",
        category: 'Rural / Heritage · High-Altitude Postal Heritage & Postcard Hub',
        timings: '10:00–16:00 (Working days)',
        fee: { domestic: 'Free (Postcards & stamps INR 20–50)', foreign: 'Free (Postcards & stamps INR 20–50)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Hikkim_Post_Office.jpg/1280px-Hikkim_Post_Office.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'Operating since 1983 at an elevation of 4,440 meters, this remote mud-brick branch allows travelers to hand-post nostalgic letters and postcards to any corner of the globe.',
      },
      {
        id: 'IN-HP-SPT-GEM-002',
        name: 'Langza Giant Buddha & Fossil Marine Sediments',
        category: 'Spiritual / Nature · Prehistoric Tethys Sea Fossils & Golden Buddha',
        timings: 'Open 24 Hours',
        fee: { domestic: 'Free (Fossil conservation laws apply)', foreign: 'Free (Fossil conservation laws apply)' },
        isHiddenGem: true,
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Langza_Buddha_Statue.jpg/1280px-Langza_Buddha_Statue.jpg',
        photoCredit: 'Wikimedia Commons',
        summary:
          'High mountain village guarded by a serene 1,000-year-old golden Buddha colossus overlooking snow peaks, famous for marine ammonite fossils (Chaudua) formed when the Himalayas rose from the ancient Tethys Ocean.',
      },
    ],
  },
];
