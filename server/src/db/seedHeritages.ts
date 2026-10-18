import fs from 'fs';
import path from 'path';
import { HeritageRecord, LanguageRecord, TranslationRecord } from './types';

export const STATIC_LANGUAGES: LanguageRecord[] = [
  { code: 'en', name_en: 'English', name_native: 'English', script: 'Latin', rtl: false, scheduled_8th: true },
  { code: 'as', name_en: 'Assamese', name_native: 'অসমীয়া', script: 'Bengali-Assamese', rtl: false, scheduled_8th: true },
  { code: 'bn', name_en: 'Bengali', name_native: 'বাংলা', script: 'Bengali', rtl: false, scheduled_8th: true },
  { code: 'brx', name_en: 'Bodo', name_native: 'बड़ो', script: 'Devanagari', rtl: false, scheduled_8th: true },
  { code: 'doi', name_en: 'Dogri', name_native: 'डोगरी', script: 'Devanagari', rtl: false, scheduled_8th: true },
  { code: 'gu', name_en: 'Gujarati', name_native: 'ગુજરાતી', script: 'Gujarati', rtl: false, scheduled_8th: true },
  { code: 'hi', name_en: 'Hindi', name_native: 'हिन्दी', script: 'Devanagari', rtl: false, scheduled_8th: true },
  { code: 'kn', name_en: 'Kannada', name_native: 'ಕನ್ನಡ', script: 'Kannada', rtl: false, scheduled_8th: true },
  { code: 'ks', name_en: 'Kashmiri', name_native: 'كٲشُر', script: 'Perso-Arabic', rtl: true, scheduled_8th: true },
  { code: 'kok', name_en: 'Konkani', name_native: 'कोंकणी', script: 'Devanagari', rtl: false, scheduled_8th: true },
  { code: 'mai', name_en: 'Maithili', name_native: 'मैथिली', script: 'Devanagari', rtl: false, scheduled_8th: true },
  { code: 'ml', name_en: 'Malayalam', name_native: 'മലയാളം', script: 'Malayalam', rtl: false, scheduled_8th: true },
  { code: 'mni', name_en: 'Manipuri (Meitei)', name_native: 'ꯃꯤꯇꯩꯂꯣꯟ', script: 'Meitei Mayek', rtl: false, scheduled_8th: true },
  { code: 'mr', name_en: 'Marathi', name_native: 'मराठी', script: 'Devanagari', rtl: false, scheduled_8th: true },
  { code: 'ne', name_en: 'Nepali', name_native: 'नेपाली', script: 'Devanagari', rtl: false, scheduled_8th: true },
  { code: 'or', name_en: 'Odia', name_native: 'ଓଡ଼ିଆ', script: 'Odia', rtl: false, scheduled_8th: true },
  { code: 'pa', name_en: 'Punjabi', name_native: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', rtl: false, scheduled_8th: true },
  { code: 'sa', name_en: 'Sanskrit', name_native: 'संस्कृतम्', script: 'Devanagari', rtl: false, scheduled_8th: true },
  { code: 'sat', name_en: 'Santhali', name_native: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', rtl: false, scheduled_8th: true },
  { code: 'sd', name_en: 'Sindhi', name_native: 'سنڌي', script: 'Perso-Arabic', rtl: true, scheduled_8th: true },
  { code: 'ta', name_en: 'Tamil', name_native: 'தமிழ்', script: 'Tamil', rtl: false, scheduled_8th: true },
  { code: 'te', name_en: 'Telugu', name_native: 'తెలుగు', script: 'Telugu', rtl: false, scheduled_8th: true },
  { code: 'ur', name_en: 'Urdu', name_native: 'اردو', script: 'Perso-Arabic', rtl: true, scheduled_8th: true },
];

export function getHeritagesFilePath(): string {
  const candidates = [
    path.resolve(process.cwd(), 'all_heritages.json'),
    path.resolve(process.cwd(), 'data/heritage_db/all_heritages.json'),
    path.resolve(process.cwd(), 'data/all_heritages.json'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

export function loadAllHeritagesFromDisk(): HeritageRecord[] {
  const filePath = getHeritagesFilePath();
  if (!fs.existsSync(filePath)) {
    console.warn(`[Heritage Seed] File not found: ${filePath}`);
    return [];
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const items = JSON.parse(raw);
  if (!Array.isArray(items)) return [];

  return items.map((item: any, idx: number): HeritageRecord => {
    const listNo = typeof item.list_no === 'number' ? item.list_no : idx + 1;
    const auth = item.authenticity || {};
    return {
      id: listNo,
      slug: item.slug,
      list_no: listNo,
      name: item.name,
      alt_names: Array.isArray(item.alt_names) ? item.alt_names : [],
      category: item.category || 'monument',
      state_ut: item.state_ut,
      district_city: item.district_city,
      lat: item.coordinates?.lat ?? null,
      lng: item.coordinates?.lng ?? null,
      era: item.era ?? null,
      builder: item.builder ?? null,
      built_year_from: item.built_year_from ?? null,
      built_year_to: item.built_year_to ?? null,
      unesco_status: auth.unesco_status || item.unesco_status || 'unverified',
      unesco_ref_id: auth.unesco_ref_id ?? item.unesco_ref_id ?? null,
      unesco_inscribed_year: auth.unesco_inscribed_year ?? item.unesco_inscribed_year ?? null,
      unesco_site_name: auth.unesco_site_name ?? item.unesco_site_name ?? null,
      unesco_url: auth.unesco_url ?? item.unesco_url ?? null,
      asi_protected: auth.asi_protected ?? item.asi_protected ?? null,
      last_verified_on: auth.last_verified_on ?? item.last_verified_on ?? null,
      verified_by: auth.verified_by ?? item.verified_by ?? null,
      review_status: item.review_status || 'draft',
      overview: item.overview ?? null,
      history: item.history ?? null,
      architecture: item.architecture ?? null,
      cultural_significance: item.cultural_significance ?? null,
      opening_hours: item.practical?.opening_hours ?? item.opening_hours ?? null,
      ticket_prices: item.practical?.ticket_prices ?? item.ticket_prices ?? null,
      accessibility: item.practical?.accessibility ?? item.accessibility ?? null,
      visitor_rules: item.practical?.rules ?? item.visitor_rules ?? [],
      best_season: item.best_season ?? null,
      recommended_duration: item.visitor_guide?.recommended_duration ?? item.recommended_duration ?? null,
      content_status: item.content_status ?? 'outline',
      features: (item.features || []).map((f: any, i: number) => ({
        sort: i + 1,
        title: f.title || '',
        description: f.description || '',
      })),
      timeline: (item.timeline || []).map((t: any, i: number) => ({
        sort: i + 1,
        year_label: String(t.year || t.year_label || ''),
        event: t.event || '',
        source_id: t.source_id,
      })),
      visitor_guide: {
        recommended_duration: item.visitor_guide?.recommended_duration ?? null,
        stops: (item.visitor_guide?.stops || []).map((s: any, i: number) => ({
          sort: i + 1,
          title: s.title || '',
          minutes: s.minutes,
          photo_tip: s.photo_tip,
        })),
      },
      practical: {
        opening_hours: item.practical?.opening_hours ?? null,
        ticket_prices: item.practical?.ticket_prices ?? null,
        accessibility: item.practical?.accessibility ?? null,
        rules: item.practical?.rules ?? [],
      },
      travel: (item.travel || []).map((tr: any) => ({
        mode: tr.mode || '',
        hub_name: tr.hub || tr.hub_name || '',
        distance_km: tr.distance_km,
        note: tr.note,
      })),
      nearby: (item.nearby || []).map((n: any, i: number) => ({
        sort: i + 1,
        name: n.name || '',
        distance_km: n.distance_km,
        note: n.note,
        related_slug: n.related_slug || null,
      })),
      facts: item.facts || [],
      media: item.media || {},
      sources: (item.sources || []).map((src: any) => ({
        title: src.title || '',
        publisher: src.publisher || '',
        url: src.url || '',
        source_type: src.source_type,
        accessed_on: src.accessed_on,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}
