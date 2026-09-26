-- =====================================================================
-- VIRASAT DATABASE SCHEMA (PHASE 6 - FESTIVALS INTEGRATION)
-- Target: PostgreSQL / Supabase
-- Additive Schema Migration (Strict Safety: Preserves All Existing Tables)
-- =====================================================================

CREATE TABLE IF NOT EXISTS festivals (
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    state VARCHAR(100) NOT NULL,
    state_id VARCHAR(64) NOT NULL REFERENCES states(id) ON DELETE RESTRICT,
    primary_city VARCHAR(100) NOT NULL,
    primary_city_id VARCHAR(64) REFERENCES cities(id) ON DELETE SET NULL,
    alternate_locations TEXT[],
    description TEXT NOT NULL,
    cultural_vibe VARCHAR(255),
    typical_season VARCHAR(100),
    typical_month VARCHAR(50),
    exact_date_start DATE,
    exact_date_end DATE,
    is_date_verified BOOLEAN DEFAULT FALSE,
    is_recurring BOOLEAN DEFAULT TRUE,
    associated_places TEXT[],
    lat NUMERIC(9, 6),
    lng NUMERIC(9, 6),
    image_url TEXT,
    source_url TEXT,
    source_name VARCHAR(255),
    license VARCHAR(100),
    attribution_text TEXT,
    verification_status VARCHAR(50) DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high-performance date and geographic lookups
CREATE INDEX IF NOT EXISTS idx_festivals_state_id ON festivals(state_id);
CREATE INDEX IF NOT EXISTS idx_festivals_city_id ON festivals(primary_city_id);
CREATE INDEX IF NOT EXISTS idx_festivals_month ON festivals(typical_month);
CREATE INDEX IF NOT EXISTS idx_festivals_dates ON festivals(exact_date_start, exact_date_end);
