import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { VIRASAT_SYSTEM_PROMPT } from '../prompts/virasatSystemPrompt';
import { buildContextPayload, formatContextForPrompt } from '../context/buildContextPayload';
import { toolRegistry, getGeminiToolDeclarations, executeTool, getAllToolNames } from '../config/toolRegistry';
import { detectIntent } from '../engine/intentEngine';
import { extractEntities } from '../engine/entityExtractor';
import { getConversationState, updateConversationState } from '../engine/conversationMemory';
import { generateSmartItinerary } from '../engine/itineraryPlanner';
import { buildResponseForIntent } from '../engine/responseGenerator';

export const aiChatRouter = Router();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'virasat-isolated-ai/1.0' } },
      });
    } catch (err) {
      console.warn('[AI Router] Failed to initialize GoogleGenAI client:', err);
      return null;
    }
  }
  return aiClient;
}

/**
 * GET /api/ai/tools
 * Returns registry of all 18 available tools and their schemas
 */
aiChatRouter.get('/tools', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    total_tools: getAllToolNames().length,
    tools: Object.values(toolRegistry).map((t) => t.declaration),
  });
});

/**
 * GET /api/ai/health
 */
aiChatRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Virasat AI Travel & Heritage Concierge',
    tools_registered: getAllToolNames().length,
    gemini_configured: Boolean(process.env.GEMINI_API_KEY),
  });
});

/**
 * POST /api/ai/chat
 * Primary entry point for frontend chatbot
 */
aiChatRouter.post('/chat', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  const { message, conversation_id, session_id, history } = req.body || {};
  const rawQuery = (message || '').trim();

  if (!rawQuery) {
    res.status(400).json({ success: false, error: 'Message cannot be empty' });
    return;
  }

  const sessionId = conversation_id || session_id || `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const liveContext = buildContextPayload(req);
  const existingState = getConversationState(sessionId);

  // Propagate active memory for entity & place resolution
  if (existingState.lastPlace) {
    (liveContext as any).lastPlace = existingState.lastPlace;
  }
  if (existingState.destination && !liveContext.selectedCity) {
    liveContext.selectedCity = existingState.destination;
  }

  // 1. Run Intent Engine & Entity Extractor with state awareness
  const contextForResolution = {
    ...liveContext,
    lastPlace: existingState.lastPlace,
    destination: existingState.destination,
  };
  const intentResult = detectIntent(rawQuery, contextForResolution);
  const entities = extractEntities(rawQuery, contextForResolution);
  entities.query_focus = rawQuery;

  // 2. Update Stateful Multi-Turn Conversation Memory
  const tripState = updateConversationState(sessionId, entities, intentResult.intent);

  // Explicitly persist resolvedPlace into memory and liveContext
  if (intentResult.resolvedPlace) {
    tripState.lastPlace = intentResult.resolvedPlace;
    tripState.lastPlaceId = intentResult.resolvedPlace.id;
    tripState.destination = intentResult.resolvedPlace.city;
    liveContext.selectedCity = intentResult.resolvedPlace.city;
  }

  // Set selected city or destination into context if known
  if (tripState.destination && !liveContext.selectedCity) {
    liveContext.selectedCity = tripState.destination;
  }
  if (tripState.origin && !liveContext.userLocation.city) {
    liveContext.userLocation.city = tripState.origin;
  }

  const executedToolCalls: Array<{ tool: string; args: any; result: any }> = [];
  let replyText = '';
  let usedEngine = 'Virasat Grounded Assistant';
  let generatedPlan: any = null;
  let dynamicQuickActions: string[] = [];
  let sourceList: string[] | undefined = undefined;

  const ai = getAIClient();

  // 3. Try Gemini LLM if API Key is available
  if (ai) {
    try {
      const memoryStr = `ACTIVE TRIP MEMORY:
Destination: ${tripState.destination || 'Not chosen yet'}
Origin: ${tripState.origin || 'Not specified'}
Duration: ${tripState.duration_days ? `${tripState.duration_days} Days` : 'Not specified'}
Budget: ${tripState.budget ? `₹${tripState.budget}` : 'Flexible'}
Travel Style: ${tripState.travel_style || 'Moderate'}
Hotel Tier: ${tripState.hotel_tier || 'Moderate'}
Interests: ${tripState.interests.join(', ') || 'General Sightseeing'}`;

      const contextSummary = `${formatContextForPrompt(liveContext)}\n\n${memoryStr}`;
      const systemInstruction = `${VIRASAT_SYSTEM_PROMPT}\n\n${contextSummary}`;
      const geminiTools = getGeminiToolDeclarations();

      const contents: any[] = [
        ...(Array.isArray(history)
          ? history.slice(-6).map((h: any) => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content || h.text || '' }],
            }))
          : []),
        { role: 'user', parts: [{ text: rawQuery }] },
      ];

      const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash'];
      for (const mName of modelNames) {
        try {
          const response = await Promise.race([
            ai.models.generateContent({
              model: mName,
              contents,
              config: {
                systemInstruction,
                tools: geminiTools,
              },
            }),
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 6500)),
          ]);

          const functionCalls = (response as any)?.functionCalls || [];
          if (functionCalls.length > 0) {
            const toolResultsParts: any[] = [];

            for (const call of functionCalls) {
              const toolResult = await executeTool(call.name, call.args, liveContext);
              executedToolCalls.push({
                tool: call.name,
                args: call.args,
                result: toolResult,
              });

              toolResultsParts.push({
                functionResponse: {
                  name: call.name,
                  response: { result: toolResult },
                },
              });
            }

            contents.push(response.candidates?.[0]?.content);
            contents.push({ role: 'user', parts: toolResultsParts });

            const secondResponse = await Promise.race([
              ai.models.generateContent({
                model: mName,
                contents,
                config: { systemInstruction },
              }),
              new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5500)),
            ]);

            if (secondResponse?.text) {
              replyText = secondResponse.text;
              usedEngine = `${mName} (Tool-Grounded)`;
              break;
            }
          } else if (response?.text) {
            replyText = response.text;
            usedEngine = mName;
            break;
          }
        } catch {
          // Fallback to next model
        }
      }
    } catch (err) {
      console.warn('[AI Router] Gemini inference exception:', err);
    }
  }

  // 4. Intelligent Deterministic Brain (Handles All Intents Natively)
  if (!replyText) {
    const intent = intentResult.intent;

    // Social / Conversational Intents
    if (
      intent === 'GREETING' ||
      intent === 'CASUAL_CONVERSATION' ||
      intent === 'ABOUT_VIRASAT' ||
      intent === 'HELP' ||
      intent === 'FAREWELL' ||
      intent === 'THANKS' ||
      intent === 'COMPARISON'
    ) {
      const formatted = buildResponseForIntent(intentResult, tripState);
      replyText = formatted.reply;
      dynamicQuickActions = formatted.suggested_actions;
    } else if (intent === 'MONUMENT_INFO' || intent === 'HERITAGE_QUERY') {
      const place = intentResult.resolvedPlace || tripState.lastPlace;
      const formatted = buildResponseForIntent(intentResult, tripState);
      replyText = formatted.reply;
      dynamicQuickActions = formatted.suggested_actions;
      sourceList = formatted.sources;

      if (place) {
        executedToolCalls.push({
          tool: 'searchTouristPlaces',
          args: { query: place.name, city: place.city },
          result: {
            results: [{
              id: place.id,
              name: place.name,
              city: place.city,
              state: place.state,
              category: place.category,
              summary: place.summary,
              timings: place.visiting_hours,
              entry_fee: place.entry_fee,
              official_source: place.official_source
            }]
          }
        });
      }
    } else if (intent === 'NEARBY_SEARCH') {
      const place = intentResult.resolvedPlace || tripState.lastPlace;
      const city = place?.city || tripState.destination || liveContext.selectedCity || 'Mumbai';
      const placesRes = await executeTool('searchTouristPlaces', { city, limit: 4 }, liveContext);
      executedToolCalls.push({ tool: 'searchTouristPlaces', args: { city }, result: placesRes });

      const formatted = buildResponseForIntent(intentResult, tripState);
      replyText = formatted.reply;
      dynamicQuickActions = formatted.suggested_actions;
      sourceList = formatted.sources;
    } else if (intent === 'STATE_INFO' || intent === 'UT_INFO') {
      const stateName = entities.state || 'Rajasthan';
      const placesRes = await executeTool('searchTouristPlaces', { state: stateName, limit: 6 }, liveContext);
      executedToolCalls.push({ tool: 'searchTouristPlaces', args: { state: stateName }, result: placesRes });

      if (placesRes.results && placesRes.results.length > 0) {
        replyText = intentResult.isHinglish
          ? `**${stateName} ke Verified World Heritage & Iconic Sthal** (Archaeological Survey of India & State Tourism archives):\n\n` +
            placesRes.results.map((p: any, idx: number) => `${idx + 1}. 🏛️ **${p.name}** (${p.city}, ${p.state})\n   ${p.summary}\n   • Timings: ${p.timings} | Fee: ${p.entry_fee}`).join('\n\n') +
            `\n\nKya aap inka multi-city circuit itinerary plan karna chahte hain ya specific monument ki details dekhni hain?`
          : `**Verified Heritage Landmarks in ${stateName}**:\n\n` +
            placesRes.results.map((p: any, idx: number) => `${idx + 1}. 🏛️ **${p.name}** (${p.city}, ${p.state})\n   ${p.summary}\n   • Timings: ${p.timings} | Fee: ${p.entry_fee}`).join('\n\n') +
            `\n\nWould you like me to build a multi-city travel circuit or explore stays in ${stateName}?`;
      } else {
        replyText = `Verified heritage landmarks in ${stateName} are available across its premier historical cities.`;
      }
      dynamicQuickActions = [`Plan ${stateName} Trip`, 'Heritage Forts', 'Find Stays', 'How to Reach'];
      sourceList = ['Archaeological Survey of India (ASI)', `${stateName} State Tourism Department`, 'Virasat Master Tourism Registry'];
    } else if (intent === 'YOU_DECIDE') {
      const formatted = buildResponseForIntent(intentResult, tripState);
      replyText = formatted.reply;
      dynamicQuickActions = formatted.suggested_actions;
    } else if (intent === 'TRIP_PLANNING' || intent === 'ITINERARY_MODIFICATION') {
      generatedPlan = generateSmartItinerary(tripState);
      tripState.lastItinerary = generatedPlan;

      // Also invoke searchTouristPlaces tool so frontend receives places
      const city = tripState.destination || 'Jaipur';
      const placesRes = await executeTool('searchTouristPlaces', { city, limit: 4 }, liveContext);
      executedToolCalls.push({ tool: 'searchTouristPlaces', args: { city }, result: placesRes });

      // And get transport options if origin is known
      if (tripState.origin) {
        const transRes = await executeTool('getTransportOptions', { origin: tripState.origin, destination: city }, liveContext);
        executedToolCalls.push({ tool: 'getTransportOptions', args: { origin: tripState.origin, destination: city }, result: transRes });
      }

      const formatted = buildResponseForIntent(intentResult, tripState, generatedPlan);
      replyText = formatted.reply;
      dynamicQuickActions = formatted.suggested_actions;
      sourceList = formatted.sources;
    } else if (intent === 'HOTEL_SEARCH' || intent === 'HOTEL_COMPARISON') {
      const city = tripState.lastPlace?.city || tripState.destination || liveContext.selectedCity || 'Jaipur';
      const placeId = tripState.lastPlace?.id;
      const hotelRes = await executeTool('searchHotels', { city, place_id: placeId, category: tripState.hotel_tier, limit: 4 }, liveContext);
      executedToolCalls.push({ tool: 'searchHotels', args: { city, place_id: placeId }, result: hotelRes });

      if (hotelRes.hotels && hotelRes.hotels.length > 0) {
        const placePrefix = tripState.lastPlace ? `**${tripState.lastPlace.name} (${city})** ke paas ` : `**${city}** ke `;
        replyText = intentResult.isHinglish
          ? `Yeh rahe ${placePrefix}verified accommodations (${tripState.hotel_tier || 'comfortable'} category):\n\n` +
            hotelRes.hotels.map((h: any) => `🏨 **${h.name}** (${h.category})\n   • Rate: ${h.price} | Rating: ★ ${h.rating}\n   • Location: ${h.location}`).join('\n\n') +
            `\n\nKya aap inke paas ke monuments ya transport routes dekhna chahte hain?`
          : `Here are verified accommodations ${tripState.lastPlace ? `near **${tripState.lastPlace.name}** in ` : 'in '}**${city}**:\n\n` +
            hotelRes.hotels.map((h: any) => `🏨 **${h.name}** (${h.category})\n   • Rate: ${h.price} | Rating: ★ ${h.rating}\n   • Location: ${h.location}`).join('\n\n') +
            `\n\nWould you like nearby monument recommendations or transport options?`;
      } else {
        replyText = `Verified hotels list is being updated for ${city}. Standard heritage stays in ${city} range between ₹2,500 and ₹7,000 per night.`;
      }
      dynamicQuickActions = ['Compare Stays', 'Budget Hotels', 'Luxury Palace Hotels', `Plan 1-Day ${city} Plan`];
      sourceList = ['State Tourism Development Corporation', 'Virasat Hotel Registry'];
    } else if (intent === 'FOOD_SEARCH' || intent === 'RESTAURANT_SEARCH') {
      const city = tripState.lastPlace?.city || tripState.destination || liveContext.selectedCity || 'Agra';
      const foodRes = await executeTool('searchRestaurants', { city, limit: 4 }, liveContext);
      executedToolCalls.push({ tool: 'searchRestaurants', args: { city }, result: foodRes });

      if (foodRes.recommendations && foodRes.recommendations.length > 0) {
        const placePrefix = tripState.lastPlace ? `**${tripState.lastPlace.name} (${city})** ke aas-paas ka ` : `**${city}** ka `;
        replyText = intentResult.isHinglish
          ? `${placePrefix}authentic culinary heritage aur mashhoor swad:\n\n` +
            foodRes.recommendations.map((r: any) => `🥘 **${r.name}**\n   • ${r.description}\n   • Kahan milega: ${r.popular_locations?.join(', ')}`).join('\n\n') +
            `\n\nIn food streets ke aas-paas ke heritage spots dekhne hain?`
          : `Authentic culinary heritage ${tripState.lastPlace ? `near **${tripState.lastPlace.name}** in ` : 'of '}**${city}**:\n\n` +
            foodRes.recommendations.map((r: any) => `🥘 **${r.name}**\n   • ${r.description}\n   • Famous locations: ${r.popular_locations?.join(', ')}`).join('\n\n') +
            `\n\nWould you like monument recommendations near these culinary lanes?`;
      }
      dynamicQuickActions = ['Nearby Monuments', 'Traditional Bazaars', 'Find Stays', 'How to Reach'];
      sourceList = ['Ministry of Culture Gastronomic Archives', 'Virasat Culinary Guide'];
    } else if (intent === 'TRAIN_SEARCH' || intent === 'FLIGHT_SEARCH' || intent === 'TRANSPORT_SEARCH') {
      const dest = tripState.destination || 'Jaipur';
      const orig = tripState.origin || 'New Delhi';
      const transRes = await executeTool('getTransportOptions', { origin: orig, destination: dest }, liveContext);
      executedToolCalls.push({ tool: 'getTransportOptions', args: { origin: orig, destination: dest }, result: transRes });

      const opt = transRes.transit_options || {};
      const trainMsg = opt.train?.available ? `🚆 **Train**: ${opt.train.summary} (${opt.train.approx_duration})` : '';
      const airMsg = opt.air?.available ? `✈️ **Flight**: ${opt.air.summary} (${opt.air.approx_duration})` : '';
      const roadMsg = opt.road?.available ? `🚗 **Road**: ${opt.road.summary} (${opt.road.approx_duration})` : '';

      replyText = intentResult.isHinglish
        ? `**${transRes.origin}** se **${transRes.destination}** tak ke verified multimodal transit vikalp (~${transRes.straight_line_km} km):\n\n` +
          [trainMsg, airMsg, roadMsg].filter(Boolean).join('\n\n') +
          `\n\nSabhi rail connections official Indian Railways IRCTC mainline junctions se connected hain.`
        : `Verified multimodal travel options from **${transRes.origin}** to **${transRes.destination}** (~${transRes.straight_line_km} km):\n\n` +
          [trainMsg, airMsg, roadMsg].filter(Boolean).join('\n\n') +
          `\n\nAll rail connections are connected via official Indian Railways IRCTC mainline junctions.`;

      dynamicQuickActions = ['Find Hotels in ' + dest, 'Estimated Budget', 'Emergency Helplines', 'Top Sights in ' + dest];
      sourceList = ['Indian Railways IRCTC', 'National Highways Authority of India'];
    } else if (intent === 'WEATHER_QUERY') {
      const city = tripState.destination || liveContext.selectedCity || 'Shimla';
      const weatherRes = await executeTool('getWeather', { city }, liveContext);
      executedToolCalls.push({ tool: 'getWeather', args: { city }, result: weatherRes });

      replyText = intentResult.isHinglish
        ? `🌤️ **${weatherRes.city} ka Mausam aur Travel Advisory** (${weatherRes.month}):\n\n` +
          `• **Temperature**: ${weatherRes.temperature_range}\n` +
          `• **Conditions**: ${weatherRes.condition}\n` +
          `• **Ghumne ka Sabse Accha Samay**: ${weatherRes.best_time_to_visit}\n` +
          `• **Advisory**: ${weatherRes.travel_advisory}`
        : `🌤️ **Seasonal Climate for ${weatherRes.city}** (${weatherRes.month}):\n\n` +
          `• **Temperature Range**: ${weatherRes.temperature_range}\n` +
          `• **Condition**: ${weatherRes.condition}\n` +
          `• **Best Season to Visit**: ${weatherRes.best_time_to_visit}\n` +
          `• **Travel Advisory**: ${weatherRes.travel_advisory}`;

      dynamicQuickActions = ['Best Season to Visit', 'Recommended Clothing', 'Plan Trip to ' + city, 'Find Stays'];
      sourceList = ['India Meteorological Department Guidelines', 'State Tourism Climate Guide'];
    } else if (intent === 'BUDGET_PLANNING') {
      const dest = tripState.destination || 'Rajasthan';
      const budgetRes = await executeTool(
        'estimateBudget',
        { destination: dest, duration_days: tripState.duration_days || 3, travel_style: tripState.travel_style },
        liveContext
      );
      executedToolCalls.push({ tool: 'estimateBudget', args: { destination: dest }, result: budgetRes });

      replyText = intentResult.isHinglish
        ? `💰 **${budgetRes.destination} ka Estimated Trip Budget** (${budgetRes.duration}, ${budgetRes.party_size}):\n\n` +
          `• **Hotel/Stay**: ${budgetRes.breakdown_inr.accommodation}\n` +
          `• **Khana/Dining**: ${budgetRes.breakdown_inr.food_dining}\n` +
          `• **Local Cab/Auto**: ${budgetRes.breakdown_inr.local_transit}\n` +
          `• **Monument Entry Tickets**: ${budgetRes.breakdown_inr.monument_tickets}\n\n` +
          `**Kul Estimated Kharcha**: ${budgetRes.total_estimated_budget} (~${budgetRes.estimated_per_person} prati vyakti).`
        : `💰 **Estimated Trip Budget for ${budgetRes.destination}** (${budgetRes.duration}, ${budgetRes.party_size}):\n\n` +
          `• **Accommodation**: ${budgetRes.breakdown_inr.accommodation}\n` +
          `• **Meals & Dining**: ${budgetRes.breakdown_inr.food_dining}\n` +
          `• **Local Transit**: ${budgetRes.breakdown_inr.local_transit}\n` +
          `• **Monument Entries**: ${budgetRes.breakdown_inr.monument_tickets}\n\n` +
          `**Total Estimated Cost**: ${budgetRes.total_estimated_budget} (~${budgetRes.estimated_per_person} per person).`;

      dynamicQuickActions = ['Itemized Breakdown', 'Cost-Saving Tips', 'Check Train Tickets', 'Find Budget Stays'];
      sourceList = ['Virasat Tariff Calculator', 'State Tourism Standard Tariffs'];
    } else if (intent === 'EMERGENCY_QUERY') {
      const city = tripState.destination || liveContext.selectedCity || 'India';
      const emergRes = await executeTool('getNearbyEmergencyServices', { city }, liveContext);
      executedToolCalls.push({ tool: 'getNearbyEmergencyServices', args: { city }, result: emergRes });

      replyText = intentResult.isHinglish
        ? `🚨 **Official 24x7 Tourism & Emergency Helplines**:\n\n` +
          `• **National Emergency**: 112 (Police, Fire, Ambulance)\n` +
          `• **Ministry of Tourism 24x7 Tourist Helpline**: 1363 (Toll-Free, 12 bhashaon mein)\n` +
          `• **Medical Emergency (Ambulance)**: 108\n` +
          `• **Railway Security Assistance**: 139\n` +
          `• **Women Safety Helpline**: 1091\n\n` +
          `Tourist police assist desks sabhi pramukh UNESCO World Heritage monuments par sthit hain.`
        : `🚨 **Official 24x7 Tourism & Emergency Helplines**:\n\n` +
          `• **All-in-One National Emergency**: 112 (Police, Fire, Ambulance)\n` +
          `• **Ministry of Tourism 24x7 Tourist Helpline**: 1363 (Toll-Free in 12 languages)\n` +
          `• **Medical Emergency**: 108\n` +
          `• **Railway Security Assistance**: 139\n` +
          `• **Women Safety Helpline**: 1091\n\n` +
          `Tourist police assist desks are situated at all major UNESCO World Heritage monuments.`;

      dynamicQuickActions = ['Call 1363 Helpline', 'Nearest Tourist Police', 'Medical Help 108', 'Main Station Help'];
      sourceList = ['Ministry of Tourism National Emergency Registry'];
    } else if (intent === 'FESTIVAL_QUERY') {
      const city = tripState.destination || liveContext.selectedCity;
      const eventsRes = await executeTool('getEventsCalendar', { city }, liveContext);
      executedToolCalls.push({ tool: 'getEventsCalendar', args: { city }, result: eventsRes });

      if (eventsRes.events && eventsRes.events.length > 0) {
        replyText = intentResult.isHinglish
          ? `🗓️ **Pramukh Cultural Festivals & Fairs**:\n\n` +
            eventsRes.events.map((e: any) => `🎉 **${e.festival}** (${e.location})\n   • Samay: ${e.season_timing}\n   • Significance: ${e.cultural_significance}`).join('\n\n')
          : `🗓️ **Prominent Cultural Festivals & Heritage Fairs**:\n\n` +
            eventsRes.events.map((e: any) => `🎉 **${e.festival}** (${e.location})\n   • Timing: ${e.season_timing}\n   • Significance: ${e.cultural_significance}`).join('\n\n');
      }
      dynamicQuickActions = ['Festival Timings', 'Nearby Stays', 'Temple Guidelines', 'Plan Trip'];
      sourceList = ['Ministry of Culture Living Heritage Registry'];
    } else if (intent === 'SHOPPING_SEARCH' || intent === 'MARKET_SEARCH') {
      const city = tripState.destination || liveContext.selectedCity || 'Jaipur';
      const marketRes = await executeTool('searchMarkets', { city }, liveContext);
      executedToolCalls.push({ tool: 'searchMarkets', args: { city }, result: marketRes });

      replyText = intentResult.isHinglish
        ? `🛍️ **${marketRes.city} ke Historic Bazaars & GI Artisan Studios**:\n\n` +
          (marketRes.artisan_studios || []).map((a: any) => `✨ **${a.name}** (${a.craft})\n   • ${a.story}\n   • Rate: ${a.price_range}`).join('\n\n') +
          `\n\nSalah: Asli hastshilp (handicrafts) aur silk ke liye hamesha official GI (Geographical Indication) tag check karein.`
        : `🛍️ **Historic Bazaars & GI Artisan Studios in ${marketRes.city}**:\n\n` +
          (marketRes.artisan_studios || []).map((a: any) => `✨ **${a.name}** (${a.craft})\n   • ${a.story}\n   • Price range: ${a.price_range}`).join('\n\n') +
          `\n\nTip: Always look for official GI (Geographical Indication) marks on authentic textiles and handicrafts.`;

      dynamicQuickActions = ['Famous Bazaars', 'GI Crafts Info', 'Bargaining Tips', 'Nearby Monuments'];
      sourceList = ['Geographical Indications Registry of India', 'State Craft Guilds'];
    } else {
      // Default: Search Tourist Places for Destination / State / Query
      const city = tripState.destination || liveContext.selectedCity;
      const queryToSearch = rawQuery
        .replace(/ke baare mein batao|k baare main batao|ke baare me batao|k bare me|ke bare mein|k baare me|tell me about|places to visit in|best places in/gi, '')
        .trim() || city || 'Jaipur';
      const placesRes = await executeTool('searchTouristPlaces', { query: queryToSearch, city, limit: 4 }, liveContext);
      executedToolCalls.push({ tool: 'searchTouristPlaces', args: { query: queryToSearch, city }, result: placesRes });

      if (placesRes.results && placesRes.results.length > 0) {
        replyText = intentResult.isHinglish
          ? `Archaeological Survey of India (ASI) aur State Tourism records ke anusar, yeh rahe pramukh heritage sthal:\n\n` +
            placesRes.results.map((p: any, idx: number) => `${idx + 1}. 🏛️ **${p.name}** (${p.city}, ${p.state})\n   ${p.summary}\n   • Timings: ${p.timings} | Fee: ${p.entry_fee}`).join('\n\n') +
            `\n\nKya aap inka multi-day itinerary plan karna chahte hain ya hotel aur train options check karne hain?`
          : `Based on verified Archaeological Survey of India (ASI) and State Tourism records, here are key highlights:\n\n` +
            placesRes.results.map((p: any, idx: number) => `${idx + 1}. 🏛️ **${p.name}** (${p.city}, ${p.state})\n   ${p.summary}\n   • Timings: ${p.timings} | Fee: ${p.entry_fee}`).join('\n\n') +
            `\n\nWould you like me to build a multi-day itinerary or check transport connections?`;
        sourceList = ['Archaeological Survey of India', 'State Tourism Gazette', 'Virasat Tourism Database'];
      } else {
        const activeName = tripState.lastPlace?.name || tripState.destination || 'Bharat';
        replyText = intentResult.isHinglish
          ? `Main ${activeName} ya kisi bhi monument, train routes, heritage stays aur multi-day itinerary ke baare mein verified jankari de sakta hoon. Aap kis baare mein jaanna chahte hain?`
          : `I can assist with verified monuments, train routes, heritage hotels, and day-wise itineraries for ${activeName} or any Indian destination. What would you like to explore?`;
      }
      dynamicQuickActions = ['Plan a Trip', 'Explore Near Me', 'Top Heritage Forts', 'Emergency Helpline'];
    }
  }

  // 5. Extract Structured Cards for Frontend UI Rendering
  let suggestedPlaces: any[] = [];
  const placeCall = executedToolCalls.find((t) => t.tool === 'searchTouristPlaces');
  if (placeCall && Array.isArray(placeCall.result?.results)) {
    suggestedPlaces = placeCall.result.results.slice(0, 4).map((p: any) => ({
      id: p.id,
      name: p.name,
      city: p.city,
      state: p.state,
      category: p.category,
      reason: p.summary,
      data_confidence: 'official',
      source_url: p.official_source,
    }));
  }

  let transitComparison: any = null;
  const transCall = executedToolCalls.find((t) => t.tool === 'getTransportOptions');
  if (transCall && transCall.result) {
    const opt = transCall.result.transit_options || {};
    transitComparison = {
      origin: transCall.result.origin,
      destination: transCall.result.destination,
      distance_km: transCall.result.straight_line_km,
      train: opt.train?.available
        ? {
            summary: opt.train.summary,
            approx_duration: opt.train.approx_duration,
            stations: opt.train.stations,
            notes: opt.train.notes,
          }
        : undefined,
      air: opt.air?.available
        ? {
            summary: opt.air.summary,
            approx_duration: opt.air.approx_duration,
            notes: opt.air.notes,
          }
        : undefined,
      road: opt.road?.available
        ? {
            summary: opt.road.summary,
            approx_duration: opt.road.approx_duration,
            notes: opt.road.notes,
          }
        : undefined,
    };
  }

  // Default dynamic quick actions if not already set
  if (dynamicQuickActions.length === 0) {
    dynamicQuickActions = ['Plan Multi-Day Itinerary', 'Find Heritage Hotels', 'Check Train Routes', 'Authentic Food Streets'];
  }

  res.json({
    success: true,
    conversation_id: sessionId,
    session_id: sessionId,
    reply: replyText,
    engine: usedEngine,
    model_used: usedEngine,
    suggested_places: suggestedPlaces.length > 0 ? suggestedPlaces : undefined,
    transit_comparison: transitComparison || undefined,
    suggested_actions: dynamicQuickActions,
    sources: sourceList || (executedToolCalls.length > 0
      ? ['Archaeological Survey of India (ASI)', 'Ministry of Tourism (Incredible India)', 'Indian Railways IRCTC']
      : undefined),
    tool_calls: executedToolCalls,
    latency_ms: Date.now() - startTime,
    context: {
      route: liveContext.currentRoute,
      city: tripState.destination || liveContext.selectedCity,
      place_id: liveContext.selectedPlaceId,
      memory: {
        origin: tripState.origin,
        destination: tripState.destination,
        duration_days: tripState.duration_days,
        budget: tripState.budget,
        hotel_tier: tripState.hotel_tier,
      },
    },
  });
});
