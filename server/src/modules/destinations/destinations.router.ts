import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const destinationsRouter = Router();

// Load Maharashtra destinations from the authoritative JSON dataset
let cachedDestinations: any[] = [];

function loadDestinations(): any[] {
  if (cachedDestinations.length > 0) return cachedDestinations;
  try {
    const filePath = path.resolve(process.cwd(), 'data/maharashtra_destinations.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      cachedDestinations = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading maharashtra_destinations.json:', err);
  }
  return cachedDestinations;
}

/**
 * GET /api/destinations
 * GET /api/v1/destinations
 * Query filters: state, city, type (famous | hidden), category
 */
destinationsRouter.get('/', (req: Request, res: Response): void => {
  const all = loadDestinations();
  const { state, city, type, category, limit, offset } = req.query;

  let filtered = [...all];

  if (state && typeof state === 'string') {
    const sLower = state.toLowerCase().trim();
    filtered = filtered.filter((d) => d.state?.toLowerCase() === sLower);
  }

  if (city && typeof city === 'string') {
    const cLower = city.toLowerCase().trim();
    filtered = filtered.filter((d) => d.city?.toLowerCase() === cLower);
  }

  if (type && typeof type === 'string') {
    const tLower = type.toLowerCase().trim();
    filtered = filtered.filter((d) => d.type?.toLowerCase() === tLower);
  }

  if (category && typeof category === 'string') {
    const catLower = category.toLowerCase().trim();
    filtered = filtered.filter((d) => d.category?.toLowerCase().includes(catLower));
  }

  // Summary counts
  const cityCounts = {
    Mumbai: {
      famous: all.filter((d) => d.city === 'Mumbai' && d.type === 'famous').length,
      hidden: all.filter((d) => d.city === 'Mumbai' && d.type === 'hidden').length,
      total: all.filter((d) => d.city === 'Mumbai').length,
    },
    Pune: {
      famous: all.filter((d) => d.city === 'Pune' && d.type === 'famous').length,
      hidden: all.filter((d) => d.city === 'Pune' && d.type === 'hidden').length,
      total: all.filter((d) => d.city === 'Pune').length,
    },
  };

  const parsedLimit = limit ? Math.max(1, Number(limit)) : filtered.length;
  const parsedOffset = offset ? Math.max(0, Number(offset)) : 0;
  const paginated = filtered.slice(parsedOffset, parsedOffset + parsedLimit);

  res.json({
    success: true,
    total: filtered.length,
    limit: parsedLimit,
    offset: parsedOffset,
    city_counts: cityCounts,
    data: paginated,
    destinations: paginated,
  });
});

/**
 * GET /api/destinations/:id
 * GET /api/v1/destinations/:id
 */
destinationsRouter.get('/:id', (req: Request, res: Response): void => {
  const all = loadDestinations();
  const { id } = req.params;
  const found = all.find((d) => d.id === id || d.id === `mumbai-${id}` || d.id === `pune-${id}`);

  if (!found) {
    res.status(404).json({
      success: false,
      error: 'DESTINATION_NOT_FOUND',
      message: `Destination with ID '${id}' not found in Maharashtra collection.`,
    });
    return;
  }

  res.json({
    success: true,
    data: found,
    destination: found,
  });
});
