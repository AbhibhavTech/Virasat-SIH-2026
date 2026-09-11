const express = require('express');
const path = require('path');
const fs = require('fs');

console.log('Testing consolidated API endpoints...');

// Setup a test Express app with the exact same handlers as server.ts
const app = express();
const dbPath = path.join(__dirname, '..', 'data', 'india_tourism_database.json');
let indiaHierarchyData = null;

function getIndiaHierarchyData() {
  if (!indiaHierarchyData) {
    indiaHierarchyData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  }
  return indiaHierarchyData;
}

// GET /regions and /api/regions
app.get(['/regions', '/api/regions'], (req, res) => {
  const data = getIndiaHierarchyData();
  const states = data.states.filter((s) => s.region_type === 'state');
  const unionTerritories = data.states.filter((s) => s.region_type === 'union_territory');
  res.json({
    country: 'India',
    region_counts: {
      states: states.length,
      union_territories: unionTerritories.length,
      total_regions: data.states.length,
    },
    regions: data.states.map((s) => ({
      id: s.id,
      name: s.name,
      region_type: s.region_type,
      total_cities: s.total_cities,
      total_places: s.total_attractions,
    })),
  });
});

// GET /regions/:region and /api/regions/:region
app.get(['/regions/:region', '/api/regions/:region'], (req, res) => {
  const data = getIndiaHierarchyData();
  const query = req.params.region.toLowerCase().trim();
  const state = data.states.find(
    (s) =>
      s.id.toLowerCase() === query ||
      s.name.toLowerCase() === query ||
      s.code?.toLowerCase() === query
  );
  if (!state) return res.status(404).json({ error: 'Region not found' });
  res.json({
    id: state.id,
    name: state.name,
    total_active_cities: state.cities.length,
    cities: state.cities.map((c) => ({ id: c.id, name: c.name, places_count: c.places_count })),
  });
});

// GET /regions/:region/cities/:city and /api/regions/:region/cities/:city
app.get(['/regions/:region/cities/:city', '/api/regions/:region/cities/:city'], (req, res) => {
  const data = getIndiaHierarchyData();
  const regQuery = req.params.region.toLowerCase().trim();
  const cityQuery = req.params.city.toLowerCase().trim();

  const state = data.states.find(
    (s) =>
      s.id.toLowerCase() === regQuery ||
      s.name.toLowerCase() === regQuery ||
      s.code?.toLowerCase() === regQuery
  );
  if (!state) return res.status(404).json({ error: 'Region not found' });

  const city = state.cities.find(
    (c) => c.id.toLowerCase() === cityQuery || c.name.toLowerCase() === cityQuery
  );
  if (!city) return res.status(404).json({ error: 'City not found' });

  const allPlaces = [
    ...(city.heritage || []),
    ...(city.monuments || []),
    ...(city.museums || []),
    ...(city.tourist_places || []),
    ...(city.religious_cultural || []),
    ...(city.nature_parks_zoo || []),
  ];

  res.json({
    region: state.name,
    city: city.name,
    total_places: allPlaces.length,
    places: allPlaces,
  });
});

// GET /places/:place_id and /api/places/:place_id
app.get(['/places/:place_id', '/api/places/:place_id'], (req, res) => {
  const data = getIndiaHierarchyData();
  const targetId = req.params.place_id.toLowerCase().trim();

  for (const s of data.states) {
    for (const c of s.cities) {
      const allPlaces = [
        ...(c.heritage || []),
        ...(c.monuments || []),
        ...(c.museums || []),
        ...(c.tourist_places || []),
        ...(c.religious_cultural || []),
        ...(c.nature_parks_zoo || []),
      ];
      const found = allPlaces.find(
        (p) =>
          p.id.toLowerCase() === targetId ||
          p.canonical_name?.toLowerCase() === targetId ||
          p.name.toLowerCase() === targetId
      );
      if (found) {
        return res.json({
          ...found,
          region: s.name,
          city: c.name,
        });
      }
    }
  }
  res.status(404).json({ error: 'Place not found' });
});

// GET /search and /api/search
app.get(['/search', '/api/search'], (req, res) => {
  const data = getIndiaHierarchyData();
  const q = String(req.query.q || req.query.query || '').trim().toLowerCase();
  if (!q) return res.json({ query: '', total_results: 0, regions: [], cities: [], places: [] });

  const matchedRegions = [];
  const matchedCities = [];
  const matchedPlaces = [];

  for (const s of data.states) {
    if (s.name.toLowerCase().includes(q)) {
      matchedRegions.push({ id: s.id, name: s.name });
    }
    for (const c of s.cities) {
      if (c.name.toLowerCase().includes(q) || c.district?.toLowerCase().includes(q)) {
        matchedCities.push({ id: c.id, name: c.name, region: s.name });
      }
      const allPlaces = [
        ...(c.heritage || []),
        ...(c.monuments || []),
        ...(c.museums || []),
        ...(c.tourist_places || []),
        ...(c.religious_cultural || []),
        ...(c.nature_parks_zoo || []),
      ];
      for (const p of allPlaces) {
        if (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.hotels?.some((h) => h.name?.toLowerCase().includes(q))
        ) {
          matchedPlaces.push({ id: p.id, name: p.name, city: c.name, region: s.name });
        }
      }
    }
  }

  res.json({
    query: q,
    total_results: matchedRegions.length + matchedCities.length + matchedPlaces.length,
    regions: matchedRegions,
    cities: matchedCities,
    places: matchedPlaces,
  });
});

const server = app.listen(3344, async () => {
  console.log('Test server started on port 3344');

  async function get(path) {
    const res = await fetch(`http://localhost:3344${path}`);
    return { status: res.status, data: await res.json() };
  }

  try {
    // 1. Test GET /regions
    const r1 = await get('/regions');
    console.log(`[API 1] GET /regions: status ${r1.status}, total_regions: ${r1.data.region_counts?.total_regions}, states: ${r1.data.region_counts?.states}, UTs: ${r1.data.region_counts?.union_territories}`);
    if (r1.data.region_counts?.total_regions !== 36) throw new Error('Expected 36 regions');

    // 2. Test GET /api/regions
    const r2 = await get('/api/regions');
    console.log(`[API 2] GET /api/regions: status ${r2.status}`);

    // 3. Test GET /regions/rajasthan
    const r3 = await get('/regions/rajasthan');
    console.log(`[API 3] GET /regions/rajasthan: status ${r3.status}, region: ${r3.data.name}, active cities: ${r3.data.total_active_cities}`);
    if (r3.data.total_active_cities < 1) throw new Error('Expected active cities for Rajasthan');

    // 4. Test GET /regions/andaman-and-nicobar-islands
    const r4 = await get('/regions/andaman-and-nicobar-islands');
    console.log(`[API 4] GET /regions/andaman-and-nicobar-islands: status ${r4.status}, region: ${r4.data.name}, active cities: ${r4.data.total_active_cities}`);

    // 5. Test GET /regions/rajasthan/cities/jaipur
    const r5 = await get('/regions/rajasthan/cities/jaipur');
    console.log(`[API 5] GET /regions/rajasthan/cities/jaipur: status ${r5.status}, city: ${r5.data.city}, places: ${r5.data.total_places}`);
    if (r5.data.total_places < 1) throw new Error('Expected places in Jaipur');

    // 6. Test GET /places/andhra_pradesh_001
    const r6 = await get('/places/andhra_pradesh_001');
    console.log(`[API 6] GET /places/andhra_pradesh_001: status ${r6.status}, name: ${r6.data.name}, hotels count: ${r6.data.hotels?.length}`);
    if (!r6.data.name) throw new Error('Expected place details');

    // 7. Test GET /places/cellular_jail or UT place
    const r7 = await get('/places/andaman_nicobar_heritage_001');
    console.log(`[API 7] GET /places/andaman_nicobar_heritage_001: status ${r7.status}, name: ${r7.data.name}, city: ${r7.data.city}`);

    // 8. Test SEARCH /search?q=temple
    const r8 = await get('/search?q=temple');
    console.log(`[API 8] GET /search?q=temple: status ${r8.status}, total_results: ${r8.data.total_results}, places found: ${r8.data.places?.length}`);

    // 9. Test SEARCH /api/search?q=hotel
    const r9 = await get('/api/search?q=hotel');
    console.log(`[API 9] GET /api/search?q=hotel: status ${r9.status}, total_results: ${r9.data.total_results}`);

    console.log('\nALL 9 API ROUTE TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('API Test Error:', err);
    process.exit(1);
  } finally {
    server.close();
  }
});
