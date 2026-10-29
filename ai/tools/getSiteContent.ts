import { db } from '../../server/src/db/client';
import fs from 'fs';
import path from 'path';
import { FEATURE_HELP, FEATURE_REGISTRY } from '../config/featureRegistry';

export const declaration = {
  name: 'getSiteContent',
  description: 'Retrieve Virasat page guidance or stored details for a specific tourist place. Use feature for a page, query for a page/how-to question, or place_name/place_id for a place. Missing operating details stay unknown.',
  parameters: {
    type: 'OBJECT',
    properties: {
      feature: { type: 'STRING', enum: Object.keys(FEATURE_REGISTRY), description: 'Virasat page key, such as discover, map, itinerary, festivals, or heritage.' },
      query: { type: 'STRING', description: 'Question about using Virasat or its pages.' },
      place_id: {
        type: 'STRING',
        description: 'ID of the place (e.g., "DEL001", "andhra_pradesh_001", "taj-mahal").',
      },
      place_name: {
        type: 'STRING',
        description: 'Name of the monument or tourist place if ID is unknown.',
      },
    },
  },
};

export async function execute(args: { feature?: keyof typeof FEATURE_REGISTRY; query?: string; place_id?: string; place_name?: string }): Promise<any> {
  if (args.feature && Object.prototype.hasOwnProperty.call(FEATURE_HELP, args.feature)) {
    return { type: 'website_guide', feature: args.feature, label: FEATURE_REGISTRY[args.feature].label,
      path: FEATURE_REGISTRY[args.feature].path, ...FEATURE_HELP[args.feature] };
  }
  if (args.query && !args.place_id && !args.place_name) {
    const terms = args.query.toLowerCase().split(/[^a-z0-9]+/).filter(term => term.length > 2);
    const matches = Object.entries(FEATURE_HELP).map(([feature, help]) => {
      const searchable = `${feature} ${FEATURE_REGISTRY[feature as keyof typeof FEATURE_REGISTRY].label} ${help.overview} ${help.actions.join(' ')}`.toLowerCase();
      return { feature: feature as keyof typeof FEATURE_REGISTRY, score: terms.filter(term => searchable.includes(term)).length };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
    if (matches.length) return { type: 'website_guide', results: matches.map(({ feature }) => ({ feature,
      label: FEATURE_REGISTRY[feature].label, path: FEATURE_REGISTRY[feature].path, ...FEATURE_HELP[feature] })) };
  }
  const pid = (args.place_id || '').toLowerCase().trim();
  const pname = (args.place_name || args.query || '').toLowerCase().trim();

  // 1. Check place facts in db
  let placeRecord: any = null;
  if (pid) {
    placeRecord = await db.places.findById(pid);
  }

  // 2. Scan india_tourism_database.json for rich metadata
  const dbPath = path.join(process.cwd(), 'data', 'india_tourism_database.json');
  let matchedPlace: any = null;
  let stateName = '';
  let cityName = '';

  if (fs.existsSync(dbPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      outer: for (const s of data.states || []) {
        for (const c of s.cities || []) {
          const allPlaces = [
            ...(c.heritage || []),
            ...(c.monuments || []),
            ...(c.museums || []),
            ...(c.tourist_places || []),
            ...(c.religious_cultural || []),
            ...(c.nature_parks_zoo || []),
          ];
          for (const p of allPlaces) {
            const idMatch = pid && p.id.toLowerCase() === pid;
            const nameMatch = pname && (p.name.toLowerCase() === pname || p.name.toLowerCase().includes(pname));
            if (idMatch || nameMatch) {
              matchedPlace = p;
              stateName = s.name;
              cityName = c.name;
              break outer;
            }
          }
        }
      }
    } catch {
      // Ignore
    }
  }

  const facts = pid ? await db.placeFacts.findByPlaceId(pid) : [];

  if (matchedPlace) {
    return {
      place_id: matchedPlace.id,
      name: matchedPlace.name,
      city: cityName || null,
      state: stateName || null,
      category: matchedPlace.category || 'National Heritage Monument',
      topic: matchedPlace.topic || 'Heritage',
      summary: matchedPlace.summary || matchedPlace.description || null,
      detailed_description: matchedPlace.detailed_description || matchedPlace.description || null,
      coordinates: matchedPlace.coordinates,
      visiting_hours: matchedPlace.visiting_hours || matchedPlace.timings || null,
      visiting_hours_status: matchedPlace.visiting_hours || matchedPlace.timings ? 'recorded_not_live_confirmed' : 'needs_verification',
      entry_fee: matchedPlace.entry_fee ?? null,
      entry_fee_status: matchedPlace.entry_fee !== undefined && matchedPlace.entry_fee !== null ? 'recorded_not_live_confirmed' : 'needs_verification',
      best_time_to_visit: matchedPlace.best_time_to_visit || null,
      best_time_status: matchedPlace.best_time_to_visit ? 'recorded' : 'needs_verification',
      nearby_hotels: (matchedPlace.hotels || []).slice(0, 3),
      verified_facts: facts.map((f) => ({
        key: f.fact_key,
        value: f.fact_value,
        source: f.source_url,
      })),
      official_registry_url: matchedPlace.source_url || matchedPlace.source_page || null,
      verification_status: matchedPlace.verification_status || 'unreviewed',
    };
  }

  if (placeRecord) {
    return {
      place_id: placeRecord.id,
      name: placeRecord.name,
      city: placeRecord.city_id,
      summary: placeRecord.summary,
      rating: placeRecord.rating,
      verified_facts: facts,
      official_source: placeRecord.source_url,
      verification_status: placeRecord.verification_status || 'unreviewed',
    };
  }

  return {
    found: false,
    message: `No matching stored details for query "${args.place_id || args.place_name || args.query || ''}". This does not mean the place does not exist.`,
  };
}
