-- =====================================================================
-- VIRASAT DATABASE SCHEMA (PHASE 1)
-- Target: PostgreSQL / Supabase
-- Aligned with Section XV.1 of the Master Blueprint V2
-- =====================================================================

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE data_confidence_enum AS ENUM (
        'official',
        'trusted_third_party',
        'community_reported',
        'modelled',
        'estimated',
        'stale',
        'unverified'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transit_type_enum AS ENUM (
        'railway',
        'metro',
        'bus',
        'airport'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'traveller',
        'contributor',
        'verified_provider',
        'moderator',
        'heritage_officer',
        'admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Users Table
-- password_hash is nullable to support Firebase and external OAuth identities
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    home_city VARCHAR(100) DEFAULT 'Mumbai',
    auth_provider VARCHAR(50) DEFAULT 'local',
    role user_role_enum DEFAULT 'traveller',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. States Table (Aligned with TypeScript StateRecord)
CREATE TABLE IF NOT EXISTS states (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100),
    type VARCHAR(32) DEFAULT 'state',
    region_type VARCHAR(32) DEFAULT 'state',
    capital VARCHAR(100),
    region VARCHAR(50),
    official_tourism_url TEXT,
    description TEXT,
    status VARCHAR(50) DEFAULT 'verified',
    hero_image_id VARCHAR(100),
    hero_image_url TEXT,
    hero_image JSONB,
    source_url TEXT,
    source_name VARCHAR(255),
    creator VARCHAR(255),
    license VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cities Table (Aligned with TypeScript CityRecord)
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(64) PRIMARY KEY,
    state_id VARCHAR(64) REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100),
    canonical_name VARCHAR(100),
    entity_type VARCHAR(32) DEFAULT 'city',
    district VARCHAR(100),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    short_description TEXT,
    description TEXT,
    tagline TEXT,
    official_url TEXT,
    status VARCHAR(50) DEFAULT 'verified',
    state VARCHAR(100),
    region VARCHAR(50),
    city_type VARCHAR(50),
    tourism_categories JSONB DEFAULT '[]'::jsonb,
    prominence VARCHAR(50),
    is_capital BOOLEAN DEFAULT FALSE,
    capital_status VARCHAR(50),
    verification_status VARCHAR(50) DEFAULT 'verified',
    source_provenance TEXT,
    hero_image_url TEXT,
    hero_image JSONB,
    source_url TEXT,
    source_name VARCHAR(255),
    creator VARCHAR(255),
    license VARCHAR(100),
    places_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Places Table (Attractions & Heritage Sites, aligned with TypeScript PlaceRecord)
CREATE TABLE IF NOT EXISTS places (
    id VARCHAR(128) PRIMARY KEY,
    city_id VARCHAR(64) REFERENCES cities(id) ON DELETE SET NULL,
    state_id VARCHAR(64) REFERENCES states(id) ON DELETE SET NULL,
    district VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    canonical_name VARCHAR(255),
    aliases JSONB DEFAULT '[]'::jsonb,
    place_type VARCHAR(50),
    category VARCHAR(50) NOT NULL,
    categories JSONB DEFAULT '[]'::jsonb,
    subcategories JSONB DEFAULT '[]'::jsonb,
    topic VARCHAR(100),
    subtopic VARCHAR(100),
    category_links JSONB DEFAULT '[]'::jsonb,
    importance_level VARCHAR(32),
    locality_type VARCHAR(50),
    short_description TEXT,
    summary TEXT,
    detailed_description TEXT,
    description TEXT,
    history TEXT,
    address TEXT,
    area VARCHAR(100),
    best_for VARCHAR(255),
    suggested_duration VARCHAR(100),
    visitor_notes TEXT,
    map_search TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    opening_hours VARCHAR(255),
    visiting_hours VARCHAR(255),
    entry_fee TEXT,
    entry_fee_domestic NUMERIC(10,2) DEFAULT 0,
    entry_fee_intl NUMERIC(10,2) DEFAULT 0,
    best_time_to_visit VARCHAR(255),
    contact_information TEXT,
    official_website TEXT,
    heritage_status VARCHAR(100),
    data_confidence data_confidence_enum DEFAULT 'unverified',
    source_url TEXT,
    source_name VARCHAR(255),
    source_type VARCHAR(50),
    provenance_type VARCHAR(50),
    verification_status VARCHAR(50) DEFAULT 'unverified',
    source_quality VARCHAR(50),
    last_verified_on VARCHAR(32),
    last_verified_at TIMESTAMPTZ,
    rating NUMERIC(3,2) DEFAULT 4.5,
    thumbnail_url TEXT,
    sources JSONB DEFAULT '[]'::jsonb,
    media JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Place Images
CREATE TABLE IF NOT EXISTS place_images (
    id VARCHAR(100) PRIMARY KEY,
    place_id VARCHAR(128) REFERENCES places(id) ON DELETE CASCADE,
    storage_url TEXT NOT NULL,
    credit VARCHAR(255),
    license VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Transit Nodes (Stations, Junctions, Hubs)
CREATE TABLE IF NOT EXISTS transit_nodes (
    id VARCHAR(64) PRIMARY KEY,
    type transit_type_enum NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) UNIQUE NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    city_id VARCHAR(64) REFERENCES cities(id) ON DELETE SET NULL,
    is_junction BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Favorites (User Bookmarks)
CREATE TABLE IF NOT EXISTS favorites (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    place_id VARCHAR(128) REFERENCES places(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_favorite UNIQUE(user_id, place_id)
);

-- 9. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    from_value JSONB,
    to_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTE: Multi-day itineraries, itinerary_days, and itinerary_stops are
-- canonically defined in migration 003_phase3_itinerary_ai_schema.sql.

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_places_city_id ON places(city_id);
CREATE INDEX IF NOT EXISTS idx_places_state_id ON places(state_id);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_slug ON places(slug);
CREATE INDEX IF NOT EXISTS idx_places_importance_level ON places(importance_level);
CREATE INDEX IF NOT EXISTS idx_places_verification_status ON places(verification_status);
CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_states_slug ON states(slug);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_transit_nodes_city_id ON transit_nodes(city_id);
CREATE INDEX IF NOT EXISTS idx_transit_nodes_code ON transit_nodes(code);
