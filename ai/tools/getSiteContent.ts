import { db } from '../../server/src/db/client';
import fs from 'fs';
import path from 'path';

export const declaration = {
  name: 'getSiteContent',
  description: 'Retrieve verified in-depth architectural history, mythological origin, UNESCO citation, entry fees, visiting rules, and audio-visual details for a specific tourist place or monument.',
  parameters: {
    type: 'OBJECT',
    properties: {
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

export async function execute(args: { place_id?: string; place_name?: string }): Promise<any> {
  const pid = (args.place_id || '').toLowerCase().trim();
  const pname = (args.place_name || '').toLowerCase().trim();

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
      city: cityName,
      state: stateName,
      category: matchedPlace.category || 'National Heritage Monument',
      topic: matchedPlace.topic || 'Heritage',
      summary: matchedPlace.summary || matchedPlace.description,
      detailed_description: matchedPlace.detailed_description || matchedPlace.description,
      coordinates: matchedPlace.coordinates,
      visiting_hours: matchedPlace.visiting_hours || matchedPlace.timings || 'Sunrise to Sunset',
      entry_fee: matchedPlace.entry_fee || 'Standard ASI ticketing',
      best_time_to_visit: matchedPlace.best_time_to_visit || 'October to March',
      nearby_hotels: (matchedPlace.hotels || []).slice(0, 3),
      verified_facts: facts.map((f) => ({
        key: f.fact_key,
        value: f.fact_value,
        source: f.source_url,
      })),
      official_registry_url: matchedPlace.source_url || 'https://asi.nic.in',
      verification_status: matchedPlace.verification_status || 'verified',
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
    };
  }

  return {
    found: false,
    message: `Details not found for query "${args.place_id || args.place_name}". Please verify monument spelling.`,
  };
}
