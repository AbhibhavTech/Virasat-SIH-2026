-- ============================================================================
-- VIRASAT DATABASE SCHEMA — MIGRATION 004 (PHASE 3B: CITIZEN STEWARDSHIP & RBAC)
-- Conforms to Section XI.3, XV.2, and Risk #14 of Master Blueprint V2
-- ============================================================================

-- 1. Enhanced Citizen Heritage Issue Reports
CREATE TABLE IF NOT EXISTS citizen_reports (
    id VARCHAR(64) PRIMARY KEY,
    place_id VARCHAR(128) REFERENCES places(id) ON DELETE SET NULL,
    place_name VARCHAR(255) NOT NULL,
    city VARCHAR(128) NOT NULL,
    reported_by VARCHAR(255) NOT NULL,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    issue_type VARCHAR(64) NOT NULL CHECK (issue_type IN ('cleanliness', 'structural_damage', 'vandalism', 'overcrowding', 'accessibility', 'signage', 'ticket_fraud', 'other')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(32) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED')),
    media_url VARCHAR(512),
    resolution_notes TEXT,
    resolved_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_citizen_reports_place_id ON citizen_reports(place_id);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_user_id ON citizen_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_status ON citizen_reports(status);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_severity ON citizen_reports(severity);

-- 2. Destination Health & Preservation Metrics (Aggregated Cache)
CREATE TABLE IF NOT EXISTS destination_health_metrics (
    place_id VARCHAR(128) PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
    health_score INTEGER NOT NULL DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
    open_issues_count INTEGER NOT NULL DEFAULT 0,
    resolved_issues_count INTEGER NOT NULL DEFAULT 0,
    status_label VARCHAR(64) NOT NULL DEFAULT 'Excellent / Well Maintained',
    last_inspected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Ensure Audit Logs Table Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
