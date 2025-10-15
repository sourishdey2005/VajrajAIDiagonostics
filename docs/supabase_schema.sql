-- Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Insert initial roles
INSERT INTO roles (name) VALUES ('manager'), ('field_engineer'), ('user');

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Note: In a real app, this should be a hashed password
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transformers Table
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
    nextServiceDate DATE,
    manufacturer TEXT,
    servicedBy TEXT,
    load INTEGER -- As a percentage
);

-- Communication Logs Table (Notes)
CREATE TABLE communication_logs (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL REFERENCES transformers(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_log_id INTEGER REFERENCES communication_logs(id) ON DELETE CASCADE, -- For replies
    escalation_status TEXT DEFAULT 'none', -- 'none', 'escalated', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaints Table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_type TEXT NOT NULL,
    description TEXT,
    address TEXT,
    pincode TEXT,
    zone TEXT,
    status TEXT DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved'
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Engineer Performance Table
CREATE TABLE engineer_performance (
    engineer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    faults_detected INTEGER,
    reports_submitted INTEGER,
    on_time_completion INTEGER,
    avg_resolution_hours INTEGER
);

-- Resolved Issues Table
CREATE TABLE resolved_issues (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL,
    fault_type TEXT NOT NULL,
    resolved_by TEXT NOT NULL,
    resolved_date TIMESTAMPTZ DEFAULT NOW()
);

-- Health History Table
CREATE TABLE health_history (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL REFERENCES transformers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    health_score INTEGER NOT NULL,
    UNIQUE(transformer_id, date)
);

-- Fault History Table
CREATE TABLE fault_history (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL REFERENCES transformers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    fault_type TEXT NOT NULL,
    severity TEXT NOT NULL
);

-- Budget Estimates Table
CREATE TABLE budget_estimates (
    id SERIAL PRIMARY KEY,
    fault_type TEXT NOT NULL,
    criticality TEXT NOT NULL,
    estimated_repair_cost BIGINT,
    preventative_maintenance_cost BIGINT,
    potential_savings BIGINT,
    cost_breakdown TEXT,
    UNIQUE(fault_type, criticality)
);
