import { Router, Request, Response } from 'express';
import { db } from '../../db/client';
import { STATIC_LANGUAGES } from '../../db/seedHeritages';

export const heritagesRouter = Router();

// GET /api/heritages/languages - List supported languages
heritagesRouter.get('/languages', async (_req: Request, res: Response) => {
  try {
    const languages = await db.languages.findAll();
    res.json({
      success: true,
      count: languages.length,
      data: languages.length > 0 ? languages : STATIC_LANGUAGES,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'LANGUAGES_FETCH_FAILED',
      message: error?.message || 'Failed to fetch languages',
      data: STATIC_LANGUAGES,
    });
  }
});

// GET /api/heritages - List heritage monuments and sites
heritagesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const state = typeof req.query.state === 'string' ? req.query.state : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const unesco_status = typeof req.query.unesco_status === 'string' ? req.query.unesco_status : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 100;
    const offset = req.query.offset ? parseInt(String(req.query.offset), 10) : 0;

    const result = await db.heritages.findAll({
      state,
      category,
      unesco_status,
      search,
      limit,
      offset,
      lang,
    });

    res.json({
      success: true,
      count: result.heritages.length,
      total: result.total,
      data: result.heritages,
    });
  } catch (error: any) {
    console.error('[Heritages Router] Error in list:', error);
    res.status(500).json({
      success: false,
      error: 'HERITAGE_LIST_FAILED',
      message: error?.message || 'Failed to retrieve heritage list',
    });
  }
});

// GET /api/heritages/:slug - Retrieve single heritage record by slug or list_no
heritagesRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;

    let record = await db.heritages.findBySlug(slug, lang);
    if (!record && /^\d+$/.test(slug)) {
      record = await db.heritages.findById(parseInt(slug, 10), lang);
    }

    if (!record) {
      res.status(404).json({
        success: false,
        error: 'HERITAGE_NOT_FOUND',
        message: `Heritage site '${slug}' was not found.`,
      });
      return;
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    console.error(`[Heritages Router] Error getting heritage ${req.params.slug}:`, error);
    res.status(500).json({
      success: false,
      error: 'HERITAGE_FETCH_FAILED',
      message: error?.message || 'Failed to retrieve heritage record',
    });
  }
});
