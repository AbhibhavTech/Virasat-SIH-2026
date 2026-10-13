import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { db } from '../../db/client';
import { sendError } from '../../middleware/validate';

// Load environment variables across possible locations
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const festivalsRouter = Router();

// Lazy Gemini AI Client initialization with circuit breaker
let aiClient: GoogleGenAI | null = null;
let circuitCooldownUntil = 0;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err: any) {
      console.error('[Festivals Live Info] Failed to initialize GoogleGenAI client:', err?.message || err);
      return null;
    }
  }
  return aiClient;
}

// 24-hour Cache for Google Live Search Grounding Results
interface CachedLiveInfo {
  data: any;
  cachedAt: number;
}
const liveInfoCache = new Map<string, CachedLiveInfo>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Model resolution cache
let resolvedModel: string | null = null;

async function resolveGroundedModel(ai: GoogleGenAI): Promise<string> {
  const configured = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  if (resolvedModel) return resolvedModel;

  try {
    const listRes = await ai.models.list();
    const availableModelNames: string[] = [];
    for await (const m of listRes) {
      if (m?.name) {
        const cleanName = m.name.replace(/^models\//, '');
        availableModelNames.push(cleanName);
      }
    }

    const exists = availableModelNames.some((name) => name.toLowerCase() === configured.toLowerCase());
    console.log(`[Festivals Live Info] Configured model: "${configured}", Exists in API: ${exists}`);

    if (exists) {
      resolvedModel = configured;
      return resolvedModel;
    }

    console.warn(`[Festivals Live Info] Configured model "${configured}" not found in available models:`, availableModelNames);
    const flashModels = availableModelNames.filter((name) => name.includes('flash'));
    resolvedModel = flashModels.find((m) => m.includes('2.0')) || flashModels[0] || 'gemini-2.0-flash';
    console.log(`[Festivals Live Info] Using closest valid flash model: "${resolvedModel}"`);
    return resolvedModel;
  } catch (err: any) {
    console.warn(`[Festivals Live Info] Could not verify models via ai.models.list():`, err?.message || err);
    resolvedModel = configured;
    return resolvedModel;
  }
}

/**
 * Helper to call Gemini with Google Search Grounding with robust model fallback & diagnostics
 */
async function callGeminiSearchGrounding(
  prompt: string,
  contextLabel: string
): Promise<{
  success: boolean;
  modelUsed: string;
  candidate: any;
  sources: { title: string; url: string; uri: string }[];
  error?: string;
  quotaError?: boolean;
}> {
  const ai = getAIClient();
  if (!ai) {
    console.warn(`[Festivals Live Info] [${contextLabel}] Call skipped: No GEMINI_API_KEY configured.`);
    return { success: false, modelUsed: 'none', candidate: null, sources: [], error: 'GEMINI_API_KEY missing' };
  }

  const primaryModel = await resolveGroundedModel(ai);
  const modelsToTry = [primaryModel];
  if (primaryModel !== 'gemini-2.0-flash') modelsToTry.push('gemini-2.0-flash');
  if (primaryModel !== 'gemini-1.5-flash') modelsToTry.push('gemini-1.5-flash');

  for (const model of modelsToTry) {
    try {
      console.log(`[Festivals Live Info] [${contextLabel}] Calling model: ${model} with googleSearch tool...`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const candidate = response?.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata || (response as any)?.groundingMetadata;
      const gChunks = groundingMetadata?.groundingChunks || [];
      const sources: { title: string; url: string; uri: string }[] = [];

      for (const ch of gChunks) {
        if (ch.web && ch.web.uri) {
          sources.push({
            title: ch.web.title || new URL(ch.web.uri).hostname,
            url: ch.web.uri,
            uri: ch.web.uri,
          });
        }
      }

      return { success: true, modelUsed: model, candidate, sources };
    } catch (err: any) {
      console.error(`[Festivals Live Info] [${contextLabel}] Model ${model} failed:`, err?.message || err);
      const isQuota = err?.status === 429 || (err?.message && err.message.toLowerCase().includes('quota'));
      if (isQuota) {
        circuitCooldownUntil = Date.now() + 60 * 1000;
        return { success: false, modelUsed: model, candidate: null, sources: [], quotaError: true, error: err?.message };
      }
    }
  }

  return { success: false, modelUsed: 'all_failed', candidate: null, sources: [], error: 'All models failed' };
}

/**
 * Common handler for festival live info (supports both GET and POST)
 */
async function processFestivalLiveInfo(festivalId: string, refresh: boolean, simulateNoSources: boolean, req: Request, res: Response) {
  try {
    const festival = await db.festivals.findById(festivalId.toLowerCase());
    if (!festival) {
      sendError(res, 404, 'FESTIVAL_NOT_FOUND', `Festival with ID '${festivalId}' not found`, req.requestId);
      return;
    }

    if (simulateNoSources) {
      res.json({
        success: true,
        festival_id: festival.id,
        festival_name: festival.name,
        has_sources: false,
        error_message: 'No reliable sources found',
        data: null,
        live_info: null,
        sources: [],
        last_fetched: new Date().toISOString(),
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
        verification_notice: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      });
      return;
    }

    const cacheKey = `festival_${festival.id.toLowerCase()}`;
    if (!refresh && liveInfoCache.has(cacheKey)) {
      const cached = liveInfoCache.get(cacheKey)!;
      if (Date.now() - cached.cachedAt < CACHE_TTL_MS) {
        res.json({
          ...cached.data,
          from_cache: true,
          cached: true,
        });
        return;
      }
    }

    if (Date.now() < circuitCooldownUntil) {
      res.json({
        success: true,
        festival_id: festival.id,
        festival_name: festival.name,
        has_sources: false,
        sources: [],
        data: null,
        live_info: null,
        message: 'No reliable sources found (circuit cooling down due to rate limit)',
        verification_notice: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
        last_fetched: new Date().toISOString(),
      });
      return;
    }

    const prompt = `Search Google for live and verified tourism information about the festival "${festival.name}" (${festival.primary_city ? festival.primary_city + ', ' : ''}${festival.state}, India).
Strictly extract only information verified by search grounding sources. Do not guess dates.
Request:
1. Upcoming or current-year date(s) in India (explicitly state if dates change every year due to lunar/traditional calendar, or vary by region).
2. Where it is best experienced (specific cities, ghats, temples, or grounds).
3. How long the celebration lasts (duration in days/weeks).
4. Key rituals and cultural events.
5. Travel and visitor advice (crowd management, booking advice, best time of day to visit).
6. Any official notices or tourism guidelines.

Format your response strictly as JSON with this schema:
{
  "festival_name": "${festival.name}",
  "upcoming_dates": "Verified date(s) in India or lunar calendar schedule note",
  "date_variation_notes": "Lunar calendar / tithi note if variable, otherwise null",
  "best_experienced_places": ["City 1", "Temple/Ghat 2"],
  "best_locations": "Cities, venues, ghats, or temple grounds",
  "duration": "Duration in days or weeks",
  "key_rituals": ["Ritual 1", "Ritual 2"],
  "travel_tips": ["Travel tip 1", "Travel tip 2"],
  "official_notices": "Official notice if announced, otherwise null",
  "summary": "Concise verified overview"
}`;

    const { success, candidate, sources } = await callGeminiSearchGrounding(prompt, `Festival:${festival.name}`);

    if (!success || sources.length === 0) {
      const payload = {
        success: true,
        festival_id: festival.id,
        festival_name: festival.name,
        has_sources: false,
        error_message: 'No reliable sources found',
        message: 'No reliable sources found',
        sources: [],
        data: null,
        live_info: null,
        verification_notice: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
        last_fetched: new Date().toISOString(),
      };
      res.json(payload);
      return;
    }

    const text = candidate?.content?.parts?.[0]?.text || '';
    let parsedInfo: any = null;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedInfo = JSON.parse(jsonMatch[0]);
      }
    } catch {
      parsedInfo = {
        festival_name: festival.name,
        upcoming_dates: 'Refer to source citations below',
        best_locations: `${festival.primary_city}, ${festival.state}`,
        best_experienced_places: [festival.primary_city, festival.state].filter(Boolean),
        key_rituals: [festival.cultural_vibe || 'Cultural celebrations'],
        travel_tips: ['Verify local trust and state tourism guidelines before travel.'],
        summary: text.slice(0, 500),
      };
    }

    if (parsedInfo && parsedInfo.upcoming_dates) {
      const groundingMetadata = candidate?.groundingMetadata;
      const hasSupports = (groundingMetadata?.groundingSupports?.length ?? 0) > 0;
      if (!hasSupports && sources.length === 0) {
        parsedInfo.upcoming_dates = null;
      }
    }

    const payload = {
      success: true,
      festival_id: festival.id,
      festival_name: festival.name,
      has_sources: true,
      sources,
      data: parsedInfo,
      live_info: parsedInfo,
      verification_status: 'LIVE_FETCHED',
      verification_notice: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      last_fetched: new Date().toISOString(),
    };

    liveInfoCache.set(cacheKey, { data: payload, cachedAt: Date.now() });
    res.json(payload);
  } catch (err: any) {
    sendError(res, 500, 'LIVE_INFO_ERROR', err?.message || 'Failed to fetch live festival info', req.requestId);
  }
}

/**
 * Common handler for global search (supports both GET and POST)
 */
async function processGlobalLiveSearch(query: string, refresh: boolean, simulateNoSources: boolean, req: Request, res: Response) {
  try {
    if (!query) {
      sendError(res, 400, 'QUERY_REQUIRED', 'Please provide a festival or location query to search.', req.requestId);
      return;
    }

    if (simulateNoSources) {
      res.json({
        success: true,
        query,
        has_sources: false,
        error_message: 'No reliable sources found',
        message: 'No reliable sources found',
        answer: null,
        data: null,
        live_info: null,
        sources: [],
        last_fetched: new Date().toISOString(),
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
        verification_notice: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      });
      return;
    }

    const cacheKey = `global_${query.toLowerCase()}`;
    if (!refresh && liveInfoCache.has(cacheKey)) {
      const cached = liveInfoCache.get(cacheKey)!;
      if (Date.now() - cached.cachedAt < CACHE_TTL_MS) {
        res.json({
          ...cached.data,
          from_cache: true,
          cached: true,
        });
        return;
      }
    }

    if (Date.now() < circuitCooldownUntil) {
      res.json({
        success: true,
        query,
        has_sources: false,
        sources: [],
        data: null,
        live_info: null,
        message: 'No reliable sources found (circuit cooling down due to rate limit)',
        verification_notice: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
        last_fetched: new Date().toISOString(),
      });
      return;
    }

    const prompt = `Using Google Search grounding, answer the user query regarding Indian cultural festivals and heritage celebrations:
"${query}"

Provide:
1. Exact upcoming date(s) or festival schedule in India.
2. Verified places and cities where the celebration occurs.
3. Cultural significance, key ceremonies, and rituals.
4. Practical traveler advisory (crowds, transit access).

Be factual, objective, and only state dates found in trusted search results. Format JSON with:
{
  "summary": "2-3 sentence overview",
  "upcoming_dates": "Verified upcoming date(s)",
  "locations": "Best cities, venues, or regions",
  "key_highlights": ["Key ritual 1", "Key ritual 2"],
  "travel_advice": ["Advice 1", "Advice 2"],
  "official_notices": "Advisory or booking guidelines"
}`;

    const { success, candidate, sources } = await callGeminiSearchGrounding(prompt, `GlobalQuery:${query}`);

    if (!success || sources.length === 0) {
      const payload = {
        success: true,
        query,
        has_sources: false,
        error_message: 'No reliable sources found',
        message: 'No reliable sources found',
        answer: null,
        data: null,
        live_info: null,
        sources: [],
        verification_notice: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
        last_fetched: new Date().toISOString(),
      };
      res.json(payload);
      return;
    }

    const text = candidate?.content?.parts?.[0]?.text || '';
    let parsedInfo: any = null;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedInfo = JSON.parse(jsonMatch[0]);
      }
    } catch {
      parsedInfo = { summary: text };
    }

    if (parsedInfo && parsedInfo.upcoming_dates) {
      const groundingMetadata = candidate?.groundingMetadata;
      const hasSupports = (groundingMetadata?.groundingSupports?.length ?? 0) > 0;
      if (!hasSupports && sources.length === 0) {
        parsedInfo.upcoming_dates = null;
      }
    }

    const payload = {
      success: true,
      query,
      has_sources: true,
      answer: text,
      sources,
      data: parsedInfo,
      live_info: parsedInfo,
      verification_notice: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      last_fetched: new Date().toISOString(),
    };

    liveInfoCache.set(cacheKey, { data: payload, cachedAt: Date.now() });
    res.json(payload);
  } catch (err: any) {
    sendError(res, 500, 'LIVE_SEARCH_ERROR', err?.message || 'Failed to perform live festival search', req.requestId);
  }
}

/**
 * POST /:id/live-info
 */
festivalsRouter.post('/:id/live-info', async (req: Request, res: Response): Promise<void> => {
  const festivalId = req.params.id;
  const refresh = req.query.refresh === 'true' || req.body?.refresh === true;
  const simulateNoSources = req.query.simulate_no_sources === 'true' || req.body?.simulate_no_sources === true;
  await processFestivalLiveInfo(festivalId, refresh, simulateNoSources, req, res);
});

/**
 * GET /:id/live-info
 */
festivalsRouter.get('/:id/live-info', async (req: Request, res: Response): Promise<void> => {
  const festivalId = req.params.id;
  const refresh = req.query.refresh === 'true';
  const simulateNoSources = req.query.simulate_no_sources === 'true';
  await processFestivalLiveInfo(festivalId, refresh, simulateNoSources, req, res);
});

/**
 * POST /live-search
 */
festivalsRouter.post('/live-search', async (req: Request, res: Response): Promise<void> => {
  const query = (req.body?.query || req.query.q || '').toString().trim();
  const refresh = req.query.refresh === 'true' || req.body?.refresh === true;
  const simulateNoSources = req.query.simulate_no_sources === 'true' || req.body?.simulate_no_sources === true;
  await processGlobalLiveSearch(query, refresh, simulateNoSources, req, res);
});

/**
 * GET /live-info
 */
festivalsRouter.get('/live-info', async (req: Request, res: Response): Promise<void> => {
  const query = (req.query.q || req.query.query || '').toString().trim();
  const refresh = req.query.refresh === 'true';
  const simulateNoSources = req.query.simulate_no_sources === 'true';
  await processGlobalLiveSearch(query, refresh, simulateNoSources, req, res);
});

/**
 * GET /current-upcoming
 * Returns date-aware current and upcoming festivals relative to the current reference date.
 */
festivalsRouter.get('/current-upcoming', async (req: Request, res: Response): Promise<void> => {
  try {
    const currentDate = (req.query.date as string) || '2026-09-26';
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const { current, upcoming } = await db.festivals.findCurrentAndUpcoming(currentDate, limit);

    res.json({
      success: true,
      currentDate,
      data: { current, upcoming },
      current,
      upcoming,
      total_current: current.length,
      total_upcoming: upcoming.length,
    });
  } catch (err: any) {
    sendError(res, 500, 'FESTIVALS_FETCH_ERROR', err?.message || 'Failed to fetch current & upcoming festivals', req.requestId);
  }
});

/**
 * GET /
 * Retrieve festivals with optional filters for state, city, month, and search query.
 */
festivalsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { state, state_id, city, city_id, month, search, q, limit, offset } = req.query;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 250;
    const parsedOffset = offset ? parseInt(offset as string, 10) : 0;
    const searchTerm = (search || q) as string | undefined;

    const result = await db.festivals.findAll({
      state: state as string,
      state_id: state_id as string,
      city: city as string,
      city_id: city_id as string,
      month: month as string,
      search: searchTerm,
      limit: parsedLimit,
      offset: parsedOffset,
    });

    res.json({
      success: true,
      data: result.festivals,
      festivals: result.festivals,
      total: result.total,
      count: result.festivals.length,
      offset: parsedOffset,
      limit: parsedLimit,
    });
  } catch (err: any) {
    sendError(res, 500, 'FESTIVALS_FETCH_ERROR', err?.message || 'Failed to fetch festivals', req.requestId);
  }
});

/**
 * GET /:id
 * Retrieve a single festival by ID or slug.
 */
festivalsRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const festival = await db.festivals.findById(req.params.id);
    if (!festival) {
      sendError(res, 404, 'FESTIVAL_NOT_FOUND', `Festival with ID '${req.params.id}' not found`, req.requestId);
      return;
    }

    res.json({
      success: true,
      data: festival,
      festival,
    });
  } catch (err: any) {
    sendError(res, 500, 'FESTIVAL_FETCH_ERROR', err?.message || 'Failed to fetch festival details', req.requestId);
  }
});
