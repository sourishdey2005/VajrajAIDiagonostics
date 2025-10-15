-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- transformers table
CREATE TABLE transformers (
    id TEXT PRIMARY KEY,
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
    load INTEGER
);

-- communication_logs table
CREATE TABLE communication_logs (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL REFERENCES transformers(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_role TEXT,
    content TEXT NOT NULL,
    parent_log_id INTEGER REFERENCES communication_logs(id) ON DELETE CASCADE,
    escalation_status TEXT DEFAULT 'none',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- complaints table
CREATE TABLE complaints (
    id TEXT PRIMARY KEY DEFAULT 'COMP-' || nextval('complaints_id_seq'),
    issue_type TEXT,
    description TEXT,
    address TEXT,
    pincode TEXT,
    zone TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    status TEXT
);
CREATE SEQUENCE complaints_id_seq;


-- engineer_performance table
CREATE TABLE engineer_performance (
    engineerId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    faultsDetected INTEGER,
    reportsSubmitted INTEGER,
    onTimeCompletion INTEGER,
    avgResolutionHours INTEGER
);

-- resolved_issues table
CREATE TABLE resolved_issues (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT,
    fault_type TEXT,
    resolved_by TEXT,
    resolved_date TIMESTAMPTZ
);

-- health_history table
CREATE TABLE health_history (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT,
    date DATE,
    health_score INTEGER
);

-- fault_history table
CREATE TABLE fault_history (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT,
    date DATE,
    fault_type TEXT,
    severity TEXT
);

-- budget_estimates table
CREATE TABLE budget_estimates (
    id SERIAL PRIMARY KEY,
    fault_type TEXT,
    criticality TEXT,
    estimated_repair_cost INTEGER,
    preventative_maintenance_cost INTEGER,
    potential_savings INTEGER,
    cost_breakdown TEXT
);
