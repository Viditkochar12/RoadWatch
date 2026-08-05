# Low Level Design (LLD)

# 🚧 RoadWatch - Smart Road Damage Reporting System

**Version:** 1.0

**Author:** Vidit Kochar

**Project Type:** Full Stack MERN Application

---

# 1. Introduction

The Low-Level Design (LLD) describes the internal implementation of the RoadWatch application. It explains the project structure, database schema, API endpoints, authentication mechanism, middleware, controllers, and request flow.

The objective of this document is to provide implementation-level details of the system.

---

# 2. Project Structure

```
RoadWatchProject/

│
├── client/
│
│   ├── public/
│   ├── src/
│   │
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── README.md
├── PRD.md
├── HLD.md
└── LLD.md
```

---

# 3. Database Design

## User Collection

| Field | Type |
|------|------|
| name | String |
| email | String |
| password | String |
| role | String |
| createdAt | Date |

---

## Report Collection

| Field | Type |
|------|------|
| title | String |
| description | String |
| image | String |
| location.address | String |
| location.latitude | Number |
| location.longitude | Number |
| severity | String |
| status | String |
| reportedBy | ObjectId |
| createdAt | Date |

---

# 4. Folder Responsibilities

## Config

Contains

- MongoDB Connection
- Cloudinary Configuration

---

## Controllers

Contains business logic.

Examples

- Register User
- Login User
- Create Report
- Get Reports
- Update Report Status

---

## Models

Contains MongoDB schemas.

Examples

- User Model
- Report Model

---

## Routes

Defines REST API endpoints.

Examples

- Authentication Routes
- Report Routes

---

## Middleware

Contains reusable middleware.

Examples

- JWT Authentication
- Admin Authorization
- Error Handling

---

## Utils

Contains helper functions if required.

---

# 5. Authentication Design

RoadWatch uses JWT Authentication.

Flow

```
User Login

↓

Email Validation

↓

Password Validation

↓

JWT Generated

↓

Token Returned

↓

Client Stores Token

↓

Authorization Header

↓

Middleware Verification

↓

Protected Route
```

---

# 6. Image Upload Design

RoadWatch stores images using Cloudinary.

Flow

```
User

↓

Upload Image

↓

Multer

↓

Cloudinary

↓

Secure URL

↓

MongoDB
```

Only the Cloudinary URL is stored inside MongoDB.

---

# 7. Report Creation Flow

```
Citizen

↓

Login

↓

Fill Form

↓

Upload Image

↓

Validation

↓

Cloudinary Upload

↓

MongoDB Save

↓

Response Returned
```

---

# 8. Report Status Flow

```
Pending

↓

In Progress

↓

Resolved

↓

Displayed to User
```

---

# 9. API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/users/register |
| POST | /api/users/login |
| GET | /api/users/profile |

---

## Reports

| Method | Endpoint |
|---------|----------|
| POST | /api/reports |
| GET | /api/reports |
| GET | /api/reports/my |
| PUT | /api/reports/:id/status |

---

# 10. Validation

## Registration

- Name Required
- Email Required
- Password Required

---

## Login

- Email Required
- Password Required

---

## Report

- Title Required
- Description Required
- Address Required
- Latitude Validation
- Longitude Validation
- Severity Validation

---

# 11. Security

RoadWatch implements

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role Based Authorization
- Input Validation
- Environment Variables
- Cloudinary Secure URLs

---

# 12. Frontend Components

Main Pages

- Home
- Login
- Register
- Reports
- Create Report
- My Reports
- Profile
- Admin Dashboard
- Not Found

Reusable Components

- Navbar
- Footer
- Loader
- ReportMap

---

# 13. Request Flow

```
User

↓

React Component

↓

Axios

↓

Express Route

↓

Controller

↓

Model

↓

MongoDB

↓

JSON Response

↓

React UI
```

---

# 14. Error Handling

The backend returns proper HTTP status codes.

Examples

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error

---

# 15. Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

Image Storage

- Cloudinary

---

# 16. Future Improvements

- Google Maps API Integration
- AI Road Damage Detection
- Push Notifications
- Email Notifications
- Real-Time Updates using Socket.io
- Mobile Application
- Analytics Dashboard

---

# 17. Conclusion

The RoadWatch application follows a modular MERN architecture with clearly separated frontend, backend, database, and cloud storage layers. JWT authentication, Cloudinary image storage, MongoDB Atlas, and REST APIs together provide a secure, scalable, and maintainable solution for reporting and managing road infrastructure issues.
