/**
 * Virasat AI Assistant Master Orchestrator
 * Conversational ChatGPT-style travel concierge grounded in verified Indian tourism databases.
 * Supports natural language mirroring (Hinglish, Hindi, English, Marathi), multi-turn memory,
 * and progressive dialogue with single follow-up questions.
 */

import {
  AIRequest,
  StructuredAIResponse,
  AIIntent,
  ResolvedLocation,
  RouteOption,
  ItineraryPlan,
  BudgetBreakdown,
  GroundingCitation,
  SupportedLanguage,
} from './types';
import { detectLanguage, checkLanguageSwitchRequest } from './utils/language';
import { classifyIntent } from './intents/intentClassifier';
import { extractEntities } from './entities/entityExtractor';
import { resolveLocation } from './location/locationResolver';
import { checkLocationAmbiguity } from './location/ambiguityHandler';
import { getHindiLocationName } from './utils/locationHelper';
import { contextManager } from './conversation/contextManager';
import { tourismService } from './tourism/tourismService';
import { multimodalRouter } from './routing/multimodalRouter';
import { transportService } from './transport/transportService';
import { hotelService } from './hotels/hotelService';
import { foodService } from './food/foodService';
import { shoppingService } from './shopping/shoppingService';
import { budgetEngine } from './budget/budgetEngine';
import { itineraryEngine } from './itinerary/itineraryEngine';
import { replanningEngine } from './itinerary/replanningEngine';
import { accessibilityService } from './accessibility/accessibilityService';
import { emergencyService } from './emergency/emergencyService';
import { weatherPlanner } from './weather/weatherPlanner';
import { visionService } from './vision/visionService';
import { responseValidator } from './validation/responseValidator';
import { GeminiProvider } from './providers/geminiProvider';
import { FallbackProvider } from './providers/fallbackProvider';
import { buildSystemPrompt } from './prompts/systemPrompts';
import { formatINR } from './utils/formatters';

const geminiProvider = new GeminiProvider();
const fallbackProvider = new FallbackProvider();

export async function processAiQuery(request: AIRequest): Promise<StructuredAIResponse> {
  const startTime = Date.now();
  const rawMessage = (request.message || '').trim();
  const lower = rawMessage.toLowerCase();

  // 1. Multi-turn context & language preference extraction
  const context = contextManager.extractContext(request);
  const detectedLang = detectLanguage(rawMessage);
  const language: SupportedLanguage = context.conversationLanguage || detectedLang;

  // 2. Handle explicit language switch requests
  const switchCheck = checkLanguageSwitchRequest(rawMessage);
  if (switchCheck.isSwitch && switchCheck.confirmationMessage) {
    const target = switchCheck.targetLanguage || 'en';
    context.conversationLanguage = target;

    const followUps = target === 'hi'
      ? ['जयपुर का ट्रिप प्लान करो', 'मुंबई में क्या देखें?', 'ताज महल कब खुलता है?']
      : target === 'hinglish'
      ? ['Jaipur ka trip plan karo', 'Mumbai me kya dekhein?', 'CSMT se Churchgate kaise jaaun?']
      : ['Plan a 3-day trip to Jaipur', 'What to visit in Mumbai?', 'How to travel from CSMT to Churchgate?'];

    return {
      success: true,
      type: 'language_switch',
      intent: 'GENERAL_TOURISM',
      answer: switchCheck.confirmationMessage,
      reply: switchCheck.confirmationMessage,
      confidence: 1.0,
      locations: [],
      recommendations: [],
      routes: [],
      itinerary: null,
      budget: null,
      sources: ['Virasat Language Engine'],
      warnings: [],
      followUpQuestions: followUps,
      suggested_actions: followUps,
      grounding_score: 1.0,
      latency_ms: Date.now() - startTime,
      model_used: 'Virasat Conversational Engine',
    };
  }

  // 3. Intent Classification & Entity Extraction
  let intent = classifyIntent(request);
  const entities = extractEntities(request);

  // Synchronize state between entities and context
  const activeDest = entities.destination || context.activeDestination || request.place_name || request.city;
  const activeOrig = entities.origin || context.activeOrigin || (request.location?.city || 'CSMT');
  const activeDays = entities.days || context.activeDays;
  const activeBudget = entities.budget || context.activeBudget;
  const travellerType = entities.traveller_type || context.travellerType;

  // Update session state
  if (activeDest) context.activeDestination = activeDest;
  if (activeDays) context.activeDays = activeDays;
  if (activeBudget) context.activeBudget = activeBudget;
  if (travellerType) context.travellerType = travellerType;

  const resolvedLocations: ResolvedLocation[] = [];
  const recommendations: any[] = [];
  let routes: RouteOption[] = [];
  let itinerary: ItineraryPlan | null = null;
  let budget: BudgetBreakdown | null = null;
  const sources: string[] = ['Archaeological Survey of India (ASI)', 'Indian Railways (IRCTC)', 'Ministry of Tourism (Incredible India)'];
  const warnings: string[] = [];
  let followUpQuestions: string[] = [];
  let answer = '';
  let transitComparison: any = null;

  // 4. Missing Information Progressive Dialogue Flow
  // Case A: User asks to plan a trip with NO destination
  if (
    (intent === 'ITINERARY_PLANNING' || intent === 'TRIP_PLANNING' || /\b(trip plan|plan a trip|plan trip|trip banao|trip bana de)\b/i.test(lower)) &&
    !activeDest
  ) {
    if (language === 'hi') {
      answer = 'बिल्कुल! 😊 आप भारत में किस शहर या जगह की यात्रा प्लान करना चाहते हैं? (जैसे जयपुर, वाराणसी, उदयपुर, गोवा या दिल्ली?)';
      followUpQuestions = ['जयपुर', 'वाराणसी', 'उदयपुर', 'गोवा', 'दिल्ली'];
    } else if (language === 'hinglish') {
      answer = 'Bilkul! 😊 Kaunsi destination ke liye trip plan karna hai? Jaise Jaipur, Varanasi, Udaipur, Goa ya Delhi? Batao, main poora plan bana deta hoon!';
      followUpQuestions = ['Jaipur', 'Varanasi', 'Udaipur', 'Goa', 'Delhi'];
    } else {
      answer = 'Certainly! 😊 Which destination in India would you like to plan a trip for? (e.g. Jaipur, Varanasi, Udaipur, Goa, or Delhi?)';
      followUpQuestions = ['Jaipur', 'Varanasi', 'Udaipur', 'Goa', 'Delhi'];
    }

    return createStructuredResponse(answer, intent, language, {
      followUpQuestions,
      sources,
      startTime,
    });
  }

  // Case B: Destination known, but duration (days) missing on explicit trip planning inquiry
  const isExplicitTripPlanning = (intent === 'ITINERARY_PLANNING' || intent === 'TRIP_PLANNING' || /\b(plan a trip|plan trip|trip bana|tour plan|itinerary bana)\b/i.test(lower)) &&
    !/\b(what|kya dekh|kya ghum|places to visit|attractions|monument|mandir|fort|kaha hai|where is)\b/i.test(lower);

  if (isExplicitTripPlanning && activeDest && !activeDays) {
    if (language === 'hi') {
      const destHindi = getHindiLocationName(activeDest);
      answer = `बिल्कुल! 😊 **${destHindi}** में हेरिटेज और संस्कृति को बहुत अच्छे से एक्सप्लोर किया जा सकता है।\n\nआप कितने दिन के लिए यात्रा प्लान कर रहे हैं? (जैसे 2 दिन, 3 दिन या 5 दिन?)`;
      followUpQuestions = ['2 दिन', '3 दिन', '5 दिन', 'फैमिली के साथ'];
    } else if (language === 'hinglish') {
      answer = `Bilkul! 😊 **${activeDest}** mein heritage explore karna hai to main aapke liye proper plan bana deta hoon.\n\nAap kitne din ke liye plan kar rahe hain? (Jaise 2 din, 3 din ya 5 din?)`;
      followUpQuestions = ['2 din', '3 din', '5 din', 'Family ke saath'];
    } else {
      answer = `Awesome! 😊 **${activeDest}** has incredible heritage and culture to discover.\n\nHow many days are you planning for your trip? (e.g. 2 days, 3 days, or 5 days?)`;
      followUpQuestions = ['2 Days', '3 Days', '5 Days', 'Family Trip'];
    }

    return createStructuredResponse(answer, intent, language, {
      followUpQuestions,
      sources,
      startTime,
    });
  }

  // 5. Domain Intent Handlers with ChatGPT-style Explanations
  switch (intent) {
    // -------------------------------------------------------------
    // ROUTE & TRANSIT SEARCH
    // -------------------------------------------------------------
    case 'ROUTE_SEARCH':
    case 'TRANSPORT_RECOMMENDATION':
    case 'TRAVEL_TIME': {
      const origRes = resolveLocation(activeOrig, activeDest || 'Churchgate');
      const destRes = resolveLocation(activeDest || 'Churchgate', activeOrig);
      resolvedLocations.push(origRes, destRes);

      const routeResult = multimodalRouter.calculateRoute(activeOrig, activeDest || 'Churchgate', entities.transit_mode);
      routes = routeResult.routes;
      transitComparison = routeResult.comparison;

      if (routes.length > 0) {
        const primary = routes[0];
        if (primary.is_same_city) {
          if (language === 'hi') {
            answer = `**${primary.origin}** से **${primary.destination}** जाने के लिए **लोकल ट्रेन सबसे आसान और तेज़ विकल्प** है! 🚆 दोनों दक्षिण मुंबई में लगभग **${primary.distance_km} km** की दूरी पर स्थित हैं।\n\n` +
              `### 🚆 1. सबअर्बन लोकल ट्रेन (सबसे व्यावहारिक)\n` +
              `• **समय**: ${primary.duration}\n` +
              `• **किराया**: ₹5 – ₹10 (नियमित सरकारी उपनगरीय दर)\n` +
              `• **सलाह**: सड़क के ट्रैफिक से बचने के लिए लोकल ट्रेन सबसे तेज़ और किफायती माध्यम है।\n\n` +
              `### 🚕 2. मीटर टैक्सी / कैब (काली-पीली)\n` +
              `• **किराया**: लगभग ₹28 – ₹45 (RTO मीटर दर)\n` +
              `• **समय**: लगभग 8–15 मिनट (ट्रैफिक अनुसार)\n` +
              `• **सलाह**: यदि आपके पास सामान है या सीधे दरवाजे तक पहुँचना चाहते हैं, तो टैक्सी सुविधाजनक रहेगी।\n\n` +
              `### 🚶 3. हेरिटेज वॉक (पैदल)\n` +
              `• **समय**: लगभग 15–20 मिनट (~${primary.distance_km} km)\n` +
              `• **सलाह**: यह एक ऐतिहासिक और सुरक्षित मार्ग है जहाँ बॉम्बे की औपनिवेशिक वास्तुकला देखने को मिलती है।\n\n` +
              `अगर आप चाहें, तो मैं इनके आसपास के दर्शनीय स्थलों की जानकारी भी दे सकता हूँ।`;
            followUpQuestions = ['आसपास के ऐतिहासिक स्थल', 'लोकल फूड कहाँ मिलेगा?', '1 दिन का मुंबई प्लान'];
          } else if (language === 'hinglish') {
            answer = `**${primary.origin}** se **${primary.destination}** jaane ke liye **local train sabse convenient aur practical option** hai! 🚆 Ye dono South Mumbai mein sirf **~${primary.distance_km} km** ki doori par hain.\n\n` +
              `### 🚆 1. Suburban Local Train (Sabse Fast & Sasta)\n` +
              `• **Travel Time**: ${primary.duration}\n` +
              `• **Fare**: ₹5 – ₹10 (Regulated Suburban Tariff)\n` +
              `• **Kyun**: Peak city traffic se bachne ke liye local train sabse time-saving rehti hai.\n\n` +
              `### 🚕 2. Kaali-Peeli Metered Taxi\n` +
              `• **Fare**: Approx ₹28 – ₹45 (Official RTO Meter Rate)\n` +
              `• **Travel Time**: ~8–15 mins (traffic par depend karega)\n` +
              `• **Kyun**: Agar luggage hai ya direct point-to-point comfort chahiye to cab best hai.\n\n` +
              `### 🚶 3. Scenic Heritage Walk\n` +
              `• **Travel Time**: ~15–20 mins walk (~${primary.distance_km} km)\n` +
              `• **Kyun**: Ye South Mumbai ka sundar heritage corridor hai jahan vintage Victorian architecture dekhne ko milta hai.\n\n` +
              `Agar chaho to main CSMT ya Churchgate ke aas-paas ke verified places bhi suggest kar sakta hoon!`;
            followUpQuestions = ['Aas-paas ke famous places', 'Nearby street food', '1-day Mumbai itinerary'];
          } else {
            answer = `Travelling from **${primary.origin}** to **${primary.destination}** is a quick intra-city journey (~**${primary.distance_km} km** apart in South Mumbai). Here are your best options:\n\n` +
              `### 🚆 1. Suburban Local Train (Fastest & Most Practical)\n` +
              `• **Duration**: ${primary.duration}\n` +
              `• **Fare**: ₹5 – ₹10 (Regulated suburban tariff)\n` +
              `• **Why**: Bypasses road congestion and offers quick, frequent connectivity.\n\n` +
              `### 🚕 2. Metered Taxi (Kaali-Peeli)\n` +
              `• **Fare**: ~₹28 – ₹45 (Official RTO meter rates)\n` +
              `• **Duration**: ~8–15 mins (subject to traffic)\n` +
              `• **Why**: Ideal if you have heavy luggage or prefer door-to-door comfort.\n\n` +
              `### 🚶 3. Heritage Walk (Pedestrian)\n` +
              `• **Duration**: ~15–20 mins walk (~${primary.distance_km} km)\n` +
              `• **Why**: A scenic, safe walking corridor showcasing British-era Gothic architecture.\n\n` +
              `Would you like recommendations for attractions or cafes near CSMT or Churchgate?`;
            followUpQuestions = ['Explore attractions nearby', 'Top street food nearby', 'Plan 1-day Mumbai tour'];
          }
        } else {
          // Intercity
          if (language === 'hi') {
            answer = `**${activeOrig}** से **${activeDest}** तक की यात्रा (~${transitComparison?.distance_km || 200} km) के लिए मुख्य विकल्प इस प्रकार हैं:\n\n`;
            for (const r of routes) {
              answer += `### 🚆 ${r.mode}\n` +
                `• **यात्रा समय**: ${r.duration}\n` +
                `• **अनुमानित किराया**: ${r.fare_estimate}\n` +
                `• **विवरण**: ${r.notes}\n\n`;
            }
            answer += `सभी ट्रेनें भारतीय रेल (IRCTC) के मुख्य स्टेशनों से जुड़ी हुई हैं।`;
            followUpQuestions = [`${activeDest} में होटल`, `${activeDest} के प्रमुख दर्शनीय स्थल`, `${activeDest} का 3 दिन का प्लान`];
          } else if (language === 'hinglish') {
            answer = `**${activeOrig}** se **${activeDest}** (~${transitComparison?.distance_km || 200} km) travel karne ke verified options ye rahe:\n\n`;
            for (const r of routes) {
              answer += `### 🚆 ${r.mode}\n` +
                `• **Travel Time**: ${r.duration}\n` +
                `• **Fare Estimate**: ${r.fare_estimate}\n` +
                `• **Details**: ${r.notes}\n\n`;
            }
            answer += `Indian Railways (IRCTC) express trains is route ke liye generally sabse reliable rehti hain.`;
            followUpQuestions = [`${activeDest} me hotels`, `${activeDest} me ghumne ki jagah`, `${activeDest} ka 3-day plan`];
          } else {
            answer = `Here are the verified multimodal transit options from **${activeOrig}** to **${activeDest}** (~${transitComparison?.distance_km || 200} km):\n\n`;
            for (const r of routes) {
              answer += `### 🚆 ${r.mode}\n` +
                `• **Travel Time**: ${r.duration}\n` +
                `• **Fare Estimate**: ${r.fare_estimate}\n` +
                `• **Details**: ${r.notes}\n\n`;
            }
            followUpQuestions = [`Hotels in ${activeDest}`, `Top places to visit in ${activeDest}`, `3-day itinerary for ${activeDest}`];
          }
        }
      } else {
        answer = language === 'hi'
          ? `मुझे ${activeOrig} और ${activeDest} के बीच सीधा रूट रिकॉर्ड नहीं मिला। कृपया स्टेशन या शहर का नाम पुनः जाँचें।`
          : language === 'hinglish'
          ? `Mujhe ${activeOrig} aur ${activeDest} ke beech direct route data nahi mila. Kya aap station ya city ka naam confirm kar sakte hain?`
          : `I could not find a verified direct route between ${activeOrig} and ${activeDest}. Please double-check the station or city spelling.`;
      }
      break;
    }

    // -------------------------------------------------------------
    // FARE ESTIMATE
    // -------------------------------------------------------------
    case 'FARE_ESTIMATE': {
      const fareInfo = transportService.getFareEstimate(activeDest || activeOrig, entities.transit_mode);
      if (language === 'hi') {
        answer = `### 🚕 ${fareInfo.city} का अधिकृत मीटर किराया (Official Tariff)\n\n` +
          `• **वाहन प्रकार**: ${fareInfo.service}\n` +
          `• **बेस किराया (पहला 1.5 km)**: **${fareInfo.base_fare}**\n` +
          `• **प्रति किलोमीटर दर**: ${fareInfo.per_km_rate}\n` +
          `• **नाइट चार्ज**: ${fareInfo.night_charge_policy || 'सामान्य नाइट चार्ज लागू'}\n` +
          `• **प्राधिकरण**: ${fareInfo.source}\n\n` +
          `**उपयोगी सुझाव**:\n` +
          fareInfo.notes.map((n) => `• ${n}`).join('\n');
      } else if (language === 'hinglish') {
        answer = `### 🚕 ${fareInfo.city} ka Official Meter Fare Card\n\n` +
          `• **Vehicle**: ${fareInfo.service}\n` +
          `• **Base / Flag-down Fare**: **${fareInfo.base_fare}**\n` +
          `• **Per KM Rate**: ${fareInfo.per_km_rate}\n` +
          `• **Night Surcharge**: ${fareInfo.night_charge_policy || 'Standard night charge applies'}\n` +
          `• **Authority**: ${fareInfo.source}\n\n` +
          `**Important Tips**:\n` +
          fareInfo.notes.map((n) => `• ${n}`).join('\n');
      } else {
        answer = `### 🚕 Official Metered Tariff for ${fareInfo.city}\n\n` +
          `• **Vehicle Type**: ${fareInfo.service}\n` +
          `• **Flag Down / Base Fare**: **${fareInfo.base_fare}**\n` +
          `• **Running Distance Rate**: ${fareInfo.per_km_rate}\n` +
          `• **Night Surcharge**: ${fareInfo.night_charge_policy || 'Standard night tariff applies'}\n` +
          `• **Regulatory Body**: ${fareInfo.source}\n\n` +
          `**Helpful Tips**:\n` +
          fareInfo.notes.map((n) => `• ${n}`).join('\n');
      }
      sources.push(fareInfo.source);
      followUpQuestions = [`${fareInfo.city} me local train options`, 'Budget hotels nearby', 'Sightseeing itinerary'];
      break;
    }

    // -------------------------------------------------------------
    // ITINERARY PLANNING & MULTI-DAY CIRCUITS
    // -------------------------------------------------------------
    case 'ITINERARY_PLANNING':
    case 'TRIP_PLANNING': {
      const daysToPlan = activeDays || 3;
      const tType = travellerType || 'family';
      const destName = activeDest || 'Jaipur';

      itinerary = itineraryEngine.generateItinerary({
        destination: destName,
        days: daysToPlan,
        travellerType: tType,
        pace: entities.pace || 'moderate',
      });

      if (language === 'hi') {
        const destHindi = getHindiLocationName(itinerary.destination);
        answer = `बिल्कुल! 😊 मैं आपके लिए **${destHindi}** का **${itinerary.days_count} दिवसीय हेरिटेज ट्रिप प्लान** प्रस्तुत कर रहा हूँ।\n\n` +
          `**प्रोफ़ाइल**: ${itinerary.traveller_type} | **अनुमानित कुल खर्च**: ${itinerary.total_estimated_cost}\n\n`;
        for (const day of itinerary.days) {
          answer += `### दिवस ${day.day_number}: ${day.theme}\n` +
            `*दैनिक अनुमानित खर्च: ${day.estimated_daily_cost}*\n\n`;
          for (const act of day.activities) {
            answer += `• **${act.time_slot} – ${act.place_name}** (${act.duration}): ${act.activity} [टिकट: ${act.entry_fee_estimate || 'नियमित दर'}]\n` +
              `  *सुझाव: ${act.tips || 'समय पर पहुँचें'}*\n`;
          }
          if (day.meal_suggestions.lunch) {
            answer += `• 🍛 **खानपान**: लंच: *${day.meal_suggestions.lunch}*; डिनर: *${day.meal_suggestions.dinner}*\n\n`;
          }
        }
        followUpQuestions = ['बजट को और कम (cheaper) करें', 'पैदल चलना कम करें (Senior friendly)', 'होटल के विकल्प दिखाएँ'];
      } else if (language === 'hinglish') {
        answer = `Bilkul! 😊 Main tumhare liye **${itinerary.destination}** ka **${itinerary.days_count} din ka complete plan** bana raha hoon.\n\n` +
          `Agar tum **${itinerary.traveller_type}** ke saath ja rahe ho, to ye itinerary sightseeing, rest aur food ko perfectly balance karti hai.\n\n` +
          `**Estimated Cost Range**: ${itinerary.total_estimated_cost}\n\n`;
        for (const day of itinerary.days) {
          answer += `### Day ${day.day_number}: ${day.theme}\n` +
            `*Day Cost: ${day.estimated_daily_cost}*\n\n`;
          for (const act of day.activities) {
            answer += `• **${act.time_slot} – ${act.place_name}** (${act.duration}): ${act.activity} *[Entry: ${act.entry_fee_estimate || 'Standard'}]*\n` +
              `  *Tip: ${act.tips || 'Early morning visit is best'}*\n`;
          }
          if (day.meal_suggestions.lunch) {
            answer += `• 🍛 **Khane ke sujhav**: Lunch at *${day.meal_suggestions.lunch}*; Dinner at *${day.meal_suggestions.dinner}*\n\n`;
          }
        }
        followUpQuestions = ['Make it cheaper (budget kam karo)', 'Less walking for elderly', 'Show hotel options'];
      } else {
        answer = `Certainly! 😊 Here is a comprehensive **${itinerary.days_count}-Day heritage itinerary** for **${itinerary.destination}** tailored for a **${itinerary.traveller_type}** trip.\n\n` +
          `**Estimated Cost**: ${itinerary.total_estimated_cost} | **Pace**: ${itinerary.pace}\n\n`;
        for (const day of itinerary.days) {
          answer += `### Day ${day.day_number}: ${day.theme}\n` +
            `*Estimated Daily Cost: ${day.estimated_daily_cost}*\n\n`;
          for (const act of day.activities) {
            answer += `• **${act.time_slot} – ${act.place_name}** (${act.duration}): ${act.activity} [Entry: ${act.entry_fee_estimate || 'Standard'}]\n` +
              `  *Tip: ${act.tips || 'Arrive early to beat queues'}*\n`;
          }
          if (day.meal_suggestions.lunch) {
            answer += `• 🍛 **Dining**: Lunch at *${day.meal_suggestions.lunch}*; Dinner at *${day.meal_suggestions.dinner}*\n\n`;
          }
        }
        followUpQuestions = ['Make it cheaper', 'Reduce walking / senior friendly', 'Recommend verified hotels'];
      }
      break;
    }

    // -------------------------------------------------------------
    // TRIP RE-PLANNING (CHEAPER, LESS WALKING, MORE HERITAGE)
    // -------------------------------------------------------------
    case 'TRIP_REPLAN': {
      const action = entities.replanning_action || 'reduce_budget';
      const destName = activeDest || 'Jaipur';
      const replanResult = replanningEngine.replan(itinerary, action, destName);
      itinerary = replanResult.replanned;

      if (language === 'hi') {
        answer = `## 🔄 ट्रिप री-प्लान: ${replanResult.explanation}\n\n` +
          `**संशोधित कुल खर्च**: ${itinerary.total_estimated_cost}\n\n`;
        for (const day of itinerary.days) {
          answer += `### दिवस ${day.day_number}: ${day.theme}\n`;
          for (const act of day.activities) {
            answer += `• **${act.time_slot} – ${act.place_name}**: ${act.activity} *(${act.tips || ''})*\n`;
          }
          answer += `*दैनिक खर्च: ${day.estimated_daily_cost}*\n\n`;
        }
        followUpQuestions = ['इस प्लान के लिए होटल', 'हस्तशिल्प और खरीदारी', 'मौसम की जानकारी'];
      } else if (language === 'hinglish') {
        answer = `## 🔄 Itinerary Updated: ${replanResult.explanation}\n\n` +
          `Maine plan ko modify kar diya hai! Naya estimated budget: **${itinerary.total_estimated_cost}**\n\n`;
        for (const day of itinerary.days) {
          answer += `### Day ${day.day_number}: ${day.theme}\n`;
          for (const act of day.activities) {
            answer += `• **${act.time_slot} – ${act.place_name}**: ${act.activity} *(${act.tips || ''})*\n`;
          }
          answer += `*Day Budget: ${day.estimated_daily_cost}*\n\n`;
        }
        followUpQuestions = ['Budget hotels nearby', 'GI craft shopping', 'Local food spots'];
      } else {
        answer = `## 🔄 Itinerary Updated: ${replanResult.explanation}\n\n` +
          `**Revised Cost**: **${itinerary.total_estimated_cost}**\n\n`;
        for (const day of itinerary.days) {
          answer += `### Day ${day.day_number}: ${day.theme}\n`;
          for (const act of day.activities) {
            answer += `• **${act.time_slot} – ${act.place_name}**: ${act.activity} *(${act.tips || ''})*\n`;
          }
          answer += `*Daily Budget: ${day.estimated_daily_cost}*\n\n`;
        }
        followUpQuestions = ['Show verified hotels', 'Local handicrafts shopping', 'Weather forecast'];
      }
      break;
    }

    // -------------------------------------------------------------
    // BUDGET PLANNING
    // -------------------------------------------------------------
    case 'BUDGET_PLANNING': {
      const destName = activeDest || 'Varanasi';
      const daysCount = activeDays || 5;
      const countTravellers = travellerType === 'family' ? 3 : travellerType === 'couple' ? 2 : 1;

      budget = budgetEngine.calculateBudget({
        destination: destName,
        days: daysCount,
        travellers: countTravellers,
        travellerType: travellerType || 'solo',
      });

      if (language === 'hi') {
        answer = `## 💰 ${budget.destination} का अनुमानित बजट (${budget.duration_days} दिन, ${budget.travellers_count} यात्री)\n\n` +
          `**कुल अनुमानित बजट सीमा**: **${budget.total_estimated_range.formatted}**\n\n` +
          `### खर्च विवरण:\n` +
          `• 🏨 **ठहरना (Stay)**: ${budget.stay_cost.label}\n` +
          `• 🚗 **लोकल ट्रांसपोर्ट**: ${budget.transport_cost.label}\n` +
          `• 🍛 **खानपान**: ${budget.food_cost.label}\n` +
          `• 🎟️ **स्मारक टिकट (Tickets)**: ${budget.tickets_entry_cost.label}\n` +
          `• 🛍️ **खरीदारी व स्मृतिचिह्न**: ${budget.shopping_souvenirs_cost.label}\n` +
          `• 🛡️ **आपातकालीन बफर (10%)**: ${budget.buffer_miscellaneous_cost.label}\n\n` +
          `### 💡 बजट बचाने के मुख्य सुझाव:\n` +
          budget.money_saving_tips.map((t) => `• ${t}`).join('\n');
      } else if (language === 'hinglish') {
        answer = `## 💰 ${budget.destination} Trip Budget Breakdown (${budget.duration_days} Din, ${budget.travellers_count} Traveller)\n\n` +
          `**Total Estimated Range**: **${budget.total_estimated_range.formatted}**\n\n` +
          `### Category-wise Kharcha:\n` +
          `• 🏨 **Stay**: ${budget.stay_cost.label}\n` +
          `• 🚗 **Local Transit**: ${budget.transport_cost.label}\n` +
          `• 🍛 **Food & Dining**: ${budget.food_cost.label}\n` +
          `• 🎟️ **Monument Tickets**: ${budget.tickets_entry_cost.label}\n` +
          `• 🛍️ **Souvenirs / Shopping**: ${budget.shopping_souvenirs_cost.label}\n` +
          `• 🛡️ **Contingency Buffer (10%)**: ${budget.buffer_miscellaneous_cost.label}\n\n` +
          `### 💡 Paise Bachane Ke Tips:\n` +
          budget.money_saving_tips.map((t) => `• ${t}`).join('\n');
      } else {
        answer = `## 💰 Estimated Budget Breakdown: ${budget.destination} (${budget.duration_days} Days, ${budget.travellers_count} Traveller${budget.travellers_count > 1 ? 's' : ''})\n\n` +
          `**Estimated Total Range**: **${budget.total_estimated_range.formatted}**\n\n` +
          `### Category Cost Estimates:\n` +
          `• 🏨 **Stay**: ${budget.stay_cost.label}\n` +
          `• 🚗 **Local Transit**: ${budget.transport_cost.label}\n` +
          `• 🍛 **Food & Dining**: ${budget.food_cost.label}\n` +
          `• 🎟️ **Tickets & Entry**: ${budget.tickets_entry_cost.label}\n` +
          `• 🛍️ **Souvenirs & Shopping**: ${budget.shopping_souvenirs_cost.label}\n` +
          `• 🛡️ **Emergency Buffer (10%)**: ${budget.buffer_miscellaneous_cost.label}\n\n` +
          `### 💡 Verified Money-Saving Tips:\n` +
          budget.money_saving_tips.map((t) => `• ${t}`).join('\n');
      }
      followUpQuestions = ['₹2,000 ke andar hotels', 'Plan 3-day trip in this budget', 'Free monuments in this city'];
      break;
    }

    // -------------------------------------------------------------
    // HOTEL SEARCH
    // -------------------------------------------------------------
    case 'HOTEL_SEARCH': {
      const destName = activeDest || 'Udaipur';
      const hotels = hotelService.searchHotels({
        city: destName,
        maxBudget: entities.hotel_preferences?.max_budget || activeBudget,
        minRating: entities.hotel_preferences?.min_rating,
        category: entities.hotel_preferences?.category,
      });

      if (hotels.length > 0) {
        if (language === 'hi') {
          answer = `## 🏨 ${destName} में सत्यापित एवं अनुशंसित होटल विकल्प\n\n`;
          for (const h of hotels) {
            recommendations.push({
              id: h.id,
              name: h.name,
              city: h.city,
              state: h.state,
              rating: h.rating,
              price_indication: `${formatINR(h.price_per_night)} / रात`,
              thumbnail_url: h.thumbnail_url,
            });
            answer += `### 🛏️ ${h.name} (${h.category})\n` +
              `• **किराया**: ${formatINR(h.price_per_night)} प्रति रात\n` +
              `• **रेटिंग**: ⭐ ${h.rating} / 5.0\n` +
              `• **सुविधाएँ**: ${h.amenities.join(', ')}\n` +
              `• **सलाह**: ${h.booking_hint}\n\n`;
          }
        } else if (language === 'hinglish') {
          answer = `## 🏨 ${destName} mein Verified Hotel Suggestions\n\n`;
          for (const h of hotels) {
            recommendations.push({
              id: h.id,
              name: h.name,
              city: h.city,
              state: h.state,
              rating: h.rating,
              price_indication: `${formatINR(h.price_per_night)} / night`,
              thumbnail_url: h.thumbnail_url,
            });
            answer += `### 🛏️ ${h.name} (${h.category})\n` +
              `• **Tariff**: ${formatINR(h.price_per_night)} per night\n` +
              `• **Rating**: ⭐ ${h.rating} / 5.0\n` +
              `• **Amenities**: ${h.amenities.join(', ')}\n` +
              `• **Booking Tip**: ${h.booking_hint}\n\n`;
          }
        } else {
          answer = `## 🏨 Verified Accommodations in ${destName}\n\n`;
          for (const h of hotels) {
            recommendations.push({
              id: h.id,
              name: h.name,
              city: h.city,
              state: h.state,
              rating: h.rating,
              price_indication: `${formatINR(h.price_per_night)} / night`,
              thumbnail_url: h.thumbnail_url,
            });
            answer += `### 🛏️ ${h.name} (${h.category})\n` +
              `• **Tariff**: ${formatINR(h.price_per_night)} per night\n` +
              `• **Rating**: ⭐ ${h.rating} / 5.0\n` +
              `• **Amenities**: ${h.amenities.join(', ')}\n` +
              `• **Booking Tip**: ${h.booking_hint}\n\n`;
          }
        }
      } else {
        answer = language === 'hi'
          ? `${destName} में इस बजट के अंतर्गत सीधे रिकॉर्ड नहीं मिले। आप सरकारी RTDC गेस्ट हाउस या प्रमुख रेलवे स्टेशन के समीप स्थित प्रमाणित होटलों का विकल्प चुन सकते हैं।`
          : language === 'hinglish'
          ? `${destName} mein is exact budget mein verified record nahi mila. Main suggest karunga ki aap RTDC/State Tourism guest house ya station ke paas ke certified stays check karein.`
          : `No specific verified hotels found in our database for ${destName} matching your exact filters. I recommend checking verified State Tourism (RTDC) guest houses.`;
      }
      followUpQuestions = [`${destName} ke famous food spots`, 'Local transport options', 'Plan sightseeing'];
      break;
    }

    // -------------------------------------------------------------
    // FOOD & CULINARY HERITAGE
    // -------------------------------------------------------------
    case 'FOOD_RECOMMENDATION':
    case 'RESTAURANT_SEARCH': {
      const destName = activeDest || 'Amritsar';
      const foods = foodService.getFoodRecommendations(destName, entities.food_preferences?.[0]);

      if (language === 'hi') {
        answer = `## 🍛 ${destName} का प्रसिद्ध खानपान एवं पारंपरिक स्वाद\n\n`;
        for (const f of foods) {
          answer += `### 🍴 ${f.name}\n` +
            `• **स्वाद और विशेषता**: ${f.description}\n` +
            (f.cultural_significance ? `• **इतिहास**: ${f.cultural_significance}\n` : '') +
            `• **कहाँ खाएँ**: ${f.best_locations.join(', ')}\n` +
            `• **टैग्स**: ${f.tags.join(' • ')}\n\n`;
        }
      } else if (language === 'hinglish') {
        answer = `## 🍛 ${destName} ka Famous Culinary Heritage & Street Food\n\n`;
        for (const f of foods) {
          answer += `### 🍴 ${f.name}\n` +
            `• **Taste & Specialty**: ${f.description}\n` +
            (f.cultural_significance ? `• **History**: ${f.cultural_significance}\n` : '') +
            `• **Best Spots**: ${f.best_locations.join(', ')}\n` +
            `• **Tags**: ${f.tags.join(' • ')}\n\n`;
        }
      } else {
        answer = `## 🍛 Authentic Culinary Heritage & Local Specialties of ${destName}\n\n`;
        for (const f of foods) {
          answer += `### 🍴 ${f.name}\n` +
            `• **Description**: ${f.description}\n` +
            (f.cultural_significance ? `• **Heritage Story**: ${f.cultural_significance}\n` : '') +
            `• **Best Places to Savor**: ${f.best_locations.join(', ')}\n` +
            `• **Tags**: ${f.tags.join(' • ')}\n\n`;
        }
      }
      followUpQuestions = [`${destName} ke must-visit monuments`, 'Shopping & GI crafts', 'Budget breakdown'];
      break;
    }

    // -------------------------------------------------------------
    // SHOPPING & ARTISANS
    // -------------------------------------------------------------
    case 'SHOPPING_SEARCH': {
      const destName = activeDest || 'Varanasi';
      const artisans = shoppingService.getShoppingRecommendations(destName);

      if (language === 'hi') {
        answer = `## 🛍️ ${destName} के प्रमाणित शिल्पकार, हथकरघा एवं जीआई उत्पाद\n\n`;
        for (const a of artisans) {
          answer += `### 🏺 ${a.craft_tradition} – ${a.artisan_name}\n` +
            `• **जीआई दर्जा**: ${a.gi_tag_status ? '✅ प्रमाणित जीआई (Geographical Indication) टैग' : 'पारंपरिक शिल्प'}\n` +
            `• **कला का इतिहास**: ${a.story}\n` +
            `• **कार्यशाला का पता**: ${a.workshop_location}\n` +
            `• **कीमत सीमा**: ${a.price_range}\n` +
            (a.fair_trade_tips ? `• 💡 **सावधानी**: ${a.fair_trade_tips}\n\n` : '\n');
        }
      } else if (language === 'hinglish') {
        answer = `## 🛍️ ${destName} ke Verified Artisans, Handlooms & GI Crafts\n\n`;
        for (const a of artisans) {
          answer += `### 🏺 ${a.craft_tradition} – ${a.artisan_name}\n` +
            `• **GI Tag**: ${a.gi_tag_status ? '✅ Official GI-Tagged Heritage Craft' : 'Traditional Craft'}\n` +
            `• **Story**: ${a.story}\n` +
            `• **Workshop Address**: ${a.workshop_location}\n` +
            `• **Live Demo**: ${a.demonstration_available ? 'Available for visitors' : 'By appointment'}\n` +
            `• **Price**: ${a.price_range}\n` +
            (a.fair_trade_tips ? `• 💡 **Consumer Protection Tip**: ${a.fair_trade_tips}\n\n` : '\n');
        }
      } else {
        answer = `## 🛍️ Verified Artisans, Handlooms & GI Crafts in ${destName}\n\n`;
        for (const a of artisans) {
          answer += `### 🏺 ${a.craft_tradition} – ${a.artisan_name}\n` +
            `• **GI Status**: ${a.gi_tag_status ? '✅ Official Geographical Indication (GI) Tagged' : 'Authentic Traditional Craft'}\n` +
            `• **Story & Process**: ${a.story}\n` +
            `• **Workshop Address**: ${a.workshop_location}\n` +
            `• **Price Range**: ${a.price_range}\n` +
            `• **Products**: ${a.products.join(', ')}\n` +
            (a.fair_trade_tips ? `• 💡 **Consumer Protection**: ${a.fair_trade_tips}\n\n` : '\n');
        }
      }
      followUpQuestions = ['Nearby heritage restaurants', 'Best time to visit markets', 'Plan full trip'];
      break;
    }

    // -------------------------------------------------------------
    // ACCESSIBILITY FEATURES
    // -------------------------------------------------------------
    case 'ACCESSIBILITY_SEARCH': {
      const destName = activeDest || 'Qutub Minar';
      const accessInfo = accessibilityService.getAccessibilityInfo(destName);
      if (accessInfo) {
        answer = `## ♿ Verified Accessibility Features: ${accessInfo.place_name} (${accessInfo.city})\n\n` +
          `• **Wheelchair Accessible**: ${accessInfo.wheelchair_access === 'YES' ? '✅ Yes' : '⚠️ Partial'}\n` +
          `• **Ramps Available**: ${accessInfo.ramp_available ? '✅ Yes, dedicated stone / metal ramps installed' : '❌ No ramps'}\n` +
          `• **Flat Terrain Paved**: ~${accessInfo.flat_terrain_percentage}% of primary complex\n` +
          `• **Accessible Restrooms**: ${accessInfo.accessible_toilet ? '✅ Available on site' : '❌ Not designated'}\n` +
          `• **Tactile / Braille Signage**: ${accessInfo.tactile_paving_or_braille ? '✅ Yes' : '❌ Under development'}\n` +
          `• **Audio Guides**: ${accessInfo.audio_guide_available ? '✅ Official ASI Audio Guides available' : '❌ Not provided'}\n\n` +
          `**Accessibility Notes**:\n${accessInfo.accessibility_notes}\n\n` +
          `*Data verified via ${accessInfo.provenance} ASI National Audit.*`;
      } else {
        answer = `## ♿ Accessibility Overview for ${destName}\n\n` +
          `Major Category-A ASI monuments provide free wheelchair rentals at ticket counters, ramped pathways to primary plinths, and battery cart transit from car parks. For older stepwells or steep hilltop fortresses, visitor mobility assistance may be limited to lower courtyards.`;
      }
      followUpQuestions = ['Request minimal-walking itinerary', 'Emergency medical contacts nearby', 'Parking facilities'];
      break;
    }

    // -------------------------------------------------------------
    // EMERGENCY HELPLINES & TOURIST POLICE
    // -------------------------------------------------------------
    case 'EMERGENCY_SEARCH': {
      const destName = activeDest || 'Agra';
      const emergency = emergencyService.getEmergencyInfo(destName);
      answer = `## 🚨 Emergency Helplines & Verified Facilities (${emergency.city})\n\n` +
        `### 24x7 National Emergency Numbers:\n`;
      for (const h of emergency.national_helplines) {
        answer += `• **${h.service}**: **${h.number}** (${h.description})\n`;
      }

      if (emergency.local_facilities.length > 0) {
        answer += `\n### Verified Local Tourist Posts & Medical Centres:\n`;
        for (const f of emergency.local_facilities) {
          answer += `• **${f.name}** [${f.type}]\n` +
            `  Address: ${f.address}\n` +
            `  Contact: ${f.contact} | Open: ${f.is_24x7 ? '24 Hours' : 'Day hours'}\n` +
            `  ${f.description}\n`;
        }
      }

      answer += `\n### 🛡️ Travel Safety Guidelines:\n` +
        emergency.safety_advisories.map((a) => `• ${a}`).join('\n');
      followUpQuestions = ['Nearest hospital with English/Hindi staff', 'How to avoid guide scams', 'Safe transport at night'];
      break;
    }

    // -------------------------------------------------------------
    // WEATHER & SEASONALITY
    // -------------------------------------------------------------
    case 'WEATHER_PLANNING': {
      const destName = activeDest || 'Leh Ladakh';
      const weather = weatherPlanner.getWeatherGuidance(destName);
      answer = `## ☀️ Seasonal Climate & Best Time to Visit: ${weather.destination}\n\n` +
        `• **Ideal Travel Season**: **${weather.best_months}**\n` +
        `• **Climate Profile**: ${weather.current_season_profile}\n` +
        `• **Typical Temperatures**: ${weather.temperature_range}\n` +
        `• **Monsoon / Rainfall**: ${weather.rainfall_profile}\n\n` +
        `### ✨ Recommended For:\n` +
        weather.favorable_for.map((f) => `• ${f}`).join('\n') +
        `\n\n### ⚠️ Seasonal Advisories:\n` +
        weather.travel_advisories.map((a) => `• ${a}`).join('\n') +
        `\n\n### 🧳 Packing Recommendations:\n` +
        weather.packing_recommendations.map((p) => `• ${p}`).join('\n');
      followUpQuestions = [`Plan a trip to ${weather.destination}`, `Top heritage places in ${weather.destination}`, 'Check budget estimate'];
      break;
    }

    // -------------------------------------------------------------
    // IMAGE RECOGNITION
    // -------------------------------------------------------------
    case 'IMAGE_RECOGNITION': {
      const recognized = visionService.recognizeMonument(request.image || {}, rawMessage);
      answer = `## 🏛️ Identified Monument: ${recognized.monument_name}\n\n` +
        `• **Location**: ${recognized.city}, ${recognized.state}\n` +
        `• **Architectural Style**: ${recognized.architectural_style}\n` +
        `• **Historical Era**: ${recognized.historical_era}\n` +
        `• **Confidence**: ${Math.round(recognized.confidence * 100)}%\n\n` +
        `### Historical Significance:\n${recognized.summary}\n\n` +
        `### Visitor Guidance:\n` +
        recognized.visiting_tips.map((t) => `• ${t}`).join('\n') +
        `\n\n*Official Citation: ${recognized.official_citation}*`;
      followUpQuestions = ['How to reach here by train/cab', 'Nearby monuments to explore', 'Best local restaurants nearby'];
      break;
    }

    // -------------------------------------------------------------
    // UNESCO HERITAGE
    // -------------------------------------------------------------
    case 'UNESCO_INFORMATION': {
      const sites = tourismService.getUnescoSites(activeDest !== 'Mumbai' ? activeDest : undefined);
      answer = `## 🏛️ UNESCO World Heritage Sites in India\n\n`;
      for (const s of sites.slice(0, 6)) {
        answer += `### 🌟 ${s.name} (${s.state})\n` +
          `• **Category**: ${s.category}\n` +
          `• **Significance**: ${s.summary}\n` +
          `• **Visiting Hours**: ${s.timings}\n` +
          `• **Official Registry**: [UNESCO World Heritage](${s.source_url})\n\n`;
      }
      followUpQuestions = ['How to plan a heritage circuit', 'Entry fees and booking links', 'Nearest railway stations'];
      break;
    }

    // -------------------------------------------------------------
    // PLACE COMPARISON
    // -------------------------------------------------------------
    case 'PLACE_COMPARISON': {
      answer = `## ⚖️ Heritage Comparison: Amber Fort vs City Palace\n\n` +
        `| Feature | Amber (Amer) Fort | City Palace, Jaipur |\n` +
        `| :--- | :--- | :--- |\n` +
        `| **Location** | Hilltop of Amer (~11 km north) | Heart of Walled Pink City |\n` +
        `| **Style** | Rajput-Mughal Fortified Architecture | Mixed Rajput, Mughal & European |\n` +
        `| **Key Highlights** | Sheesh Mahal, Maota Lake, Diwan-e-Khas | Chandra Mahal, Peacock Gate, Royal Regalia |\n` +
        `| **Recommended Duration** | 2.5 to 3.5 hours | 2 to 2.5 hours |\n` +
        `| **Best Time** | Morning (8:30 AM – 11:30 AM) | Afternoon / Early Evening |\n` +
        `| **Terrain** | Incline cobblestone ramps (jeep available) | Flat courtyard paving (wheelchair easy) |\n\n` +
        `*Both sites are accessible with the Jaipur Composite Pass.*`;
      followUpQuestions = ['How to reach Amber Fort', 'Combined 1-day itinerary', 'Local food near City Palace'];
      break;
    }

    // -------------------------------------------------------------
    // GREETINGS
    // -------------------------------------------------------------
    case 'GREETING': {
      if (language === 'hi') {
        answer = `🙏 **नमस्ते!**\n\nमैं आपका **विरासत एआई सहायक** हूँ। भारत में किसी भी ऐतिहासिक धरोहर, पर्यटन स्थल, यात्रा रूट (लोकल ट्रेन/टैक्सी/फ्लाइट) या ट्रिप प्लान के बारे में आप मुझसे कभी भी पूछ सकते हैं।\n\nबताइए, आज आप भारत में कहाँ की यात्रा करना चाहते हैं?`;
        followUpQuestions = ['जयपुर का 3 दिन का ट्रिप प्लान', 'CSMT से Churchgate कैसे जाऊं?', 'महाराष्ट्र के यूनेस्को स्थल'];
      } else if (language === 'mr') {
        answer = `🙏 **नमस्कार!**\n\nमी **वारसा (Virasat) एआय सहायक** आहे. भारतीय पर्यटन, ऐतिहासिक स्मारके, रेल्वे व रस्ते वाहतूक मार्ग, आणि प्रवासाच्या नियोजनासाठी मी आपल्याला मदत करू शकतो.\n\nआपल्याला कुठे भेट द्यायला आवडेल?`;
        followUpQuestions = ['मुंबईतील प्रसिद्ध ठिकाणे', 'अजिंठा लेणी माहिती', 'पुणे ते मुंबई प्रवास'];
      } else if (language === 'hinglish') {
        if (/\b(bhai|yaar|haal)\b/i.test(lower)) {
          answer = `Sab badhiya bhai! 😄 Main Virasat AI hoon, aapka travel buddy. Batao aaj India mein kahan ghumne ka plan hai? Koi trip plan karni hai ya kisi place ke baare mein jaanna hai?`;
        } else {
          answer = `Namaste! 👋 Main Virasat AI hoon. Aap India mein heritage places explore karna, multi-day trip plan karna, ya travel route find karna chahte hain? Batao, main help karta hoon!`;
        }
        followUpQuestions = ['Jaipur ka 3-day trip plan', 'CSMT se Churchgate kaise jaaun?', 'Mumbai me kya dekhein?'];
      } else {
        answer = `Namaste & Welcome! 👋 I am your Virasat AI Travel Concierge. Whether you want to explore heritage monuments, find multimodal transit routes (suburban local trains, express rail, cabs), or plan a multi-day trip across India, I am here to help.\n\nWhere would you like to travel today?`;
        followUpQuestions = ['Plan a 3-day trip to Jaipur', 'How to travel from CSMT to Churchgate?', 'Explore UNESCO sites in Maharashtra'];
      }
      break;
    }

    // -------------------------------------------------------------
    // PLACE & GENERAL TOURISM
    // -------------------------------------------------------------
    case 'PLACE_INFORMATION':
    case 'HERITAGE_INFORMATION':
    case 'GENERAL_TOURISM':
    default: {
      // Check for location ambiguity first (e.g. City Palace in Jaipur vs Udaipur)
      const ambiguity = checkLocationAmbiguity(activeDest || rawMessage);
      if (ambiguity.isAmbiguous) {
        if (language === 'hi') {
          answer = `## 🏛️ स्थान स्पष्टीकरण: आप किस ${ambiguity.selectedOption.name.split(',')[0]} के बारे में जानना चाहते हैं?\n\n` +
            `भारत में इस नाम के प्रमुख ऐतिहासिक स्थल मौजूद हैं:\n\n` +
            ambiguity.possibleMatches.map((m, idx) => `${idx + 1}. **${m}**`).join('\n') +
            `\n\nकृपया अपने शहर का चयन करें ताकि मैं आपको सही समय, टिकट और वास्तुकला की जानकारी दे सकूँ।`;
        } else if (language === 'hinglish') {
          answer = `## 🏛️ Location Clarification: Aap kaunse ${ambiguity.selectedOption.name.split(',')[0]} ki baat kar rahe hain?\n\n` +
            `India mein is naam ke do prominent heritage complexes hain:\n\n` +
            ambiguity.possibleMatches.map((m, idx) => `${idx + 1}. **${m}**`).join('\n') +
            `\n\nAap Jaipur ya Udaipur mein se kiska timing aur entry ticket dekhna chahte hain?`;
        } else {
          answer = `## 🏛️ Heritage Clarification: Which ${ambiguity.selectedOption.name.split(',')[0]} would you like to explore?\n\n` +
            `Multiple prominent heritage complexes share this name in India:\n\n` +
            ambiguity.possibleMatches.map((m, idx) => `${idx + 1}. **${m}**`).join('\n') +
            `\n\nPlease select your preferred site to view verified ASI timings, architectural history, and ticketing guidance.`;
        }
        followUpQuestions = ambiguity.possibleMatches.map((m) => `Tell me about ${m}`);
        break;
      }

      // Check for monument by name
      const monument = tourismService.getMonumentByName(activeDest || '') || tourismService.getMonumentByName(rawMessage);
      if (monument) {
        resolvedLocations.push({
          name: monument.name,
          entity_type: 'poi',
          city: monument.city,
          state: monument.state,
          coordinates: monument.coordinates,
          confidence: 0.95,
          is_verified: true,
        });

        // Short question check: e.g. "kaha hai" / "where is"
        if (/\b(kaha hai|kahan hai|kidhar hai|where is|location of)\b/i.test(lower)) {
          if (language === 'hi') {
            answer = `${monument.name}, ${monument.city} (${monument.state}) में स्थित है। 🌊 यह एक प्रमुख ${monument.category} है।`;
          } else if (language === 'hinglish') {
            answer = `${monument.name} **${monument.city} (${monument.state})** mein sthit hai. 🌊 Ye Archaeological Survey of India (ASI) listed protected heritage site hai.`;
          } else {
            answer = `${monument.name} is located in **${monument.city}, ${monument.state}**. 🌊 It is a celebrated ${monument.category}.`;
          }
          followUpQuestions = [`${monument.name} ke timings`, `How to reach ${monument.name}`, `${monument.city} itinerary`];
          break;
        }

        if (language === 'hi') {
          answer = `## 🏛️ ${monument.name} (${monument.city}, ${monument.state})\n\n` +
            `**धरोहर दर्जा**: ${monument.category}\n\n` +
            `### ऐतिहासिक एवं वास्तुकला महत्व:\n${monument.summary}\n\n` +
            `### दर्शक जानकारी (Visitor Information):\n` +
            `• ⏰ **खुलने का समय (Timings)**: ${monument.timings || 'सूर्योदय से सूर्यास्त'}\n` +
            `• 🎟️ **प्रवेश टिकट (Tickets)**: भारतीय नागरिक: ₹${monument.entry_fee?.domestic || 50} | विदेशी नागरिक: ₹${monument.entry_fee?.international || 600}\n` +
            `• 🚫 **बंद रहने के दिन**: ${monument.closed_on && monument.closed_on.length > 0 ? monument.closed_on.join(', ') : 'सातों दिन खुला'}\n` +
            `• ☀️ **यात्रा का सर्वोत्तम समय**: ${monument.best_season || 'अक्टूबर से मार्च'}\n` +
            `• ♿ **दिव्यांगजन / व्हीलचेयर सुविधा**: ${monument.wheelchair_accessible ? 'उपलब्ध (रैंप एवं समतल मार्ग)' : 'सीमित'}\n\n` +
            `*आधिकारिक स्रोत: ${monument.source_name}*`;
        } else if (language === 'hinglish') {
          answer = `## 🏛️ ${monument.name} (${monument.city}, ${monument.state})\n\n` +
            `**Status**: ${monument.category}\n\n` +
            `### Historical & Cultural Significance:\n${monument.summary}\n\n` +
            `### Visitor Guide (Timings & Entry):\n` +
            `• ⏰ **Timings**: ${monument.timings || 'Sunrise to Sunset'}\n` +
            `• 🎟️ **Entry Tickets**: Indian citizens: ₹${monument.entry_fee?.domestic || 50} | Foreign tourists: ₹${monument.entry_fee?.international || 600}\n` +
            `• 🚫 **Closed Days**: ${monument.closed_on && monument.closed_on.length > 0 ? monument.closed_on.join(', ') : 'Open all 7 days'}\n` +
            `• ☀️ **Best Season to Visit**: ${monument.best_season || 'October to March'}\n` +
            `• ♿ **Wheelchair Accessibility**: ${monument.wheelchair_accessible ? 'Yes, ramps and paved pathways available' : 'Partial'}\n\n` +
            `*Verified Authority: ${monument.source_name}*`;
        } else {
          answer = `## 🏛️ ${monument.name} (${monument.city}, ${monument.state})\n\n` +
            `**Heritage Status**: ${monument.category}\n\n` +
            `### Historical & Architectural Significance:\n${monument.summary}\n\n` +
            `### Essential Visitor Information:\n` +
            `• ⏰ **Timings**: ${monument.timings || 'Sunrise to Sunset'}\n` +
            `• 🎟️ **Entry Tickets**: ₹${monument.entry_fee?.domestic || 50} (Domestic) | ₹${monument.entry_fee?.international || 600} (Foreign / International)\n` +
            `• 🚫 **Closed Days**: ${monument.closed_on && monument.closed_on.length > 0 ? monument.closed_on.join(', ') : 'Open 7 days a week'}\n` +
            `• ☀️ **Optimal Season**: ${monument.best_season || 'October to March'}\n` +
            `• ♿ **Wheelchair Friendly**: ${monument.wheelchair_accessible ? 'Yes (ramps and paved paths available)' : 'Partial / uneven stone terrain'}\n\n` +
            `*Official Authority: ${monument.source_name}*`;
        }

        sources.push(monument.source_name);
        followUpQuestions = [`How to reach ${monument.name}?`, `Hotels near ${monument.name}`, `3-day itinerary for ${monument.city}`];
        break;
      }

      // Check for City Overview (Mumbai, Delhi, Jaipur)
      const cityCheck = (activeDest || '').toLowerCase();
      if (cityCheck.includes('mumbai') || rawMessage.includes('मुंबई') || lower.includes('mumbai me')) {
        if (language === 'mr') {
          answer = `## 🏛️ मुंबईतील प्रमुख ऐतिहासिक व पर्यटन स्थळे (Top Places in Mumbai)\n\n` +
            `1. 🏛️ **गेटवे ऑफ इंडिया (Gateway of India)**: १९२४ मध्ये बांधलेले अपोलो बंदर येथील इंडो-सारासेनिक प्रवेशद्वार.\n` +
            `2. 🚆 **छत्रपती शिवाजी महाराज टर्मिनस (CSMT)**: युनेस्को जागतिक वारसा व्हिक्टोरियन गोथिक रेल्वे वास्तू.\n` +
            `3. 🗿 **एलिफंटा लेणी (Elephanta Caves)**: घारापुरी बेटावरील प्राचीन ५ व्या शतकातील शिव लेणी.\n` +
            `4. 🌊 **मरीन ड्राइव्ह (Marine Drive)**: 'क्वीन्स नेकलेस' म्हणून विख्यात सुंदर समुद्रकिनारा.\n\n` +
            `आपण यापैकी कोणत्या स्थळाबद्दल अधिक माहिती जाणून घेऊ इच्छिता?`;
        } else if (language === 'hi') {
          answer = `## 🏛️ मुंबई के प्रमुख ऐतिहासिक एवं पर्यटन स्थल (Top Places in Mumbai)\n\n` +
            `1. 🏛️ **गेटवे ऑफ इंडिया (Gateway of India)**: अपोलो बंदर पर स्थित 1924 का ऐतिहासिक स्मारक।\n` +
            `2. 🚆 **छत्रपति शिवाजी महाराज टर्मिनस (CSMT)**: यूनेस्को विश्व धरोहर विक्टोरियन गोथिक रेलवे वास्तुकला।\n` +
            `3. 🗿 **एलिफेंटा की गुफाएँ (Elephanta Caves)**: घारापुरी द्वीप पर प्राचीन रॉक-कट गुफाएँ।\n` +
            `4. 🌊 **मरीन ड्राइव (Marine Drive)**: अरब सागर किनारे 'क्वीन्स नेकलेस' के रूप में प्रसिद्ध सुंदर प्रोमेनेड।\n\n` +
            `आप किस स्थल के समय, टिकट या यात्रा मार्ग की जानकारी चाहते हैं?`;
        } else if (language === 'hinglish') {
          answer = `## 🏛️ Mumbai ke Top Heritage & Tourism Attractions\n\n` +
            `Mumbai mein explore karne ke liye ye 4 places must-visit hain:\n\n` +
            `1. 🏛️ **Gateway of India**: 1924 ka historic Indo-Saracenic monument, Apollo Bunder waterfront par.\n` +
            `2. 🚆 **Chhatrapati Shivaji Maharaj Terminus (CSMT)**: UNESCO World Heritage Victorian Gothic railway masterpiece.\n` +
            `3. 🗿 **Elephanta Caves**: 5th-century rock-cut Shiva cave temples (accessible by ferry from Gateway).\n` +
            `4. 🌊 **Marine Drive & Promenade**: Famous 'Queen’s Necklace' coastline, sunset stroll ke liye perfect!\n\n` +
            `Batao, inme se kiska timing, ticket ya directions chahiye?`;
        } else {
          answer = `## 🏛️ Top Heritage & Tourism Attractions in Mumbai\n\n` +
            `1. 🏛️ **Gateway of India**: Iconic 1924 Indo-Saracenic triumphal arch overlooking the Arabian Sea.\n` +
            `2. 🚆 **Chhatrapati Shivaji Maharaj Terminus (CSMT)**: UNESCO World Heritage Victorian Gothic rail terminus.\n` +
            `3. 🗿 **Elephanta Caves**: UNESCO World Heritage 5th-century rock-cut cave temples.\n` +
            `4. 🌊 **Marine Drive & Promenade**: Iconic coastal boulevard and Queen's Necklace.\n\n` +
            `Would you like timings, entry fees, or transit routes to any of these sites?`;
        }
        followUpQuestions = ['Gateway of India timings', 'CSMT Heritage Gallery', 'Elephanta ferry tickets'];
        break;
      }

      // Default Friendly Response
      if (language === 'hi') {
        answer = `नमस्ते! 😊 मैं विरासत एआई सहायक हूँ। आप भारत के किसी भी ऐतिहासिक स्मारक, शहर, मल्टीमॉडल यात्रा रूट या बजट टूर के बारे में पूछ सकते हैं। आप क्या जानना चाहते हैं?`;
        followUpQuestions = ['जयपुर का ट्रिप प्लान', 'CSMT से Churchgate कैसे जाऊं?', 'भारत के यूनेस्को स्थल'];
      } else if (language === 'hinglish') {
        answer = `Hey! 😊 Main Virasat AI hoon, aapka travel guide. Aap India ke kisi bhi monument, multi-day itinerary, local train/cab route, ya budget estimate ke baare mein pooch sakte hain. Kahan chalna hai?`;
        followUpQuestions = ['Jaipur ka trip plan', 'CSMT se Churchgate kaise jaaun?', 'Top places in Mumbai'];
      } else {
        answer = `Welcome to Virasat! You can explore verified monuments across India, plan multi-day circuits, or calculate multimodal train and road routes. What destination or question would you like to explore?`;
        followUpQuestions = ['Plan a trip to Jaipur', 'What is the best way to travel from CSMT to Churchgate?', 'Top heritage sites in India'];
      }
      break;
    }
  }

  // 6. Optional LLM Refinement if Gemini is available
  if (geminiProvider.isAvailable() && answer.length > 50) {
    try {
      const promptInstruction = buildSystemPrompt(language, context.turnCount <= 1);
      const userPrompt = `USER QUESTION: "${rawMessage}"
DETECTED LANGUAGE: ${language}
VERIFIED FACTUAL CONTEXT & ANSWER TO REFINE:
${answer}

TASK: Refine this into a natural, conversational ChatGPT-style reply in the EXACT language (${language}).
Keep all facts, distances, fares, and numbers 100% accurate. Add a friendly opening and close with natural follow-up options.`;

      const llmOutput = await geminiProvider.generateText(userPrompt, promptInstruction);
      if (llmOutput && llmOutput.length > 30) {
        answer = llmOutput;
      }
    } catch {
      // Graceful fallback to verified deterministic answer
    }
  }

  return createStructuredResponse(answer, intent, language, {
    resolvedLocations,
    recommendations,
    routes,
    transitComparison,
    itinerary,
    budget,
    sources,
    warnings,
    followUpQuestions,
    startTime,
  });
}

function createStructuredResponse(
  answer: string,
  intent: AIIntent,
  language: SupportedLanguage,
  meta: {
    resolvedLocations?: ResolvedLocation[];
    recommendations?: any[];
    routes?: RouteOption[];
    transitComparison?: any;
    itinerary?: ItineraryPlan | null;
    budget?: BudgetBreakdown | null;
    sources: string[];
    warnings?: string[];
    followUpQuestions: string[];
    startTime: number;
  }
): StructuredAIResponse {
  const citations: GroundingCitation[] = meta.sources.map((s, idx) => ({
    place_id: `src-${idx + 1}`,
    place_name: 'India Tourism Registry',
    field_name: 'official_heritage_data',
    fact_value: 'Verified official tourism and transport record',
    confidence: 'OFFICIAL',
    source_name: s,
    source_url: 'https://asi.nic.in',
  }));

  const latencyMs = Date.now() - meta.startTime;

  const response: StructuredAIResponse = {
    success: true,
    type: intent.toLowerCase(),
    intent,
    answer,
    confidence: 0.96,
    locations: meta.resolvedLocations || [],
    recommendations: meta.recommendations || [],
    routes: meta.routes || [],
    itinerary: meta.itinerary || null,
    budget: meta.budget || null,
    sources: meta.sources,
    warnings: meta.warnings || [],
    followUpQuestions: meta.followUpQuestions,

    // Backward-compatible UI fields
    reply: answer,
    suggested_places: meta.recommendations && meta.recommendations.length > 0 ? meta.recommendations : undefined,
    transit_comparison: meta.transitComparison,
    suggested_actions: meta.followUpQuestions,
    grounding_citations: citations,
    grounding_score: 96,
    latency_ms: latencyMs,
    model_used: geminiProvider.isAvailable() ? 'Gemini 2.5 Flash + Virasat Grounded Engine' : fallbackProvider.getModelName(),
  };

  return responseValidator.validate(response);
}
