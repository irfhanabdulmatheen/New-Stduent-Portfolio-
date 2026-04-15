# 🎓 Student Portfolio System

A full-stack web application that allows students to build and manage their academic portfolios, while providing teachers and administrators with tools to review and monitor student progress.

---

## 🌐 Live Demo

> **Frontend:** [https://new-stduent-portfolio.vercel.app](https://new-stduent-portfolio.vercel.app)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Screenshots](#screenshots)
- [Default Admin Credentials](#default-admin-credentials)
- [License](#license)

---

## 📖 About the Project

The **Student Portfolio System** is a role-based web platform designed for educational institutions. Students can showcase their projects, certifications, placements, and skills. Teachers can review and leave feedback on student portfolios. Administrators have full visibility with analytics and department management tools.

---

## ✨ Features

### 🎓 Student
- Register & login (Email/Password or Google OAuth)
- Build a personal portfolio with:
  - 📁 Projects (title, description, link)
  - 🏅 Certifications (with external certificate links)
  - 💼 Placements (company, role, package)
  - 🛠️ Skills (technical & soft skills)
- Edit personal profile with profile photo upload
- Download portfolio as a **PDF Resume**
- View a clean public portfolio page

### 👨‍🏫 Teacher
- View list of assigned students
- See detailed student portfolio views
- Write and manage review notes for students
- Generate and view student reports

### 🛡️ Admin
- View all students across the system
- Search, filter, and browse student profiles
- Access system analytics and charts
- Manage academic departments
- Configure system-level settings

### 🔐 Authentication & Security
- JWT-based authentication for all roles
- Google OAuth 2.0 for student login
- Role-based protected routes
- bcrypt password hashing

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | React 18, Vite, TailwindCSS, React Router DOM  |
| Backend     | Node.js, Express.js                            |
| Database    | MongoDB Atlas (via Mongoose)                   |
| Auth        | JWT, Google OAuth 2.0 (`@react-oauth/google`)  |
| File Upload | Multer                                         |
| PDF Export  | html2pdf.js                                    |
| Notifications | React Toastify                               |
| Icons       | React Icons                                    |
| HTTP Client | Axios                                          |

---

## 📁 Project Structure

```
NEW STUDENT PORTFOLIO SYSTEM/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Login, register, Google OAuth
│   │   ├── studentController.js   # Student CRUD operations
│   │   ├── teacherController.js   # Teacher-specific logic
│   │   └── adminController.js     # Admin management logic
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── models/
│   │   ├── User.js                # User model (all roles)
│   │   ├── Profile.js             # Student profile
│   │   ├── Project.js             # Student projects
│   │   ├── Certification.js       # Student certifications
│   │   ├── Placement.js           # Placement records
│   │   └── Skill.js               # Student skills
│   ├── routes/
│   │   ├── auth.js                # /api/auth
│   │   ├── student.js             # /api/student
│   │   ├── teacher.js             # /api/teacher
│   │   ├── admin.js               # /api/admin
│   │   └── public.js              # /api/portfolio (public)
│   ├── utils/
│   │   └── ensureAdmin.js         # Auto-create default admin on boot
│   ├── uploads/                   # Profile photo uploads
│   ├── server.js                  # Express app entry point
│   ├── .env                       # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx         # Role-aware navigation sidebar
    │   │   ├── ProtectedRoute.jsx  # Route guard by role
    │   │   ├── DashboardLayout.jsx # Shared dashboard wrapper
    │   │   └── DarkModeToggle.jsx  # Dark/light mode toggle
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state (React Context)
    │   ├── pages/
    │   │   ├── UnifiedLogin.jsx    # Login page for all roles
    │   │   ├── StudentRegister.jsx # Student registration
    │   │   ├── AdminLogin.jsx      # Admin-specific login
    │   │   ├── Student/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Projects.jsx
    │   │   │   ├── Certifications.jsx
    │   │   │   ├── Placements.jsx
    │   │   │   ├── Skills.jsx
    │   │   │   ├── Profile.jsx
    │   │   │   └── Resume.jsx
    │   │   ├── Teacher/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── StudentDetail.jsx
    │   │   │   ├── Reviews.jsx
    │   │   │   └── Reports.jsx
    │   │   └── Admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── StudentList.jsx
    │   │       ├── StudentDetail.jsx
    │   │       ├── Analytics.jsx
    │   │       ├── Departments.jsx
    │   │       └── Settings.jsx
    │   ├── services/               # Axios API service layer
    │   ├── App.jsx                 # Root router
    │   └── main.jsx                # React entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 👥 User Roles

| Role    | Login Route       | Dashboard Route   |
|---------|-------------------|-------------------|
| Student | `/login`          | `/student`        |
| Teacher | `/login`          | `/teacher`        |
| Admin   | `/admin/login`    | `/admin/students` |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A **MongoDB Atlas** account (or local MongoDB)
- (Optional) Google OAuth Client ID

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/student-portfolio-system.git
cd student-portfolio-system
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables) below).

```bash
npm run dev
```

> Backend runs on **http://localhost:5005** by default.

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs on **http://localhost:5173** by default.

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5005
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=admin123

# Optional: Google OAuth
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🔌 API Routes

| Method | Endpoint                        | Access       | Description                    |
|--------|---------------------------------|--------------|--------------------------------|
| POST   | `/api/auth/register`            | Public       | Register a new student         |
| POST   | `/api/auth/login`               | Public       | Login (email/password)         |
| POST   | `/api/auth/google`              | Public       | Google OAuth login             |
| GET    | `/api/student/profile`          | Student      | Get student profile            |
| PUT    | `/api/student/profile`          | Student      | Update student profile         |
| GET    | `/api/student/projects`         | Student      | Get all projects               |
| POST   | `/api/student/projects`         | Student      | Add a new project              |
| DELETE | `/api/student/projects/:id`     | Student      | Delete a project               |
| GET    | `/api/student/certifications`   | Student      | Get all certifications         |
| POST   | `/api/student/certifications`   | Student      | Add a certification            |
| GET    | `/api/student/placements`       | Student      | Get placement records          |
| POST   | `/api/student/placements`       | Student      | Add a placement record         |
| GET    | `/api/teacher/students`         | Teacher      | List all students              |
| GET    | `/api/admin/students`           | Admin        | List all students (admin view) |
| GET    | `/api/portfolio/:id`            | Public       | View public student portfolio  |
| GET    | `/api/health`                   | Public       | Server health check            |

---

## 🔑 Default Admin Credentials

When the backend starts for the first time, a default admin account is automatically created:

| Field    | Value                   |
|----------|-------------------------|
| Email    | `admin@portfolio.com`   |
| Password | `admin123`              |

> ⚠️ **Change these credentials immediately in your `.env` file before deploying to production.**

---

## 🧪 Available Scripts

### Backend

| Command         | Description                    |
|-----------------|-------------------------------|
| `npm run dev`   | Start backend with nodemon     |
| `npm start`     | Start backend (production)     |

### Frontend

| Command          | Description                       |
|------------------|-----------------------------------|
| `npm run dev`    | Start Vite dev server             |
| `npm run build`  | Build for production              |
| `npm run preview`| Preview production build locally  |

---

## 🌙 Additional Notes

- Profile photos are stored locally in `backend/uploads/` and served as static files at `/uploads/`
- The application supports **dark mode** via the `DarkModeToggle` component
- CORS is configured to allow both `localhost:5173` and the Vercel deployment URL
- Resume/portfolio export is done client-side using `html2pdf.js` — no server processing required

---

## 📄 License

This project is built for educational purposes.  
**Developed by Irfhan Abdul Matheen** — 2026

---

> 💡 *Made with ❤️ using React, Node.js, and MongoDB*
