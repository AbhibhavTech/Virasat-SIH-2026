-- ============================================================================
-- VIRASAT DATABASE SCHEMA — MIGRATION 005 (PHASE 4: GOOGLE AUTH & PROFILE STATE)
-- Conforms to Section XI.1, Section XIII, and Blueprint V2
-- ============================================================================

-- 1. Extend Users table for Google OAuth & Rich Preferences
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(128) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(512);
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS survey JSONB DEFAULT '{}'::jsonb;

-- 2. Indexes for fast OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email));
