-- ============================================================================
-- VIRASAT DATABASE SCHEMA — MIGRATION 002 (PHASE 2: PROVENANCE & AUDIT)
-- Conforms to Section XI.1, XI.2, and XV.2 of Blueprint V2
-- ============================================================================

-- 1. Source authority registry (Tier 1 to Tier 4 per Section XI.2)
CREATE TABLE IF NOT EXISTS place_sources (
    id VARCHAR(64) PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL,
    source_type VARCHAR(32) NOT NULL CHECK (source_type IN ('tier1_official', 'tier2_trusted', 'tier3_secondary', 'tier4_community')),
    url VARCHAR(512) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Granular field-level facts table (Section XI.1 & XV.2)
CREATE TABLE IF NOT EXISTS place_facts (
    id VARCHAR(64) PRIMARY KEY,
    place_id VARCHAR(128) NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    fact_key VARCHAR(64) NOT NULL,
    fact_value TEXT NOT NULL,
    data_confidence VARCHAR(32) NOT NULL CHECK (data_confidence IN ('OFFICIAL', 'TRUSTED_THIRD_PARTY', 'COMMUNITY_REPORTED', 'MODELLED', 'ESTIMATED', 'STALE', 'UNVERIFIED')),
    source_url VARCHAR(512) NOT NULL,
    source_type VARCHAR(32) NOT NULL CHECK (source_type IN ('tier1_official', 'tier2_trusted', 'tier3_secondary', 'tier4_community')),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_place_facts_place_id ON place_facts(place_id);
CREATE INDEX IF NOT EXISTS idx_place_facts_fact_key ON place_facts(fact_key);

-- 3. Image licenses and attribution tracking (Section XI.4 & XV.2)
CREATE TABLE IF NOT EXISTS image_licenses (
    id VARCHAR(64) PRIMARY KEY,
    image_url VARCHAR(512) NOT NULL,
    license_type VARCHAR(64) NOT NULL DEFAULT 'editorial_fair_use',
    attribution_required BOOLEAN NOT NULL DEFAULT true,
    attribution_text VARCHAR(255),
    source_portal VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_image_licenses_url ON image_licenses(image_url);
