import assert from 'node:assert/strict';
import { execute as restaurants } from '../ai/tools/searchRestaurants';
import { execute as itinerary } from '../ai/tools/getActiveItinerary';
import { db } from '../server/src/db/client';

const result = await restaurants({ city: 'Mumbai', limit: 1 });
assert.ok(result.recommendations.length <= 1);
assert.equal(result.live_inventory_connected, false);
assert.ok(result.recommendations.every((item: any) => item.city === 'Mumbai' && item.average_price_per_person === undefined && item.verification_status));
assert.equal((await restaurants({ city: 'Mumb' })).recommendations.length, 0, 'Partial city names must not silently select another city');
assert.equal((await restaurants({ city: 'Mumbai', cuisine: 'no-matching-cuisine-fixture' })).recommendations.length, 0, 'Fallbacks must respect cuisine filters');
const original = db.itineraries.findById;
let reads = 0;
db.itineraries.findById = async () => { reads++; return { id: 'private', user_id: 'owner' } as any; };
try {
  assert.equal((await itinerary({ itinerary_id: 'private' }, {})).error, 'SIGN_IN_REQUIRED');
  assert.equal(reads, 0);
  assert.equal((await itinerary({ itinerary_id: 'private' }, { userId: 'other' })).error, 'ITINERARY_NOT_FOUND');
} finally { db.itineraries.findById = original; }
console.log('PASS: exact city food retrieval, bounded candidates, no guessed prices and private itinerary ownership.');
