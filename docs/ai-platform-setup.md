# Run the current Virasat AI platform

From D:\virasat:

```powershell
npm ci
npm run knowledge:ingest
npm run dev
```

Open http://localhost:3000. Run `npm run check:ai-connection` once after provider
configuration; it makes one real generation request and verifies the actual chat route.
Keep credentials only in ignored .env. Existing process variables override server/.env,
which overrides root .env. AI file settings refresh; source changes require server restart.

Groq: VIRASAT_AI_PROVIDER=groq, GROQ_API_KEY, GROQ_MODEL.
Gemini: VIRASAT_AI_PROVIDER=gemini, GEMINI_API_KEY, GEMINI_MODEL. On Windows,
`npm run setup:ai-gemini:secure` enters and stores the API key with hidden input.
OpenAI: VIRASAT_AI_PROVIDER=openai, OPENAI_API_KEY (or VIRASAT_AI_API_KEY), OPENAI_MODEL.
Local: VIRASAT_AI_PROVIDER=local, VIRASAT_AI_MODEL and a loopback
VIRASAT_AI_BASE_URL such as http://127.0.0.1:11434/v1. No hosted provider key is inherited.
Compatible remote/self-hosted: VIRASAT_AI_PROVIDER=compatible, VIRASAT_AI_MODEL,
VIRASAT_AI_BASE_URL (HTTPS), VIRASAT_AI_API_KEY.
Use the exact served model ID; tool and streaming compatibility varies by model/server.
Ollama reference: https://docs.ollama.com/api/openai-compatibility

VIRASAT_AI_REQUIRE_HOSTED=true means require actual model generation even for local
inference; failures are explicit. Optional VIRASAT_AI_TIMEOUT_MS (1000–120000; default
60000) and VIRASAT_AI_MAX_TOKENS. Gemini allows 64–65536 (default 65536); other
providers remain capped at 4096 (default 1000). The maximum is a response ceiling,
not a quota increase. No automatic provider retries.
Existing non-streaming JSON contract remains; stream=true emits delta/done/error SSE events.

Knowledge commands:

```powershell
npm run knowledge:ingest
npm run knowledge:reindex
npm run knowledge:search -- "Patna heritage"
```

Index artifacts are ignored in data/.database. Source hashes retain unchanged ingestion
timestamps. Verification timestamps remain null when the source supplies none.
For optional semantic retrieval set VIRASAT_EMBEDDING_URL to an OpenAI-compatible base
URL, VIRASAT_EMBEDDING_MODEL and optional VIRASAT_EMBEDDING_API_KEY. Then explicitly run
`npx tsx scripts/knowledge.ts embed`. This sends public document passages to that configured
endpoint and may incur provider charges; incremental checkpoints skip unchanged passages.
Unavailable semantic service is disclosed as lexical retrieval. No arbitrary URL comes
from a user prompt. No new database migration is needed; existing PostgreSQL setup remains.

Verification:

```powershell
npm run lint
npm run test:ai-provider
npm run test:ai-platform
python -m unittest discover -s training -p "test_*.py"
npm run build
```

See feature-status.md before interpreting the legacy full suite. See ../training/README.md
for a separate, manually gated training workflow. No training dependency is required to run the website.
