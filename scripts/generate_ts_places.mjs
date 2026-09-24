import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const srcDataDir = path.join(rootDir, 'src', 'data');

const placesRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'master_tourism_places.json'), 'utf-8'));

const tsContent = `/**
 * Master Tourism Database - Verified Places Registry
 * Generated from official ASI, state tourism, and UNESCO verified records.
 * Total verified entries: ${placesRaw.length}
 */

export interface MasterTourismPlace {
  id: string;
  name: string;
  city_id: string;
  city_name: string;
  state_id: string;
  state_name: string;
  category: string;
  heritage_status?: string | null;
  lat: number;
  lng: number;
  opening_hours?: string | null;
  entry_fee_domestic?: number | null;
  entry_fee_intl?: number | null;
  is_free: boolean;
  visit_duration_minutes: number;
  source_name: string;
  source_url: string;
  verification_status: string;
  last_verified: string;
  summary: string;
  thumbnail_url: string;
}

export const MASTER_TOURISM_PLACES: MasterTourismPlace[] = ${JSON.stringify(placesRaw, null, 2)};
`;

fs.writeFileSync(path.join(srcDataDir, 'masterTourismPlacesData.ts'), tsContent);
console.log(`Saved src/data/masterTourismPlacesData.ts with ${placesRaw.length} entries.`);
