import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../../db/client';
import { requireAuth } from '../../middleware/auth';
import { validateBody, sendError } from '../../middleware/validate';

export const tripsRouter = Router();

const createTripSchema = z.object({
  title: z.string().min(1, 'Trip title is required'),
  destination: z.string().optional().default('India'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  city_ids: z.array(z.string()).optional().default([]),
  places_count: z.number().optional().default(0),
  total_distance_km: z.number().optional().default(0),
  estimated_budget: z.number().optional().default(0),
  is_public: z.boolean().optional().default(false),
});

/**
 * GET /api/v1/trips
 * Retrieves all trips belonging to authenticated user
 */
tripsRouter.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const userTrips = await db.trips.listByUser(userId);

  res.json({
    success: true,
    data: userTrips,
    trips: userTrips,
    count: userTrips.length,
  });
});

/**
 * GET /api/v1/trips/:id
 * IDOR Protected: User can only view their own trips (or public trips)
 */
tripsRouter.get('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const trip = await db.trips.findById(req.params.id);
  if (!trip) {
    sendError(res, 404, 'TRIP_NOT_FOUND', `Trip with ID '${req.params.id}' not found`, req.requestId);
    return;
  }

  if (trip.user_id !== req.user!.id && !trip.is_public) {
    sendError(res, 403, 'FORBIDDEN', 'You do not have permission to view this trip', req.requestId);
    return;
  }

  res.json({
    success: true,
    data: trip,
    trip,
  });
});

/**
 * POST /api/v1/trips
 * Creates a new trip owned by authenticated user
 */
tripsRouter.post('/', requireAuth, validateBody(createTripSchema), async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const id = `trip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newTrip = await db.trips.create({
    id,
    user_id: userId,
    title: req.body.title,
    destination: req.body.destination,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    city_ids: req.body.city_ids,
    places_count: req.body.places_count,
    total_distance_km: req.body.total_distance_km,
    estimated_budget: req.body.estimated_budget,
    is_public: req.body.is_public,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    data: newTrip,
    trip: newTrip,
  });
});

/**
 * DELETE /api/v1/trips/:id
 * IDOR Protected: Only trip owner can delete
 */
tripsRouter.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const deleted = await db.trips.delete(req.params.id, userId);

  if (!deleted) {
    sendError(res, 404, 'TRIP_NOT_FOUND', 'Trip not found or does not belong to your account', req.requestId);
    return;
  }

  res.json({
    success: true,
    status: 'deleted',
    message: 'Trip deleted successfully',
  });
});
