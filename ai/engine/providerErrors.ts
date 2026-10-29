export interface ProviderDiagnostic {
  provider: 'openai' | 'groq' | 'gemini' | 'local' | 'compatible';
  http_status: number;
  category: 'rate_limit' | 'quota' | 'billing' | 'authentication' | 'access' | 'invalid_request' | 'unknown';
  provider_type: string | null;
  provider_code: string | null;
  request_id: string | null;
  retry_after_seconds: number | null;
  rate_limits: Record<string, string>;
  explanation: string;
}

const billing: Record<string, string> = {
  credit_balance_exhausted: 'The provider reports exhausted prepaid credits. Add credits in the API billing settings before retrying.',
  project_spend_limit_exceeded: 'The provider reports that the project hard spend limit was reached. Review that project limit before retrying.',
  organization_spend_limit_exceeded: 'The provider reports that the organization hard spend limit was reached. Review that limit before retrying.',
  billing_hard_limit_reached: 'The provider reports a billing hard limit. Review API billing and spending limits before retrying.',
};

export function classifyProviderError(status: number, headers: Headers, body: unknown, secret: string, now = Date.now(), provider: ProviderDiagnostic['provider'] = 'openai'): ProviderDiagnostic {
  // Only constrained metadata is exposed. Provider message/body is never returned:
  // it may contain request text, account identifiers or echoed credentials.
  const safe = (value: unknown, pattern: RegExp, max = 128): string | null =>
    typeof value === 'string' && value.length <= max && pattern.test(value) &&
    !/sk-|bearer|authorization/i.test(value) && !(secret && value.includes(secret)) ? value : null;
  const error = body && typeof body === 'object' && 'error' in body ? (body as any).error : null;
  const code = safe(error?.code, /^[a-z][a-z0-9_]*$/);
  const type = safe(error?.type, /^[a-z][a-z0-9_]*$/);
  const rawRetry = headers.get('retry-after');
  let delay: number | null = null;
  if (rawRetry && !(secret && rawRetry.includes(secret))) {
    const seconds = /^\d+(\.\d+)?$/.test(rawRetry) ? Number(rawRetry)
      : /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(rawRetry) ? Math.max(0, (Date.parse(rawRetry) - now) / 1000) : NaN;
    if (Number.isFinite(seconds) && seconds >= 0 && seconds <= Number.MAX_SAFE_INTEGER / 1000) delay = Math.ceil(seconds);
  }
  const rateLimits: Record<string, string> = {};
  for (const dimension of ['requests', 'tokens', 'project-tokens']) for (const kind of ['limit', 'remaining', 'reset']) {
    const name = `x-ratelimit-${kind}-${dimension}`;
    const value = safe(headers.get(name), kind === 'reset' ? /^(?:\d+(?:\.\d+)?(?:ms|s|m|h|d))+$/ : /^\d+$/, 60);
    if (value !== null) rateLimits[name] = value;
  }
  let category: ProviderDiagnostic['category'] = 'unknown';
  let explanation = `The provider returned HTTP ${status}; its safe error metadata does not establish the cause. Do not assume a temporary rate limit or exhausted billing quota.`;
  if (code && Object.prototype.hasOwnProperty.call(billing, code)) { category = 'billing'; explanation = billing[code]; }
  else if (['insufficient_quota', 'quota_exceeded', 'organization_usage_limit_exceeded'].includes(code || '') || type === 'insufficient_quota') {
    category = 'quota'; explanation = code === 'organization_usage_limit_exceeded'
      ? 'The provider reports an organization usage limit. Request a higher approved limit or contact provider support before retrying.'
      : 'The provider reports insufficient quota. Check API credits and project/organization limits; the response does not identify which setting needs changing.';
  } else if (status === 429 && (['rate_limit_exceeded', 'slow_down'].includes(code || '') || type === 'rate_limit_error')) {
    category = 'rate_limit'; explanation = 'The provider reports a temporary request/token rate limit. Reduce request frequency.';
  } else if (provider === 'groq' && status === 429) {
    category = 'rate_limit'; explanation = 'Groq returned its documented rate-limit status. Reduce request or token frequency and check the organization limits page.';
  } else if (status === 400 && type === 'invalid_request_error') {
    category = 'invalid_request'; explanation = 'The provider rejected the request or selected model as invalid. Check the configured model ID and provider compatibility.';
  } else if (status === 401) { category = 'authentication'; explanation = 'The provider rejected authentication. Check the server-side credential.'; }
  else if ([403, 404].includes(status)) { category = 'access'; explanation = 'The provider rejected access or could not find the endpoint/model. Confirm project permissions and the configured model; do not substitute another model automatically.'; }
  if (delay !== null) explanation += ` Retry-After requires waiting at least ${delay} seconds before another attempt. This does not resolve billing or quota restrictions.`;
  else if (category === 'rate_limit') explanation += ' No valid Retry-After was provided; wait before a manual retry. No automatic retry is performed.';
  return { provider, http_status: status, category, provider_type: type, provider_code: code,
    request_id: safe(headers.get('x-request-id'), /^[a-zA-Z0-9_-]+$/), retry_after_seconds: delay, rate_limits: rateLimits, explanation };
}

export class ProviderFailure extends Error {
  constructor(public diagnostic: ProviderDiagnostic, public deferred = false) {
    super(['quota', 'billing'].includes(diagnostic.category) ? 'MODEL_QUOTA_EXHAUSTED' : `MODEL_HTTP_${diagnostic.http_status}`);
  }
}
