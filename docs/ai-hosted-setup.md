# Virasat AI Astra hosted generation

The runtime uses native Node `fetch`, not an AI SDK. Select `openai`, `groq`, or
`gemini` with `VIRASAT_AI_PROVIDER`. OpenAI remains the default for backwards
compatibility. All three providers preserve the same Virasat system prompt,
conversation memory, local tourism tools and response contract. A custom
`VIRASAT_AI_BASE_URL` is intended for development/testing.

There is no hardcoded model name. Supply the exact API model ID accessible to
your provider project; a product display name or subscription name is insufficient.

Run npm commands from `D:\virasat`. Environment precedence is:

1. Existing process environment.
2. `D:\virasat\server\.env`.
3. `D:\virasat\.env`.

The loader never reads `D:\virasat.env`. Environment loading occurs before server
startup and independently of database configuration. File-backed AI settings are
re-read by the gateway and connection checker, so edits do not require a restart.
Inherited process variables still win; changing those requires restarting the
identified server process. Code changes also require a restart when using `npm run dev`.
Model IDs that resemble secret keys are rejected and omitted from diagnostics.

### Groq

Create a project-specific key in the [Groq API Keys console](https://console.groq.com/keys),
then copy this provider block into the root `.env` using a local editor:

```dotenv
VIRASAT_AI_PROVIDER=groq
GROQ_API_KEY=<secret-server-side-groq-key>
GROQ_MODEL=openai/gpt-oss-20b
VIRASAT_AI_REQUIRE_HOSTED=true
```

For a safe guided switch, set `GROQ_API_KEY` in the current shell or directly
in `.env`, then run `npm run setup:ai-groq`. The command never prints the key.
It preserves existing OpenAI settings under provider-specific names, removes
generic model/base URL overrides, selects Groq, verifies the account model list,
and sends one real request through the application route. If no key exists, it
stops before changing `.env`.

On Windows, `npm run setup:ai-groq:secure` prompts for the key with hidden input,
keeps it out of shell history, clears the temporary process variable, writes it
only to the ignored `.env`, then runs the same account/model and real-response
checks. Never paste the key into chat, source files, or a committed document.

`openai/gpt-oss-20b` is the default Groq model because Groq's official model
listing currently marks it as a production text model and its tool-use guide
supports local function calling. The connection checker also calls the authenticated
Groq `/models` endpoint and refuses to generate if this specific account cannot
access the configured model. Official general plan tables do not prove this
account's current plan, permissions, or remaining limits. Check those in the
[Groq limits page](https://console.groq.com/settings/limits).

Groq's official Free Plan table currently lists this model, but availability and
limits are account-specific and may change. The application does not label a
request as free or successful until the configured account accepts it. Groq
documents the base URL and `GROQ_API_KEY` setup in its
[OpenAI compatibility guide](https://console.groq.com/docs/openai) and
[quickstart](https://console.groq.com/docs/quickstart).

### OpenAI

The existing OpenAI configuration remains supported:

```dotenv
VIRASAT_AI_PROVIDER=openai
OPENAI_MODEL=<exact-openai-model-id>
VIRASAT_AI_API_KEY=<secret-server-side-openai-key>
OPENAI_BASE_URL=https://api.openai.com/v1
VIRASAT_AI_REQUIRE_HOSTED=true
```

`OPENAI_MODEL` and `OPENAI_API_KEY` remain fallback aliases for OpenAI. Groq
reads only `GROQ_API_KEY`; this prevents accidentally sending an OpenAI credential
to Groq. `GROQ_MODEL` is an optional fallback when `VIRASAT_AI_MODEL` is unset.
`OPENAI_BASE_URL`, `GROQ_BASE_URL`, and `GEMINI_BASE_URL` are provider-specific
optional overrides. `VIRASAT_AI_MODEL` and `VIRASAT_AI_BASE_URL` override all
providers, so leave
them unset for one-line provider switching. Avoid mixing credentials and URLs.
No VITE-prefixed credential, project ID or organization ID is required by this
gateway. The key needs access to the selected model and sufficient API quota.
The process requires outbound HTTPS connectivity to the configured provider.

### Gemini

Create an API key in [Google AI Studio](https://aistudio.google.com/apikey). To
switch securely on Windows, run `npm run setup:ai-gemini:secure` from
`D:\virasat`. The key is entered with hidden input and saved only to the ignored
root `.env`. Restart the app so the running server loads the Gemini provider, then
run `npm run check:ai-connection` to check the account's model list and make one
real chat request. Never paste the key into chat or commit it.

The setup uses Google's documented OpenAI-compatible endpoint and the current
`gemini-3.8-flash` model ID. It preserves existing OpenAI and Groq credentials,
sets Gemini as the active provider, and raises the default output ceiling from
1,000 to 8,192 tokens. To allow longer outputs, set
`VIRASAT_AI_MAX_TOKENS=65536` in `.env`; this is the documented output ceiling
for Gemini 3.8 Flash, while the actual account, request context, API quota and
provider limits still apply. Higher output ceilings can allow longer and more
expensive responses. A maximum is only a cap, not a request to generate that
many tokens.

```dotenv
VIRASAT_AI_PROVIDER=gemini
GEMINI_API_KEY=<secret-server-side-gemini-key>
GEMINI_MODEL=gemini-3.8-flash
VIRASAT_AI_MAX_TOKENS=8192
VIRASAT_AI_REQUIRE_HOSTED=true
```

Google documents a 65,536-token output limit for Gemini 3.8 Flash, but provider
rate limits and quotas are separate from this per-response model limit. Check
the actual project's current tier and limits in Google AI Studio. The application
does not claim unlimited API quota.

`VIRASAT_AI_REQUIRE_HOSTED=true` prevents local canned responses while configuration
is missing. A configured provider failure always returns an explicit error;
it never silently changes to the local data engine. Without this flag or provider
configuration, the existing local-data mode remains available for offline use.

Start or restart `npm run dev`, then run `npm run check:ai-connection`. For Groq
and Gemini, the checker first verifies the selected model through the authenticated
`/models` listing.
It then sends one short non-sensitive prompt through `/api/ai/chat`, verifies
hosted generation and the selected model, and displays no API keys or provider
bodies. A successful health
check alone is not proof of model access. Errors distinguish authentication (401),
access (403), endpoint/model not found (404), classified HTTP 429 errors, insufficient
quota, timeouts and malformed responses. Failed checks return a nonzero exit code.

## Provider error diagnostics

The gateway exposes only allowlisted status, error code/type, request ID,
Retry-After and rate-limit headers. Raw provider messages and bodies are not
logged or returned, because they can echo credentials or request content.
The chat UI displays the sanitized explanation returned by the backend.

HTTP 429 alone does not establish the cause. `rate_limit_exceeded` or
`rate_limit_error` indicates temporary limiting; `insufficient_quota` indicates
quota restrictions without necessarily identifying the exact account setting.
`credit_balance_exhausted` identifies exhausted prepaid credits. Specific
project/organization spend-limit codes identify their corresponding restriction.
Unrecognized or malformed errors remain explicitly unclassified.
Groq documents HTTP 429 as rate limiting and supplies `Retry-After` when a rate
limit is hit, so a Groq 429 is categorized as a temporary rate limit unless a
more specific sanitized quota/billing code proves otherwise.

There are no automatic provider retries. A valid Retry-After (seconds or HTTP
date) blocks new attempts for the same endpoint/model/credential in this server
process until the delay expires. The app response includes the remaining
Retry-After and `provider_request_sent: false` for deferred attempts. This
cooldown is in memory: separate processes or server restarts do not share it.
Billing and quota failures require account action even after the delay expires.

On 2026-10-15, one real connection check through `/api/ai/chat` reached
`https://api.openai.com/v1/chat/completions` with model `gpt-5.5`. OpenAI returned
HTTP 429, type `insufficient_quota`, code `credit_balance_exhausted`, request ID
`req_8f7480084e5a4e128f0098d5e71c60a1`. No Retry-After or allowlisted rate-limit
headers were present. Real model generation and model accessibility remain
unverified. Add API prepaid credits for the credential's account, then run one
manual `npm run check:ai-connection`. Do not change models to hide this failure.

Diagnostic tests: `npx tsx scripts/test_provider_errors.ts`;
integration/cooldown tests: `npm run test:ai-hosted`. Both use no live provider.
Provider reference: https://developers.openai.com/api/docs/guides/error-codes

## Supplied corpus

`ai/evaluation/india-prompts.json` contains 12,500 evaluation templates, not learned
weights, default answers or runtime instructions. `supplied-task-spec.md` preserves
the supplied engineering document. The runtime prompt in `astraSystemPrompt.ts`
contains reviewed assistant behaviour; repository editing instructions stay out.

`npm run evaluate:ai` resolves placeholders from repository fixtures and writes
per-case passed/failed/skipped/blocked statuses. With no configured provider,
generated-answer evaluation is blocked, regardless of schema validity. The import
report verifies all JSON/CSV rows match. Language-style labels in the supplied
templates do not prove that the underlying text is translated into each language.

For a bounded paid smoke run against the running server:
`npm run evaluate:ai -- --live-limit 5` (maximum 20 cases). Context cases can
require more than one chat turn and each turn can make bounded tool rounds.
Automated smoke checks are not full factual or language quality grading.
`npm run test:ai-hosted` uses only a local mock provider to test integration/failures.

The corpus is never bundled into the frontend or included in every model prompt.
Adding examples does not train a model. Live transport inventory, hotel availability
and weather still require separate integrations; the model must state these limits.
