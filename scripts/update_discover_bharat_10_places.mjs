import fs from 'fs';
import path from 'path';

const PLACES_DATA = [
  {
    target_state_id: 'karnataka',
    target_city_id: 'bengaluru',
    target_category: 'nature_parks_zoo',
    id: 'karnataka_bannerghatta_np',
    match_names: ['bannerghatta'],
    data: {
      name: 'Bannerghatta National Park & Biological Safari',
      canonical_name: 'Bannerghatta National Park',
      aliases: ['Bannerghatta Biological Park', 'BBP'],
      category: 'nature_parks_zoo',
      category_label: 'National Park & Wildlife Safari',
      topic: 'Nature',
      subtopic: 'Wildlife & Safari',
      importance_level: 'major',
      summary: 'A 260 sq km biological reserve and elephant corridor in Bengaluru featuring lion and tiger safaris, India\'s first butterfly park, and a rescue zoo.',
      short_description: 'Sprawling wildlife reserve south of Bengaluru with tiger safaris, Asiatic lions, and a dedicated butterfly conservatory.',
      detailed_description: 'Established in 1974, Bannerghatta National Park covers approximately 260 square kilometers of moist deciduous scrub and dense forest on the southern outskirts of Bengaluru. It serves as a vital elephant corridor linking the BR Hills and Sathyamangalam forests. The biological park features guided air-conditioned bus safaris into open natural habitats of Bengal tigers and Asiatic lions, a 7.5-acre butterfly park with a circular glass conservatory, and an expansive wildlife rescue center.',
      historical_significance: 'Declared a national park in 1974 and notified as a biological park in 2002 to preserve biodiversity on Bengaluru\'s urban fringe while pioneering ethical wildlife rehabilitation.',
      fees: {
        domestic: 350,
        international: 500,
        currency: 'INR',
        status: 'VERIFIED',
        free_entry: false
      },
      entry_fee: '₹350–₹400 for Grand Safari + Zoo (Adults); concessions for children',
      timings: {
        opening_time: '09:30 AM',
        closing_time: '05:00 PM',
        closed_days: ['Tuesday'],
        status: 'VERIFIED'
      },
      opening_hours: '09:30 AM – 05:00 PM (Closed on Tuesdays)',
      best_time_to_visit: 'September to March (cooler morning hours)',
      visit_duration: {
        recommended_mins: 240,
        label: '4–5 hours',
        status: 'VERIFIED'
      },
      suggested_duration: '4–5 hours',
      coordinates: {
        lat: 12.8009,
        lng: 77.5777
      },
      lat: 12.8009,
      lng: 77.5777,
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bengal_Tiger_at_Bannerghatta_National_Park.jpg/1280px-Bengal_Tiger_at_Bannerghatta_National_Park.jpg',
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bengal_Tiger_at_Bannerghatta_National_Park.jpg/800px-Bengal_Tiger_at_Bannerghatta_National_Park.jpg',
      attribution: 'Photo: Wikimedia Commons / Creative Commons CC BY-SA 4.0',
      source_page: 'https://en.wikipedia.org/wiki/Bannerghatta_National_Park',
      source_url: 'https://bannerghattabiologicalpark.org/',
      source_name: 'Bannerghatta Biological Park Authority',
      status: 'VERIFIED',
      verification_status: 'verified',
      visitor_notes: [
        'Book safari tickets online in advance to avoid weekend queues',
        'Closed on Tuesdays for animal health maintenance',
        'Carry drinking water and wear comfortable walking shoes'
      ],
      map_search: 'Bannerghatta National Park Bengaluru Karnataka',
      tags: ['national_park', 'wildlife_safari', 'tiger_reserve', 'bengaluru', 'karnataka'],
      features: { map: true, navigation: true, ai: true, '3d': false }
    }
  },
  {
    target_state_id: 'rajasthan',
    target_city_id: 'jaipur',
    target_category: 'heritage',
    id: 'rajasthan_002',
    match_names: ['amber fort', 'amer fort'],
    data: {
      name: 'Amer Fort (Amber Palace)',
      canonical_name: 'Amer Fort',
      aliases: ['Amber Fort', 'Amer Palace', 'Amber Palace'],
      category: 'heritage',
      category_label: 'Historic Hill Fort',
      topic: 'Heritage',
      subtopic: 'UNESCO World Heritage',
      importance_level: 'major',
      summary: 'A monumental 16th-century hilltop fortress above Maota Lake renowned for Rajput-Mughal architecture, ornate gateways, and the Sheesh Mahal mirror palace.',
      short_description: 'UNESCO World Heritage hill fort in Jaipur showcasing majestic yellow and pink sandstone ramparts, Ganesh Pol, and mirror-mosaic halls.',
      detailed_description: 'Perched atop the Cheel ka Teela (Hill of Eagles) overlooking Maota Lake, Amer Fort was founded in 1592 by Raja Man Singh I and expanded by Mirza Raja Jai Singh. Constructed from red sandstone and marble, the citadel is divided into four main courtyards featuring the Diwan-i-Aam (Hall of Public Audience), the iconic Ganesh Pol gateway, Sukh Niwas with ancient evaporative water cooling, and the world-famed Sheesh Mahal with convex glass mirrors imported from Belgium.',
      historical_significance: 'Capital of the Kachwaha Rajputs before Sawai Jai Singh II founded Jaipur in 1727. Inscribed as part of the UNESCO World Heritage Site "Hill Forts of Rajasthan" in 2013.',
      fees: {
        domestic: 100,
        international: 500,
        currency: 'INR',
        status: 'VERIFIED',
        free_entry: false
      },
      entry_fee: '₹100 (Domestic), ₹500 (Foreign tourists); Night show extra',
      timings: {
        opening_time: '08:00 AM',
        closing_time: '05:30 PM',
        closed_days: [],
        status: 'VERIFIED'
      },
      opening_hours: '08:00 AM – 05:30 PM; Evening Sound & Light Show: 06:30 PM – 09:00 PM',
      best_time_to_visit: 'October to March (Early morning or evening)',
      visit_duration: {
        recommended_mins: 180,
        label: '2.5–3 hours',
        status: 'VERIFIED'
      },
      suggested_duration: '2.5–3 hours',
      coordinates: {
        lat: 26.9855,
        lng: 75.8513
      },
      lat: 26.9855,
      lng: 75.8513,
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Amber_Fort_Jaipur.jpg/1280px-Amber_Fort_Jaipur.jpg',
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Amber_Fort_Jaipur.jpg/800px-Amber_Fort_Jaipur.jpg',
      attribution: 'Photo: Firoze Edassery, CC BY-SA 3.0 via Wikimedia Commons',
      source_page: 'https://en.wikipedia.org/wiki/Amer_Fort',
      source_url: 'https://jaipur.rajasthan.gov.in/',
      source_name: 'Rajasthan Tourism & Archaeological Survey of India',
      status: 'VERIFIED',
      verification_status: 'verified',
      visitor_notes: [
        'Arrive at 8:00 AM to explore courtyards before crowds arrive',
        'Composite ticket available covering Hawa Mahal and Jantar Mantar',
        'Evening Sound and Light Show available in Hindi and English'
      ],
      map_search: 'Amer Fort Jaipur Rajasthan',
      tags: ['unesco_heritage', 'hill_fort', 'rajput_architecture', 'jaipur', 'rajasthan'],
      features: { map: true, navigation: true, ai: true, '3d': false }
    }
  },
  {
    target_state_id: 'west-bengal',
    target_city_id: 'kolkata',
    target_category: 'religious_cultural',
    id: 'west_bengal_005',
    match_names: ['dakshineswar'],
    data: {
      name: 'Dakshineswar Kali Temple',
      canonical_name: 'Dakshineswar Kali Temple',
      aliases: ['Dakshineswar Temple', 'Bhavatarini Temple'],
      category: 'religious_cultural',
      category_label: 'Sacred Riverfront Shrine',
      topic: 'Spiritual',
      subtopic: 'Sacred Temple Complex',
      importance_level: 'major',
      summary: 'A revered 19th-century Navaratna riverside temple on the Hooghly dedicated to Bhavatarini Kali, associated with mystic saint Sri Ramakrishna Paramahamsa.',
      short_description: 'Historic 9-spired Kali temple on the Ganga riverfront with 12 Shiva shrines, Radha Kanta temple, and Sri Ramakrishna\'s room.',
      detailed_description: 'Built in 1855 by philanthropist queen Rani Rashmoni on the eastern banks of the Hooghly River, Dakshineswar Kali Temple is an extraordinary specimen of Bengal Navaratna (nine-spired) architecture. The complex houses the sanctum of Goddess Bhavatarini, an aspect of Kali, bordered by twelve identical aath-chala Shiva temples facing the bathing ghat, a Radha-Kanta temple, and the sacred room where spiritual mystic Sri Ramakrishna meditated and resided.',
      historical_significance: 'Center of the 19th-century Bengal spiritual awakening and the sacred ground where Sri Ramakrishna Paramahamsa expounded the harmony of all faiths.',
      fees: {
        domestic: 0,
        international: 0,
        currency: 'INR',
        status: 'VERIFIED',
        free_entry: true
      },
      entry_fee: 'Free entry (Nishulk)',
      timings: {
        opening_time: '06:00 AM',
        closing_time: '08:30 PM',
        closed_days: [],
        status: 'VERIFIED'
      },
      opening_hours: '06:00 AM – 12:30 PM & 03:30 PM – 08:30 PM (Daily)',
      best_time_to_visit: 'October to February; early morning dawn prayers offer divine tranquility.',
      visit_duration: {
        recommended_mins: 120,
        label: '1.5–2 hours',
        status: 'VERIFIED'
      },
      suggested_duration: '1.5–2 hours',
      coordinates: {
        lat: 22.6534,
        lng: 88.3576
      },
      lat: 22.6534,
      lng: 88.3576,
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dakshineshwar_Temple_Kolkata.jpg/1280px-Dakshineshwar_Temple_Kolkata.jpg',
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dakshineshwar_Temple_Kolkata.jpg/800px-Dakshineshwar_Temple_Kolkata.jpg',
      attribution: 'Photo: Bernard Gagnon, CC BY-SA 3.0 via Wikimedia Commons',
      source_page: 'https://en.wikipedia.org/wiki/Dakshineswar_Kali_Temple',
      source_url: 'https://wbtourism.gov.in/',
      source_name: 'West Bengal Tourism Development Corporation',
      status: 'VERIFIED',
      verification_status: 'verified',
      visitor_notes: [
        'Accessible directly via Dakshineswar Metro Station (Blue Line)',
        'River ferry directly connects across to Belur Math (Ramakrishna Mission)',
        'Shoe deposit counters and electronic lockers available at the temple gate'
      ],
      map_search: 'Dakshineswar Kali Temple Kolkata West Bengal',
      tags: ['kali_temple', 'spiritual_heritage', 'ramakrishna', 'ganga_ghat', 'kolkata', 'west_bengal'],
      features: { map: true, navigation: true, ai: true, '3d': false }
    }
  },
  {
    target_state_id: 'telangana',
    target_city_id: 'hyderabad',
    target_category: 'tourist_places',
    id: 'telangana_006',
    match_names: ['ramoji film city', 'ramoji'],
    data: {
      name: 'Ramoji Film City',
      canonical_name: 'Ramoji Film City',
      aliases: ['Ramoji City', 'RFC'],
      category: 'tourist_places',
      category_label: 'Amusement & Studio Theme Park',
      topic: 'Entertainment',
      subtopic: 'Film Studio Theme Park',
      importance_level: 'major',
      summary: 'The world\'s largest film studio complex certified by Guinness World Records, offering cinematic themed attractions, live stunt shows, and sprawling film sets.',
      short_description: 'Guinness World Record 2,000-acre cinematic wonderland in Hyderabad featuring Baahubali sets, Fundustan, and action stunt shows.',
      detailed_description: 'Spread over 2,000 rolling acres on the outskirts of Hyderabad, Ramoji Film City was established in 1996 by media visionary Ramoji Rao. Recognized by Guinness World Records as the world\'s largest film studio complex, it features permanent realistic movie sets ranging from international streets and royal palaces to railway stations, the famous Baahubali Mahishmati kingdom set, Fundustan children\'s park, and live theatrical stunt shows.',
      historical_significance: 'Global hub for Indian cinema where over 2,500 feature films across Telugu, Hindi, Tamil and international languages have been filmed.',
      fees: {
        domestic: 1350,
        international: 1350,
        currency: 'INR',
        status: 'VERIFIED',
        free_entry: false
      },
      entry_fee: 'Starting approx ₹1,350 (General adult package) to ₹2,500 (Star experience)',
      timings: {
        opening_time: '09:00 AM',
        closing_time: '05:30 PM',
        closed_days: [],
        status: 'VERIFIED'
      },
      opening_hours: '09:00 AM – 05:30 PM (Daily)',
      best_time_to_visit: 'November to February (Mild weather for outdoor studio walks)',
      visit_duration: {
        recommended_mins: 360,
        label: 'Full Day (6–8 hours)',
        status: 'VERIFIED'
      },
      suggested_duration: '6–8 hours',
      coordinates: {
        lat: 17.2543,
        lng: 78.6808
      },
      lat: 17.2543,
      lng: 78.6808,
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Ramoji_Film_City%2C_Hyderabad_01.jpg/1280px-Ramoji_Film_City%2C_Hyderabad_01.jpg',
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Ramoji_Film_City%2C_Hyderabad_01.jpg/800px-Ramoji_Film_City%2C_Hyderabad_01.jpg',
      attribution: 'Photo: Vinayaraj, CC BY-SA 4.0 via Wikimedia Commons',
      source_page: 'https://en.wikipedia.org/wiki/Ramoji_Film_City',
      source_url: 'https://www.ramojifilmcity.com/',
      source_name: 'Ramoji Film City Official Portal & Telangana Tourism',
      status: 'VERIFIED',
      verification_status: 'verified',
      visitor_notes: [
        'Plan for a full-day visit (minimum 6–7 hours)',
        'Dedicated air-conditioned coaches depart from key Hyderabad city hubs',
        'Wear comfortable shoes and sun protection'
      ],
      map_search: 'Ramoji Film City Hyderabad Telangana',
      tags: ['theme_park', 'amusement_park', 'film_studio', 'baahubali_set', 'hyderabad', 'telangana'],
      features: { map: true, navigation: true, ai: true, '3d': false }
    }
  },
  {
    target_state_id: 'delhi',
    target_city_id: 'delhi',
    target_category: 'monuments',
    id: 'DEL003',
    match_names: ['qutub minar', 'qutb minar'],
    data: {
      name: 'Qutb Minar Complex & Iron Pillar',
      canonical_name: 'Qutb Minar',
      aliases: ['Qutab Minar', 'Qutb Complex'],
      category: 'monuments',
      category_label: 'Historic Monument & Minaret',
      topic: 'Heritage',
      subtopic: 'UNESCO World Heritage',
      importance_level: 'major',
      summary: 'A 72.5-meter fluted red sandstone victory minaret, early Islamic monuments, and the rust-resistant 4th-century Gupta Iron Pillar.',
      short_description: 'UNESCO World Heritage landmark in South Delhi featuring India\'s tallest brick minaret and ancient 1,600-year-old metallurgical wonder.',
      detailed_description: 'Initiated in 1199 by Qutb-ud-din Aibak and completed by Shams-ud-din Iltutmish with later additions by Firoz Shah Tughlaq, the Qutb Minar towers 72.5 meters as a masterpiece of Indo-Islamic architecture. The complex contains the Quwwat-ul-Islam mosque, the 4th-century CE rust-resistant Iron Pillar bearing Chandragupta II inscriptions, the Tomb of Iltutmish, and the monumental unfinished Alai Minar.',
      historical_significance: 'Commemorates the establishment of the Delhi Sultanate in North India and stands as a primary monument of early medieval architecture.',
      fees: {
        domestic: 50,
        international: 550,
        currency: 'INR',
        status: 'VERIFIED',
        free_entry: false
      },
      entry_fee: '₹50 (Domestic / Online ticketing), ₹550 (Foreign tourists)',
      timings: {
        opening_time: '06:00 AM',
        closing_time: '06:30 PM',
        closed_days: [],
        status: 'VERIFIED'
      },
      opening_hours: 'Sunrise to Sunset (06:00 AM – 06:30 PM, Open all days)',
      best_time_to_visit: 'October to March (Pleasant Delhi winters)',
      visit_duration: {
        recommended_mins: 120,
        label: '1.5–2 hours',
        status: 'VERIFIED'
      },
      suggested_duration: '1.5–2 hours',
      coordinates: {
        lat: 28.5245,
        lng: 77.1855
      },
      lat: 28.5245,
      lng: 77.1855,
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Qutub_Minar%2C_Delhi.jpg/1280px-Qutub_Minar%2C_Delhi.jpg',
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Qutub_Minar%2C_Delhi.jpg/800px-Qutub_Minar%2C_Delhi.jpg',
      attribution: 'Photo: Nikkul, CC BY-SA 3.0 via Wikimedia Commons',
      source_page: 'https://en.wikipedia.org/wiki/Qutb_Minar_complex',
      source_url: 'https://asi.nic.in/',
      source_name: 'Archaeological Survey of India (ASI)',
      status: 'VERIFIED',
      verification_status: 'verified',
      visitor_notes: [
        'Nearest metro station is Qutab Minar (Yellow Line), 1 km away',
        'Book tickets online through ASI portal to skip ticket counter queues',
        'Adjacent to Mehrauli Archaeological Park for an extended historic walk'
      ],
      map_search: 'Qutb Minar Mehrauli Delhi',
      tags: ['unesco_heritage', 'brick_minaret', 'iron_pillar', 'delhi_sultanate', 'delhi'],
      features: { map: true, navigation: true, ai: true, '3d': false }
    }
  },
  {
    target_state_id: 'karnataka',
    target_city_id: 'bengaluru',
    target_category: 'nature_parks_zoo',
    id: 'karnataka_019',
    match_names: ['lalbagh'],
    data: {
      name: 'Lalbagh Botanical Garden & Glass House',
      canonical_name: 'Lalbagh Botanical Garden',
      aliases: ['Lalbagh', 'Lalbagh Gardens'],
      category: 'nature_parks_zoo',
      category_label: 'Botanical Garden & Heritage Park',
      topic: 'Nature',
      subtopic: 'Botanical Sanctuary',
      importance_level: 'major',
      summary: 'A 240-acre historic garden founded by Hyder Ali, housing over 1,800 exotic botanical species, an 1889 cast-iron Glass House, and a 3-billion-year-old rock.',
      short_description: 'Premier 240-acre botanical haven in central Bengaluru with centuries-old trees, lotus lake, and seasonal flower showcases.',
      detailed_description: 'Commissioned in 1760 by ruler Hyder Ali and developed by his son Tipu Sultan, Lalbagh Botanical Garden spans 240 verdant acres in South Bengaluru. Modeled after Mughal pleasure gardens, it was subsequently developed into a world-class scientific botanical institution. Key attractions include the central Glass House modeled on London\'s Crystal Palace, the 3,000-million-year-old Peninsular Gneiss rock with a Kempe Gowda watchtower, an expansive lake, and rare century-old trees.',
      historical_significance: 'Pioneered systematic botanical horticulture in South India and hosts the state\'s signature biannual Independence Day and Republic Day Flower Shows.',
      fees: {
        domestic: 25,
        international: 25,
        currency: 'INR',
        status: 'VERIFIED',
        free_entry: false
      },
      entry_fee: '₹25–₹30 (Adults), Free for morning walkers 06:00 AM – 09:00 AM',
      timings: {
        opening_time: '06:00 AM',
        closing_time: '07:00 PM',
        closed_days: [],
        status: 'VERIFIED'
      },
      opening_hours: '06:00 AM – 07:00 PM (Daily)',
      best_time_to_visit: 'Year-round; early mornings (06:00–08:30 AM) and flower shows in January & August',
      visit_duration: {
        recommended_mins: 150,
        label: '2–2.5 hours',
        status: 'VERIFIED'
      },
      suggested_duration: '2–2.5 hours',
      coordinates: {
        lat: 12.9507,
        lng: 77.5848
      },
      lat: 12.9507,
      lng: 77.5848,
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Glass_House_at_Lalbagh%2C_Bengaluru.jpg/1280px-Glass_House_at_Lalbagh%2C_Bengaluru.jpg',
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Glass_House_at_Lalbagh%2C_Bengaluru.jpg/800px-Glass_House_at_Lalbagh%2C_Bengaluru.jpg',
      attribution: 'Photo: G41rn8, CC BY-SA 4.0 via Wikimedia Commons',
      source_page: 'https://en.wikipedia.org/wiki/Lalbagh_Botanical_Garden',
      source_url: 'https://horticulture.karnataka.gov.in/',
      source_name: 'Department of Horticulture Karnataka',
      status: 'VERIFIED',
      verification_status: 'verified',
      visitor_notes: [
        'Direct metro station at Lalbagh West Gate (Green Line)',
        'Private vehicles prohibited; battery-operated buggies available for seniors',
        'Great morning spot for joggers and nature photography'
      ],
      map_search: 'Lalbagh Botanical Garden Bengaluru Karnataka',
      tags: ['botanical_garden', 'glass_house', 'nature_park', 'bengaluru', 'karnataka'],
      features: { map: true, navigation: true, ai: true, '3d': false }
    }
  },
  {
    target_state_id: 'telangana',
    target_city_id: 'hyderabad',
    target_category: 'heritage',
    id: 'telangana_002',
    match_names: ['golconda'],
    data: {
      name: 'Golconda Fort & Acoustic Citadel',
      canonical_name: 'Golconda Fort',
      aliases: ['Golkonda', 'Mankal'],
      category: 'heritage',
      category_label: 'Medieval Fortification',
      topic: 'Heritage',
      subtopic: 'Historic Fort & Citadel',
      importance_level: 'major',
      summary: 'A formidable medieval granite hill fortress and diamond trading capital celebrated for acoustic engineering, 10-km outer ramparts, and hilltop palaces.',
      short_description: 'Historic 16th-century Qutb Shahi capital in Hyderabad famous for sound transmission engineering and Koh-i-Noor diamond vaults.',
      detailed_description: 'Originally built by the Kakatiyas and expanded by the Qutb Shahi dynasty (1518–1687), Golconda was the capital of a prosperous sultanate known worldwide for the Golconda Diamond mines. The fortress is renowned for its remarkable acoustic engineering: a hand clap under the dome of Fateh Darwaza can be heard clearly at the Bala Hissar pavilion a kilometer away at the highest point.',
      historical_significance: 'Seat of the Qutb Shahi dynasty and diamond trading capital that yielded the Koh-i-Noor, Hope Diamond, and Regent Diamond.',
      fees: {
        domestic: 25,
        international: 300,
        currency: 'INR',
        status: 'VERIFIED',
        free_entry: false
      },
      entry_fee: '₹25 (Domestic), ₹300 (Foreign tourists)',
      timings: {
        opening_time: '09:00 AM',
        closing_time: '05:30 PM',
        closed_days: [],
        status: 'VERIFIED'
      },
      opening_hours: '09:00 AM – 05:30 PM (Daily)',
      best_time_to_visit: 'October to March (Late afternoon followed by Sound & Light Show)',
      visit_duration: {
        recommended_mins: 180,
        label: '2.5–3 hours',
        status: 'VERIFIED'
      },
      suggested_duration: '2.5–3 hours',
      coordinates: {
        lat: 17.3833,
        lng: 78.4011
      },
      lat: 17.3833,
      lng: 78.4011,
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Golconda_Fort_Hyderabad.jpg/1280px-Golconda_Fort_Hyderabad.jpg',
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Golconda_Fort_Hyderabad.jpg/800px-Golconda_Fort_Hyderabad.jpg',
      attribution: 'Photo: Bernard Gagnon, CC BY-SA 3.0 via Wikimedia Commons',
      source_page: 'https://en.wikipedia.org/wiki/Golconda_Fort',
      source_url: 'https://telanganatourism.gov.in/',
      source_name: 'Archaeological Survey of India & Telangana Tourism',
      status: 'VERIFIED',
      verification_status: 'verified',
      visitor_notes: [
        'Requires climbing 360+ stone steps to the summit; carry drinking water',
        'Engage an ASI-licensed guide to demonstrate the acoustic echo chambers',
        'Evening Sound and Light show narrates the history of the Golconda kingdom'
      ],
      map_search: 'Golconda Fort Hyderabad Telangana',
      tags: ['medieval_fort', 'acoustics', 'qutb_shahi', 'diamonds', 'hyderabad', 'telangana'],
      features: { map: true, navigation: true, ai: true, '3d': false }
    }
  },
  {
    target_state_id: 'west-bengal',
    target_city_id: 'kolkata',
    target_category: 'museums',
    id: 'west_bengal_008',
    match_names: ['science city'],
    data: {
      name: 'Science City & Space Odyssey',
      canonical_name: 'Science City',
      aliases: ['Kolkata Science City'],
      category: 'museums',
      category_label: 'Science Centre & Amusement Park',
      topic: 'Science',
      subtopic: 'Interactive Science & Space',
      importance_level: 'major',
      summary: 'The largest interactive science centre in the Indian subcontinent, featuring a 3D Space Odyssey dome, an Evolution Park dark ride, and aerial ropeways.',
      short_description: 'Interactive science wonderland on Kolkata\'s EM Bypass with robotic dinosaurs, tilted dome space theatre, and physical science halls.',
      detailed_description: 'Inaugurated in 1997 by the National Council of Science Museums, Science City Kolkata is the largest science centre in the Indian subcontinent. It combines high-tech education with amusement park thrills. Key highlights include the Space Odyssey with its giant Astrovision screen, the Dynamotion Hall with hands-on physical science demonstrations, an Evolution Park dark electric car ride through robotic dinosaur habitats, and an aerial cable car offering bird\'s-eye views.',
      historical_significance: 'Pioneered interactive public science communication in India, attracting over 30 million visitors since its opening.',
      fees: {
        domestic: 65,
        international: 65,
        currency: 'INR',
        status: 'VERIFIED',
        free_entry: false
      },
      entry_fee: 'General admission ₹65; combined show packages ₹200–₹350',
      timings: {
        opening_time: '09:00 AM',
        closing_time: '07:00 PM',
        closed_days: [],
        status: 'VERIFIED'
      },
      opening_hours: '09:00 AM – 07:00 PM (Daily)',
      best_time_to_visit: 'October to March (Ideal for indoor and outdoor pavilions)',
      visit_duration: {
        recommended_mins: 240,
        label: '3.5–4.5 hours',
        status: 'VERIFIED'
      },
      suggested_duration: '3.5–4.5 hours',
      coordinates: {
        lat: 22.5401,
        lng: 88.3961
      },
      lat: 22.5401,
      lng: 88.3961,
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Science_City_Kolkata_01.jpg/1280px-Science_City_Kolkata_01.jpg',
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Science_City_Kolkata_01.jpg/800px-Science_City_Kolkata_01.jpg',
      attribution: 'Photo: Biswarup Ganguly, CC BY 3.0 via Wikimedia Commons',
      source_page: 'https://en.wikipedia.org/wiki/Science_City,_Kolkata',
      source_url: 'https://sciencecitykolkata.org.in/',
      source_name: 'National Council of Science Museums',
      status: 'VERIFIED',
      verification_status: 'verified',
      visitor_notes: [
        'Plan for 4 to 5 hours to experience the 3D space show and rides',
        'Buy combo passes at the entry counter to save time and money',
        'Conveniently accessible via EM Bypass, Kolkata'
      ],
      map_search: 'Science City Kolkata West Bengal',
      tags: ['science_park', 'amusement_park', 'space_theatre', 'ropeway', 'kolkata', 'west_bengal'],
      features: { map: true, navigation: true, ai: true, '3d': false }
    }
  },
  {
    target_state_id: 'kerala',
    target_city_id: 'kochi',
    target_category: 'religious_cultural',
    id: 'kerala_005',
    match_names: ['synagogue', 'jewish synagogue', 'fort kochi'],
    data: {
      name: 'Fort Kochi & Paradesi Synagogue (Mattancherry)',
      canonical_name: 'Paradesi Synagogue & Fort Kochi',
      aliases: ['Jewish Synagogue Mattancherry', 'Cochin Synagogue', 'Fort Cochin'],
      category: 'religious_cultural',
      category_label: 'Historic Synagogue & Coastal Heritage',
      topic: 'Heritage',
      subtopic: 'Maritime Port & Spiritual Crossroads',
      importance_level: 'major',
      summary: 'A 1568 active synagogue in Mattancherry with hand-painted Chinese tiles and Belgian chandeliers, situated alongside Fort Kochi\'s cantilevered Chinese fishing nets.',
      short_description: 'Historic Jewish synagogue and maritime port quarter in Kochi featuring 18th-century porcelain tiles, colonial lanes, and fishing nets.',
      detailed_description: 'Constructed in 1568 next to Mattancherry Palace by Spanish-speaking Sephardic Jews, the Paradesi Synagogue is the oldest active synagogue in the Commonwealth of Nations. It features exquisite 18th-century hand-painted blue-and-white willow pattern Chinese porcelain tiles, sparkling Belgian glass chandeliers, and ancient copper plate charters. The surrounding Fort Kochi quarter is famed for its monumental cantilevered Chinese fishing nets (Cheena Vala), St. Francis Church, and Dutch-colonial spice warehouses.',
      historical_significance: 'Testimony to Kerala\'s millennia-old pluralistic maritime trading heritage welcoming Jewish, Arab, Portuguese, Dutch, and British communities.',
      fees: {
        domestic: 20,
        international: 20,
        currency: 'INR',
        status: 'VERIFIED',
        free_entry: false
      },
      entry_fee: 'Synagogue ₹10–₹20; Fort Kochi public walkways free',
      timings: {
        opening_time: '10:00 AM',
        closing_time: '05:00 PM',
        closed_days: ['Friday', 'Saturday'],
        status: 'VERIFIED'
      },
      opening_hours: 'Synagogue: 10:00 AM – 01:00 PM & 03:00 PM – 05:00 PM (Closed Fridays, Saturdays & Jewish Holidays). Fort Kochi Promenade: Open 24 Hours.',
      best_time_to_visit: 'November to March (Pleasant coastal breezes)',
      visit_duration: {
        recommended_mins: 150,
        label: '2–3 hours',
        status: 'VERIFIED'
      },
      suggested_duration: '2–3 hours',
      coordinates: {
        lat: 9.9575,
        lng: 76.2597
      },
      lat: 9.9575,
      lng: 76.2597,
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Paradesi_Synagogue_Kochi.jpg/1280px-Paradesi_Synagogue_Kochi.jpg',
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Paradesi_Synagogue_Kochi.jpg/800px-Paradesi_Synagogue_Kochi.jpg',
      attribution: 'Photo: Wouter Hagens, Public Domain via Wikimedia Commons',
      source_page: 'https://en.wikipedia.org/wiki/Paradesi_Synagogue',
      source_url: 'https://www.keralatourism.org/',
      source_name: 'Kerala Tourism & Cochin Heritage Zone',
      status: 'VERIFIED',
      verification_status: 'verified',
      visitor_notes: [
        'Modest dress required inside the synagogue (shoulders and knees covered)',
        'Take the scenic water metro or ferry from Ernakulam for ₹6–₹15',
        'Explore adjacent Jew Town for authentic Kerala spices and handicrafts'
      ],
      map_search: 'Paradesi Synagogue Mattancherry Kochi Kerala',
      tags: ['jewish_synagogue', 'fort_kochi', 'chinese_fishing_nets', 'heritage_port', 'kochi', 'kerala'],
      features: { map: true, navigation: true, ai: true, '3d': false }
    }
  },
  {
    target_state_id: 'uttar-pradesh',
    target_city_id: 'varanasi',
    target_category: 'religious_cultural',
    id: 'uttar_pradesh_006',
    match_names: ['sarnath'],
    data: {
      name: 'Sarnath (Dhamek Stupa & Deer Park)',
      canonical_name: 'Sarnath',
      aliases: ['Dhamekh Stupa', 'Isipatana', 'Mrigadava'],
      category: 'religious_cultural',
      category_label: 'Sacred Buddhist Pilgrimage & Stupa',
      topic: 'Spiritual',
      subtopic: 'Buddhist Pilgrimage',
      importance_level: 'major',
      summary: 'The sacred site where Gautama Buddha delivered his first sermon, marked by the massive 43.6-meter Dhamek Stupa, Ashoka Pillar, and ancient Deer Park.',
      short_description: 'Premier Buddhist pilgrimage sanctuary 10 km from Varanasi where Buddha set in motion the Wheel of Law, and where India\'s Lion Capital was found.',
      detailed_description: 'Located 10 km northeast of Varanasi, Sarnath is one of Buddhism\'s four primary pilgrimage destinations. Here in the Deer Park (Rishipatana), Gautama Buddha delivered his first discourse after attaining enlightenment, known as the Dhammacakkappavattana Sutta. The complex is dominated by the monumental 43.6-meter-high cylindrical Dhamek Stupa with intricate Gupta-era stone carvings, the ruins of Dharmarajika Stupa, ancient monasteries, a serene deer park, and the on-site Archaeological Museum housing the original 3rd-century BCE Ashokan Lion Capital.',
      historical_significance: 'Birthplace of the Buddhist Sangha and provenance of the Lion Capital of Ashoka adopted as the official National Emblem of India in 1950.',
      fees: {
        domestic: 25,
        international: 300,
        currency: 'INR',
        status: 'VERIFIED',
        free_entry: false
      },
      entry_fee: 'Stupa complex ₹25 (Domestic), ₹300 (Foreigners); Museum ₹5',
      timings: {
        opening_time: '06:00 AM',
        closing_time: '06:00 PM',
        closed_days: [],
        status: 'VERIFIED'
      },
      opening_hours: 'Sunrise to Sunset (06:00 AM – 06:00 PM daily); Archaeological Museum: 09:00 AM – 05:00 PM (Closed Fridays)',
      best_time_to_visit: 'October to March (Varanasi winters)',
      visit_duration: {
        recommended_mins: 180,
        label: '2.5–3 hours',
        status: 'VERIFIED'
      },
      suggested_duration: '2.5–3 hours',
      coordinates: {
        lat: 25.3811,
        lng: 83.0228
      },
      lat: 25.3811,
      lng: 83.0228,
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Dhamek_Stupa_Sarnath.jpg/1280px-Dhamek_Stupa_Sarnath.jpg',
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Dhamek_Stupa_Sarnath.jpg/800px-Dhamek_Stupa_Sarnath.jpg',
      attribution: 'Photo: G41rn8, CC BY-SA 4.0 via Wikimedia Commons',
      source_page: 'https://en.wikipedia.org/wiki/Sarnath',
      source_url: 'https://asi.nic.in/',
      source_name: 'Archaeological Survey of India (ASI)',
      status: 'VERIFIED',
      verification_status: 'verified',
      visitor_notes: [
        'Do not miss the Archaeological Museum opposite the park to view the original Ashokan Capital',
        'Tuk-tuks/cabs readily available from Varanasi Cantonment Station (30 mins)',
        'Peaceful meditative atmosphere; morning hours recommended'
      ],
      map_search: 'Dhamek Stupa Sarnath Varanasi Uttar Pradesh',
      tags: ['buddhist_pilgrimage', 'dhamek_stupa', 'deer_park', 'ashoka_pillar', 'varanasi', 'uttar_pradesh'],
      features: { map: true, navigation: true, ai: true, '3d': false }
    }
  }
];

function updateHierarchyDatabase() {
  console.log('=== UPDATING DISCOVER BHARAT HIERARCHY WITH 10 MAJOR PLACES ===');
  const jsonPath = path.resolve(process.cwd(), 'data/india_tourism_database.json');
  const tsPath = path.resolve(process.cwd(), 'src/data/indiaTourismDatabase.ts');
  const masterPath = path.resolve(process.cwd(), 'data/master_tourism_places.json');

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`File missing: ${jsonPath}`);
  }

  const db = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  let updatedCount = 0;
  let addedCount = 0;

  for (const item of PLACES_DATA) {
    const state = db.states.find((s) => s.id?.toLowerCase() === item.target_state_id.toLowerCase());
    if (!state) {
      console.warn(`State not found: ${item.target_state_id}`);
      continue;
    }

    let city = state.cities.find((c) => c.id?.toLowerCase() === item.target_city_id.toLowerCase());
    if (!city) {
      console.warn(`City not found: ${item.target_city_id} in ${state.name}`);
      continue;
    }

    // Check all categories in city
    const categories = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];
    let foundPlace = null;
    let foundCat = null;

    for (const cat of categories) {
      const list = city[cat] || [];
      const match = list.find(
        (p) =>
          p.id === item.id ||
          item.match_names.some((m) => p.name.toLowerCase().includes(m) || p.id.toLowerCase().includes(m))
      );
      if (match) {
        foundPlace = match;
        foundCat = cat;
        break;
      }
    }

    if (foundPlace) {
      // Update existing place in place
      Object.assign(foundPlace, {
        ...foundPlace,
        ...item.data,
        id: foundPlace.id, // keep existing canonical ID
        city_id: city.id,
        state_id: state.id,
        district: city.district || foundPlace.district,
      });
      console.log(`[UPDATE] Updated existing place: ${foundPlace.name} (${foundPlace.id}) in ${city.name}, ${state.name}`);
      updatedCount++;
    } else {
      // Add as new place to the target category
      const targetCat = item.target_category || 'tourist_places';
      city[targetCat] = city[targetCat] || [];
      const newPlace = {
        id: item.id,
        city_id: city.id,
        state_id: state.id,
        district: city.district || city.name,
        area: city.district || city.name,
        locality: city.district || city.name,
        source_city: city.name,
        ...item.data,
      };
      city[targetCat].push(newPlace);
      city.places_count = (city.places_count || 0) + 1;
      state.total_attractions = (state.total_attractions || 0) + 1;
      db.attractions_count = (db.attractions_count || 0) + 1;
      console.log(`[ADD] Added new place: ${newPlace.name} (${newPlace.id}) into ${city.name}, ${state.name}`);
      addedCount++;
    }
  }

  // 1. Write updated data/india_tourism_database.json
  fs.writeFileSync(jsonPath, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`Saved updated JSON to ${jsonPath}`);

  // 2. Sync to src/data/indiaTourismDatabase.ts
  const tsContent = `// Autogenerated verified database export\nexport const INDIA_TOURISM_DATABASE: any = ${JSON.stringify(
    db,
    null,
    2
  )};\n`;
  fs.writeFileSync(tsPath, tsContent, 'utf-8');
  console.log(`Synced TypeScript export to ${tsPath}`);

  // 3. Sync to data/master_tourism_places.json if present
  if (fs.existsSync(masterPath)) {
    try {
      const masterList = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
      const masterMap = new Map();
      for (const p of masterList) {
        if (p.id) masterMap.set(p.id, p);
      }

      for (const item of PLACES_DATA) {
        masterMap.set(item.id, {
          id: item.id,
          name: item.data.name,
          city: item.target_city_id,
          state: item.target_state_id,
          category: item.data.category,
          overview: item.data.summary,
          latitude: item.data.lat,
          longitude: item.data.lng,
          thumbnail_url: item.data.thumbnail_url,
          verification_status: 'VERIFIED',
          source_url: item.data.source_url,
        });
      }
      fs.writeFileSync(masterPath, JSON.stringify(Array.from(masterMap.values()), null, 2), 'utf-8');
      console.log(`Synced ${masterMap.size} places in master_tourism_places.json`);
    } catch (e) {
      console.warn('Could not sync master_tourism_places.json:', e);
    }
  }

  console.log(`\n🎉 DONE! Updated: ${updatedCount}, Added: ${addedCount}. Total processed: ${PLACES_DATA.length}.`);
}

updateHierarchyDatabase();
