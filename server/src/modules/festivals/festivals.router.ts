import { Router, Request, Response } from 'express';
import { db } from '../../db/client';
import { sendError } from '../../middleware/validate';
export const festivalsRouter = Router();

interface LiveInfoOptions {
  refresh: boolean;
  simulateNoSources: boolean;
}

function buildStoredFestivalInfo(festival: any) {
  const places = [festival.primary_city, ...(festival.alternate_locations || [])].filter(Boolean);
  const storedDates = festival.is_date_verified && festival.exact_date_start
    ? [festival.exact_date_start, festival.exact_date_end].filter(Boolean).join(' to ')
    : null;

  return {
    festival_name: festival.name,
    upcoming_dates: storedDates ? 'Stored date record: ' + storedDates + ' (confirm this year with the official organizer)' : null,
    date_variation_notes: festival.tradition_notes || 'Festival dates and local schedules can vary by year and region.',
    typical_season: festival.typical_season,
    best_experienced_places: places,
    best_locations: places.join(', '),
    duration: null,
    key_rituals: festival.cultural_vibe ? [festival.cultural_vibe] : [],
    travel_tips: ['This is stored Virasat information. Confirm current dates, access, and visitor notices with the official organizer before travel.'],
    official_notices: 'No live organizer notices are available in the local dataset.',
    summary: festival.description,
  };
}

async function processFestivalLiveInfo(festivalId: string, options: LiveInfoOptions, req: Request, res: Response) {
  try {
    const festival = await db.festivals.findById(festivalId.toLowerCase());
    if (!festival) {
      sendError(res, 404, 'FESTIVAL_NOT_FOUND', "Festival with ID '" + festivalId + "' not found", req.requestId);
      return;
    }

    if (options.simulateNoSources) {
      res.json({
        success: true,
        festival_id: festival.id,
        festival_name: festival.name,
        has_sources: false,
        error_message: 'No saved source is available for this festival record.',
        data: null,
        live_info: null,
        sources: [],
        last_fetched: new Date().toISOString(),
        disclaimer: 'Virasat local festival record; live dates and notices are not provided.',
      });
      return;
    }

    const source = festival.source_url
      ? [{ title: festival.source_name || 'Festival source', url: festival.source_url, uri: festival.source_url }]
      : [];
    const storedInfo = buildStoredFestivalInfo(festival);
    res.json({
      success: true,
      festival_id: festival.id,
      festival_name: festival.name,
      has_sources: source.length > 0,
      sources: source,
      data: storedInfo,
      live_info: storedInfo,
      verification_status: 'FROM_DATABASE',
      is_live: false,
      message: 'Showing the stored Virasat festival record. Live schedules and organizer notices are unavailable.',
      verification_notice: 'Stored Virasat record; confirm annual dates with the official organizer.',
      disclaimer: 'This is saved Virasat information, not a live schedule. Verify current details with the official organizer.',
      last_fetched: new Date().toISOString(),
    });
  } catch (err: any) {
    sendError(res, 500, 'LIVE_INFO_ERROR', err?.message || 'Failed to load festival record', req.requestId);
  }
}

async function processGlobalLiveSearch(query: string, options: LiveInfoOptions, req: Request, res: Response) {
  try {
    if (!query) {
      sendError(res, 400, 'QUERY_REQUIRED', 'Please provide a festival or location query to search.', req.requestId);
      return;
    }

    if (options.simulateNoSources) {
      res.json({
        success: true,
        query,
        has_sources: false,
        error_message: 'No saved festival records matched this query.',
        message: 'No saved festival records matched this query.',
        answer: null,
        data: null,
        live_info: null,
        sources: [],
        last_fetched: new Date().toISOString(),
        disclaimer: 'Virasat local festival records only; live updates are not available.',
      });
      return;
    }

    const result = await db.festivals.findAll({ search: query, limit: 10 });
    const records = result.festivals || [];
    const matches = records.map((festival: any) => ({
      festival_name: festival.name,
      state: festival.state,
      primary_city: festival.primary_city,
      typical_season: festival.typical_season,
      description: festival.description,
      source_name: festival.source_name,
      source_url: festival.source_url,
      verification_status: festival.verification_status,
    }));

    res.json({
      success: true,
      query,
      has_sources: matches.length > 0,
      answer: matches.length
        ? 'Found ' + matches.length + ' saved festival record(s). Live dates and notices are not available in this local build.'
        : 'No saved festival records matched this query.',
      matches,
      data: { matches },
      live_info: null,
      sources: records.filter((item: any) => item.source_url).map((item: any) => ({
        title: item.source_name || item.name,
        url: item.source_url,
        uri: item.source_url,
      })),
      is_live: false,
      last_fetched: new Date().toISOString(),
      disclaimer: 'Search results come from Virasat saved records. Confirm dates and notices with the official organizer.',
    });
  } catch (err: any) {
    sendError(res, 500, 'LIVE_SEARCH_ERROR', err?.message || 'Failed to search local festival records', req.requestId);
  }
}

/**
 * POST /:id/live-info


festivalsRouter.post('/:id/live-info', async (req: Request, res: Response): Promise<void> => {
  const festivalId = req.params.id;
  const refresh = req.query.refresh === 'true' || req.body?.refresh === true;
  const simulateNoSources = req.query.simulate_no_sources === 'true' || req.body?.simulate_no_sources === true;
  await processFestivalLiveInfo(festivalId, { refresh, simulateNoSources }, req, res);
});

/**
 * GET /:id/live-info
 */
festivalsRouter.get('/:id/live-info', async (req: Request, res: Response): Promise<void> => {
  const festivalId = req.params.id;
  const refresh = req.query.refresh === 'true';
  const simulateNoSources = req.query.simulate_no_sources === 'true';
  await processFestivalLiveInfo(festivalId, { refresh, simulateNoSources }, req, res);
});

/**
 * POST /live-search
 */
festivalsRouter.post('/live-search', async (req: Request, res: Response): Promise<void> => {
  const query = (req.body?.query || req.query.q || '').toString().trim();
  const refresh = req.query.refresh === 'true' || req.body?.refresh === true;
  const simulateNoSources = req.query.simulate_no_sources === 'true' || req.body?.simulate_no_sources === true;
  await processGlobalLiveSearch(query, { refresh, simulateNoSources }, req, res);
});

/**
 * GET /live-info
 */
festivalsRouter.get('/live-info', async (req: Request, res: Response): Promise<void> => {
  const query = (req.query.q || req.query.query || '').toString().trim();
  const refresh = req.query.refresh === 'true';
  const simulateNoSources = req.query.simulate_no_sources === 'true';
  await processGlobalLiveSearch(query, { refresh, simulateNoSources }, req, res);
});

/**
 * GET /current-upcoming
 * Returns date-aware current and upcoming festivals relative to the current reference date.
 */
festivalsRouter.get('/current-upcoming', async (req: Request, res: Response): Promise<void> => {
  try {
    const currentDate = (req.query.date as string) || new Date().toISOString().slice(0, 10);
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
