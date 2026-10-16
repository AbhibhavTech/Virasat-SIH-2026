import { Router, Request, Response } from 'express';
import { rateLimiter } from '../../server/src/middleware/rateLimiter';
import {
  buildContextPayload,
} from '../context/buildContextPayload';
import {
  toolRegistry,
  executeTool,
  getAllToolNames,
} from '../config/toolRegistry';
import { detectIntent } from '../engine/intentEngine';
import {
  extractEntities,
  INDIAN_DESTINATION_ALIASES,
} from '../engine/entityExtractor';
import {
  getConversationState,
  updateConversationState,
} from '../engine/conversationMemory';
import { generateSmartItinerary } from '../engine/itineraryPlanner';
import { buildResponseForIntent, AIAction } from '../engine/responseGenerator';
import { buildCityComparisonAnswer } from '../engine/cityComparison';
import { getResolvedPlaceById } from '../engine/placeResolver';
import { randomUUID } from 'node:crypto';
import { generateModelReply, getModelStatus, getModelConfiguration, explainModelFailure } from '../engine/modelGateway';
import { ProviderFailure } from '../engine/providerErrors';

export const aiChatRouter = Router();

function resolveFollowUpPlace(query: string, places: any[] | undefined) {
  if (!Array.isArray(places) || places.length === 0) return undefined;
  const text = query.toLowerCase();
  const ordinalPatterns: Array<[RegExp, number]> = [
    [/\b(?:first|1st|number\s+1|place\s+1|pehla|pehli)\b/, 0],
    [/\b(?:second|2nd|number\s+2|place\s+2|dusra|dusri)\b/, 1],
    [/\b(?:third|3rd|number\s+3|place\s+3|teesra|teesri)\b/, 2],
    [/\b(?:fourth|4th|number\s+4|place\s+4|chautha|chauthi)\b/, 3],
  ];
  const match = ordinalPatterns.find(([pattern]) => pattern.test(text));
  if (match) {
    const candidate = places[match[1]];
    return candidate?.id ? getResolvedPlaceById(candidate.id) : undefined;
  }
  if (places.length === 1 && /\b(?:this place|that place|it|iska|uska|yahan|wahan|there)\b/i.test(text)) {
    return places[0]?.id ? getResolvedPlaceById(places[0].id) : undefined;
  }
  return undefined;
}

function resolveRequestedPage(query: string): { label: string; path: string } | null {
  if (!/(open|go to|take me|navigate|kholo|khol do|kholne|le chalo|par jao|page|tab)/i.test(query)) return null;
  const pages: Array<{ label: string; path: string; pattern: RegExp }> = [
    { label: 'Home', path: '/', pattern: /\b(home|homepage|ghar)\b/i },
    { label: 'Discover Bharat', path: '/explore', pattern: /\b(discover bharat|discover|explore|states|state explorer|bharat)\b/i },
    { label: 'Festivals', path: '/festivals', pattern: /\b(festival|festivals|utsav)\b/i },
    { label: 'Heritage', path: '/heritage', pattern: /\b(heritage|monuments|unesco)\b/i },
    { label: 'Itinerary', path: '/itinerary', pattern: /\b(itinerary|trip plan|planner|plan a trip)\b/i },
    { label: 'AI Assistant', path: '/ai', pattern: /\b(ai assistant|assistant|chat)\b/i },
    { label: 'Saved Trips', path: '/trips', pattern: /\b(saved trips|my trips|trips)\b/i },
    { label: 'Favorites', path: '/favorites', pattern: /\b(favorites|favourites|bookmarks|saved places)\b/i },
    { label: 'Profile', path: '/profile', pattern: /\b(profile|account|my account)\b/i },
    { label: '3D Explorer', path: '/3d', pattern: /\b(3d|three dimensional)\b/i },
  ];
  const match = pages.find((page) => page.pattern.test(query));
  return match ? { label: match.label, path: match.path } : null;
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
    engine: 'Virasat AI · Local Data Engine',
    generation: getModelStatus(),
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
 * The local Virasat AI engine resolves intents against
 * verified app data and registered in-app tools.
 */
aiChatRouter.post(
  '/chat',
  rateLimiter({ windowMs: 60000, max: 30 }),
  async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();

    const {
      message,
      conversation_id,
      session_id,
    } = req.body || {};

    const rawQuery = typeof message === 'string' ? message.trim() : '';

    if (!rawQuery) {
      res.status(400).json({
        success: false,
        error: 'Message cannot be empty',
      });
      return;
    }

    if (rawQuery.length > 2000) {
      res.status(413).json({ success: false, error: 'Message is too long. Keep it under 2,000 characters.' });
      return;
    }

    /**
     * Stable conversation/session identifier.
     */
    const requestedSessionId = typeof conversation_id === 'string'
      ? conversation_id
      : typeof session_id === 'string'
        ? session_id
        : '';
    const sessionId = /^[a-zA-Z0-9._:-]{1,128}$/.test(requestedSessionId)
      ? requestedSessionId
      : `session-${randomUUID()}`;

    try {

    /**
     * Live browser/request context.
     */
    const liveContext = buildContextPayload(req);

    /**
     * Existing conversation memory.
     */
    const existingState = getConversationState(sessionId);

    const modelConfiguration = getModelConfiguration();
    if (modelConfiguration.requireHosted && !modelConfiguration.configured) {
      console.warn('[AI Configuration]', modelConfiguration.issues.join(', '));
      res.status(503).json({ success: false, error: 'MODEL_NOT_CONFIGURED', generation_mode: 'unavailable',
        reply: 'AI generation needs a hosted model and the selected provider server-side API key. Check the AI provider settings in the server .env file.', conversation_id: sessionId });
      return;
    }

    // A configured model owns interpretation, tool selection and natural wording.
    // It runs before keyword classification, so city mentions cannot hijack routes
    // or everyday conversation. Corpus examples are never loaded into this path.
    if (getModelStatus().configured) {
      try {
        const isTransportRequest = /\b(train|rail|railway|flight|airport|drive|driving|road|walk|walking|route|how to reach|travel)\b|kaise\s+(jau|jaye|pahunch|pahunche)|train se|flight se|car se|chal ke/i.test(rawQuery);
        const hostedEntities = isTransportRequest
          ? extractEntities(rawQuery, { ...liveContext, destination: existingState.destination })
          : null;
        const generated = await generateModelReply(rawQuery, existingState, liveContext);
        let transportResult = generated.calls.find((call: any) => call.tool === 'getTransportOptions')?.result;
        const transportOrigin = hostedEntities?.origin || existingState.origin;
        const transportDestination = hostedEntities?.destination || hostedEntities?.city || existingState.destination;

        // Hosted models can answer a route question without requesting tools.
        // Fetch the same structured route data in that case so the UI always
        // exposes the mapped modes and airport ground transfers.
        if (!transportResult && isTransportRequest && transportOrigin && transportDestination) {
          transportResult = await executeTool(
            'getTransportOptions',
            { origin: transportOrigin, destination: transportDestination },
            liveContext
          );
        }

        const options = transportResult?.transit_options || {};
        const transitComparison = transportResult && !transportResult.error && Object.keys(options).length > 0
          ? {
              origin: transportResult.origin,
              destination: transportResult.destination,
              distance_km: transportResult.straight_line_km,
              train: options.train?.available ? { summary: options.train.summary, approx_duration: options.train.approx_duration, stations: options.train.stations, notes: options.train.notes } : undefined,
              air: options.air?.available ? { summary: options.air.summary, approx_duration: options.air.approx_duration, notes: options.air.notes } : undefined,
              road: options.road?.available ? { summary: options.road.summary, approx_duration: options.road.approx_duration, notes: options.road.notes } : undefined,
              walk: options.walk ? { summary: options.walk.summary, approx_duration: options.walk.approx_duration, notes: options.walk.notes } : undefined,
            }
          : undefined;
        const airportAccess = transportResult?.airport_access;
        const airportGatewayNote = airportAccess
          ? `\n\n**Mapped airport gateways:** ${airportAccess.origin.airport.city} (${airportAccess.origin.airport.iata}) is about ${airportAccess.origin.ground_transfer_km} km from the start; ${airportAccess.destination.airport.city} (${airportAccess.destination.airport.iata}) is about ${airportAccess.destination.ground_transfer_km} km from the destination. Flight schedule and fare are not live-checked.`
          : '';
        existingState.updatedAt = Date.now();
        existingState.turnCount++;
        res.json({ success: true, reply: `${generated.reply}${airportGatewayNote}`, conversation_id: sessionId, session_id: sessionId,
          engine: 'Virasat AI · Hosted Model', provider_used: generated.provider, model_used: generated.model, generation_mode: 'hosted_generative',
          actions: generated.actions, tool_calls: generated.calls, transit_comparison: transitComparison, suggested_actions: [], latency_ms: Date.now() - startTime });
        return;
      } catch (error) {
        const code = error instanceof Error && /^MODEL_[A-Z_0-9]+$/.test(error.message) ? error.message : 'MODEL_UNAVAILABLE';
        console.warn(`[AI Gateway] Hosted model unavailable (${code}). Seamlessly serving response via Virasat AI local intelligence engine.`);
        const diagnostic = error instanceof ProviderFailure ? error.diagnostic : undefined;
        if (diagnostic?.retry_after_seconds !== null && diagnostic?.retry_after_seconds !== undefined) res.setHeader('Retry-After', String(diagnostic.retry_after_seconds));
        if (modelConfiguration.requireHosted && code === 'MODEL_NOT_CONFIGURED') {
          res.status(503).json({ success: false, error: code, reply: diagnostic?.explanation || explainModelFailure(code),
            provider_error: diagnostic, provider_request_sent: error instanceof ProviderFailure ? !error.deferred : undefined,
            generation_mode: 'unavailable', conversation_id: sessionId });
          return;
        }
        // Graceful automatic fallback: proceed to local database & response engine below
      }
    }

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

    const referencedPlace = resolveFollowUpPlace(rawQuery, existingState.lastPlaces);
    const contextForResolution = {
      ...liveContext,
      lastPlace: referencedPlace || existingState.lastPlace,
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

    if (referencedPlace && !entities.resolvedPlace && intentResult.intent !== 'COMPARISON') {
      entities.resolvedPlace = referencedPlace;
      entities.place_id = referencedPlace.id;
      entities.place_name = referencedPlace.name;
      entities.destination = referencedPlace.city;
      entities.city = referencedPlace.city;
      entities.state = referencedPlace.state;
      if (intentResult.intent === 'UNKNOWN' && /\b(?:this|that|it|place|famous|history|about|second|third|first|one|pehla|dusra|teesra)\b/i.test(rawQuery)) {
        intentResult.intent = 'MONUMENT_INFO';
        intentResult.resolvedPlace = referencedPlace;
      }
    }

    // Comparison prompts may mention an origin and several candidate cities;
    // none of them should silently overwrite the traveler's active destination.
    if (intentResult.intent === 'COMPARISON') {
      delete entities.city;
      delete entities.destination;
      delete entities.origin;
      delete entities.resolvedPlace;
      delete entities.place_id;
      delete entities.place_name;
      delete entities.state;
    }

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
    if (intentResult.resolvedPlace && intentResult.intent !== 'COMPARISON') {
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
    let usedEngine = 'Virasat AI · Local Data Engine';
    let generatedPlan: any = null;
    let dynamicQuickActions: string[] = [];
    let actionList: AIAction[] = [];
    let sourceList: string[] | undefined = undefined;

    const requestedPage = intentResult.intent === 'MAP_ACTION' ? null : resolveRequestedPage(rawQuery);
    if (requestedPage) {
      replyText = intentResult.isHinglish
        ? `${requestedPage.label} kholne ke liye neeche button dabaiye.`
        : `Use the button below to open ${requestedPage.label}.`;
      dynamicQuickActions = [`Open ${requestedPage.label}`];
      actionList.push({ type: 'view_destination', label: `Open ${requestedPage.label}`, url: requestedPage.path });
      sourceList = ['Virasat app navigation'];
    }

    const requestsMoreOptions = /\b(?:more options|more places|more hotels|more stays|more hidden gems|another option|other options|another gem|give me more|show more|any more|aur options|aur jagah|aur koi|aur hotel|aur hidden|kuch aur|next options|next places)\b/i.test(rawQuery);
    if (!replyText && requestsMoreOptions && existingState.lastSearch) {
      const previousSearch = existingState.lastSearch;
      const args = {
        query: previousSearch.query,
        city: previousSearch.city,
        state: previousSearch.state,
        category: previousSearch.category,
        limit: previousSearch.limit || 4,
        offset: (previousSearch.offset || 0) + (previousSearch.limit || 4),
      };
      const searchTool = previousSearch.kind === 'hidden_gems' ? 'searchHiddenGems' : 'searchTouristPlaces';
      const placesRes = await executeTool(searchTool, args, liveContext);
      executedToolCalls.push({ tool: searchTool, args, result: placesRes });
      const results = searchTool === 'searchHiddenGems' ? placesRes.candidates || [] : placesRes.results || [];
      replyText = results.length
        ? `${intentResult.isHinglish ? 'Aur options' : 'More options'}${args.city ? ` ${intentResult.isHinglish ? 'in' : 'in'} **${args.city}**` : ''} from Virasat's available records:\n\n` +
          results.map((place: any, index: number) => `${index + 1}. **${place.name}** — ${place.city}, ${place.state}\n   ${place.summary || ''}`).join('\n\n')
        : (intentResult.isHinglish
          ? 'Is search mein aur matching records nahi mile. City ya interest badal kar dekhein?'
          : 'There are no more matching records for that search. Would you like to change the city or interest?');
      dynamicQuickActions = args.city ? [`Plan ${args.city} Trip`, `Show ${args.city} on Map`] : ['Explore all states', 'Explore Heritage'];
      if (args.city) {
        actionList.push(
          { type: 'open_map', label: `Show ${args.city} on Map`, url: `/map?city=${encodeURIComponent(args.city)}` },
          { type: 'plan_itinerary', label: `Plan ${args.city} Trip`, url: `/itinerary?city=${encodeURIComponent(args.city)}` },
        );
      } else {
        actionList.push({ type: 'explore_states', label: 'Discover Bharat', url: '/explore' });
      }
      sourceList = ['Virasat Master Tourism Registry'];
    }

    /**
     * ============================================================
     * 4. LOCAL INTENT RESPONSE
     * ============================================================
     *
     * Structured tourism answers are read from local data tools.
     */
    usedEngine = 'Virasat AI · Local Data Engine';

    /**
     * ============================================================
     * 5. VIRASAT AI LOCAL ENGINE
     * ============================================================
     *
       * Route supported requests to local data or return a clear capability answer.
     */
    if (!replyText) {
      const intent = intentResult.intent;

      /**
       * ----------------------------------------------------------
       * SOCIAL / CONVERSATIONAL
       * ----------------------------------------------------------
       */
      if (/(saved trips|my trips|my favorites|my favourites|saved places|bookmarks?)/i.test(rawQuery)) {
        const savedData = await executeTool('getSavedTrips', {}, liveContext);
        executedToolCalls.push({ tool: 'getSavedTrips', args: {}, result: savedData });
        const favoritesOnly = /(favorite|favourite|bookmark|saved places)/i.test(rawQuery) && !/(trip|itinerary)/i.test(rawQuery);
        if (!savedData.is_authenticated) {
          replyText = intentResult.isHinglish
            ? 'Aapke private saved trips aur favorites dekhne ke liye pehle sign in karein. Main kisi doosre account ka data nahi dikha sakta.'
            : 'Sign in to view your saved trips and favorites. Private account data is only available to its owner.';
          actionList.push({ type: 'view_destination', label: 'Open Profile', url: '/profile' });
          dynamicQuickActions = ['Open Profile', 'Explore Bharat'];
        } else {
          const savedItems = favoritesOnly ? savedData.favorite_places : savedData.saved_itineraries;
          const entries = (savedItems || []).map((item: any, index: number) => favoritesOnly
            ? `${index + 1}. **${item.place_name}**${item.city ? ` (${item.city}${item.state ? `, ${item.state}` : ''})` : ''}`
            : `${index + 1}. **${item.title}** — ${item.destination}${item.days_count ? `, ${item.days_count} days` : ''}`);
          const label = favoritesOnly ? 'favorites' : 'saved trips';
          replyText = entries.length
            ? `${intentResult.isHinglish ? 'Aapke' : 'Your'} ${label}:\n\n${entries.join('\n')}`
            : `${intentResult.isHinglish ? 'Is account mein abhi' : 'There are no'} ${label}${intentResult.isHinglish ? ' saved nahi hain.' : ' saved on this account.'}`;
          sourceList = ['Virasat account data', 'Virasat place registry'];
          actionList.push({ type: 'view_destination', label: favoritesOnly ? 'Open Favorites' : 'Open Saved Trips', url: favoritesOnly ? '/favorites' : '/trips' });
          dynamicQuickActions = ['Explore more places', 'Plan an itinerary'];
        }
      } else if (/(my profile|my preferences|my travel style|account preferences)/i.test(rawQuery)) {
        const profile = await executeTool('getUserProfile', {}, liveContext);
        executedToolCalls.push({ tool: 'getUserProfile', args: {}, result: profile });
        if (!profile.is_authenticated) {
          replyText = intentResult.isHinglish ? 'Apni profile aur preferences dekhne ke liye sign in karein.' : 'Sign in to view your profile and saved travel preferences.';
          actionList.push({ type: 'view_destination', label: 'Open Profile', url: '/profile' });
        } else {
          const preferences = profile.travel_preferences || {};
          replyText = `${intentResult.isHinglish ? 'Aapki profile' : 'Your profile'}: **${profile.name || 'Traveler'}**\n\n` +
            `• Home city: ${profile.home_city || 'Not specified'}\n` +
            `• Travel preferences: ${JSON.stringify(preferences)}`;
          sourceList = ['Authenticated Virasat profile'];
          actionList.push({ type: 'view_destination', label: 'Open Profile', url: '/profile' });
        }
        dynamicQuickActions = ['Update preferences', 'Plan a trip'];
      } else if (/(active itinerary|current itinerary|my itinerary|itinerary details|trip i planned)/i.test(rawQuery)) {
        const active = await executeTool('getActiveItinerary', {}, liveContext);
        executedToolCalls.push({ tool: 'getActiveItinerary', args: {}, result: active });
        const itinerary = active.itinerary;
        if (!itinerary) {
          replyText = intentResult.isHinglish ? 'Abhi koi active itinerary nahi mili. Destination batao, main local records se plan banaunga.' : 'There is no active itinerary open. Tell me a destination and I can build a plan from Virasat records.';
          dynamicQuickActions = ['Plan a trip', 'Open Itinerary'];
        } else {
          const days = Array.isArray(itinerary.days) ? itinerary.days : [];
          const dayLines = days.slice(0, 5).map((day: any, index: number) => {
            const stops = Array.isArray(day.stops) ? day.stops.map((stop: any) => stop.place_name || stop.name).filter(Boolean) : [];
            return `Day ${day.day_number || index + 1}: ${stops.length ? stops.join(', ') : day.title || 'Saved itinerary day'}`;
          });
          replyText = `**${itinerary.title || 'Your itinerary'}** — ${itinerary.destination || 'India'}\n\n` + (dayLines.join('\n') || 'The saved itinerary has no day details yet.');
          sourceList = ['Virasat itinerary data'];
          actionList.push({ type: 'plan_itinerary', label: 'Open Itinerary', url: '/itinerary' });
          dynamicQuickActions = ['Change this itinerary', 'Show route on map'];
        }
      } else if (intent === 'UNKNOWN') {
        replyText = intentResult.isHinglish
          ? `Bilkul, apna poora sawal bhejiye. Virasat places, routes, festivals aur stays ke liye main local records check karta hoon; jis detail ka reliable source nahi hoga, us par saaf bataunga.`
          : `Sure—send the full question. For Virasat places, routes, festivals, and stays I check the local records; if a detail has no reliable source, I’ll say so clearly.`;
        dynamicQuickActions = ['Explore all states', 'Find heritage places', 'Plan an itinerary', 'Browse festivals'];
        actionList.push(
          { type: 'explore_states', label: 'Discover Bharat', url: '/explore' },
          { type: 'explore_heritage', label: 'Heritage', url: '/heritage' },
          { type: 'plan_itinerary', label: 'Itinerary', url: '/itinerary' },
          { type: 'explore_festival', label: 'Festivals', url: '/festivals' },
        );
        sourceList = ['Virasat AI Local Data Engine'];
      } else if (
        intent === 'GREETING' ||
        intent === 'CASUAL_CONVERSATION' ||
        intent === 'ABOUT_VIRASAT' ||
        intent === 'HELP' ||
        intent === 'FAREWELL' ||
        intent === 'THANKS' ||
        intent === 'COMPARISON'
      ) {
        if (entityData.rejected_city) {
          replyText = intentResult.isHinglish
            ? `Theek hai, **${entityData.rejected_city}** nahi! Aap Bharat ke kis destination ya city ke baare mein plan karna chahenge? (Jaise Jaipur, Delhi, Mumbai, Chennai, Goa, Varanasi)`
            : `Understood, no **${entityData.rejected_city}**! Which destination or city in India would you like to explore? (e.g. Jaipur, Delhi, Mumbai, Chennai, Goa, Varanasi)`;
          dynamicQuickActions = [
            'Explore Chennai',
            'Plan Jaipur Trip',
            'Delhi Tourism',
            'Explore Heritage',
          ];
          sourceList = ['Virasat Tourism Assistant'];
        } else {
          if (intent === 'COMPARISON') {
            const comparison = buildCityComparisonAnswer(rawQuery, intentResult.isHinglish);
            if (comparison) {
              replyText = comparison.reply;
              dynamicQuickActions = comparison.suggestedActions;
              actionList.push(...comparison.actions);
              sourceList = comparison.sources;
            } else {
              const formatted = buildResponseForIntent(intentResult, tripState);
              replyText = formatted.reply;
              dynamicQuickActions = formatted.suggested_actions;
              if (formatted.actions) actionList.push(...formatted.actions);
              sourceList = formatted.sources;
            }
          } else {
            const formatted = buildResponseForIntent(intentResult, tripState);
            replyText = formatted.reply;
            dynamicQuickActions = formatted.suggested_actions;
            if (formatted.actions) actionList.push(...formatted.actions);
            sourceList = formatted.sources;
          }
        }
      }

      /**
       * ----------------------------------------------------------
       * MAP ACTION / TICKET BOOKING / UNESCO / NATIONAL PARKS / HIDDEN GEMS
       * ----------------------------------------------------------
       */
      else if (
        intent === 'MAP_ACTION' ||
        intent === 'TICKET_BOOKING' ||
        intent === 'UNESCO_QUERY' ||
        intent === 'NATIONAL_PARK_QUERY' ||
        intent === 'SAFETY_QUERY' ||
        intent === 'LOCATION_FOLLOWUP'
      ) {
        const formatted = buildResponseForIntent(intentResult, tripState);
        replyText = formatted.reply;
        dynamicQuickActions = formatted.suggested_actions;
        if (formatted.actions) actionList.push(...formatted.actions);
        sourceList = formatted.sources;
      }

      else if (intent === 'HIDDEN_GEMS_QUERY') {
        const city = entityData.city || entityData.destination || tripState.destination || (liveContext.selectedCity !== 'All India' ? liveContext.selectedCity : undefined);
        const state = entityData.state || undefined;
        if ((!city || city === 'All India') && !state) {
          replyText = intentResult.isHinglish
            ? 'Kis city ke aas-paas lesser-known places dhoondhun?'
            : 'Which city or region should I search for lesser-known places in?';
          dynamicQuickActions = ['Mumbai hidden gems', 'Jaipur hidden gems', 'Explore all states'];
        } else {
          const args = { city: city && city !== 'All India' ? city : undefined, state, limit: 4, offset: 0 };
          const placesRes = await executeTool('searchHiddenGems', args, liveContext);
          executedToolCalls.push({ tool: 'searchHiddenGems', args, result: placesRes });
          const places = placesRes.candidates || [];
          replyText = places.length
            ? `**Curated lesser-known place candidates${city ? ` around ${city}` : ` in ${state}`}:**\n\n` + places.map((place: any, index: number) => `${index + 1}. **${place.name}** — ${place.city}, ${place.state}\n   ${place.summary || ''}${place.best_time_to_visit ? `\n   Best time noted in the record: ${place.best_time_to_visit}` : ''}${place.access_tips ? `\n   Access note: ${place.access_tips}` : ''}`).join('\n\n') +
              `\n\nThese are curated candidates, not a measured popularity ranking. Check local access and current conditions before visiting.`
            : `I couldn't find a curated candidate record for ${city || state}. I won't substitute unrelated attractions; choose another city or browse the local tourism records.`;
          dynamicQuickActions = city ? [`Plan ${city} Trip`, `Show ${city} on Map`] : ['Explore all states', 'Explore Heritage'];
          if (city) {
            actionList.push(
              { type: 'open_map', label: `Show ${city} on Map`, url: `/map?city=${encodeURIComponent(city)}` },
              { type: 'plan_itinerary', label: `Plan ${city} Trip`, url: `/itinerary?city=${encodeURIComponent(city)}` },
            );
          } else if (places[0]) {
            actionList.push({ type: 'open_map', label: `Show ${places[0].name} on Map`, url: `/map?city=${encodeURIComponent(places[0].city)}&q=${encodeURIComponent(places[0].name)}` });
          } else {
            actionList.push({ type: 'explore_states', label: 'Discover Bharat', url: '/explore' });
          }
          sourceList = ['Virasat curated hidden-gem candidate dataset'];
        }
      }

      /**
       * ----------------------------------------------------------
       * MONUMENT / HERITAGE
       * ----------------------------------------------------------
       */
      else if (intent === 'MONUMENT_INFO') {
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
        if (formatted.actions) actionList.push(...formatted.actions);
        sourceList = formatted.sources;

        if (place?.verification_status === 'curated_candidate_unverified') {
          replyText = `This is a curated candidate record; historical details, public access, and current conditions have not been independently verified.\n\n${replyText}`;
          sourceList = ['Virasat curated hidden-gem candidate dataset; not independently verified'];
        }

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

          actionList.push(
            { type: 'open_map', label: `Show ${city} on Map`, url: `/map?city=${encodeURIComponent(city)}` },
            { type: 'plan_itinerary', label: `Plan ${city} Trip`, url: `/itinerary?city=${encodeURIComponent(city)}` }
          );
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

          actionList.push(
            { type: 'explore_states', label: `Explore ${stateName}`, url: '/explore' },
            { type: 'open_map', label: `View ${stateName} on Map`, url: `/map?city=${encodeURIComponent(stateName)}` }
          );
        }
      }

      /**
       * ----------------------------------------------------------
       * DESTINATION / CITY INFO & TOURIST PLACE SEARCH
       * ----------------------------------------------------------
       */
      else if (
        intent === 'DESTINATION_INFO' ||
        intent === 'CITY_INFO' ||
        intent === 'TOURIST_PLACE_SEARCH'
      ) {
        const cityName =
          entityData.city ||
          entityData.destination ||
          intentResult.resolvedPlace?.city ||
          tripState.destination ||
          null;

        if (!cityName) {
          replyText =
            intentResult.isHinglish
              ? 'Aap kis destination ya city ke baare mein jaanna chahte hain? (Jaise Chennai, Jaipur, Delhi, Mumbai, Varanasi)'
              : 'Which destination or city would you like to explore? (e.g. Chennai, Jaipur, Delhi, Mumbai, Varanasi)';

          dynamicQuickActions = [
            'Explore Chennai',
            'Plan Jaipur Trip',
            'Delhi Tourism',
            'Explore Heritage',
          ];
        } else {
          // Persist verified destination in trip state
          tripState.destination = cityName;

          const placesRes =
            await executeTool(
              'searchTouristPlaces',
              {
                city: cityName,
                limit: 6,
              },
              liveContext
            );

          executedToolCalls.push({
            tool: 'searchTouristPlaces',
            args: {
              city: cityName,
            },
            result: placesRes,
          });

          if (
            placesRes.results &&
            placesRes.results.length > 0
          ) {
            replyText =
              intentResult.isHinglish
                ? `### 🏛️ Tourism in ${cityName}\n\nVirasat ke available tourism data ke basis par:\n\n` +
                placesRes.results
                  .map(
                    (
                      p: any,
                      idx: number
                    ) =>
                      `${idx + 1}. **${p.name}** — ${p.city}, ${p.state}\n   ${p.summary || ''}`
                  )
                  .join('\n\n') +
                `\n\nAap kisi specific monument, itinerary, hotels ya transport ke baare mein pooch sakte hain.`
                : `### 🏛️ Tourism in ${cityName}\n\nBased on Virasat's available tourism data:\n\n` +
                placesRes.results
                  .map(
                    (
                      p: any,
                      idx: number
                    ) =>
                      `${idx + 1}. **${p.name}** — ${p.city}, ${p.state}\n   ${p.summary || ''}`
                  )
                  .join('\n\n') +
                `\n\nYou can ask about a specific monument, itinerary, hotels, or how to reach.`;

            sourceList = [
              'Virasat Master Tourism Registry',
            ];
          } else {
            replyText =
              intentResult.isHinglish
                ? `${cityName} ke liye mujhe abhi reliable tourism records nahi mile.`
                : `I couldn't find reliable tourism records for ${cityName}.`;

            sourceList = [
              'Virasat Master Tourism Registry',
            ];
          }

          dynamicQuickActions = [
            `Plan ${cityName} Trip`,
            'Explore Heritage',
            'Find Stays',
            'How to Reach',
          ];

          actionList.push(
            { type: 'open_map', label: `Show ${cityName} on Map`, url: `/map?city=${encodeURIComponent(cityName)}` },
            { type: 'plan_itinerary', label: `Plan ${cityName} Trip`, url: `/itinerary?city=${encodeURIComponent(cityName)}` },
            { type: 'view_destination', label: `Explore ${cityName}`, url: `/city/${encodeURIComponent(cityName.toLowerCase().replace(/\s+/g, '-'))}` }
          );
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
        if (formatted.actions) actionList.push(...formatted.actions);
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
        const city =
          entityData.city ||
          tripState.destination ||
          (liveContext.selectedCity !== 'All India' ? liveContext.selectedCity : undefined);

        if (!city) {
          replyText = intentResult.isHinglish
            ? 'Kis city ya destination ka itinerary banaun? Aap din, budget aur interests baad mein bhi bata sakte hain.'
            : 'Which city or destination should I plan for? You can add trip length, budget, and interests now or later.';
          dynamicQuickActions = ['Plan a Jaipur Trip', 'Plan a Mumbai Trip', 'Explore all states'];
        } else {
          tripState.destination = city;
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

          if (!placesRes.results?.length) {
            replyText = intentResult.isHinglish
              ? `${city} ke liye local destination records nahi mile, isliye main unverified itinerary nahi banaunga.`
              : `I couldn't find destination records for ${city}, so I won't generate an ungrounded itinerary.`;
            dynamicQuickActions = ['Explore all states', 'Choose another city'];
            actionList.push({ type: 'explore_states', label: 'Discover Bharat', url: '/explore' });
            sourceList = ['Virasat Master Tourism Registry'];
          } else {
            generatedPlan = generateSmartItinerary(tripState);
            tripState.lastItinerary = generatedPlan;

            // Look up intercity options only when both endpoints are known.
            if (tripState.origin) {
              const transRes = await executeTool('getTransportOptions', { origin: tripState.origin, destination: city }, liveContext);
              executedToolCalls.push({ tool: 'getTransportOptions', args: { origin: tripState.origin, destination: city }, result: transRes });
            }

            const formatted = buildResponseForIntent(intentResult, tripState, generatedPlan);
            replyText = formatted.reply;
            dynamicQuickActions = formatted.suggested_actions;
            if (formatted.actions) actionList.push(...formatted.actions);
            sourceList = formatted.sources;
          }
        }
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
          const explicitNightlyCap = entityData.budget && /\b(?:under|below|upto|up to|max|less than|less|per night|nightly|raat|tak|se kam)\b/i.test(rawQuery)
            ? entityData.budget
            : undefined;

          const hotelRes =
            await executeTool(
              'searchHotels',
              {
                city,
                place_id: placeId,
                category:
                  tripState.hotel_tier,
                max_price_per_night: explicitNightlyCap,
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
                ? `🏨 ${placePrefix}**${city}** ke Virasat hotel records:\n\n` +
                hotelRes.hotels
                  .map(
                    (h: any) =>
                      `🏨 **${h.name}**\n   • Category: ${h.category || 'Not specified'}\n   • Indicative stored rate: ${h.price || 'Not provided'}\n   • Rating: ${h.rating ??
                      'Not provided'
                      }\n   • Location: ${h.location ||
                      'Not provided'
                      }\n   • Availability: not checked; this is a stored Virasat listing.`
                  )
                  .join('\n\n')
                : `🏨 Virasat hotel records ${placePrefix}**${city}**:\n\n` +
                hotelRes.hotels
                  .map(
                    (h: any) =>
                      `🏨 **${h.name}**\n   • Indicative stored rate: ${h.price || 'Not provided'}\n   • Rating: ${h.rating ??
                      'Not provided'
                      }\n   • Location: ${h.location ||
                      'Not provided'
                      }\n   • Availability: not checked; this is a stored Virasat listing.`
                  )
                  .join('\n\n');

            sourceList = [
              'Virasat Hotel Registry',
            ];
            if (!explicitNightlyCap && /\b(?:under|below|within)\s+(?:my|the)\s+budget\b/i.test(rawQuery) && tripState.budget) {
              replyText += `\n\nYour saved trip budget is ₹${tripState.budget.toLocaleString('en-IN')} total. Hotel prices are listed per night, so tell me a per-night limit if you want me to filter these records.`;
            }
          } else {
            replyText = explicitNightlyCap
              ? `${city} mein ₹${explicitNightlyCap.toLocaleString('en-IN')} per night tak ke stored indicative rate wale hotel records nahi mile. Live rates aur availability is local registry mein available nahi hain.`
              : intentResult.isHinglish
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

          actionList.push(
            { type: 'find_hotels', label: `Find Hotels in ${city}`, url: `/itinerary?city=${encodeURIComponent(city)}` },
            { type: 'open_map', label: `Show ${city} Map`, url: `/map?city=${encodeURIComponent(city)}` }
          );
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

          const walkMsg =
            opt.walk?.available
              ? `🚶 **Walk:** ${opt.walk.summary
              }${opt.walk.approx_duration
                ? ` (${opt.walk.approx_duration})`
                : ''}`
              : '';

          const optionsText = [
            trainMsg,
            airMsg,
            roadMsg,
            walkMsg,
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
              }\n\nYeh stored route estimates hain. Live departure, fare, seat availability ya booking status connected nahi hai; travel se pehle official operator par confirm karein.`
              : `🚆 **${transRes.origin} → ${transRes.destination}**\n\n${transRes.straight_line_km
                ? `Approx. straight-line distance: ${transRes.straight_line_km} km\n\n`
                : ''
              }${optionsText ||
              'I could not find reliable transport options for this route.'
              }\n\nThese are stored route estimates. Live departure times, fares, seat availability, and booking status are not connected; confirm them with the official operator before travel.`;

          sourceList = [
            'Virasat Transport Intelligence',
          ];

          dynamicQuickActions = [
            `Find Hotels in ${destination}`,
            `Plan ${destination} Trip`,
            'Estimated Budget',
            `Top Sights in ${destination}`,
          ];

          actionList.push(
            { type: 'booking_link', label: 'Official IRCTC Rail Link', url: 'https://www.irctc.co.in/' },
            { type: 'open_map', label: `Show Route on Map (${transRes.origin} ➔ ${transRes.destination})`, url: `/map?origin=${encodeURIComponent(transRes.origin)}&destination=${encodeURIComponent(transRes.destination)}` },
            { type: 'plan_itinerary', label: `Plan ${destination} Trip`, url: `/itinerary?city=${encodeURIComponent(destination)}` }
          );
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
              ? `🌤️ **${weatherRes.city} weather note**\n\n` +
                `Is build mein live weather feed connected nahi hai, isliye current temperature ya forecast confirm nahi kar sakta.\n\n` +
                `• **General seasonal guidance:** ${weatherRes.best_time_to_visit}\n` +
                `• **Travel advisory:** ${weatherRes.travel_advisory}`
              : `🌤️ **Weather note for ${weatherRes.city}**\n\n` +
                `A live weather feed is not connected in this build, so I can't confirm current temperature or forecast.\n\n` +
                `• **General seasonal guidance:** ${weatherRes.best_time_to_visit}\n` +
                `• **Travel advisory:** ${weatherRes.travel_advisory}`;

          dynamicQuickActions = [
            'Best Season to Visit',
            `Plan ${city} Trip`,
            'Find Stays',
          ];

          sourceList = ['Virasat general seasonal guidance; not a live weather source'];
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
        const state = entityData.state || null;
        const refersToPreviousFestival = Boolean(tripState.lastFestival) && /\b(?:this festival|that festival|it|iska|uska|kab hai|when is it|when does it happen)\b/i.test(rawQuery);
        const requestedYear = rawQuery.match(/\b20\d{2}\b/)?.[0];
        const festivalQuery = refersToPreviousFestival
          ? `${tripState.lastFestival.festival || tripState.lastFestival.name || ''}${requestedYear ? ` ${requestedYear}` : ''}`.trim()
          : rawQuery;

        const eventsRes =
          await executeTool(
            'getEventsCalendar',
            {
              query: festivalQuery,
              city: city || undefined,
              state: state || undefined,
            },
            liveContext
          );

        executedToolCalls.push({
          tool: 'getEventsCalendar',
          args: { query: rawQuery, city, state },
          result: eventsRes,
        });

        if (
          eventsRes.events &&
          eventsRes.events.length > 0
        ) {
          const firstEvt = eventsRes.events[0];
          replyText =
            intentResult.isHinglish
              ? `🗓️ **Verified Cultural Festival Details**:\n\n` +
              eventsRes.events
                .slice(0, 3)
                .map(
                  (e: any) =>
                    `🎉 **${e.festival}** (${e.location})\n   • **Timing / Season**: ${e.season_timing}\n   • **Cultural Significance**: ${e.cultural_significance}\n   • **Vibe & Atmosphere**: ${e.cultural_vibe || 'Living heritage celebration'}`
                )
                .join('\n\n') +
              `\n\n📌 *Advisory*: ${eventsRes.advisory}`
              : `🗓️ **Verified Cultural Festival Details**:\n\n` +
              eventsRes.events
                .slice(0, 3)
                .map(
                  (e: any) =>
                    `🎉 **${e.festival}** (${e.location})\n   • **Timing / Season**: ${e.season_timing}\n   • **Cultural Significance**: ${e.cultural_significance}\n   • **Traditions & Atmosphere**: ${e.cultural_vibe || 'Living cultural observance'}`
                )
                .join('\n\n') +
              `\n\n📌 *Advisory*: ${eventsRes.advisory}`;

          const festivalSources = eventsRes.events
            .map((event: any) => event.official_source)
            .filter((source: unknown): source is string => typeof source === 'string' && /^https?:\/\//i.test(source));
          sourceList = [...new Set(['Virasat Pan-India Festival Registry', ...festivalSources])];

          dynamicQuickActions = [
            `Explore ${firstEvt.festival}`,
            `Show ${firstEvt.city} on Map`,
            `Plan ${firstEvt.city} Trip`,
            'Explore Stays',
          ];

          actionList.push(
            { type: 'explore_festival', label: `Explore ${firstEvt.festival}`, url: `/festivals?q=${encodeURIComponent(firstEvt.festival)}` },
            { type: 'open_map', label: `Show ${firstEvt.city} on Map`, url: `/map?city=${encodeURIComponent(firstEvt.city)}` },
            { type: 'plan_itinerary', label: `Plan ${firstEvt.city} Trip`, url: `/itinerary?city=${encodeURIComponent(firstEvt.city)}&days=2` }
          );
        } else {
          replyText =
            intentResult.isHinglish
              ? `Mujhe is query ke liye exact verified festival record nahi mila. Aap Mysore Dasara, Durga Puja, Pushkar Fair, Hornbill Festival, ya kisi specific rajya ke festivals ke baare mein pooch sakte hain.`
              : `I could not find a verified festival record matching this query. You can ask about Mysore Dasara, Durga Puja, Pushkar Fair, Hornbill Festival, or festivals in a specific region.`;

          dynamicQuickActions = [
            'Mysore Dasara Info',
            'Durga Puja Kolkata',
            'Pushkar Fair',
            'Explore Festivals',
          ];

          actionList.push({ type: 'explore_festival', label: 'Explore All 83 Festivals', url: '/festivals' });
        }
      }

      /**
       * ----------------------------------------------------------
       * TIME / TOMORROW OPTIONS QUERY
       * ----------------------------------------------------------
       */
      else if (intent === 'TIME_QUERY') {
        const city =
          entityData.city ||
          tripState.destination ||
          liveContext.selectedCity ||
          'Jaipur';

        replyText =
          intentResult.isHinglish
            ? `🌅 **${city} mein kal ke liye best options:**\n\n` +
            `• **Morning (06:00 AM - 10:00 AM)**: Historic monuments & sunrise viewpoints visit karein jab bheed kam aur mausam pleasant ho.\n` +
            `• **Afternoon (11:00 AM - 03:30 PM)**: Indoor royal palace museums, art galleries aur authentic local dining enjoy karein.\n` +
            `• **Evening (04:30 PM - 08:00 PM)**: Sunset viewpoint / lakeside promenade, heritage illumination, aur traditional handicraft bazaars explore karein.\n\n` +
            `Aap kisi specific monument ya full 1-day itinerary plan karna chahte hain?`
            : `🌅 **Top Options for Tomorrow in ${city}:**\n\n` +
            `• **Morning (06:00 AM - 10:00 AM)**: Major heritage monuments and sunrise viewpoints with pleasant ambient light and thin crowds.\n` +
            `• **Afternoon (11:00 AM - 03:30 PM)**: Palace museums and authentic regional culinary lunch.\n` +
            `• **Evening (04:30 PM - 08:00 PM)**: Sunset viewpoints, heritage illuminations, and bustling artisan bazaars.\n\n` +
            `Would you like to build a full 1-day itinerary or check specific sights?`;

        dynamicQuickActions = [
          `1-Day ${city} Itinerary`,
          `Show ${city} on Map`,
          'Nearby Heritage Places',
          'Find Stays',
        ];

        actionList.push(
          { type: 'open_map', label: `Open ${city} Map`, url: `/map?city=${encodeURIComponent(city)}` },
          { type: 'plan_itinerary', label: `Plan ${city} Trip`, url: `/itinerary?city=${encodeURIComponent(city)}&days=1` }
        );
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
        let city =
          entityData.city ||
          entityData.destination ||
          intentResult.resolvedPlace?.city ||
          tripState.destination ||
          null;

        // If no explicit city was identified, check if query contains any known Indian destination
        if (!city) {
          const rawLower = rawQuery.toLowerCase();
          for (const [alias, canonical] of Object.entries(INDIAN_DESTINATION_ALIASES)) {
            if (new RegExp(`\\b${alias}\\b`, 'i').test(rawLower)) {
              city = canonical;
              tripState.destination = canonical;
              break;
            }
          }
        }

        const queryToSearch =
          intentResult.intent === 'HERITAGE_QUERY'
            ? undefined
            : entityData.place?.name ||
              entityData.place_name ||
              (entityData.city && entityData.city !== city ? entityData.city : undefined) ||
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
              category:
                intentResult.intent === 'HERITAGE_QUERY' ? 'heritage' : undefined,
              limit: 4,
            },
            liveContext
          );

        executedToolCalls.push({
          tool: 'searchTouristPlaces',
          args: {
            query: queryToSearch,
            city,
            category: intentResult.intent === 'HERITAGE_QUERY' ? 'heritage' : undefined,
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
            entityData.city ||
            entityData.destination ||
            city;

          replyText =
            activeName
              ? intentResult.isHinglish
                ? `Mujhe **${activeName}** ke liye is query par reliable tourism record nahi mila, isliye main guess nahi karunga.`
                : `I couldn't find reliable tourism data for **${activeName}** for this query, so I won't guess.`
              : intentResult.isHinglish
                ? 'Mujhe is query ke liye reliable tourism record nahi mila. Aap Bharat ke kisi city, state, monument ya destination ka naam bata sakte hain (jaise Jaipur, Chennai, Delhi, Mumbai, Varanasi).'
                : 'I could not find reliable tourism data for this query. You can specify an Indian city, state, monument, or destination (such as Jaipur, Chennai, Delhi, Mumbai, Varanasi).';

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
        (t) => t.tool === 'searchTouristPlaces' || t.tool === 'searchHiddenGems'
      );

    const placeResults = placeCall?.tool === 'searchHiddenGems'
      ? placeCall.result?.candidates
      : placeCall?.result?.results;
    if (placeCall && Array.isArray(placeResults)) {
      tripState.lastPlaces = placeResults;
      tripState.lastSearch = {
        query: placeCall.args?.query,
        city: placeCall.args?.city,
        state: placeCall.args?.state,
        category: placeCall.args?.category,
        kind: placeCall.tool === 'searchHiddenGems' ? 'hidden_gems' : 'places',
        offset: Number(placeCall.args?.offset) || 0,
        limit: Number(placeCall.args?.limit) || 4,
      };
    }

    const hotelCall = executedToolCalls.find((toolCall) => toolCall.tool === 'searchHotels');
    if (hotelCall && Array.isArray(hotelCall.result?.hotels)) {
      tripState.lastHotels = hotelCall.result.hotels;
    }

    const festivalCall = executedToolCalls.find((toolCall) => toolCall.tool === 'getEventsCalendar');
    if (festivalCall && Array.isArray(festivalCall.result?.events) && festivalCall.result.events.length > 0) {
      tripState.lastFestival = festivalCall.result.events[0];
    }

    if (
      placeCall &&
      Array.isArray(placeResults)
    ) {
      suggestedPlaces =
        placeResults
          .slice(0, 4)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            city: p.city,
            state: p.state,
            category: p.category,
            reason: p.summary,
            data_confidence: p.candidate_status ? 'curated_candidate_unverified' : p.official_source ? 'official' : 'database',
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

        walk:
          opt.walk
            ? {
              summary: opt.walk.summary,
              approx_duration: opt.walk.approx_duration,
              notes: opt.walk.notes,
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
      generation_mode: 'local_data_only',

      suggested_places:
        suggestedPlaces.length > 0
          ? suggestedPlaces
          : undefined,

      transit_comparison:
        transitComparison ||
        undefined,


      suggested_actions:
        dynamicQuickActions,

      actions:
        actionList.length > 0
          ? actionList.slice(0, 4)
          : undefined,

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

          party_size_count:
            tripState.party_size_count,

          travel_date:
            tripState.travel_date,

          start_date:
            tripState.start_date,

          end_date:
            tripState.end_date,

          interests:
            tripState.interests,

          transport_mode:
            tripState.transport_mode,

          hotel_tier:
            tripState.hotel_tier,
        },
      },
    });
    } catch (routeErr: any) {
      console.info('[AI Chat] Route fallback invoked:', routeErr?.message || routeErr);
      res.json({
        success: true,
        conversation_id: sessionId,
        session_id: sessionId,
        reply: 'Namaste! Main Virasat AI Heritage Assistant hoon. Main aapko verified monuments, itineraries, trains, flights, aur hotels plan karne mein madad kar sakta hoon. Aap kahan ghoomna chahte hain?',
        engine: 'Virasat AI · Local Data Engine',
        model_used: 'Virasat AI · Local Data Engine',
        suggested_actions: ['Explore Popular Monuments', 'Plan a 3-Day Trip', 'Find Heritage Hotels'],
        actions: [
          { type: 'explore_heritage', label: 'Explore Heritage', url: '/heritage' },
          { type: 'open_map', label: 'Open Map', url: '/map' },
          { type: 'plan_itinerary', label: 'Plan Itinerary', url: '/itinerary' },
        ],
        tool_calls: [],
        latency_ms: Date.now() - startTime,
      });
    }
  }
);
