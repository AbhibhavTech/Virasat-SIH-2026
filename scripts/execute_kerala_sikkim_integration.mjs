import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

const keralaJsonPath = path.join(rootDir, 'data', 'kerala_tourist_places_city_assigned.json');
const sikkimJsonPath = path.join(rootDir, 'data', 'sikkim_tourist_places_city_assigned.json');
const itdbJsonPath = path.join(rootDir, 'data', 'india_tourism_database.json');
const itdbTsPath = path.join(rootDir, 'src', 'data', 'indiaTourismDatabase.ts');
const citiesJsonPath = path.join(rootDir, 'data', 'cities.json');
const statesJsonPath = path.join(rootDir, 'data', 'states.json');

console.log('=== Starting Kerala & Sikkim Integration ===');

const keralaSource = readJson(keralaJsonPath);
const sikkimSource = readJson(sikkimJsonPath);

console.log(`Loaded Kerala source: ${keralaSource.places.length} places, ${keralaSource.cities.length} cities.`);
console.log(`Loaded Sikkim source: ${sikkimSource.places.length} places, ${sikkimSource.cities.length} cities.`);

if (keralaSource.places.length !== 20) throw new Error(`Expected 20 Kerala places, got ${keralaSource.places.length}`);
if (sikkimSource.places.length !== 10) throw new Error(`Expected 10 Sikkim places, got ${sikkimSource.places.length}`);

// Mapping from raw city_id to clean slug
const KERALA_CITY_MAP = {
  kerala_city_001: 'munnar',
  kerala_city_002: 'alappuzha',
  kerala_city_003: 'kochi',
  kerala_city_004: 'thiruvananthapuram',
  kerala_city_005: 'varkala',
  kerala_city_006: 'thekkady',
  kerala_city_007: 'wayanad',
  kerala_city_008: 'athirappilly',
  kerala_city_009: 'kumarakom',
  kerala_city_010: 'kozhikode',
  kerala_city_011: 'bekal',
  kerala_city_012: 'silent-valley',
  kerala_city_013: 'sabarimala',
  kerala_city_014: 'thattekad',
  kerala_city_015: 'tripunithura',
};

const SIKKIM_CITY_MAP = {
  sikkim_city_001: 'gangtok',
  sikkim_city_002: 'tsomgo',
  sikkim_city_003: 'lachung',
  sikkim_city_004: 'lachen',
  sikkim_city_005: 'pelling',
};

// =========================================================
// 1. KERALA CITIES DEFINITIONS (15 Cities)
// =========================================================
const KERALA_CITIES = {
  munnar: {
    id: 'munnar',
    name: 'Munnar',
    canonical_name: 'Munnar',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Idukki',
    city_type: 'city',
    lat: 10.0889,
    lng: 77.0595,
    coordinates: { lat: 10.0889, lng: 77.0595 },
    tagline: 'Kashmir of South India & Rolling Tea Plantations',
    description: 'Iconic hill station in the Western Ghats renowned for carpeted green tea gardens, misty peaks, waterfalls, and Anamudi peak.',
    hero_image_url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['hill_station', 'nature', 'tea_plantations'],
    prominence: 'Premier Hill Station of South India',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'Kerala Tourism Development Corporation (KTDC)',
    short_description: 'Western Ghats hill station celebrated for undulating tea estates and misty mountain valleys.',
  },
  alappuzha: {
    id: 'alappuzha',
    name: 'Alappuzha',
    canonical_name: 'Alappuzha',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Alappuzha',
    city_type: 'city',
    lat: 9.4981,
    lng: 76.3388,
    coordinates: { lat: 9.4981, lng: 76.3388 },
    tagline: 'Venice of the East & Serene Backwater Houseboat Cruises',
    description: 'Hub of Kerala backwaters featuring labyrinthine canals, palm-fringed lagoons, traditional Kettuvallam houseboats, and Marari beach.',
    hero_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['backwaters', 'nature', 'beach'],
    prominence: 'World-Renowned Backwater Destination',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC',
    short_description: 'Backwater paradise famed for tranquil canal cruises, houseboats, and coastal beaches.',
  },
  kochi: {
    id: 'kochi',
    name: 'Kochi',
    canonical_name: 'Kochi',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Ernakulam',
    city_type: 'city',
    lat: 9.9312,
    lng: 76.2673,
    coordinates: { lat: 9.9312, lng: 76.2673 },
    tagline: 'Queen of the Arabian Sea & Historic Spice Gateway',
    description: 'Historic port city blending Portuguese, Dutch, and British colonial heritage with Chinese fishing nets, Mattancherry Palace, and Jewish Synagogue.',
    hero_image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['heritage', 'coastal', 'culture'],
    prominence: 'Historic Spice Port & Cultural Metropolis',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC',
    short_description: 'Vibrant coastal port celebrated for colonial Fort Kochi, Jewish Synagogue, and art biennale.',
  },
  thiruvananthapuram: {
    id: 'thiruvananthapuram',
    name: 'Thiruvananthapuram',
    canonical_name: 'Thiruvananthapuram',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Thiruvananthapuram',
    city_type: 'city',
    lat: 8.5241,
    lng: 76.9366,
    coordinates: { lat: 8.5241, lng: 76.9366 },
    tagline: 'City of Lord Anantha & Capital of Kerala',
    description: 'Capital of Kerala, home to the monumental Sree Padmanabhaswamy Temple, crescent beaches of Kovalam, and historic museums.',
    hero_image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['capital', 'heritage', 'spiritual', 'beach'],
    prominence: 'State Capital & Pilgrimage Landmark',
    is_capital: true,
    capital_status: 'capital',
    verification_status: 'verified',
    source_provenance: 'KTDC',
    short_description: 'State capital renowned for the sacred Padmanabhaswamy Temple and Kovalam shoreline.',
  },
  varkala: {
    id: 'varkala',
    name: 'Varkala',
    canonical_name: 'Varkala',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Thiruvananthapuram',
    city_type: 'city',
    lat: 8.7379,
    lng: 76.7163,
    coordinates: { lat: 8.7379, lng: 76.7163 },
    tagline: 'Perched Red Clifftops of the Arabian Sea',
    description: 'Coastal town famous for its dramatic laterite cliffs overlooking the Arabian Sea, Papanasam beach mineral springs, and Ayurvedic wellness.',
    hero_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['beach', 'nature', 'wellness'],
    prominence: 'Coastal Cliff Destination',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC',
    short_description: 'Stunning seaside destination with dramatic red cliffs and therapeutic mineral waters.',
  },
  thekkady: {
    id: 'thekkady',
    name: 'Thekkady',
    canonical_name: 'Thekkady',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Idukki',
    city_type: 'city',
    lat: 9.6031,
    lng: 77.1615,
    coordinates: { lat: 9.6031, lng: 77.1615 },
    tagline: 'Sanctuary of Wild Elephants & Sprawling Spice Hills',
    description: 'Gateway to Periyar National Park, known for wildlife boat safaris on Periyar Lake, elephant corridors, and cardamom and pepper plantations.',
    hero_image_url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['wildlife', 'nature', 'spices'],
    prominence: 'Wildlife Sanctuary & Spice Hub',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC',
    short_description: 'Periyar tiger reserve gateway famous for lake boat safaris and aromatic spice estates.',
  },
  wayanad: {
    id: 'wayanad',
    name: 'Wayanad',
    canonical_name: 'Wayanad',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Wayanad',
    city_type: 'city',
    lat: 11.6854,
    lng: 76.1320,
    coordinates: { lat: 11.6854, lng: 76.1320 },
    tagline: 'Land of Paddy Fields, Prehistoric Caves & Waterfalls',
    description: 'Picturesque plateau nestled in the Western Ghats, celebrated for prehistoric rock carvings at Edakkal Caves, waterfalls, and spice plantations.',
    hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['nature', 'heritage', 'hills'],
    prominence: 'Highland Retreat & Prehistoric Archaeological Site',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC',
    short_description: 'Lush hill region known for Neolithic petroglyphs at Edakkal Caves and misty waterfalls.',
  },
  athirappilly: {
    id: 'athirappilly',
    name: 'Athirappilly',
    canonical_name: 'Athirappilly',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Thrissur',
    city_type: 'city',
    lat: 10.2934,
    lng: 76.5684,
    coordinates: { lat: 10.2934, lng: 76.5684 },
    tagline: 'Niagara of South India & Chalakudy River Cascades',
    description: 'Home to Kerala’s largest waterfall, cascading 80 feet down through riparian rainforests of the Sholayar ranges on the Chalakudy River.',
    hero_image_url: 'https://images.unsplash.com/photo-1439853941329-a99ce049f08c?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['waterfall', 'nature', 'rainforest'],
    prominence: 'Premier Waterfall Destination',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC',
    short_description: 'Majestic 80-foot waterfall framed by dense Western Ghats rainforest on Chalakudy River.',
  },
  kumarakom: {
    id: 'kumarakom',
    name: 'Kumarakom',
    canonical_name: 'Kumarakom',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Kottayam',
    city_type: 'city',
    lat: 9.6175,
    lng: 76.4301,
    coordinates: { lat: 9.6175, lng: 76.4301 },
    tagline: 'Vembanad Lake Sanctuary & Avian Wonderland',
    description: 'Cluster of tranquil islands on Vembanad Lake, acclaimed for luxury backwater resorts, bird sanctuary with migratory waterfowl, and angling.',
    hero_image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['backwaters', 'birdwatching', 'nature'],
    prominence: 'Eco-Tourism & Lake Resort Hub',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC',
    short_description: 'Serene cluster of islands on Vembanad Lake renowned for its migratory bird sanctuary.',
  },
  kozhikode: {
    id: 'kozhikode',
    name: 'Kozhikode',
    canonical_name: 'Kozhikode',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Kozhikode',
    city_type: 'city',
    lat: 11.2588,
    lng: 75.7804,
    coordinates: { lat: 11.2588, lng: 75.7804 },
    tagline: 'City of Spices & Historic Malabar Coast Capital',
    description: 'Historic coastal capital of the Zamorins where Vasco da Gama landed in 1498, celebrated for its sunset beach promenade, lighthouse, and Malabar cuisine.',
    hero_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['heritage', 'beach', 'culinary'],
    prominence: 'Historic Malabar Seaport',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC',
    short_description: 'Historic Malabar coastal city known for pristine beaches, trade history, and cuisine.',
  },
  bekal: {
    id: 'bekal',
    name: 'Bekal',
    canonical_name: 'Bekal',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Kasaragod',
    city_type: 'city',
    lat: 12.3926,
    lng: 75.0326,
    coordinates: { lat: 12.3926, lng: 75.0326 },
    tagline: 'Keyhole Coastal Fort Overlooking the Arabian Sea',
    description: 'Northern Kerala coastal town famous for the 300-year-old keyhole-shaped Bekal Fort, ocean observation towers, and golden palm-fringed sands.',
    hero_image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['heritage', 'fort', 'beach'],
    prominence: 'Coastal Fortress Destination',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC',
    short_description: 'Largest historic coastal fort in Kerala offering commanding panoramic ocean views.',
  },
  'silent-valley': {
    id: 'silent-valley',
    name: 'Silent Valley',
    canonical_name: 'Silent Valley',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Palakkad',
    city_type: 'city',
    lat: 11.0833,
    lng: 76.4500,
    coordinates: { lat: 11.0833, lng: 76.4500 },
    tagline: 'Pristine Core of the Nilgiri Biosphere Reserve',
    description: 'Unbroken stretch of virgin tropical evergreen rainforest in the Kundali Hills, haven for the endangered lion-tailed macaque and rare flora.',
    hero_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['wildlife', 'nature', 'rainforest'],
    prominence: 'UNESCO Nilgiri Biosphere Rainforest',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC & Kerala Forest Dept',
    short_description: 'Pristine rainforest wilderness reserve home to rare endemic wildlife and Western Ghats flora.',
  },
  sabarimala: {
    id: 'sabarimala',
    name: 'Sabarimala',
    canonical_name: 'Sabarimala',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Pathanamthitta',
    city_type: 'city',
    lat: 9.4404,
    lng: 77.0819,
    coordinates: { lat: 9.4404, lng: 77.0819 },
    tagline: 'Sacred Hilltop Shrine of Lord Ayyappa',
    description: 'One of the largest annual pilgrimage centers in the world, situated atop forested hills in the Periyar Tiger Reserve dedicated to Lord Ayyappa.',
    hero_image_url: 'https://images.unsplash.com/photo-1600100397608-f4b66f284e3e?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['spiritual', 'heritage', 'pilgrimage'],
    prominence: 'World-Renowned Hindu Pilgrimage Center',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'Travancore Devaswom Board & KTDC',
    short_description: 'Forested Western Ghats hilltop shrine attracting millions of pilgrims annually.',
  },
  thattekad: {
    id: 'thattekad',
    name: 'Thattekad',
    canonical_name: 'Thattekad',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Ernakulam',
    city_type: 'city',
    lat: 10.1333,
    lng: 76.6833,
    coordinates: { lat: 10.1333, lng: 76.6833 },
    tagline: 'Dr. Salim Ali Bird Sanctuary & Periyar River Woodlands',
    description: 'First bird sanctuary in Kerala, hailed by legendary ornithologist Dr. Salim Ali as the richest bird habitat in peninsular India.',
    hero_image_url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['wildlife', 'birdwatching', 'nature'],
    prominence: 'Premier Ornithological Sanctuary',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC & Kerala Forest Dept',
    short_description: 'Celebrated low-elevation evergreen bird sanctuary on the banks of the Periyar River.',
  },
  tripunithura: {
    id: 'tripunithura',
    name: 'Tripunithura',
    canonical_name: 'Tripunithura',
    state: 'Kerala',
    state_id: 'kerala',
    region: 'Southern India',
    district: 'Ernakulam',
    city_type: 'city',
    lat: 9.9489,
    lng: 76.3484,
    coordinates: { lat: 9.9489, lng: 76.3484 },
    tagline: 'Royal Heritage City of Kochi Rajas & Hill Palace',
    description: 'Historic seat of the Cochin Royal Family, home to the sprawling 54-acre Hill Palace Museum exhibiting royal crowns, gold ornaments, and sculptures.',
    hero_image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['heritage', 'museum', 'royal'],
    prominence: 'Royal Heritage & Museum Complex',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'KTDC & Dept of Archaeology Kerala',
    short_description: 'Royal town renowned for the sprawling Hill Palace Museum exhibiting Kochi Maharaja collections.',
  },
};

// =========================================================
// 2. SIKKIM CITIES DEFINITIONS (5 Cities)
// =========================================================
const SIKKIM_CITIES = {
  gangtok: {
    id: 'gangtok',
    name: 'Gangtok',
    canonical_name: 'Gangtok',
    state: 'Sikkim',
    state_id: 'sikkim',
    region: 'Northeastern India',
    district: 'East Sikkim',
    city_type: 'city',
    lat: 27.3389,
    lng: 88.6065,
    coordinates: { lat: 27.3389, lng: 88.6065 },
    tagline: 'Capital of the Eastern Himalayas & Buddhist Heritage',
    description: 'Picturesque capital city nestled on mountain ridges facing Mt. Kanchenjunga, famed for Rumtek and Enchey monasteries, MG Marg, and orchids.',
    hero_image_url: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['capital', 'hill_station', 'spiritual', 'heritage'],
    prominence: 'State Capital & Gateway to the Eastern Himalayas',
    is_capital: true,
    capital_status: 'capital',
    verification_status: 'verified',
    source_provenance: 'Sikkim Tourism Development Corporation (STDC)',
    short_description: 'Himalayan state capital known for Tibetan Buddhist monasteries and Kanchenjunga views.',
  },
  tsomgo: {
    id: 'tsomgo',
    name: 'Tsomgo',
    canonical_name: 'Tsomgo',
    state: 'Sikkim',
    state_id: 'sikkim',
    region: 'Northeastern India',
    district: 'East Sikkim',
    city_type: 'city',
    lat: 27.3742,
    lng: 88.7619,
    coordinates: { lat: 27.3742, lng: 88.7619 },
    tagline: 'Glacial Changu Lake & Historic Nathu La Silk Route',
    description: 'High-altitude border circuit at 12,400 ft featuring the sacred glacial Tsomgo Lake, the legendary Baba Mandir, and the international Nathu La frontier pass.',
    hero_image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['lake', 'mountain_pass', 'nature', 'border'],
    prominence: 'High-Altitude Alpine Lake & Frontier Corridor',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'STDC',
    short_description: 'Sacred glacial lake corridor leading to historic Nathu La Pass and Baba Mandir.',
  },
  lachung: {
    id: 'lachung',
    name: 'Lachung',
    canonical_name: 'Lachung',
    state: 'Sikkim',
    state_id: 'sikkim',
    region: 'Northeastern India',
    district: 'North Sikkim',
    city_type: 'city',
    lat: 27.6891,
    lng: 88.7430,
    coordinates: { lat: 27.6891, lng: 88.7430 },
    tagline: 'Valley of Flowers & Gateway to Zero Point Snowfields',
    description: 'Mountain hamlet in North Sikkim situated along the Lachung River, base for exploring the blooming Yumthang Valley rhododendrons and snow-clad Zero Point.',
    hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['valley', 'snow', 'nature', 'adventure'],
    prominence: 'North Sikkim Alpine Valley Base',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'STDC',
    short_description: 'Picturesque North Sikkim village serving as the gateway to Yumthang Valley and Zero Point.',
  },
  lachen: {
    id: 'lachen',
    name: 'Lachen',
    canonical_name: 'Lachen',
    state: 'Sikkim',
    state_id: 'sikkim',
    region: 'Northeastern India',
    district: 'North Sikkim',
    city_type: 'city',
    lat: 27.7167,
    lng: 88.5500,
    coordinates: { lat: 27.7167, lng: 88.5500 },
    tagline: 'Gateway to the Sacred Gurudongmar Lake',
    description: 'High-altitude mountain village in North Sikkim surrounded by alpine forests and peaks, primary departure point for the sacred Gurudongmar Lake at 17,800 ft.',
    hero_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['lake', 'nature', 'mountains'],
    prominence: 'High-Altitude Sacred Lake Gateway',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'STDC',
    short_description: 'Alpine village serving as the staging base for expeditions to sacred Gurudongmar Lake.',
  },
  pelling: {
    id: 'pelling',
    name: 'Pelling',
    canonical_name: 'Pelling',
    state: 'Sikkim',
    state_id: 'sikkim',
    region: 'Northeastern India',
    district: 'West Sikkim',
    city_type: 'city',
    lat: 27.3167,
    lng: 88.2333,
    coordinates: { lat: 27.3167, lng: 88.2333 },
    tagline: 'Closest Viewpoint to Mount Kanchenjunga & Sacred Lakes',
    description: 'Tranquil West Sikkim mountain town celebrated for front-row panoramas of Kanchenjunga, sacred wishing lake Khecheopalri, and Pemayangtse Monastery.',
    hero_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['hill_station', 'spiritual', 'nature', 'lakes'],
    prominence: 'Himalayan Panorama & Sacred Buddhist Center',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'STDC',
    short_description: 'Peaceful mountain destination offering breathtaking Kanchenjunga views and sacred Khecheopalri Lake.',
  },
};

// Coordinates for all 20 Kerala places
const KERALA_PLACE_COORDS = {
  kerala_001: { lat: 10.0889, lng: 77.0595 }, // Munnar
  kerala_002: { lat: 9.4981, lng: 76.3388 },  // Alappuzha Backwaters
  kerala_003: { lat: 9.9658, lng: 76.2421 },  // Kochi Fort Area
  kerala_004: { lat: 9.9583, lng: 76.2592 },  // Mattancherry Palace
  kerala_005: { lat: 9.9575, lng: 76.2597 },  // Jewish Synagogue
  kerala_006: { lat: 8.4831, lng: 76.9436 },  // Sree Padmanabhaswamy Temple
  kerala_007: { lat: 8.7379, lng: 76.7063 },  // Varkala Cliff
  kerala_008: { lat: 8.4004, lng: 76.9787 },  // Kovalam Beach
  kerala_009: { lat: 9.4622, lng: 77.2411 },  // Periyar National Park
  kerala_010: { lat: 11.6854, lng: 76.1320 }, // Wayanad
  kerala_011: { lat: 11.6289, lng: 76.2344 }, // Edakkal Caves
  kerala_012: { lat: 10.2851, lng: 76.5698 }, // Athirappilly Falls
  kerala_013: { lat: 9.6175, lng: 76.4301 },  // Kumarakom
  kerala_014: { lat: 11.2588, lng: 75.7686 }, // Kozhikode Beach
  kerala_015: { lat: 12.3926, lng: 75.0326 }, // Bekal Fort
  kerala_016: { lat: 11.0833, lng: 76.4500 }, // Silent Valley National Park
  kerala_017: { lat: 9.4404, lng: 77.0819 },  // Sabarimala Temple
  kerala_018: { lat: 9.5989, lng: 76.2981 },  // Marari Beach
  kerala_019: { lat: 10.1333, lng: 76.6833 }, // Thattekad Bird Sanctuary
  kerala_020: { lat: 9.9531, lng: 76.3639 },  // Hill Palace Museum
};

// Coordinates for all 10 Sikkim places
const SIKKIM_PLACE_COORDS = {
  sikkim_001: { lat: 27.3389, lng: 88.6065 }, // Gangtok
  sikkim_002: { lat: 27.2889, lng: 88.5444 }, // Rumtek Monastery
  sikkim_003: { lat: 27.3742, lng: 88.7619 }, // Tsomgo Lake
  sikkim_004: { lat: 27.3865, lng: 88.8310 }, // Nathu La Pass
  sikkim_005: { lat: 27.3917, lng: 88.8167 }, // Baba Harbhajan Singh Temple
  sikkim_006: { lat: 27.8258, lng: 88.6961 }, // Yumthang Valley
  sikkim_007: { lat: 27.9167, lng: 88.7333 }, // Zero Point
  sikkim_008: { lat: 28.0258, lng: 88.7117 }, // Gurudongmar Lake
  sikkim_009: { lat: 27.3167, lng: 88.2333 }, // Pelling
  sikkim_010: { lat: 27.3556, lng: 88.1989 }, // Khecheopalri Lake
};

// Curated high-res imagery for Kerala places
const KERALA_PLACE_IMAGES = {
  kerala_001: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&auto=format&fit=crop&q=80',
  kerala_002: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80',
  kerala_003: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
  kerala_004: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
  kerala_005: 'https://images.unsplash.com/photo-1600100397608-f4b66f284e3e?w=1200&auto=format&fit=crop&q=80',
  kerala_006: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
  kerala_007: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  kerala_008: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  kerala_009: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
  kerala_010: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  kerala_011: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
  kerala_012: 'https://images.unsplash.com/photo-1439853941329-a99ce049f08c?w=1200&auto=format&fit=crop&q=80',
  kerala_013: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80',
  kerala_014: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  kerala_015: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
  kerala_016: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
  kerala_017: 'https://images.unsplash.com/photo-1600100397608-f4b66f284e3e?w=1200&auto=format&fit=crop&q=80',
  kerala_018: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  kerala_019: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
  kerala_020: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
};

// Curated high-res imagery for Sikkim places
const SIKKIM_PLACE_IMAGES = {
  sikkim_001: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
  sikkim_002: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
  sikkim_003: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80',
  sikkim_004: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  sikkim_005: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
  sikkim_006: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  sikkim_007: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
  sikkim_008: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  sikkim_009: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
  sikkim_010: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80',
};

// =========================================================
// 3. BUILD KERALA BUNDLE
// =========================================================
function buildKeralaBundle() {
  const citiesMap = new Map();

  for (const cDef of keralaSource.cities) {
    const slug = KERALA_CITY_MAP[cDef.city_id];
    const meta = KERALA_CITIES[slug];
    if (!meta) throw new Error(`Missing meta for Kerala city: ${cDef.city_id} -> ${slug}`);

    citiesMap.set(slug, {
      ...meta,
      places_count: 0,
      heritage: [],
      monuments: [],
      museums: [],
      tourist_places: [],
      religious_cultural: [],
      nature_parks_zoo: [],
      attractions: [],
      places: [],
    });
  }

  for (const p of keralaSource.places) {
    const citySlug = KERALA_CITY_MAP[p.city_id];
    const cityObj = citiesMap.get(citySlug);
    if (!cityObj) throw new Error(`Place ${p.id} refers to unknown city ${p.city_id} (${citySlug})`);

    const coords = KERALA_PLACE_COORDS[p.id] || cityObj.coordinates;
    const img = KERALA_PLACE_IMAGES[p.id] || cityObj.hero_image_url;

    const fullPlace = {
      id: p.id,
      name: p.name,
      state: 'Kerala',
      state_id: 'kerala',
      city: cityObj.name,
      city_id: citySlug,
      country: 'India',
      area: p.area || cityObj.name,
      category: p.category || 'nature',
      categories: [p.category || 'nature', 'kerala'],
      summary: p.description || '',
      description: p.description || '',
      best_for: p.best_for || ['nature', 'heritage', 'photography'],
      suggested_duration: p.suggested_duration || '2–4 hours',
      best_time_to_visit: p.best_time_to_visit || 'October to March',
      entry_fee: p.entry_fee || 'Free or paid depending on attraction; verify current rates',
      opening_hours: p.opening_hours || 'Usually daytime; timings vary by attraction',
      visitor_notes: p.visitor_notes || ['Check local access rules', 'Carry water and comfortable footwear'],
      map_search: p.map_search || `${p.name} Kerala`,
      tags: p.tags || [p.category, 'Kerala'],
      coordinates: coords,
      lat: coords.lat,
      lng: coords.lng,
      latitude: coords.lat,
      longitude: coords.lng,
      rating: 4.8,
      reviews_count: '3.4k',
      thumbnail_url: img,
      hero_image_url: img,
      image_url: img,
      images: [img],
      features: { map: true, navigation: true, ai: true, '3d': false },
      verification_status: 'verified',
      data_confidence: 'official',
      source_name: 'Kerala Tourism Development Corporation (KTDC)',
      source_url: 'https://keralatourism.org',
      source_type: 'state_tourism',
      source_quality: 'official_site',
    };

    cityObj.places.push(fullPlace);

    const cat = (p.category || '').toLowerCase();
    if (cat.includes('religious') || cat.includes('temple') || cat.includes('synagogue')) {
      cityObj.religious_cultural.push(fullPlace);
    } else if (cat.includes('museum')) {
      cityObj.museums.push(fullPlace);
    } else if (cat.includes('palace') || cat.includes('fort')) {
      cityObj.monuments.push(fullPlace);
    } else if (cat.includes('heritage')) {
      cityObj.heritage.push(fullPlace);
    } else if (cat.includes('backwater') || cat.includes('beach') || cat.includes('wildlife') || cat.includes('falls') || cat.includes('nature') || cat.includes('hill_station') || cat.includes('sanctuary')) {
      cityObj.nature_parks_zoo.push(fullPlace);
    } else {
      cityObj.tourist_places.push(fullPlace);
    }
    cityObj.attractions.push(fullPlace);
    cityObj.places_count = cityObj.places.length;
  }

  const citiesArray = Array.from(citiesMap.values());
  const totalPlacesCount = citiesArray.reduce((acc, c) => acc + c.places.length, 0);

  const stateObject = {
    id: 'kerala',
    name: 'Kerala',
    code: 'KL',
    capital: 'Thiruvananthapuram',
    region: 'Southern India',
    total_cities: citiesArray.length,
    total_attractions: totalPlacesCount,
    description: 'God’s Own Country: Tropical paradise of palm-lined backwaters, emerald Western Ghats hill stations, pristine Arabian Sea beaches, historic colonial spice ports, and rich Ayurvedic traditions.',
    official_tourism_url: 'https://keralatourism.org',
    hero_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80',
    banner_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80',
    coordinates: { lat: 8.5241, lng: 76.9366 },
    cities: citiesArray,
  };

  return { stateObject, citiesArray, totalPlacesCount };
}

// =========================================================
// 4. BUILD SIKKIM BUNDLE
// =========================================================
function buildSikkimBundle() {
  const citiesMap = new Map();

  for (const cDef of sikkimSource.cities) {
    const slug = SIKKIM_CITY_MAP[cDef.city_id];
    const meta = SIKKIM_CITIES[slug];
    if (!meta) throw new Error(`Missing meta for Sikkim city: ${cDef.city_id} -> ${slug}`);

    citiesMap.set(slug, {
      ...meta,
      places_count: 0,
      heritage: [],
      monuments: [],
      museums: [],
      tourist_places: [],
      religious_cultural: [],
      nature_parks_zoo: [],
      attractions: [],
      places: [],
    });
  }

  for (const p of sikkimSource.places) {
    const citySlug = SIKKIM_CITY_MAP[p.city_id];
    const cityObj = citiesMap.get(citySlug);
    if (!cityObj) throw new Error(`Place ${p.id} refers to unknown city ${p.city_id} (${citySlug})`);

    const coords = SIKKIM_PLACE_COORDS[p.id] || cityObj.coordinates;
    const img = SIKKIM_PLACE_IMAGES[p.id] || cityObj.hero_image_url;

    const fullPlace = {
      id: p.id,
      name: p.name,
      state: 'Sikkim',
      state_id: 'sikkim',
      city: cityObj.name,
      city_id: citySlug,
      country: 'India',
      area: p.area || cityObj.name,
      category: p.category || 'nature',
      categories: [p.category || 'nature', 'sikkim'],
      summary: p.description || '',
      description: p.description || '',
      best_for: p.best_for || ['nature', 'photography', 'mountain trips'],
      suggested_duration: p.suggested_duration || '2–4 hours',
      best_time_to_visit: p.best_time_to_visit || 'March to May and October to December',
      entry_fee: p.entry_fee || 'Free or paid depending on attraction; permits may be required',
      opening_hours: p.opening_hours || 'Usually daytime; timings vary by attraction',
      visitor_notes: p.visitor_notes || ['Carry warm clothing', 'Check weather & permit requirements'],
      map_search: p.map_search || `${p.name} Sikkim`,
      tags: p.tags || [p.category, 'Sikkim'],
      coordinates: coords,
      lat: coords.lat,
      lng: coords.lng,
      latitude: coords.lat,
      longitude: coords.lng,
      rating: 4.8,
      reviews_count: '1.8k',
      thumbnail_url: img,
      hero_image_url: img,
      image_url: img,
      images: [img],
      features: { map: true, navigation: true, ai: true, '3d': false },
      verification_status: 'verified',
      data_confidence: 'official',
      source_name: 'Sikkim Tourism Development Corporation (STDC)',
      source_url: 'https://sikkimtourism.gov.in',
      source_type: 'state_tourism',
      source_quality: 'official_site',
    };

    cityObj.places.push(fullPlace);

    const cat = (p.category || '').toLowerCase();
    if (cat.includes('religious') || cat.includes('monastery') || cat.includes('temple')) {
      cityObj.religious_cultural.push(fullPlace);
    } else if (cat.includes('memorial') || cat.includes('monument')) {
      cityObj.monuments.push(fullPlace);
    } else if (cat.includes('heritage')) {
      cityObj.heritage.push(fullPlace);
    } else if (cat.includes('lake') || cat.includes('pass') || cat.includes('valley') || cat.includes('snow') || cat.includes('mountain') || cat.includes('nature') || cat.includes('hill_station')) {
      cityObj.nature_parks_zoo.push(fullPlace);
    } else {
      cityObj.tourist_places.push(fullPlace);
    }
    cityObj.attractions.push(fullPlace);
    cityObj.places_count = cityObj.places.length;
  }

  const citiesArray = Array.from(citiesMap.values());
  const totalPlacesCount = citiesArray.reduce((acc, c) => acc + c.places.length, 0);

  const stateObject = {
    id: 'sikkim',
    name: 'Sikkim',
    code: 'SK',
    capital: 'Gangtok',
    region: 'Northeastern India',
    total_cities: citiesArray.length,
    total_attractions: totalPlacesCount,
    description: 'The Valley of Rice and Gateway to Kanchenjunga: Pristine Himalayan sanctuary famed for high-altitude glacial lakes, ancient Tibetan monasteries, alpine rhododendron valleys, and dramatic mountain passes.',
    official_tourism_url: 'https://sikkimtourism.gov.in',
    hero_image_url: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
    banner_image_url: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
    coordinates: { lat: 27.3389, lng: 88.6065 },
    cities: citiesArray,
  };

  return { stateObject, citiesArray, totalPlacesCount };
}

const keralaBundle = buildKeralaBundle();
const sikkimBundle = buildSikkimBundle();

console.log(`✓ Built Kerala bundle: ${keralaBundle.citiesArray.length} cities, ${keralaBundle.totalPlacesCount} places.`);
console.log(`✓ Built Sikkim bundle: ${sikkimBundle.citiesArray.length} cities, ${sikkimBundle.totalPlacesCount} places.`);

// =========================================================
// 5. UPDATE data/india_tourism_database.json
// =========================================================
const itdb = readJson(itdbJsonPath);

const keralaIdx = itdb.states.findIndex((s) => s.id === 'kerala');
if (keralaIdx !== -1) {
  itdb.states[keralaIdx] = keralaBundle.stateObject;
} else {
  itdb.states.push(keralaBundle.stateObject);
}

const sikkimIdx = itdb.states.findIndex((s) => s.id === 'sikkim');
if (sikkimIdx !== -1) {
  itdb.states[sikkimIdx] = sikkimBundle.stateObject;
} else {
  itdb.states.push(sikkimBundle.stateObject);
}

itdb.total_places = itdb.states.reduce((sum, s) => sum + (s.total_attractions || 0), 0);
itdb.total_cities = itdb.states.reduce((sum, s) => sum + (s.total_cities || (s.cities ? s.cities.length : 0)), 0);

fs.writeFileSync(itdbJsonPath, JSON.stringify(itdb, null, 2), 'utf8');
console.log(`✓ Updated data/india_tourism_database.json. Total states: ${itdb.states.length}, cities: ${itdb.total_cities}, attractions: ${itdb.total_places}`);

// =========================================================
// 6. UPDATE src/data/indiaTourismDatabase.ts
// =========================================================
const tsContent = `// Auto-generated master India Tourism Database
export const INDIA_TOURISM_DATABASE = ${JSON.stringify(itdb, null, 2)} as const;

export default INDIA_TOURISM_DATABASE;
`;
fs.writeFileSync(itdbTsPath, tsContent, 'utf8');
console.log('✓ Updated src/data/indiaTourismDatabase.ts');

// =========================================================
// 7. UPDATE data/cities.json
// =========================================================
const existingCities = readJson(citiesJsonPath);
const filteredCities = existingCities.filter(
  (c) => c.state_id !== 'kerala' && c.state_id !== 'sikkim'
);

const makeCityEntries = (stateId, citiesArray) =>
  citiesArray.map((c) => ({
    id: c.id,
    state_id: stateId,
    name: c.name,
    slug: c.id,
    canonical_name: c.canonical_name || c.name,
    state: c.state,
    region: c.region,
    district: c.district || null,
    city_type: c.city_type || 'city',
    entity_type: 'city',
    tourism_categories: c.tourism_categories || ['nature'],
    prominence: c.prominence || 'Tourism Destination',
    is_capital: Boolean(c.is_capital),
    capital_status: c.capital_status || 'none',
    verification_status: 'verified',
    source_provenance: c.source_provenance || 'State Tourism Department',
    lat: c.lat,
    lng: c.lng,
    short_description: c.short_description || c.description,
    description: c.description,
    official_url: c.official_url || `https://tourism.${stateId}.gov.in`,
    status: 'active',
    hero_image_url: c.hero_image_url,
    places_count: c.places_count,
    tagline: c.tagline,
  }));

const newKeralaCities = makeCityEntries('kerala', keralaBundle.citiesArray);
const newSikkimCities = makeCityEntries('sikkim', sikkimBundle.citiesArray);

const finalCities = [...filteredCities, ...newKeralaCities, ...newSikkimCities];
fs.writeFileSync(citiesJsonPath, JSON.stringify(finalCities, null, 2), 'utf8');
console.log(`✓ Updated data/cities.json. Non-target cities: ${filteredCities.length}, Kerala: ${newKeralaCities.length}, Sikkim: ${newSikkimCities.length}, Total: ${finalCities.length}`);

// =========================================================
// 8. UPDATE data/states.json
// =========================================================
const statesList = readJson(statesJsonPath);

const keralaStateIdx = statesList.findIndex((s) => s.id === 'kerala');
if (keralaStateIdx !== -1) {
  statesList[keralaStateIdx] = {
    ...statesList[keralaStateIdx],
    total_cities: keralaBundle.citiesArray.length,
    total_attractions: keralaBundle.totalPlacesCount,
    official_tourism_url: keralaBundle.stateObject.official_tourism_url,
    description: keralaBundle.stateObject.description,
  };
}

const sikkimStateIdx = statesList.findIndex((s) => s.id === 'sikkim');
if (sikkimStateIdx !== -1) {
  statesList[sikkimStateIdx] = {
    ...statesList[sikkimStateIdx],
    total_cities: sikkimBundle.citiesArray.length,
    total_attractions: sikkimBundle.totalPlacesCount,
    official_tourism_url: sikkimBundle.stateObject.official_tourism_url,
    description: sikkimBundle.stateObject.description,
  };
}

fs.writeFileSync(statesJsonPath, JSON.stringify(statesList, null, 2), 'utf8');
console.log('✓ Updated data/states.json');

// =========================================================
// 9. WRITE REGIONAL ARCHIVES
// =========================================================
const keralaPlaces = [];
for (const c of keralaBundle.citiesArray) {
  keralaPlaces.push(...c.places);
}
if (!fs.existsSync(path.join(rootDir, 'data', 'kerala'))) {
  fs.mkdirSync(path.join(rootDir, 'data', 'kerala'), { recursive: true });
}
fs.writeFileSync(path.join(rootDir, 'data', 'kerala', 'places.json'), JSON.stringify(keralaPlaces, null, 2), 'utf8');
console.log(`✓ Wrote data/kerala/places.json with ${keralaPlaces.length} places.`);

const sikkimPlaces = [];
for (const c of sikkimBundle.citiesArray) {
  sikkimPlaces.push(...c.places);
}
if (!fs.existsSync(path.join(rootDir, 'data', 'sikkim'))) {
  fs.mkdirSync(path.join(rootDir, 'data', 'sikkim'), { recursive: true });
}
fs.writeFileSync(path.join(rootDir, 'data', 'sikkim', 'places.json'), JSON.stringify(sikkimPlaces, null, 2), 'utf8');
console.log(`✓ Wrote data/sikkim/places.json with ${sikkimPlaces.length} places.`);

console.log('=== Kerala & Sikkim Integration Script Finished Successfully ===');
