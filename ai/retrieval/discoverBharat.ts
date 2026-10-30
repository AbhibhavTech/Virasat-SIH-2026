import fs from 'node:fs';
import path from 'node:path';

export type DiscoverAttraction = {
  id: string;
  name: string;
  city: string;
  city_id: string;
  state: string;
  state_id: string;
  category: string;
  sub_categories: string[];
  summary: string;
  is_hidden_gem: boolean;
  verification_status: string;
  source_dataset: string;
  detail_page: Record<string, any>;
  url: string;
};

export type DiscoverRegion = { id: string; name: string; type: string; tagline: string; overview: string; verification_status: string };
export type DiscoverCity = { id: string; name: string; state: string; state_id: string; tagline: string; blurb: string; attraction_ids: string[]; hidden_gem_ids: string[]; url: string };

const regionsDir = path.resolve(process.cwd(), 'data/discover_bharat/regions');
const andhraCandidatesFile = path.resolve(process.cwd(), 'data/andhra_pradesh_hidden_gems.draft.json');
const maharashtraDestinationsFile = path.resolve(process.cwd(), 'data/maharashtra_destinations.json');
let cache: { stamp: string; regions: DiscoverRegion[]; cities: DiscoverCity[]; attractions: DiscoverAttraction[] } | undefined;

function text(value: unknown): string {
  if (typeof value !== 'string') return '';
  const clean = value.trim();
  return !clean || /^(null|undefined|\[.*(?:words|to be confirmed|placeholder).*\])$/i.test(clean) ? '' : clean;
}

function records() {
  if (!fs.existsSync(regionsDir)) return [] as any[];
  return fs.readdirSync(regionsDir).filter(file => file.toLowerCase().endsWith('.json')).sort().map(file => {
    try { return { file, value: JSON.parse(fs.readFileSync(path.join(regionsDir, file), 'utf8')) }; }
    catch { return null; }
  }).filter(Boolean) as Array<{ file: string; value: any }>;
}

function supplementalStamp(file: string) { return fs.existsSync(file) ? `${path.basename(file)}:${fs.statSync(file).mtimeMs}` : `${path.basename(file)}:missing`; }
function readArray(file: string) { try { const value = JSON.parse(fs.readFileSync(file, 'utf8')); return Array.isArray(value) ? value : []; } catch { return []; } }

export function loadDiscoverBharat() {
  const files = records();
  const stamp = [files.map(({ file }) => `${file}:${fs.statSync(path.join(regionsDir, file)).mtimeMs}`).join('|'), supplementalStamp(andhraCandidatesFile), supplementalStamp(maharashtraDestinationsFile)].join('|');
  if (cache?.stamp === stamp) return cache;
  const regions: DiscoverRegion[] = [];
  const cities: DiscoverCity[] = [];
  const attractions: DiscoverAttraction[] = [];
  for (const { value } of files) {
    const region = value.region;
    if (!region?.id || !region?.name) continue;
    regions.push({ id: String(region.id), name: String(region.name), type: String(region.type || 'region'), tagline: text(region.tagline), overview: text(region.overview), verification_status: String(region.verification_status || 'pending') });
    const cityMap = new Map<string, any>();
    for (const city of value.cities || []) if (city?.id && city?.name) {
      const entry = { id: String(city.id), name: String(city.name), state: String(region.name), state_id: String(region.id), tagline: text(city.tagline), blurb: text(city.blurb), attraction_ids: Array.isArray(city.attractions) ? city.attractions.map(String) : [], hidden_gem_ids: Array.isArray(city.hidden_gems) ? city.hidden_gems.map(String) : [], url: `/explore?state=${encodeURIComponent(region.name)}&city=${encodeURIComponent(city.name)}` };
      cities.push(entry); cityMap.set(entry.id, entry);
    }
    for (const item of value.attractions || []) {
      if (!item?.id || !item?.name) continue;
      const city = cityMap.get(String(item.city_id));
      const detail = item.detail_page && typeof item.detail_page === 'object' ? item.detail_page : {};
      const image = item.image && typeof item.image === 'object' ? item.image : {};
      const sanitizedDetail = {
        overview: text(detail.overview),
        important_facts: Array.isArray(detail.important_facts) ? detail.important_facts.map(text).filter(Boolean) : [],
        fascinating_facts: Array.isArray(detail.fascinating_facts) ? detail.fascinating_facts.map(text).filter(Boolean) : [],
        opening_hours: detail.opening_hours?.status === 'verified' && text(detail.opening_hours.value) ? detail.opening_hours.value : null,
        opening_hours_status: detail.opening_hours?.status || 'needs_verification',
        closing_day: detail.closing_day?.status === 'verified' && text(detail.closing_day.value) ? detail.closing_day.value : null,
        closing_day_status: detail.closing_day?.status || 'needs_verification',
        entry_fee: detail.entry_fee?.status === 'verified' && text(detail.entry_fee.value) ? detail.entry_fee.value : null,
        entry_fee_status: detail.entry_fee?.status || 'needs_verification',
        best_time_to_visit: detail.best_time_to_visit?.status === 'verified' && text(detail.best_time_to_visit.value) ? detail.best_time_to_visit.value : null,
        best_time_status: detail.best_time_to_visit?.status || 'needs_verification',
        time_needed: detail.time_needed?.status === 'verified' && text(detail.time_needed.value) ? detail.time_needed.value : null,
        time_needed_status: detail.time_needed?.status || 'needs_verification',
        nearby_hotels: Array.isArray(detail.nearby_hotels) ? detail.nearby_hotels.filter((v: any) => text(v?.name)).map((v: any) => ({ name: text(v.name), area: text(v.area) || null })) : [],
        nearby_restaurants: Array.isArray(detail.nearby_restaurants) ? detail.nearby_restaurants.filter((v: any) => text(v?.name)).map((v: any) => ({ name: text(v.name), area: text(v.area) || null })) : [],
        how_to_reach: detail.how_to_reach?.status === 'verified' && text(detail.how_to_reach.value) ? detail.how_to_reach.value : null,
        how_to_reach_status: detail.how_to_reach?.status || 'needs_verification',
        local_tip: text(detail.local_tip),
        image_brief: image.status === 'needed' ? text(image.brief) : '',
      };
      attractions.push({ id: String(item.id), name: String(item.name), city: city?.name || '', city_id: String(item.city_id || ''), state: String(region.name), state_id: String(region.id), category: String(item.category || 'Attraction'), sub_categories: Array.isArray(item.sub_categories) ? item.sub_categories.map(String) : [], summary: text(item.summary), is_hidden_gem: item.is_hidden_gem === true, verification_status: String(item.verification_status || 'pending'), source_dataset: 'discover-bharat-region-draft', detail_page: sanitizedDetail, url: city ? city.url : `/explore?state=${encodeURIComponent(region.name)}` });
    }
  }
  for (const item of readArray(maharashtraDestinationsFile)) {
    if (!item?.id || !item?.name) continue;
    const hidden = String(item.type || '').toLowerCase() === 'hidden';
    attractions.push({ id: String(item.id), name: String(item.name), city: text(item.city), city_id: String(item.city || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'), state: 'Maharashtra', state_id: 'maharashtra', category: String(item.category || 'Attraction'), sub_categories: [], summary: text(item.overview), is_hidden_gem: hidden, verification_status: String(item.verification_status || 'unreviewed'), source_dataset: 'maharashtra-destinations-catalogue', detail_page: {
      overview: text(item.overview), important_facts: [text(item.history_or_significance)].filter(Boolean), fascinating_facts: [],
      opening_hours: null, opening_hours_status: 'needs_current_confirmation', closing_day: null, closing_day_status: 'needs_current_confirmation',
      entry_fee: null, entry_fee_status: 'needs_current_confirmation', best_time_to_visit: null, best_time_status: 'needs_current_confirmation',
      time_needed: null, time_needed_status: 'needs_verification', nearby_hotels: [], nearby_restaurants: [], how_to_reach: null,
      how_to_reach_status: 'needs_current_confirmation', local_tip: text(item.safety_notes),
    }, url: `/explore?state=Maharashtra&city=${encodeURIComponent(text(item.city))}` });
  }
  try {
    const candidateFile = JSON.parse(fs.readFileSync(andhraCandidatesFile, 'utf8'));
    if (candidateFile.state && !regions.some(region => region.name.toLowerCase() === String(candidateFile.state).toLowerCase())) {
      regions.push({ id: String(candidateFile.state_id || 'andhra-pradesh'), name: String(candidateFile.state), type: 'state', tagline: 'Local-first place candidates for review', overview: text(candidateFile.purpose), verification_status: 'draft_needs_local_validation' });
    }
    for (const item of candidateFile.candidates || []) {
      if (!item?.id || !item?.name) continue;
      attractions.push({ id: String(item.id), name: String(item.name), city: text(item.locality || item.district), city_id: String(item.locality || item.district || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'), state: 'Andhra Pradesh', state_id: 'andhra-pradesh', category: 'Hidden Gem Candidate', sub_categories: Array.isArray(item.experience_tags) ? item.experience_tags.map(String) : [], summary: text(item.description), is_hidden_gem: true, verification_status: String(item.verification_status || 'needs_local_validation'), source_dataset: 'andhra-pradesh-hidden-gem-candidates-draft', detail_page: {
        overview: text(item.description), important_facts: [text(item.why_candidate)].filter(Boolean), fascinating_facts: [],
        opening_hours: null, opening_hours_status: 'needs_current_confirmation', closing_day: null, closing_day_status: 'needs_current_confirmation',
        entry_fee: null, entry_fee_status: 'needs_current_confirmation', best_time_to_visit: null, best_time_status: 'needs_verification',
        time_needed: null, time_needed_status: 'needs_verification', nearby_hotels: [], nearby_restaurants: [], how_to_reach: null,
        how_to_reach_status: 'needs_current_confirmation', local_tip: '',
      }, url: '/explore?state=Andhra%20Pradesh' });
    }
  } catch { /* The supplemental Andhra candidate file is optional. */ }
  const uniqueAttractions = new Map<string, DiscoverAttraction>();
  for (const place of attractions) {
    const key = [place.state, place.city, place.name].map(value => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()).join('|');
    const previous = uniqueAttractions.get(key);
    if (!previous || (/^verified$/i.test(place.verification_status) && !/^verified$/i.test(previous.verification_status))) uniqueAttractions.set(key, place);
  }
  cache = { stamp, regions, cities, attractions: [...uniqueAttractions.values()] };
  return cache;
}

export function discoverBharatStamp() { return loadDiscoverBharat().stamp; }

export function discoverBharatDocuments() {
  const data = loadDiscoverBharat();
  return [
    ...data.regions.map(region => ({ id: `discover/region/${region.id}`, entity_id: region.id, name: region.name, city: '', state: region.name, category: 'region', text: `${region.name}\n${region.tagline}\n${region.overview}`, review_status: region.verification_status, url: `/explore?state=${encodeURIComponent(region.id)}` })),
    ...data.cities.map(city => ({ id: `discover/city/${city.id}`, entity_id: city.id, name: city.name, city: city.name, state: city.state, category: 'city', text: `${city.name}, ${city.state}\n${city.tagline}\n${city.blurb}\nAttraction IDs: ${city.attraction_ids.join(', ')}\nHidden gem IDs: ${city.hidden_gem_ids.join(', ')}`, review_status: 'pending_editorial_dataset', url: city.url })),
    ...data.attractions.map(place => ({ id: `discover/attraction/${place.id}`, entity_id: place.id, name: place.name, city: place.city, state: place.state, category: place.category, text: `${place.name} (${place.sub_categories.join(', ')})\n${place.city}, ${place.state}\n${place.is_hidden_gem ? 'Hidden-gem listing/candidate' : 'Attraction'}; review status: ${place.verification_status}; source dataset: ${place.source_dataset}\n${place.summary}\n${JSON.stringify(place.detail_page)}`, review_status: place.verification_status, url: place.url })),
  ].filter(document => document.text.trim().length > 0);
}
