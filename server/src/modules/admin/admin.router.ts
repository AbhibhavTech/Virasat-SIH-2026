import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { db } from '../../db/client';
import { sendError } from '../../middleware/validate';

const execFileAsync = promisify(execFile);

export const adminRouter = Router();

/**
 * GET /api/v1/admin/metrics
 * Returns aggregate health, completeness and verification counts
 */
adminRouter.get('/metrics', async (req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await db.getAdminMetrics();
    res.json({
      success: true,
      data: metrics,
    });
  } catch (err: any) {
    sendError(res, 500, 'ADMIN_METRICS_ERROR', err.message, req.requestId);
  }
});

/**
 * GET /api/v1/admin/places
 * Search and filter places including all verification statuses (draft, pending, verified, needs_review, rejected)
 */
adminRouter.get('/places', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      stateId,
      cityId,
      status,
      verification_status,
      topic,
      subtopic,
      missing_image,
      missing_source,
      search,
      limit,
      offset,
    } = req.query;

    const parsedLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
    const parsedOffset = Math.max(Number(offset) || 0, 0);

    const result = await db.places.findAll({
      stateId: stateId as string | undefined,
      cityId: cityId as string | undefined,
      verification_status: (status || verification_status) as string | undefined,
      topic: topic as string | undefined,
      subtopic: subtopic as string | undefined,
      missing_image: missing_image === 'true',
      missing_source: missing_source === 'true',
      search: search as string | undefined,
      includeAllStatuses: true,
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
  } catch (err: any) {
    sendError(res, 500, 'ADMIN_PLACES_FETCH_ERROR', err.message, req.requestId);
  }
});

/**
 * POST /api/v1/admin/places
 * Create a new tourist place with validation
 */
adminRouter.post('/places', async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    if (!payload.name || !payload.name.trim()) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Place name is required', req.requestId);
      return;
    }
    if (!payload.city_id || !payload.city_id.trim()) {
      sendError(res, 400, 'VALIDATION_ERROR', 'city_id is required', req.requestId);
      return;
    }

    const placeId = payload.id || `${payload.city_id}-${payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

    const created = await db.places.create({
      ...payload,
      id: placeId,
      slug: payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      verification_status: payload.verification_status || 'draft',
    });

    res.status(201).json({
      success: true,
      data: created,
      message: 'Place created successfully',
    });
  } catch (err: any) {
    sendError(res, 400, 'ADMIN_PLACE_CREATE_ERROR', err.message, req.requestId);
  }
});

/**
 * PUT /api/v1/admin/places/:id
 * Update an existing place
 */
adminRouter.put('/places/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await db.places.findById(id);
    if (!existing) {
      sendError(res, 404, 'NOT_FOUND', `Place with id '${id}' not found`, req.requestId);
      return;
    }

    const updated = await db.places.update(id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Place updated successfully',
    });
  } catch (err: any) {
    sendError(res, 400, 'ADMIN_PLACE_UPDATE_ERROR', err.message, req.requestId);
  }
});

/**
 * PATCH /api/v1/admin/places/:id/status
 * Quick update verification status (draft, pending, verified, needs_review, rejected)
 */
adminRouter.patch('/places/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const allowed = ['draft', 'pending', 'verified', 'needs_review', 'rejected'];

    if (!status || !allowed.includes(status.toLowerCase())) {
      sendError(res, 400, 'INVALID_STATUS', `Status must be one of: ${allowed.join(', ')}`, req.requestId);
      return;
    }

    const updated = await db.places.update(id, {
      verification_status: status.toLowerCase(),
      last_verified_on: status.toLowerCase() === 'verified' ? new Date().toISOString().split('T')[0] : undefined,
    });

    if (!updated) {
      sendError(res, 404, 'NOT_FOUND', `Place with id '${id}' not found`, req.requestId);
      return;
    }

    res.json({
      success: true,
      data: updated,
      message: `Place status updated to '${status}'`,
    });
  } catch (err: any) {
    sendError(res, 400, 'ADMIN_STATUS_UPDATE_ERROR', err.message, req.requestId);
  }
});

/**
 * DELETE /api/v1/admin/places/:id
 * Delete a place
 */
adminRouter.delete('/places/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await db.places.delete(id);
    if (!deleted) {
      sendError(res, 404, 'NOT_FOUND', `Place with id '${id}' not found`, req.requestId);
      return;
    }
    res.json({
      success: true,
      message: 'Place deleted successfully',
    });
  } catch (err: any) {
    sendError(res, 500, 'ADMIN_PLACE_DELETE_ERROR', err.message, req.requestId);
  }
});

/**
 * GET /api/v1/admin/cities
 */
adminRouter.get('/cities', async (req: Request, res: Response): Promise<void> => {
  try {
    const { stateId } = req.query;
    let cities = await db.cities.findAll();
    if (stateId) {
      cities = cities.filter((c) => c.state_id?.toLowerCase() === (stateId as string).toLowerCase());
    }
    res.json({
      success: true,
      data: cities,
      total: cities.length,
    });
  } catch (err: any) {
    sendError(res, 500, 'ADMIN_CITIES_ERROR', err.message, req.requestId);
  }
});

/**
 * POST /api/v1/admin/cities
 */
adminRouter.post('/cities', async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    if (!payload.name || !payload.state_id) {
      sendError(res, 400, 'VALIDATION_ERROR', 'City name and state_id are required', req.requestId);
      return;
    }
    const cityId = payload.id || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = await db.cities.create({
      ...payload,
      id: cityId,
      slug: payload.slug || cityId,
      entity_type: payload.entity_type || 'city',
    });
    res.status(201).json({
      success: true,
      data: created,
      message: 'City created successfully',
    });
  } catch (err: any) {
    sendError(res, 400, 'ADMIN_CITY_CREATE_ERROR', err.message, req.requestId);
  }
});

/**
 * PUT /api/v1/admin/cities/:id
 */
adminRouter.put('/cities/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await db.cities.update(id, req.body);
    if (!updated) {
      sendError(res, 404, 'NOT_FOUND', `City with id '${id}' not found`, req.requestId);
      return;
    }
    res.json({
      success: true,
      data: updated,
      message: 'City updated successfully',
    });
  } catch (err: any) {
    sendError(res, 400, 'ADMIN_CITY_UPDATE_ERROR', err.message, req.requestId);
  }
});

/**
 * DELETE /api/v1/admin/cities/:id
 */
adminRouter.delete('/cities/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await db.cities.delete(id);
    if (!deleted) {
      sendError(res, 404, 'NOT_FOUND', `City with id '${id}' not found`, req.requestId);
      return;
    }
    res.json({
      success: true,
      message: 'City deleted successfully',
    });
  } catch (err: any) {
    sendError(res, 500, 'ADMIN_CITY_DELETE_ERROR', err.message, req.requestId);
  }
});

/**
 * GET /api/v1/admin/states
 */
adminRouter.get('/states', async (req: Request, res: Response): Promise<void> => {
  try {
    const states = await db.states.findAll();
    res.json({
      success: true,
      data: states,
      total: states.length,
    });
  } catch (err: any) {
    sendError(res, 500, 'ADMIN_STATES_ERROR', err.message, req.requestId);
  }
});

/**
 * POST /api/v1/admin/states
 */
adminRouter.post('/states', async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    if (!payload.name) {
      sendError(res, 400, 'VALIDATION_ERROR', 'State name is required', req.requestId);
      return;
    }
    const stateId = payload.id || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = await db.states.create({
      ...payload,
      id: stateId,
      slug: payload.slug || stateId,
      type: payload.type || payload.region_type || 'state',
    });
    res.status(201).json({
      success: true,
      data: created,
      message: 'State created successfully',
    });
  } catch (err: any) {
    sendError(res, 400, 'ADMIN_STATE_CREATE_ERROR', err.message, req.requestId);
  }
});

/**
 * PUT /api/v1/admin/states/:id
 */
adminRouter.put('/states/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await db.states.update(id, req.body);
    if (!updated) {
      sendError(res, 404, 'NOT_FOUND', `State with id '${id}' not found`, req.requestId);
      return;
    }
    res.json({
      success: true,
      data: updated,
      message: 'State updated successfully',
    });
  } catch (err: any) {
    sendError(res, 400, 'ADMIN_STATE_UPDATE_ERROR', err.message, req.requestId);
  }
});

/**
 * POST /api/v1/admin/reseed
 * Reseeds the database from static files
 */
adminRouter.post('/reseed', async (req: Request, res: Response): Promise<void> => {
  try {
    await db.seedFromStaticFiles();
    const metrics = await db.getAdminMetrics();
    res.json({
      success: true,
      data: metrics,
      message: 'Database successfully re-seeded from authoritative static files',
    });
  } catch (err: any) {
    sendError(res, 500, 'ADMIN_RESEED_ERROR', err.message, req.requestId);
  }
});

/**
 * GET /api/v1/admin/audit/summary
 * Retrieves latest live source audit report
 */
adminRouter.get('/audit/summary', async (req: Request, res: Response): Promise<void> => {
  try {
    const auditFile = path.join(process.cwd(), 'data', 'audits', 'final_live_source_audit.json');
    if (!fs.existsSync(auditFile)) {
      res.json({
        success: true,
        data: null,
        message: 'No live source audit has been recorded yet',
      });
      return;
    }
    const report = JSON.parse(fs.readFileSync(auditFile, 'utf8'));
    res.json({
      success: true,
      data: report,
    });
  } catch (err: any) {
    sendError(res, 500, 'AUDIT_SUMMARY_ERROR', err.message, req.requestId);
  }
});

/**
 * POST /api/v1/admin/audit/run
 * Runs live source validation audit against all verified places
 */
adminRouter.post('/audit/run', async (req: Request, res: Response): Promise<void> => {
  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'final_live_source_audit.mjs');
    await execFileAsync('node', [scriptPath], { timeout: 180000 });
    const auditFile = path.join(process.cwd(), 'data', 'audits', 'final_live_source_audit.json');
    const report = JSON.parse(fs.readFileSync(auditFile, 'utf8'));
    res.json({
      success: true,
      data: report,
      message: 'Live source audit completed and database updated successfully',
    });
  } catch (err: any) {
    sendError(res, 500, 'AUDIT_RUN_ERROR', err.message, req.requestId);
  }
});

