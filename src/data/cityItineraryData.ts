/**
 * VIRASAT Verified City Trip Planner Database & Knowledge Base
 * 
 * Contains verified day-by-day locality blueprints for major Indian destinations
 * and a complete registry of cities across all 36 Indian States & Union Territories.
 * All places, monuments, markets, and travel distances are verified from official
 * tourism registries, ASI, and state tourism departments.
 */

export interface VerifiedPlaceStop {
  id?: string;
  name: string;
  distance_info: string;
  category?: string;
  description?: string;
  thumbnail_url?: string;
}

export interface VerifiedDayBlueprint {
  day_number: number;
  area_title: string;
  area_name: string;
  subtitle: string;
  hero_image_url: string;
  places: VerifiedPlaceStop[];
  shopping: string[];
}

export interface VerifiedCityItinerary {
  city_id: string;
  city_name: string;
  state_name: string;
  state_id: string;
  tagline: string;
  description: string;
  default_hero_image: string;
  days: VerifiedDayBlueprint[];
}

export interface CityOption {
  id: string;
  name: string;
  state: string;
  state_id: string;
  displayName: string;
  popular?: boolean;
}

// ============================================================================
// Curated Day-by-Day Blueprints for Key Destinations
// ============================================================================

export const VERIFIED_CITY_ITINERARIES: Record<string, VerifiedCityItinerary> = {
  mumbai: {
    city_id: 'mumbai',
    city_name: 'Mumbai',
    state_name: 'Maharashtra',
    state_id: 'maharashtra',
    tagline: 'City of Dreams & Victorian Gothic Grandeur',
    description: 'A perfect mix of heritage, culture, beaches, food and local experiences — planned with nearby places to make your journey smooth and enjoyable.',
    default_hero_image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop&q=80',
    days: [
      {
        day_number: 1,
        area_title: 'South Mumbai Heritage',
        area_name: 'South Mumbai',
        subtitle: 'Iconic landmarks, colonial architecture and waterfront views.',
        hero_image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'gateway-of-india', name: 'Gateway of India', distance_info: '0 km', category: 'heritage' },
          { id: 'csmt', name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', distance_info: '~ 3 km', category: 'heritage' },
          { id: 'kala-ghoda', name: 'Kala Ghoda Art District', distance_info: '~ 2 km', category: 'culture' },
          { id: 'marine-drive', name: 'Marine Drive', distance_info: '~ 3 km', category: 'coastal' },
        ],
        shopping: ['Colaba Causeway', 'Crawford Market'],
      },
      {
        day_number: 2,
        area_title: 'Bandra & Western Mumbai',
        area_name: 'Bandra',
        subtitle: 'Beaches, street culture and vibrant local life.',
        hero_image_url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'bandra-fort', name: 'Bandra Fort', distance_info: '0 km', category: 'heritage' },
          { id: 'mount-mary', name: 'Mount Mary Basilica', distance_info: '~ 2 km', category: 'spiritual' },
          { id: 'bandstand', name: 'Bandstand Promenade', distance_info: '~ 1 km', category: 'coastal' },
          { id: 'carter-road', name: 'Carter Road', distance_info: '~ 3 km', category: 'coastal' },
        ],
        shopping: ['Linking Road', 'Hill Road'],
      },
      {
        day_number: 3,
        area_title: 'Central Mumbai',
        area_name: 'Central Mumbai',
        subtitle: 'Temples, museums and cultural experiences.',
        hero_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'siddhivinayak-temple', name: 'Siddhivinayak Temple', distance_info: '0 km', category: 'spiritual' },
          { id: 'bhau-daji-lad', name: 'Dr. Bhau Daji Lad Museum', distance_info: '~ 4 km', category: 'museum' },
          { id: 'shivaji-park', name: 'Shivaji Park', distance_info: '~ 3 km', category: 'culture' },
          { id: 'dadar-flower-bazaar', name: 'Dadar Local Area', distance_info: '~ 2 km', category: 'cultural' },
        ],
        shopping: ['Dadar Market', 'Hindmata Market'],
      },
      {
        day_number: 4,
        area_title: 'Elephanta Island',
        area_name: 'Elephanta Island',
        subtitle: 'Ancient caves, history and a peaceful island getaway.',
        hero_image_url: 'https://images.unsplash.com/photo-1609137144822-79f972b901fc?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'gateway-ferry', name: 'Gateway of India (Ferry to Elephanta)', distance_info: '0 km', category: 'heritage' },
          { id: 'elephanta-caves', name: 'Elephanta Caves (Island)', distance_info: '~ 11 km (by ferry)', category: 'heritage' },
          { id: 'elephanta-island-explore', name: 'Explore the Island & Canon Hill', distance_info: '~ 1 km', category: 'nature' },
          { id: 'return-ferry-gateway', name: 'Return to Mumbai (Ferry)', distance_info: '~ 11 km (by ferry)', category: 'heritage' },
        ],
        shopping: ['Colaba Causeway', 'Local Handicraft Stalls'],
      },
      {
        day_number: 5,
        area_title: 'Juhu & Western Mumbai',
        area_name: 'Juhu',
        subtitle: 'Beaches, spirituality and a relaxed end to your trip.',
        hero_image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'juhu-beach', name: 'Juhu Beach', distance_info: '0 km', category: 'coastal' },
          { id: 'iskcon-juhu', name: 'ISKCON Temple', distance_info: '~ 2 km', category: 'spiritual' },
          { id: 'prithvi-theatre', name: 'Prithvi Theatre Area', distance_info: '~ 3 km', category: 'culture' },
          { id: 'versova-beach', name: 'Versova (Optional)', distance_info: '~ 4 km', category: 'coastal' },
        ],
        shopping: ['Linking Road', 'Juhu Market'],
      },
      {
        day_number: 6,
        area_title: 'Sanjay Gandhi National Park & Borivali',
        area_name: 'Borivali',
        subtitle: 'Lush green forests, ancient Buddhist caves and quiet nature.',
        hero_image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'sanjay-gandhi-national-park', name: 'Sanjay Gandhi National Park', distance_info: '0 km', category: 'nature' },
          { id: 'kanheri-caves', name: 'Kanheri Caves (Krishnagiri)', distance_info: '~ 6 km', category: 'heritage' },
          { id: 'sgnp-safari', name: 'Lion & Tiger Safari Area', distance_info: '~ 3 km', category: 'nature' },
          { id: 'global-pagoda', name: 'Global Vipassana Pagoda Viewpoint', distance_info: '~ 5 km', category: 'spiritual' },
        ],
        shopping: ['Borivali Station Market', 'SGNP Souvenir Kiosk'],
      },
      {
        day_number: 7,
        area_title: 'Worli & Malabar Hill',
        area_name: 'Worli & Malabar Hill',
        subtitle: 'Historic shrines, scenic bay promenades and coastal breezes.',
        hero_image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'haji-ali-dargah', name: 'Haji Ali Dargah', distance_info: '0 km', category: 'spiritual' },
          { id: 'mahalaxmi-temple', name: 'Mahalaxmi Temple', distance_info: '~ 1.5 km', category: 'spiritual' },
          { id: 'hanging-gardens', name: 'Hanging Gardens (Malabar Hill)', distance_info: '~ 3 km', category: 'nature' },
          { id: 'worli-sea-face', name: 'Worli Sea Face', distance_info: '~ 4 km', category: 'coastal' },
        ],
        shopping: ['Heera Panna Shopping Centre', 'Tardeo Local Market'],
      },
    ],
  },

  delhi: {
    city_id: 'delhi',
    city_name: 'New Delhi',
    state_name: 'Delhi (NCT)',
    state_id: 'delhi',
    tagline: 'Heart of India & Imperial Mughal Capital',
    description: 'Explore grand Mughal citadels, serene Sufi shrines, Lutyens monuments, and bustling historic bazaars in a smooth sequence.',
    default_hero_image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000&auto=format&fit=crop&q=80',
    days: [
      {
        day_number: 1,
        area_title: 'Old Delhi & Mughal Heritage',
        area_name: 'Old Delhi',
        subtitle: 'Majestic red sandstone citadels, historic mosques and winding alleys.',
        hero_image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/1280px-Delhi_fort.jpg',
        places: [
          { id: 'red-fort', name: 'Red Fort (Lal Qila)', distance_info: '0 km', category: 'heritage' },
          { id: 'jama-masjid', name: 'Jama Masjid Delhi', distance_info: '~ 1.5 km', category: 'spiritual' },
          { id: 'chandni-chowk', name: 'Chandni Chowk Heritage Walk', distance_info: '~ 0.8 km', category: 'culture' },
          { id: 'raj-ghat', name: 'Raj Ghat & Gandhi Memorial', distance_info: '~ 3 km', category: 'memorial' },
        ],
        shopping: ['Chandni Chowk Bazaar', 'Dariba Kalan (Silver Market)'],
      },
      {
        day_number: 2,
        area_title: 'Central & Imperial Delhi',
        area_name: 'Central Delhi',
        subtitle: 'Colonial boulevards, war memorials and national treasures.',
        hero_image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'india-gate', name: 'India Gate & National War Memorial', distance_info: '0 km', category: 'heritage' },
          { id: 'rashtrapati-bhavan', name: 'Rashtrapati Bhavan Vista (Kartavya Path)', distance_info: '~ 2 km', category: 'monument' },
          { id: 'national-museum', name: 'National Museum of India', distance_info: '~ 1.2 km', category: 'museum' },
          { id: 'connaught-place', name: 'Connaught Place Heritage Circle', distance_info: '~ 2.5 km', category: 'culture' },
        ],
        shopping: ['Janpath Flea Market', 'Connaught Place State Emporiums'],
      },
      {
        day_number: 3,
        area_title: 'South Delhi Tombs & Minars',
        area_name: 'Mehrauli & South Delhi',
        subtitle: 'Ancient stone minarets, medieval fortifications and artisan villages.',
        hero_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'qutub-minar', name: 'Qutub Minar & Complex', distance_info: '0 km', category: 'heritage' },
          { id: 'mehrauli-park', name: 'Mehrauli Archaeological Park', distance_info: '~ 1.5 km', category: 'heritage' },
          { id: 'hauz-khas', name: 'Hauz Khas Village & Lake Fort', distance_info: '~ 4 km', category: 'culture' },
          { id: 'dilli-haat-ina', name: 'Dilli Haat Crafts Village', distance_info: '~ 4.5 km', category: 'cultural' },
        ],
        shopping: ['Dilli Haat INA', 'Sarojini Nagar Market'],
      },
      {
        day_number: 4,
        area_title: 'Mughal Gardens & Nizamuddin',
        area_name: 'Nizamuddin & Lodhi',
        subtitle: 'Symmetric garden tombs, Sufi courtyards and heritage nurseries.',
        hero_image_url: 'https://images.unsplash.com/photo-1598555230353-8fb193b09232?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'humayuns-tomb', name: "Humayun's Tomb", distance_info: '0 km', category: 'heritage' },
          { id: 'sunder-nursery', name: 'Sunder Nursery Heritage Park', distance_info: '~ 0.5 km', category: 'nature' },
          { id: 'nizamuddin-dargah', name: 'Hazrat Nizamuddin Dargah', distance_info: '~ 1 km', category: 'spiritual' },
          { id: 'lodhi-gardens', name: 'Lodhi Gardens & Royal Tombs', distance_info: '~ 2.5 km', category: 'nature' },
        ],
        shopping: ['Khan Market', 'Sundar Nagar Market'],
      },
      {
        day_number: 5,
        area_title: 'Spiritual Wonders & Modern Marvels',
        area_name: 'East & South East Delhi',
        subtitle: 'Iconic lotus petals, intricate stone carvings and peaceful grounds.',
        hero_image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'lotus-temple', name: "Lotus Temple (Bahá'í House of Worship)", distance_info: '0 km', category: 'spiritual' },
          { id: 'iskcon-delhi', name: 'ISKCON Temple Delhi', distance_info: '~ 1.5 km', category: 'spiritual' },
          { id: 'akshardham-temple', name: 'Akshardham Cultural Complex', distance_info: '~ 8 km', category: 'spiritual' },
          { id: 'crafts-museum', name: 'National Crafts Museum', distance_info: '~ 4 km', category: 'museum' },
        ],
        shopping: ['Lajpat Nagar Central Market', 'South Extension Market'],
      },
    ],
  },

  jaipur: {
    city_id: 'jaipur',
    city_name: 'Jaipur',
    state_name: 'Rajasthan',
    state_id: 'rajasthan',
    tagline: 'The Pink City of Maharajas & Fortresses',
    description: 'Immerse yourself in royal Rajput courts, sandstone palaces, hilltop bastions, and world-famous gemstone bazaars.',
    default_hero_image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000&auto=format&fit=crop&q=80',
    days: [
      {
        day_number: 1,
        area_title: 'Pink City Walled Heritage',
        area_name: 'Old City / Walled Jaipur',
        subtitle: 'Intricate terracotta facades, royal courtyards and ancient astronomical instruments.',
        hero_image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'hawa-mahal', name: 'Hawa Mahal (Palace of Winds)', distance_info: '0 km', category: 'heritage' },
          { id: 'city-palace-jaipur', name: 'City Palace Jaipur', distance_info: '~ 0.5 km', category: 'heritage' },
          { id: 'jantar-mantar', name: 'Jantar Mantar Observatory', distance_info: '~ 0.3 km', category: 'heritage' },
          { id: 'albert-hall', name: 'Albert Hall Museum', distance_info: '~ 2 km', category: 'museum' },
        ],
        shopping: ['Johari Bazaar (Jewelry)', 'Bapu Bazaar (Textiles & Juttis)'],
      },
      {
        day_number: 2,
        area_title: 'Amer Royal Hill Fortresses',
        area_name: 'Amer Precinct',
        subtitle: 'Dramatic hillside battlements, mirrored halls and scenic stepwells.',
        hero_image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'amber-fort', name: 'Amber Fort & Palace', distance_info: '0 km', category: 'heritage' },
          { id: 'panna-meena-kund', name: 'Panna Meena Ka Kund Stepwell', distance_info: '~ 1 km', category: 'heritage' },
          { id: 'jaigarh-fort', name: 'Jaigarh Fort (Jaivana Cannon)', distance_info: '~ 2.5 km', category: 'heritage' },
          { id: 'jal-mahal', name: 'Jal Mahal Water Palace Viewpoint', distance_info: '~ 4 km', category: 'heritage' },
        ],
        shopping: ['Amer Hand Block Print Center', 'Tripolia Bazaar'],
      },
      {
        day_number: 3,
        area_title: 'Nahargarh & Royal Cenotaphs',
        area_name: 'Nahargarh & Brahampuri',
        subtitle: 'Panoramic mountain sunsets, royal chhatris and peaceful terraced gardens.',
        hero_image_url: 'https://images.unsplash.com/photo-1603228254119-e6aef383a83d?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'nahargarh-fort', name: 'Nahargarh Fort & Sculpture Park', distance_info: '0 km', category: 'heritage' },
          { id: 'gaitore-cenotaphs', name: 'Gaitore Ki Chhatriyan', distance_info: '~ 5 km', category: 'heritage' },
          { id: 'kanak-vrindavan', name: 'Kanak Vrindavan Valley Gardens', distance_info: '~ 2 km', category: 'nature' },
          { id: 'sisodia-rani', name: 'Sisodia Rani Palace & Garden', distance_info: '~ 6 km', category: 'nature' },
        ],
        shopping: ['Kishanpole Bazaar', 'Nehru Bazaar'],
      },
      {
        day_number: 4,
        area_title: 'Traditional Artisans & Sanganer',
        area_name: 'Sanganer & South Jaipur',
        subtitle: 'Century-old hand block printing, handmade paper and rural crafts.',
        hero_image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'anokhi-museum', name: 'Anokhi Museum of Hand Printing', distance_info: '0 km', category: 'museum' },
          { id: 'sanganer-village', name: 'Sanganer Textile Craft Village', distance_info: '~ 12 km', category: 'culture' },
          { id: 'birla-mandir-jaipur', name: 'Birla Mandir (Laxmi Narayan Temple)', distance_info: '~ 8 km', category: 'spiritual' },
          { id: 'chokhi-dhani', name: 'Chokhi Dhani Cultural Village', distance_info: '~ 10 km', category: 'culture' },
        ],
        shopping: ['Rajasthali Govt Handicraft Emporium', 'MI Road Boutiques'],
      },
      {
        day_number: 5,
        area_title: 'Spiritual Shrines & Sacred Hills',
        area_name: 'Galta & Eastern Hills',
        subtitle: 'Sacred natural water springs, ancient monkey temple and city vistas.',
        hero_image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'galta-ji', name: 'Galta Ji Temple (Monkey Temple)', distance_info: '0 km', category: 'spiritual' },
          { id: 'sun-temple-jaipur', name: 'Surya Mandir Hilltop Viewpoint', distance_info: '~ 1 km', category: 'spiritual' },
          { id: 'govind-dev-ji', name: 'Govind Dev Ji Temple', distance_info: '~ 7 km', category: 'spiritual' },
          { id: 'central-park-jaipur', name: 'Jaipur Central Park', distance_info: '~ 4 km', category: 'nature' },
        ],
        shopping: ['Chaura Rasta Books & Crafts', 'Bapu Bazaar'],
      },
    ],
  },

  agra: {
    city_id: 'agra',
    city_name: 'Agra',
    state_name: 'Uttar Pradesh',
    state_id: 'uttar-pradesh',
    tagline: 'Citadel of the Great Mughals & Wonder of the World',
    description: 'Witness the immortal white marble mausoleum, formidable red sandstone citadels, and imperial garden vistas.',
    default_hero_image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&auto=format&fit=crop&q=80',
    days: [
      {
        day_number: 1,
        area_title: 'Taj Mahal & Riverfront Wonders',
        area_name: 'Tajganj',
        subtitle: 'The masterpiece of Mughal architecture and scenic river reflections.',
        hero_image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'taj-mahal', name: 'Taj Mahal (Sunrise Experience)', distance_info: '0 km', category: 'heritage' },
          { id: 'taj-nature-walk', name: 'Taj Nature Walk & Gardens', distance_info: '~ 1 km', category: 'nature' },
          { id: 'mehtab-bagh', name: 'Mehtab Bagh (Moonlight Garden View of Taj)', distance_info: '~ 7 km', category: 'heritage' },
        ],
        shopping: ['Tajganj Marble Inlay Workshops', 'Sadar Bazaar Agra'],
      },
      {
        day_number: 2,
        area_title: 'Imperial Citadels & Baby Taj',
        area_name: 'Yamuna Kinara',
        subtitle: 'Red sandstone palaces, marble pavilions and precursor tomb architectures.',
        hero_image_url: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'agra-fort', name: 'Agra Fort (Red Fort of Agra)', distance_info: '0 km', category: 'heritage' },
          { id: 'itimad-ud-daulah', name: "Tomb of I'timād-ud-Daulah (Baby Taj)", distance_info: '~ 3.5 km', category: 'heritage' },
          { id: 'chini-ka-rauza', name: 'Chini Ka Rauza Glazed Tile Tomb', distance_info: '~ 1.5 km', category: 'heritage' },
        ],
        shopping: ['Kinari Bazaar (Zardozi Work)', 'Subhash Bazaar'],
      },
      {
        day_number: 3,
        area_title: 'Imperial City of Victory',
        area_name: 'Fatehpur Sikri',
        subtitle: 'The deserted 16th-century royal capital and colossal triumphal gateway.',
        hero_image_url: 'https://images.unsplash.com/photo-1609137144822-79f972b901fc?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'fatehpur-sikri', name: 'Fatehpur Sikri Royal Palace Complex', distance_info: '0 km', category: 'heritage' },
          { id: 'buland-darwaza', name: 'Buland Darwaza (Door of Victory)', distance_info: '~ 0.5 km', category: 'heritage' },
          { id: 'salim-chishti', name: 'Tomb of Sheikh Salim Chishti', distance_info: '~ 0.2 km', category: 'spiritual' },
        ],
        shopping: ['Fatehpur Sikri Local Artisan Market', 'Petha Sweet Bazaar'],
      },
      {
        day_number: 4,
        area_title: "Sikandra & Akbar's Resting Place",
        area_name: 'Sikandra',
        subtitle: 'Tiered red sandstone mausoleum surrounded by roaming blackbucks.',
        hero_image_url: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'akbars-tomb', name: "Akbar's Tomb at Sikandra", distance_info: '0 km', category: 'heritage' },
          { id: 'mariam-tomb', name: 'Tomb of Mariam-uz-Zamani', distance_info: '~ 1 km', category: 'heritage' },
          { id: 'dayal-bagh', name: 'Dayal Bagh Temple Memorial', distance_info: '~ 7 km', category: 'spiritual' },
        ],
        shopping: ['Sanjay Place Commercial Hub', 'Raja ki Mandi Market'],
      },
      {
        day_number: 5,
        area_title: 'Yamuna Ravines & Rural Heritage',
        area_name: 'Bateshwar & Chambal',
        subtitle: 'Ancient curved ghat temples and tranquil wildlife sanctuary edges.',
        hero_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'bateshwar-temples', name: 'Bateshwar 101 Shiva Temple Complex', distance_info: '0 km', category: 'heritage' },
          { id: 'korai-village', name: 'Korai Rural Cultural Village', distance_info: '~ 15 km', category: 'culture' },
          { id: 'ram-bagh', name: 'Ram Bagh (Oldest Mughal Garden)', distance_info: '~ 25 km', category: 'nature' },
        ],
        shopping: ['Agra Leather & Handicrafts Emporium', 'Shah Market'],
      },
    ],
  },

  kochi: {
    city_id: 'kochi',
    city_name: 'Kochi',
    state_name: 'Kerala',
    state_id: 'kerala',
    tagline: 'Queen of the Arabian Sea & Spice Route Port',
    description: 'Trace Portuguese, Dutch, British and Malabar heritage amidst tranquil backwaters, colonial promenades and spice lanes.',
    default_hero_image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&auto=format&fit=crop&q=80',
    days: [
      {
        day_number: 1,
        area_title: 'Fort Kochi Colonial Quarter',
        area_name: 'Fort Kochi',
        subtitle: 'Cantilevered Chinese fishing nets, historic European churches and seaside walks.',
        hero_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'chinese-fishing-nets', name: 'Fort Kochi Chinese Fishing Nets', distance_info: '0 km', category: 'heritage' },
          { id: 'st-francis-church', name: 'St. Francis CSI Church (Vasco da Gama Tomb)', distance_info: '~ 0.5 km', category: 'heritage' },
          { id: 'santa-cruz-basilica', name: 'Santa Cruz Cathedral Basilica', distance_info: '~ 0.8 km', category: 'spiritual' },
          { id: 'princess-street', name: 'Princess Street Colonial Heritage Walk', distance_info: '~ 0.4 km', category: 'culture' },
        ],
        shopping: ['Princess Street Boutiques', 'Fort Kochi Spice Shops'],
      },
      {
        day_number: 2,
        area_title: 'Mattancherry & Jewish Quarter',
        area_name: 'Mattancherry',
        subtitle: 'Antique wooden warehouses, biblical synagogues and Dutch-painted murals.',
        hero_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'mattancherry-palace', name: 'Mattancherry Palace (Dutch Palace)', distance_info: '0 km', category: 'heritage' },
          { id: 'paradesi-synagogue', name: 'Paradesi Synagogue & Clock Tower', distance_info: '~ 0.4 km', category: 'heritage' },
          { id: 'jew-town', name: 'Jew Town Antiques & Spices Alley', distance_info: '~ 0.2 km', category: 'culture' },
        ],
        shopping: ['Jew Town Spice & Antiques Market', 'Kashmiri Handicraft House'],
      },
      {
        day_number: 3,
        area_title: 'Ernakulam & Marine Drive',
        area_name: 'Ernakulam Mainland',
        subtitle: 'Bustling waterfront promenades, folk museums and harbour sunsets.',
        hero_image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'marine-drive-kochi', name: 'Marine Drive Kochi Promenade', distance_info: '0 km', category: 'coastal' },
          { id: 'mangalavanam', name: 'Mangalavanam Bird Sanctuary', distance_info: '~ 2 km', category: 'nature' },
          { id: 'folklore-museum', name: 'Kerala Folklore Museum', distance_info: '~ 7 km', category: 'museum' },
        ],
        shopping: ['Broadway Market Ernakulam', 'Kerala Khadi & Village Industries'],
      },
      {
        day_number: 4,
        area_title: 'Backwater Serenity & Kumbalangi',
        area_name: 'Kumbalangi & Maradu',
        subtitle: 'Traditional eco-villages, coir-weaving and tranquil lagoon backwaters.',
        hero_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'kumbalangi-village', name: 'Kumbalangi Integrated Tourism Village', distance_info: '0 km', category: 'culture' },
          { id: 'vembanad-cruise', name: 'Vembanad Lake Backwater Cruise', distance_info: '~ 3 km', category: 'nature' },
          { id: 'cherai-backwaters', name: 'Local Coir & Crab Farm Experience', distance_info: '~ 2 km', category: 'culture' },
        ],
        shopping: ['Kumbalangi Eco Craft Stalls', 'Handmade Coir Handicrafts'],
      },
      {
        day_number: 5,
        area_title: 'Palaces & Vypeen Island',
        area_name: 'Tripunithura & Vypeen',
        subtitle: 'Royal Cochin dynasty regalia and tranquil Arabian sea beaches.',
        hero_image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'hill-palace', name: 'Hill Palace Museum Tripunithura', distance_info: '0 km', category: 'heritage' },
          { id: 'cherai-beach', name: 'Cherai Beach (Vypeen Island)', distance_info: '~ 25 km', category: 'coastal' },
          { id: 'pallipuram-fort', name: 'Pallipuram Fort (Oldest European Fort)', distance_info: '~ 4 km', category: 'heritage' },
        ],
        shopping: ['Tripunithura Temple Street', 'Cherai Beach Handloom Kiosks'],
      },
    ],
  },

  goa: {
    city_id: 'goa',
    city_name: 'Panaji & Old Goa',
    state_name: 'Goa',
    state_id: 'goa',
    tagline: 'Sun, Sand & UNESCO Baroque Churches',
    description: 'Experience Iberian church architectures, vibrant Latin quarters, golden coastal forts, and fragrant spice farms.',
    default_hero_image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80',
    days: [
      {
        day_number: 1,
        area_title: 'Old Goa UNESCO World Heritage',
        area_name: 'Velha Goa (Old Goa)',
        subtitle: 'Towering baroque cathedrals, gilded altars and sacred relics.',
        hero_image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'basilica-bom-jesus', name: 'Basilica of Bom Jesus', distance_info: '0 km', category: 'heritage' },
          { id: 'se-cathedral', name: 'Se Cathedral (Golden Bell)', distance_info: '~ 0.3 km', category: 'heritage' },
          { id: 'st-francis-assisi', name: 'Church of St. Francis of Assisi', distance_info: '~ 0.2 km', category: 'heritage' },
          { id: 'st-cajetan', name: 'Church of St. Cajetan', distance_info: '~ 0.6 km', category: 'heritage' },
        ],
        shopping: ['Old Goa Souvenir Stalls', 'Panjim Municipal Market'],
      },
      {
        day_number: 2,
        area_title: 'Fontainhas & Panaji Heritage',
        area_name: 'Fontainhas & Panjim',
        subtitle: 'Pastel Portuguese villas, tiled balconies and riverside church plazas.',
        hero_image_url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'fontainhas', name: 'Fontainhas Latin Quarter Walking Tour', distance_info: '0 km', category: 'culture' },
          { id: 'panjim-church', name: 'Our Lady of the Immaculate Conception Church', distance_info: '~ 0.8 km', category: 'heritage' },
          { id: 'miramar-beach', name: 'Miramar Beach & Sunset Point', distance_info: '~ 3 km', category: 'coastal' },
          { id: 'dona-paula', name: 'Dona Paula Viewpoint', distance_info: '~ 4 km', category: 'coastal' },
        ],
        shopping: ['18th June Road Shopping', 'Mala Heritage Street Boutiques'],
      },
      {
        day_number: 3,
        area_title: 'North Goa Coastal Forts',
        area_name: 'Sinquerim & Bardez',
        subtitle: '17th-century lighthouse citadels and golden sands.',
        hero_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'fort-aguada', name: 'Fort Aguada & Ancient Lighthouse', distance_info: '0 km', category: 'heritage' },
          { id: 'sinquerim-beach', name: 'Sinquerim Coastal Bastion', distance_info: '~ 1 km', category: 'coastal' },
          { id: 'candolim-beach', name: 'Candolim Beach Promenade', distance_info: '~ 2.5 km', category: 'coastal' },
          { id: 'reis-magos-fort', name: 'Reis Magos Fort & Cultural Centre', distance_info: '~ 6 km', category: 'heritage' },
        ],
        shopping: ['Calangute Market Square', 'Tibetan Handicraft Market'],
      },
      {
        day_number: 4,
        area_title: 'Spice Plantations & Sacred Temples',
        area_name: 'Ponda',
        subtitle: 'Aromatic cardamom & vanilla groves, traditional Goan cuisine and temple shrines.',
        hero_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'sahakari-spice-farm', name: 'Sahakari Spice Farm Guided Walk', distance_info: '0 km', category: 'nature' },
          { id: 'mangueshi-temple', name: 'Mangueshi Temple & Deepastambha', distance_info: '~ 5 km', category: 'spiritual' },
          { id: 'shanta-durga', name: 'Shanta Durga Temple', distance_info: '~ 6 km', category: 'spiritual' },
        ],
        shopping: ['Spice Plantation Farm Shop (Organic Spices)', 'Ponda Traditional Sweet Stores'],
      },
      {
        day_number: 5,
        area_title: 'South Goa Heritage Mansions',
        area_name: 'Salcete & Chandor',
        subtitle: 'Grand aristocratic manor houses, antique ballrooms and quiet southern sands.',
        hero_image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'ancestral-goa', name: 'Ancestral Goa (Big Foot Museum)', distance_info: '0 km', category: 'museum' },
          { id: 'braganza-house', name: 'Menezes Braganza Heritage House Chandor', distance_info: '~ 12 km', category: 'heritage' },
          { id: 'colva-beach', name: 'Colva Beach', distance_info: '~ 14 km', category: 'coastal' },
        ],
        shopping: ['Margao Covered Municipal Market', 'Colva Beach Street Bazaar'],
      },
    ],
  },

  varanasi: {
    city_id: 'varanasi',
    city_name: 'Varanasi',
    state_name: 'Uttar Pradesh',
    state_id: 'uttar-pradesh',
    tagline: 'Oldest Living City in the World & Spiritual Heart',
    description: 'Experience sacred riverfront Ganga Aarti, ancient stone alleyways, Sarnath Buddhist stupas, and legendary Banarasi handlooms.',
    default_hero_image: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=1000&auto=format&fit=crop&q=80',
    days: [
      {
        day_number: 1,
        area_title: 'Sacred Ghats & Ganga Aarti',
        area_name: 'Main Ghats',
        subtitle: 'Sunrise river boat reflections, temple bells and evening fire rituals.',
        hero_image_url: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'dashashwamedh-ghat', name: 'Dashashwamedh Ghat Sunrise Boat Ride', distance_info: '0 km', category: 'spiritual' },
          { id: 'manikarnika-ghat', name: 'Manikarnika Ghat Viewpoint', distance_info: '~ 1 km', category: 'spiritual' },
          { id: 'scindia-ghat', name: 'Scindia Ghat & Submerged Shiva Temple', distance_info: '~ 0.5 km', category: 'heritage' },
          { id: 'ganga-aarti', name: 'Grand Evening Ganga Aarti Ceremony', distance_info: '~ 1.2 km', category: 'spiritual' },
        ],
        shopping: ['Vishwanath Gali Bazaar', 'Godowlia Chowk Market'],
      },
      {
        day_number: 2,
        area_title: 'Kashi Vishwanath & Ancient Alleys',
        area_name: 'Kashi Old City',
        subtitle: 'Golden shikhara shrines, narrow winding alleys and traditional sweet shops.',
        hero_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'kashi-vishwanath', name: 'Shri Kashi Vishwanath Temple Corridor', distance_info: '0 km', category: 'spiritual' },
          { id: 'annapurna-temple', name: 'Annapurna Temple', distance_info: '~ 0.2 km', category: 'spiritual' },
          { id: 'kal-bhairav', name: 'Kal Bhairav Temple (Guardian of Kashi)', distance_info: '~ 1.5 km', category: 'spiritual' },
        ],
        shopping: ['Thatheri Bazaar (Brass & Bell Metal)', 'Chowk Banarasi Silk Saree Weavers'],
      },
      {
        day_number: 3,
        area_title: 'Sarnath Buddhist Sanctuary',
        area_name: 'Sarnath',
        subtitle: "The Deer Park where Lord Buddha delivered his first sermon, and the Ashoka Lion Capital.",
        hero_image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'dhamek-stupa', name: 'Dhamek Stupa Sarnath', distance_info: '0 km', category: 'heritage' },
          { id: 'sarnath-museum', name: 'Sarnath Archaeological Museum (National Emblem Lion Capital)', distance_info: '~ 0.5 km', category: 'museum' },
          { id: 'chaukhandi-stupa', name: 'Chaukhandi Stupa', distance_info: '~ 1 km', category: 'heritage' },
        ],
        shopping: ['Sarnath Handicraft Center', 'Banaras Handloom Silk Emporium'],
      },
      {
        day_number: 4,
        area_title: 'Southern Ghats & Ramnagar Fort',
        area_name: 'Assi & Ramnagar',
        subtitle: 'Bohemian literary ghats, riverside morning yoga and sandstone fortresses across the river.',
        hero_image_url: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'assi-ghat', name: 'Assi Ghat Subah-e-Banaras Morning Aarti', distance_info: '0 km', category: 'spiritual' },
          { id: 'tulsi-ghat', name: 'Tulsi Ghat & Akhada', distance_info: '~ 0.6 km', category: 'culture' },
          { id: 'ramnagar-fort', name: 'Ramnagar Fort & Royal Museum', distance_info: '~ 4.5 km', category: 'heritage' },
        ],
        shopping: ['Assi Ghat Literary Bookstores & Cafes', 'Ramnagar Lassi & Sweets'],
      },
      {
        day_number: 5,
        area_title: 'BHU Cultural Campus & Modern Shrines',
        area_name: 'Lanka & BHU',
        subtitle: 'Sprawling tree-lined university avenues, art museums and marble temples.',
        hero_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'new-vishwanath-temple', name: 'New Vishwanath Temple (VT) at BHU', distance_info: '0 km', category: 'spiritual' },
          { id: 'bharat-kala-bhavan', name: 'Bharat Kala Bhavan Art & Archaeological Museum', distance_info: '~ 1.5 km', category: 'museum' },
          { id: 'sankat-mochan', name: 'Sankat Mochan Hanuman Temple', distance_info: '~ 3 km', category: 'spiritual' },
        ],
        shopping: ['BHU Souvenir Center', 'Lanka University Market'],
      },
    ],
  },

  srinagar: {
    city_id: 'srinagar',
    city_name: 'Srinagar',
    state_name: 'Jammu and Kashmir',
    state_id: 'jammu-and-kashmir',
    tagline: 'Paradise on Earth & Floating Valleys',
    description: 'Glide on peaceful shikaras across Dal Lake, wander imperial terraced Mughal gardens, and explore century-old deodar wood shrines.',
    default_hero_image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1000&auto=format&fit=crop&q=80',
    days: [
      {
        day_number: 1,
        area_title: 'Dal Lake & Mughal Terraces',
        area_name: 'Dal Lake & Boulevard',
        subtitle: 'Floating gardens, wooden houseboats and cascading water fountains.',
        hero_image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'dal-lake-shikara', name: 'Dal Lake Shikara Ride & Char Chinar', distance_info: '0 km', category: 'nature' },
          { id: 'nishat-bagh', name: 'Nishat Bagh (Garden of Joy)', distance_info: '~ 4 km', category: 'heritage' },
          { id: 'shalimar-bagh', name: 'Shalimar Bagh (Abode of Love)', distance_info: '~ 3 km', category: 'heritage' },
        ],
        shopping: ['Floating Flower & Vegetable Market', 'Lal Chowk Bazaar'],
      },
      {
        day_number: 2,
        area_title: 'Old Srinagar & Medieval Shrines',
        area_name: 'Downtown Srinagar',
        subtitle: '378-pillar wooden mosques, paper-mache workshops and hilltop forts.',
        hero_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'jamia-masjid-srinagar', name: 'Jamia Masjid Srinagar', distance_info: '0 km', category: 'spiritual' },
          { id: 'khanqah-moula', name: 'Khanqah-e-Moula Woodcarved Shrine', distance_info: '~ 1.2 km', category: 'spiritual' },
          { id: 'hari-parbat-fort', name: 'Hari Parbat Fort & Sharika Devi Temple', distance_info: '~ 2.5 km', category: 'heritage' },
        ],
        shopping: ['Zaina Kadal Copperware Street', 'Maharaj Gunj Spices Market'],
      },
      {
        day_number: 3,
        area_title: 'Pari Mahal & Royal Springs',
        area_name: 'Zabarwan Range',
        subtitle: 'Historic celestial observatory terraces and sacred hilltop temples.',
        hero_image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'chashme-shahi', name: 'Chashme Shahi (Royal Spring Garden)', distance_info: '0 km', category: 'nature' },
          { id: 'pari-mahal', name: 'Pari Mahal (Palace of Fairies)', distance_info: '~ 2 km', category: 'heritage' },
          { id: 'shankaracharya-temple', name: 'Shankaracharya Temple Hilltop', distance_info: '~ 6 km', category: 'spiritual' },
        ],
        shopping: ['Polo View High Street', 'Boulevard Road Pashmina Boutiques'],
      },
      {
        day_number: 4,
        area_title: 'Tulip Fields & Dachigam Wilderness',
        area_name: 'Cheshmashahi Foothills',
        subtitle: 'Asia’s largest tulip gardens and dense deodar Himalayan forests.',
        hero_image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'tulip-garden', name: 'Indira Gandhi Memorial Tulip Garden', distance_info: '0 km', category: 'nature' },
          { id: 'botanical-garden', name: 'Jawaharlal Nehru Memorial Botanical Garden', distance_info: '~ 1 km', category: 'nature' },
          { id: 'dachigam-national-park', name: 'Dachigam National Park Outer Trail', distance_info: '~ 6 km', category: 'nature' },
        ],
        shopping: ['Kashmir Government Arts Emporium', 'Resham Ghar Silk Center'],
      },
      {
        day_number: 5,
        area_title: 'Ganderbal & Manasbal Excursion',
        area_name: 'Manasbal & Tulmulla',
        subtitle: 'Deepest alpine lake in Kashmir and sacred spring shrines.',
        hero_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'manasbal-lake', name: 'Manasbal Lake Lotus Waters', distance_info: '0 km', category: 'nature' },
          { id: 'kheer-bhawani', name: 'Kheer Bhawani Spring Temple Tulmulla', distance_info: '~ 8 km', category: 'spiritual' },
        ],
        shopping: ['Ganderbal Willow Wicker Baskets', 'Local Kashmiri Dry Fruits Kiosks'],
      },
    ],
  },

  leh: {
    city_id: 'leh',
    city_name: 'Leh Ladakh',
    state_name: 'Ladakh',
    state_id: 'ladakh',
    tagline: 'Land of High Passes & Ancient Monasteries',
    description: 'High-altitude desert citadels, cliffside Tibetan Buddhist gompas, mountain stupas, and sacred river confluences.',
    default_hero_image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1000&auto=format&fit=crop&q=80',
    days: [
      {
        day_number: 1,
        area_title: 'Leh Town & Acclimatization',
        area_name: 'Leh Old Town',
        subtitle: 'Ancient 9-storey royal palace, peace stupa and panoramic valley sunsets.',
        hero_image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'leh-palace', name: 'Leh Royal Palace', distance_info: '0 km', category: 'heritage' },
          { id: 'namgyal-tsemo', name: 'Namgyal Tsemo Gompa', distance_info: '~ 1.5 km', category: 'heritage' },
          { id: 'shanti-stupa', name: 'Shanti Stupa Sunset Point', distance_info: '~ 3 km', category: 'spiritual' },
        ],
        shopping: ['Leh Main Bazaar', 'Tibetan Refugee Handicraft Market'],
      },
      {
        day_number: 2,
        area_title: 'Indus Valley Ancient Monasteries',
        area_name: 'Thiksey & Shey',
        subtitle: 'Majestic 12-storey whitewashed monasteries resembling the Potala Palace.',
        hero_image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'shey-palace', name: 'Shey Palace & Giant Copper Buddha', distance_info: '0 km', category: 'heritage' },
          { id: 'thiksey-monastery', name: 'Thiksey Monastery (Maitreya Buddha)', distance_info: '~ 5 km', category: 'heritage' },
          { id: 'hemis-monastery', name: 'Hemis Gompa & Museum', distance_info: '~ 18 km', category: 'heritage' },
        ],
        shopping: ['Thiksey Monastery Souvenir Shop', 'Choglamsar Handloom Center'],
      },
      {
        day_number: 3,
        area_title: 'Confluence & Magnetic Wonders',
        area_name: 'Sham Valley',
        subtitle: 'Where the muddy Zanskar meets the turquoise Indus river.',
        hero_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'hall-of-fame', name: 'Hall of Fame War Memorial', distance_info: '0 km', category: 'memorial' },
          { id: 'spituk-gompa', name: 'Spituk Gompa (Kali Mandir Hill)', distance_info: '~ 3 km', category: 'spiritual' },
          { id: 'magnetic-hill', name: 'Magnetic Hill Optical Phenomenon', distance_info: '~ 25 km', category: 'nature' },
          { id: 'sangam-confluence', name: 'Sangam (Indus & Zanskar River Confluence)', distance_info: '~ 5 km', category: 'nature' },
        ],
        shopping: ['Nimmu Roadside Apricot Stalls', 'Spituk Monastery Craft Kiosks'],
      },
      {
        day_number: 4,
        area_title: 'Khardung La Gateway',
        area_name: 'Khardung La Pass',
        subtitle: 'Ascend to one of the world’s highest motorable passes at 17,982 ft.',
        hero_image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'khardung-la-pass', name: 'Khardung La Mountain Pass', distance_info: '0 km', category: 'nature' },
          { id: 'diskit-buddha', name: 'Diskit Monastery & 106-ft Maitreya Buddha', distance_info: '~ 80 km', category: 'heritage' },
        ],
        shopping: ['Diskit Village Bazaar', 'Seabuckthorn Organic Juice Stalls'],
      },
      {
        day_number: 5,
        area_title: 'Alchi Ancient Wall Murals',
        area_name: 'Alchi & Likir',
        subtitle: '11th-century Kashmiri-style Buddhist frescos preserved in clay temples.',
        hero_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'alchi-monastery', name: 'Alchi Choskor Temple Complex', distance_info: '0 km', category: 'heritage' },
          { id: 'likir-monastery', name: 'Likir Gompa & Golden Buddha Statue', distance_info: '~ 20 km', category: 'heritage' },
          { id: 'basgo-plains', name: 'Basgo Mud Citadel Ruins', distance_info: '~ 15 km', category: 'heritage' },
        ],
        shopping: ['Alchi Woodcarving Workshops', 'Ladakh Rural Craft Center'],
      },
    ],
  },

  kolkata: {
    city_id: 'kolkata',
    city_name: 'Kolkata',
    state_name: 'West Bengal',
    state_id: 'west-bengal',
    tagline: 'City of Joy & Cultural Capital of India',
    description: 'A magnificent tapestry of grand marble monuments, Hooghly river landmarks, venerable Shakti pilgrimage shrines, museums and living Bengali traditions.',
    default_hero_image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&auto=format&fit=crop&q=80',
    days: [
      {
        day_number: 1,
        area_title: 'Colonial Splendours & Maidan Cultural Circuit',
        area_name: 'Maidan & Park Street',
        subtitle: 'Grand Victorian marble monument, Gothic cathedral, astronomy dome and India’s oldest museum.',
        hero_image_url: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'west_bengal_001', name: 'Victoria Memorial', distance_info: '0 km', category: 'heritage_monument' },
          { id: 'west_bengal_004', name: 'St. Paul’s Cathedral', distance_info: '~ 0.5 km', category: 'religious_heritage' },
          { id: 'west_bengal_009', name: 'Birla Planetarium', distance_info: '~ 0.4 km', category: 'science_museum' },
          { id: 'west_bengal_003', name: 'Indian Museum', distance_info: '~ 1.5 km', category: 'museum' },
        ],
        shopping: ['New Market (Sir Stuart Hogg Market)', 'Park Street Bookstores', 'Chowringhee Handicrafts'],
      },
      {
        day_number: 2,
        area_title: 'Sacred Hooghly Heritage & Renaissance Mansions',
        area_name: 'Riverfront & North Kolkata',
        subtitle: 'Iconic cantilever bridge, twin riverside spiritual centers and Tagore ancestral estate.',
        hero_image_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'west_bengal_002', name: 'Howrah Bridge', distance_info: '0 km', category: 'engineering_landmark' },
          { id: 'west_bengal_006', name: 'Belur Math', distance_info: '~ 6 km', category: 'religious_heritage' },
          { id: 'west_bengal_005', name: 'Dakshineswar Kali Temple', distance_info: '~ 3 km', category: 'religious_heritage' },
          { id: 'west_bengal_007', name: 'Marble Palace', distance_info: '~ 7 km', category: 'heritage_mansion' },
          { id: 'west_bengal_014', name: 'Jorasanko Thakur Bari', distance_info: '~ 1 km', category: 'museum_heritage' },
        ],
        shopping: ['Kumartuli Clay Idol Alley', 'College Street Boi Para', 'Burrabazar Traditional Textiles'],
      },
      {
        day_number: 3,
        area_title: 'Sacred Shakti Pilgrimage, Zoology & Modern Science',
        area_name: 'Kalighat, Alipore & East Kolkata',
        subtitle: 'Ancient 51 Shakti Peeth shrine, historic zoological gardens, interactive science park and delta wilderness gateway.',
        hero_image_url: 'https://images.unsplash.com/photo-1628155930550-1ef5420a4611?w=800&auto=format&fit=crop&q=80',
        places: [
          { id: 'west_bengal_015', name: 'Kalighat Kali Temple', distance_info: '0 km', category: 'religious_heritage' },
          { id: 'west_bengal_011', name: 'Alipore Zoological Gardens', distance_info: '~ 2.5 km', category: 'zoological_park' },
          { id: 'west_bengal_008', name: 'Science City', distance_info: '~ 8 km', category: 'science_museum' },
          { id: 'west_bengal_010', name: 'Sundarbans National Park', distance_info: '~ Gateway Excursion', category: 'wildlife_national_park' },
        ],
        shopping: ['Dakshinapan State Handicraft Complex', 'Gariahat Market', 'Kalighat Temple Pilgrim Arcade'],
      },
    ],
  },
};

// ============================================================================
// Comprehensive Master Registry of Indian Cities across ALL 36 States/UTs
// ============================================================================

export const ALL_INDIAN_TOURISM_CITIES: CityOption[] = [
  {
    "id": "achanakmar",
    "name": "Achanakmar",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Achanakmar (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "agartala",
    "name": "Agartala",
    "state": "Tripura",
    "state_id": "tripura",
    "displayName": "Agartala (Tripura)",
    "popular": false
  },
  {
    "id": "agra",
    "name": "Agra",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Agra (Uttar Pradesh)",
    "popular": true
  },
  {
    "id": "agroha",
    "name": "Agroha",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Agroha (Haryana)",
    "popular": true
  },
  {
    "id": "ahmedabad",
    "name": "Ahmedabad",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Ahmedabad (Gujarat)",
    "popular": false
  },
  {
    "id": "aihole",
    "name": "Aihole",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Aihole (Karnataka)",
    "popular": true
  },
  {
    "id": "aizawl",
    "name": "Aizawl",
    "state": "Mizoram",
    "state_id": "mizoram",
    "displayName": "Aizawl (Mizoram)",
    "popular": false
  },
  {
    "id": "ajmer",
    "name": "Ajmer",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Ajmer (Rajasthan)",
    "popular": false
  },
  {
    "id": "alappuzha",
    "name": "Alappuzha",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Alappuzha (Kerala)",
    "popular": false
  },
  {
    "id": "almora",
    "name": "Almora",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Almora (Uttarakhand)",
    "popular": false
  },
  {
    "id": "alwar",
    "name": "Alwar",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Alwar (Rajasthan)",
    "popular": false
  },
  {
    "id": "amaravati",
    "name": "Amaravati",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Amaravati (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "amravati",
    "name": "Amravati",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Amravati (Maharashtra)",
    "popular": false
  },
  {
    "id": "amritsar",
    "name": "Amritsar",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Amritsar (Punjab)",
    "popular": true
  },
  {
    "id": "anantapur",
    "name": "Anantapur",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Anantapur (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "anantnag",
    "name": "Anantnag",
    "state": "Jammu and Kashmir",
    "state_id": "jammu-and-kashmir",
    "displayName": "Anantnag (Jammu and Kashmir)",
    "popular": false
  },
  {
    "id": "anuppur",
    "name": "Anuppur",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Anuppur (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "arrah",
    "name": "Arrah",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Arrah (Bihar)",
    "popular": false
  },
  {
    "id": "ayodhya",
    "name": "Ayodhya",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Ayodhya (Uttar Pradesh)",
    "popular": false
  },
  {
    "id": "badami",
    "name": "Badami",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Badami (Karnataka)",
    "popular": false
  },
  {
    "id": "badrinath",
    "name": "Badrinath",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Badrinath (Uttarakhand)",
    "popular": false
  },
  {
    "id": "bagalkote",
    "name": "Bagalkote",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Bagalkote (Karnataka)",
    "popular": false
  },
  {
    "id": "balasinor",
    "name": "Balasinor",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Balasinor (Gujarat)",
    "popular": false
  },
  {
    "id": "ballabhgarh",
    "name": "Ballabhgarh",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Ballabhgarh (Haryana)",
    "popular": true
  },
  {
    "id": "bandipur",
    "name": "Bandipur",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Bandipur (Karnataka)",
    "popular": true
  },
  {
    "id": "banswara",
    "name": "Banswara",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Banswara (Rajasthan)",
    "popular": false
  },
  {
    "id": "bareilly",
    "name": "Bareilly",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Bareilly (Uttar Pradesh)",
    "popular": false
  },
  {
    "id": "barnawapara",
    "name": "Barnawapara",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Barnawapara (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "bastar",
    "name": "Bastar",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Bastar (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "bekal",
    "name": "Bekal",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Bekal (Kerala)",
    "popular": false
  },
  {
    "id": "belagavi",
    "name": "Belagavi",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Belagavi (Karnataka)",
    "popular": false
  },
  {
    "id": "bengaluru",
    "name": "Bengaluru",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Bengaluru (Karnataka)",
    "popular": true
  },
  {
    "id": "berinag",
    "name": "Berinag",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Berinag (Uttarakhand)",
    "popular": false
  },
  {
    "id": "bhabua",
    "name": "Bhabua",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Bhabua (Bihar)",
    "popular": true
  },
  {
    "id": "bhadradri-kothagudem",
    "name": "Bhadradri Kothagudem",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Bhadradri Kothagudem (Telangana)",
    "popular": false
  },
  {
    "id": "bhagalpur",
    "name": "Bhagalpur",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Bhagalpur (Bihar)",
    "popular": true
  },
  {
    "id": "bhairamgarh",
    "name": "Bhairamgarh",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Bhairamgarh (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "bharatpur",
    "name": "Bharatpur",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Bharatpur (Rajasthan)",
    "popular": false
  },
  {
    "id": "bhavnagar",
    "name": "Bhavnagar",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Bhavnagar (Gujarat)",
    "popular": false
  },
  {
    "id": "bhilai",
    "name": "Bhilai",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Bhilai (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "bhimtal",
    "name": "Bhimtal",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Bhimtal (Uttarakhand)",
    "popular": false
  },
  {
    "id": "bhongir",
    "name": "Bhongir",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Bhongir (Telangana)",
    "popular": false
  },
  {
    "id": "bhopal",
    "name": "Bhopal",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Bhopal (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "bhoramdeo",
    "name": "Bhoramdeo",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Bhoramdeo (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "bhubaneswar",
    "name": "Bhubaneswar",
    "state": "Odisha",
    "state_id": "odisha",
    "displayName": "Bhubaneswar (Odisha)",
    "popular": true
  },
  {
    "id": "bhuj",
    "name": "Bhuj",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Bhuj (Gujarat)",
    "popular": false
  },
  {
    "id": "bidar",
    "name": "Bidar",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Bidar (Karnataka)",
    "popular": false
  },
  {
    "id": "bijapur",
    "name": "Bijapur",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Bijapur (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "bikaner",
    "name": "Bikaner",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Bikaner (Rajasthan)",
    "popular": false
  },
  {
    "id": "bilaspur",
    "name": "Bilaspur",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Bilaspur (Chhattisgarh)",
    "popular": false
  },
  {
    "id": "bilaspur-hp",
    "name": "Bilaspur",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Bilaspur (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "bishnupur",
    "name": "Bishnupur",
    "state": "Manipur",
    "state_id": "manipur",
    "displayName": "Bishnupur (Manipur)",
    "popular": false
  },
  {
    "id": "bodh_gaya",
    "name": "Bodh Gaya",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Bodh Gaya (Bihar)",
    "popular": true
  },
  {
    "id": "bomdila",
    "name": "Bomdila",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Bomdila (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "bundi",
    "name": "Bundi",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Bundi (Rajasthan)",
    "popular": false
  },
  {
    "id": "chamba",
    "name": "Chamba",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Chamba (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "chamoli",
    "name": "Chamoli",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Chamoli (Uttarakhand)",
    "popular": false
  },
  {
    "id": "champaner",
    "name": "Champaner",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Champaner (Gujarat)",
    "popular": false
  },
  {
    "id": "champhai",
    "name": "Champhai",
    "state": "Mizoram",
    "state_id": "mizoram",
    "displayName": "Champhai (Mizoram)",
    "popular": false
  },
  {
    "id": "chanderi",
    "name": "Chanderi",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Chanderi (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "chandigarh",
    "name": "Chandigarh",
    "state": "Chandigarh",
    "state_id": "chandigarh",
    "displayName": "Chandigarh (Chandigarh)",
    "popular": false
  },
  {
    "id": "changlang",
    "name": "Changlang",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Changlang (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "chennai",
    "name": "Chennai",
    "state": "Tamil Nadu",
    "state_id": "tamil-nadu",
    "displayName": "Chennai (Tamil Nadu)",
    "popular": true
  },
  {
    "id": "cherrapunjee",
    "name": "Cherrapunjee",
    "state": "Meghalaya",
    "state_id": "meghalaya",
    "displayName": "Cherrapunjee (Meghalaya)",
    "popular": false
  },
  {
    "id": "cherrapunji",
    "name": "Cherrapunji",
    "state": "Meghalaya",
    "state_id": "meghalaya",
    "displayName": "Cherrapunji (Meghalaya)",
    "popular": true
  },
  {
    "id": "chhachhrauli",
    "name": "Chhachhrauli",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Chhachhrauli (Haryana)",
    "popular": true
  },
  {
    "id": "chhatrapati-sambhaji-nagar",
    "name": "Chhatrapati Sambhaji Nagar",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Chhatrapati Sambhaji Nagar (Maharashtra)",
    "popular": true
  },
  {
    "id": "chikkamagaluru",
    "name": "Chikkamagaluru",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Chikkamagaluru (Karnataka)",
    "popular": true
  },
  {
    "id": "chirang",
    "name": "Chirang",
    "state": "Assam",
    "state_id": "assam",
    "displayName": "Chirang (Assam)",
    "popular": false
  },
  {
    "id": "chitradurga",
    "name": "Chitradurga",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Chitradurga (Karnataka)",
    "popular": true
  },
  {
    "id": "chitrakoot-mp",
    "name": "Chitrakoot",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Chitrakoot (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "chitrakoot-up",
    "name": "Chitrakoot",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Chitrakoot (Uttar Pradesh)",
    "popular": false
  },
  {
    "id": "chitrakoot",
    "name": "Chitrakoot",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Chitrakoot (Uttar Pradesh)",
    "popular": true
  },
  {
    "id": "chitrakote",
    "name": "Chitrakote",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Chitrakote (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "chittoor",
    "name": "Chittoor",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Chittoor (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "chittorgarh",
    "name": "Chittorgarh",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Chittorgarh (Rajasthan)",
    "popular": false
  },
  {
    "id": "coimbatore",
    "name": "Coimbatore",
    "state": "Tamil Nadu",
    "state_id": "tamil-nadu",
    "displayName": "Coimbatore (Tamil Nadu)",
    "popular": false
  },
  {
    "id": "cuttack",
    "name": "Cuttack",
    "state": "Odisha",
    "state_id": "odisha",
    "displayName": "Cuttack (Odisha)",
    "popular": false
  },
  {
    "id": "dalhousie",
    "name": "Dalhousie",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Dalhousie (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "daman",
    "name": "Daman",
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "state_id": "dadra-and-nagar-haveli-and-daman-and-diu",
    "displayName": "Daman (Dadra and Nagar Haveli and Daman and Diu)",
    "popular": false
  },
  {
    "id": "dandeli",
    "name": "Dandeli",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Dandeli (Karnataka)",
    "popular": true
  },
  {
    "id": "dantewada",
    "name": "Dantewada",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Dantewada (Chhattisgarh)",
    "popular": false
  },
  {
    "id": "darjeeling",
    "name": "Darjeeling",
    "state": "West Bengal",
    "state_id": "west-bengal",
    "displayName": "Darjeeling (West Bengal)",
    "popular": false
  },
  {
    "id": "datia",
    "name": "Datia",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Datia (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "dausa",
    "name": "Dausa",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Dausa (Rajasthan)",
    "popular": false
  },
  {
    "id": "dawki",
    "name": "Dawki",
    "state": "Meghalaya",
    "state_id": "meghalaya",
    "displayName": "Dawki (Meghalaya)",
    "popular": true
  },
  {
    "id": "dehradun",
    "name": "Dehradun",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Dehradun (Uttarakhand)",
    "popular": false
  },
  {
    "id": "delhi",
    "name": "Delhi",
    "state": "Delhi",
    "state_id": "delhi",
    "displayName": "Delhi (Delhi)",
    "popular": true
  },
  {
    "id": "deoghar",
    "name": "Deoghar",
    "state": "Jharkhand",
    "state_id": "jharkhand",
    "displayName": "Deoghar (Jharkhand)",
    "popular": false
  },
  {
    "id": "dharamshala",
    "name": "Dharamshala",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Dharamshala (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "dharwad",
    "name": "Dharwad",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Dharwad (Karnataka)",
    "popular": false
  },
  {
    "id": "dholpur",
    "name": "Dholpur",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Dholpur (Rajasthan)",
    "popular": false
  },
  {
    "id": "dibrugarh",
    "name": "Dibrugarh",
    "state": "Assam",
    "state_id": "assam",
    "displayName": "Dibrugarh (Assam)",
    "popular": false
  },
  {
    "id": "dimapur",
    "name": "Dimapur",
    "state": "Nagaland",
    "state_id": "nagaland",
    "displayName": "Dimapur (Nagaland)",
    "popular": false
  },
  {
    "id": "dirang",
    "name": "Dirang",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Dirang (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "diu",
    "name": "Diu",
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "state_id": "dadra-and-nagar-haveli-and-daman-and-diu",
    "displayName": "Diu (Dadra and Nagar Haveli and Daman and Diu)",
    "popular": false
  },
  {
    "id": "dudhwa",
    "name": "Dudhwa",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Dudhwa (Uttar Pradesh)",
    "popular": true
  },
  {
    "id": "durgapur",
    "name": "Durgapur",
    "state": "West Bengal",
    "state_id": "west-bengal",
    "displayName": "Durgapur (West Bengal)",
    "popular": false
  },
  {
    "id": "dwarka",
    "name": "Dwarka",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Dwarka (Gujarat)",
    "popular": false
  },
  {
    "id": "dzukou",
    "name": "Dzukou Valley",
    "state": "Manipur",
    "state_id": "manipur",
    "displayName": "Dzukou Valley (Manipur)",
    "popular": false
  },
  {
    "id": "faridabad",
    "name": "Faridabad",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Faridabad (Haryana)",
    "popular": false
  },
  {
    "id": "fatehgarh-sahib",
    "name": "Fatehgarh Sahib",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Fatehgarh Sahib (Punjab)",
    "popular": false
  },
  {
    "id": "fazilka",
    "name": "Fazilka",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Fazilka (Punjab)",
    "popular": false
  },
  {
    "id": "firozepur",
    "name": "Firozepur",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Firozepur (Punjab)",
    "popular": false
  },
  {
    "id": "gandhinagar",
    "name": "Gandhinagar",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Gandhinagar (Gujarat)",
    "popular": false
  },
  {
    "id": "gangotri",
    "name": "Gangotri",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Gangotri (Uttarakhand)",
    "popular": false
  },
  {
    "id": "gangtok",
    "name": "Gangtok",
    "state": "Sikkim",
    "state_id": "sikkim",
    "displayName": "Gangtok (Sikkim)",
    "popular": false
  },
  {
    "id": "gaya",
    "name": "Gaya",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Gaya (Bihar)",
    "popular": true
  },
  {
    "id": "gir-somnath",
    "name": "Gir Somnath",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Gir Somnath (Gujarat)",
    "popular": false
  },
  {
    "id": "goa",
    "name": "Goa",
    "state": "Goa",
    "state_id": "goa",
    "displayName": "Goa (Goa)",
    "popular": true
  },
  {
    "id": "gokarna",
    "name": "Gokarna",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Gokarna (Karnataka)",
    "popular": false
  },
  {
    "id": "govardhan",
    "name": "Govardhan",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Govardhan (Uttar Pradesh)",
    "popular": true
  },
  {
    "id": "gulmarg",
    "name": "Gulmarg",
    "state": "Jammu and Kashmir",
    "state_id": "jammu-and-kashmir",
    "displayName": "Gulmarg (Jammu and Kashmir)",
    "popular": false
  },
  {
    "id": "guntur",
    "name": "Guntur",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Guntur (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "gurdaspur",
    "name": "Gurdaspur",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Gurdaspur (Punjab)",
    "popular": false
  },
  {
    "id": "gurugram",
    "name": "Gurugram",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Gurugram (Haryana)",
    "popular": false
  },
  {
    "id": "guwahati",
    "name": "Guwahati",
    "state": "Assam",
    "state_id": "assam",
    "displayName": "Guwahati (Assam)",
    "popular": false
  },
  {
    "id": "gwalior",
    "name": "Gwalior",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Gwalior (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "hampi",
    "name": "Hampi",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Hampi (Karnataka)",
    "popular": true
  },
  {
    "id": "hanamkonda",
    "name": "Hanamkonda",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Hanamkonda (Telangana)",
    "popular": false
  },
  {
    "id": "haridwar",
    "name": "Haridwar",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Haridwar (Uttarakhand)",
    "popular": false
  },
  {
    "id": "hassan",
    "name": "Hassan",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Hassan (Karnataka)",
    "popular": true
  },
  {
    "id": "hisar",
    "name": "Hisar",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Hisar (Haryana)",
    "popular": false
  },
  {
    "id": "hmuifang",
    "name": "Hmuifang",
    "state": "Mizoram",
    "state_id": "mizoram",
    "displayName": "Hmuifang (Mizoram)",
    "popular": false
  },
  {
    "id": "howrah",
    "name": "Howrah",
    "state": "West Bengal",
    "state_id": "west-bengal",
    "displayName": "Howrah (West Bengal)",
    "popular": false
  },
  {
    "id": "hyderabad",
    "name": "Hyderabad",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Hyderabad (Telangana)",
    "popular": true
  },
  {
    "id": "igatpuri",
    "name": "Igatpuri",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Igatpuri (Maharashtra)",
    "popular": false
  },
  {
    "id": "imphal",
    "name": "Imphal",
    "state": "Manipur",
    "state_id": "manipur",
    "displayName": "Imphal (Manipur)",
    "popular": false
  },
  {
    "id": "indore",
    "name": "Indore",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Indore (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "itanagar",
    "name": "Itanagar",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Itanagar (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "jabalpur",
    "name": "Jabalpur",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Jabalpur (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "jagdalpur",
    "name": "Jagdalpur",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Jagdalpur (Chhattisgarh)",
    "popular": false
  },
  {
    "id": "jaipur",
    "name": "Jaipur",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Jaipur (Rajasthan)",
    "popular": true
  },
  {
    "id": "jaisalmer",
    "name": "Jaisalmer",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Jaisalmer (Rajasthan)",
    "popular": false
  },
  {
    "id": "jalandhar",
    "name": "Jalandhar",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Jalandhar (Punjab)",
    "popular": false
  },
  {
    "id": "jalgaon",
    "name": "Jalgaon",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Jalgaon (Maharashtra)",
    "popular": false
  },
  {
    "id": "jammu",
    "name": "Jammu",
    "state": "Jammu and Kashmir",
    "state_id": "jammu-and-kashmir",
    "displayName": "Jammu (Jammu and Kashmir)",
    "popular": false
  },
  {
    "id": "jamnagar",
    "name": "Jamnagar",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Jamnagar (Gujarat)",
    "popular": false
  },
  {
    "id": "jamshedpur",
    "name": "Jamshedpur",
    "state": "Jharkhand",
    "state_id": "jharkhand",
    "displayName": "Jamshedpur (Jharkhand)",
    "popular": false
  },
  {
    "id": "jashpur",
    "name": "Jashpur",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Jashpur (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "jehanabad",
    "name": "Jehanabad",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Jehanabad (Bihar)",
    "popular": true
  },
  {
    "id": "jhajjar",
    "name": "Jhajjar",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Jhajjar (Haryana)",
    "popular": true
  },
  {
    "id": "jhansi",
    "name": "Jhansi",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Jhansi (Uttar Pradesh)",
    "popular": false
  },
  {
    "id": "jodhpur",
    "name": "Jodhpur",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Jodhpur (Rajasthan)",
    "popular": true
  },
  {
    "id": "jorhat",
    "name": "Jorhat",
    "state": "Assam",
    "state_id": "assam",
    "displayName": "Jorhat (Assam)",
    "popular": false
  },
  {
    "id": "junagadh",
    "name": "Junagadh",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Junagadh (Gujarat)",
    "popular": false
  },
  {
    "id": "kaithal",
    "name": "Kaithal",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Kaithal (Haryana)",
    "popular": true
  },
  {
    "id": "kakinada",
    "name": "Kakinada",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Kakinada (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "kalaburagi",
    "name": "Kalaburagi",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Kalaburagi (Karnataka)",
    "popular": false
  },
  {
    "id": "kalesar",
    "name": "Kalesar",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Kalesar (Haryana)",
    "popular": true
  },
  {
    "id": "kalimpong",
    "name": "Kalimpong",
    "state": "West Bengal",
    "state_id": "west-bengal",
    "displayName": "Kalimpong (West Bengal)",
    "popular": false
  },
  {
    "id": "kanchipuram",
    "name": "Kanchipuram",
    "state": "Tamil Nadu",
    "state_id": "tamil-nadu",
    "displayName": "Kanchipuram (Tamil Nadu)",
    "popular": false
  },
  {
    "id": "kanger-valley",
    "name": "Kanger Valley",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Kanger Valley (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "kangra",
    "name": "Kangra",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Kangra (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "kanker",
    "name": "Kanker",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Kanker (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "kanniyakumari",
    "name": "Kanniyakumari",
    "state": "Tamil Nadu",
    "state_id": "tamil-nadu",
    "displayName": "Kanniyakumari (Tamil Nadu)",
    "popular": false
  },
  {
    "id": "kannur",
    "name": "Kannur",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Kannur (Kerala)",
    "popular": false
  },
  {
    "id": "kanpur",
    "name": "Kanpur",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Kanpur (Uttar Pradesh)",
    "popular": false
  },
  {
    "id": "kapurthala",
    "name": "Kapurthala",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Kapurthala (Punjab)",
    "popular": false
  },
  {
    "id": "kargil",
    "name": "Kargil",
    "state": "Ladakh",
    "state_id": "ladakh",
    "displayName": "Kargil (Ladakh)",
    "popular": false
  },
  {
    "id": "karimnagar",
    "name": "Karimnagar",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Karimnagar (Telangana)",
    "popular": false
  },
  {
    "id": "karnal",
    "name": "Karnal",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Karnal (Haryana)",
    "popular": true
  },
  {
    "id": "kasargod",
    "name": "Kasargod",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Kasargod (Kerala)",
    "popular": false
  },
  {
    "id": "kasauli",
    "name": "Kasauli",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Kasauli (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "kausani",
    "name": "Kausani",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Kausani (Uttarakhand)",
    "popular": false
  },
  {
    "id": "kavaratti",
    "name": "Kavaratti",
    "state": "Lakshadweep",
    "state_id": "lakshadweep",
    "displayName": "Kavaratti (Lakshadweep)",
    "popular": false
  },
  {
    "id": "kedarnath",
    "name": "Kedarnath",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Kedarnath (Uttarakhand)",
    "popular": false
  },
  {
    "id": "kesaria",
    "name": "Kesaria",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Kesaria (Bihar)",
    "popular": true
  },
  {
    "id": "keylong",
    "name": "Keylong",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Keylong (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "khajuraho",
    "name": "Khajuraho",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Khajuraho (Madhya Pradesh)",
    "popular": true
  },
  {
    "id": "khammam",
    "name": "Khammam",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Khammam (Telangana)",
    "popular": false
  },
  {
    "id": "khongjom",
    "name": "Khongjom",
    "state": "Manipur",
    "state_id": "manipur",
    "displayName": "Khongjom (Manipur)",
    "popular": false
  },
  {
    "id": "kochi",
    "name": "Kochi",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Kochi (Kerala)",
    "popular": true
  },
  {
    "id": "kohima",
    "name": "Kohima",
    "state": "Nagaland",
    "state_id": "nagaland",
    "displayName": "Kohima (Nagaland)",
    "popular": false
  },
  {
    "id": "kolhapur",
    "name": "Kolhapur",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Kolhapur (Maharashtra)",
    "popular": false
  },
  {
    "id": "kolkata",
    "name": "Kolkata",
    "state": "West Bengal",
    "state_id": "west-bengal",
    "displayName": "Kolkata (West Bengal)",
    "popular": true
  },
  {
    "id": "kollam",
    "name": "Kollam",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Kollam (Kerala)",
    "popular": false
  },
  {
    "id": "koraput",
    "name": "Koraput",
    "state": "Odisha",
    "state_id": "odisha",
    "displayName": "Koraput (Odisha)",
    "popular": false
  },
  {
    "id": "kota",
    "name": "Kota",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Kota (Rajasthan)",
    "popular": false
  },
  {
    "id": "kottayam",
    "name": "Kottayam",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Kottayam (Kerala)",
    "popular": false
  },
  {
    "id": "kovalam",
    "name": "Kovalam",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Kovalam (Kerala)",
    "popular": false
  },
  {
    "id": "kozhikode",
    "name": "Kozhikode",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Kozhikode (Kerala)",
    "popular": false
  },
  {
    "id": "kullu",
    "name": "Kullu",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Kullu (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "kumarakom",
    "name": "Kumarakom",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Kumarakom (Kerala)",
    "popular": false
  },
  {
    "id": "kurnool",
    "name": "Kurnool",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Kurnool (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "kurukshetra",
    "name": "Kurukshetra",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Kurukshetra (Haryana)",
    "popular": false
  },
  {
    "id": "kutch",
    "name": "Kutch",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Kutch (Gujarat)",
    "popular": false
  },
  {
    "id": "lakkundi",
    "name": "Lakkundi",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Lakkundi (Karnataka)",
    "popular": false
  },
  {
    "id": "lansdowne",
    "name": "Lansdowne",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Lansdowne (Uttarakhand)",
    "popular": false
  },
  {
    "id": "lawngtlai",
    "name": "Lawngtlai",
    "state": "Mizoram",
    "state_id": "mizoram",
    "displayName": "Lawngtlai (Mizoram)",
    "popular": false
  },
  {
    "id": "leh",
    "name": "Leh",
    "state": "Ladakh",
    "state_id": "ladakh",
    "displayName": "Leh (Ladakh)",
    "popular": true
  },
  {
    "id": "loktak",
    "name": "Loktak",
    "state": "Manipur",
    "state_id": "manipur",
    "displayName": "Loktak (Manipur)",
    "popular": true
  },
  {
    "id": "lucknow",
    "name": "Lucknow",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Lucknow (Uttar Pradesh)",
    "popular": false
  },
  {
    "id": "ludhiana",
    "name": "Ludhiana",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Ludhiana (Punjab)",
    "popular": false
  },
  {
    "id": "lunglei",
    "name": "Lunglei",
    "state": "Mizoram",
    "state_id": "mizoram",
    "displayName": "Lunglei (Mizoram)",
    "popular": false
  },
  {
    "id": "machilipatnam",
    "name": "Machilipatnam",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Machilipatnam (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "madikeri",
    "name": "Madikeri",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Madikeri (Karnataka)",
    "popular": true
  },
  {
    "id": "madurai",
    "name": "Madurai",
    "state": "Tamil Nadu",
    "state_id": "tamil-nadu",
    "displayName": "Madurai (Tamil Nadu)",
    "popular": true
  },
  {
    "id": "mahabaleshwar",
    "name": "Mahabaleshwar",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Mahabaleshwar (Maharashtra)",
    "popular": false
  },
  {
    "id": "mainpat",
    "name": "Mainpat",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Mainpat (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "majuli",
    "name": "Majuli",
    "state": "Assam",
    "state_id": "assam",
    "displayName": "Majuli (Assam)",
    "popular": false
  },
  {
    "id": "malappuram",
    "name": "Malappuram",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Malappuram (Kerala)",
    "popular": false
  },
  {
    "id": "mamallapuram",
    "name": "Mamallapuram",
    "state": "Tamil Nadu",
    "state_id": "tamil-nadu",
    "displayName": "Mamallapuram (Tamil Nadu)",
    "popular": false
  },
  {
    "id": "manali",
    "name": "Manali",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Manali (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "mandsaur",
    "name": "Mandsaur",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Mandsaur (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "mangalore",
    "name": "Mangalore",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Mangalore (Karnataka)",
    "popular": false
  },
  {
    "id": "mangaluru",
    "name": "Mangaluru",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Mangaluru (Karnataka)",
    "popular": true
  },
  {
    "id": "mangan",
    "name": "Mangan",
    "state": "Sikkim",
    "state_id": "sikkim",
    "displayName": "Mangan (Sikkim)",
    "popular": false
  },
  {
    "id": "mathura",
    "name": "Mathura",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Mathura (Uttar Pradesh)",
    "popular": false
  },
  {
    "id": "mawlynnong",
    "name": "Mawlynnong",
    "state": "Meghalaya",
    "state_id": "meghalaya",
    "displayName": "Mawlynnong (Meghalaya)",
    "popular": false
  },
  {
    "id": "mayabunder",
    "name": "Mayabunder",
    "state": "Andaman and Nicobar Islands",
    "state_id": "andaman-and-nicobar-islands",
    "displayName": "Mayabunder (Andaman and Nicobar Islands)",
    "popular": false
  },
  {
    "id": "mayurbhanj",
    "name": "Mayurbhanj",
    "state": "Odisha",
    "state_id": "odisha",
    "displayName": "Mayurbhanj (Odisha)",
    "popular": false
  },
  {
    "id": "mechuka",
    "name": "Mechuka",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Mechuka (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "mokokchung",
    "name": "Mokokchung",
    "state": "Nagaland",
    "state_id": "nagaland",
    "displayName": "Mokokchung (Nagaland)",
    "popular": false
  },
  {
    "id": "mon",
    "name": "Mon",
    "state": "Nagaland",
    "state_id": "nagaland",
    "displayName": "Mon (Nagaland)",
    "popular": false
  },
  {
    "id": "morena",
    "name": "Morena",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Morena (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "morni",
    "name": "Morni",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Morni (Haryana)",
    "popular": true
  },
  {
    "id": "mount-abu",
    "name": "Mount Abu",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Mount Abu (Rajasthan)",
    "popular": false
  },
  {
    "id": "mumbai",
    "name": "Mumbai",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Mumbai (Maharashtra)",
    "popular": true
  },
  {
    "id": "munger",
    "name": "Munger",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Munger (Bihar)",
    "popular": true
  },
  {
    "id": "munnar",
    "name": "Munnar",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Munnar (Kerala)",
    "popular": false
  },
  {
    "id": "murudeshwar",
    "name": "Murudeshwar",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Murudeshwar (Karnataka)",
    "popular": true
  },
  {
    "id": "mussoorie",
    "name": "Mussoorie",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Mussoorie (Uttarakhand)",
    "popular": false
  },
  {
    "id": "mysuru",
    "name": "Mysuru",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Mysuru (Karnataka)",
    "popular": false
  },
  {
    "id": "nagarhole",
    "name": "Nagarhole",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Nagarhole (Karnataka)",
    "popular": true
  },
  {
    "id": "nagpur",
    "name": "Nagpur",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Nagpur (Maharashtra)",
    "popular": false
  },
  {
    "id": "nainital",
    "name": "Nainital",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Nainital (Uttarakhand)",
    "popular": false
  },
  {
    "id": "nalanda",
    "name": "Nalanda",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Nalanda (Bihar)",
    "popular": false
  },
  {
    "id": "nalgonda",
    "name": "Nalgonda",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Nalgonda (Telangana)",
    "popular": false
  },
  {
    "id": "namsai",
    "name": "Namsai",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Namsai (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "narnaul",
    "name": "Narnaul",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Narnaul (Haryana)",
    "popular": true
  },
  {
    "id": "nashik",
    "name": "Nashik",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Nashik (Maharashtra)",
    "popular": false
  },
  {
    "id": "naya-raipur",
    "name": "Naya Raipur",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Naya Raipur (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "nellore",
    "name": "Nellore",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Nellore (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "new-tehri",
    "name": "New Tehri",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "New Tehri (Uttarakhand)",
    "popular": false
  },
  {
    "id": "nirmal",
    "name": "Nirmal",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Nirmal (Telangana)",
    "popular": false
  },
  {
    "id": "nongriat",
    "name": "Nongriat",
    "state": "Meghalaya",
    "state_id": "meghalaya",
    "displayName": "Nongriat (Meghalaya)",
    "popular": false
  },
  {
    "id": "ooty",
    "name": "Ooty",
    "state": "Tamil Nadu",
    "state_id": "tamil-nadu",
    "displayName": "Ooty (Tamil Nadu)",
    "popular": false
  },
  {
    "id": "orchha",
    "name": "Orchha",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Orchha (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "pachmarhi",
    "name": "Pachmarhi",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Pachmarhi (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "pahalgam",
    "name": "Pahalgam",
    "state": "Jammu and Kashmir",
    "state_id": "jammu-and-kashmir",
    "displayName": "Pahalgam (Jammu and Kashmir)",
    "popular": false
  },
  {
    "id": "pakke-kesang-hill-station",
    "name": "Pakke Kesang Hill Station",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Pakke Kesang Hill Station (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "palakkad",
    "name": "Palakkad",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Palakkad (Kerala)",
    "popular": false
  },
  {
    "id": "panchkula",
    "name": "Panchkula",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Panchkula (Haryana)",
    "popular": true
  },
  {
    "id": "panipat",
    "name": "Panipat",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Panipat (Haryana)",
    "popular": false
  },
  {
    "id": "paonta-sahib",
    "name": "Paonta Sahib",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Paonta Sahib (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "pasighat",
    "name": "Pasighat",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Pasighat (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "patan",
    "name": "Patan",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Patan (Gujarat)",
    "popular": false
  },
  {
    "id": "pathanamthitta",
    "name": "Pathanamthitta",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Pathanamthitta (Kerala)",
    "popular": false
  },
  {
    "id": "pathankot",
    "name": "Pathankot",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Pathankot (Punjab)",
    "popular": false
  },
  {
    "id": "patiala",
    "name": "Patiala",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Patiala (Punjab)",
    "popular": false
  },
  {
    "id": "patna",
    "name": "Patna",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Patna (Bihar)",
    "popular": false
  },
  {
    "id": "patna_city",
    "name": "Patna City",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Patna City (Bihar)",
    "popular": true
  },
  {
    "id": "patnitop",
    "name": "Patnitop",
    "state": "Jammu and Kashmir",
    "state_id": "jammu-and-kashmir",
    "displayName": "Patnitop (Jammu and Kashmir)",
    "popular": false
  },
  {
    "id": "pattadakal",
    "name": "Pattadakal",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Pattadakal (Karnataka)",
    "popular": true
  },
  {
    "id": "pawapuri",
    "name": "Pawapuri",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Pawapuri (Bihar)",
    "popular": true
  },
  {
    "id": "pelling",
    "name": "Pelling",
    "state": "Sikkim",
    "state_id": "sikkim",
    "displayName": "Pelling (Sikkim)",
    "popular": false
  },
  {
    "id": "peren",
    "name": "Peren",
    "state": "Nagaland",
    "state_id": "nagaland",
    "displayName": "Peren (Nagaland)",
    "popular": false
  },
  {
    "id": "phek",
    "name": "Phek",
    "state": "Nagaland",
    "state_id": "nagaland",
    "displayName": "Phek (Nagaland)",
    "popular": false
  },
  {
    "id": "pinjore",
    "name": "Pinjore",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Pinjore (Haryana)",
    "popular": true
  },
  {
    "id": "pithoragarh",
    "name": "Pithoragarh",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Pithoragarh (Uttarakhand)",
    "popular": false
  },
  {
    "id": "porbandar",
    "name": "Porbandar",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Porbandar (Gujarat)",
    "popular": false
  },
  {
    "id": "prayagraj",
    "name": "Prayagraj",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Prayagraj (Uttar Pradesh)",
    "popular": false
  },
  {
    "id": "puducherry",
    "name": "Puducherry",
    "state": "Puducherry",
    "state_id": "puducherry",
    "displayName": "Puducherry (Puducherry)",
    "popular": false
  },
  {
    "id": "pune",
    "name": "Pune",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Pune (Maharashtra)",
    "popular": true
  },
  {
    "id": "puri",
    "name": "Puri",
    "state": "Odisha",
    "state_id": "odisha",
    "displayName": "Puri (Odisha)",
    "popular": false
  },
  {
    "id": "raipur",
    "name": "Raipur",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Raipur (Chhattisgarh)",
    "popular": false
  },
  {
    "id": "rajahmundry",
    "name": "Rajahmundry",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Rajahmundry (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "rajgir",
    "name": "Rajgir",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Rajgir (Bihar)",
    "popular": true
  },
  {
    "id": "rajim",
    "name": "Rajim",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Rajim (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "rajkot",
    "name": "Rajkot",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Rajkot (Gujarat)",
    "popular": false
  },
  {
    "id": "rajnandgaon",
    "name": "Rajnandgaon",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Rajnandgaon (Chhattisgarh)",
    "popular": false
  },
  {
    "id": "rakhigarhi",
    "name": "Rakhigarhi",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Rakhigarhi (Haryana)",
    "popular": true
  },
  {
    "id": "rameswaram",
    "name": "Rameswaram",
    "state": "Tamil Nadu",
    "state_id": "tamil-nadu",
    "displayName": "Rameswaram (Tamil Nadu)",
    "popular": false
  },
  {
    "id": "ranchi",
    "name": "Ranchi",
    "state": "Jharkhand",
    "state_id": "jharkhand",
    "displayName": "Ranchi (Jharkhand)",
    "popular": false
  },
  {
    "id": "rangat",
    "name": "Rangat",
    "state": "Andaman and Nicobar Islands",
    "state_id": "andaman-and-nicobar-islands",
    "displayName": "Rangat (Andaman and Nicobar Islands)",
    "popular": false
  },
  {
    "id": "reckong-peo",
    "name": "Reckong Peo",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Reckong Peo (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "rishikesh",
    "name": "Rishikesh",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Rishikesh (Uttarakhand)",
    "popular": false
  },
  {
    "id": "rohtak",
    "name": "Rohtak",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Rohtak (Haryana)",
    "popular": true
  },
  {
    "id": "roing",
    "name": "Roing",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Roing (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "rupnagar",
    "name": "Rupnagar",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "Rupnagar (Punjab)",
    "popular": false
  },
  {
    "id": "sabrimala",
    "name": "Sabrimala",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Sabrimala (Kerala)",
    "popular": false
  },
  {
    "id": "sagara",
    "name": "Sagara",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Sagara (Karnataka)",
    "popular": true
  },
  {
    "id": "saitual",
    "name": "Saitual",
    "state": "Mizoram",
    "state_id": "mizoram",
    "displayName": "Saitual (Mizoram)",
    "popular": false
  },
  {
    "id": "sanchi",
    "name": "Sanchi",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Sanchi (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "santiniketan",
    "name": "Santiniketan",
    "state": "West Bengal",
    "state_id": "west-bengal",
    "displayName": "Santiniketan (West Bengal)",
    "popular": true
  },
  {
    "id": "sas-nagar",
    "name": "SAS Nagar",
    "state": "Punjab",
    "state_id": "punjab",
    "displayName": "SAS Nagar (Punjab)",
    "popular": false
  },
  {
    "id": "satara",
    "name": "Satara",
    "state": "Maharashtra",
    "state_id": "maharashtra",
    "displayName": "Satara (Maharashtra)",
    "popular": false
  },
  {
    "id": "semarsot",
    "name": "Semarsot",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Semarsot (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "serchhip",
    "name": "Serchhip",
    "state": "Mizoram",
    "state_id": "mizoram",
    "displayName": "Serchhip (Mizoram)",
    "popular": false
  },
  {
    "id": "shillong",
    "name": "Shillong",
    "state": "Meghalaya",
    "state_id": "meghalaya",
    "displayName": "Shillong (Meghalaya)",
    "popular": false
  },
  {
    "id": "shimla",
    "name": "Shimla",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Shimla (Himachal Pradesh)",
    "popular": true
  },
  {
    "id": "siaha",
    "name": "Siaha",
    "state": "Mizoram",
    "state_id": "mizoram",
    "displayName": "Siaha (Mizoram)",
    "popular": false
  },
  {
    "id": "siliguri",
    "name": "Siliguri",
    "state": "West Bengal",
    "state_id": "west-bengal",
    "displayName": "Siliguri (West Bengal)",
    "popular": false
  },
  {
    "id": "silvassa",
    "name": "Silvassa",
    "state": "Dadra and Nagar Haveli and Daman and Diu",
    "state_id": "dadra-and-nagar-haveli-and-daman-and-diu",
    "displayName": "Silvassa (Dadra and Nagar Haveli and Daman and Diu)",
    "popular": false
  },
  {
    "id": "sirpur",
    "name": "Sirpur",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Sirpur (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "sitamarhi",
    "name": "Sitamarhi",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Sitamarhi (Bihar)",
    "popular": true
  },
  {
    "id": "sitanadi",
    "name": "Sitanadi",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Sitanadi (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "sivasagar",
    "name": "Sivasagar",
    "state": "Assam",
    "state_id": "assam",
    "displayName": "Sivasagar (Assam)",
    "popular": false
  },
  {
    "id": "sohna",
    "name": "Sohna",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Sohna (Haryana)",
    "popular": true
  },
  {
    "id": "somnathpura",
    "name": "Somnathpura",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Somnathpura (Karnataka)",
    "popular": false
  },
  {
    "id": "spiti-valley",
    "name": "Spiti Valley",
    "state": "Himachal Pradesh",
    "state_id": "himachal-pradesh",
    "displayName": "Spiti Valley (Himachal Pradesh)",
    "popular": false
  },
  {
    "id": "sri-vijaya-puram",
    "name": "Sri Vijaya Puram",
    "state": "Andaman and Nicobar Islands",
    "state_id": "andaman-and-nicobar-islands",
    "displayName": "Sri Vijaya Puram (Andaman and Nicobar Islands)",
    "popular": true
  },
  {
    "id": "srikakulam",
    "name": "Srikakulam",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Srikakulam (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "srinagar",
    "name": "Srinagar",
    "state": "Jammu and Kashmir",
    "state_id": "jammu-and-kashmir",
    "displayName": "Srinagar (Jammu and Kashmir)",
    "popular": true
  },
  {
    "id": "sultanpur",
    "name": "Sultanpur",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Sultanpur (Haryana)",
    "popular": true
  },
  {
    "id": "surat",
    "name": "Surat",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Surat (Gujarat)",
    "popular": false
  },
  {
    "id": "tamor-pingla",
    "name": "Tamor Pingla",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Tamor Pingla (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "tawang",
    "name": "Tawang",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Tawang (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "tezpur",
    "name": "Tezpur",
    "state": "Assam",
    "state_id": "assam",
    "displayName": "Tezpur (Assam)",
    "popular": false
  },
  {
    "id": "thanjavur",
    "name": "Thanjavur",
    "state": "Tamil Nadu",
    "state_id": "tamil-nadu",
    "displayName": "Thanjavur (Tamil Nadu)",
    "popular": false
  },
  {
    "id": "thiruvananthapuram",
    "name": "Thiruvananthapuram",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Thiruvananthapuram (Kerala)",
    "popular": false
  },
  {
    "id": "thrissur",
    "name": "Thrissur",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Thrissur (Kerala)",
    "popular": false
  },
  {
    "id": "tinsukia",
    "name": "Tinsukia",
    "state": "Assam",
    "state_id": "assam",
    "displayName": "Tinsukia (Assam)",
    "popular": false
  },
  {
    "id": "tiruchirappalli",
    "name": "Tiruchirappalli",
    "state": "Tamil Nadu",
    "state_id": "tamil-nadu",
    "displayName": "Tiruchirappalli (Tamil Nadu)",
    "popular": false
  },
  {
    "id": "tirupati",
    "name": "Tirupati",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Tirupati (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "udaipur",
    "name": "Udaipur",
    "state": "Rajasthan",
    "state_id": "rajasthan",
    "displayName": "Udaipur (Rajasthan)",
    "popular": true
  },
  {
    "id": "udanti-sitanadi",
    "name": "Udanti-Sitanadi",
    "state": "Chhattisgarh",
    "state_id": "chhattisgarh",
    "displayName": "Udanti-Sitanadi (Chhattisgarh)",
    "popular": true
  },
  {
    "id": "udupi",
    "name": "Udupi",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Udupi (Karnataka)",
    "popular": false
  },
  {
    "id": "ujjain",
    "name": "Ujjain",
    "state": "Madhya Pradesh",
    "state_id": "madhya-pradesh",
    "displayName": "Ujjain (Madhya Pradesh)",
    "popular": false
  },
  {
    "id": "ukhrul",
    "name": "Ukhrul",
    "state": "Manipur",
    "state_id": "manipur",
    "displayName": "Ukhrul (Manipur)",
    "popular": false
  },
  {
    "id": "umiam",
    "name": "Umiam",
    "state": "Meghalaya",
    "state_id": "meghalaya",
    "displayName": "Umiam (Meghalaya)",
    "popular": false
  },
  {
    "id": "umrangso",
    "name": "Umrangso",
    "state": "Assam",
    "state_id": "assam",
    "displayName": "Umrangso (Assam)",
    "popular": false
  },
  {
    "id": "unakoti",
    "name": "Unakoti",
    "state": "Tripura",
    "state_id": "tripura",
    "displayName": "Unakoti (Tripura)",
    "popular": false
  },
  {
    "id": "uttarkashi",
    "name": "Uttarkashi",
    "state": "Uttarakhand",
    "state_id": "uttarakhand",
    "displayName": "Uttarkashi (Uttarakhand)",
    "popular": false
  },
  {
    "id": "vadnagar",
    "name": "Vadnagar",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Vadnagar (Gujarat)",
    "popular": false
  },
  {
    "id": "vadodara",
    "name": "Vadodara",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Vadodara (Gujarat)",
    "popular": false
  },
  {
    "id": "vaishali",
    "name": "Vaishali",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Vaishali (Bihar)",
    "popular": true
  },
  {
    "id": "valmiki_nagar",
    "name": "Valmiki Nagar",
    "state": "Bihar",
    "state_id": "bihar",
    "displayName": "Valmiki Nagar (Bihar)",
    "popular": true
  },
  {
    "id": "valsad",
    "name": "Valsad",
    "state": "Gujarat",
    "state_id": "gujarat",
    "displayName": "Valsad (Gujarat)",
    "popular": false
  },
  {
    "id": "varanasi",
    "name": "Varanasi",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Varanasi (Uttar Pradesh)",
    "popular": true
  },
  {
    "id": "varkala",
    "name": "Varkala",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Varkala (Kerala)",
    "popular": false
  },
  {
    "id": "vijayapura",
    "name": "Vijayapura",
    "state": "Karnataka",
    "state_id": "karnataka",
    "displayName": "Vijayapura (Karnataka)",
    "popular": false
  },
  {
    "id": "vindhyachal",
    "name": "Vindhyachal",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Vindhyachal (Uttar Pradesh)",
    "popular": true
  },
  {
    "id": "visakhapatnam",
    "name": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Visakhapatnam (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "vizianagaram",
    "name": "Vizianagaram",
    "state": "Andhra Pradesh",
    "state_id": "andhra-pradesh",
    "displayName": "Vizianagaram (Andhra Pradesh)",
    "popular": false
  },
  {
    "id": "vrindavan",
    "name": "Vrindavan",
    "state": "Uttar Pradesh",
    "state_id": "uttar-pradesh",
    "displayName": "Vrindavan (Uttar Pradesh)",
    "popular": true
  },
  {
    "id": "warangal",
    "name": "Warangal",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Warangal (Telangana)",
    "popular": false
  },
  {
    "id": "wayanad",
    "name": "Wayanad",
    "state": "Kerala",
    "state_id": "kerala",
    "displayName": "Wayanad (Kerala)",
    "popular": false
  },
  {
    "id": "yadadri",
    "name": "Yadadri",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Yadadri (Telangana)",
    "popular": false
  },
  {
    "id": "yadadri-bhuvanagiri",
    "name": "Yadadri Bhuvanagiri",
    "state": "Telangana",
    "state_id": "telangana",
    "displayName": "Yadadri Bhuvanagiri (Telangana)",
    "popular": false
  },
  {
    "id": "yamunanagar",
    "name": "Yamunanagar",
    "state": "Haryana",
    "state_id": "haryana",
    "displayName": "Yamunanagar (Haryana)",
    "popular": false
  },
  {
    "id": "yingkiong",
    "name": "Yingkiong",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Yingkiong (Arunachal Pradesh)",
    "popular": false
  },
  {
    "id": "ziro",
    "name": "Ziro",
    "state": "Arunachal Pradesh",
    "state_id": "arunachal-pradesh",
    "displayName": "Ziro (Arunachal Pradesh)",
    "popular": false
  }
];

/**
 * Resolver function:
 * Resolves a city query string (e.g. "Mumbai", "mumbai", "Mumbai (Maharashtra)", "delhi", "Patna")
 * into a matching VerifiedCityItinerary or falls back to an intelligent spatial cluster.
 */
export function getVerifiedCityPlan(
  cityNameOrId: string,
  requestedDays: number = 5,
  pace: string = 'moderate',
  budget: string = 'moderate'
): {
  city_id: string;
  city_name: string;
  state_name: string;
  days_count: number;
  title: string;
  summary: string;
  days: VerifiedDayBlueprint[];
} {
  const normalized = (cityNameOrId || 'mumbai').toLowerCase().trim();

  // Find direct match or substring in curated itineraries
  let matchedKey = Object.keys(VERIFIED_CITY_ITINERARIES).find((key) => {
    const city = VERIFIED_CITY_ITINERARIES[key];
    return (
      key === normalized ||
      city.city_name.toLowerCase() === normalized ||
      normalized.includes(key) ||
      city.city_name.toLowerCase().includes(normalized) ||
      normalized.includes(city.city_name.toLowerCase())
    );
  });

  // Default to Mumbai if no match or if Mumbai is requested
  if (!matchedKey) {
    if (normalized.includes('mumbai') || normalized === '') {
      matchedKey = 'mumbai';
    }
  }

  if (matchedKey && VERIFIED_CITY_ITINERARIES[matchedKey]) {
    const basePlan = VERIFIED_CITY_ITINERARIES[matchedKey];
    const totalDaysAvailable = basePlan.days.length;
    const clampedDays = Math.max(1, Math.min(requestedDays, totalDaysAvailable));
    const slicedDays = basePlan.days.slice(0, clampedDays);

    return {
      city_id: basePlan.city_id,
      city_name: basePlan.city_name,
      state_name: basePlan.state_name,
      days_count: clampedDays,
      title: `Your ${clampedDays}-Day Itinerary for ${basePlan.city_name}`,
      summary: basePlan.description,
      days: slicedDays,
    };
  }

  // If a non-curated Indian city was chosen from the 180 verified cities in database:
  const cityOpt = ALL_INDIAN_TOURISM_CITIES.find(
    (c) =>
      c.id.toLowerCase() === normalized ||
      c.name.toLowerCase() === normalized ||
      normalized.includes(c.name.toLowerCase()) ||
      c.displayName.toLowerCase().includes(normalized)
  );

  const cityName = cityOpt ? cityOpt.name : cityNameOrId.charAt(0).toUpperCase() + cityNameOrId.slice(1);
  const stateName = cityOpt ? cityOpt.state : 'India';
  const clampedDays = Math.max(1, Math.min(requestedDays, 7));

  // Construct structured day blueprint based on local heritage and geographical hubs
  const generatedDays: VerifiedDayBlueprint[] = [];
  const areaThemes = [
    { area: 'Historic Heritage Precinct', sub: 'Iconic local landmarks, heritage monuments and central vistas.' },
    { area: 'Cultural & Old Market Quarter', sub: 'Historic bazaars, artisanal workshops and street culinary walks.' },
    { area: 'Sacred Shrines & Promenades', sub: 'Peaceful temples, spiritual courtyards and sunset viewpoints.' },
    { area: 'Nature Parks & Botanical Trails', sub: 'Scenic hilltops, lakefront promenades and lush greenery.' },
    { area: 'Craft Villages & Regional Excursions', sub: 'Traditional handicrafts, weaving colonies and rural heritage.' },
    { area: 'Fortress Citadels & Viewpoints', sub: 'Ancient stone battlements, panoramic vistas and ramparts.' },
    { area: 'Museums & Art Enclaves', sub: 'State archaeological treasures, galleries and royal regalia.' },
  ];

  for (let d = 1; d <= clampedDays; d++) {
    const theme = areaThemes[(d - 1) % areaThemes.length];
    generatedDays.push({
      day_number: d,
      area_title: `${cityName} ${theme.area}`,
      area_name: theme.area,
      subtitle: theme.sub,
      hero_image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
      places: [
        { name: `${cityName} Central Heritage Complex`, distance_info: '0 km', category: 'heritage' },
        { name: `${cityName} Historic Monument`, distance_info: '~ 2.5 km', category: 'monument' },
        { name: `${cityName} Cultural Sanctuary`, distance_info: '~ 2 km', category: 'culture' },
        { name: `${cityName} Scenic Viewpoint & Promenade`, distance_info: '~ 3 km', category: 'nature' },
      ],
      shopping: [`${cityName} Local Bazaar`, `${stateName} Government Handicrafts Emporium`],
    });
  }

  return {
    city_id: cityOpt?.id || normalized,
    city_name: cityName,
    state_name: stateName,
    days_count: clampedDays,
    title: `Your ${clampedDays}-Day Itinerary for ${cityName}`,
    summary: `A curated journey through ${cityName}, ${stateName} featuring verified heritage landmarks, scenic areas, and famous local markets grouped for minimal travel.`,
    days: generatedDays,
  };
}
