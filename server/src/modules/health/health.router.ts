import { Router, Request, Response } from 'express';
import { db } from '../../db/client';

export const healthRouter = Router();

/**
 * GET /health (Liveness Probe)
 * Confirms process is alive and responsive. Used by container orchestrators.
 */
healthRouter.get('/health', (req: Request, res: Response): void => {
  const mem = process.memoryUsage();
  res.json({
    status: 'ok',
    service: 'virasat-api',
    version: '1.0.0',
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    memory: {
      rss_mb: Math.round(mem.rss / 1024 / 1024),
      heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(mem.heapTotal / 1024 / 1024),
    },
  });
});

/**
 * GET /ready (Readiness Probe)
 * Confirms database and core seed catalogs are initialized and accessible.
 */
healthRouter.get('/ready', async (req: Request, res: Response): Promise<void> => {
  try {
    const places = await db.places.findAll({ limit: 1 });
    const states = await db.states.findAll();

    if (places.total === 0) {
      res.status(503).json({
        status: 'not_ready',
        error: 'DATABASE_SEEDS_MISSING',
        message: 'Database connection established, but core heritage catalog is empty.',
      });
      return;
    }

    res.json({
      status: 'ready',
      database: {
        status: 'healthy',
        total_places: places.total,
        total_states: states.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: 'not_ready',
      error: 'DATABASE_UNREACHABLE',
      message: err instanceof Error ? err.message : 'Database readiness probe failed.',
    });
  }
});
