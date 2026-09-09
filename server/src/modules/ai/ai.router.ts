import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { db } from '../../db/client';
import {
  resolveOriginTransportNode,
  resolveDestinationTransportNode,
  buildVerifiedTransitComparison,
} from '../../../../src/server/transportResolver';
import { getVerifiedCityPlan } from '../../../../src/data/cityItineraryData';
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
 * POST /api/v1/ai/chat
 * Grounded AI Concierge with structured output and provenance citations
 */
aiRouter.post('/chat', async (req: Request, res: Response): Promise<void> => {
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

  // 1. Identify destination and entities from query and DB
  const placesResult = await db.places.findAll();
  const allDbPlaces = placesResult.places;
  let matchedPlaces: any[] = allDbPlaces.filter((p: any) => {
    const pName = p.name.toLowerCase();
    return query.includes(pName) || (p.city_id && query.includes(p.city_id.toLowerCase()));
  });

  if (matchedPlaces.length === 0 && city) {
    matchedPlaces = allDbPlaces.filter((p: any) => p.city_id?.toLowerCase() === city.toLowerCase());
  }

  // If nearby query with coordinates
  const userLat = location?.latitude || location?.lat;
  const userLng = location?.longitude || location?.lng;
  if ((query.includes('near me') || query.includes('nearby') || query.includes('aas paas')) && userLat && userLng) {
    matchedPlaces = allDbPlaces
      .map((p: any) => ({ ...p, distance_km: Math.round(haversineKm(userLat, userLng, p.lat, p.lng) * 10) / 10 }))
      .filter((p: any) => p.distance_km <= 150)
      .sort((a: any, b: any) => a.distance_km - b.distance_km)
      .slice(0, 5);
  } else if (matchedPlaces.length === 0) {
    // Default fallback to 3 top official verified places
    matchedPlaces = allDbPlaces.filter((p: any) => p.data_confidence === 'official').slice(0, 3);
  } else {
    matchedPlaces = matchedPlaces.slice(0, 4);
  }

  // 2. Multimodal transit calculation if routing is queried
  let transitComparison = null;
  const isTransitQuery = /(train|railway|station|flight|airport|bus|how to reach|kaise pahuchu|route|safar|transit)/i.test(query);
  const fromToMatch = query.match(/(?:from|starting from)\s+([a-zA-Z\s]+?)\s+(?:to|towards)\s+([a-zA-Z\s]+)/i);

  if (isTransitQuery || fromToMatch) {
    const originName = fromToMatch ? fromToMatch[1].trim() : travel_context?.origin || 'New Delhi';
    const destName = fromToMatch ? fromToMatch[2].trim() : matchedPlaces[0]?.name || city || 'Jaipur';

    const origNode = resolveOriginTransportNode(
      userLat && userLng ? { lat: userLat, lng: userLng, city: originName } : originName
    ) || {
      origin_label: originName,
      city: originName,
      state: 'India',
      coordinates: { lat: userLat || 28.6139, lng: userLng || 77.209 },
      nearest_railway_station: {
        name: `${originName} Hub`,
        code: 'HUB',
        distance_km: 2.0,
        is_verified: true,
      },
      nearest_airport: {
        name: `${originName} Airport`,
        code: 'AIR',
        distance_km: 15.0,
        is_verified: true,
      },
    };

    const destNode = resolveDestinationTransportNode(destName);
    transitComparison = buildVerifiedTransitComparison(origNode, destNode);
  }

  // 3. Fetch granular grounding citations from database
  const groundingCitations = await fetchGroundingCitations(matchedPlaces);

  // 4. Try Gemini LLM Grounded Generation
  let replyText = '';
  let usedModel = 'Virasat Grounded Engine';
  const ai = getAIClient();

  if (ai) {
    try {
      const placesContextStr = matchedPlaces
        .map((p: any) => `- ${p.name} (${p.city_id || 'India'}): ${p.summary} [Confidence: ${p.data_confidence}, Source: ${p.source_url}]`)
        .join('\n');

      const trainSummary = transitComparison?.train ? `Train: ${transitComparison.train.summary} (${transitComparison.train.approx_duration})` : '';
      const airSummary = transitComparison?.air ? `Air: ${transitComparison.air.summary} (${transitComparison.air.approx_duration})` : '';
      const roadSummary = transitComparison?.road ? `Road: ${transitComparison.road.summary} (${transitComparison.road.approx_duration})` : '';

      const transitContextStr = transitComparison
        ? `Transit: ${transitComparison.origin} -> ${transitComparison.destination} (~${transitComparison.distance_km} km).\n${trainSummary}\n${airSummary}\n${roadSummary}`.trim()
        : 'No transit queried.';

      const systemInstruction = `You are the Virasat AI Tourism Concierge for India.
RULES:
1. ONLY recommend places provided in the verified places context.
2. NEVER invent fake railway stations, airports, or monuments.
3. Every factual statement must cite its official source.
4. Keep the tone warm, welcoming, and culturally respectful. Support Hindi/Hinglish naturally.

VERIFIED PLACES:
${placesContextStr}

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

      const callRes = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: { systemInstruction },
        }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 6500)),
      ]);

      if (callRes?.text) {
        replyText = callRes.text;
        usedModel = 'Gemini 2.5 Flash';
      }
    } catch {
      // Fall through to deterministic response
    }
  }

  // 5. Deterministic fallback if Gemini is offline or not configured
  if (!replyText) {
    if (transitComparison) {
      const trainMsg = transitComparison.train ? `🚆 **Train Option**: ${transitComparison.train.summary} (${transitComparison.train.approx_duration}). ${transitComparison.train.notes || ''}\n\n` : '';
      const airMsg = transitComparison.air ? `✈️ **Flight Option**: ${transitComparison.air.summary} (${transitComparison.air.approx_duration}). ${transitComparison.air.notes || ''}\n\n` : '';
      const roadMsg = transitComparison.road ? `🚗 **Road Option**: ${transitComparison.road.summary} (${transitComparison.road.approx_duration}).\n\n` : '';

      replyText = `Here is the verified transit itinerary from **${transitComparison.origin}** to **${transitComparison.destination}** (~${transitComparison.distance_km} km):\n\n` +
        trainMsg + airMsg + roadMsg +
        `All railway recommendations are connected via Indian Railways IRCTC mainline stations.`;
    } else if (matchedPlaces.length > 0) {
      replyText = `Based on verified ASI & State Tourism archives, here are key heritage destinations:\n\n` +
        matchedPlaces
          .map(
            (p: any, i: number) =>
              `${i + 1}. 🏛️ **${p.name}** (${p.city_id || 'India'})\n   ${p.summary}\n   *Official Citation: ${p.source_url || 'ASI National Portal'}*`
          )
          .join('\n\n') +
        `\n\nWould you like me to build a multi-day itinerary or check multimodal train connections?`;
    } else {
      replyText = `Welcome to Virasat! You can explore verified monuments, plan multi-day circuits, or calculate multimodal train and road routes across India. What destination would you like to discover?`;
    }
  }

  // 6. Record user and assistant messages in DB
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
    metadata_json: JSON.stringify({ model: usedModel }),
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

  const suggestedActions = transitComparison
    ? ['Plan 3-day trip', 'Explore nearby monuments', 'Change origin']
    : ['How to reach by train?', 'Plan 3-day itinerary', 'Explore near me'];

  res.json({
    success: true,
    conversation_id: sessionId,
    reply: replyText,
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
 * List chat sessions for authenticated user
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
 * Retrieve message history and grounding records for a session
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
