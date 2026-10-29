import assert from 'node:assert/strict';
import { markOperationalDetailsUnverified, requestedTravelModes, responseLanguageInstruction, scopeTransportOptions } from '../ai/engine/responsePolicy';

assert.match(responseLanguageInstruction('en', 'Taj Mahal ke baare mein batao'), /only in English/);
assert.match(responseLanguageInstruction('hi', 'Tell me about Agra'), /only in Hindi.*Devanagari/);
assert.match(responseLanguageInstruction('auto', 'mujhe Taj Mahal ke baare mein batao'), /Romanized Hindi\/Hinglish.*Latin script/);
assert.match(responseLanguageInstruction('auto', 'नमस्ते, आगरा के बारे में बताइए'), /same language and script/);
assert.match(responseLanguageInstruction('auto', 'Tell me about Agra'), /India-related subject matter alone is not a reason/);

assert.deepEqual(requestedTravelModes('Which train should I take from Delhi to Agra?'), ['train']);
assert.deepEqual(requestedTravelModes('How do I fly there? Which airport?'), ['air']);
assert.deepEqual(requestedTravelModes('Can I drive or walk there?'), ['road', 'walk']);
assert.equal(requestedTravelModes('How can I travel from Delhi to Agra?'), null);

const full = {
  origin: 'Delhi', destination: 'Agra', airport_access: { origin: {}, destination: {} }, recommendation: 'compare everything',
  transit_options: { train: { available: true }, air: { available: true }, road: { available: true }, walk: { available: true } },
};
const rail = scopeTransportOptions(full, ['train']);
assert.deepEqual(Object.keys(rail.transit_options), ['train']);
assert.equal('airport_access' in rail, false);
assert.equal('recommendation' in rail, false);
assert.equal(Object.keys(scopeTransportOptions(full, null).transit_options).length, 4);

const place = markOperationalDetailsUnverified({ name: 'Example', timings: '9 to 5', entry_fee: '₹100', verification_status: 'verified' });
assert.equal(place.name, 'Example');
assert.equal(place.verification_status, 'verified');
assert.deepEqual(place.operational_data.opening_hours, { value: null, status: 'needs_verification' });
assert.deepEqual(place.operational_data.entry_fee, { value: null, status: 'needs_verification' });
assert.equal('timings' in place, false);
assert.equal('entry_fee' in place, false);

console.log('PASS: response language constraints, requested-mode-only transport, broad comparisons, and operational-fact safety.');
