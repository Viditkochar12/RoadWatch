-- ============================================================================
-- 🚧 RoadWatch - Comprehensive SQL JOINs Guide & Production Queries
-- Topics Covered: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, SELF JOIN, CROSS JOIN
-- ============================================================================

-- ============================================================================
-- 1. INNER JOIN: Fetch reports with citizen reporter details and assigned department
-- Use Case: Returns ONLY matching rows that exist across reports, users, and departments.
-- ============================================================================
SELECT 
    r.report_id,
    r.title,
    r.severity,
    r.status,
    r.address,
    u.name AS reported_by_name,
    u.email AS reporter_email,
    d.dept_name AS assigned_department,
    d.contact_phone AS dept_helpline,
    r.created_at
FROM reports r
INNER JOIN users u ON r.reported_by = u.user_id
INNER JOIN departments d ON r.assigned_dept_id = d.dept_id
ORDER BY r.created_at DESC;

-- ============================================================================
-- 2. LEFT JOIN (LEFT OUTER JOIN): Fetch ALL reports, including those without comments or unassigned
-- Use Case: Ensures every report is returned; unmatched right-side tables return NULL.
-- ============================================================================
SELECT 
    r.report_id,
    r.title,
    r.status,
    COALESCE(d.dept_name, 'Unassigned / Triage Pending') AS department,
    COUNT(c.comment_id) AS total_comments,
    COALESCE(SUM(CASE WHEN v.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) AS total_upvotes
FROM reports r
LEFT JOIN departments d ON r.assigned_dept_id = d.dept_id
LEFT JOIN report_comments c ON r.report_id = c.report_id
LEFT JOIN citizen_votes v ON r.report_id = v.report_id
GROUP BY r.report_id, r.title, r.status, d.dept_name
ORDER BY total_upvotes DESC;

-- ============================================================================
-- 3. RIGHT JOIN (RIGHT OUTER JOIN): Fetch ALL departments including those with ZERO reports
-- Use Case: Useful for municipal audits to identify idle departments or underutilized budgets.
-- ============================================================================
SELECT 
    d.dept_id,
    d.dept_name,
    d.jurisdiction_zone,
    d.budget_allocated,
    COUNT(r.report_id) AS total_assigned_reports,
    COUNT(CASE WHEN r.status = 'In Progress' THEN 1 END) AS active_in_progress,
    COUNT(CASE WHEN r.status = 'Resolved' THEN 1 END) AS completed_resolutions
FROM reports r
RIGHT JOIN departments d ON r.assigned_dept_id = d.dept_id
GROUP BY d.dept_id, d.dept_name, d.jurisdiction_zone, d.budget_allocated
ORDER BY total_assigned_reports DESC;

-- ============================================================================
-- 4. FULL OUTER JOIN: Audit users and reports matching or unassigned
-- Use Case: Discovers users who have never submitted reports AND reports with missing citizen records.
-- ============================================================================
SELECT 
    u.user_id,
    u.name AS user_name,
    u.role AS user_role,
    r.report_id,
    r.title AS report_title,
    r.status AS report_status
FROM users u
FULL OUTER JOIN reports r ON u.user_id = r.reported_by
ORDER BY u.user_id, r.report_id;

-- ============================================================================
-- 5. SELF JOIN 1: User & Supervisor Management Hierarchy
-- Use Case: Relates employee records within the same table to their supervising officer.
-- ============================================================================
SELECT 
    emp.user_id AS employee_id,
    emp.name AS staff_name,
    emp.role AS staff_role,
    COALESCE(mgr.name, 'Top Level Administrator') AS supervisor_name,
    COALESCE(mgr.email, 'N/A') AS supervisor_email
FROM users emp
LEFT JOIN users mgr ON emp.supervisor_id = mgr.user_id;

-- ============================================================================
-- 6. SELF JOIN 2: Proximity Analysis & Duplicate Road Defect Detection
-- Use Case: Finds distinct reports within approximately 0.05 degrees latitude/longitude
-- to identify potential duplicate complaints on the same stretch of road.
-- ============================================================================
SELECT 
    r1.report_id AS primary_report_id,
    r1.title AS primary_report_title,
    r2.report_id AS nearby_report_id,
    r2.title AS nearby_report_title,
    ROUND(SQRT(POW(r1.latitude - r2.latitude, 2) + POW(r1.longitude - r2.longitude, 2))::numeric, 4) AS coordinate_distance
FROM reports r1
INNER JOIN reports r2 
    ON r1.report_id < r2.report_id 
    AND ABS(r1.latitude - r2.latitude) < 0.05
    AND ABS(r1.longitude - r2.longitude) < 0.05;

-- ============================================================================
-- 7. CROSS JOIN: Department x Severity Capacity Planning Matrix
-- Use Case: Cartesian product generating all possible department-severity triage combinations.
-- ============================================================================
SELECT 
    d.dept_name,
    s.severity_level,
    COALESCE(COUNT(r.report_id), 0) AS current_incident_count
FROM departments d
CROSS JOIN (
    SELECT UNNEST(ENUM_RANGE(NULL::severity_enum)) AS severity_level
) s
LEFT JOIN reports r 
    ON r.assigned_dept_id = d.dept_id 
    AND r.severity = s.severity_level
GROUP BY d.dept_name, s.severity_level
ORDER BY d.dept_name, s.severity_level;

-- ============================================================================
-- 8. Advanced Multi-Table JOIN with Window Functions & Aggregate Analytics
-- Use Case: Executive dashboard query displaying report metrics, rank, and resolution speed.
-- ============================================================================
SELECT 
    r.report_id,
    r.title,
    r.severity,
    r.status,
    u.name AS citizen_name,
    d.dept_name,
    COUNT(v.user_id) AS total_upvotes,
    COUNT(c.comment_id) AS total_comments,
    DENSE_RANK() OVER (PARTITION BY r.severity ORDER BY COUNT(v.user_id) DESC) AS rank_within_severity
FROM reports r
INNER JOIN users u ON r.reported_by = u.user_id
LEFT JOIN departments d ON r.assigned_dept_id = d.dept_id
LEFT JOIN citizen_votes v ON r.report_id = v.report_id
LEFT JOIN report_comments c ON r.report_id = c.report_id
GROUP BY r.report_id, r.title, r.severity, r.status, u.name, d.dept_name
ORDER BY r.severity, rank_within_severity;
