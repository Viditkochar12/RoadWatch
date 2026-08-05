# Product Requirements Document (PRD)

# RoadWatch
### Smart Road Damage Reporting & Management System

**Version:** 1.0

**Author:** Vidit Kochar

**Date:** August 2026

---

# 1. Project Overview

RoadWatch is a full-stack web application that enables citizens to report road-related issues such as potholes, damaged roads, broken streetlights, road cracks, and other civic infrastructure problems.

The platform allows users to submit reports with descriptions, severity levels, images, and location details. Administrators can monitor all reports through a centralized dashboard, update report statuses, and manage infrastructure issues efficiently.

RoadWatch aims to improve communication between citizens and authorities while increasing transparency in road maintenance.

---

# 2. Problem Statement

Road damage is one of the major causes of traffic congestion and accidents.

Existing complaint systems are often:

- Difficult to use
- Lack transparency
- Do not provide status tracking
- Require multiple offline processes

Citizens often have no way to know whether their complaint has been received or resolved.

RoadWatch provides a centralized digital platform that makes reporting, tracking, and managing road issues simple and efficient.

---

# 3. Objectives

The primary objectives of RoadWatch are:

- Allow citizens to report road damage quickly.
- Maintain a centralized database of road issues.
- Provide administrators with management tools.
- Allow users to monitor report progress.
- Improve transparency between citizens and authorities.

---

# 4. Target Users

## Citizens

Citizens can:

- Register
- Login
- Submit road damage reports
- View all reports
- Track their own reports
- Monitor issue status

---

## Administrators

Administrators can:

- Login securely
- View every report
- Search reports
- Filter reports
- Update report status
- Manage infrastructure issues

---

# 5. User Roles

## Normal User

Permissions:

- Register account
- Login
- Create report
- View reports
- View personal reports
- Logout

---

## Admin

Permissions:

- All user permissions
- Access admin dashboard
- View all submitted reports
- Update report status
- Manage reported issues

---

# 6. Functional Requirements

## Authentication

The system shall provide:

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-based Authorization
- Logout

---

## Report Management

Users shall be able to:

- Create report
- Enter issue title
- Enter description
- Select severity
- Enter location
- Upload image
- Submit report

---

## Report Viewing

The application shall provide:

- Community Reports
- Search functionality
- Severity filters
- Status filters
- Report details

---

## My Reports

Users shall:

- View submitted reports
- Track report progress
- View statistics
- Monitor issue status

---

## Admin Dashboard

The administrator shall:

- View all reports
- Search reports
- Filter reports
- Update report status
- Monitor overall statistics

---

## Profile

The application shall display:

- User name
- Email
- Account role
- Join date

---

# 7. Non-Functional Requirements

The system should satisfy the following quality attributes.

## Performance

- Fast page loading
- Optimized API responses

---

## Security

- JWT Authentication
- Password hashing using bcrypt
- Protected APIs
- Authorization middleware
- Environment variables for secrets

---

## Reliability

- Proper error handling
- Database validation
- API validation

---

## Usability

- Responsive design
- Clean user interface
- Mobile-friendly layout
- Easy navigation

---

# 8. User Flow

## Citizen Flow

Register

↓

Login

↓

Create Report

↓

Submit Report

↓

Track Status

↓

Logout

---

## Admin Flow

Login

↓

Access Dashboard

↓

View Reports

↓

Update Status

↓

Manage Reports

↓

Logout

---

# 9. Technology Stack

## Frontend

- React
- React Router
- Tailwind CSS
- Axios

---

## Backend

- Node.js
- Express.js

---

## Database

- MongoDB
- Mongoose

---

## Authentication

- JWT
- bcrypt

---

## Deployment

Frontend

- Vercel

Backend

- Render

---

## Version Control

- Git
- GitHub

---

# 10. Core Features

- User Authentication
- JWT Authorization
- Protected Routes
- Road Damage Reporting
- Community Reports
- My Reports
- Admin Dashboard
- Profile Management
- Report Status Tracking
- Search
- Filtering
- Responsive UI

---

# 11. Future Enhancements

Future versions of RoadWatch may include:

- AI-based road damage detection
- Live GPS location detection
- Google Maps integration
- Push notifications
- Email notifications
- Government department integration
- Mobile application
- Analytics Dashboard
- Report voting system
- Duplicate report detection

---

# 12. Assumptions

- Users have internet access.
- MongoDB database is available.
- Backend APIs are running.
- Users provide accurate information while reporting.
- Administrators regularly review reports.

---

# 13. Constraints

- Internet connection required.
- Authentication required for protected features.
- Admin features accessible only to authorized users.
- Image upload size may be limited.

---

# 14. Success Criteria

The project will be considered successful if:

- Users can register and login successfully.
- Reports are stored correctly.
- Reports are visible to users.
- Admin can manage reports.
- JWT authentication protects private routes.
- Status updates are reflected correctly.
- The application remains responsive across devices.

---

# 15. Conclusion

RoadWatch is designed to simplify road damage reporting by providing a modern web-based platform for citizens and administrators. The system improves transparency, enables efficient issue tracking, and provides authorities with tools to manage infrastructure complaints effectively.

The project demonstrates full-stack web development concepts including authentication, REST APIs, database management, role-based authorization, frontend development, backend architecture, and deployment.
