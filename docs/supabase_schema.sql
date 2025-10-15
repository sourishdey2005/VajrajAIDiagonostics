-- Supabase (PostgreSQL) Schema for VajraAI Application

-- 1. Roles Table
-- Manages the different user roles within the application.
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Pre-populate roles
INSERT INTO roles (name) VALUES ('manager'), ('field_engineer'), ('user');


-- 2. Users Table
-- Stores information for all users, including managers, engineers, and standard users.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT, -- Store hashed passwords, not plain text
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. Transformers Table
-- The core table for all transformer assets being monitored.
CREATE TABLE transformers (
    id TEXT PRIMARY KEY, -- Using the custom format like 'TR-001'
    name TEXT NOT NULL,
    location TEXT,
    zone TEXT,
    latitude FLOAT,
    longitude FLOAT,
    status TEXT NOT NULL, -- e.g., 'Operational', 'Needs Attention'
    criticality TEXT NOT NULL, -- e.g., 'High', 'Medium', 'Low'
    last_inspection DATE,
    next_service_date DATE,
    manufacturer TEXT,
    serviced_by_id UUID REFERENCES users(id),
    load INTEGER -- Load as a percentage
);


-- 4. Communication Logs Table (Notes & Replies)
-- Stores all communication related to a specific transformer.
-- Replies are handled by linking to a parent log.
CREATE TABLE communication_logs (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL REFERENCES transformers(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    parent_log_id INTEGER REFERENCES communication_logs(id) ON DELETE CASCADE, -- This links a reply to its parent note
    escalation_status TEXT DEFAULT 'none', -- 'none', 'escalated', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 5. Analysis Results Table
-- Stores the results from the AI-powered FRA data analysis.
CREATE TABLE analysis_results (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL REFERENCES transformers(id) ON DELETE CASCADE,
    submitted_by_id UUID REFERENCES users(id),
    fault_classification TEXT,
    confidence_score FLOAT,
    raw_fra_data_summary TEXT,
    ai_explanation TEXT,
    actionable_insights TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 6. Complaints Table
-- Stores user-submitted power issues and complaints.
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    submitted_by_id UUID REFERENCES users(id),
    issue_type TEXT NOT NULL, -- 'power_outage', 'voltage_drop', 'sparking'
    description TEXT,
    address TEXT,
    pincode TEXT,
    status TEXT DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved'
    assigned_to_id UUID REFERENCES users(id), -- To assign to a field engineer
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 7. Audit Trail Table
-- Logs significant actions taken within the system.
CREATE TABLE audit_trail (
    id SERIAL PRIMARY KEY,
    actor_id UUID REFERENCES users(id),
    action TEXT NOT NULL, -- e.g., 'CREATE', 'UPDATE', 'ESCALATE'
    target_type TEXT, -- e.g., 'Transformer', 'Note'
    target_id TEXT,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 8. Engineer Performance Table
-- Stores performance metrics for field engineers.
CREATE TABLE engineer_performance (
    id SERIAL PRIMARY KEY,
    engineer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    faults_detected INTEGER DEFAULT 0,
    reports_submitted INTEGER DEFAULT 0,
    on_time_completion_rate FLOAT DEFAULT 100.0, -- As a percentage
    avg_resolution_hours FLOAT,
    period DATE NOT NULL -- To track performance over time (e.g., monthly)
);
