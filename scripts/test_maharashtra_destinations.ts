import fs from 'fs';
import path from 'path';

async function runTests() {
  console.log('=== TESTING MAHARASHTRA DESTINATIONS (TS/API) ===');

  const jsonPath = path.resolve(process.cwd(), 'data/maharashtra_destinations.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file missing: ${jsonPath}`);
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const destinations: any[] = JSON.parse(raw);

  // 1. Total Count
  if (destinations.length !== 40) {
    throw new Error(`Expected exactly 40 destinations, received ${destinations.length}`);
  }
  console.log('✅ Passed: Exactly 40 total destinations found.');

  // 2. City & Type Distribution
  const mumbaiFamous = destinations.filter((d) => d.city === 'Mumbai' && d.type === 'famous');
  const mumbaiHidden = destinations.filter((d) => d.city === 'Mumbai' && d.type === 'hidden');
  const puneFamous = destinations.filter((d) => d.city === 'Pune' && d.type === 'famous');
  const puneHidden = destinations.filter((d) => d.city === 'Pune' && d.type === 'hidden');

  if (mumbaiFamous.length !== 10) throw new Error(`Mumbai famous count is ${mumbaiFamous.length}, expected 10`);
  if (mumbaiHidden.length !== 10) throw new Error(`Mumbai hidden count is ${mumbaiHidden.length}, expected 10`);
  if (puneFamous.length !== 10) throw new Error(`Pune famous count is ${puneFamous.length}, expected 10`);
  if (puneHidden.length !== 10) throw new Error(`Pune hidden count is ${puneHidden.length}, expected 10`);
  console.log('✅ Passed: Exactly 10 Mumbai famous, 10 Mumbai hidden, 10 Pune famous, 10 Pune hidden.');

  // 3. Word counts (45-55)
  for (const d of destinations) {
    const wc = d.overview.trim().split(/\s+/).length;
    if (wc < 45 || wc > 55) {
      throw new Error(`Place ${d.name} overview has ${wc} words (must be 45-55 words)`);
    }
  }
  console.log('✅ Passed: All 40 overviews are between 45 and 55 words.');

  // 4. Community Listed check
  for (const d of destinations) {
    if (d.type === 'hidden' && d.community_listed !== true) {
      throw new Error(`Hidden gem ${d.name} must have community_listed === true`);
    }
    if (d.type === 'famous' && d.community_listed !== false) {
      throw new Error(`Famous place ${d.name} must have community_listed === false`);
    }
  }
  console.log('✅ Passed: All community_listed attributes verified.');

  // 5. Verification log
  const logPath = path.resolve(process.cwd(), 'data/maharashtra_verification_log.jsonl');
  const backendLogPath = path.resolve(process.cwd(), 'backend/app/data/maharashtra_verification_log.jsonl');
  if (!fs.existsSync(logPath) || !fs.existsSync(backendLogPath)) {
    throw new Error('Verification log files missing');
  }
  const logLines = fs.readFileSync(logPath, 'utf-8').trim().split('\n').filter(Boolean);
  if (logLines.length !== 40) {
    throw new Error(`Expected 40 log lines, found ${logLines.length}`);
  }
  console.log('✅ Passed: Evidence logs present with 40 verified entries.');

  console.log('🎉 ALL MAHARASHTRA DESTINATION TESTS PASSED!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
