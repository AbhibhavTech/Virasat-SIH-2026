import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const directory = resolve(process.argv[2] || 'data/discover_bharat');
const schema = JSON.parse(readFileSync(join(directory, 'discover-bharat-master-schema.json'), 'utf8'));
const regionDirectory = join(directory, 'regions');
const files = readdirSync(regionDirectory).filter((name) => name.endsWith('.json')).sort();
const errors = [];
const warnings = [];
const summaries = [];
const practicalFields = ['opening_hours', 'closing_day', 'entry_fee', 'best_time_to_visit', 'time_needed', 'how_to_reach'];

function hasType(value, type) {
  if (type === 'null') return value === null;
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  return typeof value === type;
}

function validateShape(value, rule, path) {
  if (!rule || typeof rule !== 'object') return;
  const types = Array.isArray(rule.type) ? rule.type : rule.type ? [rule.type] : [];
  if (types.length && !types.some((type) => hasType(value, type))) {
    errors.push(`${path}: expected ${types.join(' or ')}`);
    return;
  }
  if (rule.enum && !rule.enum.includes(value)) errors.push(`${path}: invalid enum value`);
  if (typeof value === 'string' && rule.pattern && !new RegExp(rule.pattern).test(value)) {
    errors.push(`${path}: invalid format`);
  }
  if (Array.isArray(value)) {
    if (rule.minItems !== undefined && value.length < rule.minItems) errors.push(`${path}: too few items`);
    if (rule.maxItems !== undefined && value.length > rule.maxItems) errors.push(`${path}: too many items`);
    value.forEach((item, index) => validateShape(item, rule.items, `${path}[${index}]`));
  }
  if (hasType(value, 'object')) {
    for (const field of rule.required || []) {
      if (!Object.hasOwn(value, field)) errors.push(`${path}.${field}: missing required field`);
    }
    for (const [field, fieldValue] of Object.entries(value)) {
      if (rule.properties?.[field]) validateShape(fieldValue, rule.properties[field], `${path}.${field}`);
    }
  }
}

function validateReferences(data, file) {
  const prefix = `${data.region.id}-`;
  const cityIds = new Set();
  const attractionIds = new Set();
  const attractionsById = new Map();
  for (const city of data.cities) {
    if (cityIds.has(city.id)) errors.push(`${file}: duplicate city id ${city.id}`);
    cityIds.add(city.id);
    if (!city.id.startsWith(prefix)) errors.push(`${file}: city id ${city.id} lacks region prefix`);
  }
  for (const attraction of data.attractions) {
    if (attractionIds.has(attraction.id)) errors.push(`${file}: duplicate attraction id ${attraction.id}`);
    attractionIds.add(attraction.id);
    attractionsById.set(attraction.id, attraction);
    if (!attraction.id.startsWith(prefix)) errors.push(`${file}: attraction id ${attraction.id} lacks region prefix`);
    if (attraction.city_id !== null && !cityIds.has(attraction.city_id)) {
      errors.push(`${file}: ${attraction.id} points to missing city ${attraction.city_id}`);
    }
    const allowed = schema.taxonomy?.[attraction.category] || [];
    for (const subcategory of attraction.sub_categories) {
      if (!allowed.includes(subcategory)) errors.push(`${file}: ${attraction.id} uses invalid ${attraction.category} subcategory ${subcategory}`);
    }
  }
  const listedCityIds = new Set(data.region.cities);
  for (const id of data.region.cities) if (!cityIds.has(id)) errors.push(`${file}: region cites missing city ${id}`);
  for (const id of cityIds) if (!listedCityIds.has(id)) errors.push(`${file}: city ${id} absent from region.cities`);
  for (const id of data.region.top_attractions) {
    if (!attractionIds.has(id)) errors.push(`${file}: top attraction ${id} missing`);
  }
  for (const city of data.cities) {
    for (const id of city.attractions) {
      const attraction = attractionsById.get(id);
      if (!attraction) errors.push(`${file}: ${city.id} cites missing attraction ${id}`);
      else if (attraction.city_id !== city.id) errors.push(`${file}: ${id} assigned to ${attraction.city_id}, listed by ${city.id}`);
      if (attraction?.is_hidden_gem) warnings.push(`${file}: ${id} is hidden but listed among core attractions`);
    }
    for (const id of city.hidden_gems) {
      const attraction = attractionsById.get(id);
      if (!attraction) errors.push(`${file}: ${city.id} cites missing hidden gem ${id}`);
      else if (attraction.city_id !== city.id) errors.push(`${file}: ${id} assigned to ${attraction.city_id}, listed by ${city.id}`);
      if (attraction && !attraction.is_hidden_gem) errors.push(`${file}: ${id} listed as hidden gem but is_hidden_gem is false`);
    }
  }
  const hiddenCount = data.attractions.filter((attraction) => attraction.is_hidden_gem).length;
  if (data.region.id === 'mh') {
    for (const city of data.cities) {
      const minimum = /mumbai|pune/i.test(city.name) ? 15 : 5;
      if (city.hidden_gems.length < minimum) errors.push(`${file}: ${city.name} needs at least ${minimum} hidden gems`);
    }
  } else if (hiddenCount > 5) errors.push(`${file}: hidden gems exceed the 5-region limit`);
  const referenced = new Set([...data.region.top_attractions, ...data.cities.flatMap((city) => [...city.attractions, ...city.hidden_gems])]);
  for (const id of attractionIds) if (!referenced.has(id)) warnings.push(`${file}: ${id} has no region/city card reference`);
  const imagesNeeded = Number(data.region.image?.status === 'needed') + data.cities.filter((city) => city.image?.status === 'needed').length + data.attractions.filter((attraction) => attraction.image?.status === 'needed').length;
  const practicalChecksNeeded = data.attractions.reduce((count, attraction) => count + practicalFields.filter((field) => attraction.detail_page?.[field]?.status === 'needs_verification').length, 0);
  const liveDatesNeeded = data.region.live_updates.filter((update) => update.date_status === 'needs_verification').length;
  summaries.push({ file, region: data.region.name, cities: data.cities.length, attractions: data.attractions.length,
    hiddenGems: hiddenCount,
    pending: data.attractions.filter((attraction) => attraction.verification_status === 'pending').length,
    imagesNeeded, practicalChecksNeeded, liveDatesNeeded,
    publishReady: !data.attractions.some((attraction) => attraction.verification_status !== 'verified') && !imagesNeeded && !practicalChecksNeeded && !liveDatesNeeded });
}

for (const file of files) {
  try {
    const data = JSON.parse(readFileSync(join(regionDirectory, file), 'utf8'));
    validateShape(data, schema, file);
    if (data.region && Array.isArray(data.cities) && Array.isArray(data.attractions)) validateReferences(data, file);
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}

console.log(JSON.stringify({ files: files.length, summaries, errors: errors.slice(0, 80), errorCount: errors.length,
  warnings: warnings.slice(0, 80), warningCount: warnings.length }, null, 2));
if (errors.length) process.exitCode = 1;
