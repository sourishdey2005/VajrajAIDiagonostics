
-- Supabase Schema for VajraAI Application

-- 1. Roles for users
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Insert the predefined roles
INSERT INTO roles (name) VALUES ('manager'), ('field_engineer'), ('user');
COMMENT ON TABLE roles IS 'Stores the different user roles in the system.';


-- 2. Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE users IS 'Stores user and engineer information.';

-- 3. Transformers table
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
    serviced_by_id UUID REFERENCES users(id),
    load INTEGER -- As a percentage
);
COMMENT ON TABLE transformers IS 'Core table for all transformer assets.';


-- 4. Communication Logs (Notes) table
CREATE TABLE communication_logs (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL REFERENCES transformers(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    parent_log_id INTEGER REFERENCES communication_logs(id) ON DELETE CASCADE, -- For replies
    escalation_status TEXT DEFAULT 'none', -- 'none', 'escalated', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE communication_logs IS 'Stores notes, replies, and escalations for transformers.';


-- 5. Analysis Results table
CREATE TABLE analysis_results (
    id SERIAL PRIMARY KEY,
    transformer_id TEXT NOT NULL REFERENCES transformers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    fault_classification TEXT,
    confidence_score FLOAT,
    raw_fra_data_summary TEXT,
    ai_explanation TEXT,
    actionable_insights TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE analysis_results IS 'Stores the output from the FRA data analysis.';


-- 6. Complaints table
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    issue_type TEXT NOT NULL,
    description TEXT,
    address TEXT,
    pincode TEXT,
    status TEXT DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved'
    assigned_to_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE complaints IS 'Stores user-submitted power complaints.';
