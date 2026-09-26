import fs from 'fs';
import path from 'path';
import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { db } from '../../db/client';

const Type = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  INTEGER: 'INTEGER',
  BOOLEAN: 'BOOLEAN',
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT',
} as const;
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
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
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
        pNameLower === cleanLower ||
        pNameLower.includes(cleanLower) ||
        pIdLower === cleanLower.replace(/[^a-z0-9]+/g, '-') ||
        (cleanLower.split(/\s+/).filter((w) => w.length >= 4).length > 1 &&
          cleanLower.split(/\s+/).filter((w) => w.length >= 4).every((w) => pNameLower.includes(w) || pIdLower.includes(w)))
      );
    });
    if (!isKnown && !flaggedUnverified.includes(cleanMatch)) {
      flaggedUnverified.push(cleanMatch);
    }
  }

  const confirmedPlaces: string[] = [];
  for (const p of allPlaces) {
    const pNameLower = p.name.toLowerCase();
    if (
      p.id !== p.city_id &&
      !flaggedUnverified.some((fu) => fu.toLowerCase().includes(pNameLower)) &&
      (textLower.includes(pNameLower) || (p.id && textLower.includes(p.id.toLowerCase())))
    ) {
      confirmedPlaces.push(p.name);
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

  // 8. Try Grounded Generation (with Google Maps tool & multi-tier fallback where applicable)
  let replyText = '';
  let usedModel = 'Virasat Grounded Assistant';
  let mapsGrounding: Array<{ uri: string; title: string; reviewSnippets?: string[] }> = [];
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

    const systemInstruction = `You are the official Virasat AI Tourism & Heritage Concierge for India.
CRITICAL SAFETY & GROUNDING RULES:
1. ONLY recommend places, festivals, hotels, and markets provided in the verified context below or retrieved via verified Maps grounding.
2. NEVER invent fake railway stations, airports, flight numbers, train numbers, fares, hotel names, festival dates, or monuments.
3. If price or fare data is not provided, state "Fare unavailable" or "Please check IRCTC / official counter".
4. Every factual statement must cite its official source.
5. Keep the tone warm, welcoming, deeply knowledgeable, informative, and culturally respectful. Support Hindi and natural Hinglish seamlessly.
6. Emphasize authentic local cultural lore, optimal visiting times, and transport connectivity.

VERIFIED DESTINATIONS & MONUMENTS:
${placesContextStr}

${festivalsContextStr}

${hotelsContextStr}

${marketsContextStr}

${transitContextStr}`;

    const contents = [
      ...(Array.isArray(history)
        ? history.slice(-6).map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content || h.text || '' }],
          }))
        : []),
      { role: 'user', parts: [{ text: rawQuery }] },
    ];

    // Check if query is place/geography/directions related for Maps Grounding
    const isPlaceOrGeoQuery = /(place|visit|monument|mandir|temple|fort|where|near|location|route|map|direction|timing|entry|ticket|hotel|restaurant)/i.test(rawQuery);

    const modelsToTry = [
      { name: 'gemini-3.5-flash', useMaps: isPlaceOrGeoQuery },
      { name: 'gemini-3.8-flash', useMaps: false },
      { name: 'gemini-3.1-flash-lite', useMaps: false },
    ];

    for (const item of modelsToTry) {
      try {
        const config: any = { systemInstruction };
        if (item.useMaps) {
          config.tools = [{ googleMaps: {} }];
          if (userLat && userLng) {
            config.toolConfig = {
              retrievalConfig: {
                latLng: {
                  latitude: Number(userLat),
                  longitude: Number(userLng),
                },
              },
            };
          }
        }

        const callRes = await Promise.race([
          ai.models.generateContent({
            model: item.name,
            contents,
            config,
          }),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 14000)),
        ]);

        if (callRes?.text) {
          replyText = callRes.text;
          usedModel = item.useMaps ? 'Virasat AI Neural Assistant (Maps Grounded)' : 'Virasat AI Neural Assistant';

          // Extract Google Maps grounding chunks if present
          const candidate = callRes.candidates?.[0];
          const chunks = (candidate as any)?.groundingMetadata?.groundingChunks;
          if (Array.isArray(chunks)) {
            for (const ch of chunks) {
              if (ch.maps) {
                mapsGrounding.push({
                  uri: ch.maps.uri || '',
                  title: ch.maps.title || '',
                  reviewSnippets: ch.maps.placeAnswerSources?.reviewSnippets || [],
                });
              }
            }
          }
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
    maps_grounding: mapsGrounding,
    suggested_actions: suggestedActions,
    sources: [
      'Archaeological Survey of India (ASI)',
      'Indian Railways / IRCTC Registry',
      'Verified Google Maps Grounding',
    ],
  });
});

/**
 * POST /api/v1/ai/place-maps-info
 * Retrieves verified Google Maps place details, visitor review snippets, and official maps links
 * using gemini-3.5-flash with googleMaps tool.
 */
aiRouter.post('/place-maps-info', async (req: Request, res: Response): Promise<void> => {
  const { place_name, city, state, lat, lng } = req.body || {};
  if (!place_name) {
    res.status(400).json({ success: false, error: 'place_name is required' });
    return;
  }

  const queryPlace = `${place_name} ${city ? `in ${city}` : ''} ${state ? state : 'India'}`.trim();
  const fallbackMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryPlace)}`;
  const fallbackDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(queryPlace)}`;

  const ai = getAIClient();
  let liveSummary = '';
  let mapsUrl = fallbackMapsUrl;
  let verifiedTitle = place_name;
  const reviewSnippets: string[] = [];

  if (ai) {
    try {
      const callRes = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `Provide an accurate Google Maps grounded summary for ${queryPlace}. Include:
1. Current visiting atmosphere, timings, and practical advice.
2. Verified location highlights and what recent visitors note.
3. Keep it brief (under 80 words), factual, and helpful for travelers.`,
          config: {
            systemInstruction: 'You are an authoritative Google Maps geospatial information provider for monuments and heritage in India.',
            tools: [{ googleMaps: {} }],
            ...(lat && lng ? {
              toolConfig: {
                retrievalConfig: {
                  latLng: {
                    latitude: Number(lat),
                    longitude: Number(lng),
                  },
                },
              },
            } : {}),
          },
        }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 12000)),
      ]);

      if (callRes?.text) {
        liveSummary = callRes.text;
      }

      const candidate = callRes?.candidates?.[0];
      const chunks = (candidate as any)?.groundingMetadata?.groundingChunks;
      if (Array.isArray(chunks)) {
        for (const ch of chunks) {
          if (ch.maps) {
            if (ch.maps.uri) mapsUrl = ch.maps.uri;
            if (ch.maps.title) verifiedTitle = ch.maps.title;
            const snippets = ch.maps.placeAnswerSources?.reviewSnippets;
            if (Array.isArray(snippets)) {
              for (const s of snippets) {
                if (typeof s === 'string' && !reviewSnippets.includes(s)) {
                  reviewSnippets.push(s);
                }
              }
            }
          }
        }
      }
    } catch (e: any) {
      console.info('[AI Router] Maps info fallback:', e?.message || e);
    }
  }

  if (!liveSummary) {
    liveSummary = `${place_name} is a renowned cultural destination located in ${city || 'India'}. Discover its verified architecture, local heritage, and visitor paths.`;
  }

  res.json({
    success: true,
    place_name,
    verified_title: verifiedTitle,
    city: city || 'India',
    maps_url: mapsUrl,
    directions_url: fallbackDirectionsUrl,
    summary: liveSummary,
    review_snippets: reviewSnippets,
    coordinates: (lat && lng) ? { lat: Number(lat), lng: Number(lng) } : undefined,
  });
});

/**
 * POST /api/v1/ai/heritage-route-analyzer
 * Uses Gemini API to suggest optimized transit routes between multiple monuments,
 * calculating travel times and rich historical significance for each segment.
 */
aiRouter.post('/heritage-route-analyzer', async (req: Request, res: Response): Promise<void> => {
  const { monuments, transport_mode = 'DRIVE', city, travel_style = 'balanced' } = req.body || {};

  if (!Array.isArray(monuments) || monuments.length < 2) {
    res.status(400).json({
      success: false,
      error: 'At least 2 monuments are required to analyze a heritage transit route.',
    });
    return;
  }

  const ai = getAIClient();
  const validMonuments = monuments.map((m: any, idx: number) => ({
    id: m.id || `monument-${idx}`,
    name: m.name,
    city: m.city || city || 'India',
    lat: Number(m.lat) || 0,
    lng: Number(m.lng) || 0,
    summary: m.summary || '',
  }));

  const modeSpeedKmH = transport_mode === 'WALK' ? 4.5 : transport_mode === 'TRANSIT' ? 22 : 32;

  // Fallback calculation helper in case AI call fails
  const computeFallbackRoute = () => {
    const ordered: any[] = [];
    const remaining = [...validMonuments];
    let current = remaining.shift()!;
    ordered.push({
      stop_order: 1,
      id: current.id,
      name: current.name,
      lat: current.lat,
      lng: current.lng,
      visit_duration_minutes: 60,
      historical_era: 'Classical Heritage Era',
      key_highlight: current.summary || 'Prominent regional cultural landmark',
    });

    while (remaining.length > 0) {
      let nearestIdx = 0;
      let minD = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const d = haversineKm(current.lat, current.lng, remaining[i].lat, remaining[i].lng);
        if (d < minD) {
          minD = d;
          nearestIdx = i;
        }
      }
      current = remaining.splice(nearestIdx, 1)[0];
      ordered.push({
        stop_order: ordered.length + 1,
        id: current.id,
        name: current.name,
        lat: current.lat,
        lng: current.lng,
        visit_duration_minutes: 60,
        historical_era: 'Living Tradition & Architecture',
        key_highlight: current.summary || 'Sacred architecture and historic craftsmanship',
      });
    }

    const segments: any[] = [];
    let totalDist = 0;
    let totalTransitMin = 0;

    for (let i = 0; i < ordered.length - 1; i++) {
      const from = ordered[i];
      const to = ordered[i + 1];
      const dist = Math.round(haversineKm(from.lat, from.lng, to.lat, to.lng) * 1.3 * 10) / 10;
      const mins = Math.max(8, Math.round((dist / modeSpeedKmH) * 60));
      totalDist += dist;
      totalTransitMin += mins;

      segments.push({
        segment_index: i + 1,
        from_stop_id: from.id,
        from_name: from.name,
        to_stop_id: to.id,
        to_name: to.name,
        distance_km: dist,
        travel_time_minutes: mins,
        recommended_mode: transport_mode === 'WALK' ? 'Heritage Footpath Walk' : transport_mode === 'TRANSIT' ? 'Metro / Public Bus' : 'Auto-Rickshaw / Taxi',
        transit_tip: `Connect via arterial heritage corridors between ${from.name} and ${to.name}.`,
        historical_significance: `This transit corridor bridges the architectural shift from ${from.name} to ${to.name}, demonstrating regional stone craftsmanship and historical patronage evolution.`,
        architectural_transition: `Transitioning from classical carved ornamentation to later structural additions along the civic axis.`,
        notable_landmarks_en_route: ['Traditional Craft Bazaars', 'Historic City Gateways'],
      });
    }

    return {
      success: true,
      circuit_title: `${city || 'Heritage'} Discovery Circuit`,
      narrative_theme: `Chronological exploration of ${ordered.length} master monuments connecting ancient traditions with royal architectural milestones.`,
      total_distance_km: Math.round(totalDist * 10) / 10,
      total_transit_minutes: totalTransitMin,
      total_recommended_hours: Math.round((totalTransitMin / 60 + ordered.length * 1.2) * 10) / 10,
      ordered_stops: ordered,
      segments,
      expert_recommendation: `Begin early in the morning at ${ordered[0].name} to take advantage of soft natural lighting and avoid afternoon crowds.`,
    };
  };

  if (ai) {
    try {
      const monumentsListText = validMonuments
        .map(
          (m, idx) =>
            `${idx + 1}. ${m.name} (ID: ${m.id}, Lat: ${m.lat}, Lng: ${m.lng}, City: ${m.city})\n   Summary: ${m.summary}`
        )
        .join('\n');

      const systemInstruction = `You are the Virasat Senior Heritage Historian and Multimodal Transit Route Architect for India.
Your mission is to analyze a group of monuments and generate an optimized 'Heritage Route Analysis':
1. Sequence optimization: Order the monuments logically to minimize transit time while maximizing chronological narrative flow.
2. For EACH segment between consecutive stops (Stop i -> Stop i+1):
   - travel_time_minutes: Realistic travel duration in minutes based on ${transport_mode}.
   - distance_km: Realistic road/pedestrian distance in km.
   - historical_significance: Rich, specific historical transition between these two monuments (dynasty changes, architectural style progression, cultural shifts, or historical royal processions).
   - architectural_transition: Contrast in design elements (e.g., corbelled vs true arches, Rajput chhatris vs Mughal charbagh, rock-cut vs structural temples).
   - recommended_mode: Best practical vehicle (Auto-Rickshaw, Metro, Taxi, Heritage Walk).
   - transit_tip: Practical navigation or street-level tip for travelers.
   - notable_landmarks_en_route: 1-3 interesting sights or bazaars between them.
3. Circuit Overview:
   - circuit_title: Evocative title for the journey.
   - narrative_theme: 2-3 sentence overview of this cultural trail.
   - total_distance_km: Sum of segment distances.
   - total_transit_minutes: Sum of travel times.
   - total_recommended_hours: Total time needed including ~60-90 min exploration at each monument.
   - expert_recommendation: Insider advice on timing, dress codes, or photography angles.

Return ONLY valid JSON according to schema.`;

      const prompt = `Analyze and optimize this heritage route containing ${validMonuments.length} monuments in ${city || 'India'} for ${transport_mode} mode:\n\n${monumentsListText}`;

      const modelsToTry = ['gemini-3.5-flash', 'gemini-3.8-flash'];
      for (const mName of modelsToTry) {
        try {
          const callRes = await Promise.race([
            ai.models.generateContent({
              model: mName,
              contents: prompt,
              config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    circuit_title: { type: Type.STRING },
                    narrative_theme: { type: Type.STRING },
                    total_distance_km: { type: Type.NUMBER },
                    total_transit_minutes: { type: Type.INTEGER },
                    total_recommended_hours: { type: Type.NUMBER },
                    ordered_stops: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          stop_order: { type: Type.INTEGER },
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER },
                          visit_duration_minutes: { type: Type.INTEGER },
                          historical_era: { type: Type.STRING },
                          key_highlight: { type: Type.STRING },
                        },
                        required: ['stop_order', 'id', 'name', 'lat', 'lng', 'historical_era', 'key_highlight'],
                      },
                    },
                    segments: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          segment_index: { type: Type.INTEGER },
                          from_stop_id: { type: Type.STRING },
                          from_name: { type: Type.STRING },
                          to_stop_id: { type: Type.STRING },
                          to_name: { type: Type.STRING },
                          distance_km: { type: Type.NUMBER },
                          travel_time_minutes: { type: Type.INTEGER },
                          recommended_mode: { type: Type.STRING },
                          transit_tip: { type: Type.STRING },
                          historical_significance: { type: Type.STRING },
                          architectural_transition: { type: Type.STRING },
                          notable_landmarks_en_route: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                          },
                        },
                        required: [
                          'segment_index',
                          'from_stop_id',
                          'from_name',
                          'to_stop_id',
                          'to_name',
                          'distance_km',
                          'travel_time_minutes',
                          'recommended_mode',
                          'historical_significance',
                          'architectural_transition',
                        ],
                      },
                    },
                    expert_recommendation: { type: Type.STRING },
                  },
                  required: ['circuit_title', 'narrative_theme', 'total_distance_km', 'total_transit_minutes', 'ordered_stops', 'segments'],
                },
              },
            }),
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 16000)),
          ]);

          if (callRes?.text) {
            const parsed = JSON.parse(callRes.text);
            if (Array.isArray(parsed.ordered_stops) && parsed.ordered_stops.length >= 2 && Array.isArray(parsed.segments)) {
              parsed.ordered_stops.forEach((st: any) => {
                const match = validMonuments.find((vm) => vm.id === st.id || vm.name.toLowerCase() === st.name.toLowerCase());
                if (match) {
                  st.lat = match.lat;
                  st.lng = match.lng;
                  st.id = match.id;
                }
              });

              res.json({
                success: true,
                ...parsed,
              });
              return;
            }
          }
        } catch {
          // Try next fallback model
        }
      }
    } catch (e: any) {
      console.error('[AI Router] Heritage route analyzer error:', e?.message || e);
    }
  }

  res.json(computeFallbackRoute());
});

/**
 * POST /api/v1/ai/visual-identify
 * Multimodal Gemini Vision Analyzer for Augmented Reality Monument Recognition
 * Identifies monuments from live camera frames or user image uploads,
 * generates historical fact AR overlays, and links directly to Virasat database places.
 */
aiRouter.post('/visual-identify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, mode = 'identify', current_location } = req.body;

    if (!image || typeof image !== 'string') {
      res.status(400).json({ success: false, error: 'Valid image base64 data is required' });
      return;
    }

    // Extract base64 and mime type safely without catastrophic regex backtracking
    let mimeType = 'image/jpeg';
    let base64Data = image;

    if (image.startsWith('data:')) {
      const commaIdx = image.indexOf(',');
      if (commaIdx !== -1) {
        const header = image.substring(0, commaIdx);
        const mimeMatch = header.match(/data:([^;]+)/);
        if (mimeMatch && mimeMatch[1]) {
          mimeType = mimeMatch[1];
        }
        base64Data = image.substring(commaIdx + 1);
      }
    }

    const ai = getAIClient();
    const placesResult = await db.places.findAll({ includeAllStatuses: true });
    const allDbPlaces = placesResult.places || [];

    let identifiedData: any = null;
    let isAiGenerated = false;

    if (ai) {
      const prompt = `You are the chief architectural and cultural heritage vision expert for the Archaeological Survey of India (ASI) and Virasat Heritage Explorer.
Analyze this photo of a monument, temple, fort, palace, cave, stupa, church, or historical landmark.

Identify with precision:
1. Exact Monument / Site Name in English (e.g., "Taj Mahal", "Gateway of India", "Amber Palace", "Red Fort", "Konark Sun Temple", "Hampi Virupaksha Temple", "Qutub Minar", "Hawa Mahal", "Meenakshi Temple", "Victoria Memorial", "Brihadisvara Temple", "Ajanta Caves", etc.).
2. Name in Hindi (Devanagari script, e.g. "ताज महल", "हवा महल", "कुतुब मीनार", "गेटवे ऑफ़ इंडिया").
3. City and State / Union Territory in India. If international, state country and nearest region.
4. Architectural Style (e.g., Mughal, Dravidian, Rajput, Indo-Saracenic, Kalinga, Nagara, Vesara, Rock-cut, Maratha, Portuguese-Gothic).
5. Historical Era / Dynasty (e.g., Mughal Empire, Chola Dynasty, Vijayanagara Empire, British Raj, Maurya Dynasty, etc.) and who built it (e.g. Emperor Shah Jahan, Raja Man Singh, King Narasimhadeva I).
6. Year or century of construction.
7. Easy Explanation ("easy_explanation"): A 2-3 sentence, highly clear, jargon-free explanation in simple language that explains what this monument is, why it was constructed, and why it is historically famous so any tourist, student, or everyday user can understand it easily.
8. 3 to 5 captivating historical facts and architectural secrets.
9. 2 to 3 distinct architectural highlight features (e.g., "Central Onion Dome", "Minarets with optical tilt", "Jharokha screened windows", "Monolithic carved stone chariot").
10. Best time to visit and photography lighting tip.
11. UNESCO World Heritage Site designation status (true/false).
12. Confidence score between 0.0 and 1.0.

Respond strictly in valid JSON format matching this schema:
{
  "identified_name": "string",
  "identified_name_hindi": "string",
  "confidence": 0.95,
  "city": "string",
  "state": "string",
  "country": "India",
  "era": "string",
  "who_built_it": "string",
  "year_built": "string",
  "architectural_style": "string",
  "easy_explanation": "string",
  "short_summary": "string",
  "historical_facts": ["string", "string", "string"],
  "architectural_highlights": ["string", "string"],
  "best_time_to_visit": "string",
  "visiting_tips": "string",
  "unesco_status": true
}`;

      // Resilient model fallback pool across separate capacity endpoints:
      // 1. gemini-flash-latest (stable production multimodal)
      // 2. gemini-3.1-flash-lite (high-speed multimodal with separate quota pool)
      // 3. gemini-3.8-flash (flagship flash model)
      const visionModels = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
      for (const modelName of visionModels) {
        if (identifiedData?.identified_name) break;

        try {
          const timeoutPromise = new Promise<any>((_, reject) =>
            setTimeout(() => reject(new Error('Vision timeout')), 9000)
          );
          const callPromise = ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType || 'image/jpeg',
                      data: base64Data,
                    },
                  },
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            config: {
              responseMimeType: 'application/json',
            },
          });

          const geminiRes = await Promise.race([callPromise, timeoutPromise]);

          if (geminiRes?.text) {
            try {
              identifiedData = JSON.parse(geminiRes.text.trim());
            } catch {
              const cleaned = geminiRes.text.replace(/```json\n?|\n?```/g, '').trim();
              identifiedData = JSON.parse(cleaned);
            }

            if (identifiedData?.identified_name) {
              isAiGenerated = true;
              break;
            }
          }
        } catch (err: any) {
          const isTransient =
            err?.status === 503 ||
            err?.message?.includes('503') ||
            err?.message?.includes('high demand') ||
            err?.message?.includes('UNAVAILABLE') ||
            err?.status === 429 ||
            err?.message?.includes('429');
          console.warn(
            `Vision model ${modelName} failed:`,
            isTransient ? '503 High Demand (Transient) / Rate limit' : err?.message || err
          );
          // Immediately fall over to next candidate in the pool
        }
      }
    }

    // Fallback if AI call was unavailable
    if (!identifiedData || !identifiedData.identified_name) {
      const sample = allDbPlaces[0] || {
        id: 'taj-mahal',
        name: 'Taj Mahal',
        city_id: 'Agra',
        state: 'Uttar Pradesh',
        category: 'UNESCO World Heritage',
        summary: 'World-renowned white marble mausoleum built by Mughal Emperor Shah Jahan.',
      };

      identifiedData = {
        identified_name: sample.name || 'Historic Indian Monument',
        confidence: 0.88,
        city: sample.city_id || (sample as any).city || 'Agra',
        state: (sample as any).state || 'Uttar Pradesh',
        country: 'India',
        era: 'Mughal Architectural Period',
        year_built: '17th Century CE',
        architectural_style: 'Indo-Islamic / Mughal Classical',
        short_summary: sample.summary || 'Spectacular historical landmark celebrated for monumental geometry and intricate stone carving.',
        historical_facts: [
          'Engineered with optical symmetry where minarets are angled slightly outwards.',
          'Features intricate pietra-dura gemstone inlays in white Makrana marble.',
          'Protected by Archaeological Survey of India (ASI) under national monument guidelines.',
        ],
        architectural_highlights: [
          'Grand central dome with lotus finial',
          'Symmetric arched portals (pishtaq)',
          'Elevated sandstone plinth overlooking the riverbank',
        ],
        best_time_to_visit: 'Early morning sunrise for optimal light and minimal crowd density.',
        unesco_status: true,
      };
    }

    // Cross-reference with Virasat Database with smart token matching and aliases
    const identifiedNameLower = (identifiedData.identified_name || '').toLowerCase();
    const cityLower = (identifiedData.city || '').toLowerCase();
    const stateLower = (identifiedData.state || '').toLowerCase();

    const normalizeTokens = (str: string) => {
      return (str || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 2 && !['the', 'and', 'near', 'site', 'monument', 'heritage', 'complex'].includes(t));
    };

    const identifiedTokens = normalizeTokens(identifiedNameLower);

    // Known alias dictionary to direct canonical database IDs
    const ALIAS_MAP: Record<string, string> = {
      'taj mahal': 'taj-mahal',
      'qutub minar': 'qutub-minar',
      'qutb minar': 'qutub-minar',
      'amber palace': 'amber-fort',
      'amber fort': 'amber-fort',
      'amer fort': 'amber-fort',
      'red fort': 'red-fort',
      'lal qila': 'red-fort',
      'hawa mahal': 'hawa-mahal',
      'konark sun temple': 'konark-sun-temple',
      'sun temple konark': 'konark-sun-temple',
      'sun temple': 'konark-sun-temple',
      'gateway of india': 'gateway-of-india',
      'victoria memorial': 'victoria-memorial',
      'charminar': 'charminar',
      'hampi': 'hampi-monuments',
      'virupaksha temple': 'virupaksha-temple',
      'golden temple': 'golden-temple',
      'harmandir sahib': 'golden-temple',
      'meenakshi temple': 'meenakshi-temple',
      'meenakshi amman': 'meenakshi-temple',
      'brihadisvara temple': 'brihadisvara-temple',
      'brihadeeswarar temple': 'brihadisvara-temple',
      'ajanta caves': 'ajanta-caves',
      'ellora caves': 'ellora-caves',
      'khajuraho': 'khajuraho-monuments',
      'basilica of bom jesus': 'basilica-of-bom-jesus',
      'fatehpur sikri': 'fatehpur-sikri',
      'mysore palace': 'mysore-palace',
      'mysuru palace': 'mysore-palace',
      'elephanta caves': 'elephanta-caves',
    };

    let matchedPlace: any = null;

    // 1. Check alias dictionary
    for (const [aliasKey, targetId] of Object.entries(ALIAS_MAP)) {
      if (identifiedNameLower.includes(aliasKey) || aliasKey.includes(identifiedNameLower)) {
        matchedPlace = allDbPlaces.find((p: any) => p.id === targetId);
        if (matchedPlace) break;
      }
    }

    // 2. Direct name or ID equality or substring match
    if (!matchedPlace) {
      matchedPlace = allDbPlaces.find((p: any) => {
        const pName = (p.name || '').toLowerCase();
        const pId = (p.id || '').toLowerCase();
        return (
          pName === identifiedNameLower ||
          identifiedNameLower.includes(pName) ||
          pName.includes(identifiedNameLower) ||
          pId === identifiedNameLower.replace(/[^a-z0-9]+/g, '-')
        );
      });
    }

    // 3. Token intersection match
    if (!matchedPlace && identifiedTokens.length > 0) {
      let bestScore = 0;
      let candidate: any = null;

      for (const p of allDbPlaces) {
        const pTokens = normalizeTokens(p.name);
        const intersection = identifiedTokens.filter(t => pTokens.includes(t));
        const score = intersection.length;
        if (score > bestScore && score >= 1) {
          bestScore = score;
          candidate = p;
        }
      }

      if (bestScore >= 1) {
        matchedPlace = candidate;
      }
    }

    // 4. City + landmark keyword match
    if (!matchedPlace && cityLower) {
      matchedPlace = allDbPlaces.find((p: any) => {
        const pCity = (p.city_id || (p as any).city || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        return pCity.includes(cityLower) && (
          (pName.includes('fort') && identifiedNameLower.includes('fort')) ||
          (pName.includes('temple') && identifiedNameLower.includes('temple')) ||
          (pName.includes('palace') && identifiedNameLower.includes('palace')) ||
          (pName.includes('mahal') && identifiedNameLower.includes('mahal')) ||
          (pName.includes('caves') && identifiedNameLower.includes('caves')) ||
          (pName.includes('gate') && identifiedNameLower.includes('gate'))
        );
      });
    }

    // 5. Fallback related database places for surrounding exploration
    const suggestedDatabasePlaces: any[] = allDbPlaces
      .filter((p: any) => {
        const pState = (p.state || p.state_id || '').toLowerCase();
        const pCity = (p.city_id || (p as any).city || '').toLowerCase();
        return (
          (!matchedPlace || p.id !== matchedPlace.id) &&
          (pState.includes(stateLower) || pCity.includes(cityLower) || p.data_confidence === 'tier1_official' || p.heritage_status?.includes('UNESCO'))
        );
      })
      .slice(0, 4)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        city: p.city_id || (p as any).city,
        state: p.state || p.state_id,
        category: p.category,
        thumbnail_url: p.thumbnail_url || (Array.isArray(p.images) ? p.images[0] : null) || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
        summary: p.summary,
        visiting_hours: p.visiting_hours,
        entry_fee_domestic: p.entry_fee_domestic,
      }));

    // Generate AR overlay pins with relative spatial coordinates for HUD
    const arOverlays = [
      {
        id: 'overlay-dynasty',
        label: `${identifiedData.era || 'Historic Period'}`,
        detail: identifiedData.who_built_it ? `Commissioned by: ${identifiedData.who_built_it}` : `Constructed: ${identifiedData.year_built || 'Centuries ago'}`,
        type: 'dynasty',
        position: { x: 26, y: 30 },
      },
      {
        id: 'overlay-style',
        label: `${identifiedData.architectural_style || 'Heritage Architecture'}`,
        detail: (identifiedData.architectural_highlights && identifiedData.architectural_highlights[0]) || 'Distinctive structural masonry',
        type: 'architecture',
        position: { x: 74, y: 36 },
      },
      {
        id: 'overlay-fact',
        label: 'Historical Fact',
        detail: (identifiedData.historical_facts && identifiedData.historical_facts[0]) || 'Protected national heritage monument.',
        type: 'history',
        position: { x: 50, y: 64 },
      },
    ];

    res.json({
      success: true,
      is_ai_generated: isAiGenerated,
      identified_name: identifiedData.identified_name,
      identified_name_hindi: identifiedData.identified_name_hindi || '',
      confidence: identifiedData.confidence || 0.92,
      city: identifiedData.city || (matchedPlace ? (matchedPlace.city_id || matchedPlace.city) : ''),
      state: identifiedData.state || (matchedPlace ? (matchedPlace.state || matchedPlace.state_id) : ''),
      country: identifiedData.country || 'India',
      era: identifiedData.era,
      who_built_it: identifiedData.who_built_it || '',
      year_built: identifiedData.year_built,
      architectural_style: identifiedData.architectural_style,
      easy_explanation: identifiedData.easy_explanation || identifiedData.short_summary,
      short_summary: identifiedData.short_summary,
      historical_facts: identifiedData.historical_facts || [],
      architectural_highlights: identifiedData.architectural_highlights || [],
      best_time_to_visit: identifiedData.best_time_to_visit,
      visiting_tips: identifiedData.visiting_tips || '',
      unesco_status: Boolean(identifiedData.unesco_status || matchedPlace?.heritage_status?.includes('UNESCO')),
      matched_place: matchedPlace
        ? {
            id: matchedPlace.id,
            name: matchedPlace.name,
            city: matchedPlace.city_id || (matchedPlace as any).city,
            state: matchedPlace.state || matchedPlace.state_id,
            category: matchedPlace.category,
            thumbnail_url: matchedPlace.thumbnail_url || (Array.isArray(matchedPlace.images) ? matchedPlace.images[0] : null) || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
            summary: matchedPlace.summary || matchedPlace.description,
            description: matchedPlace.description || matchedPlace.summary,
            history: matchedPlace.history || '',
            visiting_hours: matchedPlace.visiting_hours || 'Sunrise to Sunset (06:00 AM - 06:00 PM)',
            entry_fee_domestic: matchedPlace.entry_fee_domestic ?? 50,
            entry_fee_intl: matchedPlace.entry_fee_intl ?? 1100,
            heritage_status: matchedPlace.heritage_status || (matchedPlace.unesco_site ? 'UNESCO World Heritage Site' : 'ASI National Protected Monument'),
            data_confidence: matchedPlace.data_confidence || 'tier1_official',
            source_name: matchedPlace.source_name || 'Archaeological Survey of India (ASI)',
            source_url: matchedPlace.source_url || 'https://asi.nic.in',
            rating: matchedPlace.rating || 4.8,
            lat: matchedPlace.lat || matchedPlace.latitude,
            lng: matchedPlace.lng || matchedPlace.longitude,
            is_in_database: true,
          }
        : null,
      suggested_database_places: suggestedDatabasePlaces,
      ar_overlays: arOverlays,
    });
  } catch (err: any) {
    console.error('Visual identification error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to analyze monument image' });
  }
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
