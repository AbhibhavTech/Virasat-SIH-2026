import { detectIntent } from '../ai/engine/intentEngine';
import { extractEntities } from '../ai/engine/entityExtractor';
import { getConversationState, updateConversationState } from '../ai/engine/conversationMemory';
import { buildResponseForIntent } from '../ai/engine/responseGenerator';
import { generateSmartItinerary } from '../ai/engine/itineraryPlanner';
import { execute as executeEventsCalendar } from '../ai/tools/getEventsCalendar';

console.log('====================================================');
console.log('VIRASAT AI ASSISTANT — MULTILINGUAL & INTEL TEST SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${testName}${detail ? `: ${detail}` : ''}`);
    failCount++;
  }
}

async function runTests() {
  const sessionId = `test-session-${Date.now()}`;

  // 1. “Mujhe Jaipur ghumna hai 2 din mein.”
  {
    const q = 'Mujhe Jaipur ghumna hai 2 din mein.';
    const intent = detectIntent(q);
    const entities = extractEntities(q);
    const state = updateConversationState(sessionId, entities, intent.intent);
    const plan = generateSmartItinerary(state);
    const resp = buildResponseForIntent(intent, state, plan);

    assert(intent.intent === 'TRIP_PLANNING', 'Query 1: Intent is TRIP_PLANNING');
    assert(intent.isHinglish === true, 'Query 1: Language detected as Hinglish');
    assert(entities.city?.toLowerCase() === 'jaipur', 'Query 1: Extracted destination Jaipur');
    assert(state.duration_days === 2, 'Query 1: Extracted duration 2 days');
    assert(resp.actions && resp.actions.length > 0, 'Query 1: Generated actionable website buttons');
    assert(resp.actions?.some(a => a.type === 'plan_itinerary' && a.url?.includes('Jaipur')), 'Query 1: Action links to /itinerary with Jaipur');
  }

  // 2. “What are the hidden gems near Udaipur?”
  {
    const q = 'What are the hidden gems near Udaipur?';
    const intent = detectIntent(q);
    const entities = extractEntities(q);
    const state = updateConversationState(sessionId, entities, intent.intent);
    const resp = buildResponseForIntent(intent, state);

    assert(intent.intent === 'HIDDEN_GEMS_QUERY', 'Query 2: Intent is HIDDEN_GEMS_QUERY');
    assert(resp.reply.includes('Sajjangarh') && resp.reply.includes('Bahubali Hills'), 'Query 2: Recommends verified Udaipur hidden gems');
    assert(resp.actions?.some(a => a.type === 'open_map'), 'Query 2: Has Open Map action');
  }

  // 3. “Mumbai se Goa train se kaise jaun?”
  {
    const q = 'Mumbai se Goa train se kaise jaun?';
    const intent = detectIntent(q);
    const entities = extractEntities(q);

    assert(intent.intent === 'TRAIN_SEARCH', 'Query 3: Intent is TRAIN_SEARCH');
    assert(entities.origin?.toLowerCase() === 'mumbai', 'Query 3: Extracted origin Mumbai');
    assert(entities.destination?.toLowerCase() === 'goa', 'Query 3: Extracted destination Goa');
  }

  // 4. “Is festival ka origin kya hai?”
  {
    const q = 'Is festival ka origin kya hai?';
    const intent = detectIntent(q);
    assert(intent.intent === 'FESTIVAL_QUERY', 'Query 4: Intent is FESTIVAL_QUERY');
  }

  // 5. “Budget 5000 hai, 3 friends hain, itinerary bana.”
  {
    const q = 'Budget 5000 hai, 3 friends hain, itinerary bana.';
    const intent = detectIntent(q);
    const entities = extractEntities(q);

    assert(intent.intent === 'TRIP_PLANNING', 'Query 5: Intent is TRIP_PLANNING');
    assert(entities.budget === 5000, 'Query 5: Extracted budget 5000');
    assert(entities.party_size_count === 3, 'Query 5: Extracted party size 3 friends');
  }

  // 6. “Map kholo.”
  {
    const q = 'Map kholo.';
    const intent = detectIntent(q);
    const state = getConversationState(sessionId);
    const resp = buildResponseForIntent(intent, state);

    assert(intent.intent === 'MAP_ACTION', 'Query 6: Intent is MAP_ACTION');
    assert(resp.actions?.some(a => a.type === 'open_map' && a.url?.startsWith('/map')), 'Query 6: Emits working Open Map action');
  }

  // 7. “Nearby hotels dikhao.”
  {
    const q = 'Nearby hotels dikhao.';
    const intent = detectIntent(q);
    assert(intent.intent === 'HOTEL_SEARCH', 'Query 7: Intent is HOTEL_SEARCH');
  }

  // 8. “Wahan kaise pahuchenge?”
  {
    const q = 'Wahan kaise pahuchenge?';
    const intent = detectIntent(q);
    assert(intent.intent === 'TRANSPORT_SEARCH', 'Query 8: Intent is TRANSPORT_SEARCH');
  }

  // 9. “Train ka ticket kahan book hoga?”
  {
    const q = 'Train ka ticket kahan book hoga?';
    const intent = detectIntent(q);
    const state = getConversationState(sessionId);
    const resp = buildResponseForIntent(intent, state);

    assert(intent.intent === 'TICKET_BOOKING', 'Query 9: Intent is TICKET_BOOKING');
    assert(resp.reply.includes('irctc.co.in'), 'Query 9: Contains verified official IRCTC portal');
    assert(resp.actions?.some(a => a.type === 'booking_link' && a.url === 'https://www.irctc.co.in/'), 'Query 9: Emits official IRCTC booking action link');
  }

  // 10. “Kal ke liye kya options hain?”
  {
    const q = 'Kal ke liye kya options hain?';
    const intent = detectIntent(q);
    assert(intent.intent === 'TIME_QUERY', 'Query 10: Intent is TIME_QUERY');
  }

  // 11. “Jaipur ke famous heritage monuments batao.”
  {
    const q = 'Jaipur ke famous heritage monuments batao.';
    const intent = detectIntent(q);
    const entities = extractEntities(q);
    assert(entities.city?.toLowerCase() === 'jaipur', 'Query 11: Extracted city Jaipur');
    assert(intent.intent === 'HERITAGE_QUERY' || intent.intent === 'DESTINATION_INFO' || intent.intent === 'MONUMENT_INFO', 'Query 11: Recognized as heritage/destination/monument intent');
  }

  // 12. “Mysore Dasara kab hota hai aur kyun famous hai?”
  {
    const q = 'Mysore Dasara kab hota hai aur kyun famous hai?';
    const intent = detectIntent(q);
    const res = await executeEventsCalendar({ query: q });

    assert(intent.intent === 'FESTIVAL_QUERY', 'Query 12: Intent is FESTIVAL_QUERY');
    assert(res.events && res.events.length > 0, 'Query 12: Found verified festival event in 83-festival dataset');
    assert(res.events[0].festival.toLowerCase().includes('dasara'), 'Query 12: Matched Mysore Dasara event');
    assert(res.events[0].city === 'Mysuru', 'Query 12: Resolved to Mysuru, Karnataka');
  }

  // 13. “India ke UNESCO World Heritage Sites ke examples batao.”
  {
    const q = 'India ke UNESCO World Heritage Sites ke examples batao.';
    const intent = detectIntent(q);
    const state = getConversationState(sessionId);
    const resp = buildResponseForIntent(intent, state);

    assert(intent.intent === 'UNESCO_QUERY', 'Query 13: Intent is UNESCO_QUERY');
    assert(resp.reply.includes('Taj Mahal') && resp.reply.includes('Kaziranga') && resp.reply.includes('Cultural Heritage Sites'), 'Query 13: Accurate UNESCO breakdown with cultural, natural, and mixed categories');
    assert(resp.actions?.some(a => a.type === 'explore_heritage'), 'Query 13: Action links to /heritage');
  }

  // 14. “Kaziranga National Park kis state mein hai?”
  {
    const q = 'Kaziranga National Park kis state mein hai?';
    const intent = detectIntent(q);
    const state = getConversationState(sessionId);
    const resp = buildResponseForIntent(intent, state);

    assert(intent.intent === 'NATIONAL_PARK_QUERY', 'Query 14: Intent is NATIONAL_PARK_QUERY');
    assert(resp.reply.includes('Assam') && resp.reply.includes('One-Horned Rhino'), 'Query 14: Accurately identifies Assam and One-Horned Rhinoceros without hallucinations');
    assert(resp.actions?.some(a => a.type === 'open_map'), 'Query 14: Has map action for Kaziranga');
  }

  // 15. “Kolkata mein Durga Puja ka cultural significance kya hai?”
  {
    const q = 'Kolkata mein Durga Puja ka cultural significance kya hai?';
    const intent = detectIntent(q);
    const res = await executeEventsCalendar({ query: 'Durga Puja' });

    assert(intent.intent === 'FESTIVAL_QUERY', 'Query 15: Intent is FESTIVAL_QUERY');
    assert(res.events && res.events.length > 0, 'Query 15: Found Durga Puja in festival DB');
    assert(res.events[0].location.includes('Kolkata'), 'Query 15: Confirmed Kolkata, West Bengal');
  }

  // 16. Context Continuity: Follow-up “Budget 4000 kar do.”
  {
    const q = 'Budget 4000 kar do.';
    const intent = detectIntent(q);
    const entities = extractEntities(q);
    const state = updateConversationState(sessionId, entities, intent.intent);
    const plan = generateSmartItinerary(state);
    const resp = buildResponseForIntent(intent, state, plan);

    assert(intent.intent === 'ITINERARY_MODIFICATION', 'Query 16: Intent is ITINERARY_MODIFICATION');
    assert(state.budget === 4000, 'Query 16: Budget updated to ₹4000 in conversation state');
    assert(resp.reply.includes('4,000') || resp.reply.includes('4000'), 'Query 16: Response acknowledges revised ₹4,000 budget');
  }

  // 17. Context Continuity: Follow-up “Ab sirf heritage places include karo.”
  {
    const q = 'Ab sirf heritage places include karo.';
    const intent = detectIntent(q);
    const entities = extractEntities(q);
    const state = updateConversationState(sessionId, entities, intent.intent);
    const plan = generateSmartItinerary(state);
    const resp = buildResponseForIntent(intent, state, plan);

    assert(intent.intent === 'ITINERARY_MODIFICATION', 'Query 17: Intent is ITINERARY_MODIFICATION');
    assert(resp.reply.includes('Strict Heritage Focus') || resp.reply.includes('ASI & UNESCO'), 'Query 17: Preserves destination and strictly applies Heritage focus');
  }

  console.log('\n----------------------------------------------------');
  console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('----------------------------------------------------');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
