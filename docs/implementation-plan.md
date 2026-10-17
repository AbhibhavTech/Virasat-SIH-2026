# Virasat implementation log — 2026-10-17

## Audit and dependency order

The inspected repository uses React/Vite, Express/TypeScript and a PostgreSQL/JSON
repository abstraction. No Python FastAPI inference service existed. Keep the working
TypeScript orchestration rather than introducing a second intent/resolver stack.
Both AI API aliases share ai/routes/chatHandler.ts. The model gateway already supported
Groq and OpenAI; deterministic local responses existed alongside it.

Baseline: TypeScript failed on missing intent types and obsolete auth state setters.
Provider mocks failed on changed transport output and subsequent hosted-only/cooldown
regressions. npm test stopped at two missing coordinates represented as (0,0).

1. Restore compilation, hosted-only failures and Retry-After handling.
2. Add local and compatible inference configuration; retain existing providers.
3. Bound/validate registry calls and block unconfirmed writes; redact tool failures.
4. Index source-traceable heritage passages and expose a retrieval tool. Use the existing
   parameterized database repository for structured search when PostgreSQL is active.
5. Add shared page launcher, minimal page context, source links and real SSE display.
6. Add optional embeddings and reciprocal-rank fusion; require explicit embedding setup.
7. Prepare permission-gated training datasets and explicit local LoRA experiment scripts.
8. Run automated checks and real provider smoke; document outstanding infrastructure and data issues.

## Phase delivery

A: inspected manifests, README, architecture, DB repository/seed, tools, request handler,
routes, frontend chat/auth and baseline tests. See feature-status.md for evidence.
B: provider configuration extended; hosted-only and cooldown regressions fixed;
token/timeout limits and provider usage aggregation added. SSE parses actual provider deltas.
C: incremental hash-based knowledge index, exact metadata filters, term expansion,
optional cached document embeddings and hybrid retrieval. No pgvector migration needed
for this small corpus. Existing database ownership preserved.
D: one shared chat implementation used by page launcher and AI page; public page path
and selected place context are passed, query strings and arbitrary metadata omitted.
E: registry schemas validated; private reads require authenticated backend context;
consequential AI tools blocked until application confirmation flow can enforce ownership.
F: inherited intent/entity/planning retained, missing safety/location type declarations fixed,
Hindi combining-mark retrieval corrected, original source URLs exposed.
G: safe error outputs, bounded tool execution, provider usage, streaming tests and
new platform assertions. Old suite failures are explicitly recorded, not suppressed.
H: separate training workspace with provenance/permission checks, PII patterns,
entity-grouped splits, LoRA script and artifact manifest. No model selected or trained.
I: compilation/build/provider and platform verification recorded in feature-status.md.

## Outstanding work

Production-grade completion still requires authenticated account/token integration,
cross-device conversation ownership, human source/data review, complete regression suite
repair, browser accessibility coverage, optional embedding deployment and GPU/model
evaluation. Streaming and local inference compatibility need testing against each selected
server/model. No production deployment or paid training is authorized by this implementation.
