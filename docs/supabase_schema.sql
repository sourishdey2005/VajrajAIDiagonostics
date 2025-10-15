
-- 1. Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Insert the roles
INSERT INTO roles (name) VALUES ('manager'), ('field_engineer'), ('user');

-- 2. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT, -- In a real app, this should be a hashed password
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Transformers Table
CREATE TABLE transformers (
    id TEXT PRIMARY KEY, -- e.g., 'TR-001'
    name TEXT NOT NULL,
    location TEXT,
    zone TEXT,
    latitude FLOAT,
    longitude FLOAT,
    status TEXT NOT NULL,
    criticality TEXT NOT NULL,
    last_inspection DATE,
    next_service_date DATE,
    manufacturer TEXT,
    serviced_by TEXT, -- This could reference a user name or ID
    load INTEGER -- As a percentage
);

-- 4. Communication Logs (Notes) Table
CREATE TABLE communication_logs (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL REFERENCES transformers(id),
    author_name TEXT NOT NULL,
    author_role TEXT,
    content TEXT NOT NULL,
    parent_log_id INTEGER REFERENCES communication_logs(id), -- For replies
    escalation_status TEXT DEFAULT 'none', -- 'none', 'escalated', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Analysis Results Table
CREATE TABLE analysis_results (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL REFERENCES transformers(id),
    user_id UUID REFERENCES users(id),
    fault_classification TEXT,
    confidence_score FLOAT,
    raw_fra_data_summary TEXT,
    ai_explanation TEXT,
    actionable_insights TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Complaints Table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    issue_type TEXT NOT NULL,
    description TEXT,
    address TEXT,
    pincode TEXT,
    zone TEXT,
    status TEXT DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved'
    assigned_to_id UUID REFERENCES users(id),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Engineer Performance Table
CREATE TABLE engineer_performance (
    engineer_id TEXT PRIMARY KEY, -- e.g., E-001
    name TEXT NOT NULL,
    avatar TEXT,
    faults_detected INTEGER DEFAULT 0,
    reports_submitted INTEGER DEFAULT 0,
    on_time_completion INTEGER DEFAULT 100,
    avg_resolution_hours FLOAT DEFAULT 0
);

-- 8. Resolved Issues Table
CREATE TABLE resolved_issues (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL,
    fault_type TEXT NOT NULL,
    resolved_by TEXT NOT NULL,
    resolved_date TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Data for Resolved Issues (Example)
INSERT INTO resolved_issues (transformer_id, fault_type, resolved_by, resolved_date) VALUES
('TR-004', 'Inter-turn Short', 'Meena Iyer', '2024-06-18T14:00:00Z'),
('TR-010', 'Core Fault', 'Sanjay Das', '2024-06-20T11:00:00Z');

-- Initial Data for Engineer Performance (Example)
INSERT INTO engineer_performance (engineer_id, name, avatar, faults_detected, reports_submitted, on_time_completion, avg_resolution_hours) VALUES
('E-001', 'Ravi Kumar', 'user-avatar-1', 28, 45, 95, 24),
('E-002', 'Priya Sharma', 'user-avatar-2', 35, 52, 98, 18),
('E-003', 'Anil Singh', 'user-avatar-3', 22, 48, 92, 36),
('E-004', 'Meena Iyer', 'user-avatar-4', 30, 42, 96, 22),
('E-005', 'Sanjay Das', 'user-avatar-5', 18, 38, 88, 48);

