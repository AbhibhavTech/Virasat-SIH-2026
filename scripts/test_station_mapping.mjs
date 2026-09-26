import fs from 'fs';

const stations = JSON.parse(fs.readFileSync('data/railway_stations.json', 'utf8'));
const cities = JSON.parse(fs.readFileSync('data/cities.json', 'utf8'));

// Include our new canonical cities khajuraho and patan
const cityIds = new Set(cities.map(c => c.id));
cityIds.add('khajuraho');
cityIds.add('patan');

const stationCityToCityId = {
  'mumbai': 'mumbai',
  'delhi': 'delhi',
  'new delhi': 'delhi',
  'kolkata': 'kolkata',
  'patna': 'patna',
  'agra': 'agra',
  'jaipur': 'jaipur',
  'varanasi': 'varanasi',
  'amritsar': 'amritsar',
  'bengaluru': 'bengaluru',
  'chennai': 'chennai',
  'hyderabad': 'hyderabad',
  'ahmedabad': 'ahmedabad',
  'pune': 'pune',
  'bhopal': 'bhopal',
  'lucknow': 'lucknow',
  'kochi': 'kochi',
  'thiruvananthapuram': 'thiruvananthapuram',
  'guwahati': 'guwahati',
  'bhubaneswar': 'bhubaneswar',
  'puri': 'puri',
  'shimla': 'shimla',
  'dehradun': 'dehradun',
  'haridwar': 'haridwar',
  'rishikesh': 'rishikesh',
  'madurai': 'madurai',
  'mysuru': 'mysuru',
  'gwalior': 'gwalior',
  'jodhpur': 'jodhpur',
  'udaipur': 'udaipur',
  'chhatrapati sambhajinagar': 'chhatrapati-sambhaji-nagar',
  'hosapete / hampi': 'hampi',
  'khajuraho': 'khajuraho',
  'katra': 'jammu',
  'banihal': 'srinagar',
  'pathankot': 'amritsar',
};

console.log('Total stations:', stations.length);
let mappedCount = 0;
let unmappedCount = 0;

for (const s of stations) {
  const normCity = (s.city || '').toLowerCase().trim();
  const directMatch = cityIds.has(normCity) ? normCity : null;
  const aliasMatch = stationCityToCityId[normCity];
  const finalId = directMatch || aliasMatch;

  if (finalId && cityIds.has(finalId)) {
    mappedCount++;
    console.log(`[OK] [${s.code}] "${s.name}" (city: "${s.city}") -> city_id: "${finalId}"`);
  } else {
    unmappedCount++;
    console.log(`[FAIL] [${s.code}] "${s.name}" (city: "${s.city}") -> NOT MAPPED`);
  }
}

console.log(`\nResult: ${mappedCount} mapped, ${unmappedCount} unmapped out of ${stations.length}`);
