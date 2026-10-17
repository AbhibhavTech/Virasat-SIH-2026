# Feature status â€” 2026-10-17

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
- English/Hindi/Hinglish: 45 deterministic checks pass. Fluent model language quality
  still requires human evaluation.
- Itinerary calculation exists; persistent AI modifications are blocked pending a trusted
  confirmation/ownership flow. Models cannot bypass this with a confirmed=true argument.
- PostgreSQL structured retrieval implemented through existing parameterized repository;
  current running server reports JSON fallback. PostgreSQL integration is not verified here.
- Optional embeddings/hybrid retrieval implemented; live embedding service not verified.
- Context window is bounded to recent turns; automatic long-conversation summarization is missing.

## Missing

- Full held-out base/RAG/fine-tuned comparative benchmark and human language/fact grading.
- Complete frontend automated interaction suite, distributed session storage and user-managed
  data retention. Authenticated users now have separate memory namespaces; anonymous
  conversation IDs remain bearer capabilities and must be kept private.
- QLoRA hardware validation and adapter serving verification.

## Blocked by credentials, external services, or infrastructure

- Local model generation: requires a locally installed tool-capable model/server.
- Semantic indexing: requires VIRASAT_EMBEDDING_URL and VIRASAT_EMBEDDING_MODEL;
  credential if the endpoint requires one. No automatic embedding job is run.
- Google bridge now verifies Firebase Google ID tokens and Google One Tap ID tokens
  using official server SDKs. Seven mocked HTTP scenarios pass; real interactive
  Google login and project authorized-domain settings are not verified.
- Live hotel/transport inventory and current pricing require authorized service integrations.
- Fine-tuning requires permitted reviewed data, selected licensed weights and suitable hardware.

## Latest verification and remaining release constraints

- Full `npm test` passes, including all Phase 1–10 suites and 45 multilingual checks.
- TypeScript, production build, provider mocks, platform tests, seven Google auth
  scenarios and conversational regressions pass. Build still warns about bundle size.
- Deterministic chatbot tests now explicitly disable hosted configuration, so normal
  CI does not consume provider quota. Separate live connection/benchmark commands remain.
- An initial legacy behavior run reached Groq, generated two responses, then hit HTTP
  429. Its keyword checks do not certify factual accuracy; one generated date was
  unsupported. A subsequent single connection checker request succeeded with actual
  Groq generation and exact sentinel match. This confirms access at test time, not
  unlimited quota or factual accuracy.
- Deprecated hallucination tests now exercise explicitly labelled lexical entity
  coverage. Entity overlap is NOT factual claim verification.
- Bihar missing coordinates corrected using source-documented approximate locations;
  see coordinate_source_url and coordinate_note in the datasets.
- Non-breaking dependency fixes applied. npm audit still reports 12 advisories
  (9 high, 3 moderate); automatic suggestions require breaking dependency changes.
  A dependency migration and regression review remains before production release.
- Google login must be completed interactively on an authorized domain. Production
  requires a private JWT_SECRET of at least 32 characters. See google-auth-setup.md.

This delivery is not a claim that the entire master production specification is complete.
