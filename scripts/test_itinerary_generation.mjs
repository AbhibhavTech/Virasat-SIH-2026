import { db } from '../server/src/db/client.ts';

async function testItinerary() {
  await db.init();

  // Test direct generate logic or simulated call
  console.log('Testing Itinerary DB & Festival Integration...');
  const mhFestivals = await db.festivals.findByState('Maharashtra');
  console.log('MH Festivals:', mhFestivals.map(f => f.name));

  const rjFestivals = await db.festivals.findByState('Rajasthan');
  console.log('RJ Festivals:', rjFestivals.map(f => f.name));

  // Test Crawford market in Mumbai places
  const crawford = await db.places.findById('crawford-market');
  console.log('Crawford market present in DB places?', Boolean(crawford), crawford?.name);
  if (!crawford) throw new Error('Crawford Market missing from DB places');

  console.log('✓ Itinerary data foundation verified successfully!');
}

testItinerary().catch(err => {
  console.error('Itinerary test failed:', err);
  process.exit(1);
});
