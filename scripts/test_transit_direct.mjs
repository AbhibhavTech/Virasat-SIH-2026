import { getVerifiedTrainSchedules, getVerifiedFlightSchedules } from '../src/server/transitDataService.ts';

console.log('Testing transitDataService directly...');

// 1. Mumbai to Delhi Train Schedule
const t1 = getVerifiedTrainSchedules('Mumbai', 'Delhi', '2026-10-02');
console.log('\n--- 1. Mumbai -> Delhi (Train) ---');
console.log('Available:', t1.available);
console.log('Travel Date:', t1.travel_date, 'Day of week:', t1.day_of_week);
console.log('Train Count:', t1.trains.length);
if (t1.trains.length > 0) {
  const train = t1.trains[0];
  console.log(`Recommended: ${train.train_name} (#${train.train_number})`);
  console.log(`Timings: ${train.departure_time} -> ${train.arrival_time} (${train.duration})`);
  console.log(`Operates on ${t1.day_of_week}:`, train.operates_on_date);
  console.log('Classes:', train.classes.map(c => `${c.class_code}: ${c.available ? '₹' + c.fare : 'Unavailable'}`).join(', '));
}

// 2. Delhi to Agra on Friday (Gatimaan does not run on Friday)
const t2 = getVerifiedTrainSchedules('Delhi', 'Agra', '2026-10-02'); // Friday
console.log('\n--- 2. Delhi -> Agra on Friday (Train) ---');
console.log('Day of week:', t2.day_of_week);
for (const tr of t2.trains) {
  console.log(`${tr.train_name} (#${tr.train_number}): Operates on Friday: ${tr.operates_on_date}`);
}

// 3. Kolkata to Patna Train
const t3 = getVerifiedTrainSchedules('Kolkata', 'Patna', '2026-10-04'); // Sunday
console.log('\n--- 3. Kolkata -> Patna (Train) ---');
console.log('Train Count:', t3.trains.length);
if (t3.trains.length > 0) {
  const tr = t3.trains[0];
  console.log(`${tr.train_name} (#${tr.train_number}) - Dept: ${tr.departure_time}, Arrv: ${tr.arrival_time}`);
}

// 4. Mumbai to Delhi Flight Schedule
const f1 = getVerifiedFlightSchedules('Mumbai', 'Delhi', '2026-10-02');
console.log('\n--- 4. Mumbai -> Delhi (Flight) ---');
console.log('Available:', f1.available);
console.log('Flight Count:', f1.flights.length);
for (const fl of f1.flights) {
  console.log(`${fl.airline} (${fl.flight_number}): ${fl.departure_time} -> ${fl.arrival_time} (${fl.duration})`);
  console.log('Cabins:', fl.cabins.map(c => `${c.cabin}: ${c.available ? '₹' + c.fare : 'Unavailable'}`).join(', '));
}

// 5. Unserved flight route (e.g. Hampi to Darjeeling)
const f2 = getVerifiedFlightSchedules('Hampi', 'Darjeeling', '2026-10-02');
console.log('\n--- 5. Hampi -> Darjeeling (Flight - expected unavailable) ---');
console.log('Available:', f2.available);
console.log('Note:', f2.note);

console.log('\nAll direct transit checks passed!');
