import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { db } from '../../db/client';
import { rateLimiter } from '../../middleware/rateLimiter';
import {
  resolveOriginTransportNode,
  resolveDestinationTransportNode,
  buildVerifiedTransitComparison,
} from '../../../../src/server/transportResolver';
import { haversineKm } from '../../../../src/server/railwayRoutingEngine';
import { processAiQuery } from '../../../../src/ai';

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
aiRouter.post('/chat', rateLimiter({ windowMs: 60000, max: 120 }), async (req: Request, res: Response): Promise<void> => {
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

  // 1. Process query through Virasat AI Assistant Master Orchestrator
  const aiResult = await processAiQuery({
    message: rawQuery,
    conversation_id: sessionId,
    place_id,
    city,
    history,
    location,
    travel_context,
    image: req.body.image,
  });

  const replyText = aiResult.answer || aiResult.reply;
  const usedModel = aiResult.model_used || 'Virasat Grounded Engine';
  const latencyMs = aiResult.latency_ms ?? (Date.now() - startTime);

  // 2. Fetch all places from DB for hallucination guardrail & citation enrichment
  const placesResult = await db.places.findAll();
  const allDbPlaces = placesResult.places || [];
  const groundingCitations = aiResult.grounding_citations || [];

  // 3. Run Hallucination Guardrail
  const groundingAudit = auditHallucinations(
    replyText,
    aiResult.locations || [],
    allDbPlaces,
    groundingCitations.length,
    latencyMs,
    usedModel
  );

  // 4. Record user and assistant messages in DB
  const userMsgId = `msg-${Date.now()}-u`;
  const asstMsgId = `msg-${Date.now()}-a`;

  try {
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
      metadata_json: JSON.stringify({
        model: usedModel,
        intent: aiResult.intent,
        grounding_score: groundingAudit.grounding_score,
        latency_ms: latencyMs,
      }),
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

    // Log AI Query to Immutable Audit Trail
    await db.audit.log({
      id: `audit-ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actor_id: userId || 'anonymous_traveller',
      action: 'AI_QUERY_GROUNDED',
      entity_type: 'ai_session',
      entity_id: sessionId,
      to_value: {
        query: rawQuery,
        intent: aiResult.intent,
        model: usedModel,
        grounding_score: groundingAudit.grounding_score,
        citations_count: groundingCitations.length,
        latency_ms: latencyMs,
      },
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    // Non-blocking log persistence failure
  }

  // 5. Send Unified, Backward-Compatible AI Response
  res.json({
    success: true,
    conversation_id: sessionId,
    type: aiResult.type,
    intent: aiResult.intent,
    answer: replyText,
    reply: replyText,
    grounding_score: groundingAudit.grounding_score,
    grounding_audit: groundingAudit,
    latency_ms: latencyMs,
    model_used: usedModel,
    locations: aiResult.locations,
    recommendations: aiResult.recommendations,
    suggested_places: aiResult.suggested_places || aiResult.recommendations,
    routes: aiResult.routes,
    transit_comparison: aiResult.transit_comparison,
    itinerary: aiResult.itinerary,
    budget: aiResult.budget,
    grounding_citations: groundingCitations,
    suggested_actions: aiResult.followUpQuestions || aiResult.suggested_actions,
    followUpQuestions: aiResult.followUpQuestions,
    sources: aiResult.sources,
    warnings: aiResult.warnings,
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
