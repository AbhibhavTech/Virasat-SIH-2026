import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const OFFICIAL_SITE_ALLOWLIST = [
  'shrikashivishwanath.org',
  'partitionmuseum.org',
  'eternalmewar.in',
  'somnath.org',
];

function computeSourceQuality(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return 'missing';
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (OFFICIAL_SITE_ALLOWLIST.some(allowed => host === allowed || host.endsWith('.' + allowed))) {
      return 'official_site';
    }
    const pathname = parsed.pathname;
    if (pathname && pathname !== '/' && pathname.length > 1) {
      return 'place_specific';
    }
    return 'generic_homepage';
  } catch {
    return 'missing';
  }
}

// UNESCO verified mappings
const UNESCO_DEEP_LINKS = {
  'fatehpur-sikri': 'https://whc.unesco.org/en/list/255/',
  'qutub-minar': 'https://whc.unesco.org/en/list/233/',
  'humayuns-tomb': 'https://whc.unesco.org/en/list/232/',
  'red-fort': 'https://whc.unesco.org/en/list/231/',
  'kalka-shimla-railway': 'https://whc.unesco.org/en/list/944/',
  'amber-fort': 'https://whc.unesco.org/en/list/247/',
  'jaisalmer-fort': 'https://whc.unesco.org/en/list/247/',
  'rani-ki-vav': 'https://whc.unesco.org/en/list/922/',
  'champaner-pavagadh': 'https://whc.unesco.org/en/list/1101/',
  'ajanta-caves': 'https://whc.unesco.org/en/list/242/',
  'ellora-caves': 'https://whc.unesco.org/en/list/243/',
  'csmt': 'https://whc.unesco.org/en/list/945/',
  'basilica-of-bom-jesus': 'https://whc.unesco.org/en/list/234/',
  'hampi-monuments': 'https://whc.unesco.org/en/list/241/',
  'pattadakal-monuments': 'https://whc.unesco.org/en/list/239/',
  'hoysala-temples-belur': 'https://whc.unesco.org/en/list/1670/',
  'brihadisvara-temple': 'https://whc.unesco.org/en/list/250/',
  'shore-temple-mahabalipuram': 'https://whc.unesco.org/en/list/249/',
  'khajuraho-monuments': 'https://whc.unesco.org/en/list/240/',
  'sanchi-stupa': 'https://whc.unesco.org/en/list/524/',
  'sun-temple-konark': 'https://whc.unesco.org/en/list/246/',
  'mahabodhi-temple': 'https://whc.unesco.org/en/list/1056/',
  'nalanda-university-ruins': 'https://whc.unesco.org/en/list/1502/',
  'kaziranga-living-heritage': 'https://whc.unesco.org/en/list/337/',
  'ramappa-temple': 'https://whc.unesco.org/en/list/1570/',
  'agra-fort': 'https://whc.unesco.org/en/list/251/',
  'jantar-mantar': 'https://whc.unesco.org/en/list/1338/',
  'great-himalayan-national-park': 'https://whc.unesco.org/en/list/1406/',
  'taj-mahal': 'https://whc.unesco.org/en/list/252/',
};

// 1. Update data/heritage/monuments.json
const monumentsPath = path.join(rootDir, 'data', 'heritage', 'monuments.json');
if (fs.existsSync(monumentsPath)) {
  const monuments = JSON.parse(fs.readFileSync(monumentsPath, 'utf8'));
  for (const m of monuments) {
    if (UNESCO_DEEP_LINKS[m.id]) {
      m.source_url = UNESCO_DEEP_LINKS[m.id];
      m.source = 'UNESCO World Heritage Centre';
      m.source_type = 'unesco';
    } else if (m.id === 'capitol-complex-chandigarh') {
      m.source_url = 'https://whc.unesco.org';
      m.verification_status = 'needs_review';
    }
  }
  fs.writeFileSync(monumentsPath, JSON.stringify(monuments, null, 2), 'utf8');
  console.log('✅ Updated data/heritage/monuments.json with verified UNESCO deep links');
}

// 2. Update data/india_tourism_database.json
const indiaTourismPath = path.join(rootDir, 'data', 'india_tourism_database.json');
if (fs.existsSync(indiaTourismPath)) {
  const dbData = JSON.parse(fs.readFileSync(indiaTourismPath, 'utf8'));
  for (const s of dbData.states || []) {
    for (const c of s.cities || []) {
      for (const k of ['monuments', 'heritage', 'tourist_places', 'places', 'attractions']) {
        const list = c[k];
        if (Array.isArray(list)) {
          for (const p of list) {
            if (UNESCO_DEEP_LINKS[p.id]) {
              p.source_url = UNESCO_DEEP_LINKS[p.id];
              p.source_name = 'UNESCO World Heritage Centre';
              p.source_type = 'unesco';
              p.source_quality = 'place_specific';
              p.verification_status = 'verified';
            } else if (p.id === 'capitol-complex-chandigarh') {
              p.verification_status = 'needs_review';
              p.source_quality = 'generic_homepage';
            } else if (computeSourceQuality(p.source_url) === 'official_site') {
              p.source_quality = 'official_site';
              p.verification_status = 'verified';
            } else if (computeSourceQuality(p.source_url) === 'place_specific') {
              p.source_quality = 'place_specific';
            } else {
              p.source_quality = 'generic_homepage';
              if (p.verification_status === 'verified') {
                p.verification_status = 'needs_review';
              }
            }
          }
        }
      }
    }
  }
  fs.writeFileSync(indiaTourismPath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log('✅ Updated data/india_tourism_database.json with source_quality tiers');
}

console.log('Setup script ready.');
