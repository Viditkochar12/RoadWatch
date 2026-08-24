-- ============================================================================
-- 🚧 RoadWatch - PostgreSQL Relational Database Schema
-- Focus Areas: Relational Schema Design, Primary & Foreign Keys, Constraints, Indexes
-- ============================================================================

-- Clean up existing tables if re-running
DROP TABLE IF EXISTS report_comments CASCADE;
DROP TABLE IF EXISTS citizen_votes CASCADE;
DROP TABLE IF EXISTS status_audit_logs CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom ENUM types
DROP TYPE IF EXISTS user_role_enum CASCADE;
DROP TYPE IF EXISTS severity_enum CASCADE;
DROP TYPE IF EXISTS report_status_enum CASCADE;
DROP TYPE IF EXISTS vote_type_enum CASCADE;

-- 1. Create Custom ENUM Types for Domain Integrity
CREATE TYPE user_role_enum AS ENUM ('citizen', 'admin', 'field_engineer', 'supervisor');
CREATE TYPE severity_enum AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE report_status_enum AS ENUM ('Pending', 'In Progress', 'Resolved', 'Rejected');
CREATE TYPE vote_type_enum AS ENUM ('upvote', 'downvote');

-- ============================================================================
-- 2. Users Table (Primary Entity)
-- PK: user_id (SERIAL)
-- ============================================================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'citizen',
    supervisor_id INT NULL,
    phone VARCHAR(20) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Self-referencing FK for supervisor hierarchy (Demonstrates Self-Join)
    CONSTRAINT fk_user_supervisor FOREIGN KEY (supervisor_id) 
        REFERENCES users (user_id) ON DELETE SET NULL,
    
    -- Check Constraint for valid email format
    CONSTRAINT chk_user_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================================================
-- 3. Municipal Departments Table (Lookup / Organizational Entity)
-- PK: dept_id (SERIAL)
-- ============================================================================
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(120) NOT NULL UNIQUE,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    jurisdiction_zone VARCHAR(100) NOT NULL,
    budget_allocated NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. Road Reports Table (Core Transactional Entity)
-- PK: report_id (SERIAL)
-- FK1: reported_by -> users(user_id) (ON DELETE CASCADE)
-- FK2: assigned_dept_id -> departments(dept_id) (ON DELETE SET NULL)
-- ============================================================================
CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NULL,
    address VARCHAR(255) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    severity severity_enum NOT NULL DEFAULT 'Medium',
    status report_status_enum NOT NULL DEFAULT 'Pending',
    
    -- Foreign Key 1: Citizen who reported the issue
    reported_by INT NOT NULL,
    
    -- Foreign Key 2: Municipal department assigned to resolve the issue
    assigned_dept_id INT NULL,
    
    -- AI Application Engineering Structured Metadata (JSONB)
    ai_analysis JSONB NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_report_user FOREIGN KEY (reported_by) 
        REFERENCES users (user_id) ON DELETE CASCADE,
        
    CONSTRAINT fk_report_department FOREIGN KEY (assigned_dept_id) 
        REFERENCES departments (dept_id) ON DELETE SET NULL,
        
    -- Geographical range constraints
    CONSTRAINT chk_report_latitude CHECK (latitude BETWEEN -90.0 AND 90.0),
    CONSTRAINT chk_report_longitude CHECK (longitude BETWEEN -180.0 AND 180.0)
);

-- ============================================================================
-- 5. Status Audit Trail Table (Historical / Event Log Entity)
-- PK: log_id (SERIAL)
-- FK1: report_id -> reports(report_id) (ON DELETE CASCADE)
-- FK2: changed_by -> users(user_id) (ON DELETE SET NULL)
-- ============================================================================
CREATE TABLE status_audit_logs (
    log_id SERIAL PRIMARY KEY,
    report_id INT NOT NULL,
    changed_by INT NULL,
    old_status report_status_enum NOT NULL,
    new_status report_status_enum NOT NULL,
    change_notes TEXT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_report FOREIGN KEY (report_id) 
        REFERENCES reports (report_id) ON DELETE CASCADE,
        
    CONSTRAINT fk_audit_user FOREIGN KEY (changed_by) 
        REFERENCES users (user_id) ON DELETE SET NULL
);

-- ============================================================================
-- 6. Citizen Votes Table (Associative Entity with Composite Primary Key)
-- Composite PK: (report_id, user_id)
-- ============================================================================
CREATE TABLE citizen_votes (
    report_id INT NOT NULL,
    user_id INT NOT NULL,
    vote_type vote_type_enum NOT NULL DEFAULT 'upvote',
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite Primary Key ensures 1 vote per user per report
    PRIMARY KEY (report_id, user_id),
    
    CONSTRAINT fk_vote_report FOREIGN KEY (report_id) 
        REFERENCES reports (report_id) ON DELETE CASCADE,
        
    CONSTRAINT fk_vote_user FOREIGN KEY (user_id) 
        REFERENCES users (user_id) ON DELETE CASCADE
);

-- ============================================================================
-- 7. Report Comments & Citizen Feedback Table
-- PK: comment_id (SERIAL)
-- FK1: report_id -> reports(report_id)
-- FK2: user_id -> users(user_id)
-- ============================================================================
CREATE TABLE report_comments (
    comment_id SERIAL PRIMARY KEY,
    report_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    is_official_response BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_comment_report FOREIGN KEY (report_id) 
        REFERENCES reports (report_id) ON DELETE CASCADE,
        
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) 
        REFERENCES users (user_id) ON DELETE CASCADE
);

-- ============================================================================
-- 8. Indexes for High Performance Joins and Query Optimization
-- ============================================================================
CREATE INDEX idx_reports_reported_by ON reports(reported_by);
CREATE INDEX idx_reports_assigned_dept ON reports(assigned_dept_id);
CREATE INDEX idx_reports_status_severity ON reports(status, severity);
CREATE INDEX idx_reports_spatial ON reports(latitude, longitude);
CREATE INDEX idx_audit_report_id ON status_audit_logs(report_id);
CREATE INDEX idx_comments_report_id ON report_comments(report_id);

-- ============================================================================
-- 9. Sample Seed Data for Demonstrating SQL JOINs
-- ============================================================================
INSERT INTO users (name, email, password_hash, role, supervisor_id, phone) VALUES
('Vikram Sharma', 'vikram@roadwatch.org', '$2a$10$e8Q5', 'supervisor', NULL, '+91-9876543210'),
('Vidit Kochar', 'vidit@roadwatch.org', '$2a$10$e8Q5', 'admin', 1, '+91-9876543211'),
('Priya Patel', 'priya.patel@gmail.com', '$2a$10$e8Q5', 'citizen', NULL, '+91-9876543212'),
('Rahul Verma', 'rahul.v@gmail.com', '$2a$10$e8Q5', 'citizen', NULL, '+91-9876543213'),
('Anjali Singh', 'anjali.s@gmail.com', '$2a$10$e8Q5', 'citizen', NULL, '+91-9876543214'),
('Suresh Kumar', 'suresh.eng@roadwatch.org', '$2a$10$e8Q5', 'field_engineer', 2, '+91-9876543215');

INSERT INTO departments (dept_name, contact_email, contact_phone, jurisdiction_zone, budget_allocated) VALUES
('Public Works Department (PWD)', 'pwd.central@gov.in', '0141-220011', 'Zone A - Central', 5000000.00),
('Municipal Stormwater & Drainage', 'drainage.jaipur@gov.in', '0141-220022', 'Zone B - North & South', 3500000.00),
('Electrical & Streetlight Division', 'lighting.muni@gov.in', '0141-220033', 'Citywide', 2000000.00),
('Traffic & Highway Safety Dept', 'traffic.safety@gov.in', '0141-220044', 'Expressways & Arterials', 4500000.00),
('Emergency Disaster Relief (No active reports yet)', 'disaster.relief@gov.in', '0141-220055', 'Metropolitan Area', 8000000.00);

INSERT INTO reports (title, description, address, latitude, longitude, severity, status, reported_by, assigned_dept_id, ai_analysis) VALUES
('Deep Pothole on Tonk Road', 'Large 8-inch deep crater causing severe traffic slowdown and bike skids.', 'Tonk Road, near Gandhi Nagar Station, Jaipur', 26.883300, 75.795400, 'High', 'In Progress', 3, 1, '{"category":"pothole","aiSeverity":"High","urgencyScore":8,"estimatedRepairDays":2}'),
('Flooded Underpass after Rain', 'Water accumulation over 2 feet deep near JLN Marg underpass.', 'JLN Marg Underpass, Jaipur', 26.892100, 75.811500, 'Critical', 'Pending', 3, 2, '{"category":"waterlogging","aiSeverity":"Critical","urgencyScore":9,"estimatedRepairDays":1}'),
('Broken Streetlights on MI Road', 'Five consecutive streetlights non-functional creating hazardous dark stretch.', 'MI Road, City Centre, Jaipur', 26.918900, 75.812200, 'Medium', 'Resolved', 4, 3, '{"category":"broken_streetlight","aiSeverity":"Medium","urgencyScore":5,"estimatedRepairDays":3}'),
('Minor Asphalt Cracks near Subhash Nagar', 'Surface level wear and tear with minor cracks.', 'Subhash Nagar, Sector 4, Jaipur', 26.941000, 75.789000, 'Low', 'Pending', 5, 1, '{"category":"cracked_pavement","aiSeverity":"Low","urgencyScore":3,"estimatedRepairDays":7}'),
('Missing Drainage Manhole Lid', 'Open manhole on pedestrian sidewalk near bus stop.', 'Ajmer Road Flyover, Jaipur', 26.901200, 75.761000, 'Critical', 'In Progress', 4, 2, '{"category":"missing_manhole_cover","aiSeverity":"Critical","urgencyScore":10,"estimatedRepairDays":1}');

INSERT INTO status_audit_logs (report_id, changed_by, old_status, new_status, change_notes) VALUES
(1, 2, 'Pending', 'In Progress', 'Work order issued to PWD Rapid Patching Crew #4.'),
(3, 2, 'Pending', 'In Progress', 'Assigned to Electrical maintenance team for bulb replacement.'),
(3, 2, 'In Progress', 'Resolved', 'Replaced 5 LED fixture drivers and checked underground cables.');

INSERT INTO citizen_votes (report_id, user_id, vote_type) VALUES
(1, 3, 'upvote'),
(1, 4, 'upvote'),
(1, 5, 'upvote'),
(2, 3, 'upvote'),
(2, 4, 'upvote'),
(5, 5, 'upvote');

INSERT INTO report_comments (report_id, user_id, comment_text, is_official_response) VALUES
(1, 3, 'I almost lost control of my scooter here yesterday. Please fix fast!', FALSE),
(1, 2, 'Municipal PWD unit has been dispatched and cold-mix patching is underway.', TRUE),
(2, 4, 'Drainage team is pumping out water using heavy submersible pumps.', TRUE);
