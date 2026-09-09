import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../../db/client';
import { requireAuth, requireRole, optionalAuth } from '../../middleware/auth';
import { validateBody, sendError } from '../../middleware/validate';

export const reportsRouter = Router();

const createReportSchema = z.object({
  place_id: z.string().optional(),
  issue_type: z.string().min(1, 'Issue type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  media_url: z.string().url().optional(),
});

const updateReportStatusSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']),
  note: z.string().optional(),
});

/**
 * GET /api/v1/reports
 */
reportsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const reports = await db.reports.findAll();
  res.json({
    success: true,
    data: reports,
    reports,
    count: reports.length,
  });
});

/**
 * POST /api/v1/reports
 */
reportsRouter.post('/', optionalAuth, validateBody(createReportSchema), async (req: Request, res: Response): Promise<void> => {
  const reporter = req.user?.name || req.user?.email || 'Anonymous Citizen';
  const id = `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newReport = await db.reports.create({
    id,
    place_id: req.body.place_id,
    reported_by: reporter,
    issue_type: req.body.issue_type,
    description: req.body.description,
    media_url: req.body.media_url,
    status: 'PENDING',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    data: newReport,
    report: newReport,
  });
});

/**
 * PATCH /api/v1/reports/:id/status
 * STRICTLY ROLE-GATED: Only moderator, heritage_officer, or admin can update report status.
 * Fixes Risk #14 from Blueprint V2.
 */
reportsRouter.patch(
  '/:id/status',
  requireAuth,
  requireRole('moderator', 'heritage_officer', 'admin'),
  validateBody(updateReportStatusSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await db.reports.updateStatus(id, status, req.user!.id);
    if (!updated) {
      sendError(res, 404, 'REPORT_NOT_FOUND', `Report with ID '${id}' not found`, req.requestId);
      return;
    }

    res.json({
      success: true,
      data: updated,
      report: updated,
      message: `Report status transitioned to ${status}`,
    });
  }
);
