import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../../db/client';
import { requireAuth, requireRole, optionalAuth } from '../../middleware/auth';
import { validateBody, sendError } from '../../middleware/validate';
import { CitizenReportRecord, ReportSeverity, ReportStatus, DestinationHealthRecord } from '../../db/types';

export const reportsRouter = Router();

const createReportSchema = z
  .object({
    place_id: z.string().optional(),
    site_id: z.string().optional(),
    place_name: z.string().optional(),
    site_name: z.string().optional(),
    city: z.string().optional(),
    issue_type: z.string().optional(),
    issue_category: z.string().optional(),
    title: z.string().optional(),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    severity: z.string().optional().default('medium'),
    media_url: z.string().optional(),
    image_url: z.string().optional(),
    reported_by: z.string().optional(),
    user_role: z.string().optional(),
  })
  .refine((data) => Boolean(data.issue_type || data.issue_category), {
    message: 'Either issue_type or issue_category is required',
    path: ['issue_type'],
  });

const updateReportStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  note: z.string().optional(),
  resolution_notes: z.string().optional(),
  actor: z.string().optional(),
});

/**
 * GET /api/v1/reports
 * Moderation queue for officers; filtered self-reports for travellers; sanitized public view
 */
reportsRouter.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  const { place_id, site_id, status, severity, mine, city } = req.query;
  const targetPlaceId = (place_id || site_id) as string | undefined;
  const targetCity = city as string | undefined;

  const isOfficerOrAdmin =
    req.user?.role === 'moderator' ||
    req.user?.role === 'heritage_officer' ||
    req.user?.role === 'admin';

  let reports: CitizenReportRecord[];

  if (isOfficerOrAdmin) {
    reports = await db.reports.findAll({
      placeId: targetPlaceId,
      city: targetCity,
      status: status as string | undefined,
      severity: severity as string | undefined,
    });
  } else if (req.user && (mine === 'true' || !targetPlaceId)) {
    // Regular authenticated user viewing their own reports
    reports = await db.reports.findAll({
      userId: req.user.id,
      placeId: targetPlaceId,
      city: targetCity,
      status: status as string | undefined,
      severity: severity as string | undefined,
    });
  } else {
    // Public view: filtered to target place, sanitizing reporter identity
    const rawReports = await db.reports.findAll({
      placeId: targetPlaceId,
      city: targetCity,
      status: status as string | undefined,
      severity: severity as string | undefined,
    });
    reports = rawReports.map((r) => ({
      ...r,
      reported_by: 'Citizen Contributor',
      user_id: undefined,
    }));
  }

  res.json({
    success: true,
    total: reports.length,
    count: reports.length,
    data: reports,
    reports,
  });
});

/**
 * POST /api/v1/reports
 * Submit a citizen heritage maintenance / damage report
 */
reportsRouter.post(
  '/',
  optionalAuth,
  validateBody(createReportSchema),
  async (req: Request, res: Response): Promise<void> => {
    const reporter = req.body.reported_by || req.user?.name || req.user?.email || 'Anonymous Citizen';
    const id = `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const placeId = req.body.place_id || req.body.site_id;

    // Lookup place name and city if available
    let placeName = req.body.place_name || req.body.site_name;
    let city = req.body.city;
    if (placeId && (!placeName || !city)) {
      const p = await db.places.findById(placeId);
      if (p) {
        placeName = placeName || p.name;
        city = city || p.city_id || 'India';
      }
    }

    const rawIssueType = (req.body.issue_type || req.body.issue_category || 'other').toLowerCase();
    const rawSeverity = (req.body.severity || 'medium').toLowerCase();
    const validSeverity: ReportSeverity = (['low', 'medium', 'high', 'critical'].includes(rawSeverity)
      ? rawSeverity
      : 'medium') as ReportSeverity;

    const title =
      req.body.title ||
      `${rawIssueType.replace(/_/g, ' ').toUpperCase()} at ${placeName || 'Heritage Site'}`;

    const newReport: CitizenReportRecord = {
      id,
      place_id: placeId,
      place_name: placeName || 'Heritage Monument',
      city: city || 'India',
      reported_by: reporter,
      user_id: req.user?.id,
      issue_type: rawIssueType,
      title,
      description: req.body.description,
      severity: validSeverity,
      media_url: req.body.media_url || req.body.image_url,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = await db.reports.create(newReport);

    res.status(201).json({
      success: true,
      data: saved,
      report: saved,
      message: 'Citizen report received and queued for Archaeological Survey review.',
    });
  }
);

/**
 * PATCH /api/v1/reports/:id/status
 * STRICTLY ROLE-GATED: Only moderator, heritage_officer, or admin can triage report status.
 * Fixes Risk #14 from Master Blueprint V2.
 */
reportsRouter.patch(
  '/:id/status',
  requireAuth,
  requireRole('moderator', 'heritage_officer', 'admin'),
  validateBody(updateReportStatusSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status: inputStatus, note, resolution_notes } = req.body;
    const effectiveNotes = resolution_notes || note;

    let targetStatus = (inputStatus as string).toUpperCase().trim();
    if (targetStatus === 'SUBMITTED') targetStatus = 'PENDING';
    if (targetStatus === 'VERIFIED') targetStatus = 'UNDER_REVIEW';
    if (targetStatus === 'ASSIGNED') targetStatus = 'IN_PROGRESS';

    const validStatuses: ReportStatus[] = ['PENDING', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
    if (!validStatuses.includes(targetStatus as ReportStatus)) {
      sendError(res, 400, 'INVALID_STATUS', `Status must be one of: ${validStatuses.join(', ')}`, req.requestId);
      return;
    }

    const updated = await db.reports.updateStatus(
      id,
      targetStatus as ReportStatus,
      req.user!.id,
      effectiveNotes
    );

    if (!updated) {
      sendError(res, 404, 'REPORT_NOT_FOUND', `Report with ID '${id}' not found`, req.requestId);
      return;
    }

    res.json({
      success: true,
      data: updated,
      report: updated,
      message: `Report status transitioned to ${targetStatus} by verified officer (${req.user!.role})`,
    });
  }
);

/**
 * GET /api/v1/reports/destination-health
 * Destination Health & Preservation Scoring Engine
 */
reportsRouter.get('/destination-health', async (req: Request, res: Response): Promise<void> => {
  const city = (req.query.city as string) || undefined;
  const placesResult = await db.places.findAll(city ? { cityId: city } : undefined);
  const placesList = placesResult.places.slice(0, 20);

  const healthRecords = await Promise.all(
    placesList.map((p) => db.reports.calculateDestinationHealth(p.id))
  );

  const avgScore =
    healthRecords.length > 0
      ? Math.round(
          healthRecords.reduce((acc: number, h: DestinationHealthRecord) => acc + h.health_score, 0) /
            healthRecords.length
        )
      : 95;

  res.json({
    success: true,
    provenance_badge: 'OFFICIAL_AUDITED',
    provenance_disclaimer: 'Preservation health calculated from verified citizen steward reports and ASI inspections.',
    overall_health_score: avgScore,
    total_destinations_monitored: healthRecords.length,
    cities: healthRecords,
    gap_map_zones: healthRecords
      .filter((h: DestinationHealthRecord) => h.health_score < 75)
      .map((h: DestinationHealthRecord) => ({
        place_id: h.place_id,
        place_name: h.place_name,
        health_score: h.health_score,
        alert: `${h.open_issues_count} open stewardship issues flagged at ${h.place_name}.`,
      })),
  });
});

/**
 * GET /api/v1/reports/destination-health/:placeId
 * Single destination preservation score & issue breakdown
 */
reportsRouter.get('/destination-health/:placeId', async (req: Request, res: Response): Promise<void> => {
  const { placeId } = req.params;
  const health = await db.reports.calculateDestinationHealth(placeId);
  const recentReports = await db.reports.findAll({ placeId });

  res.json({
    success: true,
    data: {
      ...health,
      recent_reports: recentReports.slice(0, 5),
    },
  });
});
