import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const databasePath = path.join(root, 'data', 'india_tourism_database.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
const categoryFields = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];

const places = [];
const attractions = [];
const districts = new Set();
let cityOverviewEntries = 0;
const stateReports = (database.states || []).map((state) => {
  const cityList = state.cities || [];
  const placeCountsByCategory = Object.fromEntries(categoryFields.map((field) => [field, 0]));
  let verified = 0;
  let sourced = 0;
  let withValidCoordinates = 0;

  for (const city of cityList) {
    if (city.district) districts.add(`${state.id}:${city.district}`.toLowerCase());
    for (const field of categoryFields) {
      for (const place of city[field] || []) {
        const record = { ...place, city: city.name, state: state.name, category_bucket: field };
        places.push(record);
        if ((place.name || '').trim().toLowerCase() === (city.name || '').trim().toLowerCase()) {
          cityOverviewEntries += 1;
          continue;
        }
        placeCountsByCategory[field] += 1;
        attractions.push(record);
        if (place.verification_status === 'verified' || place.is_verified === true || place.verified === true) verified += 1;
        if (place.source_url || place.source_page || place.official_source_url) sourced += 1;
        const lat = Number(place.coordinates?.lat ?? place.lat);
        const lng = Number(place.coordinates?.lng ?? place.lng);
        if (Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && (lat !== 0 || lng !== 0)) {
          withValidCoordinates += 1;
        }
      }
    }
  }

  return {
    id: state.id,
    name: state.name,
    cities: cityList.length,
    places: Object.values(placeCountsByCategory).reduce((sum, count) => sum + count, 0),
    city_overview_entries: cityList.reduce((sum, city) => sum + categoryFields.reduce((count, field) => count + (city[field] || []).filter((place) => (place.name || '').trim().toLowerCase() === (city.name || '').trim().toLowerCase()).length, 0), 0),
    place_counts_by_category: placeCountsByCategory,
    records_marked_verified_in_registry: verified,
    records_with_source_link: sourced,
    records_with_valid_coordinates: withValidCoordinates,
  };
});

const actualCityCount = (database.states || []).reduce((sum, state) => sum + (state.cities || []).length, 0);
const actualPlaceCount = places.length;
const categoryTotals = Object.fromEntries(categoryFields.map((field) => [
  field,
  stateReports.reduce((sum, state) => sum + state.place_counts_by_category[field], 0),
]));

console.log(JSON.stringify({
  source_file: path.relative(root, databasePath),
  measured_at: new Date().toISOString(),
  declared_counts: {
    states: database.states_count,
    cities: database.cities_count,
    attractions: database.attractions_count,
  },
  measured_counts: {
    states: stateReports.length,
    cities: actualCityCount,
    distinct_district_labels: districts.size,
    place_entries: actualPlaceCount,
    city_overview_entries: cityOverviewEntries,
    attraction_records: attractions.length,
    unique_attraction_ids: new Set(attractions.map((place) => place.id)).size,
    records_marked_verified_in_registry: attractions.filter((place) => place.verification_status === 'verified' || place.is_verified === true || place.verified === true).length,
    records_with_source_link: attractions.filter((place) => place.source_url || place.source_page || place.official_source_url).length,
    records_with_valid_coordinates: attractions.filter((place) => {
      const lat = Number(place.coordinates?.lat ?? place.lat);
      const lng = Number(place.coordinates?.lng ?? place.lng);
      return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && (lat !== 0 || lng !== 0);
    }).length,
  },
  category_totals: categoryTotals,
  states: stateReports,
}, null, 2));
