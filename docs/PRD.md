# Product Requirements Document (PRD)

# 🚧 RoadWatch - Smart Road Damage Reporting System

**Version:** 1.0

**Author:** Vidit Kochar

**Project Type:** Full Stack MERN Application

---

# 1. Product Overview

RoadWatch is a web-based civic infrastructure reporting platform that enables citizens to report road-related issues such as potholes, damaged roads, broken streetlights, missing manholes, and other public infrastructure problems.

The platform allows users to upload images, provide location details, describe the issue, and monitor the repair status. Administrators can review reports, update their status, and manage reported issues through a secure dashboard.

---

# 2. Problem Statement

Many road infrastructure issues remain unresolved because there is no simple and centralized platform for citizens to report them.

Current problems include:

- No centralized reporting system
- Poor communication between citizens and authorities
- Lack of transparency in issue resolution
- Difficulty tracking complaint progress
- Manual reporting process

RoadWatch addresses these problems through a digital reporting and tracking platform.

---

# 3. Objectives

The primary objectives are:

- Enable citizens to report road issues digitally.
- Provide image-based evidence for every report.
- Store reports securely in a cloud database.
- Allow administrators to review and update reports.
- Improve transparency through status tracking.
- Build a scalable and secure MERN application.

---

# 4. Target Users

## Citizens

Can:

- Register an account
- Login securely
- Report road damage
- Upload photos
- View all reports
- Track their own reports
- Update their profile

---

## Administrators

Can:

- Login securely
- View all reports
- Change report status
- Manage reported issues
- Access Admin Dashboard

---

# 5. Functional Requirements

## Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-Based Authorization

---

## Report Management

Users can:

- Create new report
- Upload road damage image
- Enter location details
- Add description
- Set severity level
- View report history

Admins can:

- View every report
- Change report status
- Review citizen complaints

---

## Image Upload

RoadWatch uses **Cloudinary** for cloud-based image storage.

Workflow:

1. User uploads image.
2. Backend receives image using Multer.
3. Image is uploaded to Cloudinary.
4. Cloudinary returns a secure URL.
5. Image URL is stored in MongoDB.
6. Frontend displays the uploaded image.

---

## Dashboard

Citizen Dashboard

- Total Reports
- My Reports
- Report Status

Admin Dashboard

- Total Reports
- Pending Reports
- Reports In Progress
- Resolved Reports

---

# 6. Non-Functional Requirements

- Responsive UI
- Secure Authentication
- Fast API Response
- Cloud Image Storage
- Scalable Architecture
- Easy Maintenance
- Mobile Friendly

---

# 7. Technology Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- Multer

## Database

- MongoDB Atlas
- Mongoose

## Cloud Storage

- Cloudinary

## Deployment

- Vercel (Frontend)
- Render (Backend)

## Version Control

- Git
- GitHub

---

# 8. User Flow

```
User

↓

Register / Login

↓

JWT Authentication

↓

Home Dashboard

↓

Create Report

↓

Upload Image

↓

Cloudinary

↓

Store Report in MongoDB

↓

Admin Reviews Report

↓

Status Updated

↓

User Views Updated Status
```

---

# 9. Report Lifecycle

```
Pending

↓

In Progress

↓

Resolved
```

---

# 10. Database Collections

## Users

Stores:

- Name
- Email
- Password
- Role
- Created Date

---

## Reports

Stores:

- Title
- Description
- Severity
- Status
- Image URL
- Location
- User ID
- Created Date

---

# 11. Security Features

- JWT Authentication
- Password Hashing
- Protected API Routes
- Role-Based Authorization
- Input Validation
- Error Handling Middleware
- Secure Image Storage via Cloudinary

---

# 12. Success Metrics

The project will be considered successful if:

- Users can register and login securely.
- Reports are successfully created.
- Images upload correctly to Cloudinary.
- Reports are stored in MongoDB.
- Admin can manage reports.
- Status updates are reflected correctly.
- Application is deployed successfully.

---

# 13. Future Enhancements

- Google Maps Integration
- Live GPS Detection
- AI Road Damage Detection
- Email Notifications
- Push Notifications
- Government Dashboard
- Analytics Dashboard
- Mobile Application
- Real-time Notifications using Socket.io

---

# 14. Assumptions

- Internet connection is available.
- Cloudinary service is active.
- MongoDB Atlas is accessible.
- User provides accurate information.
- Admin regularly reviews reports.

---

# 15. Constraints

- Requires internet connection.
- Depends on Cloudinary availability.
- Depends on MongoDB Atlas availability.
- Only authenticated users can submit reports.
- Only administrators can update report status.

---

# 16. Conclusion

RoadWatch provides a modern, secure, and scalable platform for reporting road infrastructure issues. By combining React, Node.js, Express, MongoDB Atlas, JWT Authentication, Cloudinary image storage, and an Admin Dashboard, the system offers citizens an efficient way to report problems while enabling administrators to manage and resolve them effectively.
