/**
 * Relational Schema Definition & SQL JOINs Mock Data / Query Registry
 * Used for interactive SQL analytics and educational demonstration.
 */

const SQL_JOIN_CATALOG = [
  {
    id: "inner-join",
    title: "1. INNER JOIN (Reports + Citizen + Department)",
    type: "INNER JOIN",
    description: "Returns only matched records that exist simultaneously across reports, users, and departments.",
    sql: `SELECT 
    r.report_id, r.title, r.severity, r.status, r.address,
    u.name AS reported_by_name, u.email AS reporter_email,
    d.dept_name AS assigned_department, d.contact_phone AS dept_helpline
FROM reports r
INNER JOIN users u ON r.reported_by = u.user_id
INNER JOIN departments d ON r.assigned_dept_id = d.dept_id
ORDER BY r.created_at DESC;`,
    sampleResults: [
      {
        report_id: 1,
        title: "Deep Pothole on Tonk Road",
        severity: "High",
        status: "In Progress",
        address: "Tonk Road, near Gandhi Nagar Station, Jaipur",
        reported_by_name: "Priya Patel",
        reporter_email: "priya.patel@gmail.com",
        assigned_department: "Public Works Department (PWD)",
        dept_helpline: "0141-220011",
      },
      {
        report_id: 2,
        title: "Flooded Underpass after Rain",
        severity: "Critical",
        status: "Pending",
        address: "JLN Marg Underpass, Jaipur",
        reported_by_name: "Priya Patel",
        reporter_email: "priya.patel@gmail.com",
        assigned_department: "Municipal Stormwater & Drainage",
        dept_helpline: "0141-220022",
      },
      {
        report_id: 3,
        title: "Broken Streetlights on MI Road",
        severity: "Medium",
        status: "Resolved",
        address: "MI Road, City Centre, Jaipur",
        reported_by_name: "Rahul Verma",
        reporter_email: "rahul.v@gmail.com",
        assigned_department: "Electrical & Streetlight Division",
        dept_helpline: "0141-220033",
      },
      {
        report_id: 5,
        title: "Missing Drainage Manhole Lid",
        severity: "Critical",
        status: "In Progress",
        address: "Ajmer Road Flyover, Jaipur",
        reported_by_name: "Rahul Verma",
        reporter_email: "rahul.v@gmail.com",
        assigned_department: "Municipal Stormwater & Drainage",
        dept_helpline: "0141-220022",
      },
    ],
  },
  {
    id: "left-join",
    title: "2. LEFT JOIN (Reports + Comments + Upvotes Aggregation)",
    type: "LEFT JOIN",
    description: "Preserves ALL reports even if they have 0 comments or 0 upvotes.",
    sql: `SELECT 
    r.report_id, r.title, r.status,
    COALESCE(d.dept_name, 'Unassigned / Triage Pending') AS department,
    COUNT(c.comment_id) AS total_comments,
    COALESCE(SUM(CASE WHEN v.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) AS total_upvotes
FROM reports r
LEFT JOIN departments d ON r.assigned_dept_id = d.dept_id
LEFT JOIN report_comments c ON r.report_id = c.report_id
LEFT JOIN citizen_votes v ON r.report_id = v.report_id
GROUP BY r.report_id, r.title, r.status, d.dept_name
ORDER BY total_upvotes DESC;`,
    sampleResults: [
      { report_id: 1, title: "Deep Pothole on Tonk Road", status: "In Progress", department: "Public Works Department (PWD)", total_comments: 2, total_upvotes: 3 },
      { report_id: 2, title: "Flooded Underpass after Rain", status: "Pending", department: "Municipal Stormwater & Drainage", total_comments: 1, total_upvotes: 2 },
      { report_id: 5, title: "Missing Drainage Manhole Lid", status: "In Progress", department: "Municipal Stormwater & Drainage", total_comments: 0, total_upvotes: 1 },
      { report_id: 3, title: "Broken Streetlights on MI Road", status: "Resolved", department: "Electrical & Streetlight Division", total_comments: 0, total_upvotes: 0 },
      { report_id: 4, title: "Minor Asphalt Cracks near Subhash Nagar", status: "Pending", department: "Public Works Department (PWD)", total_comments: 0, total_upvotes: 0 },
    ],
  },
  {
    id: "right-join",
    title: "3. RIGHT JOIN (Departments + Active Workload Audit)",
    type: "RIGHT JOIN",
    description: "Preserves ALL departments, including departments with 0 active tickets (e.g. Disaster Relief).",
    sql: `SELECT 
    d.dept_id, d.dept_name, d.jurisdiction_zone, d.budget_allocated,
    COUNT(r.report_id) AS total_assigned_reports,
    COUNT(CASE WHEN r.status = 'In Progress' THEN 1 END) AS active_in_progress
FROM reports r
RIGHT JOIN departments d ON r.assigned_dept_id = d.dept_id
GROUP BY d.dept_id, d.dept_name, d.jurisdiction_zone, d.budget_allocated
ORDER BY total_assigned_reports DESC;`,
    sampleResults: [
      { dept_id: 1, dept_name: "Public Works Department (PWD)", jurisdiction_zone: "Zone A - Central", budget_allocated: "5000000.00", total_assigned_reports: 2, active_in_progress: 1 },
      { dept_id: 2, dept_name: "Municipal Stormwater & Drainage", jurisdiction_zone: "Zone B - North & South", budget_allocated: "3500000.00", total_assigned_reports: 2, active_in_progress: 1 },
      { dept_id: 3, dept_name: "Electrical & Streetlight Division", jurisdiction_zone: "Citywide", budget_allocated: "2000000.00", total_assigned_reports: 1, active_in_progress: 0 },
      { dept_id: 4, dept_name: "Traffic & Highway Safety Dept", jurisdiction_zone: "Expressways & Arterials", budget_allocated: "4500000.00", total_assigned_reports: 0, active_in_progress: 0 },
      { dept_id: 5, dept_name: "Emergency Disaster Relief (No active reports yet)", jurisdiction_zone: "Metropolitan Area", budget_allocated: "8000000.00", total_assigned_reports: 0, active_in_progress: 0 },
    ],
  },
  {
    id: "self-join",
    title: "4. SELF JOIN (Staff & Supervisor Hierarchy)",
    type: "SELF JOIN",
    description: "Joins the users table with itself to model supervisor-to-subordinate hierarchy.",
    sql: `SELECT 
    emp.user_id AS employee_id, emp.name AS staff_name, emp.role AS staff_role,
    COALESCE(mgr.name, 'Top Level Administrator') AS supervisor_name,
    COALESCE(mgr.email, 'N/A') AS supervisor_email
FROM users emp
LEFT JOIN users mgr ON emp.supervisor_id = mgr.user_id;`,
    sampleResults: [
      { employee_id: 1, staff_name: "Vikram Sharma", staff_role: "supervisor", supervisor_name: "Top Level Administrator", supervisor_email: "N/A" },
      { employee_id: 2, staff_name: "Vidit Kochar", staff_role: "admin", supervisor_name: "Vikram Sharma", supervisor_email: "vikram@roadwatch.org" },
      { employee_id: 6, staff_name: "Suresh Kumar", staff_role: "field_engineer", supervisor_name: "Vidit Kochar", supervisor_email: "vidit@roadwatch.org" },
      { employee_id: 3, staff_name: "Priya Patel", staff_role: "citizen", supervisor_name: "Top Level Administrator", supervisor_email: "N/A" },
    ],
  },
  {
    id: "cross-join",
    title: "5. CROSS JOIN (Department x Severity Capacity Matrix)",
    type: "CROSS JOIN",
    description: "Generates a full Cartesian product of all departments across all 4 severity categories.",
    sql: `SELECT 
    d.dept_name, s.severity_level,
    COALESCE(COUNT(r.report_id), 0) AS current_incident_count
FROM departments d
CROSS JOIN (
    SELECT UNNEST(ENUM_RANGE(NULL::severity_enum)) AS severity_level
) s
LEFT JOIN reports r 
    ON r.assigned_dept_id = d.dept_id AND r.severity = s.severity_level
GROUP BY d.dept_name, s.severity_level
ORDER BY d.dept_name, s.severity_level;`,
    sampleResults: [
      { dept_name: "Public Works Department (PWD)", severity_level: "High", current_incident_count: 1 },
      { dept_name: "Public Works Department (PWD)", severity_level: "Low", current_incident_count: 1 },
      { dept_name: "Public Works Department (PWD)", severity_level: "Medium", current_incident_count: 0 },
      { dept_name: "Public Works Department (PWD)", severity_level: "Critical", current_incident_count: 0 },
      { dept_name: "Municipal Stormwater & Drainage", severity_level: "Critical", current_incident_count: 2 },
    ],
  },
];

const SCHEMA_METADATA = [
  {
    tableName: "users",
    primaryKey: "user_id",
    foreignKeys: [{ column: "supervisor_id", references: "users(user_id)" }],
    description: "Stores citizen and administrative user profiles, auth credentials, and supervisor links.",
  },
  {
    tableName: "departments",
    primaryKey: "dept_id",
    foreignKeys: [],
    description: "Municipal agencies responsible for road repairs (PWD, Drainage, Electrical, etc.).",
  },
  {
    tableName: "reports",
    primaryKey: "report_id",
    foreignKeys: [
      { column: "reported_by", references: "users(user_id)" },
      { column: "assigned_dept_id", references: "departments(dept_id)" },
    ],
    description: "Core road defect records containing GPS coordinates, severity, status, and AI triage JSONB.",
  },
  {
    tableName: "status_audit_logs",
    primaryKey: "log_id",
    foreignKeys: [
      { column: "report_id", references: "reports(report_id)" },
      { column: "changed_by", references: "users(user_id)" },
    ],
    description: "Immutable timeline auditing each status transition with timestamp and change notes.",
  },
  {
    tableName: "citizen_votes",
    primaryKey: "(report_id, user_id) [Composite PK]",
    foreignKeys: [
      { column: "report_id", references: "reports(report_id)" },
      { column: "user_id", references: "users(user_id)" },
    ],
    description: "Associative table tracking upvotes to prioritize highest-impact issues.",
  },
  {
    tableName: "report_comments",
    primaryKey: "comment_id",
    foreignKeys: [
      { column: "report_id", references: "reports(report_id)" },
      { column: "user_id", references: "users(user_id)" },
    ],
    description: "Citizen discussions and official government dispatch responses.",
  },
];

module.exports = {
  SQL_JOIN_CATALOG,
  SCHEMA_METADATA,
};
