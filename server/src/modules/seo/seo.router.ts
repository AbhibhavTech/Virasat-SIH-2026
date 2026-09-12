import { Router, Request, Response } from 'express';
import { db } from '../../db/client';
import fs from 'fs';
import path from 'path';

export const seoRouter = Router();

export function buildRobotsTxt(): string {
  const robotsFilePath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsFilePath)) {
    return fs.readFileSync(robotsFilePath, 'utf8');
  }

  return [
    '# Virasat Heritage Platform Robots Policy',
    'User-agent: *',
    'Allow: /',
    'Allow: /explore',
    'Allow: /search',
    'Allow: /place/',
    'Allow: /city/',
    'Allow: /heritage',
    'Allow: /itinerary',
    'Allow: /map',
    'Allow: /3d',
    'Allow: /ai',
    'Disallow: /api/',
    'Disallow: /profile',
    'Disallow: /trips',
    'Disallow: /favorites',
    '',
    'Sitemap: https://virasat.in/sitemap.xml',
  ].join('\n');
}

export async function buildSitemapXml(): Promise<string> {
  const baseUrl = process.env.BASE_URL || 'https://virasat.in';
  const today = new Date().toISOString().split('T')[0];

  // Core static portal routes
  const coreRoutes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/explore', priority: '0.9', changefreq: 'daily' },
    { path: '/heritage', priority: '0.8', changefreq: 'weekly' },
    { path: '/itinerary', priority: '0.8', changefreq: 'weekly' },
    { path: '/map', priority: '0.8', changefreq: 'weekly' },
    { path: '/3d', priority: '0.8', changefreq: 'weekly' },
    { path: '/ai', priority: '0.8', changefreq: 'weekly' },
    { path: '/search', priority: '0.8', changefreq: 'daily' },
  ];

  // Fetch all destination places from database for sitemap indexing
  const placesResult = await db.places.findAll({ limit: 5000, includeAllStatuses: true });
  const places = placesResult.places || [];
  const verifiedCities = new Set<string>();

  const placeUrls = places.map((place: any) => {
    const cityVal = place.city_id || place.city;
    if (cityVal) {
      verifiedCities.add(String(cityVal).toLowerCase().replace(/\s+/g, '-'));
    }
    return `  <url>
    <loc>${baseUrl}/place/${encodeURIComponent(place.id)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  const cityUrls = Array.from(verifiedCities).map((citySlug) => {
    return `  <url>
    <loc>${baseUrl}/city/${encodeURIComponent(citySlug)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const staticUrls = coreRoutes.map((route) => {
    return `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join('\n')}
${cityUrls.join('\n')}
${placeUrls.join('\n')}
</urlset>`;
}

// -------------------------------------------------------------
// Route Handlers
// -------------------------------------------------------------
seoRouter.get('/robots.txt', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(buildRobotsTxt());
});

seoRouter.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    const xml = await buildSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=14400');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('[SEO Router] Failed to generate sitemap:', error);
    res.status(500).setHeader('Content-Type', 'text/plain').send('Error generating sitemap');
  }
});
