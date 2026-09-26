import http from 'http';

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, status: res.statusCode });
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing Transport Verification & Routes...');

  // 1. Mumbai to Delhi with Train & Flight
  const res1 = await get('/api/routes?origin=Mumbai&destination=Delhi&date=2026-10-02');
  console.log('\n--- Test 1: Mumbai to Delhi (2026-10-02) ---');
  console.log('Origin:', res1.origin?.name, 'Destination:', res1.destination?.name);
  console.log('Options count:', res1.options?.length);
  const trainOpt = res1.options?.find(o => o.mode === 'TRANSIT');
  const flightOpt = res1.options?.find(o => o.mode === 'FLIGHT');
  console.log('Train Option Title:', trainOpt?.title);
  console.log('Train Fare Note:', trainOpt?.fare_note);
  console.log('Recommended Train:', trainOpt?.recommended_train?.train_name, 'Number:', trainOpt?.recommended_train?.train_number);
  console.log('Flight Option Title:', flightOpt?.title);
  console.log('Flight Fare Note:', flightOpt?.fare_note);

  // 2. Delhi to Agra (Friday test: Gatimaan does NOT run on Friday!)
  const res2 = await get('/api/routes?origin=Delhi&destination=Agra&date=2026-10-02'); // Friday
  console.log('\n--- Test 2: Delhi to Agra on Friday (Gatimaan check) ---');
  const trainOpt2 = res2.options?.find(o => o.mode === 'TRANSIT');
  console.log('Train Title:', trainOpt2?.title);
  console.log('Fare Note:', trainOpt2?.fare_note);

  // 3. Transliterated cities in routing
  const res3 = await get('/api/routes?origin=Kolk%C4%81ta&destination=Patna');
  console.log('\n--- Test 3: Kolkāta to Patna (Transliteration check) ---');
  console.log('Resolved Origin:', res3.origin?.name);
  console.log('Resolved Dest:', res3.destination?.name);
  const trainOpt3 = res3.options?.find(o => o.mode === 'TRANSIT');
  console.log('Train Title:', trainOpt3?.title);
  console.log('Fare Note:', trainOpt3?.fare_note);

  // 4. Local short route (CSMT to Gateway of India)
  const res4 = await get('/api/routes?origin=csmt&destination=gateway-of-india');
  console.log('\n--- Test 4: CSMT to Gateway of India (Local route) ---');
  console.log('Is InterCity:', res4.is_inter_city);
  console.log('Modes available:', res4.options?.map(o => o.mode));

  console.log('\nTransport test script completed successfully.');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
