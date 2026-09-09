import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3001;
process.env.PORT = String(PORT);
process.env.NODE_ENV = 'production';

console.log('\x1b[34m[Phase 1 Test]\x1b[0m Starting backend integration and IDOR security tests...');

async function runTests() {
  // 1. Dynamic import of server to run on test port
  // Wait, let's start the server process or import db directly
  const { db } = await import('../server/src/db/client.js');
  await db.init();

  console.log('✓ Database initialized successfully');

  // Verify seed counts
  const states = await db.states.findAll();
  const places = await db.places.findAll();
  const transit = await db.transit.findAll();

  if (states.length === 0 || places.total === 0 || transit.length === 0) {
    throw new Error(`Seed counts invalid: ${states.length} states, ${places.total} places, ${transit.length} transit`);
  }
  console.log(`✓ Seed check passed: ${states.length} states, ${places.total} places, ${transit.length} transit nodes`);

  // Verify data_confidence on seeded places is 'unverified'
  const samplePlace = places.places[0];
  if (samplePlace.data_confidence !== 'unverified') {
    throw new Error(`Expected data_confidence to be 'unverified', got: ${samplePlace.data_confidence}`);
  }
  console.log('✓ Provenance check passed: Seeded places have data_confidence="unverified"');

  // 2. Test User Creation & Password Hashing
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const hashA = await bcrypt.hash('SecretAlice123!', salt);
  const userA = await db.users.create({
    id: 'user-test-alice',
    email: 'alice.test@virasat.in',
    password_hash: hashA,
    name: 'Alice Traveler',
    home_city: 'Mumbai',
    auth_provider: 'local',
    role: 'traveller',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const hashB = await bcrypt.hash('SecretBob456!', salt);
  const userB = await db.users.create({
    id: 'user-test-bob',
    email: 'bob.test@virasat.in',
    password_hash: hashB,
    name: 'Bob Explorer',
    home_city: 'Jaipur',
    auth_provider: 'local',
    role: 'traveller',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Check password verification
  const validAlice = await bcrypt.compare('SecretAlice123!', userA.password_hash);
  const invalidAlice = await bcrypt.compare('WrongPassword!', userA.password_hash);
  if (!validAlice || invalidAlice) {
    throw new Error('Password hash verification failed');
  }
  console.log('✓ Password hashing and verification check passed');

  // 3. Test Favorites Isolation (IDOR Check)
  await db.favorites.add(userA.id, samplePlace.id);
  const aliceFavs = await db.favorites.listByUser(userA.id);
  const bobFavs = await db.favorites.listByUser(userB.id);

  if (aliceFavs.length !== 1 || aliceFavs[0].place_id !== samplePlace.id) {
    throw new Error('Alice favorite was not correctly saved');
  }
  if (bobFavs.length !== 0) {
    throw new Error('IDOR LEAK: Bob sees Alice favorites!');
  }
  console.log('✓ Favorites isolation (IDOR protection) verified: Bob cannot see Alice favorites');

  // Attempt delete by Bob on Alice's favorite
  const bobDeleteResult = await db.favorites.remove(userB.id, samplePlace.id);
  if (bobDeleteResult) {
    throw new Error('IDOR VULNERABILITY: Bob was able to delete Alice favorite!');
  }
  console.log('✓ Favorites mutation protection verified: Bob cannot delete Alice favorite');

  // 4. Test Trips Isolation (IDOR Check)
  const tripA = await db.trips.create({
    id: 'trip-alice-1',
    user_id: userA.id,
    title: "Alice's Golden Triangle",
    destination: 'Jaipur',
    city_ids: ['delhi', 'agra', 'jaipur'],
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const bobTrips = await db.trips.listByUser(userB.id);
  if (bobTrips.length !== 0) {
    throw new Error('IDOR LEAK: Bob sees Alice trips!');
  }

  const bobTripDelete = await db.trips.delete(tripA.id, userB.id);
  if (bobTripDelete) {
    throw new Error('IDOR VULNERABILITY: Bob was able to delete Alice trip!');
  }
  console.log('✓ Trips isolation (IDOR protection) verified: Bob cannot access or delete Alice trips');

  // 5. Test Persistence on Disk
  const dbFile = path.join(process.cwd(), 'data', '.database', 'virasat_store.json');
  if (!fs.existsSync(dbFile)) {
    throw new Error(`Database file was not persisted at ${dbFile}`);
  }
  const fileContent = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  if (!fileContent.users[userA.id] || !fileContent.favorites) {
    throw new Error('Persisted file is missing written entities');
  }
  console.log(`✓ Persistence check passed: Database safely serialized to ${dbFile} (${(fs.statSync(dbFile).size / 1024).toFixed(1)} KB)`);

  console.log('\n\x1b[32m[All Phase 1 Backend Integration Tests Passed Successfully!]\x1b[0m\n');
}

runTests().catch((err) => {
  console.error('\x1b[31m[Test Failed]:\x1b[0m', err);
  process.exit(1);
});
