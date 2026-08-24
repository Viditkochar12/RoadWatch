# 🐘 RoadWatch - PostgreSQL Relational Database Schema & SQL JOINs Design

**Author:** Vidit Kochar  
**Project:** RoadWatch Civic Infrastructure System  
**Topic:** Relational Schema Design (PK/FK Constraints), Normalization, and Comprehensive SQL JOINs  

---

## 1. Entity-Relationship (ER) Conceptual Model

```
+-------------------+             1:N              +--------------------------+
|      users        | ---------------------------> |         reports          |
|-------------------|                              |--------------------------|
| PK user_id        |                              | PK report_id             |
|    name           |                              | FK reported_by (users)   |
|    email (UNIQUE) |             1:N              | FK assigned_dept_id      |
|    role           | ------------------------+    |    title                 |
| FK supervisor_id  |                         |    |    description           |
+-------------------+                         |    |    latitude, longitude   |
          |                                   |    |    severity, status      |
          | 1:N (Comments)                    |    |    ai_analysis (JSONB)   |
          ▼                                   |    +--------------------------+
+--------------------------+                  |                 |
|     report_comments      |                  |                 | 1:N
|--------------------------|                  |                 ▼
| PK comment_id            |                  |    +--------------------------+
| FK report_id (reports)   |                  |    |    status_audit_logs     |
| FK user_id (users)       |                  |    |--------------------------|
|    comment_text          |                  |    | PK log_id                |
+--------------------------+                  |    | FK report_id (reports)   |
          ▲                                   |    | FK changed_by (users)    |
          | M:N (Associative)                 |    |    old_status, new_status|
+--------------------------+                  |    +--------------------------+
|      citizen_votes       |                  |                 ▲
|--------------------------|                  |                 | 1:N
| PK (report_id, user_id)  | ◄----------------+                 |
| FK report_id (reports)   |                       +--------------------------+
| FK user_id (users)       |                       |       departments        |
|    vote_type             |                       |--------------------------|
+--------------------------+                       | PK dept_id               |
                                                   |    dept_name (UNIQUE)    |
                                                   |    jurisdiction_zone     |
                                                   |    budget_allocated      |
                                                   +--------------------------+
```

---

## 2. Normalization Rationale (1NF &rarr; 3NF)

1. **First Normal Form (1NF)**:
   - All columns hold atomic values (e.g. `latitude` and `longitude` are distinct numeric values rather than composite strings).
   - Each record has a unique Primary Key (`user_id`, `report_id`, `dept_id`, or composite `(report_id, user_id)`).

2. **Second Normal Form (2NF)**:
   - Complies with 1NF and guarantees all non-key attributes are fully functionally dependent on the primary key.
   - On `citizen_votes`, `vote_type` depends entirely on both `(report_id, user_id)`.

3. **Third Normal Form (3NF)**:
   - Eliminates transitive dependencies. Department contact details reside in `departments` rather than repeating redundantly inside every row in `reports`.

---

## 3. SQL JOINs Deep-Dive

| JOIN Type | RoadWatch Practical Use Case | Guaranteed Result Set Behavior |
| :--- | :--- | :--- |
| **INNER JOIN** | Correlating road defects with citizen details and assigned department | Returns rows only when keys match across all 3 joined tables. |
| **LEFT JOIN** | Aggregating report comments & upvotes for all submitted reports | Preserves every report row even if it has 0 comments or unassigned department. |
| **RIGHT JOIN** | Municipal workload audit across all registered municipal departments | Preserves every department row even if currently handling 0 assigned tickets. |
| **FULL OUTER JOIN** | Master reconciliation between registered user accounts and reported tickets | Returns all users and all reports, identifying orphan users who never reported. |
| **SELF JOIN** | 1. Employee-to-Supervisor hierarchy.<br>2. Detecting duplicate nearby reports on the same road | Joins a table to itself using aliases (`users emp` vs `users mgr`). |
| **CROSS JOIN** | Generating Department &times; Severity incident capacity planning matrix | Produces a Cartesian product of all departments and severity types. |

---

## 4. Query Execution Examples

### INNER JOIN:
```sql
SELECT 
    r.report_id, r.title, r.severity, r.status,
    u.name AS reported_by, d.dept_name AS assigned_department
FROM reports r
INNER JOIN users u ON r.reported_by = u.user_id
INNER JOIN departments d ON r.assigned_dept_id = d.dept_id;
```

### LEFT JOIN:
```sql
SELECT 
    r.report_id, r.title,
    COUNT(c.comment_id) AS total_comments,
    COALESCE(SUM(CASE WHEN v.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) AS total_upvotes
FROM reports r
LEFT JOIN report_comments c ON r.report_id = c.report_id
LEFT JOIN citizen_votes v ON r.report_id = v.report_id
GROUP BY r.report_id, r.title;
```
