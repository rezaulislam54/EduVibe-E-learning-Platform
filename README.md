# 🎓 EduVibe — Full-Stack MERN E-Learning Platform

> A production-grade, full-featured **Online Course Marketplace & Interactive Learning Platform** built with **React (Vite), Tailwind CSS, Node.js, Express.js, MongoDB (Mongoose), Stripe, and Socket.io**.

---

## 🌟 Key Highlights & Feature Matrix

### 1. 🔐 Authentication & Role-Based Access Control (RBAC)
- **JWT Authentication** with password encryption via `bcryptjs`.
- Distinct roles: `student`, `instructor`, and `admin`.
- **1-Click Demo Logins** directly on the Login page for seamless portfolio review.

### 2. 📚 Course Catalog, Discovery & CRUD
- Multi-faceted **search, category filters, difficulty levels, pricing filters, and dynamic sorting**.
- Rich course landing page with **video trailers**, curriculum overview, instructor bio, prerequisites, and student reviews.
- Multi-step **Course Creator Wizard** for instructors to author and manage sections and lectures.

### 3. 🎥 Immersive Interactive Learning Room
- Custom responsive **HTML5 Video Player** with playback speed control (0.75x–2x), seek scrubbers, and auto-completion tracking.
- Interactive **Curriculum Playlist Sidebar** displaying live lecture progress checkmarks.
- **Lesson Notes Notebook** to take and persist personal study notes during video lectures.
- **Live Q&A Forum** with real-time Socket.io bi-directional messaging and instructor answer badges.

### 4. 🏆 Cryptographic & Verifiable Certificates
- Automatic calculation of course progress (0% to 100%).
- Upon 100% completion, students unlock a **Certificate of Completion** featuring a unique verifiable ID, completion date, celebratory confetti, and **Print/Download to PDF** capability.

### 5. 💳 Stripe & Simulated Payment Gateway
- End-to-end checkout with order summaries, discounts, and transaction receipts.
- Seamless dual-mode payment gateway (Stripe Elements + Zero-friction Instant Test Mode).

### 6. 🛡️ Admin Moderation Console & Platform Analytics
- Comprehensive platform analytics (Total Revenue, Active Learners, Course Metrics).
- Moderation queue: Approve, reject, or draft instructor course submissions.
- User permission control: promote/demote user roles on the fly.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router v6, Canvas Confetti |
| **Backend** | Node.js, Express.js, Socket.io, Morgan, Multer, Stripe SDK |
| **Database** | MongoDB & Mongoose (with MongoDB Atlas support and embedded zero-config fallback) |
| **Authentication** | JSON Web Tokens (JWT) & bcryptjs |
| **Real-time** | Socket.io WebSockets |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Install All Dependencies
```bash
# From the project root
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` in the `server` directory:
```bash
# In server/.env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/eduvibe_elearning
JWT_SECRET=eduvibe_super_secret_jwt_key_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```
*(Note: If local MongoDB is not running, the backend will automatically spin up an embedded in-memory database so the app runs out of the box!)*

### 3. Seed Demo Data (Optional / Automated)
Populate realistic courses, instructors, student enrollments, and reviews:
```bash
npm run seed
```

### 4. Run Both Client & Server
```bash
npm run dev
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| 🎓 **Student** | `student@eduvibe.com` | `password123` |
| 👨‍🏫 **Instructor** | `sarah.instructor@eduvibe.com` | `password123` |
| 🛡️ **Administrator** | `admin@eduvibe.com` | `password123` |

*(You can also use the 1-Click Demo Buttons on the `/login` page)*

---

## 📡 API Endpoints Reference

### Auth Routes (`/api/auth`)
- `POST /register` — Create new user account
- `POST /login` — Authenticate and receive JWT token
- `POST /demo-login` — 1-click test login by role
- `GET /me` — Get current profile
- `PUT /profile` — Update user bio, headline, links
- `PUT /change-password` — Change account password

### Course Routes (`/api/courses`)
- `GET /` — Search, filter, and paginate courses
- `GET /featured` — Top rated courses
- `GET /:id` — Detailed course info & curriculum
- `POST /` — Create course (Instructor/Admin)
- `PUT /:id` — Update course (Instructor/Admin)
- `DELETE /:id` — Delete course (Instructor/Admin)
- `GET /instructor/my-courses` — Instructor analytics & course list

### Enrollment & Learning Routes (`/api/enrollments`)
- `POST /` — Direct / Free enrollment
- `GET /my-learning` — Student's enrolled courses with progress
- `GET /course/:courseId` — Learning room data & player access
- `PUT /course/:courseId/lesson/:lessonId` — Mark lecture complete/incomplete
- `POST /course/:courseId/notes` — Save personal study note
- `GET /certificate/:certificateId` — Verify public certificate

### Payment Routes (`/api/payments`)
- `POST /create-intent` — Prepare payment intent
- `POST /verify` — Verify payment & complete enrollment
- `GET /orders` — Purchase invoice history

### Real-Time Discussions (`/api/discussions`)
- `GET /course/:courseId/lesson/:lessonId` — Retrieve lesson questions
- `POST /course/:courseId/lesson/:lessonId` — Post new question (Socket broadcast)
- `POST /:discussionId/reply` — Answer question thread
- `PUT /:discussionId/upvote` — Upvote question

### Admin Routes (`/api/admin`)
- `GET /stats` — Global platform metrics
- `GET /courses` — All courses across instructors
- `PUT /courses/:id/status` — Approve/Reject course status
- `GET /users` — User accounts table
- `PUT /users/:id/role` — Update user permissions

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
