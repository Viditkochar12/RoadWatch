# High Level Design (HLD)

# 🚧 RoadWatch - Smart Road Damage Reporting System

**Version:** 1.0

**Author:** Vidit Kochar

**Project Type:** Full Stack MERN Application

---

# 1. Introduction

RoadWatch is a web-based MERN application that enables citizens to report road infrastructure issues such as potholes, damaged roads, broken streetlights, missing manholes, and other civic problems.

The application provides a secure platform where users can upload issue images, specify location details, and track the progress of their reports. Administrators can review, verify, and update report statuses through a dedicated dashboard.

---

# 2. System Architecture

```
                    +----------------------+
                    |      Web Browser     |
                    +----------+-----------+
                               |
                               |
                      HTTP / HTTPS Requests
                               |
                               ▼
                    +----------------------+
                    |   React Frontend     |
                    | (Vite + TailwindCSS) |
                    +----------+-----------+
                               |
                      REST API Calls
                               |
                               ▼
                  +-------------------------+
                  | Express.js Backend API  |
                  +----------+--------------+
                             |
         +-------------------+-------------------+
         |                                       |
         ▼                                       ▼
 Authentication Module                 Report Management
 (JWT + bcrypt)                     (Controllers & Services)
         |                                       |
         +-------------------+-------------------+
                             |
                             ▼
                     Mongoose Models
                             |
                             ▼
                     MongoDB Atlas
                             |
                             ▼
                      Persistent Storage

                Image Upload Flow

User → Multer → Cloudinary → Image URL → MongoDB
```

---

# 3. Major Components

## Frontend

The frontend is responsible for user interaction.

Modules include:

- Home
- Login
- Register
- Report Damage
- Reports
- My Reports
- Profile
- Admin Dashboard
- Navigation Bar

Responsibilities

- User Interface
- Form Validation
- API Communication
- Authentication
- Report Display

---

## Backend

The backend provides REST APIs and business logic.

Modules include

- Authentication
- Report Management
- User Management
- Admin Management
- Image Upload
- Error Handling

Responsibilities

- Validate requests
- Authenticate users
- Store reports
- Manage report status
- Upload images to Cloudinary
- Return JSON responses

---

## Database

MongoDB Atlas stores application data.

Collections

### Users

Stores

- Name
- Email
- Password
- Role

### Reports

Stores

- Title
- Description
- Severity
- Status
- Image URL
- Location
- User Reference
- Created Date

---

# 4. User Roles

## Citizen

Permissions

- Register
- Login
- Create reports
- Upload images
- View reports
- View own reports
- Update profile

Restrictions

- Cannot access admin panel
- Cannot modify report status

---

## Administrator

Permissions

- Login
- View all reports
- Change report status
- Manage reports
- Access dashboard

---

# 5. Technology Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- Multer

## Database

- MongoDB Atlas
- Mongoose

## Cloud Storage

- Cloudinary

## Deployment

Frontend

- Vercel

Backend

- Render

## Version Control

- Git
- GitHub

---

# 6. Authentication Flow

```
User

↓

Login

↓

Credentials Verified

↓

JWT Token Generated

↓

Token Sent to Client

↓

Authorization Header

↓

Protected Middleware

↓

Access Granted
```

---

# 7. Report Submission Flow

```
Citizen

↓

Login

↓

Fill Report Form

↓

Upload Image

↓

Multer

↓

Cloudinary

↓

Secure Image URL

↓

Express Controller

↓

MongoDB Atlas

↓

Admin Reviews Report

↓

Status Updated

↓

Citizen Views Updated Report
```

---

# 8. High-Level Data Flow

```
User
   │
   ▼
React Frontend
   │
REST API
   ▼
Express Server
   │
Controllers
   │
Business Logic
   │
Mongoose
   │
MongoDB Atlas
```

---

# 9. Security Design

RoadWatch implements multiple security layers.

Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Role-Based Authorization
- Input Validation
- Centralized Error Handling
- Secure Image Storage using Cloudinary

---

# 10. Deployment Architecture

```
Client

↓

Vercel

↓

Express Backend

↓

Render

↓

MongoDB Atlas

↓

Cloudinary
```

---

# 11. Scalability

RoadWatch follows a modular architecture.

Future improvements include

- Google Maps Integration
- AI Damage Detection
- Email Notifications
- Push Notifications
- Analytics Dashboard
- Mobile Application
- Real-time Notifications using Socket.io

---

# 12. Advantages of the Architecture

- Modular Design
- Easy Maintenance
- Secure Authentication
- Cloud Image Storage
- Scalable Database
- Independent Frontend & Backend
- RESTful API Architecture

---

# 13. Conclusion

RoadWatch follows a scalable MERN architecture where the frontend, backend, database, and cloud storage are separated into independent layers. The system uses JWT authentication for security, MongoDB Atlas for persistent data storage, Cloudinary for image management, and REST APIs for communication between client and server. This architecture improves maintainability, scalability, and performance while providing an efficient platform for reporting and managing road infrastructure issues.
