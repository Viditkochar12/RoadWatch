# 🚧 RoadWatch

A full-stack MERN application that enables citizens to report road issues such as potholes, damaged roads, broken streetlights, and other infrastructure problems. Reports include location details, severity level, and photo evidence. Administrators can review reports and update their status.

---

## ✨ Features

### 👤 Citizen

- User Registration & Login
- JWT Authentication
- Create Road Damage Reports
- Upload Images (Cloudinary)
- View All Reports
- View My Reports
- Profile Page
- Responsive UI

### 👨‍💼 Admin

- Secure Admin Login
- Admin Dashboard
- View All Submitted Reports
- Update Report Status
- Dashboard Statistics

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt
- Multer
- Cloudinary

---

## 📂 Project Structure

```text
RoadWatchProject/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

## ⚙ Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Install Frontend

```bash
cd client
npm install
npm run dev
```

### Install Backend

```bash
cd server
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Client

```env
VITE_API_URL=YOUR_BACKEND_API_URL
```

### Server

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

---

## 🚀 Future Improvements

- Interactive map integration
- Email notifications
- Report search & filtering
- Report analytics
- Live location tracking

---

## 👨‍💻 Author

**Vidit Kochar**

B.Tech Software Product Engineering

JECRC University × Kalvium

BS Degree in Data Science

IIT Madras

---

## 📄 License

This project is developed for educational and portfolio purposes.