import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import suite from '../ai/evaluation/general-benchmark.json';
const args = process.argv.slice(2);
const live = args.includes('--live');
const requested = Number(args[args.indexOf('--limit') + 1]);
const limit = args.includes('--limit') && Number.isInteger(requested) ? Math.min(14, Math.max(1, requested)) : 3;
const records: any[] = [];
for (const test of suite.cases.slice(0, live ? limit : suite.cases.length)) {
  if (!live) { records.push({ id: test.id, category: test.category, status: 'not_run' }); continue; }
  const start = Date.now();
  try {
    const response = await fetch(`${process.env.VIRASAT_TEST_SERVER || 'http://127.0.0.1:3000'}/api/ai/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(125000),
      body: JSON.stringify({ message: test.prompt, session_id: `benchmark-${randomUUID()}` }),
    });
    const body = await response.json();
    if (!response.ok || !['hosted_generative', 'local_generative'].includes(body.generation_mode)) {
      records.push({ id: test.id, status: 'blocked', http_status: response.status, category: body.provider_error?.category || 'unavailable' });
      break; // No retry loop or quota spending after provider failure.
    }
    const answer = String(body.reply || '');
    const exact = 'exact' in test ? answer.trim().toLowerCase() === test.exact?.toLowerCase() : null;
    const keywordProxy = 'terms' in test ? test.terms?.every(term => answer.toLowerCase().includes(term.toLowerCase())) : null;
    const sources = new Set(body.sources || []);
    const links = [...answer.matchAll(/https?:\/\/[^\s)\]>]+/g)].map(match => match[0]);
    const calls = Array.isArray(body.tool_calls) ? body.tool_calls : [];
    records.push({ id: test.id, category: test.category, status: 'generated', model: body.model_used, provider: body.provider_used,
      latency_ms: Date.now() - start, usage: body.usage || null, exact_correct: exact, keyword_proxy_pass: keywordProxy,
      retrieval_invoked: calls.some((call: any) => /searchTourist|searchHeritage|getSiteContent/.test(call.tool)),
      tool_success_count: calls.filter((call: any) => !call.result?.error).length, tool_count: calls.length,
      citation_urls_in_evidence: links.length ? links.every(link => sources.has(link)) : null,
      factual_accuracy_human: null, programming_accuracy_human: null, multilingual_quality_human: null,
      hallucination_rate: null, cost_usd: null, answer });
  } catch { records.push({ id: test.id, status: 'blocked', reason: 'request_failed_or_timed_out' }); break; }
}
for (const test of suite.cases) if (!records.some(row => row.id === test.id)) records.push({ id: test.id, category: test.category, status: 'not_run' });
const report = { version: suite.version, measured_at: new Date().toISOString(), live, policy: suite.policy,
  interpretation: 'Exact-answer checks cover only math/logic. Keywords and source URL matching are proxies, not proof of correctness. Unknown metrics stay null. Cost requires current account pricing.', records };
fs.mkdirSync('data/.database', { recursive: true });
fs.writeFileSync('data/.database/general-benchmark-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ cases: records.length, generated: records.filter(row => row.status === 'generated').length,
  exact_checks: records.filter(row => row.exact_correct !== null && row.exact_correct !== undefined).map(row => ({id:row.id,pass:row.exact_correct})),
  report: 'data/.database/general-benchmark-report.json' }));
if (records.some(row => row.status === 'blocked' || row.exact_correct === false)) process.exitCode = 1;
