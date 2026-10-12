import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { db } from '../../db/client';
import { sendError } from '../../middleware/validate';

export const festivalsRouter = Router();

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

// 24-hour cache for live festival info: festivalId -> { data, sources, timestamp }
interface CachedLiveInfo {
  data: any;
  sources: Array<{ title: string; uri: string }>;
  timestamp: number;
  last_fetched: string;
}
const festivalLiveCache = new Map<string, CachedLiveInfo>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * POST /:id/live-info
 * Fetches real-time search-grounded information about a festival using Gemini + Google Search.
 */
festivalsRouter.post('/:id/live-info', async (req: Request, res: Response): Promise<void> => {
  try {
    const festivalId = req.params.id.toLowerCase();
    const refresh = req.query.refresh === 'true' || req.body?.refresh === true;

    // Check test flag for regression testing "no sources" path
    if (req.query.simulate_no_sources === 'true' || req.body?.simulate_no_sources === true) {
      res.json({
        success: true,
        has_sources: false,
        error_message: 'No reliable sources found',
        data: null,
        sources: [],
        last_fetched: new Date().toISOString(),
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      });
      return;
    }

    const festival = await db.festivals.findById(festivalId);
    if (!festival) {
      sendError(res, 404, 'FESTIVAL_NOT_FOUND', `Festival '${festivalId}' not found in registry`, req.requestId);
      return;
    }

    // Check 24-hour cache unless refresh requested
    const cached = festivalLiveCache.get(festivalId);
    const now = Date.now();
    if (cached && !refresh && now - cached.timestamp < CACHE_TTL_MS) {
      res.json({
        success: true,
        has_sources: true,
        cached: true,
        data: cached.data,
        sources: cached.sources,
        last_fetched: cached.last_fetched,
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      });
      return;
    }

    const ai = getAIClient();
    if (!ai) {
      // Graceful offline/no-key handling
      res.status(503).json({
        success: false,
        code: 'GEMINI_API_KEY_UNAVAILABLE',
        error: 'Google Search live info service is currently offline (API key required).',
        has_sources: false,
        data: null,
        sources: [],
        last_fetched: new Date().toISOString(),
      });
      return;
    }

    const prompt = `Using Google Search grounding, find authoritative up-to-date information for the Indian festival "${festival.name}" (${festival.state || 'India'}).
Strictly base your answers ONLY on live Google Search results:
1. Exact upcoming or current-year celebration date(s) in India (explicitly state if the date varies by region, solar calendar, or Hindu lunar tithi).
2. Best places to experience it (cities, sacred river ghats, temple complexes, or key grounds).
3. Typical duration of celebrations (number of days/hours).
4. Key rituals, ceremonies, and cultural highlights.
5. Practical travel advice (transit access, peak crowd warnings, booking advisories).
6. Official advisory or notices from state tourism or administration if available.

Return your answer strictly as a JSON object matching this schema:
{
  "festival_name": "${festival.name}",
  "upcoming_dates": "e.g. October 20-24, 2026 (exact search dates)",
  "date_variation_notes": "explanation of lunar/regional variance",
  "best_experienced_places": ["Place 1", "Place 2"],
  "duration": "e.g. 5 Days",
  "key_rituals": ["Ritual 1", "Ritual 2"],
  "travel_tips": ["Tip 1", "Tip 2"],
  "official_notices": "Notices from government or temple trust",
  "summary": "Concise verified overview"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as any[];
    const sources = chunks
      .map((c) => c.web)
      .filter((w) => w && w.uri)
      .map((w) => ({
        title: w.title || w.uri,
        uri: w.uri,
      }));

    // If grounding returns no sources, show "No reliable sources found" instead of model-written guesses
    if (!sources || sources.length === 0) {
      res.json({
        success: true,
        has_sources: false,
        error_message: 'No reliable sources found',
        data: null,
        sources: [],
        last_fetched: new Date().toISOString(),
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      });
      return;
    }

    // Parse JSON safely from model response text
    let parsedData: any = null;
    const rawText = response.text || '';
    try {
      const cleaned = rawText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      parsedData = JSON.parse(cleaned);
    } catch {
      // Fallback structured packaging if response was markdown text
      parsedData = {
        festival_name: festival.name,
        upcoming_dates: 'Refer to source citations below',
        date_variation_notes: 'Calculated according to regional astronomical panchanga.',
        best_experienced_places: [festival.primary_city, festival.state].filter(Boolean),
        duration: festival.typical_season || 'Multi-day celebration',
        key_rituals: [festival.cultural_vibe || 'Traditional cultural observances'],
        travel_tips: ['Check local transit schedules and book in advance'],
        official_notices: 'Please verify with official district administration before travel.',
        summary: rawText.slice(0, 500),
      };
    }

    const fetchTimestamp = new Date().toISOString();

    // Cache result for 24h
    festivalLiveCache.set(festivalId, {
      data: parsedData,
      sources,
      timestamp: now,
      last_fetched: fetchTimestamp,
    });

    // Update in-memory record date_info & verification_status
    festival.date_info = {
      upcoming_dates: parsedData.upcoming_dates,
      fetched_at: fetchTimestamp,
      sources_count: sources.length,
    };
    festival.verification_status = 'LIVE_FETCHED';

    res.json({
      success: true,
      has_sources: true,
      cached: false,
      data: parsedData,
      sources,
      last_fetched: fetchTimestamp,
      disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
    });
  } catch (err: any) {
    sendError(res, 500, 'LIVE_INFO_FETCH_ERROR', err?.message || 'Failed to fetch live festival info', req.requestId);
  }
});

/**
 * POST /live-search
 * Global live info search with Google Search grounding (e.g. "festivals in Odisha this month").
 */
festivalsRouter.post('/live-search', async (req: Request, res: Response): Promise<void> => {
  try {
    const queryText = (req.body?.query || req.query.q || '').toString().trim();
    if (!queryText) {
      sendError(res, 400, 'QUERY_REQUIRED', 'Please provide a festival or location query to search.', req.requestId);
      return;
    }

    // Check test flag for regression testing "no sources" path
    if (req.query.simulate_no_sources === 'true' || req.body?.simulate_no_sources === true) {
      res.json({
        success: true,
        has_sources: false,
        error_message: 'No reliable sources found',
        query: queryText,
        answer: null,
        sources: [],
        last_fetched: new Date().toISOString(),
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      });
      return;
    }

    const ai = getAIClient();
    if (!ai) {
      res.status(503).json({
        success: false,
        code: 'GEMINI_API_KEY_UNAVAILABLE',
        error: 'Live Google Search grounding requires server GEMINI_API_KEY.',
        has_sources: false,
        query: queryText,
        answer: null,
        sources: [],
        last_fetched: new Date().toISOString(),
      });
      return;
    }

    const prompt = `Using Google Search grounding, answer the user query regarding Indian cultural festivals and heritage celebrations:
"${queryText}"

Provide:
1. Exact upcoming date(s) or festival schedule in India.
2. Verified places and cities where the celebration occurs.
3. Cultural significance, key ceremonies, and rituals.
4. Practical traveler advisory (crowds, transit access).

Be factual, objective, and only state dates found in trusted search results.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as any[];
    const sources = chunks
      .map((c) => c.web)
      .filter((w) => w && w.uri)
      .map((w) => ({
        title: w.title || w.uri,
        uri: w.uri,
      }));

    if (!sources || sources.length === 0) {
      res.json({
        success: true,
        has_sources: false,
        error_message: 'No reliable sources found',
        query: queryText,
        answer: null,
        sources: [],
        last_fetched: new Date().toISOString(),
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      });
      return;
    }

    res.json({
      success: true,
      has_sources: true,
      query: queryText,
      answer: response.text || '',
      sources,
      last_fetched: new Date().toISOString(),
      disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
    });
  } catch (err: any) {
    sendError(res, 500, 'LIVE_SEARCH_ERROR', err?.message || 'Failed to perform live festival search', req.requestId);
  }
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
    const parsedLimit = limit ? parseInt(limit as string, 10) : 100;
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
