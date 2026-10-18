import assert from 'node:assert/strict';
import { generateSmartItinerary } from '../ai/engine/itineraryPlanner';
import { getConversationState } from '../ai/engine/conversationMemory';

const plan = generateSmartItinerary({ ...getConversationState('grounding-regression'), destination: 'Ujjain', duration_days: 3 });
const stops = plan.days.flatMap(day => [day.morning_cluster, day.afternoon_cluster, day.evening_cluster].flatMap(cluster => cluster.places));
assert.equal(plan.days.length, 3);
assert.ok(stops.length > 0, 'Fixture city must have stored attractions');
assert.equal(new Set(stops.map(stop => stop.id)).size, stops.length, 'Sparse records must not repeat across days');
for (const stop of stops) {
  assert.equal(stop.timings, undefined, 'Legacy opening-hour templates must not become verified guidance');
  assert.equal(stop.coordinates, undefined, 'Unverified coordinates must not enter the draft');
  assert.equal(stop.entry_fee, undefined, 'Unverified fees must remain unknown');
}
console.log('PASS: sparse itinerary keeps unique stops and excludes unsupported operational data.');
