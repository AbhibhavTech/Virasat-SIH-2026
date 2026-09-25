import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3001;
process.env.PORT = String(PORT);
process.env.NODE_ENV = 'production';

console.log('\x1b[34m[Phase 1 Test]\x1b[0m Starting backend integration and IDOR security tests...');

async function runTests() {
  // 1. Dynamic import of database and initialize it
  const { db } = await import('../server/src/db/client.js');
  await db.init();

  console.log('✓ Database initialized successfully');

  // Detect active database mode
  const isPostgres = Boolean(process.env.DATABASE_URL);

  // Verify seed counts
  const states = await db.states.findAll();
  const places = await db.places.findAll({
    limit: 300,
    includeAllStatuses: true,
  });
  const transit = await db.transit.findAll();

  if (states.length === 0 || places.total === 0 || transit.length === 0) {
    throw new Error(
      `Seed counts invalid: ${states.length} states, ${places.total} places, ${transit.length} transit`
    );
  }

  console.log(
    `✓ Seed check passed: ${states.length} states, ${places.total} places, ${transit.length} transit nodes`
  );

  // Verify data_confidence contains both official flagship places and unverified places
  const samplePlace = places.places[0];

  const hasOfficial = places.places.some(
    (p) => p.data_confidence === 'official'
  );

  const hasUnverified = places.places.some(
    (p) => p.data_confidence === 'unverified'
  );

  if (!hasOfficial || !hasUnverified) {
    throw new Error(
      `Expected both official and unverified places, got official=${hasOfficial}, unverified=${hasUnverified}`
    );
  }

  console.log(
    '✓ Provenance check passed: Database contains official verified monuments and unverified legacy places'
  );

  // ------------------------------------------------------------
  // Test fixture IDs
  // ------------------------------------------------------------
  const aliceId = 'user-test-alice';
  const bobId = 'user-test-bob';
  const tripId = 'trip-alice-1';

  // ------------------------------------------------------------
  // Clean previous Phase 1 test fixtures.
  //
  // PostgreSQL:
  // Remove only our known test records.
  //
  // JSON fallback:
  // Existing test data is overwritten by the deterministic IDs.
  // ------------------------------------------------------------
  if (isPostgres) {
    try {
      await db.query(
        'DELETE FROM favorites WHERE user_id IN ($1, $2)',
        [aliceId, bobId]
      );
    } catch (error) {
      console.warn(
        `⚠ Could not clean previous test favorites: ${error.message}`
      );
    }

    try {
      await db.query(
        'DELETE FROM itineraries WHERE id = $1',
        [tripId]
      );
    } catch (error) {
      console.warn(
        `⚠ Could not clean previous test itinerary: ${error.message}`
      );
    }

    try {
      await db.query(
        'DELETE FROM users WHERE id IN ($1, $2)',
        [aliceId, bobId]
      );
    } catch (error) {
      console.warn(
        `⚠ Could not clean previous test users: ${error.message}`
      );
    }

    console.log('✓ Previous PostgreSQL Phase 1 test fixtures cleaned');
  }

  // ------------------------------------------------------------
  // 2. Test User Creation & Password Hashing
  // ------------------------------------------------------------
  const bcrypt = await import('bcryptjs');

  const salt = await bcrypt.genSalt(10);

  const hashA = await bcrypt.hash(
    'SecretAlice123!',
    salt
  );

  const userA = await db.users.create({
    id: aliceId,
    email: 'alice.test@virasat.in',
    password_hash: hashA,
    name: 'Alice Traveler',
    home_city: 'Mumbai',
    auth_provider: 'local',
    role: 'traveller',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const hashB = await bcrypt.hash(
    'SecretBob456!',
    salt
  );

  const userB = await db.users.create({
    id: bobId,
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
  const validAlice = await bcrypt.compare(
    'SecretAlice123!',
    userA.password_hash
  );

  const invalidAlice = await bcrypt.compare(
    'WrongPassword!',
    userA.password_hash
  );

  if (!validAlice || invalidAlice) {
    throw new Error('Password hash verification failed');
  }

  console.log(
    '✓ Password hashing and verification check passed'
  );

  // ------------------------------------------------------------
  // 3. Test Favorites Isolation (IDOR Check)
  // ------------------------------------------------------------

  // Remove any existing Alice favorites from previous test runs
  const prevFavs = await db.favorites.listByUser(userA.id);

  for (const f of prevFavs) {
    await db.favorites.remove(
      userA.id,
      f.place_id
    );
  }

  await db.favorites.add(
    userA.id,
    samplePlace.id
  );

  const aliceFavs = await db.favorites.listByUser(
    userA.id
  );

  const bobFavs = await db.favorites.listByUser(
    userB.id
  );

  if (
    aliceFavs.length !== 1 ||
    aliceFavs[0].place_id !== samplePlace.id
  ) {
    throw new Error(
      `Alice favorite was not correctly saved, count=${aliceFavs.length}`
    );
  }

  if (bobFavs.length !== 0) {
    throw new Error(
      'IDOR LEAK: Bob sees Alice favorites!'
    );
  }

  console.log(
    '✓ Favorites isolation (IDOR protection) verified: Bob cannot see Alice favorites'
  );

  // Attempt delete by Bob on Alice's favorite
  const bobDeleteResult = await db.favorites.remove(
    userB.id,
    samplePlace.id
  );

  if (bobDeleteResult) {
    throw new Error(
      'IDOR VULNERABILITY: Bob was able to delete Alice favorite!'
    );
  }

  console.log(
    '✓ Favorites mutation protection verified: Bob cannot delete Alice favorite'
  );

  // ------------------------------------------------------------
  // 4. Test Trips Isolation (IDOR Check)
  // ------------------------------------------------------------

  const tripA = await db.trips.create({
    id: tripId,
    user_id: userA.id,
    title: "Alice's Golden Triangle",
    destination: 'Jaipur',
    city_ids: ['delhi', 'agra', 'jaipur'],
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const bobTrips = await db.trips.listByUser(
    userB.id
  );

  if (bobTrips.length !== 0) {
    throw new Error(
      'IDOR LEAK: Bob sees Alice trips!'
    );
  }

  const bobTripDelete = await db.trips.delete(
    tripA.id,
    userB.id
  );

  if (bobTripDelete) {
    throw new Error(
      'IDOR VULNERABILITY: Bob was able to delete Alice trip!'
    );
  }

  console.log(
    '✓ Trips isolation (IDOR protection) verified: Bob cannot access or delete Alice trips'
  );

  // ------------------------------------------------------------
  // 5. Test Persistence
  //
  // PostgreSQL mode:
  // Verify records can be read back from PostgreSQL.
  //
  // JSON mode:
  // Verify the legacy JSON database file exists and contains
  // the test records.
  // ------------------------------------------------------------

  if (isPostgres) {
    const persistedUser = await db.users.findById(
      userA.id
    );

    if (!persistedUser) {
      throw new Error(
        'PostgreSQL persistence check failed: test user could not be read back'
      );
    }

    const persistedFavorites =
      await db.favorites.listByUser(userA.id);

    if (
      !persistedFavorites.some(
        (favorite) =>
          favorite.place_id === samplePlace.id
      )
    ) {
      throw new Error(
        'PostgreSQL persistence check failed: favorite could not be read back'
      );
    }

    console.log(
      '✓ PostgreSQL persistence check passed: test user and favorite successfully persisted'
    );
  } else {
    const dbFile = path.join(
      process.cwd(),
      'data',
      '.database',
      'virasat_store.json'
    );

    if (!fs.existsSync(dbFile)) {
      throw new Error(
        `Database file was not persisted at ${dbFile}`
      );
    }

    const fileContent = JSON.parse(
      fs.readFileSync(dbFile, 'utf-8')
    );

    if (
      !fileContent.users?.[userA.id] ||
      !fileContent.favorites
    ) {
      throw new Error(
        'Persisted file is missing written entities'
      );
    }

    console.log(
      `✓ JSON persistence check passed: Database safely serialized to ${dbFile} (${(
        fs.statSync(dbFile).size / 1024
      ).toFixed(1)} KB)`
    );
  }

  // ------------------------------------------------------------
  // 6. Cleanup test fixtures after successful test
  // ------------------------------------------------------------

  if (isPostgres) {
    try {
      await db.favorites.remove(
        userA.id,
        samplePlace.id
      );
    } catch {}

    try {
      await db.trips.delete(
        tripId,
        userA.id
      );
    } catch {}

    try {
      await db.query(
        'DELETE FROM users WHERE id IN ($1, $2)',
        [aliceId, bobId]
      );
    } catch (error) {
      console.warn(
        `⚠ Final test-user cleanup warning: ${error.message}`
      );
    }

    console.log(
      '✓ PostgreSQL Phase 1 test fixtures cleaned up'
    );
  }

  console.log(
    '\n\x1b[32m[All Phase 1 Backend Integration Tests Passed Successfully!]\x1b[0m\n'
  );
}

runTests().catch((err) => {
  console.error(
    '\x1b[31m[Test Failed]:\x1b[0m',
    err
  );
  process.exit(1);
});