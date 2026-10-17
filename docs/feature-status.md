# Feature status — 2026-10-17

## Working and verified

- Groq account model listing and actual /api/ai/chat generation: connection checker
  returned hosted_generative, nonempty response and exact sentinel match for openai/gpt-oss-20b.
- Provider mocks: OpenAI/Groq config, missing keys, authentication/quota/rate failures,
  hosted-only refusal, redaction, history, transport tools and full Retry-After cooldown pass.
- New platform tests: local config isolation, schema checks, private-read and write denial,
  bounded context, source URL filtering, incremental ingestion and city isolation.
- 567 heritage documents indexed from the existing tourism hierarchy. Review metadata
  reflects the input records; this is not independent factual verification.
- Training preparation: three Python tests pass for permissions, deduplication,
  common PII pattern masking and entity-level split isolation. No training executed.
- Initial production build passes; Vite warns about a large application bundle.
- Subsequent TypeScript, platform (including fragmented SSE/tool deltas) and production
  build checks pass. Browser test on 127.0.0.1:3000 opened the shared assistant and
  returned a real Groq Agam Kuan/Patna answer with a retrieved source link (1530 ms shown).
  localhost in the in-app browser rendered blank with a WebSocket error; IPv4 URL worked.

## Partially implemented

- Source-grounded answers: retrieved URLs are displayed, but per-claim factual/citation
  verification is not implemented. Conflicting source records still require review.
- Shared page launcher and streaming display verified by one real browser query; full browser/mobile/accessibility
  test coverage remains incomplete. Sessions share backend history, not all frontend state.
- English/Hindi/Hinglish: existing deterministic cases partly pass; old festival regression
  fails. Fluent language quality is not certified by the small retrieval test.
- Itinerary calculation exists; persistent AI modifications are blocked pending a trusted
  confirmation/ownership flow. Models cannot bypass this with a confirmed=true argument.
- PostgreSQL structured retrieval implemented through existing parameterized repository;
  current running server reports JSON fallback. PostgreSQL integration is not verified here.
- Optional embeddings/hybrid retrieval implemented; live embedding service not verified.
- Context window is bounded to recent turns; automatic long-conversation summarization is missing.

## Missing

- Full held-out base/RAG/fine-tuned comparative benchmark and human language/fact grading.
- Complete frontend automated interaction suite, distributed session storage, user-managed
  data retention and comprehensive per-user conversation isolation.
- QLoRA hardware validation and adapter serving verification.

## Blocked by credentials, external services, or infrastructure

- Local model generation: requires a locally installed tool-capable model/server.
- Semantic indexing: requires VIRASAT_EMBEDDING_URL and VIRASAT_EMBEDDING_MODEL;
  credential if the endpoint requires one. No automatic embedding job is run.
- Google backend account bridge accepts no unverified profile login; currently returns
  GOOGLE_TOKEN_VERIFICATION_REQUIRED. Firebase UI configuration alone does not prove
  an authenticated backend session. Server token verification remains required.
- Live hotel/transport inventory and current pricing require authorized service integrations.
- Fine-tuning requires permitted reviewed data, selected licensed weights and suitable hardware.

## Existing failing checks

- npm test: data quality stops on bihar_018 and bihar_019 missing coordinates encoded as (0,0).
  No replacement coordinates were fabricated.
- test_ai_assistant_multilingual.ts: Mysore Dasara fixture returns no event and test then
  dereferences the missing event. Earlier cases in that run passed.
- test_assistant_prompt_regressions.ts was coupled to canned text while a hosted provider
  was configured; it made live requests and failed the exact Patna wording assertion.
  Do not use it as a provider-independent CI test until its environment is isolated.
- test_phase7_security_and_e2e.mjs imports a removed auditHallucinations export.
  This is an existing suite compatibility problem, not evidence of safety verification.

This delivery is not a claim that the entire master production specification is complete.
