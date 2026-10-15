import '../server/src/config/environment';
import fs from 'node:fs';
import { getModelStatus } from '../ai/engine/modelGateway';

async function main() {
  const corpus = JSON.parse(fs.readFileSync('ai/evaluation/india-prompts.json', 'utf8'));
  const tourism = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8'));
  const cities = JSON.parse(fs.readFileSync('data/cities.json', 'utf8'));
  const stations = JSON.parse(fs.readFileSync('data/railway_stations.json', 'utf8'));
  const records: any[] = [];
  for (const state of tourism.states) for (const city of state.cities) {
    for (const category of ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo']) {
      for (const place of city[category] || []) if (place.name !== city.name) records.push({ state, city, place });
    }
  }
  const validCities = cities.filter((city: any) => Number.isFinite(city.lat) && city.lat >= 6 && city.lat <= 38 && Number.isFinite(city.lng) && city.lng >= 68 && city.lng <= 98 && !(city.lat === 20.5937 && city.lng === 78.9629));
  if (!records.length || validCities.length < 2) throw new Error('Insufficient repository fixtures');
  const liveFlag = process.argv.indexOf('--live-limit');
  const limit = liveFlag < 0 ? 0 : Number(process.argv[liveFlag + 1]);
  if (!Number.isInteger(limit) || limit < 0 || limit > 20) throw new Error('--live-limit must be 0..20. No bulk paid requests are allowed.');
  const status = getModelStatus();
  const stationRecords = records.filter(({ city }) => stations.some((station: any) => station.city === city.name));
  const endpoint = process.env.VIRASAT_AI_TEST_URL || 'http://127.0.0.1:3000/api/ai/chat';
  const outcomes: any[] = [];
  let liveCalls = 0;
  for (let i = 0; i < corpus.cases.length; i++) {
    const entry = corpus.cases[i];
    const availableFixtures = entry.domain === 'last_mile' ? stationRecords : records;
    const { state, city, place } = availableFixtures[i % availableFixtures.length];
    const origin = validCities.find((item: any) => item.name !== city.name)!;
    const station = stations.find((item: any) => item.city === city.name);
    const fixtures: Record<string, string> = {
      city: city.name, destination: city.name, origin: origin.name, city_a: city.name, city_b: origin.name,
      city_or_region: state.name, place: place.name, place_or_route: place.name,
      station_or_airport: station?.name || '', area: city.district || city.name,
      budget: '3000 INR', checkin: '2026-12-20', checkout: '2026-12-22', date: '2026-12-20', date_range: 'December 2026', year: '2026',
      cuisine: 'regional cuisine', diet: 'vegetarian', duration: '2', travellers: '2 adults', interests: 'heritage and food', purpose: 'heritage travel',
      item: 'a train ticket', message: 'How are you?', correction: 'I asked how to travel, not for attractions',
      followup: 'train se', request_a: `Find places in ${city.name}`, request_b: `Find hotels in ${city.name}`,
    };
    const missing: string[] = [];
    const prompt = entry.prompt_template.replace(/\{([^}]+)\}/g, (_: string, key: string) => {
      if (!fixtures[key]) missing.push(key);
      return fixtures[key] || `{${key}}`;
    });
    const result: any = { case_id: entry.case_id, domain: entry.domain, fixture: { city_id: city.id, place_id: place.id, origin_id: origin.id }, status: 'skipped', reason: 'Live model evaluation not requested; schema and fixture resolution only.', fixture_status: missing.length ? 'blocked' : 'passed' };
    if (missing.length) { result.status = 'blocked'; result.reason = `Missing supported fixture: ${missing.join(', ')}`; }
    else if (!status.configured) { result.status = 'blocked'; result.reason = 'Hosted model configuration missing; no generated answer was tested.'; }
    else if (liveCalls < limit) {
      liveCalls++;
      const history = entry.requires_prior_context === 'true' ? [
        `How do I travel from ${origin.name} to ${city.name}?`,
        ...(entry.domain === 'correction' ? [fixtures.correction] : []),
      ] : [];
      let answer: any;
      try {
        for (const message of [...history, prompt]) {
          const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message, session_id: `corpus-${entry.case_id}` }), signal: AbortSignal.timeout(70000) });
          answer = await response.json();
          if (!response.ok) throw new Error(answer.error || `HTTP_${response.status}`);
        }
        const tools = (answer.tool_calls || []).map((call: any) => call.tool);
        const expected: Record<string, string[]> = {
          destination_search: entry.domain === 'hidden_gems' ? ['searchHiddenGems'] : ['searchTouristPlaces'],
          heritage_search: ['getSiteContent', 'searchTouristPlaces'], route_search: ['getTransportOptions'], train_search: ['getTransportOptions'], flight_search: ['getTransportOptions'], bus_search: ['getTransportOptions'],
          hotel_search: ['searchHotels'], restaurant_search: ['searchRestaurants'], festival_search: ['getEventsCalendar'], event_search: ['getEventsCalendar'], weather_search: ['getWeather'],
        };
        const violations: string[] = [];
        if (answer.generation_mode !== 'hosted_generative') violations.push('Response did not use a hosted model');
        if (!answer.reply?.trim()) violations.push('Empty response');
        if (entry.domain === 'general_chat' && tools.some((tool: string) => tool.startsWith('search'))) violations.push('Forced tourism retrieval for casual question');
        const domainTools = expected[entry.expected_primary_intent];
        if (domainTools && !domainTools.some(tool => tools.includes(tool))) violations.push('Expected domain retrieval missing; manual assessment may be needed for clarifications');
        result.status = violations.length ? 'failed' : 'passed';
        result.reason = violations.length ? violations.join('; ') : 'Automated smoke criteria passed; factual quality and language require manual review.';
        result.tools = tools;
      } catch (error) { result.status = 'blocked'; result.reason = error instanceof Error ? error.message : 'Provider unavailable'; }
    }
    outcomes.push(result);
  }
  const counts = outcomes.reduce((acc, item) => { acc[item.status] = (acc[item.status] || 0) + 1; return acc; }, {} as Record<string, number>);
  const report = { cases: outcomes.length, fixture_resolution_passed: outcomes.filter(item => item.fixture_status === 'passed').length,
    counts, live_cases_attempted: liveCalls, model: status.model, note: 'All fixture values are test inputs. Language-style labels do not establish translated prompt coverage. Smoke criteria are not a full semantic quality grade.', outcomes };
  fs.writeFileSync('ai/evaluation/evaluation-report.json', `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ cases: report.cases, fixture_resolution_passed: report.fixture_resolution_passed, counts, live_cases_attempted: liveCalls, model: status.model }, null, 2));
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Evaluation failed'); process.exitCode = 1; });
