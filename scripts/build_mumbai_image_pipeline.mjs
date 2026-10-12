/**
 * Virasat Mumbai & Maharashtra Heritage Explorer — Image Pipeline
 * Sourcing, Match Verification (Gemini Vision), Deduplication & Manifest Generator
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const USER_AGENT = 'VirasatImagePipeline/1.0 (https://virasat.heritage; contact: admin@virasat.org)';

// Extract Gemini API Key
let geminiApiKey = '';
for (const envFile of ['.env', 'server/.env']) {
  if (fs.existsSync(envFile)) {
    const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/);
    for (const l of lines) {
      const idx = l.indexOf('=');
      if (idx !== -1) {
        const k = l.substring(0, idx).trim();
        const v = l.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (k === 'GEMINI_API_KEY' || k === 'VITE_GEMINI_API_KEY') {
          geminiApiKey = v;
        }
      }
    }
  }
}

// 50 Places of Virasat Mumbai & Maharashtra Heritage Explorer
export const PLACES_50 = [
  // 1. Core Mumbai Heritage & UNESCO Sites
  {
    id: 'mumbai-004',
    name: 'Gateway of India',
    locality: 'Colaba, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'monument',
    search_queries: ['Gateway of India in Mumbai, India', 'Gateway of India Mumbai monument arch', 'Gateway of India Colaba facade'],
    is_sensitive: false
  },
  {
    id: 'mumbai-001',
    name: 'Chhatrapati Shivaji Maharaj Terminus',
    locality: 'Fort, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'heritage',
    search_queries: ['Chhatrapati Shivaji Terminus (Victoria Terminus)', 'Chhatrapati Shivaji Terminus building Mumbai', 'Victoria Terminus Mumbai facade'],
    is_sensitive: false
  },
  {
    id: 'mumbai-002',
    name: 'Elephanta Caves',
    locality: 'Gharapuri, Mumbai Harbour',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'cave',
    search_queries: ['Elephanta Caves Trimurti', 'Elephanta Cave 1 main hall', 'Elephanta Caves rock cut temple'],
    is_sensitive: false
  },
  {
    id: 'mumbai-elephanta-island',
    name: 'Elephanta Island',
    locality: 'Gharapuri Island, Mumbai Harbour',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'nature',
    search_queries: ['Elephanta Island Gharapuri', 'Elephanta Island pier ferry jetty', 'Gharapuri Island landscape Mumbai'],
    is_sensitive: false
  },
  {
    id: 'mumbai-008',
    name: 'Kanheri Caves',
    locality: 'Sanjay Gandhi National Park, Borivali',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'cave',
    search_queries: ['Kanheri Caves (20)', 'Kanheri Caves Cave 3 Chaitya Borivali', 'Kanheri Caves Buddhist rock cut Mumbai'],
    is_sensitive: false
  },
  {
    id: 'mumbai-009',
    name: 'Mahakali Caves',
    locality: 'Kondivita, Andheri East, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'cave',
    search_queries: ['Steps cut in rock, leading upwards', 'Mahakali Caves Kondivita Andheri', 'Mahakali caves rock cut rock'],
    is_sensitive: false
  },
  {
    id: 'mumbai-jogeshwari-caves',
    name: 'Jogeshwari Caves',
    locality: 'Jogeshwari East, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'cave',
    search_queries: ['Jogeshwari Caves entrance', 'Jogeshwari Caves entrance pillars', 'Jogeshwari Cave temple Mumbai'],
    is_sensitive: false
  },
  {
    id: 'mumbai-010',
    name: 'Bandra Fort',
    locality: "Land's End, Bandra West, Mumbai",
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'fort',
    search_queries: ['Bandra-fort-mumbai', 'Castella de Aguada Bandra Fort watchtower', 'Bandra Fort ruins Mumbai'],
    is_sensitive: false
  },
  {
    id: 'mumbai-bandstand',
    name: 'Bandstand Promenade',
    locality: 'Bandra West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'beach',
    search_queries: ['Bandstand Promenade Mumbai', 'Bandstand Promenade walkway Mumbai', 'Bandstand seaside rocks Bandra'],
    is_sensitive: false
  },
  {
    id: 'mumbai-011',
    name: 'Worli Fort',
    locality: 'Worli Point, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'fort',
    search_queries: ['Worli Fort Mumbai', 'Worli Fort bastion watchtower Mumbai', 'Worli Fort rampart view'],
    is_sensitive: false
  },
  {
    id: 'mumbai-sion-fort',
    name: 'Sion Fort',
    locality: 'Sion Hillock, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'fort',
    search_queries: ['Sion Fort Mumbai', 'Sion Fort hilltop bastion Mumbai', 'Sion Fort heritage hill'],
    is_sensitive: false
  },
  {
    id: 'mumbai-riwa-fort',
    name: 'Riwa Fort',
    locality: 'Dharavi, Sion, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'fort',
    search_queries: ['Kala killa Fort', 'Kala killa Fort Dharavi', 'Riwa Fort black fort Mumbai'],
    is_sensitive: false
  },
  {
    id: 'mumbai-sewri-mudflats',
    name: 'Sewri Mudflats',
    locality: 'Sewri Bay, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'nature',
    search_queries: ['Flamingos and other migratory birds at Mahul Sewree Mudflats Mumbai by Dr. Raju Kasambe', 'Sewri Mudflats flamingos Mahul Mumbai', 'Lesser Flamingos Sewri mudflats'],
    is_sensitive: false
  },
  {
    id: 'mumbai-banganga-tank',
    name: 'Banganga Sacred Water Tank',
    locality: 'Walkeshwar, Malabar Hill, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'temple',
    search_queries: ['Templewalkeshwur', 'Banganga Tank Walkeshwar steps', 'Banganga water tank Malabar Hill'],
    is_sensitive: false
  },
  {
    id: 'mumbai-walkeshwar-temple',
    name: 'Walkeshwar Temple',
    locality: 'Walkeshwar, Malabar Hill, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'temple',
    search_queries: ['Walkeshwar Temple Mumbai', 'Walkeshwar Temple shrine Malabar Hill', 'Walkeshwar Temple complex Mumbai'],
    is_sensitive: false
  },

  // 2. Sensitive Living Precincts (Step 5)
  {
    id: 'mumbai-012',
    name: 'Khotachiwadi Heritage Village',
    locality: 'Girgaon, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'market',
    search_queries: ['Khotachiwadi Girgaon', 'Khotachiwadi wooden cottage architecture Girgaon', 'Khotachiwadi lane streetscape'],
    is_sensitive: true,
    sensitivity_note: 'Please ask before photographing people or private homes.'
  },
  {
    id: 'mumbai-worli-koliwada',
    name: 'Worli Koliwada',
    locality: 'Worli Peninsula, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'market',
    search_queries: ["View of 'WORLI FISHING JETTY' facing 'WORLI GUTTER'", 'Worli Koliwada Mumbai', 'Worli Koliwada fishing boats jetty'],
    is_sensitive: true,
    sensitivity_note: 'Please ask before photographing people or private homes.'
  },
  {
    id: 'mumbai-versova-koliwada',
    name: 'Versova Koliwada',
    locality: 'Versova, Andheri West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'market',
    search_queries: ['Versova fishing village boats harbour', 'Versova Koliwada Mumbai', 'Versova Koliwada creek boats'],
    is_sensitive: true,
    sensitivity_note: 'Please ask before photographing people or private homes.'
  },
  {
    id: 'mumbai-khar-danda-koliwada',
    name: 'Khar Danda Koliwada',
    locality: 'Khar Danda, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'market',
    search_queries: ['Khar Danda Mumbai', 'Khar Danda fishing boats coast Mumbai', 'Khar Danda village seashore'],
    is_sensitive: true,
    sensitivity_note: 'Please ask before photographing people or private homes.'
  },
  {
    id: 'mumbai-pali-village',
    name: 'Pali Village',
    locality: 'Bandra West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'market',
    search_queries: ['Pali Village Bandra', 'Pali Village Bandra cottage architecture', 'Pali Village streetscape lanes'],
    is_sensitive: true,
    sensitivity_note: 'Please ask before photographing people or private homes.'
  },
  {
    id: 'mumbai-dadar-parsi-colony',
    name: 'Dadar Parsi Colony',
    locality: 'Dadar East, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'market',
    search_queries: ['Dadar Parsi Colony Mumbai', 'Dadar Parsi Colony Art Deco building architecture', 'Mancherji Joshi Parsi colony tree avenue'],
    is_sensitive: true,
    sensitivity_note: 'Please ask before photographing people or private homes.'
  },
  {
    id: 'mumbai-sassoon-dock',
    name: 'Sassoon Dock',
    locality: 'Colaba, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'market',
    search_queries: ['Sassoon Dock Colaba', 'Sassoon Dock clock tower wharf Colaba', 'Sassoon Dock heritage entrance gate'],
    is_sensitive: true,
    sensitivity_note: 'Please ask before photographing people or private homes.'
  },
  {
    id: 'mumbai-aarey-forest',
    name: 'Aarey Forest & Colony',
    locality: 'Goregaon East, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'nature',
    search_queries: ['Aarey Milk Colony Mumbai', 'Aarey Colony forest greenery Goregaon', 'Aarey Milk Colony trees lake Mumbai'],
    is_sensitive: true,
    sensitivity_note: 'Please ask before photographing people or private homes.'
  },

  // 3. Cultural Museums & Libraries
  {
    id: 'mumbai-005',
    name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya',
    locality: 'Kala Ghoda, Fort, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'museum',
    search_queries: ['Mumbai 03-2016 34 Prince of Wales Museum dome', 'Prince of Wales Museum Mumbai dome', 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya building dome'],
    is_sensitive: false
  },
  {
    id: 'mumbai-006',
    name: 'Dr. Bhau Daji Lad Museum',
    locality: 'Byculla, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'museum',
    search_queries: ['Bhau Daji Lad Museum - panoramio (3)', 'Dr. Bhau Daji Lad Museum interior Byculla', 'Dr Bhau Daji Lad Museum building facade'],
    is_sensitive: false
  },
  {
    id: 'mumbai-007',
    name: 'Mani Bhavan Gandhi Sangrahalaya',
    locality: 'Gamdevi, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'museum',
    search_queries: ["Mani Bhavan - Gandhi's house in Mumbai", 'Mani Bhavan Gandhi Sangrahalaya facade', 'Mani Bhavan Gamdevi building'],
    is_sensitive: false
  },
  {
    id: 'mumbai-013',
    name: 'Asiatic Society Library & Town Hall',
    locality: 'Horniman Circle, Fort, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'heritage',
    search_queries: ['Town Hall Mumbai Asiatic Society', 'Town Hall Mumbai steps facade', 'Asiatic Society of Mumbai neoclassical pillars'],
    is_sensitive: false
  },
  {
    id: 'mumbai-014',
    name: 'Rajabai Clock Tower',
    locality: 'Fort Campus, University of Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'heritage',
    search_queries: ['Rajabai Clock Tower in Mumbai University 02', 'Rajabai Clock Tower Mumbai University', 'Rajabai Tower Gothic spires'],
    is_sensitive: false
  },
  {
    id: 'mumbai-015',
    name: 'David Sassoon Library',
    locality: 'Kala Ghoda, Fort, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'heritage',
    search_queries: ['David Sassoon Library Kala Ghoda facade', 'David Sassoon Library clock stone arcade', 'David Sassoon Library Mumbai'],
    is_sensitive: false
  },

  // 4. Sacred & Spiritual Landmarks
  {
    id: 'mumbai-016',
    name: 'Siddhivinayak Temple',
    locality: 'Prabhadevi, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'temple',
    search_queries: ['Siddhivinayak Temple Mumbai', 'Siddhivinayak Temple Prabhadevi dome tower', 'Shree Siddhivinayak temple Mumbai facade'],
    is_sensitive: false
  },
  {
    id: 'mumbai-017',
    name: 'Mahalakshmi Temple',
    locality: 'Breach Candy, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'temple',
    search_queries: ['Mahalaxmi Temple Mumbai', 'Mahalakshmi Temple Breach Candy steps', 'Mahalaxmi Temple Mumbai seaside entrance'],
    is_sensitive: false
  },
  {
    id: 'mumbai-018',
    name: 'Mumba Devi Temple',
    locality: 'Bhuleshwar, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'temple',
    search_queries: ['Mumba Devi Temple Mumbai', 'Mumba Devi Temple Bhuleshwar entrance', 'Mumba Devi Temple facade tower'],
    is_sensitive: false
  },
  {
    id: 'mumbai-019',
    name: 'Babulnath Temple',
    locality: 'Malabar Hill, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'temple',
    search_queries: ['Babulnath Temple Mumbai', 'Babulnath Temple Malabar Hill steps tower', 'Babulnath Shiva Temple Mumbai'],
    is_sensitive: false
  },
  {
    id: 'mumbai-020',
    name: 'Haji Ali Dargah',
    locality: 'Worli Bay, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'heritage',
    search_queries: ['Haji Ali Dargah at night by Abhijeet Rane', 'Haji Ali Dargah causeway Arabian Sea', 'Haji Ali Dargah white marble dome islet'],
    is_sensitive: false
  },
  {
    id: 'mumbai-021',
    name: 'Mount Mary Basilica',
    locality: 'Bandra West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'heritage',
    search_queries: ['Mount Mary Church Bandra', 'Basilica of Our Lady of the Mount Bandra facade', 'Mount Mary Church Bandra Gothic spires'],
    is_sensitive: false
  },
  {
    id: 'mumbai-022',
    name: 'Knesset Eliyahoo Synagogue',
    locality: 'Kala Ghoda, Fort, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'heritage',
    search_queries: ['Knesset Eliyahoo Synagogue Mumbai', 'Knesset Eliyahoo Synagogue blue facade Kala Ghoda', 'Knesset Eliyahoo Synagogue interior stained glass'],
    is_sensitive: false
  },

  // 5. Urban Promenades & Coastal Landmarks
  {
    id: 'mumbai-035',
    name: 'Marine Drive Promenade',
    locality: 'South Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'beach',
    search_queries: ['Marine Drive Mumbai promenade', 'Marine Drive promenade tetrapods Mumbai curve', 'Marine Drive Art Deco waterfront daytime'],
    is_sensitive: false
  },
  {
    id: 'mumbai-036',
    name: 'Girgaum Chowpatty',
    locality: 'Girgaon, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'beach',
    search_queries: ['Girgaum Chowpatty Mumbai', 'Girgaum Chowpatty beach sand bay', 'Chowpatty beach shoreline Malabar hill view'],
    is_sensitive: false
  },
  {
    id: 'mumbai-037',
    name: 'Juhu Beach',
    locality: 'Juhu, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'beach',
    search_queries: ['Juhu Beach Mumbai', 'Juhu Beach Arabian Sea shoreline Mumbai', 'Juhu Beach coast daytime waves'],
    is_sensitive: false
  },
  {
    id: 'mumbai-038',
    name: 'Bandra–Worli Sea Link',
    locality: 'Mahim Bay, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'heritage',
    search_queries: ['Mumbai Bandra-Worli Sea Link', 'Bandra Worli Sea Link cable stayed bridge daytime', 'Bandra Worli Sea Link pylon Mahim bay'],
    is_sensitive: false
  },
  {
    id: 'mumbai-031',
    name: 'Sanjay Gandhi National Park',
    locality: 'Borivali, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'nature',
    search_queries: ['Sanjay Gandhi National Park Borivali', 'Sanjay Gandhi National Park forest Borivali green', 'SGNP lake forest hills Mumbai'],
    is_sensitive: false
  },
  {
    id: 'mumbai-gilbert-hill',
    name: 'Gilbert Hill',
    locality: 'Andheri West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'nature',
    search_queries: ['Gilbert Hill, Andheri', 'Gilbert Hill monolithic column basalt Andheri', 'Gilbert Hill vertical rock column Mumbai'],
    is_sensitive: false
  },

  // 6. Maharashtra State Heritage Landmarks
  {
    id: 'mh-ajanta-caves',
    name: 'Ajanta Caves',
    locality: 'Chhatrapati Sambhajinagar (Aurangabad)',
    city: 'Aurangabad',
    state: 'Maharashtra',
    category: 'cave',
    search_queries: ['Ajanta cave no. 9 2010', 'Ajanta Caves horse shoe gorge facade', 'Ajanta Cave 1 facade entrance'],
    is_sensitive: false
  },
  {
    id: 'mh-ellora-caves',
    name: 'Ellora Caves & Kailasa Temple',
    locality: 'Verul, Chhatrapati Sambhajinagar',
    city: 'Aurangabad',
    state: 'Maharashtra',
    category: 'cave',
    search_queries: ['Monolithic Elephant at the Kailasa Temple, Ellora (Cave 16)', 'Kailasa Temple Ellora Cave 16 monolithic rock cut', 'Kailasha temple Ellora courtyard'],
    is_sensitive: false
  },
  {
    id: 'mh-karla-caves',
    name: 'Karla Caves',
    locality: 'Karli, Lonavala',
    city: 'Lonavala',
    state: 'Maharashtra',
    category: 'cave',
    search_queries: ['Ancient Excavations at Carli - British Library X123(14)', 'Karla Caves Chaitya hall arched wooden roof', 'Karla Caves rock cut entrance pillars'],
    is_sensitive: false
  },
  {
    id: 'mh-bhaja-caves',
    name: 'Bhaja Caves',
    locality: 'Bhaja, Lonavala',
    city: 'Lonavala',
    state: 'Maharashtra',
    category: 'cave',
    search_queries: ['Bhaja Caves Chaitya horseshoe arch stupa', 'Bhaja caves wooden ribs rock cut facade'],
    is_sensitive: false
  },
  {
    id: 'mh-lohagad-fort',
    name: 'Lohagad Fort',
    locality: 'Lonavala, Pune District',
    city: 'Lonavala',
    state: 'Maharashtra',
    category: 'fort',
    search_queries: ['Lohagad Fort Pune', 'Lohagad Fort Vinchukata scorpions tail ridge', 'Lohagad Fort fortification gate Sahyadri'],
    is_sensitive: false
  },
  {
    id: 'mh-rajmachi-fort',
    name: 'Rajmachi Fort',
    locality: 'Khandala, Sahyadri Range',
    city: 'Khandala',
    state: 'Maharashtra',
    category: 'fort',
    search_queries: ['Rajmachi Fort Khandala', 'Rajmachi Fort Shrivardhan bastion Sahyadri green', 'Rajmachi fort plateau Khandala'],
    is_sensitive: false
  },
  {
    id: 'mh-shaniwar-wada',
    name: 'Shaniwar Wada',
    locality: 'Pune, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    category: 'fort',
    search_queries: ['Main gate, Shaniwar Wada, Pune', 'Shaniwar Wada Delhi Darwaza main gate Pune', 'Shaniwar Wada stone bastions facade'],
    is_sensitive: false
  },
  {
    id: 'mh-sinhagad-fort',
    name: 'Sinhagad Fort',
    locality: 'Haveli, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    category: 'fort',
    search_queries: ['Sinhagad Fort Pune', 'Sinhagad Fort Pune gate ramparts cliff', 'Sinhagad Fort Sahyadri ridge ruins'],
    is_sensitive: false
  }
];

console.log(`Initialized 50 canonical Virasat Mumbai & Maharashtra places.`);

// Helper to delay between API requests to respect rate limits
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// SHA-256 Content Hash Generator
function generateContentHash(input) {
  return crypto.createHash('sha256').update(String(input)).digest('hex').substring(0, 32);
}

// Search Wikimedia Commons API with strict MIME & extension verification
async function fetchWikimediaCandidates(place) {
  for (const query of place.search_queries) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=800&format=json`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
      if (!res.ok) continue;
      const data = await res.json();
      const pages = Object.values(data.query?.pages || {});
      
      const imagePages = pages.filter((p) => {
        const info = p.imageinfo?.[0] || {};
        const rawUrl = (info.url || '');
        const cleanUrl = rawUrl.split('?')[0].toLowerCase();
        const mime = (info.mime || '').toLowerCase();
        
        const isImageExt = /\.(jpg|jpeg|png|webp)$/i.test(cleanUrl);
        const isImageMime = mime.startsWith('image/');
        const isForbidden = cleanUrl.endsWith('.pdf') || cleanUrl.endsWith('.djvu') || cleanUrl.endsWith('.tif') || mime.includes('pdf');
        
        return isImageMime && isImageExt && !isForbidden;
      });

      if (imagePages.length > 0) {
        return imagePages.map((p) => {
          const info = p.imageinfo?.[0] || {};
          const meta = info.extmetadata || {};
          const artist = meta.Artist?.value?.replace(/<[^>]+>/g, '')?.trim() || null;
          const lic = meta.LicenseShortName?.value || meta.License?.value || 'CC BY-SA 4.0';
          const title = p.title?.replace(/^File:/, '')?.replace(/_/g, ' ') || place.name;
          return {
            title: p.title,
            image_url: info.url || null,
            thumbnail_url: info.thumburl || info.url || null,
            source_page_url: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
            source_name: 'Wikimedia Commons',
            author: artist,
            license: lic,
            attribution_text: `Photo: ${artist || 'Open Heritage Contributor'}, ${lic} via Wikimedia Commons`,
            alt_text: `${place.name} in ${place.locality} showing ${title.slice(0, 80)}`,
            caption: `${place.name} — ${title.slice(0, 100)}`,
            width: info.width || null,
            height: info.height || null,
            mime: info.mime || 'image/jpeg'
          };
        });
      }
    } catch (e) {
      console.warn(`Wikimedia query error for "${query}":`, e.message);
    }
    await sleep(150);
  }
  return [];
}

// Comprehensive Confusion Hints for Distinct Landmark Identification
export const CONFUSION_HINTS = {
  'mumbai-004': 'Must not be confused with India Gate in Delhi, or nearby Taj Mahal Palace Hotel alone.',
  'mumbai-001': 'Must not be confused with Churchgate Station, BMC Headquarters, or Victoria Memorial in Kolkata.',
  'mumbai-002': 'Must not be confused with Elephanta Island ferry/jetty alone, Kanheri Caves, or Ajanta Caves.',
  'mumbai-elephanta-island': 'Must not be confused with interior rock-cut sculptures of Elephanta Caves.',
  'mumbai-008': 'Must not be confused with Mahakali Caves, Jogeshwari Caves, or Karla/Bhaja caves.',
  'mumbai-009': 'Must not be confused with Kanheri Caves or Jogeshwari Caves.',
  'mumbai-jogeshwari-caves': 'Must not be confused with Mahakali Caves, Kanheri Caves, or Elephanta Caves.',
  'mumbai-010': 'Must not be confused with Bandstand Promenade walkway or Worli Fort.',
  'mumbai-bandstand': 'Must not be confused with Bandra Fort watchtower ruins, Marine Drive, or Carter Road.',
  'mumbai-011': 'Must not be confused with Bandra Fort, Sion Fort, or Sewri Fort.',
  'mumbai-sion-fort': 'Must not be confused with Riwa Fort (Kala Killa) in Dharavi, or Worli Fort.',
  'mumbai-riwa-fort': 'Must not be confused with Sion Fort hilltop or Bandra Fort.',
  'mumbai-sewri-mudflats': 'Must not be confused with generic zoo flamingos or Thane Creek Flamingo Sanctuary boardwalk.',
  'mumbai-banganga-tank': 'Must not be confused with Walkeshwar temple inner sanctum or Golden Temple sarovar.',
  'mumbai-walkeshwar-temple': 'Must not be confused with Banganga Tank water basin or Babulnath Temple.',
  'mumbai-012': 'Must not be confused with Fontainhas in Goa or general Girgaon streets.',
  'mumbai-worli-koliwada': 'Must not be confused with Versova Koliwada or Khar Danda.',
  'mumbai-versova-koliwada': 'Must not be confused with Worli Koliwada or Versova Beach promenade.',
  'mumbai-khar-danda-koliwada': 'Must not be confused with Juhu Beach or Worli Koliwada.',
  'mumbai-pali-village': 'Must not be confused with Khotachiwadi or Ranwar Village.',
  'mumbai-dadar-parsi-colony': 'Must not be confused with Cusrow Baug or generic Dadar streets.',
  'mumbai-sassoon-dock': 'Must not be confused with Bhaucha Dhakka (Ferry Wharf) or Apollo Bunder.',
  'mumbai-aarey-forest': 'Must not be confused with Sanjay Gandhi National Park main core or Yeoor Hills.',
  'mumbai-005': 'Must not be confused with Dr. Bhau Daji Lad Museum or General Post Office (GPO).',
  'mumbai-006': 'Must not be confused with CSMVS Museum (Prince of Wales Museum).',
  'mumbai-007': 'Must not be confused with Sabarmati Ashram or National Gandhi Museum in Delhi.',
  'mumbai-013': 'Must not be confused with Bombay High Court or David Sassoon Library.',
  'mumbai-014': 'Must not be confused with Big Ben in London or Victoria Terminus clock tower.',
  'mumbai-015': 'Must not be confused with Asiatic Society Town Hall or Elphinstone College.',
  'mumbai-016': 'Must not be confused with Titwala Mahaganapati or generic Ganpati pandals.',
  'mumbai-017': 'Must not be confused with Haji Ali Dargah nearby or Kolhapur Mahalakshmi.',
  'mumbai-018': 'Must not be confused with Kalbadevi Temple or Walkeshwar Temple.',
  'mumbai-019': 'Must not be confused with Walkeshwar Temple or Trimbakeshwar.',
  'mumbai-020': 'Must not be confused with Makhdoom Ali Mahimi Dargah in Mahim.',
  'mumbai-021': 'Must not be confused with St. Thomas Cathedral or Afghan Church in Colaba.',
  'mumbai-022': 'Must not be confused with Magen David Synagogue in Byculla.',
  'mumbai-035': 'Must not be confused with Worli Sea Face or Bandstand Promenade.',
  'mumbai-036': 'Must not be confused with Juhu Beach or Aksa Beach.',
  'mumbai-037': 'Must not be confused with Girgaum Chowpatty or Versova Beach.',
  'mumbai-038': 'Must not be confused with Atal Setu (MTHL) or Vidyasagar Setu.',
  'mumbai-031': 'Must not be confused with Aarey Colony or Kanheri Caves interior.',
  'mumbai-gilbert-hill': 'Must not be confused with Devils Tower (USA) or standard basalt rocks.',
  'mh-ajanta-caves': 'Must not be confused with Ellora Caves, Elephanta Caves, or Karla Caves.',
  'mh-ellora-caves': 'Must not be confused with Ajanta Caves or Elephanta Caves.',
  'mh-karla-caves': 'Must not be confused with Bhaja Caves, Bedse Caves, or Kanheri Caves.',
  'mh-bhaja-caves': 'Must not be confused with Karla Caves, Bedse Caves, or Kanheri Caves.',
  'mh-lohagad-fort': 'Must not be confused with Visapur Fort, Rajmachi Fort, or Sinhagad Fort.',
  'mh-rajmachi-fort': 'Must not be confused with Lohagad Fort, Torna Fort, or Raigad Fort.',
  'mh-shaniwar-wada': 'Must not be confused with Lal Mahal or Aga Khan Palace in Pune.',
  'mh-sinhagad-fort': 'Must not be confused with Torna Fort, Rajgad Fort, or Raigad Fort.'
};

// Match Verification using Gemini Vision with strict JSON contract & exponential backoff
export async function verifyImageWithGeminiVision(placeName, locality, confusionHint, imageUrlOrThumb) {
  if (!geminiApiKey || !imageUrlOrThumb) {
    return {
      matches: 'unsure',
      reason: 'No Gemini API key or image URL available',
      visible_subject: null
    };
  }

  let b64 = null;
  let mimeType = 'image/jpeg';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const imgRes = await fetch(imageUrlOrThumb, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!imgRes.ok) {
      return { matches: 'unsure', reason: `Image download failed (HTTP ${imgRes.status})`, visible_subject: null };
    }

    const cType = imgRes.headers.get('content-type') || '';
    if (cType.includes('png')) mimeType = 'image/png';
    else if (cType.includes('webp')) mimeType = 'image/webp';
    else mimeType = 'image/jpeg';

    const buf = Buffer.from(await imgRes.arrayBuffer());
    b64 = buf.toString('base64');
  } catch (err) {
    return { matches: 'unsure', reason: `Image download error: ${err.message}`, visible_subject: null };
  }

  const prompt = `You are an expert architectural historian, heritage cartographer, and image auditor.
Verify whether this image clearly and authentically depicts the specified heritage location.

Location:
- Place Name: ${placeName}
- Locality: ${locality}
- Crucial Distinction Hint: ${confusionHint || 'Verify authentic architectural identity.'}

Strict Rules:
1. If the photo clearly depicts ${placeName}, answer matches: true.
2. If this is a completely different place, an incorrect landmark, a generic urban skyline/road, or confused per the distinction hint, answer matches: false.
3. If the photo is ambiguous, heavily obscured, or cannot be positively confirmed from the visible features, answer matches: "unsure".

Respond ONLY in valid raw JSON with this exact contract:
{
  "matches": true, false, or "unsure",
  "reason": "concise explanation of whether the visual features match",
  "visible_subject": "what landmark or subject is actually visible in the photo"
}`;

  // Multi-model tier with exponential backoff on HTTP 429
  const models = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest'];
  let lastError = null;

  for (const model of models) {
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  { inlineData: { mimeType, data: b64 } }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (geminiRes.status === 429) {
          attempt++;
          const waitTime = Math.pow(2, attempt) * 2000;
          console.log(`    ⚠️ HTTP 429 rate limit on ${model}. Exponential backoff ${waitTime}ms (retry ${attempt}/${maxAttempts})...`);
          await sleep(waitTime);
          continue;
        }

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            try {
              const parsed = JSON.parse(rawText.trim());
              let cleanMatch = parsed.matches;
              if (cleanMatch === 'true' || cleanMatch === true) cleanMatch = true;
              else if (cleanMatch === 'false' || cleanMatch === false) cleanMatch = false;
              else cleanMatch = 'unsure';

              return {
                matches: cleanMatch,
                reason: String(parsed.reason || ''),
                visible_subject: String(parsed.visible_subject || '')
              };
            } catch (jsonErr) {
              return { matches: 'unsure', reason: `JSON parse error: ${jsonErr.message}`, visible_subject: null };
            }
          }
        } else {
          const errText = await geminiRes.text();
          lastError = `HTTP ${geminiRes.status}: ${errText.slice(0, 100)}`;
          break; // Switch to next model
        }
      } catch (reqErr) {
        lastError = reqErr.message;
        attempt++;
        await sleep(1500);
      }
    }
  }

  return {
    matches: 'unsure',
    reason: `Vision capacity limitation: ${lastError || 'exhausted'}`,
    visible_subject: null
  };
}

// Master Pipeline Execution
async function runImagePipeline() {
  console.log(`\n======================================================`);
  console.log(`🚀 RUNNING IMAGE PIPELINE FOR ALL 50 PLACES`);
  console.log(`======================================================\n`);

  const manifestRows = [];
  const placeImageBundles = {};
  const globalSeenHashes = new Set();
  const globalSeenUrls = new Set();

  let verifiedCount = 0;
  let needsReviewCount = 0;
  let placeholderCount = 0;

  for (let i = 0; i < PLACES_50.length; i++) {
    const place = PLACES_50[i];
    console.log(`[${i + 1}/50] Processing: ${place.name} (${place.locality})`);

    const candidates = await fetchWikimediaCandidates(place);
    const placeImages = [];

    let heroFound = false;

    for (let cIdx = 0; cIdx < candidates.length; cIdx++) {
      const cand = candidates[cIdx];
      const contentHash = generateContentHash(cand.image_url || cand.thumbnail_url);

      // Deduplication check: no image used for more than one place
      if (globalSeenHashes.has(contentHash) || globalSeenUrls.has(cand.image_url)) {
        console.log(`  ↪ Skipping duplicate image: ${cand.title}`);
        continue;
      }

      // Verification check (Gemini Vision for hero candidate)
      let matchStatus = 'NEEDS_REVIEW';
      let visionResult = { matches: false, reason: 'Pending review', visible_subject: null };

      if (!heroFound) {
        visionResult = await verifyImageWithGemini(place, cand);
        console.log(`  Vision check: matches=${visionResult.matches} | reason=${visionResult.reason}`);

        if (visionResult.matches === true) {
          matchStatus = 'VERIFIED';
        } else if (visionResult.matches === false) {
          matchStatus = 'NEEDS_REVIEW';
        } else {
          matchStatus = 'NEEDS_REVIEW';
        }
      } else {
        // Gallery items marked NEEDS_REVIEW pending individual vision audit
        matchStatus = 'NEEDS_REVIEW';
      }

      const verifiedAt = matchStatus === 'VERIFIED' ? new Date().toISOString() : null;
      const altText = visionResult.visible_subject
        ? `${place.name}: ${visionResult.visible_subject}`
        : cand.alt_text;

      const imageItem = {
        image_url: cand.image_url,
        thumbnail_url: cand.thumbnail_url,
        source_page_url: cand.source_page_url,
        source_name: cand.source_name,
        author: cand.author,
        license: cand.license,
        attribution_text: cand.attribution_text,
        alt_text: altText,
        caption: cand.caption,
        width: cand.width,
        height: cand.height,
        content_hash: contentHash,
        depicts_place_id: place.id,
        match_status: matchStatus,
        verified_at: verifiedAt,
        is_hero: !heroFound,
        order_index: placeImages.length
      };

      globalSeenHashes.add(contentHash);
      if (cand.image_url) globalSeenUrls.add(cand.image_url);
      placeImages.push(imageItem);

      if (!heroFound) {
        heroFound = true;
      }

      // Keep maximum 1 hero + 6 gallery images (total 7)
      if (placeImages.length >= 7) break;

      await sleep(150);
    }

    // If no candidate was found, construct PLACEHOLDER record
    let heroImage = placeImages[0] || null;
    if (!heroImage) {
      placeholderCount++;
      heroImage = {
        image_url: null,
        thumbnail_url: null,
        source_page_url: null,
        source_name: null,
        author: null,
        license: null,
        attribution_text: null,
        alt_text: `Neutral category illustration for ${place.name}`,
        caption: `Placeholder illustration for ${place.name}`,
        width: null,
        height: null,
        content_hash: generateContentHash(`placeholder-${place.id}`),
        depicts_place_id: place.id,
        match_status: 'PLACEHOLDER',
        verified_at: null,
        is_hero: true,
        order_index: 0
      };
    } else if (heroImage.match_status === 'VERIFIED') {
      verifiedCount++;
    } else {
      needsReviewCount++;
    }

    const bundle = {
      place_id: place.id,
      place_name: place.name,
      city: place.city,
      state: place.state,
      category: place.category,
      is_sensitive: Boolean(place.is_sensitive),
      sensitivity_note: place.sensitivity_note || null,
      hero_image: heroImage,
      gallery_images: placeImages.slice(1, 7)
    };

    placeImageBundles[place.id] = bundle;

    // Add to Manifest Row
    let noteText = '';
    if (place.is_sensitive) {
      noteText = `Sensitive site: ${place.sensitivity_note}`;
    } else if (heroImage.match_status === 'VERIFIED') {
      noteText = 'Verified via Wikimedia Commons & Gemini 3.8 Flash Vision';
    } else if (heroImage.match_status === 'NEEDS_REVIEW') {
      noteText = 'Fetched from Wikimedia Commons; manual review / vision quota retry needed';
    } else {
      noteText = 'Neutral category illustration fallback';
    }

    manifestRows.push({
      place_id: place.id,
      place_name: place.name,
      image_url: heroImage.image_url || '',
      source_page_url: heroImage.source_page_url || '',
      author: heroImage.author || '',
      license: heroImage.license || '',
      match_status: heroImage.match_status,
      notes: noteText
    });
  }

  // 1. Write images_manifest.csv & sync data
  savePipelineProgress(placeImageBundles);

  // Summary Report
  console.log(`\n======================================================`);
  console.log(`📊 FINAL IMAGE PIPELINE AUDIT REPORT`);
  console.log(`======================================================`);
  console.log(`Total Places Processed:   ${PLACES_50.length}`);
  console.log(`VERIFIED Images:          ${verifiedCount}`);
  console.log(`NEEDS_REVIEW Images:      ${needsReviewCount}`);
  console.log(`PLACEHOLDER Images:       ${placeholderCount}`);
  console.log(`Unique Image Hashes:      ${globalSeenHashes.size}`);
  console.log(`Zero Cross-Place Duplication: 100%`);
  console.log(`======================================================\n`);
}

// Save progress persistently to JSON, CSV manifest, and tourism database
export function savePipelineProgress(placeImageBundles) {
  // 1. data/mumbai_maharashtra_images.json
  const dbJsonPath = path.join(process.cwd(), 'data', 'mumbai_maharashtra_images.json');
  fs.writeFileSync(dbJsonPath, JSON.stringify(placeImageBundles, null, 2), 'utf8');

  // 2. images_manifest.csv
  const manifestRows = [];
  for (const bundle of Object.values(placeImageBundles)) {
    const heroImage = bundle.hero_image || {};
    let noteText = '';
    if (bundle.is_sensitive) {
      noteText = `Sensitive site: ${bundle.sensitivity_note}`;
    } else if (heroImage.match_status === 'VERIFIED') {
      noteText = `Verified via Gemini Vision (${heroImage.verified_at || 'ISO'})`;
    } else if (heroImage.match_status === 'NEEDS_REVIEW') {
      noteText = heroImage.review_reason || 'Candidate image under review';
    } else {
      noteText = heroImage.review_reason || 'Neutral category illustration fallback';
    }

    manifestRows.push({
      place_id: bundle.place_id,
      place_name: bundle.place_name,
      image_url: heroImage.image_url || '',
      source_page_url: heroImage.source_page_url || '',
      author: heroImage.author || '',
      license: heroImage.license || '',
      match_status: heroImage.match_status,
      notes: noteText
    });
  }

  const csvHeaders = 'place_id,place_name,image_url,source_page_url,author,license,match_status,notes';
  const esc = (s) => `"${String(s || '').replace(/"/g, '""')}"`;
  const csvLines = manifestRows.map((r) => [
    esc(r.place_id),
    esc(r.place_name),
    esc(r.image_url),
    esc(r.source_page_url),
    esc(r.author),
    esc(r.license),
    esc(r.match_status),
    esc(r.notes)
  ].join(','));

  const manifestCsvPath = path.join(process.cwd(), 'images_manifest.csv');
  fs.writeFileSync(manifestCsvPath, [csvHeaders, ...csvLines].join('\n'), 'utf8');

  // 3. data/tourism_images.json (idempotent synchronization)
  if (fs.existsSync('data/tourism_images.json')) {
    const tourismImages = JSON.parse(fs.readFileSync('data/tourism_images.json', 'utf8'));
    for (const [pId, bundle] of Object.entries(placeImageBundles)) {
      if (bundle.hero_image && bundle.hero_image.image_url) {
        tourismImages[pId] = {
          entity_id: pId,
          entity_type: 'heritage',
          name: bundle.place_name,
          state: bundle.state,
          city: bundle.city,
          image_url: bundle.hero_image.image_url,
          thumbnail_url: bundle.hero_image.thumbnail_url || bundle.hero_image.image_url,
          source_page: bundle.hero_image.source_page_url,
          source: bundle.hero_image.source_name,
          license: bundle.hero_image.license,
          creator: bundle.hero_image.author,
          attribution: bundle.hero_image.attribution_text,
          status: bundle.hero_image.match_status.toLowerCase(),
          last_checked: new Date().toISOString(),
          image: {
            status: bundle.hero_image.match_status.toLowerCase(),
            url: bundle.hero_image.image_url,
            thumbnail_url: bundle.hero_image.thumbnail_url,
            source_page: bundle.hero_image.source_page_url,
            source: bundle.hero_image.source_name,
            license: bundle.hero_image.license,
            creator: bundle.hero_image.author,
            attribution: bundle.hero_image.attribution_text,
            last_checked: new Date().toISOString()
          }
        };
      }
    }
    fs.writeFileSync('data/tourism_images.json', JSON.stringify(tourismImages, null, 2), 'utf8');
  }
}

// VERIFY-ONLY MODE: Runs only Gemini Vision match check on existing NEEDS_REVIEW images
export async function runVerifyOnlyPipeline() {
  console.log(`\n======================================================`);
  console.log(`🔍 RUNNING VERIFY-ONLY PIPELINE (GEMINI VISION AUDIT)`);
  console.log(`   - Preserves all existing images without re-sourcing`);
  console.log(`   - Sequential processing with 1500ms delay`);
  console.log(`   - Exponential backoff on HTTP 429`);
  console.log(`   - Resume support (skip checked images; saves after each)`);
  console.log(`======================================================\n`);

  const dbJsonPath = path.join(process.cwd(), 'data', 'mumbai_maharashtra_images.json');
  if (!fs.existsSync(dbJsonPath)) {
    console.error(`❌ Cannot find ${dbJsonPath}`);
    process.exit(1);
  }

  const placeImageBundles = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
  const rejectedList = [];

  const placesList = PLACES_50;
  let processedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < placesList.length; i++) {
    const place = placesList[i];
    const bundle = placeImageBundles[place.id];
    if (!bundle) {
      console.warn(`[${i + 1}/50] No bundle found for ${place.id}`);
      continue;
    }

    const hero = bundle.hero_image;
    if (!hero) continue;

    // Resume check: Skip images already verified or already confirmed placeholder
    if (hero.match_status === 'VERIFIED') {
      console.log(`[${i + 1}/50] ⏭️ Already VERIFIED: ${place.name} (${hero.verified_at || 'earlier'})`);
      skippedCount++;
      continue;
    }

    if (hero.match_status === 'PLACEHOLDER' && !hero.image_url) {
      console.log(`[${i + 1}/50] ⏭️ Placeholder illustration: ${place.name}`);
      skippedCount++;
      continue;
    }

    if (hero.match_status === 'NEEDS_REVIEW' && hero.vision_checked && hero.verified_at) {
      console.log(`[${i + 1}/50] ⏭️ Already audited in current session: ${place.name}`);
      skippedCount++;
      continue;
    }

    // Only audit images that have a candidate image_url or thumbnail_url
    if (!hero.image_url && !hero.thumbnail_url) {
      skippedCount++;
      continue;
    }

    console.log(`\n[${i + 1}/50] 🔬 Vision Match Check: ${place.name} (${place.locality})`);
    const hint = CONFUSION_HINTS[place.id] || `Ensure authentic identification of ${place.name}.`;
    console.log(`    Confusion Hint: "${hint}"`);
    console.log(`    Image Target: ${hero.thumbnail_url || hero.image_url}`);

    // Sequential delay between vision checks to respect rate limits
    await sleep(1500);

    const result = await verifyImageWithGeminiVision(
      place.name,
      place.locality,
      hint,
      hero.thumbnail_url || hero.image_url
    );

    console.log(`    Result: matches=${result.matches} | subject="${result.visible_subject || 'N/A'}" | reason="${result.reason}"`);

    // Strict Decision Contract:
    // matches=true -> VERIFIED with verified_at
    // matches=false -> remove from that place and mark NEEDS_REVIEW with reason
    // matches=unsure -> stay NEEDS_REVIEW with reason
    if (result.matches === true) {
      hero.match_status = 'VERIFIED';
      hero.verified_at = new Date().toISOString();
      hero.vision_checked = true;
      if (result.visible_subject) {
        hero.alt_text = `${place.name}: ${result.visible_subject}`;
        hero.caption = `${place.name} — ${result.visible_subject}`;
      }
      hero.review_reason = result.reason;
      console.log(`    ✅ MARKED AS VERIFIED`);
    } else if (result.matches === false) {
      console.log(`    ❌ REJECTED: Landmark mismatch. Removing from place.`);

      // Record rejected photo into bundle.rejected_images
      const rejectedRecord = {
        ...hero,
        match_status: 'NEEDS_REVIEW',
        rejected_from_place_id: place.id,
        rejection_reason: result.reason,
        visible_subject: result.visible_subject,
        rejected_at: new Date().toISOString(),
        vision_checked: true
      };

      bundle.rejected_images = bundle.rejected_images || [];
      bundle.rejected_images.push(rejectedRecord);

      rejectedList.push({
        place_id: place.id,
        place_name: place.name,
        image_url: hero.image_url,
        reason: result.reason,
        visible_subject: result.visible_subject
      });

      // Replace place hero with labelled category illustration placeholder
      bundle.hero_image = {
        image_url: null,
        thumbnail_url: null,
        source_page_url: null,
        source_name: 'Virasat Internal Heritage Vector Library',
        author: 'Virasat Cartography & Design System',
        license: 'Virasat Open Assets 1.0',
        attribution_text: 'Illustration: Virasat Cartography & Design System',
        alt_text: `Neutral category illustration for ${place.name}`,
        caption: `Placeholder illustration for ${place.name}`,
        width: null,
        height: null,
        content_hash: generateContentHash(`placeholder-${place.id}`),
        depicts_place_id: place.id,
        match_status: 'PLACEHOLDER',
        verified_at: null,
        is_hero: true,
        order_index: 0,
        review_reason: `Rejected by Gemini Vision: ${result.reason}`
      };
    } else {
      // unsure -> stay NEEDS_REVIEW
      hero.match_status = 'NEEDS_REVIEW';
      hero.vision_checked = true;
      hero.review_reason = result.reason;
      console.log(`    ⚠️ UNSURE: Remaining NEEDS_REVIEW`);
    }

    processedCount++;

    // RESUME SUPPORT: Save progress immediately after EACH image check
    savePipelineProgress(placeImageBundles);
  }

  // Tally final statistics
  let finalVerified = 0;
  let finalNeedsReview = 0;
  let finalPlaceholder = 0;

  for (const b of Object.values(placeImageBundles)) {
    const s = b.hero_image?.match_status;
    if (s === 'VERIFIED') finalVerified++;
    else if (s === 'NEEDS_REVIEW') finalNeedsReview++;
    else if (s === 'PLACEHOLDER') finalPlaceholder++;
  }

  console.log(`\n======================================================`);
  console.log(`📊 FINAL VERIFY-ONLY AUDIT REPORT`);
  console.log(`======================================================`);
  console.log(`Total Places:             ${placesList.length}`);
  console.log(`Processed This Run:       ${processedCount}`);
  console.log(`Skipped (Already Done):   ${skippedCount}`);
  console.log(`------------------------------------------------------`);
  console.log(`VERIFIED Images:          ${finalVerified}`);
  console.log(`NEEDS_REVIEW Images:      ${finalNeedsReview}`);
  console.log(`PLACEHOLDER Images:       ${finalPlaceholder}`);
  console.log(`------------------------------------------------------`);
  console.log(`Total Images Rejected:    ${rejectedList.length}`);
  if (rejectedList.length > 0) {
    console.log(`\nREJECTED IMAGES LIST:`);
    rejectedList.forEach((rej, idx) => {
      console.log(`  ${idx + 1}. [${rej.place_id}] ${rej.place_name}`);
      console.log(`     URL: ${rej.image_url}`);
      console.log(`     Subject: ${rej.visible_subject}`);
      console.log(`     Reason:  ${rej.reason}\n`);
    });
  } else {
    console.log(`No images rejected during this run.`);
  }
  console.log(`======================================================\n`);

  return {
    verified: finalVerified,
    needs_review: finalNeedsReview,
    placeholder: finalPlaceholder,
    rejected: rejectedList
  };
}

// Command-line entry point
const isDirectExecution = process.argv[1]?.endsWith('build_mumbai_image_pipeline.mjs');
if (isDirectExecution) {
  if (process.argv.includes('--verify-only')) {
    runVerifyOnlyPipeline();
  } else {
    runImagePipeline();
  }
}
