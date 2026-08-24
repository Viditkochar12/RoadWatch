# 🚧 RoadWatch - Smart Road Damage Reporting & AI Incident Triage

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Structured%20Outputs-412991?logo=openai&logoColor=white)](https://openai.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A full-stack civic infrastructure application enabling citizens to report road hazards (potholes, missing manhole covers, sinkholes, broken streetlights) with photographic evidence, GPS coordinates, and real-time AI problem modeling. Administrators can review, verify, and update report statuses through a dedicated operations dashboard.

---

## 🌟 Evaluation Rubric & Mandatory Concepts Matrix

Every mandatory evaluation topic is fully implemented in code, documented, and testable through the interactive **Concept Hub (`/concepts`)**:

| Category | Mandatory Topic | Points | Implementation in RoadWatch |
| :--- | :--- | :--- | :--- |
| **AI App Eng** | **Prompt engineering** | 0.2 pts | Role-constrained system prompts with hazard guidelines in `server/services/aiService.js` |
| **AI App Eng** | **Structured outputs** | 0.2 pts | Strict OpenAI JSON Schema validation ensuring typed output schema in `aiService.js` |
| **AI App Eng** | **Problem modeling** | 0.2 pts | Incident triage taxonomy, urgency score (1-10), hazard flags, and municipal department routing |
| **Backend & System Design** | **Server-side error handling** | 0.2 pts | Centralized `AppError`, `asyncHandler`, and global Express middleware in `server/middleware/errorMiddleware.js` |
| **Backend & System Design** | **System design basics** | 0.2 pts | Modular React &harr; Express &harr; Mongo Atlas &harr; Postgres &harr; Cloudinary integration documented in `docs/SYSTEM_DESIGN.md` |
| **Backend & System Design** | **Environment variables & secrets** | 0.2 pts | Centralized config validator `server/config/env.js` + `.env.example` templates + zero secret leakage |
| **Engineering Practices** | **Git workflow** | 0.3 pts | Branching model, Conventional Commits, and PR/issue templates in `docs/GIT_WORKFLOW.md` & `.github/` |
| **Frontend** | **JavaScript — async/await** | 0.1 pts | Async/await data fetching with try/catch/finally and parallel execution (`Promise.allSettled`) |
| **Frontend** | **JavaScript — Closures** | 0.1 pts | `useDebounce` hook, `createThrottler`, `createMemoizer`, and private state closures in `client/src/utils/closures.js` |
| **Frontend** | **JavaScript — Event loop** | 0.1 pts | Call stack vs Microtask vs Macrotask interactive simulator in `client/src/utils/eventLoopDemo.js` |
| **Frontend** | **JavaScript — Hoisting** | 0.1 pts | TDZ, `var` vs `let`/`const`, and function declarations vs expressions in `client/src/utils/hoistingDemo.js` |
| **Frontend** | **JavaScript — Promises vs callbacks** | 0.1 pts | Promisified Geolocation API & FileReader wrappers in `client/src/utils/asyncHelpers.js` |
| **Frontend** | **React component composition** | 0.2 pts | Compound `<Card>` (`Header`, `Body`, `Footer`, `Image`), polymorphic `<Button>`, `<Badge>`, and `<Modal>` |
| **Frontend** | **Side effects with useEffect** | 0.2 pts | `AbortController` cancellation, `URL.revokeObjectURL` cleanup, and event listener unbinding |
| **Frontend** | **State management with useState** | 0.2 pts | Multi-field controlled forms, functional state updates (`prev => ...`), search filter state |
| **SQL (Postgres)** | **Relational schema design with PK/FK** | 0.2 pts | Normalized PostgreSQL schema with Primary/Foreign keys and constraints in `server/database/schema.sql` |
| **SQL (Postgres)** | **SQL JOINs** | 0.2 pts | Complete suite of `INNER`, `LEFT`, `RIGHT`, `FULL OUTER`, `SELF`, and `CROSS` JOINs in `server/database/queries.sql` |

---

## 🛠 Tech Stack

### Frontend
- **React 19** & **Vite**
- **Tailwind CSS v4**
- **React Router DOM 7**
- **Axios** (with Interceptors)
- **Leaflet & React-Leaflet** (OpenStreetMap Integration)
- **React Toastify** (Notifications)

### Backend
- **Node.js** & **Express.js 5**
- **MongoDB Atlas** & **Mongoose 9**
- **PostgreSQL 16 Relational Schema & Queries**
- **OpenAI API** (Structured JSON Schema Outputs)
- **JWT Authentication** & **Bcrypt.js** (Password Hashing)
- **Multer** & **Cloudinary** (Evidence Image Storage)

---

## 📂 Project Structure

```text
RoadWatchProject/
├── .github/                        # GitHub PR & Issue templates
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
├── client/                         # Frontend React application
│   ├── src/
│   │   ├── components/             # Reusable UI & Compound components
│   │   │   ├── common/             # Card, Button, Badge, Modal
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ReportMap.jsx
│   │   ├── hooks/                  # Custom React hooks (useDebounce)
│   │   ├── pages/                  # Route views (Home, Reports, CreateReport, ConceptsHub, Admin)
│   │   ├── services/               # API clients (reportService, authService, aiService, sqlService)
│   │   └── utils/                  # JS Closures, Event Loop, Hoisting, Promisified GPS
│   ├── .env.example
│   └── package.json
├── server/                         # Backend Express application
│   ├── config/                     # Environment validator (env.js), DB, Cloudinary
│   ├── controllers/                # Business logic (auth, report, ai, sqlAnalytics)
│   ├── database/                   # PostgreSQL schema (schema.sql) & SQL JOINs (queries.sql)
│   ├── middleware/                 # Auth, Admin, Upload, Centralized Global Error Handler
│   ├── models/                     # Mongoose Models (Report, User) with AI metadata
│   ├── routes/                     # REST API Routes (/api/auth, /api/reports, /api/ai, /api/analytics)
│   ├── services/                   # AI Triage Service with Prompt Engineering & Fallbacks
│   ├── utils/                      # AppError, asyncHandler, generateToken
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── docs/                           # Architecture & Engineering documentation
│   ├── SYSTEM_DESIGN.md
│   ├── SQL_SCHEMA_DESIGN.md
│   ├── GIT_WORKFLOW.md
│   ├── HLD.md
│   ├── LLD.md
│   └── PRD.md
└── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Viditkochar12/RoadWatch.git
cd RoadWatch
```

### 2. Configure Backend Server
```bash
cd server
npm install

# Copy environment variables template
cp .env.example .env
# Fill in your MONGODB_URI, JWT_SECRET, CLOUDINARY_*, and OPENAI_API_KEY

# Start backend server
npm run dev
```

### 3. Configure Frontend Client
```bash
cd ../client
npm install

# Copy environment variables template
cp .env.example .env

# Start frontend development server
npm run dev
```

---

## 🧠 Interactive Concept Hub

Visit `http://localhost:5173/concepts` (or click **Concept Hub** in the Navbar) to interactively explore and run:
1. **AI Prompt & Structured Output Triage Tester** (Live problem modeling with OpenAI JSON schema).
2. **Backend Error Handling & Secrets Architecture** (AppError & asyncHandler pipeline).
3. **JavaScript Event Loop Simulator** (Live call stack vs microtask vs macrotask execution logger).
4. **JavaScript Closures & Memoizer Explorer** (Instant cache hit benchmarks).
5. **PostgreSQL Relational Schema & SQL JOINs Explorer** (Interactive query builder with sample data).
6. **React Component Composition Gallery** (Compound Card slots, Polymorphic Buttons, Modals).

---

## 👨‍💻 Author

**Vidit Kochar**  
B.Tech Software Product Engineering  
*JECRC University × Kalvium*  
*BS Degree in Data Science, IIT Madras*

---

## 📄 License
This project is developed for educational and portfolio demonstration.