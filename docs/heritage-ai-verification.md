# Heritage AI integration verification — 2026-10-18

## Implemented
- Root all_heritages.json is read without modification. 45 sites feed 225 section/visitor search documents; missing sections remain empty, with available overview and practical facts retained.
- Heritage mtime invalidates retrieval and place caches. The existing embedding pipeline consumes the same documents; rebuilding embeddings requires an independently configured embedding provider.
- Heritage records replace same-name/ID legacy records; exact heritage matches receive retrieval priority.
- Place resolution supports canonical names, slugs and aliases, including Taj and Harmandir Sahib. Intent detection already consumes this resolver.
- Hosted generation receives the matched record before generation, including exact UNESCO status, sources, practical information and a /heritage/:slug action. Short explicit follow-ups retain the heritage context.
- Unfinished editorial placeholders and null fields are excluded from heritage context. No dataset content or authenticity was changed.
- All 23 selector language codes are accepted; unsupported codes fall back to the user's language. Language quality depends on the configured model.
- Fixed existing HeritageDetailPage badge property name (year).

## Previous assistant upgrades retained
Readable Markdown rendering; current location separate from destination; five-day luxury request extraction; honest rail/hotel limitations; editable trip drafts with authenticated explicit save; manual Retry-After retry; browser/account-scoped conversation history, deletion and location clearing. Regression tests cover ownership, confirmation, revision conflicts and idempotency. Live Google sign-in and production save were not exercised in this run.

## Evidence
- npm test, npm run lint, npm run build, test:ai-platform and test:ai-provider passed. Build retains bundle-size warnings and the existing missing Netlify BACKEND_URL deployment setting.
- python validate.py: records: 45 | total gaps vs targets: 380.
- Heritage tests: 45 records, 225 chunks, aliases, exact authenticity, null/placeholder filtering, all 23 language codes.
- Provider mock tests include Golden Temple tentative context and detail action through the actual HTTP chat handler.
- Real Groq /api/ai/chat request returned hosted_generative and /heritage/taj-mahal. No mock/local answer was substituted.
- First live response added unsupported numeric hours; a stricter source-only instruction was added. Second response preserved sunrise/sunset and Friday closure, but still mistranslated/added material details in Hindi (e.g. red marble versus red sandstone). Thus real generation is verified; complete factual accuracy and multilingual quality are NOT verified. Source grounding does not eliminate model hallucinations. Review against linked original sources before publication or travel decisions.
- Five records lack the new sections: Victoria Memorial, Baidyanath Temple, Kaziranga, Living Root Bridges and Rumtek Monastery. Original data gaps remain unchanged.

## Operating limits
History remains bounded in-process memory, not durable cross-server storage. Hotel inventory, actual train timetables and bookings are not connected. Semantic embedding indexing is optional and was not run against an external embedding provider. The selected Groq model and credentials were not changed. No foundation model ownership or unlimited coverage is claimed.
