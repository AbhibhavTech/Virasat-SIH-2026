import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');

function slugify(name) {
  return name.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// 1. Get original 285 cities from HEAD
const originalCities = JSON.parse(execSync('git show HEAD:data/cities.json', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
console.log(`Base original cities count: ${originalCities.length}`);

// Load raw files
const biharRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'bihar.json'), 'utf8'));
const upRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'uttar_pradesh.json'), 'utf8'));
const karnatakaRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'karnataka.json'), 'utf8'));
const cgRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'chhattisgarh.json'), 'utf8'));

// Places files for coordinates
const biharPlaces = JSON.parse(fs.readFileSync(path.join(dataDir, 'bihar', 'places.json'), 'utf8'));
const upPlaces = JSON.parse(fs.readFileSync(path.join(dataDir, 'uttar-pradesh', 'places.json'), 'utf8'));
const karnatakaPlaces = JSON.parse(fs.readFileSync(path.join(dataDir, 'karnataka', 'places.json'), 'utf8'));
const cgPlaces = JSON.parse(fs.readFileSync(path.join(dataDir, 'chhattisgarh', 'places.json'), 'utf8'));

const placesMap = new Map();
for (const p of [...biharPlaces, ...upPlaces, ...karnatakaPlaces, ...cgPlaces]) {
  placesMap.set(p.id, p);
}

const cityKey = (stateId, name) => `${stateId}::${name.toLowerCase().trim()}`;
const cityMap = new Map();

for (const c of originalCities) {
  cityMap.set(cityKey(c.state_id, c.name), c);
  cityMap.set(c.id, c);
}

// Special check for Chitrakoot in UP which was chitrakoot-up
if (cityMap.has('chitrakoot-up')) {
  cityMap.get('chitrakoot-up').aliases = ['chitrakoot', 'uttar_pradesh_city_12'];
}

const redirects = fs.existsSync(path.join(dataDir, 'city_id_redirects.json'))
  ? JSON.parse(fs.readFileSync(path.join(dataDir, 'city_id_redirects.json'), 'utf8'))
  : {};

function processRawStateCities(rawCities, stateId, stateName, rawPrefix = '') {
  for (const c of rawCities) {
    const slug = slugify(c.name);
    const key = cityKey(stateId, c.name);
    let existing = cityMap.get(key) || cityMap.get(slug);

    const assignedPlaces = (c.place_ids || []).map(id => placesMap.get(id)).filter(Boolean);
    const firstCoord = assignedPlaces[0]?.coordinates || { lat: 20.0, lng: 78.0 };

    if (!existing) {
      existing = {
        id: slug,
        name: c.name,
        state: stateName,
        state_id: stateId,
        coordinates: firstCoord,
        tagline: `Experience ${c.name}, ${stateName}`,
        description: `Explore the vibrant tourist attractions, historic landmarks and heritage sites of ${c.name}.`,
        image_url: assignedPlaces[0]?.thumbnail_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
        total_places: assignedPlaces.length,
        tier: 'Tier 2',
        connectivity: {
          airport: true,
          railway: true,
          highway: true
        },
        aliases: [slug, c.name.toLowerCase()]
      };
      if (c.id && c.id !== slug) {
        existing.aliases.push(c.id);
      }
      cityMap.set(key, existing);
      cityMap.set(slug, existing);
    } else {
      existing.total_places = assignedPlaces.length;
      if (!existing.coordinates || (existing.coordinates.lat === 0 && existing.coordinates.lng === 0)) {
        existing.coordinates = firstCoord;
      }
      if (!existing.aliases) existing.aliases = [existing.id, existing.name.toLowerCase()];
      if (c.id && !existing.aliases.includes(c.id)) existing.aliases.push(c.id);
    }

    if (c.id && c.id !== existing.id) {
      redirects[c.id] = existing.id;
    }
  }
}

processRawStateCities(biharRaw.cities, 'bihar', 'Bihar');
processRawStateCities(upRaw.cities, 'uttar-pradesh', 'Uttar Pradesh', 'uttar_pradesh_city_');
processRawStateCities(karnatakaRaw.cities, 'karnataka', 'Karnataka', 'karnataka_city_');
processRawStateCities([{ id: 'hassan', name: 'Hassan', place_ids: ['karnataka_017', 'karnataka_018'] }], 'karnataka', 'Karnataka');
processRawStateCities(cgRaw.cities, 'chhattisgarh', 'Chhattisgarh', 'chhattisgarh_city_');

// Reconstruct unique cities array preserving original order then appending new cities
const finalCities = [];
const seenIds = new Set();

for (const c of originalCities) {
  const updated = cityMap.get(cityKey(c.state_id, c.name)) || c;
  if (!seenIds.has(updated.id)) {
    seenIds.add(updated.id);
    finalCities.push(updated);
  }
}

for (const c of cityMap.values()) {
  if (!seenIds.has(c.id)) {
    seenIds.add(c.id);
    finalCities.push(c.id === 'chitrakoot-up' ? c : c);
  }
}

fs.writeFileSync(path.join(dataDir, 'cities.json'), JSON.stringify(finalCities, null, 2), 'utf8');
fs.writeFileSync(path.join(dataDir, 'city_id_redirects.json'), JSON.stringify(redirects, null, 2), 'utf8');

console.log(`Cleaned and saved data/cities.json (${finalCities.length} unique cities)`);
console.log(`Saved data/city_id_redirects.json (${Object.keys(redirects).length} redirects)`);
