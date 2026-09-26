import { Router, Request, Response } from 'express';
import { db } from '../../db/client';
import { sendError } from '../../middleware/validate';

export const festivalsRouter = Router();

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
    const { state, state_id, city, city_id, month, search, limit, offset } = req.query;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 100;
    const parsedOffset = offset ? parseInt(offset as string, 10) : 0;

    const result = await db.festivals.findAll({
      state: state as string,
      state_id: state_id as string,
      city: city as string,
      city_id: city_id as string,
      month: month as string,
      search: search as string,
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
