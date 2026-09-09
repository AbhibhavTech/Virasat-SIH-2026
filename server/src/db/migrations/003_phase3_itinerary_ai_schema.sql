-- ============================================================================
-- VIRASAT DATABASE SCHEMA — MIGRATION 003 (PHASE 3: ITINERARIES, ROUTING, AI)
-- Conforms to Section XV.2 and XXI of Master Blueprint V2
-- ============================================================================

-- 1. Persistent Multi-Day Itineraries
CREATE TABLE IF NOT EXISTS itineraries (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(128) NOT NULL,
    city VARCHAR(128) NOT NULL,
    state VARCHAR(128),
    days_count INTEGER NOT NULL DEFAULT 1,
    pace VARCHAR(32) NOT NULL DEFAULT 'moderate' CHECK (pace IN ('relaxed', 'moderate', 'fast')),
    budget_level VARCHAR(32) NOT NULL DEFAULT 'moderate' CHECK (budget_level IN ('budget', 'moderate', 'luxury')),
    summary TEXT,
    total_cost NUMERIC(10, 2) DEFAULT 0,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_city ON itineraries(city);

-- 2. Itinerary Days Breakdown
CREATE TABLE IF NOT EXISTS itinerary_days (
    id VARCHAR(64) PRIMARY KEY,
    itinerary_id VARCHAR(64) NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    area_title VARCHAR(255) NOT NULL,
    theme VARCHAR(128),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_itinerary_days_itinerary_id ON itinerary_days(itinerary_id);

-- 3. Itinerary Ordered Stops
CREATE TABLE IF NOT EXISTS itinerary_stops (
    id VARCHAR(64) PRIMARY KEY,
    day_id VARCHAR(64) NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    itinerary_id VARCHAR(64) NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    place_id VARCHAR(128) REFERENCES places(id) ON DELETE SET NULL,
    place_name VARCHAR(255) NOT NULL,
    stop_order INTEGER NOT NULL,
    arrival_time VARCHAR(16),
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    travel_mode VARCHAR(64) DEFAULT 'Auto-Rickshaw / Local Transit',
    travel_duration_minutes INTEGER DEFAULT 15,
    travel_distance_km NUMERIC(6, 2) DEFAULT 2.0,
    estimated_cost NUMERIC(10, 2) DEFAULT 50,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_itinerary_stops_day_id ON itinerary_stops(day_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_stops_itinerary_id ON itinerary_stops(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_stops_place_id ON itinerary_stops(place_id);

-- 4. AI Conversation Sessions
CREATE TABLE IF NOT EXISTS ai_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'AI Concierge Session',
    context_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_sessions_user_id ON ai_sessions(user_id);

-- 5. AI Conversation Messages
CREATE TABLE IF NOT EXISTS ai_messages (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL REFERENCES ai_sessions(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT NOT NULL,
    tool_calls_json TEXT,
    metadata_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_session_id ON ai_messages(session_id);

-- 6. AI Fact-Grounding Records (Traceability & Provenance)
CREATE TABLE IF NOT EXISTS ai_grounding_records (
    id VARCHAR(64) PRIMARY KEY,
    message_id VARCHAR(64) NOT NULL REFERENCES ai_messages(id) ON DELETE CASCADE,
    place_id VARCHAR(128) REFERENCES places(id) ON DELETE SET NULL,
    fact_id VARCHAR(64) REFERENCES place_facts(id) ON DELETE SET NULL,
    field_name VARCHAR(64) NOT NULL,
    confidence VARCHAR(32) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    source_url VARCHAR(512) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_grounding_message_id ON ai_grounding_records(message_id);
CREATE INDEX IF NOT EXISTS idx_ai_grounding_place_id ON ai_grounding_records(place_id);
