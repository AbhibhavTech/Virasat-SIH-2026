import fs from 'node:fs';
import path from 'node:path';
const file = path.resolve(process.cwd(), 'all_heritages.json');
export const heritageStamp = () => fs.statSync(file).mtimeMs;
export function cleanHeritage(value: unknown): string {
  if (typeof value === 'string') return /\[.*words|TO BE CONFIRMED|^null$|^undefined$/i.test(value) ? '' : value.trim();
  if (Array.isArray(value)) return value.map(cleanHeritage).filter(Boolean).join('\n');
  if (value && typeof value === 'object') return Object.entries(value).map(([k,v]) => { const text = cleanHeritage(v); return text ? `${k}: ${text}` : ''; }).filter(Boolean).join('\n');
  return typeof value === 'number' || typeof value === 'boolean' ? String(value) : '';
}
export function loadHeritages(): any[] { return JSON.parse(fs.readFileSync(file, 'utf8')).map((r: any) => ({...r, alt_names:[...(r.alt_names || []), ...(r.slug === 'golden-temple' ? ['Harmandir Sahib'] : []), ...(r.slug === 'taj-mahal' ? ['Taj'] : [])]})); }
export function heritageContext(record: any) {
  return { slug: record.slug, name: record.name, aliases: record.alt_names || [], city: record.district_city, state: record.state_ut,
    tagline: cleanHeritage(record.tagline || record.overview), sections: ['history','beauty','architecture','famous_for'].map(key => ({key, text:cleanHeritage(record.sections?.find((s: any) => s.key === key)?.text || (key === 'beauty' ? record.overview : record[key]))})),
    quick_facts: (record.quick_facts || []).filter((f: any) => f.label !== 'UNESCO').map((f: any) => ({label:f.label,value:cleanHeritage(f.value)})),
    unesco_status: record.authenticity?.unesco_status || 'unverified', visitor_tips: cleanHeritage(record.visitor_tips),
    practical: cleanHeritage(record.practical), duration: cleanHeritage(record.visitor_guide?.recommended_duration),
    sources: (record.sources || []).filter((s: any) => typeof s.url === 'string' && /^https?:\/\//.test(s.url)), url: `/heritage/${record.slug}` };
}
export function matchHeritage(query: string) {
  const norm = (v: string) => v.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu,' ').trim();
  const text = ` ${norm(query)} `;
  return loadHeritages().flatMap(r => [r.name, r.slug, ...(r.alt_names || [])].map(name => ({r, name:norm(name)})))
    .filter(x => x.name && text.includes(` ${x.name} `)).sort((a,b) => b.name.length-a.name.length)[0]?.r;
}
