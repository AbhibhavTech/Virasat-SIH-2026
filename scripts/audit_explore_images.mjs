import fs from 'fs';
const INDIA_TOURISM_DATABASE = JSON.parse(fs.readFileSync('./data/india_tourism_database.json', 'utf8'));

// We also parse INDIA_PINS from ExploreIndiaMap.tsx
const mapFileContent = fs.readFileSync('./src/components/explore-india/ExploreIndiaMap.tsx', 'utf8');

function extractMapPins() {
  const pinRegex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*type:\s*'([^']+)',[\s\S]*?iconicPlace:\s*'([^']+)',[\s\S]*?thumbnail:\s*'([^']*)',/g;
  const pins = [];
  let match;
  while ((match = pinRegex.exec(mapFileContent)) !== null) {
    pins.push({
      id: match[1],
      name: match[2],
      type: match[3],
      iconicPlace: match[4],
      thumbnail: match[5],
    });
  }
  return pins;
}

const mapPins = extractMapPins();
console.log(`Extracted ${mapPins.length} map pins from ExploreIndiaMap.tsx`);

// Gather all Explore page image references
const auditEntries = [];

// 1. States & UTs (Level 1)
for (const state of INDIA_TOURISM_DATABASE.states) {
  auditEntries.push({
    level: 'State/UT (Level 1)',
    entityType: 'state',
    entityId: state.id,
    destination: `${state.name} (${state.region_type === 'union_territory' ? 'Union Territory' : 'State'})`,
    placeName: state.name,
    imageUrl: state.hero_image_url || '',
    creator: state.creator || '',
    license: state.license || '',
    source_provenance: state.source_provenance || '',
    stateName: state.name,
    cityName: '',
  });

  // 2. Cities & Towns (Level 2)
  for (const city of state.cities || []) {
    auditEntries.push({
      level: 'Destination/Town (Level 2)',
      entityType: 'city',
      entityId: city.id,
      destination: `${city.name}, ${state.name}`,
      placeName: city.name,
      imageUrl: city.hero_image_url || '',
      creator: city.creator || '',
      license: city.license || '',
      source_provenance: city.source_provenance || '',
      stateName: state.name,
      cityName: city.name,
    });

    // 3. Attractions / Places (Level 3)
    const allPlaces = [
      ...(city.heritage || []),
      ...(city.monuments || []),
      ...(city.museums || []),
      ...(city.tourist_places || []),
      ...(city.religious_cultural || []),
      ...(city.nature_parks_zoo || []),
    ];

    for (const place of allPlaces) {
      const url = place.image_url || place.thumbnail_url || '';
      auditEntries.push({
        level: 'Attraction (Level 3)',
        entityType: 'attraction',
        entityId: place.id,
        destination: `${place.name} (${city.name}, ${state.name})`,
        placeName: place.name,
        category: place.category_label || place.category || '',
        imageUrl: url,
        creator: place.creator || city.creator || '',
        license: place.license || city.license || '',
        source_provenance: place.source_provenance || city.source_provenance || '',
        stateName: state.name,
        cityName: city.name,
      });
    }
  }
}

// 4. Map Pins
for (const pin of mapPins) {
  auditEntries.push({
    level: 'Explore Map Pin',
    entityType: 'map_pin',
    entityId: pin.id,
    destination: `Map Pin: ${pin.name} - ${pin.iconicPlace}`,
    placeName: pin.name,
    imageUrl: pin.thumbnail,
    creator: '',
    license: '',
    source_provenance: 'Hardcoded in ExploreIndiaMap.tsx',
    stateName: pin.name,
    cityName: '',
  });
}

console.log(`Total image references to audit on Explore page: ${auditEntries.length}`);

// Unique URLs to test
const uniqueUrls = [...new Set(auditEntries.map((e) => e.imageUrl).filter(Boolean))];
console.log(`Unique non-empty URLs: ${uniqueUrls.length}`);

// Empty URLs
const emptyUrlEntries = auditEntries.filter((e) => !e.imageUrl || e.imageUrl.trim() === '');
console.log(`Entries with empty/missing URLs: ${emptyUrlEntries.length}`);

// Test URLs with fetch
const urlStatusMap = new Map();

async function checkUrl(url) {
  if (!url || typeof url !== 'string') return { status: 'invalid', httpCode: 0, reason: 'Empty/Null URL' };

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { status: 'invalid', httpCode: 0, reason: 'Invalid protocol' };
    }
  } catch {
    return { status: 'invalid', httpCode: 0, reason: 'Malformed URL' };
  }

  // Is it a Google/Bing search result URL?
  if (url.includes('google.com/url') || url.includes('bing.com/images/search') || url.includes('google.com/imgres')) {
    return { status: 'search_result', httpCode: 0, reason: 'Search result redirect URL, not direct asset' };
  }

  const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; VirasatHeritageAudit/1.0; +https://virasat.in)',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  };

  try {
    // Try HEAD first
    let res = await fetch(url, { method: 'HEAD', headers, signal: AbortSignal.timeout(8000) });
    if (res.status === 405 || res.status === 403) {
      // Some servers block HEAD or return 403 on HEAD (Wikimedia occasionally)
      res = await fetch(url, {
        method: 'GET',
        headers: { ...headers, Range: 'bytes=0-1024' },
        signal: AbortSignal.timeout(8000),
      });
    }

    if (res.ok || res.status === 200 || res.status === 206 || res.status === 304) {
      return { status: 'working', httpCode: res.status, contentType: res.headers.get('content-type') };
    } else {
      return { status: 'broken', httpCode: res.status, reason: `HTTP ${res.status}` };
    }
  } catch (err) {
    return { status: 'broken', httpCode: 0, reason: err.message };
  }
}

// Batch run checks
async function runChecks() {
  console.log('Testing URLs concurrently in batches...');
  const batchSize = 15;
  for (let i = 0; i < uniqueUrls.length; i += batchSize) {
    const batch = uniqueUrls.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (url) => {
        const result = await checkUrl(url);
        urlStatusMap.set(url, result);
      })
    );
    process.stdout.write(`Tested ${Math.min(i + batchSize, uniqueUrls.length)} / ${uniqueUrls.length}...\r`);
  }
  console.log('\nAll URL tests complete!');

  // Analyze reuse / duplication
  const urlUsageMap = new Map();
  for (const entry of auditEntries) {
    if (!entry.imageUrl) continue;
    if (!urlUsageMap.has(entry.imageUrl)) {
      urlUsageMap.set(entry.imageUrl, []);
    }
    urlUsageMap.get(entry.imageUrl).push(entry);
  }

  // Combine audit details
  const auditedResults = auditEntries.map((entry) => {
    let check = { status: 'missing', httpCode: 0, reason: 'No image URL provided' };
    if (entry.imageUrl) {
      check = urlStatusMap.get(entry.imageUrl) || { status: 'unknown' };
    }

    const usages = entry.imageUrl ? urlUsageMap.get(entry.imageUrl) || [] : [];
    const isReused = usages.length > 1;

    // Accuracy check heuristic:
    // Check if filename/url text mismatches destination name
    let accuracy = 'Verified/Presumed Correct';
    let mismatchReason = '';

    const urlLower = (entry.imageUrl || '').toLowerCase();
    const placeLower = entry.placeName.toLowerCase();
    const destLower = entry.destination.toLowerCase();

    // Check specific known mismatches or generic IDs
    // Unsplash photo-1599661046289-e31897846e41 is Jaipur Hawa Mahal/Amber Palace
    if (urlLower.includes('photo-1599661046289-e31897846e41')) {
      if (!placeLower.includes('jaipur') && !placeLower.includes('amber') && !placeLower.includes('amer') && !placeLower.includes('hawa mahal')) {
        accuracy = 'Wrong Place Image';
        mismatchReason = 'Jaipur Amber/Hawa Mahal image used for unrelated place';
      }
    }

    // Unsplash photo-1600100397608-f010e422a59e (404 broken, also reused for Konark, Rani ki Vav, Hampi, Pattadakal)
    if (urlLower.includes('photo-1600100397608-f010e422a59e')) {
      accuracy = 'Wrong Place / Reused Generic';
      mismatchReason = 'Same Unsplash asset ID reused across completely different states (Odisha, Gujarat, Karnataka)';
    }

    // Unsplash photo-1544735716-392fe2489ffa reused for Bodh Gaya and Meghalaya
    if (urlLower.includes('photo-1544735716-392fe2489ffa') && (placeLower.includes('meghalaya') || placeLower.includes('cherrapunji'))) {
      accuracy = 'Wrong Place Image';
      mismatchReason = 'Bodh Gaya/Buddhist image reused for Cherrapunji/Meghalaya Living Root Bridge';
    }

    // Check if Wikimedia image filename conflicts with place name
    if (urlLower.includes('wikimedia.org')) {
      // Decode URI
      try {
        const decoded = decodeURIComponent(urlLower);
        // If the URL clearly names another monument
        if (decoded.includes('taj_mahal') && !destLower.includes('taj') && !destLower.includes('agra')) {
          accuracy = 'Wrong Place Image';
          mismatchReason = 'Taj Mahal image used for non-Taj place';
        }
      } catch (e) {}
    }

    let problem = 'None';
    if (check.status === 'broken') {
      problem = `Broken URL (${check.reason || 'HTTP error'})`;
    } else if (check.status === 'missing') {
      problem = 'Missing image URL (Empty string in database)';
    } else if (check.status === 'invalid') {
      problem = `Invalid URL: ${check.reason}`;
    } else if (check.status === 'search_result') {
      problem = 'Search engine redirect URL instead of direct asset';
    } else if (accuracy === 'Wrong Place Image' || accuracy === 'Wrong Place / Reused Generic') {
      problem = `Mismatched image: ${mismatchReason}`;
    } else if (isReused) {
      problem = `Reused across ${usages.length} different places`;
    }

    return {
      ...entry,
      status: check.status === 'working' ? 'Working' : 'Broken / Missing',
      httpCode: check.httpCode,
      httpReason: check.reason,
      accuracy,
      mismatchReason,
      isReused,
      reuseCount: usages.length,
      problem,
    };
  });

  // Calculate statistics
  const totalAudited = auditedResults.length;
  const workingImages = auditedResults.filter((r) => r.status === 'Working' && r.accuracy === 'Verified/Presumed Correct' && !r.isReused).length;
  const workingTotal = auditedResults.filter((r) => r.status === 'Working').length;
  const brokenImages = auditedResults.filter((r) => r.status !== 'Working').length;
  const mismatchedImages = auditedResults.filter((r) => r.accuracy !== 'Verified/Presumed Correct').length;
  const emptyImages = auditedResults.filter((r) => !r.imageUrl).length;
  const reusedImagesCount = auditedResults.filter((r) => r.isReused).length;
  const distinctReusedUrls = [...urlUsageMap.entries()].filter(([url, list]) => list.length > 1).length;

  console.log('\n--- EXPLORE PAGE IMAGE AUDIT SUMMARY ---');
  console.log(`Total images audited on Explore page: ${totalAudited}`);
  console.log(`  - States/UTs: ${auditedResults.filter((r) => r.entityType === 'state').length}`);
  console.log(`  - Cities/Towns: ${auditedResults.filter((r) => r.entityType === 'city').length}`);
  console.log(`  - Attractions: ${auditedResults.filter((r) => r.entityType === 'attraction').length}`);
  console.log(`  - Map Pins: ${auditedResults.filter((r) => r.entityType === 'map_pin').length}`);
  console.log(`Working images (HTTP 200/206): ${workingTotal}`);
  console.log(`Broken / Missing images: ${brokenImages} (of which ${emptyImages} have empty URL)`);
  console.log(`Mismatched / Incorrect images: ${mismatchedImages}`);
  console.log(`Reused / Duplicated images: ${reusedImagesCount} occurrences across ${distinctReusedUrls} distinct URLs`);

  fs.writeFileSync('./scripts/explore_image_audit_results.json', JSON.stringify(auditedResults, null, 2));
  console.log('Saved detailed audit results to ./scripts/explore_image_audit_results.json');
}

runChecks();
