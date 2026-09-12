import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { VIRASAT_SYSTEM_PROMPT } from '../prompts/virasatSystemPrompt';
import {
  buildContextPayload,
  formatContextForPrompt,
} from '../context/buildContextPayload';
import {
  toolRegistry,
  getGeminiToolDeclarations,
  executeTool,
  getAllToolNames,
} from '../config/toolRegistry';
import { detectIntent } from '../engine/intentEngine';
import { extractEntities } from '../engine/entityExtractor';
import {
  getConversationState,
  updateConversationState,
} from '../engine/conversationMemory';
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
        httpOptions: {
          headers: {
            'User-Agent': 'virasat-isolated-ai/1.0',
          },
        },
      });
    } catch (err) {
      console.warn(
        '[AI Router] Failed to initialize GoogleGenAI client:',
        err
      );
      return null;
    }
  }

  return aiClient;
}

/**
 * GET /api/ai/tools
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
 *
 * Main Virasat orchestration pipeline:
 *
 * USER
 *   ↓
 * NORMALIZE
 *   ↓
 * INTENT DETECTION
 *   ↓
 * ENTITY EXTRACTION
 *   ↓
 * CONVERSATION MEMORY
 *   ↓
 * FACTUAL TOOL / DATABASE ROUTING
 *   ↓
 * RESPONSE GENERATION
 *
 * Gemini is intentionally NOT allowed to answer factual
 * tourism intents blindly. It is primarily used for
 * conversational/reasoning experiences.
 */
aiChatRouter.post(
  '/chat',
  async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();

    const {
      message,
      conversation_id,
      session_id,
      history,
    } = req.body || {};

    const rawQuery = (message || '').trim();

    if (!rawQuery) {
      res.status(400).json({
        success: false,
        error: 'Message cannot be empty',
      });
      return;
    }

    /**
     * Stable conversation/session identifier.
     */
    const sessionId =
      conversation_id ||
      session_id ||
      `session-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)}`;

    /**
     * Live browser/request context.
     */
    const liveContext = buildContextPayload(req);

    /**
     * Existing conversation memory.
     */
    const existingState = getConversationState(sessionId);

    /**
     * Preserve previous place context for follow-up queries.
     */
    if (existingState.lastPlace) {
      (liveContext as any).lastPlace = existingState.lastPlace;
    }

    /**
     * Only use existing destination when the request
     * context does not already provide a selected city.
     */
    if (existingState.destination && !liveContext.selectedCity) {
      liveContext.selectedCity = existingState.destination;
    }

    /**
     * ============================================================
     * 1. INTENT + ENTITY EXTRACTION
     * ============================================================
     */

    const contextForResolution = {
      ...liveContext,
      lastPlace: existingState.lastPlace,
      destination: existingState.destination,
    };

    const intentResult = detectIntent(
      rawQuery,
      contextForResolution
    );

    const entities = extractEntities(
      rawQuery,
      contextForResolution
    );

    /**
     * Different versions of EntityResult may expose different
     * fields. Keep the existing architecture compatible while
     * the canonical type is improved later.
     */
    const entityData = entities as any;

    entityData.query_focus = rawQuery;

    /**
     * ============================================================
     * 2. STATEFUL CONVERSATION MEMORY
     * ============================================================
     */

    const tripState = updateConversationState(
      sessionId,
      entities,
      intentResult.intent
    );

    /**
     * If intent/entity resolution found a real place,
     * persist it as active context.
     */
    if (intentResult.resolvedPlace) {
      tripState.lastPlace = intentResult.resolvedPlace;
      tripState.lastPlaceId = intentResult.resolvedPlace.id;

      if (intentResult.resolvedPlace.city) {
        tripState.destination =
          intentResult.resolvedPlace.city;

        liveContext.selectedCity =
          intentResult.resolvedPlace.city;
      }
    }

    /**
     * Preserve destination in live context when known.
     */
    if (
      tripState.destination &&
      !liveContext.selectedCity
    ) {
      liveContext.selectedCity = tripState.destination;
    }

    /**
     * Preserve origin as user location only when no
     * location city already exists.
     */
    if (
      tripState.origin &&
      !liveContext.userLocation.city
    ) {
      liveContext.userLocation.city =
        tripState.origin;
    }

    /**
     * ============================================================
     * 3. COMMON RESPONSE STATE
     * ============================================================
     */

    const executedToolCalls: Array<{
      tool: string;
      args: any;
      result: any;
    }> = [];

    let replyText = '';
    let usedEngine = 'Virasat Grounded Assistant';
    let generatedPlan: any = null;
    let dynamicQuickActions: string[] = [];
    let sourceList: string[] | undefined = undefined;

    /**
     * ============================================================
     * 4. FACTUAL INTENT CLASSIFICATION
     * ============================================================
     *
     * These intents must be grounded in structured tourism data
     * before any generative response is accepted.
     */
    const factualIntents = [
      'MONUMENT_INFO',
      'HERITAGE_QUERY',
      'STATE_INFO',
      'UT_INFO',
      'NEARBY_SEARCH',
      'HOTEL_SEARCH',
      'HOTEL_COMPARISON',
      'FOOD_SEARCH',
      'RESTAURANT_SEARCH',
      'MARKET_SEARCH',
      'SHOPPING_SEARCH',
      'TRANSPORT_SEARCH',
      'TRAIN_SEARCH',
      'FLIGHT_SEARCH',
      'WEATHER_QUERY',
      'FESTIVAL_QUERY',
    ];

    const isFactualIntent = factualIntents.includes(
      intentResult.intent
    );

    const ai = getAIClient();

    /**
     * ============================================================
     * 5. GEMINI
     * ============================================================
     *
     * Gemini is intentionally skipped for deterministic factual
     * tourism intents.
     *
     * It remains available for:
     * - greetings
     * - casual conversation
     * - about Virasat
     * - general help
     * - reasoning
     * - trip planning
     * - conversational follow-ups
     */
    if (ai && !isFactualIntent) {
      try {
        const memoryStr = `ACTIVE TRIP MEMORY:
Destination: ${tripState.destination || 'Not chosen yet'}
Origin: ${tripState.origin || 'Not specified'}
Duration: ${tripState.duration_days
            ? `${tripState.duration_days} Days`
            : 'Not specified'
          }
Budget: ${tripState.budget
            ? `₹${tripState.budget}`
            : 'Flexible'
          }
Travel Style: ${tripState.travel_style || 'Moderate'
          }
Hotel Tier: ${tripState.hotel_tier || 'Moderate'
          }
Interests: ${tripState.interests?.join(', ') ||
          'General Sightseeing'
          }`;

        const contextSummary =
          `${formatContextForPrompt(liveContext)}\n\n${memoryStr}`;

        const systemInstruction =
          `${VIRASAT_SYSTEM_PROMPT}\n\n${contextSummary}`;

        const geminiTools =
          getGeminiToolDeclarations();

        const contents: any[] = [
          ...(Array.isArray(history)
            ? history.slice(-6).map((h: any) => ({
              role:
                h.role === 'user'
                  ? 'user'
                  : 'model',
              parts: [
                {
                  text:
                    h.content ||
                    h.text ||
                    '',
                },
              ],
            }))
            : []),
          {
            role: 'user',
            parts: [
              {
                text: rawQuery,
              },
            ],
          },
        ];

        const modelNames = [
          'gemini-2.5-flash',
          'gemini-2.0-flash',
        ];

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
              new Promise<any>((_, reject) =>
                setTimeout(
                  () =>
                    reject(
                      new Error('Timeout')
                    ),
                  6500
                )
              ),
            ]);

            const functionCalls =
              (response as any)?.functionCalls ||
              [];

            if (functionCalls.length > 0) {
              const toolResultsParts: any[] = [];

              for (const call of functionCalls) {
                const toolResult =
                  await executeTool(
                    call.name,
                    call.args,
                    liveContext
                  );

                executedToolCalls.push({
                  tool: call.name,
                  args: call.args,
                  result: toolResult,
                });

                toolResultsParts.push({
                  functionResponse: {
                    name: call.name,
                    response: {
                      result: toolResult,
                    },
                  },
                });
              }

              contents.push(
                response.candidates?.[0]
                  ?.content
              );

              contents.push({
                role: 'user',
                parts: toolResultsParts,
              });

              const secondResponse =
                await Promise.race([
                  ai.models.generateContent({
                    model: mName,
                    contents,
                    config: {
                      systemInstruction,
                    },
                  }),
                  new Promise<any>((_, reject) =>
                    setTimeout(
                      () =>
                        reject(
                          new Error(
                            'Timeout'
                          )
                        ),
                      5500
                    )
                  ),
                ]);

              if (secondResponse?.text) {
                replyText =
                  secondResponse.text;

                usedEngine =
                  `${mName} (Tool-Grounded)`;

                break;
              }
            } else if (response?.text) {
              replyText = response.text;
              usedEngine = mName;
              break;
            }
          } catch (err) {
            console.warn(
              `[AI Router] ${mName} failed:`,
              err
            );
          }
        }
      } catch (err) {
        console.warn(
          '[AI Router] Gemini inference exception:',
          err
        );
      }
    }

    /**
     * ============================================================
     * 6. DETERMINISTIC VIRASAT BRAIN
     * ============================================================
     *
     * This section handles factual tourism queries and acts as
     * the reliable fallback for all intents.
     */
    if (!replyText) {
      const intent = intentResult.intent;

      /**
       * ----------------------------------------------------------
       * SOCIAL / CONVERSATIONAL
       * ----------------------------------------------------------
       */
      if (
        intent === 'GREETING' ||
        intent === 'CASUAL_CONVERSATION' ||
        intent === 'ABOUT_VIRASAT' ||
        intent === 'HELP' ||
        intent === 'FAREWELL' ||
        intent === 'THANKS' ||
        intent === 'COMPARISON'
      ) {
        const formatted =
          buildResponseForIntent(
            intentResult,
            tripState
          );

        replyText = formatted.reply;
        dynamicQuickActions =
          formatted.suggested_actions;
        sourceList = formatted.sources;
      }

      /**
       * ----------------------------------------------------------
       * MONUMENT / HERITAGE
       * ----------------------------------------------------------
       */
      else if (
        intent === 'MONUMENT_INFO' ||
        intent === 'HERITAGE_QUERY'
      ) {
        const place =
          intentResult.resolvedPlace ||
          tripState.lastPlace;

        /**
         * Use the response generator for natural wording,
         * but only expose the resolved place if it actually
         * exists.
         */
        const formatted =
          buildResponseForIntent(
            intentResult,
            tripState
          );

        replyText = formatted.reply;
        dynamicQuickActions =
          formatted.suggested_actions;
        sourceList = formatted.sources;

        if (place) {
          executedToolCalls.push({
            tool: 'searchTouristPlaces',
            args: {
              query: place.name,
              city: place.city,
            },
            result: {
              results: [
                {
                  id: place.id,
                  name: place.name,
                  city: place.city,
                  state: place.state,
                  category: place.category,
                  summary: place.summary,
                  timings:
                    place.visiting_hours,
                  entry_fee:
                    place.entry_fee,
                  official_source:
                    (place as any)
                      .official_source,
                },
              ],
            },
          });
        }
      }

      /**
       * ----------------------------------------------------------
       * NEARBY SEARCH
       * ----------------------------------------------------------
       */
      else if (intent === 'NEARBY_SEARCH') {
        /**
         * Explicit current entity gets highest priority.
         */
        const currentPlace =
          intentResult.resolvedPlace ||
          null;

        const explicitCity =
          entityData.city ||
          null;

        const city =
          currentPlace?.city ||
          explicitCity ||
          tripState.destination ||
          liveContext.selectedCity ||
          tripState.lastPlace?.city;

        if (!city) {
          replyText =
            intentResult.isHinglish
              ? 'Aap kis city ya destination ke paas search karna chahte hain?'
              : 'Which city or destination should I search near?';

          dynamicQuickActions = [
            'Explore Near Me',
            'Choose a Destination',
            'Plan a Trip',
          ];
        } else {
          const placesRes =
            await executeTool(
              'searchTouristPlaces',
              {
                city,
                limit: 4,
              },
              liveContext
            );

          executedToolCalls.push({
            tool: 'searchTouristPlaces',
            args: { city },
            result: placesRes,
          });

          if (
            placesRes.results &&
            placesRes.results.length > 0
          ) {
            replyText =
              intentResult.isHinglish
                ? `📍 **${city} ke aas-paas explore karne ke liye:**\n\n` +
                placesRes.results
                  .map(
                    (
                      p: any,
                      idx: number
                    ) =>
                      `${idx + 1}. 🏛️ **${p.name}** (${p.city}, ${p.state})\n   ${p.summary || ''}`
                  )
                  .join('\n\n')
                : `📍 **Places to explore near ${city}:**\n\n` +
                placesRes.results
                  .map(
                    (
                      p: any,
                      idx: number
                    ) =>
                      `${idx + 1}. 🏛️ **${p.name}** (${p.city}, ${p.state})\n   ${p.summary || ''}`
                  )
                  .join('\n\n');

            sourceList = [
              'Virasat Master Tourism Registry',
            ];
          } else {
            replyText =
              intentResult.isHinglish
                ? `${city} ke liye mujhe abhi nearby tourism records nahi mile.`
                : `I couldn't find reliable nearby tourism records for ${city}.`;

            sourceList = [
              'Virasat Master Tourism Registry',
            ];
          }

          dynamicQuickActions = [
            `Plan ${city} Trip`,
            'Find Hotels Nearby',
            'Find Food Nearby',
            'How to Reach',
          ];
        }
      }

      /**
       * ----------------------------------------------------------
       * STATE / UT INFORMATION
       * ----------------------------------------------------------
       */
      else if (
        intent === 'STATE_INFO' ||
        intent === 'UT_INFO'
      ) {
        const stateName =
          entityData.state ||
          entityData.union_territory ||
          null;

        if (!stateName) {
          replyText =
            intentResult.isHinglish
              ? 'Kaunsi state ya Union Territory ke baare mein jaanna chahte hain?'
              : 'Which state or Union Territory would you like to explore?';

          dynamicQuickActions = [
            'Explore a City',
            'Explore Heritage',
            'Plan a Trip',
          ];
        } else {
          const placesRes =
            await executeTool(
              'searchTouristPlaces',
              {
                state: stateName,
                limit: 6,
              },
              liveContext
            );

          executedToolCalls.push({
            tool: 'searchTouristPlaces',
            args: {
              state: stateName,
            },
            result: placesRes,
          });

          if (
            placesRes.results &&
            placesRes.results.length > 0
          ) {
            replyText =
              intentResult.isHinglish
                ? `### 🏛️ ${stateName} Tourism\n\nVirasat ke available tourism data ke basis par:\n\n` +
                placesRes.results
                  .map(
                    (
                      p: any,
                      idx: number
                    ) =>
                      `${idx + 1}. **${p.name}** — ${p.city}, ${p.state}\n   ${p.summary || ''}`
                  )
                  .join('\n\n') +
                `\n\nAap kisi specific city, monument ya itinerary ke baare mein pooch sakte hain.`
                : `### 🏛️ Tourism in ${stateName}\n\nBased on Virasat's available tourism data:\n\n` +
                placesRes.results
                  .map(
                    (
                      p: any,
                      idx: number
                    ) =>
                      `${idx + 1}. **${p.name}** — ${p.city}, ${p.state}\n   ${p.summary || ''}`
                  )
                  .join('\n\n') +
                `\n\nYou can ask about a specific city, monument, or itinerary.`;

            sourceList = [
              'Virasat Master Tourism Registry',
            ];
          } else {
            replyText =
              intentResult.isHinglish
                ? `${stateName} ke liye mujhe abhi reliable tourism records nahi mile.`
                : `I couldn't find reliable tourism records for ${stateName}.`;

            sourceList = [
              'Virasat Master Tourism Registry',
            ];
          }

          dynamicQuickActions = [
            `Plan ${stateName} Trip`,
            'Explore Heritage',
            'Find Stays',
            'How to Reach',
          ];
        }
      }

      /**
       * ----------------------------------------------------------
       * YOU DECIDE
       * ----------------------------------------------------------
       */
      else if (intent === 'YOU_DECIDE') {
        const formatted =
          buildResponseForIntent(
            intentResult,
            tripState
          );

        replyText = formatted.reply;
        dynamicQuickActions =
          formatted.suggested_actions;
        sourceList = formatted.sources;
      }

      /**
       * ----------------------------------------------------------
       * TRIP PLANNING
       * ----------------------------------------------------------
       */
      else if (
        intent === 'TRIP_PLANNING' ||
        intent === 'ITINERARY_MODIFICATION'
      ) {
        generatedPlan =
          generateSmartItinerary(
            tripState
          );

        tripState.lastItinerary =
          generatedPlan;

        const city =
          entityData.city ||
          tripState.destination ||
          liveContext.selectedCity;

        /**
         * Only search attractions when destination exists.
         */
        if (city) {
          const placesRes =
            await executeTool(
              'searchTouristPlaces',
              {
                city,
                limit: 4,
              },
              liveContext
            );

          executedToolCalls.push({
            tool: 'searchTouristPlaces',
            args: { city },
            result: placesRes,
          });
        }

        /**
         * Transport is only requested when BOTH endpoints exist.
         */
        if (
          tripState.origin &&
          city
        ) {
          const transRes =
            await executeTool(
              'getTransportOptions',
              {
                origin:
                  tripState.origin,
                destination: city,
              },
              liveContext
            );

          executedToolCalls.push({
            tool: 'getTransportOptions',
            args: {
              origin:
                tripState.origin,
              destination: city,
            },
            result: transRes,
          });
        }

        const formatted =
          buildResponseForIntent(
            intentResult,
            tripState,
            generatedPlan
          );

        replyText = formatted.reply;
        dynamicQuickActions =
          formatted.suggested_actions;
        sourceList = formatted.sources;
      }

      /**
       * ----------------------------------------------------------
       * HOTELS
       * ----------------------------------------------------------
       */
      else if (
        intent === 'HOTEL_SEARCH' ||
        intent === 'HOTEL_COMPARISON'
      ) {
        const explicitCity =
          entityData.city ||
          null;

        const currentPlace =
          intentResult.resolvedPlace ||
          null;

        const city =
          currentPlace?.city ||
          explicitCity ||
          tripState.destination ||
          liveContext.selectedCity ||
          tripState.lastPlace?.city;

        if (!city) {
          replyText =
            intentResult.isHinglish
              ? 'Hotel search ke liye city ya destination batao.'
              : 'Please specify the city or destination for the hotel search.';

          dynamicQuickActions = [
            'Find Hotels in Mumbai',
            'Find Hotels in Jaipur',
            'Find Hotels in Delhi',
          ];
        } else {
          const placeId =
            currentPlace?.id ||
            tripState.lastPlace?.id;

          const hotelRes =
            await executeTool(
              'searchHotels',
              {
                city,
                place_id: placeId,
                category:
                  tripState.hotel_tier,
                limit: 4,
              },
              liveContext
            );

          executedToolCalls.push({
            tool: 'searchHotels',
            args: {
              city,
              place_id: placeId,
            },
            result: hotelRes,
          });

          if (
            hotelRes.hotels &&
            hotelRes.hotels.length > 0
          ) {
            const placePrefix =
              currentPlace ||
                tripState.lastPlace
                ? `near **${currentPlace?.name ||
                tripState.lastPlace?.name
                }** in `
                : 'in ';

            replyText =
              intentResult.isHinglish
                ? `🏨 ${placePrefix}**${city}** ke available hotel options:\n\n` +
                hotelRes.hotels
                  .map(
                    (h: any) =>
                      `🏨 **${h.name}**\n   • Category: ${h.category || 'Not specified'}\n   • Rate: ${h.price || 'Not provided'}\n   • Rating: ${h.rating ??
                      'Not provided'
                      }\n   • Location: ${h.location ||
                      'Not provided'
                      }`
                  )
                  .join('\n\n')
                : `🏨 Available hotel options ${placePrefix}**${city}**:\n\n` +
                hotelRes.hotels
                  .map(
                    (h: any) =>
                      `🏨 **${h.name}**\n   • Category: ${h.category || 'Not specified'}\n   • Rate: ${h.price || 'Not provided'}\n   • Rating: ${h.rating ??
                      'Not provided'
                      }\n   • Location: ${h.location ||
                      'Not provided'
                      }`
                  )
                  .join('\n\n');

            sourceList = [
              'Virasat Hotel Registry',
            ];
          } else {
            replyText =
              intentResult.isHinglish
                ? `${city} ke liye mujhe abhi reliable hotel listings nahi mili. Main bina verified data ke price ya availability assume nahi karunga.`
                : `I couldn't find reliable hotel listings for ${city}. I won't assume prices or availability without verified data.`;

            sourceList = [
              'Virasat Hotel Registry',
            ];
          }

          dynamicQuickActions = [
            'Compare Stays',
            'Budget Hotels',
            'Premium Hotels',
            `Plan ${city} Trip`,
          ];
        }
      }

      /**
       * ----------------------------------------------------------
       * FOOD / RESTAURANTS
       * ----------------------------------------------------------
       */
      else if (
        intent === 'FOOD_SEARCH' ||
        intent === 'RESTAURANT_SEARCH'
      ) {
        const explicitCity =
          entityData.city ||
          null;

        const currentPlace =
          intentResult.resolvedPlace ||
          null;

        const city =
          currentPlace?.city ||
          explicitCity ||
          tripState.destination ||
          liveContext.selectedCity ||
          tripState.lastPlace?.city;

        if (!city) {
          replyText =
            intentResult.isHinglish
              ? 'Food ya restaurant search ke liye city ya destination batao.'
              : 'Please specify the city or destination for the food search.';

          dynamicQuickActions = [
            'Find Food in Mumbai',
            'Find Food in Jaipur',
            'Find Food in Delhi',
          ];
        } else {
          const foodRes =
            await executeTool(
              'searchRestaurants',
              {
                city,
                limit: 4,
              },
              liveContext
            );

          executedToolCalls.push({
            tool: 'searchRestaurants',
            args: { city },
            result: foodRes,
          });

          if (
            foodRes.recommendations &&
            foodRes.recommendations.length > 0
          ) {
            replyText =
              intentResult.isHinglish
                ? `🍽️ **${city} ke food options:**\n\n` +
                foodRes.recommendations
                  .map(
                    (r: any) =>
                      `🥘 **${r.name}**\n   • ${r.description ||
                      ''
                      }\n   • ${r.popular_locations?.join(
                        ', '
                      ) ||
                      ''
                      }`
                  )
                  .join('\n\n')
                : `🍽️ **Food options in ${city}:**\n\n` +
                foodRes.recommendations
                  .map(
                    (r: any) =>
                      `🥘 **${r.name}**\n   • ${r.description ||
                      ''
                      }\n   • ${r.popular_locations?.join(
                        ', '
                      ) ||
                      ''
                      }`
                  )
                  .join('\n\n');

            sourceList = [
              'Virasat Culinary Guide',
            ];
          } else {
            replyText =
              intentResult.isHinglish
                ? `${city} ke liye mujhe abhi reliable restaurant/food records nahi mile.`
                : `I couldn't find reliable restaurant or food records for ${city}.`;

            sourceList = [
              'Virasat Culinary Guide',
            ];
          }

          dynamicQuickActions = [
            'Nearby Monuments',
            'Traditional Markets',
            'Find Stays',
            'How to Reach',
          ];
        }
      }

      /**
       * ----------------------------------------------------------
       * TRANSPORT / TRAIN / FLIGHT
       * ----------------------------------------------------------
       */
      else if (
        intent === 'TRAIN_SEARCH' ||
        intent === 'FLIGHT_SEARCH' ||
        intent === 'TRANSPORT_SEARCH'
      ) {
        /**
         * IMPORTANT:
         * Current explicit entities override old memory.
         */
        const origin =
          entityData.origin ||
          tripState.origin ||
          null;

        const destination =
          entityData.destination ||
          entityData.city ||
          tripState.destination ||
          null;

        /**
         * Never invent an origin/destination.
         */
        if (!origin || !destination) {
          replyText =
            intentResult.isHinglish
              ? 'Route batane ke liye mujhe origin aur destination dono chahiye. Example: Mumbai se Srinagar.'
              : 'I need both the origin and destination to calculate the route. Example: Mumbai to Srinagar.';

          dynamicQuickActions = [
            'Mumbai to Delhi',
            'Mumbai to Srinagar',
            'Delhi to Jaipur',
          ];
        } else {
          /**
           * EXACT origin → destination order.
           */
          const transRes =
            await executeTool(
              'getTransportOptions',
              {
                origin,
                destination,
              },
              liveContext
            );

          executedToolCalls.push({
            tool: 'getTransportOptions',
            args: {
              origin,
              destination,
            },
            result: transRes,
          });

          const opt =
            transRes.transit_options ||
            {};

          const trainMsg =
            opt.train?.available
              ? `🚆 **Train:** ${opt.train.summary
              }${opt.train.approx_duration
                ? ` (${opt.train.approx_duration})`
                : ''
              }`
              : '';

          const airMsg =
            opt.air?.available
              ? `✈️ **Flight:** ${opt.air.summary
              }${opt.air.approx_duration
                ? ` (${opt.air.approx_duration})`
                : ''
              }`
              : '';

          const roadMsg =
            opt.road?.available
              ? `🚗 **Road:** ${opt.road.summary
              }${opt.road.approx_duration
                ? ` (${opt.road.approx_duration})`
                : ''
              }`
              : '';

          const optionsText = [
            trainMsg,
            airMsg,
            roadMsg,
          ]
            .filter(Boolean)
            .join('\n\n');

          replyText =
            intentResult.isHinglish
              ? `🚆 **${transRes.origin} → ${transRes.destination}**\n\n${transRes.straight_line_km
                ? `Approx. straight-line distance: ${transRes.straight_line_km} km\n\n`
                : ''
              }${optionsText ||
              'Mujhe is route ke liye abhi reliable transport options nahi mile.'
              }`
              : `🚆 **${transRes.origin} → ${transRes.destination}**\n\n${transRes.straight_line_km
                ? `Approx. straight-line distance: ${transRes.straight_line_km} km\n\n`
                : ''
              }${optionsText ||
              'I could not find reliable transport options for this route.'
              }`;

          sourceList = [
            'Virasat Transport Intelligence',
          ];

          dynamicQuickActions = [
            `Find Hotels in ${destination}`,
            `Plan ${destination} Trip`,
            'Estimated Budget',
            `Top Sights in ${destination}`,
          ];
        }
      }

      /**
       * ----------------------------------------------------------
       * WEATHER
       * ----------------------------------------------------------
       */
      else if (intent === 'WEATHER_QUERY') {
        const city =
          entityData.city ||
          tripState.destination ||
          liveContext.selectedCity ||
          null;

        if (!city) {
          replyText =
            intentResult.isHinglish
              ? 'Weather check karne ke liye city ya destination batao.'
              : 'Which city or destination should I check the weather for?';

          dynamicQuickActions = [
            'Mumbai Weather',
            'Delhi Weather',
            'Jaipur Weather',
          ];
        } else {
          const weatherRes =
            await executeTool(
              'getWeather',
              { city },
              liveContext
            );

          executedToolCalls.push({
            tool: 'getWeather',
            args: { city },
            result: weatherRes,
          });

          replyText =
            intentResult.isHinglish
              ? `🌤️ **${weatherRes.city} ka Mausam**\n\n` +
              `• **Temperature:** ${weatherRes.temperature_range}\n` +
              `• **Conditions:** ${weatherRes.condition}\n` +
              `• **Best Time:** ${weatherRes.best_time_to_visit}\n` +
              `• **Travel Advisory:** ${weatherRes.travel_advisory}`
              : `🌤️ **Weather for ${weatherRes.city}**\n\n` +
              `• **Temperature:** ${weatherRes.temperature_range}\n` +
              `• **Conditions:** ${weatherRes.condition}\n` +
              `• **Best Time:** ${weatherRes.best_time_to_visit}\n` +
              `• **Travel Advisory:** ${weatherRes.travel_advisory}`;

          dynamicQuickActions = [
            'Best Season to Visit',
            `Plan ${city} Trip`,
            'Find Stays',
          ];

          sourceList = [
            'Virasat Weather Intelligence',
          ];
        }
      }

      /**
       * ----------------------------------------------------------
       * BUDGET
       * ----------------------------------------------------------
       */
      else if (intent === 'BUDGET_PLANNING') {
        const destination =
          entityData.destination ||
          entityData.city ||
          tripState.destination ||
          null;

        if (!destination) {
          replyText =
            intentResult.isHinglish
              ? 'Budget estimate ke liye destination batao.'
              : 'Which destination should I estimate the budget for?';

          dynamicQuickActions = [
            'Budget for Jaipur',
            'Budget for Goa',
            'Budget for Kerala',
          ];
        } else {
          const budgetRes =
            await executeTool(
              'estimateBudget',
              {
                destination,
                duration_days:
                  tripState.duration_days ||
                  3,
                travel_style:
                  tripState.travel_style,
              },
              liveContext
            );

          executedToolCalls.push({
            tool: 'estimateBudget',
            args: {
              destination,
            },
            result: budgetRes,
          });

          replyText =
            intentResult.isHinglish
              ? `💰 **${budgetRes.destination} ka Estimated Trip Budget** (${budgetRes.duration}, ${budgetRes.party_size}):\n\n` +
              `• **Hotel/Stay:** ${budgetRes.breakdown_inr.accommodation}\n` +
              `• **Khana/Dining:** ${budgetRes.breakdown_inr.food_dining}\n` +
              `• **Local Transit:** ${budgetRes.breakdown_inr.local_transit}\n` +
              `• **Monument Tickets:** ${budgetRes.breakdown_inr.monument_tickets}\n\n` +
              `**Total Estimated Cost:** ${budgetRes.total_estimated_budget}\n` +
              `(~${budgetRes.estimated_per_person} per person)`
              : `💰 **Estimated Trip Budget for ${budgetRes.destination}** (${budgetRes.duration}, ${budgetRes.party_size}):\n\n` +
              `• **Accommodation:** ${budgetRes.breakdown_inr.accommodation}\n` +
              `• **Meals & Dining:** ${budgetRes.breakdown_inr.food_dining}\n` +
              `• **Local Transit:** ${budgetRes.breakdown_inr.local_transit}\n` +
              `• **Monument Tickets:** ${budgetRes.breakdown_inr.monument_tickets}\n\n` +
              `**Total Estimated Cost:** ${budgetRes.total_estimated_budget}\n` +
              `(~${budgetRes.estimated_per_person} per person)`;

          dynamicQuickActions = [
            'Itemized Breakdown',
            'Cost-Saving Tips',
            'Find Budget Stays',
            'Check Transport',
          ];

          sourceList = [
            'Virasat Tariff Calculator',
          ];
        }
      }

      /**
       * ----------------------------------------------------------
       * EMERGENCY
       * ----------------------------------------------------------
       */
      else if (intent === 'EMERGENCY_QUERY') {
        replyText =
          intentResult.isHinglish
            ? `🚨 **Important Emergency & Travel Helplines**\n\n` +
            `• **National Emergency:** 112\n` +
            `• **Tourist Helpline:** 1363\n` +
            `• **Ambulance:** 108\n` +
            `• **Railway Assistance:** 139`
            : `🚨 **Important Emergency & Travel Helplines**\n\n` +
            `• **National Emergency:** 112\n` +
            `• **Tourist Helpline:** 1363\n` +
            `• **Ambulance:** 108\n` +
            `• **Railway Assistance:** 139`;

        dynamicQuickActions = [
          'Tourist Helpline',
          'Medical Help',
          'Railway Help',
        ];
      }

      /**
       * ----------------------------------------------------------
       * FESTIVAL
       * ----------------------------------------------------------
       */
      else if (
        (intent as string) === 'FESTIVAL_QUERY'
      ) {
        const city =
          entityData.city ||
          intentResult.resolvedPlace?.city ||
          tripState.destination ||
          liveContext.selectedCity ||
          null;

        if (!city) {
          replyText =
            intentResult.isHinglish
              ? 'Festival information ke liye city ya state batao.'
              : 'Which city or state should I check festivals for?';

          dynamicQuickActions = [
            'Festivals in Rajasthan',
            'Festivals in Kerala',
            'Festivals in Bihar',
          ];
        } else {
          const eventsRes =
            await executeTool(
              'getEventsCalendar',
              { city },
              liveContext
            );

          executedToolCalls.push({
            tool: 'getEventsCalendar',
            args: { city },
            result: eventsRes,
          });

          if (
            eventsRes.events &&
            eventsRes.events.length > 0
          ) {
            replyText =
              intentResult.isHinglish
                ? `🗓️ **${city} ke Festivals & Cultural Events**\n\n` +
                eventsRes.events
                  .map(
                    (e: any) =>
                      `🎉 **${e.festival}** (${e.location})\n   • Timing: ${e.season_timing}\n   • Significance: ${e.cultural_significance}`
                  )
                  .join('\n\n')
                : `🗓️ **Festivals & Cultural Events in ${city}**\n\n` +
                eventsRes.events
                  .map(
                    (e: any) =>
                      `🎉 **${e.festival}** (${e.location})\n   • Timing: ${e.season_timing}\n   • Significance: ${e.cultural_significance}`
                  )
                  .join('\n\n');

            sourceList = [
              'Virasat Cultural Events Registry',
            ];
          } else {
            replyText =
              intentResult.isHinglish
                ? `${city} ke liye mujhe abhi reliable festival records nahi mile.`
                : `I couldn't find reliable festival records for ${city}.`;
          }

          dynamicQuickActions = [
            'Nearby Stays',
            'Heritage Places',
            'Plan Trip',
          ];
        }
      }

      /**
       * ----------------------------------------------------------
       * MARKETS / SHOPPING
       * ----------------------------------------------------------
       */
      else if (
        intent === 'SHOPPING_SEARCH' ||
        intent === 'MARKET_SEARCH'
      ) {
        const city =
          entityData.city ||
          tripState.destination ||
          liveContext.selectedCity ||
          tripState.lastPlace?.city ||
          null;

        if (!city) {
          replyText =
            intentResult.isHinglish
              ? 'Market search ke liye city ya destination batao.'
              : 'Which city or destination should I search markets in?';

          dynamicQuickActions = [
            'Markets in Jaipur',
            'Markets in Delhi',
            'Markets in Mumbai',
          ];
        } else {
          const marketRes =
            await executeTool(
              'searchMarkets',
              { city },
              liveContext
            );

          executedToolCalls.push({
            tool: 'searchMarkets',
            args: { city },
            result: marketRes,
          });

          const studios =
            marketRes.artisan_studios ||
            [];

          if (studios.length > 0) {
            replyText =
              intentResult.isHinglish
                ? `🛍️ **${city} ke Markets & Crafts**\n\n` +
                studios
                  .map(
                    (a: any) =>
                      `✨ **${a.name}**\n   • Craft: ${a.craft}\n   • ${a.story || ''}\n   • Price: ${a.price_range || 'Not provided'}`
                  )
                  .join('\n\n')
                : `🛍️ **Markets & Crafts in ${city}**\n\n` +
                studios
                  .map(
                    (a: any) =>
                      `✨ **${a.name}**\n   • Craft: ${a.craft}\n   • ${a.story || ''}\n   • Price: ${a.price_range || 'Not provided'}`
                  )
                  .join('\n\n');

            sourceList = [
              'Virasat Market & Craft Registry',
            ];
          } else {
            replyText =
              intentResult.isHinglish
                ? `${city} ke liye mujhe abhi reliable market records nahi mile.`
                : `I couldn't find reliable market records for ${city}.`;
          }

          dynamicQuickActions = [
            'Famous Bazaars',
            'GI Crafts Info',
            'Nearby Monuments',
            'Find Stays',
          ];
        }
      }

      /**
       * ----------------------------------------------------------
       * DEFAULT TOURISM SEARCH
       * ----------------------------------------------------------
       *
       * No fake city fallback.
       */
      else {
        const city =
          entityData.city ||
          intentResult.resolvedPlace?.city ||
          tripState.destination ||
          liveContext.selectedCity ||
          null;

        const queryToSearch =
          entityData.place?.name ||
          entityData.place_name ||
          entityData.city ||
          entityData.state ||
          rawQuery
            .replace(
              /ke baare mein batao|k baare mein batao|ke baare me batao|k baare me batao|tell me about|places to visit in|best places in/gi,
              ''
            )
            .trim();

        const placesRes =
          await executeTool(
            'searchTouristPlaces',
            {
              query:
                queryToSearch || undefined,
              city:
                city || undefined,
              limit: 4,
            },
            liveContext
          );

        executedToolCalls.push({
          tool: 'searchTouristPlaces',
          args: {
            query: queryToSearch,
            city,
          },
          result: placesRes,
        });

        if (
          placesRes.results &&
          placesRes.results.length > 0
        ) {
          replyText =
            intentResult.isHinglish
              ? `📍 **Virasat tourism data ke basis par:**\n\n` +
              placesRes.results
                .map(
                  (
                    p: any,
                    idx: number
                  ) =>
                    `${idx + 1}. 🏛️ **${p.name}** (${p.city}, ${p.state})\n   ${p.summary || ''}`
                )
                .join('\n\n')
              : `📍 **Relevant places from Virasat's tourism data:**\n\n` +
              placesRes.results
                .map(
                  (
                    p: any,
                    idx: number
                  ) =>
                    `${idx + 1}. 🏛️ **${p.name}** (${p.city}, ${p.state})\n   ${p.summary || ''}`
                )
                .join('\n\n');

          sourceList = [
            'Virasat Master Tourism Registry',
          ];
        } else {
          const activeName =
            tripState.lastPlace?.name ||
            tripState.destination ||
            city;

          replyText =
            activeName
              ? intentResult.isHinglish
                ? `Mujhe **${activeName}** ke liye is query par reliable tourism record nahi mila, isliye main guess nahi karunga.`
                : `I couldn't find reliable tourism data for **${activeName}** for this query, so I won't guess.`
              : intentResult.isHinglish
                ? 'Mujhe is query ke liye reliable tourism record nahi mila. Aap city, state, monument ya destination ka naam bata sakte hain.'
                : 'I could not find reliable tourism data for this query. You can specify a city, state, monument, or destination.';

          sourceList = [
            'Virasat Master Tourism Registry',
          ];
        }

        dynamicQuickActions = [
          'Plan a Trip',
          'Explore Near Me',
          'Explore Heritage',
          'Find Hotels',
        ];
      }
    }

    /**
     * ============================================================
     * 7. STRUCTURED FRONTEND CARDS
     * ============================================================
     */

    let suggestedPlaces: any[] = [];

    const placeCall =
      executedToolCalls.find(
        (t) =>
          t.tool ===
          'searchTouristPlaces'
      );

    if (
      placeCall &&
      Array.isArray(
        placeCall.result?.results
      )
    ) {
      suggestedPlaces =
        placeCall.result.results
          .slice(0, 4)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            city: p.city,
            state: p.state,
            category: p.category,
            reason: p.summary,
            data_confidence:
              p.official_source
                ? 'official'
                : 'database',
            source_url:
              p.official_source ||
              undefined,
          }));
    }

    /**
     * ============================================================
     * 8. TRANSPORT COMPARISON CARD
     * ============================================================
     */

    let transitComparison: any =
      null;

    const transCall =
      executedToolCalls.find(
        (t) =>
          t.tool ===
          'getTransportOptions'
      );

    if (
      transCall &&
      transCall.result
    ) {
      const opt =
        transCall.result
          .transit_options || {};

      transitComparison = {
        origin:
          transCall.result.origin,
        destination:
          transCall.result.destination,
        distance_km:
          transCall.result
            .straight_line_km,

        train:
          opt.train?.available
            ? {
              summary:
                opt.train.summary,
              approx_duration:
                opt.train
                  .approx_duration,
              stations:
                opt.train.stations,
              notes:
                opt.train.notes,
            }
            : undefined,

        air:
          opt.air?.available
            ? {
              summary:
                opt.air.summary,
              approx_duration:
                opt.air
                  .approx_duration,
              notes:
                opt.air.notes,
            }
            : undefined,

        road:
          opt.road?.available
            ? {
              summary:
                opt.road.summary,
              approx_duration:
                opt.road
                  .approx_duration,
              notes:
                opt.road.notes,
            }
            : undefined,
      };
    }

    /**
     * ============================================================
     * 9. FINAL QUICK ACTION FALLBACK
     * ============================================================
     */

    if (
      dynamicQuickActions.length ===
      0
    ) {
      dynamicQuickActions = [
        'Plan a Trip',
        'Explore Near Me',
        'Explore Heritage',
        'Find Hotels',
      ];
    }

    /**
     * ============================================================
     * 10. FINAL API RESPONSE
     * ============================================================
     */

    res.json({
      success: true,

      conversation_id: sessionId,
      session_id: sessionId,

      reply: replyText,

      engine: usedEngine,
      model_used: usedEngine,

      suggested_places:
        suggestedPlaces.length > 0
          ? suggestedPlaces
          : undefined,

      transit_comparison:
        transitComparison ||
        undefined,

      suggested_actions:
        dynamicQuickActions,

      sources:
        sourceList ||
        (executedToolCalls.length > 0
          ? [
            'Virasat Master Tourism Registry',
          ]
          : undefined),

      tool_calls:
        executedToolCalls,

      latency_ms:
        Date.now() - startTime,

      context: {
        route:
          liveContext.currentRoute,

        city:
          tripState.destination ||
          liveContext.selectedCity,

        place_id:
          tripState.lastPlaceId ||
          liveContext.selectedPlaceId,

        memory: {
          origin:
            tripState.origin,

          destination:
            tripState.destination,

          duration_days:
            tripState.duration_days,

          budget:
            tripState.budget,

          hotel_tier:
            tripState.hotel_tier,
        },
      },
    });
  }
);