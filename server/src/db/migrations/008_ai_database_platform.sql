-- Durable AI, retrieval and trip-save foundation.
-- Run with `npm run db:migrate`; each migration is checksum tracked.
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE ai_sessions ADD COLUMN IF NOT EXISTS owner_key TEXT;
ALTER TABLE ai_sessions ADD COLUMN IF NOT EXISTS state_json JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ai_sessions ADD COLUMN IF NOT EXISTS draft_json JSONB;
ALTER TABLE ai_sessions ADD COLUMN IF NOT EXISTS saved_trip_id TEXT;
ALTER TABLE ai_sessions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE ai_sessions ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
CREATE INDEX IF NOT EXISTS idx_ai_sessions_owner_updated ON ai_sessions(owner_key, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_messages_session_created ON ai_messages(session_id, created_at);

ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS revision INTEGER NOT NULL DEFAULT 1;
CREATE UNIQUE INDEX IF NOT EXISTS uq_itineraries_user_idempotency
  ON itineraries(user_id, idempotency_key) WHERE idempotency_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  name TEXT NOT NULL,
  canonical_city_id TEXT,
  canonical_state_id TEXT,
  category TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  source_url TEXT,
  source_identifier TEXT NOT NULL,
  verified_at TIMESTAMPTZ,
  review_status TEXT NOT NULL DEFAULT 'unreviewed',
  embedding VECTOR,
  embedding_model TEXT,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_knowledge_entity ON knowledge_documents(entity_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_location ON knowledge_documents(canonical_state_id, canonical_city_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_review ON knowledge_documents(review_status, verified_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_fts ON knowledge_documents
  USING GIN (to_tsvector('simple', name || ' ' || content));

CREATE TABLE IF NOT EXISTS data_quality_issues (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  issue_code TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info','warning','error')),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved','ignored')),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  UNIQUE(entity_type, entity_id, issue_code, status)
);
CREATE INDEX IF NOT EXISTS idx_quality_status ON data_quality_issues(status, severity, detected_at DESC);
