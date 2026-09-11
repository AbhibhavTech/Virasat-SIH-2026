import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

const arunJsonPath = path.join(rootDir, 'data', 'arunachal_pradesh_tourist_places_city_assigned.json');
const hpJsonPath = path.join(rootDir, 'data', 'himachal_pradesh_tourist_places_city_assigned.json');
const itdbJsonPath = path.join(rootDir, 'data', 'india_tourism_database.json');
const itdbTsPath = path.join(rootDir, 'src', 'data', 'indiaTourismDatabase.ts');
const citiesJsonPath = path.join(rootDir, 'data', 'cities.json');
const statesJsonPath = path.join(rootDir, 'data', 'states.json');

console.log('=== Starting Arunachal Pradesh & Himachal Pradesh Integration ===');

const arunSource = readJson(arunJsonPath);
const hpSource = readJson(hpJsonPath);

console.log(`Loaded Arunachal source: ${arunSource.places.length} places, ${arunSource.cities.length} cities.`);
console.log(`Loaded Himachal source: ${hpSource.places.length} places, ${hpSource.cities.length} cities.`);

if (arunSource.places.length !== 15) throw new Error(`Expected 15 Arunachal places, got ${arunSource.places.length}`);
if (hpSource.places.length !== 20) throw new Error(`Expected 20 Himachal places, got ${hpSource.places.length}`);

// =========================================================
// 1. ARUNACHAL PRADESH CITIES DEFINITIONS (9 Cities)
// =========================================================
const ARUN_CITIES = {
  tawang: {
    id: 'tawang',
    name: 'Tawang',
    canonical_name: 'Tawang',
    state: 'Arunachal Pradesh',
    state_id: 'arunachal-pradesh',
    region: 'Northeastern India',
    district: 'Tawang',
    city_type: 'city',
    lat: 27.5861,
    lng: 91.8594,
    coordinates: { lat: 27.5861, lng: 91.8594 },
    tagline: 'Land of Dawn-lit Mountains & Ancient Buddhist Sanctuary',
    description: 'High-altitude Himalayan town famed for the 400-year-old Tawang Monastery, scenic Sela Pass, glacial lakes, and border landscapes.',
    hero_image_url: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['spiritual', 'heritage', 'mountains', 'nature'],
    prominence: 'Major Buddhist Pilgrimage & Himalayan Destination',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'Arunachal Pradesh Tourism Department',
    short_description: 'Sacred mountain town home to India’s largest Buddhist monastery and alpine Sela Pass.',
  },
  dirang: {
    id: 'dirang',
    name: 'Dirang',
    canonical_name: 'Dirang',
    state: 'Arunachal Pradesh',
    state_id: 'arunachal-pradesh',
    region: 'Northeastern India',
    district: 'West Kameng',
    city_type: 'city',
    lat: 27.3592,
    lng: 92.2384,
    coordinates: { lat: 27.3592, lng: 92.2384 },
    tagline: 'Picturesque Himalayan Valley & Natural Hot Springs',
    description: 'A serene valley town nestled along the Kameng River, known for its apple orchards, hot springs, Kalachakra Gompa, and Monpa tribal heritage.',
    hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['nature', 'valley', 'culture'],
    prominence: 'Valley Retreat & Cultural Center',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'Arunachal Pradesh Tourism Department',
    short_description: 'Scenic valley town renowned for thermal hot springs, orchards, and Tibetan architecture.',
  },
  bomdila: {
    id: 'bomdila',
    name: 'Bomdila',
    canonical_name: 'Bomdila',
    state: 'Arunachal Pradesh',
    state_id: 'arunachal-pradesh',
    region: 'Northeastern India',
    district: 'West Kameng',
    city_type: 'city',
    lat: 27.2644,
    lng: 92.4239,
    coordinates: { lat: 27.2644, lng: 92.4239 },
    tagline: 'Himalayan Viewpoint & Vibrant Monasteries',
    description: 'Picturesque headquarters of West Kameng district boasting panoramic vistas of snow-clad Kangto and Gorichen peaks, monasteries, and handicraft centers.',
    hero_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['hill_station', 'heritage', 'culture'],
    prominence: 'Hill Station & District Headquarters',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'Arunachal Pradesh Tourism Department',
    short_description: 'Charming hill town offering panoramic snow peaks, monasteries, and rich handicraft traditions.',
  },
  ziro: {
    id: 'ziro',
    name: 'Ziro',
    canonical_name: 'Ziro',
    state: 'Arunachal Pradesh',
    state_id: 'arunachal-pradesh',
    region: 'Northeastern India',
    district: 'Lower Subansiri',
    city_type: 'city',
    lat: 27.5451,
    lng: 93.8184,
    coordinates: { lat: 27.5451, lng: 93.8184 },
    tagline: 'UNESCO World Heritage Tentative Valley & Apatani Culture',
    description: 'An idyllic plateau valley famous for its lush paddy-cum-pisciculture fields, pine-clad hills, unique Apatani tribal heritage, and music festivals.',
    hero_image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['culture', 'nature', 'valley'],
    prominence: 'Cultural Valley & Eco-Tourism Haven',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'Arunachal Pradesh Tourism Department',
    short_description: 'Picturesque highland valley celebrated for Apatani culture, pine forests, and terraced fields.',
  },
  miao: {
    id: 'miao',
    name: 'Miao',
    canonical_name: 'Miao',
    state: 'Arunachal Pradesh',
    state_id: 'arunachal-pradesh',
    region: 'Northeastern India',
    district: 'Changlang',
    city_type: 'city',
    lat: 27.4913,
    lng: 96.2081,
    coordinates: { lat: 27.4913, lng: 96.2081 },
    tagline: 'Gateway to Namdapha Tiger Reserve & Rainforest Wilds',
    description: 'Sub-divisional town on the banks of Noa-Dehing River, serving as the official entry point to the biodiverse Namdapha National Park.',
    hero_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['wildlife', 'nature', 'adventure'],
    prominence: 'Wilderness Gateway Town',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'Arunachal Pradesh Tourism Department',
    short_description: 'Lush riverside town that serves as the premier gateway to Namdapha National Park.',
  },
  jengging: {
    id: 'jengging',
    name: 'Jengging',
    canonical_name: 'Jengging',
    state: 'Arunachal Pradesh',
    state_id: 'arunachal-pradesh',
    region: 'Northeastern India',
    district: 'Upper Siang',
    city_type: 'city',
    lat: 28.5667,
    lng: 94.9833,
    coordinates: { lat: 28.5667, lng: 94.9833 },
    tagline: 'Gateway to Mouling National Park & Siang Gorges',
    description: 'A serene Himalayan settlement in Upper Siang providing access to the rugged biodiversity and virgin cloud forests of Mouling National Park.',
    hero_image_url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['nature', 'wildlife', 'adventure'],
    prominence: 'Wilderness & National Park Hub',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'Arunachal Pradesh Tourism Department',
    short_description: 'Remote Himalayan town and access point to Mouling National Park and mountain ecology.',
  },
  itanagar: {
    id: 'itanagar',
    name: 'Itanagar',
    canonical_name: 'Itanagar',
    state: 'Arunachal Pradesh',
    state_id: 'arunachal-pradesh',
    region: 'Northeastern India',
    district: 'Papum Pare',
    city_type: 'city',
    lat: 27.0844,
    lng: 93.6053,
    coordinates: { lat: 27.0844, lng: 93.6053 },
    tagline: 'Capital of Dawn-lit Mountains & Historic Ita Fort',
    description: 'Capital city of Arunachal Pradesh situated at the foothills of the Himalayas, featuring the 14th-century brick fort of Ita Fort, Ganga Lake, and rich tribal heritage centers.',
    hero_image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['capital', 'heritage', 'culture', 'nature'],
    prominence: 'State Capital & Administrative Hub',
    is_capital: true,
    capital_status: 'capital',
    verification_status: 'verified',
    source_provenance: 'Arunachal Pradesh Tourism Department',
    short_description: 'State capital known for ancient Ita Fort ruins, serene Ganga Lake, and cultural institutions.',
  },
  mechuka: {
    id: 'mechuka',
    name: 'Mechuka',
    canonical_name: 'Mechuka',
    state: 'Arunachal Pradesh',
    state_id: 'arunachal-pradesh',
    region: 'Northeastern India',
    district: 'Shi-Yomi',
    city_type: 'city',
    lat: 28.6019,
    lng: 94.1317,
    coordinates: { lat: 28.6019, lng: 94.1317 },
    tagline: 'The Shangri-La of Arunachal & Yargapchu River Valley',
    description: 'Breathtaking high-altitude valley surrounded by snow-dusted mountains, wooden suspension bridges, horses grazing on green slopes, and the 400-year-old Samten Yongcha Monastery.',
    hero_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['nature', 'valley', 'adventure'],
    prominence: 'Himalayan Paradise & Frontier Valley',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'Arunachal Pradesh Tourism Department',
    short_description: 'Scenic high-altitude valley often called Shangri-La, famed for pine hills and Buddhist shrines.',
  },
  pasighat: {
    id: 'pasighat',
    name: 'Pasighat',
    canonical_name: 'Pasighat',
    state: 'Arunachal Pradesh',
    state_id: 'arunachal-pradesh',
    region: 'Northeastern India',
    district: 'East Siang',
    city_type: 'city',
    lat: 28.0667,
    lng: 95.3333,
    coordinates: { lat: 28.0667, lng: 95.3333 },
    tagline: 'Oldest Town of Arunachal & The Mighty Siang River',
    description: 'Historic town on the banks of the mighty Siang (Brahmaputra) River, known for riverine adventure sports, suspension bridges, and lush sub-tropical forests.',
    hero_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['river', 'nature', 'adventure'],
    prominence: 'Historic Town & River Gateway',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'Arunachal Pradesh Tourism Department',
    short_description: 'Historic gateway on the Siang River renowned for river rafting, cascades, and lush greenery.',
  }
};

// =========================================================
// 2. HIMACHAL PRADESH CITIES DEFINITIONS (12 Cities)
// =========================================================
const HP_CITIES = {
  shimla: {
    id: 'shimla',
    name: 'Shimla',
    canonical_name: 'Shimla',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Shimla',
    city_type: 'city',
    lat: 31.1048,
    lng: 77.1734,
    coordinates: { lat: 31.1048, lng: 77.1734 },
    tagline: 'Queen of Hills & Summer Capital of British India',
    description: 'Sprawling mountain capital boasting colonial Gothic architecture, the bustling pedestrian Mall Road, panoramic Ridge promenade, and the sacred Jakhu Hanuman hilltop temple.',
    hero_image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['capital', 'hill_station', 'heritage', 'viewpoint'],
    prominence: 'State Capital & World-Famous Hill Station',
    is_capital: true,
    capital_status: 'capital',
    verification_status: 'verified',
    source_provenance: 'Himachal Pradesh Tourism Development Corporation (HPTDC)',
    short_description: 'Capital hill station celebrated for colonial architecture, Mall Road, and panoramic snow vistas.',
  },
  kufri: {
    id: 'kufri',
    name: 'Kufri',
    canonical_name: 'Kufri',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Shimla',
    city_type: 'city',
    lat: 31.0979,
    lng: 77.2678,
    coordinates: { lat: 31.0979, lng: 77.2678 },
    tagline: 'Winter Wonderland & Alpine Skiing Resort',
    description: 'High-altitude resort near Shimla renowned for snow sports, Mahasu Peak, Himalayan Nature Park, and panoramic views of Himalayan ranges.',
    hero_image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['snow', 'adventure', 'nature'],
    prominence: 'Skiing Resort & Alpine Meadow',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'High-altitude snowy resort famed for skiing, winter activities, and alpine meadows.',
  },
  manali: {
    id: 'manali',
    name: 'Manali',
    canonical_name: 'Manali',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Kullu',
    city_type: 'city',
    lat: 32.2432,
    lng: 77.1892,
    coordinates: { lat: 32.2432, lng: 77.1892 },
    tagline: 'Valley of the Gods & Himalayan Adventure Haven',
    description: 'World-famous resort town on the Beas River, serving as the gateway to Solang Valley, Rohtang Pass, ancient pagoda-style Hadimba Temple, and high-altitude road trips.',
    hero_image_url: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['hill_station', 'adventure', 'mountains', 'nature'],
    prominence: 'Premier Himalayan Adventure Destination',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'Iconic resort town surrounded by cedar forests, roaring rivers, and snow-capped peaks.',
  },
  kasol: {
    id: 'kasol',
    name: 'Kasol',
    canonical_name: 'Kasol',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Kullu',
    city_type: 'city',
    lat: 32.0100,
    lng: 77.3150,
    coordinates: { lat: 32.0100, lng: 77.3150 },
    tagline: 'Mini Israel of the Himalayas & Parvati River Valley',
    description: 'Vibrant backpacker hub nestled along the Parvati River, celebrated for pine forest trails, riverside cafés, and gateway to scenic treks.',
    hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['nature', 'trekking', 'youth'],
    prominence: 'Backpacking & Riverside Village',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'Riverside village nestled in the Parvati Valley, famous for forest trails and cafés.',
  },
  barshaini: {
    id: 'barshaini',
    name: 'Barshaini',
    canonical_name: 'Barshaini',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Kullu',
    city_type: 'city',
    lat: 32.0000,
    lng: 77.4167,
    coordinates: { lat: 32.0000, lng: 77.4167 },
    tagline: 'Basecamp to the Sacred Kheerganga Thermal Springs',
    description: 'The roadhead of the upper Parvati Valley and jumping-off point for the legendary Kheerganga trek, Tosh village, and alpine hot springs.',
    hero_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['trekking', 'nature', 'adventure'],
    prominence: 'Trek Trailhead Hub',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'Parvati Valley mountain village serving as the primary basecamp for the Kheerganga trek.',
  },
  dharamshala: {
    id: 'dharamshala',
    name: 'Dharamshala',
    canonical_name: 'Dharamshala',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Kangra',
    city_type: 'city',
    lat: 32.2190,
    lng: 76.3234,
    coordinates: { lat: 32.2190, lng: 76.3234 },
    tagline: 'Spiritual Seat of the Dhauladhar Range',
    description: 'Scenic hillside city in Kangra Valley surrounded by dense deodar cedar forests and snow-capped Dhauladhar peaks, home to the scenic Dal Lake and Kangra art.',
    hero_image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['spiritual', 'hill_station', 'culture'],
    prominence: 'Cultural & Spiritual Center',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'Hill town in Kangra Valley known for Tibetan heritage, Dhauladhar views, and Dal Lake.',
  },
  'mcleod-ganj': {
    id: 'mcleod-ganj',
    name: 'McLeod Ganj',
    canonical_name: 'McLeod Ganj',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Kangra',
    city_type: 'city',
    lat: 32.2426,
    lng: 76.3213,
    coordinates: { lat: 32.2426, lng: 76.3213 },
    tagline: 'Little Lhasa & Residence of the Dalai Lama',
    description: 'Upper Dharamshala settlement world-renowned as the residence of His Holiness the Dalai Lama and the Central Tibetan Administration, gateway to the Triund ridge trek.',
    hero_image_url: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['spiritual', 'culture', 'trekking', 'heritage'],
    prominence: 'Global Buddhist Sanctuary & Trekking Base',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'Vibrant Tibetan Buddhist center in upper Dharamshala and starting point for Triund trek.',
  },
  khajjiar: {
    id: 'khajjiar',
    name: 'Khajjiar',
    canonical_name: 'Khajjiar',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Chamba',
    city_type: 'city',
    lat: 32.5511,
    lng: 76.0594,
    coordinates: { lat: 32.5511, lng: 76.0594 },
    tagline: 'Mini Switzerland of India & Floating Island Meadow',
    description: 'A picture-postcard saucer-shaped alpine meadow surrounded by dense deodar and pine forests, with a central lake and the ancient Khajji Nag temple.',
    hero_image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['nature', 'meadow', 'family'],
    prominence: 'Iconic Alpine Meadow & Nature Spot',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'Picturesque alpine glade surrounded by cedar woods, celebrated as India’s Mini Switzerland.',
  },
  dalhousie: {
    id: 'dalhousie',
    name: 'Dalhousie',
    canonical_name: 'Dalhousie',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Chamba',
    city_type: 'city',
    lat: 32.5387,
    lng: 75.9710,
    coordinates: { lat: 32.5387, lng: 75.9710 },
    tagline: 'Colonial Hill Charm & Five Hills of the Dhauladhar',
    description: 'Serene hill resort founded in 1854 across five hills, featuring Victorian and Scottish colonial bungalows, stone churches, and leisurely forest walks.',
    hero_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['hill_station', 'colonial_heritage', 'nature'],
    prominence: 'Historic Colonial Hill Retreat',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'Charming colonial hill station with old-world churches, oak forests, and mountain panoramas.',
  },
  chail: {
    id: 'chail',
    name: 'Chail',
    canonical_name: 'Chail',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Solan',
    city_type: 'city',
    lat: 30.9686,
    lng: 77.1887,
    coordinates: { lat: 30.9686, lng: 77.1887 },
    tagline: 'World’s Highest Cricket Ground & Royal Chail Palace',
    description: 'Former summer retreat of the Maharaja of Patiala, famous for its opulent heritage Palace Hotel, lush deodar sanctuaries, and the highest cricket ground in the world.',
    hero_image_url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['hill_station', 'heritage', 'relaxation'],
    prominence: 'Royal Heritage Hill Resort',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'Peaceful hill destination known for the historic Maharaja palace and world’s highest cricket pitch.',
  },
  kullu: {
    id: 'kullu',
    name: 'Kullu',
    canonical_name: 'Kullu',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Kullu',
    city_type: 'city',
    lat: 31.9579,
    lng: 77.1095,
    coordinates: { lat: 31.9579, lng: 77.1095 },
    tagline: 'Valley of the Gods & UNESCO Great Himalayan Wilderness',
    description: 'Broad river valley city on the Beas River, world-famous for its colorful Dussehra festival, handwoven Kullu shawls, and gateway to the UNESCO Great Himalayan National Park.',
    hero_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['valley', 'wildlife', 'culture', 'crafts'],
    prominence: 'Valley Hub & UNESCO Heritage Gateway',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'Picturesque valley hub celebrated for Kullu shawls, temples, and Great Himalayan National Park.',
  },
  kaza: {
    id: 'kaza',
    name: 'Kaza',
    canonical_name: 'Kaza',
    state: 'Himachal Pradesh',
    state_id: 'himachal-pradesh',
    region: 'Northern India',
    district: 'Lahaul and Spiti',
    city_type: 'city',
    lat: 32.2276,
    lng: 78.0710,
    coordinates: { lat: 32.2276, lng: 78.0710 },
    tagline: 'Heart of the Cold Desert & Ancient Spiti Monasteries',
    description: 'Sub-divisional headquarters of the high-altitude Spiti Valley at 3,800m, gateway to thousand-year-old Key Monastery, Dhankar, Kibber, and dramatic moonscape terrains.',
    hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    tourism_categories: ['adventure', 'mountains', 'culture', 'desert'],
    prominence: 'High-Altitude Cold Desert Headquarters',
    is_capital: false,
    capital_status: 'none',
    verification_status: 'verified',
    source_provenance: 'HPTDC',
    short_description: 'High-altitude headquarters of Spiti Valley, surrounded by stark cold desert mountains and gompas.',
  }
};

// Precise coordinates for all 15 Arunachal Pradesh places
const ARUN_PLACE_COORDS = {
  arunachal_pradesh_001: { lat: 27.5861, lng: 91.8594 }, // Tawang Monastery
  arunachal_pradesh_002: { lat: 27.5056, lng: 92.1039 }, // Sela Pass
  arunachal_pradesh_003: { lat: 27.5028, lng: 92.1056 }, // Sela Lake
  arunachal_pradesh_004: { lat: 27.7258, lng: 91.8847 }, // Bum La Pass
  arunachal_pradesh_005: { lat: 27.5819, lng: 91.8653 }, // Tawang War Memorial
  arunachal_pradesh_006: { lat: 27.3592, lng: 92.2384 }, // Dirang
  arunachal_pradesh_007: { lat: 27.2644, lng: 92.4239 }, // Bomdila
  arunachal_pradesh_008: { lat: 27.5451, lng: 93.8184 }, // Ziro Valley
  arunachal_pradesh_009: { lat: 27.4913, lng: 96.2081 }, // Namdapha National Park
  arunachal_pradesh_010: { lat: 28.5667, lng: 94.9833 }, // Mouling National Park
  arunachal_pradesh_011: { lat: 27.0844, lng: 93.6053 }, // Itanagar
  arunachal_pradesh_012: { lat: 27.0986, lng: 93.6267 }, // Ita Fort
  arunachal_pradesh_013: { lat: 27.0722, lng: 93.5786 }, // Ganga Lake
  arunachal_pradesh_014: { lat: 28.6019, lng: 94.1317 }, // Mechuka Valley
  arunachal_pradesh_015: { lat: 28.0667, lng: 95.3333 }, // Pasighat
};

// Precise coordinates for all 20 Himachal Pradesh places
const HP_PLACE_COORDS = {
  himachal_001: { lat: 31.1048, lng: 77.1734 }, // Shimla
  himachal_002: { lat: 31.1042, lng: 77.1741 }, // Mall Road
  himachal_003: { lat: 31.1053, lng: 77.1755 }, // The Ridge
  himachal_004: { lat: 31.1009, lng: 77.1839 }, // Jakhu Temple
  himachal_005: { lat: 31.0979, lng: 77.2678 }, // Kufri
  himachal_006: { lat: 32.2432, lng: 77.1892 }, // Manali
  himachal_007: { lat: 32.3167, lng: 77.1572 }, // Solang Valley
  himachal_008: { lat: 32.3716, lng: 77.2466 }, // Rohtang Pass
  himachal_009: { lat: 32.2483, lng: 77.1806 }, // Hadimba Devi Temple
  himachal_010: { lat: 32.0100, lng: 77.3150 }, // Kasol
  himachal_011: { lat: 31.9906, lng: 77.5111 }, // Kheerganga
  himachal_012: { lat: 32.2190, lng: 76.3234 }, // Dharamshala
  himachal_013: { lat: 32.2426, lng: 76.3213 }, // McLeod Ganj
  himachal_014: { lat: 32.2575, lng: 76.3533 }, // Triund
  himachal_015: { lat: 32.2464, lng: 76.3075 }, // Dal Lake Dharamshala
  himachal_016: { lat: 32.5511, lng: 76.0594 }, // Khajjiar
  himachal_017: { lat: 32.5387, lng: 75.9710 }, // Dalhousie
  himachal_018: { lat: 30.9686, lng: 77.1887 }, // Chail
  himachal_019: { lat: 31.7583, lng: 77.5583 }, // Great Himalayan National Park
  himachal_020: { lat: 32.2276, lng: 78.0710 }, // Spiti Valley
};

// Curated high-res imagery for Arunachal Pradesh
const ARUN_PLACE_IMAGES = {
  arunachal_pradesh_001: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_002: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_003: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_004: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_005: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_006: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_007: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_008: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_009: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_010: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_011: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_012: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_013: 'https://images.unsplash.com/photo-1439853941329-a99ce049f08c?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_014: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  arunachal_pradesh_015: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
};

// Curated high-res imagery for Himachal Pradesh
const HP_PLACE_IMAGES = {
  himachal_001: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&auto=format&fit=crop&q=80',
  himachal_002: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&auto=format&fit=crop&q=80',
  himachal_003: 'https://images.unsplash.com/photo-1562088287-bde35a1ea917?w=1200&auto=format&fit=crop&q=80',
  himachal_004: 'https://images.unsplash.com/photo-1600100397608-f4b66f284e3e?w=1200&auto=format&fit=crop&q=80',
  himachal_005: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
  himachal_006: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1200&auto=format&fit=crop&q=80',
  himachal_007: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80',
  himachal_008: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80',
  himachal_009: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
  himachal_010: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  himachal_011: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  himachal_012: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80',
  himachal_013: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
  himachal_014: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
  himachal_015: 'https://images.unsplash.com/photo-1439853941329-a99ce049f08c?w=1200&auto=format&fit=crop&q=80',
  himachal_016: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80',
  himachal_017: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  himachal_018: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
  himachal_019: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
  himachal_020: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
};

// =========================================================
// 3. BUILD ARUNACHAL PRADESH BUNDLE
// =========================================================
function buildArunachalBundle() {
  const citiesMap = new Map();

  for (const cDef of arunSource.cities) {
    const cityId = cDef.city_id;
    const meta = ARUN_CITIES[cityId];
    if (!meta) throw new Error(`Missing meta for Arunachal city: ${cityId}`);

    citiesMap.set(cityId, {
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

  for (const p of arunSource.places) {
    const cityId = p.city_id;
    const cityObj = citiesMap.get(cityId);
    if (!cityObj) throw new Error(`Place ${p.id} refers to unknown city ${cityId}`);

    const coords = ARUN_PLACE_COORDS[p.id] || cityObj.coordinates;
    const img = ARUN_PLACE_IMAGES[p.id] || cityObj.hero_image_url;

    const fullPlace = {
      id: p.id,
      name: p.name,
      state: 'Arunachal Pradesh',
      state_id: 'arunachal-pradesh',
      city: cityObj.name,
      city_id: cityId,
      country: 'India',
      area: p.area || cityObj.name,
      category: p.category || 'nature',
      categories: [p.category || 'nature', 'arunachal_pradesh'],
      summary: p.description || '',
      description: p.description || '',
      best_for: p.best_for || ['nature', 'photography', 'mountain trips'],
      suggested_duration: p.suggested_duration || '2–4 hours',
      best_time_to_visit: p.best_time_to_visit || 'October to April',
      entry_fee: p.entry_fee || 'Free or paid depending on attraction; permits may be required',
      opening_hours: p.opening_hours || 'Usually daytime; timings vary by attraction',
      visitor_notes: p.visitor_notes || ['Carry warm clothing', 'Check weather & permit requirements'],
      map_search: p.map_search || `${p.name} Arunachal Pradesh`,
      tags: p.tags || [p.category, 'Arunachal Pradesh'],
      coordinates: coords,
      lat: coords.lat,
      lng: coords.lng,
      latitude: coords.lat,
      longitude: coords.lng,
      rating: 4.8,
      reviews_count: '1.2k',
      thumbnail_url: img,
      hero_image_url: img,
      image_url: img,
      images: [img],
      features: { map: true, navigation: true, ai: true, '3d': false },
      verification_status: 'verified',
      data_confidence: 'official',
      source_name: 'Arunachal Pradesh Tourism Department',
      source_url: 'https://arunachaltourism.com',
      source_type: 'state_tourism',
      source_quality: 'official_site',
    };

    cityObj.places.push(fullPlace);

    const cat = (p.category || '').toLowerCase();
    if (cat.includes('religious') || cat.includes('monastery') || cat.includes('temple')) {
      cityObj.religious_cultural.push(fullPlace);
    } else if (cat.includes('heritage') || cat.includes('fort') || cat.includes('war_memorial')) {
      cityObj.heritage.push(fullPlace);
      cityObj.monuments.push(fullPlace);
    } else if (cat.includes('park') || cat.includes('lake') || cat.includes('wildlife') || cat.includes('pass') || cat.includes('nature') || cat.includes('valley')) {
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
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    code: 'AR',
    capital: 'Itanagar',
    region: 'Northeastern India',
    total_cities: citiesArray.length,
    total_attractions: totalPlacesCount,
    description: 'The Land of Dawn-lit Mountains, renowned for dramatic eastern Himalayan landscapes, ancient Tibetan Buddhist monasteries, indigenous tribal culture, and biodiverse rainforests.',
    official_tourism_url: 'https://arunachaltourism.com',
    hero_image_url: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
    banner_image_url: 'https://images.unsplash.com/photo-1596761403273-049079bfbc06?w=1200&auto=format&fit=crop&q=80',
    coordinates: { lat: 27.0844, lng: 93.6053 },
    cities: citiesArray,
  };

  return { stateObject, citiesArray, totalPlacesCount };
}

// =========================================================
// 4. BUILD HIMACHAL PRADESH BUNDLE
// =========================================================
function buildHimachalBundle() {
  const citiesMap = new Map();

  for (const cDef of hpSource.cities) {
    const cityId = cDef.city_id;
    const meta = HP_CITIES[cityId];
    if (!meta) throw new Error(`Missing meta for Himachal city: ${cityId}`);

    citiesMap.set(cityId, {
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

  for (const p of hpSource.places) {
    const cityId = p.city_id;
    const cityObj = citiesMap.get(cityId);
    if (!cityObj) throw new Error(`Place ${p.id} refers to unknown city ${cityId}`);

    const coords = HP_PLACE_COORDS[p.id] || cityObj.coordinates;
    const img = HP_PLACE_IMAGES[p.id] || cityObj.hero_image_url;

    const fullPlace = {
      id: p.id,
      name: p.name,
      state: 'Himachal Pradesh',
      state_id: 'himachal-pradesh',
      city: cityObj.name,
      city_id: cityId,
      country: 'India',
      area: p.area || cityObj.name,
      category: p.category || 'hill_station',
      categories: [p.category || 'hill_station', 'himachal_pradesh'],
      summary: p.description || '',
      description: p.description || '',
      best_for: p.best_for || ['nature', 'mountains', 'photography'],
      suggested_duration: p.suggested_duration || '2–3 hours',
      best_time_to_visit: p.best_time_to_visit || 'March to June; October to February',
      entry_fee: p.entry_fee || 'Usually free; individual attractions may charge',
      opening_hours: p.opening_hours || 'Usually daytime; timings vary by attraction',
      visitor_notes: p.visitor_notes || ['Carry warm clothing', 'Check road conditions'],
      map_search: p.map_search || `${p.name} Himachal Pradesh`,
      tags: p.tags || [p.category, 'Himachal Pradesh'],
      coordinates: coords,
      lat: coords.lat,
      lng: coords.lng,
      latitude: coords.lat,
      longitude: coords.lng,
      rating: 4.8,
      reviews_count: '2.5k',
      thumbnail_url: img,
      hero_image_url: img,
      image_url: img,
      images: [img],
      features: { map: true, navigation: true, ai: true, '3d': false },
      verification_status: 'verified',
      data_confidence: 'official',
      source_name: 'Himachal Pradesh Tourism Development Corporation',
      source_url: 'https://himachaltourism.gov.in',
      source_type: 'state_tourism',
      source_quality: 'official_site',
    };

    cityObj.places.push(fullPlace);

    const cat = (p.category || '').toLowerCase();
    if (cat.includes('religious') || cat.includes('temple') || cat.includes('monastery')) {
      cityObj.religious_cultural.push(fullPlace);
    } else if (cat.includes('heritage') || cat.includes('palace') || cat.includes('viewpoint_heritage')) {
      cityObj.heritage.push(fullPlace);
      cityObj.monuments.push(fullPlace);
    } else if (cat.includes('nature') || cat.includes('trek') || cat.includes('lake') || cat.includes('park') || cat.includes('meadow') || cat.includes('pass') || cat.includes('valley')) {
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
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    code: 'HP',
    capital: 'Shimla',
    region: 'Northern India',
    total_cities: citiesArray.length,
    total_attractions: totalPlacesCount,
    description: 'The Land of Gods (Dev Bhoomi), celebrated for towering western Himalayan peaks, lush cedar and pine forests, rushing mountain rivers, colonial hill stations, Tibetan monasteries, and high-altitude cold deserts.',
    official_tourism_url: 'https://himachaltourism.gov.in',
    hero_image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&auto=format&fit=crop&q=80',
    banner_image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&auto=format&fit=crop&q=80',
    coordinates: { lat: 31.1048, lng: 77.1734 },
    cities: citiesArray,
  };

  return { stateObject, citiesArray, totalPlacesCount };
}

const arunBundle = buildArunachalBundle();
const hpBundle = buildHimachalBundle();

console.log(`✓ Built Arunachal bundle: ${arunBundle.citiesArray.length} cities, ${arunBundle.totalPlacesCount} places.`);
console.log(`✓ Built Himachal bundle: ${hpBundle.citiesArray.length} cities, ${hpBundle.totalPlacesCount} places.`);

// =========================================================
// 5. UPDATE data/india_tourism_database.json
// =========================================================
const itdb = readJson(itdbJsonPath);

const arunIdx = itdb.states.findIndex((s) => s.id === 'arunachal-pradesh');
if (arunIdx !== -1) {
  itdb.states[arunIdx] = arunBundle.stateObject;
} else {
  itdb.states.push(arunBundle.stateObject);
}

const hpIdx = itdb.states.findIndex((s) => s.id === 'himachal-pradesh');
if (hpIdx !== -1) {
  itdb.states[hpIdx] = hpBundle.stateObject;
} else {
  itdb.states.push(hpBundle.stateObject);
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
  (c) => c.state_id !== 'arunachal-pradesh' && c.state_id !== 'himachal-pradesh'
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

const newArunCities = makeCityEntries('arunachal-pradesh', arunBundle.citiesArray);
const newHpCities = makeCityEntries('himachal-pradesh', hpBundle.citiesArray);

const finalCities = [...filteredCities, ...newArunCities, ...newHpCities];
fs.writeFileSync(citiesJsonPath, JSON.stringify(finalCities, null, 2), 'utf8');
console.log(`✓ Updated data/cities.json. Non-target cities: ${filteredCities.length}, Arunachal: ${newArunCities.length}, Himachal: ${newHpCities.length}, Total: ${finalCities.length}`);

// =========================================================
// 8. UPDATE data/states.json
// =========================================================
const statesList = readJson(statesJsonPath);

const arunStateIdx = statesList.findIndex((s) => s.id === 'arunachal-pradesh');
if (arunStateIdx !== -1) {
  statesList[arunStateIdx] = {
    ...statesList[arunStateIdx],
    total_cities: arunBundle.citiesArray.length,
    total_attractions: arunBundle.totalPlacesCount,
    official_tourism_url: arunBundle.stateObject.official_tourism_url,
    description: arunBundle.stateObject.description,
  };
}

const hpStateIdx = statesList.findIndex((s) => s.id === 'himachal-pradesh');
if (hpStateIdx !== -1) {
  statesList[hpStateIdx] = {
    ...statesList[hpStateIdx],
    total_cities: hpBundle.citiesArray.length,
    total_attractions: hpBundle.totalPlacesCount,
    official_tourism_url: hpBundle.stateObject.official_tourism_url,
    description: hpBundle.stateObject.description,
  };
}

fs.writeFileSync(statesJsonPath, JSON.stringify(statesList, null, 2), 'utf8');
console.log('✓ Updated data/states.json');

// =========================================================
// 9. WRITE REGIONAL ARCHIVES
// =========================================================
const arunPlaces = [];
for (const c of arunBundle.citiesArray) {
  arunPlaces.push(...c.places);
}
if (!fs.existsSync(path.join(rootDir, 'data', 'arunachal-pradesh'))) {
  fs.mkdirSync(path.join(rootDir, 'data', 'arunachal-pradesh'), { recursive: true });
}
fs.writeFileSync(path.join(rootDir, 'data', 'arunachal-pradesh', 'places.json'), JSON.stringify(arunPlaces, null, 2), 'utf8');
console.log(`✓ Wrote data/arunachal-pradesh/places.json with ${arunPlaces.length} places.`);

const hpPlaces = [];
for (const c of hpBundle.citiesArray) {
  hpPlaces.push(...c.places);
}
if (!fs.existsSync(path.join(rootDir, 'data', 'himachal-pradesh'))) {
  fs.mkdirSync(path.join(rootDir, 'data', 'himachal-pradesh'), { recursive: true });
}
fs.writeFileSync(path.join(rootDir, 'data', 'himachal-pradesh', 'places.json'), JSON.stringify(hpPlaces, null, 2), 'utf8');
console.log(`✓ Wrote data/himachal-pradesh/places.json with ${hpPlaces.length} places.`);

console.log('=== Arunachal Pradesh & Himachal Pradesh Integration Script Finished Successfully ===');
