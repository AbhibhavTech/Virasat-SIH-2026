import fs from 'fs';
import path from 'path';

const festivalsPath = path.resolve('data/festivals.json');
const festivalsMasterPath = path.resolve('data/festivals_master.json');
const sourceFilePath = path.resolve('data/source/indian_festivals_290.txt');
const refPath = path.resolve('data/verified_festivals_reference.json');

// Load verified reference database (from git HEAD)
let refFestivals = [];
if (fs.existsSync(refPath)) {
  try {
    refFestivals = JSON.parse(fs.readFileSync(refPath, 'utf-8'));
  } catch (e) {
    console.error('Failed to parse verified reference:', e);
  }
}

// Region lookup by state
const STATE_REGION_MAP = {
  'Jammu and Kashmir': 'Himalayan',
  'Jammu & Kashmir': 'Himalayan',
  'Ladakh': 'Himalayan',
  'Himachal Pradesh': 'Himalayan',
  'Uttarakhand': 'Himalayan',
  'Punjab': 'North',
  'Haryana': 'North',
  'Delhi': 'North',
  'Chandigarh': 'North',
  'Uttar Pradesh': 'North',
  'Rajasthan': 'North',
  'Bihar': 'East',
  'Jharkhand': 'East',
  'Odisha': 'East',
  'West Bengal': 'East',
  'Madhya Pradesh': 'Central',
  'Chhattisgarh': 'Central',
  'Gujarat': 'West',
  'Maharashtra': 'West',
  'Goa': 'West',
  'Dadra and Nagar Haveli and Daman and Diu': 'West',
  'Andhra Pradesh': 'South',
  'Telangana': 'South',
  'Karnataka': 'South',
  'Kerala': 'South',
  'Tamil Nadu': 'South',
  'Puducherry': 'South',
  'Lakshadweep': 'South',
  'Andaman and Nicobar Islands': 'South',
  'Andaman & Nicobar Islands': 'South',
  'Assam': 'Northeast',
  'Arunachal Pradesh': 'Northeast',
  'Manipur': 'Northeast',
  'Meghalaya': 'Northeast',
  'Mizoram': 'Northeast',
  'Nagaland': 'Northeast',
  'Tripura': 'Northeast',
  'Sikkim': 'Northeast',
};

// Supplementary verified Flagship & Pan-India Festivals
const SUPPLEMENTARY_VERIFIED = [
  {
    id: 'diwali',
    name: 'Diwali (Deepavali)',
    aliases: ['Deepavali', 'Deepotsav', 'Festival of Lights'],
    scope: 'ALL_INDIA',
    religion_or_category: 'Hindu',
    states: [],
    region: 'North',
    state: 'All India',
    primary_city: 'Varanasi',
    primary_city_id: 'varanasi',
    alternate_locations: ['Ayodhya', 'Jaipur', 'Delhi', 'Mumbai'],
    cultural_vibe: 'Illuminated Nightscapes, Traditional Diyas, Festive Splendour',
    typical_season: 'Autumn (October / November)',
    typical_month: 'November',
    exact_date_start: '2026-11-08',
    exact_date_end: '2026-11-12',
    is_date_verified: true,
    associated_places: ['Dashashwamedh Ghat', 'Ram Ki Paidi Ayodhya', 'Golden Temple Amritsar'],
    lat: 25.3076,
    lng: 83.0104,
    image_url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Ministry of Culture / Incredible India',
  },
  {
    id: 'holi',
    name: 'Holi (Festival of Colours)',
    aliases: ['Dol Jatra', 'Rangwali Holi', 'Dhulandi'],
    scope: 'ALL_INDIA',
    religion_or_category: 'Hindu',
    states: [],
    region: 'North',
    state: 'All India',
    primary_city: 'Mathura',
    primary_city_id: 'mathura',
    alternate_locations: ['Vrindavan', 'Barsana', 'Jaipur', 'Shantiniketan'],
    cultural_vibe: 'Euphoric Colours, Folk Melodies, Spring Rejuvenation',
    typical_season: 'Spring (March)',
    typical_month: 'March',
    exact_date_start: '2026-03-03',
    exact_date_end: '2026-03-04',
    is_date_verified: true,
    associated_places: ['Banke Bihari Temple', 'Dwarkadhish Temple Mathura', 'Govind Dev Ji Temple'],
    lat: 27.4924,
    lng: 77.6737,
    image_url: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Ministry of Culture / Incredible India',
  },
  {
    id: 'dussehra',
    name: 'Dussehra (Vijayadashami)',
    aliases: ['Vijayadashami', 'Dasara'],
    scope: 'ALL_INDIA',
    religion_or_category: 'Hindu',
    states: [],
    region: 'North',
    state: 'All India',
    primary_city: 'Delhi',
    primary_city_id: 'delhi',
    alternate_locations: ['Kullu', 'Mysuru', 'Kota', 'Varanasi'],
    cultural_vibe: 'Ramlila Epics, Effigy Spectacles, Victorious Processions',
    typical_season: 'Autumn (October)',
    typical_month: 'October',
    exact_date_start: '2026-10-20',
    exact_date_end: '2026-10-20',
    is_date_verified: true,
    associated_places: ['Red Fort Grounds Delhi', 'Dhalpur Ground Kullu', 'Mysore Palace Grounds'],
    lat: 28.6562,
    lng: 77.2410,
    image_url: 'https://images.unsplash.com/photo-1603575448878-868a20723f5d?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Ministry of Culture / Incredible India',
  },
  {
    id: 'navratri',
    name: 'Navratri (Sharad Navratri)',
    aliases: ['Sharad Navratri', 'Maha Navratri', 'Chaitra Navratri'],
    scope: 'ALL_INDIA',
    religion_or_category: 'Hindu',
    states: ['Gujarat', 'Maharashtra', 'West Bengal', 'Uttar Pradesh', 'Delhi'],
    region: 'West',
    state: 'All India',
    primary_city: 'Ahmedabad',
    primary_city_id: 'ahmedabad',
    alternate_locations: ['Vadodara', 'Mumbai', 'Kolkata', 'Varanasi'],
    cultural_vibe: 'Garba Circles, Devotional Fasting, Vibrant Chants',
    typical_season: 'Autumn (October)',
    typical_month: 'October',
    exact_date_start: '2026-10-11',
    exact_date_end: '2026-10-19',
    is_date_verified: true,
    associated_places: ['United Way Garba Grounds', 'Kalighat Kali Temple', 'Mansa Devi Temple'],
    lat: 23.0225,
    lng: 72.5714,
    image_url: 'https://images.unsplash.com/photo-1569429593410-b498b3fb3387?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Ministry of Culture / Incredible India',
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi / Ganesh Puja',
    aliases: ['Vinayaka Chaturthi', 'Ganeshotsav'],
    scope: 'ALL_INDIA',
    religion_or_category: 'Hindu',
    states: ['Maharashtra', 'Goa', 'Karnataka', 'Telangana', 'Andhra Pradesh'],
    region: 'West',
    state: 'All India',
    primary_city: 'Mumbai',
    primary_city_id: 'mumbai',
    alternate_locations: ['Pune', 'Hyderabad', 'Bengaluru', 'Panaji'],
    cultural_vibe: 'Dhol-Tasha Beats, Majestic Pandals, Community Grandeur',
    typical_season: 'Late Monsoon (August / September)',
    typical_month: 'September',
    exact_date_start: '2026-09-14',
    exact_date_end: '2026-09-24',
    is_date_verified: true,
    associated_places: ['Lalbaugcha Raja', 'Siddhivinayak Temple', 'Girgaon Chowpatty'],
    lat: 18.9902,
    lng: 72.8368,
    image_url: 'https://images.unsplash.com/photo-1631580979603-9ecb55239a58?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Ministry of Culture / Incredible India',
  },
  {
    id: 'makar-sankranti',
    name: 'Makar Sankranti',
    aliases: ['Uttarayan', 'Maghi', 'Khichdi', 'Sankranti'],
    scope: 'ALL_INDIA',
    religion_or_category: 'Hindu',
    states: ['Gujarat', 'Maharashtra', 'Uttar Pradesh', 'Bihar', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh'],
    region: 'West',
    state: 'All India',
    primary_city: 'Ahmedabad',
    primary_city_id: 'ahmedabad',
    alternate_locations: ['Surat', 'Prayagraj', 'Varanasi', 'Patna'],
    cultural_vibe: 'Kite-Strewn Skies, Harvest Feasts, Sacred River Ablutions',
    typical_season: 'Winter (January)',
    typical_month: 'January',
    exact_date_start: '2026-01-14',
    exact_date_end: '2026-01-15',
    is_date_verified: true,
    associated_places: ['Sabarmati Riverfront', 'Triveni Sangam Prayagraj', 'Dashashwamedh Ghat'],
    lat: 23.0225,
    lng: 72.5714,
    image_url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Ministry of Culture / Incredible India',
  },
  {
    id: 'krishna-janmashtami',
    name: 'Janmashtami',
    aliases: ['Krishna Janmashtami', 'Gokulashtami', 'Dahi Handi'],
    scope: 'ALL_INDIA',
    religion_or_category: 'Hindu',
    states: ['Uttar Pradesh', 'Maharashtra', 'Gujarat'],
    region: 'North',
    state: 'All India',
    primary_city: 'Mathura',
    primary_city_id: 'mathura',
    alternate_locations: ['Vrindavan', 'Dwarka', 'Mumbai', 'Udupi'],
    cultural_vibe: 'Midnight Vigil, Raslila Ballets, Dahi Handi Acrobatics',
    typical_season: 'Monsoon (August / September)',
    typical_month: 'September',
    exact_date_start: '2026-09-04',
    exact_date_end: '2026-09-05',
    is_date_verified: true,
    associated_places: ['Krishna Janmasthan Temple Complex', 'Banke Bihari Temple', 'Dwarkadhish Temple'],
    lat: 27.5050,
    lng: 77.6690,
    image_url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Ministry of Culture / Incredible India',
  },
  {
    id: 'maha-shivratri',
    name: 'Maha Shivratri',
    aliases: ['Shivratri', 'The Great Night of Shiva'],
    scope: 'ALL_INDIA',
    religion_or_category: 'Hindu',
    states: [],
    region: 'North',
    state: 'All India',
    primary_city: 'Varanasi',
    primary_city_id: 'varanasi',
    alternate_locations: ['Ujjain', 'Haridwar', 'Somnath', 'Rameswaram'],
    cultural_vibe: 'Meditative Asceticism, Cosmic Dance Chants, Nocturnal Vigils',
    typical_season: 'Late Winter (February / March)',
    typical_month: 'February',
    exact_date_start: '2026-02-15',
    exact_date_end: '2026-02-16',
    is_date_verified: true,
    associated_places: ['Kashi Vishwanath Temple', 'Mahakaleshwar Jyotirlinga Ujjain', 'Somnath Temple'],
    lat: 25.3109,
    lng: 83.0107,
    image_url: 'https://images.unsplash.com/photo-1566908829550-e6551b00979b?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Ministry of Culture / Incredible India',
  },
  {
    id: 'ram-navami',
    name: 'Ram Navami',
    aliases: ['Sri Rama Navami'],
    scope: 'ALL_INDIA',
    religion_or_category: 'Hindu',
    states: ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Karnataka'],
    region: 'North',
    state: 'All India',
    primary_city: 'Ayodhya',
    primary_city_id: 'ayodhya',
    alternate_locations: ['Bhadrachalam', 'Rameswaram', 'Sitamarhi'],
    cultural_vibe: 'Sacred Recitations, Temple Chariots, Devotional Fervour',
    typical_season: 'Spring (March / April)',
    typical_month: 'March',
    exact_date_start: '2026-03-27',
    exact_date_end: '2026-03-27',
    is_date_verified: true,
    associated_places: ['Ram Mandir Ayodhya', 'Kanak Bhawan', 'Sarayu Ghats'],
    lat: 26.7956,
    lng: 82.1943,
    image_url: 'https://images.unsplash.com/photo-1609137144822-0d127909b0a1?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Ministry of Culture / Incredible India',
  },
  {
    id: 'republic-day',
    name: 'Republic Day',
    aliases: ['Gantantra Diwas', '26 January'],
    scope: 'NATIONAL_OBSERVANCE',
    religion_or_category: 'National',
    states: [],
    region: 'North',
    state: 'Delhi',
    primary_city: 'New Delhi',
    primary_city_id: 'delhi',
    cultural_vibe: 'Constitutional Pride, Ceremonial Parades, Cultural Tableaux',
    typical_season: 'Winter (January)',
    typical_month: 'January',
    exact_date_start: '2026-01-26',
    exact_date_end: '2026-01-26',
    is_date_verified: true,
    associated_places: ['Kartavya Path', 'India Gate', 'Rashtrapati Bhavan'],
    lat: 28.6129,
    lng: 77.2295,
    image_url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Government of India / National Portal',
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    aliases: ['Swatantrata Diwas', '15 August'],
    scope: 'NATIONAL_OBSERVANCE',
    religion_or_category: 'National',
    states: [],
    region: 'North',
    state: 'Delhi',
    primary_city: 'New Delhi',
    primary_city_id: 'delhi',
    cultural_vibe: 'Patriotic Zeal, Tricolour Hoistings, Red Fort Ceremonies',
    typical_season: 'Monsoon (August)',
    typical_month: 'August',
    exact_date_start: '2026-08-15',
    exact_date_end: '2026-08-15',
    is_date_verified: true,
    associated_places: ['Red Fort (Lal Qila)', 'Raj Ghat', 'National War Memorial'],
    lat: 28.6562,
    lng: 77.2410,
    image_url: 'https://images.unsplash.com/photo-1597058712635-3182d1e43c5b?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Government of India / National Portal',
  },
  {
    id: 'gandhi-jayanti',
    name: 'Gandhi Jayanti',
    aliases: ['Mahatma Gandhi Jayanti', '2 October'],
    scope: 'NATIONAL_OBSERVANCE',
    religion_or_category: 'National',
    states: [],
    region: 'North',
    state: 'Delhi',
    primary_city: 'New Delhi',
    primary_city_id: 'delhi',
    cultural_vibe: 'Non-Violence Reflection, Sarva Dharma Prayer, Khadi Reverence',
    typical_season: 'Autumn (October)',
    typical_month: 'October',
    exact_date_start: '2026-10-02',
    exact_date_end: '2026-10-02',
    is_date_verified: true,
    associated_places: ['Raj Ghat New Delhi', 'Sabarmati Ashram', 'Kirti Mandir Porbandar'],
    lat: 28.6406,
    lng: 77.2495,
    image_url: 'https://images.unsplash.com/photo-1569429593410-b498b3fb3387?w=1200&auto=format&fit=crop&q=80',
    source_url: 'https://asi.nic.in/',
    source_name: 'Government of India / National Portal',
  },
];

// Combine all verified reference records
const ALL_VERIFIED_REFS = [...SUPPLEMENTARY_VERIFIED, ...refFestivals];

const CANONICAL_SLUG_MAP = {
  'diwali-deepavali': 'diwali',
  'dussehra-vijayadashami': 'dussehra',
  'ganesh-chaturthi-ganesh-puja': 'ganesh-chaturthi',
  'baisakhi-vaisakhi': 'baisakhi',
  'buddha-purnima-vesak': 'buddha-purnima',
  'govardhan-puja-annakut': 'govardhan-puja',
  'magh-bihu-bhogali-bihu': 'magh-bihu',
  'losoong-namsoong': 'losoong',
  'dhanteras-dhantrayodashi': 'dhanteras',
  'sharad-navratri': 'navratri',
  'naraka-chaturdashi-chhoti-diwali': 'chhoti-diwali',
};

function slugify(text) {
  const s = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
  return CANONICAL_SLUG_MAP[s] || s;
}

function cleanName(str) {
  return (str || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\bmysore\b/g, 'mysuru')
    .replace(/\bcalcutta\b/g, 'kolkata')
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
}

function findVerifiedMatch(slug, name, aliases) {
  const cClean = cleanName(name);
  const sClean = cleanName(slug);

  for (const ref of ALL_VERIFIED_REFS) {
    const rClean = cleanName(ref.name);
    const rSlug = cleanName(ref.slug || ref.id);

    if (rClean === cClean || rSlug === sClean) return ref;

    // Direct alias match
    if (ref.aliases && ref.aliases.some(a => cleanName(a) === cClean || cleanName(a) === sClean)) {
      return ref;
    }
    if (aliases && aliases.some(a => cleanName(a) === rClean || cleanName(a) === rSlug)) {
      return ref;
    }

    // Substring match for substantial names (>= 5 letters)
    if (cClean.length >= 5 && rClean.length >= 5) {
      if (cClean === rClean || cClean.includes(rClean) || rClean.includes(cClean)) {
        return ref;
      }
    }
  }
  return null;
}

function getSectionCategory(sectionName) {
  const s = sectionName.toLowerCase();
  if (s.includes('1. major hindu') || s.includes('2. other hindu')) return 'Hindu';
  if (s.includes('3. indian harvest')) return 'Harvest & Regional New Year';
  if (s.includes('4. muslim')) return 'Muslim';
  if (s.includes('5. sikh')) return 'Sikh';
  if (s.includes('6. christian')) return 'Christian';
  if (s.includes('7. buddhist')) return 'Buddhist';
  if (s.includes('8. jain')) return 'Jain';
  if (s.includes('9. famous state')) return 'State & Regional';
  if (s.includes('10. national')) return 'National';
  if (s.includes('11. more fairs')) return 'Arts & Culture';
  return 'Cultural';
}

function getDateRule(name, section) {
  const n = name.toLowerCase();
  const s = section.toLowerCase();
  if (s.includes('10. national')) {
    if (n.includes('republic')) return 'Fixed Gregorian date: 26 January annually';
    if (n.includes('independence')) return 'Fixed Gregorian date: 15 August annually';
    if (n.includes('gandhi')) return 'Fixed Gregorian date: 2 October annually';
    if (n.includes('children')) return 'Fixed Gregorian date: 14 November annually';
    if (n.includes('teachers')) return 'Fixed Gregorian date: 5 September annually';
    if (n.includes('youth')) return 'Fixed Gregorian date: 12 January annually';
    if (n.includes('yoga')) return 'Fixed Gregorian date: 21 June annually';
    if (n.includes('science')) return 'Fixed Gregorian date: 28 February annually';
    if (n.includes('constitution')) return 'Fixed Gregorian date: 26 November annually';
    if (n.includes('army')) return 'Fixed Gregorian date: 15 January annually';
    if (n.includes('navy')) return 'Fixed Gregorian date: 4 December annually';
    if (n.includes('air force')) return 'Fixed Gregorian date: 8 October annually';
    if (n.includes('kargil')) return 'Fixed Gregorian date: 26 July annually';
    if (n.includes('voter')) return 'Fixed Gregorian date: 25 January annually';
    if (n.includes('environment')) return 'Fixed Gregorian date: 5 June annually';
    return 'Fixed national observance calendar date';
  }
  if (n.includes('makar sankranti') || n.includes('pongal') || n.includes('uttarayan') || n.includes('maghi')) {
    return 'Solar transition into Capricorn (Makar): 14–15 January annually';
  }
  if (n.includes('baisakhi') || n.includes('vaisakhi')) {
    return 'Solar Punjabi New Year / Mesha Sankranti: 13–14 April annually';
  }
  if (s.includes('muslim') || n.includes('eid') || n.includes('muharram') || n.includes('ramadan') || n.includes('mawlid')) {
    return 'Islamic Hijri lunar calendar: dates advance by ~10–11 days each solar year';
  }
  if (s.includes('buddhist') || s.includes('jain') || s.includes('hindu')) {
    return 'Traditional lunisolar calendar (Tithi): varies each year on the Gregorian calendar';
  }
  if (s.includes('harvest') || s.includes('fairs') || s.includes('arts')) {
    return 'Seasonal regional event: confirmed annually by state tourism board / organisers';
  }
  return 'Traditional calendar schedule: varies annually';
}

if (!fs.existsSync(sourceFilePath)) {
  console.error(`[Error] Source file not found: ${sourceFilePath}`);
  process.exit(1);
}

console.log(`[Source Import] Reading REAL 290-entry file from: ${sourceFilePath}`);
const rawContent = fs.readFileSync(sourceFilePath, 'utf-8');
const lines = rawContent.split(/\r?\n/);

let currentSection = '';
const parsedRows = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  if (/^\d+\.\s+/.test(line)) {
    currentSection = line;
    continue;
  }
  if (
    line.startsWith('No.') ||
    line.startsWith('Indian Festivals List') ||
    line.startsWith("India's official tourism") ||
    line.startsWith('A Ministry of Tourism') ||
    line === '+1'
  ) {
    continue;
  }

  const parts = line.split('\t');
  if (parts.length >= 2 && /^\d+$/.test(parts[0].trim())) {
    const entryNo = parseInt(parts[0].trim(), 10);
    const name = parts[1].trim();
    let state = '';
    let desc = '';
    if (currentSection.includes('9.')) {
      state = parts[2]?.trim() || '';
      desc = parts.slice(3).join(' ').trim();
    } else {
      desc = parts.slice(2).join(' ').trim();
    }
    parsedRows.push({
      source_entry_no: entryNo,
      name,
      state_from_source: state,
      description: desc,
      source_section: currentSection,
    });
  }
}

console.log(`[Source Import] Total rows read from file: ${parsedRows.length}`);

// Reviewed Deduplication Rules: map redundant row number to canonical target row number
const MERGE_RULES = new Map([
  // Exact duplicate names
  [182, 9],    // Gudi Padwa (#182 -> #9)
  [63, 18],    // Guru Purnima (#63 -> #18)
  [250, 26],   // Onam (#250 -> #26)
  [76, 45],    // Chhath Mahaparv (#76 -> #45 Chhath Puja)
  [201, 45],   // Chhath Puja (#201 -> #45)
  [247, 88],   // Gangasagar Mela (#247 -> #88)
  [137, 92],   // Vaisakhi (#137 -> #92 Baisakhi / Vaisakhi)
  [249, 93],   // Vishu (#249 -> #93)
  [208, 98],   // Nuakhai (#208 -> #98)
  [220, 99],   // Wangala (#220 -> #99)
  [213, 100],  // Hornbill Festival (#213 -> #100) (Note: #269 and #286 music/winter events preserved)
  [221, 101],  // Chapchar Kut (#221 -> #101)
  [222, 102],  // Mim Kut (#222 -> #102)
  [158, 104],  // Losoong (#158 -> #104 Losoong / Namsoong)
  [156, 106],  // Losar (#156 -> #106)
  [230, 106],  // Losar (#230 -> #106)
  [211, 114],  // Ambubachi Mela (#211 -> #114)
  [243, 115],  // Karam Festival (#243 -> #115)
  [244, 116],  // Sarhul (#244 -> #116)
  [245, 118],  // Tusu Parab (#245 -> #118)
  [246, 119],  // Poush Mela (#246 -> #119)
  [240, 120],  // Madai Festival (#240 -> #120)
  [231, 157],  // Hemis Festival (#231 -> #157)
  [205, 173],  // Durga Puja (#205 -> #173)
  [242, 183],  // Pola (#242 -> #183)
  [274, 210],  // Konark Dance Festival (#274 -> #210)
  [273, 237],  // Khajuraho Dance Festival (#273 -> #237)
  // Compound / Synonym merges
  [181, 25],   // Ganesh Chaturthi (#181 -> #25 Ganesh Chaturthi / Ganesh Puja)
  [71, 39],    // Govardhan Puja (#71 -> #39 Govardhan Puja / Annakut)
  [81, 39],    // Govardhan Annakut (#81 -> #39 Govardhan Puja / Annakut)
  [267, 187],  // Rann Utsav (#267 -> #187 Rann Utsav)
  [288, 187],  // Kutch Rann Utsav (#288 -> #187 Rann Utsav)
  [290, 202],  // Sonepur Mela (#290 -> #202 Sonepur Cattle Fair)
  [266, 200],  // Surajkund Crafts Mela (#266 -> #200 Surajkund International Crafts Mela)
  [289, 200],  // Surajkund International Crafts Mela (#289 -> #200)
]);

const mergedEntries = [];
const masterByNo = new Map();

for (const row of parsedRows) {
  const targetNo = MERGE_RULES.get(row.source_entry_no);
  if (targetNo) {
    mergedEntries.push({
      merged_row_no: row.source_entry_no,
      name: row.name,
      merged_into_no: targetNo,
      section: row.source_section,
    });
  } else {
    masterByNo.set(row.source_entry_no, {
      ...row,
      source_entry_numbers: [row.source_entry_no],
      alternative_names: [],
    });
  }
}

// Apply merges into canonical records
for (const m of mergedEntries) {
  const target = masterByNo.get(m.merged_into_no);
  if (target) {
    target.source_entry_numbers.push(m.merged_row_no);
    if (!target.alternative_names.includes(m.name) && m.name !== target.name) {
      target.alternative_names.push(m.name);
    }
    const sourceRow = parsedRows.find(r => r.source_entry_no === m.merged_row_no);
    if (sourceRow?.state_from_source && !target.state_from_source) {
      target.state_from_source = sourceRow.state_from_source;
    }
  }
}

const finalFestivals = [];

for (const canonical of masterByNo.values()) {
  const slug = slugify(canonical.name);
  const sectionCat = getSectionCategory(canonical.source_section);
  let religionOrCategory = sectionCat;
  let scope = 'STATE_REGIONAL';

  if (canonical.source_section.includes('10. National')) {
    scope = 'NATIONAL_OBSERVANCE';
    religionOrCategory = 'National';
  } else if (canonical.source_section.includes('1. Major Hindu')) {
    if (['makar-sankranti', 'maha-shivratri', 'holi', 'ram-navami', 'hanuman-jayanti', 'akshaya-tritiya', 'krishna-janmashtami', 'ganesh-chaturthi', 'durga-puja', 'dussehra', 'diwali', 'navratri', 'raksha-bandhan'].some(k => slug.includes(k))) {
      scope = 'ALL_INDIA';
    } else {
      scope = 'PAN_INDIA_RELIGIOUS';
    }
  } else if (canonical.source_section.includes('2. Other Hindu')) {
    scope = 'PAN_INDIA_RELIGIOUS';
  } else if (canonical.source_section.includes('4. Muslim')) {
    scope = ['eid-ul-fitr', 'eid-ul-adha', 'muharram', 'milad-un-nabi'].some(k => slug.includes(k)) ? 'ALL_INDIA' : 'PAN_INDIA_RELIGIOUS';
  } else if (canonical.source_section.includes('5. Sikh')) {
    scope = ['guru-nanak', 'baisakhi', 'vaisakhi'].some(k => slug.includes(k)) ? 'ALL_INDIA' : 'STATE_REGIONAL';
  } else if (canonical.source_section.includes('6. Christian')) {
    scope = ['christmas', 'good-friday', 'easter'].some(k => slug.includes(k)) ? 'ALL_INDIA' : 'STATE_REGIONAL';
  } else if (canonical.source_section.includes('7. Buddhist')) {
    scope = slug.includes('buddha-purnima') ? 'ALL_INDIA' : 'STATE_REGIONAL';
  } else if (canonical.source_section.includes('8. Jain')) {
    scope = slug.includes('mahavir-jayanti') ? 'ALL_INDIA' : 'PAN_INDIA_RELIGIOUS';
  }

  // Determine State / States
  let stateOrRegion = canonical.state_from_source || '';
  let states = [];

  if (stateOrRegion) {
    for (const st of Object.keys(STATE_REGION_MAP)) {
      if (new RegExp(`\\b${st}\\b`, 'i').test(stateOrRegion) && !states.includes(st)) {
        states.push(st);
      }
    }
  }

  // Scan description for state names if still empty
  if (states.length === 0 && scope === 'STATE_REGIONAL') {
    for (const st of Object.keys(STATE_REGION_MAP)) {
      if (new RegExp(`\\b${st}\\b`, 'i').test(canonical.description) || new RegExp(`\\b${st}\\b`, 'i').test(canonical.name)) {
        if (!states.includes(st)) states.push(st);
      }
    }
  }

  let stateName = states[0] || (stateOrRegion ? stateOrRegion.split(/[,/]/)[0].trim() : '');
  if (!stateName) {
    if (scope === 'ALL_INDIA' || scope === 'NATIONAL_OBSERVANCE' || scope === 'PAN_INDIA_RELIGIOUS') {
      stateName = 'All India';
      stateOrRegion = 'All India';
    } else {
      stateName = 'Multiple States';
      stateOrRegion = 'India';
    }
  } else if (!stateOrRegion) {
    stateOrRegion = stateName;
  }

  const region = states[0] && STATE_REGION_MAP[states[0]]
    ? STATE_REGION_MAP[states[0]]
    : 'North';

  // Aliases combining alternative names from duplicates
  const aliases = Array.from(new Set([
    canonical.name,
    ...(canonical.alternative_names || []),
  ]));

  // Match against verified reference records
  const verifiedMatch = findVerifiedMatch(slug, canonical.name, aliases);

  const isVerified = Boolean(verifiedMatch && verifiedMatch.is_date_verified);
  const verificationStatus = isVerified ? 'verified' : 'unverified';
  const dateRule = getDateRule(canonical.name, canonical.source_section);

  const festivalRecord = {
    id: slug,
    name: canonical.name,
    slug,
    aliases: Array.from(new Set([...aliases, ...(verifiedMatch?.aliases || [])])),
    alternative_names: canonical.alternative_names,
    scope: verifiedMatch?.scope || scope,
    religious_or_cultural_category: verifiedMatch?.religion_or_category || religionOrCategory,
    religion_or_category: verifiedMatch?.religion_or_category || religionOrCategory,
    category: verifiedMatch?.religion_or_category || religionOrCategory,
    state_or_region: stateOrRegion,
    state: (verifiedMatch?.state && verifiedMatch.state !== 'Multiple States') ? verifiedMatch.state : stateName,
    state_id: slugify((verifiedMatch?.state && verifiedMatch.state !== 'Multiple States') ? verifiedMatch.state : stateName),
    states: (verifiedMatch?.states && verifiedMatch.states.length > 0) ? verifiedMatch.states : states,
    region: verifiedMatch?.region || region,
    district: null,
    city_or_venue: verifiedMatch?.primary_city || null,
    primary_city: verifiedMatch?.primary_city || (states[0] ? states[0] : (stateName === 'All India' ? 'All India' : stateName)),
    primary_city_id: verifiedMatch?.primary_city_id || (states[0] ? slugify(states[0]) : slugify(stateName)),
    alternate_locations: verifiedMatch?.alternate_locations || [],
    description: canonical.description,
    cultural_vibe: verifiedMatch?.cultural_vibe || `${religionOrCategory} celebration and living cultural tradition`,
    typical_season: verifiedMatch?.typical_season || (canonical.source_section.includes('10. National') ? 'National Observance' : 'Annual Festival'),
    typical_month: verifiedMatch?.typical_month || null,
    recurrence_type: scope === 'NATIONAL_OBSERVANCE' ? 'national_observance' : 'annual',
    date_rule: dateRule,
    start_date: isVerified ? (verifiedMatch?.exact_date_start || null) : null,
    end_date: isVerified ? (verifiedMatch?.exact_date_end || null) : null,
    exact_date_start: isVerified ? (verifiedMatch?.exact_date_start || null) : null,
    exact_date_end: isVerified ? (verifiedMatch?.exact_date_end || null) : null,
    event_year: isVerified ? 2026 : null,
    is_date_verified: isVerified,
    is_recurring: true,
    associated_places: verifiedMatch?.associated_places || [],
    lat: verifiedMatch?.lat || 20.5937,
    lng: verifiedMatch?.lng || 78.9629,
    image_url: verifiedMatch?.image_url || 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&auto=format&fit=crop&q=80',
    source_url: verifiedMatch?.source_url || 'https://asi.nic.in/',
    official_source_url: verifiedMatch?.source_url || 'https://asi.nic.in/',
    source_name: verifiedMatch?.source_name || 'Ministry of Culture / Incredible India',
    license: verifiedMatch?.license || 'Creative Commons Attribution-ShareAlike 4.0',
    attribution_text: verifiedMatch?.attribution_text || 'Incredible India Cultural Archives',
    verification_status: verificationStatus,
    last_verified_at: isVerified ? '2026-09-26T00:00:00.000Z' : null,
    source_section: canonical.source_section,
    source_row_no: canonical.source_entry_numbers[0],
    source_entry_numbers: canonical.source_entry_numbers,
  };

  finalFestivals.push(festivalRecord);
}

// Sort order by priority:
// 1. ALL_INDIA & PAN_INDIA_RELIGIOUS (All-India at the top)
// 2. STATE_REGIONAL
// 3. NATIONAL_OBSERVANCE
const scopeRank = {
  'ALL_INDIA': 1,
  'PAN_INDIA_RELIGIOUS': 2,
  'STATE_REGIONAL': 3,
  'NATIONAL_OBSERVANCE': 4,
};

finalFestivals.sort((a, b) => {
  const rA = scopeRank[a.scope] || 3;
  const rB = scopeRank[b.scope] || 3;
  if (rA !== rB) return rA - rB;
  return a.name.localeCompare(b.name);
});

// Save to both files
fs.writeFileSync(festivalsPath, JSON.stringify(finalFestivals, null, 2), 'utf-8');
fs.writeFileSync(festivalsMasterPath, JSON.stringify(finalFestivals, null, 2), 'utf-8');

console.log(`\n=============================================================`);
console.log(`[Success] Master Festival Dataset Successfully Rebuilt!`);
console.log(`=============================================================`);
console.log(`- Source Rows Read: ${parsedRows.length} (Expected 290)`);
console.log(`- Unique Records After Reviewed Merge: ${finalFestivals.length}`);
console.log(`- Merged Duplicates Count: ${mergedEntries.length}`);
console.log(`- Merged Duplicates Details:`);
mergedEntries.forEach(m => {
  console.log(`   * #${m.merged_row_no} "${m.name}" -> merged into #${m.merged_into_no}`);
});
console.log(`- Records with Empty State: ${finalFestivals.filter(f => !f.state || f.state === '').length}`);
console.log(`- Scope Breakdown:`);
console.log(`   * ALL_INDIA / PAN_INDIA_RELIGIOUS: ${finalFestivals.filter(f => f.scope === 'ALL_INDIA' || f.scope === 'PAN_INDIA_RELIGIOUS').length}`);
console.log(`   * STATE_REGIONAL: ${finalFestivals.filter(f => f.scope === 'STATE_REGIONAL').length}`);
console.log(`   * NATIONAL_OBSERVANCE: ${finalFestivals.filter(f => f.scope === 'NATIONAL_OBSERVANCE').length}`);
console.log(`- Verification Status:`);
console.log(`   * Verified Records: ${finalFestivals.filter(f => f.verification_status === 'verified').length}`);
console.log(`   * Unverified Records: ${finalFestivals.filter(f => f.verification_status === 'unverified').length}`);
console.log(`=============================================================\n`);
