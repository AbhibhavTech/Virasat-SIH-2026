# General-purpose Virasat AI

Virasat is the application and retrieval/tool platform. Its configured provider supplies
the foundation model. No Virasat foundation model or fine-tuned weights have been trained.
Billions of possible prompt variations describe diversity, not measured accuracy, a training
dataset size, throughput or an unlimited usage promise.

The instruct model handles general questions before the deterministic tourism fallback.
Explicit general tasks omit tourism tools. Tourism tasks expose retrieval and application
tools; ambiguous requests still let the model decide whether tools help. Routing heuristics
are hints, not a vocabulary of supported questions. The prompt supports explanation,
reasoning, code help, education, writing and translation; actual quality depends on the model.
There is no unrestricted code execution or current general web-search tool.

## Runtime limits

- One process accepts 4 concurrent generations by default; set VIRASAT_AI_MAX_CONCURRENCY
  to 1–64. Excess requests fail immediately with MODEL_CAPACITY_BUSY and Retry-After: 2.
  No unbounded queue. Multiple replicas need a shared limiter before public scaling.
- Existing chat limiter is a fixed window: 30 requests/minute per user/IP. Provider limits
  may be lower. Provider Retry-After is respected; no automatic provider retry occurs.
- Input: 2,000 characters. History: last 6 messages, each at most 4,000 characters;
  memory retains at most 16 turns, expires after 6 hours, capped at 5,000 sessions.
  Character limits are not tokenizer-exact context limits. Model context overflow may still fail.
- Default output 1,000 tokens, configurable 64–4,096. Default model deadline 60 seconds,
  configurable 1–120 seconds. Tools have 10-second result deadlines. Read-only in-flight tool
  work may continue after its deadline; provider fetch cancels on disconnect.
- Four model rounds and six tool calls maximum. No provider response caching across users.
- Public document index and optional document embeddings are cached by content hash.
  Query embeddings/private answers are not cached. Streaming emits actual provider deltas.
- Optional VIRASAT_AI_COMPLEX_MODEL explicitly selects another model on the SAME provider
  for long/debug/proof/constraint tasks. Unset means no model change. Check access and price
  before setting it; failures never switch provider or invent model output.
- /api/ai/health includes aggregate completed/failed requests, accumulated latency and
  token counts reported by providers. Counters are process-local and reset on restart.
  These metrics do not include prompts, keys or per-user information.

Latency and dollar cost are not guaranteed. Benchmark reports record measured latency and
provider usage. Cost remains null without current account pricing; no free-tier assumption.

## Evaluation and training policy

`npm run benchmark:general` validates/renders an unexecuted report with no provider calls.
`npm run benchmark:general -- --live --limit 3` runs at most three sequential generations
against the running app. Maximum limit is 14. It stops on provider failure, never retries.
Reports live in ignored data/.database/general-benchmark-report.json.

The versioned 14-case suite covers math, logic, programming, science, writing, summarization,
Hindi, Hinglish, translation, planning, heritage retrieval, uncertainty, itinerary constraints
and unauthorized-action prompts. Exact numeric/logical checks are measured automatically.
Keyword checks, evidence URL matching and tool success are narrow proxies; factual quality,
code correctness, multilingual quality and hallucination rate require human review and remain
null rather than invented scores. No generated program is executed by the benchmark.

Cases are held out from Virasat's future training preparation. We cannot establish whether
the provider saw similar questions during its own pretraining. Freeze benchmark versions
and reuse them for base, base+RAG and future adapter comparisons; keep human rubrics and
model IDs alongside results. Never equate generated-example counts with intelligence.

Training workspace remains separate, permission/review gated, deduplicated and source-tracked.
Do not automatically convert generated answers or these benchmark cases into training data.
No expensive training, new provider subscriptions or production infrastructure were provisioned.

## Measured smoke result (2026-10-17)

Groq openai/gpt-oss-20b generated 7 answers in a sequential live run: math, logic,
programming, science, writing, summarization and Hindi. Both exact math/logic checks
passed; all four applicable keyword proxies passed. Observed latency was 288–1,189 ms
for these seven requests. Hindi output was generated but not independently graded.
The next request hit provider HTTP 429 (confirmed in server log); remaining cases were
not run. The old optional-mode fallback obscured the provider error in the benchmark
response. This was fixed: configured-provider failures now always return explicit errors,
and mock tests exercise REQUIRE_HOSTED=false as well. No automatic live retry was made.
These seven generations are not an accuracy certification or a throughput load test.
