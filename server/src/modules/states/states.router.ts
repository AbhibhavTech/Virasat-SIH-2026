import { Router, Request, Response } from 'express';
import { db } from '../../db/client';
import { sendError } from '../../middleware/validate';

export const statesRouter = Router();

/**
 * GET /api/v1/states
 */
statesRouter.get('/states', async (req: Request, res: Response): Promise<void> => {
  const states = await db.states.findAll();
  res.json({
    success: true,
    data: states,
    states,
    count: states.length,
  });
});

/**
 * GET /api/v1/states/:id
 */
statesRouter.get('/states/:id', async (req: Request, res: Response): Promise<void> => {
  const state = await db.states.findById(req.params.id);
  if (!state) {
    sendError(res, 404, 'STATE_NOT_FOUND', `State with ID '${req.params.id}' not found`, req.requestId);
    return;
  }
  const cities = await db.cities.findByStateId(state.id);
  res.json({
    success: true,
    data: { ...state, cities },
    state: { ...state, cities },
  });
});

/**
 * GET /api/v1/cities
 */
statesRouter.get('/cities', async (req: Request, res: Response): Promise<void> => {
  const { stateId } = req.query;
  let cities = await db.cities.findAll();
  if (stateId) {
    cities = cities.filter((c) => c.state_id.toLowerCase() === (stateId as string).toLowerCase());
  }
  res.json({
    success: true,
    data: cities,
    cities,
    count: cities.length,
  });
});

/**
 * GET /api/v1/cities/:id
 */
statesRouter.get('/cities/:id', async (req: Request, res: Response): Promise<void> => {
  const city = await db.cities.findById(req.params.id);
  if (!city) {
    sendError(res, 404, 'CITY_NOT_FOUND', `City with ID '${req.params.id}' not found`, req.requestId);
    return;
  }
  const places = await db.places.findAll({ cityId: city.id, limit: 100 });
  res.json({
    success: true,
    data: { ...city, attractions: places.places },
    city: { ...city, attractions: places.places },
  });
});

/**
 * GET /api/v1/india-hierarchy
 */
statesRouter.get('/india-hierarchy', async (req: Request, res: Response): Promise<void> => {
  const states = await db.states.findAll();
  const cities = await db.cities.findAll();
  const allPlaces = await db.places.findAll({ limit: 5000 });

  const hierarchy = states.map((s) => {
    const stateCities = cities.filter((c) => c.state_id === s.id);
    const citiesWithCounts = stateCities.map((c) => {
      const cityPlaces = allPlaces.places.filter((p) => p.city_id === c.id);
      return {
        ...c,
        attractions_count: cityPlaces.length,
        attractions: cityPlaces,
      };
    });
    return {
      ...s,
      cities: citiesWithCounts,
      total_cities: citiesWithCounts.length,
      total_attractions: citiesWithCounts.reduce((acc, c) => acc + c.attractions_count, 0),
    };
  });

  res.json({
    success: true,
    data: hierarchy,
    states: hierarchy,
    total_states: hierarchy.length,
  });
});
