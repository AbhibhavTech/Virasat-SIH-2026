import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const sourceDir = process.argv[2];
if (!sourceDir) throw new Error('Usage: node scripts/import_ai_evaluation_corpus.mjs <source-directory>');
const base = 'virasat_codex_india_ai_12500_test_prompts';
const jsonText = fs.readFileSync(path.join(sourceDir, `${base}.json`), 'utf8').replace(/^\uFEFF/, '');
const csvText = fs.readFileSync(path.join(sourceDir, `${base}.csv`), 'utf8').replace(/^\uFEFF/, '');
const corpus = JSON.parse(jsonText);

function parseCsv(input) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i++; }
      else if (!quoted && cell.length) throw new Error('Malformed CSV quoting');
      else quoted = !quoted;
    } else if (!quoted && (c === ',' || c === '\n')) {
      row.push(cell.replace(/\r$/, '')); cell = '';
      if (c === '\n') { rows.push(row); row = []; }
    } else cell += c;
  }
  if (quoted) throw new Error('Unterminated CSV quote');
  if (cell.length || row.length) { row.push(cell.replace(/\r$/, '')); rows.push(row); }
  return rows;
}

const [header, ...rows] = parseCsv(csvText);
const required = ['case_id', 'domain', 'domain_name', 'language_style', 'prompt_template', 'expected_primary_intent', 'must_not_do', 'requires_live_data', 'requires_prior_context', 'city_scope', 'evaluation_dimensions'];
if (corpus.count !== 12500 || corpus.cases?.length !== 12500 || rows.length !== 12500) throw new Error('Expected exactly 12,500 cases in each format');
if (required.some(key => !header.includes(key))) throw new Error('CSV schema mismatch');
const ids = new Set(); const placeholders = new Set(); const domains = {}; const styles = {};
for (let i = 0; i < corpus.cases.length; i++) {
  const entry = corpus.cases[i];
  if (required.some(key => typeof entry[key] !== 'string' || !entry[key].trim())) throw new Error(`Missing field at row ${i + 1}`);
  if (!/^VIR-\d{5}$/.test(entry.case_id) || ids.has(entry.case_id)) throw new Error(`Invalid or duplicate ID ${entry.case_id}`);
  ids.add(entry.case_id);
  for (const key of ['requires_live_data', 'requires_prior_context']) if (!['true', 'false'].includes(entry[key])) throw new Error(`Invalid boolean ${entry.case_id}:${key}`);
  if (rows[i].length !== header.length) throw new Error(`Invalid CSV column count: ${entry.case_id}`);
  for (const key of required) if (entry[key] !== rows[i][header.indexOf(key)]) throw new Error(`JSON/CSV mismatch ${entry.case_id}:${key}`);
  for (const match of entry.prompt_template.matchAll(/\{([^}]+)\}/g)) placeholders.add(match[1]);
  domains[entry.domain] = (domains[entry.domain] || 0) + 1;
  styles[entry.language_style] = (styles[entry.language_style] || 0) + 1;
}
const target = path.resolve('ai/evaluation'); fs.mkdirSync(target, { recursive: true });
fs.writeFileSync(path.join(target, 'india-prompts.json'), `${JSON.stringify(corpus, null, 2)}\n`);
fs.copyFileSync(path.join(sourceDir, 'virasat_codex_india_ai_master_prompt.md'), path.join(target, 'supplied-task-spec.md'));
const report = { validation: 'passed', cases: ids.size, csv_json_records_matched: rows.length, domains, language_styles: styles, placeholders: [...placeholders].sort(),
  json_sha256: crypto.createHash('sha256').update(jsonText).digest('hex'), csv_sha256: crypto.createHash('sha256').update(csvText).digest('hex'),
  note: 'Schema and file equivalence validated for every case. This does not mean model answers passed. Corpus is evaluation-only; excluded from runtime prompts.' };
fs.writeFileSync(path.join(target, 'import-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
