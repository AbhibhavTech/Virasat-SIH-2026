import assert from 'node:assert/strict';
import express from 'express';
import { aiChatRouter } from '../ai/routes/chatHandler';

// Explicit deterministic regression mode: never spend provider quota in this suite.
for (const name of ['VIRASAT_AI_API_KEY', 'OPENAI_API_KEY', 'GROQ_API_KEY', 'VIRASAT_AI_MODEL', 'OPENAI_MODEL', 'GROQ_MODEL']) process.env[name] = '';
process.env.VIRASAT_AI_PROVIDER = 'openai';
process.env.VIRASAT_AI_REQUIRE_HOSTED = 'false';

async function main() {
  const app = express();
  app.use(express.json());
  // Trusted authentication fixture; production uses verified JWT middleware.
  app.use((req, _res, next) => { if (req.headers['x-test-user']) req.user = { id: String(req.headers['x-test-user']), email: 'fixture@example.com', name: 'Fixture', role: 'traveller' }; next(); });
  app.use('/api/ai', aiChatRouter);
  const server = app.listen(0);
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not start.');
  const endpoint = `http://127.0.0.1:${address.port}/api/ai/chat`;

  async function ask(message: string, id: string, user = '') {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-test-user': user },
      body: JSON.stringify({ message, session_id: `prompt-regression-${id}` }),
    });
    assert.equal(response.status, 200, `${message} should return HTTP 200`);
    return response.json() as Promise<{
      reply: string;
      actions: Array<{ url?: string; label: string }>;
      suggested_places?: Array<{ id: string; name: string; city: string; state?: string }>;
      context?: { memory?: { destination?: string; budget?: number; party_size_count?: number; start_date?: string; end_date?: string } };
    }>;
  }

  try {
    await ask('Plan a Jaipur trip for 2 days', 'shared-id', 'alice');
    const otherUser = await ask('helo', 'shared-id', 'bob');
    assert.equal(otherUser.context?.memory?.destination, undefined, 'Users must not share memory even with the same conversation ID.');
    const anonymous = await ask('helo', 'shared-id');
    assert.equal(anonymous.context?.memory?.destination, undefined, 'Anonymous callers must not read authenticated history.');
    const greeting = await ask('helo', 'greeting');
    assert.match(greeting.reply, /Namaste|Hello/i);
    assert.doesNotMatch(greeting.reply, /no hosted generative model/i);

    const patna = await ask('patna', 'patna');
    assert.match(patna.reply, /Tourism in Patna/i);
    assert.match(patna.reply, /Agam Kuan/i);
    assert.doesNotMatch(patna.reply, /Visakhapatnam|Araku Valley|Borra Caves|Vaishali|Kesaria Stupa/i);

    const vaishali = await ask('Vaishali', 'vaishali');
    assert.match(vaishali.reply, /Vaishali, Bihar/i);
    assert.doesNotMatch(vaishali.reply, /in Patna/i);

    const kesaria = await ask('Kesaria Stupa', 'kesaria');
    assert.match(kesaria.reply, /Kesaria, Bihar/i);
    assert.doesNotMatch(kesaria.reply, /in Patna/i);

    const distance = await ask('what do you think which place will be closer to mumbai?? delhi or chennai??', 'distance');
    assert.match(distance.reply, /Chennai.*closest|Chennai.*closer/i);
    assert.match(distance.reply, /Delhi/i);
    assert.match(distance.reply, /straight-line/i);
    assert.match(distance.reply, /about \*\*130 km\*\* closer/i);
    assert.ok(distance.actions.some((action) => action.url?.includes('city=Chennai')));

    const routeDistance = await ask('How far is Chennai from Mumbai?', 'route-distance');
    assert.match(routeDistance.reply, /Chennai.*Mumbai|Mumbai.*Chennai/i);
    assert.match(routeDistance.reply, /1030 km|1040 km/i);

    const missingOrigin = await ask('Which is closer, Delhi or Chennai?', 'missing-origin');
    assert.match(missingOrigin.reply, /reference point|reference city/i);

    const joke = await ask('tell me a joke', 'joke');
    assert.match(joke.reply, /joke/i);
    assert.doesNotMatch(joke.reply, /Jaipur vs Udaipur/i);

    const mumbaiPlaces = await ask('Bhai Mumbai mein ghumne layak kya hai?', 'mumbai-followups');
    assert.ok((mumbaiPlaces.suggested_places || []).length > 0, 'A natural Hinglish city prompt should retrieve place records.');
    assert.ok(mumbaiPlaces.suggested_places?.every((place) => place.city === 'Mumbai'), 'Mumbai results must remain scoped to Mumbai.');

    const moreMumbaiPlaces = await ask('aur options', 'mumbai-followups');
    const firstPageIds = new Set(mumbaiPlaces.suggested_places?.map((place) => place.id));
    assert.ok((moreMumbaiPlaces.suggested_places || []).length > 0, 'A follow-up should fetch another result page.');
    assert.ok(moreMumbaiPlaces.suggested_places?.every((place) => place.city === 'Mumbai'), 'Follow-up results must retain the city context.');
    assert.ok(moreMumbaiPlaces.suggested_places?.every((place) => !firstPageIds.has(place.id)), 'More options must not repeat the previous result page.');

    const secondMumbaiPlace = moreMumbaiPlaces.suggested_places?.[1];
    assert.ok(secondMumbaiPlace, 'The next result page must have a second place for ordinal reference testing.');
    const mapSecond = await ask('open map for the second one', 'mumbai-followups');
    assert.ok(mapSecond.actions.some((action) => action.url?.includes(`q=${encodeURIComponent(secondMumbaiPlace.name)}`)), 'Ordinal map requests must target the selected result.');

    await ask('Mysuru Dasara', 'festival-year');
    const festivalYear = await ask('when does it happen in 2027?', 'festival-year');
    assert.match(festivalYear.reply, /No verified date for 2027/i);
    assert.doesNotMatch(festivalYear.reply, /2026-10-11|Verified for 2026/i);

    const hotelBudget = await ask('Find hotels in Jaipur under 3000 per night', 'hotel-budget');
    assert.match(hotelBudget.reply, /Availability: not checked/i);
    const listedRates = [...hotelBudget.reply.matchAll(/Indicative stored rate: ([^\n]+)/g)].map((match) => match[1]);
    assert.ok(listedRates.length > 0, 'The budget search should return stored hotel records when their indicative starting rate fits.');
    assert.ok(listedRates.every((rate) => {
      const startingRate = rate.replace(/,/g, '').match(/\d+/)?.[0];
      return startingRate !== undefined && Number(startingRate) <= 3000;
    }), 'Every displayed hotel must fit the stated per-night limit.');

    const currentWeather = await ask('Weather in Mumbai right now', 'weather');
    assert.match(currentWeather.reply, /live weather feed is not connected/i);
    assert.doesNotMatch(currentWeather.reply, /52%|\d+°C/i);

    const datedTrip = await ask('Plan a trip to Jaipur for 2 days for 4 people from 2026-12-20 to 2026-12-21', 'dated-trip');
    assert.match(datedTrip.reply, /2026-12-20 to 2026-12-21/);
    assert.match(datedTrip.reply, /4 travelers/i);
    assert.equal(datedTrip.context?.memory?.budget, undefined, 'ISO date years must not be misread as trip budgets.');
    assert.equal(datedTrip.context?.memory?.party_size_count, 4);

    console.log('PASS: conversational prompts, city-scoped retrieval, pagination and ordinal map context, year-safe festivals, hotel budget filtering, honest weather fallback, and itinerary dates/party size.');
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
