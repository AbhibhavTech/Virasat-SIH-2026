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
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    home_city VARCHAR(100) DEFAULT 'Mumbai',
    auth_provider VARCHAR(50) DEFAULT 'local',
    role user_role_enum DEFAULT 'traveller',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. States Table
CREATE TABLE IF NOT EXISTS states (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capital VARCHAR(100),
    region VARCHAR(50),
    description TEXT,
    hero_image_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cities Table
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(64) PRIMARY KEY,
    state_id VARCHAR(64) REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Places (Attractions & Heritage Sites)
CREATE TABLE IF NOT EXISTS places (
    id VARCHAR(100) PRIMARY KEY,
    city_id VARCHAR(64) REFERENCES cities(id) ON DELETE SET NULL,
    state_id VARCHAR(64) REFERENCES states(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    summary TEXT,
    description TEXT,
    history TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    entry_fee_domestic NUMERIC(10,2) DEFAULT 0,
    entry_fee_intl NUMERIC(10,2) DEFAULT 0,
    visiting_hours VARCHAR(100),
    heritage_status VARCHAR(100),
    data_confidence data_confidence_enum DEFAULT 'unverified',
    source_url TEXT,
    last_verified_at TIMESTAMPTZ,
    rating NUMERIC(3,2) DEFAULT 4.5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Place Images
CREATE TABLE IF NOT EXISTS place_images (
    id VARCHAR(100) PRIMARY KEY,
    place_id VARCHAR(100) REFERENCES places(id) ON DELETE CASCADE,
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

-- 8. Itineraries
CREATE TABLE IF NOT EXISTS itineraries (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(100),
    start_date DATE,
    end_date DATE,
    city_ids JSONB DEFAULT '[]'::jsonb,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Itinerary Days
CREATE TABLE IF NOT EXISTS itinerary_days (
    id VARCHAR(64) PRIMARY KEY,
    itinerary_id VARCHAR(64) REFERENCES itineraries(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Itinerary Stops
CREATE TABLE IF NOT EXISTS itinerary_stops (
    id VARCHAR(64) PRIMARY KEY,
    itinerary_day_id VARCHAR(64) REFERENCES itinerary_days(id) ON DELETE CASCADE,
    place_id VARCHAR(100) REFERENCES places(id) ON DELETE SET NULL,
    order_index INTEGER NOT NULL,
    arrival_time VARCHAR(32),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Favorites (User Bookmarks)
CREATE TABLE IF NOT EXISTS favorites (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    place_id VARCHAR(100) REFERENCES places(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_favorite UNIQUE(user_id, place_id)
);

-- 12. Audit Logs
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_places_city_id ON places(city_id);
CREATE INDEX IF NOT EXISTS idx_places_state_id ON places(state_id);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_transit_nodes_city_id ON transit_nodes(city_id);
