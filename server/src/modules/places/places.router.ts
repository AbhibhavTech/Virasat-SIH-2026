import { Router, Request, Response } from 'express';
import { db } from '../../db/client';
import { sendError } from '../../middleware/validate';

export const placesRouter = Router();

/**
 * GET /api/v1/places
 */
placesRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const { stateId, state, cityId, city, category, limit, offset } = req.query;

  const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const parsedOffset = Math.max(Number(offset) || 0, 0);

  const result = await db.places.findAll({
    stateId: (stateId || state) as string | undefined,
    cityId: (cityId || city) as string | undefined,
    category: category as string | undefined,
    limit: parsedLimit,
    offset: parsedOffset,
  });

  res.json({
    success: true,
    data: result.places,
    places: result.places,
    total: result.total,
    limit: parsedLimit,
    offset: parsedOffset,
  });
});

/**
 * GET /api/v1/places/nearby
 */
placesRouter.get('/nearby', async (req: Request, res: Response): Promise<void> => {
  const { lat, lng, radius, limit } = req.query;

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);

  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    sendError(res, 400, 'INVALID_COORDINATES', 'Valid lat and lng query parameters are required', req.requestId);
    return;
  }

  const radiusKm = Math.min(Math.max(Number(radius) || 50, 1), 200);
  const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  const nearbyPlaces = await db.places.findNearby(parsedLat, parsedLng, radiusKm, parsedLimit);

  res.json({
    success: true,
    data: nearbyPlaces,
    places: nearbyPlaces,
    count: nearbyPlaces.length,
  });
});

/**
 * GET /api/v1/places/:id
 */
placesRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const place = await db.places.findById(id);

  if (!place) {
    sendError(res, 404, 'PLACE_NOT_FOUND', `Place with ID '${id}' not found`, req.requestId);
    return;
  }

  res.json({
    success: true,
    data: place,
    place,
  });
});
