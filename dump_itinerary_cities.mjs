import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'src', 'data', 'cityItineraryData.ts');
const OUT = path.join(ROOT, 'data', '.tmp_itinerary_cities.json');

function extractBalanced(text, start, open, close) {
  let i = start;
  while (i < text.length && /\s/.test(text[i])) i++;
  if (text[i] !== open) return null;

  let depth = 0;
  let inStr = null;
  let escape = false;

  for (let j = i; j < text.length; j++) {
    const ch = text[j];
    if (inStr) {
      if (escape) { escape = false; continue; }
      if (ch === '\\') { escape = true; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === open) depth++;
    if (ch === close) {
      depth--;
      if (depth === 0) return text.slice(i, j + 1);
    }
  }
  return null;
}

function field(obj, key) {
  const re = new RegExp(
    `["']?${key}["']?\\s*:\\s*["']([^"']+)["']`
  );
  const m = obj.match(re);
  return m ? m[1].trim() : null;
}

function slug(v) {
  return String(v || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');
}

const text = fs.readFileSync(SOURCE, 'utf8');
const marker = 'ALL_INDIAN_TOURISM_CITIES';
const mi = text.indexOf(marker);
if (mi === -1) throw new Error('marker not found');

const eq = text.indexOf('=', mi);
const bracket = text.indexOf('[', eq);
const arr = extractBalanced(text, bracket, '[', ']');
if (!arr) throw new Error('could not balance array');

const cities = [];
let i = 0;
while (i < arr.length) {
  const b = arr.indexOf('{', i);
  if (b === -1) break;
  const obj = extractBalanced(arr, b, '{', '}');
  if (!obj) break;

  const id = field(obj, 'id') || field(obj, 'slug');
  const name = field(obj, 'name') || field(obj, 'city');
  const stateId = field(obj, 'state_id') || field(obj, 'stateId');

  if (id && name && stateId) {
    cities.push({ id: slug(id), name, state_id: slug(stateId) });
  }
  i = b + obj.length;
}

const unique = [...new Map(cities.map((c) => [c.id, c])).values()];
fs.writeFileSync(OUT, JSON.stringify(unique, null, 2) + '\n');

console.log('extracted:', unique.length);
console.log('wrote:', OUT);
console.log('sample:', unique.slice(0, 3));
console.log('has jodhpur:', unique.some((c) => c.id === 'jodhpur'));
console.log('has lucknow:', unique.some((c) => c.id === 'lucknow'));
