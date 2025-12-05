-- Admin Portal Tables Migration
-- Run this to add admin-specific tables to corporate_travel database
-- Usage: psql -U postgres -d corporate_travel -f admin_tables.sql

-- =============================================
-- ADMIN-SPECIFIC TABLES
-- =============================================

-- Risk Advisories Table (for admin risk management)
CREATE TABLE IF NOT EXISTS risk_advisories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(50) DEFAULT 'low',
    region VARCHAR(100),
    country VARCHAR(100),
    source VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Trip Timeline Table (for tracking trip status changes)
-- Note: References Trips table which is created by Sequelize
CREATE TABLE IF NOT EXISTS trip_timeline (
    id SERIAL PRIMARY KEY,
    travel_id INTEGER,
    action VARCHAR(255) NOT NULL,
    actor VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- Trip Comments Table (for approval workflow comments)
CREATE TABLE IF NOT EXISTS trip_comments (
    id SERIAL PRIMARY KEY,
    travel_id INTEGER,
    user_id INTEGER,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_risk_advisories_active ON risk_advisories(active);
CREATE INDEX IF NOT EXISTS idx_risk_advisories_severity ON risk_advisories(severity);
CREATE INDEX IF NOT EXISTS idx_trip_timeline_travel_id ON trip_timeline(travel_id);
CREATE INDEX IF NOT EXISTS idx_trip_comments_travel_id ON trip_comments(travel_id);

-- =============================================
-- SEED DATA - Risk Advisories
-- =============================================
INSERT INTO risk_advisories (title, description, severity, region, country, source, active) VALUES
('COVID-19 Travel Advisory', 'Check local requirements before travel', 'moderate', 'Global', NULL, 'WHO', true),
('Weather Alert', 'Typhoon season in Southeast Asia', 'high', 'Asia', 'Philippines', 'Weather Service', true),
('Political Unrest', 'Avoid non-essential travel', 'high', 'Europe', 'France', 'State Department', true)
ON CONFLICT DO NOTHING;

SELECT 'Admin tables created successfully!' AS status;
