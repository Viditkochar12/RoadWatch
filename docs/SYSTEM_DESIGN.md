# 🏗️ RoadWatch - System Design & Architecture Document

**Author:** Vidit Kochar  
**Project:** RoadWatch Civic Infrastructure Reporting & AI Incident Triage System  
**Tech Stack:** React (Vite, Tailwind CSS), Express.js (Node.js), MongoDB Atlas, PostgreSQL, Cloudinary, OpenAI Structured Outputs  

---

## 1. Executive Summary & Problem Modeling

RoadWatch bridges the civic communication gap between municipal authorities and citizens. When infrastructure failures (potholes, missing manhole covers, sinkholes, broken lighting) occur, manual reporting is slow, unorganized, and lacks location precision. 

RoadWatch models this problem by introducing:
1. **Precise Geolocation & Evidence Ingestion**: Real-time GPS coordinate capture and cloud image hosting.
2. **AI-Powered Incident Triage**: Zero-shot prompt-engineered models emitting structured JSON triage schemas to categorize damage, compute urgency scores (1-10), flag immediate safety hazards, and route work orders.
3. **Dual-Store Architecture**: Real-time NoSQL document processing via MongoDB Atlas alongside an enterprise Relational PostgreSQL schema with normalized tables, foreign keys, and audit logging.

---

## 2. High-Level System Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                          CLIENT LAYER                                             |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                     React Single Page Application (Vite + Tailwind CSS)                     |  |
|  |                                                                                             |  |
|  |  +--------------------+  +----------------------+  +------------------+  +---------------+  |  |
|  |  | Compound UI Cards  |  | Promisified GPS API  |  | useDebounce Hook |  | Closures/Memo |  |  |
|  |  +--------------------+  +----------------------+  +------------------+  +---------------+  |  |
|  +----------------------------------------------+----------------------------------------------+  |
+-------------------------------------------------|-------------------------------------------------+
                                                  | HTTPS / REST JSON Requests
                                                  ▼
+---------------------------------------------------------------------------------------------------+
|                                      API & BACKEND LAYER                                          |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                           Express.js Application Server (Node.js)                           |  |
|  |                                                                                             |  |
|  |  +-------------------+  +-----------------------+  +------------------+  +---------------+  |  |
|  |  | JWT & Role Auth   |  | Multer Image Handler  |  | asyncHandler HOF |  | AppError Pipe |  |  |
|  |  +-------------------+  +-----------------------+  +------------------+  +---------------+  |  |
|  +-----------------------------------+----------+-------------------+--------------------------+  |
+--------------------------------------|----------|-------------------|-----------------------------+
                                       |          |                   |
               +-----------------------+          |                   +-----------------------+
               |                                  |                                           |
               ▼                                  ▼                                           ▼
+-----------------------------+  +---------------------------------+  +-------------------------------+
|       DATABASE LAYER        |  |         STORAGE LAYER           |  |       EXTERNAL AI SERVICES    |
|                             |  |                                 |  |                               |
|  +-----------------------+  |  |  +---------------------------+  |  |  +-------------------------+  |
|  | MongoDB Atlas         |  |  |  | Cloudinary CDN            |  |  |  | OpenAI Structured Output|  |
|  | (Document Store)      |  |  |  | (Evidence Image Storage)  |  |  |  | (JSON Schema Response)  |  |
|  +-----------------------+  |  |  +---------------------------+  |  |  +-------------------------+  |
|                             |  +---------------------------------+  +-------------------------------+
|  +-----------------------+  |
|  | PostgreSQL (Relational|  |
|  | Schema with PK/FK)    |  |
|  +-----------------------+  |
+-----------------------------+
```

---

## 3. Component Integration & Data Flow

### A. Report Creation & AI Triage Flow
1. **User Action**: The citizen fills in details and captures photo evidence.
2. **Promisified GPS**: `getPromisifiedLocation()` acquires accurate GPS coordinates asynchronously.
3. **AI Structured Triage (Optional Pre-check or Auto-dispatch)**:
   - Request to `/api/ai/analyze` invokes OpenAI with strict JSON Schema output.
   - Structured taxonomy (`category`, `aiSeverity`, `urgencyScore`, `estimatedRepairDays`, `safetyHazard`, `departmentsToNotify`) is computed.
4. **Multipart File Ingestion**:
   - Multer middleware intercepts binary file stream and securely streams it to Cloudinary.
   - Cloudinary returns an HTTPS signed URL.
5. **Persistence**:
   - Report document is written to MongoDB Atlas.
   - Relational audit row is written to PostgreSQL `reports` and `status_audit_logs`.

---

## 4. Server-Side Error Handling Strategy

RoadWatch implements an enterprise-grade, centralized error handling pipeline:

```
Route Trigger ──► asyncHandler(controller)
                        │
                  (Error Thrown)
                        ▼
                Global errorHandler Middleware
                        │
        ┌───────────────┼───────────────┬────────────────┬───────────────┐
        ▼               ▼               ▼                ▼               ▼
   Mongoose        Mongoose        Mongoose            JWT            Multer
  CastError      ValidationError  DuplicateKey        Errors          Errors
(Invalid ID)     (Schema Fields)   (Code 11000)    (Expired/Forged) (Size Limits)
        │               │               │                │               │
        └───────────────┼───────────────┴────────────────┴───────────────┘
                        ▼
            Operational AppError Instance
                        ▼
         Standardized JSON Error Payload:
         {
           "success": false,
           "status": "fail" | "error",
           "statusCode": 400 | 401 | 404 | 500,
           "message": "Human-readable descriptive message"
         }
```

---

## 5. Security & Secrets Management Architecture

1. **Zero Secret Leakage**: Strict `.gitignore` prevents commit of `.env` files. Both `server/.env.example` and `client/.env.example` are committed as templates.
2. **Startup Environment Validation**: `server/config/env.js` validates critical variables (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`) at boot, emitting clear diagnostic warnings.
3. **Password Security**: Passwords are salted and hashed using `bcryptjs` with 10 salt rounds. Hashes are never returned in API payloads.
4. **Token-based Authentication**: Stateless JWTs signed with `HMAC-SHA256` carrying user IDs and RBAC roles (`citizen`, `admin`, `field_engineer`).
