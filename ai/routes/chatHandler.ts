import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { VIRASAT_SYSTEM_PROMPT } from '../prompts/virasatSystemPrompt';
import { buildContextPayload, formatContextForPrompt } from '../context/buildContextPayload';
import { toolRegistry, getGeminiToolDeclarations, executeTool, getAllToolNames } from '../config/toolRegistry';

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
    service: 'Virasat Isolated AI Subsystem',
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
  const { message, conversation_id, history } = req.body || {};
  const rawQuery = (message || '').trim();

  if (!rawQuery) {
    res.status(400).json({ success: false, error: 'Message cannot be empty' });
    return;
  }

  const sessionId = conversation_id || `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const liveContext = buildContextPayload(req);
  const contextSummary = formatContextForPrompt(liveContext);

  const executedToolCalls: Array<{ tool: string; args: any; result: any }> = [];
  let replyText = '';
  let usedEngine = 'Virasat Grounded Assistant';

  const ai = getAIClient();

  // 1. Try Gemini LLM with function calling
  if (ai) {
    try {
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

          // Check if model called functions
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

            // Second turn: send function response back to Gemini to synthesize natural reply
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
        } catch (callErr) {
          // Try next fallback model
        }
      }
    } catch (err) {
      console.warn('[AI Router] Gemini inference failed, engaging intelligent tool fallback:', err);
    }
  }

  // 2. Intelligent Deterministic Fallback if model was offline or didn't produce replyText
  if (!replyText) {
    const qLower = rawQuery.toLowerCase();

    if (/hotel|stay|resort|lodge|accommodation|room/i.test(qLower)) {
      const city = liveContext.selectedCity || liveContext.userLocation.city || 'Jaipur';
      const hotelRes = await executeTool('searchHotels', { city, limit: 3 }, liveContext);
      executedToolCalls.push({ tool: 'searchHotels', args: { city }, result: hotelRes });

      if (hotelRes.hotels && hotelRes.hotels.length > 0) {
        replyText = `Here are verified accommodations in **${city}**:\n\n` +
          hotelRes.hotels.map((h: any) => `🏨 **${h.name}** (${h.category})\n   • Rate: ${h.price} | Rating: ★ ${h.rating}\n   • Location: ${h.location}`).join('\n\n') +
          `\n\nWould you like transit options or nearby attractions?`;
      }
    } else if (/food|restaurant|eat|cuisine|dish|thali|sweet|chaat/i.test(qLower)) {
      const city = liveContext.selectedCity || liveContext.userLocation.city || 'Delhi';
      const foodRes = await executeTool('searchRestaurants', { city, limit: 3 }, liveContext);
      executedToolCalls.push({ tool: 'searchRestaurants', args: { city }, result: foodRes });

      if (foodRes.recommendations && foodRes.recommendations.length > 0) {
        replyText = `Discover the authentic culinary heritage of **${city}**:\n\n` +
          foodRes.recommendations.map((r: any) => `🥘 **${r.name}**\n   • ${r.description}\n   • Famous at: ${r.popular_locations?.join(', ')}`).join('\n\n') +
          `\n\nWould you like monument recommendations near these dining hubs?`;
      }
    } else if (/train|flight|airport|station|rail|route|transit|reach|how to go/i.test(qLower)) {
      const dest = liveContext.selectedCity || 'Jaipur';
      const orig = liveContext.userLocation.city || 'New Delhi';
      const transRes = await executeTool('getTransportOptions', { origin: orig, destination: dest }, liveContext);
      executedToolCalls.push({ tool: 'getTransportOptions', args: { origin: orig, destination: dest }, result: transRes });

      const opt = transRes.transit_options || {};
      const trainMsg = opt.train?.available ? `🚆 **Train**: ${opt.train.summary} (${opt.train.approx_duration})` : '';
      const airMsg = opt.air?.available ? `✈️ **Flight**: ${opt.air.summary} (${opt.air.approx_duration})` : '';
      const roadMsg = opt.road?.available ? `🚗 **Road**: ${opt.road.summary} (${opt.road.approx_duration})` : '';

      replyText = `Verified multimodal transit options from **${transRes.origin}** to **${transRes.destination}** (~${transRes.straight_line_km} km):\n\n` +
        [trainMsg, airMsg, roadMsg].filter(Boolean).join('\n\n') +
        `\n\nAll rail routing connects via official Indian Railways IRCTC mainline junctions.`;
    } else if (/weather|climate|rain|temperature|best time/i.test(qLower)) {
      const city = liveContext.selectedCity || liveContext.userLocation.city || 'Delhi';
      const weatherRes = await executeTool('getWeather', { city }, liveContext);
      executedToolCalls.push({ tool: 'getWeather', args: { city }, result: weatherRes });

      replyText = `🌤️ **Seasonal Climate for ${weatherRes.city}** (${weatherRes.month}):\n\n` +
        `• **Temperature Range**: ${weatherRes.temperature_range}\n` +
        `• **Conditions**: ${weatherRes.condition}\n` +
        `• **Best Season to Visit**: ${weatherRes.best_time_to_visit}\n` +
        `• **Travel Advisory**: ${weatherRes.travel_advisory}`;
    } else if (/budget|cost|expense|kitna kharcha/i.test(qLower)) {
      const dest = liveContext.selectedCity || 'Rajasthan';
      const budgetRes = await executeTool('estimateBudget', { destination: dest, duration_days: 3 }, liveContext);
      executedToolCalls.push({ tool: 'estimateBudget', args: { destination: dest }, result: budgetRes });

      replyText = `💰 **Estimated Trip Budget for ${budgetRes.destination}** (${budgetRes.duration}, ${budgetRes.party_size}):\n\n` +
        `• **Accommodation**: ${budgetRes.breakdown_inr.accommodation}\n` +
        `• **Meals & Dining**: ${budgetRes.breakdown_inr.food_dining}\n` +
        `• **Local Transit**: ${budgetRes.breakdown_inr.local_transit}\n` +
        `• **Monument Entries**: ${budgetRes.breakdown_inr.monument_tickets}\n\n` +
        `**Total Estimate**: ${budgetRes.total_estimated_budget} (~${budgetRes.estimated_per_person} per person).`;
    } else if (/emergency|help|hospital|police|helpline|safe/i.test(qLower)) {
      const city = liveContext.selectedCity || liveContext.userLocation.city || 'India';
      const emergRes = await executeTool('getNearbyEmergencyServices', { city }, liveContext);
      executedToolCalls.push({ tool: 'getNearbyEmergencyServices', args: { city }, result: emergRes });

      replyText = `🚨 **Official 24x7 Tourism & Emergency Helplines**:\n\n` +
        `• **National Emergency**: 112 (Police, Fire, Ambulance)\n` +
        `• **Ministry of Tourism 24x7 Tourist Helpline**: 1363 (Toll-Free, 12 languages)\n` +
        `• **Medical Emergency**: 108\n` +
        `• **Railway Security Assistance**: 139\n` +
        `• **Women Safety**: 1091\n\n` +
        `Tourist police assist desks are situated at all major UNESCO World Heritage monuments.`;
    } else if (/festival|event|mela|calendar|celebration/i.test(qLower)) {
      const city = liveContext.selectedCity;
      const eventsRes = await executeTool('getEventsCalendar', { city }, liveContext);
      executedToolCalls.push({ tool: 'getEventsCalendar', args: { city }, result: eventsRes });

      if (eventsRes.events && eventsRes.events.length > 0) {
        replyText = `🗓️ **Cultural Festivals & Heritage Fairs**:\n\n` +
          eventsRes.events.map((e: any) => `🎉 **${e.festival}** (${e.location})\n   • Timing: ${e.season_timing}\n   • Significance: ${e.cultural_significance}`).join('\n\n');
      }
    } else if (/market|bazaar|shopping|craft|souvenir/i.test(qLower)) {
      const city = liveContext.selectedCity || 'Jaipur';
      const marketRes = await executeTool('searchMarkets', { city }, liveContext);
      executedToolCalls.push({ tool: 'searchMarkets', args: { city }, result: marketRes });

      replyText = `🛍️ **Artisan Studios & Heritage Bazaars in ${marketRes.city}**:\n\n` +
        (marketRes.artisan_studios || []).map((a: any) => `✨ **${a.name}** (${a.craft})\n   • ${a.story}\n   • Price: ${a.price_range}`).join('\n\n') +
        `\n\nTip: Always look for official GI (Geographical Indication) tags for authentic crafts.`;
    } else {
      // Default: search tourist places
      const city = liveContext.selectedCity;
      const placesRes = await executeTool('searchTouristPlaces', { query: rawQuery, city, limit: 3 }, liveContext);
      executedToolCalls.push({ tool: 'searchTouristPlaces', args: { query: rawQuery, city }, result: placesRes });

      if (placesRes.results && placesRes.results.length > 0) {
        replyText = `Based on verified ASI & State Tourism records, here are key destinations:\n\n` +
          placesRes.results.map((p: any, idx: number) => `${idx + 1}. 🏛️ **${p.name}** (${p.city}, ${p.state})\n   ${p.summary}\n   • Timings: ${p.timings} | Fee: ${p.entry_fee}`).join('\n\n') +
          `\n\nWould you like me to build a multi-day itinerary or check transport connections?`;
      } else {
        replyText = `Namaste! Welcome to Virasat AI Concierge (विरासत - Discover Bharat). You can ask me about verified monuments, train connections, heritage stays, local culinary specialties, or multi-day itineraries across all 28 States and 8 Union Territories. How may I assist your journey?`;
      }
    }
  }

  res.json({
    success: true,
    reply: replyText,
    session_id: sessionId,
    engine: usedEngine,
    tool_calls: executedToolCalls,
    latency_ms: Date.now() - startTime,
    context: {
      route: liveContext.currentRoute,
      city: liveContext.selectedCity,
      place_id: liveContext.selectedPlaceId,
    },
  });
});
