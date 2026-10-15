import assert from 'node:assert/strict';
import { classifyProviderError } from '../ai/engine/providerErrors';

const secret = 'privatecredential';
const now = Date.parse('2026-10-15T00:00:00Z');
const classify = (body: unknown, headers: Record<string, string> = {}, status = 429) =>
  classifyProviderError(status, new Headers(headers), body, secret, now);
assert.equal(classify({ error: { code: 'rate_limit_exceeded' } }).category, 'rate_limit');
assert.equal(classify({ error: { type: 'rate_limit_error', code: 'slow_down' } }).category, 'rate_limit');
assert.equal(classify({ error: { code: 'insufficient_quota' } }).category, 'quota');
assert.equal(classify({ error: { type: 'insufficient_quota', code: 'credit_balance_exhausted' } }).category, 'billing');
for (const code of ['project_spend_limit_exceeded', 'organization_spend_limit_exceeded', 'billing_hard_limit_reached']) {
  assert.equal(classify({ error: { code } }).category, 'billing');
}
assert.equal(classify({ error: { code: 'organization_usage_limit_exceeded' } }).category, 'quota');
assert.equal(classifyProviderError(429, new Headers(), {}, secret, now, 'groq').category, 'rate_limit');
assert.equal(classifyProviderError(429, new Headers(), { error: { type: 'insufficient_quota' } }, secret, now, 'groq').category, 'quota');
assert.equal(classifyProviderError(400, new Headers(), { error: { type: 'invalid_request_error' } }, secret, now, 'groq').category, 'invalid_request');
for (const body of [null, 'bad JSON', [], {}, { error: null }, { error: { code: 123 } }]) {
  assert.equal(classify(body).category, 'unknown');
}
assert.equal(classify(null, {}, 401).category, 'authentication');
assert.equal(classify(null, {}, 403).category, 'access');
assert.equal(classify(null, { 'retry-after': '120' }).retry_after_seconds, 120);
assert.equal(classify(null, { 'retry-after': '0' }).retry_after_seconds, 0);
assert.equal(classify(null, { 'retry-after': '0.5' }).retry_after_seconds, 1);
assert.equal(classify(null, { 'retry-after': 'Thu, 15 Oct 2026 00:02:00 GMT' }).retry_after_seconds, 120);
for (const value of ['nonsense', '-1', '99999999999999999999999999999', secret]) {
  assert.equal(classify(null, { 'retry-after': value }).retry_after_seconds, null);
}
const sanitized = classify({ error: { code: secret, type: 'sk-secret', message: `Bearer ${secret}` } }, {
  'x-request-id': secret, 'x-ratelimit-limit-tokens': secret, 'authorization': secret,
  'x-ratelimit-remaining-requests': '0', 'x-ratelimit-reset-requests': '1m30s',
});
assert.equal(sanitized.provider_code, null);
assert.equal(sanitized.provider_type, null);
assert.equal(sanitized.request_id, null);
assert.equal(sanitized.rate_limits['x-ratelimit-remaining-requests'], '0');
assert.equal(sanitized.rate_limits['x-ratelimit-reset-requests'], '1m30s');
assert.ok(!JSON.stringify(sanitized).includes(secret));
assert.ok(!JSON.stringify(sanitized).includes('sk-secret'));
assert.equal(sanitized.provider, 'openai');
assert.match(classify({ error: { code: 'rate_limit_exceeded' } }).explanation, /manual retry/);
assert.match(classify({ error: { code: 'insufficient_quota' } }, { 'retry-after': '120' }).explanation, /does not resolve billing or quota/);
console.log('PASS: provider error classification, malformed errors, Retry-After numeric/date guidance, allowlisted headers and secret redaction. No live requests.');
