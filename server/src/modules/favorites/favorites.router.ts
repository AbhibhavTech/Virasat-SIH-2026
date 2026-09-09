import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../../db/client';
import { requireAuth } from '../../middleware/auth';
import { validateBody, sendError } from '../../middleware/validate';

export const favoritesRouter = Router();

const addFavoriteSchema = z.object({
  place_id: z.string().min(1, 'place_id is required'),
});

/**
 * GET /api/v1/favorites
 * Strictly scoped to authenticated user
 */
favoritesRouter.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const userFavorites = await db.favorites.listByUser(userId);

  const enriched = await Promise.all(
    userFavorites.map(async (f) => {
      const place = await db.places.findById(f.place_id);
      return {
        id: f.id,
        favorite_id: f.id,
        place_id: f.place_id,
        name: place?.name || f.place_id,
        city: place?.city_id || 'India',
        state: place?.state_id || '',
        category: place?.category || 'heritage',
        thumbnail_url: place?.thumbnail_url,
        rating: place?.rating || 4.5,
        added_at: f.created_at,
      };
    })
  );

  res.json({
    success: true,
    data: enriched,
    favorites: enriched,
    count: enriched.length,
  });
});

/**
 * POST /api/v1/favorites
 * Adds favorite for authenticated user (IDOR protected)
 */
favoritesRouter.post('/', requireAuth, validateBody(addFavoriteSchema), async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { place_id } = req.body;

  const place = await db.places.findById(place_id);
  if (!place) {
    sendError(res, 404, 'PLACE_NOT_FOUND', `Cannot bookmark place '${place_id}': record not found`, req.requestId);
    return;
  }

  const record = await db.favorites.add(userId, place_id);

  res.status(201).json({
    success: true,
    data: {
      id: record.id,
      place_id: record.place_id,
      name: place.name,
      city: place.city_id,
      thumbnail_url: place.thumbnail_url,
      added_at: record.created_at,
    },
  });
});

/**
 * DELETE /api/v1/favorites/:id
 * Removes favorite scoped to authenticated user (IDOR protected)
 */
favoritesRouter.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const placeOrFavId = req.params.id;

  const removed = await db.favorites.remove(userId, placeOrFavId);
  if (!removed) {
    sendError(res, 404, 'FAVORITE_NOT_FOUND', 'Favorite not found or does not belong to your account', req.requestId);
    return;
  }

  res.json({
    success: true,
    status: 'removed',
    message: 'Place removed from favorites',
  });
});
