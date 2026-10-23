export interface AndhraStay {
  name: string;
  category: string;
}

export interface AndhraFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface AndhraDining {
  veg: AndhraFoodSpot[];
  nonVeg: AndhraFoodSpot[];
  peacefulNote?: string;
  pilgrimageNotice?: string;
}

export interface AndhraAttraction {
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

export interface AndhraCity {
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
  topStays: AndhraStay[];
  dining: AndhraDining;
  attractions: AndhraAttraction[];
}

export const ANDHRA_PRADESH_DIRECTORY: AndhraCity[] = [
  {
    id: 'tirupati',
    code: 'IN-AP-CITY-TIR',
    name: 'Tirupati',
    nickname: 'The Spiritual Capital of Andhra & Abode of Balaji',
    tagline: 'Seven Sacred Seshachalam Hills, Vayu Lingam Sanctuaries, and Billion-Year Rock Arches',
    accentColor: '#D97706',
    bgGradient: 'from-amber-950/60 via-orange-950/40 to-slate-950/70',
    flashcardBlurb:
      'The spiritual capital of Andhra Pradesh, resting on the seven hills of Seshachalam, drawing millions to the sacred shrine of Lord Venkateswara with its legendary wealth and devotion.',
    coverImage: '/images/andhra/tirupati-temple.jpg',
    photoCredit: 'User Photo / Tirumala Venkateswara Gopuram against Blue Sky',
    topStays: [
      { name: 'Taj Tirupati', category: 'Renigunta Road — Modern Luxury with Dravidian Architectural Accents' },
      { name: 'Marasa Sarovar Premiere', category: 'Upadhyaya Nagar — Thematic 10-Avatar Luxury Resort' },
      { name: 'Fortune Select Grand Ridge', category: 'Shilparamam — Upscale Comfort near Hill Approaches' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Matrusri Tarigonda Vengamamba Annaprasadam Complex',
          location: 'Tirumala Hill',
          specialties: 'Sacred continuous Annaprasadam: piping hot Sambar rice, sweet Pongal, curd rice, and Chutney serving lakhs daily',
        },
        {
          restaurant: 'Bhimas Residency',
          location: 'Karakambadi Road',
          specialties: 'Authentic royal Andhra Thali, crispy Ghee Roast Dosa, spicy Podi Idli, and authentic filter coffee',
        },
        {
          restaurant: 'Jalpaan',
          location: 'Renigunta Road',
          specialties: 'Premium vegetarian dining, Potli Biryani, Paneer Tikka lababdar, and Rajasthani sweets',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Blue Fox (Minerva Grand)',
          location: 'Tirupati City Center',
          specialties: 'Fiery Andhra Kodi Pulao (spiced chicken pulao), Nellore Fish Curry, and crispy Pepper Chicken',
        },
        {
          restaurant: 'Southern Spice',
          location: 'Renigunta Road',
          specialties: 'Rayalaseema Mutton Roast, Gongura Mamsam (mutton cooked with sorrel leaves), and Natu Kodi Biryani',
        },
      ],
      peacefulNote:
        'Tirumala Hill is strictly vegetarian and alcohol-free; pilgrims partake in sacred Tirupati Laddu Prasadam infused with pure cow ghee, cardamom, cashew nuts, and sugar candy.',
      pilgrimageNotice:
        'Special Entry Darshan (₹300) must be booked online strictly 60 days in advance via the official TTD portal (ttdevasthanams.ap.gov.in). Free Sarva Darshan queues require physical tokens in Tirupati.',
    },
    attractions: [
      {
        id: 'IN-AP-TIR-ATT-001',
        name: 'Sri Venkateswara Swamy Temple, Tirumala',
        category: 'Spiritual · Hinduism, One of the Wealthiest and Most Visited Temples Globally, Dravidian Architecture',
        timings: '~02:30–01:00 (Darshan briefly pauses during scheduled daily rituals & sevas)',
        fee: {
          domestic: 'Free (Sarva Darshan); ₹300 Special Entry (Advance booking mandatory); SRIVANI VIP: ₹10,500',
          foreign: 'Same as domestic',
        },
        isHiddenGem: false,
        image: '/images/andhra/tirupati-temple.jpg',
        photoCredit: 'User Photo / Tirumala Temple Gopuram',
        summary:
          'Located on Venkatadri, the seventh peak of the sacred Seshachalam mountain range. Dedicated to Lord Venkateswara (an incarnation of Vishnu), this 10th-century Dravidian architectural marvel features the gold-gilded Ananda Nilayam tower above the sanctum, where the self-manifested 8-foot black stone deity stands adorned in diamond armor and gold ornaments.',
      },
      {
        id: 'IN-AP-TIR-ATT-002',
        name: 'Sri Kalahasti Temple',
        category: 'Spiritual · Hinduism, Pancha Bhoota Stalam (Vayu Lingam), Famous for Rahu-Ketu Sarpadosha Nivarana',
        timings: '06:00–21:00',
        fee: { domestic: 'Free (Rahu-Ketu Sarpadosha Pooja: ₹500–₹2,500)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Sri_Kalahasti_Temple_Gopuram.jpg/1280px-Sri_Kalahasti_Temple_Gopuram.jpg',
        photoCredit: 'Wikimedia Commons / Sri Kalahasti Temple Gopuram',
        summary:
          'Ancient 5th-century Chola and Vijayanagara temple situated 36 km from Tirupati along the Swarnamukhi River. Revered as the Vayu (Air) Lingam among the five sacred Pancha Bhoota shrines; the lamp inside the sanctum continuously flickers even when all doors are closed. Globally famed for remedial Rahu-Ketu astrological poojas.',
      },
      {
        id: 'IN-AP-TIR-ATT-003',
        name: 'Silathoranam Natural Rock Arch',
        category: 'Nature / Heritage · Geological Formations, Rare 1.5 Billion-Year-Old Natural Quartzite Rock Arch on Tirumala Hills',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Silathoranam_Tirupati.jpg/1280px-Silathoranam_Tirupati.jpg',
        photoCredit: 'Wikimedia Commons / Silathoranam Natural Arch',
        summary:
          'National Geo-heritage Monument located near Chakra Theertham on the Tirumala Hills. Formed by natural weathering and erosion in pre-Cambrian quartzites dating back 1.5 billion years, this bridge arch spans 8 metres in width and 3 metres in height, matching only two other geological formations worldwide (in Utah and the UK).',
      },
      {
        id: 'IN-AP-TIR-GEM-001',
        name: 'Talakona Waterfalls',
        category: 'Nature / Adventure · Rivers & Lakes, Hiking & Trekking, Highest Waterfall in Andhra Pradesh (270 ft) in National Park',
        timings: '06:00–17:30',
        fee: { domestic: 'Forest Entry INR 50', foreign: 'INR 200' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Talakona_Waterfalls_Andhra_Pradesh.jpg/1280px-Talakona_Waterfalls_Andhra_Pradesh.jpg',
        photoCredit: 'Wikimedia Commons / Talakona Waterfalls',
        summary:
          'Cascading 270 feet sheer down red sandstone cliffs 49 km from Tirupati inside Sri Venkateswara National Park. The crystalline mountain waters flow through medicinal herbs and sandalwood groves, believed to possess therapeutic curative powers. Features a canopy rope walk suspended 40 feet high above the forest floor.',
      },
      {
        id: 'IN-AP-TIR-GEM-002',
        name: 'Sri Kapileswara Swamy Temple (Kapila Theertham)',
        category: 'Spiritual / Nature · Hinduism, Ancient Shiva Cave Temple located at the base of Tirumala Hills with Cascading Waterfall',
        timings: '05:00–20:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kapila_Theertham_Temple_Tirupati.jpg/1280px-Kapila_Theertham_Temple_Tirupati.jpg',
        photoCredit: 'Wikimedia Commons / Kapila Theertham Temple',
        summary:
          'The only Shaivite temple in the sacred Vaishnavite enclave of Tirupati. Nestled at the foot of a sheer vertical cliff where the mountain stream of Kapila Theertham plunges into a sacred temple pond. Saint Kapila Muni is believed to have performed severe penance in the natural rock-cut cave here.',
      },
    ],
  },
  {
    id: 'visakhapatnam',
    code: 'IN-AP-CITY-VTZ',
    name: 'Visakhapatnam / Vizag',
    nickname: 'The Jewel of the East Coast & City of Destiny',
    tagline: 'Naval Heritage, Blue Flag Surf Beaches, and Eastern Ghats Promontories',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-950/60 via-blue-950/40 to-slate-950/70',
    flashcardBlurb:
      'The "Jewel of the East Coast", blending heavy Indian Navy heritage, serene golden beaches, Eastern Ghats hillscapes, and a bustling port-city atmosphere.',
    coverImage: '/images/andhra/ins-kurusura-submarine.jpg',
    photoCredit: 'User Photo / INS Kurusura Submarine Museum on RK Beach',
    topStays: [
      { name: 'Novotel Visakhapatnam Varun Beach', category: 'Beach Road — Sea-facing 5-Star Luxury with Rooftop Pool' },
      { name: 'The Bheemli Resort Managed by Accor', category: 'Bheemunipatnam — Coastal Boutique Beach Retreat' },
      { name: 'Welcomhotel by ITC Hotels, Devee Grand Bay', category: 'Beach Road — Sea Views & Coastal Culinary Excellence' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Venkatadri Vantillu',
          location: 'Siripuram',
          specialties: 'Legendary fluffy Sponge Dosa, Ghee Karam Pesarattu with Upma, and filter coffee',
        },
        {
          restaurant: 'Sri Sairam Parlour',
          location: 'Diamond Park',
          specialties: 'Authentic Andhra vegetarian thali, steaming Idlis, crispy Vada, and spicy tomato chutney',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Sea Inn / Raju Gari Dhaba',
          location: 'Rushikonda',
          specialties: 'Spicy Andhra seafood, fiery Royyala Vepudu (prawn fry), Vanjaram fish fry, and Natu Kodi Pulao',
        },
        {
          restaurant: 'The Square at Novotel',
          location: 'Beach Road',
          specialties: 'Grand coastal seafood buffet, freshly grilled catch of the day, and authentic coastal Andhra mutton curry',
        },
      ],
      peacefulNote:
        'Vizag cuisine combines Eastern Ghats spice with Bay of Bengal seafood: freshly netted prawns tossed in shallots and green chillies, and crispy Pesarattu stuffed with seasoned Upma.',
    },
    attractions: [
      {
        id: 'IN-AP-VTZ-ATT-001',
        name: 'INS Kurusura Submarine Museum & RK Beach',
        category: 'Heritage · Museums, Decommissioned Soviet-built Indian Navy Submarine positioned on the Beachfront',
        timings: '14:00–20:30 (Mon–Sat); 10:00–12:30 & 14:00–20:30 (Sundays)',
        fee: { domestic: 'INR 70 (Adults) / INR 40 (Children)', foreign: 'INR 70' },
        isHiddenGem: false,
        image: '/images/andhra/ins-kurusura-submarine.jpg',
        photoCredit: 'User Photo / INS Kurusura Submarine Preserved on Sand',
        summary:
          'A decommissioned Soviet-built Foxtrot-class submarine that played a crucial role in the 1971 Indo-Pak War. Hauled entirely onto the sands of Ramakrishna Beach in 2001, it is Asia’s first submarine converted into a walkthrough public museum, guided by retired naval submariners.',
      },
      {
        id: 'IN-AP-VTZ-ATT-002',
        name: 'Kailasagiri Hill Park',
        category: 'Nature / Recreation · Forests & Gardens, Panoramic Sea Views, 40-ft Shiva-Parvati Idols, Ropeway & Toy Train',
        timings: '10:00–20:00',
        fee: { domestic: 'Park Entry Free (Ropeway: ~INR 130 round trip)', foreign: 'Park Free (Ropeway: ~INR 130)' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Kailasagiri_Shiva_Parvathi_Statue.jpg/1280px-Kailasagiri_Shiva_Parvathi_Statue.jpg',
        photoCredit: 'Wikimedia Commons / Kailasagiri Shiva Parvati Sculpture',
        summary:
          'Perched at 360 feet atop a coastal hill commanding bird\'s-eye panoramas of the Bay of Bengal and Vizag harbour. Dominating the summit are magnificent 40-foot white statues of Lord Shiva and Goddess Parvati, surrounded by landscaped gardens, a circular toy train, and a coastal ropeway cable car.',
      },
      {
        id: 'IN-AP-VTZ-ATT-003',
        name: 'Rushikonda Beach',
        category: 'Nature / Adventure · Beaches & Cruises, Blue Flag Certified, Golden Sands, Surfing & Water Sports',
        timings: '06:00–18:00 (Water sports close by sunset)',
        fee: { domestic: 'Free (Water sports activities extra: INR 300–1,500)', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Aerial_view_of_Rushikonda_beach.jpg/1280px-Aerial_view_of_Rushikonda_beach.jpg',
        photoCredit: 'Wikimedia Commons / Rushikonda Beach Aerial',
        summary:
          'Renowned as the premier beach of Andhra Pradesh, awarded international Blue Flag eco-certification for water cleanliness, safety, and amenities. Set between rocky hills, it is a hub for sea kayaking, speedboating, jet-skiing, and beginner surfing lessons.',
      },
      {
        id: 'IN-AP-VTZ-GEM-001',
        name: "Yarada Beach & Dolphin's Nose",
        category: 'Nature · Beaches & Cruises, Hills & Mountains, Secluded Cove surrounded by Banana Plantations & Lighthouse',
        timings: '06:00–18:00',
        fee: { domestic: 'Nominal access fee at private agricultural gates (INR 30)', foreign: 'INR 30' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Yarada_Beach_Visakhapatnam.jpg/1280px-Yarada_Beach_Visakhapatnam.jpg',
        photoCredit: 'Wikimedia Commons / Yarada Beach & Dolphin Promontory',
        summary:
          'Tucked behind the massive Dolphin’s Nose headland (a 358-metre rocky promontory resembling a dolphin that shields Vizag port). Yarada is an uncrowded golden cove bordered on three sides by lush green hills, coconut groves, and banana plantations with powerful turquoise surf.',
      },
      {
        id: 'IN-AP-VTZ-GEM-002',
        name: 'Thotlakonda Buddhist Complex',
        category: 'Heritage / Spiritual · Buddhism, Archeological Sites, 2,000-Year-Old Monastic Ruins overlooking Bay of Bengal',
        timings: '08:00–17:00',
        fee: { domestic: 'INR 15', foreign: 'INR 100' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Thotlakonda_Buddhist_Monastery.jpg/1280px-Thotlakonda_Buddhist_Monastery.jpg',
        photoCredit: 'Wikimedia Commons / Thotlakonda Hilltop Stupas',
        summary:
          'Excavated Buddhist monastic settlement flourishing between the 2nd century BC and 2nd century AD atop a 128-metre hill facing the sea. Features rock-cut cisterns, apsidal chaityagrihas, stupas, and viharas that served as a pivotal international maritime trade and academic hub for monks travelling to Sri Lanka and Southeast Asia.',
      },
    ],
  },
  {
    id: 'araku-valley',
    code: 'IN-AP-CITY-ARK',
    name: 'Araku Valley',
    nickname: 'Coffee Valleys & Million-Year Caverns of the Eastern Ghats',
    tagline: 'Organic Arabica Plantations, Bongu Kodi Bamboo Chicken, and Subterranean Stalactites',
    accentColor: '#16A34A',
    bgGradient: 'from-emerald-950/60 via-green-950/40 to-slate-950/70',
    flashcardBlurb:
      'A pristine Eastern Ghats hill station enveloped in organic Arabica coffee plantations, mist-covered valleys, indigenous tribal culture, and million-year-old limestone caves.',
    coverImage: '/images/andhra/borra-caves.jpg',
    photoCredit: 'User Photo / Borra Caves Illuminated Limestone Cavern',
    topStays: [
      { name: 'AP Tourism Haritha Valley Resort', category: 'Araku Town — Scenic Government Cottages surrounded by Pines' },
      { name: 'Tyda Jungle Bells Eco-Resort', category: 'Tyda — Wooden Log Huts in Forest Wilderness' },
      { name: 'Symphony Resorts', category: 'Araku Valley — Contemporary Hillside Family Suites' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Haritha Resort Canteen',
          location: 'Araku Town',
          specialties: 'Piping hot Poori with potato kurma, fresh local vegetable curries, Dal, and steamed rice',
        },
        {
          restaurant: 'Araku Coffee House',
          location: 'Araku Valley Center',
          specialties: 'Locally grown organic Arabica coffee, chocolate brownies, espresso, and spicy onion pakodas',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Tribal Roadside Dhabas',
          location: 'Araku-Vizag Highway',
          specialties: 'Authentic Bongu Kodi (chicken marinated in wild spices, stuffed into hollow green bamboo stems and roasted over open coals without water or oil)',
        },
      ],
      peacefulNote:
        'Araku Valley is globally celebrated for its award-winning organic GI-tagged Araku Arabica coffee, grown by indigenous tribal farmer cooperatives under shaded forest canopies.',
    },
    attractions: [
      {
        id: 'IN-AP-ARK-ATT-001',
        name: 'Borra Caves',
        category: "Nature / Adventure · Geological Formations, One of India's Deepest and Largest Caves, Gosthani Stalactites",
        timings: '10:00–13:00 & 14:00–17:00',
        fee: { domestic: 'INR 100 (Adults) / INR 45 (Children) / Camera: INR 25', foreign: 'INR 100' },
        isHiddenGem: false,
        image: '/images/andhra/borra-caves.jpg',
        photoCredit: 'User Photo / Borra Caves Subterranean Chambers',
        summary:
          'One of India’s deepest and largest subterranean cave networks, discovered in 1807 by William King of the Geological Survey of India. Perched at 2,300 feet in the Ananthagiri Hills, the caves plunge 80 metres deep through karstic limestone, carved by the underground Gosthani River into dramatic stalactites and stalagmites resembling Shiva-Parvati and Mother & Child.',
      },
      {
        id: 'IN-AP-ARK-ATT-002',
        name: 'Araku Tribal Museum',
        category: 'Arts / Rural · Museums, Tribal-Tourism, Mud-Wall Architecture showcasing Eastern Ghats Indigenous Lifestyles',
        timings: '09:00–19:00',
        fee: { domestic: 'INR 40', foreign: 'INR 100' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Araku_Tribal_Museum_Dhimsa.jpg/1280px-Araku_Tribal_Museum_Dhimsa.jpg',
        photoCredit: 'Wikimedia Commons / Araku Tribal Museum Displays',
        summary:
          'Constructed from red clay and mud-plastered timber walls, this vibrant cultural center documents the lives, hunting gear, musical instruments, and customs of 19 indigenous tribes of the Eastern Ghats. Features live evening performances of the traditional rhythmic Dhimsa folk dance.',
      },
      {
        id: 'IN-AP-ARK-ATT-003',
        name: 'Chaparai Water Cascades',
        category: 'Nature / Recreation · Rivers & Lakes, Gentle Mountain Stream flowing over Broad Smooth Rock Beds',
        timings: '08:00–17:30',
        fee: { domestic: 'INR 10–20', foreign: 'INR 20' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Chaparai_Water_Cascade_Araku.jpg/1280px-Chaparai_Water_Cascade_Araku.jpg',
        photoCredit: 'Wikimedia Commons / Chaparai Cascade Rocks',
        summary:
          'A serene natural water cascade 15 km from Araku town where a perennial mountain stream glides gently over wide, flat sloping rock beds framed by dense evergreen forests. A popular picnic destination and location for Telugu film shoots.',
      },
      {
        id: 'IN-AP-ARK-GEM-001',
        name: 'Katiki Waterfalls',
        category: 'Nature / Adventure · Rivers & Lakes, Hiking & Trekking, 50-ft Cascade accessed via Rugged 4x4 Jeep Trail',
        timings: '08:00–16:00',
        fee: { domestic: 'Free (Jeep hire from Borra Cave junction: ~INR 250–350 per person)', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Katiki_Waterfalls_Araku.jpg/1280px-Katiki_Waterfalls_Araku.jpg',
        photoCredit: 'Wikimedia Commons / Katiki Waterfalls Jungle Plunge',
        summary:
          'Originating from the Gosthani River and dropping 50 feet into a pristine emerald pool deep inside the forest, 7 km from Borra Caves. The approach involves an exhilarating off-road 4WD jeep ride over mud boulders and a scenic 20-minute trek past tribal villages and babbling streams.',
      },
      {
        id: 'IN-AP-ARK-GEM-002',
        name: 'Lambasingi ("Kashmir of Andhra")',
        category: 'Nature / Rural · Hills & Mountains, "Kashmir of Andhra", Unique Micro-Climate experiencing Winter Frost & Mists',
        timings: 'Best visited early morning (05:00–08:00) for thick valley mists',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Lambasingi_Misty_Hills.jpg/1280px-Lambasingi_Misty_Hills.jpg',
        photoCredit: 'Wikimedia Commons / Lambasingi Misty Valleys',
        summary:
          'Charming mountain hamlet situated 90 km from Araku at an elevation of 1,000 metres. Renowned as the only place in southern India that occasionally witnesses sub-zero winter temperatures and morning ground frost, enveloped in aromatic pepper vines, silver oak trees, and misty coffee plantations.',
      },
    ],
  },
  {
    id: 'lepakshi',
    code: 'IN-AP-CITY-LEP',
    name: 'Lepakshi',
    nickname: 'Vijayanagara Stone Epic & The Mystical Hanging Pillar',
    tagline: 'Colossal Monolithic Nandi, Natural Mineral Frescoes, and Gravity-Defying Architecture',
    accentColor: '#B45309',
    bgGradient: 'from-amber-950/60 via-red-950/40 to-slate-950/70',
    flashcardBlurb:
      'A 16th-century Vijayanagara architectural marvel in the Rayalaseema region, famous for its mystifying hanging pillar, massive monolithic Nandi, and exquisite natural-pigment fresco paintings.',
    coverImage: '/images/andhra/lepakshi-nandi.jpg',
    photoCredit: 'User Photo / Monolithic Nandi Statue at Lepakshi',
    topStays: [
      { name: 'Haritha Hotel Lepakshi', category: 'APTDC — Basic Comfortable Stay adjacent to Temple' },
      { name: 'Hotel Masineni Grand', category: 'Anantapur Town — Premium Modern Stay (Day Trip Base)' },
      { name: 'Bengaluru Airport Hotels', category: 'Devenahalli — Luxury Base (100 km / 2 hrs from Lepakshi)' },
    ],
    dining: {
      veg: [
        {
          restaurant: 'Haritha Restaurant',
          location: 'Opposite Lepakshi Temple',
          specialties: 'Traditional South Indian Thali, Idli, crisp Medu Vada, and Andhra Sambar',
        },
        {
          restaurant: 'Local Lepakshi Tiffin Centers',
          location: 'Temple Outer Lane',
          specialties: 'Tangy Pulihora (tamarind rice), curd rice, hot Mirchi Bajji, and lemon tea',
        },
      ],
      nonVeg: [
        {
          restaurant: 'Anantapur Town Highway Eateries',
          location: 'Anantapur / Hindupur (Outside Temple Perimeter)',
          specialties: 'Fierce Rayalaseema spicy Mutton Curry, Natu Kodi Kura paired with hot Ragi Sangati and country ghee',
        },
      ],
      peacefulNote:
        'The sacred perimeter around Veerabhadra Swamy temple is strictly vegetarian; travelers enjoy Rayalaseema comfort staples like Ragi Sangati (millet balls) and sour Gongura pachadi.',
    },
    attractions: [
      {
        id: 'IN-AP-LEP-ATT-001',
        name: 'Veerabhadra Swamy Temple & The Hanging Pillar',
        category: 'Spiritual / Heritage · UNESCO Tentative List, 1530 AD Vijayanagara Architecture, Legendary Pillar Defying Gravity',
        timings: '06:00–18:00 (Morning Aarti: 07:00 / Evening Aarti: 17:00)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Lepakshi_Veerabhadra_Temple_Courtyard.jpg/1280px-Lepakshi_Veerabhadra_Temple_Courtyard.jpg',
        photoCredit: 'Wikimedia Commons / Lepakshi Veerabhadra Temple Courtyard',
        summary:
          'Constructed in 1530 AD by royal brothers Virupanna and Veeranna during the reign of Vijayanagara emperor Achyuta Deva Raya. World-renowned for its architectural marvel—the "Hanging Pillar"—which does not rest on the floor; cloth and thin paper can be passed entirely underneath. Also features the giant 7-hooded stone Nagalinga carved from a single granite boulder.',
      },
      {
        id: 'IN-AP-LEP-ATT-002',
        name: 'Monolithic Nandi of Lepakshi',
        category: 'Heritage / Arts · Monuments, One of India\'s Largest Single-Stone Granite Nandi Statues (15 ft high, 27 ft long)',
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: '/images/andhra/lepakshi-nandi.jpg',
        photoCredit: 'User Photo / Colossal Monolithic Nandi Bull',
        summary:
          'Located 200 metres east of the temple complex, this colossal monolithic Nandi bull was sculpted from a single granite hillock. Measuring 4.5 metres (15 feet) in height and 8.23 metres (27 feet) in length, it is one of the largest monolithic bulls in India, wearing exquisitely chiseled bell necklaces, beaded garlands, and royal regalia.',
      },
      {
        id: 'IN-AP-LEP-ATT-003',
        name: 'Lepakshi Frescoes (Veerabhadra Temple Ceilings)',
        category: "Arts / Heritage · Painting, Asia's Largest Fresco (The Veerabhadra Ceiling Mural), Ancient Natural Mineral Dye Art",
        timings: '06:00–18:00',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: false,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Lepakshi_Ceiling_Fresco_Mural.jpg/1280px-Lepakshi_Ceiling_Fresco_Mural.jpg',
        photoCredit: 'Wikimedia Commons / Lepakshi Ceiling Frescoes',
        summary:
          'Adorning the ceiling of the Natya Mandapa (Dance Hall), this 23-by-13-foot masterpiece depicts Lord Veerabhadra alongside 14 avatars of Shiva. Painted in the 16th century using mineral pigments, vegetable dyes, and lime plaster, it represents the crowning pinnacle of Vijayanagara mural art in India.',
      },
      {
        id: 'IN-AP-LEP-GEM-001',
        name: 'Penukonda Fort',
        category: 'Heritage / Adventure · Palaces & Forts, Hiking & Trekking, Second Capital of Vijayanagara Empire, Gagan Mahal',
        timings: '08:00–17:30 (40 km north of Lepakshi)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Penukonda_Fort_Gagan_Mahal.jpg/1280px-Penukonda_Fort_Gagan_Mahal.jpg',
        photoCredit: 'Wikimedia Commons / Penukonda Fort Gagan Mahal',
        summary:
          'Served as the secondary capital and summer retreat of the Vijayanagara kings, and their last refuge after the fall of Hampi in 1565. The hillside fort features the Indo-Saracenic Gagan Mahal summer palace, Babayya Dargah, massive granite watchtowers, and rainwater collection tanks.',
      },
      {
        id: 'IN-AP-LEP-GEM-002',
        name: 'Veerapuram Bird Sanctuary',
        category: 'Nature / Rural · Wildlife-Tourism, Communal Village Tree-Nesting Haven for Thousands of Migratory Painted Storks',
        timings: 'Daylight hours (Best visited December to May)',
        fee: { domestic: 'Free', foreign: 'Free' },
        isHiddenGem: true,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Painted_Storks_Nesting_Andhra.jpg/1280px-Painted_Storks_Nesting_Andhra.jpg',
        photoCredit: 'Wikimedia Commons / Migratory Painted Storks in Andhra',
        summary:
          'Unique conservation harmony in Veerapuram village near Hindupur. Every year between November and May, thousands of migratory Painted Storks fly from Eastern Europe and Central Asia to build nests in the tamarind, neem, and banyan trees directly in the courtyards and streets of local villagers, who fiercely protect them as harbingers of good monsoon harvests.',
      },
    ],
  },
];
