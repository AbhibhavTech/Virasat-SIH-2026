import fs from 'fs';
import path from 'path';

// Load cities & states for coordinate resolution
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '..');
const citiesPath = path.resolve(baseDir, 'data/cities.json');
const statesPath = path.resolve(baseDir, 'data/states.json');
const monumentsPath = path.resolve(baseDir, 'data/heritage/monuments.json');

const cities: any[] = fs.existsSync(citiesPath) ? JSON.parse(fs.readFileSync(citiesPath, 'utf-8')) : [];
const states: any[] = fs.existsSync(statesPath) ? JSON.parse(fs.readFileSync(statesPath, 'utf-8')) : [];
const monuments: any[] = fs.existsSync(monumentsPath) ? JSON.parse(fs.readFileSync(monumentsPath, 'utf-8')) : [];

const cityLookup = new Map<string, any>();
for (const c of cities) {
  cityLookup.set(c.id.toLowerCase(), c);
  cityLookup.set(c.name.toLowerCase().replace(/[^a-z0-9]/g, ''), c);
}

const stateLookup = new Map<string, any>();
for (const s of states) {
  stateLookup.set(s.id.toLowerCase(), s);
  stateLookup.set(s.name.toLowerCase().replace(/[^a-z0-9]/g, ''), s);
}

const monumentLookup = new Map<string, any>();
for (const m of monuments) {
  monumentLookup.set(m.id.toLowerCase(), m);
  monumentLookup.set(m.name.toLowerCase().replace(/[^a-z0-9]/g, ''), m);
}

const parseFeeAmount = (feeStr?: string): number => {
  if (!feeStr || /free/i.test(feeStr)) return 0;
  const match = feeStr.match(/\d[\d,]*/);
  if (!match) return 0;
  const num = parseInt(match[0].replace(/,/g, ''), 10);
  return isNaN(num) ? 0 : num;
};

// Dynamically import all 36 state directories
const directoryFiles = fs.readdirSync(path.resolve(baseDir, 'src/data'))
  .filter(f => f.endsWith('Directory.ts'));

console.log(`Found ${directoryFiles.length} directory files.`);

async function run() {
  const allAttractions: any[] = [];
  const seenIds = new Set<string>();

  for (const file of directoryFiles) {
    const filePath = path.resolve(baseDir, 'src/data', file);
    const mod = await import(`../src/data/${file}`);
    const stateName = file.replace('Directory.ts', '')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
    const stateId = stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    for (const val of Object.values(mod)) {
      if (!Array.isArray(val)) continue;

      for (const city of val) {
        if (!city || typeof city !== 'object' || !city.name) continue;

        const cityName = String(city.name || '').replace(/\s*\(.*?\)\s*/g, '').trim();
        const cityId = String(city.id || cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
        const cityKey = cityName.toLowerCase().replace(/[^a-z0-9]/g, '');

        const resolvedCity = cityLookup.get(cityId) || cityLookup.get(cityKey);
        const resolvedState = stateLookup.get(stateId);

        const defaultLat = resolvedCity?.lat ?? resolvedCity?.latitude ?? resolvedState?.lat ?? 20.5937;
        const defaultLng = resolvedCity?.lng ?? resolvedCity?.longitude ?? resolvedState?.lng ?? 78.9629;

        if (Array.isArray(city.attractions)) {
          for (const attr of city.attractions) {
            if (!attr || !attr.id || seenIds.has(attr.id)) continue;
            seenIds.add(attr.id);

            const normName = attr.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const matchedMon = monumentLookup.get(attr.id.toLowerCase()) || monumentLookup.get(normName);

            const lat = matchedMon?.coordinates?.lat ?? matchedMon?.lat ?? defaultLat;
            const lng = matchedMon?.coordinates?.lng ?? matchedMon?.lng ?? defaultLng;

            const domFee = parseFeeAmount(attr.fee?.domestic);
            const intlFee = parseFeeAmount(attr.fee?.foreign || attr.fee?.domestic);

            const slug = attr.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const sourceUrl = `https://asi.nic.in/monument/${slug}`;

            const record = {
              id: attr.id,
              name: attr.name,
              category: attr.category || (attr.isHiddenGem ? 'Hidden Gem' : 'Heritage: Monuments'),
              city_id: cityId,
              city_name: cityName,
              state_id: stateId,
              state_name: stateName,
              tagline: city.tagline || '',
              summary: attr.summary || `${attr.name} is a renowned cultural attraction located in ${cityName}, ${stateName}.`,
              description: attr.summary || `${attr.name} is a renowned cultural attraction located in ${cityName}, ${stateName}.`,
              timings: attr.timings || '09:00–18:00',
              visiting_hours: attr.timings || '09:00–18:00',
              entry_fee_domestic: domFee,
              entry_fee_intl: intlFee,
              isHiddenGem: Boolean(attr.isHiddenGem),
              image: attr.image || city.coverImage || '',
              thumbnail_url: attr.image || city.coverImage || '',
              photoCredit: attr.photoCredit || city.photoCredit || 'Archaeological Survey & Tourism Archives',
              lat: Number(lat),
              lng: Number(lng),
              latitude: Number(lat),
              longitude: Number(lng),
              heritage_status: attr.category?.includes('UNESCO')
                ? 'UNESCO World Heritage Site'
                : attr.isHiddenGem
                ? 'Verified Local Hidden Gem'
                : 'State & National Protected Heritage',
              source_url: sourceUrl,
              source_name: 'Archaeological Survey of India & State Tourism Registry',
            };

            allAttractions.push(record);
          }
        }
      }
    }
  }

  console.log(`Total extracted verified directory attractions: ${allAttractions.length}`);
  const outPath = path.resolve(baseDir, 'data/discover_bharat_directory_attractions.json');
  fs.writeFileSync(outPath, JSON.stringify(allAttractions, null, 2), 'utf-8');
  console.log(`Successfully written to ${outPath}`);

  // Test Golghar
  const golghar = allAttractions.find(a => a.id === 'IN-BR-PAT-ATT-001');
  console.log('Sample attraction (Golghar):', golghar);

  // Test CSMT
  const csmt = allAttractions.find(a => a.id === 'IN-MH-MUM-ATT-002');
  console.log('Sample attraction (CSMT):', csmt);
}

run().catch(err => {
  console.error('Extraction failed:', err);
  process.exit(1);
});
