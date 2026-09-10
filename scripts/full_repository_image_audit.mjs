import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');

// 1. Gather all URLs and entities
const urlToEntities = new Map(); // url -> Array<{ file, id, name, type }>
const entityToUrl = [];

function register(url, file, id, name, type) {
  if (!url || typeof url !== 'string' || !url.trim()) return;
  const cleanUrl = url.trim();
  if (!urlToEntities.has(cleanUrl)) {
    urlToEntities.set(cleanUrl, []);
  }
  urlToEntities.get(cleanUrl).push({ file, id, name, type });
  entityToUrl.push({ file, id, name, type, url: cleanUrl });
}

// A. states.json
if (fs.existsSync(path.join(dataDir, 'states.json'))) {
  const states = JSON.parse(fs.readFileSync(path.join(dataDir, 'states.json'), 'utf8'));
  for (const s of states) {
    register(s.hero_image_url, 'data/states.json', s.id, s.name, 'state');
  }
}

// B. cities.json
if (fs.existsSync(path.join(dataDir, 'cities.json'))) {
  const cities = JSON.parse(fs.readFileSync(path.join(dataDir, 'cities.json'), 'utf8'));
  for (const c of cities) {
    register(c.hero_image_url, 'data/cities.json', c.id, c.name, 'city');
  }
}

// C. monuments.json
if (fs.existsSync(path.join(dataDir, 'heritage', 'monuments.json'))) {
  const monuments = JSON.parse(fs.readFileSync(path.join(dataDir, 'heritage', 'monuments.json'), 'utf8'));
  for (const m of monuments) {
    register(m.thumbnail_url, 'data/heritage/monuments.json', m.id, m.name, 'monument');
    if (Array.isArray(m.images)) {
      m.images.forEach(img => register(img, 'data/heritage/monuments.json', m.id, m.name, 'monument_gallery'));
    }
  }
}

// D. Regional places
const regionalFiles = [
  'mumbai/places.json',
  'maharashtra/places.json',
  'delhi/places.json',
  'rajasthan/places.json',
  'kerala/places.json',
  'goa/places.json',
  'bihar/places.json',
  'kolkata/places.json',
  'ladakh/places.json',
  'jammu-kashmir/places.json',
  'india_tourism.json',
];

for (const rf of regionalFiles) {
  const p = path.join(dataDir, rf);
  if (fs.existsSync(p)) {
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    const items = Array.isArray(raw) ? raw : (raw.places || []);
    for (const item of items) {
      if (!item) continue;
      register(item.thumbnail_url, `data/${rf}`, item.id, item.name, 'regional_place');
      register(item.hero_image_url, `data/${rf}`, item.id, item.name, 'regional_place');
      if (Array.isArray(item.images)) {
        item.images.forEach(img => register(img, `data/${rf}`, item.id, item.name, 'regional_place_gallery'));
      }
      if (Array.isArray(item.image_urls)) {
        item.image_urls.forEach(img => register(img, `data/${rf}`, item.id, item.name, 'regional_place_gallery'));
      }
    }
  }
}

// E. itdb
if (fs.existsSync(path.join(dataDir, 'india_tourism_database.json'))) {
  const itdb = JSON.parse(fs.readFileSync(path.join(dataDir, 'india_tourism_database.json'), 'utf8'));
  for (const s of itdb.states) {
    register(s.hero_image_url, 'data/india_tourism_database.json', s.id, s.name, 'itdb_state');
    for (const c of s.cities) {
      register(c.hero_image_url, 'data/india_tourism_database.json', c.id, c.name, 'itdb_city');
      const allAttr = [
        ...(c.heritage || []),
        ...(c.monuments || []),
        ...(c.museums || []),
        ...(c.tourist_places || []),
        ...(c.religious_cultural || []),
        ...(c.nature_parks_zoo || []),
      ];
      for (const a of allAttr) {
        register(a.image_url, 'data/india_tourism_database.json', a.id, a.name, 'itdb_attraction');
        register(a.thumbnail_url, 'data/india_tourism_database.json', a.id, a.name, 'itdb_attraction_thumb');
      }
    }
  }
}

console.log('====================================================');
console.log(`Total entity-image references collected: ${entityToUrl.length}`);
console.log(`Total unique image URLs to test: ${urlToEntities.size}`);
console.log('====================================================\n');

// 2. Concurrently check HTTP status of all unique URLs
const uniqueUrls = Array.from(urlToEntities.keys());
const urlStatusMap = new Map();

async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VirasatTourismAudit/1.0',
        'Accept': 'image/*,*/*'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    return { status: res.status, ok: res.ok, contentType: res.headers.get('content-type') };
  } catch (err) {
    // If HEAD failed with 405 Method Not Allowed or network error, retry with GET
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VirasatTourismAudit/1.0',
          'Accept': 'image/*,*/*',
          'Range': 'bytes=0-100'
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
      return { status: res.status, ok: res.ok, contentType: res.headers.get('content-type') };
    } catch (e2) {
      return { status: 0, ok: false, error: e2.message };
    }
  }
}

// Run in parallel batches of 25
const BATCH_SIZE = 25;
let processed = 0;
for (let i = 0; i < uniqueUrls.length; i += BATCH_SIZE) {
  const batch = uniqueUrls.slice(i, i + BATCH_SIZE);
  await Promise.all(
    batch.map(async (url) => {
      const result = await checkUrl(url);
      urlStatusMap.set(url, result);
    })
  );
  processed += batch.length;
  if (processed % 50 === 0 || processed === uniqueUrls.length) {
    console.log(`Checked ${processed} / ${uniqueUrls.length} URLs...`);
  }
}

// 3. Analyze results
const brokenUrls = [];
const workingUrls = [];
const duplicateUrlCases = [];

for (const [url, entities] of urlToEntities.entries()) {
  const res = urlStatusMap.get(url);
  if (!res || !res.ok) {
    brokenUrls.push({ url, res, entities });
  } else {
    workingUrls.push({ url, res, entities });
  }

  // Check if reused across distinct entities
  const distinctEntities = new Set(entities.map(e => `${e.type}:${e.id}`));
  if (distinctEntities.size > 1) {
    duplicateUrlCases.push({ url, distinctCount: distinctEntities.size, entities });
  }
}

console.log('\n================ AUDIT SUMMARY ================');
console.log(`Total unique URLs: ${uniqueUrls.length}`);
console.log(`Working URLs (200/OK): ${workingUrls.length}`);
console.log(`Broken / Inaccessible URLs: ${brokenUrls.length}`);
console.log(`Duplicate URLs reused across distinct entities: ${duplicateUrlCases.length}`);

// Write full audit result to scripts/audit_report.json
const auditReport = {
  timestamp: new Date().toISOString(),
  total_unique_urls: uniqueUrls.length,
  working_urls_count: workingUrls.length,
  broken_urls_count: brokenUrls.length,
  duplicate_urls_count: duplicateUrlCases.length,
  broken_urls: brokenUrls,
  duplicate_urls: duplicateUrlCases
};

fs.writeFileSync(path.join(rootDir, 'scripts', 'audit_report.json'), JSON.stringify(auditReport, null, 2), 'utf8');
console.log('Saved detailed audit report to scripts/audit_report.json');
