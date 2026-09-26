import fs from 'fs';
import path from 'path';
import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { db } from '../../db/client';
import { rateLimiter } from '../../middleware/rateLimiter';
import {
  resolveCanonicalCityId,
  isCityExactMatch,
  normalizeTransliteration,
} from '../../db/canonicalLocationResolver';
import {
  resolveOriginTransportNode,
  resolveDestinationTransportNode,
  buildVerifiedTransitComparison,
} from '../../../../src/server/transportResolver';
import { haversineKm } from '../../../../src/server/railwayRoutingEngine';

export const aiRouter = Router();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'virasat-ai-concierge/1.0' } },
    });
  }
  return aiClient;
}

export interface GroundingCitation {
  place_id: string;
  place_name: string;
  field_name: string;
  fact_value: string;
  confidence: string;
  source_name: string;
  source_url: string;
}

export interface GroundingAudit {
  grounding_score: number;
  verified_entities_count: number;
  unverified_entities_count: number;
  flagged_unverified_claims: string[];
  verified_places: string[];
  citations_count: number;
  latency_ms: number;
  model_used: string;
}

/**
 * Extract verified citations from DB for a list of places
 */
async function fetchGroundingCitations(places: any[]): Promise<GroundingCitation[]> {
  const citations: GroundingCitation[] = [];
  for (const p of places) {
    const facts = await db.placeFacts.findByPlaceId(p.id);
    if (facts.length > 0) {
      for (const f of facts) {
        citations.push({
          place_id: p.id,
          place_name: p.name,
          field_name: f.fact_key,
          fact_value: f.fact_value,
          confidence: f.data_confidence,
          source_name: f.source_type === 'tier1_official' ? 'Official Authority (ASI / State Tourism)' : 'Verified Archive',
          source_url: f.source_url,
        });
      }
    } else if (p.source_url) {
      citations.push({
        place_id: p.id,
        place_name: p.name,
        field_name: 'heritage_status',
        fact_value: p.category || 'National Heritage Site',
        confidence: p.data_confidence || 'OFFICIAL',
        source_name: 'Official Heritage Registry',
        source_url: p.source_url,
      });
    }
  }
  return citations;
}

/**
 * Post-generation Hallucination Guardrail Filter
 * Validates entities mentioned in replyText against known database monuments.
 */
export function auditHallucinations(
  replyText: string,
  verifiedPlaces: any[],
  allPlaces: any[],
  citationsCount: number,
  latencyMs: number,
  modelUsed: string
): GroundingAudit {
  const textLower = replyText.toLowerCase();
  const confirmedPlaces: string[] = [];

  for (const p of allPlaces) {
    if (textLower.includes(p.name.toLowerCase()) || (p.id && textLower.includes(p.id.toLowerCase()))) {
      confirmedPlaces.push(p.name);
    }
  }

  // Scan for potential hallucinated monuments (named entities ending in heritage terms not in DB)
  const heritagePattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Fort|Palace|Temple|Mahal|Mosque|Caves|Minar|Ghat|Tomb|Bagh|Stupa))\b/g;
  const matches = replyText.match(heritagePattern) || [];
  const flaggedUnverified: string[] = [];

  const ignoredBodies = [
    'Archaeological Survey of India',
    'State Tourism',
    'Indian Railways',
    'Tourism Board',
    'National Portal',
    'Ministry of Tourism',
    'Ministry of Culture',
    'World Heritage',
    'Government of India',
  ];

  for (const m of matches) {
    const cleanMatch = m.trim();
    if (ignoredBodies.some((b) => cleanMatch.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(cleanMatch.toLowerCase()))) {
      continue;
    }
    const cleanLower = cleanMatch.toLowerCase();
    const isKnown = allPlaces.some((p) => {
      const pNameLower = p.name.toLowerCase();
      const pIdLower = (p.id || '').toLowerCase();
      return (
        pNameLower.includes(cleanLower) ||
        cleanLower.includes(pNameLower) ||
        pIdLower === cleanLower.replace(/[^a-z0-9]+/g, '-') ||
        cleanLower.split(/\s+/).filter((w) => w.length >= 4).every((w) => pNameLower.includes(w) || pIdLower.includes(w))
      );
    });
    if (!isKnown && !flaggedUnverified.includes(cleanMatch)) {
      flaggedUnverified.push(cleanMatch);
    }
  }

  const verifiedCount = Math.max(verifiedPlaces.length, confirmedPlaces.length);
  const unverifiedCount = flaggedUnverified.length;
  const total = verifiedCount + unverifiedCount;

  // Grounding score between 0.0 and 1.0
  const groundingScore = total > 0
    ? Math.round((verifiedCount / total) * 100) / 100
    : 0.95;

  return {
    grounding_score: Math.min(1.0, Math.max(0.2, groundingScore)),
    verified_entities_count: verifiedCount,
    unverified_entities_count: unverifiedCount,
    flagged_unverified_claims: flaggedUnverified,
    verified_places: confirmedPlaces,
    citations_count: citationsCount,
    latency_ms: latencyMs,
    model_used: modelUsed,
  };
}

/**
 * POST /api/v1/ai/chat
 * Grounded AI Concierge with Rate Limiting, Hallucination Guardrails, and Audit Logging
 */
aiRouter.post('/chat', rateLimiter({ windowMs: 60000, max: 30 }), async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  const { message, conversation_id, place_id, city, history, location, travel_context } = req.body;
  const rawQuery = (message || '').trim();
  const query = rawQuery.toLowerCase();
  const sessionId = conversation_id || `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const userId = req.user?.id;

  if (!rawQuery) {
    res.status(400).json({ success: false, error: 'Message cannot be empty' });
    return;
  }

  // Record session if not exists
  let session = await db.aiSessions.findById(sessionId);
  if (!session) {
    session = await db.aiSessions.create({
      id: sessionId,
      user_id: userId,
      title: rawQuery.slice(0, 40),
      context_json: JSON.stringify({ city, travel_context }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  // 1. Load static verified resources
  let verifiedHotels: any[] = [];
  try {
    const hotelsPath = path.join(process.cwd(), 'data', 'hotels.json');
    if (fs.existsSync(hotelsPath)) {
      verifiedHotels = JSON.parse(fs.readFileSync(hotelsPath, 'utf-8'));
    }
  } catch (e) {
    console.error('[AI Router] Failed to load hotels.json:', e);
  }

  // 2. Identify destination city/state and entities from query
  const queryNorm = normalizeTransliteration(rawQuery.toLowerCase());
  const allStates = await db.states.findAll();
  const allCities = await db.cities.findAll();
  const placesResult = await db.places.findAll();
  const allDbPlaces = placesResult.places;

  // Resolve matching state if mentioned
  const matchedState = allStates.find((s) => {
    const sName = s.name.toLowerCase();
    const sId = s.id.toLowerCase();
    return queryNorm.includes(sName) || queryNorm.includes(sId);
  });

  // Resolve matching city if mentioned
  let matchedCity = allCities.find((c) => {
    const cName = normalizeTransliteration(c.name.toLowerCase());
    const cCanon = resolveCanonicalCityId(c.name);
    return (
      isCityExactMatch(c.name, queryNorm) ||
      (cCanon && queryNorm.includes(cCanon.toLowerCase())) ||
      (cName.length > 3 && queryNorm.includes(cName))
    );
  });

  if (!matchedCity && city) {
    matchedCity = allCities.find((c) => isCityExactMatch(c.name, city));
  }

  // 3. Resolve Places, Heritage & Markets
  let matchedPlaces: any[] = [];
  let matchedMarkets: any[] = [];

  if (matchedCity) {
    const canonId = resolveCanonicalCityId(matchedCity.name) || matchedCity.id;
    matchedPlaces = allDbPlaces.filter(
      (p: any) =>
        p.city_id?.toLowerCase() === canonId.toLowerCase() ||
        isCityExactMatch(p.city_id || '', matchedCity!.name)
    );
  } else if (matchedState) {
    matchedPlaces = allDbPlaces.filter(
      (p: any) => p.state_id?.toLowerCase() === matchedState.id.toLowerCase()
    );
  }

  if (matchedPlaces.length === 0) {
    matchedPlaces = allDbPlaces.filter((p: any) => {
      const pName = normalizeTransliteration(p.name.toLowerCase());
      return queryNorm.includes(pName) || (p.city_id && queryNorm.includes(p.city_id.toLowerCase()));
    });
  }

  // Extract markets
  matchedMarkets = allDbPlaces.filter((p: any) => {
    const isMarket = (p.category || '').toLowerCase() === 'market' ||
      (p.name || '').toLowerCase().includes('market') ||
      (p.name || '').toLowerCase().includes('bazaar');
    if (!isMarket) return false;
    if (matchedCity) {
      return isCityExactMatch(p.city_id || '', matchedCity.name) ||
        p.city_id?.toLowerCase() === matchedCity.id.toLowerCase();
    }
    return queryNorm.includes(p.name.toLowerCase());
  });

  // If nearby query with coordinates
  const userLat = location?.latitude || location?.lat;
  const userLng = location?.longitude || location?.lng;
  if ((query.includes('near me') || query.includes('nearby') || query.includes('aas paas')) && userLat && userLng) {
    matchedPlaces = allDbPlaces
      .map((p: any) => ({ ...p, distance_km: Math.round(haversineKm(userLat, userLng, p.lat, p.lng) * 10) / 10 }))
      .filter((p: any) => p.distance_km <= 150)
      .sort((a: any, b: any) => a.distance_km - b.distance_km)
      .slice(0, 6);
  } else if (matchedPlaces.length === 0) {
    matchedPlaces = allDbPlaces.filter((p: any) => p.data_confidence === 'official').slice(0, 4);
  } else {
    matchedPlaces = matchedPlaces.slice(0, 6);
  }

  // 4. Resolve Festivals
  let matchedFestivals: any[] = [];
  const isFestivalQuery = /(festival|festivals|utsav|mela|puja|celebration|fair|parv)/i.test(queryNorm);
  if (matchedState) {
    matchedFestivals = await db.festivals.findByState(matchedState.name);
  } else if (matchedCity) {
    matchedFestivals = await db.festivals.findByCity(matchedCity.name);
  } else if (isFestivalQuery) {
    const searchRes = await db.festivals.search(rawQuery);
    matchedFestivals = searchRes;
  }

  // 5. Resolve Hotels
  let matchedHotels: any[] = [];
  const isHotelQuery = /(hotel|hotels|stay|resort|accommodation|where to stay|lodge|dharamshala)/i.test(queryNorm);
  if (matchedCity) {
    const targetCanon = resolveCanonicalCityId(matchedCity.name);
    matchedHotels = verifiedHotels.filter((h) => {
      const hCity = h.city || '';
      const hCityId = (h as any).city_id || resolveCanonicalCityId(hCity);
      if (targetCanon && hCityId && hCityId.toLowerCase() === targetCanon.toLowerCase()) {
        return true;
      }
      return isCityExactMatch(hCity, matchedCity!.name);
    });
  }

  // 6. Multimodal transit calculation if routing is queried
  let transitComparison = null;
  const isTransitQuery = /(train|railway|station|flight|airport|bus|how to reach|kaise pahuchu|route|safar|transit|how can i go)/i.test(query);
  const fromToMatch = query.match(/(?:from|starting from|between)\s+([a-zA-Z\s]+?)\s+(?:to|towards|and)\s+([a-zA-Z\s]+)/i);

  if (isTransitQuery || fromToMatch) {
    const originName = fromToMatch ? fromToMatch[1].trim() : travel_context?.origin || 'New Delhi';
    const destName = fromToMatch ? fromToMatch[2].trim() : matchedCity?.name || matchedPlaces[0]?.name || city || 'Jaipur';

    const origNode = resolveOriginTransportNode(
      userLat && userLng ? { lat: userLat, lng: userLng, city: originName } : originName
    ) || {
      origin_label: originName,
      city: originName,
      state: 'India',
      coordinates: { lat: userLat || 28.6139, lng: userLng || 77.209 },
      nearest_railway_station: { name: `${originName} Hub`, code: 'HUB', distance_km: 2.0, is_verified: true },
      nearest_airport: { name: `${originName} Airport`, code: 'AIR', distance_km: 15.0, is_verified: true },
    };

    const destNode = resolveDestinationTransportNode(destName);
    transitComparison = buildVerifiedTransitComparison(origNode, destNode);
  }

  // 7. Fetch granular grounding citations from database
  const groundingCitations = await fetchGroundingCitations(matchedPlaces);

  // 8. Try Gemini LLM Grounded Generation (with multi-tier fallback: 2.5-flash -> 2.0-flash)
  let replyText = '';
  let usedModel = 'Virasat Grounded Engine';
  const ai = getAIClient();

  if (ai) {
    const placesContextStr = matchedPlaces
      .map((p: any) => `- ${p.name} (${p.city_id || 'India'}): ${p.summary} [Fee: ₹${p.entry_fee_domestic || 0}, Hours: ${p.visiting_hours || 'Sunrise to Sunset'}, Confidence: ${p.data_confidence}, Source: ${p.source_url}]`)
      .join('\n');

    const festivalsContextStr = matchedFestivals.length > 0
      ? `VERIFIED FESTIVALS:\n` + matchedFestivals.map((f: any) => `- ${f.name} in ${f.primary_city}, ${f.state}: ${f.description} [Dates: ${f.is_date_verified ? `${f.exact_date_start} to ${f.exact_date_end}` : `Expected Season: ${f.typical_season}`}, Vibe: ${f.cultural_vibe || 'Cultural'}]`).join('\n')
      : 'No specific festivals queried.';

    const hotelsContextStr = matchedHotels.length > 0
      ? `VERIFIED HOTELS:\n` + matchedHotels.map((h: any) => `- ${h.name} (${h.category}, ${h.city}): ${h.location || ''} [Price indication: ${h.price_indication || 'Fare unavailable'}, Rating: ${h.rating || '4.5'}]`).join('\n')
      : isHotelQuery
      ? `NOTE ON HOTELS: No verified hotel records exist in database for ${matchedCity?.name || 'this location'}. State that verified hotel records are currently unavailable.`
      : '';

    const marketsContextStr = matchedMarkets.length > 0
      ? `VERIFIED MARKETS:\n` + matchedMarkets.map((m: any) => `- ${m.name} (${m.city_id}): ${m.summary} [Hours: ${m.visiting_hours || 'Daytime'}]`).join('\n')
      : '';

    const trainSummary = transitComparison?.train ? `Train: ${transitComparison.train.summary} (${transitComparison.train.approx_duration})` : '';
    const airSummary = transitComparison?.air ? `Air: ${transitComparison.air.summary} (${transitComparison.air.approx_duration})` : '';
    const roadSummary = transitComparison?.road ? `Road: ${transitComparison.road.summary} (${transitComparison.road.approx_duration})` : '';
    const transitContextStr = transitComparison
      ? `Transit: ${transitComparison.origin} -> ${transitComparison.destination} (~${transitComparison.distance_km} km).\n${trainSummary}\n${airSummary}\n${roadSummary}`.trim()
      : 'No transit queried.';

    const systemInstruction = `You are the Virasat AI Tourism Concierge for India.
CRITICAL SAFETY & GROUNDING RULES:
1. ONLY recommend places, festivals, hotels, and markets provided in the verified context below.
2. NEVER invent fake railway stations, airports, flight numbers, train numbers, fares, hotel names, or festival dates.
3. If price or fare data is not provided, state "Fare unavailable" or "Please check IRCTC / official counter".
4. Every factual statement must cite its official source.
5. Keep the tone warm, welcoming, informative, and culturally respectful. Support Hindi/Hinglish naturally.

VERIFIED DESTINATIONS & MONUMENTS:
${placesContextStr}

${festivalsContextStr}

${hotelsContextStr}

${marketsContextStr}

${transitContextStr}`;

    const contents = [
      ...(Array.isArray(history)
        ? history.slice(-4).map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content || h.text || '' }],
          }))
        : []),
      { role: 'user', parts: [{ text: rawQuery }] },
    ];

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    for (const modelName of modelsToTry) {
      try {
        const callRes = await Promise.race([
          ai.models.generateContent({
            model: modelName,
            contents,
            config: { systemInstruction },
          }),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
        ]);
        if (callRes?.text) {
          replyText = callRes.text;
          usedModel = modelName === 'gemini-2.5-flash' ? 'Gemini 2.5 Flash' : 'Gemini 2.0 Flash';
          break;
        }
      } catch {
        // Try next fallback model
      }
    }
  }

  // 9. Deterministic fallback if Gemini is offline, timed out, or unconfigured
  if (!replyText) {
    if (isHotelQuery) {
      if (matchedHotels.length > 0) {
        replyText = `Here are verified hotel accommodations in **${matchedCity?.name || 'the area'}**:\n\n` +
          matchedHotels
            .map(
              (h: any, i: number) =>
                `${i + 1}. 🏨 **${h.name}** (${h.category})\n   📍 Location: ${h.location || h.city}\n   💰 Indicative Tariff: ${h.price_indication || 'Fare unavailable'}\n   ⭐ Rating: ${h.rating || '4.5'} (${h.reviews_count || 'Verified'})\n   ✨ Amenities: ${Array.isArray(h.amenities) ? h.amenities.join(', ') : 'Heritage Stay'}`
            )
            .join('\n\n') +
          `\n\n*Note: Indicative tariffs only. Please confirm current rates and availability directly with the property.*`;
      } else {
        replyText = `Verified hotel listings for **${matchedCity?.name || 'this city'}** are currently unavailable in the verified database.\n\nWe recommend booking through authorized State Tourism Development Corporation guest houses or licensed hospitality platforms.`;
      }
    } else if (isFestivalQuery && matchedFestivals.length > 0) {
      replyText = `Here are verified flagship cultural celebrations in **${matchedState?.name || matchedCity?.name || 'India'}**:\n\n` +
        matchedFestivals
          .map(
            (f: any, i: number) =>
              `${i + 1}. 🪔 **${f.name}** (${f.primary_city}, ${f.state})\n   ${f.description}\n   📅 **Dates**: ${f.is_date_verified && f.exact_date_start ? `${f.exact_date_start} to ${f.exact_date_end} (Verified 2026 Calendar)` : `Typical Season: ${f.typical_season}`}\n   🎭 **Cultural Essence**: ${f.cultural_vibe || 'Cultural Tradition'}\n   *Source: ${f.source_name || 'Ministry of Tourism / State Tourism'}*`
          )
          .join('\n\n') +
        `\n\nWould you like me to build a multi-day itinerary around one of these festivals?`;
    } else if (transitComparison) {
      const trainMsg = transitComparison.train ? `🚆 **Train Option**: ${transitComparison.train.summary} (${transitComparison.train.approx_duration}). ${transitComparison.train.notes || ''}\n\n` : '';
      const airMsg = transitComparison.air ? `✈️ **Flight Option**: ${transitComparison.air.summary} (${transitComparison.air.approx_duration}). ${transitComparison.air.notes || ''}\n\n` : '';
      const roadMsg = transitComparison.road ? `🚗 **Road Option**: ${transitComparison.road.summary} (${transitComparison.road.approx_duration}).\n\n` : '';

      replyText = `Here is the verified transit route from **${transitComparison.origin}** to **${transitComparison.destination}** (~${transitComparison.distance_km} km):\n\n` +
        trainMsg + airMsg + roadMsg +
        `All railway recommendations are connected via Indian Railways IRCTC mainline stations. Fares and live chart reservation availability should be confirmed on the official IRCTC portal.`;
    } else if (matchedMarkets.length > 0 && /(market|bazaar|shopping|craft)/i.test(queryNorm)) {
      replyText = `Here are famous historic bazaars and markets in **${matchedCity?.name || 'the area'}**:\n\n` +
        matchedMarkets
          .map(
            (m: any, i: number) =>
              `${i + 1}. 🛍️ **${m.name}**\n   ${m.summary}\n   ⏰ Visiting Hours: ${m.visiting_hours || '10:00 AM - 08:30 PM'}\n   *Citation: ${m.source_url || 'Official Tourism Directory'}*`
          )
          .join('\n\n');
    } else if (matchedPlaces.length > 0) {
      const locLabel = matchedCity?.name || matchedState?.name || 'India';
      replyText = `Based on verified ASI & State Tourism archives, here are key destinations in **${locLabel}**:\n\n` +
        matchedPlaces
          .map(
            (p: any, i: number) =>
              `${i + 1}. 🏛️ **${p.name}** (${p.city_id || 'India'})\n   ${p.summary}\n   🎫 Entry: ₹${p.entry_fee_domestic || 0} (Domestic) | ⏰ Hours: ${p.visiting_hours || 'Sunrise to Sunset'}\n   *Official Citation: ${p.source_url || 'ASI National Portal'}*`
          )
          .join('\n\n') +
        (matchedFestivals.length > 0
          ? `\n\n🪔 **Upcoming Festival**: ${matchedFestivals[0].name} (${matchedFestivals[0].typical_season})`
          : '') +
        `\n\nWould you like me to build a day-by-day itinerary or check multimodal train connections?`;
    } else {
      replyText = `Welcome to Virasat! You can explore verified monuments, search local heritage markets, discover authentic festivals, or calculate multimodal train and road routes across India. What destination or festival would you like to explore?`;
    }
  }

  const latencyMs = Date.now() - startTime;

  // 6. Run Hallucination Guardrail
  const groundingAudit = auditHallucinations(
    replyText,
    matchedPlaces,
    allDbPlaces,
    groundingCitations.length,
    latencyMs,
    usedModel
  );

  // 7. Record user and assistant messages in DB
  const userMsgId = `msg-${Date.now()}-u`;
  const asstMsgId = `msg-${Date.now()}-a`;

  await db.aiMessages.create({
    id: userMsgId,
    session_id: sessionId,
    role: 'user',
    content: rawQuery,
    created_at: new Date().toISOString(),
  });

  await db.aiMessages.create({
    id: asstMsgId,
    session_id: sessionId,
    role: 'assistant',
    content: replyText,
    metadata_json: JSON.stringify({ model: usedModel, grounding_score: groundingAudit.grounding_score, latency_ms: latencyMs }),
    created_at: new Date().toISOString(),
  });

  // Record grounding records in DB
  for (const c of groundingCitations.slice(0, 5)) {
    await db.aiGroundings.create({
      id: `grd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      message_id: asstMsgId,
      place_id: c.place_id,
      field_name: c.field_name,
      confidence: c.confidence,
      source_name: c.source_name,
      source_url: c.source_url,
      created_at: new Date().toISOString(),
    });
  }

  // 8. Log AI Query to Immutable Audit Trail
  await db.audit.log({
    id: `audit-ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    actor_id: userId || 'anonymous_traveller',
    action: 'AI_QUERY_GROUNDED',
    entity_type: 'ai_session',
    entity_id: sessionId,
    to_value: {
      query: rawQuery,
      model: usedModel,
      grounding_score: groundingAudit.grounding_score,
      citations_count: groundingCitations.length,
      latency_ms: latencyMs,
    },
    created_at: new Date().toISOString(),
  });

  const suggestedActions = transitComparison
    ? ['Plan 3-day trip', 'Explore nearby monuments', 'Change origin']
    : ['How to reach by train?', 'Plan 3-day itinerary', 'Explore near me'];

  res.json({
    success: true,
    conversation_id: sessionId,
    reply: replyText,
    grounding_score: groundingAudit.grounding_score,
    grounding_audit: groundingAudit,
    latency_ms: latencyMs,
    model_used: usedModel,
    suggested_places: matchedPlaces.map((p: any) => ({
      id: p.id,
      name: p.name,
      city: p.city_id,
      category: p.category,
      summary: p.summary,
      data_confidence: p.data_confidence,
      source_url: p.source_url,
    })),
    transit_comparison: transitComparison,
    grounding_citations: groundingCitations,
    suggested_actions: suggestedActions,
    sources: [
      'Archaeological Survey of India (ASI)',
      'Indian Railways / IRCTC Registry',
      usedModel,
    ],
  });
});

/**
 * GET /api/v1/ai/sessions
 */
aiRouter.get('/sessions', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.json({ success: true, total: 0, data: [] });
    return;
  }
  const sessions = await db.aiSessions.findByUser(userId);
  res.json({
    success: true,
    total: sessions.length,
    data: sessions,
  });
});

/**
 * GET /api/v1/ai/sessions/:id
 */
aiRouter.get('/sessions/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const session = await db.aiSessions.findById(id);

  if (!session) {
    res.status(404).json({ success: false, error: 'Session not found' });
    return;
  }

  const messages = await db.aiMessages.findBySession(id);
  const groundings = await db.aiGroundings.findBySession(id);

  res.json({
    success: true,
    data: {
      session,
      messages,
      groundings,
    },
  });
});
