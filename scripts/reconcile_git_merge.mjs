import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();

console.log('=== Starting Master Database Reconciliation for Git Merge ===');

// 1. Get raw JSON strings from git revisions
console.log('Fetching ITDB and cities from origin/main and local-backup-work...');
const originItdbRaw = execSync('git show origin/main:data/india_tourism_database.json', { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
const localItdbRaw = execSync('git show local-backup-work:data/india_tourism_database.json', { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });

const originCitiesRaw = execSync('git show origin/main:data/cities.json', { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
const localCitiesRaw = execSync('git show local-backup-work:data/cities.json', { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });

const originItdb = JSON.parse(originItdbRaw);
const localItdb = JSON.parse(localItdbRaw);

const originCities = JSON.parse(originCitiesRaw);
const localCities = JSON.parse(localCitiesRaw);

// States where local work has the authoritative city-assigned integration
const LOCAL_STATES = new Set([
  'kerala',
  'sikkim',
  'tripura',
  'uttarakhand',
  'andhra-pradesh',
  'arunachal-pradesh',
  'assam',
  'himachal-pradesh',
  'odisha',
  'rajasthan',
  'jharkhand',
  'andaman-and-nicobar-islands',
  'chandigarh',
  'dadra-and-nagar-haveli-and-daman-and-diu',
  'delhi',
  'jammu-and-kashmir',
  'ladakh',
  'lakshadweep',
  'puducherry',
]);

// 2. Reconcile states in ITDB
const mergedStatesMap = new Map();

// First add all states from origin (which has Haryana, Bihar, UP, Karnataka, Chhattisgarh, Telangana, Nagaland, etc.)
for (const state of originItdb.states || []) {
  mergedStatesMap.set(state.id, state);
}

// Then overwrite with local states for our integrated states
for (const state of localItdb.states || []) {
  if (LOCAL_STATES.has(state.id)) {
    mergedStatesMap.set(state.id, state);
  }
}

const reconciledStates = Array.from(mergedStatesMap.values());
const totalAttractions = reconciledStates.reduce((sum, s) => sum + (s.total_attractions || (s.cities ? s.cities.reduce((cs, c) => cs + (c.places ? c.places.length : 0), 0) : 0)), 0);
const totalCities = reconciledStates.reduce((sum, s) => sum + (s.total_cities || (s.cities ? s.cities.length : 0)), 0);

const reconciledItdb = {
  version: '2.0.0',
  last_updated: '2026-09-11',
  total_states: reconciledStates.length,
  total_cities: totalCities,
  total_places: totalAttractions,
  states: reconciledStates,
};

fs.writeFileSync(path.join(rootDir, 'data', 'india_tourism_database.json'), JSON.stringify(reconciledItdb, null, 2), 'utf8');
console.log(`✓ Wrote reconciled data/india_tourism_database.json (States: ${reconciledStates.length}, Cities: ${totalCities}, Attractions: ${totalAttractions})`);

// 3. Update src/data/indiaTourismDatabase.ts
const tsContent = `// Auto-generated master India Tourism Database
export const INDIA_TOURISM_DATABASE = ${JSON.stringify(reconciledItdb, null, 2)} as const;

export default INDIA_TOURISM_DATABASE;
`;
fs.writeFileSync(path.join(rootDir, 'src', 'data', 'indiaTourismDatabase.ts'), tsContent, 'utf8');
console.log('✓ Wrote src/data/indiaTourismDatabase.ts');

// 4. Reconcile data/cities.json
const reconciledCities = [
  ...originCities.filter((c) => !LOCAL_STATES.has(c.state_id)),
  ...localCities.filter((c) => LOCAL_STATES.has(c.state_id)),
];

fs.writeFileSync(path.join(rootDir, 'data', 'cities.json'), JSON.stringify(reconciledCities, null, 2), 'utf8');
console.log(`✓ Wrote reconciled data/cities.json (Total cities: ${reconciledCities.length})`);

// 5. Reconcile data/states.json
const statesJsonPath = path.join(rootDir, 'data', 'states.json');
const statesJson = JSON.parse(fs.readFileSync(statesJsonPath, 'utf8'));

for (const stateObj of statesJson) {
  const matchingState = mergedStatesMap.get(stateObj.id);
  if (matchingState) {
    stateObj.total_cities = matchingState.total_cities || (matchingState.cities ? matchingState.cities.length : stateObj.total_cities);
    stateObj.total_attractions = matchingState.total_attractions || stateObj.total_attractions;
  }
}

fs.writeFileSync(statesJsonPath, JSON.stringify(statesJson, null, 2), 'utf8');
console.log('✓ Synchronized data/states.json');

console.log('=== Database Reconciliation Complete ===');
