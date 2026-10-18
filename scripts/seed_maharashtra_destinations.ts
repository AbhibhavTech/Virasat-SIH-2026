import fs from 'fs';
import path from 'path';
import { db } from '../server/src/db/client';

export async function seedMaharashtraDestinations() {
  console.log('[Seed Maharashtra] Starting idempotent Maharashtra destinations seed...');

  const jsonPath = path.resolve(process.cwd(), 'data/maharashtra_destinations.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Authoritative file not found: ${jsonPath}`);
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const destinations: any[] = JSON.parse(raw);

  if (destinations.length !== 40) {
    throw new Error(`Expected exactly 40 Maharashtra destinations, found ${destinations.length}`);
  }

  // 1. Initialize database
  await db.init();

  // 2. Idempotently insert into db.places
  let seededCount = 0;
  for (const d of destinations) {
    const placeRecord: any = {
      id: d.id,
      name: d.name,
      city_id: d.city.toLowerCase(),
      city: d.city,
      state_id: 'maharashtra',
      state: 'Maharashtra',
      category: d.category.toLowerCase(),
      category_label: d.category,
      topic: d.category,
      description: d.overview,
      history: d.history_or_significance,
      latitude: d.latitude,
      longitude: d.longitude,
      coordinates: d.coordinates,
      lat: d.latitude,
      lng: d.longitude,
      thumbnail_url: d.thumbnail_url || d.image.url,
      images: [d.image.url],
      source_url: d.sources?.[0]?.url || d.sources?.[0]?.source_url || 'https://en.wikipedia.org/wiki/' + encodeURIComponent(d.name.replace(/ /g, '_')),
      source_name: d.sources?.[0]?.title || d.name,
      source_quality: 'place_specific',
      last_verified_on: d.last_checked || new Date().toISOString().split('T')[0],
      verification_status: d.verification_status.toLowerCase(),
      data_confidence: d.community_listed ? 'community_reported' : 'official',
      provenance_type: d.community_listed ? 'community_pick' : 'official_monument',
      community_listed: d.community_listed,
      type: d.type,
      overview_word_count: d.overview_word_count,
      visiting_info: {
        best_time_to_visit: d.visit_info.best_time,
        entry_fee: d.visit_info.entry,
        closed_days: d.visit_info.closed_days,
        how_to_reach: d.visit_info.how_to_reach,
        local_tip: d.visit_info.local_tip,
        safety_notes: d.safety_notes,
      },
      sources: d.sources,
      last_checked: d.last_checked,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Find existing by ID or by (name, city_id)
    let targetPlace = await db.places.findById(d.id);
    if (!targetPlace) {
      const allPlaces = (db as any).data?.places ? Object.values((db as any).data.places) : [];
      targetPlace = allPlaces.find(
        (p: any) =>
          p.city_id?.toLowerCase() === d.city.toLowerCase() &&
          p.name.trim().toLowerCase() === d.name.trim().toLowerCase()
      ) as any;
    }

    try {
      if (targetPlace) {
        await db.places.update(targetPlace.id, {
          ...placeRecord,
          id: targetPlace.id,
        });
      } else {
        await db.places.create(placeRecord);
      }
      seededCount++;
    } catch (placeErr: any) {
      console.warn(`[Seed Maharashtra] Place ${d.name} (${d.id}) notice:`, placeErr.message);
      // Attempt fallback update
      try {
        await db.places.update(d.id, placeRecord);
        seededCount++;
      } catch (fbErr) {
        console.error(`[Seed Maharashtra] Could not insert/update ${d.id}:`, fbErr);
      }
    }
  }

  console.log(`[Seed Maharashtra] Successfully seeded/updated ${seededCount} places into database.`);

  // 3. Idempotently merge into data/master_tourism_places.json if file exists
  const masterPlacesPath = path.resolve(process.cwd(), 'data/master_tourism_places.json');
  if (fs.existsSync(masterPlacesPath)) {
    try {
      const masterRaw = fs.readFileSync(masterPlacesPath, 'utf-8');
      const masterList: any[] = JSON.parse(masterRaw);
      const masterMap = new Map<string, any>();
      for (const p of masterList) {
        if (p.id) masterMap.set(p.id, p);
      }

      for (const d of destinations) {
        masterMap.set(d.id, {
          id: d.id,
          name: d.name,
          city: d.city,
          state: 'Maharashtra',
          category: d.category,
          type: d.type,
          community_listed: d.community_listed,
          overview: d.overview,
          overview_word_count: d.overview_word_count,
          latitude: d.latitude,
          longitude: d.longitude,
          thumbnail_url: d.thumbnail_url || d.image.url,
          verification_status: d.verification_status,
          sources: d.sources,
        });
      }

      fs.writeFileSync(masterPlacesPath, JSON.stringify(Array.from(masterMap.values()), null, 2), 'utf-8');
      console.log(`[Seed Maharashtra] Idempotently synced ${masterMap.size} records in master_tourism_places.json.`);
    } catch (e) {
      console.warn('[Seed Maharashtra] Note: master_tourism_places.json sync skipped:', e);
    }
  }

  console.log('[Seed Maharashtra] COMPLETED IDEMPOTENT SEEDING.');
}

seedMaharashtraDestinations().catch((err) => {
  console.error('[Seed Maharashtra] Error:', err);
  process.exit(1);
});

