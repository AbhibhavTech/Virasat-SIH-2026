import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const citiesJsonPath = path.join(rootDir, 'data', 'cities.json');
const itineraryDataPath = path.join(rootDir, 'src', 'data', 'cityItineraryData.ts');

const cities = JSON.parse(fs.readFileSync(citiesJsonPath, 'utf-8'));

// Build CityOption items
const popularIds = new Set([
  'mumbai', 'delhi', 'jaipur', 'agra', 'kochi', 'goa', 'varanasi', 'srinagar',
  'leh', 'kolkata', 'bengaluru', 'chennai', 'amritsar', 'udaipur', 'jodhpur',
  'hampi', 'madurai', 'gaya', 'khajuraho', 'bhubaneswar', 'hyderabad',
  'shimla', 'pune', 'chhatrapati-sambhaji-nagar', 'sri-vijaya-puram'
]);

const cityOptions = cities.map(c => ({
  id: c.id,
  name: c.name,
  state: c.state,
  state_id: c.state_id,
  displayName: `${c.name} (${c.state})`,
  popular: popularIds.has(c.id)
}));

// Read file content
const content = fs.readFileSync(itineraryDataPath, 'utf-8');

const startMarker = 'export const ALL_INDIAN_TOURISM_CITIES: CityOption[] = [';
const startIndex = content.indexOf(startMarker);

// Find the closing ]; before getVerifiedCityPlan
const resolverMarker = 'export function getVerifiedCityPlan(';
const resolverIndex = content.indexOf(resolverMarker, startIndex);
const endIndex = content.lastIndexOf('];', resolverIndex);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find start or end markers for ALL_INDIAN_TOURISM_CITIES');
  process.exit(1);
}

const newCitiesBlock = `export const ALL_INDIAN_TOURISM_CITIES: CityOption[] = ${JSON.stringify(cityOptions, null, 2)};`;

const newContent = content.slice(0, startIndex) + newCitiesBlock + content.slice(endIndex + 2);

fs.writeFileSync(itineraryDataPath, newContent, 'utf-8');
console.log(`✓ Updated ALL_INDIAN_TOURISM_CITIES with ${cityOptions.length} canonical cities in ${itineraryDataPath}`);
